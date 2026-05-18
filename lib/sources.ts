import type { LeadSource } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { generateApiKey } from "@/lib/api-key";

/**
 * Self-registering source + UTM-link helper.
 *
 * When a new landing page is added (a new folder under `app/(landings)/<slug>`),
 * its form just posts `source: "<slug>"` to /api/leads. The first submission
 * for an unseen slug triggers `ensureSource()` which:
 *
 *   1. Creates a `LeadSource` row (humanised label, fresh API key)
 *   2. Creates 5 `UtmLink` rows — one per platform — visible in /dashboard/utm
 *
 * No manual seed run required.
 */

const SLUG_REGEX = /^[a-z][a-z0-9-]{0,40}$/;

const PLATFORMS = [
  { platform: "GOOGLE_ADS", utmSource: "google", utmMedium: "cpc" },
  { platform: "INSTAGRAM", utmSource: "instagram", utmMedium: "paid_social" },
  { platform: "TIKTOK", utmSource: "tiktok", utmMedium: "paid_social" },
  { platform: "X", utmSource: "x", utmMedium: "paid_social" },
  { platform: "SNAPCHAT", utmSource: "snapchat", utmMedium: "paid_social" },
] as const;

export function isValidSlug(slug: string): boolean {
  return SLUG_REGEX.test(slug);
}

function humanize(slug: string): string {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function siteBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://mahadahlan.com").replace(
    /\/+$/,
    "",
  );
}

/**
 * Look up a source by slug, or create it (plus its 5 UTM links) on the fly.
 * Returns null if the slug is malformed (basic abuse mitigation — only
 * lowercase letters, digits, and hyphens are accepted).
 */
export async function ensureSource(slug: string): Promise<LeadSource | null> {
  if (!isValidSlug(slug)) return null;

  const existing = await prisma.leadSource.findUnique({ where: { slug } });
  if (existing) return existing;

  const { hash, hint } = generateApiKey(slug);
  const source = await prisma.leadSource.create({
    data: {
      slug,
      label: humanize(slug),
      apiKeyHash: hash,
      apiKeyHint: hint,
      active: true,
    },
  });

  await ensureUtmLinksForSource(source.id, slug);
  await ensureConversionActionsForSource(source.id);
  return source;
}

/**
 * Idempotently create the (WHATSAPP, FORM) conversion-action rows for a source.
 * Rows start with null conversionId/Label — fill in via /dashboard/conversions
 * once the action has been created in Google Ads.
 */
export async function ensureConversionActionsForSource(sourceId: string) {
  for (const type of ["WHATSAPP", "FORM"] as const) {
    await prisma.conversionAction.upsert({
      where: { sourceId_type: { sourceId, type } },
      update: {},
      create: { sourceId, type, active: true },
    });
  }
}

/**
 * Idempotently create/refresh the 5 platform UTM links for a source. Safe to
 * call repeatedly — the (sourceId, platform) unique constraint backs an upsert.
 */
export async function ensureUtmLinksForSource(sourceId: string, slug: string) {
  const baseUrl = siteBaseUrl();
  for (const p of PLATFORMS) {
    const params = new URLSearchParams({
      utm_source: p.utmSource,
      utm_medium: p.utmMedium,
      utm_campaign: slug,
    });
    const url = `${baseUrl}/${slug}?${params.toString()}`;
    await prisma.utmLink.upsert({
      where: { sourceId_platform: { sourceId, platform: p.platform } },
      update: { utmSource: p.utmSource, utmMedium: p.utmMedium, utmCampaign: slug, url },
      create: {
        sourceId,
        platform: p.platform,
        utmSource: p.utmSource,
        utmMedium: p.utmMedium,
        utmCampaign: slug,
        url,
      },
    });
  }
}
