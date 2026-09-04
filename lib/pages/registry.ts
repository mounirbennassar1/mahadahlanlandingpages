import type { PageDef } from "./define";

/**
 * Every page whose copy is editable from /dashboard/pages.
 *
 * A page joins the registry by exporting a `definePage(...)` object from a
 * `content.ts` next to it and being listed below. The scaffold script inserts
 * new landings at the `@@landing-imports` / `@@landing-entries` markers, so
 * keep those comments exactly as they are.
 */

import { HOME_AR, HOME_EN } from "@/app/_home/content";
import { SPECIALTIES_PAGE } from "@/app/_home/specialties.content";
import { ABOUT_US } from "@/app/(site)/about-us/content";
import { BOOK_NOW } from "@/app/(site)/book-now/content";
import { CAREERS } from "@/app/(site)/careers/content";
import { DOCTORS } from "@/app/(site)/doctors/content";
import { NEWS_ARTICLES } from "@/app/(site)/news-articles/content";
import { OFFERS } from "@/app/(site)/offers/content";
import { OUR_DEVICES } from "@/app/(site)/our-devices/content";
import { SERVICES } from "@/app/(site)/services/content";
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
  HOME_AR,
  HOME_EN,
  SPECIALTIES_PAGE,
  ABOUT_US,
  BOOK_NOW,
  CAREERS,
  DOCTORS,
  NEWS_ARTICLES,
  OFFERS,
  OUR_DEVICES,
  SERVICES,
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
