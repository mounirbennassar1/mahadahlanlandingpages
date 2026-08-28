import { Icon, SocialIcon } from "@/components/icons";
import { SiteShell } from "./SiteShell";
import { Hero } from "./Hero";
import { MarqueeStrip } from "./MarqueeStrip";
import { PagesMarquee } from "./PagesMarquee";
import { Doctors } from "./Doctors";
import { Testimonials } from "./Testimonials";
import { HoursMap } from "./HoursMap";
import { Payments } from "./Payments";
import { Glow, Section, SectionHead } from "./Sections";
import { Parallax, Reveal, RevealGroup } from "./Motion";
import { GOLD_GRADIENT, PHONE_DISPLAY, TEL_LINK } from "./config";
import { getDict, LANG_META, waLink, type Locale } from "./i18n/dictionary";

/** Icons for the four "why us" cards, in dictionary order. */
const WHY_ICONS = [
  Icon.HeartHandshake,
  Icon.BadgeCheck,
  Icon.Users,
  Icon.CalendarCheck,
] as const;

/**
 * The home page body, shared by `/` (Arabic) and `/en` (English). Every
 * visible string comes from the locale dictionary; direction-sensitive bits
 * (arrows, glow placement) follow `LANG_META[locale].dir`.
 */
export function HomePage({ locale = "ar" }: { locale?: Locale }) {
  const t = getDict(locale);
  const isRtl = LANG_META[locale].dir === "rtl";
  const Arrow = isRtl ? Icon.ArrowLeft : Icon.ArrowRight;
  const wa = waLink(locale);

  return (
    <SiteShell locale={locale} bookHref="#contact">
      <Hero />
      <MarqueeStrip locale={locale} />

      {/* ——— specialties: every page, flowing ——— */}
      <section
        id="specialties"
        className="overflow-hidden bg-[var(--color-md-band)] py-[78px] sm:py-[96px]"
      >
        <div className="mx-auto max-w-[1180px] px-[22px]">
          <SectionHead
            eyebrow={t.specialties.eyebrow}
            title={t.specialties.title}
            gold={t.specialties.gold}
            body={t.specialties.body}
            locale={locale}
          />
        </div>
        <Reveal className="mt-12">
          <PagesMarquee locale={locale} />
        </Reveal>
      </section>

      {/* ——— why us ——— */}
      <Section id="why" className="bg-[var(--color-md-band)]">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <SectionHead
              align="start"
              eyebrow={t.why.eyebrow}
              title={t.why.title}
              gold={t.why.gold}
              body={t.why.body}
              locale={locale}
            />

            <Reveal delay={120} className="mt-8">
              <a
                href="#contact"
                className="inline-flex items-center gap-2.5 rounded-full px-[30px] py-4 text-base font-extrabold text-[var(--color-md-ink)] shadow-[0_0_34px_-8px_rgba(232,195,106,0.6)] transition-all duration-300 hover:-translate-y-[3px] hover:shadow-[0_0_46px_-8px_rgba(255,223,142,0.8)]"
                style={{ background: GOLD_GRADIENT }}
              >
                {t.why.cta}
                <Arrow className="size-[17px]" strokeWidth={2.4} />
              </a>
            </Reveal>
          </div>

          <RevealGroup className="grid grid-cols-2 gap-3.5 sm:gap-5">
            {t.why.cards.map((card, i) => {
              const CardIcon = WHY_ICONS[i] ?? Icon.Sparkles;
              return (
                <div
                  key={card.title}
                  className="group rounded-[20px] border border-[var(--color-md-line)] bg-[var(--color-md-card)] p-4 transition-[transform,border-color,box-shadow] duration-400 hover:-translate-y-1.5 hover:border-[rgba(232,195,106,0.5)] hover:shadow-[0_0_40px_-14px_rgba(232,195,106,0.45)] sm:rounded-[24px] sm:p-7"
                >
                  <span
                    className="mb-4 inline-flex size-10 items-center justify-center rounded-xl text-[var(--color-md-ink)] shadow-[0_0_22px_-6px_rgba(232,195,106,0.55)] transition-transform duration-400 group-hover:scale-110 sm:mb-5 sm:size-12 sm:rounded-2xl"
                    style={{ background: GOLD_GRADIENT }}
                    aria-hidden
                  >
                    <CardIcon className="size-[18px] sm:size-[22px]" strokeWidth={2} />
                  </span>
                  <h3 className="text-[0.95rem] font-extrabold text-[var(--color-md-text)] sm:text-[1.08rem]">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-[0.8rem] leading-[1.75] font-light text-[rgba(246,238,223,0.58)] sm:mt-2.5 sm:text-[0.92rem] sm:leading-[1.85]">
                    {card.body}
                  </p>
                </div>
              );
            })}
          </RevealGroup>
        </div>
      </Section>

      {/* ——— team — same doctors slider as the landing pages ——— */}
      <Section className="bg-[var(--color-md-band)]">
        <SectionHead
          eyebrow={t.team.eyebrow}
          title={t.team.title}
          gold={t.team.gold}
          body={t.team.body}
          locale={locale}
        />
        <Reveal className="mt-12">
          <Doctors />
        </Reveal>
      </Section>

      {/* ——— reviews ——— */}
      <Section id="reviews" className="relative overflow-hidden bg-[var(--color-md-bg)]">
        <Glow className={`-top-10 ${isRtl ? "right-1/4" : "left-1/4"} h-[300px] w-[600px]`} />
        <SectionHead
          eyebrow={t.reviews.eyebrow}
          title={t.reviews.title}
          gold={t.reviews.gold}
          body={t.reviews.body}
          locale={locale}
        />
        <Parallax className="mt-12" from={18} to={-18}>
          <Testimonials locale={locale} />
        </Parallax>
      </Section>

      {/* ——— hours + map ——— */}
      <Section id="visit" className="bg-[var(--color-md-band)]">
        <SectionHead
          eyebrow={t.visit.eyebrow}
          title={t.visit.title}
          gold={t.visit.gold}
          body={t.visit.body}
          locale={locale}
        />
        <Reveal className="mt-12">
          <HoursMap />
        </Reveal>
      </Section>

      {/* ——— split payments ——— */}
      <Section id="installments" className="relative bg-[var(--color-md-bg)]">
        <Glow className={`-top-14 ${isRtl ? "left-1/3" : "right-1/3"} h-[300px] w-[560px]`} />
        <SectionHead
          eyebrow={t.pay.eyebrow}
          title={t.pay.title}
          gold={t.pay.gold}
          body={t.pay.body}
          locale={locale}
        />
        <Reveal className="mt-12">
          <Payments locale={locale} />
        </Reveal>
      </Section>

      {/* ——— contact ——— */}
      <Section id="contact" className="bg-[var(--color-md-band)]">
        <Reveal className="relative overflow-hidden rounded-[32px] border border-[var(--color-md-line-strong)] bg-[#120D07] px-7 py-14 text-center sm:px-14">
          <div
            className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[760px] -translate-x-1/2 blur-[40px]"
            style={{
              background:
                "radial-gradient(ellipse 50% 50% at 50% 0%, rgba(201,156,78,.32), transparent 70%)",
            }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(rgba(240,212,138,.14) 1px, transparent 1px)",
              backgroundSize: "26px 26px",
              maskImage:
                "radial-gradient(ellipse 70% 70% at 50% 50%, #000 20%, transparent 75%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 70% 70% at 50% 50%, #000 20%, transparent 75%)",
            }}
            aria-hidden
          />

          <div className="relative mx-auto flex max-w-[640px] flex-col items-center">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-[rgba(240,212,138,0.3)] px-[18px] py-2 text-[0.78rem] font-bold text-[#F0D48A]">
              <span
                className="size-1.5 rounded-full bg-[var(--color-md-neon)]"
                style={{ animation: "md-neon-pulse 2.4s ease-in-out infinite" }}
              />
              {t.contact.badge}
            </span>

            <h2 className="mt-6 text-[clamp(1.8rem,4.2vw,2.7rem)] leading-[1.55] font-extrabold text-[#FDF8EE]">
              {t.contact.title}
              <br />
              <span className="md-gold-glow inline-block">
                <span className="md-gold-text">{t.contact.gold}</span>
              </span>
            </h2>
            <p className="mt-4 text-[1rem] leading-[1.9] font-light text-[#EFE6D6]/70">
              {t.contact.body}
            </p>

            <div className="mt-9 flex w-full flex-col gap-3.5 sm:w-auto sm:flex-row">
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 rounded-full px-[32px] py-4 text-base font-extrabold text-[var(--color-md-ink)] shadow-[0_0_38px_-8px_rgba(232,195,106,0.6)] transition-all duration-300 hover:-translate-y-[3px] hover:shadow-[0_0_52px_-8px_rgba(255,223,142,0.8)]"
                style={{ background: GOLD_GRADIENT }}
              >
                <SocialIcon name="whatsapp" className="text-[19px]" />
                {t.contact.whatsapp}
              </a>
              <a
                href={TEL_LINK}
                className="inline-flex items-center justify-center gap-2.5 rounded-full border border-[rgba(240,212,138,0.35)] px-[30px] py-4 text-base font-extrabold text-[#F0D48A] transition-all duration-300 hover:bg-[rgba(240,212,138,0.1)] hover:shadow-[0_0_28px_-8px_rgba(255,233,168,0.5)]"
              >
                <Icon.Phone className="size-[18px]" />
                <span dir="ltr">{PHONE_DISPLAY}</span>
              </a>
            </div>

            <ul className="mt-9 flex flex-wrap justify-center gap-x-6 gap-y-3 text-[0.84rem] font-bold text-[#EFE6D6]/60">
              {t.contact.points.map((item) => (
                <li key={item} className="inline-flex items-center gap-2">
                  <Icon.Check
                    className="size-4 text-[var(--color-md-champagne)]"
                    strokeWidth={3}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </Section>
    </SiteShell>
  );
}
