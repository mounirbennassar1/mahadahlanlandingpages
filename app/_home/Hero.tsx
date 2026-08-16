"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Icon, SocialIcon } from "@/components/icons";
import { GOLD_GRADIENT, WA_LINK } from "./config";

// Decorative WebGL only — three.js is ~700KB, so it loads as its own async
// chunk after hydration instead of blocking first paint.
const SilkCloth = dynamic(() => import("./SilkCloth").then((m) => m.SilkCloth), {
  ssr: false,
});
const GoldDust = dynamic(() => import("./GoldDust").then((m) => m.GoldDust), {
  ssr: false,
});

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Cinematic hero: live gold-silk cloth (three.js) + drifting gold dust behind
 * a Higgsfield-generated silk-veil portrait. GSAP runs the masked-line
 * entrance and the scroll-scrubbed parallax exit; Framer Motion handles the
 * floating portrait and button micro-interactions.
 */
export function Hero() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // entrance
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.fromTo(
        ".md-hero-line",
        { yPercent: 118 },
        { yPercent: 0, duration: 1.25, stagger: 0.14 },
        0.25,
      )
        .fromTo(
          ".md-hero-fade",
          { y: 26, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.1 },
          0.6,
        )
        .fromTo(
          ".md-hero-portrait",
          { autoAlpha: 0, scale: 1.07 },
          { autoAlpha: 1, scale: 1, duration: 1.6, ease: "power3.out" },
          0.15,
        );

      // scroll exit: copy lifts and dims, portrait drifts slower (parallax)
      gsap.to(".md-hero-copy", {
        y: -90,
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: {
          trigger: scope.current,
          start: "top top",
          end: "bottom 25%",
          scrub: 0.4,
        },
      });
      gsap.to(".md-hero-portrait", {
        y: -150,
        ease: "none",
        scrollTrigger: {
          trigger: scope.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.4,
        },
      });
      gsap.to(".md-hero-cue", {
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: {
          trigger: scope.current,
          start: "top top",
          end: "18% top",
          scrub: true,
        },
      });

      // Wall-clock safety net: if rAF is throttled (occluded window, battery
      // saver), snap the entrance to its finished state so the hero never
      // sits half-invisible.
      const failsafe = window.setTimeout(() => {
        if (tl.progress() < 1) tl.progress(1);
      }, 4500);
      return () => window.clearTimeout(failsafe);
    },
    { scope },
  );

  return (
    <section ref={scope} id="top" className="relative overflow-hidden">
      {/* live silk cloth + gold dust */}
      <SilkCloth className="absolute inset-0 z-0 opacity-80" />
      <GoldDust className="absolute inset-0 z-[1] opacity-70" />

      {/* legibility scrims: darken the copy side, melt into the page below */}
      <div
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          background:
            "linear-gradient(to left, rgba(11,8,5,.78), rgba(11,8,5,.3) 48%, rgba(11,8,5,.05) 72%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-44"
        style={{
          background: "linear-gradient(to top, #0B0805, transparent)",
        }}
        aria-hidden
      />

      {/* ——— portrait (left on lg), floating on silk ——— */}
      <div className="md-hero-portrait pointer-events-none absolute inset-y-0 left-0 z-[3] hidden w-[46%] lg:block">
        <motion.div
          className="absolute inset-x-0 bottom-0 top-[6%]"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src="/home/hero-portrait-cutout.webp"
            alt="امرأة ملفوفة بحرير ذهبي يتطاير حولها"
            fill
            priority
            sizes="46vw"
            className="object-contain object-[left_bottom]"
            style={{ filter: "drop-shadow(0 40px 70px rgba(0,0,0,0.65))" }}
          />
        </motion.div>
      </div>

      {/* ——— copy (right in RTL) ——— */}
      <div className="relative z-10 mx-auto flex min-h-svh max-w-[1224px] flex-col justify-center px-[22px] pt-[128px] pb-24 lg:pt-[110px]">
        <div className="md-hero-copy flex w-full flex-col items-center text-center lg:w-[57%] lg:items-start lg:text-right">
          {/* eyebrow */}
          <div className="md-hero-fade flex items-center gap-3.5">
            <span
              className="h-px w-10 shrink-0"
              style={{ background: GOLD_GRADIENT }}
              aria-hidden
            />
            <span className="md-neon-text text-[0.78rem] font-bold tracking-[0.22em]">
              تجربة تجميلية فاخرة في جدة
            </span>
          </div>

          {/* masked-line headline */}
          <h1 className="mt-7 text-[clamp(2.6rem,6.4vw,4.5rem)] leading-[1.32] font-extrabold tracking-[-0.015em] text-[var(--color-md-text)]">
            <span className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
              <span className="md-hero-line block">حيثُ يُصاغ الجمال</span>
            </span>
            {/* glow sits on the mask: a filter INSIDE the clip would get its
                halo sheared into a visible rectangle */}
            <span className="md-gold-glow block overflow-hidden pb-[0.18em] -mb-[0.18em]">
              <span className="md-hero-line block">
                <span className="md-gold-text">بلمسةٍ من ذهب</span>
              </span>
            </span>
          </h1>

          <p className="md-hero-fade mt-6 max-w-[52ch] text-[1.08rem] leading-[2] font-light text-[rgba(246,238,223,0.65)]">
            أربعة عشر برنامجاً علاجياً بإشراف د. مها دحلان، استشارية الجلدية
            والتجميل والليزر، في أجواءٍ تحفظ خصوصيتك بطاقمٍ نسائي بالكامل.
          </p>

          {/* portrait in-flow on mobile: image first, then the buttons */}
          <div className="md-hero-fade relative mx-auto mt-8 aspect-[3/4] w-full max-w-[340px] lg:hidden">
            <Image
              src="/home/hero-portrait-cutout.webp"
              alt="امرأة ملفوفة بحرير ذهبي يتطاير حولها"
              fill
              sizes="(max-width: 1024px) 88vw, 0px"
              className="object-contain"
              style={{ filter: "drop-shadow(0 30px 50px rgba(0,0,0,0.6))" }}
            />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-16"
              style={{
                background: "linear-gradient(to top, #0B0805, transparent)",
              }}
              aria-hidden
            />
          </div>

          {/* CTAs */}
          <div className="md-hero-fade mt-9 flex w-full flex-col gap-3.5 sm:w-auto sm:flex-row">
            <motion.a
              href="#contact"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center gap-2.5 rounded-full px-[36px] py-[17px] text-base font-extrabold text-[var(--color-md-ink)] shadow-[0_0_44px_-8px_rgba(232,195,106,0.65)]"
              style={{ background: GOLD_GRADIENT }}
            >
              احجزي استشارتك
              <Icon.ArrowLeft className="size-[17px]" strokeWidth={2.4} />
            </motion.a>
            <motion.a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center gap-2.5 rounded-full border border-[var(--color-md-line-strong)] bg-[rgba(11,8,5,0.5)] px-8 py-[17px] text-base font-extrabold text-[var(--color-md-text)] backdrop-blur-sm transition-colors duration-300 hover:border-[var(--color-md-champagne)]"
            >
              <SocialIcon name="whatsapp" className="text-[19px] text-[#25D366]" />
              استشارة واتساب
            </motion.a>
          </div>

        </div>
      </div>

      {/* scroll cue */}
      <div className="md-hero-cue absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2.5 lg:flex">
        <span className="text-[0.72rem] font-bold tracking-[0.2em] text-[rgba(246,238,223,0.45)]">
          مرّري للاكتشاف
        </span>
        <span className="block h-10 w-px overflow-hidden" aria-hidden>
          <span className="md-cue-line block h-full w-full bg-gradient-to-b from-transparent via-[var(--color-md-champagne)] to-transparent" />
        </span>
      </div>
    </section>
  );
}
