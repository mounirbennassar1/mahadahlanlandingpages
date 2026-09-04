import type { PaymentMethod, Prisma } from "@prisma/client";

const PAYMENT_LABEL: Record<PaymentMethod, string> = {
  COD: "Cash at clinic",
  TAMARA: "Tamara",
  TABBY: "Tabby",
  CARD: "Card",
};

export type LeadDetailsData = {
  service: string | null;
  offer: { title: string } | null;
  email: string | null;
  preferredAt: Date | null;
  paymentMethod: PaymentMethod | null;
  message: string | null;
  /** Extra answers a page's form collected, e.g. { time: "مساءً" }. */
  data?: Prisma.JsonValue | null;
};

/** `Lead.data` as label/value pairs, ignoring anything that is not a string. */
export function extraEntries(
  data: Prisma.JsonValue | null | undefined,
  labels: Record<string, string> = {},
): { key: string; label: string; value: string }[] {
  if (!data || typeof data !== "object" || Array.isArray(data)) return [];
  return Object.entries(data as Record<string, unknown>)
    .filter(([, v]) => typeof v === "string" && v.trim() !== "")
    .map(([key, v]) => ({ key, label: labels[key] ?? humanizeKey(key), value: String(v) }));
}

function humanizeKey(key: string) {
  return key
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase());
}

export function hasLeadDetails(d: LeadDetailsData) {
  return Boolean(
    d.service ||
      d.offer ||
      d.email ||
      d.preferredAt ||
      d.paymentMethod ||
      d.message ||
      extraEntries(d.data).length > 0,
  );
}

function truncate(text: string, max = 120) {
  return text.length <= max ? text : `${text.slice(0, max).replace(/\s+\S*$/, "")}…`;
}

/** Native <details> expander listing the booking-form extras; render only when hasLeadDetails(). */
export function LeadDetails({ data }: { data: LeadDetailsData }) {
  const rows: { label: string; value: React.ReactNode; title?: string }[] = [];
  if (data.service) rows.push({ label: "Service", value: <Ar>{data.service}</Ar> });
  if (data.offer) rows.push({ label: "Offer", value: <Ar>{data.offer.title}</Ar> });
  if (data.email)
    rows.push({
      label: "Email",
      value: (
        <a href={`mailto:${data.email}`} style={{ fontFamily: "var(--font-data)", color: "var(--primary)" }}>
          {data.email}
        </a>
      ),
    });
  if (data.preferredAt)
    rows.push({
      label: "Preferred",
      value: (
        <span style={{ fontFamily: "var(--font-data)", fontVariantNumeric: "tabular-nums" }}>
          {data.preferredAt.toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
        </span>
      ),
    });
  if (data.paymentMethod) rows.push({ label: "Payment", value: PAYMENT_LABEL[data.paymentMethod] });
  if (data.message) rows.push({ label: "Message", value: <Ar>{truncate(data.message)}</Ar>, title: data.message });
  for (const extra of extraEntries(data.data)) {
    rows.push({ label: extra.label, value: <Ar>{truncate(extra.value)}</Ar>, title: extra.value });
  }

  return (
    <details className="fk-details" style={{ position: "relative" }}>
      <summary
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "4px 10px",
          borderRadius: 999,
          background: "var(--surface-2)",
          border: "1px solid var(--hairline)",
          fontSize: 12,
          fontWeight: 600,
          color: "var(--ink-2)",
          whiteSpace: "nowrap",
          userSelect: "none",
        }}
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
        {rows.length} detail{rows.length === 1 ? "" : "s"}
      </summary>
      <dl
        style={{
          margin: "8px 0 0",
          padding: "10px 12px",
          background: "var(--surface-2)",
          border: "1px solid var(--hairline)",
          borderRadius: 10,
          display: "grid",
          gridTemplateColumns: "auto minmax(0, 1fr)",
          columnGap: 12,
          rowGap: 6,
          fontSize: 12.5,
          minWidth: 240,
          maxWidth: 360,
        }}
      >
        {rows.map((r, i) => (
          <FragmentRow key={`${r.label}-${i}`} label={r.label} title={r.title}>
            {r.value}
          </FragmentRow>
        ))}
      </dl>
    </details>
  );
}

function FragmentRow({ label, title, children }: { label: string; title?: string; children: React.ReactNode }) {
  return (
    <>
      <dt style={{ color: "var(--ink-4)", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", alignSelf: "start", paddingTop: 2 }}>
        {label}
      </dt>
      <dd title={title} style={{ margin: 0, color: "var(--ink-2)", overflowWrap: "anywhere" }}>
        {children}
      </dd>
    </>
  );
}

function Ar({ children }: { children: React.ReactNode }) {
  return (
    <span dir="auto" style={{ fontFamily: "var(--font-display), system-ui, sans-serif", unicodeBidi: "plaintext" }}>
      {children}
    </span>
  );
}
