import type { Metadata } from "next";
import Script from "next/script";
import { ConversionTracking } from "@/components/landing/ConversionTracking";
import "./landing.css";

export const metadata: Metadata = {
  title: "عيادة مها دحلان | البوتوكس والفيلر",
  description:
    "عيادة مها دحلان لتجميل الوجه — بوتوكس، فيلر جلدي، وتجديد البشرة بأيدي خبراء معتمدين.",
  openGraph: {
    title: "عيادة مها دحلان | البوتوكس والفيلر",
    description:
      "بوتوكس، فيلر جلدي، وتجديد البشرة بأيدي خبراء معتمدين — احجزي استشارتك في عيادات د. مها دحلان.",
    locale: "ar_SA",
    type: "website",
    siteName: "عيادات د. مها دحلان",
    images: [
      {
        url: "/botox/hero_section_botox.png",
        width: 1200,
        height: 630,
        alt: "عيادات د. مها دحلان — البوتوكس والفيلر",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "عيادة مها دحلان | البوتوكس والفيلر",
    description:
      "بوتوكس، فيلر جلدي، وتجديد البشرة بأيدي خبراء معتمدين في جدة.",
    images: ["/botox/hero_section_botox.png"],
  },
};

export default function BotoxLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="botox-landing">
      {/* GTM + Google Ads — scoped to this landing only */}
      <Script id="botox-gtm" strategy="afterInteractive">
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
      <Script id="botox-gtag-init" strategy="afterInteractive">
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

      <ConversionTracking slug="botox" />
      {children}
    </div>
  );
}
