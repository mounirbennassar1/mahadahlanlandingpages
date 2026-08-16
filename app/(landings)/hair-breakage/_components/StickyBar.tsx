"use client";

import { motion } from "framer-motion";
import { SocialIcon } from "@/components/icons";
import { GOLD_GRADIENT, WA_LINK } from "./config";

/** Mobile-only sticky CTA bar: obsidian glass, gold book button + WhatsApp. */
export function StickyBar() {
  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 bottom-0 z-[100] flex gap-2.5 border-t border-[rgba(212,175,55,0.25)] bg-[rgba(11,11,13,0.92)] px-3.5 pt-2.5 pb-[calc(10px+env(safe-area-inset-bottom))] backdrop-blur-xl md:hidden"
    >
      <a
        href="#booking"
        className="inline-flex flex-1 items-center justify-center gap-2 rounded-full py-[13px] text-[0.9rem] font-extrabold text-[#1A1405]"
        style={{ background: GOLD_GRADIENT }}
      >
        احجزي موعدك
      </a>
      <a
        href={WA_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#25D366] py-[13px] text-[0.9rem] font-extrabold text-[#0B2B16]"
      >
        <SocialIcon name="whatsapp" className="text-base" />
        واتساب
      </a>
    </motion.div>
  );
}
