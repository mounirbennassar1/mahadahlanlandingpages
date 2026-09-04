import { revalidatePath } from "next/cache";
import type { PageDef } from "./define";

/**
 * Bust the ISR cache for a page after its copy is saved.
 *
 * Home saves revalidate the root layout because the header, topbar and footer
 * copy lives in the home dictionary and renders on every `(site)` page too.
 */
export function revalidatePage(def: PageDef) {
  if (def.kind === "home") {
    revalidatePath("/", "layout");
  } else {
    revalidatePath(def.path, def.path.includes("[") ? "page" : undefined);
  }
  for (const extra of def.extraPaths ?? []) {
    revalidatePath(extra, extra.includes("[") ? "page" : undefined);
  }
  revalidatePath("/dashboard/pages");
  revalidatePath(`/dashboard/pages/${def.slug}/content`);
}
