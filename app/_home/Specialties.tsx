"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useMemo, useState, type PointerEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@/components/icons";
import {
  CATEGORIES,
  CATEGORY_ALL,
  SPECIALTIES,
  toArabicDigits,
  type Category,
} from "./config";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Specialties() {
  const [active, setActive] = useState<Category>(CATEGORY_ALL);

  const visible = useMemo(
    () =>
      active === CATEGORY_ALL
        ? SPECIALTIES
        : SPECIALTIES.filter((s) => s.category === active),
    [active],
  );

  const onPointerMove = useCallback((e: PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  }, []);

  return (
    <>
      {/* filter pills */}
      <div className="mt-10 flex flex-wrap justify-center gap-2 sm:gap-2.5">
        {CATEGORIES.map((cat) => {
          const isActive = cat === active;
          const count =
            cat === CATEGORY_ALL
              ? SPECIALTIES.length
              : SPECIALTIES.filter((s) => s.category === cat).length;

          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActive(cat)}
              aria-pressed={isActive}
              className={`relative inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-[0.8rem] font-extrabold transition-colors duration-300 sm:gap-2 sm:px-5 sm:py-2.5 sm:text-[0.85rem] ${
                isActive
                  ? "border-transparent text-[#F0D48A]"
                  : "border-[var(--color-md-line-strong)] bg-[rgba(255,253,249,0.7)] text-[var(--color-md-ink-soft)] hover:border-[var(--color-md-gold)] hover:text-[var(--color-md-bronze)]"
              }`}
            >
              {isActive ? (
                <motion.span
                  layoutId="specialty-pill"
                  transition={{ duration: 0.45, ease: EASE }}
                  className="absolute inset-0 rounded-full bg-[var(--color-md-dark)]"
                  aria-hidden
                />
              ) : null}
              <span className="relative">{cat}</span>
              <span
                className={`relative text-[0.72rem] font-bold ${
                  isActive ? "text-[#F0D48A]/60" : "text-[rgba(39,28,17,0.4)]"
                }`}
              >
                {toArabicDigits(count)}
              </span>
            </button>
          );
        })}
      </div>

      {/* cards */}
      <motion.div
        layout
        transition={{ duration: 0.45, ease: EASE }}
        className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:gap-6"
      >
        <AnimatePresence mode="popLayout">
          {visible.map((item, i) => (
            <motion.article
              key={item.slug}
              layout
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, ease: EASE, delay: (i % 3) * 0.07 }}
              onPointerMove={onPointerMove}
              className="group relative flex flex-col overflow-hidden rounded-[18px] border border-[var(--color-md-line)] bg-[var(--color-md-card)] shadow-[0_18px_40px_-30px_rgba(138,100,48,0.45)] transition-[transform,box-shadow,border-color] duration-400 hover:-translate-y-1.5 hover:border-[rgba(166,124,61,0.42)] hover:shadow-[0_34px_64px_-30px_rgba(138,100,48,0.5)] sm:rounded-[26px]"
            >
              <div
                className="md-spot-glow pointer-events-none absolute inset-0 z-[3] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                aria-hidden
              />

              {/* media */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 46vw, (max-width: 1024px) 31vw, 360px"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
                  style={{ objectPosition: item.focus ?? "center" }}
                />
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(39,28,17,.72), rgba(39,28,17,.12) 46%, transparent 70%)",
                  }}
                  aria-hidden
                />

                {/* the category is redundant with the active filter, and a
                    two-up card on a phone has no room for it */}
                <span className="absolute top-4 right-4 hidden rounded-full border border-white/25 bg-black/25 px-3 py-1.5 text-[0.7rem] font-bold text-[#F5EFE4] backdrop-blur-md sm:block">
                  {item.category}
                </span>

                <span className="absolute right-2.5 bottom-2.5 inline-flex max-w-[calc(100%-1.25rem)] items-center gap-1 rounded-full bg-[rgba(255,253,249,0.94)] px-2 py-1 text-[0.6rem] font-extrabold text-[var(--color-md-bronze)] shadow-[0_10px_22px_-12px_rgba(39,28,17,0.6)] sm:right-4 sm:bottom-4 sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-[0.72rem]">
                  <Icon.BadgeCheck className="size-3 shrink-0 sm:size-3.5" />
                  {item.tag}
                </span>

                <span className="absolute bottom-3 left-3 text-[0.68rem] font-extrabold tracking-[0.14em] text-white/45 sm:bottom-4 sm:left-4 sm:text-[0.78rem]">
                  {toArabicDigits(String(i + 1).padStart(2, "0"))}
                </span>
              </div>

              {/* body — intentionally not `relative`, so the link's overlay
                  below stretches across the whole card, image included */}
              <div className="z-[4] flex flex-1 flex-col p-4 sm:p-6">
                <span
                  className="mb-3 inline-flex size-9 items-center justify-center rounded-xl border border-[var(--color-md-line)] bg-[var(--color-md-cream)] text-[var(--color-md-bronze)] transition-colors duration-400 group-hover:border-[var(--color-md-gold)] sm:mb-4 sm:size-11 sm:rounded-2xl"
                  aria-hidden
                >
                  <item.icon className="size-4 sm:size-5" strokeWidth={1.9} />
                </span>

                <h3 className="text-[0.92rem] leading-[1.55] font-extrabold text-balance text-[var(--color-md-ink)] sm:text-[1.15rem] sm:leading-[1.5]">
                  {item.title}
                </h3>
                {/* clamped two-up on phones so a long blurb can't stretch the
                    row; full copy from sm up */}
                <p className="mt-2 line-clamp-3 flex-1 text-[0.78rem] leading-[1.7] font-light text-[rgba(39,28,17,0.66)] sm:mt-2.5 sm:line-clamp-none sm:text-[0.92rem] sm:leading-[1.85]">
                  {item.description}
                </p>

                <Link
                  href={`/${item.slug}`}
                  className="mt-3 inline-flex items-center gap-1.5 text-[0.75rem] font-extrabold text-[var(--color-md-bronze)] transition-colors duration-300 hover:text-[var(--color-md-gold-bright)] sm:mt-5 sm:gap-2 sm:text-[0.88rem]"
                >
                  <span className="absolute inset-0" aria-hidden />
                  اكتشفي البرنامج
                  <Icon.ArrowLeft
                    className="size-3.5 shrink-0 transition-transform duration-300 group-hover:-translate-x-1.5 sm:size-4"
                    strokeWidth={2.4}
                  />
                </Link>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
