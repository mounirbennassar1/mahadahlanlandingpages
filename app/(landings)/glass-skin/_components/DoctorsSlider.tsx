"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "@/components/icons";

type Doctor = {
  /** Kept for the dot/nav aria-labels; no longer shown as an eyebrow. */
  label: string;
  name: string;
  title: string;
  /** Flagship credential shown directly under the title, styled distinctly. */
  highlight?: string;
  /** First credential is the featured one (rendered full-width in gold). */
  credentials: string[];
  experience?: string;
  /** Shown when a profile is still pending (no credentials yet). */
  note?: string;
  image: string;
  imageAlt: string;
};

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
    image: "/glass-skin/Nidhal.jpg.webp",
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
    image: "/glass-skin/Fadia.jpg",
    imageAlt: "فادية المنصور، أخصائية التجميل اللاجراحي",
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;

export function DoctorsSlider() {
  const [[index, dir], setSlide] = useState<[number, number]>([0, 0]);
  const count = DOCTORS.length;
  const d = DOCTORS[index];

  const go = (delta: number) =>
    setSlide(([i]) => [(i + delta + count) % count, delta]);

  return (
    <div className="relative overflow-hidden">
      {/* Keyed re-mount: each slide animates in on index change (RTL: dir=1
          enters from the left). No AnimatePresence — a stuck "wait"-mode exit
          could otherwise leave the new slide unmounted. */}
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
        className="grid cursor-grab items-center gap-7 active:cursor-grabbing sm:gap-9 md:grid-cols-[1.1fr_0.9fr] md:gap-16"
      >
          {/* bio — right column on desktop; below the portrait on mobile */}
          <div className="text-center md:text-right">
            <h3 className="text-3xl font-extrabold text-white sm:text-4xl">
              {d.name}
            </h3>
            <p className="mt-2 text-sm font-bold tracking-normal text-[var(--color-gls-primary-dim)]">
              {d.title}
            </p>

            {/* flagship credential — sits right under the title, styled
                distinctly from the certification list below it */}
            {d.highlight && (
              <div className="mt-5 flex items-center gap-3 rounded-2xl border-2 border-[var(--color-gls-primary)]/45 bg-[var(--color-gls-primary)]/[0.08] px-4 py-3.5 text-right shadow-[0_10px_30px_-14px_rgba(212,175,55,0.5)]">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-gls-primary)]/15 text-[var(--color-gls-primary-dim)]">
                  <Icon.GraduationCap className="size-5" />
                </span>
                <span className="text-sm font-extrabold leading-6 text-[var(--color-gls-primary-dim)]">
                  {d.highlight}
                </span>
              </div>
            )}

            {d.credentials.length > 0 ? (
              <ul className="mt-7 grid gap-2.5 sm:grid-cols-2">
                {d.credentials.map((c, i) =>
                  i === 0 ? (
                    /* featured credential — the Korean certification leads */
                    <li
                      key={c}
                      className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-extrabold text-[#1d2023] shadow-[0_12px_28px_-12px_rgba(212,175,55,0.55)] sm:col-span-2"
                      style={{
                        background:
                          "linear-gradient(120deg, #f0d98c 0%, #d4af37 55%, #b8912e 100%)",
                      }}
                    >
                      <Icon.BadgeCheck className="size-5 shrink-0" />
                      {c}
                    </li>
                  ) : (
                    <li
                      key={c}
                      className="flex items-center gap-2.5 rounded-2xl border border-[var(--color-gls-line)] bg-[var(--color-gls-primary)]/8 px-4 py-2.5 text-xs font-bold leading-5 text-[var(--color-gls-primary-dim)]"
                    >
                      <Icon.BadgeCheck className="size-4 shrink-0" />
                      {c}
                    </li>
                  ),
                )}
              </ul>
            ) : (
              d.note && (
                <p className="mt-7 max-w-md rounded-2xl border border-dashed border-[var(--color-gls-line)] bg-[#16181b]/60 px-5 py-4 text-sm leading-7 text-[var(--color-gls-ink-soft)]">
                  {d.note}
                </p>
              )
            )}

            {d.experience && (
              <div className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-[var(--color-gls-line)] bg-[#16181b]/70 px-5 py-3 backdrop-blur-sm">
                <Icon.Award className="size-5 text-[var(--color-gls-primary-dim)]" />
                <span className="text-sm font-bold text-white">
                  {d.experience}
                </span>
              </div>
            )}
          </div>

          {/* portrait — left column on desktop; on top on mobile */}
          <div className="relative order-first md:order-none">
            <div
              className="pointer-events-none absolute -inset-6 rounded-[3rem] opacity-60"
              style={{
                background:
                  "radial-gradient(60% 60% at 50% 40%, rgba(212,175,55,0.16), transparent 70%)",
              }}
              aria-hidden
            />
            <div className="gls-fallback-host relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[2rem] border border-[var(--color-gls-line)] bg-[var(--color-gls-surface)] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.85)]">
              <Image
                src={d.image}
                alt={d.imageAlt}
                fill
                sizes="(max-width: 768px) 90vw, 35vw"
                draggable={false}
                className="object-cover object-top [filter:sepia(0.55)_saturate(1.5)_brightness(1.03)_contrast(1.02)]"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                  e.currentTarget
                    .closest(".gls-fallback-host")
                    ?.classList.add("is-missing");
                }}
              />
              {/* gold duotone veil — warms the portrait into the theme */}
              <span
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(155deg, rgba(212,175,55,0.32), rgba(169,133,43,0.14) 55%, rgba(6,7,8,0.2))",
                  mixBlendMode: "multiply",
                }}
                aria-hidden
              />
              <span
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(6,7,8,0.8), transparent 42%)",
                }}
                aria-hidden
              />
              <div className="absolute bottom-5 right-5 left-5 flex items-center justify-between">
                <span className="text-sm font-extrabold text-white">
                  {d.name}
                </span>
                <span className="font-[family-name:var(--font-plex-arabic)] text-[10px] font-semibold tracking-normal text-[var(--color-gls-accent)]">
                  عيادات مها دحلان
                </span>
              </div>
            </div>
          </div>
      </motion.div>

      {/* controls — prev renders on the right in RTL, next on the left */}
      <div className="mt-10 flex items-center justify-center gap-5">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="الأخصائية السابقة"
          className="flex size-11 items-center justify-center rounded-full border border-[var(--color-gls-line)] bg-[#16181b]/80 text-[var(--color-gls-ink)] transition-colors hover:border-[var(--color-gls-primary)] hover:text-[var(--color-gls-primary-dim)]"
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
                  ? "w-8 bg-[var(--color-gls-primary)]"
                  : "w-2 bg-[var(--color-gls-line)] hover:bg-[var(--color-gls-primary-dim)]"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => go(1)}
          aria-label="الأخصائية التالية"
          className="flex size-11 items-center justify-center rounded-full border border-[var(--color-gls-line)] bg-[#16181b]/80 text-[var(--color-gls-ink)] transition-colors hover:border-[var(--color-gls-primary)] hover:text-[var(--color-gls-primary-dim)]"
        >
          <Icon.ChevronLeft className="size-5" />
        </button>
      </div>
    </div>
  );
}
