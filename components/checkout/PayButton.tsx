"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Icon } from "@/components/icons";
import { useOptionalCheckout } from "./CheckoutContext";

export const PAY_LABEL = "احجزي وادفعي الآن";
export const PAY_LABEL_SHORT = "ادفعي الآن";
export const ASK_LABEL = "اسألي عبر واتساب";

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "type" | "children"> & {
  /** Preselect one item in the sheet. */
  itemId?: string;
  /** Replaces the default icon + label. */
  children?: ReactNode;
  label?: string;
  /** Hide the default icon (when the landing supplies its own). */
  noIcon?: boolean;
  iconClassName?: string;
};

/**
 * Opens the checkout sheet. Style it with the landing's own button recipe via
 * `className`/`style`; it renders a plain <button> so every recipe applies.
 * Outside a provider it degrades to a link to /offers so nothing breaks.
 */
export function PayButton({ itemId, children, label = PAY_LABEL, noIcon, iconClassName = "size-5", ...rest }: Props) {
  const checkout = useOptionalCheckout();
  const content = children ?? (
    <>
      {!noIcon && <Icon.CreditCard className={iconClassName} strokeWidth={2} aria-hidden />}
      <span>{label}</span>
    </>
  );

  if (!checkout) {
    return (
      <a href="/offers" className={rest.className} style={rest.style} aria-label={rest["aria-label"]}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" onClick={() => checkout.open(itemId)} {...rest}>
      {content}
    </button>
  );
}
