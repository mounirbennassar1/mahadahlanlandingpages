import Script from "next/script";
import { cairo, plexArabic } from "@/lib/fonts";
import { ConversionTracking } from "@/components/landing/ConversionTracking";
import "./landing.css";

export default function BodyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`body-landing ${cairo.variable} ${plexArabic.variable}`}>
      {/* GTM + Google Ads conversion tags — scoped to this landing only */}
      <Script id="body-gtm" strategy="afterInteractive">
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
      <Script id="body-gtag-init" strategy="afterInteractive">
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

      <ConversionTracking slug="body" />
      {children}
    </div>
  );
}
