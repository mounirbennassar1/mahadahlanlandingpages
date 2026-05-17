"use client";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

type Props = {
  /** CSS-token prefix scoped to this landing (e.g. "dc", "hp"). Reserved for future palette-aware styling — currently unused. */
  tokenPrefix?: string;
  whatsappNumber: string;
  topicMessage: string;
};

export function WhatsAppFAB({ whatsappNumber, topicMessage }: Props) {
  const href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(topicMessage)}`;

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="تواصلي عبر واتساب"
      initial={{ opacity: 0, scale: 0, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1, type: "spring", stiffness: 200, damping: 18 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      className="fixed bottom-6 right-6 z-50 hidden size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl shadow-emerald-500/30 md:flex"
    >
      <span
        className="absolute -inset-1 animate-ping rounded-full bg-[#25D366]/40"
        aria-hidden
      />
      <FontAwesomeIcon icon={faWhatsapp} className="relative text-2xl" />
    </motion.a>
  );
}
