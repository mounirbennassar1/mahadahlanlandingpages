"use client";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { Icon } from "@/components/icons";

type Props = {
  bookHref: string;
  waHref: string;
};

/** Dark-theme mobile sticky bar — local variant of MobileStickyCTA
 *  (the shared component is styled for light landings). */
export function GlassStickyCTA({ bookHref, waHref }: Props) {
  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--color-gls-line)] bg-[#1d2023]/92 px-3 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] shadow-[0_-14px_36px_-12px_rgba(0,0,0,0.55)] backdrop-blur-xl md:hidden"
    >
      <div className="grid grid-cols-[1fr_auto] gap-2">
        <a
          href={bookHref}
          className="flex h-12 items-center justify-center gap-2 rounded-2xl text-sm font-extrabold text-[#1d2023] shadow-[0_10px_24px_-10px_rgba(212,175,55,0.6)] transition-transform active:scale-[0.98]"
          style={{
            background: "linear-gradient(120deg, #f0d98c 0%, #d4af37 55%, #b8912e 100%)",
          }}
        >
          <Icon.CalendarCheck className="size-4" />
          احجزي الآن
        </a>
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="تواصلي عبر واتساب"
          className="relative flex size-12 items-center justify-center rounded-2xl bg-[#25D366] text-white shadow-md transition-transform active:scale-[0.95]"
        >
          <span
            className="absolute -inset-1 animate-ping rounded-2xl bg-[#25D366]/30"
            aria-hidden
          />
          <FontAwesomeIcon icon={faWhatsapp} className="relative text-2xl" />
        </a>
      </div>
    </motion.div>
  );
}
