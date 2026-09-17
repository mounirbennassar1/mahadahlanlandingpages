import { prisma } from "@/lib/prisma";
import { PAGES } from "@/lib/pages/registry";
import { ORDER_STATUS_ORDER } from "@/lib/order-status";
import { PageHeader } from "@/app/(panel)/dashboard/_components/forms";
import { OrdersFilters } from "./filters";
import { OrdersTable } from "./_components/orders-table";
import { OrdersPagination } from "./_components/pagination";
import { OrderKpiRow, getOrderKpis } from "./_components/order-kpis";
import { PAGE_SIZE, buildOrderWhere, orderInclude, orderSearchToParams, parseOrderSearch, type RawSearch } from "./_lib/query";

export const dynamic = "force-dynamic";

export default async function OrdersPage({ searchParams }: { searchParams: Promise<RawSearch> }) {
  const search = parseOrderSearch(await searchParams);
  const where = buildOrderWhere(search);

  const [orders, totalCount, statusCounts, pageCounts, kpis] = await Promise.all([
    prisma.order.findMany({ where, orderBy: { createdAt: "desc" }, include: orderInclude, skip: (search.pageNo - 1) * PAGE_SIZE, take: PAGE_SIZE }),
    prisma.order.count({ where }),
    prisma.order.groupBy({ by: ["status"], _count: { _all: true }, where: search.page ? { pageSlug: search.page } : undefined }),
    prisma.order.groupBy({ by: ["pageSlug"], _count: { _all: true } }),
    getOrderKpis(),
  ]);

  const statusCountMap = new Map(statusCounts.map((s) => [s.status, s._count._all] as const));
  const allStatusTotal = statusCounts.reduce((sum, s) => sum + s._count._all, 0);
  const pageTitle = new Map(PAGES.map((p) => [p.slug, p.title]));
  const pages = pageCounts
    .filter((p) => p.pageSlug)
    .map((p) => ({ slug: p.pageSlug as string, title: pageTitle.get(p.pageSlug as string) ?? (p.pageSlug as string), count: p._count._all }))
    .sort((a, b) => b.count - a.count);
  const exportHref = `/api/admin/orders/export?${orderSearchToParams(search).toString()}`;

  return (
    <>
      <PageHeader title="Orders" subtitle={`${totalCount.toLocaleString("en-US")} orders in this view · online payments through noon`} />
      <OrderKpiRow kpis={kpis} />
      <div style={{ background: "var(--surface)", border: "1px solid var(--hairline)", borderRadius: "var(--radius)", overflow: "hidden" }}>
        <OrdersFilters
          query={search.q}
          activeStatus={search.status}
          pages={pages}
          activePage={search.page}
          from={search.from}
          to={search.to}
          exportHref={exportHref}
          statusCounts={{ ALL: allStatusTotal, ...Object.fromEntries(ORDER_STATUS_ORDER.map((s) => [s, statusCountMap.get(s) ?? 0])) }}
        />
        <OrdersTable orders={orders} />
        <OrdersPagination total={totalCount} pageSize={PAGE_SIZE} search={search} basePath="/dashboard/orders" />
      </div>
    </>
  );
}
