"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { ContentOf } from "@/lib/pages/define";
import type { KOREAN_SPICULES } from "../content";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Stat = { value: number; prefix?: string; suffix?: string; label: string };

/** The counted values drive the animation, so they stay in code; only the
 *  captions under them are editable. */
const BASE_STATS: Omit<Stat, "label">[] = [
  { value: 97, suffix: "٪" },
  { value: 1800, prefix: "+" },
  { value: 7, suffix: " أيام" },
  { value: 45, suffix: " د" },
];

const toArabicDigits = (n: number) =>
  String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[+d]);

const format = (s: Omit<Stat, "label">, v: number) =>
  `${s.prefix ?? ""}${toArabicDigits(Math.round(v))}${s.suffix ?? ""}`;

type StatsCopy = ContentOf<typeof KOREAN_SPICULES>["stats"];

/** Numbers count up (Arabic-Indic digits) when the band scrolls into view. */
export function StatCounters({ copy }: { copy: StatsCopy }) {
  const STATS: Stat[] = BASE_STATS.map((stat, i) => ({
    ...stat,
    label: copy.labels[i]?.label ?? "",
  }));
  const rootRef = useRef<HTMLDivElement>(null);
  const numRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return; // SSR markup already shows the final values

      numRefs.current.forEach((el, i) => {
        if (!el) return;
        const stat = STATS[i];
        const state = { v: 0 };
        el.textContent = format(stat, 0); // pre-paint reset (useGSAP = layout effect)
        gsap.to(state, {
          v: stat.value,
          duration: 1.9,
          delay: i * 0.12,
          ease: "power3.out",
          onUpdate: () => {
            el.textContent = format(stat, state.v);
          },
          scrollTrigger: { trigger: rootRef.current, start: "top 82%", once: true },
        });
      });
    },
    { scope: rootRef },
  );

  return (
    <div
      ref={rootRef}
      data-reveal="zoom"
      className="overflow-hidden rounded-[2rem] border border-[var(--color-kos-line)] bg-gradient-to-b from-[#161616]/85 to-black/40 px-6 py-10 backdrop-blur-sm sm:px-10"
    >
      <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
        {STATS.map((s, i) => (
          <div
            key={s.label}
            className={`flex flex-col items-center text-center ${
              i < STATS.length - 1
                ? "md:border-l md:border-[var(--color-kos-line-soft)]"
                : ""
            }`}
          >
            <span
              ref={(el) => {
                numRefs.current[i] = el;
              }}
              className="kos-orange-text text-4xl font-extrabold sm:text-5xl"
            >
              {format(s, s.value)}
            </span>
            <span className="mt-2 text-xs font-bold tracking-normal text-[var(--color-kos-muted)]">
              {s.label}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-9 border-t border-[var(--color-kos-line-soft)] pt-7 text-center text-sm leading-7 text-[var(--color-kos-ink-soft)]">
        {copy.note}
      </p>
    </div>
  );
}
