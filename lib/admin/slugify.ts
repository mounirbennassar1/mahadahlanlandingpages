/**
 * Pure slugify shared by the browser (SlugInput) and the server.
 * Keeps Arabic + Latin letters and digits, replaces whitespace with `-`,
 * strips punctuation and Arabic diacritics (tashkeel).
 */
export function slugify(input: string) {
  return input
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670\u0640]/g, "")
    .replace(/[^\p{L}\p{N}\s_-]/gu, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120);
}

export const SLUG_PATTERN = /^[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*$/u;
