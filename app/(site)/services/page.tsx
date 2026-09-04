import type { Metadata } from "next";
import { Icon } from "@/components/icons";
import { Glow, Section, SectionHead } from "@/app/_home/Sections";
import { RevealGroup, ScrubLine } from "@/app/_home/Motion";
import { GOLD_GRADIENT, SPECIALTIES } from "@/app/_home/config";
import { getActiveServicesGrouped } from "@/lib/content";
import { getPageContent } from "@/lib/pages/get";
import { getSpecialtyCopy } from "@/lib/pages/home";
import { PageHero } from "../_components/PageHero";
import { CtaBand } from "../_components/CtaBand";
import { ServicesGrid } from "./_components/ServicesGrid";
import { OtherServices, type OtherServiceGroup } from "./_components/OtherServices";
import { SERVICES } from "./content";

export const revalidate = 300;

/** Icons for the hero proof pills, in content order. */
const PROOF_ICONS = [Icon.Star, Icon.MessageCircle, Icon.Award, Icon.Users] as const;

/** Icons for the "how we choose" steps, in content order. */
const HOW_WE_CHOOSE_ICONS = [Icon.Stethoscope, Icon.ClipboardList, Icon.RefreshCw] as const;

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPageContent(SERVICES);
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: "/services" },
    openGraph: {
      title: "الخدمات | عيادات د. مها دحلان",
      description: seo.description,
      url: "/services",
    },
  };
}

/** Booking services not already covered by a treatment page above. */
async function loadOtherServices(): Promise<OtherServiceGroup[]> {
  const shown = new Set(SPECIALTIES.map((s) => s.slug));
  try {
    const grouped = await getActiveServicesGrouped();
    return grouped
      .map((g) => ({
        group: g.group,
        items: g.items
          .filter((s) => !(s.landingSlug && shown.has(s.landingSlug)))
          .map((s) => ({ slug: s.slug, name: s.name })),
      }))
      .filter((g) => g.items.length > 0);
  } catch {
    // The index is useful without the DB; degrade to the static grid only.
    return [];
  }
}

export default async function ServicesPage() {
  const c = await getPageContent(SERVICES);
  const specialtyOverrides = await getSpecialtyCopy("ar");
  const otherGroups = await loadOtherServices();

  const proof = c.proof.items.map((p, i) => ({ ...p, icon: PROOF_ICONS[i] }));
  const steps = c.howWeChoose.items.map((s, i) => ({ ...s, icon: HOW_WE_CHOOSE_ICONS[i] }));

  return (
    <>
      <PageHero
        compact
        crumbs={[{ label: c.hero.crumb }]}
        eyebrow={c.hero.eyebrow}
        title={c.hero.title}
        gold={c.hero.gold}
        lede={c.hero.lede}
        actions={
          <ul className="flex flex-wrap justify-center gap-2.5">
            {proof.map((p) => (
              <li
                key={p.text}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--color-md-line-strong)] bg-[rgba(22,16,10,0.7)] px-4 py-2 text-[0.8rem] font-bold text-[rgba(246,238,223,0.82)]"
              >
                <p.icon className="size-3.5 text-[var(--color-md-champagne)]" strokeWidth={2.2} />
                {p.text}
              </li>
            ))}
          </ul>
        }
      />

      {/* treatments grid (sticky filter lives inside) */}
      <section className="relative bg-[var(--color-md-band)] pb-[78px] sm:pb-[96px]">
        <ServicesGrid
          staffNote={c.grid.staffNote}
          assurance={c.grid.assurance}
          overrides={specialtyOverrides}
        />
      </section>

      {/* booking-only services */}
      <OtherServices groups={otherGroups} copy={c.other} />

      {/* how we choose */}
      <Section className="relative bg-[var(--color-md-band)]">
        <Glow className="-top-16 left-1/4 h-[320px] w-[520px]" />
        <SectionHead
          eyebrow={c.howWeChoose.eyebrow}
          title={c.howWeChoose.title}
          gold={c.howWeChoose.gold}
          body={c.howWeChoose.body}
        />
        <ScrubLine className="mt-12 hidden h-[2px] w-full rounded-full lg:block" />
        <RevealGroup className="mt-8 grid gap-5 md:grid-cols-3 md:gap-6">
          {steps.map((step) => (
            <div
              key={step.num}
              className="relative flex flex-col rounded-[24px] border border-[var(--color-md-line)] bg-[var(--color-md-card)] p-7 transition-colors duration-400 hover:border-[rgba(232,195,106,0.45)]"
            >
              <span
                className="absolute -top-4 right-7 rounded-full px-3.5 py-1.5 text-[0.78rem] font-extrabold text-[var(--color-md-ink)]"
                style={{ background: GOLD_GRADIENT }}
              >
                {step.num}
              </span>
              <span
                className="mt-3 mb-4 inline-flex size-11 items-center justify-center rounded-2xl border border-[var(--color-md-line)] bg-[rgba(232,195,106,0.08)] text-[var(--color-md-champagne)]"
                aria-hidden
              >
                <step.icon className="size-5" strokeWidth={1.9} />
              </span>
              <h3 className="text-[1.05rem] font-extrabold text-[var(--color-md-text)]">
                {step.title}
              </h3>
              <p className="mt-2.5 text-[0.9rem] leading-[1.85] font-light text-[rgba(246,238,223,0.58)]">
                {step.body}
              </p>
            </div>
          ))}
        </RevealGroup>
      </Section>

      <CtaBand {...c.cta} />
    </>
  );
}
