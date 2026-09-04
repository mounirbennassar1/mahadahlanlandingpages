"use client";

import { motion } from "framer-motion";
import { SocialIcon } from "@/components/icons";
import { EASE } from "./Reveal";
import { GOLD_GRADIENT, WA_LINK } from "./config";

/** Mobile-only sticky CTA bar — dark burgundy glass, gold book button. */
export function StickyBar({ label }: { label: string }) {
  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.5, ease: EASE }}
      className="fixed inset-x-0 bottom-0 z-[80] flex gap-2.5 border-t border-[rgba(217,179,108,0.22)] bg-[rgba(21,4,9,0.94)] px-3.5 pt-[11px] pb-[calc(11px+env(safe-area-inset-bottom))] backdrop-blur-xl md:hidden"
    >
      <a
        href="#booking"
        className="inline-flex flex-1 items-center justify-center rounded-full py-3.5 text-[0.95rem] font-extrabold text-[var(--color-faa-cta-ink)]"
        style={{ background: GOLD_GRADIENT }}
      >
        {label}
      </a>
      <a
        href={WA_LINK}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="تواصلي عبر واتساب"
        className="inline-flex w-[52px] shrink-0 items-center justify-center rounded-full bg-[#25D366] text-[#0B2B18]"
        style={{ animation: "faa-pulse 2.6s infinite" }}
      >
        <SocialIcon name="whatsapp" className="text-2xl" />
      </a>
    </motion.div>
  );
}
