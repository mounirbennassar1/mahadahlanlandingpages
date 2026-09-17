"use client";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { Icon } from "@/components/icons";
import { PayButton, useOptionalCheckout } from "@/components/checkout";

type Props = {
  tokenPrefix: string;
  /** Fallback anchor when the landing is not wrapped in a CheckoutProvider. */
  bookHref?: string;
  whatsappNumber: string;
  topicMessage: string;
  label?: string;
};

/**
 * Light-theme mobile sticky bar: pay button + WhatsApp ask. Inside a
 * `CheckoutProvider` the primary button opens the checkout sheet; outside it
 * falls back to scrolling to `bookHref`.
 */
export function MobileStickyCTA({
  tokenPrefix,
  bookHref = "#booking",
  whatsappNumber,
  topicMessage,
  label = "احجزي وادفعي الآن",
}: Props) {
  const checkout = useOptionalCheckout();
  const waHref = checkout
    ? checkout.whatsappHref()
    : `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(topicMessage)}`;
  const primaryClass =
    "flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl text-sm font-bold text-white shadow-md transition-transform active:scale-[0.98]";

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        borderTopColor: `var(--color-${tokenPrefix}-line)`,
      }}
      className="fixed inset-x-0 bottom-0 z-50 border-t bg-white/95 px-3 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] shadow-[0_-10px_30px_-10px_rgba(0,0,0,0.1)] backdrop-blur-xl md:hidden"
    >
      <div className="grid grid-cols-[1fr_auto] gap-2">
        {checkout ? (
          <PayButton className={primaryClass} style={{ background: `var(--color-${tokenPrefix}-ink)` }} noIcon>
            <Icon.CreditCard className="size-4" />
            {label}
          </PayButton>
        ) : (
          <a href={bookHref} style={{ background: `var(--color-${tokenPrefix}-ink)` }} className={primaryClass}>
            <Icon.CalendarCheck className="size-4" />
            احجزي الآن
          </a>
        )}
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="اسألي عبر واتساب"
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
