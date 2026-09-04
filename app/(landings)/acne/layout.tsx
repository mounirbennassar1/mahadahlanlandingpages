import Script from "next/script";
import { ConversionTracking } from "@/components/landing/ConversionTracking";
import "./landing.css";

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

      <ConversionTracking slug="acne" />
      {children}
    </div>
  );
}
