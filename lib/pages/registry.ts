import type { PageDef } from "./define";

/**
 * Every landing whose copy is editable from the website's admin panel
 * (portal.mahadahlan.com → /dashboard/pages). Both deployments read the same
 * `PageContent` table, so an edit made there shows up here within the page's
 * `revalidate` window.
 *
 * A landing joins the registry by exporting a `definePage(...)` object from a
 * `content.ts` next to it and being listed below. The scaffold script inserts
 * new landings at the `@@landing-imports` / `@@landing-entries` markers, so
 * keep those comments exactly as they are.
 */

import { ACNE } from "@/app/(landings)/acne/content";
import { BODY } from "@/app/(landings)/body/content";
import { BOTOX } from "@/app/(landings)/botox/content";
import { CHRONIC_ECZEMA } from "@/app/(landings)/chronic-eczema/content";
import { CRACKED_HEELS } from "@/app/(landings)/cracked-heels/content";
import { DARK_CIRCLES } from "@/app/(landings)/dark-circles/content";
import { EID_OFFER } from "@/app/(landings)/eid-offer/content";
import { FACIAL_ATROPHY } from "@/app/(landings)/facial-atrophy/content";
import { FACIAL } from "@/app/(landings)/facial/content";
import { GLASS_SKIN } from "@/app/(landings)/glass-skin/content";
import { HAIR_BREAKAGE } from "@/app/(landings)/hair-breakage/content";
import { HAIR } from "@/app/(landings)/hair/content";
import { HYPERPIGMENTATION } from "@/app/(landings)/hyperpigmentation/content";
import { KOREAN_SPICULES } from "@/app/(landings)/korean-spicules/content";
import { MICRONEEDLING_RF } from "@/app/(landings)/microneedling-rf/content";
import { NECK_LIFT } from "@/app/(landings)/neck-lift/content";
import { STRETCHMARKS } from "@/app/(landings)/stretchmarks/content";
// @@landing-imports

export const PAGES: PageDef[] = [
  ACNE,
  BODY,
  BOTOX,
  CHRONIC_ECZEMA,
  CRACKED_HEELS,
  DARK_CIRCLES,
  EID_OFFER,
  FACIAL_ATROPHY,
  FACIAL,
  GLASS_SKIN,
  HAIR_BREAKAGE,
  HAIR,
  HYPERPIGMENTATION,
  KOREAN_SPICULES,
  MICRONEEDLING_RF,
  NECK_LIFT,
  STRETCHMARKS,
  // @@landing-entries
];

const bySlug = new Map<string, PageDef>();
for (const page of PAGES) {
  if (bySlug.has(page.slug)) {
    throw new Error(`Duplicate page slug in the content registry: ${page.slug}`);
  }
  bySlug.set(page.slug, page);
}

export function getPageDef(slug: string): PageDef | undefined {
  return bySlug.get(slug);
}

export function pagesByKind(kind: PageDef["kind"]): PageDef[] {
  return PAGES.filter((p) => p.kind === kind);
}

/** The registry page whose form feeds a given LeadSource slug, if any. */
export function pageForSource(sourceSlug: string): PageDef | undefined {
  return PAGES.find((p) => p.leadSource === sourceSlug);
}
