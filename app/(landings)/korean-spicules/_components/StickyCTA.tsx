"use client";

import { motion } from "framer-motion";
import { Icon } from "@/components/icons";

type Props = {
  bookHref: string;
  label: string;
};

/** Black-glass mobile sticky bar — form-only funnel (ads traffic), no WhatsApp. */
export function StickyCTA({ bookHref, label }: Props) {
  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--color-kos-line)] bg-black/90 px-3 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] shadow-[0_-14px_36px_-12px_rgba(0,0,0,0.6)] backdrop-blur-xl md:hidden"
    >
      <a
        href={bookHref}
        className="flex h-12 items-center justify-center gap-2 rounded-2xl text-sm font-extrabold text-[#180a02] shadow-[0_10px_24px_-10px_rgba(255,107,26,0.65)] transition-transform active:scale-[0.98]"
        style={{
          background:
            "linear-gradient(120deg, #ffb473 0%, #ff6b1a 55%, #e35500 100%)",
        }}
      >
        <Icon.CalendarCheck className="size-4" />
        {label}
      </a>
    </motion.div>
  );
}
