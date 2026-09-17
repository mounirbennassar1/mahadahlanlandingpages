"use client";

import { useEffect } from "react";
import { fireConversion } from "@/lib/gtag";

/** Fires the page's FORM conversion once when a payment is confirmed. */
export function FirePurchase({ reference }: { reference: string }) {
  useEffect(() => {
    const key = `md-purchase-${reference}`;
    try {
      if (window.sessionStorage.getItem(key)) return;
      window.sessionStorage.setItem(key, "1");
    } catch {
      /* storage blocked: fire anyway */
    }
    fireConversion("form");
  }, [reference]);
  return null;
}
