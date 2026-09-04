"use client";

import Image from "next/image";
import { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { Icon, SocialIcon } from "@/components/icons";
import { SectionEyebrow } from "@/components/usablecomponents/SectionEyebrow";
import { ScrollSystem } from "./ScrollSystem";
import { SpiculeHero } from "./SpiculeHero";
import { Marquee } from "./Marquee";
import { HorizontalProtocol } from "./HorizontalProtocol";
import { StatCounters } from "./StatCounters";
import { LeadForm } from "./LeadForm";
import { DoctorsSlider } from "./DoctorsSlider";
import { StickyCTA } from "./StickyCTA";
import type { ContentOf } from "@/lib/pages/define";
import type { KOREAN_SPICULES } from "../content";

/* Ads funnel: form-only lead capture — every CTA anchors here. */
const FORM_ANCHOR = "#lead-form";

const ORANGE_GRADIENT =
  "linear-gradient(120deg, #ffb473 0%, #ff6b1a 55%, #e35500 100%)";

/* ───────── design assets, zipped with the editable rows by index ───────── */

/** Nav destinations, in content order. */
const NAV_HREFS = ["#about", "#results", "#protocol", "#doctor", "#faq"] as const;

/** Icons for the "about" checklist, in content order. */
const CHECKLIST_ICONS = [
  Icon.Leaf,
  Icon.Zap,
  Icon.RefreshCw,
  Icon.BadgeCheck,
] as const;

/** Photos for the "what it treats" cards, in content order. */
const BENEFIT_IMAGES = [
  {
    img: "/korean-spicules/benefit-scars.webp",
    alt: "بشرة خد متجددة وناعمة بعد اختفاء آثار الحبوب",
  },
  {
    img: "/korean-spicules/benefit-pores.webp",
    alt: "لقطة مقرّبة لمسام مشدودة وبشرة صافية",
  },
  {
    img: "/korean-spicules/benefit-acne.webp",
    alt: "جل منقٍّ يوزَّع على بشرة صافية وهادئة",
  },
  {
    img: "/korean-spicules/benefit-tone.webp",
    alt: "وجه مشرق بلون موحّد يتوهّج تحت إضاءة دافئة",
  },
  {
    img: "/korean-spicules/benefit-texture.webp",
    alt: "سيروم ذهبي ينساب على بشرة حريرية الملمس",
  },
  {
    img: "/korean-spicules/benefit-lines.webp",
    alt: "محيط عين ممتلئ وناعم بعد تلاشي الخطوط الدقيقة",
  },
] as const;

/** Icons for the booking reassurance points, in content order. */
const BOOKING_POINT_ICONS = [Icon.CalendarCheck, Icon.MapPin, Icon.Clock3] as const;

/** Social networks in the footer, in content order. */
const SOCIAL_NAMES = ["instagram", "tiktok", "snapchat"] as const;

/* ─────────────────────────────── page ─────────────────────────────── */

export function Landing({ content }: { content: ContentOf<typeof KOREAN_SPICULES> }) {
  const c = content;
  const NAV_LINKS = NAV_HREFS.map((href, i) => ({
    href,
    label: c.nav.links[i]?.label ?? "",
  }));
  const CHECKLIST = c.about.checklist.map((item, i) => ({
    ...item,
    icon: CHECKLIST_ICONS[i],
  }));
  const BENEFITS = c.benefits.cards.map((card, i) => ({
    ...card,
    ...BENEFIT_IMAGES[i],
  }));
  const BOOKING_POINTS = c.booking.points.map((point, i) => ({
    ...point,
    icon: BOOKING_POINT_ICONS[i],
  }));
  const TESTIMONIALS = c.testimonials.cards;
  const FAQS = c.faq.questions;
  const SOCIAL_LINKS = SOCIAL_NAMES.map((name, i) => ({
    name,
    label: c.footer.socials[i]?.label ?? "",
  }));

  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  /* hide nav on scroll-down, return on scroll-up */
  const { scrollY } = useScroll();
  const [navHidden, setNavHidden] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    if (y > 160 && y > prev && !menuOpen) setNavHidden(true);
    else setNavHidden(false);
  });

  return (
    <>
      <ScrollSystem />

      {/* ───── Nav ───── */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: navHidden ? -110 : 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-3 top-3 z-50 mx-auto flex max-w-6xl items-center justify-between rounded-full border border-[var(--color-kos-line)] bg-black/70 px-4 py-2.5 backdrop-blur-xl sm:inset-x-4 sm:top-4 sm:px-6 sm:py-3"
      >
        <a href="#hero" aria-label="عيادات د. مها دحلان" className="flex items-center">
          <Image
            src="/korean-spicules/logo.webp"
            alt="شعار مجمع عيادات د. مها دحلان الطبي"
            width={56}
            height={56}
            priority
            className="size-10 object-contain sm:size-12"
          />
        </a>

        <div className="hidden gap-7 text-sm font-semibold text-[var(--color-kos-ink-soft)] md:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="transition-colors hover:text-[var(--color-kos-primary-dim)]"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <a
            href={FORM_ANCHOR}
            className="hidden items-center gap-2 rounded-full px-5 py-2 text-xs font-extrabold text-[#180a02] shadow-[0_10px_24px_-10px_rgba(255,107,26,0.6)] transition-transform hover:scale-[1.03] sm:inline-flex"
            style={{ background: ORANGE_GRADIENT }}
          >
            {c.nav.book}
            <Icon.ArrowLeft className="size-3.5" />
          </a>
          <button
            type="button"
            onClick={() => setMenuOpen((p) => !p)}
            aria-label={menuOpen ? "إغلاق القائمة" : "القائمة"}
            aria-expanded={menuOpen}
            className="flex size-10 items-center justify-center rounded-full border border-[var(--color-kos-line)] bg-[#171717]/80 text-[var(--color-kos-ink)] transition-colors hover:border-[var(--color-kos-primary)] hover:text-[var(--color-kos-primary-dim)] md:hidden"
          >
            {menuOpen ? <Icon.X className="size-5" /> : <Icon.Menu className="size-5" />}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-0 top-full mt-2 overflow-hidden rounded-3xl border border-[var(--color-kos-line)] bg-black/95 p-2 shadow-2xl backdrop-blur-xl md:hidden"
            >
              <ul className="flex flex-col">
                {NAV_LINKS.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-between rounded-2xl px-4 py-3 text-right text-sm font-semibold text-[var(--color-kos-ink-soft)] transition-colors hover:bg-[var(--color-kos-primary)]/10 hover:text-[var(--color-kos-primary-dim)]"
                    >
                      {l.label}
                      <Icon.ChevronLeft className="size-4 text-[var(--color-kos-primary)]" />
                    </a>
                  </li>
                ))}
                <li className="p-2">
                  <a
                    href={FORM_ANCHOR}
                    onClick={() => setMenuOpen(false)}
                    className="flex h-11 items-center justify-center gap-2 rounded-2xl text-sm font-extrabold text-[#180a02]"
                    style={{ background: ORANGE_GRADIENT }}
                  >
                    <Icon.CalendarCheck className="size-4" />
                    {c.nav.bookMobile}
                  </a>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <main className="relative z-10">
        {/* ───── 1 · Cinematic hero (pinned + scrubbed) ───── */}
        <SpiculeHero copy={c.hero} />

        {/* ───── 2 · Trust marquee ───── */}
        <Marquee items={c.marquee.items} />

        {/* ───── 3 · What are spicules ───── */}
        <section
          id="about"
          data-glow="80,28,0.5"
          className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-24 md:grid-cols-2 md:gap-16 md:py-32"
        >
          {/* text — first in DOM = right column in RTL */}
          <div>
            <div data-reveal="up">
              <SectionEyebrow tokenPrefix="kos" icon="Gem">
                {c.about.eyebrow}
              </SectionEyebrow>
            </div>
            <h2
              data-reveal="up"
              data-reveal-delay="0.08"
              className="mt-5 text-3xl font-extrabold leading-snug text-white sm:text-4xl"
            >
              {c.about.title}{" "}
              <em className="kos-orange-text not-italic">{c.about.highlight}</em>
            </h2>
            <p
              data-words
              className="mt-5 max-w-xl text-[15px] font-semibold leading-8 text-white"
            >
              {c.about.body}
            </p>

            <ul className="mt-8 space-y-4" data-reveal-group>
              {CHECKLIST.map((item) => (
                <li key={item.title} data-reveal-child className="flex items-start gap-4">
                  <span className="mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-2xl border border-[var(--color-kos-line)] bg-[var(--color-kos-primary)]/10 text-[var(--color-kos-primary-dim)]">
                    <item.icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-bold text-white">{item.title}</h3>
                    <p className="mt-1 text-sm leading-7 text-[var(--color-kos-muted)]">
                      {item.text}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* video — second in DOM = left column in RTL */}
          <div data-parallax-root className="relative mx-auto w-full max-w-xl">
            <div data-reveal="zoom">
              <div data-parallax="6">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] border-2 border-[var(--color-kos-primary)] bg-black shadow-[0_40px_80px_-40px_rgba(0,0,0,0.9)]">
                  <iframe
                    src="https://player.vimeo.com/video/1213369725?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1&loop=1"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    className="absolute inset-0 h-full w-full"
                    title="سبكيولز"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ───── 4 · What it treats ───── */}
        <section id="results" data-glow="25,55,0.45" className="mx-auto max-w-6xl px-5 py-20 md:py-24">
          <div className="text-center" data-reveal="up">
            <SectionEyebrow tokenPrefix="kos" icon="Target">
              {c.benefits.eyebrow}
            </SectionEyebrow>
            <h2 className="mt-5 text-3xl font-extrabold text-white sm:text-4xl">
              {c.benefits.title}{" "}
              <em className="kos-orange-text not-italic">{c.benefits.highlight}</em>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-8 text-[var(--color-kos-ink-soft)]">
              {c.benefits.sub}
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6" data-reveal-group>
            {BENEFITS.map((b) => (
              <div
                key={b.title}
                data-reveal-child
                className="group overflow-hidden rounded-[1.5rem] border border-[var(--color-kos-line-soft)] bg-[#0e0e0e]/80 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-kos-line)]"
              >
                <div className="kos-fallback-host relative aspect-[4/3] w-full overflow-hidden bg-black">
                  <Image
                    src={b.img}
                    alt={b.alt}
                    fill
                    sizes="(max-width: 768px) 45vw, 30vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                      e.currentTarget
                        .closest(".kos-fallback-host")
                        ?.classList.add("is-missing");
                    }}
                  />
                  <span
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(14,14,14,0.9), transparent 55%)",
                    }}
                    aria-hidden
                  />
                </div>
                <div className="p-5 pt-3.5 md:p-7 md:pt-4">
                  <h3 className="text-base font-extrabold text-white md:text-lg">
                    {b.title}
                  </h3>
                  <p className="mt-1.5 text-[12.5px] leading-6 text-[var(--color-kos-muted)] md:text-sm md:leading-7">
                    {b.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ───── 5 · Booking (lead form — early in the funnel) ───── */}
        <section
          id="lead-form"
          data-glow="70,60,0.45"
          className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-24 md:grid-cols-2 md:gap-16 md:py-32"
        >
          {/* copy — right column in RTL */}
          <div>
            <div data-reveal="up">
              <SectionEyebrow tokenPrefix="kos" icon="CalendarCheck">
                {c.booking.eyebrow}
              </SectionEyebrow>
            </div>
            <h2
              data-reveal="up"
              data-reveal-delay="0.08"
              className="mt-5 text-3xl font-extrabold leading-snug text-white sm:text-4xl"
            >
              {c.booking.title}{" "}
              <em className="kos-orange-text not-italic">{c.booking.highlight}</em>
            </h2>
            <p
              data-reveal="up"
              data-reveal-delay="0.14"
              className="mt-5 max-w-lg text-[15px] leading-8 text-[var(--color-kos-ink-soft)]"
            >
              {c.booking.body}
            </p>

            <ul className="mt-8 space-y-4" data-reveal-group>
              {BOOKING_POINTS.map((point) => (
                <li key={point.title} data-reveal-child className="flex items-center gap-4">
                  <span className="flex size-11 items-center justify-center rounded-2xl border border-[var(--color-kos-line)] bg-[var(--color-kos-primary)]/10 text-[var(--color-kos-primary-dim)]">
                    <point.icon className="size-5" />
                  </span>
                  <div>
                    <span className="block text-sm font-bold text-white">{point.title}</span>
                    <span className="text-sm text-[var(--color-kos-muted)]">
                      {point.text}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* form — left column in RTL */}
          <div data-reveal="zoom">
            <LeadForm copy={c.booking} />
          </div>
        </section>

        {/* ───── 6 · Protocol (pinned horizontal scrub) ───── */}
        <HorizontalProtocol copy={c.protocol} />

        {/* ───── 7 · Results band (count-up) ───── */}
        <section data-glow="50,70,0.35" className="mx-auto max-w-6xl px-5 py-20 md:py-24">
          <StatCounters copy={c.stats} />
        </section>

        {/* ───── 8 · The specialists (slider) ───── */}
        <section id="doctor" data-glow="80,45,0.5" className="mx-auto max-w-6xl px-5 py-24 md:py-32">
          <div className="text-center" data-reveal="up">
            <SectionEyebrow tokenPrefix="kos" icon="Stethoscope">
              {c.doctors.eyebrow}
            </SectionEyebrow>
            <h2 className="mt-5 text-3xl font-extrabold text-white sm:text-4xl">
              {c.doctors.title}{" "}
              <em className="kos-orange-text not-italic">
                {c.doctors.highlight}
              </em>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-8 text-[var(--color-kos-ink-soft)]">
              {c.doctors.sub}
            </p>
          </div>

          <div className="mt-12 md:mt-16" data-reveal="up">
            <DoctorsSlider people={c.doctors.people} caption={c.doctors.caption} />
          </div>
        </section>

        {/* ───── 9 · Testimonials ───── */}
        <section data-glow="30,60,0.4" className="mx-auto max-w-6xl px-5 py-24 md:py-28">
          <div className="text-center" data-reveal="up">
            <SectionEyebrow tokenPrefix="kos" icon="HeartHandshake">
              {c.testimonials.eyebrow}
            </SectionEyebrow>
            <h2 className="mt-5 text-3xl font-extrabold text-white sm:text-4xl">
              {c.testimonials.title}{" "}
              <em className="kos-orange-text not-italic">{c.testimonials.highlight}</em>
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3" data-reveal-group>
            {TESTIMONIALS.map((t) => (
              <figure
                key={t.name}
                data-reveal-child
                className="flex flex-col rounded-[1.75rem] border border-[var(--color-kos-line-soft)] bg-[#171717]/70 p-7 backdrop-blur-sm"
              >
                <div className="flex gap-1 text-[var(--color-kos-primary)]" dir="ltr">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Icon.Star key={i} className="size-4 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-sm leading-8 text-[var(--color-kos-ink-soft)]">
                  «{t.text}»
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-[var(--color-kos-line-soft)] pt-4">
                  <span className="flex size-9 items-center justify-center rounded-full bg-[var(--color-kos-primary)]/12 text-sm font-extrabold text-[var(--color-kos-primary-dim)]">
                    {t.name[0]}
                  </span>
                  <div>
                    <span className="block text-sm font-bold text-white">{t.name}</span>
                    <span className="text-[11px] text-[var(--color-kos-muted)]">
                      {t.city} · {c.testimonials.sessionLabel}
                    </span>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* ───── 10 · FAQ ───── */}
        <section id="faq" data-glow="50,80,0.35" className="mx-auto max-w-3xl px-5 py-24 md:py-28">
          <div className="text-center" data-reveal="up">
            <SectionEyebrow tokenPrefix="kos" icon="MessageCircleQuestion">
              {c.faq.eyebrow}
            </SectionEyebrow>
            <h2 className="mt-5 text-3xl font-extrabold text-white sm:text-4xl">
              {c.faq.title}
            </h2>
          </div>

          <div className="mt-10 space-y-3" data-reveal-group>
            {FAQS.map((f, i) => {
              const open = openFaq === i;
              return (
                <div
                  key={f.q}
                  data-reveal-child
                  className={`overflow-hidden rounded-2xl border backdrop-blur-sm transition-colors ${
                    open
                      ? "border-[var(--color-kos-line)] bg-[#171717]/80"
                      : "border-[var(--color-kos-line-soft)] bg-[#171717]/45"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : i)}
                    aria-expanded={open}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-right"
                  >
                    <span className="text-sm font-bold text-white sm:text-base">{f.q}</span>
                    <span
                      className={`flex size-8 shrink-0 items-center justify-center rounded-full border border-[var(--color-kos-line)] text-[var(--color-kos-primary-dim)] transition-transform duration-300 ${
                        open ? "rotate-45" : ""
                      }`}
                    >
                      <Icon.Plus className="size-4" />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <p className="px-5 pb-5 text-sm leading-8 text-[var(--color-kos-ink-soft)]">
                          {f.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* ───── Footer ───── */}
        <footer className="border-t border-[var(--color-kos-line-soft)] bg-black/60 py-10 backdrop-blur-sm">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-5 md:flex-row md:justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/korean-spicules/logo.webp"
                alt="شعار عيادات د. مها دحلان"
                width={44}
                height={44}
                className="size-11 object-contain"
              />
              <div>
                <span className="block text-sm font-extrabold text-white">
                  {c.footer.clinic}
                </span>
                <span className="text-[10px] font-semibold tracking-normal text-[var(--color-kos-primary-dim)]">
                  {c.footer.tagline}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map(({ name, label }) => (
                <a
                  key={name}
                  href="#"
                  aria-label={label}
                  className="flex size-10 items-center justify-center rounded-full border border-[var(--color-kos-line-soft)] text-[var(--color-kos-muted)] transition-colors hover:border-[var(--color-kos-primary)] hover:text-[var(--color-kos-primary-dim)]"
                >
                  <SocialIcon name={name} />
                </a>
              ))}
            </div>

            <p className="text-center text-xs leading-6 text-[var(--color-kos-muted)]">
              © {new Date().getFullYear()} {c.footer.copyright}
            </p>
          </div>
        </footer>

        {/* spacer so the mobile sticky bar never covers the footer */}
        <div className="h-16 md:hidden" aria-hidden />
      </main>

      {/* ───── Floating CTA (form-only funnel) ───── */}
      <StickyCTA bookHref={FORM_ANCHOR} label={c.stickyCta.book} />
    </>
  );
}
