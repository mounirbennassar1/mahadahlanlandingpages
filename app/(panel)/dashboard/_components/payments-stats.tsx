import Link from "next/link";
import { prisma } from "@/lib/prisma";

export type PaymentCounts = {
  paidTotal: number;
  paidCount: number;
  weekTotal: number;
  pending: number;
  livePackages: number;
};

export async function getPaymentCounts(): Promise<PaymentCounts> {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const [paid, week, pending, livePackages] = await Promise.all([
    prisma.order.aggregate({ where: { status: "PAID" }, _count: { _all: true }, _sum: { amount: true } }),
    prisma.order.aggregate({ where: { status: "PAID", paidAt: { gte: weekAgo } }, _sum: { amount: true } }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.package.count({
      where: {
        active: true,
        AND: [{ OR: [{ startsAt: null }, { startsAt: { lte: now } }] }, { OR: [{ endsAt: null }, { endsAt: { gte: now } }] }],
      },
    }),
  ]);
  return {
    paidTotal: paid._sum.amount ?? 0,
    paidCount: paid._count._all,
    weekTotal: week._sum.amount ?? 0,
    pending,
    livePackages,
  };
}

function money(n: number) {
  return `${n.toLocaleString("en-US")} SAR`;
}

/** Compact "Online payments" row on the dashboard home. */
export function PaymentsStats({ counts }: { counts: PaymentCounts }) {
  const items = [
    { label: "Revenue (paid)", value: money(counts.paidTotal), hint: `${counts.paidCount} paid orders`, href: "/dashboard/orders?status=PAID" },
    { label: "Last 7 days", value: money(counts.weekTotal), hint: "paid through noon", href: "/dashboard/orders?status=PAID" },
    { label: "Awaiting payment", value: counts.pending.toLocaleString("en-US"), hint: "checkouts not completed", href: "/dashboard/orders?status=PENDING" },
    { label: "Live packages", value: counts.livePackages.toLocaleString("en-US"), hint: "sold on the landings", href: "/dashboard/packages" },
  ];
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--ink-4)", fontWeight: 600, marginBottom: 10 }}>Online payments</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {items.map((it) => (
          <Link
            key={it.label}
            href={it.href}
            className="fk-link"
            style={{ background: "var(--surface)", border: "1px solid var(--hairline)", borderRadius: "var(--radius)", padding: "16px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}
          >
            <div>
              <div style={{ fontSize: 12.5, color: "var(--ink-3)", fontWeight: 600 }}>{it.label}</div>
              <div style={{ fontSize: 11.5, color: "var(--ink-4)", marginTop: 2 }}>{it.hint}</div>
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, letterSpacing: "-0.03em", color: "var(--ink)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{it.value}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
