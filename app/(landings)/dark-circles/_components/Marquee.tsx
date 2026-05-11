"use client";

import { Icon } from "@/components/icons";

const ITEMS = [
  "إشراف طبي مباشر",
  "تقنيات معتمدة عالمياً",
  "خطة شخصية لكل حالة",
  "نتائج موثّقة",
  "متابعة بعد العلاج",
  "بيئة هادئة وراقية",
];

/**
 * CSS-only marquee, paused on hover. The track is rendered twice back-to-back
 * so that `translateX(-50%)` loops seamlessly.
 */
export function Marquee() {
  return (
    <div className="relative overflow-hidden border-y border-[var(--color-dc-line)] bg-[var(--color-dc-surface)]/60 py-5 backdrop-blur-sm sm:py-6">
      {/* edge fades — masks the marquee endings so it never looks abruptly cut */}
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[var(--color-dc-bg)] to-transparent sm:w-24" />
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[var(--color-dc-bg)] to-transparent sm:w-24" />

      <div className="overflow-hidden">
        <div className="dc-marquee flex w-max gap-6 text-xs font-semibold tracking-wider text-[var(--color-dc-ink-soft)] sm:gap-12 sm:text-sm">
          {[...ITEMS, ...ITEMS, ...ITEMS, ...ITEMS].map((label, i) => (
            <span
              key={`${label}-${i}`}
              className="flex items-center gap-2 whitespace-nowrap sm:gap-3"
            >
              <Icon.Sparkles className="size-3.5 text-[var(--color-dc-primary)]" />
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
