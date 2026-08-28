"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LuLayoutGrid } from "react-icons/lu";
import { Icon } from "@/components/icons";
import {
  CATEGORIES,
  CATEGORY_ALL,
  GOLD_GRADIENT,
  SPECIALTIES,
  type Category,
} from "@/app/_home/config";
import { ServiceCard } from "./ServiceCard";

const EASE = [0.22, 1, 0.36, 1] as const;

/** "14 خدمة", "6 خدمات", "خدمتان", "خدمة واحدة" (Western digits). */
function countLabel(n: number) {
  if (n === 1) return "خدمة واحدة";
  if (n === 2) return "خدمتان";
  if (n <= 10) return `${n} خدمات`;
  return `${n} خدمة`;
}

/**
 * Sticky category chips + animated grid of every treatment landing.
 * Reads `SPECIALTIES` directly (the entries carry icon components, which
 * cannot cross the server/client boundary as props).
 */
export function ServicesGrid() {
  const [active, setActive] = useState<Category>(CATEGORY_ALL);

  const visible =
    active === CATEGORY_ALL
      ? SPECIALTIES
      : SPECIALTIES.filter((s) => s.category === active);

  return (
    <>
      {/* filter bar: sticks under the collapsed 74px nav */}
      <div className="sticky top-[74px] z-30 border-b border-[var(--color-md-line)] bg-[rgba(11,8,5,0.86)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-4 px-[22px] py-3">
          <div
            role="group"
            aria-label="تصفية الخدمات حسب الفئة"
            className="md-carousel -mx-1 flex gap-2 overflow-x-auto px-1 py-1"
          >
            {CATEGORIES.map((cat) => {
              const on = cat === active;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActive(cat)}
                  aria-pressed={on}
                  className={`shrink-0 cursor-pointer rounded-full border px-4 py-2 text-[0.82rem] font-extrabold transition-all duration-300 ${
                    on
                      ? "border-transparent text-[var(--color-md-ink)] shadow-[0_0_24px_-8px_rgba(232,195,106,0.7)]"
                      : "border-[var(--color-md-line-strong)] text-[rgba(246,238,223,0.72)] hover:border-[rgba(232,195,106,0.6)] hover:text-[var(--color-md-champagne)]"
                  }`}
                  style={on ? { background: GOLD_GRADIENT } : undefined}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <span className="hidden shrink-0 items-center gap-2 text-[0.78rem] font-bold text-[rgba(246,238,223,0.55)] md:inline-flex">
            <span
              className="size-1.5 rounded-full bg-[var(--color-md-neon)]"
              style={{ animation: "md-neon-pulse 2.4s ease-in-out infinite" }}
              aria-hidden
            />
            طاقم نسائي بالكامل
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-[1180px] px-[22px] pt-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-[0.84rem] font-bold text-[rgba(246,238,223,0.55)]">
          <span className="inline-flex items-center gap-2">
            <LuLayoutGrid className="size-4 text-[var(--color-md-champagne)]" aria-hidden />
            <span aria-live="polite">
              {countLabel(visible.length)}
              {active !== CATEGORY_ALL ? ` في ${active}` : ""}
            </span>
          </span>
          <span className="inline-flex items-center gap-2">
            <Icon.ShieldCheck className="size-4 text-[var(--color-md-champagne)]" aria-hidden />
            كل خدمة تبدأ بتقييم مع الطبيبة وتكلفة واضحة قبل الجلسة
          </span>
        </div>

        <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((item, i) => (
              <motion.div
                key={item.slug}
                layout
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.18 } }}
                transition={{ duration: 0.45, ease: EASE, delay: Math.min(i, 8) * 0.04 }}
              >
                <ServiceCard item={item} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
}
