import "server-only";
import { createHmac, createPublicKey, timingSafeEqual } from "node:crypto";
import type { OrderStatus } from "@prisma/client";

/**
 * Thin client for noon payments (https://docs.noonpayments.com).
 *
 * Only the hosted-checkout flow is used: the site creates an order with
 * `apiOperation: "INITIATE"`, sends the customer to `checkoutData.postUrl`,
 * and afterwards reads the order back with GET /order/{id} to learn whether it
 * was paid. Card data never touches this server, so the merchant public key
 * shown in the noon dashboard (RSA modulus + exponent 65537) is not needed
 * here; it only matters for merchants that encrypt card numbers themselves.
 *
 * Credentials come from the environment (see .env.example):
 *   NOON_BUSINESS_ID   business identifier
 *   NOON_APP_ID        application identifier
 *   NOON_APP_KEY       application key (secret)
 *   NOON_ENV           "test" (default) or "live"
 *   NOON_REGION        "sa" (default, Saudi Arabia), "eg" (Egypt) or "global"
 *                      (UAE and others). noon runs a separate platform per
 *                      region and a merchant only exists on its own: calling
 *                      the wrong one answers "Organization ... does not exists"
 *   NOON_WEBHOOK_SECRET optional; when set, webhook signatures are verified
 *   NOON_ORDER_CATEGORY optional; the order category configured in noon,
 *                       defaults to "pay"
 *   NOON_PUBLIC_KEY     optional; the merchant RSA public key (PEM). Stored for
 *                       completeness and shown in /dashboard/settings; nothing
 *                       in the hosted-checkout flow reads it
 */

export type NoonEnv = "test" | "live";
export type NoonRegion = "sa" | "eg" | "global";

export type NoonConfig = {
  configured: boolean;
  env: NoonEnv;
  region: NoonRegion;
  baseUrl: string;
  businessId: string;
  appId: string;
  appKey: string;
  webhookSecret: string;
  category: string;
  /** Merchant RSA public key (PEM), or "" when not set. */
  publicKeyPem: string;
};

/** Host infix per region: api-test.sa.noonpayments.com, api.eg.noonpayments.com, ... */
const REGION_INFIX: Record<NoonRegion, string> = { sa: ".sa", eg: ".eg", global: "" };

function baseUrlFor(env: NoonEnv, region: NoonRegion) {
  return `https://${env === "live" ? "api" : "api-test"}${REGION_INFIX[region]}.noonpayments.com/payment/v1/`;
}

function parseRegion(value: string | undefined): NoonRegion {
  const v = (value ?? "").trim().toLowerCase();
  if (v === "eg" || v === "egypt") return "eg";
  if (v === "global" || v === "ae" || v === "uae") return "global";
  return "sa";
}

const REQUEST_TIMEOUT_MS = 20_000;

export function getNoonConfig(): NoonConfig {
  const env: NoonEnv = (process.env.NOON_ENV ?? "test").toLowerCase() === "live" ? "live" : "test";
  const businessId = (process.env.NOON_BUSINESS_ID ?? "").trim();
  const appId = (process.env.NOON_APP_ID ?? "").trim();
  const appKey = (process.env.NOON_APP_KEY ?? "").trim();
  const region = parseRegion(process.env.NOON_REGION);
  return {
    configured: Boolean(businessId && appId && appKey),
    env,
    region,
    baseUrl: baseUrlFor(env, region),
    businessId,
    appId,
    appKey,
    webhookSecret: (process.env.NOON_WEBHOOK_SECRET ?? "").trim(),
    category: (process.env.NOON_ORDER_CATEGORY ?? "pay").trim() || "pay",
    // Env files keep the PEM on one line with literal "\n" separators.
    publicKeyPem: (process.env.NOON_PUBLIC_KEY ?? "").replace(/\\n/g, "\n").trim(),
  };
}

export type NoonPublicKeyInfo =
  | { present: false }
  | { present: true; valid: true; bits: number; exponent: number }
  | { present: true; valid: false; error: string };

/** Parses the stored merchant public key so the dashboard can show its status. */
export function getNoonPublicKeyInfo(): NoonPublicKeyInfo {
  const pem = getNoonConfig().publicKeyPem;
  if (!pem) return { present: false };
  try {
    const key = createPublicKey(pem);
    const details = key.asymmetricKeyDetails;
    return {
      present: true,
      valid: true,
      bits: details?.modulusLength ?? 0,
      exponent: Number(details?.publicExponent ?? 0),
    };
  } catch (err) {
    return { present: true, valid: false, error: err instanceof Error ? err.message : "Could not parse the key" };
  }
}

export class NoonError extends Error {
  code: string;
  status?: number;
  constructor(message: string, code: string, status?: number) {
    super(message);
    this.name = "NoonError";
    this.code = code;
    this.status = status;
  }
}

/**
 * `Authorization: Key <base64(business.app:key)>`, the scheme in noon's current
 * docs for both environments (the environment is chosen by the host). The older
 * `Key_Test` / `Key_Live` prefixes are still accepted by the sandbox, but `Key`
 * is the documented one.
 */
function authHeader(config: NoonConfig) {
  const token = Buffer.from(`${config.businessId}.${config.appId}:${config.appKey}`).toString("base64");
  return `Key ${token}`;
}

/**
 * noon order ids are 16-digit integers (e.g. 9682373589567909), larger than
 * Number.MAX_SAFE_INTEGER, so a plain JSON.parse rounds them and every later
 * lookup answers "Order does not exist". Quote long integer ids before parsing
 * so they survive as strings. Used for API responses and webhook payloads.
 */
export function parseNoonJson<T = unknown>(text: string): T {
  const safe = text.replace(/("[A-Za-z]*[Ii]d"\s*:\s*)(\d{15,})(?=\s*[,}\]])/g, '$1"$2"');
  return JSON.parse(safe) as T;
}

type NoonEnvelope<T> = {
  resultCode?: number;
  message?: string;
  resultClass?: number;
  classDescription?: string;
  actionHint?: string;
  requestReference?: string;
  result?: T;
};

async function noonRequest<T>(path: string, init: { method: "GET" | "POST"; body?: unknown }): Promise<NoonEnvelope<T>> {
  const config = getNoonConfig();
  if (!config.configured) {
    throw new NoonError("noon payments is not configured on this server.", "NOT_CONFIGURED");
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch(`${config.baseUrl}${path}`, {
      method: init.method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: authHeader(config),
      },
      body: init.body === undefined ? undefined : JSON.stringify(init.body),
      signal: controller.signal,
      cache: "no-store",
    });
  } catch (err) {
    const aborted = err instanceof Error && err.name === "AbortError";
    throw new NoonError(aborted ? "noon did not answer in time." : "Could not reach noon.", aborted ? "TIMEOUT" : "NETWORK");
  } finally {
    clearTimeout(timer);
  }

  let json: NoonEnvelope<T>;
  try {
    json = parseNoonJson<NoonEnvelope<T>>(await res.text());
  } catch {
    throw new NoonError(`noon returned a non-JSON response (HTTP ${res.status}).`, "BAD_RESPONSE", res.status);
  }

  if (!res.ok || (json.resultCode !== undefined && json.resultCode !== 0)) {
    const message = json.message?.trim() || `noon request failed (HTTP ${res.status}).`;
    throw new NoonError(message, `RESULT_${json.resultCode ?? res.status}`, res.status);
  }
  return json;
}

/* ───────────────────────── initiate ───────────────────────── */

export type InitiateInput = {
  /** Whole riyals; noon takes a major-unit decimal string. */
  amount: number;
  currency?: string;
  /** Shown on the hosted page; keep it short. */
  name: string;
  /** Merchant reference, must be unique per order. */
  reference: string;
  returnUrl: string;
  locale?: "ar" | "en";
  customer?: { firstName?: string; lastName?: string; email?: string; phone?: string };
};

export type InitiateResult = {
  noonOrderId: string;
  status: string;
  checkoutUrl: string;
  raw: unknown;
};

type InitiateResponse = {
  order?: { id?: number | string; status?: string; reference?: string; errorCode?: number; errorMessage?: string };
  checkoutData?: { postUrl?: string; jsUrl?: string };
};

export async function initiateOrder(input: InitiateInput): Promise<InitiateResult> {
  const config = getNoonConfig();
  const body = {
    apiOperation: "INITIATE",
    order: {
      amount: input.amount.toFixed(2),
      currency: input.currency ?? "SAR",
      name: input.name.slice(0, 50),
      reference: input.reference,
      category: config.category,
      channel: "web",
    },
    configuration: {
      tokenizeCc: "false",
      returnUrl: input.returnUrl,
      locale: input.locale ?? "ar",
      paymentAction: "SALE",
    },
    ...(input.customer ? { billing: { contact: compactContact(input.customer) } } : {}),
  };

  const json = await noonRequest<InitiateResponse>("order", { method: "POST", body });
  const order = json.result?.order;
  const postUrl = json.result?.checkoutData?.postUrl;
  if (!order?.id || !postUrl) {
    throw new NoonError(order?.errorMessage || "noon did not return a checkout URL.", "NO_CHECKOUT_URL");
  }
  return {
    noonOrderId: String(order.id),
    status: String(order.status ?? "INITIATED"),
    checkoutUrl: postUrl,
    raw: json,
  };
}

function compactContact(c: NonNullable<InitiateInput["customer"]>) {
  const out: Record<string, string> = {};
  if (c.firstName) out.firstName = c.firstName.slice(0, 50);
  if (c.lastName) out.lastName = c.lastName.slice(0, 50);
  if (c.email) out.email = c.email.slice(0, 100);
  if (c.phone) out.phone = c.phone.slice(0, 20);
  return out;
}

/* ───────────────────────── get order ───────────────────────── */

export type NoonTransaction = {
  id?: string;
  type?: string;
  status?: string;
  amount?: string | number;
  currency?: string;
  creationTime?: string;
  authorizationCode?: string;
};

export type NoonOrderSnapshot = {
  noonOrderId: string;
  /** Raw noon status, upper-cased (CAPTURED, FAILED, ...). */
  status: string;
  reference: string | null;
  amount: number | null;
  totalCapturedAmount: number | null;
  totalRefundedAmount: number | null;
  errorMessage: string | null;
  /** MADA, VISA, MASTERCARD, APPLE_PAY, ... when noon reports it. */
  paymentBrand: string | null;
  transactions: NoonTransaction[];
  raw: unknown;
};

type GetOrderResponse = {
  order?: {
    id?: number | string;
    status?: string;
    reference?: string;
    amount?: string | number;
    totalCapturedAmount?: string | number;
    totalRefundedAmount?: string | number;
    errorCode?: number;
    errorMessage?: string;
  };
  paymentDetails?: { scheme?: string; instrument?: string; mode?: string; brand?: string };
  transactions?: NoonTransaction[];
};

function num(value: string | number | undefined | null): number | null {
  if (value === undefined || value === null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export async function getOrder(noonOrderId: string): Promise<NoonOrderSnapshot> {
  const json = await noonRequest<GetOrderResponse>(`order/${encodeURIComponent(noonOrderId)}`, { method: "GET" });
  return toSnapshot(json, noonOrderId);
}

/** Same read, keyed by our own merchant reference (e.g. "MD-K7Q2-9X4M"). */
export async function getOrderByReference(reference: string): Promise<NoonOrderSnapshot> {
  const json = await noonRequest<GetOrderResponse>(`order/getbyreference/${encodeURIComponent(reference)}`, { method: "GET" });
  return toSnapshot(json, "");
}

function toSnapshot(json: NoonEnvelope<GetOrderResponse>, noonOrderId: string): NoonOrderSnapshot {
  const order = json.result?.order;
  if (!order) throw new NoonError("noon returned no order.", "NO_ORDER");
  const details = json.result?.paymentDetails;
  const brand = details?.scheme || details?.brand || details?.mode || null;
  return {
    noonOrderId: String(order.id ?? noonOrderId),
    status: String(order.status ?? "").toUpperCase(),
    reference: order.reference ?? null,
    amount: num(order.amount),
    totalCapturedAmount: num(order.totalCapturedAmount),
    totalRefundedAmount: num(order.totalRefundedAmount),
    errorMessage: order.errorMessage?.trim() || null,
    paymentBrand: brand ? String(brand).toUpperCase() : null,
    transactions: json.result?.transactions ?? [],
    raw: json,
  };
}

/* ───────────────────────── refund ───────────────────────── */

export async function refundOrder(noonOrderId: string, amount: number, currency = "SAR", reference?: string) {
  const json = await noonRequest<GetOrderResponse>("order", {
    method: "POST",
    body: {
      apiOperation: "REFUND",
      order: { id: noonOrderId },
      transaction: {
        amount: amount.toFixed(2),
        currency,
        ...(reference ? { transactionReference: reference } : {}),
      },
    },
  });
  return { status: String(json.result?.order?.status ?? "").toUpperCase(), raw: json };
}

/* ───────────────────────── status mapping ───────────────────────── */

/**
 * noon statuses to the site's coarse order status. Unknown or transient
 * statuses (3DS steps, PENDING, LOCKED, ...) keep the order PENDING; noon
 * settles them to one of the final statuses shortly after.
 */
export function mapNoonStatus(noonStatus: string): OrderStatus {
  switch (noonStatus.toUpperCase()) {
    case "CAPTURED":
    case "PARTIALLY_CAPTURED":
      return "PAID";
    case "PARTIALLY_REFUNDED":
      return "PAID";
    case "REFUNDED":
      return "REFUNDED";
    case "FAILED":
    case "REJECTED":
      return "FAILED";
    case "CANCELLED":
    case "REVERSED":
    case "PARTIALLY_REVERSED":
      return "CANCELLED";
    case "EXPIRED":
      return "EXPIRED";
    default:
      return "PENDING";
  }
}

export const FINAL_ORDER_STATUSES: OrderStatus[] = ["PAID", "FAILED", "CANCELLED", "EXPIRED", "REFUNDED"];

/* ───────────────────────── webhooks ───────────────────────── */

export type NoonWebhookPayload = {
  orderId?: number | string;
  orderStatus?: string;
  eventId?: string;
  eventType?: string;
  timeStamp?: string;
  merchantOrderReference?: string;
  signature?: string;
};

/**
 * noon signs webhooks with HMAC-SHA512 over
 * `orderId,orderStatus,eventId,eventType,timeStamp`, base64 encoded. Some
 * accounts append the merchant reference, so both forms are accepted.
 * Returns "skipped" when no secret is configured; callers must then treat the
 * payload as a hint only and re-read the order from noon's API.
 */
export function verifyWebhookSignature(payload: NoonWebhookPayload, secret = getNoonConfig().webhookSecret): "valid" | "invalid" | "skipped" {
  if (!secret) return "skipped";
  const signature = payload.signature ?? "";
  if (!signature) return "invalid";

  const base = [payload.orderId, payload.orderStatus, payload.eventId, payload.eventType, payload.timeStamp].map((v) => String(v ?? ""));
  const candidates = [base.join(","), [...base, String(payload.merchantOrderReference ?? "")].join(",")];

  let given: Buffer;
  try {
    given = Buffer.from(signature, "base64");
  } catch {
    return "invalid";
  }
  for (const message of candidates) {
    const expected = createHmac("sha512", secret).update(message).digest();
    if (expected.length === given.length && timingSafeEqual(expected, given)) return "valid";
  }
  return "invalid";
}
