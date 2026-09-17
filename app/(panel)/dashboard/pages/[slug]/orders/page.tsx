import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ORDER_STATUS_ORDER } from "@/lib/order-status";
import { getPageDef } from "@/lib/pages/registry";
import { Card } from "@/app/(panel)/dashboard/_components/card";
import { OrdersFilters } from "@/app/(panel)/dashboard/orders/filters";
import { OrdersTable } from "@/app/(panel)/dashboard/orders/_components/orders-table";
import { OrdersPagination } from "@/app/(panel)/dashboard/orders/_components/pagination";
import { OrderKpiRow, getOrderKpis } from "@/app/(panel)/dashboard/orders/_components/order-kpis";
import { PAGE_SIZE, buildOrderWhere, orderInclude, orderSearchToParams, parseOrderSearch, type RawSearch } from "@/app/(panel)/dashboard/orders/_lib/query";

export const dynamic = "force-dynamic";

/** Orders that started from one page's pay button. */
export default async function PageOrdersTab({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<RawSearch> }) {
  const { slug } = await params;
  const def = getPageDef(slug);
  if (!def) notFound();
  if (def.kind !== "landing" && def.slug !== "offers") {
    return (
      <Card title="No pay button on this page">
        <div style={{ fontSize: 13.5, color: "var(--ink-3)", lineHeight: 1.7 }}>Only the landings and the offers page take online payments.</div>
      </Card>
    );
  }

  const search = parseOrderSearch(await searchParams);
  const where = buildOrderWhere(search, { pageSlug: def.slug });

  const [orders, totalCount, statusCounts, kpis] = await Promise.all([
    prisma.order.findMany({ where, orderBy: { createdAt: "desc" }, include: orderInclude, skip: (search.pageNo - 1) * PAGE_SIZE, take: PAGE_SIZE }),
    prisma.order.count({ where }),
    prisma.order.groupBy({ by: ["status"], _count: { _all: true }, where: { pageSlug: def.slug } }),
    getOrderKpis({ pageSlug: def.slug }),
  ]);
  const statusCountMap = new Map(statusCounts.map((s) => [s.status, s._count._all] as const));
  const allStatusTotal = statusCounts.reduce((sum, s) => sum + s._count._all, 0);
  const basePath = `/dashboard/pages/${def.slug}/orders`;
  const exportHref = `/api/admin/orders/export?${orderSearchToParams(search, { page: def.slug }).toString()}`;

  return (
    <>
      <OrderKpiRow kpis={kpis} />
      <div style={{ background: "var(--surface)", border: "1px solid var(--hairline)", borderRadius: "var(--radius)", overflow: "hidden" }}>
        <OrdersFilters
          title={`Orders from ${def.title}`}
          hidePage
          query={search.q}
          activeStatus={search.status}
          from={search.from}
          to={search.to}
          exportHref={exportHref}
          statusCounts={{ ALL: allStatusTotal, ...Object.fromEntries(ORDER_STATUS_ORDER.map((s) => [s, statusCountMap.get(s) ?? 0])) }}
        />
        <OrdersTable orders={orders} showPage={false} />
        <OrdersPagination total={totalCount} pageSize={PAGE_SIZE} search={search} basePath={basePath} />
      </div>
    </>
  );
}
