import { LeadStatus, type Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type StatusCounts = Record<LeadStatus, number>;

/** Narrows every metric to one page's lead source and/or a date window. */
export type LeadScope = { sourceId?: string; from?: Date; to?: Date };

export function scopeWhere(scope: LeadScope = {}): Prisma.LeadWhereInput {
  const where: Prisma.LeadWhereInput = {};
  if (scope.sourceId) where.sourceId = scope.sourceId;
  if (scope.from || scope.to) {
    where.submittedAt = {
      ...(scope.from ? { gte: scope.from } : {}),
      ...(scope.to ? { lte: scope.to } : {}),
    };
  }
  return where;
}

/** Merges the scope with a metric's own `submittedAt` filter. */
function scoped(scope: LeadScope, extra: Prisma.LeadWhereInput = {}): Prisma.LeadWhereInput {
  const base = scopeWhere(scope);
  if (!base.submittedAt || !extra.submittedAt) return { ...base, ...extra };
  return { ...base, ...extra, AND: [{ submittedAt: base.submittedAt }, { submittedAt: extra.submittedAt }] };
}

export async function getOverviewMetrics(scope: LeadScope = {}) {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const lastWeekStart = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  const [total, newThisWeek, newLastWeek, todayCount, byStatusRows] = await Promise.all([
    prisma.lead.count({ where: scopeWhere(scope) }),
    prisma.lead.count({ where: scoped(scope, { submittedAt: { gte: weekAgo } }) }),
    prisma.lead.count({ where: scoped(scope, { submittedAt: { gte: lastWeekStart, lt: weekAgo } }) }),
    prisma.lead.count({ where: scoped(scope, { submittedAt: { gte: todayStart } }) }),
    prisma.lead.groupBy({ by: ["status"], where: scopeWhere(scope), _count: { _all: true } }),
  ]);

  const byStatus: StatusCounts = {
    INQUIRY: 0,
    CONFIRMED: 0,
    BOOKED: 0,
    CANCELLED: 0,
    NO_ANSWER: 0,
    NOT_INTERESTED: 0,
  };
  for (const row of byStatusRows) byStatus[row.status] = row._count._all;

  const converted = byStatus.CONFIRMED + byStatus.BOOKED;
  const conversionRate = total === 0 ? 0 : (converted / total) * 100;
  const totalTrend = newLastWeek === 0 ? 0 : ((newThisWeek - newLastWeek) / newLastWeek) * 100;

  return { total, newThisWeek, todayCount, byStatus, conversionRate, totalTrend };
}

export async function getLeadsOverTime(days = 30, scope: LeadScope = {}) {
  const since = new Date();
  since.setDate(since.getDate() - (days - 1));
  since.setHours(0, 0, 0, 0);

  const leads = await prisma.lead.findMany({
    where: { ...scopeWhere({ sourceId: scope.sourceId }), submittedAt: { gte: since } },
    select: { submittedAt: true, status: true },
  });

  const buckets: { date: string; submissions: number; converted: number }[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(since);
    d.setDate(d.getDate() + i);
    buckets.push({ date: d.toISOString().slice(0, 10), submissions: 0, converted: 0 });
  }
  const index = new Map(buckets.map((b, i) => [b.date, i]));

  for (const lead of leads) {
    const key = lead.submittedAt.toISOString().slice(0, 10);
    const i = index.get(key);
    if (i === undefined) continue;
    buckets[i].submissions += 1;
    if (lead.status === "BOOKED" || lead.status === "CONFIRMED") {
      buckets[i].converted += 1;
    }
  }

  return buckets;
}

export async function getLeadsByCity(limit = 6, scope: LeadScope = {}) {
  const rows = await prisma.lead.groupBy({
    by: ["city"],
    where: scopeWhere(scope),
    _count: { _all: true },
    orderBy: { _count: { city: "desc" } },
    take: limit,
  });
  return rows.map((r) => ({ city: r.city, count: r._count._all }));
}

export async function getTeamPerformance(limit = 7) {
  const users = await prisma.user.findMany({
    take: limit,
    where: { role: { in: ["AGENT", "MANAGER"] } },
    select: { id: true, name: true },
  });
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const rows = await prisma.lead.groupBy({
    by: ["assigneeId", "status"],
    where: {
      assigneeId: { in: users.map((u) => u.id) },
      submittedAt: { gte: weekAgo },
    },
    _count: { _all: true },
  });

  return users.map((u) => {
    const r = rows.filter((row) => row.assigneeId === u.id);
    return {
      id: u.id,
      name: u.name.split(" ")[0],
      booked: r.find((x) => x.status === "BOOKED")?._count._all ?? 0,
      confirmed: r.find((x) => x.status === "CONFIRMED")?._count._all ?? 0,
      inquiry: r.find((x) => x.status === "INQUIRY")?._count._all ?? 0,
    };
  });
}

/** Leads per source, newest window first. Feeds the "Leads by page" bars. */
export async function getLeadsBySource(scope: LeadScope = {}) {
  const [rows, sources] = await Promise.all([
    prisma.lead.groupBy({
      by: ["sourceId"],
      where: scopeWhere(scope),
      _count: { _all: true },
    }),
    prisma.leadSource.findMany({ select: { id: true, slug: true, label: true } }),
  ]);
  const bySlug = new Map(sources.map((s) => [s.id, s]));
  return rows
    .map((r) => ({
      slug: bySlug.get(r.sourceId)?.slug ?? "unknown",
      label: bySlug.get(r.sourceId)?.label ?? "Unknown",
      count: r._count._all,
    }))
    .sort((a, b) => b.count - a.count);
}

/** Which ad platforms a page's leads came from. */
export async function getLeadsByUtmSource(scope: LeadScope = {}, limit = 8) {
  const rows = await prisma.lead.groupBy({
    by: ["utmSource"],
    where: { ...scopeWhere(scope), utmSource: { not: null } },
    _count: { _all: true },
    orderBy: { _count: { utmSource: "desc" } },
    take: limit,
  });
  return rows.map((r) => ({ label: r.utmSource ?? "direct", count: r._count._all }));
}

/** Per-source KPI block for the /dashboard/pages index (one pass over leads). */
export async function getSourceKpis() {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const [totals, recent] = await Promise.all([
    prisma.lead.groupBy({ by: ["sourceId", "status"], _count: { _all: true } }),
    prisma.lead.groupBy({
      by: ["sourceId"],
      where: { submittedAt: { gte: weekAgo } },
      _count: { _all: true },
    }),
  ]);

  const out = new Map<string, { total: number; booked: number; week: number }>();
  for (const row of totals) {
    const entry = out.get(row.sourceId) ?? { total: 0, booked: 0, week: 0 };
    entry.total += row._count._all;
    if (row.status === "BOOKED" || row.status === "CONFIRMED") entry.booked += row._count._all;
    out.set(row.sourceId, entry);
  }
  for (const row of recent) {
    const entry = out.get(row.sourceId) ?? { total: 0, booked: 0, week: 0 };
    entry.week = row._count._all;
    out.set(row.sourceId, entry);
  }
  return out;
}
