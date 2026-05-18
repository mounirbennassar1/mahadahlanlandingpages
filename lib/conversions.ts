import "server-only";
import type { ConversionType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type ConversionConfig = {
  conversionId: string;
  conversionLabel: string;
} | null;

export type LandingConversionConfig = {
  whatsapp: ConversionConfig;
  form: ConversionConfig;
};

/**
 * Build the gtag `send_to` string for a conversion action — i.e.
 * "AW-1234567890/abcDEF123". Returns null if the action is missing IDs
 * or is inactive.
 */
function toConversionConfig(action: {
  conversionId: string | null;
  conversionLabel: string | null;
  active: boolean;
}): ConversionConfig {
  if (!action.active) return null;
  const id = action.conversionId?.trim();
  const label = action.conversionLabel?.trim();
  if (!id || !label) return null;
  return { conversionId: id, conversionLabel: label };
}

/**
 * Server-side: fetch (whatsapp, form) Google Ads conversion config for a
 * landing's slug. Designed to be called from a landing's layout (Server
 * Component) so we can inline the IDs as window.__mdConversions before any
 * user interaction.
 *
 * Returns {whatsapp:null, form:null} if the source doesn't exist yet — the
 * first form submission will auto-register it.
 */
export async function getConversionsForSlug(
  slug: string,
): Promise<LandingConversionConfig> {
  const source = await prisma.leadSource.findUnique({
    where: { slug },
    include: { conversions: true },
  });

  const empty: LandingConversionConfig = { whatsapp: null, form: null };
  if (!source) return empty;

  const map = new Map<ConversionType, (typeof source.conversions)[number]>();
  for (const c of source.conversions) map.set(c.type, c);

  const whatsapp = map.get("WHATSAPP");
  const form = map.get("FORM");

  return {
    whatsapp: whatsapp ? toConversionConfig(whatsapp) : null,
    form: form ? toConversionConfig(form) : null,
  };
}
