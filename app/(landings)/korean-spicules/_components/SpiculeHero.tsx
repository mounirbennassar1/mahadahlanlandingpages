"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Icon } from "@/components/icons";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const FORM_ANCHOR = "#lead-form";

const ORANGE_GRADIENT =
  "linear-gradient(120deg, #ffb473 0%, #ff6b1a 55%, #e35500 100%)";

/* Deterministic needle configs (no Math.random → no hydration mismatch). */
const NEEDLES = [
  { l: "8%", h: 16, d: "11s", delay: "0s", o: 0.6, r: "18deg", mobile: true },
  { l: "18%", h: 12, d: "14s", delay: "2.4s", o: 0.4, r: "-24deg", mobile: false },
  { l: "30%", h: 18, d: "10s", delay: "4.6s", o: 0.55, r: "30deg", mobile: true },
  { l: "44%", h: 11, d: "13s", delay: "1.2s", o: 0.35, r: "-12deg", mobile: false },
  { l: "56%", h: 15, d: "12s", delay: "3.5s", o: 0.5, r: "22deg", mobile: true },
  { l: "68%", h: 12, d: "15s", delay: "0.9s", o: 0.4, r: "-30deg", mobile: false },
  { l: "80%", h: 17, d: "10.5s", delay: "5.1s", o: 0.6, r: "14deg", mobile: true },
  { l: "90%", h: 13, d: "13.5s", delay: "2s", o: 0.45, r: "-18deg", mobile: false },
];

const STATS = [
  { num: "٩٧٪", label: "رضا العميلات" },
  { num: "+١٨٠٠", label: "جلسة ناجحة" },
  { num: "٧ أيام", label: "لبشرة جديدة" },
];

/**
 * Pinned cinematic hero: entrance choreography (masked headline lines,
 * clip-path portrait reveal) then a scroll-scrubbed exit — watermark drifts,
 * portrait parallaxes and everything dissolves into the pure-black ground.
 * Sticky-positioning does the pinning (no pin-spacer jank on mobile).
 */
export function SpiculeHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const watermarkRef = useRef<HTMLSpanElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      /* ── entrance ─────────────────────────────────────────── */
      gsap.set(".kos-line", { yPercent: 135 });
      gsap.set(".kos-hero-fade", { opacity: 0, y: 22 });
      gsap.set(cardRef.current, { opacity: 0, y: 34, scale: 1.05 });

      const tl = gsap.timeline({ delay: 0.15, defaults: { ease: "expo.out" } });
      tl.to(cardRef.current, { opacity: 1, y: 0, scale: 1, duration: 1.3 }, 0.05)
        .to(".kos-line", { yPercent: 0, stagger: 0.13, duration: 1.1 }, 0.25)
        .to(".kos-hero-fade", { opacity: 1, y: 0, duration: 0.7, stagger: 0.09 }, "-=0.65");

      // Failsafe: never leave the hero invisible if rAF stalls (bg tab, etc.).
      const failsafe = window.setTimeout(() => {
        gsap.set(".kos-line", { yPercent: 0 });
        gsap.set(".kos-hero-fade", { opacity: 1, y: 0 });
        gsap.set(cardRef.current, { opacity: 1, y: 0, scale: 1 });
      }, 2000);

      /* ── scroll-scrubbed exit choreography ────────────────── */
      const mm = gsap.matchMedia();
      mm.add(
        { isMobile: "(max-width: 767px)", isDesktop: "(min-width: 768px)" },
        (ctx) => {
          const { isMobile } = ctx.conditions as { isMobile: boolean };
          const scrub = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "bottom bottom",
              scrub: isMobile ? 0.5 : 0.85,
            },
          });

          scrub
            .to(cueRef.current, { opacity: 0, duration: 0.06 }, 0.02)
            .to(
              watermarkRef.current,
              { xPercent: isMobile ? -14 : -24, duration: 1 },
              0,
            )
            .to(glowRef.current, { scale: 1.35, opacity: 0.95, duration: 1 }, 0);

          // she opens her eyes and smiles as the scroll begins
          scrub.to(".kos-hero-open", { opacity: 1, duration: 0.34 }, 0.06);

          if (isMobile) {
            // she stays in frame (subtle zoom) while the copy exits first —
            // upward travel would push her face under the fixed nav.
            scrub
              .to(".kos-hero-figure", { scale: 1.05, duration: 1 }, 0)
              .to(
                ".kos-hero-copy",
                { y: -50, opacity: 0, duration: 0.45, ease: "power1.in" },
                0.4,
              )
              .to(
                cardRef.current,
                { y: -24, opacity: 0, duration: 0.35, ease: "power1.in" },
                0.65,
              );
          } else {
            scrub
              .to(".kos-hero-figure", { yPercent: -6, scale: 1.03, duration: 1 }, 0)
              .to(
                ".kos-hero-copy",
                { y: -90, opacity: 0, duration: 0.4, ease: "power1.in" },
                0.38,
              )
              .to(
                cardRef.current,
                { y: -70, opacity: 0, duration: 0.4, ease: "power1.in" },
                0.55,
              );
          }
        },
      );

      return () => window.clearTimeout(failsafe);
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="hero"
      data-glow="50,-8,0.55"
      className="relative h-[185svh] md:h-[240svh]"
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {/* breathing orange aura */}
        <div
          ref={glowRef}
          className="kos-breathe pointer-events-none absolute left-1/2 top-1/2 z-10 h-[75vmin] w-[75vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(closest-side, rgba(255,107,26,0.16), rgba(255,107,26,0.05) 55%, transparent 75%)",
          }}
          aria-hidden
        />

        {/* outlined latin watermark */}
        <span
          ref={watermarkRef}
          dir="ltr"
          className="kos-outline-text pointer-events-none absolute top-[5%] right-[-4%] z-10 select-none text-[26vw] font-extrabold leading-none md:top-[4%] md:text-[17vw]"
          aria-hidden
        >
          SPICULES
        </span>

        {/* rising spicule needles */}
        <div className="pointer-events-none absolute inset-0 z-10" aria-hidden>
          {NEEDLES.map((n, i) => (
            <span
              key={i}
              className={`kos-needle absolute bottom-[6%] w-px rounded-full ${
                n.mobile ? "" : "hidden sm:block"
              }`}
              style={
                {
                  left: n.l,
                  height: n.h,
                  background:
                    "linear-gradient(to top, transparent, #ffb473 45%, #ff6b1a)",
                  boxShadow: "0 0 8px 1px rgba(255,107,26,0.5)",
                  "--ndl-d": n.d,
                  "--ndl-delay": n.delay,
                  "--ndl-o": n.o,
                  "--ndl-r": n.r,
                } as React.CSSProperties
              }
            />
          ))}
        </div>

        {/* content */}
        <div className="relative z-20 mx-auto flex h-full w-full max-w-6xl flex-col gap-3 px-5 pb-24 pt-20 md:grid md:grid-cols-[1.05fr_0.95fr] md:grid-rows-[auto_auto] md:items-center md:gap-x-14 md:gap-y-0 md:pb-20 md:pt-28">
          {/* headline — first on mobile; right column, row 1 on md */}
          <div className="kos-hero-copy order-1 text-center md:order-none md:col-start-1 md:row-start-1 md:text-right">
            <span className="kos-hero-fade inline-flex items-center gap-2 rounded-full border border-[var(--color-kos-line)] bg-black/55 px-3.5 py-1.5 text-[10px] font-bold tracking-normal text-[var(--color-kos-primary-dim)] backdrop-blur-md sm:text-[11px]">
              <Icon.Sparkles className="size-3.5" />
              عيادات د. مها دحلان · تقنية كورية أصيلة
            </span>

            <h1 className="mt-3 md:mt-6">
              {/* mobile: one compact line */}
              <span className="block text-[clamp(2rem,10vw,2.75rem)] font-extrabold leading-tight md:hidden">
                <span className="-mb-[0.2em] block overflow-hidden pt-[0.14em] pb-[0.34em]">
                  <span className="kos-line block">
                    {/* own pb extends the background-clip:text paint box under
                        the ز descender (else it renders cut); -mb cancels it. */}
                    <span className="kos-orange-text kos-orange-text-animated -mb-[0.24em] inline-block pb-[0.24em]">
                      السبيكولز
                    </span>{" "}
                    <span className="text-white">الكوريّة</span>
                  </span>
                </span>
              </span>
              {/* desktop: two stacked display lines */}
              <span className="hidden text-[clamp(4.5rem,8.5vw,6.6rem)] font-extrabold leading-[1.04] md:block">
                {/* pb widens the clip window for deep Arabic descenders;
                    the matching -mb cancels it so line rhythm holds. */}
                <span className="-mb-[0.2em] block overflow-hidden pt-[0.14em] pb-[0.32em]">
                  <span className="kos-line kos-orange-text kos-orange-text-animated block pb-[0.24em] -mb-[0.24em]">
                    السبيكولز
                  </span>
                </span>
                <span className="-mb-[0.2em] block overflow-hidden pt-[0.14em] pb-[0.32em]">
                  <span className="kos-line block text-white">الكوريّة</span>
                </span>
              </span>
            </h1>
          </div>

          {/* portrait — under the headline on mobile (flexes to the leftover
              height so she always fits); left column spanning both rows on md */}
          <div
            ref={cardRef}
            className="relative z-30 order-2 flex min-h-[8rem] flex-1 items-center justify-center md:order-none md:col-start-2 md:row-span-2 md:row-start-1 md:block md:flex-none"
          >
            <div className="kos-hero-figure relative mx-auto aspect-[3/4] h-full max-h-[54svh] w-auto md:h-auto md:max-h-none md:w-full md:max-w-[26rem]">
              {/* animated effect behind her */}
              <div
                className="kos-breathe pointer-events-none absolute left-1/2 top-[26%] -z-10 h-[125%] w-[125%] -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  background:
                    "radial-gradient(closest-side, rgba(255,107,26,0.22), rgba(255,107,26,0.07) 55%, transparent 75%)",
                }}
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-x-[-14%] top-[-12%] -z-10 aspect-square"
                aria-hidden
              >
                <span
                  className="kos-spin kos-ring-arc absolute inset-0 block"
                  style={{ "--spin-d": "22s" } as React.CSSProperties}
                />
                <span className="absolute inset-[8%] rounded-full border border-[rgba(255,107,26,0.15)]" />
                <span
                  className="kos-spin-rev kos-ring-arc absolute inset-[16%] block opacity-60"
                  style={{ "--spin-d": "38s" } as React.CSSProperties}
                />
                <span
                  className="kos-spin absolute inset-[-8%] rounded-full border border-dashed border-[rgba(255,107,26,0.12)]"
                  style={{ "--spin-d": "70s" } as React.CSSProperties}
                />
              </div>

              <Image
                src="/korean-spicules/hero.jpg"
                alt="بشرة متوهّجة بإضاءة برتقالية — علاج السبيكولز الكوري"
                fill
                priority
                sizes="(max-width: 768px) 45vw, 42vw"
                className="object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
              <Image
                src="/korean-spicules/hero-open.jpg"
                alt=""
                fill
                priority
                sizes="(max-width: 768px) 45vw, 42vw"
                className="kos-hero-open object-cover opacity-0"
                aria-hidden
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            </div>

            {/* floating chips — z-raised so they sit IN FRONT of the text layer */}
            <div className="kos-float absolute -top-3 -right-4 z-40 hidden rounded-2xl border border-[var(--color-kos-line)] bg-black/85 px-4 py-3 shadow-xl backdrop-blur-md md:block lg:-right-10">
              <span className="block text-base font-extrabold text-[var(--color-kos-primary-dim)]">
                بدون جهاز · بدون جراحة
              </span>
              <span className="mt-0.5 block text-[11px] leading-snug tracking-normal text-[var(--color-kos-muted)]">
                تدليك لطيف يفتح آلاف القنوات المجهرية
              </span>
            </div>
            <div className="absolute -bottom-4 left-0 z-40 hidden rounded-2xl border border-[var(--color-kos-line)] bg-black/85 px-4 py-3 shadow-xl backdrop-blur-md md:block lg:-left-4">
              <span className="flex items-center gap-2 text-sm font-extrabold text-white">
                <Icon.Leaf className="size-4 text-[var(--color-kos-primary-dim)]" />
                إبر طبيعية ١٠٠٪
              </span>
              <span className="mt-0.5 block text-[11px] tracking-normal text-[var(--color-kos-muted)]">
                مستخلصة من الإسفنج البحري
              </span>
            </div>
          </div>

          {/* rest of the copy — under the portrait on mobile; right column, row 2 on md */}
          <div className="kos-hero-copy order-3 text-center md:order-none md:col-start-1 md:row-start-2 md:text-right">
            <span className="-mb-[0.24em] block overflow-hidden pt-[0.12em] pb-[0.24em] md:mt-3">
              <span className="kos-line block text-[clamp(1.15rem,4.5vw,2.1rem)] font-extrabold leading-snug text-[var(--color-kos-ink-soft)]">
                ميكرونيدلينغ طبيعي… بدون جهاز
              </span>
            </span>

            <p className="kos-hero-fade mx-auto mt-4 max-w-md text-[13.5px] leading-7 text-[var(--color-kos-ink-soft)] sm:mt-5 sm:text-base sm:leading-8 md:mx-0">
              إبر مجهرية طبيعية ١٠٠٪ مستخلصة من الإسفنج البحري، تفتح آلاف
              القنوات الدقيقة وتحفّز الكولاجين — لعلاج آثار الحبوب والمسام
              الواسعة والبهتان، بنتائج تكتمل خلال أسبوع واحد.
            </p>

            {/* CTA + stats are desktop-only: the mobile funnel uses the fixed
                bottom bar, and the freed space goes to the portrait. */}
            <div className="kos-hero-fade mt-7 hidden w-full items-center gap-3 md:flex md:justify-start">
              <a
                href={FORM_ANCHOR}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full px-7 text-sm font-extrabold text-[#180a02] shadow-[0_12px_32px_-10px_rgba(255,107,26,0.6)] transition-transform hover:scale-[1.03] active:scale-[0.98] sm:w-auto"
                style={{ background: ORANGE_GRADIENT }}
              >
                احجزي جلستكِ الآن
                <Icon.ArrowLeft className="size-4" />
              </a>
              <a
                href="#about"
                className="hidden h-12 w-full items-center justify-center gap-2 rounded-full border border-[var(--color-kos-line)] bg-black/40 px-6 text-sm font-bold text-[var(--color-kos-ink-soft)] backdrop-blur-sm transition-colors hover:border-[var(--color-kos-primary)] hover:text-[var(--color-kos-primary-dim)] sm:inline-flex sm:w-auto"
              >
                كيف تعمل التقنية؟
                <Icon.ChevronDown className="size-4 text-[var(--color-kos-primary)]" />
              </a>
            </div>

            <div className="kos-hero-fade mt-8 hidden items-center gap-6 md:flex md:justify-start md:gap-8">
              {STATS.map((s, i) => (
                <div key={s.label} className="flex items-center gap-5 sm:gap-6 md:gap-8">
                  {i > 0 && (
                    <span className="h-7 w-px bg-[var(--color-kos-line)] sm:h-8" aria-hidden />
                  )}
                  <div className="text-center md:text-right">
                    <span className="block text-xl font-extrabold text-[var(--color-kos-primary-dim)] sm:text-2xl">
                      {s.num}
                    </span>
                    <span className="mt-0.5 block text-[10px] font-bold tracking-normal text-[var(--color-kos-muted)] sm:text-[11px]">
                      {s.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* scroll cue */}
        <div
          ref={cueRef}
          className="absolute bottom-6 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
          aria-hidden
        >
          <span className="text-[10px] font-bold tracking-normal text-[var(--color-kos-muted)]">
            مرّري للأسفل
          </span>
          <span className="block h-10 w-px bg-gradient-to-b from-[var(--color-kos-primary)] to-transparent" />
          <Icon.ChevronDown className="size-4 animate-bounce text-[var(--color-kos-primary)]" />
        </div>
      </div>
    </section>
  );
}
