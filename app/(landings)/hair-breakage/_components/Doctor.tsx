"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Icon } from "@/components/icons";
import { GOLD_GRADIENT } from "./config";
import type { ContentOf } from "@/lib/pages/define";
import type { HAIR_BREAKAGE } from "../content";

const EASE = [0.22, 1, 0.36, 1] as const;

type DoctorCopy = ContentOf<typeof HAIR_BREAKAGE>["doctor"];

/** Doctor section: Dr. Dina portrait + care philosophy. The photo stays in
 *  code; every line of copy comes from the page content. */
export function Doctor({ copy }: { copy: DoctorCopy }) {
  const PILLARS = copy.pillars;

  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: EASE }}
      className="flex flex-wrap items-center justify-center gap-14"
    >
      {/* arched portrait with rotated outline + floating badge */}
      <div className="relative w-[clamp(240px,32vw,340px)] shrink-0">
        <div
          className="pointer-events-none absolute -inset-3.5 -rotate-2 rounded-t-full rounded-b-[28px] border border-[rgba(212,175,55,0.35)]"
          aria-hidden
        />
        <div className="relative aspect-[3/4] overflow-hidden rounded-t-full rounded-b-3xl border-2 border-[rgba(212,175,55,0.5)] bg-[var(--color-hab-card)] shadow-[0_36px_80px_-32px_rgba(212,175,55,0.45)]">
          <Image
            src="/team/dr-dina.avif"
            alt="د. دينا، طبيبة الأمراض الجلدية في عيادات مها دحلان"
            fill
            sizes="(max-width: 768px) 80vw, 340px"
            draggable={false}
            className="object-cover object-top"
          />
        </div>
        <span
          className="absolute -right-4 bottom-6 inline-flex items-center gap-[7px] rounded-full border border-[var(--color-hab-line-strong)] bg-[rgba(16,16,20,0.9)] px-4 py-2 text-[0.74rem] font-extrabold whitespace-nowrap text-[var(--color-hab-champagne)] shadow-[0_14px_30px_-14px_rgba(212,175,55,0.5)] backdrop-blur-lg"
          style={{ animation: "hab-floaty 7s ease-in-out infinite alternate" }}
        >
          {copy.badge}
        </span>
      </div>

      {/* bio */}
      <div className="min-w-[300px] flex-1 text-center md:max-w-[560px] md:text-right">
        <h3 className="m-0 text-3xl font-extrabold sm:text-4xl">{copy.name}</h3>
        <p className="mt-1.5 font-bold text-[var(--color-hab-champagne)]">
          {copy.role}
        </p>

        <div
          className="mt-5 rounded-l-[14px] rounded-r border-r-[3px] border-[var(--color-hab-gold)] px-[22px] py-[18px] text-right"
          style={{
            background:
              "linear-gradient(90deg, rgba(212,175,55,.1), transparent 70%)",
          }}
        >
          <p className="m-0 text-[1.05rem] font-bold text-[var(--color-hab-ink-soft)]">
            &#8220;{copy.quote}&#8221;
          </p>
        </div>

        <ul className="mt-6 grid list-none gap-2.5 p-0 sm:grid-cols-2">
          {PILLARS.map((c, i) =>
            i === 0 ? (
              <li
                key={c}
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-extrabold text-[#1A1405] shadow-[0_12px_28px_-12px_rgba(212,175,55,0.5)] sm:col-span-2"
                style={{ background: GOLD_GRADIENT }}
              >
                <Icon.BadgeCheck className="size-5 shrink-0" />
                {c}
              </li>
            ) : (
              <li
                key={c}
                className="flex items-center gap-2.5 rounded-2xl border border-[var(--color-hab-line)] bg-[var(--color-hab-card)] px-4 py-2.5 text-xs leading-5 font-bold text-[var(--color-hab-ink-soft)]"
              >
                <Icon.BadgeCheck className="size-4 shrink-0 text-[var(--color-hab-gold)]" />
                {c}
              </li>
            ),
          )}
        </ul>

        <div
          className="mt-6 inline-flex items-center gap-3 rounded-2xl border-r-[3px] border-[var(--color-hab-gold)] px-5 py-3"
          style={{
            background:
              "linear-gradient(90deg, rgba(212,175,55,.1), transparent 70%)",
          }}
        >
          <Icon.Award className="size-5 text-[var(--color-hab-gold)]" />
          <span className="text-sm font-bold text-[var(--color-hab-ink)]">
            {copy.affiliation}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
