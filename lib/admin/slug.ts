import { prisma } from "@/lib/prisma";
import { ActionError } from "./action";
import { slugify } from "./slugify";
import type { ContentKind } from "./revalidate";

export { slugify };

async function slugTaken(kind: ContentKind, slug: string, excludeId?: string) {
  const where = { slug, ...(excludeId ? { NOT: { id: excludeId } } : {}) };
  switch (kind) {
    case "articles":
      return (await prisma.article.count({ where })) > 0;
    case "categories":
      return (await prisma.category.count({ where })) > 0;
    case "doctors":
      return (await prisma.doctor.count({ where })) > 0;
    case "devices":
      return (await prisma.device.count({ where })) > 0;
    case "offers":
      return (await prisma.offer.count({ where })) > 0;
    case "services":
      return (await prisma.service.count({ where })) > 0;
  }
}

/** Appends `-2`, `-3`, … until the slug is free for this model. */
export async function ensureUniqueSlug(kind: ContentKind, base: string, excludeId?: string) {
  const root = slugify(base) || "item";
  let candidate = root;
  let n = 2;
  while (await slugTaken(kind, candidate, excludeId)) {
    candidate = `${root}-${n++}`;
    if (n > 500) throw new ActionError("Could not find a free slug. Please set one manually.");
  }
  return candidate;
}

/**
 * Resolves the slug to store: an explicit one must be free (field error
 * otherwise); an empty one is derived from `fallback` and made unique.
 */
export async function resolveSlug(kind: ContentKind, requested: string, fallback: string, excludeId?: string) {
  const explicit = slugify(requested);
  if (explicit) {
    if (await slugTaken(kind, explicit, excludeId)) {
      throw new ActionError("That slug is already in use.", { slug: "This slug is already taken." });
    }
    return explicit;
  }
  return ensureUniqueSlug(kind, fallback, excludeId);
}
