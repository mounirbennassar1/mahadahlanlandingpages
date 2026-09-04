import type { LeadStatus, Prisma } from "@prisma/client";
import { STATUS_ORDER } from "@/lib/status";

/**
 * One place that turns `searchParams` into a Prisma filter, shared by
 * /dashboard/leads, the per-page leads tab and the CSV export so all three
 * always agree on what "the current filter" means.
 */

export const PAGE_SIZE = 20;

export type LeadSearch = {
  source: string | null;
  status: LeadStatus | null;
  q: string;
  from: string | null;
  to: string | null;
  assignee: string | null;
  page: number;
};

export type RawSearch = Record<string, string | string[] | undefined>;

function one(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parseStatus(value: string | undefined): LeadStatus | null {
  if (!value) return null;
  return STATUS_ORDER.includes(value as LeadStatus) ? (value as LeadStatus) : null;
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function parseLeadSearch(params: RawSearch): LeadSearch {
  const source = one(params.source);
  const from = one(params.from);
  const to = one(params.to);
  const assignee = one(params.assignee);
  return {
    source: source && source !== "all" ? source : null,
    status: parseStatus(one(params.status)),
    q: (one(params.q) ?? "").trim(),
    from: from && DATE_RE.test(from) ? from : null,
    to: to && DATE_RE.test(to) ? to : null,
    assignee: assignee ? assignee : null,
    page: Math.max(1, Number.parseInt(one(params.page) ?? "1", 10) || 1),
  };
}

/** Local-day bounds so "from 2026-09-01" includes everything submitted that day. */
function dayStart(value: string) {
  const d = new Date(`${value}T00:00:00`);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

function dayEnd(value: string) {
  const d = new Date(`${value}T23:59:59.999`);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export function buildLeadWhere(
  search: LeadSearch,
  opts: { sourceId?: string } = {},
): Prisma.LeadWhereInput {
  const where: Prisma.LeadWhereInput = {};

  if (opts.sourceId) where.sourceId = opts.sourceId;
  else if (search.source) where.source = { slug: search.source };

  if (search.status) where.status = search.status;

  if (search.assignee) {
    where.assigneeId = search.assignee === "none" ? null : search.assignee;
  }

  const gte = search.from ? dayStart(search.from) : undefined;
  const lte = search.to ? dayEnd(search.to) : undefined;
  if (gte || lte) where.submittedAt = { ...(gte ? { gte } : {}), ...(lte ? { lte } : {}) };

  if (search.q) {
    where.OR = [
      { fullName: { contains: search.q, mode: "insensitive" } },
      { phone: { contains: search.q } },
      { city: { contains: search.q, mode: "insensitive" } },
      { email: { contains: search.q, mode: "insensitive" } },
    ];
  }

  return where;
}

export const leadInclude = {
  source: true,
  assignee: true,
  offer: { select: { title: true } },
} satisfies Prisma.LeadInclude;

/** Query string for links that must keep the active filter (pagination, export). */
export function searchToParams(search: LeadSearch, extra: Record<string, string> = {}) {
  const params = new URLSearchParams();
  if (search.source) params.set("source", search.source);
  if (search.status) params.set("status", search.status);
  if (search.q) params.set("q", search.q);
  if (search.from) params.set("from", search.from);
  if (search.to) params.set("to", search.to);
  if (search.assignee) params.set("assignee", search.assignee);
  for (const [k, v] of Object.entries(extra)) params.set(k, v);
  return params;
}
