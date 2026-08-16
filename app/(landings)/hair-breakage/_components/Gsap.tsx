"use client";

import {
  useCallback,
  useRef,
  type PointerEvent,
  type ReactNode,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Fixed top scroll-progress bar (origin right for RTL), scrubbed by GSAP. */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.to(ref.current, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
    });
  });

  return (
    <div
      ref={ref}
      className="fixed inset-x-0 top-0 z-[120] h-[3px] origin-right scale-x-0"
      style={{
        background: "linear-gradient(90deg, #8A6430, #F0D48A 50%, #C9A45C)",
      }}
      aria-hidden
    />
  );
}

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Extra delay in ms. */
  delay?: number;
};

/** Scroll-triggered fade-up (once), GSAP-driven. */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ref.current,
          { y: 28, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.85,
            ease: "power3.out",
            delay: delay / 1000,
            scrollTrigger: {
              trigger: ref.current,
              start: "top 88%",
              once: true,
            },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

type ParallaxProps = {
  children: ReactNode;
  className?: string;
  /** Vertical travel in px while the element crosses the viewport. */
  from?: number;
  to?: number;
};

/** Soft scroll parallax: translates children as they cross the viewport. */
export function Parallax({
  children,
  className,
  from = 36,
  to = -36,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ref.current,
          { y: from },
          {
            y: to,
            ease: "none",
            scrollTrigger: {
              trigger: ref.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

type SpotlightCardProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

/** Dark card with a gold radial glow following the pointer + GSAP reveal. */
export function SpotlightCard({
  children,
  className,
  delay = 0,
}: SpotlightCardProps) {
  const onPointerMove = useCallback((e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  }, []);

  return (
    <Reveal delay={delay}>
      <div
        onPointerMove={onPointerMove}
        className={`relative overflow-hidden border border-[var(--color-hab-line)] bg-[var(--color-hab-card)] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-[5px] hover:border-[rgba(212,175,55,0.4)] hover:shadow-[0_26px_54px_-24px_rgba(212,175,55,0.35)] ${className ?? ""}`}
      >
        <div
          className="hab-spot-glow pointer-events-none absolute inset-0"
          aria-hidden
        />
        <div className="relative">{children}</div>
      </div>
    </Reveal>
  );
}

const ARABIC_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

function toArabicDigits(n: number): string {
  return String(n)
    .split("")
    .map((c) => (c >= "0" && c <= "9" ? ARABIC_DIGITS[Number(c)] : c))
    .join("");
}

type CounterProps = {
  /** Final value, counted from 0 when scrolled into view. */
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
};

/** Count-up number (Arabic-Indic digits) triggered on scroll. */
export function Counter({ value, prefix, suffix, className }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const obj = { v: 0 };
        gsap.to(obj, {
          v: value,
          duration: 1.8,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
          onUpdate: () => {
            el.textContent = `${prefix ?? ""}${toArabicDigits(Math.round(obj.v))}${suffix ?? ""}`;
          },
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <span ref={ref} className={className}>
      {`${prefix ?? ""}${toArabicDigits(value)}${suffix ?? ""}`}
    </span>
  );
}
