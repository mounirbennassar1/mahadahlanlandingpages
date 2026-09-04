import Link from "next/link";
import { Card } from "./card";

export type BarRow = { label: string; count: number; href?: string };

/**
 * Horizontal bars for a small categorical breakdown (cities, pages, ad
 * platforms). `CitiesBar` is a thin wrapper so the dashboard home is unchanged.
 */
export function BarList({
  title,
  subtitle,
  data,
  labelWidth = 120,
  right,
  empty = "No data yet.",
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  data: BarRow[];
  labelWidth?: number;
  right?: React.ReactNode;
  empty?: string;
}) {
  const max = Math.max(1, ...data.map((d) => d.count));
  return (
    <Card title={title} subtitle={subtitle} right={right}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 4 }}>
        {data.length === 0 && <div style={{ color: "var(--ink-3)", fontSize: 13 }}>{empty}</div>}
        {data.map((d) => {
          const pct = (d.count / max) * 100;
          const label = (
            <span
              style={{
                fontSize: 13,
                color: d.href ? "var(--primary)" : "var(--ink-2)",
                fontWeight: 500,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {d.label}
            </span>
          );
          return (
            <div
              key={`${d.label}-${d.count}`}
              style={{
                display: "grid",
                gridTemplateColumns: `${labelWidth}px 1fr 50px`,
                gap: 12,
                alignItems: "center",
              }}
            >
              {d.href ? (
                <Link href={d.href} className="fk-link" style={{ minWidth: 0 }}>
                  {label}
                </Link>
              ) : (
                label
              )}
              <div
                style={{
                  height: 10,
                  background: "var(--primary-softer)",
                  borderRadius: 99,
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${pct}%`,
                    background: "linear-gradient(90deg, var(--primary-3), var(--primary))",
                    borderRadius: 99,
                  }}
                />
              </div>
              <span
                style={{
                  fontFamily: "var(--font-data)",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--ink)",
                  textAlign: "right",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {d.count.toLocaleString("en-US")}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
