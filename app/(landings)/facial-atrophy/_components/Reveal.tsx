"use client";

import { motion, type Variants } from "framer-motion";
import { useCallback, type PointerEvent, type ReactNode } from "react";

export const EASE = [0.22, 1, 0.36, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: EASE },
  },
};

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Extra delay in ms, mirrors the design's data-rd attribute. */
  delay?: number;
};

/** Scroll-triggered fade-up, once, matching the imported design's reveal. */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.85, ease: EASE, delay: delay / 1000 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

type SpotlightCardProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Lift the card on hover (default true). */
  hoverLift?: boolean;
};

/**
 * Card with a gold radial glow that follows the pointer (--mx/--my consumed
 * by .faa-spot-glow) plus the design's hover lift + border brightening.
 */
export function SpotlightCard({
  children,
  className,
  delay = 0,
  hoverLift = true,
}: SpotlightCardProps) {
  const onPointerMove = useCallback((e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.85, ease: EASE, delay: delay / 1000 }}
      whileHover={hoverLift ? { y: -6 } : undefined}
      onPointerMove={onPointerMove}
      className={`group relative overflow-hidden border border-[var(--color-faa-line)] transition-colors duration-300 hover:border-[rgba(240,212,138,0.45)] ${className ?? ""}`}
    >
      <div
        className="faa-spot-glow pointer-events-none absolute inset-0"
        aria-hidden
      />
      <div className="relative">{children}</div>
    </motion.div>
  );
}
