import type { OrderStatus, Prisma } from "@prisma/client";
import { ORDER_STATUS_ORDER } from "@/lib/order-status";

/**
 * Turns `searchParams` into a Prisma filter for the orders views, shared by
 * /dashboard/orders, a page's Orders tab and the CSV export.
 */

export const PAGE_SIZE = 25;

export type OrderSearch = {
  status: OrderStatus | null;
  q: string;
  page: string | null;
  from: string | null;
  to: string | null;
  pageNo: number;
};

export type RawSearch = Record<string, string | string[] | undefined>;

function one(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function parseOrderSearch(params: RawSearch): OrderSearch {
  const status = one(params.status);
  const page = one(params.page);
  const from = one(params.from);
  const to = one(params.to);
  return {
    status: status && ORDER_STATUS_ORDER.includes(status as OrderStatus) ? (status as OrderStatus) : null,
    q: (one(params.q) ?? "").trim(),
    page: page && page !== "all" ? page : null,
    from: from && DATE_RE.test(from) ? from : null,
    to: to && DATE_RE.test(to) ? to : null,
    pageNo: Math.max(1, Number.parseInt(one(params.p) ?? "1", 10) || 1),
  };
}

function dayStart(value: string) {
  const d = new Date(`${value}T00:00:00`);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

function dayEnd(value: string) {
  const d = new Date(`${value}T23:59:59.999`);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export function buildOrderWhere(search: OrderSearch, opts: { pageSlug?: string } = {}): Prisma.OrderWhereInput {
  const where: Prisma.OrderWhereInput = {};
  if (opts.pageSlug) where.pageSlug = opts.pageSlug;
  else if (search.page) where.pageSlug = search.page === "none" ? null : search.page;
  if (search.status) where.status = search.status;

  const gte = search.from ? dayStart(search.from) : undefined;
  const lte = search.to ? dayEnd(search.to) : undefined;
  if (gte || lte) where.createdAt = { ...(gte ? { gte } : {}), ...(lte ? { lte } : {}) };

  if (search.q) {
    where.OR = [
      { reference: { contains: search.q.toUpperCase() } },
      { fullName: { contains: search.q, mode: "insensitive" } },
      { phone: { contains: search.q } },
      { itemTitle: { contains: search.q, mode: "insensitive" } },
      { noonOrderId: { contains: search.q } },
      { email: { contains: search.q, mode: "insensitive" } },
    ];
  }
  return where;
}

export const orderInclude = {
  lead: { select: { id: true, status: true } },
} satisfies Prisma.OrderInclude;

export type OrderRow = Prisma.OrderGetPayload<{ include: typeof orderInclude }>;

export function orderSearchToParams(search: OrderSearch, extra: Record<string, string> = {}) {
  const params = new URLSearchParams();
  if (search.status) params.set("status", search.status);
  if (search.q) params.set("q", search.q);
  if (search.page) params.set("page", search.page);
  if (search.from) params.set("from", search.from);
  if (search.to) params.set("to", search.to);
  for (const [k, v] of Object.entries(extra)) params.set(k, v);
  return params;
}
