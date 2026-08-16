import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { almarai } from "@/lib/fonts";
import "./landing.css";

export const metadata: Metadata = {
  title: "علاج تشقق القدمين والكعبين | عيادة مها دحلان",
  description:
    "جفاف وخشونة وتشققات عميقة في الكعبين؟ بروتوكول عناية طبية متكامل في جدة: باديكير طبي معقم، تقشير علاجي، ترطيب عميق وعلاج التصبغات، بإشراف طبي متخصص وطاقم نسائي بالكامل في عيادة د. مها دحلان.",
  openGraph: {
    title: "علاج تشقق القدمين والكعبين | عيادة مها دحلان",
    description:
      "قدمان ناعمتان تليقان بكِ في كل خطوة. بروتوكول طبي متكامل لعلاج تشقق الكعبين: باديكير طبي، تقشير علاجي، ترطيب عميق ومتابعة حتى النتيجة.",
    locale: "ar_SA",
    type: "website",
    images: [{ url: "/cracked-heels/hero.webp", width: 1536, height: 2048 }],
  },
};

// Palette: warm espresso/chocolate ground, bronze + gold accents, warm cream
// ink. A "spa luxury, warm oils and silk" mood for foot care and renewal.
const paletteVars: CSSProperties = {
  "--color-crh-bg": "#1C120C",
  "--color-crh-bg-deep": "#140D08",
  "--color-crh-band": "#231710",
  "--color-crh-card": "#2A1B12",
  "--color-crh-cream": "#F4E9D8",
  "--color-crh-cream-soft": "rgba(244,233,216,.78)",
  "--color-crh-muted": "rgba(244,233,216,.62)",
  "--color-crh-faint": "rgba(244,233,216,.42)",
  "--color-crh-bronze": "#B08D57",
  "--color-crh-bronze-deep": "#8C6A3F",
  "--color-crh-gold": "#D4AF37",
  "--color-crh-gold-soft": "#E4C87E",
  "--color-crh-line": "rgba(176,141,87,.22)",
  "--color-crh-line-strong": "rgba(176,141,87,.42)",
  background: "#1C120C",
  color: "#F4E9D8",
} as CSSProperties;

export default function CrackedHeelsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      dir="rtl"
      lang="ar"
      className={`crh-landing relative overflow-clip ${almarai.variable}`}
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
