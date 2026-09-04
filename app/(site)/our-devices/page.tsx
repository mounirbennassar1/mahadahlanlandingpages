import type { Metadata } from "next";
import { Icon } from "@/components/icons";
import { Glow, Section, SectionHead } from "@/app/_home/Sections";
import { Reveal, RevealGroup, ScrubLine } from "@/app/_home/Motion";
import { GOLD_GRADIENT } from "@/app/_home/config";
import { getActiveDevices } from "@/lib/content";
import { getPageContent } from "@/lib/pages/get";
import { PageHero } from "@/app/(site)/_components/PageHero";
import { CtaBand } from "@/app/(site)/_components/CtaBand";
import { GoldLink, WhatsAppLink } from "@/app/(site)/_components/SiteButtons";
import { DeviceCard } from "./_components/DeviceCard";
import { OUR_DEVICES } from "./content";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPageContent(OUR_DEVICES);
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: "/our-devices" },
  };
}

/** Icons for the "how we choose" steps, in content order. */
const STEP_ICONS = [Icon.ScanFace, Icon.Target, Icon.CalendarCheck] as const;

/** Icons for the assurance pills, in content order. */
const ASSURANCE_ICONS = [Icon.BadgeCheck, Icon.ShieldCheck, Icon.Users, Icon.Stethoscope] as const;

export default async function DevicesPage() {
  const [devices, c] = await Promise.all([getActiveDevices(), getPageContent(OUR_DEVICES)]);
  const assurance = c.assurance.items.map((p, i) => ({ ...p, icon: ASSURANCE_ICONS[i] }));
  const steps = c.steps.items.map((s, i) => ({ ...s, icon: STEP_ICONS[i] }));

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
          <>
            <GoldLink href="/book-now">
              <Icon.CalendarCheck className="size-[18px]" />
              {c.hero.book}
            </GoldLink>
            <WhatsAppLink />
          </>
        }
      />

      {/* ——— devices grid ——— */}
      <Section id="devices" className="bg-[var(--color-md-band)]">
        <RevealGroup className="flex flex-wrap justify-center gap-2.5 sm:gap-3" stagger={0.06}>
          {assurance.map((p) => (
            <span
              key={p.label}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-md-line-strong)] bg-[rgba(22,16,10,0.7)] px-4 py-2 text-[0.8rem] font-bold text-[var(--color-md-champagne)]"
            >
              <p.icon className="size-4" strokeWidth={2} />
              {p.label}
            </span>
          ))}
        </RevealGroup>

        <div className="mt-12">
          <SectionHead
            eyebrow={c.devices.eyebrow}
            title={c.devices.title}
            gold={c.devices.gold}
            body={c.devices.body}
          />
        </div>

        {devices.length ? (
          <RevealGroup className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {devices.map((d) => (
              <DeviceCard key={d.slug} device={d} />
            ))}
          </RevealGroup>
        ) : (
          <Reveal className="mt-12 rounded-[24px] border border-dashed border-[var(--color-md-line-strong)] bg-[var(--color-md-card)] p-10 text-center">
            <Icon.Zap className="mx-auto size-10 text-[var(--color-md-gold)]" strokeWidth={1.6} />
            <h3 className="mt-4 text-[1.1rem] font-extrabold text-[var(--color-md-text)]">{c.devices.emptyTitle}</h3>
            <p className="mt-2 text-[0.92rem] font-light text-[rgba(246,238,223,0.6)]">
              {c.devices.emptyBody}
            </p>
          </Reveal>
        )}
      </Section>

      {/* ——— how we choose ——— */}
      <Section id="how" className="relative bg-[var(--color-md-bg)]">
        <Glow className="-top-16 left-1/4 h-[320px] w-[560px]" />
        <SectionHead
          eyebrow={c.steps.eyebrow}
          title={c.steps.title}
          gold={c.steps.gold}
          body={c.steps.body}
        />
        <ScrubLine className="mt-12 hidden h-[2px] w-full rounded-full lg:block" />
        <RevealGroup className="md-carousel relative mt-8 -mx-[22px] flex snap-x snap-mandatory gap-4 overflow-x-auto px-[22px] pt-5 pb-2 scroll-px-[22px] md:mx-0 md:grid md:snap-none md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:pt-4 md:pb-0">
          {steps.map((step) => (
            <div
              key={step.num}
              className="relative flex w-[76vw] max-w-[330px] shrink-0 snap-center flex-col rounded-[24px] border border-[var(--color-md-line)] bg-[var(--color-md-card)] p-7 transition-colors duration-400 hover:border-[rgba(232,195,106,0.45)] md:w-auto md:max-w-none"
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
              <p className="mt-2.5 text-[0.9rem] leading-[1.85] font-light text-[rgba(246,238,223,0.58)]">{step.body}</p>
            </div>
          ))}
        </RevealGroup>
      </Section>

      <CtaBand {...c.cta} />
    </>
  );
}
