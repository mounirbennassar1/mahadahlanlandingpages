"use client";

import { motion } from "framer-motion";
import { SocialIcon } from "@/components/icons";
import { GOLD_GRADIENT, WA_LINK } from "./config";

/** Mobile-only sticky CTA bar: midnight glass, gold book button + WhatsApp. */
export function StickyBar() {
  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 bottom-0 z-[100] flex gap-2.5 border-t border-[var(--color-che-line)] bg-[rgba(20,12,34,0.92)] px-3.5 pt-2.5 pb-[calc(10px+env(safe-area-inset-bottom))] backdrop-blur-xl md:hidden"
    >
      <a
        href="#booking"
        className="inline-flex flex-1 items-center justify-center gap-2 rounded-[4px] py-[13px] text-[0.9rem] font-extrabold text-[#231303]"
        style={{ background: GOLD_GRADIENT }}
      >
        احجزي موعدك
      </a>
      <a
        href={WA_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex flex-1 items-center justify-center gap-2 rounded-[4px] bg-[#25D366] py-[13px] text-[0.9rem] font-extrabold text-[#0B2B16]"
      >
        <SocialIcon name="whatsapp" className="text-base" />
        واتساب
      </a>
    </motion.div>
  );
}
