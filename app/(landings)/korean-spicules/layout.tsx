import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { almarai } from "@/lib/fonts";
import "./landing.css";

export const metadata: Metadata = {
  title: "السبيكولز الكورية | عيادة د. مها دحلان",
  description:
    "علاج السبيكولز الكوري في جدة — إبر مجهرية طبيعية من الإسفنج البحري تفتح آلاف القنوات الدقيقة وتحفّز الكولاجين، لعلاج آثار الحبوب والمسام الواسعة والبهتان. نتائج الميكرونيدلينغ بدون جهاز وبإشراف خبيرات معتمدات.",
  openGraph: {
    title: "السبيكولز الكورية — ميكرونيدلينغ طبيعي بدون جهاز",
    description:
      "تقنية كورية أصيلة تجدد بشرتكِ خلال أسبوع: إبر طبيعية ١٠٠٪ تحفّز الكولاجين وتعالج آثار الحبوب والمسام. احجزي جلستكِ في عيادات د. مها دحلان.",
    locale: "ar_SA",
    type: "website",
    images: [{ url: "/korean-spicules/hero.webp", width: 1152, height: 1536 }],
  },
};

// Palette tokens — 100% black ground (#000), vivid orange accents, white ink.
// Declared inline so JSX reads them as CSS variables; shared usablecomponents
// (SectionEyebrow, …) resolve the same --color-kos-* names.
const paletteVars: CSSProperties = {
  "--color-kos-bg": "#000000",
  "--color-kos-surface": "#0e0e0e",
  "--color-kos-surface-2": "#171717",
  "--color-kos-ink": "#ffffff",
  "--color-kos-ink-soft": "#dcdcdc",
  "--color-kos-muted": "#9f9f9f",
  "--color-kos-primary": "#ff6b1a",
  "--color-kos-primary-dim": "#ff8a3d",
  "--color-kos-accent": "#ffb473",
  "--color-kos-deep": "#cf4e00",
  "--color-kos-line": "rgba(255, 107, 26, 0.24)",
  "--color-kos-line-soft": "rgba(255, 255, 255, 0.08)",
  background: "#000000",
  color: "#ffffff",
} as CSSProperties;

export default function KoreanSpiculesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`kos-landing relative ${almarai.variable}`}
      style={{
        ...paletteVars,
        fontFamily: "var(--font-almarai), system-ui, sans-serif",
      }}
    >
      {children}
    </div>
  );
}
