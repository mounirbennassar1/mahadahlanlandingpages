import type { Metadata } from "next";
import Script from "next/script";
import { notoKufiArabic } from "@/lib/fonts";
import "./landing.css";

export const metadata: Metadata = {
  title: "عيادات د. مها دحلان | Dr. Maha Dahlan Clinics",
  description:
    "باقة متكاملة من جلسات العناية بالبشرة وتنظيف البشرة والهايدرافيشل وعلاج تساقط الشعر.",
};

export default function FacialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`facial-landing ${notoKufiArabic.variable}`}>
      {/* GTM + Google Ads — scoped to this landing only */}
      <Script id="facial-gtm" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-ML8NWCR');`}
      </Script>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=AW-707324287"
        strategy="afterInteractive"
      />
      <Script id="facial-gtag-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
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
