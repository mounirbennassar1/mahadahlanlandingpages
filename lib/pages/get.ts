import "server-only";
import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { mergeContent, type Overrides } from "./merge";
import type { ContentOf, PageDef } from "./define";

/**
 * Server-side reads for page copy. Both helpers are wrapped in React `cache()`
 * so `generateMetadata` and the page body share a single query per request.
 */

export const getPageOverrides = cache(async (slug: string): Promise<Overrides> => {
  const row = await prisma.pageContent.findUnique({
    where: { slug },
    select: { data: true },
  });
  return (row?.data as Overrides | undefined) ?? {};
});

export const getPageContent = cache(
  async <P extends PageDef>(def: P): Promise<ContentOf<P>> => {
    return mergeContent(def, await getPageOverrides(def.slug));
  },
);

export type ContentStatus = {
  slug: string;
  updatedAt: Date;
  editedBy: string | null;
  changedFields: number;
};

/** Per-slug "customized or default" summary for the /dashboard/pages index. */
export async function getContentStatus(): Promise<Map<string, ContentStatus>> {
  const rows = await prisma.pageContent.findMany({
    select: { slug: true, data: true, updatedAt: true, updatedBy: { select: { name: true } } },
  });
  const out = new Map<string, ContentStatus>();
  for (const row of rows) {
    const data = (row.data as Overrides | null) ?? {};
    out.set(row.slug, {
      slug: row.slug,
      updatedAt: row.updatedAt,
      editedBy: row.updatedBy?.name ?? null,
      changedFields: Object.keys(data).length,
    });
  }
  return out;
}
