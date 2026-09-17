"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { WHATSAPP_NUMBER } from "@/app/_home/config";
import type { CheckoutPage, SellableItem } from "@/lib/checkout-types";
import { CheckoutSheet } from "./CheckoutSheet";

type CheckoutContextValue = {
  items: SellableItem[];
  page: CheckoutPage;
  /** wa.me link for "ask on WhatsApp", optionally about one item. */
  whatsappHref: (item?: SellableItem | null) => string;
  /** Opens the checkout sheet, preselecting an item when given. */
  open: (itemId?: string | null) => void;
  close: () => void;
  isOpen: boolean;
  selectedId: string | null;
};

const CheckoutContext = createContext<CheckoutContextValue | null>(null);

/**
 * Wrap a page in this once (server pages pass the items from
 * `getSellableItems()`); any `PayButton` or `useCheckout()` inside can then
 * open the shared checkout sheet.
 */
export function CheckoutProvider({
  items,
  page,
  whatsappTopic,
  children,
}: {
  items: SellableItem[];
  page: CheckoutPage;
  /** Opening line of the WhatsApp message, e.g. "عندي استفسار بخصوص علاج حب الشباب". */
  whatsappTopic?: string;
  children: ReactNode;
}) {
  const [isOpen, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const open = useCallback((itemId?: string | null) => {
    setSelectedId(itemId ?? null);
    setOpen(true);
  }, []);
  const close = useCallback(() => setOpen(false), []);

  const whatsappHref = useCallback(
    (item?: SellableItem | null) => {
      const lines = [
        "السلام عليكم ورحمة الله وبركاته",
        whatsappTopic ?? `عندي استفسار بخصوص ${page.title}`,
        item ? `بخصوص: ${item.title} (${item.priceLabel})` : null,
      ].filter(Boolean);
      return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
    },
    [page.title, whatsappTopic],
  );

  const value = useMemo<CheckoutContextValue>(
    () => ({ items, page, whatsappHref, open, close, isOpen, selectedId }),
    [items, page, whatsappHref, open, close, isOpen, selectedId],
  );

  return (
    <CheckoutContext.Provider value={value}>
      {children}
      <CheckoutSheet />
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error("useCheckout must be used inside <CheckoutProvider>");
  return ctx;
}

/** Same as useCheckout but tolerates being rendered outside a provider (returns null). */
export function useOptionalCheckout() {
  return useContext(CheckoutContext);
}
