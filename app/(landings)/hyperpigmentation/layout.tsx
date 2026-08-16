import type { Metadata } from "next";
import Script from "next/script";
import { almarai, cormorant } from "@/lib/fonts";
import { ConversionTracking } from "@/components/landing/ConversionTracking";
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
        url: "/hyperpigmentation/afterbeforehero.webp",
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
    images: ["/hyperpigmentation/afterbeforehero.webp"],
  },
};

export default function HyperpigmentationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`hp-landing ${almarai.variable} ${cormorant.variable}`}>
      {/* GTM + Google Ads — scoped to this landing only */}
      <Script id="hp-gtm" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-ML8NWCR');`}
      </Script>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=AW-10989762778"
        strategy="afterInteractive"
      />
      <Script id="hp-gtag-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'AW-10989762778');`}
      </Script>

      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-ML8NWCR"
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>

      <ConversionTracking slug="hyperpigmentation" />
      {children}
    </div>
  );
}
