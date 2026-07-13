"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { Icon } from "@/components/icons";
import { StatPill } from "@/components/usablecomponents/StatPill";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const BG = "#26292c";

type Caption = {
  k: string;
  label: string;
  title: string;
  text: string;
  a: number;
  b: number;
};

const CAPTIONS: Caption[] = [
  {
    k: "٠١",
    label: "تنقية",
    title: "نقاءٌ يعكس الضوء",
    text: "تنظيف مزدوج وتقشير إنزيمي لطيف يفتح المسام ويُهيّئ بشرتكِ للامتصاص المثالي.",
    a: 0.16,
    b: 0.34,
  },
  {
    k: "٠٢",
    label: "تغذية",
    title: "ترطيبٌ يتوهّج من الداخل",
    text: "هيالورونيك وببتيدات كورية تُشبع البشرة طبقةً بعد طبقة حتى تمتلئ بالضوء.",
    a: 0.4,
    b: 0.58,
  },
  {
    k: "٠٣",
    label: "إشراقة",
    title: "توهّجٌ زجاجي يدوم",
    text: "لمعان فوري وملمس حريري من أول جلسة — بدون إبر، وبدون فترة نقاهة.",
    a: 0.64,
    b: 0.82,
  },
];

// Deterministic mote configs (no Math.random → no hydration mismatch).
const MOTES = [
  { l: "12%", d: "10s", delay: "0s", o: 0.55, x: "14px", s: 3 },
  { l: "26%", d: "13s", delay: "2.2s", o: 0.4, x: "-10px", s: 2 },
  { l: "38%", d: "9s", delay: "4.1s", o: 0.6, x: "8px", s: 2.5 },
  { l: "52%", d: "12s", delay: "1.4s", o: 0.35, x: "-16px", s: 2 },
  { l: "64%", d: "11s", delay: "3.3s", o: 0.5, x: "12px", s: 3 },
  { l: "74%", d: "14s", delay: "0.8s", o: 0.45, x: "-8px", s: 2 },
  { l: "84%", d: "10.5s", delay: "5.2s", o: 0.55, x: "10px", s: 2.5 },
  { l: "93%", d: "12.5s", delay: "2.9s", o: 0.4, x: "-12px", s: 2 },
];

const smoothstep = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

/* reduced-motion as an external-store subscription (SSR snapshot: false) */
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
const subscribeReducedMotion = (cb: () => void) => {
  const m = window.matchMedia(REDUCED_QUERY);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};
const getReducedMotion = () => window.matchMedia(REDUCED_QUERY).matches;

type Props = {
  frameCount: number;
  waHref: string;
};

export function CinematicFilm({ frameCount, waHref }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const captionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const framesRef = useRef<HTMLImageElement[]>([]);
  const curRef = useRef(-1);
  const readyRef = useRef(false);
  const stRef = useRef<ScrollTrigger | null>(null);

  // "loading" → frames preloading (canvas dark, tiny counter)
  // "ready"   → canvas film scrubs with scroll
  // "static"  → reduced-motion or frames unavailable → poster still
  const [phase, setPhase] = useState<"loading" | "ready" | "static">("loading");
  const [pct, setPct] = useState(0);

  /* ── canvas draw (object-cover math, seam-free edges) ────── */
  const draw = (i: number, force = false) => {
    const c = canvasRef.current;
    const img = framesRef.current[i];
    if (!c || !img || !img.complete || !img.naturalWidth) return;
    if (!force && i === curRef.current) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const cw = c.width;
    const ch = c.height;
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, cw, ch);
    const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const dw = img.naturalWidth * s;
    const dh = img.naturalHeight * s;
    ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    curRef.current = i;
  };

  const sizeCanvas = () => {
    const c = canvasRef.current;
    if (!c) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = Math.round(c.clientWidth * dpr);
    c.height = Math.round(c.clientHeight * dpr);
    if (curRef.current >= 0) draw(curRef.current, true);
    else {
      const ctx = c.getContext("2d");
      if (ctx) {
        ctx.fillStyle = BG;
        ctx.fillRect(0, 0, c.width, c.height);
      }
    }
  };

  const reduced = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    () => false,
  );

  /* ── preload the frame sequence ──────────────────────────── */
  useEffect(() => {
    if (reduced) return; // static poster path — no preload, no scrub

    sizeCanvas();
    let loaded = 0;
    let settled = 0;
    let done = false;

    const finish = () => {
      if (done) return;
      done = true;
      if (loaded > 0) {
        readyRef.current = true;
        // Draw the frame for the CURRENT scroll position, not frame 0.
        const p = stRef.current?.progress ?? 0;
        draw(Math.round(p * (frameCount - 1)), true);
        setPhase("ready");
      } else {
        setPhase("static");
      }
    };

    const imgs: HTMLImageElement[] = [];
    for (let i = 0; i < frameCount; i++) {
      const img = new window.Image();
      img.decoding = "async";
      img.onload = () => {
        loaded++;
        settled++;
        setPct(Math.round((loaded / frameCount) * 100));
        if (loaded >= Math.ceil(frameCount * 0.6) || settled === frameCount) finish();
      };
      img.onerror = () => {
        settled++;
        if (settled === frameCount) finish();
      };
      img.src = `/glass-skin/seq/f${String(i).padStart(3, "0")}.jpg`;
      imgs.push(img);
    }
    framesRef.current = imgs;

    // Safety net: a stalled frame must never hang the hero.
    const timeout = window.setTimeout(finish, 9000);

    window.addEventListener("resize", sizeCanvas);
    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("resize", sizeCanvas);
      imgs.forEach((im) => {
        im.onload = null;
        im.onerror = null;
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameCount, reduced]);

  /* ── scroll scrub + entrance choreography ────────────────── */
  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      /* film scrub — one ScrollTrigger drives frames + captions + overlay */
      stRef.current = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          if (readyRef.current) draw(Math.round(p * (frameCount - 1)));

          // hero overlay lifts + fades as the film begins
          if (heroRef.current) {
            const gone = smoothstep(0.02, 0.115, p);
            heroRef.current.style.opacity = String(1 - gone);
            heroRef.current.style.transform = `translateY(${-gone * 64}px)`;
            heroRef.current.style.pointerEvents = gone > 0.5 ? "none" : "";
          }
          if (cueRef.current) {
            cueRef.current.style.opacity = String(1 - smoothstep(0.01, 0.05, p));
          }
          CAPTIONS.forEach((c, i) => {
            const el = captionRefs.current[i];
            if (!el) return;
            const win =
              smoothstep(c.a, c.a + 0.055, p) * (1 - smoothstep(c.b - 0.055, c.b, p));
            el.style.opacity = String(win);
            el.style.transform = `translateY(${(1 - win) * 26}px)`;
          });
        },
      });

      /* entrance — text first, film breathes underneath */
      gsap.set(".gls-line", { yPercent: 112 });
      gsap.set(".gls-hero-fade", { opacity: 0, y: 20 });
      const tl = gsap.timeline({ delay: 0.2, defaults: { ease: "expo.out" } });
      tl.to(".gls-line", { yPercent: 0, stagger: 0.14, duration: 1.15 })
        .to(".gls-hero-fade", { opacity: 1, y: 0, duration: 0.7, stagger: 0.09 }, "-=0.7");

      // Failsafe: a time-based entrance never advances if rAF is paused
      // (backgrounded tab) or GSAP stalls, which would leave the hero
      // headline + CTAs invisible. This timer-based net force-reveals the
      // end state; if the entrance already ran, it's a harmless no-op.
      const failsafe = window.setTimeout(() => {
        gsap.set(".gls-line", { yPercent: 0 });
        gsap.set(".gls-hero-fade", { opacity: 1, y: 0 });
      }, 1800);
      return () => window.clearTimeout(failsafe);
    },
    { scope: sectionRef },
  );

  const showPoster = reduced || phase === "static";

  return (
    <section
      ref={sectionRef}
      id="film"
      data-ambient="#26292c"
      className={showPoster ? "relative" : "relative h-[330vh] md:h-[460vh]"}
    >
      <div
        className={`${showPoster ? "relative" : "sticky"} top-0 h-[100svh] w-full overflow-hidden`}
      >
        {/* film canvas */}
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 h-full w-full ${showPoster ? "hidden" : ""}`}
          aria-hidden
        />

        {/* static fallback (reduced motion / missing frames) */}
        {showPoster && (
          <div className="gls-fallback-host absolute inset-0">
            <Image
              src="/glass-skin/poster.jpg"
              alt="بشرة زجاجية متوهّجة — الجلاس سكين الكوري"
              fill
              priority
              sizes="100vw"
              className="object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
                e.currentTarget.closest(".gls-fallback-host")?.classList.add("is-missing");
              }}
            />
          </div>
        )}

        {/* golden aura + drifting motes */}
        <div
          className="gls-aura pointer-events-none absolute left-1/2 top-1/2 z-10 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(closest-side, rgba(212,175,55,0.14), rgba(212,175,55,0.05) 55%, transparent 75%)",
          }}
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-0 z-10" aria-hidden>
          {MOTES.map((m, i) => (
            <span
              key={i}
              className="gls-mote absolute bottom-[8%] rounded-full bg-[#e8cd7a]"
              style={
                {
                  left: m.l,
                  width: m.s,
                  height: m.s,
                  "--mote-d": m.d,
                  "--mote-delay": m.delay,
                  "--mote-o": m.o,
                  "--mote-x": m.x,
                  boxShadow: "0 0 8px 1px rgba(232,205,122,0.55)",
                } as React.CSSProperties
              }
            />
          ))}
        </div>

        {/* legibility scrims */}
        {/* mobile: strong bottom scrim — the hero text anchors over it */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[70%] md:hidden"
          style={{
            background:
              "linear-gradient(to top, rgba(24,27,30,0.96) 0%, rgba(24,27,30,0.74) 28%, rgba(24,27,30,0.22) 64%, transparent 100%)",
          }}
          aria-hidden
        />
        {/* desktop: subtle bottom scrim (text sits on the right there) */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 hidden h-44 md:block"
          style={{ background: "linear-gradient(to top, rgba(29,32,35,0.6), transparent)" }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 md:h-28"
          style={{ background: "linear-gradient(to bottom, rgba(29,32,35,0.5), transparent)" }}
          aria-hidden
        />

        {/* ── hero overlay ── */}
        {/* mobile: anchored to the bottom over the strong scrim (content off
            the subject's face); desktop: floated on the right, centered. */}
        <div ref={heroRef} className="absolute inset-0 z-20">
          <div className="flex h-full w-full flex-col items-center justify-end px-5 pb-28 pt-24 text-center md:absolute md:right-[6%] md:w-[min(38rem,46vw)] md:items-start md:justify-center md:pb-10 md:text-right">
            <span className="gls-hero-fade inline-flex items-center gap-2 rounded-full border border-[var(--color-gls-line)] bg-[#1d2023]/55 px-3.5 py-1.5 text-[10px] font-bold tracking-[0.16em] text-[var(--color-gls-primary-dim)] backdrop-blur-md sm:text-[11px] sm:tracking-[0.18em]">
              <Icon.Sparkles className="size-3.5" />
              عيادات د. مها دحلان · بروتوكول كوري أصيل
            </span>

            <h1 className="mt-4 md:mt-5">
              {/* Gradient lives on the same .gls-line elements that hold the
                  glyphs — background-clip:text breaks if the clipped gradient
                  is on an ancestor while the text sits in a transformed child. */}
              <span
                className="block font-[family-name:var(--font-plex-arabic)] text-[clamp(3rem,15vw,6.8rem)] font-semibold leading-[0.95]"
              >
                <span className="block overflow-hidden pb-1">
                  <span className="gls-line gls-gold-text gls-gold-text-animated block">
                    البشرة
                  </span>
                </span>
                <span className="block overflow-hidden pb-2">
                  <span className="gls-line gls-gold-text gls-gold-text-animated block">
                    الزجاجية
                  </span>
                </span>
              </span>
              <span className="mt-3 block overflow-hidden md:mt-4">
                <span className="gls-line block text-[clamp(1.35rem,5.4vw,2.3rem)] font-extrabold leading-snug text-white">
                  بشرةٌ زجاجية… تتوهّج من الداخل
                </span>
              </span>
            </h1>

            <p className="gls-hero-fade mx-auto mt-4 max-w-md text-[13.5px] leading-7 text-[var(--color-gls-ink-soft)] sm:mt-5 sm:text-base sm:leading-8 md:mx-0">
              الطقس الكوري الكامل للبشرة الزجاجية — تنظيف عميق، تقشير لطيف،
              وترطيب مكثّف يمنحكِ نقاءً ولمعاناً فورياً. بدون إبر، وبدون فترة
              نقاهة.
            </p>

            <div className="gls-hero-fade mt-6 flex w-full items-center justify-center gap-2.5 sm:mt-7 sm:gap-3 md:w-auto md:justify-start">
              <a
                href="#book"
                className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full px-6 text-sm font-extrabold text-[#1d2023] shadow-[0_12px_30px_-10px_rgba(212,175,55,0.55)] transition-transform hover:scale-[1.03] active:scale-[0.98] md:flex-none md:px-7"
                style={{
                  background: "linear-gradient(120deg, #f0d98c 0%, #d4af37 55%, #b8912e 100%)",
                }}
              >
                احجزي جلستكِ الآن
                <Icon.ArrowLeft className="size-4" />
              </a>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="استشارة عبر واتساب"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[var(--color-gls-line)] bg-[#1d2023]/45 px-5 text-sm font-bold text-[var(--color-gls-primary-dim)] backdrop-blur-md transition-colors hover:border-[var(--color-gls-primary)] hover:text-[var(--color-gls-accent)] md:px-6"
              >
                <FontAwesomeIcon icon={faWhatsapp} className="text-lg" />
                <span className="hidden sm:inline">استشارة واتساب</span>
              </a>
            </div>

            <div className="gls-hero-fade mt-6 flex items-center gap-5 sm:mt-8 sm:gap-6 md:gap-8">
              <StatPill tokenPrefix="gls" num="٩٨٪" label="نسبة رضا" />
              <span className="h-7 w-px bg-[var(--color-gls-line)] sm:h-8" aria-hidden />
              <StatPill tokenPrefix="gls" num="+٢٤٠٠" label="جلسة ناجحة" />
              <span className="h-7 w-px bg-[var(--color-gls-line)] sm:h-8" aria-hidden />
              <StatPill tokenPrefix="gls" num="٦٠ د" label="مدة الجلسة" />
            </div>
          </div>
        </div>

        {/* ── film captions (off-center, start side for RTL) ── */}
        {!showPoster &&
          CAPTIONS.map((c, i) => (
            <div
              key={c.k}
              ref={(el) => {
                captionRefs.current[i] = el;
              }}
              className="pointer-events-none absolute inset-x-6 bottom-[14svh] z-20 mx-auto max-w-sm text-center opacity-0 md:inset-x-auto md:bottom-auto md:right-[7%] md:top-1/2 md:mx-0 md:max-w-xs md:-translate-y-1/2 md:text-right"
            >
              <span
                className="font-[family-name:var(--font-plex-arabic)] text-xs font-semibold tracking-wide text-[var(--color-gls-primary)]"
              >
                {c.label} · {c.k}
              </span>
              <h3 className="mt-3 text-2xl font-extrabold leading-snug text-white md:text-[1.7rem]">
                {c.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[var(--color-gls-ink-soft)]">
                {c.text}
              </p>
              <span
                className="mt-4 inline-block h-px w-16 bg-gradient-to-l from-[var(--color-gls-primary)] to-transparent"
                aria-hidden
              />
            </div>
          ))}

        {/* scroll cue */}
        {!showPoster && (
          <div
            ref={cueRef}
            className="absolute bottom-6 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
            aria-hidden
          >
            <span className="text-[10px] font-bold tracking-[0.3em] text-[var(--color-gls-muted)]">
              مرّري للأسفل
            </span>
            <span className="block h-10 w-px bg-gradient-to-b from-[var(--color-gls-primary)] to-transparent" />
            <Icon.ChevronDown className="size-4 animate-bounce text-[var(--color-gls-primary)]" />
          </div>
        )}

        {/* preloader chip */}
        <div
          className={`pointer-events-none absolute bottom-5 right-5 z-30 flex items-center gap-2 rounded-full border border-[var(--color-gls-line)] bg-[#1d2023]/70 px-3.5 py-1.5 text-[10px] font-bold tracking-widest text-[var(--color-gls-primary-dim)] backdrop-blur-md transition-opacity duration-700 ${
            phase === "loading" && !reduced ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden
        >
          <span className="size-1.5 animate-pulse rounded-full bg-[var(--color-gls-primary)]" />
          تحميل الفيلم {pct}٪
        </div>
      </div>
    </section>
  );
}
