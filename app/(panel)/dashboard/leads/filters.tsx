"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { STATUS_META, STATUS_ORDER } from "@/lib/status";
import type { LeadStatus } from "@prisma/client";

type Source = { slug: string; label: string; count: number };
type Assignable = { id: string; name: string };

export function LeadsFilters({
  sources,
  activeSource,
  activeStatus,
  query,
  statusCounts,
  title = "All leads",
  hideSource = false,
  users = [],
  activeAssignee = null,
  from = null,
  to = null,
  exportHref,
}: {
  sources: Source[];
  activeSource: string | null;
  activeStatus: LeadStatus | null;
  query: string;
  statusCounts: Record<string, number>;
  title?: string;
  /** The per-page Leads tab is already scoped to one source. */
  hideSource?: boolean;
  users?: Assignable[];
  activeAssignee?: string | null;
  from?: string | null;
  to?: string | null;
  exportHref?: string;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function buildHref(patch: Record<string, string | null>) {
    const next = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(patch)) {
      if (v === null || v === "") next.delete(k);
      else next.set(k, v);
    }
    next.delete("page");
    const qs = next.toString();
    return qs ? `?${qs}` : "?";
  }

  function go(patch: Record<string, string | null>) {
    startTransition(() => router.push(buildHref(patch)));
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "22px 22px 18px",
          borderBottom: "1px solid var(--hairline)",
        }}
      >
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, margin: 0, letterSpacing: "-0.01em" }}>
          {title}
        </h3>
        <span
          style={{
            background: "var(--primary-soft)",
            color: "var(--primary)",
            fontFamily: "var(--font-data)",
            fontSize: 12,
            fontWeight: 600,
            padding: "3px 9px",
            borderRadius: 999,
          }}
        >
          {statusCounts.ALL.toLocaleString("en-US")} total
        </span>

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
          {exportHref && (
            <a
              href={exportHref}
              className="fk-btn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                borderRadius: 9,
                background: "var(--surface)",
                border: "1px solid var(--hairline)",
                fontSize: 12.5,
                fontWeight: 500,
                color: "var(--ink-2)",
                whiteSpace: "nowrap",
              }}
            >
              Export CSV
            </a>
          )}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "var(--surface-2)",
              border: "1px solid var(--hairline)",
              borderRadius: 10,
              padding: "8px 12px",
              width: 280,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--ink-3)" }}>
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              defaultValue={query}
              placeholder="Search name, phone, city…"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  go({ q: (e.target as HTMLInputElement).value || null });
                }
              }}
              style={{ border: "none", outline: "none", background: "transparent", fontSize: 13, flex: 1, color: "var(--ink)", fontFamily: "var(--font-ui)" }}
            />
          </div>
        </div>
      </div>

      {/* Source filter */}
      {!hideSource && (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "12px 22px",
          background: "var(--surface-2)",
          borderBottom: "1px solid var(--hairline)",
          overflowX: "auto",
        }}
      >
        <span style={{ color: "var(--ink-3)", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginRight: 4 }}>
          Source
        </span>
        <Chip active={!activeSource} label="All sources" onClick={() => go({ source: null })} />
        {sources.map((s) => (
          <Chip
            key={s.slug}
            active={activeSource === s.slug}
            label={s.label}
            count={s.count}
            onClick={() => go({ source: s.slug })}
          />
        ))}
      </div>
      )}

      {/* Status filter */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "12px 22px",
          background: "var(--surface-2)",
          borderBottom: "1px solid var(--hairline)",
          overflowX: "auto",
        }}
      >
        <span style={{ color: "var(--ink-3)", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginRight: 4 }}>
          Status
        </span>
        <Chip
          active={!activeStatus}
          label="All"
          count={statusCounts.ALL}
          onClick={() => go({ status: null })}
        />
        {STATUS_ORDER.map((s) => (
          <Chip
            key={s}
            active={activeStatus === s}
            label={STATUS_META[s].label}
            count={statusCounts[s] ?? 0}
            onClick={() => go({ status: s })}
          />
        ))}
      </div>
      {/* Date range + assignee */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "12px 22px",
          background: "var(--surface-2)",
          borderBottom: "1px solid var(--hairline)",
          flexWrap: "wrap",
        }}
      >
        <span style={labelCapsStyle}>Submitted</span>
        <input
          type="date"
          value={from ?? ""}
          max={to ?? undefined}
          onChange={(e) => go({ from: e.target.value || null })}
          style={dateInputStyle}
          aria-label="From date"
        />
        <span style={{ color: "var(--ink-4)", fontSize: 12 }}>to</span>
        <input
          type="date"
          value={to ?? ""}
          min={from ?? undefined}
          onChange={(e) => go({ to: e.target.value || null })}
          style={dateInputStyle}
          aria-label="To date"
        />

        <span style={{ ...labelCapsStyle, marginLeft: 12 }}>Assigned</span>
        <select
          value={activeAssignee ?? ""}
          onChange={(e) => go({ assignee: e.target.value || null })}
          style={{ ...dateInputStyle, cursor: "pointer" }}
          aria-label="Assignee"
        >
          <option value="">Anyone</option>
          <option value="none">Unassigned</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>

        {(from || to || activeAssignee || query) && (
          <button
            onClick={() => go({ from: null, to: null, assignee: null, q: null })}
            style={{
              marginLeft: "auto",
              fontSize: 12.5,
              color: "var(--primary)",
              fontWeight: 600,
            }}
          >
            Clear filters
          </button>
        )}
      </div>

      {isPending && (
        <div style={{ height: 2, background: "var(--primary-soft)", overflow: "hidden" }}>
          <div style={{ height: "100%", width: "30%", background: "var(--primary)", animation: "progress 0.8s ease-in-out infinite" }} />
        </div>
      )}
    </>
  );
}

function Chip({
  active,
  label,
  count,
  onClick,
}: {
  active: boolean;
  label: string;
  count?: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "7px 12px",
        borderRadius: 9,
        background: active ? "var(--ink)" : "var(--surface)",
        color: active ? "#fff" : "var(--ink-2)",
        border: `1px solid ${active ? "var(--ink)" : "var(--hairline)"}`,
        fontSize: 12.5,
        fontWeight: 500,
        whiteSpace: "nowrap",
      }}
    >
      {label}
      {count !== undefined && (
        <span
          style={{
            fontFamily: "var(--font-data)",
            fontSize: 11,
            background: active ? "rgba(255,255,255,0.2)" : "var(--primary-softer)",
            color: active ? "#fff" : "var(--primary)",
            padding: "1px 6px",
            borderRadius: 4,
            fontWeight: 600,
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
}

const labelCapsStyle: React.CSSProperties = {
  color: "var(--ink-3)",
  fontSize: 12,
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};

const dateInputStyle: React.CSSProperties = {
  padding: "6px 10px",
  borderRadius: 8,
  border: "1px solid var(--hairline)",
  background: "var(--surface)",
  fontSize: 12.5,
  color: "var(--ink-2)",
  fontFamily: "var(--font-data)",
};
