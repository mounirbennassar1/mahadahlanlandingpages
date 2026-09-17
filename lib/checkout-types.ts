/**
 * Client-safe shapes shared by the checkout UI, the public checkout API and
 * the server helpers in lib/orders.ts. No Prisma imports here.
 */

export type SellableKind = "package" | "offer";

/** A package or offer the visitor can pay for, with prices pre-formatted. */
export type SellableItem = {
  kind: SellableKind;
  id: string;
  slug: string;
  title: string;
  description: string | null;
  /** Whole Saudi riyals. */
  price: number;
  priceLabel: string;
  oldPriceLabel: string | null;
  savePercent: number | null;
  badge: string | null;
  features: string[];
  image: string | null;
};

/** What the checkout form posts to POST /api/checkout. */
export type CheckoutRequest = {
  item: { kind: SellableKind; id: string };
  fullName: string;
  /** E.164, e.g. +9665xxxxxxxx. */
  phone: string;
  city: string;
  email?: string;
  /** Registry slug of the page the visitor is on (lib/pages/registry.ts). */
  pageSlug?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
};

export type CheckoutResponse =
  | { ok: true; url: string; reference: string }
  | { ok: false; error: string; code: "VALIDATION" | "ITEM_UNAVAILABLE" | "NOT_CONFIGURED" | "GATEWAY" | "SERVER" };

/** Public status of one order, for the return page's polling. */
export type CheckoutStatus = {
  reference: string;
  status: "PENDING" | "PAID" | "FAILED" | "CANCELLED" | "EXPIRED" | "REFUNDED";
  amount: number;
  itemTitle: string;
};

/** Who the checkout is for: the page the visitor is on. */
export type CheckoutPage = {
  slug: string;
  title: string;
  path: string;
};
