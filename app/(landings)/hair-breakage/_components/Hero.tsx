"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Icon, SocialIcon } from "@/components/icons";
import { GOLD_GRADIENT, WA_LINK } from "./config";

// Decorative WebGL only — three.js is ~700KB, so it loads as its own async
// chunk after hydration instead of blocking first paint.
const GoldStrands = dynamic(
  () => import("./GoldStrands").then((m) => m.GoldStrands),
  { ssr: false },
);

gsap.registerPlugin(useGSAP, ScrollTrigger);

const STATS = [
  { value: "٤٫٨ من ٥", label: "تقييم Google" },
  { value: "+١٢٧٠", label: "تقييم موثّق" },
  { value: "+١٣ عاماً", label: "خبرة تجميلية" },
  { value: "١٠٠٪", label: "طاقم نسائي" },
] as const;

/** Split sales hero: copy right, portrait left, gold strands behind. */
export function Hero({ videoSrc }: { videoSrc?: string }) {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // entrance: copy rises line by line, frame assembles, badges pop
        const tl = gsap.timeline({
          defaults: { ease: "power3.out", duration: 0.9 },
        });
        tl.from(".hab-h", { y: 34, autoAlpha: 0, stagger: 0.12 });
        tl.from(
          ".hab-frame",
          { y: 70, scale: 0.92, autoAlpha: 0, duration: 1.1, ease: "expo.out" },
          0.3,
        );
        tl.from(
          ".hab-float-badge",
          { scale: 0.5, autoAlpha: 0, ease: "back.out(1.8)", stagger: 0.12 },
          "-=0.55",
        );

        // scroll response: copy softens out, portrait drifts slower (parallax)
        gsap.to(".hab-copy", {
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
        gsap.to(".hab-visual", {
          y: -70,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      className="relative overflow-hidden px-[22px] pt-[130px] pb-[80px] lg:min-h-svh lg:pt-[150px]"
    >
      {/* three.js: flowing golden strands + dust */}
      <GoldStrands className="pointer-events-none absolute inset-0 opacity-70" />

      {/* breathing gold halo */}
      <div
        className="pointer-events-none absolute -top-[280px] left-1/2 h-[640px] w-[1000px] -translate-x-1/2 blur-[30px]"
        style={{
          background:
            "radial-gradient(ellipse 50% 50% at 50% 0%, rgba(212,175,55,.2), transparent 70%)",
          animation: "hab-breathe 7s ease-in-out infinite",
        }}
        aria-hidden
      />
      {/* dotted grid backdrop, masked to the center */}
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

      <div className="relative mx-auto grid max-w-[1180px] items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
        {/* ——— copy (right in RTL) ——— */}
        <div className="hab-copy flex flex-col items-center text-center lg:items-start lg:text-right">
          <span className="hab-h inline-flex items-center gap-2.5 rounded-full border border-[var(--color-hab-line-strong)] bg-[rgba(20,20,26,0.7)] px-[18px] py-2 text-[0.8rem] font-bold tracking-[0.04em] text-[var(--color-hab-champagne)] backdrop-blur-lg">
            <span
              className="size-1.5 rounded-full bg-[var(--color-hab-gold)]"
              style={{ boxShadow: "0 0 8px 2px rgba(212,175,55,.7)" }}
            />
            علاج تكسر وتقصف الشعر، بتشخيص طبي دقيق
          </span>

          <h1 className="hab-h mt-6 text-[clamp(2.2rem,5.4vw,3.7rem)] leading-[1.35] font-extrabold tracking-[-0.01em]">
            أوقفي تكسر شعرك…
            <br />
            <span className="hab-gold-text">واستعيدي حريره ولمعانه</span>
          </h1>

          <p className="hab-h mt-5 max-w-[54ch] text-[1.06rem] font-light text-[rgba(245,239,224,0.68)]">
            الحرارة اليومية والصبغات ونقص البروتين تُضعف الشعرة من الداخل،
            فتتكسر في منتصفها وتفقد بريقها. نحدد سبب التكسر بتشخيصٍ رقمي
            للشعرة والفروة، ثم نبني لكِ بروتوكول ترميمٍ يجمع البروتين العلاجي
            والميزوثيرابي والعناية المنزلية،{" "}
            <b className="font-bold text-[var(--color-hab-ink)]">
              حتى يعود شعرك قوياً يلمع تحت الضوء
            </b>
            .
          </p>

          <div className="hab-h mt-8 flex flex-wrap justify-center gap-3.5 lg:justify-start">
            <a
              href="#booking"
              className="inline-flex items-center gap-2.5 rounded-full px-[32px] py-4 text-base font-extrabold text-[#1A1405] shadow-[0_18px_44px_-14px_rgba(212,175,55,0.5)] transition-all duration-300 hover:-translate-y-[3px] hover:shadow-[0_24px_54px_-14px_rgba(240,212,138,0.55)]"
              style={{ background: GOLD_GRADIENT }}
            >
              احجزي تقييم شعرك
              <Icon.ArrowLeft className="size-[17px]" strokeWidth={2.4} />
            </a>
            <div className="relative inline-flex overflow-hidden rounded-full p-[1.5px]">
              <div
                className="absolute -inset-[120%]"
                style={{
                  background:
                    "conic-gradient(from 0deg, transparent 0 55%, #F0D48A 72%, #8A6430 84%, transparent 96%)",
                  animation: "hab-spin 3.2s linear infinite",
                }}
                aria-hidden
              />
              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="relative inline-flex items-center gap-2.5 rounded-full bg-[#14141A] px-7 py-[15px] text-base font-extrabold text-[var(--color-hab-ink)] transition-colors duration-300 hover:bg-[#1B1B22]"
              >
                <SocialIcon
                  name="whatsapp"
                  className="text-[19px] text-[#25D366]"
                />
                استشارة واتساب
              </a>
            </div>
          </div>

          {/* proof stats */}
          <div className="hab-h mt-9 grid w-full max-w-[520px] grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[var(--color-hab-line)] bg-[var(--color-hab-line)] sm:grid-cols-4">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center gap-0.5 bg-[rgba(16,16,20,0.85)] px-2 py-3.5 backdrop-blur-sm"
              >
                <b className="text-[1.05rem] font-extrabold text-[var(--color-hab-champagne)]">
                  {s.value}
                </b>
                <span className="text-[0.72rem] font-bold text-[rgba(245,239,224,0.5)]">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ——— visual (left in RTL) ——— */}
        <div className="hab-visual relative mx-auto w-full max-w-[440px]">
          <div
            className="pointer-events-none absolute -inset-4 rotate-2 rounded-[34px] border border-[rgba(212,175,55,0.25)]"
            aria-hidden
          />
          <div className="hab-frame relative aspect-[3/4] overflow-hidden rounded-[30px] border border-[var(--color-hab-line-strong)] bg-[var(--color-hab-card)] shadow-[0_46px_90px_-34px_rgba(212,175,55,0.35)]">
            <Image
              src="/hair-breakage/hero.webp"
              alt="شعر طويل صحي لامع بإضاءة ذهبية على خلفية سوداء"
              fill
              sizes="(max-width: 1024px) 88vw, 440px"
              priority
              className="object-cover"
            />
            {videoSrc && (
              <video
                className="absolute inset-0 size-full object-cover motion-reduce:hidden"
                src={videoSrc}
                poster="/hair-breakage/hero.webp"
                autoPlay
                muted
                loop
                playsInline
                aria-hidden
              />
            )}
            {/* bottom vignette to seat the badges */}
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5"
              style={{
                background:
                  "linear-gradient(0deg, rgba(6,6,7,.75), transparent)",
              }}
              aria-hidden
            />
          </div>

          {/* floating glass badges */}
          <span
            className="hab-float-badge absolute -top-3 right-3 inline-flex items-center gap-2 rounded-full border border-[var(--color-hab-line-strong)] bg-[rgba(16,16,20,0.85)] px-4 py-2 text-[0.76rem] font-extrabold whitespace-nowrap text-[var(--color-hab-champagne)] shadow-[0_14px_30px_-14px_rgba(212,175,55,0.5)] backdrop-blur-lg"
            style={{ animation: "hab-floaty 7s ease-in-out infinite alternate" }}
          >
            <Icon.Microscope className="size-3.5" />
            تشخيص رقمي للشعرة والفروة
          </span>
          <span
            className="hab-float-badge absolute bottom-8 -left-2 inline-flex items-center gap-2 rounded-full border border-[var(--color-hab-line-strong)] bg-[rgba(16,16,20,0.85)] px-4 py-2 text-[0.76rem] font-extrabold whitespace-nowrap text-[var(--color-hab-champagne)] shadow-[0_14px_30px_-14px_rgba(212,175,55,0.5)] backdrop-blur-lg"
            style={{
              animation:
                "hab-floaty 8s ease-in-out .6s infinite alternate-reverse",
            }}
          >
            <Icon.Sparkles className="size-3.5" />
            لمعان يُرى من أول جلسة
          </span>
          <span
            className="hab-float-badge absolute top-1/2 -right-3 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[0.76rem] font-extrabold whitespace-nowrap text-[#1A1405] shadow-[0_14px_30px_-12px_rgba(212,175,55,0.55)]"
            style={{
              background: GOLD_GRADIENT,
              animation: "hab-floaty 6s ease-in-out 1.2s infinite alternate",
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
