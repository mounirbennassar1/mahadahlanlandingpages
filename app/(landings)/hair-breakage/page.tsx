import type { Metadata } from "next";
import Image from "next/image";
import { Icon } from "@/components/icons";
import { WhatsAppFAB } from "@/components/usablecomponents/WhatsAppFAB";
import { Header } from "./_components/Header";
import { Hero } from "./_components/Hero";
import { MarqueeStrip } from "./_components/MarqueeStrip";
import {
  Counter,
  Parallax,
  Reveal,
  ScrollProgress,
  SpotlightCard,
} from "./_components/Gsap";
import { Protocol } from "./_components/Protocol";
import { Doctor } from "./_components/Doctor";
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
import { HAIR_BREAKAGE } from "./content";

/** Icons for the "causes" cards, in content order. */
const CAUSE_ICONS = [
  Icon.Flame,
  Icon.Palette,
  Icon.Wheat,
  Icon.Cable,
  Icon.Droplet,
  Icon.Moon,
] as const;

/** Icons for the result milestones, in content order. */
const MILESTONE_ICONS = [Icon.Sparkles, Icon.TrendingUp, Icon.Crown] as const;

/** Animated proof counters; only their captions are editable. The numerals
 *  are rendered by <Counter>, so value/prefix/suffix stay in code. */
const RESULT_COUNTERS = [
  { value: 1270, prefix: "+", suffix: "" },
  { value: 13, prefix: "+", suffix: " عاماً" },
  { value: 100, prefix: "", suffix: "٪" },
] as const;

/** Icons for the "why us" strip, in content order. */
const WHY_US_ICONS = [
  Icon.HeartHandshake,
  Icon.BadgeCheck,
  Icon.Users,
  Icon.CalendarCheck,
] as const;

/** Icons for the booking reassurance points, in content order. */
const BOOKING_POINT_ICONS = [Icon.Lock, Icon.CircleCheck, Icon.Clock] as const;

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
      <span className="text-[0.78rem] font-extrabold tracking-[0.24em] text-[var(--color-hab-gold)]">
        {eyebrow}
      </span>
      <h2 className="m-0 text-[clamp(1.8rem,3.8vw,2.7rem)] leading-[1.4] font-extrabold">
        {title} {highlight && <span className="hab-gold-text">{highlight}</span>}
      </h2>
      {sub && (
        <p className="m-0 max-w-[54ch] font-light text-[var(--color-hab-muted)]">
          {sub}
        </p>
      )}
    </Reveal>
  );
}

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPageContent(HAIR_BREAKAGE);
  return {
    title: seo.title,
    description: seo.description,
    openGraph: {
      title: seo.title,
      description: seo.ogDescription,
      locale: "ar_SA",
      type: "website",
      images: [{ url: "/hair-breakage/hero.webp", width: 1536, height: 2048 }],
    },
  };
}

export default async function HairBreakagePage() {
  const c = await getPageContent(HAIR_BREAKAGE);
  const causes = c.causes.cards.map((card, i) => ({ ...card, icon: CAUSE_ICONS[i] }));
  const milestones = c.results.milestones.map((m, i) => ({
    ...m,
    icon: MILESTONE_ICONS[i],
  }));
  const counters = RESULT_COUNTERS.map((counter, i) => ({
    ...counter,
    label: c.results.counters[i] ?? "",
  }));
  const whyUs = c.whyUs.cards.map((card, i) => ({ ...card, icon: WHY_US_ICONS[i] }));

  return (
    <main>
      <ScrollProgress />
      <Header cta={c.cta.header} />
      <Hero copy={c.hero} videoSrc="/hair-breakage/hero-loop.mp4" />
      <MarqueeStrip words={c.marquee.items} />

      {/* ——— تساقط أم تكسر؟ ——— */}
      <section className="relative mx-auto max-w-[1180px] px-[22px] pt-[110px] pb-[90px]">
        <SectionHead
          eyebrow={c.problem.eyebrow}
          title={c.problem.title}
          highlight={c.problem.highlight}
          sub={c.problem.sub}
        />
        <div className="grid items-start gap-8 lg:grid-cols-2">
          {/* علامات التكسر */}
          <Reveal>
            <div className="rounded-[26px] border border-[var(--color-hab-line)] bg-[var(--color-hab-card)] p-8">
              <h3 className="mt-0 mb-5 text-[1.25rem] font-extrabold">
                {c.problem.signsTitle}{" "}
                <span className="hab-gold-text">{c.problem.signsHighlight}</span>
              </h3>
              <ul className="m-0 flex list-none flex-col gap-3.5 p-0">
                {c.problem.signs.map((s) => (
                  <li key={s} className="flex items-start gap-3">
                    <span className="mt-1 flex size-[22px] shrink-0 items-center justify-center rounded-full border border-[rgba(212,175,55,0.4)] bg-[rgba(212,175,55,0.12)]">
                      <Icon.Check
                        className="size-3 text-[var(--color-hab-champagne)]"
                        strokeWidth={3}
                      />
                    </span>
                    <span className="text-[0.96rem] font-light text-[rgba(245,239,224,0.78)]">
                      {s}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* مقارنة سريعة */}
          <Reveal delay={120}>
            <div className="overflow-hidden rounded-[26px] border border-[var(--color-hab-line)]">
              <div className="grid grid-cols-2 gap-px bg-[var(--color-hab-line)]">
                <div className="bg-[var(--color-hab-band)] p-6">
                  <span className="mb-3 inline-flex items-center gap-2 text-[0.8rem] font-extrabold text-[var(--color-hab-champagne)]">
                    <Icon.Scissors className="size-4" />
                    {c.problem.breakageLabel}
                  </span>
                  <p className="m-0 text-[0.9rem] font-light text-[rgba(245,239,224,0.75)]">
                    {c.problem.breakageBody}
                  </p>
                </div>
                <div className="bg-[var(--color-hab-band)] p-6">
                  <span className="mb-3 inline-flex items-center gap-2 text-[0.8rem] font-extrabold text-[rgba(245,239,224,0.55)]">
                    <Icon.ArrowDown className="size-4" />
                    {c.problem.sheddingLabel}
                  </span>
                  <p className="m-0 text-[0.9rem] font-light text-[rgba(245,239,224,0.6)]">
                    {c.problem.sheddingBody}
                  </p>
                </div>
              </div>
              <div className="border-t border-[var(--color-hab-line)] bg-[var(--color-hab-card)] px-6 py-5">
                <p className="m-0 text-[0.88rem] font-light text-[var(--color-hab-muted)]">
                  <b className="font-extrabold text-[var(--color-hab-champagne)]">
                    {c.problem.noteStrong}
                  </b>{" "}
                  {c.problem.note}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ——— الأسباب ——— */}
      <section className="relative border-y border-[rgba(212,175,55,0.14)] bg-[var(--color-hab-band)] px-[22px] py-[100px]">
        <div className="mx-auto max-w-[1180px]">
          <SectionHead
            eyebrow={c.causes.eyebrow}
            title={c.causes.title}
            highlight={c.causes.highlight}
            sub={c.causes.sub}
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {causes.map((c, i) => (
              <SpotlightCard
                key={c.title}
                delay={(i % 3) * 80}
                className="rounded-[22px] px-[26px] py-[30px]"
              >
                <div
                  className="mb-4 flex size-[46px] items-center justify-center rounded-[14px] border border-[rgba(212,175,55,0.3)]"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(212,175,55,.18), rgba(138,100,48,.08))",
                  }}
                >
                  <c.icon
                    className="size-[22px] text-[var(--color-hab-champagne)]"
                    strokeWidth={1.8}
                  />
                </div>
                <h3 className="mb-2 text-[1.1rem] font-extrabold">{c.title}</h3>
                <p className="m-0 text-[0.92rem] font-light text-[var(--color-hab-muted)]">
                  {c.body}
                </p>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* ——— البروتوكول (مثبّت ومقاد بالتمرير على الشاشات الكبيرة) ——— */}
      <section className="relative py-[110px] lg:py-0">
        <div className="px-[22px] pt-0 lg:pt-[110px]">
          <SectionHead
            eyebrow={c.protocol.eyebrow}
            title={c.protocol.title}
            highlight={c.protocol.highlight}
            sub={c.protocol.sub}
          />
        </div>
        <Protocol steps={c.protocol.steps} />
      </section>

      {/* ——— النتائج ——— */}
      <section className="relative overflow-hidden border-y border-[rgba(212,175,55,0.14)] bg-[var(--color-hab-bg-deep)] px-[22px] py-[100px]">
        {/* liquid gold strands backdrop */}
        <Parallax
          from={-40}
          to={40}
          className="pointer-events-none absolute inset-0 opacity-[0.22]"
        >
          <Image
            src="/hair-breakage/strands.webp"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            aria-hidden
          />
        </Parallax>
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 40%, transparent 30%, rgba(6,6,7,.9))",
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-[1180px]">
          <SectionHead
            eyebrow={c.results.eyebrow}
            title={c.results.title}
            highlight={c.results.highlight}
            sub={c.results.sub}
          />
          <div className="grid gap-[22px] md:grid-cols-3">
            {milestones.map((m, i) => (
              <Reveal key={m.num} delay={i * 120}>
                <div className="relative h-full overflow-hidden rounded-[22px] border border-[var(--color-hab-line)] bg-[rgba(16,16,20,0.82)] px-7 py-[34px] backdrop-blur-md">
                  <div
                    className="absolute inset-x-0 top-0 h-[3px]"
                    style={{
                      background:
                        "linear-gradient(90deg, #8A6430, #F0D48A, transparent)",
                    }}
                    aria-hidden
                  />
                  <span className="text-[2.4rem] leading-none font-extrabold text-[rgba(212,175,55,0.22)]">
                    {m.num}
                  </span>
                  <m.icon
                    className="mt-3 size-6 text-[var(--color-hab-champagne)]"
                    strokeWidth={1.8}
                  />
                  <h3 className="mt-3 mb-2.5 text-[1.15rem] font-extrabold">
                    {m.title}
                  </h3>
                  <p className="m-0 text-[0.94rem] font-light text-[var(--color-hab-muted)]">
                    {m.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* proof counters */}
          <Reveal delay={140} className="mt-12">
            <div className="grid gap-px overflow-hidden rounded-3xl border border-[var(--color-hab-line)] bg-[var(--color-hab-line)] sm:grid-cols-3">
              {counters.map((counter) => (
                <div
                  key={counter.label}
                  className="flex flex-col items-center gap-1 bg-[rgba(16,16,20,0.85)] px-6 py-8"
                >
                  <Counter
                    value={counter.value}
                    prefix={counter.prefix}
                    suffix={counter.suffix}
                    className="text-[2rem] font-extrabold text-[var(--color-hab-champagne)]"
                  />
                  <span className="text-[0.82rem] font-bold text-[rgba(245,239,224,0.55)]">
                    {counter.label}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-[18px] mb-0 text-center text-[0.78rem] text-[rgba(245,239,224,0.4)]">
              {c.results.disclaimer}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ——— الطبيبة ——— */}
      <section className="relative overflow-hidden px-[22px] py-[110px]">
        <div
          className="pointer-events-none absolute -top-[120px] -left-[140px] size-[420px] rounded-full blur-[60px]"
          style={{
            background:
              "radial-gradient(circle, rgba(212,175,55,.18), transparent 65%)",
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-[1080px]">
          <SectionHead
            eyebrow={c.doctor.eyebrow}
            title={c.doctor.title}
            highlight={c.doctor.highlight}
            sub={c.doctor.sub}
          />
          <Doctor copy={c.doctor} />

          {/* لماذا عيادة مها دحلان */}
          <Reveal delay={120} className="mt-14">
            <div className="grid gap-px overflow-hidden rounded-3xl border border-[var(--color-hab-line)] bg-[var(--color-hab-line)] sm:grid-cols-2 lg:grid-cols-4">
              {whyUs.map((u) => (
                <div
                  key={u.title}
                  className="flex flex-col gap-2 bg-[var(--color-hab-card)] px-6 py-7"
                >
                  <u.icon
                    className="size-6 text-[var(--color-hab-champagne)]"
                    strokeWidth={1.8}
                  />
                  <b className="text-[1rem] font-extrabold">{u.title}</b>
                  <p className="m-0 text-[0.86rem] font-light text-[var(--color-hab-muted)]">
                    {u.body}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ——— قالوا عنا ——— */}
      <section className="relative overflow-hidden border-y border-[rgba(212,175,55,0.14)] bg-[var(--color-hab-band)] py-[100px]">
        <div className="px-[22px]">
          <SectionHead {...c.testimonials} />
        </div>
        <Testimonials />
      </section>

      {/* ——— الأسئلة الشائعة ——— */}
      <section className="relative mx-auto max-w-[780px] px-[22px] pt-[110px] pb-[110px]">
        <SectionHead
          eyebrow={c.faq.eyebrow}
          title={c.faq.title}
          highlight={c.faq.highlight}
        />
        <div className="flex flex-col gap-3.5">
          {c.faq.questions.map((f, i) => (
            <Reveal key={f.q} delay={i * 60}>
              <details className="overflow-hidden rounded-[18px] border border-[rgba(212,175,55,0.2)] bg-[var(--color-hab-card)]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-base font-extrabold">
                  {f.q}
                  <span className="hab-pm inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-[rgba(212,175,55,0.4)] text-[1.2rem] font-normal text-[var(--color-hab-champagne)]">
                    +
                  </span>
                </summary>
                <p className="m-0 px-6 pb-[22px] text-[0.94rem] font-light text-[rgba(245,239,224,0.65)]">
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
          <div className="relative overflow-hidden rounded-[32px] border border-[rgba(212,175,55,0.25)] bg-[var(--color-hab-bg-deep)] p-[clamp(36px,6vw,70px)]">
            <div
              className="pointer-events-none absolute -top-[180px] left-1/2 h-[500px] w-[800px] -translate-x-1/2 blur-[30px]"
              style={{
                background:
                  "radial-gradient(ellipse 50% 50% at 50% 0%, rgba(240,212,138,.2), transparent 70%)",
                animation: "hab-breathe 7s ease-in-out infinite",
              }}
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(240,212,138,.1) 1px, transparent 1px)",
                backgroundSize: "26px 26px",
                maskImage:
                  "radial-gradient(ellipse 80% 80% at 50% 0%, #000 20%, transparent 75%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 80% 80% at 50% 0%, #000 20%, transparent 75%)",
              }}
              aria-hidden
            />
            <div className="relative flex flex-wrap items-center justify-center gap-[46px]">
              <div className="min-w-[290px] max-w-[520px] flex-1 text-[var(--color-hab-ink)]">
                <span className="text-[0.78rem] font-extrabold tracking-[0.24em] text-[var(--color-hab-champagne)]">
                  {c.booking.eyebrow}
                </span>
                <h2 className="mt-3 mb-0 text-[clamp(1.8rem,3.8vw,2.7rem)] leading-[1.4] font-extrabold">
                  {c.booking.title}{" "}
                  <span className="hab-gold-text">{c.booking.highlight}</span>
                </h2>
                <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-[rgba(240,212,138,0.35)] bg-[rgba(240,212,138,0.08)] px-4 py-1.5 text-[0.78rem] font-extrabold text-[var(--color-hab-champagne)]">
                  <Icon.Sparkles className="size-3.5" />
                  {c.booking.badge}
                </span>
                <p className="mt-3.5 mb-0 font-light text-[rgba(245,239,224,0.7)]">
                  {c.booking.body}
                </p>
                <div className="mt-[26px] flex flex-col gap-3.5">
                  {c.booking.points.map((point, i) => {
                    const PointIcon = BOOKING_POINT_ICONS[i] ?? Icon.CircleCheck;
                    return (
                      <span
                        key={point}
                        className="inline-flex items-center gap-2.5 text-[0.9rem] text-[rgba(245,239,224,0.75)]"
                      >
                        <PointIcon className="size-4 shrink-0 text-[var(--color-hab-champagne)]" />
                        {point}
                      </span>
                    );
                  })}
                </div>

                {/* الدفع الآجل */}
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <span className="text-[0.82rem] font-bold text-[rgba(245,239,224,0.6)]">
                    {c.booking.paymentLabel}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#F5EFE0] px-3.5 py-1.5">
                    <Image
                      src="/tabby.png"
                      alt="تابي"
                      width={52}
                      height={20}
                      className="h-5 w-auto object-contain"
                    />
                  </span>
                  <span className="inline-flex items-center gap-2 overflow-hidden rounded-full bg-[#F5EFE0] px-3.5 py-1.5">
                    <Image
                      src="/tamara.jpeg"
                      alt="تمارا"
                      width={52}
                      height={20}
                      className="h-5 w-auto object-contain"
                    />
                  </span>
                </div>

                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2.5 rounded-full border border-[rgba(37,211,102,0.5)] px-[26px] py-[13px] text-[0.95rem] font-extrabold text-[#25D366] transition-colors duration-300 hover:bg-[rgba(37,211,102,0.1)]"
                >
                  <Icon.MessageCircle className="size-[18px]" />
                  {c.booking.whatsapp}
                </a>
              </div>
              <div className="min-w-[290px] max-w-[480px] flex-1">
                <Booking copy={c.booking} />
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ——— الفوتر ——— */}
      <footer className="border-t border-[var(--color-hab-line)] px-[22px] pt-11 pb-[120px] text-center md:pb-11">
        <div className="mb-3.5 flex justify-center">
          <Image
            src="/hair-breakage/logo.webp"
            alt="MD Clinics | مجمع عيادات د. مها دحلان الطبي"
            width={110}
            height={110}
            className="size-[110px] object-contain brightness-0 invert opacity-90"
          />
        </div>
        <div className="flex justify-center gap-5 text-[0.86rem]">
          <a
            dir="ltr"
            href={TEL_LINK}
            className="text-[var(--color-hab-gold-soft)] hover:text-[var(--color-hab-champagne)]"
          >
            {PHONE_DISPLAY}
          </a>
          <span className="text-[rgba(212,175,55,0.4)]">✦</span>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-hab-gold-soft)] hover:text-[var(--color-hab-champagne)]"
          >
            {c.footer.whatsapp}
          </a>
          <span className="text-[rgba(212,175,55,0.4)]">✦</span>
          <a
            href="#booking"
            className="text-[var(--color-hab-gold-soft)] hover:text-[var(--color-hab-champagne)]"
          >
            {c.footer.book}
          </a>
        </div>
        <p className="mt-4 mb-0 text-[0.74rem] text-[rgba(245,239,224,0.35)]">
          {c.footer.disclaimer}
        </p>
      </footer>

      <WhatsAppFAB
        tokenPrefix="hab"
        whatsappNumber={WHATSAPP_NUMBER}
        topicMessage={WA_TOPIC_MESSAGE}
      />
      <StickyBar
        bookLabel={c.cta.sticky}
        whatsappLabel={c.cta.stickyWhatsapp}
      />
    </main>
  );
}
