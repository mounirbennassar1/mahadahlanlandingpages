/**
 * Read UTM params from the current browser URL.
 *
 * Returns an object with `utmSource`, `utmMedium`, `utmCampaign`, `utmContent`,
 * `utmTerm` keys (only the ones present in the URL). Spread the result into a
 * lead-submission payload to record where the visitor came from:
 *
 *     fetch("/api/leads", {
 *       method: "POST",
 *       body: JSON.stringify({ fullName, phone, city, source: "hair", ...readUtmFromUrl() }),
 *     });
 *
 * Safe to call on the server (SSR/SSG) — returns an empty object.
 */
export function readUtmFromUrl(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const map: Record<string, string> = {
    utm_source: "utmSource",
    utm_medium: "utmMedium",
    utm_campaign: "utmCampaign",
    utm_content: "utmContent",
    utm_term: "utmTerm",
  };
  const out: Record<string, string> = {};
  for (const [param, key] of Object.entries(map)) {
    const value = params.get(param);
    if (value) out[key] = value;
  }
  return out;
}
