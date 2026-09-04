"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Icon, SocialIcon } from "@/components/icons";
import { GOLD_GRADIENT, PHONE_DISPLAY, TEL_LINK, WA_LINK } from "./config";
import { HeroBackdrop } from "./HeroBackdrop";
import type { ContentOf } from "@/lib/pages/define";
import type { CHRONIC_ECZEMA } from "../content";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type HeroCopy = ContentOf<typeof CHRONIC_ECZEMA>["hero"];

/**
 * Modern centered hero over the aurora-graded clinic video: badge, two-line
 * display title (gold highlight line), one clean subtitle, a pair of pill
 * CTAs with a phone line, and a frosted stats strip on the bottom edge.
 * No letter-spacing anywhere — tracking breaks connected Arabic script.
 */
export function Hero({ copy }: { copy: HeroCopy }) {
  const STATS = copy.stats;
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (reduced) return;

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".che-kicker", { autoAlpha: 0, y: -16, duration: 0.7 }, 0.15)
        .from(
          ".che-title-line",
          { autoAlpha: 0, y: 42, duration: 1, stagger: 0.16, ease: "power4.out" },
          0.3,
        )
        .from(".che-h", { autoAlpha: 0, y: 26, duration: 0.8, stagger: 0.1 }, 0.85)
        .from(".che-stats-strip", { autoAlpha: 0, y: 34, duration: 0.8 }, 1.05);

      // scroll: copy drifts up as the page takes over
      gsap.to(".che-hero-copy", {
        y: -60,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} className="relative min-h-svh overflow-hidden">
      {/* video + overlay effects + gold dust */}
      <HeroBackdrop className="absolute inset-0" />

      {/* centered copy */}
      <div className="relative z-[2] mx-auto flex min-h-svh max-w-[880px] flex-col items-center justify-center px-[22px] pt-[104px] pb-[176px] text-center sm:pb-[156px]">
        <div className="che-hero-copy flex flex-col items-center">
          {/* badge */}
          <div className="che-kicker inline-flex items-center gap-2.5 rounded-full border border-[rgba(244,238,250,0.2)] bg-[rgba(20,12,34,0.5)] px-5 py-2.5 backdrop-blur-md">
            <span
              className="size-2 rounded-full bg-[var(--color-che-gold-bright)]"
              style={{ boxShadow: "0 0 12px rgba(229,199,127,0.9)" }}
              aria-hidden
            />
            <span className="text-[0.82rem] font-bold text-[rgba(244,238,250,0.92)]">
              {copy.badge}
            </span>
          </div>

          {/* display title */}
          <h1 className="mt-8 mb-0" style={{ textShadow: "0 2px 34px rgba(10,4,20,0.6)" }}>
            <span className="che-title-line che-display-hero block text-[var(--color-che-ink)]">
              {copy.line1}
            </span>
            <span className="che-title-line che-display-hero block">
              <em className="che-gold-text not-italic">{copy.line2}</em>
            </span>
          </h1>

          {/* subtitle — one clean sentence */}
          <p
            className="che-h mt-6 max-w-[46ch] text-[1.08rem] leading-[2.1] font-normal text-[rgba(244,238,250,0.85)] sm:text-[1.18rem]"
            style={{ textShadow: "0 1px 18px rgba(10,4,20,0.6)" }}
          >
            {copy.sub}
          </p>

          {/* CTAs */}
          <div className="che-h mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#booking"
              className="group inline-flex items-center gap-3 rounded-full px-9 py-[18px] text-[1.05rem] font-extrabold text-[#231303] shadow-[0_20px_50px_-14px_rgba(201,164,92,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_28px_60px_-14px_rgba(229,199,127,0.65)]"
              style={{ background: GOLD_GRADIENT }}
            >
              {copy.book}
              <Icon.ArrowLeft
                className="size-[18px] transition-transform duration-300 group-hover:-translate-x-1"
                strokeWidth={2.4}
              />
            </a>
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-full border border-[rgba(244,238,250,0.32)] bg-[rgba(20,12,34,0.5)] px-8 py-[17px] text-base font-extrabold text-[var(--color-che-ink)] backdrop-blur-md transition-colors duration-300 hover:border-[#25D366] hover:text-[#25D366]"
            >
              <SocialIcon name="whatsapp" className="text-[19px] text-[#25D366]" />
              {copy.whatsapp}
            </a>
          </div>

          {/* phone line */}
          <a
            href={TEL_LINK}
            className="che-h mt-7 inline-flex items-center gap-2.5 text-[0.94rem] font-bold text-[rgba(244,238,250,0.7)] transition-colors duration-300 hover:text-[var(--color-che-gold-bright)]"
          >
            <Icon.Phone
              className="size-4 text-[var(--color-che-gold-bright)]"
              strokeWidth={2.2}
            />
            {copy.phoneLead}
            <span dir="ltr" className="font-extrabold text-[var(--color-che-ink)]">
              {PHONE_DISPLAY}
            </span>
          </a>
        </div>
      </div>

      {/* stats strip along the hero's bottom edge */}
      <div className="che-stats-strip absolute inset-x-0 bottom-0 z-[2] border-t border-[rgba(244,238,250,0.14)] bg-[rgba(14,7,25,0.55)] backdrop-blur-xl">
        <div className="mx-auto grid max-w-[1240px] grid-cols-2 divide-x divide-[rgba(244,238,250,0.1)] px-[22px] sm:grid-cols-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center gap-1 py-5 text-center sm:py-6"
            >
              <b className="text-[1.2rem] font-extrabold text-[var(--color-che-gold-bright)] sm:text-[1.35rem]">
                {s.value}
              </b>
              <span className="text-[0.74rem] font-bold text-[rgba(244,238,250,0.62)]">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
