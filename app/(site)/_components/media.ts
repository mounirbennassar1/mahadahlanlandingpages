/**
 * Small helpers for DB-driven media on the site pages (doctors, devices).
 * Server-safe: no React, no Prisma.
 */

/** Remote hosts allowed in next.config.ts `images.remotePatterns`. */
const REMOTE_HOSTS = [
  /\.public\.blob\.vercel-storage\.com$/,
  /^res\.cloudinary\.com$/,
  /^mahadahlan\.com$/,
  /^images\.unsplash\.com$/,
  /^lh3\.googleusercontent\.com$/,
];

/**
 * Returns the src when `next/image` can render it (a local `/path` or an
 * allowed https host); otherwise null so the caller falls back to a monogram
 * instead of crashing the page on an unconfigured host.
 */
export function safeImageSrc(src: string | null | undefined): string | null {
  if (!src) return null;
  const value = src.trim();
  if (!value) return null;
  if (value.startsWith("/")) return value;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return null;
    return REMOTE_HOSTS.some((re) => re.test(url.hostname)) ? value : null;
  } catch {
    return null;
  }
}

/** "د. مها دحلان" → "م", "نضال الجريدي" → "ن". */
export function initialOf(name: string) {
  const clean = name.replace(/^(د|دكتورة|دكتور|أ)\.?\s+/u, "").trim();
  return clean.charAt(0) || "م";
}

/**
 * First sentence of a bio, ignoring the period in the "د." honorific
 * ("مؤسسة مجمع عيادات د. مها دحلان الطبي في جدة." stays whole).
 */
export function firstSentence(text: string | null | undefined) {
  if (!text) return "";
  const match = text.match(/^[\s\S]*?(?<!د)[.؟!](?=\s|$)/u);
  return (match ? match[0] : text).trim();
}

/** Word-safe truncation for meta descriptions. */
export function truncate(text: string, max = 160) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max).replace(/\s+\S*$/, "")}…`;
}

/** Bio text → paragraphs (the dashboard stores plain text with newlines). */
export function paragraphsOf(text: string | null | undefined) {
  if (!text) return [];
  return text
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}
