import type { Metadata } from "next";
import { Icon } from "@/components/icons";
import { Glow, Section, SectionHead } from "@/app/_home/Sections";
import { Reveal, RevealGroup, ScrubLine } from "@/app/_home/Motion";
import { Payments } from "@/app/_home/Payments";
import { GOLD_GRADIENT } from "@/app/_home/config";
import { formatSar, getActiveOffers } from "@/lib/content";
import { getPageContent } from "@/lib/pages/get";
import { PageHero } from "../_components/PageHero";
import { CtaBand } from "../_components/CtaBand";
import { OfferGrid } from "./_components/OfferGrid";
import type { OfferItem } from "./_components/types";
import { OFFERS } from "./content";

export const revalidate = 300;

/** Icons for the hero proof pills, in content order. */
const PROOF_ICONS = [Icon.Star, Icon.MessageCircle, Icon.Award, Icon.Users] as const;

/** Icons for the booking steps, in content order. */
const STEP_ICONS = [Icon.Gift, Icon.ClipboardCheck, Icon.CalendarCheck] as const;

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPageContent(OFFERS);
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: "/offers" },
    openGraph: {
      title: "كل العروض | عيادات د. مها دحلان",
      description: seo.description,
      url: "/offers",
    },
  };
}

export default async function OffersPage() {
  const c = await getPageContent(OFFERS);
  const offers = await getActiveOffers();

  const proof = c.proof.items.map((p, i) => ({ ...p, icon: PROOF_ICONS[i] }));
  const steps = c.steps.items.map((s, i) => ({ ...s, icon: STEP_ICONS[i] }));

  const items: OfferItem[] = offers.map((o) => ({
    id: o.id,
    slug: o.slug,
    title: o.title,
    description: o.description,
    price: o.price,
    priceLabel: formatSar(o.price),
    oldPriceLabel: o.oldPrice ? formatSar(o.oldPrice) : null,
    savePercent:
      o.oldPrice && o.oldPrice > o.price
        ? Math.round((1 - o.price / o.oldPrice) * 100)
        : null,
    badge: o.badge,
    category: o.category,
    image: o.image,
    imageAlt: o.imageAlt,
  }));

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

      {/* offers grid (sticky filter lives inside) */}
      <section className="relative bg-[var(--color-md-band)] pb-[78px] sm:pb-[96px]">
        <OfferGrid offers={items} />
      </section>

      {/* how booking works */}
      <Section className="relative bg-[var(--color-md-bg)]">
        <Glow className="-top-16 left-1/4 h-[320px] w-[520px]" />
        <SectionHead
          eyebrow={c.steps.eyebrow}
          title={c.steps.title}
          gold={c.steps.gold}
          body={c.steps.body}
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

      {/* split payments */}
      <Section id="installments" className="relative bg-[var(--color-md-band)]">
        <Glow className="-top-14 left-1/3 h-[300px] w-[560px]" />
        <SectionHead
          eyebrow={c.installments.eyebrow}
          title={c.installments.title}
          gold={c.installments.gold}
          body={c.installments.body}
        />
        <Reveal className="mt-12">
          <Payments />
        </Reveal>
      </Section>

      <CtaBand {...c.cta} />
    </>
  );
}
