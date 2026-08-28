"use client";

import Image from "next/image";
import { Icon } from "@/components/icons";
import { GOLD_GRADIENT, toArabicDigits } from "@/app/_home/config";
import { PayLogo } from "@/app/_home/PayLogo";
import { isOptimizableImage } from "@/lib/site";
import type { OfferItem } from "./types";

const CATEGORY_ICONS: Record<string, typeof Icon.Gift> = {
  الكشفيات: Icon.Stethoscope,
  البشرة: Icon.Sparkles,
  الليزر: Icon.Zap,
  الشعر: Icon.Wind,
  الجسم: Icon.Activity,
  الوجه: Icon.Smile,
};

export function OfferCard({
  offer,
  onBook,
}: {
  offer: OfferItem;
  onBook: (offer: OfferItem) => void;
}) {
  const CatIcon = CATEGORY_ICONS[offer.category ?? ""] ?? Icon.Gift;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-[var(--color-md-line)] bg-[var(--color-md-card)] transition-[transform,border-color,box-shadow] duration-400 hover:-translate-y-1.5 hover:border-[rgba(232,195,106,0.5)] hover:shadow-[0_0_40px_-14px_rgba(232,195,106,0.45)]">
      {/* visual */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {offer.image ? (
          <Image
            src={offer.image}
            alt={offer.imageAlt ?? offer.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
            unoptimized={!isOptimizableImage(offer.image)}
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: GOLD_GRADIENT }}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-60"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(36,26,14,.22) 1px, transparent 1px)",
                backgroundSize: "18px 18px",
              }}
              aria-hidden
            />
            <span className="relative flex size-20 items-center justify-center rounded-full border border-[rgba(36,26,14,0.28)] bg-[rgba(36,26,14,0.16)] text-[var(--color-md-ink)] shadow-[0_18px_40px_-18px_rgba(36,26,14,0.8)] transition-transform duration-500 group-hover:scale-110">
              <CatIcon className="size-9" strokeWidth={1.6} />
            </span>
          </div>
        )}

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[var(--color-md-card)] to-transparent"
          aria-hidden
        />

        {offer.badge ? (
          <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 rounded-full border border-[rgba(240,212,138,0.45)] bg-[rgba(11,8,5,0.85)] px-3.5 py-1.5 text-[0.74rem] font-extrabold text-[var(--color-md-champagne)] backdrop-blur-md">
            <span
              className="size-1.5 rounded-full bg-[var(--color-md-neon)]"
              style={{ animation: "md-neon-pulse 2.4s ease-in-out infinite" }}
              aria-hidden
            />
            {offer.badge}
          </span>
        ) : null}

        {offer.savePercent ? (
          <span className="absolute top-4 left-4 rounded-full bg-[rgba(11,8,5,0.85)] px-3 py-1.5 text-[0.72rem] font-extrabold text-[#9BE8B0] backdrop-blur-md">
            وفّري {toArabicDigits(offer.savePercent)}٪
          </span>
        ) : null}
      </div>

      {/* copy */}
      <div className="flex flex-1 flex-col p-6">
        {offer.category ? (
          <span className="inline-flex items-center gap-1.5 text-[0.74rem] font-bold text-[var(--color-md-champagne)]">
            <CatIcon className="size-3.5" strokeWidth={2} />
            {offer.category}
          </span>
        ) : null}

        <h3 className="mt-2 text-[1.12rem] leading-[1.5] font-extrabold text-[var(--color-md-text)]">
          {offer.title}
        </h3>

        {offer.description ? (
          <p className="mt-2 text-[0.9rem] leading-[1.85] font-light text-[rgba(246,238,223,0.58)]">
            {offer.description}
          </p>
        ) : null}

        <div className="mt-auto flex flex-wrap items-baseline gap-x-3 gap-y-1 pt-5">
          <span className="md-gold-glow inline-block">
            <span className="md-gold-text text-[1.75rem] leading-none font-extrabold">
              {offer.priceLabel}
            </span>
          </span>
          {offer.oldPriceLabel ? (
            <s className="text-[0.95rem] font-bold text-[rgba(246,238,223,0.38)]">
              {offer.oldPriceLabel}
            </s>
          ) : null}
        </div>

        <button
          type="button"
          onClick={() => onBook(offer)}
          className="mt-5 inline-flex min-h-12 cursor-pointer items-center justify-center gap-2.5 rounded-full px-6 py-3.5 text-[0.95rem] font-extrabold text-[var(--color-md-ink)] shadow-[0_0_30px_-8px_rgba(232,195,106,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_40px_-8px_rgba(255,223,142,0.75)]"
          style={{ background: GOLD_GRADIENT }}
        >
          <Icon.CalendarCheck className="size-[17px]" />
          احجزي العرض
        </button>

        <div className="mt-4 flex items-center justify-center gap-2.5 text-[0.74rem] font-bold text-[rgba(246,238,223,0.5)]">
          قسّطيها مع
          <PayLogo brand="tabby" height={18} />
          <PayLogo brand="tamara" height={18} />
        </div>
      </div>
    </article>
  );
}
