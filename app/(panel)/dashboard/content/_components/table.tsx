import Link from "next/link";
import { inputStyle, primaryButtonStyle, smallButtonStyle } from "../../_components/forms/styles";

/* ───────────── table primitives (same look as sources/leads) ───────────── */

export function TableShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--hairline)",
        borderRadius: "var(--radius)",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
}

export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 14 }}>{children}</table>
    </div>
  );
}

export function Th({ children, align = "left", width }: { children?: React.ReactNode; align?: "left" | "right"; width?: number | string }) {
  return (
    <th
      style={{
        textAlign: align,
        padding: "12px 16px",
        fontSize: 11.5,
        fontWeight: 600,
        color: "var(--ink-3)",
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        background: "var(--surface-2)",
        borderBottom: "1px solid var(--hairline)",
        whiteSpace: "nowrap",
        width,
      }}
    >
      {children}
    </th>
  );
}

export function Td({ children, align = "left", style }: { children?: React.ReactNode; align?: "left" | "right"; style?: React.CSSProperties }) {
  return (
    <td
      style={{
        padding: "14px 16px",
        borderBottom: "1px solid var(--hairline)",
        verticalAlign: "middle",
        color: "var(--ink-2)",
        textAlign: align,
        ...style,
      }}
    >
      {children}
    </td>
  );
}

export function EmptyRow({ colSpan, children = "Nothing here yet." }: { colSpan: number; children?: React.ReactNode }) {
  return (
    <tr>
      <td colSpan={colSpan} style={{ padding: 40, textAlign: "center", color: "var(--ink-3)" }}>
        {children}
      </td>
    </tr>
  );
}

/** Arabic primary text + optional Latin/meta line under it. */
export function TitleCell({ title, meta, href }: { title: React.ReactNode; meta?: React.ReactNode; href?: string }) {
  const main = (
    <b
      dir="rtl"
      lang="ar"
      style={{
        display: "block",
        color: "var(--ink)",
        fontWeight: 600,
        fontFamily: "var(--font-display), system-ui, sans-serif",
        fontSize: 14.5,
        textAlign: "left",
        unicodeBidi: "plaintext",
      }}
    >
      {title}
    </b>
  );
  return (
    <div style={{ minWidth: 0, lineHeight: 1.3 }}>
      {href ? (
        <Link href={href} className="fk-link">
          {main}
        </Link>
      ) : (
        main
      )}
      {meta && <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 3 }}>{meta}</div>}
    </div>
  );
}

export function Code({ children }: { children: React.ReactNode }) {
  return (
    <code
      style={{
        background: "var(--surface-2)",
        padding: "3px 8px",
        borderRadius: 6,
        fontFamily: "var(--font-data)",
        fontSize: 12.5,
        unicodeBidi: "plaintext",
      }}
    >
      {children}
    </code>
  );
}

export function Thumb({ src, alt }: { src?: string | null; alt?: string | null }) {
  return (
    <div
      style={{
        width: 44,
        height: 44,
        borderRadius: 10,
        background: "var(--surface-2)",
        border: "1px solid var(--hairline)",
        overflow: "hidden",
        flex: "none",
        display: "grid",
        placeItems: "center",
        color: "var(--ink-4)",
      }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt ?? ""} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
        </svg>
      )}
    </div>
  );
}

/* ───────────── pills ───────────── */

type Tone = "green" | "slate" | "amber" | "blue" | "primary" | "red";

const TONES: Record<Tone, { bg: string; fg: string }> = {
  green: { bg: "var(--green-soft)", fg: "var(--green)" },
  slate: { bg: "var(--slate-soft)", fg: "var(--slate)" },
  amber: { bg: "var(--amber-soft)", fg: "var(--amber)" },
  blue: { bg: "var(--blue-soft)", fg: "var(--blue)" },
  primary: { bg: "var(--primary-softer)", fg: "var(--primary)" },
  red: { bg: "var(--red-soft)", fg: "var(--red)" },
};

export function Pill({ tone, children, dot = true }: { tone: Tone; children: React.ReactNode; dot?: boolean }) {
  const t = TONES[tone];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "3px 9px 3px 8px",
        borderRadius: 999,
        fontSize: 11.5,
        fontWeight: 600,
        background: t.bg,
        color: t.fg,
        whiteSpace: "nowrap",
      }}
    >
      {dot && <span style={{ width: 6, height: 6, borderRadius: "50%", background: t.fg }} />}
      {children}
    </span>
  );
}

export function ActivePill({ active }: { active: boolean }) {
  return <Pill tone={active ? "green" : "slate"}>{active ? "Active" : "Hidden"}</Pill>;
}

export function StatusPill({ status }: { status: "DRAFT" | "PUBLISHED" }) {
  return <Pill tone={status === "PUBLISHED" ? "green" : "amber"}>{status === "PUBLISHED" ? "Published" : "Draft"}</Pill>;
}

/* ───────────── toolbar: search + filter chips + "New" button ───────────── */

export function ListToolbar({
  q,
  placeholder = "Search…",
  hidden = {},
  chips,
  right,
}: {
  q: string;
  placeholder?: string;
  /** Extra query params preserved when searching (e.g. current status filter). */
  hidden?: Record<string, string | undefined>;
  chips?: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "14px 18px",
        borderBottom: "1px solid var(--hairline)",
        background: "var(--surface-2)",
        flexWrap: "wrap",
      }}
    >
      <form method="get" style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {Object.entries(hidden).map(([k, v]) => v && <input key={k} type="hidden" name={k} value={v} />)}
        <div style={{ position: "relative" }}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--ink-3)" }}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            name="q"
            defaultValue={q}
            placeholder={placeholder}
            className="fk-input"
            dir="auto"
            style={{ ...inputStyle, width: 280, padding: "8px 12px 8px 34px", fontSize: 13, background: "var(--surface)" }}
          />
        </div>
        {q && (
          <Link href="?" className="fk-btn" style={{ ...smallButtonStyle }}>
            Clear
          </Link>
        )}
      </form>
      {chips && <div style={{ display: "flex", alignItems: "center", gap: 6 }}>{chips}</div>}
      {right && <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>{right}</div>}
    </div>
  );
}

export function Chip({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 12px",
        borderRadius: 9,
        background: active ? "var(--ink)" : "var(--surface)",
        color: active ? "#fff" : "var(--ink-2)",
        border: `1px solid ${active ? "var(--ink)" : "var(--hairline)"}`,
        fontSize: 12.5,
        fontWeight: 500,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </Link>
  );
}

export function NewButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="fk-btn" style={primaryButtonStyle}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
      {children}
    </Link>
  );
}

export function EditLink({ href }: { href: string }) {
  return (
    <Link href={href} className="fk-btn" style={smallButtonStyle}>
      Edit
    </Link>
  );
}

export function ExternalLink({ href, children = "View" }: { href: string; children?: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="fk-btn" style={{ ...smallButtonStyle, color: "var(--ink-3)" }}>
      {children}
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
      </svg>
    </a>
  );
}

/* ───────────── formatting ───────────── */

export function fmtDate(d: Date | null | undefined) {
  if (!d) return "—";
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function fmtDateTime(d: Date | null | undefined) {
  if (!d) return "—";
  return d.toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function DateCell({ date }: { date: Date | null | undefined }) {
  return (
    <span style={{ fontFamily: "var(--font-data)", fontVariantNumeric: "tabular-nums", fontSize: 13, color: "var(--ink-2)", whiteSpace: "nowrap" }}>
      {fmtDate(date)}
    </span>
  );
}

export function Num({ children }: { children: React.ReactNode }) {
  return <span style={{ fontFamily: "var(--font-data)", fontVariantNumeric: "tabular-nums" }}>{children}</span>;
}

/** Public site origin for "View" links: same origin on localhost, mahadahlan.com in prod. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "";
