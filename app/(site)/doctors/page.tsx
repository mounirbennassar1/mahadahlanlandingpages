import type { Metadata } from "next";
import { Icon } from "@/components/icons";
import { Glow, Section, SectionHead } from "@/app/_home/Sections";
import { Reveal, RevealGroup } from "@/app/_home/Motion";
import { GOLD_GRADIENT } from "@/app/_home/config";
import { getActiveDoctors } from "@/lib/content";
import { getPageContent } from "@/lib/pages/get";
import { PageHero } from "@/app/(site)/_components/PageHero";
import { CtaBand } from "@/app/(site)/_components/CtaBand";
import { GoldLink, WhatsAppLink } from "@/app/(site)/_components/SiteButtons";
import { DoctorCard } from "./_components/DoctorCard";
import { TeamCollage } from "./_components/TeamCollage";
import { DOCTORS } from "./content";

export const revalidate = 300;

/** Icons for the trust pills, in content order. */
const PROOF_ICONS = [Icon.Users, Icon.Award, Icon.Star, Icon.MessageCircle] as const;

/** Icons for the "why our team" cards, in content order. */
const WHY_TEAM_ICONS = [Icon.Users, Icon.Stethoscope, Icon.CalendarCheck] as const;

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPageContent(DOCTORS);
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: "/doctors" },
  };
}

export default async function DoctorsPage() {
  const c = await getPageContent(DOCTORS);
  const doctors = await getActiveDoctors();

  const proof = c.proof.items.map((p, i) => ({ ...p, icon: PROOF_ICONS[i] }));
  const whyTeam = c.whyTeam.items.map((card, i) => ({ ...card, icon: WHY_TEAM_ICONS[i] }));

  return (
    <>
      <PageHero
        crumbs={[{ label: c.hero.crumb }]}
        eyebrow={c.hero.eyebrow}
        title={c.hero.title}
        gold={c.hero.gold}
        lede={c.hero.lede}
        compact={!doctors.length}
        aside={doctors.length ? <TeamCollage doctors={doctors} /> : undefined}
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

      {/* ——— team grid ——— */}
      <Section id="team" className="bg-[var(--color-md-band)]">
        <RevealGroup className="flex flex-wrap justify-center gap-2.5 sm:gap-3" stagger={0.06}>
          {proof.map((p) => (
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
            eyebrow={c.team.eyebrow}
            title={c.team.title}
            gold={c.team.gold}
            body={c.team.body}
          />
        </div>

        {doctors.length ? (
          <RevealGroup className="mt-12 grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {doctors.map((d) => (
              <DoctorCard key={d.slug} doctor={d} />
            ))}
          </RevealGroup>
        ) : (
          <Reveal className="mt-12 rounded-[24px] border border-dashed border-[var(--color-md-line-strong)] bg-[var(--color-md-card)] p-10 text-center">
            <Icon.Users className="mx-auto size-10 text-[var(--color-md-gold)]" strokeWidth={1.6} />
            <h3 className="mt-4 text-[1.1rem] font-extrabold text-[var(--color-md-text)]">{c.team.emptyTitle}</h3>
            <p className="mt-2 text-[0.92rem] font-light text-[rgba(246,238,223,0.6)]">
              {c.team.emptyBody}
            </p>
          </Reveal>
        )}
      </Section>

      {/* ——— why our team ——— */}
      <Section id="why-team" className="relative bg-[var(--color-md-bg)]">
        <Glow className="-top-16 left-1/4 h-[320px] w-[560px]" />
        <SectionHead
          eyebrow={c.whyTeam.eyebrow}
          title={c.whyTeam.title}
          gold={c.whyTeam.gold}
          body={c.whyTeam.body}
        />
        <RevealGroup className="mt-12 grid gap-4 sm:gap-6 lg:grid-cols-3">
          {whyTeam.map((card) => (
            <div
              key={card.title}
              className="group rounded-[24px] border border-[var(--color-md-line)] bg-[var(--color-md-card)] p-7 transition-[transform,border-color,box-shadow] duration-400 hover:-translate-y-1.5 hover:border-[rgba(232,195,106,0.5)] hover:shadow-[0_0_40px_-14px_rgba(232,195,106,0.45)]"
            >
              <span
                className="mb-5 inline-flex size-12 items-center justify-center rounded-2xl text-[var(--color-md-ink)] shadow-[0_0_22px_-6px_rgba(232,195,106,0.55)] transition-transform duration-400 group-hover:scale-110"
                style={{ background: GOLD_GRADIENT }}
                aria-hidden
              >
                <card.icon className="size-[22px]" strokeWidth={2} />
              </span>
              <h3 className="text-[1.1rem] font-extrabold text-[var(--color-md-text)]">{card.title}</h3>
              <p className="mt-2.5 text-[0.92rem] leading-[1.85] font-light text-[rgba(246,238,223,0.6)]">{card.body}</p>
            </div>
          ))}
        </RevealGroup>
      </Section>

      <CtaBand {...c.cta} />
    </>
  );
}
