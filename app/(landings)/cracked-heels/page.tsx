import type { Metadata } from "next";
import Image from "next/image";
import { Icon } from "@/components/icons";
import { WhatsAppFAB } from "@/components/usablecomponents/WhatsAppFAB";
import { Header } from "./_components/Header";
import { Hero } from "./_components/Hero";
import { MarqueeStrip } from "./_components/MarqueeStrip";
import { Parallax, Reveal, ScrollProgress, SpotlightCard } from "./_components/Gsap";
import { Stages } from "./_components/Stages";
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
import { CRACKED_HEELS } from "./content";

/** Icons for the "causes" cards, in content order. */
const CAUSE_ICONS = [
  Icon.Droplet,
  Icon.Clock,
  Icon.Footprints,
  Icon.ShowerHead,
  Icon.Scale,
  Icon.Stethoscope,
] as const;

/** Icons for the protocol steps, in content order. */
const PROTOCOL_ICONS = [
  Icon.ClipboardCheck,
  Icon.ShieldCheck,
  Icon.Layers,
  Icon.Droplets,
  Icon.Sparkles,
  Icon.CalendarCheck,
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
      <span className="text-[0.78rem] font-extrabold tracking-[0.24em] text-[var(--color-crh-gold)]">
        {eyebrow}
      </span>
      <h2 className="m-0 text-[clamp(1.8rem,3.8vw,2.7rem)] leading-[1.4] font-extrabold">
        {title}{" "}
        {highlight && <span className="crh-gold-text">{highlight}</span>}
      </h2>
      {sub && (
        <p className="m-0 max-w-[54ch] font-light text-[var(--color-crh-muted)]">
          {sub}
        </p>
      )}
    </Reveal>
  );
}

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPageContent(CRACKED_HEELS);
  return {
    title: seo.title,
    description: seo.description,
    openGraph: {
      title: seo.title,
      description: seo.ogDescription,
      locale: "ar_SA",
      type: "website",
      images: [{ url: "/cracked-heels/hero.webp", width: 1536, height: 2048 }],
    },
  };
}

export default async function CrackedHeelsPage() {
  const c = await getPageContent(CRACKED_HEELS);
  const causes = c.causes.cards.map((card, i) => ({ ...card, icon: CAUSE_ICONS[i] }));
  const protocol = c.protocol.cards.map((card, i) => ({
    ...card,
    icon: PROTOCOL_ICONS[i],
  }));
  const whyUs = c.whyUs.cards.map((card, i) => ({ ...card, icon: WHY_US_ICONS[i] }));

  return (
    <main>
      <ScrollProgress />
      <Header cta={c.cta.header} />
      <Hero copy={c.hero} />
      <MarqueeStrip words={c.marquee.items} />

      {/* ——— الأسباب ——— */}
      <section className="relative mx-auto max-w-[1180px] px-[22px] pt-[110px] pb-[90px]">
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
                    "linear-gradient(135deg, rgba(228,200,126,.18), rgba(140,106,63,.08))",
                }}
              >
                <c.icon className="size-[22px] text-[var(--color-crh-gold-soft)]" strokeWidth={1.8} />
              </div>
              <h3 className="mb-2 text-[1.1rem] font-extrabold">{c.title}</h3>
              <p className="m-0 text-[0.92rem] font-light text-[var(--color-crh-muted)]">
                {c.body}
              </p>
            </SpotlightCard>
          ))}
        </div>
      </section>

      {/* ——— المراحل (مثبتة ومتدرجة مع التمرير) ——— */}
      <Stages copy={c.stages} />

      {/* ——— البروتوكول ——— */}
      <section className="relative mx-auto max-w-[1180px] px-[22px] py-[110px]">
        <SectionHead
          eyebrow={c.protocol.eyebrow}
          title={c.protocol.title}
          highlight={c.protocol.highlight}
          sub={c.protocol.sub}
        />
        <div className="grid gap-[22px] sm:grid-cols-2 lg:grid-cols-3">
          {protocol.map((s, i) => (
            <Reveal key={s.num} delay={(i % 3) * 90}>
              <div className="relative overflow-hidden rounded-3xl border border-[var(--color-crh-line)] bg-[var(--color-crh-card)] px-7 py-[34px] transition-all duration-300 hover:-translate-y-1.5 hover:border-[rgba(228,200,126,0.5)] hover:shadow-[0_28px_58px_-26px_rgba(212,175,55,0.4)]">
                <span className="absolute top-3.5 left-5 text-[3.2rem] leading-none font-extrabold text-[rgba(212,175,55,0.1)]">
                  {s.num}
                </span>
                <div
                  className="mb-[18px] flex size-[52px] items-center justify-center rounded-full shadow-[0_10px_24px_-10px_rgba(212,175,55,0.5)]"
                  style={{
                    background: "linear-gradient(135deg, #8C6A3F, #E4C87E)",
                  }}
                >
                  <s.icon className="size-6 text-[#1C120C]" strokeWidth={1.8} />
                </div>
                <span className="mb-2.5 inline-flex items-center gap-1.5 rounded-full border border-[rgba(176,141,87,0.3)] bg-[rgba(212,175,55,0.1)] px-3 py-1 text-[0.72rem] font-extrabold text-[var(--color-crh-gold-soft)]">
                  <Icon.Check className="size-3" strokeWidth={3} />
                  {s.tag}
                </span>
                <h3 className="mb-2.5 text-[1.2rem] font-extrabold">{s.title}</h3>
                <p className="m-0 text-[0.94rem] font-light text-[var(--color-crh-muted)]">
                  {s.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* لماذا عيادة مها دحلان */}
        <Reveal delay={120} className="mt-14">
          <div className="grid gap-px overflow-hidden rounded-3xl border border-[var(--color-crh-line)] bg-[var(--color-crh-line)] sm:grid-cols-2 lg:grid-cols-4">
            {whyUs.map((u) => (
              <div
                key={u.title}
                className="flex flex-col gap-2 bg-[var(--color-crh-card)] px-6 py-7"
              >
                <u.icon className="size-6 text-[var(--color-crh-gold-soft)]" strokeWidth={1.8} />
                <b className="text-[1rem] font-extrabold">{u.title}</b>
                <p className="m-0 text-[0.86rem] font-light text-[var(--color-crh-muted)]">
                  {u.body}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ——— النتائج ——— */}
      <section className="relative overflow-hidden border-y border-[rgba(176,141,87,0.15)] bg-[var(--color-crh-band)] px-[22px] py-[100px]">
        <div
          className="pointer-events-none absolute -top-[120px] -left-[140px] size-[420px] rounded-full blur-[60px]"
          style={{
            background:
              "radial-gradient(circle, rgba(228,200,126,.18), transparent 65%)",
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
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Parallax from={26} to={-26}>
              <Reveal>
                <div className="relative overflow-hidden rounded-[30px] border border-[var(--color-crh-line-strong)] shadow-[0_44px_90px_-40px_rgba(0,0,0,0.9)]">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src="/cracked-heels/pedicure.webp"
                      alt="جلسة عناية طبية بالكعب داخل العيادة"
                      fill
                      sizes="(max-width: 1024px) 92vw, 560px"
                      className="object-cover"
                    />
                  </div>
                  <span className="absolute right-4 bottom-4 inline-flex items-center gap-2 rounded-full border border-[var(--color-crh-line-strong)] bg-[rgba(20,13,8,0.85)] px-4 py-2 text-[0.76rem] font-extrabold text-[var(--color-crh-gold-soft)] backdrop-blur-lg">
                    <Icon.ShieldCheck className="size-3.5" />
                    {c.results.imageBadge}
                  </span>
                </div>
              </Reveal>
            </Parallax>

            <div className="flex flex-col gap-6">
              {c.results.points.map((r, i) => (
                <Reveal key={r} delay={i * 100}>
                  <div className="flex items-center gap-4 rounded-2xl border border-[var(--color-crh-line)] bg-[var(--color-crh-card)] px-5 py-4">
                    <span
                      className="flex size-9 shrink-0 items-center justify-center rounded-full"
                      style={{
                        background: "linear-gradient(135deg, #8C6A3F, #E4C87E)",
                      }}
                    >
                      <Icon.Check className="size-[18px] text-[#1C120C]" strokeWidth={2.6} />
                    </span>
                    <b className="text-[1rem] font-extrabold">{r}</b>
                  </div>
                </Reveal>
              ))}

              {/* الدفع الآجل */}
              <Reveal delay={420}>
                <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-dashed border-[rgba(212,175,55,0.35)] bg-[rgba(212,175,55,0.06)] px-5 py-4">
                  <span className="text-[0.9rem] font-bold text-[var(--color-crh-cream-soft)]">
                    {c.results.paymentLabel}
                  </span>
                  <span className="flex items-center gap-2.5">
                    <span className="flex h-9 items-center rounded-lg bg-white px-3">
                      <Image
                        src="/tabby.png"
                        alt="تابي"
                        width={52}
                        height={22}
                        className="h-[22px] w-auto object-contain"
                      />
                    </span>
                    <span className="flex h-9 items-center rounded-lg bg-white px-3">
                      <Image
                        src="/tamara.jpeg"
                        alt="تمارا"
                        width={52}
                        height={22}
                        className="h-[22px] w-auto object-contain"
                      />
                    </span>
                  </span>
                </div>
              </Reveal>
              <Reveal delay={500}>
                <p className="m-0 text-[0.78rem] text-[var(--color-crh-faint)]">
                  {c.results.disclaimer}
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ——— بإشراف طبي ——— */}
      <section className="relative mx-auto max-w-[1080px] px-[22px] py-[110px]">
        <SectionHead
          eyebrow={c.doctor.eyebrow}
          title={c.doctor.title}
          highlight={c.doctor.highlight}
          sub={c.doctor.sub}
        />
        <Reveal delay={120}>
          <div className="flex flex-wrap items-center justify-center gap-12">
            {/* arched portrait */}
            <div className="relative w-[clamp(240px,32vw,320px)] shrink-0">
              <div
                className="pointer-events-none absolute -inset-3.5 -rotate-2 rounded-t-full rounded-b-[28px] border border-[rgba(212,175,55,0.3)]"
                aria-hidden
              />
              <div className="relative aspect-[3/4] overflow-hidden rounded-t-full rounded-b-3xl border-2 border-[rgba(228,200,126,0.45)] bg-[var(--color-crh-card)] shadow-[0_36px_80px_-32px_rgba(0,0,0,0.9)]">
                <Image
                  src="/team/dr-dina.avif"
                  alt="د. دينا، طبيبة الجلدية بعيادات د. مها دحلان"
                  fill
                  sizes="(max-width: 768px) 80vw, 320px"
                  className="object-cover object-top"
                />
              </div>
              <span
                className="absolute -right-4 bottom-6 inline-flex items-center gap-[7px] rounded-full border border-[var(--color-crh-line-strong)] bg-[rgba(20,13,8,0.9)] px-4 py-2 text-[0.74rem] font-extrabold whitespace-nowrap text-[var(--color-crh-gold-soft)] shadow-[0_14px_30px_-14px_rgba(0,0,0,0.8)] backdrop-blur-lg"
                style={{ animation: "crh-floaty 7s ease-in-out infinite alternate" }}
              >
                {c.doctor.badge}
              </span>
            </div>

            {/* bio */}
            <div className="min-w-[300px] flex-1 text-center md:max-w-[520px] md:text-right">
              <h3 className="m-0 text-3xl font-extrabold sm:text-4xl">
                {c.doctor.name}
              </h3>
              <p className="mt-1.5 font-bold text-[var(--color-crh-gold-soft)]">
                {c.doctor.role}
              </p>
              <p className="mt-4 mb-0 font-light text-[var(--color-crh-muted)]">
                {c.doctor.bio}
              </p>
              <ul className="mt-6 grid list-none gap-2.5 p-0 sm:grid-cols-2">
                {c.doctor.credentials.map((c) => (
                  <li
                    key={c}
                    className="flex items-center gap-2.5 rounded-2xl border border-[var(--color-crh-line)] bg-[var(--color-crh-card)] px-4 py-2.5 text-xs leading-5 font-bold text-[var(--color-crh-cream-soft)]"
                  >
                    <Icon.BadgeCheck className="size-4 shrink-0 text-[var(--color-crh-gold)]" />
                    {c}
                  </li>
                ))}
              </ul>
              <div
                className="mt-6 rounded-l-[14px] rounded-r border-r-[3px] border-[var(--color-crh-gold-soft)] px-[22px] py-[18px]"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(212,175,55,.1), transparent 70%)",
                }}
              >
                <p className="m-0 text-[1.05rem] font-bold text-[var(--color-crh-cream)]">
                  &#8220;{c.doctor.quote}&#8221;
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ——— قالوا عنا ——— */}
      <section className="relative overflow-hidden border-y border-[rgba(176,141,87,0.15)] bg-[var(--color-crh-band)] py-[100px]">
        <div className="px-[22px]">
          <SectionHead {...c.testimonials} />
        </div>
        <Testimonials />
      </section>

      {/* ——— الأسئلة الشائعة ——— */}
      <section className="relative mx-auto max-w-[780px] px-[22px] pt-[100px] pb-[110px]">
        <SectionHead
          eyebrow={c.faq.eyebrow}
          title={c.faq.title}
          highlight={c.faq.highlight}
        />
        <div className="flex flex-col gap-3.5">
          {c.faq.questions.map((f, i) => (
            <Reveal key={f.q} delay={i * 60}>
              <details className="overflow-hidden rounded-[18px] border border-[var(--color-crh-line)] bg-[var(--color-crh-card)]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-base font-extrabold">
                  {f.q}
                  <span className="crh-pm inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-[rgba(212,175,55,0.4)] text-[1.2rem] font-normal text-[var(--color-crh-gold-soft)]">
                    +
                  </span>
                </summary>
                <p className="m-0 px-6 pb-[22px] text-[0.94rem] font-light text-[var(--color-crh-muted)]">
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
          <div className="relative overflow-hidden rounded-[32px] border border-[var(--color-crh-line)] bg-[var(--color-crh-bg-deep)] p-[clamp(36px,6vw,70px)]">
            <div
              className="pointer-events-none absolute -top-[180px] left-1/2 h-[500px] w-[800px] -translate-x-1/2 blur-[30px]"
              style={{
                background:
                  "radial-gradient(ellipse 50% 50% at 50% 0%, rgba(228,200,126,.2), transparent 70%)",
                animation: "crh-breathe 7s ease-in-out infinite",
              }}
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(228,200,126,.1) 1px, transparent 1px)",
                backgroundSize: "26px 26px",
                maskImage:
                  "radial-gradient(ellipse 80% 80% at 50% 0%, #000 20%, transparent 75%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 80% 80% at 50% 0%, #000 20%, transparent 75%)",
              }}
              aria-hidden
            />
            <div className="relative flex flex-wrap items-center justify-center gap-[46px]">
              <div className="min-w-[290px] max-w-[520px] flex-1 text-[var(--color-crh-cream)]">
                <span className="text-[0.78rem] font-extrabold tracking-[0.24em] text-[var(--color-crh-gold-soft)]">
                  {c.booking.eyebrow}
                </span>
                <h2 className="mt-3 mb-0 text-[clamp(1.8rem,3.8vw,2.7rem)] leading-[1.4] font-extrabold">
                  {c.booking.title}{" "}
                  <span className="crh-gold-text">{c.booking.highlight}</span>
                </h2>
                <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-[rgba(228,200,126,0.35)] bg-[rgba(228,200,126,0.08)] px-4 py-1.5 text-[0.78rem] font-extrabold text-[var(--color-crh-gold-soft)]">
                  <Icon.Sparkles className="size-3.5" />
                  {c.booking.badge}
                </span>
                <p className="mt-3.5 mb-0 font-light text-[rgba(244,233,216,0.7)]">
                  {c.booking.body}
                </p>
                <div className="mt-[26px] flex flex-col gap-3.5">
                  {c.booking.points.map((point, i) => {
                    const PointIcon = BOOKING_POINT_ICONS[i] ?? Icon.CircleCheck;
                    return (
                      <span
                        key={point}
                        className="inline-flex items-center gap-2.5 text-[0.9rem] text-[rgba(244,233,216,0.75)]"
                      >
                        <PointIcon className="size-4 shrink-0 text-[var(--color-crh-gold-soft)]" />
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
                <Booking copy={c.booking} />
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ——— الفوتر ——— */}
      <footer className="border-t border-[var(--color-crh-line)] px-[22px] pt-11 pb-[120px] text-center md:pb-11">
        <div className="mb-3.5 flex justify-center">
          <Image
            src="/cracked-heels/logo.webp"
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
            className="text-[var(--color-crh-gold-soft)] hover:text-[var(--color-crh-gold)]"
          >
            {PHONE_DISPLAY}
          </a>
          <span className="text-[rgba(212,175,55,0.4)]">✦</span>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-crh-gold-soft)] hover:text-[var(--color-crh-gold)]"
          >
            {c.footer.whatsapp}
          </a>
          <span className="text-[rgba(212,175,55,0.4)]">✦</span>
          <a
            href="#booking"
            className="text-[var(--color-crh-gold-soft)] hover:text-[var(--color-crh-gold)]"
          >
            {c.footer.book}
          </a>
        </div>
        <p className="mt-4 mb-0 text-[0.74rem] text-[var(--color-crh-faint)]">
          {c.footer.disclaimer}
        </p>
      </footer>

      <WhatsAppFAB
        tokenPrefix="crh"
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
