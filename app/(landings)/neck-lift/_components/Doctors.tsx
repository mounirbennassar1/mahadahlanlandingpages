"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "@/components/icons";
import { GOLD_GRADIENT } from "./config";

const EASE = [0.22, 1, 0.36, 1] as const;

type Doctor = {
  label: string;
  name: string;
  title: string;
  highlight?: string;
  credentials: string[];
  experience?: string;
  image: string;
  imageAlt: string;
};

/* Same specialists as the other MahaDahlan landings. */
const DOCTORS: Doctor[] = [
  {
    label: "الأخصائية الأولى",
    name: "نضال الجريدي",
    title: "أخصائية التجميل اللاجراحي",
    highlight: "شهادة الأكاديمية الفيدرالية الفرنسية للتجميل اللاجراحي",
    credentials: [
      "شهادة معتمدة من THESERA الكورية",
      "شهادة معتمدة من MATIS الفرنسية",
      "شهادة معتمدة من SELVERT الإسبانية",
      "شهادة معتمدة من TOSKANI الإسبانية",
      "شهادة معتمدة من SWISS COLOR الألمانية",
      "شهادة معتمدة من THALGO الفرنسية",
    ],
    experience: "خبرة أكثر من ١٣ عاماً في مجال التجميل اللاجراحي",
    image: "/neck-lift/nidhal.jpg",
    imageAlt: "نضال الجريدي، أخصائية التجميل اللاجراحي",
  },
  {
    label: "الأخصائية الثانية",
    name: "فادية المنصور",
    title: "أخصائية التجميل اللاجراحي",
    credentials: [
      "دبلوم الأكاديمية البريطانية للتعليم الطبي اللاجراحي BACME",
      "شهادة معتمدة من THESERA الكورية",
      "شهادة معتمدة من Premiere Beauty Academy",
      "شهادة معتمدة من KLEADERM",
      "شهادة معتمدة من Premiere Center for Coiffure & Beauty",
      "شهادة معتمدة من Helen Academy",
    ],
    experience: "خبرة ١٣ عاماً في مجال التجميل اللاجراحي",
    image: "/neck-lift/fadia.jpg",
    imageAlt: "فادية المنصور، أخصائية التجميل اللاجراحي",
  },
];

export function Doctors() {
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
        className="flex cursor-grab flex-wrap items-center justify-center gap-14 active:cursor-grabbing"
      >
        {/* arched portrait with rotated outline + floating badge */}
        <div className="relative w-[clamp(240px,32vw,340px)] shrink-0">
          <div
            className="pointer-events-none absolute -inset-3.5 -rotate-2 rounded-t-full rounded-b-[28px] border border-[rgba(166,124,61,0.3)]"
            aria-hidden
          />
          <div
            className="relative aspect-[3/4] overflow-hidden rounded-t-full rounded-b-3xl border-2 border-[rgba(201,156,78,0.5)] bg-[var(--color-nkl-card)] shadow-[0_36px_80px_-32px_rgba(138,100,48,0.5)]"
          >
            <Image
              src={d.image}
              alt={d.imageAlt}
              fill
              sizes="(max-width: 768px) 80vw, 340px"
              draggable={false}
              className="object-cover object-top"
            />
          </div>
          <span
            className="absolute -right-4 bottom-6 inline-flex items-center gap-[7px] rounded-full border border-[var(--color-nkl-line-strong)] bg-[rgba(255,253,249,0.9)] px-4 py-2 text-[0.74rem] font-extrabold whitespace-nowrap text-[var(--color-nkl-bronze)] shadow-[0_14px_30px_-14px_rgba(138,100,48,0.4)] backdrop-blur-lg"
            style={{ animation: "nkl-floaty 7s ease-in-out infinite alternate" }}
          >
            تقييم صادق… دائماً
          </span>
        </div>

        {/* bio */}
        <div className="min-w-[300px] flex-1 text-center md:max-w-[560px] md:text-right">
          <h3 className="m-0 text-3xl font-extrabold sm:text-4xl">{d.name}</h3>
          <p className="mt-1.5 font-bold text-[var(--color-nkl-bronze)]">
            {d.title}
          </p>

          {d.highlight && (
            <div className="mt-5 flex items-center gap-3 rounded-2xl border border-[rgba(201,156,78,0.5)] bg-[var(--color-nkl-card)] px-4 py-3.5 text-right shadow-[0_10px_30px_-14px_rgba(138,100,48,0.35)]">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[rgba(201,156,78,0.15)] text-[var(--color-nkl-bronze)]">
                <Icon.GraduationCap className="size-5" />
              </span>
              <span className="text-sm leading-6 font-extrabold text-[var(--color-nkl-ink-soft)]">
                {d.highlight}
              </span>
            </div>
          )}

          <ul className="mt-6 grid list-none gap-2.5 p-0 sm:grid-cols-2">
            {d.credentials.map((c, i) =>
              i === 0 ? (
                <li
                  key={c}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-extrabold text-[var(--color-nkl-ink)] shadow-[0_12px_28px_-12px_rgba(138,100,48,0.5)] sm:col-span-2"
                  style={{ background: GOLD_GRADIENT }}
                >
                  <Icon.BadgeCheck className="size-5 shrink-0" />
                  {c}
                </li>
              ) : (
                <li
                  key={c}
                  className="flex items-center gap-2.5 rounded-2xl border border-[var(--color-nkl-line)] bg-[var(--color-nkl-card)] px-4 py-2.5 text-xs leading-5 font-bold text-[var(--color-nkl-ink-soft)]"
                >
                  <Icon.BadgeCheck className="size-4 shrink-0 text-[var(--color-nkl-gold)]" />
                  {c}
                </li>
              ),
            )}
          </ul>

          {d.experience && (
            <div className="mt-6 inline-flex items-center gap-3 rounded-2xl border-r-[3px] border-[var(--color-nkl-gold-bright)] px-5 py-3"
              style={{
                background:
                  "linear-gradient(90deg, rgba(201,156,78,.1), transparent 70%)",
              }}
            >
              <Icon.Award className="size-5 text-[var(--color-nkl-gold)]" />
              <span className="text-sm font-bold text-[var(--color-nkl-ink)]">
                {d.experience}
              </span>
            </div>
          )}
        </div>
      </motion.div>

      {/* controls */}
      <div className="mt-10 flex items-center justify-center gap-5">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="الأخصائية السابقة"
          className="flex size-11 items-center justify-center rounded-full border border-[var(--color-nkl-line)] bg-[var(--color-nkl-card)] text-[var(--color-nkl-ink)] transition-colors hover:border-[var(--color-nkl-gold)] hover:text-[var(--color-nkl-bronze)]"
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
                  ? "w-8 bg-[var(--color-nkl-gold)]"
                  : "w-2 bg-[rgba(166,124,61,0.3)] hover:bg-[var(--color-nkl-gold-bright)]"
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="الأخصائية التالية"
          className="flex size-11 items-center justify-center rounded-full border border-[var(--color-nkl-line)] bg-[var(--color-nkl-card)] text-[var(--color-nkl-ink)] transition-colors hover:border-[var(--color-nkl-gold)] hover:text-[var(--color-nkl-bronze)]"
        >
          <Icon.ChevronLeft className="size-5" />
        </button>
      </div>
    </div>
  );
}
