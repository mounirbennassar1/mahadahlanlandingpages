"use client";

import { useState } from "react";

const FORMATS = [
  { format: "xlsx", label: "Excel", hint: "Spreadsheet with filters, .xlsx" },
  { format: "csv", label: "CSV", hint: "Plain table for any tool, .csv" },
  { format: "pdf", label: "PDF", hint: "Printable report, .pdf" },
  { format: "txt", label: "Text", hint: "One block per lead, .txt" },
] as const;

/** Downloads the current filtered view; `query` is the page's filter query string. */
export function ExportMenu({ query, count }: { query: string; count: number }) {
  const [open, setOpen] = useState(false);
  const href = (format: string) =>
    `/api/admin/leads/export?${new URLSearchParams([...new URLSearchParams(query), ["format", format]])}`;

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={count === 0}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 16px",
          borderRadius: 11,
          background: "var(--ink)",
          color: "#fff",
          fontSize: 13.5,
          fontWeight: 600,
          opacity: count === 0 ? 0.5 : 1,
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Export {count.toLocaleString("en-US")} leads
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 90 }} />
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 6px)",
              right: 0,
              background: "var(--surface)",
              border: "1px solid var(--hairline)",
              borderRadius: 12,
              boxShadow: "var(--shadow-lg)",
              padding: 6,
              minWidth: 240,
              zIndex: 100,
            }}
          >
            <div style={{ padding: "6px 10px 8px", fontSize: 11, color: "var(--ink-4)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>
              Download as
            </div>
            {FORMATS.map((f) => (
              <a
                key={f.format}
                href={href(f.format)}
                download
                onClick={() => setOpen(false)}
                style={{ display: "block", padding: "8px 10px", borderRadius: 8, color: "var(--ink-2)" }}
              >
                <b style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{f.label}</b>
                <span style={{ fontSize: 12, color: "var(--ink-3)" }}>{f.hint}</span>
              </a>
            ))}
            {count > 10_000 && (
              <div style={{ padding: "6px 10px", fontSize: 11.5, color: "var(--amber)" }}>
                Only the newest 10,000 are exported. Narrow the period for the rest.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
