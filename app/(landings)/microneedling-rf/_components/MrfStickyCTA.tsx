"use client";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { Icon } from "@/components/icons";
import { PayButton } from "@/components/checkout";

/** White-glass mobile sticky bar: pay button + WhatsApp ask (local variant of the shared MobileStickyCTA). */
export function MrfStickyCTA({ whatsappHref }: { whatsappHref: string }) {
  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{ borderTopColor: "var(--color-mrf-line)" }}
      className="fixed inset-x-0 bottom-0 z-50 border-t bg-white/95 px-3 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] shadow-[0_-10px_30px_-10px_rgba(0,0,0,0.1)] backdrop-blur-xl md:hidden"
    >
      <div className="grid grid-cols-[1fr_auto] gap-2">
        <PayButton
          style={{ background: "var(--color-mrf-ink)" }}
          className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-2xl text-sm font-bold text-white shadow-md transition-transform active:scale-[0.98]"
        >
          <Icon.CreditCard className="size-4" />
          احجزي وادفعي الآن
        </PayButton>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="اسألي عبر واتساب"
          className="relative flex size-12 items-center justify-center rounded-2xl bg-[#25D366] text-white shadow-md transition-transform active:scale-[0.95]"
        >
          <span className="absolute -inset-1 animate-ping rounded-2xl bg-[#25D366]/30" aria-hidden />
          <FontAwesomeIcon icon={faWhatsapp} className="relative text-2xl" />
        </a>
      </div>
    </motion.div>
  );
}
