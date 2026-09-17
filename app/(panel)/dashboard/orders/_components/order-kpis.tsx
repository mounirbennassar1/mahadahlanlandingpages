import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type OrderKpis = {
  paidCount: number;
  paidTotal: number;
  paidWeek: number;
  paidWeekTotal: number;
  pendingCount: number;
  failedCount: number;
  refundedTotal: number;
};

export async function getOrderKpis(where: Prisma.OrderWhereInput = {}): Promise<OrderKpis> {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const [paid, paidWeek, pending, failed, refunded] = await Promise.all([
    prisma.order.aggregate({ where: { ...where, status: "PAID" }, _count: { _all: true }, _sum: { amount: true } }),
    prisma.order.aggregate({ where: { ...where, status: "PAID", paidAt: { gte: weekAgo } }, _count: { _all: true }, _sum: { amount: true } }),
    prisma.order.count({ where: { ...where, status: "PENDING" } }),
    prisma.order.count({ where: { ...where, status: { in: ["FAILED", "CANCELLED", "EXPIRED"] } } }),
    prisma.order.aggregate({ where: { ...where, refundedAmount: { gt: 0 } }, _sum: { refundedAmount: true } }),
  ]);
  return {
    paidCount: paid._count._all,
    paidTotal: paid._sum.amount ?? 0,
    paidWeek: paidWeek._count._all,
    paidWeekTotal: paidWeek._sum.amount ?? 0,
    pendingCount: pending,
    failedCount: failed,
    refundedTotal: refunded._sum.refundedAmount ?? 0,
  };
}

function money(n: number) {
  return `${n.toLocaleString("en-US")} SAR`;
}

/** Four tiles above the orders table. */
export function OrderKpiRow({ kpis }: { kpis: OrderKpis }) {
  const tiles = [
    { label: "Revenue (paid)", value: money(kpis.paidTotal), hint: `${kpis.paidCount.toLocaleString("en-US")} paid orders`, featured: true },
    { label: "Last 7 days", value: money(kpis.paidWeekTotal), hint: `${kpis.paidWeek} paid this week`, bg: "var(--green-soft)", fg: "var(--green)" },
    { label: "Awaiting payment", value: kpis.pendingCount.toLocaleString("en-US"), hint: "started, not completed", bg: "var(--amber-soft)", fg: "var(--amber)" },
    { label: "Failed / cancelled", value: kpis.failedCount.toLocaleString("en-US"), hint: kpis.refundedTotal > 0 ? `${money(kpis.refundedTotal)} refunded` : "follow up on WhatsApp", bg: "var(--red-soft)", fg: "var(--red)" },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 20 }}>
      {tiles.map((t) => (
        <div
          key={t.label}
          style={{
            background: t.featured ? "linear-gradient(155deg, var(--primary) 0%, var(--primary-2) 100%)" : "var(--surface)",
            border: t.featured ? "1px solid transparent" : "1px solid var(--hairline)",
            borderRadius: "var(--radius)",
            padding: 20,
            color: t.featured ? "#fff" : "var(--ink)",
          }}
        >
          <div style={{ fontSize: 12, color: t.featured ? "rgba(255,255,255,0.85)" : "var(--ink-3)", fontWeight: 500, marginBottom: 14 }}>{t.label}</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{t.value}</div>
          <div style={{ fontSize: 12, color: t.featured ? "rgba(255,255,255,0.82)" : "var(--ink-3)", marginTop: 10 }}>{t.hint}</div>
        </div>
      ))}
    </div>
  );
}
