import type { CSSProperties } from "react";

export const inputStyle: CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid var(--hairline)",
  background: "var(--surface-2)",
  fontSize: 14,
  color: "var(--ink)",
  outline: "none",
  fontFamily: "inherit",
  transition: "border-color 0.12s, box-shadow 0.12s",
};

/** Arabic content fields: RTL + the site's Arabic display font. */
export const arabicInputStyle: CSSProperties = {
  ...inputStyle,
  direction: "rtl",
  textAlign: "right",
  fontFamily: "var(--font-display), system-ui, sans-serif",
  fontSize: 14.5,
};

export const labelStyle: CSSProperties = {
  fontSize: 12.5,
  color: "var(--ink-3)",
  fontWeight: 600,
  marginBottom: 6,
  display: "flex",
  alignItems: "center",
  gap: 6,
};

export const primaryButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "10px 18px",
  borderRadius: 10,
  background: "linear-gradient(180deg, var(--primary) 0%, var(--primary-2) 100%)",
  color: "#fff",
  fontWeight: 600,
  fontSize: 13.5,
  boxShadow: "0 6px 16px oklch(0.46 0.16 295 / 0.25)",
  whiteSpace: "nowrap",
};

export const secondaryButtonStyle: CSSProperties = {
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
};

export const dangerButtonStyle: CSSProperties = {
  ...secondaryButtonStyle,
  color: "var(--red)",
  borderColor: "oklch(0.88 0.05 25)",
  background: "var(--red-soft)",
};

export const smallButtonStyle: CSSProperties = {
  ...secondaryButtonStyle,
  padding: "6px 12px",
};
