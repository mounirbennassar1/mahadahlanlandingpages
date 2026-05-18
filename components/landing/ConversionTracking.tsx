import Script from "next/script";
import { getConversionsForSlug } from "@/lib/conversions";

/**
 * Drop this Server Component into a landing's layout to wire up Google Ads
 * conversion tracking for that slug. It:
 *
 *   1. Server-fetches the (WHATSAPP, FORM) conversion IDs for the slug
 *      and inlines them as window.__mdConversions before any interaction.
 *   2. Boots a delegated click listener so every wa.me link on the page
 *      fires the WhatsApp conversion automatically — no per-anchor wiring.
 *
 * Forms still call fireConversion("form") on submit-success themselves
 * (one line at the success branch).
 *
 * Place it inside the landing's <div className="..."> AFTER the existing
 * gtag.js <Script> tags so window.gtag is defined by the time a conversion
 * fires.
 */
export async function ConversionTracking({ slug }: { slug: string }) {
  const config = await getConversionsForSlug(slug);

  return (
    <>
      <Script
        id={`md-conv-config-${slug}`}
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.__mdConversions=${JSON.stringify(config)};`,
        }}
      />
      <Script
        id={`md-conv-listener-${slug}`}
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(){if(window.__mdConversionListenerInstalled)return;window.__mdConversionListenerInstalled=true;document.addEventListener('click',function(e){var t=e.target;if(!t||!t.closest)return;var a=t.closest("a[href*='wa.me']");if(!a)return;var c=window.__mdConversions&&window.__mdConversions.whatsapp;if(!c||!window.gtag)return;try{window.gtag('event','conversion',{send_to:c.conversionId+'/'+c.conversionLabel});}catch(_){}}, true);})();`,
        }}
      />
    </>
  );
}
