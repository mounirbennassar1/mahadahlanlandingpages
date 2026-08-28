import { labelStyle } from "./styles";

export function Field({
  label,
  hint,
  error,
  required,
  htmlFor,
  children,
  style,
}: {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: string;
  required?: boolean;
  htmlFor?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div style={{ marginBottom: 18, ...style }}>
      {label && (
        <label htmlFor={htmlFor} style={labelStyle}>
          {label}
          {required && <span style={{ color: "var(--red)", fontWeight: 700 }}>*</span>}
        </label>
      )}
      {children}
      {error ? (
        <div style={{ fontSize: 12.5, color: "var(--red)", marginTop: 6 }}>{error}</div>
      ) : hint ? (
        <div style={{ fontSize: 12, color: "var(--ink-4)", marginTop: 6 }}>{hint}</div>
      ) : null}
    </div>
  );
}
