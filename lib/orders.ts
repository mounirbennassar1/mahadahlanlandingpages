import "server-only";
import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import type { Order, OrderEventType, OrderStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { formatSar } from "@/lib/content";
import { ensureSource } from "@/lib/sources";
import { SITE_URL } from "@/lib/site";
import { getPageDef } from "@/lib/pages/registry";
import {
  FINAL_ORDER_STATUSES,
  NoonError,
  getNoonConfig,
  getOrder as noonGetOrder,
  getOrderByReference as noonGetOrderByReference,
  initiateOrder,
  mapNoonStatus,
  refundOrder as noonRefund,
} from "@/lib/noon";
import type { CheckoutRequest, SellableItem } from "@/lib/checkout-types";

/**
 * Orders: what is sold (packages per landing, offers on /offers), how a
 * checkout is opened, and how an order's status is kept in step with noon.
 *
 * Every write that changes an order's status also updates the CRM lead that
 * was opened for the customer, so the sales team sees payments on the usual
 * leads screens as well.
 */

/* ───────────────────────── what can be bought ───────────────────────── */

function windowWhere(now: Date) {
  return {
    AND: [
      { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
      { OR: [{ endsAt: null }, { endsAt: { gte: now } }] },
    ],
  };
}

function savePercent(price: number, oldPrice: number | null) {
  return oldPrice && oldPrice > price ? Math.round((1 - price / oldPrice) * 100) : null;
}

type PackageRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  price: number;
  oldPrice: number | null;
  badge: string | null;
  features: string[];
  image: string | null;
};

type OfferRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  price: number;
  oldPrice: number | null;
  badge: string | null;
  image: string | null;
};

export function packageToItem(p: PackageRow): SellableItem {
  return {
    kind: "package",
    id: p.id,
    slug: p.slug,
    title: p.title,
    description: p.description,
    price: p.price,
    priceLabel: formatSar(p.price),
    oldPriceLabel: p.oldPrice ? formatSar(p.oldPrice) : null,
    savePercent: savePercent(p.price, p.oldPrice),
    badge: p.badge,
    features: p.features,
    image: p.image,
  };
}

export function offerToItem(o: OfferRow): SellableItem {
  return {
    kind: "offer",
    id: o.id,
    slug: o.slug,
    title: o.title,
    description: o.description,
    price: o.price,
    priceLabel: formatSar(o.price),
    oldPriceLabel: o.oldPrice ? formatSar(o.oldPrice) : null,
    savePercent: savePercent(o.price, o.oldPrice),
    badge: o.badge,
    features: [],
    image: o.image,
  };
}

/**
 * Packages a page sells: its own first, then the ones offered on every page
 * (`pageSlug = null`). Inactive and out-of-window packages are skipped.
 */
export async function getSellableItems(pageSlug: string): Promise<SellableItem[]> {
  const now = new Date();
  const rows = await prisma.package.findMany({
    where: { active: true, OR: [{ pageSlug }, { pageSlug: null }], ...windowWhere(now) },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
  const own = rows.filter((r) => r.pageSlug === pageSlug);
  const global = rows.filter((r) => r.pageSlug === null);
  return [...own, ...global].map(packageToItem);
}

/** Server-side price lookup for a checkout; null when the item cannot be sold. */
async function resolveItem(kind: "package" | "offer", id: string) {
  const now = new Date();
  if (kind === "package") {
    const p = await prisma.package.findFirst({ where: { id, active: true, ...windowWhere(now) } });
    return p ? { item: packageToItem(p), packageId: p.id, offerId: null } : null;
  }
  const o = await prisma.offer.findFirst({ where: { id, active: true, ...windowWhere(now) } });
  return o ? { item: offerToItem(o), packageId: null, offerId: o.id } : null;
}

/* ───────────────────────── references + events ───────────────────────── */

const REF_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/** "MD-K7Q2-9X4M": short, unambiguous, safe to read out on the phone. */
export function newOrderReference() {
  const bytes = randomBytes(8);
  let out = "";
  for (let i = 0; i < 8; i++) {
    out += REF_ALPHABET[bytes[i] % REF_ALPHABET.length];
    if (i === 3) out += "-";
  }
  return `MD-${out}`;
}

export async function addOrderEvent(
  orderId: string,
  type: OrderEventType,
  body?: string | null,
  meta?: Prisma.InputJsonValue,
  userId?: string | null,
) {
  return prisma.orderEvent.create({
    data: { orderId, type, body: body ?? null, meta, userId: userId ?? null },
  });
}

function revalidateOrderViews(order: { id: string; pageSlug: string | null; leadId: string | null }) {
  revalidatePath("/dashboard/orders");
  revalidatePath(`/dashboard/orders/${order.id}`);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/pages");
  if (order.pageSlug) revalidatePath(`/dashboard/pages/${order.pageSlug}/orders`);
  if (order.leadId) revalidatePath(`/dashboard/leads/${order.leadId}`);
}

/* ───────────────────────── checkout ───────────────────────── */

export class CheckoutError extends Error {
  code: "ITEM_UNAVAILABLE" | "NOT_CONFIGURED" | "GATEWAY";
  constructor(code: CheckoutError["code"], message: string) {
    super(message);
    this.name = "CheckoutError";
    this.code = code;
  }
}

const AR = {
  unavailable: "هذا العرض لم يعد متاحاً للدفع الإلكتروني. تواصلي معنا عبر واتساب وسنساعدك.",
  notConfigured: "الدفع الإلكتروني غير متاح حالياً. يمكنك الحجز عبر واتساب وسنؤكد لك الموعد.",
  gateway: "تعذّر فتح صفحة الدفع الآن. حاولي مرة أخرى بعد قليل أو تواصلي معنا عبر واتساب.",
};

/**
 * Opens a checkout: records the customer as a lead, creates the order with a
 * fresh reference, asks noon for a hosted checkout URL and returns it.
 *
 * The order stays PENDING until the return page or a webhook reads the final
 * status back from noon. A failure to reach noon marks the order FAILED with
 * the reason, so abandoned attempts are visible in the dashboard too.
 */
export async function createCheckout(
  input: CheckoutRequest,
  opts: { origin?: string | null } = {},
): Promise<{ url: string; reference: string; orderId: string }> {
  const resolved = await resolveItem(input.item.kind, input.item.id);
  if (!resolved) throw new CheckoutError("ITEM_UNAVAILABLE", AR.unavailable);
  const { item, packageId, offerId } = resolved;

  const config = getNoonConfig();
  const pageDef = input.pageSlug ? getPageDef(input.pageSlug) : undefined;
  const pageSlug = pageDef?.slug ?? null;

  // The lead source is the page's own source when it has one (so the order
  // shows up on that page's Leads tab); pages without a form use their own
  // slug, and a checkout with no page at all falls into a shared bucket.
  const sourceSlug = pageDef ? (pageDef.leadSource ?? pageDef.slug) : "checkout";
  const source = await ensureSource(sourceSlug);

  const utm = {
    utmSource: input.utmSource || null,
    utmMedium: input.utmMedium || null,
    utmCampaign: input.utmCampaign || null,
    utmContent: input.utmContent || null,
    utmTerm: input.utmTerm || null,
  };

  const reference = newOrderReference();

  const lead = source
    ? await prisma.lead.create({
        data: {
          fullName: input.fullName,
          phone: input.phone,
          city: input.city,
          email: input.email || null,
          sourceId: source.id,
          service: item.title,
          paymentMethod: "CARD",
          offerId,
          data: { orderReference: reference, checkout: item.kind },
          ...utm,
        },
        select: { id: true },
      })
    : null;

  if (lead) {
    await prisma.leadActivity.create({
      data: { leadId: lead.id, type: "CREATED", meta: { via: "checkout", reference } },
    });
  }

  const order = await prisma.order.create({
    data: {
      reference,
      amount: item.price,
      currency: "SAR",
      itemType: item.kind === "package" ? "PACKAGE" : "OFFER",
      itemTitle: item.title,
      packageId,
      offerId,
      fullName: input.fullName,
      phone: input.phone,
      city: input.city,
      email: input.email || null,
      pageSlug,
      leadId: lead?.id ?? null,
      ...utm,
    },
  });
  await addOrderEvent(order.id, "CREATED", null, { page: pageSlug, item: item.kind, itemId: item.id });

  if (!config.configured) {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "FAILED", failureReason: "noon payments is not configured (missing NOON_* environment variables)." },
    });
    await addOrderEvent(order.id, "STATUS", "Checkout could not start: noon is not configured.", { to: "FAILED" });
    throw new CheckoutError("NOT_CONFIGURED", AR.notConfigured);
  }

  const [firstName, ...rest] = input.fullName.trim().split(/\s+/);
  try {
    const initiated = await initiateOrder({
      amount: item.price,
      currency: "SAR",
      name: item.title,
      reference,
      returnUrl: `${returnBase(opts.origin)}/checkout/${reference}`,
      locale: "ar",
      customer: {
        firstName,
        lastName: rest.join(" ") || undefined,
        email: input.email || undefined,
        phone: input.phone,
      },
    });
    await prisma.order.update({
      where: { id: order.id },
      data: { noonOrderId: initiated.noonOrderId, noonStatus: initiated.status, checkoutUrl: initiated.checkoutUrl },
    });
    await addOrderEvent(order.id, "CHECKOUT", "Customer sent to noon's hosted checkout.", {
      noonOrderId: initiated.noonOrderId,
      noonStatus: initiated.status,
      env: config.env,
    });
    revalidateOrderViews({ id: order.id, pageSlug, leadId: lead?.id ?? null });
    return { url: initiated.checkoutUrl, reference, orderId: order.id };
  } catch (err) {
    const reason = err instanceof NoonError ? `${err.code}: ${err.message}` : err instanceof Error ? err.message : "Unknown error";
    console.error("[checkout] noon INITIATE failed", reason);
    await prisma.order.update({ where: { id: order.id }, data: { status: "FAILED", failureReason: reason } });
    await addOrderEvent(order.id, "STATUS", `Checkout could not start: ${reason}`, { to: "FAILED" });
    revalidateOrderViews({ id: order.id, pageSlug, leadId: lead?.id ?? null });
    throw new CheckoutError("GATEWAY", AR.gateway);
  }
}

/** Production always returns to the canonical host; local dev returns to itself. */
function returnBase(origin?: string | null) {
  if (origin && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return origin;
  return SITE_URL;
}

/* ───────────────────────── status sync ───────────────────────── */

export type SyncVia = "return" | "webhook" | "manual";

export type SyncResult = {
  order: Order;
  changed: boolean;
  noonStatus: string | null;
  error: string | null;
};

const LEAD_NOTE: Record<OrderStatus, string | null> = {
  PENDING: null,
  PAID: "Paid online via noon",
  FAILED: "Online payment failed",
  CANCELLED: "Online payment cancelled",
  EXPIRED: "Online payment expired",
  REFUNDED: "Online payment refunded",
};

/**
 * Reads the order from noon and applies the result. Safe to call any number of
 * times from any trigger: nothing changes when the status is the same, and a
 * final status is never downgraded by a later stale read.
 */
export async function syncOrderWithNoon(
  orderId: string,
  opts: { via: SyncVia; userId?: string | null; hint?: Prisma.InputJsonValue },
): Promise<SyncResult> {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new Error("Order not found");
  if (!order.noonOrderId) {
    return { order, changed: false, noonStatus: null, error: "This order never reached noon." };
  }

  let snapshot;
  try {
    try {
      snapshot = await noonGetOrder(order.noonOrderId);
    } catch (err) {
      // "Order does not exist" for an id we were given means the stored id is
      // off (ids are 16 digits and easy to mangle); our reference is exact.
      if (!(err instanceof NoonError) || err.code !== "RESULT_19001") throw err;
      snapshot = await noonGetOrderByReference(order.reference);
      if (snapshot.noonOrderId && snapshot.noonOrderId !== order.noonOrderId) {
        await prisma.order.update({ where: { id: order.id }, data: { noonOrderId: snapshot.noonOrderId } });
      }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    await addOrderEvent(order.id, eventTypeFor(opts.via), `Could not read the order from noon: ${message}`, { error: message, ...(opts.hint ? { hint: opts.hint } : {}) }, opts.userId);
    return { order, changed: false, noonStatus: null, error: message };
  }

  const mapped = mapNoonStatus(snapshot.status);
  const isFinal = FINAL_ORDER_STATUSES.includes(order.status);
  // A refund after a payment is the only allowed move away from a final status.
  const allowed = !isFinal || (order.status === "PAID" && mapped === "REFUNDED");
  const nextStatus: OrderStatus = allowed ? mapped : order.status;
  const refunded = snapshot.totalRefundedAmount ?? (mapped === "REFUNDED" ? order.amount : order.refundedAmount);

  const data: Prisma.OrderUpdateInput = {
    noonStatus: snapshot.status,
    ...(snapshot.paymentBrand ? { paymentBrand: snapshot.paymentBrand } : {}),
    ...(refunded !== null && refunded !== order.refundedAmount ? { refundedAmount: Math.round(refunded) } : {}),
  };
  if (nextStatus !== order.status) {
    data.status = nextStatus;
    if (nextStatus === "PAID" && !order.paidAt) data.paidAt = new Date();
    if (nextStatus === "FAILED" || nextStatus === "CANCELLED" || nextStatus === "EXPIRED") {
      data.failureReason = snapshot.errorMessage ?? `noon status ${snapshot.status}`;
    }
  }

  const updated = await prisma.order.update({ where: { id: order.id }, data });
  const changed = nextStatus !== order.status;

  await addOrderEvent(
    order.id,
    eventTypeFor(opts.via),
    changed ? `Status ${order.status} → ${nextStatus} (noon: ${snapshot.status})` : `Checked with noon: ${snapshot.status}`,
    { from: order.status, to: nextStatus, noonStatus: snapshot.status, ...(opts.hint ? { hint: opts.hint } : {}) },
    opts.userId,
  );

  if (changed && order.leadId) {
    const note = LEAD_NOTE[nextStatus];
    const leadUpdate: Prisma.LeadUpdateInput = {};
    if (nextStatus === "PAID") leadUpdate.status = "CONFIRMED";
    const current = await prisma.lead.findUnique({ where: { id: order.leadId }, select: { status: true } });
    if (current) {
      const ops: Prisma.PrismaPromise<unknown>[] = [];
      if (nextStatus === "PAID" && current.status === "INQUIRY") {
        ops.push(prisma.lead.update({ where: { id: order.leadId }, data: leadUpdate }));
        ops.push(
          prisma.leadActivity.create({
            data: { leadId: order.leadId, type: "STATUS", meta: { from: current.status, to: "CONFIRMED", via: "payment" } },
          }),
        );
      }
      if (note) {
        ops.push(
          prisma.leadActivity.create({
            data: {
              leadId: order.leadId,
              type: "PAYMENT",
              body: note,
              meta: { orderId: order.id, reference: order.reference, amount: order.amount, status: nextStatus },
            },
          }),
        );
      }
      if (ops.length) await prisma.$transaction(ops);
    }
  }

  // The return page calls this while rendering, where revalidatePath is not
  // allowed; the dashboard views are force-dynamic anyway.
  if (opts.via !== "return") revalidateOrderViews(updated);
  return { order: updated, changed, noonStatus: snapshot.status, error: null };
}

function eventTypeFor(via: SyncVia): OrderEventType {
  return via === "webhook" ? "WEBHOOK" : via === "return" ? "RETURN" : "SYNC";
}

/* ───────────────────────── refunds ───────────────────────── */

export async function refundOrderFully(orderId: string, userId: string, amount?: number) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new Error("Order not found");
  if (!order.noonOrderId) throw new Error("This order never reached noon.");
  if (order.status !== "PAID") throw new Error("Only paid orders can be refunded.");
  const value = Math.min(amount ?? order.amount - order.refundedAmount, order.amount - order.refundedAmount);
  if (value <= 0) throw new Error("Nothing left to refund.");

  const result = await noonRefund(order.noonOrderId, value, order.currency, `${order.reference}-R${Date.now().toString(36).toUpperCase()}`);
  await addOrderEvent(order.id, "REFUND", `Refund of ${value} ${order.currency} requested (noon: ${result.status || "accepted"}).`, { amount: value, noonStatus: result.status }, userId);
  return syncOrderWithNoon(order.id, { via: "manual", userId });
}
