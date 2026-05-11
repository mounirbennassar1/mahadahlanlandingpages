import type { Metadata } from "next";
import Script from "next/script";
import { plexArabic } from "@/lib/fonts";
import "./landing.css";

export const metadata: Metadata = {
  title: "عيادة مها دهلان لمعالجة تساقط الشعر",
  description:
    "عيادة د. مها دهلان - حلول طبية متكاملة لعلاج تساقط الشعر وزراعته بأحدث التقنيات في جدة",
  openGraph: {
    title: "عيادة مها دهلان لمعالجة تساقط الشعر",
    description:
      "عيادة د. مها دهلان - حلول طبية متكاملة لعلاج تساقط الشعر وزراعته بأحدث التقنيات في جدة",
    images: ["/hair/logo.avif"],
  },
};

export default function HairLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`hair-landing ${plexArabic.variable}`}>
      {/* React 19 hoists <link rel="stylesheet"> to <head>. */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
      />

      {/* GTM + 2 Google Ads conversion IDs — scoped to this landing only */}
      <Script id="hair-gtm" strategy="afterInteractive">
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
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=AW-707324287"
        strategy="afterInteractive"
      />
      <Script id="hair-gtag-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'AW-10989762778');
gtag('config', 'AW-707324287');`}
      </Script>

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
