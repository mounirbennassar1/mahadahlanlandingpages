import type { CSSProperties } from "react";

/**
 * Tokens the checkout UI reads. The sheet is portal-mounted outside every
 * landing's palette wrapper, so it carries its own; the inline panel picks the
 * set that matches the landing it sits in.
 */
export type CheckoutTheme = "dark" | "light";

export const GOLD = "linear-gradient(135deg, #8A6430, #E0BE7A 50%, #A67C3D)";

const DARK: CSSProperties = {
  "--ck-bg": "#120D07",
  "--ck-card": "#1A130B",
  "--ck-field": "rgba(246,238,223,0.05)",
  "--ck-line": "rgba(232,195,106,0.18)",
  "--ck-line-strong": "rgba(232,195,106,0.38)",
  "--ck-text": "#F6EEDF",
  "--ck-muted": "rgba(246,238,223,0.62)",
  "--ck-faint": "rgba(246,238,223,0.42)",
  "--ck-gold": "#E8C36A",
  "--ck-champagne": "#F0D48A",
  "--ck-ink": "#241A0E",
  "--ck-selected": "rgba(232,195,106,0.1)",
  "--ck-error-bg": "rgba(244,63,94,0.1)",
  "--ck-error-line": "rgba(251,113,133,0.3)",
  "--ck-error-text": "#FDA4AF",
} as CSSProperties;

const LIGHT: CSSProperties = {
  "--ck-bg": "#FFFFFF",
  "--ck-card": "#FBF7EF",
  "--ck-field": "#FFFFFF",
  "--ck-line": "rgba(138,100,48,0.18)",
  "--ck-line-strong": "rgba(138,100,48,0.35)",
  "--ck-text": "#1F1810",
  "--ck-muted": "rgba(31,24,16,0.64)",
  "--ck-faint": "rgba(31,24,16,0.48)",
  "--ck-gold": "#A67C3D",
  "--ck-champagne": "#8A6430",
  "--ck-ink": "#241A0E",
  "--ck-selected": "rgba(224,190,122,0.16)",
  "--ck-error-bg": "rgba(244,63,94,0.06)",
  "--ck-error-line": "rgba(225,29,72,0.3)",
  "--ck-error-text": "#BE123C",
} as CSSProperties;

export function themeVars(theme: CheckoutTheme): CSSProperties {
  return theme === "light" ? LIGHT : DARK;
}
