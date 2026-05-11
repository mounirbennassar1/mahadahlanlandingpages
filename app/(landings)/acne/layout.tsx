import type { Metadata } from "next";
import Script from "next/script";
import "./landing.css";

export const metadata: Metadata = {
  title: {
    default: "عيادات د. مها دحلان | علاج حب الشباب وآثاره في جدة",
    template: "%s | عيادات د. مها دحلان",
  },
  description:
    "احجز استشارتك الآن في عيادات د. مها دحلان – الخيار الأول لعلاج حب الشباب وآثاره في جدة بأحدث أجهزة الليزر والتقنيات الطبية العالمية وبإشراف نخبة من استشاريي الجلدية والتجميل. أكثر من 20 عاماً من الخبرة.",
  keywords: [
    "علاج حب الشباب جدة",
    "إزالة آثار حب الشباب",
    "د. مها دحلان",
    "عيادات جلدية جدة",
    "أفضل دكتورة جلدية جدة",
    "علاج حبوب الوجه",
    "ليزر حب الشباب",
    "جلدية وتجميل وليزر جدة",
    "بشرة صافية",
    "مجمع عيادات د. مها دحلان الطبي",
  ],
  openGraph: {
    title: "عيادات د. مها دحلان | علاج حب الشباب وآثاره في جدة",
    description:
      "استعد ثقتك ببشرتك الصافية مع أحدث التقنيات الطبية العالمية في عيادات د. مها دحلان بجدة. أكثر من 20 عاماً من الخبرة في علاج حب الشباب.",
    locale: "ar_SA",
    type: "website",
    siteName: "عيادات د. مها دحلان",
    url: "https://acne.mahadahlan.com",
    images: [
      {
        url: "/acne/logo.avif",
        width: 1200,
        height: 630,
        alt: "عيادات د. مها دحلان — علاج حب الشباب",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "عيادات د. مها دحلان | علاج حب الشباب في جدة",
    description:
      "استعد ثقتك ببشرتك الصافية مع أحدث التقنيات الطبية العالمية في عيادات د. مها دحلان بجدة.",
    images: ["/acne/logo.avif"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://acne.mahadahlan.com",
  },
};

export default function AcneLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="acne-landing">
      {/* Google Tag Manager + Google Ads — scoped to this landing */}
      <Script id="acne-gtm" strategy="afterInteractive">
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
      <Script id="acne-gtag-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'AW-10989762778');`}
      </Script>

      {/* GTM noscript fallback — hidden iframe, safe to nest inside the layout div */}
      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-ML8NWCR"
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>

      {children}
    </div>
  );
}
