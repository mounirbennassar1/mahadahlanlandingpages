import type { LeadActivityType, Prisma } from "@prisma/client";
import { STATUS_META } from "@/lib/status";
import type { LeadStatus } from "@prisma/client";

export type ActivityRow = {
  id: string;
  type: LeadActivityType;
  body: string | null;
  meta: Prisma.JsonValue;
  createdAt: Date;
  user: { name: string } | null;
};

const DOT: Record<LeadActivityType, string> = {
  CREATED: "var(--blue)",
  NOTE: "var(--primary)",
  STATUS: "var(--amber)",
  ASSIGN: "var(--green)",
};

function metaString(meta: Prisma.JsonValue, key: string): string | null {
  if (!meta || typeof meta !== "object" || Array.isArray(meta)) return null;
  const value = (meta as Record<string, unknown>)[key];
  return typeof value === "string" ? value : null;
}

function statusLabel(value: string | null) {
  if (!value) return null;
  return STATUS_META[value as LeadStatus]?.label ?? value;
}

function describe(row: ActivityRow, sourceLabel: string) {
  switch (row.type) {
    case "CREATED": {
      const via = metaString(row.meta, "via");
      return `Submitted from ${sourceLabel}${via === "api-key" ? " (via API key)" : ""}`;
    }
    case "STATUS": {
      const from = statusLabel(metaString(row.meta, "from"));
      const to = statusLabel(metaString(row.meta, "to"));
      return from ? `Status changed from ${from} to ${to}` : `Status set to ${to}`;
    }
    case "ASSIGN": {
      const to = metaString(row.meta, "to");
      const from = metaString(row.meta, "from");
      if (!to) return `Unassigned${from ? ` from ${from}` : ""}`;
      return `Assigned to ${to}`;
    }
    case "NOTE":
      return "Note";
  }
}

/** Newest-first history of everything that happened to a lead. */
export function Timeline({
  rows,
  sourceLabel,
}: {
  rows: ActivityRow[];
  sourceLabel: string;
}) {
  if (rows.length === 0) {
    return <div style={{ fontSize: 13, color: "var(--ink-3)" }}>Nothing recorded yet.</div>;
  }

  return (
    <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 2 }}>
      {rows.map((row, i) => (
        <li key={row.id} style={{ display: "grid", gridTemplateColumns: "18px 1fr", gap: 12 }}>
          <div style={{ display: "grid", justifyItems: "center", gap: 2 }}>
            <span
              style={{
                width: 9,
                height: 9,
                borderRadius: "50%",
                background: DOT[row.type],
                marginTop: 6,
                flex: "none",
              }}
            />
            {i < rows.length - 1 && (
              <span style={{ width: 1, flex: 1, background: "var(--hairline)", minHeight: 18 }} />
            )}
          </div>
          <div style={{ paddingBottom: 16, minWidth: 0 }}>
            <div style={{ fontSize: 13.5, color: "var(--ink)", fontWeight: 600 }}>
              {describe(row, sourceLabel)}
            </div>
            {row.type === "NOTE" && row.body && (
              <div
                dir="auto"
                style={{
                  marginTop: 6,
                  padding: "10px 12px",
                  background: "var(--surface-2)",
                  border: "1px solid var(--hairline)",
                  borderRadius: 10,
                  fontSize: 13.5,
                  color: "var(--ink-2)",
                  lineHeight: 1.7,
                  whiteSpace: "pre-wrap",
                  unicodeBidi: "plaintext",
                  fontFamily: "var(--font-display), system-ui, sans-serif",
                }}
              >
                {row.body}
              </div>
            )}
            <div
              style={{
                fontSize: 12,
                color: "var(--ink-4)",
                marginTop: 4,
                fontFamily: "var(--font-data)",
              }}
            >
              {row.user ? `${row.user.name} · ` : ""}
              {row.createdAt.toLocaleString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
