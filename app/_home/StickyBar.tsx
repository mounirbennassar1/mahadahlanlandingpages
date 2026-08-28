"use client";

import { motion } from "framer-motion";
import { Icon, SocialIcon } from "@/components/icons";
import { GOLD_GRADIENT, WA_LINK } from "./config";

/** Home-only mobile sticky bar: black glass with a gold booking button.
 *  (The shared MobileStickyCTA is white glass and belongs to the light landings.) */
export function StickyBar({ bookHref = "#contact" }: { bookHref?: string }) {
  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[rgba(201,156,78,0.25)] bg-[rgba(11,8,5,0.92)] px-3 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] shadow-[0_-14px_34px_-12px_rgba(0,0,0,0.9)] backdrop-blur-xl md:hidden"
    >
      <div className="grid grid-cols-[1fr_auto] gap-2">
        <a
          href={bookHref}
          className="flex h-12 items-center justify-center gap-2 rounded-2xl text-sm font-extrabold text-[var(--color-md-ink)] shadow-[0_0_24px_-6px_rgba(232,195,106,0.6)] transition-transform active:scale-[0.98]"
          style={{ background: GOLD_GRADIENT }}
        >
          <Icon.CalendarCheck className="size-4" />
          احجزي الآن
        </a>
        <a
          href={WA_LINK}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="تواصلي عبر واتساب"
          className="relative flex size-12 items-center justify-center rounded-2xl bg-[#25D366] text-white shadow-md transition-transform active:scale-[0.95]"
        >
          <span
            className="absolute -inset-1 animate-ping rounded-2xl bg-[#25D366]/30"
            aria-hidden
          />
          <SocialIcon name="whatsapp" className="relative text-2xl" />
        </a>
      </div>
    </motion.div>
  );
}
