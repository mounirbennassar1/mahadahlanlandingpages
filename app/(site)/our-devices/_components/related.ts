import { SPECIALTIES, type Specialty } from "@/app/_home/config";

/**
 * Loose keyword map from a device's copy (usedFor, tagline, description) to
 * the treatment landings that use it. Order matters: the first rule that
 * matches ranks first. Falls back to the flagship pages so there are always
 * three cards.
 */
const RULES: Array<{ match: RegExp; slugs: string[] }> = [
  { match: /إبر|مسام|ملمس/u, slugs: ["microneedling-rf"] },
  { match: /حب الشباب|آثار الحبوب/u, slugs: ["acne"] },
  { match: /كلف|تصبّغ|تصبغ|نمش|لون البشرة|توحيد/u, slugs: ["hyperpigmentation"] },
  { match: /هالات/u, slugs: ["dark-circles"] },
  { match: /رقبة|خط الفك|رفع الحاجب|تحت الذقن|ترهّل|ترهل|شد الوجه/u, slugs: ["neck-lift"] },
  { match: /علامات التمدد|تشقق/u, slugs: ["stretchmarks"] },
  { match: /نحت|قوام|دهون/u, slugs: ["body"] },
  { match: /تنظيف|ترطيب|رؤوس|هايدرافيشل/u, slugs: ["facial", "glass-skin"] },
  { match: /نضارة|إشراق/u, slugs: ["glass-skin", "facial"] },
  { match: /فروة|تساقط/u, slugs: ["hair"] },
  { match: /ضمور|امتلاء/u, slugs: ["facial-atrophy"] },
];

const DEFAULTS = ["glass-skin", "botox", "neck-lift"];

export function relatedSpecialties(
  device: { name: string; usedFor: string[]; tagline: string | null; description: string | null },
  limit = 3,
): Specialty[] {
  const text = [device.name, ...device.usedFor, device.tagline ?? "", device.description ?? ""].join(" ");
  const picked: string[] = [];

  for (const rule of RULES) {
    if (!rule.match.test(text)) continue;
    for (const slug of rule.slugs) if (!picked.includes(slug)) picked.push(slug);
  }
  for (const slug of DEFAULTS) {
    if (picked.length >= limit) break;
    if (!picked.includes(slug)) picked.push(slug);
  }

  return picked
    .slice(0, limit)
    .map((slug) => SPECIALTIES.find((s) => s.slug === slug))
    .filter((s): s is Specialty => Boolean(s));
}
