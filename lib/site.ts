/**
 * Public site origin + image-host helpers shared by the site pages, the
 * sitemap and the JSON-LD blocks. Keep this module free of server-only
 * imports so client components can use it too.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://mahadahlan.com"
).replace(/\/+$/, "");

export const SITE_NAME = "عيادات د. مها دحلان";

export function absoluteUrl(path: string) {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

/** Hosts whitelisted in `next.config.ts` → `images.remotePatterns`. */
const OPTIMIZABLE_HOSTS = [
  /(^|\.)public\.blob\.vercel-storage\.com$/,
  /^res\.cloudinary\.com$/,
  /^mahadahlan\.com$/,
  /^images\.unsplash\.com$/,
  /^lh3\.googleusercontent\.com$/,
];

/**
 * `next/image` throws at render time for remote hosts that are not in
 * `remotePatterns`. Dashboard image URLs may point anywhere, so callers pass
 * `unoptimized={!isOptimizableImage(src)}` to degrade gracefully instead.
 */
export function isOptimizableImage(src: string) {
  if (src.startsWith("/")) return true;
  try {
    const url = new URL(src);
    return (
      url.protocol === "https:" &&
      OPTIMIZABLE_HOSTS.some((re) => re.test(url.hostname))
    );
  } catch {
    return false;
  }
}
