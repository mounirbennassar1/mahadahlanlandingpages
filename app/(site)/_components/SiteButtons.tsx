import Link from "next/link";
import type { ReactNode } from "react";
import { SocialIcon } from "@/components/icons";
import { GOLD_GRADIENT, WA_LINK } from "@/app/_home/config";

/* Shared class recipes for the site pages (mirror the home page). */

export const GOLD_PILL =
  "inline-flex items-center justify-center gap-2.5 rounded-full px-[30px] py-4 text-base font-extrabold text-[var(--color-md-ink)] shadow-[0_0_34px_-8px_rgba(232,195,106,0.6)] transition-all duration-300 hover:-translate-y-[3px] hover:shadow-[0_0_46px_-8px_rgba(255,223,142,0.8)]";

export const OUTLINE_PILL =
  "inline-flex items-center justify-center gap-2.5 rounded-full border border-[rgba(240,212,138,0.35)] px-[30px] py-4 text-base font-extrabold text-[#F0D48A] transition-all duration-300 hover:bg-[rgba(240,212,138,0.1)] hover:shadow-[0_0_28px_-8px_rgba(255,233,168,0.5)]";

export const CARD =
  "rounded-[24px] border border-[var(--color-md-line)] bg-[var(--color-md-card)] transition-[transform,border-color,box-shadow] duration-400 hover:-translate-y-1.5 hover:border-[rgba(232,195,106,0.5)] hover:shadow-[0_0_40px_-14px_rgba(232,195,106,0.45)]";

export const CHIP =
  "inline-flex items-center rounded-full border border-[var(--color-md-line)] bg-[rgba(232,195,106,0.06)] px-3 py-1 text-[0.76rem] font-bold text-[rgba(246,238,223,0.78)]";

/** Mobile snap carousel that becomes a grid from `md`. */
export const CAROUSEL =
  "md-carousel relative -mx-[22px] flex snap-x snap-mandatory gap-4 overflow-x-auto px-[22px] pt-4 pb-2 scroll-px-[22px] md:mx-0 md:grid md:snap-none md:gap-6 md:overflow-visible md:px-0 md:pt-4 md:pb-0";

export const CAROUSEL_ITEM =
  "w-[78vw] max-w-[340px] shrink-0 snap-center md:w-auto md:max-w-none";

export function GoldLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link href={href} className={`${GOLD_PILL} ${className}`} style={{ background: GOLD_GRADIENT }}>
      {children}
    </Link>
  );
}

export function OutlineLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link href={href} className={`${OUTLINE_PILL} ${className}`}>
      {children}
    </Link>
  );
}

/** Outline WhatsApp pill (opens in a new tab). */
export function WhatsAppLink({
  href = WA_LINK,
  label = "استشارة عبر واتساب",
  className = "",
}: {
  href?: string;
  label?: string;
  className?: string;
}) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`${OUTLINE_PILL} ${className}`}>
      <SocialIcon name="whatsapp" className="text-[19px]" />
      {label}
    </a>
  );
}
