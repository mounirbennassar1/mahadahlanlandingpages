import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Script from "next/script";
import { almarai } from "@/lib/fonts";
import { ConversionTracking } from "@/components/landing/ConversionTracking";
import "./landing.css";

export const metadata: Metadata = {
  title: "علاج البشرة بتقنية الميكرونيدلينغ بالترددات الراديوية | عيادة د. مها دحلان",
  description:
    "برنامج طبي متخصص في علاج البشرة بتقنية الميكرونيدلينغ بالترددات الراديوية بأحدث التقنيات في عيادات د. مها دحلان.",
  openGraph: {
    title: "علاج البشرة بتقنية الميكرونيدلينغ بالترددات الراديوية",
    description: "برنامج طبي متخصص في علاج البشرة بتقنية الميكرونيدلينغ بالترددات الراديوية بأحدث التقنيات في عيادات د. مها دحلان.",
    locale: "ar_SA",
    type: "website",
  },
};

// Palette tokens — declared inline so the JSX can read them via
// `bg-[var(--color-mrf-primary)]` without a per-landing CSS rule.
// The only stylesheet is `landing.css`, which holds the bits Tailwind
// can't express (marquee keyframes, ::selection, grain pseudo-element).
const paletteVars: CSSProperties = {
  "--color-mrf-bg": "#fbf8f3",
  "--color-mrf-surface": "#ffffff",
  "--color-mrf-ink": "#2e1f1a",
  "--color-mrf-ink-soft": "#6e5a52",
  "--color-mrf-muted": "#a08982",
  "--color-mrf-primary": "#c47d6e",
  "--color-mrf-primary-dim": "#9a5a4e",
  "--color-mrf-accent": "#e3a695",
  "--color-mrf-line": "rgba(46, 31, 26, 0.08)",
  background: "#fbf8f3",
  color: "#2e1f1a",
} as CSSProperties;

export default function MicroneedlingRfLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`mrf-landing font-[var(--font-almarai)] ${almarai.variable}`}
      style={paletteVars}
    >
      {/* GTM + Google Ads — scoped to this landing only */}
      <Script id="mrf-gtm" strategy="afterInteractive">
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
      <Script id="mrf-gtag-init" strategy="afterInteractive">
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

      <ConversionTracking slug="microneedling-rf" />
      {children}
    </div>
  );
}
