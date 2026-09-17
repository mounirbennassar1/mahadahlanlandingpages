"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import type { OrderStatus } from "@prisma/client";
import { ORDER_STATUS_META, ORDER_STATUS_ORDER } from "@/lib/order-status";

type PageOption = { slug: string; title: string; count: number };

export function OrdersFilters({
  title = "All orders",
  query,
  activeStatus,
  statusCounts,
  pages = [],
  activePage = null,
  hidePage = false,
  from = null,
  to = null,
  exportHref,
}: {
  title?: string;
  query: string;
  activeStatus: OrderStatus | null;
  statusCounts: Record<string, number>;
  pages?: PageOption[];
  activePage?: string | null;
  hidePage?: boolean;
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
    next.delete("p");
    const qs = next.toString();
    return qs ? `?${qs}` : "?";
  }

  function go(patch: Record<string, string | null>) {
    startTransition(() => router.push(buildHref(patch)));
  }

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "22px 22px 18px", borderBottom: "1px solid var(--hairline)", flexWrap: "wrap" }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, margin: 0, letterSpacing: "-0.01em" }}>{title}</h3>
        <span style={{ background: "var(--primary-soft)", color: "var(--primary)", fontFamily: "var(--font-data)", fontSize: 12, fontWeight: 600, padding: "3px 9px", borderRadius: 999 }}>
          {(statusCounts.ALL ?? 0).toLocaleString("en-US")} total
        </span>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
          {exportHref && (
            <a href={exportHref} className="fk-btn" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 9, background: "var(--surface)", border: "1px solid var(--hairline)", fontSize: 12.5, fontWeight: 500, color: "var(--ink-2)", whiteSpace: "nowrap" }}>
              Export CSV
            </a>
          )}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--surface-2)", border: "1px solid var(--hairline)", borderRadius: 10, padding: "8px 12px", width: 300 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--ink-3)" }}>
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              defaultValue={query}
              placeholder="Reference, name, phone, noon id…"
              onKeyDown={(e) => {
                if (e.key === "Enter") go({ q: (e.target as HTMLInputElement).value || null });
              }}
              style={{ border: "none", outline: "none", background: "transparent", fontSize: 13, flex: 1, color: "var(--ink)", fontFamily: "var(--font-ui)" }}
            />
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 22px", background: "var(--surface-2)", borderBottom: "1px solid var(--hairline)", overflowX: "auto" }}>
        <span style={labelCapsStyle}>Status</span>
        <Chip active={!activeStatus} label="All" count={statusCounts.ALL ?? 0} onClick={() => go({ status: null })} />
        {ORDER_STATUS_ORDER.map((s) => (
          <Chip key={s} active={activeStatus === s} label={ORDER_STATUS_META[s].label} count={statusCounts[s] ?? 0} onClick={() => go({ status: s })} />
        ))}
      </div>

      {!hidePage && pages.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 22px", background: "var(--surface-2)", borderBottom: "1px solid var(--hairline)", overflowX: "auto" }}>
          <span style={labelCapsStyle}>Page</span>
          <Chip active={!activePage} label="All pages" onClick={() => go({ page: null })} />
          {pages.map((p) => (
            <Chip key={p.slug} active={activePage === p.slug} label={p.title} count={p.count} onClick={() => go({ page: p.slug })} rtl />
          ))}
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 22px", background: "var(--surface-2)", borderBottom: "1px solid var(--hairline)", flexWrap: "wrap" }}>
        <span style={labelCapsStyle}>Created</span>
        <input type="date" value={from ?? ""} max={to ?? undefined} onChange={(e) => go({ from: e.target.value || null })} style={dateInputStyle} aria-label="From date" />
        <span style={{ color: "var(--ink-4)", fontSize: 12 }}>to</span>
        <input type="date" value={to ?? ""} min={from ?? undefined} onChange={(e) => go({ to: e.target.value || null })} style={dateInputStyle} aria-label="To date" />
        {(from || to || query || activePage || activeStatus) && (
          <button onClick={() => go({ from: null, to: null, q: null, page: null, status: null })} style={{ marginLeft: "auto", fontSize: 12.5, color: "var(--primary)", fontWeight: 600 }}>
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

function Chip({ active, label, count, onClick, rtl }: { active: boolean; label: string; count?: number; onClick: () => void; rtl?: boolean }) {
  return (
    <button
      onClick={onClick}
      style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 9, background: active ? "var(--ink)" : "var(--surface)", color: active ? "#fff" : "var(--ink-2)", border: `1px solid ${active ? "var(--ink)" : "var(--hairline)"}`, fontSize: 12.5, fontWeight: 500, whiteSpace: "nowrap" }}
    >
      <span dir={rtl ? "rtl" : undefined} lang={rtl ? "ar" : undefined} style={rtl ? { fontFamily: "var(--font-display), system-ui, sans-serif" } : undefined}>
        {label}
      </span>
      {count !== undefined && (
        <span style={{ fontFamily: "var(--font-data)", fontSize: 11, background: active ? "rgba(255,255,255,0.2)" : "var(--primary-softer)", color: active ? "#fff" : "var(--primary)", padding: "1px 6px", borderRadius: 4, fontWeight: 600 }}>
          {count}
        </span>
      )}
    </button>
  );
}

const labelCapsStyle: React.CSSProperties = { color: "var(--ink-3)", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginRight: 4 };
const dateInputStyle: React.CSSProperties = { padding: "6px 10px", borderRadius: 8, border: "1px solid var(--hairline)", background: "var(--surface)", fontSize: 12.5, color: "var(--ink-2)", fontFamily: "var(--font-data)" };
