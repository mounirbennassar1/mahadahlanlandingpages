"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "@/components/icons";
import { EASE } from "./Reveal";
import { GOLD_GRADIENT } from "./config";
import type { ContentOf } from "@/lib/pages/define";
import type { FACIAL_ATROPHY } from "../content";

type Doctor = {
  label: string;
  name: string;
  title: string;
  credentials: string[];
  image: string;
  imageAlt: string;
};

/* Same medical team as the home page, in the order the clinic asked for. */
const BASE_DOCTORS: Doctor[] = [
  {
    label: "الطبيبة الأولى",
    name: "د. مها دحلان",
    title: "استشارية الجلدية والتجميل والليزر",
    credentials: [
      "البورد السعودي في طب الأمراض الجلدية والتجميل والليزر",
      "البورد العربي في طب الأمراض الجلدية والتناسلية",
      "ماجستير صحة عامة من جامعة بوسطن",
      "زمالة البرنامج العالمي من جامعة هارفارد للأمراض الجلدية",
    ],
    image: "/team/dr-maha.avif",
    imageAlt: "د. مها دحلان، استشارية الجلدية والتجميل والليزر",
  },
  {
    label: "الطبيبة الثانية",
    name: "د. لجين الجرماني",
    title: "نائب الجلدية والتجميل والليزر",
    credentials: [
      "البورد السوري في طب الأمراض الجلدية",
      "الدبلوم الأمريكي للجلدية والتجميل والليزر",
    ],
    image: "/team/dr-lajin.avif",
    imageAlt: "د. لجين الجرماني، نائب الجلدية والتجميل والليزر",
  },
  {
    label: "الطبيبة الثالثة",
    name: "د. إيناس عبدالعزيز",
    title: "طبيب مقيم الأمراض الجلدية",
    credentials: [
      "بكالوريوس طب وجراحة عامة، تخصص الجلدية",
      "الدبلوم الأمريكي للجلدية والتجميل والليزر",
    ],
    image: "/team/dr-inas.avif",
    imageAlt: "د. إيناس عبدالعزيز، طبيب مقيم الأمراض الجلدية",
  },
];

type DoctorsCopy = ContentOf<typeof FACIAL_ATROPHY>["doctors"];

/** Photos stay in code; names, titles and credentials are editable. */
export function Doctors({ copy }: { copy: DoctorsCopy }) {
  const DOCTORS: Doctor[] = BASE_DOCTORS.map((doc, i) => {
    const person = copy.people[i];
    return person
      ? {
          ...doc,
          label: person.label,
          name: person.name,
          title: person.title,
          credentials: person.credentials.filter(Boolean),
        }
      : doc;
  });

  const [[index, dir], setSlide] = useState<[number, number]>([0, 0]);
  const count = DOCTORS.length;
  const d = DOCTORS[index];

  const go = (delta: number) =>
    setSlide(([i]) => [(i + delta + count) % count, delta]);

  return (
    <div className="relative overflow-hidden">
      <motion.div
        key={d.name}
        initial={{ opacity: 0, x: dir * -64 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.12}
        onDragEnd={(_, info) => {
          if (info.offset.x > 64) go(1);
          else if (info.offset.x < -64) go(-1);
        }}
        className="grid cursor-grab items-center gap-8 active:cursor-grabbing md:grid-cols-[0.9fr_1.1fr] md:gap-[clamp(34px,5vw,64px)]"
      >
        {/* framed portrait — gold corner brackets + floating badge */}
        <div className="relative mx-auto w-full max-w-[430px]">
          <div
            className="pointer-events-none absolute -top-4 -right-4 size-[110px] rounded-tr-[26px] border-t-2 border-r-2 border-[rgba(240,212,138,0.6)]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-4 -left-4 size-[110px] rounded-bl-[26px] border-b-2 border-l-2 border-[rgba(240,212,138,0.6)]"
            aria-hidden
          />
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-[rgba(217,179,108,0.25)] bg-[var(--color-faa-surface)] shadow-[0_40px_90px_-36px_rgba(0,0,0,0.85)]">
            <Image
              src={d.image}
              alt={d.imageAlt}
              fill
              sizes="(max-width: 768px) 90vw, 35vw"
              draggable={false}
              className="object-cover object-top"
            />
            <span
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(21,4,9,0.85), transparent 42%)",
              }}
              aria-hidden
            />
            <div className="absolute right-5 bottom-5 left-5 flex items-center justify-between">
              <span className="text-sm font-extrabold text-[var(--color-faa-ink)]">
                {d.name}
              </span>
              <span className="text-[10px] font-semibold text-[var(--color-faa-gold-bright)]">
                {copy.clinicTag}
              </span>
            </div>
          </div>
          <div
            className="absolute bottom-[22px] -right-3 flex items-center gap-[11px] rounded-2xl border border-[var(--color-faa-line-strong)] bg-[rgba(21,4,9,0.82)] px-5 py-[13px] backdrop-blur-xl sm:-right-6"
            style={{ animation: "faa-floaty 7s ease-in-out infinite alternate" }}
          >
            <div
              className="flex size-[38px] items-center justify-center rounded-[11px] text-[var(--color-faa-cta-ink)]"
              style={{ background: GOLD_GRADIENT }}
            >
              <Icon.ShieldCheck className="size-[19px]" strokeWidth={2.2} />
            </div>
            <div>
              <b className="block text-[0.86rem] text-[var(--color-faa-gold-pale)]">
                {copy.badgeTitle}
              </b>
              <small className="text-[0.7rem] text-[rgba(243,233,220,0.6)]">
                {copy.badgeSub}
              </small>
            </div>
          </div>
        </div>

        {/* bio */}
        <div className="text-center md:text-right">
          <span className="text-[0.76rem] font-extrabold tracking-[0.14em] text-[var(--color-faa-gold)]">
            {d.label}
          </span>
          <h3 className="mt-2 text-3xl font-extrabold text-[var(--color-faa-ink)] sm:text-4xl">
            {d.name}
          </h3>
          <p className="mt-2 text-base font-extrabold text-[var(--color-faa-gold-bright)]">
            {d.title}
          </p>

          <ul className="mt-7 grid gap-2.5 sm:grid-cols-2">
            {d.credentials.map((c, i) =>
              i === 0 ? (
                <li
                  key={c}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-extrabold text-[var(--color-faa-cta-ink)] shadow-[0_12px_28px_-12px_rgba(217,179,108,0.6)] sm:col-span-2"
                  style={{ background: GOLD_GRADIENT }}
                >
                  <Icon.BadgeCheck className="size-5 shrink-0" />
                  {c}
                </li>
              ) : (
                <li
                  key={c}
                  className="flex items-center gap-2.5 rounded-2xl border border-[var(--color-faa-line)] bg-[rgba(217,179,108,0.06)] px-4 py-2.5 text-xs leading-5 font-bold text-[var(--color-faa-ink-soft)]"
                >
                  <Icon.BadgeCheck className="size-4 shrink-0 text-[var(--color-faa-gold)]" />
                  {c}
                </li>
              ),
            )}
          </ul>
        </div>
      </motion.div>

      {/* controls — prev on the right in RTL */}
      <div className="mt-10 flex items-center justify-center gap-5">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="الطبيبة السابقة"
          className="flex size-11 items-center justify-center rounded-full border border-[var(--color-faa-line)] bg-[rgba(53,16,28,0.8)] text-[var(--color-faa-ink)] transition-colors hover:border-[var(--color-faa-gold)] hover:text-[var(--color-faa-gold-bright)]"
        >
          <Icon.ChevronRight className="size-5" />
        </button>

        <div className="flex items-center gap-2">
          {DOCTORS.map((doc, i) => (
            <button
              key={doc.label}
              type="button"
              onClick={() => setSlide(([cur]) => [i, i > cur ? 1 : -1])}
              aria-label={doc.label}
              aria-current={i === index}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === index
                  ? "w-8 bg-[var(--color-faa-gold)]"
                  : "w-2 bg-[rgba(217,179,108,0.3)] hover:bg-[var(--color-faa-gold-bright)]"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => go(1)}
          aria-label="الطبيبة التالية"
          className="flex size-11 items-center justify-center rounded-full border border-[var(--color-faa-line)] bg-[rgba(53,16,28,0.8)] text-[var(--color-faa-ink)] transition-colors hover:border-[var(--color-faa-gold)] hover:text-[var(--color-faa-gold-bright)]"
        >
          <Icon.ChevronLeft className="size-5" />
        </button>
      </div>
    </div>
  );
}
