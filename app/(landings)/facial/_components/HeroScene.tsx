"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAPContext } from "./useGSAPContext";
import { EASE, DURATION } from "./motion.tokens";
import { MagneticButton } from "./MagneticButton";
import { PayButton } from "@/components/checkout";
import type { ContentOf } from "@/lib/pages/define";
import type { FACIAL } from "../content";

type HeroCopy = ContentOf<typeof FACIAL>["hero"];

export function HeroScene({ copy }: { copy: HeroCopy }) {
  const container = useRef<HTMLDivElement>(null);

  const bgGlow = useRef<HTMLDivElement>(null);
  const heroImageContainer = useRef<HTMLDivElement>(null);
  const heroImage = useRef<HTMLImageElement>(null);
  const badge = useRef<HTMLDivElement>(null);
  const titleLine1 = useRef<HTMLDivElement>(null);
  const titleLine2 = useRef<HTMLDivElement>(null);
  const titleLine3 = useRef<HTMLDivElement>(null);
  const description = useRef<HTMLParagraphElement>(null);
  const ctaGroup = useRef<HTMLDivElement>(null);

  useGSAPContext(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      gsap.set(
        [
          badge.current,
          titleLine1.current,
          titleLine2.current,
          titleLine3.current,
          description.current,
          ctaGroup.current,
          heroImageContainer.current,
        ],
        { opacity: 1, y: 0, x: 0 },
      );
      gsap.set(heroImageContainer.current, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      });
      return;
    }

    gsap.set(heroImageContainer.current, {
      clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
    });
    gsap.set(heroImage.current, { scale: 1.2 });

    gsap.set(
      [badge.current, titleLine1.current, titleLine2.current, titleLine3.current, description.current],
      { y: 100, opacity: 0, rotate: 2 },
    );

    gsap.set(ctaGroup.current, { opacity: 0, filter: "blur(10px)" });
    gsap.set(bgGlow.current, { opacity: 0, scale: 0.8 });

    const tl = gsap.timeline({ defaults: { ease: EASE.lux } });

    tl.to(
      heroImageContainer.current,
      { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 0%)", duration: 1.5 },
      0.1,
    )
      .to(heroImage.current, { scale: 1, duration: 2.5, ease: "power2.out" }, 0.1)
      .to(bgGlow.current, { opacity: 0.8, scale: 1, duration: 2 }, 0.4)
      .to(
        [badge.current, titleLine1.current, titleLine2.current, titleLine3.current],
        { y: 0, opacity: 1, rotate: 0, duration: 1.2, stagger: 0.15, ease: "power3.out" },
        0.5,
      )
      .to(
        description.current,
        { y: 0, opacity: 1, rotate: 0, duration: 1.2, ease: "power3.out" },
        0.8,
      )
      .to(ctaGroup.current, { opacity: 1, filter: "blur(0px)", duration: DURATION.base }, 1.2);
  }, []);

  return (
    <section
      ref={container}
      className="relative h-[100svh] min-h-[700px] w-full bg-[#050505] overflow-hidden flex items-center"
    >
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-black via-black/90 to-transparent pointer-events-none" />
      <div
        ref={bgGlow}
        className="absolute right-[-20%] bottom-[-20%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-t from-[#D4AF37] to-[#B8860B] blur-[150px] mix-blend-screen opacity-10 pointer-events-none"
      />

      <div
        ref={heroImageContainer}
        className="absolute top-0 left-0 w-full md:w-[65vw] lg:w-[55vw] h-full z-0 overflow-hidden isolate"
      >
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div className="absolute inset-0 bg-gradient-to-l from-[#050505] via-transparent to-transparent z-10" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={heroImage}
          src="https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&q=80&w=2000"
          alt="Luxury Clinic Aesthetic"
          className="object-cover object-[70%_50%] w-full h-full"
        />
      </div>

      <div className="container relative z-20 mx-auto px-6 lg:px-12 flex h-full items-center pl-0">
        <div className="w-full md:w-[80vw] lg:w-[65vw] pt-20">
          <div className="overflow-hidden mb-6 mt-12 md:mt-0">
            <div ref={badge}>
              <span className="inline-flex items-center gap-2 py-2 px-6 rounded-full border border-[#D4AF37]/40 bg-black/60 backdrop-blur-md text-[#D4AF37] text-sm tracking-wide font-medium shadow-[0_0_20px_rgba(228,187,81,0.1)]">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
                {copy.badge}
              </span>
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.25] tracking-tight mb-8">
            <div className="overflow-hidden py-2">
              <div ref={titleLine1} className="text-white drop-shadow-xl">{copy.line1}</div>
            </div>
            <div className="overflow-hidden py-2">
              <div
                ref={titleLine2}
                className="text-transparent bg-clip-text bg-gradient-to-r from-[#f4db93] via-[#D4AF37] to-[#B8860B] drop-shadow-2xl"
              >
                {copy.line2}
              </div>
            </div>
            <div className="overflow-hidden py-2">
              <div ref={titleLine3} className="text-white drop-shadow-xl">{copy.line3}</div>
            </div>
          </h1>

          <div className="overflow-hidden mb-12">
            <p
              ref={description}
              className="max-w-xl text-lg md:text-2xl text-zinc-300 leading-relaxed font-light drop-shadow-md bg-black/40 backdrop-blur-sm p-4 rounded-2xl md:bg-transparent md:backdrop-blur-none md:p-0"
            >
              {copy.body1}{" "}
              <strong className="text-[#D4AF37] font-medium">MD Clinics</strong> {copy.body2}{" "}
              <strong className="text-[#D4AF37] font-medium">{copy.bodyStrong}</strong> {copy.body3}
            </p>
          </div>

          <div
            ref={ctaGroup}
            className="flex flex-col sm:flex-row items-center justify-start gap-4 md:gap-6"
          >
            <MagneticButton className="w-full sm:w-auto">
              <PayButton className="group relative w-full sm:w-auto px-8 md:px-12 py-5 bg-[#D4AF37] text-black font-bold text-lg overflow-hidden transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2.5 text-center rounded-2xl cursor-pointer">
                <svg className="relative z-10 w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
                <span className="relative z-10">{copy.book}</span>
                <div className="absolute inset-0 h-full w-full bg-white/30 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0 rounded-2xl"></div>
              </PayButton>
            </MagneticButton>
            <MagneticButton className="w-full sm:w-auto">
              <a
                href="https://wa.me/966503377702?text=السلام%20عليكم%20ورحمة%20الله%20وبركاته%0Aعندي%20استفسار%20بخصوص%20أنواع%20تنظيف%20البشرة%20عندكم"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 md:px-12 py-5 border border-white/20 hover:border-[#25D366]/60 bg-black/40 hover:bg-black/60 text-white font-medium backdrop-blur-md transition-all duration-300 text-lg flex items-center justify-center gap-2.5 text-center rounded-2xl"
              >
                <svg className="w-5 h-5 fill-[#25D366]" viewBox="0 0 448 512" aria-hidden>
                  <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.8-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                </svg>
                {copy.services}
              </a>
            </MagneticButton>
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 right-12 hidden lg:flex flex-col items-center gap-4 z-30 opacity-70">
        <span className="text-xs text-zinc-400 uppercase tracking-[0.3em] rotate-90 origin-right translate-y-8 font-sans">
          Scroll
        </span>
        <div className="w-[1px] h-24 bg-gradient-to-b from-[#D4AF37] to-transparent" />
      </div>

      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay z-40 pointer-events-none" />
    </section>
  );
}
