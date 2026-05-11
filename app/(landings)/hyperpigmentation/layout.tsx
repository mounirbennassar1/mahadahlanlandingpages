import type { Metadata } from "next";
import { almarai, cormorant } from "@/lib/fonts";
import "./landing.css";

export const metadata: Metadata = {
  title: "مهادهلان — علاج التصبغات",
  description:
    "برنامج علاج التصبّغات في مهادهلان: جلسات هادئة، مكوّنات نقية، وخطة شخصية ترسمها طبيبتنا لتعيد إلى وجهكِ توازنه الطبيعي ولونه الصافي.",
  openGraph: {
    title: "مهادهلان — علاج التصبغات",
    description:
      "برنامج علاج التصبّغات: جلسات هادئة، مكوّنات نقية، وخطة شخصية ترسمها طبيبتنا لتعيد إلى وجهكِ لونه الصافي.",
    locale: "ar_SA",
    type: "website",
    siteName: "عيادات د. مها دحلان",
    images: [
      {
        url: "/hyperpigmentation/afterbeforehero.png",
        width: 1200,
        height: 630,
        alt: "عيادات د. مها دحلان — علاج التصبّغات",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "مهادهلان — علاج التصبغات",
    description:
      "برنامج علاج التصبّغات في عيادات د. مها دحلان — خطة شخصية ونتائج موثّقة.",
    images: ["/hyperpigmentation/afterbeforehero.png"],
  },
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
