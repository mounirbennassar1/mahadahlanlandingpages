import type { Metadata } from "next";
import Image from "next/image";
import { Icon } from "@/components/icons";
import { WhatsAppFAB } from "@/components/usablecomponents/WhatsAppFAB";
import { Header } from "./_components/Header";
import { Hero } from "./_components/Hero";
import { MarqueeStrip } from "./_components/MarqueeStrip";
import { Parallax, Reveal, ScrollProgress, SpotlightCard } from "./_components/Gsap";
import { Doctors } from "./_components/Doctors";
import { BeforeAfter } from "./_components/BeforeAfter";
import { Journey } from "./_components/Journey";
import { Testimonials } from "./_components/Testimonials";
import { Booking } from "./_components/Booking";
import { StickyBar } from "./_components/StickyBar";
import {
  PHONE_DISPLAY,
  TEL_LINK,
  WA_LINK,
  WA_TOPIC_MESSAGE,
  WHATSAPP_NUMBER,
} from "./_components/config";
import { getPageContent } from "@/lib/pages/get";
import { NECK_LIFT } from "./content";

/** Icons for the "signs" cards, in content order. */
const SIGN_ICONS = [
  Icon.AlignJustify,
  Icon.Waves,
  Icon.Spline,
  Icon.Smartphone,
  Icon.Grip,
  Icon.Columns2,
] as const;

/** Icons for the "solutions" cards, in content order. */
const SOLUTION_ICONS = [
  Icon.MoveUpLeft,
  Icon.Radio,
  Icon.Crown,
  Icon.PenTool,
  Icon.Droplet,
  Icon.Sparkles,
] as const;

/** Icons for the booking reassurance points, in content order. */
const BOOKING_POINT_ICONS = [Icon.Lock, Icon.CircleCheck, Icon.Clock] as const;

/** Icons for the "why us" strip, in content order. */
const WHY_US_ICONS = [
  Icon.HeartHandshake,
  Icon.BadgeCheck,
  Icon.Users,
  Icon.CalendarCheck,
] as const;

function SectionHead({
  eyebrow,
  title,
  highlight,
  sub,
}: {
  eyebrow: string;
  title: string;
  highlight?: string;
  sub?: string;
}) {
  return (
    <Reveal className="mb-[54px] flex flex-col items-center gap-3.5 text-center">
      <span className="text-[0.78rem] font-extrabold tracking-[0.24em] text-[var(--color-nkl-gold)]">
        {eyebrow}
      </span>
      <h2 className="m-0 text-[clamp(1.8rem,3.8vw,2.7rem)] leading-[1.4] font-extrabold">
        {title}{" "}
        {highlight && (
          <span className="nkl-gold-text">{highlight}</span>
        )}
      </h2>
      {sub && (
        <p className="m-0 max-w-[54ch] font-light text-[var(--color-nkl-muted)]">
          {sub}
        </p>
      )}
    </Reveal>
  );
}

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPageContent(NECK_LIFT);
  return {
    title: seo.title,
    description: seo.description,
    openGraph: {
      title: seo.title,
      description: seo.ogDescription,
      locale: "ar_SA",
      type: "website",
      images: [{ url: "/neck-lift/hero-main.webp", width: 1536, height: 2048 }],
    },
  };
}

export default async function NeckLiftPage() {
  const c = await getPageContent(NECK_LIFT);
  const signs = c.signs.cards.map((card, i) => ({ ...card, icon: SIGN_ICONS[i] }));
  const solutions = c.solutions.cards.map((card, i) => ({ ...card, icon: SOLUTION_ICONS[i] }));
  const whyUs = c.whyUs.cards.map((card, i) => ({ ...card, icon: WHY_US_ICONS[i] }));

  return (
    <main>
      <ScrollProgress />
      <Header />
      <Hero copy={c.hero} />
      <MarqueeStrip words={c.marquee.items} />

      {/* ——— لماذا الرقبة أولاً ——— */}
      <section className="relative mx-auto max-w-[1180px] px-[22px] pt-[110px] pb-[90px]">
        <SectionHead {...c.why} />
        <div className="grid gap-[22px] md:grid-cols-3">
          {c.why.cards.map((c, i) => (
            <Reveal key={c.num} delay={i * 120}>
              <div className="relative overflow-hidden rounded-[22px] border border-[var(--color-nkl-line)] bg-[var(--color-nkl-card)] px-7 py-[34px] transition-all duration-300 hover:-translate-y-[5px] hover:border-[rgba(166,124,61,0.4)] hover:shadow-[0_26px_54px_-26px_rgba(138,100,48,0.35)]">
                <div
                  className="absolute inset-x-0 top-0 h-[3px]"
                  style={{
                    background:
                      "linear-gradient(90deg, #8A6430, #E0BE7A, transparent)",
                  }}
                  aria-hidden
                />
                <span className="text-[2.4rem] leading-none font-extrabold text-[rgba(166,124,61,0.22)]">
                  {c.num}
                </span>
                <h3 className="mt-3.5 mb-2.5 text-[1.15rem] font-extrabold">
                  {c.title}
                </h3>
                <p className="m-0 text-[0.94rem] font-light text-[var(--color-nkl-muted)]">
                  {c.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ——— العلامات ——— */}
      <section className="relative border-y border-[rgba(166,124,61,0.15)] bg-[var(--color-nkl-band)] px-[22px] py-[100px]">
        <div className="mx-auto max-w-[1180px]">
          <SectionHead {...c.signs} />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {signs.map((s, i) => (
              <SpotlightCard
                key={s.title}
                delay={(i % 3) * 80}
                className="rounded-[22px] px-[26px] py-[30px]"
              >
                <div
                  className="mb-4 flex size-[46px] items-center justify-center rounded-[14px] border border-[rgba(166,124,61,0.3)]"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(201,156,78,.18), rgba(138,100,48,.08))",
                  }}
                >
                  <s.icon className="size-[22px] text-[var(--color-nkl-bronze)]" strokeWidth={1.8} />
                </div>
                <h3 className="mb-2 text-[1.1rem] font-extrabold">{s.title}</h3>
                <p className="m-0 text-[0.92rem] font-light text-[var(--color-nkl-muted)]">
                  {s.body}
                </p>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* ——— الحلول ——— */}
      <section className="relative mx-auto max-w-[1180px] px-[22px] py-[110px]">
        <SectionHead
          eyebrow={c.solutions.eyebrow}
          title={c.solutions.title}
          sub={c.solutions.sub}
        />
        <Reveal className="-mt-12 mb-[54px] text-center">
          <span className="nkl-gold-text text-[clamp(1.5rem,3vw,2.2rem)] font-extrabold">
            {c.solutions.highlight}
          </span>
        </Reveal>
        <div className="grid gap-[22px] sm:grid-cols-2 lg:grid-cols-3">
          {solutions.map((s, i) => (
            <Reveal key={s.num} delay={(i % 3) * 90}>
              <div className="relative overflow-hidden rounded-3xl border border-[var(--color-nkl-line)] bg-[var(--color-nkl-card)] px-7 py-[34px] transition-all duration-300 hover:-translate-y-1.5 hover:border-[rgba(201,156,78,0.5)] hover:shadow-[0_28px_58px_-26px_rgba(138,100,48,0.38)]">
                <span className="absolute top-3.5 left-5 text-[3.2rem] leading-none font-extrabold text-[rgba(166,124,61,0.1)]">
                  {s.num}
                </span>
                <div
                  className="mb-[18px] flex size-[52px] items-center justify-center rounded-full shadow-[0_10px_24px_-10px_rgba(138,100,48,0.5)]"
                  style={{
                    background: "linear-gradient(135deg, #8A6430, #E0BE7A)",
                  }}
                >
                  <s.icon className="size-6 text-[#FFFDF8]" strokeWidth={1.8} />
                </div>
                <span className="mb-2.5 inline-flex items-center gap-1.5 rounded-full border border-[rgba(166,124,61,0.3)] bg-[rgba(201,156,78,0.1)] px-3 py-1 text-[0.72rem] font-extrabold text-[var(--color-nkl-bronze)]">
                  <Icon.Check className="size-3" strokeWidth={3} />
                  {s.tag}
                </span>
                <h3 className="mb-2.5 text-[1.2rem] font-extrabold">{s.title}</h3>
                <p className="m-0 text-[0.94rem] font-light text-[var(--color-nkl-muted)]">
                  {s.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* لماذا عيادة مها دحلان */}
        <Reveal delay={120} className="mt-14">
          <div className="grid gap-px overflow-hidden rounded-3xl border border-[var(--color-nkl-line)] bg-[var(--color-nkl-line)] sm:grid-cols-2 lg:grid-cols-4">
            {whyUs.map((u) => (
              <div
                key={u.title}
                className="flex flex-col gap-2 bg-[var(--color-nkl-card)] px-6 py-7"
              >
                <u.icon className="size-6 text-[var(--color-nkl-bronze)]" strokeWidth={1.8} />
                <b className="text-[1rem] font-extrabold">{u.title}</b>
                <p className="m-0 text-[0.86rem] font-light text-[var(--color-nkl-muted)]">
                  {u.body}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ——— الأخصائيات ——— */}
      <section className="relative overflow-hidden border-y border-[rgba(166,124,61,0.15)] bg-[var(--color-nkl-band)] px-[22px] py-[100px]">
        <div
          className="pointer-events-none absolute -top-[120px] -left-[140px] size-[420px] rounded-full blur-[60px]"
          style={{
            background:
              "radial-gradient(circle, rgba(224,190,122,.3), transparent 65%)",
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-[1080px]">
          <SectionHead
            eyebrow={c.doctors.eyebrow}
            title={c.doctors.title}
            highlight={c.doctors.highlight}
            sub={c.doctors.sub}
          />
          <Reveal delay={120}>
            <Doctors people={c.doctors.people} />
          </Reveal>
          <Reveal delay={200} className="mx-auto mt-10 max-w-[560px]">
            <div
              className="rounded-l-[14px] rounded-r border-r-[3px] border-[var(--color-nkl-gold-bright)] px-[22px] py-[18px]"
              style={{
                background:
                  "linear-gradient(90deg, rgba(201,156,78,.1), transparent 70%)",
              }}
            >
              <p className="m-0 text-center text-[1.1rem] font-bold text-[var(--color-nkl-ink-soft)]">
                &#8220;{c.doctors.quote}&#8221;
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ——— قبل وبعد ——— */}
      <section className="relative mx-auto max-w-[1020px] px-[22px] py-[110px]">
        <SectionHead
          eyebrow={c.results.eyebrow}
          title={c.results.title}
          highlight={c.results.highlight}
          sub={c.results.sub}
        />
        <Parallax from={30} to={-30}>
          <Reveal delay={120}>
            <BeforeAfter />
          </Reveal>
        </Parallax>
        <Reveal delay={200}>
          <p className="mt-[18px] mb-0 text-center text-[0.78rem] text-[rgba(39,28,17,0.45)]">
            {c.results.disclaimer}
          </p>
        </Reveal>
      </section>

      {/* ——— رحلة العلاج ——— */}
      <section className="relative border-y border-[rgba(166,124,61,0.15)] bg-[var(--color-nkl-band)] px-[22px] py-[100px]">
        <div className="mx-auto max-w-[1180px]">
          <SectionHead
            eyebrow={c.journey.eyebrow}
            title={c.journey.title}
            highlight={c.journey.highlight}
          />
          <Journey steps={c.journey.steps} />
        </div>
      </section>

      {/* ——— قالت مراجعاتنا ——— */}
      <section className="relative overflow-hidden py-[110px]">
        <div className="px-[22px]">
          <SectionHead {...c.testimonials} />
        </div>
        <Testimonials />
      </section>

      {/* ——— الأسئلة الشائعة ——— */}
      <section className="relative mx-auto max-w-[780px] px-[22px] pt-5 pb-[110px]">
        <SectionHead
          eyebrow={c.faq.eyebrow}
          title={c.faq.title}
          highlight={c.faq.highlight}
        />
        <div className="flex flex-col gap-3.5">
          {c.faq.questions.map((f, i) => (
            <Reveal key={f.q} delay={i * 60}>
              <details className="overflow-hidden rounded-[18px] border border-[rgba(166,124,61,0.2)] bg-[var(--color-nkl-card)]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-base font-extrabold">
                  {f.q}
                  <span className="nkl-pm inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-[rgba(166,124,61,0.4)] text-[1.2rem] font-normal text-[var(--color-nkl-bronze)]">
                    +
                  </span>
                </summary>
                <p className="m-0 px-6 pb-[22px] text-[0.94rem] font-light text-[rgba(39,28,17,0.65)]">
                  {f.a}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ——— الحجز ——— */}
      <section
        id="booking"
        className="relative mx-auto max-w-[1180px] px-[22px] pb-[110px]"
      >
        <Reveal>
          <div className="relative overflow-hidden rounded-[32px] bg-[var(--color-nkl-dark)] p-[clamp(36px,6vw,70px)]">
            <div
              className="pointer-events-none absolute -top-[180px] left-1/2 h-[500px] w-[800px] -translate-x-1/2 blur-[30px]"
              style={{
                background:
                  "radial-gradient(ellipse 50% 50% at 50% 0%, rgba(224,190,122,.22), transparent 70%)",
                animation: "nkl-breathe 7s ease-in-out infinite",
              }}
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(224,190,122,.1) 1px, transparent 1px)",
                backgroundSize: "26px 26px",
                maskImage:
                  "radial-gradient(ellipse 80% 80% at 50% 0%, #000 20%, transparent 75%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 80% 80% at 50% 0%, #000 20%, transparent 75%)",
              }}
              aria-hidden
            />
            <div className="relative flex flex-wrap items-center justify-center gap-[46px]">
              <div className="min-w-[290px] max-w-[520px] flex-1 text-[var(--color-nkl-cream)]">
                <span className="text-[0.78rem] font-extrabold tracking-[0.24em] text-[var(--color-nkl-gold-bright)]">
                  {c.booking.eyebrow}
                </span>
                <h2 className="mt-3 mb-0 text-[clamp(1.8rem,3.8vw,2.7rem)] leading-[1.4] font-extrabold">
                  {c.booking.title}{" "}
                  <span className="nkl-gold-text">{c.booking.highlight}</span>
                </h2>
                <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-[rgba(224,190,122,0.35)] bg-[rgba(224,190,122,0.08)] px-4 py-1.5 text-[0.78rem] font-extrabold text-[var(--color-nkl-champagne)]">
                  <Icon.Sparkles className="size-3.5" />
                  {c.booking.badge}
                </span>
                <p className="mt-3.5 mb-0 font-light text-[rgba(250,244,232,0.7)]">
                  {c.booking.body}
                </p>
                <div className="mt-[26px] flex flex-col gap-3.5">
                  {c.booking.points.map((point, i) => {
                    const PointIcon = BOOKING_POINT_ICONS[i] ?? Icon.CircleCheck;
                    return (
                      <span
                        key={point}
                        className="inline-flex items-center gap-2.5 text-[0.9rem] text-[rgba(250,244,232,0.75)]"
                      >
                        <PointIcon className="size-4 shrink-0 text-[var(--color-nkl-gold-bright)]" />
                        {point}
                      </span>
                    );
                  })}
                </div>
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-7 inline-flex items-center gap-2.5 rounded-full border border-[rgba(37,211,102,0.5)] px-[26px] py-[13px] text-[0.95rem] font-extrabold text-[#25D366] transition-colors duration-300 hover:bg-[rgba(37,211,102,0.1)]"
                >
                  <Icon.MessageCircle className="size-[18px]" />
                  {c.booking.whatsapp}
                </a>
              </div>
              <div className="min-w-[290px] max-w-[480px] flex-1">
                <Booking />
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ——— الفوتر ——— */}
      <footer className="border-t border-[var(--color-nkl-line)] px-[22px] pt-11 pb-[120px] text-center md:pb-11">
        <div className="mb-3.5 flex justify-center">
          <Image
            src="/neck-lift/logo.webp"
            alt="MD Clinics | مجمع عيادات د. مها دحلان الطبي"
            width={110}
            height={110}
            className="size-[110px] object-contain"
          />
        </div>
        <div className="flex justify-center gap-5 text-[0.86rem]">
          <a
            dir="ltr"
            href={TEL_LINK}
            className="text-[var(--color-nkl-bronze)] hover:text-[var(--color-nkl-gold)]"
          >
            {PHONE_DISPLAY}
          </a>
          <span className="text-[rgba(166,124,61,0.4)]">✦</span>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-nkl-bronze)] hover:text-[var(--color-nkl-gold)]"
          >
            {c.footer.whatsapp}
          </a>
          <span className="text-[rgba(166,124,61,0.4)]">✦</span>
          <a
            href="#booking"
            className="text-[var(--color-nkl-bronze)] hover:text-[var(--color-nkl-gold)]"
          >
            {c.footer.book}
          </a>
        </div>
        <p className="mt-4 mb-0 text-[0.74rem] text-[rgba(39,28,17,0.4)]">
          {c.footer.disclaimer}
        </p>
      </footer>

      <WhatsAppFAB
        tokenPrefix="nkl"
        whatsappNumber={WHATSAPP_NUMBER}
        topicMessage={WA_TOPIC_MESSAGE}
      />
      <StickyBar />
    </main>
  );
}
