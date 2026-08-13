"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon, SocialIcon } from "@/components/icons";
import { GOLD_GRADIENT, SLIDES, WA_LINK, toArabicDigits } from "./config";

const DURATION_MS = 6800;

const STATS = [
  { value: "٤٫٨ من ٥", label: "تقييم Google" },
  { value: "+١٢٧٠", label: "تقييم موثّق" },
  { value: "+١٣ عاماً", label: "خبرة تجميلية" },
  { value: "١٠٠٪", label: "طاقم نسائي" },
] as const;

const EASE = [0.22, 1, 0.36, 1] as const;

export function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  // Slides mount only once visited, so the hero ships one image, not four.
  const [seen, setSeen] = useState<number[]>([0]);
  const barRef = useRef<HTMLSpanElement>(null);
  // Hover/focus pause lives in a ref: it must not restart the countdown.
  const pausedRef = useRef(false);

  const go = useCallback((target: number, direction: number) => {
    const i = ((target % SLIDES.length) + SLIDES.length) % SLIDES.length;
    setDir(direction);
    setIndex(i);
    setSeen((s) => (s.includes(i) ? s : [...s, i]));
  }, []);

  const next = useCallback(() => go(index + 1, 1), [go, index]);
  const prev = useCallback(() => go(index - 1, -1), [go, index]);

  // rAF timer: the progress bar and the auto-advance share one clock, so
  // pausing on hover freezes both instead of letting them drift apart.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let elapsed = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const delta = now - last;
      last = now;
      if (!pausedRef.current && !document.hidden) elapsed += delta;

      const progress = Math.min(1, elapsed / DURATION_MS);
      barRef.current?.style.setProperty("transform", `scaleX(${progress})`);

      if (progress >= 1) {
        elapsed = 0;
        go(index + 1, 1);
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [go, index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") next();
      if (e.key === "ArrowRight") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const slide = SLIDES[index];

  return (
    <section
      id="top"
      className="relative overflow-hidden"
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
      onFocusCapture={() => {
        pausedRef.current = true;
      }}
      onBlurCapture={() => {
        pausedRef.current = false;
      }}
    >
      {/* soft champagne wash along the top edge */}
      <div
        className="pointer-events-none absolute -top-[260px] right-[14%] h-[560px] w-[820px] blur-[40px]"
        style={{
          background:
            "radial-gradient(ellipse 50% 50% at 50% 0%, rgba(224,190,122,.3), transparent 70%)",
          animation: "md-breathe 8s ease-in-out infinite",
        }}
        aria-hidden
      />

      {/* ——— copy (right in RTL) ——— */}
      {/* 1224 keeps the copy's inner edge flush with the 1180 content column
          the sections below use */}
      <div className="relative z-10 mx-auto max-w-[1224px] px-[22px] pt-[104px] lg:flex lg:min-h-svh lg:items-center lg:pt-[120px] lg:pb-16">
        <div className="flex w-full flex-col items-center text-center lg:w-[48%] lg:items-start lg:text-right">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={slide.slug}
              initial={{ x: dir > 0 ? -30 : 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: dir > 0 ? 30 : -30, opacity: 0 }}
              transition={{ duration: 0.55, ease: EASE }}
              className="flex w-full flex-col items-center lg:items-start"
            >
              {/* eyebrow: a gold rule and small caps, not a floating pill */}
              <div className="flex items-center gap-3.5">
                <span
                  className="h-px w-9 shrink-0"
                  style={{ background: GOLD_GRADIENT }}
                  aria-hidden
                />
                <span className="text-[0.78rem] font-bold tracking-[0.2em] text-[var(--color-md-bronze)]">
                  {slide.eyebrow}
                </span>
              </div>

              <h1 className="mt-6 text-[clamp(2.35rem,4.8vw,3.4rem)] leading-[1.45] font-extrabold tracking-[-0.015em]">
                {slide.titleTop}
                <br />
                <span className="md-gold-text">{slide.titleGold}</span>
              </h1>

              <p className="mt-6 max-w-[50ch] text-[1.06rem] leading-[2] font-light text-[rgba(39,28,17,0.68)]">
                {slide.body}
              </p>

              {/* feature line: plain text with dot separators */}
              <div className="mt-7 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 lg:justify-start">
                {slide.chips.map((chip, i) => (
                  <Fragment key={chip}>
                    {i > 0 ? (
                      <span
                        className="size-[5px] rounded-full bg-[var(--color-md-champagne)]"
                        aria-hidden
                      />
                    ) : null}
                    <span className="text-[0.92rem] font-bold text-[var(--color-md-ink-soft)]">
                      {chip}
                    </span>
                  </Fragment>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* CTAs stay mounted across slides; only the href changes */}
          <div className="mt-9 flex w-full flex-col gap-3.5 sm:w-auto sm:flex-row">
            <Link
              href={`/${slide.slug}`}
              className="inline-flex items-center justify-center gap-2.5 rounded-full px-[34px] py-[17px] text-base font-extrabold text-[var(--color-md-ink)] shadow-[0_20px_46px_-16px_rgba(166,124,61,0.6)] transition-all duration-300 hover:-translate-y-[3px] hover:shadow-[0_26px_56px_-16px_rgba(201,156,78,0.65)]"
              style={{ background: GOLD_GRADIENT }}
            >
              اكتشفي البرنامج
              <Icon.ArrowLeft className="size-[17px]" strokeWidth={2.4} />
            </Link>
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 rounded-full border border-[var(--color-md-line-strong)] bg-[rgba(255,253,249,0.6)] px-8 py-[17px] text-base font-extrabold text-[var(--color-md-ink)] transition-all duration-300 hover:-translate-y-[3px] hover:border-[var(--color-md-gold)] hover:bg-[#FFFDF8]"
            >
              <SocialIcon name="whatsapp" className="text-[19px] text-[#25D366]" />
              استشارة واتساب
            </a>
          </div>

          {/* proof stats: a hairline row, not a boxed widget */}
          <div className="mt-11 grid w-full max-w-[560px] grid-cols-2 gap-x-6 gap-y-5 border-t border-[var(--color-md-line)] pt-6 sm:flex sm:flex-wrap sm:justify-center sm:gap-x-9 lg:justify-start">
            {STATS.map((s) => (
              <div key={s.label} className="text-center lg:text-right">
                <div className="text-[1.3rem] leading-tight font-extrabold text-[var(--color-md-bronze)]">
                  {s.value}
                </div>
                <div className="mt-1 text-[0.75rem] font-bold text-[rgba(39,28,17,0.5)]">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ——— media: a rounded card on mobile, a full-bleed editorial panel
              down the left edge from lg up ——— */}
      <motion.div
        drag="x"
        dragSnapToOrigin
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.12}
        onDragEnd={(_, info) => {
          if (info.offset.x < -60) next();
          else if (info.offset.x > 60) prev();
        }}
        className="relative mx-[22px] mt-12 mb-[78px] cursor-grab touch-pan-y active:cursor-grabbing lg:absolute lg:inset-y-0 lg:left-0 lg:m-0 lg:w-[47%]"
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-[36px] shadow-[0_54px_96px_-44px_rgba(39,28,17,0.45)] lg:h-full lg:aspect-auto lg:rounded-none lg:rounded-tr-[130px] lg:rounded-br-[130px]">
            {SLIDES.map((s, i) =>
              seen.includes(i) ? (
                <motion.div
                  key={s.slug}
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: i === index ? 1 : 0 }}
                  transition={{ duration: 0.8, ease: EASE }}
                >
                  <Image
                    src={s.main}
                    alt={s.mainAlt}
                    fill
                    sizes="(max-width: 1024px) 92vw, 500px"
                    loading={i === 0 ? "eager" : "lazy"}
                    fetchPriority={i === 0 ? "high" : "auto"}
                    className={`object-cover transition-transform duration-[7200ms] ease-linear ${
                      i === index ? "scale-100" : "scale-[1.09]"
                    }`}
                    style={{ objectPosition: s.focus ?? "center" }}
                    draggable={false}
                  />
                </motion.div>
              ) : null,
            )}

          {/* Top fade into the page ground: softens the panel's hard edge and
              keeps the dark nav links readable where they cross the photo.
              lg only — below that the card sits clear of the header. */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 hidden h-40 lg:block"
            style={{
              background:
                "linear-gradient(to bottom, rgba(251,248,243,.92), rgba(251,248,243,.45) 45%, transparent)",
            }}
            aria-hidden
          />
          {/* scrim so the controls stay legible over any photograph */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-44"
            style={{
              background:
                "linear-gradient(to top, rgba(30,21,12,.82), rgba(30,21,12,.32) 38%, transparent 74%)",
            }}
            aria-hidden
          />

          {/* controls: index, segmented progress track, arrows */}
          <div className="absolute inset-x-0 bottom-0 flex items-center gap-4 px-7 pb-7 sm:gap-5 sm:px-9 sm:pb-9">
            <span
              dir="ltr"
              className="inline-flex shrink-0 items-baseline gap-1.5 text-[#F7F0E2]"
            >
              <span className="text-[1.3rem] leading-none font-extrabold">
                {toArabicDigits(String(index + 1).padStart(2, "0"))}
              </span>
              <span className="text-[0.78rem] font-bold opacity-55">
                / {toArabicDigits(String(SLIDES.length).padStart(2, "0"))}
              </span>
            </span>

            <div className="flex flex-1 items-center gap-1.5">
              {SLIDES.map((s, i) => (
                <button
                  key={s.slug}
                  type="button"
                  onClick={() => go(i, i > index ? 1 : -1)}
                  aria-label={`الانتقال إلى ${s.titleTop}`}
                  aria-current={i === index}
                  className="group relative h-5 flex-1"
                >
                  <span className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 overflow-hidden rounded-full bg-white/35 transition-colors duration-300 group-hover:bg-white/60">
                    {i === index ? (
                      <span
                        ref={barRef}
                        className="absolute inset-0 origin-right rounded-full bg-[var(--color-md-champagne)]"
                        style={{ transform: "scaleX(0)" }}
                      />
                    ) : null}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={prev}
                aria-label="الشريحة السابقة"
                className="flex size-9 items-center justify-center rounded-full border border-white/45 text-[#F7F0E2] transition-all duration-300 hover:border-white/85 hover:bg-white/15"
              >
                <Icon.ChevronRight className="size-[17px]" strokeWidth={2.2} />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="الشريحة التالية"
                className="flex size-9 items-center justify-center rounded-full border border-white/45 text-[#F7F0E2] transition-all duration-300 hover:border-white/85 hover:bg-white/15"
              >
                <Icon.ChevronLeft className="size-[17px]" strokeWidth={2.2} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
