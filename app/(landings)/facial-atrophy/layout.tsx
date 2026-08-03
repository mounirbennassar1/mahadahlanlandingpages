import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { almarai, amiri } from "@/lib/fonts";
import "./landing.css";

export const metadata: Metadata = {
  title: "علاج ضمور الوجه بعد إبر التنحيف | عيادة مها دحلان",
  description:
    "خسرتِ الوزن بنجاح؟ نعيد لوجهكِ امتلاءه وإشراقته. علاج ضمور الوجه (وجه الأوزمبك) في جدة — فيلر، دهون ذاتية، محفزات كولاجين، خيوط وشد بالهايفو، بخطة تُصمَّم لكِ وحدك وبخصوصية تامة في عيادة د. مها دحلان.",
  openGraph: {
    title: "علاج ضمور الوجه بعد إبر التنحيف — عيادة مها دحلان",
    description:
      "فقدان الوزن السريع قد يترك ملامحك أنحف وأكثر إرهاقاً مما ينبغي. نعيد التوازن لملامحك بنتائج طبيعية وخصوصية تامة.",
    locale: "ar_SA",
    type: "website",
    images: [{ url: "/facial-atrophy/hero-center.jpg", width: 1536, height: 2048 }],
  },
};

// Palette tokens from the imported Claude Design — deep burgundy ground,
// antique-gold accents, warm ivory ink.
const paletteVars: CSSProperties = {
  "--color-faa-bg": "#150409",
  "--color-faa-surface": "#22070F",
  "--color-faa-surface-2": "#35101C",
  "--color-faa-card": "#2E0D18",
  "--color-faa-card-2": "#1D060D",
  "--color-faa-ink": "#F3E9DC",
  "--color-faa-ink-soft": "#E8D5B5",
  "--color-faa-muted": "rgba(243,233,220,.65)",
  "--color-faa-gold": "#D9B36C",
  "--color-faa-gold-bright": "#F0D48A",
  "--color-faa-gold-deep": "#A67C3D",
  "--color-faa-gold-pale": "#F7E7B3",
  "--color-faa-cta-ink": "#2A0913",
  "--color-faa-line": "rgba(217,179,108,.18)",
  "--color-faa-line-strong": "rgba(217,179,108,.35)",
  background: "#150409",
  color: "#F3E9DC",
} as CSSProperties;

export default function FacialAtrophyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      dir="rtl"
      lang="ar"
      className={`faa-landing relative overflow-clip ${almarai.variable} ${amiri.variable}`}
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
