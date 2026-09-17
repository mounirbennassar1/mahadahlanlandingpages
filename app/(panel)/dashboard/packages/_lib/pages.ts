import { PAGES, getPageDef } from "@/lib/pages/registry";

export type PageOption = { slug: string; title: string; path: string };

/** Value the form posts for "show on every page". */
export const EVERY_PAGE = "";

/**
 * Pages a package can be attached to: every landing, in registry order.
 * The offers page sells Offers instead, and the home / site pages have no
 * pay button, so they are not listed.
 */
export function packagePageOptions(current?: string | null): PageOption[] {
  const out = PAGES.filter((p) => p.kind === "landing").map((p) => ({ slug: p.slug, title: p.title, path: p.path }));
  if (current && !out.some((o) => o.slug === current)) {
    const def = getPageDef(current);
    out.push({ slug: current, title: def?.title ?? current, path: def?.path ?? `/${current}` });
  }
  return out;
}

export function pageTitle(slug: string | null) {
  if (!slug) return "Every page";
  return getPageDef(slug)?.title ?? slug;
}
