import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { STATUS_ORDER } from "@/lib/status";
import { getPageDef } from "@/lib/pages/registry";
import { LeadsFilters } from "@/app/(panel)/dashboard/leads/filters";
import { LeadsTable } from "@/app/(panel)/dashboard/leads/_components/leads-table";
import { Pagination } from "@/app/(panel)/dashboard/leads/_components/pagination";
import {
  PAGE_SIZE,
  buildLeadWhere,
  leadInclude,
  parseLeadSearch,
  searchToParams,
  type RawSearch,
} from "@/app/(panel)/dashboard/leads/_lib/query";
import { NoSourceCard } from "../../_components/no-source-card";

export const dynamic = "force-dynamic";

export default async function PageLeadsTab({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<RawSearch>;
}) {
  const { slug } = await params;
  const def = getPageDef(slug);
  if (!def) notFound();
  if (!def.leadSource) return <NoSourceCard />;

  const source = await prisma.leadSource.findUnique({
    where: { slug: def.leadSource },
    select: { id: true, slug: true, label: true },
  });
  if (!source) return <NoSourceCard pending sourceSlug={def.leadSource} />;

  const search = parseLeadSearch(await searchParams);
  const where = buildLeadWhere(search, { sourceId: source.id });

  const [leads, totalCount, statusCounts, allUsers] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: { submittedAt: "desc" },
      include: leadInclude,
      skip: (search.page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.lead.count({ where }),
    prisma.lead.groupBy({
      by: ["status"],
      _count: { _all: true },
      where: { sourceId: source.id },
    }),
    prisma.user.findMany({ select: { id: true, name: true, avatarHue: true } }),
  ]);

  const statusCountMap = new Map(statusCounts.map((s) => [s.status, s._count._all] as const));
  const allStatusTotal = statusCounts.reduce((sum, s) => sum + s._count._all, 0);
  const basePath = `/dashboard/pages/${def.slug}/leads`;
  const exportHref = `/api/admin/leads/export?${searchToParams(search, { source: source.slug }).toString()}`;

  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--hairline)",
        borderRadius: "var(--radius)",
        overflow: "hidden",
      }}
    >
      <LeadsFilters
        title={`Leads from ${def.title}`}
        hideSource
        sources={[]}
        activeSource={source.slug}
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
        showSource={false}
        users={allUsers.map((u) => ({ id: u.id, name: u.name, avatarHue: u.avatarHue }))}
      />

      <Pagination
        total={totalCount}
        pageSize={PAGE_SIZE}
        search={search}
        basePath={basePath}
      />
    </div>
  );
}
