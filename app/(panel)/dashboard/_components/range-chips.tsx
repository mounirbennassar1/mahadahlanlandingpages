import Link from "next/link";

const RANGES = [7, 30, 90] as const;
export type Range = (typeof RANGES)[number];

export function parseRange(value: string | string[] | undefined): Range {
  const raw = Array.isArray(value) ? value[0] : value;
  const n = Number.parseInt(raw ?? "", 10);
  return (RANGES as readonly number[]).includes(n) ? (n as Range) : 30;
}

/** 7 / 30 / 90-day switch for a page's overview charts. */
export function RangeChips({ basePath, active }: { basePath: string; active: Range }) {
  return (
    <div style={{ display: "inline-flex", gap: 4 }}>
      {RANGES.map((r) => (
        <Link
          key={r}
          href={`${basePath}?range=${r}`}
          style={{
            padding: "5px 11px",
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 600,
            fontFamily: "var(--font-data)",
            background: r === active ? "var(--ink)" : "var(--surface-2)",
            color: r === active ? "#fff" : "var(--ink-3)",
            border: `1px solid ${r === active ? "var(--ink)" : "var(--hairline)"}`,
          }}
        >
          {r}d
        </Link>
      ))}
    </div>
  );
}
