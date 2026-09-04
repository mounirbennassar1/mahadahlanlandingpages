import type { CSSProperties } from "react";
import { almarai } from "@/lib/fonts";
import "./landing.css";

// Palette: "liquid gold on black silk" — obsidian grounds, radiant gold
// accents, warm ivory ink. Unique identity for the hair-breakage landing.
const paletteVars: CSSProperties = {
  "--color-hab-bg": "#0B0B0D",
  "--color-hab-bg-deep": "#060607",
  "--color-hab-band": "#101014",
  "--color-hab-card": "#14141A",
  "--color-hab-ink": "#F5EFE0",
  "--color-hab-ink-soft": "#E9DFC8",
  "--color-hab-muted": "rgba(245,239,224,.6)",
  "--color-hab-gold": "#D4AF37",
  "--color-hab-gold-soft": "#C9A45C",
  "--color-hab-champagne": "#F0D48A",
  "--color-hab-bronze": "#8A6430",
  "--color-hab-line": "rgba(212,175,55,.16)",
  "--color-hab-line-strong": "rgba(212,175,55,.34)",
  background: "#0B0B0D",
  color: "#F5EFE0",
} as CSSProperties;

export default function HairBreakageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      dir="rtl"
      lang="ar"
      className={`hab-landing relative overflow-clip ${almarai.variable}`}
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
