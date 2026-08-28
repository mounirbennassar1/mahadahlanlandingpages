/** Two-column form layout: main fields + a narrower settings column. */
export function FormGrid({ main, side }: { main: React.ReactNode; side: React.ReactNode }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 340px", gap: 20, alignItems: "start" }}>
      <div style={{ minWidth: 0 }}>{main}</div>
      <div style={{ position: "sticky", top: 84 }}>{side}</div>
    </div>
  );
}

export function FormSection({ title, subtitle, children }: { title?: React.ReactNode; subtitle?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--hairline)",
        borderRadius: "var(--radius)",
        padding: 22,
        marginBottom: 16,
      }}
    >
      {title && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, letterSpacing: "-0.01em", color: "var(--ink)" }}>{title}</div>
          {subtitle && <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 3 }}>{subtitle}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

export function FormActions({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>{children}</div>;
}

export function TwoCol({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>{children}</div>;
}

/** Read-only notice for AGENT role. */
export function ReadOnlyNotice() {
  return (
    <div
      style={{
        background: "var(--amber-soft)",
        color: "var(--amber)",
        border: "1px solid oklch(0.9 0.06 80)",
        padding: "10px 14px",
        borderRadius: 10,
        fontSize: 13,
        fontWeight: 500,
        marginBottom: 18,
      }}
    >
      You have read-only access to website content. Ask an administrator or manager to make changes.
    </div>
  );
}
