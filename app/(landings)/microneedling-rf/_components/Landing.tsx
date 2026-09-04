"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  type Variants,
} from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { Icon } from "@/components/icons";
import { WhatsAppFAB } from "@/components/usablecomponents/WhatsAppFAB";
import { MobileStickyCTA } from "@/components/usablecomponents/MobileStickyCTA";
import { HeroChoreography } from "./HeroChoreography";
import { ScrollProgress } from "./ScrollProgress";
import { Marquee } from "./Marquee";
import { LeadForm } from "./LeadForm";
import type { ContentOf } from "@/lib/pages/define";
import type { MICRONEEDLING_RF } from "../content";

const WA_NUMBER = "966503377702";
const WA_TOPIC = "علاج الميكرونيدلينغ بالترددات الراديوية";
const WA = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("مرحباً عندي استفسار عن " + WA_TOPIC)}`;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};
const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

/** Portraits for the specialists slider, in content order. */
const DOCTOR_IMAGES = [
  "/team/dr-maha.avif",
  "/team/dr-inas.avif",
  "/team/dr-lajin.avif",
] as const;

/** Icons for the "problem" cards, in content order. */
const PROBLEM_ICONS = [
  Icon.Layers,
  Icon.Activity,
  Icon.Palette,
  Icon.MoveDown,
] as const;

/** Anchors for the nav links, in content order. */
const NAV_HREFS = ["#problem", "#process", "#doctor", "#faq"] as const;

export function Landing({
  content,
}: {
  content: ContentOf<typeof MICRONEEDLING_RF>;
}) {
  const DOCTORS = content.doctors.people.map((person, i) => ({
    ...person,
    img: DOCTOR_IMAGES[i],
  }));
  const problemCards = content.problem.cards.map((card, i) => ({
    ...card,
    icon: PROBLEM_ICONS[i],
  }));
  const heroRef = useRef<HTMLDivElement>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDoc, setActiveDoc] = useState(0);

  const nextDoc = () => setActiveDoc((p) => (p + 1) % DOCTORS.length);
  const prevDoc = () => setActiveDoc((p) => (p - 1 + DOCTORS.length) % DOCTORS.length);

  useEffect(() => {
    const id = setInterval(
      () => setActiveDoc((p) => (p + 1) % DOCTOR_IMAGES.length),
      2600,
    );
    return () => clearInterval(id);
  }, []);

  const navLinks = content.nav.links.map((link, i) => ({
    href: NAV_HREFS[i],
    label: link.label,
  }));

  return (
    <>
      <ScrollProgress />

      {/* ───── Nav ───── */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-3 top-3 z-50 mx-auto flex max-w-6xl items-center justify-between rounded-full border border-[var(--color-mrf-line)] bg-white/75 px-4 py-2.5 backdrop-blur-xl sm:inset-x-4 sm:top-4 sm:px-6 sm:py-3"
      >
        <a href="#" aria-label="MD Clinics" className="flex items-center">
          <Image
            src="/microneedling-rf/logo.webp"
            alt="MD Clinics — مجمع عيادات د. مها دحلان الطبي"
            width={56}
            height={56}
            priority
            className="size-10 object-contain sm:size-12"
          />
        </a>
        <div className="hidden gap-8 text-sm font-semibold text-[var(--color-mrf-ink-soft)] md:flex">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="transition-colors hover:text-[var(--color-mrf-primary)]"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <a
            href="#book"
            className="hidden items-center gap-2 rounded-full bg-[var(--color-mrf-ink)] px-5 py-2 text-xs font-bold text-white shadow-md transition-transform hover:scale-[1.03] sm:inline-flex"
          >
            {content.nav.book}
            <Icon.ArrowLeft className="size-3.5" />
          </a>
          <button
            type="button"
            onClick={() => setMenuOpen((p) => !p)}
            aria-label={menuOpen ? "إغلاق القائمة" : "القائمة"}
            aria-expanded={menuOpen}
            className="flex size-10 items-center justify-center rounded-full border border-[var(--color-mrf-line)] bg-white/80 text-[var(--color-mrf-ink)] transition-colors hover:border-[var(--color-mrf-primary)] hover:text-[var(--color-mrf-primary)] md:hidden"
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
              className="absolute inset-x-0 top-full mt-2 overflow-hidden rounded-3xl border border-[var(--color-mrf-line)] bg-white/95 p-2 shadow-2xl backdrop-blur-xl md:hidden"
            >
              <ul className="flex flex-col">
                {navLinks.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-between rounded-2xl px-4 py-3 text-right text-sm font-semibold text-[var(--color-mrf-ink)] transition-colors hover:bg-[var(--color-mrf-primary)]/10 hover:text-[var(--color-mrf-primary-dim)]"
                    >
                      <Icon.ArrowLeft className="size-4 text-[var(--color-mrf-muted)]" />
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ───── Hero ───── */}
      <HeroChoreography>
        <header
          ref={heroRef}
          className="relative overflow-hidden bg-[var(--color-mrf-bg)] pt-20 pb-14 sm:pt-32 sm:pb-24 lg:pt-40 lg:pb-32"
        >
          <div className="relative mx-auto grid max-w-7xl items-center gap-3 px-4 sm:gap-8 sm:px-6 grid-cols-[1fr_1.05fr] sm:grid-cols-[1.1fr_1fr] lg:grid-cols-[1.05fr_1fr] lg:gap-12">
            <div className="space-y-3 text-right sm:space-y-6 lg:space-y-8">
              <span className="mrf-eyebrow inline-flex translate-y-2.5 items-center gap-1.5 rounded-full border border-[var(--color-mrf-primary)]/25 bg-[var(--color-mrf-primary)]/5 px-2.5 py-1 text-[9px] font-semibold tracking-[0.18em] text-[var(--color-mrf-primary-dim)] opacity-0 sm:gap-2 sm:px-4 sm:py-1.5 sm:text-xs sm:tracking-[0.22em]">
                <Icon.Sparkles className="size-3 sm:size-3.5" />
                {content.hero.badge}
              </span>

              <h1 className="space-y-0.5 text-[clamp(1.15rem,3.4vw,4.75rem)] font-bold leading-[1.4] tracking-tight text-[var(--color-mrf-ink)] sm:space-y-1 sm:leading-[1.35] lg:space-y-2">
                <span className="block overflow-hidden pt-[0.1em] pb-[0.25em]">
                  <span className="mrf-line block">
                    {content.hero.line1}
                  </span>
                </span>
                <span className="block overflow-hidden pt-[0.1em] pb-[0.25em]">
                  <span className="mrf-line block">
                    <em className="not-italic" style={{ color: "var(--color-mrf-primary)" }}>{content.hero.line2Highlight}</em>
                  </span>
                </span>
                <span className="block overflow-hidden pt-[0.1em] pb-[0.25em]">
                  <span className="mrf-line block">{content.hero.line3}<span style={{ color: "var(--color-mrf-primary)" }}>.</span></span>
                </span>
              </h1>

              <p className="mrf-sub hidden max-w-xl translate-y-5 text-base leading-[1.9] text-[var(--color-mrf-ink-soft)] opacity-0 sm:block sm:text-lg">
                {content.hero.body}
              </p>

              <div className="flex flex-col gap-2 sm:gap-3 lg:flex-row">
                <a
                  href="#book"
                  className="mrf-cta inline-flex h-10 translate-y-5 items-center justify-center gap-1.5 rounded-xl bg-[var(--color-mrf-ink)] px-3 text-[11px] font-bold text-white opacity-0 shadow-md transition-transform hover:scale-[1.02] sm:h-12 sm:gap-3 sm:rounded-2xl sm:px-6 sm:text-base lg:h-14 lg:px-7 lg:py-4"
                >
                  <Icon.CalendarCheck className="size-3.5 sm:size-5" />
                  {content.hero.book}
                  <span className="hidden sm:inline">{content.hero.bookLong}</span>
                  <Icon.ArrowLeft className="hidden size-4 sm:inline" />
                </a>
                <a
                  href={WA}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mrf-cta inline-flex h-10 translate-y-5 items-center justify-center gap-1.5 rounded-xl border border-[var(--color-mrf-ink)]/15 bg-white px-3 text-[11px] font-bold text-[var(--color-mrf-ink)] opacity-0 transition-colors hover:border-[var(--color-mrf-primary)] hover:text-[var(--color-mrf-primary)] sm:h-12 sm:gap-3 sm:rounded-2xl sm:px-6 sm:text-base lg:h-14 lg:px-7 lg:py-4"
                >
                  <FontAwesomeIcon icon={faWhatsapp} className="text-sm text-[#25D366] sm:text-lg" />
                  {content.hero.whatsapp}
                </a>
              </div>
            </div>

            {/* Hero media — left column in RTL natural order. Surrounded
                by a slow-rotating ring and a soft pastel halo so it never
                reads as a static block. */}
            <div
              data-mrf-hero-media
              className="relative mx-auto aspect-square w-full max-w-[200px] will-change-transform sm:max-w-[340px] lg:max-w-[560px]"
            >
              {/* Slow rotating dashed frame — transparent fill, just a
                  thin dashed line in #c47d6e drifting around the video. */}
              <motion.div
                aria-hidden
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                className="pointer-events-none absolute -inset-[6px] rounded-[1.7rem] border-2 border-dashed border-[#c47d6e]/55 sm:-inset-[10px] sm:rounded-[2.2rem]"
              />
              {/* Subtle floating accent dot */}
              <motion.span
                aria-hidden
                animate={{ y: [0, -8, 0], opacity: [0.85, 1, 0.85] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="pointer-events-none absolute -top-1 right-2 z-20 size-2.5 rounded-full bg-[#c47d6e] shadow-[0_0_18px_#c47d6e] sm:right-4 sm:size-3"
              />
              <motion.video
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                data-mrf-hero-video
                poster="/microneedling-rf/poster.webp"
                src="/microneedling-rf/video.mp4"
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                aria-label="نتائج علاج الميكرونيدلينغ بالترددات الراديوية"
                className="relative z-10 block size-full rounded-[1.45rem] object-cover drop-shadow-[0_24px_50px_rgba(196,125,110,0.25)] sm:rounded-[1.95rem]"
              />
            </div>
          </div>

          {/* Stats row — full-width under the 2-col grid so it doesn't
              squeeze the text column on mobile. */}
          <div className="relative mx-auto mt-8 grid max-w-7xl grid-cols-3 gap-3 border-t border-[var(--color-mrf-line)] px-5 pt-5 text-[var(--color-mrf-ink-soft)] sm:mt-12 sm:gap-6 sm:px-6 sm:pt-6">
            {content.hero.stats.map((s) => (
              <div key={s.label} className="flex flex-col text-right">
                <span className="text-lg font-bold text-[var(--color-mrf-ink)] sm:text-2xl">{s.num}</span>
                <span className="text-[9px] uppercase tracking-widest sm:text-xs">{s.label}</span>
              </div>
            ))}
          </div>
        </header>
      </HeroChoreography>

      <Marquee items={content.marquee.items} />

      {/* ───── Problem / Types ───── */}
      <section id="problem" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-16 sm:px-6 sm:py-20 lg:py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="grid items-start gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16"
        >
          <motion.div variants={fadeUp} className="space-y-5 text-right">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-mrf-primary)]/25 bg-[var(--color-mrf-primary)]/5 px-4 py-1.5 text-xs font-semibold tracking-[0.22em] text-[var(--color-mrf-primary-dim)]">
              <Icon.Sparkles className="size-3.5" />
              {content.problem.eyebrow}
            </span>
            <h2
              className="font-bold leading-tight text-[var(--color-mrf-ink)]"
              style={{ fontSize: "clamp(2rem, 3.6vw, 3rem)" }}
            >
              {content.problem.title} <em className="not-italic text-[var(--color-mrf-primary)]">{content.problem.highlight}</em> {content.problem.titleTail}
            </h2>
            <p className="text-lg leading-loose text-[var(--color-mrf-ink-soft)]">
              {content.problem.body}
            </p>
          </motion.div>

          <motion.div variants={stagger} className="grid grid-cols-2 gap-3 sm:gap-5">
            {problemCards.map((t) => (
              <motion.div
                key={t.title}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                className="group flex flex-col gap-3 rounded-2xl border border-[var(--color-mrf-line)] bg-[var(--color-mrf-surface)] p-4 transition-shadow hover:shadow-[0_20px_50px_-25px_rgba(154,90,78,0.3)] sm:gap-4 sm:rounded-3xl sm:p-7"
              >
                <div className="flex items-start justify-between gap-2 sm:gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-[var(--color-mrf-primary)]/10 text-[var(--color-mrf-primary-dim)] transition-colors group-hover:bg-[var(--color-mrf-primary)] group-hover:text-white sm:size-12 sm:rounded-2xl">
                    <t.icon className="size-5" />
                  </div>
                  <span className="text-[10px] font-semibold tracking-wider text-[var(--color-mrf-muted)] sm:text-xs">
                    {t.short}
                  </span>
                </div>
                <h3 className="text-base font-bold leading-tight text-[var(--color-mrf-ink)] sm:text-xl">
                  {t.title}
                </h3>
                <p className="text-xs leading-relaxed text-[var(--color-mrf-ink-soft)] sm:text-sm">
                  {t.desc}
                </p>
                <span className="mt-auto self-start rounded-full bg-[var(--color-mrf-accent)]/20 px-2.5 py-1 text-[10px] font-semibold text-[var(--color-mrf-primary-dim)] sm:px-3 sm:text-xs">
                  {t.tag}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ───── Process Timeline ───── */}
      <section
        id="process"
        className="relative scroll-mt-24 overflow-hidden bg-[var(--color-mrf-ink)] py-16 text-white sm:py-20 lg:py-24"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 size-[600px] -translate-x-1/2 rounded-full bg-[var(--color-mrf-primary)]/15 blur-3xl"
        />
        <Image
          src="/microneedling-rf/accent-bokeh.webp"
          alt=""
          fill
          sizes="100vw"
          className="absolute inset-0 object-cover opacity-15 mix-blend-soft-light"
        />

        <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="mx-auto mb-16 max-w-2xl text-center"
          >
            <motion.span
              variants={fadeUp}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-mrf-accent)]/30 bg-white/5 px-4 py-1.5 text-xs font-semibold tracking-[0.22em] text-[var(--color-mrf-accent)]"
            >
              {content.process.eyebrow}
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="mt-4 font-bold leading-tight"
              style={{ fontSize: "clamp(2rem, 3.6vw, 3rem)" }}
            >
              {content.process.title} <em className="not-italic text-[var(--color-mrf-accent)]">{content.process.highlight}</em>.
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mt-4 text-lg leading-loose text-white/70"
            >
              {content.process.body}
            </motion.p>
          </motion.div>

          <motion.ol
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4"
          >
            {content.process.steps.map((step) => (
              <motion.li
                key={step.num}
                variants={fadeUp}
                className="group relative rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-colors hover:border-[var(--color-mrf-accent)]/40 sm:rounded-3xl sm:p-6"
              >
                <span className="block text-3xl font-black text-[var(--color-mrf-accent)] opacity-40 sm:text-5xl">
                  {step.num}
                </span>
                <h3 className="mt-1.5 text-base font-bold leading-tight sm:mt-2 sm:text-xl">
                  {step.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-white/70 sm:mt-3 sm:text-sm">
                  {step.desc}
                </p>
                <Icon.ArrowLeft className="absolute bottom-4 left-4 size-4 text-[var(--color-mrf-accent)] opacity-0 transition-opacity group-hover:opacity-100 sm:bottom-6 sm:left-6" />
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </section>

      {/* ───── Doctor ───── */}
      <section id="doctor" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-16 sm:px-6 sm:py-20 lg:py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
        >
          <motion.div variants={fadeUp} className="order-2 space-y-5 text-right lg:order-1">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-mrf-primary)]/25 bg-[var(--color-mrf-primary)]/5 px-4 py-1.5 text-xs font-semibold tracking-[0.22em] text-[var(--color-mrf-primary-dim)]">
              {content.doctors.eyebrow}
            </span>
            <h2
              className="font-bold leading-tight text-[var(--color-mrf-ink)]"
              style={{ fontSize: "clamp(2rem, 3.6vw, 3rem)" }}
            >
              {content.doctors.title} <em className="not-italic text-[var(--color-mrf-primary)]">{content.doctors.highlight}</em>
            </h2>
            <p className="text-base font-semibold text-[var(--color-mrf-ink-soft)]">
              {content.doctors.sub}
            </p>
            <blockquote className="border-r-4 border-[var(--color-mrf-primary)]/30 bg-[var(--color-mrf-surface)] px-6 py-5 text-right text-base leading-loose text-[var(--color-mrf-ink-soft)]">
              «{content.doctors.quote}»
            </blockquote>
            <div className="grid grid-cols-2 gap-4 pt-4">
              {content.doctors.credentials.map((c) => (
                <div
                  key={c.label}
                  className="rounded-2xl border border-[var(--color-mrf-line)] bg-[var(--color-mrf-surface)] p-4"
                >
                  <p className="text-xl font-bold text-[var(--color-mrf-primary-dim)]">
                    {c.num}
                  </p>
                  <p className="text-xs text-[var(--color-mrf-ink-soft)]">{c.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="order-1 lg:order-2">
            <div className="relative mx-auto w-full max-w-md sm:max-w-lg lg:max-w-xl">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] border-[6px] border-white shadow-[0_30px_70px_-30px_rgba(154,90,78,0.4)] sm:rounded-[2rem] sm:border-8">
                {DOCTORS.map((d, i) => (
                  <Image
                    key={d.img}
                    src={d.img}
                    alt={d.name}
                    fill
                    priority={i === 0}
                    sizes="(max-width: 1024px) 90vw, 640px"
                    className={`object-cover object-top transition-opacity duration-300 ease-out ${
                      i === activeDoc ? "opacity-100" : "opacity-0"
                    }`}
                  />
                ))}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[var(--color-mrf-ink)]/70 via-[var(--color-mrf-ink)]/20 to-transparent p-6 text-white">
                  <p className="font-bold text-lg">{DOCTORS[activeDoc].name}</p>
                  <p className="text-xs opacity-85">{DOCTORS[activeDoc].title}</p>
                </div>

                <button
                  type="button"
                  onClick={prevDoc}
                  aria-label="السابق"
                  className="absolute right-3 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-[var(--color-mrf-ink)] shadow-lg backdrop-blur transition hover:bg-white"
                >
                  <Icon.ArrowLeft className="size-4 rotate-180" />
                </button>
                <button
                  type="button"
                  onClick={nextDoc}
                  aria-label="التالي"
                  className="absolute left-3 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-[var(--color-mrf-ink)] shadow-lg backdrop-blur transition hover:bg-white"
                >
                  <Icon.ArrowLeft className="size-4" />
                </button>
              </div>

              <div className="mt-5 flex items-center justify-center gap-2">
                {DOCTORS.map((d, i) => (
                  <button
                    key={d.name}
                    type="button"
                    onClick={() => setActiveDoc(i)}
                    aria-label={d.name}
                    className={`h-2 rounded-full transition-all ${i === activeDoc ? "w-8 bg-[var(--color-mrf-primary)]" : "w-2 bg-[var(--color-mrf-line)] hover:bg-[var(--color-mrf-primary)]/40"}`}
                  />
                ))}
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                {DOCTORS.map((d, i) => (
                  <button
                    key={d.name}
                    type="button"
                    onClick={() => setActiveDoc(i)}
                    className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                      i === activeDoc
                        ? "border-[var(--color-mrf-primary)] bg-[var(--color-mrf-primary)] text-white"
                        : "border-[var(--color-mrf-line)] bg-white text-[var(--color-mrf-ink-soft)] hover:border-[var(--color-mrf-primary)] hover:text-[var(--color-mrf-primary)]"
                    }`}
                  >
                    {d.name}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ───── Testimonials ───── */}
      <section className="bg-[var(--color-mrf-surface)] py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="mb-12 text-center"
          >
            <motion.span
              variants={fadeUp}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-mrf-primary)]/25 bg-[var(--color-mrf-primary)]/5 px-4 py-1.5 text-xs font-semibold tracking-[0.22em] text-[var(--color-mrf-primary-dim)]"
            >
              {content.testimonials.eyebrow}
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="mt-4 font-bold leading-tight text-[var(--color-mrf-ink)]"
              style={{ fontSize: "clamp(2rem, 3.6vw, 3rem)" }}
            >
              {content.testimonials.title} <em className="not-italic text-[var(--color-mrf-primary)]">{content.testimonials.highlight}</em> {content.testimonials.titleTail}
            </motion.h2>
          </motion.div>

          {(() => {
            const testimonials = content.testimonials.cards;
            return (
              <div
                dir="ltr"
                className="group relative overflow-hidden"
                style={{
                  WebkitMaskImage:
                    "linear-gradient(to right, transparent 0%, #000 6%, #000 94%, transparent 100%)",
                  maskImage:
                    "linear-gradient(to right, transparent 0%, #000 6%, #000 94%, transparent 100%)",
                }}
              >
                <div className="mrf-marquee flex w-max">
                  {[0, 1, 2, 3].map((setIdx) => (
                    <div
                      key={setIdx}
                      className="flex shrink-0 gap-4 pe-4 sm:gap-6 sm:pe-6"
                    >
                      {testimonials.map((t, i) => (
                        <div
                          key={`${setIdx}-${t.name}-${i}`}
                          dir="rtl"
                          className="flex w-[280px] shrink-0 flex-col gap-4 rounded-3xl border border-[var(--color-mrf-line)] bg-[var(--color-mrf-bg)] p-5 sm:w-[340px] sm:gap-5 sm:p-7"
                        >
                          <Icon.Quote className="size-6 text-[var(--color-mrf-primary)]" />
                          <p className="text-sm leading-loose text-[var(--color-mrf-ink-soft)]">
                            «{t.text}»
                          </p>
                          <div className="mt-auto flex items-center gap-3 border-t border-[var(--color-mrf-line)] pt-4">
                            <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-mrf-primary)] to-[var(--color-mrf-accent)] font-bold text-white">
                              {t.name.charAt(0)}
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-[var(--color-mrf-ink)]">{t.name}</p>
                              <p className="text-xs text-[var(--color-mrf-muted)]">{t.location}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* ───── FAQ ───── */}
      <section id="faq" className="mx-auto max-w-3xl scroll-mt-24 px-5 py-16 sm:px-6 sm:py-20 lg:py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="mb-10 text-center"
        >
          <motion.span
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-mrf-primary)]/25 bg-[var(--color-mrf-primary)]/5 px-4 py-1.5 text-xs font-semibold tracking-[0.22em] text-[var(--color-mrf-primary-dim)]"
          >
            {content.faq.eyebrow}
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="mt-4 font-bold leading-tight text-[var(--color-mrf-ink)]"
            style={{ fontSize: "clamp(2rem, 3.6vw, 3rem)" }}
          >
            {content.faq.title} <em className="not-italic text-[var(--color-mrf-primary)]">{content.faq.highlight}</em>
          </motion.h2>
        </motion.div>

        <div className="space-y-3">
          {content.faq.questions.map((f, i) => (
            <motion.details
              key={f.q}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              open={i === openFaq}
              onToggle={(e) => {
                if ((e.currentTarget as HTMLDetailsElement).open) setOpenFaq(i);
              }}
              className="group overflow-hidden rounded-2xl border border-[var(--color-mrf-line)] bg-[var(--color-mrf-surface)]"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-3 px-5 py-4 text-right text-sm font-bold text-[var(--color-mrf-ink)] sm:gap-4 sm:px-6 sm:py-5 sm:text-base [&::-webkit-details-marker]:hidden">
                <span>{f.q}</span>
                <Icon.Plus className="size-5 shrink-0 text-[var(--color-mrf-primary)] transition-transform duration-300 group-open:rotate-45" />
              </summary>
              <div className="border-t border-[var(--color-mrf-line)] px-5 py-4 text-right text-sm leading-loose text-[var(--color-mrf-ink-soft)] sm:px-6 sm:py-5">
                {f.a}
              </div>
            </motion.details>
          ))}
        </div>
      </section>

      {/* ───── Booking ───── */}
      <section
        id="book"
        className="relative scroll-mt-24 overflow-hidden bg-gradient-to-br from-[var(--color-mrf-bg)] via-[var(--color-mrf-accent)]/15 to-[var(--color-mrf-bg)] py-16 sm:py-20 lg:py-24"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 right-1/4 size-[420px] rounded-full bg-[var(--color-mrf-accent)]/40 blur-3xl"
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:gap-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="space-y-5 text-right"
          >
            <motion.span
              variants={fadeUp}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-mrf-primary)]/25 bg-[var(--color-mrf-primary)]/5 px-4 py-1.5 text-xs font-semibold tracking-[0.22em] text-[var(--color-mrf-primary-dim)]"
            >
              {content.booking.eyebrow}
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="font-bold leading-tight text-[var(--color-mrf-ink)]"
              style={{ fontSize: "clamp(2.25rem, 4vw, 3.5rem)" }}
            >
              {content.booking.title} <em className="not-italic text-[var(--color-mrf-primary)]">{content.booking.highlight}</em>.
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="max-w-xl text-lg leading-loose text-[var(--color-mrf-ink-soft)]"
            >
              {content.booking.body}
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col gap-3 sm:flex-row">
              <a
                href="#book"
                className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[var(--color-mrf-ink)] px-6 py-3.5 text-sm font-bold text-white shadow-md transition-transform hover:scale-[1.02]"
              >
                <Icon.CalendarCheck className="size-4" />
                {content.booking.book}
              </a>
              <a
                href={WA}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#25D366] px-6 py-3.5 text-sm font-bold text-white shadow-md transition-transform hover:scale-[1.02]"
              >
                <FontAwesomeIcon icon={faWhatsapp} className="text-lg" />
                {content.booking.whatsapp}
              </a>
            </motion.div>

            <motion.ul
              variants={fadeUp}
              className="grid gap-2.5 pt-6 text-sm text-[var(--color-mrf-ink-soft)]"
            >
              {content.booking.points.map((b) => (
                <li key={b} className="flex items-start gap-2.5">
                  <Icon.CheckCircle2 className="mt-0.5 size-4 text-[var(--color-mrf-primary)]" />
                  {b}
                </li>
              ))}
            </motion.ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <LeadForm copy={content.booking} />
          </motion.div>
        </div>
      </section>

      {/* ───── Footer ───── */}
      <footer className="bg-[var(--color-mrf-ink)] py-10 pb-24 text-white/70 sm:py-12 md:pb-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 text-center text-sm sm:px-6 md:flex-row md:text-start">
          <p>{content.footer.copyright}</p>
          <div className="flex gap-6">
            <a className="transition-colors hover:text-[var(--color-mrf-accent)]" href="#">{content.footer.privacy}</a>
            <a className="transition-colors hover:text-[var(--color-mrf-accent)]" href="#">{content.footer.terms}</a>
          </div>
        </div>
      </footer>

      <MobileStickyCTA
        tokenPrefix="mrf"
        bookHref="#book"
        whatsappNumber={WA_NUMBER}
        topicMessage={"مرحباً عندي استفسار عن " + WA_TOPIC}
      />

      <WhatsAppFAB
        tokenPrefix="mrf"
        whatsappNumber={WA_NUMBER}
        topicMessage={"مرحباً عندي استفسار عن " + WA_TOPIC}
      />
    </>
  );
}
