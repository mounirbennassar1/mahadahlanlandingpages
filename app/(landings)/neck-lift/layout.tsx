import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { almarai, amiri } from "@/lib/fonts";
import "./landing.css";

export const metadata: Metadata = {
  title: "علاج ترهل الرقبة وعلامات التقدم بالسن | عيادة مها دحلان",
  description:
    "الخطوط الأفقية، الترهل أسفل الذقن، وفقدان تحديد خط الفك: نعالجها بتقنيات غير جراحية دقيقة في جدة. خيوط، هايفو، بوتوكس نفرتيتي، فيلر خط الفك وسكين بوستر، بإشراف طبي متخصص وخصوصية تامة في عيادة د. مها دحلان.",
  openGraph: {
    title: "علاج ترهل الرقبة وعلامات التقدم بالسن | عيادة مها دحلان",
    description:
      "عمرُكِ سرٌّ لا يعرفه أحد، ورقبتُكِ لن تُفشيَه بعد اليوم. تقنيات غير جراحية تعيد لعنقك شدّه وتحديده بنتائج طبيعية.",
    locale: "ar_SA",
    type: "website",
    images: [{ url: "/neck-lift/hero-main.jpg", width: 1536, height: 2048 }],
  },
};

// Palette tokens from the imported Claude Design: warm ivory ground,
// bronze/champagne gold accents, deep coffee ink.
const paletteVars: CSSProperties = {
  "--color-nkl-bg": "#FBF8F3",
  "--color-nkl-band": "#F5EFE4",
  "--color-nkl-card": "#FFFDF9",
  "--color-nkl-ink": "#271C11",
  "--color-nkl-ink-soft": "#5C4526",
  "--color-nkl-muted": "rgba(39,28,17,.62)",
  "--color-nkl-bronze": "#8A6430",
  "--color-nkl-gold": "#A67C3D",
  "--color-nkl-gold-bright": "#C99C4E",
  "--color-nkl-champagne": "#E0BE7A",
  "--color-nkl-cream": "#FAF4E8",
  "--color-nkl-dark": "#271C11",
  "--color-nkl-line": "rgba(166,124,61,.18)",
  "--color-nkl-line-strong": "rgba(166,124,61,.35)",
  background: "#FBF8F3",
  color: "#271C11",
} as CSSProperties;

export default function NeckLiftLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      dir="rtl"
      lang="ar"
      className={`nkl-landing relative overflow-clip ${almarai.variable} ${amiri.variable}`}
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
