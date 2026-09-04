import type { Metadata } from "next";
import { Icon } from "@/components/icons";
import { Glow, Section, SectionHead } from "@/app/_home/Sections";
import { RevealGroup, ScrubLine } from "@/app/_home/Motion";
import { GOLD_GRADIENT } from "@/app/_home/config";
import { getPageContent } from "@/lib/pages/get";
import { PageHero } from "../_components/PageHero";
import { CtaBand } from "../_components/CtaBand";
import { whatsappHref } from "../_booking/shared";
import { CareersForm } from "./_components/CareersForm";
import { CAREERS } from "./content";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPageContent(CAREERS);
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: "/careers" },
    openGraph: {
      title: "الوظائف | عيادات د. مها دحلان",
      description: seo.ogDescription,
      url: "/careers",
    },
  };
}

/** Icons for the hero proof pills, in content order. */
const PROOF_ICONS = [Icon.Users, Icon.Award, Icon.Star, Icon.MessageCircle] as const;

/** Icons for the perks cards, in content order. */
const PERK_ICONS = [
  Icon.HeartHandshake,
  Icon.GraduationCap,
  Icon.Stethoscope,
  Icon.TrendingUp,
] as const;

/** Icons for the career-field chips, in content order. */
const FIELD_ICONS = [
  Icon.Stethoscope,
  Icon.Zap,
  Icon.Bandage,
  Icon.Sparkles,
  Icon.Smile,
  Icon.PenTool,
  Icon.Plus,
];

/** Icons for the application steps, in content order. */
const STEP_ICONS = [Icon.ClipboardCheck, Icon.ScanSearch, Icon.MapPin] as const;

const WA_CAREERS = whatsappHref("مرحباً، أرغب بالاستفسار عن التقديم للعمل في عيادات د. مها دحلان");

export default async function CareersPage() {
  const c = await getPageContent(CAREERS);
  const proof = c.proof.items.map((p, i) => ({ ...p, icon: PROOF_ICONS[i] }));
  const perks = c.perks.items.map((p, i) => ({ ...p, icon: PERK_ICONS[i] }));
  const steps = c.steps.items.map((s, i) => ({ ...s, icon: STEP_ICONS[i] }));

  return (
    <>
      <PageHero
        crumbs={[{ label: c.hero.crumb }]}
        eyebrow={c.hero.eyebrow}
        title={c.hero.title}
        gold={c.hero.gold}
        lede={c.hero.lede}
        actions={
          <ul className="flex flex-wrap gap-2.5">
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
        aside={<CareersForm copy={c.form} fields={c.fields.items} />}
      />

      {/* why us */}
      <Section className="relative bg-[var(--color-md-band)]">
        <Glow className="-top-16 right-1/4 h-[320px] w-[560px]" />
        <SectionHead
          eyebrow={c.perks.eyebrow}
          title={c.perks.title}
          gold={c.perks.gold}
          body={c.perks.body}
        />
        <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {perks.map((perk) => (
            <div
              key={perk.title}
              className="flex flex-col rounded-[24px] border border-[var(--color-md-line)] bg-[var(--color-md-card)] p-7 transition-[transform,border-color,box-shadow] duration-400 hover:-translate-y-1.5 hover:border-[rgba(232,195,106,0.5)] hover:shadow-[0_0_40px_-14px_rgba(232,195,106,0.45)]"
            >
              <span
                className="mb-5 inline-flex size-12 items-center justify-center rounded-2xl text-[var(--color-md-ink)] shadow-[0_0_28px_-8px_rgba(232,195,106,0.6)]"
                style={{ background: GOLD_GRADIENT }}
                aria-hidden
              >
                <perk.icon className="size-[22px]" strokeWidth={1.9} />
              </span>
              <h3 className="text-[1.05rem] font-extrabold text-[var(--color-md-text)]">{perk.title}</h3>
              <p className="mt-2.5 text-[0.9rem] leading-[1.85] font-light text-[rgba(246,238,223,0.58)]">
                {perk.body}
              </p>
            </div>
          ))}
        </RevealGroup>
      </Section>

      {/* fields */}
      <Section id="fields" className="relative bg-[var(--color-md-bg)]">
        <Glow className="-top-10 left-1/4 h-[300px] w-[520px]" />
        <SectionHead
          eyebrow={c.fields.eyebrow}
          title={c.fields.title}
          gold={c.fields.gold}
          body={c.fields.body}
        />
        <RevealGroup className="mt-12 flex flex-wrap justify-center gap-3 sm:gap-4" stagger={0.06}>
          {c.fields.items.map(({ label }, i) => {
            const FieldIcon = FIELD_ICONS[i] ?? Icon.Plus;
            return (
              <a
                key={label}
                href="#careers-form"
                className="group inline-flex items-center gap-3 rounded-full border border-[var(--color-md-line)] bg-[var(--color-md-card)] py-2.5 pe-5 ps-2.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[rgba(232,195,106,0.55)] hover:shadow-[0_0_28px_-10px_rgba(232,195,106,0.5)]"
              >
                <span
                  className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-[var(--color-md-ink)] transition-transform duration-300 group-hover:scale-110"
                  style={{ background: GOLD_GRADIENT }}
                  aria-hidden
                >
                  <FieldIcon className="size-4" strokeWidth={2.2} />
                </span>
                <span className="text-[0.9rem] font-extrabold text-[var(--color-md-text)]">{label}</span>
                <Icon.ArrowUp
                  className="size-3.5 shrink-0 text-[var(--color-md-champagne)] transition-transform duration-300 group-hover:-translate-y-0.5"
                  strokeWidth={2.4}
                  aria-hidden
                />
              </a>
            );
          })}
        </RevealGroup>
      </Section>

      {/* process */}
      <Section className="relative bg-[var(--color-md-band)]">
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
              <h3 className="text-[1.05rem] font-extrabold text-[var(--color-md-text)]">{step.title}</h3>
              <p className="mt-2.5 text-[0.9rem] leading-[1.85] font-light text-[rgba(246,238,223,0.58)]">
                {step.body}
              </p>
            </div>
          ))}
        </RevealGroup>
      </Section>

      <CtaBand
        id="apply"
        {...c.cta}
        bookHref="#careers-form"
        whatsappHref={WA_CAREERS}
      />
    </>
  );
}
