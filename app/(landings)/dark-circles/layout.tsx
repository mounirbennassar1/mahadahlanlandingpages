import type { Metadata } from "next";
import Script from "next/script";
import { plexArabic } from "@/lib/fonts";
import "./landing.css";

export const metadata: Metadata = {
  title: "علاج الهالات والتصبّغات حول العين | عيادة د. مها دحلان",
  description:
    "برنامج طبي متخصص في علاج الهالات السوداء والتصبّغات حول العين بأحدث التقنيات في جدة. بشرة موحّدة، نظرة أكثر إشراقاً، ونتائج حقيقية تدوم.",
  openGraph: {
    title: "علاج الهالات والتصبّغات حول العين",
    description:
      "برنامج طبي متخصص في علاج الهالات والتصبّغات حول العين بأحدث التقنيات في جدة.",
    locale: "ar_SA",
    type: "website",
  },
};

export default function DarkCirclesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`dc-landing ${plexArabic.variable}`}>
      <Script id="dc-gtm" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-ML8NWCR');`}
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
