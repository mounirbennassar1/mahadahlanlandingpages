"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "@/components/icons";

const EASE = [0.22, 1, 0.36, 1] as const;

type Doctor = {
  label: string;
  name: string;
  title: string;
  credentials: string[];
  image: string;
  imageAlt: string;
};

/* Same medical team as the landing pages (chronic-eczema et al.),
   restyled for the onyx/champagne home palette. */
const DOCTORS: Doctor[] = [
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
    name: "د. إيناس عبدالعزيز",
    title: "طبيب مقيم الأمراض الجلدية",
    credentials: [
      "بكالوريوس طب وجراحة عامة، تخصص الجلدية",
      "الدبلوم الأمريكي للجلدية والتجميل والليزر",
    ],
    image: "/team/dr-inas.avif",
    imageAlt: "د. إيناس عبدالعزيز، طبيب مقيم الأمراض الجلدية",
  },
  {
    label: "الطبيبة الثالثة",
    name: "د. لجين الجرماني",
    title: "نائب الجلدية والتجميل والليزر",
    credentials: [
      "البورد السوري في طب الأمراض الجلدية",
      "الدبلوم الأمريكي للجلدية والتجميل والليزر",
    ],
    image: "/team/dr-lajin.avif",
    imageAlt: "د. لجين الجرماني، نائب الجلدية والتجميل والليزر",
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
        {/* arch portrait with offset hairline echo */}
        <div className="relative w-[clamp(240px,32vw,330px)] shrink-0">
          <div
            className="pointer-events-none absolute -inset-x-3.5 -top-3.5 bottom-6 rounded-t-full border border-[rgba(201,156,78,0.4)]"
            aria-hidden
          />
          <div className="relative aspect-[3/4] overflow-hidden rounded-t-full bg-[var(--color-md-card)]">
            <Image
              src={d.image}
              alt={d.imageAlt}
              fill
              sizes="(max-width: 768px) 80vw, 330px"
              draggable={false}
              className="object-cover object-top"
            />
          </div>
          <figcaption className="mt-3.5 flex items-start gap-3 border-t border-[var(--color-md-line)] pt-2.5">
            <span
              className="mt-[9px] h-px w-7 shrink-0 bg-[var(--color-md-gold)]"
              aria-hidden
            />
            <span className="text-[0.74rem] leading-5 font-bold text-[var(--color-md-muted)]">
              علاج يُدار بعلم ، لا بالتجربة
            </span>
          </figcaption>
        </div>

        {/* bio — editorial hairline index for the credentials */}
        <div className="min-w-[300px] flex-1 text-center md:max-w-[560px] md:text-right">
          <span className="text-[0.74rem] font-extrabold text-[var(--color-md-gold-bright)]">
            {d.label}
          </span>
          <h3 className="mt-2 mb-0 text-3xl font-extrabold text-[var(--color-md-text)] sm:text-4xl">
            {d.name}
          </h3>
          <p className="mt-1.5 font-bold text-[var(--color-md-champagne)]">
            {d.title}
          </p>

          <ul className="mt-7 list-none p-0 text-right">
            {d.credentials.map((c) => (
              <li
                key={c}
                className="flex items-start gap-3.5 border-t border-[var(--color-md-line)] py-3"
              >
                <Icon.BadgeCheck className="mt-1 size-[18px] shrink-0 text-[var(--color-md-gold)]" />
                <span className="text-[0.9rem] leading-7 font-bold text-[rgba(246,238,223,0.78)]">
                  {c}
                </span>
              </li>
            ))}
            <li className="h-px bg-[var(--color-md-line)]" aria-hidden />
          </ul>
        </div>
      </motion.div>

      {/* controls */}
      <div className="mt-10 flex items-center justify-center gap-5">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="الطبيبة السابقة"
          className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-[var(--color-md-line-strong)] bg-transparent text-[var(--color-md-text)] transition-colors hover:border-[var(--color-md-gold-bright)] hover:text-[var(--color-md-gold-bright)]"
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
              className={`h-1 cursor-pointer transition-all duration-300 ${
                i === index
                  ? "w-9 bg-[var(--color-md-gold)]"
                  : "w-4 bg-[var(--color-md-line-strong)] hover:bg-[var(--color-md-gold)]"
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="الطبيبة التالية"
          className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-[var(--color-md-line-strong)] bg-transparent text-[var(--color-md-text)] transition-colors hover:border-[var(--color-md-gold-bright)] hover:text-[var(--color-md-gold-bright)]"
        >
          <Icon.ChevronLeft className="size-5" />
        </button>
      </div>
    </div>
  );
}
