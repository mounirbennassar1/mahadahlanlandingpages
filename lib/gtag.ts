/**
 * Client-side Google Ads conversion firing.
 *
 * The landing layout injects a server-rendered window.__mdConversions object
 * that maps event type → { conversionId, conversionLabel }. This module wraps
 * the read + gtag('event','conversion',...) call.
 *
 * Two ways to fire a conversion:
 *
 *   1. Forms call fireConversion("form") on submit-success.
 *   2. WhatsApp clicks are picked up automatically by the global delegated
 *      listener installed in installWhatsAppConversionListener() — no per-anchor
 *      onClick needed.
 *
 * Loading order safety: if gtag isn't ready when fireConversion runs (rare —
 * gtag.js is afterInteractive in the layouts), the conversion is dropped
 * silently. Adding a queue would buffer the very first click on an extremely
 * cold page, which isn't worth the complexity.
 */

export type LandingConversionEntry = {
  conversionId: string;
  conversionLabel: string;
};

export type LandingConversions = {
  whatsapp: LandingConversionEntry | null;
  form: LandingConversionEntry | null;
};

declare global {
  interface Window {
    __mdConversions?: LandingConversions;
    __mdConversionListenerInstalled?: boolean;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

type ConversionKind = "whatsapp" | "form";

export function fireConversion(kind: ConversionKind): void {
  if (typeof window === "undefined") return;
  const entry = window.__mdConversions?.[kind];
  if (!entry) return;
  const sendTo = `${entry.conversionId}/${entry.conversionLabel}`;
  try {
    window.gtag?.("event", "conversion", { send_to: sendTo });
  } catch {
    // Ad-blocker stripped gtag; nothing useful to do.
  }
}

/**
 * Install a single delegated click listener that fires the WhatsApp
 * conversion whenever a wa.me link is clicked anywhere on the page. Safe to
 * call multiple times — guarded by a window flag.
 */
export function installWhatsAppConversionListener(): void {
  if (typeof window === "undefined") return;
  if (window.__mdConversionListenerInstalled) return;
  window.__mdConversionListenerInstalled = true;

  document.addEventListener(
    "click",
    (e) => {
      const target = e.target as Element | null;
      if (!target) return;
      const anchor = target.closest?.("a[href*='wa.me']") as HTMLAnchorElement | null;
      if (!anchor) return;
      fireConversion("whatsapp");
    },
    { capture: true },
  );
}
