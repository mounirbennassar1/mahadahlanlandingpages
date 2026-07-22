"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "@/components/icons";

type Doctor = {
  /** Kept for the dot/nav aria-labels; not shown as an eyebrow. */
  label: string;
  name: string;
  title: string;
  /** Flagship credential shown directly under the title, styled distinctly. */
  highlight?: string;
  /** First credential is the featured one (rendered full-width in orange). */
  credentials: string[];
  experience?: string;
  image: string;
  imageAlt: string;
};

/* Same specialists as the glass-skin landing — THESERA (Korean) leads,
 * since the spicules ampoules are a THESERA protocol. */
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
    image: "/korean-spicules/nidhal.jpg",
    imageAlt: "نضال الجريدي، أخصائية التجميل اللاجراحي",
  },
  {
    label: "الأخصائية الثانية",
    name: "فادية المنصور",
    title: "أخصائية التجميل اللاجراحي",
    credentials: [
      "شهادة معتمدة من THESERA الكورية",
      "شهادة معتمدة من Premiere Beauty Academy",
      "شهادة معتمدة من KLEADERM",
      "شهادة معتمدة من Premiere Center for Coiffure & Beauty",
      "شهادة معتمدة من Helen Academy",
    ],
    experience: "خبرة أكثر من ١٠ سنوات في مجال التجميل اللاجراحي",
    image: "/korean-spicules/fadia.jpg",
    imageAlt: "فادية المنصور، أخصائية التجميل اللاجراحي",
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;
const ORANGE_GRADIENT =
  "linear-gradient(120deg, #ffb473 0%, #ff6b1a 55%, #e35500 100%)";

export function DoctorsSlider() {
  const [[index, dir], setSlide] = useState<[number, number]>([0, 0]);
  const count = DOCTORS.length;
  const d = DOCTORS[index];

  const go = (delta: number) =>
    setSlide(([i]) => [(i + delta + count) % count, delta]);

  return (
    <div className="relative overflow-hidden">
      {/* Keyed re-mount: each slide animates in on index change (RTL: dir=1
          enters from the left). */}
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
          <h3 className="text-3xl font-extrabold text-white sm:text-4xl">{d.name}</h3>
          <p className="mt-2 text-sm font-bold tracking-normal text-[var(--color-kos-primary-dim)]">
            {d.title}
          </p>

          {d.highlight && (
            <div className="mt-5 flex items-center gap-3 rounded-2xl border-2 border-[var(--color-kos-primary)]/45 bg-[var(--color-kos-primary)]/[0.08] px-4 py-3.5 text-right shadow-[0_10px_30px_-14px_rgba(255,107,26,0.5)]">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-kos-primary)]/15 text-[var(--color-kos-primary-dim)]">
                <Icon.GraduationCap className="size-5" />
              </span>
              <span className="text-sm font-extrabold leading-6 text-[var(--color-kos-primary-dim)]">
                {d.highlight}
              </span>
            </div>
          )}

          <ul className="mt-7 grid gap-2.5 sm:grid-cols-2">
            {d.credentials.map((c, i) =>
              i === 0 ? (
                /* featured credential — the Korean certification leads */
                <li
                  key={c}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-extrabold text-[#180a02] shadow-[0_12px_28px_-12px_rgba(255,107,26,0.6)] sm:col-span-2"
                  style={{ background: ORANGE_GRADIENT }}
                >
                  <Icon.BadgeCheck className="size-5 shrink-0" />
                  {c}
                </li>
              ) : (
                <li
                  key={c}
                  className="flex items-center gap-2.5 rounded-2xl border border-[var(--color-kos-line)] bg-[var(--color-kos-primary)]/8 px-4 py-2.5 text-xs font-bold leading-5 text-[var(--color-kos-primary-dim)]"
                >
                  <Icon.BadgeCheck className="size-4 shrink-0" />
                  {c}
                </li>
              ),
            )}
          </ul>

          {d.experience && (
            <div className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-[var(--color-kos-line)] bg-[#171717]/70 px-5 py-3 backdrop-blur-sm">
              <Icon.Award className="size-5 text-[var(--color-kos-primary-dim)]" />
              <span className="text-sm font-bold text-white">{d.experience}</span>
            </div>
          )}
        </div>

        {/* portrait — left column on desktop; on top on mobile */}
        <div className="relative order-first md:order-none">
          <div
            className="pointer-events-none absolute -inset-6 rounded-[3rem] opacity-60"
            style={{
              background:
                "radial-gradient(60% 60% at 50% 40%, rgba(255,107,26,0.16), transparent 70%)",
            }}
            aria-hidden
          />
          <div className="kos-fallback-host relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[2rem] border border-[var(--color-kos-line)] bg-[var(--color-kos-surface)] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.9)]">
            <Image
              src={d.image}
              alt={d.imageAlt}
              fill
              sizes="(max-width: 768px) 90vw, 35vw"
              draggable={false}
              className="object-cover object-top [filter:sepia(0.4)_saturate(1.4)_brightness(1.02)]"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
                e.currentTarget.closest(".kos-fallback-host")?.classList.add("is-missing");
              }}
            />
            {/* orange duotone veil — warms the portrait into the theme */}
            <span
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(155deg, rgba(255,107,26,0.28), rgba(207,78,0,0.12) 55%, rgba(0,0,0,0.25))",
                mixBlendMode: "multiply",
              }}
              aria-hidden
            />
            <span
              className="pointer-events-none absolute inset-0"
              style={{
                background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent 42%)",
              }}
              aria-hidden
            />
            <div className="absolute bottom-5 right-5 left-5 flex items-center justify-between">
              <span className="text-sm font-extrabold text-white">{d.name}</span>
              <span className="text-[10px] font-semibold tracking-normal text-[var(--color-kos-accent)]">
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
          className="flex size-11 items-center justify-center rounded-full border border-[var(--color-kos-line)] bg-[#171717]/80 text-[var(--color-kos-ink)] transition-colors hover:border-[var(--color-kos-primary)] hover:text-[var(--color-kos-primary-dim)]"
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
                  ? "w-8 bg-[var(--color-kos-primary)]"
                  : "w-2 bg-[var(--color-kos-line)] hover:bg-[var(--color-kos-primary-dim)]"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => go(1)}
          aria-label="الأخصائية التالية"
          className="flex size-11 items-center justify-center rounded-full border border-[var(--color-kos-line)] bg-[#171717]/80 text-[var(--color-kos-ink)] transition-colors hover:border-[var(--color-kos-primary)] hover:text-[var(--color-kos-primary-dim)]"
        >
          <Icon.ChevronLeft className="size-5" />
        </button>
      </div>
    </div>
  );
}
