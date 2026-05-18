import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { almarai } from "@/lib/fonts";
import "./landing.css";

export const metadata: Metadata = {
  title: "علاج البشرة بتقنية الميكرونيدلينغ بالترددات الراديوية | عيادة د. مها دحلان",
  description:
    "برنامج طبي متخصص في علاج البشرة بتقنية الميكرونيدلينغ بالترددات الراديوية بأحدث التقنيات في عيادات د. مها دحلان.",
  openGraph: {
    title: "علاج البشرة بتقنية الميكرونيدلينغ بالترددات الراديوية",
    description: "برنامج طبي متخصص في علاج البشرة بتقنية الميكرونيدلينغ بالترددات الراديوية بأحدث التقنيات في عيادات د. مها دحلان.",
    locale: "ar_SA",
    type: "website",
  },
};

// Palette tokens — declared inline so the JSX can read them via
// `bg-[var(--color-mrf-primary)]` without a per-landing CSS rule.
// The only stylesheet is `landing.css`, which holds the bits Tailwind
// can't express (marquee keyframes, ::selection, grain pseudo-element).
const paletteVars: CSSProperties = {
  "--color-mrf-bg": "#fff9f4",
  "--color-mrf-surface": "#ffffff",
  "--color-mrf-ink": "#2e1f1a",
  "--color-mrf-ink-soft": "#6e5a52",
  "--color-mrf-muted": "#a08982",
  "--color-mrf-primary": "#c47d6e",
  "--color-mrf-primary-dim": "#9a5a4e",
  "--color-mrf-accent": "#e3a695",
  "--color-mrf-line": "rgba(46, 31, 26, 0.08)",
  background: "#fff9f4",
  color: "#2e1f1a",
} as CSSProperties;

export default function MicroneedlingRfLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`mrf-landing font-[var(--font-almarai)] ${almarai.variable}`}
      style={paletteVars}
    >
      {children}
    </div>
  );
}
