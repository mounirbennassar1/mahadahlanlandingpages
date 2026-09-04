import type { CSSProperties } from "react";
import { almarai } from "@/lib/fonts";
import "./landing.css";

// Midnight-aubergine editorial palette: near-black violet ground, warm ink,
// the clinic gold as the accent thread, hairline rules instead of glows.
// A deeper "night" tone marks the results + booking bands.
const paletteVars: CSSProperties = {
  "--color-che-bg": "#140C22",
  "--color-che-bg-2": "#1B1130",
  "--color-che-card": "#1D1232",
  "--color-che-ink": "#F4EEFA",
  "--color-che-ink-2": "#CDBFE2",
  "--color-che-muted": "rgba(244,238,250,.6)",
  "--color-che-gold": "#C9A45C",
  "--color-che-gold-bright": "#E5C77F",
  "--color-che-gold-deep": "#9A7434",
  "--color-che-plum": "#5C3B8E",
  "--color-che-line": "rgba(244,238,250,.12)",
  "--color-che-line-strong": "rgba(244,238,250,.28)",
  "--color-che-line-gold": "rgba(201,164,92,.4)",
  "--color-che-night": "#0E0719",
  "--color-che-night-ink": "#F6EFFA",
  background: "#140C22",
  color: "#F4EEFA",
} as CSSProperties;

export default function ChronicEczemaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      dir="rtl"
      lang="ar"
      className={`che-landing relative overflow-clip ${almarai.variable}`}
      style={{
        ...paletteVars,
        fontFamily: "var(--font-almarai), system-ui, sans-serif",
        lineHeight: 1.7,
      }}
    >
      {children}
    </div>
  );
}
