export function PageHeader({
  title,
  subtitle,
  right,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 24, gap: 16 }}>
      <div style={{ minWidth: 0 }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: "-0.025em",
            color: "var(--ink)",
            margin: 0,
          }}
        >
          {title}
        </h1>
        {subtitle && <div style={{ fontSize: 14, color: "var(--ink-3)", marginTop: 6 }}>{subtitle}</div>}
      </div>
      {right && <div style={{ display: "flex", alignItems: "center", gap: 10, flex: "none" }}>{right}</div>}
    </div>
  );
}
