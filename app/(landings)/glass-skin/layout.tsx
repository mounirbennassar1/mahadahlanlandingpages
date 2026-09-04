import type { CSSProperties } from "react";
import { plexArabic } from "@/lib/fonts";
import "./landing.css";

// Palette tokens — near-black ground (#0b0c0e), gold accents, white ink.
// Declared inline so JSX can read them as CSS variables without a
// per-landing CSS token block. Shared usablecomponents read the same names.
const paletteVars: CSSProperties = {
  "--color-gls-bg": "#0b0c0e",
  "--color-gls-bg-deep": "#060708",
  "--color-gls-surface": "#16181b",
  "--color-gls-surface-2": "#1d2024",
  "--color-gls-ink": "#ffffff",
  "--color-gls-ink-soft": "#d7dadc",
  "--color-gls-muted": "#a2a8ad",
  "--color-gls-primary": "#d4af37",
  "--color-gls-primary-dim": "#e2c565",
  "--color-gls-accent": "#f0d98c",
  "--color-gls-gold-deep": "#a9852b",
  "--color-gls-line": "rgba(212, 175, 55, 0.22)",
  "--color-gls-line-soft": "rgba(255, 255, 255, 0.08)",
  background: "#0b0c0e",
  color: "#ffffff",
} as CSSProperties;

export default function GlassSkinLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`gls-landing relative ${plexArabic.variable}`}
      style={{
        ...paletteVars,
        fontFamily: "var(--font-plex-arabic), system-ui, sans-serif",
      }}
    >
      {children}
    </div>
  );
}
