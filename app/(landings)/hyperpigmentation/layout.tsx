import type { Metadata } from "next";
import { almarai, cormorant } from "@/lib/fonts";
import "./landing.css";

export const metadata: Metadata = {
  title: "مهادهلان — علاج التصبغات",
  description:
    "برنامج علاج التصبّغات في مهادهلان: جلسات هادئة، مكوّنات نقية، وخطة شخصية ترسمها طبيبتنا لتعيد إلى وجهكِ توازنه الطبيعي ولونه الصافي.",
};

export default function HyperpigmentationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`hp-landing ${almarai.variable} ${cormorant.variable}`}>
      {children}
    </div>
  );
}
