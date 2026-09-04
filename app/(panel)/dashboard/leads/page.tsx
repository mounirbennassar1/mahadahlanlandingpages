import { prisma } from "@/lib/prisma";
import { STATUS_ORDER } from "@/lib/status";
import { PageHeader } from "@/app/(panel)/dashboard/_components/forms";
import { LeadsFilters } from "./filters";
import { LeadsTable } from "./_components/leads-table";
import { Pagination } from "./_components/pagination";
import {
  PAGE_SIZE,
  buildLeadWhere,
  leadInclude,
  parseLeadSearch,
  searchToParams,
  type RawSearch,
} from "./_lib/query";

export const dynamic = "force-dynamic";

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<RawSearch>;
}) {
  const search = parseLeadSearch(await searchParams);
  const where = buildLeadWhere(search);

  const [leads, totalCount, sources, statusCounts, allUsers] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: { submittedAt: "desc" },
      include: leadInclude,
      skip: (search.page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.lead.count({ where }),
    prisma.leadSource.findMany({
      orderBy: { label: "asc" },
      select: { slug: true, label: true, _count: { select: { leads: true } } },
    }),
    prisma.lead.groupBy({
      by: ["status"],
      _count: { _all: true },
      where: search.source ? { source: { slug: search.source } } : undefined,
    }),
    prisma.user.findMany({ select: { id: true, name: true, avatarHue: true, role: true } }),
  ]);

  const statusCountMap = new Map(statusCounts.map((s) => [s.status, s._count._all] as const));
  const allStatusTotal = statusCounts.reduce((sum, s) => sum + s._count._all, 0);
  const exportHref = `/api/admin/leads/export?${searchToParams(search).toString()}`;

  return (
    <>
      <PageHeader
        title="Leads"
        subtitle={`${totalCount.toLocaleString("en-US")} leads in this view`}
      />

      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--hairline)",
          borderRadius: "var(--radius)",
          overflow: "hidden",
        }}
      >
        <LeadsFilters
          sources={sources.map((s) => ({ slug: s.slug, label: s.label, count: s._count.leads }))}
          activeSource={search.source}
          activeStatus={search.status}
          query={search.q}
          from={search.from}
          to={search.to}
          activeAssignee={search.assignee}
          users={allUsers.map((u) => ({ id: u.id, name: u.name }))}
          exportHref={exportHref}
          statusCounts={{
            ALL: allStatusTotal,
            ...Object.fromEntries(STATUS_ORDER.map((s) => [s, statusCountMap.get(s) ?? 0])),
          }}
        />

        <LeadsTable
          leads={leads}
          users={allUsers.map((u) => ({ id: u.id, name: u.name, avatarHue: u.avatarHue }))}
        />

        <Pagination
          total={totalCount}
          pageSize={PAGE_SIZE}
          search={search}
          basePath="/dashboard/leads"
        />
      </div>
    </>
  );
}
