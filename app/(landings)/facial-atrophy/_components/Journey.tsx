"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Reveal } from "./Reveal";
import type { ContentOf } from "@/lib/pages/define";
import type { FACIAL_ATROPHY } from "../content";

type Steps = ContentOf<typeof FACIAL_ATROPHY>["journey"]["steps"];

/** Vertical timeline whose gold rail fills as it scrolls into view. */
export function Journey({ steps }: { steps: Steps }) {
  const STEPS = steps;
  const railRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 0.72", "end 0.72"],
  });
  const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });

  return (
    <div ref={railRef} className="relative mx-auto max-w-[640px] pr-12">
      <div className="absolute top-2 right-[15px] bottom-2 w-0.5 overflow-hidden rounded-sm bg-[rgba(217,179,108,0.18)]">
        <motion.div
          className="absolute inset-0 origin-top"
          style={{
            scaleY: fill,
            background: "linear-gradient(180deg, #A67C3D, #F0D48A)",
          }}
        />
      </div>
      {STEPS.map((s, i) => (
        <Reveal
          key={s.num}
          delay={i * 80}
          className={`relative ${i < STEPS.length - 1 ? "mb-10" : ""}`}
        >
          <span
            className="absolute top-1 -right-[42px] size-[18px] rounded-full border-[3px] border-[var(--color-faa-gold)] bg-[var(--color-faa-bg)]"
            style={{ boxShadow: "0 0 12px rgba(217,179,108,.5)" }}
          />
          <span className="faa-serif text-base text-[rgba(217,179,108,0.6)]">
            {s.num}
          </span>
          <h3 className="mt-1 mb-1.5 text-[1.25rem] font-extrabold">{s.title}</h3>
          <p className="max-w-[52ch] text-[0.95rem] font-light text-[rgba(243,233,220,0.65)]">
            {s.body}
            {s.accent && (
              <>
                {" "}
                <i className="text-[var(--color-faa-gold)] not-italic">
                  {s.accent}
                </i>
              </>
            )}
          </p>
        </Reveal>
      ))}
    </div>
  );
}
