"use client";

import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LuBadgePercent } from "react-icons/lu";
import { Icon } from "@/components/icons";
import { GOLD_GRADIENT, toArabicDigits } from "@/app/_home/config";
import { OfferCard } from "./OfferCard";
import { OfferBookingModal } from "./OfferBookingModal";
import type { OfferItem } from "./types";

const ALL = "الكل";
const UNCATEGORISED = "أخرى";
const EASE = [0.22, 1, 0.36, 1] as const;

/** Sticky category chips + animated offer grid + the booking modal. */
export function OfferGrid({ offers }: { offers: OfferItem[] }) {
  const categories = useMemo(() => {
    const seen = new Set<string>();
    for (const o of offers) seen.add(o.category ?? UNCATEGORISED);
    return [ALL, ...seen];
  }, [offers]);

  const [active, setActive] = useState(ALL);
  const [selected, setSelected] = useState<OfferItem | null>(null);
  const close = useCallback(() => setSelected(null), []);

  const visible =
    active === ALL
      ? offers
      : offers.filter((o) => (o.category ?? UNCATEGORISED) === active);

  if (offers.length === 0) {
    return (
      <div className="mx-auto max-w-[1180px] px-[22px] pt-12">
        <EmptyState />
      </div>
    );
  }

  return (
    <>
      {/* filter bar: sticks under the collapsed 74px nav */}
      <div className="sticky top-[74px] z-30 border-b border-[var(--color-md-line)] bg-[rgba(11,8,5,0.86)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-4 px-[22px] py-3">
          <div
            role="group"
            aria-label="تصفية العروض حسب الفئة"
            className="md-carousel -mx-1 flex gap-2 overflow-x-auto px-1 py-1"
          >
            {categories.map((cat) => {
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
            المواعيد محدودة أسبوعياً
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-[1180px] px-[22px] pt-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-[0.84rem] font-bold text-[rgba(246,238,223,0.55)]">
          <span className="inline-flex items-center gap-2">
            <LuBadgePercent className="size-4 text-[var(--color-md-champagne)]" />
            <span aria-live="polite">
              {toArabicDigits(visible.length)} {visible.length === 1 ? "عرض" : visible.length === 2 ? "عرضان" : visible.length <= 10 ? "عروض" : "عرضاً"}
              {active !== ALL ? ` في ${active}` : ""}
            </span>
          </span>
          <span className="inline-flex items-center gap-2">
            <Icon.ShieldCheck className="size-4 text-[var(--color-md-champagne)]" />
            تكلفة واضحة قبل الجلسة، والدفع داخل العيادة
          </span>
        </div>

        {visible.length === 0 ? (
          <EmptyState category={active} onReset={() => setActive(ALL)} />
        ) : (
          <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            <AnimatePresence mode="popLayout" initial={false}>
              {visible.map((offer, i) => (
                <motion.div
                  key={offer.id}
                  layout
                  initial={{ opacity: 0, y: 24, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.18 } }}
                  transition={{ duration: 0.45, ease: EASE, delay: Math.min(i, 8) * 0.04 }}
                >
                  <OfferCard offer={offer} onBook={setSelected} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <OfferBookingModal offer={selected} onClose={close} />
    </>
  );
}

function EmptyState({
  category,
  onReset,
}: {
  category?: string;
  onReset?: () => void;
}) {
  return (
    <div className="flex flex-col items-center rounded-[28px] border border-dashed border-[var(--color-md-line-strong)] bg-[var(--color-md-card)] px-7 py-14 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl border border-[var(--color-md-line)] bg-[rgba(232,195,106,0.08)] text-[var(--color-md-champagne)]">
        <Icon.Gift className="size-6" strokeWidth={1.8} />
      </span>
      <h3 className="mt-5 text-[1.2rem] font-extrabold text-[var(--color-md-text)]">
        {category ? `لا توجد عروض حالية في ${category}` : "لا توجد عروض حالية"}
      </h3>
      <p className="mt-2 max-w-[44ch] text-[0.92rem] leading-[1.85] font-light text-[rgba(246,238,223,0.58)]">
        نحدّث العروض باستمرار. احجزي استشارتك الآن وسنخبرك بأي عرض يناسب حالتك عند التواصل.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {onReset ? (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-full border border-[rgba(240,212,138,0.35)] px-6 py-3 text-[0.9rem] font-extrabold text-[var(--color-md-champagne)] transition-colors hover:bg-[rgba(240,212,138,0.1)]"
          >
            عرض كل العروض
          </button>
        ) : null}
        <a
          href="/book-now"
          className="inline-flex min-h-12 items-center gap-2 rounded-full px-6 py-3 text-[0.9rem] font-extrabold text-[var(--color-md-ink)]"
          style={{ background: GOLD_GRADIENT }}
        >
          <Icon.CalendarCheck className="size-4" />
          احجزي استشارة
        </a>
      </div>
    </div>
  );
}
