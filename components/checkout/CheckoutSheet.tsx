"use client";

import { useEffect, useId, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@/components/icons";
import { almarai } from "@/lib/fonts";
import { CheckoutForm } from "./CheckoutForm";
import { useCheckout } from "./CheckoutContext";
import { themeVars } from "./theme";

const EASE = [0.22, 1, 0.36, 1] as const;
const subscribeNoop = () => () => {};
const getBody = () => document.body;
const getServerBody = () => null;

/**
 * The checkout dialog every "pay" button opens: bottom sheet on phones, a
 * centred card from `sm` up. Portal-mounted on <body> with its own palette and
 * font so it looks the same on every landing.
 */
export function CheckoutSheet() {
  const host = useSyncExternalStore(subscribeNoop, getBody, getServerBody);
  const { isOpen, close, items, page, selectedId, whatsappHref } = useCheckout();
  if (!host) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen ? (
        <Dialog
          key={selectedId ?? "sheet"}
          onClose={close}
          items={items}
          page={page}
          selectedId={selectedId}
          whatsappHref={whatsappHref}
        />
      ) : null}
    </AnimatePresence>,
    host,
  );
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function Dialog({
  onClose,
  items,
  page,
  selectedId,
  whatsappHref,
}: {
  onClose: () => void;
} & Pick<ReturnType<typeof useCheckout>, "items" | "page" | "selectedId" | "whatsappHref">) {
  const panelRef = useRef<HTMLDivElement>(null);
  const uid = useId();
  const titleId = `${uid}-title`;
  const selected = items.find((i) => i.id === selectedId) ?? null;

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => panelRef.current?.focus(), 40);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const nodes = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null);
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const current = document.activeElement;
      if (e.shiftKey && (current === first || current === panelRef.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && current === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  return (
    <motion.div
      dir="rtl"
      className={`${almarai.className} fixed inset-0 z-[200] flex items-end justify-center sm:items-center sm:p-6`}
      style={themeVars("dark")}
      data-lenis-prevent
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
    >
      <button
        type="button"
        aria-label="إغلاق"
        onClick={onClose}
        tabIndex={-1}
        className="absolute inset-0 cursor-default bg-[rgba(5,3,1,0.76)] backdrop-blur-sm"
      />

      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        initial={{ y: 48, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0, transition: { duration: 0.22 } }}
        transition={{ duration: 0.4, ease: EASE }}
        className="relative flex max-h-[94dvh] w-full flex-col overflow-hidden rounded-t-[28px] border border-[var(--ck-line-strong)] bg-[var(--ck-bg)] text-[var(--ck-text)] shadow-[0_-20px_80px_-30px_rgba(232,195,106,0.35)] outline-none sm:max-w-[600px] sm:rounded-[28px] sm:shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9),0_0_60px_-20px_rgba(232,195,106,0.35)]"
        style={{ lineHeight: 1.7 }}
      >
        <span className="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-[rgba(246,238,223,0.18)] sm:hidden" aria-hidden />

        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-[var(--ck-line)] px-6 pt-4 pb-4 sm:pt-6">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-2 text-[0.74rem] font-bold text-[var(--ck-champagne)]">
              <span className="size-1.5 animate-pulse rounded-full bg-[#34D399]" aria-hidden />
              دفع آمن عبر noon payments
            </span>
            <h2 id={titleId} className="mt-1.5 text-[1.2rem] leading-[1.5] font-extrabold text-[var(--ck-text)]">
              {selected ? selected.title : "احجزي وادفعي الآن"}
            </h2>
            <p className="m-0 mt-1 text-[0.82rem] text-[var(--ck-muted)]">
              {selected
                ? `${selected.priceLabel} · ${page.title}`
                : `اختاري باقتك في ${page.title}، أدخلي بياناتك، وأكملي الدفع في أقل من دقيقة.`}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[var(--ck-line-strong)] text-[var(--ck-muted)] transition-colors hover:border-[var(--ck-gold)] hover:text-[var(--ck-champagne)]"
          >
            <Icon.X className="size-5" />
          </button>
        </header>

        <div className="overflow-y-auto overscroll-contain px-6 py-5" data-lenis-prevent>
          <CheckoutForm items={items} page={page} initialItemId={selectedId} whatsappHref={whatsappHref} variant="sheet" />
        </div>
      </motion.div>
    </motion.div>
  );
}
