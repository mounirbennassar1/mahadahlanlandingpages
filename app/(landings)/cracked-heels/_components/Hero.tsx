"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useRef, useState, useSyncExternalStore } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Icon, SocialIcon } from "@/components/icons";
import { GOLD_GRADIENT, WA_LINK } from "./config";

// Decorative WebGL only — three.js is ~700KB, so it loads as its own async
// chunk after hydration instead of blocking first paint.
const GoldDust = dynamic(() => import("./GoldDust").then((m) => m.GoldDust), {
  ssr: false,
});

gsap.registerPlugin(useGSAP, ScrollTrigger);

const STATS = [
  { value: "٤٫٨ من ٥", label: "تقييم Google" },
  { value: "+١٢٧٠", label: "تقييم موثّق" },
  { value: "+١٣ عاماً", label: "خبرة طبية" },
  { value: "١٠٠٪", label: "طاقم نسائي" },
] as const;

/**
 * Hero background video: plays the generated loop over the hero image and
 * hides itself if the file is missing or reduced motion is preferred.
 * The Image underneath always renders, so the hero never depends on it.
 */
function subscribeReducedMotion(cb: () => void) {
  const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
  mql.addEventListener("change", cb);
  return () => mql.removeEventListener("change", cb);
}

function HeroVideo() {
  const prefersReduced = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
  const [failed, setFailed] = useState(false);

  if (prefersReduced || failed) return null;

  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster="/cracked-heels/hero.webp"
      onError={() => setFailed(true)}
      className="absolute inset-0 size-full object-cover"
      aria-hidden
    >
      <source src="/cracked-heels/hero.mp4" type="video/mp4" />
    </video>
  );
}

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // copy: staggered rise
        const tl = gsap.timeline({
          defaults: { ease: "power3.out", duration: 0.9 },
        });
        tl.from(".crh-h", { y: 34, autoAlpha: 0, stagger: 0.12 });

        // visual: arched frame rises with a soft settle, satellites pop after
        tl.from(
          ".crh-visual",
          { y: 70, scale: 0.94, autoAlpha: 0, duration: 1.15, ease: "expo.out" },
          0.35,
        );
        tl.from(
          ".crh-sat",
          { scale: 0.6, autoAlpha: 0, ease: "back.out(1.7)", stagger: 0.12 },
          "-=0.55",
        );

        // scroll response: copy softens out, visual drifts up slowly
        gsap.to(".crh-copy", {
          y: -40,
          autoAlpha: 0.25,
          scale: 0.96,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "40% 30%",
            end: "bottom top",
            scrub: true,
          },
        });
        gsap.to(".crh-visual-wrap", {
          y: -60,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      className="relative overflow-hidden px-[22px] pt-[130px] pb-[80px] lg:min-h-svh lg:pt-[150px]"
    >
      {/* three.js warm gold dust */}
      <GoldDust className="pointer-events-none absolute inset-0 opacity-80" />

      {/* breathing candlelight halo */}
      <div
        className="pointer-events-none absolute -top-[280px] left-1/2 h-[640px] w-[1000px] -translate-x-1/2 blur-[30px]"
        style={{
          background:
            "radial-gradient(ellipse 50% 50% at 50% 0%, rgba(228,200,126,.22), transparent 70%)",
          animation: "crh-breathe 7s ease-in-out infinite",
        }}
        aria-hidden
      />
      {/* dotted grid backdrop */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(rgba(212,175,55,.14) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage:
            "radial-gradient(ellipse 75% 65% at 50% 35%, #000 25%, transparent 78%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 75% 65% at 50% 35%, #000 25%, transparent 78%)",
        }}
        aria-hidden
      />
      {/* thin decor circles */}
      <div
        className="pointer-events-none absolute top-0 left-0 aspect-square w-3/5 max-w-[820px] min-w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[7px] border-[rgba(176,141,87,0.12)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-0 bottom-0 aspect-square w-2/5 max-w-[560px] min-w-[280px] translate-x-1/2 translate-y-1/2 rounded-full border-[7px] border-[rgba(176,141,87,0.12)]"
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-[1180px] items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        {/* ——— copy (right in RTL) ——— */}
        <div className="crh-copy flex flex-col items-center text-center lg:items-start lg:text-right">
          <span className="crh-h inline-flex items-center gap-2.5 rounded-full border border-[var(--color-crh-line-strong)] bg-[rgba(42,27,18,0.7)] px-[18px] py-2 text-[0.8rem] font-bold tracking-[0.04em] text-[var(--color-crh-gold-soft)] backdrop-blur-lg">
            <span
              className="size-1.5 rounded-full bg-[var(--color-crh-gold)]"
              style={{ boxShadow: "0 0 8px 2px rgba(212,175,55,.6)" }}
            />
            عناية طبية متكاملة بتشقق القدمين والكعبين
          </span>

          <h1 className="crh-h mt-6 text-[clamp(2.2rem,5.4vw,3.7rem)] leading-[1.35] font-extrabold tracking-[-0.01em]">
            كعبان ناعمان كالحرير
            <br />
            <span className="crh-gold-text">في كل خطوة تخطينها</span>
          </h1>

          <p className="crh-h mt-5 max-w-[54ch] text-[1.06rem] font-light text-[var(--color-crh-cream-soft)]">
            الجفاف والوقوف الطويل والأحذية المفتوحة تترك كعبيكِ خشنين
            متشققين، وقد يتطور الأمر إلى تشققات عميقة مؤلمة وتصبغات داكنة.
            نعالج ذلك ببروتوكول طبي يجمع الباديكير الطبي المعقم والتقشير
            العلاجي والترطيب العميق،{" "}
            <b className="font-bold text-[var(--color-crh-cream)]">
              بنعومة تدوم ومتابعة حتى النتيجة
            </b>
            .
          </p>

          <div className="crh-h mt-8 flex flex-wrap justify-center gap-3.5 lg:justify-start">
            <a
              href="#booking"
              className="inline-flex items-center gap-2.5 rounded-full px-[32px] py-4 text-base font-extrabold text-[#1C120C] shadow-[0_18px_44px_-14px_rgba(212,175,55,0.5)] transition-all duration-300 hover:-translate-y-[3px] hover:shadow-[0_24px_54px_-14px_rgba(228,200,126,0.6)]"
              style={{ background: GOLD_GRADIENT }}
            >
              احجزي جلسة التقييم
              <Icon.ArrowLeft className="size-[17px]" strokeWidth={2.4} />
            </a>
            <div className="relative inline-flex overflow-hidden rounded-full p-[1.5px]">
              <div
                className="absolute -inset-[120%]"
                style={{
                  background:
                    "conic-gradient(from 0deg, transparent 0 55%, #D4AF37 72%, #8C6A3F 84%, transparent 96%)",
                  animation: "crh-spin 3.2s linear infinite",
                }}
                aria-hidden
              />
              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="relative inline-flex items-center gap-2.5 rounded-full bg-[#2A1B12] px-7 py-[15px] text-base font-extrabold text-[var(--color-crh-cream)] transition-colors duration-300 hover:bg-[#38251A]"
              >
                <SocialIcon name="whatsapp" className="text-[19px] text-[#25D366]" />
                استشارة واتساب
              </a>
            </div>
          </div>

          {/* proof stats */}
          <div className="crh-h mt-9 grid w-full max-w-[520px] grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[var(--color-crh-line)] bg-[var(--color-crh-line)] sm:grid-cols-4">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center gap-0.5 bg-[rgba(42,27,18,0.85)] px-2 py-3.5 backdrop-blur-sm"
              >
                <b className="text-[1.05rem] font-extrabold text-[var(--color-crh-gold-soft)]">
                  {s.value}
                </b>
                <span className="text-[0.72rem] font-bold text-[var(--color-crh-faint)]">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ——— visual (left in RTL) ——— */}
        <div className="crh-visual-wrap relative mx-auto w-full max-w-[440px]">
          <div className="crh-visual relative">
            {/* rotated outline echo */}
            <div
              className="pointer-events-none absolute -inset-4 -rotate-2 rounded-t-full rounded-b-[34px] border border-[rgba(212,175,55,0.28)]"
              aria-hidden
            />
            <div className="relative aspect-[3/4] overflow-hidden rounded-t-full rounded-b-[30px] border border-[var(--color-crh-line-strong)] shadow-[0_50px_100px_-40px_rgba(0,0,0,0.9)]">
              <Image
                src="/cracked-heels/hero.webp"
                alt="عناية فاخرة بالقدمين بزيوت دافئة وأجواء ذهبية"
                fill
                sizes="(max-width: 1024px) 88vw, 440px"
                priority
                className="object-cover"
              />
              <HeroVideo />
              {/* bottom espresso veil so the frame melts into the page */}
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5"
                style={{
                  background:
                    "linear-gradient(to top, rgba(28,18,12,.72), transparent)",
                }}
                aria-hidden
              />
            </div>
          </div>

          {/* floating satellites */}
          <div
            className="crh-sat absolute -bottom-8 -right-6 hidden w-[150px] overflow-hidden rounded-[22px] border border-[var(--color-crh-line-strong)] shadow-[0_30px_60px_-24px_rgba(0,0,0,0.85)] sm:block"
            style={{ animation: "crh-floaty 8s ease-in-out infinite alternate" }}
          >
            <div className="relative aspect-square">
              <Image
                src="/cracked-heels/spa-still.webp"
                alt="زيوت دافئة ومناشف عناية في أجواء العيادة"
                fill
                sizes="150px"
                className="object-cover"
              />
            </div>
          </div>
          <span
            className="crh-sat absolute -top-3 right-2 inline-flex items-center gap-2 rounded-full border border-[var(--color-crh-line-strong)] bg-[rgba(42,27,18,0.9)] px-4 py-2 text-[0.76rem] font-extrabold whitespace-nowrap text-[var(--color-crh-gold-soft)] shadow-[0_14px_30px_-14px_rgba(0,0,0,0.8)] backdrop-blur-lg"
            style={{ animation: "crh-floaty 7s ease-in-out infinite alternate" }}
          >
            <Icon.ShieldCheck className="size-3.5" />
            أدوات معقمة وبروتوكول طبي
          </span>
          <span
            className="crh-sat absolute bottom-24 -left-3 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[0.76rem] font-extrabold whitespace-nowrap text-[#1C120C] shadow-[0_14px_30px_-12px_rgba(212,175,55,0.55)]"
            style={{
              background: GOLD_GRADIENT,
              animation: "crh-floaty 6s ease-in-out 1.2s infinite alternate",
            }}
          >
            <Icon.Sparkles className="size-3.5" />
            نعومة تلمسينها من أول جلسة
          </span>
          <span
            className="crh-sat absolute top-1/3 -right-4 inline-flex items-center gap-2 rounded-full border border-[var(--color-crh-line-strong)] bg-[rgba(42,27,18,0.9)] px-4 py-2 text-[0.76rem] font-extrabold whitespace-nowrap text-[var(--color-crh-gold-soft)] shadow-[0_14px_30px_-14px_rgba(0,0,0,0.8)] backdrop-blur-lg"
            style={{
              animation: "crh-floaty 8s ease-in-out .6s infinite alternate-reverse",
            }}
          >
            <Icon.Star className="size-3.5" />
            ٤٫٨ على Google
          </span>
        </div>
      </div>
    </section>
  );
}
