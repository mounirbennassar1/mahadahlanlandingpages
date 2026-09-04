import type { Metadata } from "next";
import Image from "next/image";
import { Icon } from "@/components/icons";
import { WhatsAppFAB } from "@/components/usablecomponents/WhatsAppFAB";
import { ScrollSystem } from "./_components/ScrollSystem";
import { Header } from "./_components/Header";
import { Hero } from "./_components/Hero";
import { MarqueeStrip } from "./_components/MarqueeStrip";
import { ApproachPin } from "./_components/ApproachPin";
import { Doctors } from "./_components/Doctors";
import { Testimonials } from "./_components/Testimonials";
import { LeadForm } from "./_components/LeadForm";
import { StickyBar } from "./_components/StickyBar";
import {
  PHONE_DISPLAY,
  TEL_LINK,
  WA_LINK,
  WA_TOPIC_MESSAGE,
  WHATSAPP_NUMBER,
} from "./_components/config";
import { getPageContent } from "@/lib/pages/get";
import { CHRONIC_ECZEMA } from "./content";

// Bento order: index 0 and 3 render as the two wide cards stacked on the
// right column (RTL start); the rest fill the 2×2 on the left.
/** Icons for the symptom bento cards, in content order. */
const SYMPTOM_ICONS = [
  Icon.Moon,
  Icon.Droplets,
  Icon.Flame,
  Icon.BedDouble,
  Icon.Layers,
  Icon.RefreshCw,
] as const;

/** Icons for the treatment index rows, in content order. */
const TECH_ICONS = [
  Icon.Sun,
  Icon.Dna,
  Icon.Pipette,
  Icon.Bandage,
  Icon.TestTubes,
  Icon.Sparkles,
] as const;

/** Icons for the "why us" strip, in content order. */
const WHY_US_ICONS = [
  Icon.HeartHandshake,
  Icon.Stethoscope,
  Icon.Users,
  Icon.CalendarCheck,
] as const;

/** Icons for the booking reassurance points, in content order. */
const BOOKING_POINT_ICONS = [Icon.Lock, Icon.CircleCheck, Icon.Clock] as const;

/** Editorial section head: kicker + hairline, then an asymmetric split —
 *  display title on the right (RTL), standfirst on the left. */
function SectionHead({
  eyebrow,
  title,
  highlight,
  after,
  sub,
}: {
  eyebrow: string;
  title: string;
  highlight?: string;
  after?: string;
  sub?: string;
}) {
  return (
    <div className="mb-14" data-reveal="up">
      <div className="flex items-center gap-4 text-[0.72rem] font-extrabold tracking-[0.22em] text-[var(--color-che-gold-bright)]">
        <span className="whitespace-nowrap">{eyebrow}</span>
        <span className="h-px flex-1 bg-[var(--color-che-line)]" aria-hidden />
      </div>
      <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-14">
        <h2 className="m-0 max-w-[24ch] text-[clamp(1.9rem,4.4vw,3.2rem)] leading-[1.3] font-extrabold">
          {title}{" "}
          {highlight && (
            <em className="che-gold-text not-italic">{highlight}</em>
          )}
          {after && <> {after}</>}
        </h2>
        {sub && (
          <p className="m-0 max-w-[42ch] text-[0.98rem] leading-8 font-light text-[var(--color-che-muted)] lg:pb-1.5 lg:text-left">
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPageContent(CHRONIC_ECZEMA);
  return {
    title: seo.title,
    description: seo.description,
    openGraph: {
      title: seo.title,
      description: seo.ogDescription,
      locale: "ar_SA",
      type: "website",
      images: [{ url: "/chronic-eczema/hero-bg.jpg", width: 1280, height: 720 }],
    },
  };
}

export default async function ChronicEczemaPage() {
  const c = await getPageContent(CHRONIC_ECZEMA);
  const symptoms = c.symptoms.cards.map((card, i) => ({
    ...card,
    icon: SYMPTOM_ICONS[i],
  }));
  const techs = c.techs.cards.map((card, i) => ({ ...card, icon: TECH_ICONS[i] }));
  const whyUs = c.whyUs.cards.map((card, i) => ({ ...card, icon: WHY_US_ICONS[i] }));

  return (
    <main className="relative">
      <ScrollSystem />
      <div className="relative z-[1]">
        <Header cta={c.cta.header} />
        <Hero copy={c.hero} />
        <MarqueeStrip words={c.marquee.items} />

        {/* ——— ٠١ الأعراض ، bento grid ——— */}
        <section className="relative mx-auto max-w-[1240px] px-[22px] pt-[110px] pb-[100px]">
          <SectionHead
            eyebrow={c.symptoms.eyebrow}
            title={c.symptoms.title}
            highlight={c.symptoms.highlight}
            sub={c.symptoms.sub}
          />
          <div
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-[repeat(2,minmax(0,1fr))]"
            data-reveal-group
          >
            {symptoms.map((s, i) => {
              const wide = i === 0 || i === 3;
              return (
                <div
                  key={s.title}
                  data-reveal-child
                  className={`group relative flex flex-col rounded-lg border border-[var(--color-che-line)] bg-[rgba(29,18,50,0.55)] px-6 py-7 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-che-line-gold)] hover:shadow-[0_26px_54px_-28px_rgba(0,0,0,0.8)] ${
                    wide ? "sm:col-span-2 lg:p-8" : ""
                  }`}
                >
                  <span
                    className="pointer-events-none absolute top-4 left-5 select-none text-[2rem] leading-none font-extrabold text-[rgba(201,164,92,0.22)]"
                    aria-hidden
                  >
                    {s.num}
                  </span>
                  <span
                    className={`flex items-center justify-center rounded-full border border-[var(--color-che-line-gold)] text-[var(--color-che-gold-bright)] transition-colors duration-300 group-hover:bg-[var(--color-che-gold)] group-hover:text-[#231303] ${
                      wide ? "size-12" : "size-11"
                    }`}
                  >
                    <s.icon
                      className={wide ? "size-[22px]" : "size-5"}
                      strokeWidth={1.7}
                    />
                  </span>
                  <h3
                    className={`mb-2 font-extrabold ${
                      wide ? "mt-5 text-[1.25rem]" : "mt-5 text-[1.08rem]"
                    }`}
                  >
                    {s.title}
                  </h3>
                  <p
                    className={`m-0 font-light text-[var(--color-che-muted)] ${
                      wide
                        ? "max-w-[52ch] text-[0.95rem] leading-7"
                        : "text-[0.9rem] leading-7"
                    }`}
                  >
                    {s.body}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ——— ٠٢ لماذا تصبح مزمنة ——— */}
        <section className="relative border-t border-[var(--color-che-line)] px-[22px] py-[110px]">
          <div className="mx-auto grid max-w-[1240px] items-center gap-16 lg:grid-cols-[1fr_0.85fr]">
            <div>
              <div data-reveal="up">
                <div className="flex items-center gap-4 text-[0.72rem] font-extrabold tracking-[0.22em] text-[var(--color-che-gold-bright)]">
                  <span>{c.cycle.eyebrow}</span>
                  <span
                    className="h-px w-24 bg-[var(--color-che-line)]"
                    aria-hidden
                  />
                </div>
                <h2 className="mt-6 mb-7 text-[clamp(1.9rem,4.4vw,3.2rem)] leading-[1.3] font-extrabold">
                  {c.cycle.title}{" "}
                  <em className="che-gold-text not-italic">
                    {c.cycle.highlight}
                  </em>
                </h2>
              </div>
              <p
                className="mb-10 max-w-[58ch] text-[1.08rem] leading-9 font-light text-[var(--color-che-ink-2)]"
                data-words
              >
                {c.cycle.body}
              </p>
              <div data-reveal-group>
                {c.cycle.cards.map((c) => (
                  <div
                    key={c.num}
                    data-reveal-child
                    className="flex gap-6 border-t border-[var(--color-che-line)] py-5"
                  >
                    <span
                      className="select-none text-[2.2rem] leading-none font-extrabold text-[rgba(201,164,92,0.35)]"
                      aria-hidden
                    >
                      {c.num}
                    </span>
                    <div>
                      <h3 className="mb-1.5 text-[1.05rem] font-extrabold">
                        {c.title}
                      </h3>
                      <p className="m-0 text-[0.9rem] leading-7 font-light text-[var(--color-che-muted)]">
                        {c.body}
                      </p>
                    </div>
                  </div>
                ))}
                <div className="h-px bg-[var(--color-che-line)]" aria-hidden />
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[430px]" data-parallax-root>
              <div
                className="pointer-events-none absolute -inset-x-3.5 -top-3.5 bottom-8 rounded-t-full border border-[var(--color-che-line-gold)]"
                aria-hidden
              />
              <div
                className="relative aspect-[3/4] overflow-hidden rounded-t-full"
                data-reveal="zoom"
              >
                <div className="absolute inset-0" data-parallax="8">
                  <Image
                    src="/chronic-eczema/treatment.webp"
                    alt="جلسة عناية علاجية لبشرة متهيجة في العيادة"
                    fill
                    sizes="(max-width: 1024px) 88vw, 430px"
                    className="scale-[1.12] object-cover"
                  />
                </div>
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(20,12,34,0.7), transparent)",
                  }}
                  aria-hidden
                />
              </div>
              <figcaption className="mt-4 flex items-start gap-3 border-t border-[var(--color-che-line)] pt-3">
                <span
                  className="mt-1 h-px w-9 shrink-0 bg-[var(--color-che-gold)]"
                  aria-hidden
                />
                <span className="text-[0.78rem] leading-6 font-bold text-[var(--color-che-muted)]">
                  {c.cycle.caption}
                </span>
              </figcaption>
            </div>
          </div>
        </section>

        {/* ——— ٠٣ المنهج العلاجي (pinned filmstrip) ——— */}
        <ApproachPin copy={c.approach} />

        {/* ——— ٠٤ التقنيات ، فهرس تحريري ——— */}
        <section className="relative mx-auto max-w-[1240px] px-[22px] py-[110px]">
          <SectionHead
            eyebrow={c.techs.eyebrow}
            title={c.techs.title}
            highlight={c.techs.highlight}
            after={c.techs.after}
            sub={c.techs.sub}
          />
          <div data-reveal-group>
            {techs.map((t) => (
              <div
                key={t.num}
                data-reveal-child
                className="group grid items-start gap-x-8 gap-y-3 rounded-md border-t border-[var(--color-che-line)] py-7 transition-colors duration-300 hover:bg-[rgba(29,18,50,0.55)] md:grid-cols-[72px_1.1fr_1.3fr] md:px-4"
              >
                <span
                  className="select-none text-[2.4rem] leading-none font-extrabold text-[rgba(201,164,92,0.3)] md:pt-1"
                  aria-hidden
                >
                  {t.num}
                </span>
                <div>
                  <h3 className="m-0 flex items-center gap-3 text-[1.25rem] font-extrabold">
                    <t.icon
                      className="size-[22px] shrink-0 text-[var(--color-che-gold-bright)]"
                      strokeWidth={1.7}
                    />
                    {t.title}
                  </h3>
                  <span className="mt-2 inline-block border-b border-[var(--color-che-line-gold)] pb-0.5 text-[0.76rem] font-extrabold tracking-wide text-[var(--color-che-gold-bright)]">
                    {t.tag}
                  </span>
                </div>
                <p className="m-0 text-[0.95rem] leading-8 font-light text-[var(--color-che-muted)]">
                  {t.body}
                </p>
              </div>
            ))}
            <div className="h-px bg-[var(--color-che-line)]" aria-hidden />
          </div>

          {/* لماذا عيادة مها دحلان */}
          <div
            className="mt-16 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4"
            data-reveal="up"
          >
            {whyUs.map((u) => (
              <div key={u.title} className="flex flex-col gap-2.5">
                <span className="flex size-11 items-center justify-center rounded-full border border-[var(--color-che-line-gold)] text-[var(--color-che-gold-bright)]">
                  <u.icon className="size-5" strokeWidth={1.7} />
                </span>
                <b className="mt-1.5 text-[1rem] font-extrabold">{u.title}</b>
                <p className="m-0 text-[0.86rem] leading-7 font-light text-[var(--color-che-muted)]">
                  {u.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ——— ٠٥ النتائج ، لوح ليلي أعمق ——— */}
        <section className="relative border-y border-[var(--color-che-line)] bg-[var(--color-che-night)] px-[22px] py-[110px]">
          <div className="mx-auto max-w-[1240px]">
            <SectionHead
              eyebrow={c.results.eyebrow}
              title={c.results.title}
              highlight={c.results.highlight}
              sub={c.results.sub}
            />
            <div
              className="grid md:grid-cols-3 md:divide-x md:divide-x-reverse md:divide-[var(--color-che-line)]"
              data-reveal-group
            >
              {c.results.stats.map((r) => (
                <div
                  key={r.value}
                  data-reveal-child
                  className="border-t border-[var(--color-che-line)] py-9 md:border-t-0 md:px-10 md:py-4 md:first:pr-0 md:last:pl-0"
                >
                  <b className="che-gold-text block text-[clamp(2.6rem,5.4vw,4rem)] leading-none font-extrabold">
                    {r.value}
                  </b>
                  <p className="mt-4 mb-0 max-w-[30ch] text-[0.92rem] leading-7 font-light text-[var(--color-che-muted)]">
                    {r.label}
                  </p>
                </div>
              ))}
            </div>
            <p
              className="mt-12 mb-0 border-t border-[var(--color-che-line)] pt-5 text-[0.78rem] text-[rgba(244,238,250,0.45)]"
              data-reveal="fade"
            >
              {c.results.disclaimer}
            </p>
          </div>
        </section>

        {/* ——— ٠٦ الطبيبات ——— */}
        <section className="relative overflow-hidden px-[22px] py-[110px]">
          <div className="relative mx-auto max-w-[1140px]">
            <SectionHead
              eyebrow={c.doctors.eyebrow}
              title={c.doctors.title}
              highlight={c.doctors.highlight}
              after={c.doctors.after}
              sub={c.doctors.sub}
            />
            <div data-reveal="up">
              <Doctors copy={c.doctors} />
            </div>
            <blockquote
              className="mx-auto mt-14 max-w-[620px] border-r-2 border-[var(--color-che-gold)] pr-6 text-right"
              data-reveal="fade"
            >
              <p className="m-0 text-[1.15rem] leading-9 font-bold text-[var(--color-che-ink-2)]">
                &#8220;{c.doctors.quote}&#8221;
              </p>
            </blockquote>
          </div>
        </section>

        {/* ——— ٠٧ قالوا عنا ——— */}
        <section className="relative border-y border-[var(--color-che-line)] bg-[var(--color-che-bg-2)] py-[100px]">
          <div className="mx-auto max-w-[1240px] px-[22px]">
            <SectionHead {...c.testimonials} />
          </div>
          <Testimonials />
        </section>

        {/* ——— ٠٨ الأسئلة الشائعة ——— */}
        <section className="relative mx-auto max-w-[820px] px-[22px] pt-[110px] pb-[110px]">
          <SectionHead
            eyebrow={c.faq.eyebrow}
            title={c.faq.title}
            highlight={c.faq.highlight}
          />
          <div data-reveal-group>
            {c.faq.questions.map((f) => (
              <div key={f.q} data-reveal-child>
                <details className="group border-t border-[var(--color-che-line)]">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-[22px] text-base font-extrabold transition-colors hover:text-[var(--color-che-gold-bright)]">
                    {f.q}
                    <span className="che-pm inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-[var(--color-che-line-strong)] text-[1.2rem] font-normal text-[var(--color-che-gold-bright)]">
                      +
                    </span>
                  </summary>
                  <p className="m-0 max-w-[62ch] pb-[26px] text-[0.94rem] leading-8 font-light text-[var(--color-che-muted)]">
                    {f.a}
                  </p>
                </details>
              </div>
            ))}
            <div className="h-px bg-[var(--color-che-line)]" aria-hidden />
          </div>
        </section>

        {/* ——— ٠٩ الحجز ، الغلاف الأخير ——— */}
        <section
          id="booking"
          className="che-night relative border-t border-[var(--color-che-line)] bg-[var(--color-che-night)] px-[22px] py-[110px]"
        >
          <div className="mx-auto max-w-[1240px]">
            <div className="grid items-start gap-14 lg:grid-cols-[1fr_0.9fr] lg:gap-20">
              <div data-reveal="up">
                <div className="flex items-center gap-4 text-[0.72rem] font-extrabold tracking-[0.22em] text-[var(--color-che-gold-bright)]">
                  <span>{c.booking.eyebrow}</span>
                  <span
                    className="h-px flex-1 bg-[var(--color-che-line)]"
                    aria-hidden
                  />
                </div>
                <h2 className="mt-6 mb-0 text-[clamp(1.9rem,4.6vw,3.4rem)] leading-[1.28] font-extrabold">
                  {c.booking.title}{" "}
                  <em className="che-gold-text not-italic">
                    {c.booking.highlight}
                  </em>
                </h2>
                <p className="mt-5 mb-0 max-w-[52ch] text-[1rem] leading-8 font-light text-[var(--color-che-muted)]">
                  {c.booking.body}
                </p>

                <div className="mt-9">
                  {c.booking.points.map((point, i) => {
                    const PointIcon = BOOKING_POINT_ICONS[i] ?? Icon.CircleCheck;
                    return (
                      <span
                        key={point}
                        className="flex items-center gap-3 border-t border-[var(--color-che-line)] py-3.5 text-[0.92rem] text-[rgba(244,238,250,0.8)]"
                      >
                        <PointIcon className="size-4 shrink-0 text-[var(--color-che-gold-bright)]" />
                        {point}
                      </span>
                    );
                  })}
                  <div className="h-px bg-[var(--color-che-line)]" aria-hidden />
                </div>

                {/* payment flexibility */}
                <div className="mt-8 flex items-center gap-3.5">
                  <span className="text-[0.82rem] font-bold text-[rgba(244,238,250,0.6)]">
                    {c.booking.paymentLabel}
                  </span>
                  <span className="flex items-center gap-2.5">
                    <span className="flex h-9 items-center rounded-[4px] bg-white px-2.5">
                      <Image
                        src="/tabby.png"
                        alt="تابي"
                        width={52}
                        height={22}
                        className="h-[22px] w-auto object-contain"
                      />
                    </span>
                    <span className="flex h-9 items-center rounded-[4px] bg-white px-2.5">
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

                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center gap-2.5 rounded-[4px] border border-[rgba(37,211,102,0.5)] px-[26px] py-[13px] text-[0.95rem] font-extrabold text-[#3BE07E] transition-colors duration-300 hover:bg-[rgba(37,211,102,0.1)]"
                >
                  <Icon.MessageCircle className="size-[18px]" />
                  {c.booking.whatsapp}
                </a>
              </div>

              <div data-reveal="zoom">
                <LeadForm copy={c.booking} />
              </div>
            </div>
          </div>
        </section>

        {/* ——— الفوتر ——— */}
        <footer className="border-t border-[var(--color-che-line)] px-[22px] pt-12 pb-[120px] text-center md:pb-12">
          <div className="mb-4 flex justify-center">
            <Image
              src="/chronic-eczema/logo.webp"
              alt="MD Clinics | مجمع عيادات د. مها دحلان الطبي"
              width={100}
              height={100}
              className="size-[100px] object-contain"
            />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-5 text-[0.86rem] font-bold">
            <a
              dir="ltr"
              href={TEL_LINK}
              className="text-[var(--color-che-gold)] transition-colors hover:text-[var(--color-che-gold-bright)]"
            >
              {PHONE_DISPLAY}
            </a>
            <span className="text-[0.6rem] text-[rgba(201,164,92,0.4)]">✦</span>
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-che-gold)] transition-colors hover:text-[var(--color-che-gold-bright)]"
            >
              {c.footer.whatsapp}
            </a>
            <span className="text-[0.6rem] text-[rgba(201,164,92,0.4)]">✦</span>
            <a
              href="#booking"
              className="text-[var(--color-che-gold)] transition-colors hover:text-[var(--color-che-gold-bright)]"
            >
              {c.footer.book}
            </a>
          </div>
          <p className="mx-auto mt-5 mb-0 max-w-[60ch] text-[0.74rem] leading-6 text-[rgba(244,238,250,0.4)]">
            {c.footer.disclaimer}
          </p>
        </footer>

        <WhatsAppFAB
          tokenPrefix="che"
          whatsappNumber={WHATSAPP_NUMBER}
          topicMessage={WA_TOPIC_MESSAGE}
        />
        <StickyBar
          bookLabel={c.cta.sticky}
          whatsappLabel={c.cta.stickyWhatsapp}
        />
      </div>
    </main>
  );
}
