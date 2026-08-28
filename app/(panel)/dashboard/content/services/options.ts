import { SPECIALTIES } from "@/app/_home/config";
import { prisma } from "@/lib/prisma";
import type { LandingOption } from "./_components/ServiceForm";

/** Landing slugs from app/_home/config.ts (deduped), plus the current value if it is no longer listed. */
export function landingOptions(current?: string | null): LandingOption[] {
  const seen = new Set<string>();
  const out: LandingOption[] = [];
  for (const s of SPECIALTIES) {
    if (seen.has(s.slug)) continue;
    seen.add(s.slug);
    out.push({ slug: s.slug, title: s.title });
  }
  if (current && !seen.has(current)) out.push({ slug: current, title: "(not in config)" });
  return out;
}

export async function serviceGroups() {
  const rows = await prisma.service.findMany({
    where: { group: { not: null } },
    select: { group: true },
    distinct: ["group"],
    orderBy: { group: "asc" },
  });
  return rows.flatMap((r) => (r.group ? [r.group] : []));
}
