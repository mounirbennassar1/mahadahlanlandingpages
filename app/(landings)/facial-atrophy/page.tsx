import type { Metadata } from "next";
import Image from "next/image";
import { Icon } from "@/components/icons";
import { WhatsAppFAB } from "@/components/usablecomponents/WhatsAppFAB";
import { Header } from "./_components/Header";
import { Hero } from "./_components/Hero";
import { MarqueeStrip } from "./_components/MarqueeStrip";
import { Reveal, SpotlightCard } from "./_components/Reveal";
import { Doctors } from "./_components/Doctors";
import { BeforeAfter } from "./_components/BeforeAfter";
import { Journey } from "./_components/Journey";
import { Testimonials } from "./_components/Testimonials";
import { Booking } from "./_components/Booking";
import { StickyBar } from "./_components/StickyBar";
import {
  GOLD_GRADIENT,
  PHONE_DISPLAY,
  TEL_LINK,
  WA_LINK,
  WA_TOPIC_MESSAGE,
  WHATSAPP_NUMBER,
} from "./_components/config";
import { getPageContent } from "@/lib/pages/get";
import { FACIAL_ATROPHY } from "./content";

const CARD_GRADIENT = "linear-gradient(160deg, #2E0D18, #1D060D)";
const SURFACE_GRADIENT = "linear-gradient(160deg, #35101C, #22070F)";
const SECTION_WASH = "linear-gradient(180deg, #150409, #22070F 45%, #150409)";

/** Icons for the "problem" cards, in content order. */
const PROBLEM_ICONS = [Icon.Droplet, Icon.Waves, Icon.Frown] as const;

/** Icons for the "solutions" cards, in content order. */
const SOLUTION_ICONS = [
  Icon.Droplet,
  Icon.Sparkles,
  Icon.Spline,
  Icon.AudioWaveform,
] as const;

function SectionHead({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
}) {
  return (
    <Reveal className="mx-auto mb-13 max-w-[700px] text-center">
      <span className="text-[0.76rem] font-extrabold tracking-[0.24em] text-[var(--color-faa-gold)]">
        {eyebrow}
      </span>
      <h2 className="mt-3.5 mb-3 text-[clamp(1.8rem,3.8vw,2.7rem)] leading-[1.4] font-extrabold">
        {title}
      </h2>
      {sub && (
        <p className="m-0 text-[1.02rem] font-light text-[rgba(243,233,220,0.65)]">
          {sub}
        </p>
      )}
    </Reveal>
  );
}

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPageContent(FACIAL_ATROPHY);
  return {
    title: seo.title,
    description: seo.description,
    openGraph: {
      title: seo.title,
      description: seo.ogDescription,
      locale: "ar_SA",
      type: "website",
      images: [{ url: "/facial-atrophy/hero-center.webp", width: 1536, height: 2048 }],
    },
  };
}

export default async function FacialAtrophyPage() {
  const c = await getPageContent(FACIAL_ATROPHY);
  const problemCards = c.problem.cards.map((card, i) => ({
    ...card,
    icon: PROBLEM_ICONS[i],
  }));
  const solutions = c.solutions.cards.map((card, i) => ({
    ...card,
    icon: SOLUTION_ICONS[i],
  }));

  return (
    <main>
      <Header cta={c.cta.header} />
      <Hero copy={c.hero} />
      <MarqueeStrip words={c.marquee.items} />

      {/* ——— المشكلة ——— */}
      <section id="problem" className="relative px-[22px] py-[clamp(80px,10vw,120px)]">
        <div className="mx-auto max-w-[1160px]">
          <SectionHead
            eyebrow={c.problem.eyebrow}
            title={c.problem.title}
            sub={c.problem.sub}
          />

          <SpotlightCard
            hoverLift={false}
            background={SURFACE_GRADIENT}
            className="mb-[22px] rounded-3xl p-[clamp(26px,4vw,44px)]"
          >
            <div className="flex flex-wrap items-center gap-[34px]">
              <div className="min-w-[280px] flex-[2]">
                <h3 className="mb-3 text-[1.35rem] font-extrabold text-[var(--color-faa-gold-pale)]">
                  {c.problem.whyTitle}
                </h3>
                <p className="m-0 text-base font-light text-[rgba(243,233,220,0.72)]">
                  {c.problem.whyBody}
                </p>
              </div>
              <div className="min-w-[220px] flex-1">
                <span className="mb-3 block text-[0.78rem] font-extrabold tracking-[0.12em] text-[var(--color-faa-gold)]">
                  {c.problem.areasLabel}
                </span>
                <div className="flex flex-wrap gap-[9px]">
                  {c.problem.areas.map((a) => (
                    <span
                      key={a}
                      className="rounded-full border border-[rgba(217,179,108,0.3)] px-[15px] py-[7px] text-[0.82rem] font-bold text-[var(--color-faa-ink-soft)]"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </SpotlightCard>

          <div className="grid gap-[22px] md:grid-cols-3">
            {problemCards.map((c, i) => (
              <SpotlightCard
                key={c.title}
                delay={80 + i * 80}
                background={CARD_GRADIENT}
                className="rounded-[20px] px-[26px] py-[30px]"
              >
                <div className="mb-4 flex size-[50px] items-center justify-center rounded-[14px] border border-[rgba(217,179,108,0.3)] bg-[rgba(217,179,108,0.1)] text-[var(--color-faa-gold-bright)]">
                  <c.icon className="size-[23px]" strokeWidth={1.8} />
                </div>
                <h3 className="mb-2 text-[1.15rem] font-extrabold">{c.title}</h3>
                <p className="m-0 text-[0.92rem] font-light text-[rgba(243,233,220,0.65)]">
                  {c.body}
                </p>
              </SpotlightCard>
            ))}
          </div>

          <Reveal className="mt-11 text-center">
            <p className="faa-serif m-0 text-[1.35rem] text-[var(--color-faa-ink-soft)]">
              {c.problem.note}{" "}
              <span className="text-[var(--color-faa-gold-bright)]">
                {c.problem.noteHighlight}
              </span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ——— الحلول ——— */}
      <section
        id="solutions"
        className="relative px-[22px] py-[clamp(80px,10vw,120px)]"
        style={{ background: SECTION_WASH }}
      >
        <div className="mx-auto max-w-[1160px]">
          <SectionHead
            eyebrow={c.solutions.eyebrow}
            title={c.solutions.title}
            sub={c.solutions.sub}
          />

          <div className="grid gap-[22px] sm:grid-cols-2 lg:grid-cols-3">
            {solutions.map((s, i) => (
              <SpotlightCard
                key={s.num}
                delay={(i % 3) * 70}
                background={SURFACE_GRADIENT}
                className="rounded-[20px] px-7 py-[30px]"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex size-[50px] items-center justify-center rounded-[14px] border border-[rgba(217,179,108,0.3)] bg-[rgba(217,179,108,0.1)] text-[var(--color-faa-gold-bright)]">
                    <s.icon className="size-[22px]" strokeWidth={1.8} />
                  </div>
                  <span className="faa-serif text-[1.6rem] text-[rgba(217,179,108,0.35)]">
                    {s.num}
                  </span>
                </div>
                <h3 className="mb-2 text-[1.18rem] font-extrabold">{s.title}</h3>
                <p className="m-0 text-[0.92rem] font-light text-[rgba(243,233,220,0.65)]">
                  {s.body}
                </p>
              </SpotlightCard>
            ))}

            {/* CTA card */}
            <Reveal
              delay={140}
              className="relative isolate flex flex-col justify-between gap-6 overflow-hidden rounded-[20px] px-7 py-[30px] text-[var(--color-faa-cta-ink)] transition-transform duration-300 hover:-translate-y-1.5 sm:col-span-2 sm:flex-row sm:items-end"
            >
              <div
                className="absolute inset-0 -z-10 rounded-[20px]"
                style={{ background: GOLD_GRADIENT }}
                aria-hidden
              />
              <div className="sm:max-w-[52ch]">
                <span className="text-[0.74rem] font-extrabold tracking-[0.18em] opacity-75">
                  {c.solutions.ctaEyebrow}
                </span>
                <h3 className="mt-2.5 mb-2 text-[1.35rem] leading-[1.45] font-extrabold">
                  {c.solutions.ctaTitle}
                </h3>
                <p className="m-0 text-[0.93rem] font-bold opacity-85">
                  {c.solutions.ctaBody}
                </p>
              </div>
              <a
                href="#booking"
                className="mt-[22px] inline-flex w-fit shrink-0 items-center gap-[9px] rounded-full bg-[var(--color-faa-cta-ink)] px-6 py-[13px] text-[0.92rem] font-extrabold text-[var(--color-faa-gold-bright)] transition-transform duration-300 hover:-translate-x-1 sm:mt-0"
              >
                {c.solutions.ctaButton}
                <Icon.ArrowLeft className="size-[15px]" strokeWidth={2.4} />
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ——— الطبيبات ——— */}
      <section id="doctors" className="relative px-[22px] py-[clamp(80px,10vw,120px)]">
        <div className="mx-auto max-w-[1160px]">
          <SectionHead
            eyebrow={c.doctors.eyebrow}
            title={c.doctors.title}
            sub={c.doctors.sub}
          />

          <Reveal className="mx-auto mb-12 max-w-[640px]">
            <div className="rounded-l-2xl rounded-r border-r-[3px] border-[var(--color-faa-gold)] px-[22px] py-[18px]"
              style={{ background: SURFACE_GRADIENT }}
            >
              <p className="faa-serif m-0 text-center text-[1.2rem] text-[var(--color-faa-ink-soft)]">
                {c.doctors.quote}
              </p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <Doctors copy={c.doctors} />
          </Reveal>
        </div>
      </section>

      {/* ——— قبل وبعد ——— */}
      <section
        id="results"
        className="relative px-[22px] py-[clamp(80px,10vw,120px)]"
        style={{ background: SECTION_WASH }}
      >
        <div className="mx-auto max-w-[1160px]">
          <SectionHead
            eyebrow={c.results.eyebrow}
            title={c.results.title}
            sub={c.results.sub}
          />
          <Reveal>
            <BeforeAfter
              beforeLabel={c.results.before}
              afterLabel={c.results.after}
            />
          </Reveal>
          <Reveal className="mx-auto mt-[18px] max-w-[560px] text-center">
            <p className="m-0 text-[0.8rem] text-[rgba(243,233,220,0.45)]">
              {c.results.disclaimer}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ——— رحلة العلاج ——— */}
      <section id="journey" className="relative px-[22px] py-[clamp(80px,10vw,120px)]">
        <div className="mx-auto max-w-[1160px]">
          <SectionHead eyebrow={c.journey.eyebrow} title={c.journey.title} />
          <Journey steps={c.journey.steps} />
        </div>
      </section>

      {/* ——— آراء المريضات ——— */}
      <section
        id="voices"
        className="relative overflow-hidden py-[clamp(80px,10vw,120px)]"
        style={{ background: SECTION_WASH }}
      >
        <div className="mx-auto mb-12 max-w-[700px] px-[22px] text-center">
          <SectionHead {...c.testimonials} />
        </div>
        <Testimonials />
      </section>

      {/* ——— الأسئلة الشائعة ——— */}
      <section id="faq" className="relative px-[22px] py-[clamp(80px,10vw,120px)]">
        <div className="mx-auto max-w-[780px]">
          <SectionHead eyebrow={c.faq.eyebrow} title={c.faq.title} />
          <div className="grid gap-[13px]">
            {c.faq.questions.map((f, i) => (
              <Reveal key={f.q} delay={i * 60}>
                <details
                  className="overflow-hidden rounded-2xl border border-[var(--color-faa-line)]"
                  style={{ background: SURFACE_GRADIENT }}
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-[1.02rem] font-extrabold text-[var(--color-faa-ink)]">
                    {f.q}
                    <span className="faa-pm flex size-[26px] shrink-0 items-center justify-center rounded-full border border-[var(--color-faa-line-strong)] bg-[rgba(217,179,108,0.12)] font-bold text-[var(--color-faa-gold-bright)]">
                      +
                    </span>
                  </summary>
                  <p className="m-0 px-6 pb-[22px] text-[0.94rem] font-light text-[rgba(243,233,220,0.68)]">
                    {f.a}
                  </p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ——— الحجز ——— */}
      <section
        id="booking"
        className="relative overflow-hidden px-[22px] py-[clamp(80px,10vw,120px)]"
      >
        <div
          className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[820px] -translate-x-1/2 blur-[30px]"
          style={{
            background:
              "radial-gradient(ellipse 50% 50% at 50% 0%, rgba(240,212,138,.12), transparent 70%)",
          }}
          aria-hidden
        />
        <div className="mx-auto grid max-w-[1080px] items-center gap-[clamp(34px,5vw,60px)] md:grid-cols-2">
          <Reveal>
            <span className="text-[0.76rem] font-extrabold tracking-[0.24em] text-[var(--color-faa-gold)]">
              {c.booking.eyebrow}
            </span>
            <h2 className="mt-3.5 mb-3.5 text-[clamp(1.9rem,3.8vw,2.8rem)] leading-[1.35] font-extrabold">
              {c.booking.title}
              <br />
              <span className="faa-serif faa-gold-text font-bold">
                {c.booking.highlight}
              </span>
            </h2>
            <p className="mb-[26px] max-w-[46ch] text-[1.02rem] font-light text-[rgba(243,233,220,0.68)]">
              {c.booking.body}
            </p>

            <div className="grid max-w-[380px] gap-[15px]">
              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-[13px] rounded-2xl border border-[rgba(217,179,108,0.2)] px-[18px] py-[15px] text-[var(--color-faa-ink)] transition-all duration-300 hover:-translate-y-[3px] hover:border-[rgba(37,211,102,0.55)]"
                style={{ background: SURFACE_GRADIENT }}
              >
                <span
                  className="flex size-[42px] items-center justify-center rounded-xl bg-[rgba(37,211,102,0.14)]"
                  style={{ animation: "faa-pulse 2.6s infinite" }}
                >
                  <Icon.MessageCircle className="size-[21px] text-[#25D366]" />
                </span>
                <span>
                  <b className="block text-[0.94rem]">{c.booking.whatsappTitle}</b>
                  <small dir="ltr" className="text-[0.78rem] text-[rgba(243,233,220,0.55)]">
                    +{WHATSAPP_NUMBER}
                  </small>
                </span>
              </a>
              <a
                href={TEL_LINK}
                className="flex items-center gap-[13px] rounded-2xl border border-[rgba(217,179,108,0.2)] px-[18px] py-[15px] text-[var(--color-faa-ink)] transition-all duration-300 hover:-translate-y-[3px] hover:border-[rgba(240,212,138,0.5)]"
                style={{ background: SURFACE_GRADIENT }}
              >
                <span className="flex size-[42px] items-center justify-center rounded-xl bg-[rgba(217,179,108,0.12)]">
                  <Icon.Phone className="size-5 text-[var(--color-faa-gold-bright)]" />
                </span>
                <span>
                  <b className="block text-[0.94rem]">{c.booking.callTitle}</b>
                  <small className="text-[0.78rem] text-[rgba(243,233,220,0.55)]">
                    {PHONE_DISPLAY}، {c.booking.callNote}
                  </small>
                </span>
              </a>
              <span className="inline-flex items-center gap-[9px] text-[0.8rem] text-[rgba(243,233,220,0.5)]">
                <Icon.Lock className="size-[15px] shrink-0 text-[var(--color-faa-gold)]" />
                {c.booking.privacy}
              </span>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <Booking copy={c.booking} />
          </Reveal>
        </div>
      </section>

      {/* ——— الفوتر ——— */}
      <footer className="border-t border-[rgba(217,179,108,0.14)] px-[22px] pt-11 pb-10 text-center">
        <div className="mb-3.5 flex justify-center">
          <Image
            src="/facial-atrophy/logo.webp"
            alt="MD Clinics | مجمع عيادات د. مها دحلان الطبي"
            width={110}
            height={110}
            className="size-[110px] object-contain"
          />
        </div>
        <div className="mb-5 flex flex-wrap justify-center gap-x-7 gap-y-2.5 text-[0.88rem]">
          <a
            dir="ltr"
            href={TEL_LINK}
            className="text-[var(--color-faa-gold)] hover:text-[var(--color-faa-gold-bright)]"
          >
            {PHONE_DISPLAY}
          </a>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-faa-gold)] hover:text-[var(--color-faa-gold-bright)]"
          >
            {c.footer.whatsapp}
          </a>
          <a
            href="#booking"
            className="text-[var(--color-faa-gold)] hover:text-[var(--color-faa-gold-bright)]"
          >
            {c.footer.book}
          </a>
        </div>
        <p className="mx-auto mb-2 max-w-[620px] text-[0.74rem] font-light text-[rgba(243,233,220,0.4)]">
          {c.footer.disclaimer}
        </p>
        <p className="m-0 text-[0.74rem] text-[rgba(243,233,220,0.35)]">
          {c.footer.copyright}
        </p>
      </footer>

      <WhatsAppFAB
        tokenPrefix="faa"
        whatsappNumber={WHATSAPP_NUMBER}
        topicMessage={WA_TOPIC_MESSAGE}
      />
      <StickyBar label={c.cta.sticky} />
    </main>
  );
}
