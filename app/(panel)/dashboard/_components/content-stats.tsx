import Link from "next/link";
import { prisma } from "@/lib/prisma";

export type ContentCounts = {
  publishedArticles: number;
  activeOffers: number;
  doctors: number;
  devices: number;
};

export async function getContentCounts(): Promise<ContentCounts> {
  const now = new Date();
  const [publishedArticles, activeOffers, doctors, devices] = await Promise.all([
    prisma.article.count({ where: { status: "PUBLISHED" } }),
    prisma.offer.count({
      where: {
        active: true,
        AND: [{ OR: [{ startsAt: null }, { startsAt: { lte: now } }] }, { OR: [{ endsAt: null }, { endsAt: { gte: now } }] }],
      },
    }),
    prisma.doctor.count({ where: { active: true } }),
    prisma.device.count({ where: { active: true } }),
  ]);
  return { publishedArticles, activeOffers, doctors, devices };
}

const ITEMS: { key: keyof ContentCounts; label: string; href: string; hint: string }[] = [
  { key: "publishedArticles", label: "Published articles", href: "/dashboard/content/articles?status=PUBLISHED", hint: "on /news-articles" },
  { key: "activeOffers", label: "Live offers", href: "/dashboard/content/offers", hint: "active and inside their window" },
  { key: "doctors", label: "Doctors", href: "/dashboard/content/doctors", hint: "active profiles" },
  { key: "devices", label: "Devices", href: "/dashboard/content/devices", hint: "active devices" },
];

/** Compact "Website content" row under the KPI cards. */
export function ContentStats({ counts }: { counts: ContentCounts }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div
        style={{
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: "var(--ink-4)",
          fontWeight: 600,
          marginBottom: 10,
        }}
      >
        Website content
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {ITEMS.map((it) => (
          <Link
            key={it.key}
            href={it.href}
            className="fk-link"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--hairline)",
              borderRadius: "var(--radius)",
              padding: "16px 18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div>
              <div style={{ fontSize: 12.5, color: "var(--ink-3)", fontWeight: 600 }}>{it.label}</div>
              <div style={{ fontSize: 11.5, color: "var(--ink-4)", marginTop: 2 }}>{it.hint}</div>
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 26,
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: "var(--ink)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {counts[it.key].toLocaleString("en-US")}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
