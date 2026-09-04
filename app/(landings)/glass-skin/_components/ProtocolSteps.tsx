"use client";

import { motion, type Variants } from "framer-motion";
import { Icon } from "@/components/icons";
import type { ContentOf } from "@/lib/pages/define";
import type { GLASS_SKIN } from "../content";

/* The Korean glass-skin session — six studied steps; the copy lives in
   content.ts and each step keeps its icon here, paired by index. */
const STEP_ICONS = [
  Icon.Droplets,
  Icon.Pipette,
  Icon.Activity,
  Icon.Droplet,
  Icon.Flower2,
  Icon.ShieldCheck,
] as const;

type StepsCopy = ContentOf<typeof GLASS_SKIN>["protocol"]["steps"];

const GOLD = "linear-gradient(120deg, #f0d98c 0%, #d4af37 55%, #b8912e 100%)";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

/* Cards rise into place along the horizontal line, one after another. */
const stepVar: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export function ProtocolSteps({ steps }: { steps: StepsCopy }) {
  const STEPS = steps.map((step, i) => ({ ...step, icon: STEP_ICONS[i] }));
  return (
    <motion.ol
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={container}
      dir="rtl"
      style={{ scrollbarWidth: "none" }}
      className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-1 pb-3 [&::-webkit-scrollbar]:hidden md:gap-3 md:overflow-visible lg:gap-4"
    >
      {STEPS.map((s, i) => (
        <motion.li
          key={s.n}
          variants={stepVar}
          className="group relative flex min-w-[76%] shrink-0 basis-[76%] snap-center flex-col items-center text-center sm:min-w-[44%] sm:basis-[44%] md:min-w-0 md:shrink md:basis-0 md:flex-1"
        >
          {/* connector line — runs through the node centres, joins across the gap.
              RTL: step ٠١ is rightmost (trim its right stub), step ٠٦ leftmost. */}
          <span
            aria-hidden
            className={`pointer-events-none absolute top-7 z-0 h-px bg-[var(--color-gls-primary)]/45 md:top-8 ${
              i === 0 ? "right-1/2" : "-right-2"
            } ${i === STEPS.length - 1 ? "left-1/2" : "-left-2"}`}
          />

          {/* numbered node sitting on the line */}
          <span className="relative z-10 flex size-14 flex-col items-center justify-center rounded-full text-[#1d2023] shadow-[0_10px_26px_-8px_rgba(212,175,55,0.6)] ring-4 ring-[#0b0c0e] transition-transform duration-300 group-hover:scale-[1.07] md:size-16">
            <span
              className="absolute inset-0 rounded-full"
              style={{ background: GOLD }}
              aria-hidden
            />
            <s.icon className="relative size-5 md:size-[1.35rem]" />
            <span className="relative font-[family-name:var(--font-plex-arabic)] text-[9px] font-bold leading-none">
              {s.n}
            </span>
          </span>

          {/* glass card */}
          <div className="mt-5 flex w-full flex-1 flex-col rounded-[1.35rem] border border-[var(--color-gls-line-soft)] bg-[#16181b]/70 p-4 backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-[var(--color-gls-line)] md:p-5">
            <span className="font-[family-name:var(--font-plex-arabic)] text-[10px] font-semibold tracking-normal text-[var(--color-gls-primary)]">
              {s.label}
            </span>
            <h3 className="mt-1.5 text-base font-extrabold leading-snug text-white md:text-lg">
              {s.title}
            </h3>
            <p className="mt-2 text-[12.5px] leading-6 text-[var(--color-gls-muted)]">
              {s.text}
            </p>
          </div>
        </motion.li>
      ))}
    </motion.ol>
  );
}
