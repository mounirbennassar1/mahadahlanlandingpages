import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { Glow, Section, SectionHead } from "@/app/_home/Sections";
import { Counter, Parallax, Reveal, RevealGroup, ScrubLine } from "@/app/_home/Motion";
import { GOLD_GRADIENT } from "@/app/_home/config";
import { getActiveDoctors } from "@/lib/content";
import { getPageContent } from "@/lib/pages/get";
import { getSpecialtyCopy } from "@/lib/pages/home";
import { PageHero } from "@/app/(site)/_components/PageHero";
import { CtaBand } from "@/app/(site)/_components/CtaBand";
import { CAROUSEL, CAROUSEL_ITEM, GoldLink, OutlineLink } from "@/app/(site)/_components/SiteButtons";
import { DoctorCard } from "@/app/(site)/doctors/_components/DoctorCard";
import { SpecialtiesStrip } from "./_components/SpecialtiesStrip";
import { VisitBlock } from "./_components/VisitBlock";
import { ABOUT_US } from "./content";

export const revalidate = 300;

/**
 * The animated half of each stat: the number, its kind and suffix stay in code
 * because they drive the count-up. Labels and notes come from the content
 * registry and are zipped by index.
 */
const STAT_VALUES: Array<
  { kind: "count"; value: number; suffix?: string } | { kind: "static"; value: string }
> = [
  { kind: "count", value: 13, suffix: "+" },
  { kind: "static", value: "4.8" },
  { kind: "count", value: 1270, suffix: "+" },
  { kind: "count", value: 14 },
];

/** Icons for the vision / mission / values cards, in content order. */
const PILLAR_ICONS = [Icon.Eye, Icon.Target, Icon.Gem] as const;

/** Icons for the six values, in content order. */
const VALUE_ICONS = [
  Icon.ShieldCheck,
  Icon.Gem,
  Icon.HeartHandshake,
  Icon.TrendingUp,
  Icon.Lock,
  Icon.Users,
] as const;

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPageContent(ABOUT_US);
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: "/about-us" },
    openGraph: {
      title: "من نحن | عيادات د. مها دحلان",
      description: seo.description,
      images: [{ url: "/site/about/clinic.png", width: 736, height: 1004, alt: "جلسة عناية بالبشرة في عيادات د. مها دحلان" }],
    },
  };
}

export default async function AboutPage() {
  const c = await getPageContent(ABOUT_US);
  const doctors = await getActiveDoctors();
  const team = doctors.slice(0, 3);

  const stats = STAT_VALUES.map((s, i) => ({ ...s, ...c.stats.items[i] }));
  const pillars = c.pillars.items.map((p, i) => ({ ...p, icon: PILLAR_ICONS[i] }));
  const values = c.values.items.map((v, i) => ({ ...v, icon: VALUE_ICONS[i] }));
  const story = c.story.paragraphs;
  const beauty = c.beauty.paragraphs;

  return (
    <>
      <PageHero
        crumbs={[{ label: c.hero.crumb }]}
        eyebrow={c.hero.eyebrow}
        title={c.hero.title}
        gold={c.hero.gold}
        lede={c.hero.lede}
        image="/site/about/clinic.png"
        imageAlt="طبيبة تضع قناعاً علاجياً على بشرة مريضة في عيادات د. مها دحلان"
        actions={
          <>
            <GoldLink href="/book-now">
              <Icon.CalendarCheck className="size-[18px]" />
              {c.hero.book}
            </GoldLink>
            <OutlineLink href="/doctors">
              <Icon.Users className="size-[18px]" />
              {c.hero.team}
            </OutlineLink>
          </>
        }
      />

      {/* ——— story + numbers ——— */}
      <Section id="story" className="bg-[var(--color-md-band)]">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <SectionHead
              align="start"
              eyebrow={c.story.eyebrow}
              title={c.story.title}
              gold={c.story.gold}
            />
            <Reveal delay={100} className="mt-8 flex flex-col gap-5">
              {story.map((p, i) => (
                <p
                  key={i}
                  className={`leading-[2] ${
                    i === story.length - 1
                      ? "border-r-2 border-[var(--color-md-gold)] pr-5 text-[1.05rem] font-bold text-[var(--color-md-champagne)]"
                      : "text-[1rem] font-light text-[rgba(246,238,223,0.7)]"
                  }`}
                >
                  {p}
                </p>
              ))}
            </Reveal>
          </div>

          <Reveal from="left" delay={160} className="lg:sticky lg:top-[140px]">
            <div className="relative overflow-hidden rounded-[28px] border border-[var(--color-md-line-strong)] bg-[#120D07] p-7 sm:p-9">
              <div
                className="pointer-events-none absolute -top-28 left-1/2 h-[300px] w-[420px] -translate-x-1/2 blur-[40px]"
                style={{ background: "radial-gradient(ellipse 50% 50% at 50% 0%, rgba(201,156,78,.3), transparent 70%)" }}
                aria-hidden
              />
              <div className="relative">
                <span className="inline-flex items-center gap-2.5 rounded-full border border-[rgba(240,212,138,0.3)] px-[16px] py-1.5 text-[0.76rem] font-bold text-[#F0D48A]">
                  <span
                    className="size-1.5 rounded-full bg-[var(--color-md-neon)]"
                    style={{ animation: "md-neon-pulse 2.4s ease-in-out infinite" }}
                  />
                  {c.stats.badge}
                </span>
                <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-7">
                  {stats.map((s) => (
                    <div key={s.label} className="border-t border-[var(--color-md-line)] pt-4">
                      <p className="md-gold-glow text-[clamp(2rem,4.6vw,2.7rem)] leading-none font-extrabold">
                        <span className="md-gold-text">
                          {s.kind === "count" ? <Counter value={s.value} suffix={s.suffix ?? ""} /> : s.value}
                        </span>
                      </p>
                      <p className="mt-2.5 text-[0.95rem] font-extrabold text-[var(--color-md-text)]">{s.label}</p>
                      <p className="mt-0.5 text-[0.78rem] font-bold text-[rgba(246,238,223,0.45)]">{s.note}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-7 flex items-center gap-2 border-t border-[var(--color-md-line)] pt-5 text-[0.84rem] font-bold text-[rgba(246,238,223,0.6)]">
                  <Icon.Users className="size-4 text-[var(--color-md-champagne)]" />
                  {c.stats.note}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ——— vision / mission / values ——— */}
      <Section id="values" className="relative bg-[var(--color-md-bg)]">
        <Glow className="-top-16 right-1/4 h-[320px] w-[560px]" />
        <SectionHead
          eyebrow={c.pillars.eyebrow}
          title={c.pillars.title}
          gold={c.pillars.gold}
          body={c.pillars.body}
        />

        <RevealGroup className="mt-12 grid gap-4 sm:gap-6 lg:grid-cols-3">
          {pillars.map((card) => (
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
              <h3 className="text-[1.2rem] font-extrabold text-[var(--color-md-text)]">{card.title}</h3>
              <p className="mt-2.5 text-[0.95rem] leading-[1.9] font-light text-[rgba(246,238,223,0.62)]">{card.body}</p>
            </div>
          ))}
        </RevealGroup>

        <ScrubLine className="mt-12 hidden h-[2px] w-full rounded-full lg:block" />

        <RevealGroup className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6" stagger={0.06}>
          {values.map((v) => (
            <div
              key={v.title}
              className="flex flex-col items-center rounded-[20px] border border-[var(--color-md-line)] bg-[rgba(22,16,10,0.6)] px-3 py-5 text-center transition-colors duration-300 hover:border-[rgba(232,195,106,0.45)]"
            >
              <span
                className="inline-flex size-10 items-center justify-center rounded-full border border-[var(--color-md-line)] bg-[rgba(232,195,106,0.08)] text-[var(--color-md-champagne)]"
                aria-hidden
              >
                <v.icon className="size-[18px]" strokeWidth={1.9} />
              </span>
              <h4 className="mt-3 text-[0.9rem] font-extrabold text-[var(--color-md-text)]">{v.title}</h4>
              <p className="mt-1 text-[0.74rem] leading-[1.7] font-bold text-[rgba(246,238,223,0.5)]">{v.body}</p>
            </div>
          ))}
        </RevealGroup>
      </Section>

      {/* ——— redefining beauty ——— */}
      <Section id="beauty" className="relative overflow-hidden bg-[var(--color-md-band)]">
        <Glow className="-bottom-24 left-1/4 h-[320px] w-[560px]" />
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <SectionHead
              align="start"
              eyebrow={c.beauty.eyebrow}
              title={c.beauty.title}
              gold={c.beauty.gold}
            />
            <Reveal delay={100} className="mt-8 flex flex-col gap-5">
              {beauty.slice(0, 2).map((p, i) => (
                <p key={i} className="text-[1rem] leading-[2] font-light text-[rgba(246,238,223,0.7)]">
                  {p}
                </p>
              ))}
              <blockquote className="relative mt-2 rounded-[22px] border border-[var(--color-md-line-strong)] bg-[rgba(22,16,10,0.7)] p-6 pr-14">
                <Icon.Quote
                  className="absolute top-5 right-5 size-6 fill-[rgba(201,156,78,0.5)] text-[rgba(201,156,78,0.5)]"
                  aria-hidden
                />
                <p className="text-[1.08rem] leading-[1.9] font-extrabold text-[var(--color-md-champagne)]">
                  {c.beauty.quote}
                </p>
                <footer className="mt-3 text-[0.8rem] font-bold text-[rgba(246,238,223,0.5)]">
                  {c.beauty.quoteBy}
                </footer>
              </blockquote>
              <p className="text-[1rem] leading-[2] font-light text-[rgba(246,238,223,0.7)]">{beauty[2]}</p>
            </Reveal>
          </div>

          <Reveal from="left" className="relative mx-auto w-full max-w-[480px] lg:mx-0 lg:justify-self-start">
            <Parallax from={24} to={-24}>
              <div
                className="pointer-events-none absolute -inset-3 rounded-[32px] border border-[rgba(201,156,78,0.3)]"
                aria-hidden
              />
              <div className="relative aspect-[3/4] overflow-hidden rounded-[28px] border border-[var(--color-md-line-strong)] bg-[var(--color-md-card)] shadow-[0_40px_90px_-40px_rgba(232,195,106,0.35)]">
                <Image
                  src="/site/about/beauty.png"
                  alt="أخصائية تطبّق قناعاً مرطّباً على بشرة مريضة"
                  fill
                  sizes="(max-width: 1024px) 90vw, 480px"
                  className="object-cover object-top"
                />
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
                  style={{ background: "linear-gradient(to top, rgba(11,8,5,.7), transparent)" }}
                  aria-hidden
                />
                <span className="absolute right-5 bottom-5 inline-flex items-center gap-2 rounded-full border border-[rgba(240,212,138,0.4)] bg-[rgba(11,8,5,0.8)] px-4 py-2 text-[0.78rem] font-extrabold text-[var(--color-md-champagne)] backdrop-blur-md">
                  <Icon.Sparkles className="size-3.5" />
                  {c.beauty.badge}
                </span>
              </div>
            </Parallax>
          </Reveal>
        </div>
      </Section>

      {/* ——— team teaser ——— */}
      {team.length ? (
        <Section id="team" className="relative bg-[var(--color-md-bg)]">
          <Glow className="-top-10 left-1/3 h-[300px] w-[560px]" />
          <SectionHead
            eyebrow={c.team.eyebrow}
            title={c.team.title}
            gold={c.team.gold}
            body={c.team.body}
          />
          <RevealGroup className={`${CAROUSEL} mt-10 md:grid-cols-2 lg:grid-cols-3`}>
            {team.map((d) => (
              <DoctorCard key={d.slug} doctor={d} className={CAROUSEL_ITEM} />
            ))}
          </RevealGroup>
          <Reveal className="mt-10 flex justify-center">
            <OutlineLink href="/doctors">
              {c.team.link}
              <Icon.ArrowLeft className="size-[17px]" strokeWidth={2.4} />
            </OutlineLink>
          </Reveal>
        </Section>
      ) : null}

      {/* ——— specialties strip ——— */}
      <section id="specialties" className="overflow-hidden bg-[var(--color-md-band)] py-[78px] sm:py-[96px]">
        <div className="mx-auto max-w-[1180px] px-[22px]">
          <SectionHead
            eyebrow={c.specialties.eyebrow}
            title={c.specialties.title}
            gold={c.specialties.gold}
            body={c.specialties.body}
          />
        </div>
        <Reveal className="mt-10">
          <SpecialtiesStrip overrides={await getSpecialtyCopy('ar')} />
        </Reveal>
        <Reveal className="mt-8 flex justify-center px-[22px]">
          <Link
            href="/#specialties"
            className="inline-flex items-center gap-2 text-[0.9rem] font-extrabold text-[var(--color-md-champagne)] transition-colors hover:text-[var(--color-md-neon)]"
          >
            {c.specialties.link}
            <Icon.ArrowLeft className="size-4" strokeWidth={2.4} />
          </Link>
        </Reveal>
      </section>

      {/* ——— visit ——— */}
      <Section id="visit" className="bg-[var(--color-md-bg)]">
        <SectionHead
          eyebrow={c.visit.eyebrow}
          title={c.visit.title}
          gold={c.visit.gold}
          body={c.visit.body}
        />
        <Reveal className="mt-12">
          <VisitBlock copy={c.visit} />
        </Reveal>
      </Section>

      <CtaBand {...c.cta} />
    </>
  );
}
