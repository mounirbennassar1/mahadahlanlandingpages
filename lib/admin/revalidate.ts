import { revalidatePath } from "next/cache";

export type ContentKind = "articles" | "categories" | "doctors" | "devices" | "offers" | "services";

/**
 * Revalidates the public routes (see lib/content.ts consumers) affected by a
 * change to one content kind. `slug` adds the detail page(s) when relevant.
 */
export function revalidateContent(kind: ContentKind, slug?: string | null) {
  const paths = new Set<string>();
  switch (kind) {
    case "articles":
      paths.add("/news-articles");
      if (slug) paths.add(`/news-articles/${slug}`);
      paths.add("/sitemap.xml");
      break;
    case "categories":
      paths.add("/news-articles");
      break;
    case "doctors":
      paths.add("/doctors");
      if (slug) paths.add(`/doctors/${slug}`);
      paths.add("/about-us");
      paths.add("/sitemap.xml");
      break;
    case "devices":
      paths.add("/our-devices");
      if (slug) paths.add(`/our-devices/${slug}`);
      paths.add("/sitemap.xml");
      break;
    case "offers":
      paths.add("/offers");
      paths.add("/book-now");
      break;
    case "services":
      paths.add("/book-now");
      break;
  }
  for (const p of paths) revalidatePath(p);
}
