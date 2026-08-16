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
        background: "linear-gradient(90deg, #8C6A3F, #E4C87E 50%, #B08D57)",
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
      gsap.fromTo(
        ref.current,
        { y: 28, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.85,
          ease: "power3.out",
          delay: delay / 1000,
          scrollTrigger: { trigger: ref.current, start: "top 88%", once: true },
        },
      );
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

/** Card with a gold radial glow following the pointer + GSAP reveal. */
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
    <Reveal delay={delay} className={undefined}>
      <div
        onPointerMove={onPointerMove}
        className={`relative overflow-hidden border border-[var(--color-crh-line)] bg-[var(--color-crh-card)] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-[5px] hover:border-[rgba(212,175,55,0.4)] hover:shadow-[0_26px_54px_-26px_rgba(212,175,55,0.35)] ${className ?? ""}`}
      >
        <div className="crh-spot-glow pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative">{children}</div>
      </div>
    </Reveal>
  );
}
