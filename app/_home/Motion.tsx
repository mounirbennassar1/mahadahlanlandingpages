"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Icon } from "@/components/icons";
import { toArabicDigits } from "./config";

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
      style={{ background: "linear-gradient(90deg, #8A6430, #E0BE7A 50%, #A67C3D)" }}
      aria-hidden
    />
  );
}

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Extra delay in ms. */
  delay?: number;
  /** Direction the content travels in from. */
  from?: "bottom" | "right" | "left";
};

/** Scroll-triggered fade-in (once), GSAP-driven. */
export function Reveal({
  children,
  className,
  delay = 0,
  from = "bottom",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const offset =
        from === "bottom"
          ? { y: 30 }
          : from === "right"
            ? { x: 40 }
            : { x: -40 };

      gsap.fromTo(
        ref.current,
        { ...offset, autoAlpha: 0 },
        {
          x: 0,
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

/** Reveals direct children one after another as the block scrolls in. */
export function RevealGroup({
  children,
  className,
  stagger = 0.09,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const items = ref.current?.children;
      if (!items?.length) return;

      gsap.fromTo(
        items,
        { y: 34, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger,
          scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
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

/** Soft scroll parallax: translates children as they cross the viewport. */
export function Parallax({
  children,
  className,
  from = 30,
  to = -30,
}: {
  children: ReactNode;
  className?: string;
  from?: number;
  to?: number;
}) {
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

/** Counts up to `value` once the stat scrolls into view, in Arabic-Indic digits. */
export function Counter({
  value,
  prefix = "",
  suffix = "",
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const node = ref.current;
      if (!node) return;

      const counter = { n: 0 };
      gsap.to(counter, {
        n: value,
        duration: 1.8,
        ease: "power2.out",
        scrollTrigger: { trigger: node, start: "top 92%", once: true },
        onUpdate: () => {
          node.textContent = `${prefix}${toArabicDigits(Math.round(counter.n))}${suffix}`;
        },
      });
    },
    { scope: ref },
  );

  return (
    <span ref={ref} className={className}>
      {`${prefix}${toArabicDigits(0)}${suffix}`}
    </span>
  );
}

/** Gold hairline that draws itself (right to left) as the user scrolls past. */
export function ScrubLine({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ref.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%",
            end: "top 35%",
            scrub: 0.4,
          },
        },
      );
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      className={`origin-right ${className ?? ""}`}
      style={{
        background:
          "linear-gradient(90deg, rgba(201,156,78,.1), #E8C36A 50%, rgba(201,156,78,.1))",
        boxShadow: "0 0 16px rgba(232,195,106,.5)",
      }}
      aria-hidden
    />
  );
}

/** Card with a gold radial glow following the pointer, plus a scroll reveal. */
export function SpotlightCard({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const onPointerMove = useCallback((e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  }, []);

  return (
    <div onPointerMove={onPointerMove} className={className} style={style}>
      <div className="md-spot-glow pointer-events-none absolute inset-0 z-[2]" aria-hidden />
      {children}
    </div>
  );
}

/** Round back-to-top button, fades in after the first viewport. */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 900);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="العودة إلى الأعلى"
      className={`fixed bottom-24 right-6 z-50 hidden size-11 items-center justify-center rounded-full border border-[var(--color-md-line-strong)] bg-[rgba(22,16,10,0.85)] text-[var(--color-md-champagne)] shadow-[0_0_24px_-6px_rgba(232,195,106,0.5)] backdrop-blur-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-[rgba(35,26,15,0.95)] hover:shadow-[0_0_30px_-6px_rgba(255,223,142,0.7)] md:flex ${
        visible ? "opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <Icon.ArrowUp className="size-[18px]" strokeWidth={2.4} />
    </button>
  );
}
