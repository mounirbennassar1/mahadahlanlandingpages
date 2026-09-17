"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { CheckoutStatus } from "@/lib/checkout-types";

const INTERVAL_MS = 3000;
const MAX_POLLS = 40;

/**
 * While noon is still settling the payment, ask the server every few seconds
 * and re-render the page as soon as the status becomes final.
 */
export function StatusPoller({ reference, initial }: { reference: string; initial: CheckoutStatus["status"] }) {
  const router = useRouter();
  const [polls, setPolls] = useState(0);
  const stopped = useRef(false);

  useEffect(() => {
    if (initial !== "PENDING") return;
    let timer: number | undefined;
    let count = 0;

    async function tick() {
      if (stopped.current) return;
      count += 1;
      setPolls(count);
      try {
        const res = await fetch(`/api/checkout/status?ref=${encodeURIComponent(reference)}`, { cache: "no-store" });
        if (res.ok) {
          const data = (await res.json()) as CheckoutStatus;
          if (data.status !== "PENDING") {
            stopped.current = true;
            router.refresh();
            return;
          }
        }
      } catch {
        /* keep polling */
      }
      if (count < MAX_POLLS) timer = window.setTimeout(tick, INTERVAL_MS);
    }

    timer = window.setTimeout(tick, INTERVAL_MS);
    return () => {
      stopped.current = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [reference, initial, router]);

  if (initial !== "PENDING") return null;
  return (
    <p className="m-0 inline-flex items-center gap-2 text-[0.8rem] font-bold text-[rgba(246,238,223,0.55)]" aria-live="polite">
      <span className="size-3.5 animate-spin rounded-full border-2 border-[rgba(240,212,138,0.3)] border-t-[var(--color-md-champagne)]" />
      {polls >= MAX_POLLS ? "ما زلنا ننتظر تأكيد البنك. حدّثي الصفحة بعد قليل أو تواصلي معنا." : "نتحقق من حالة الدفع..."}
    </p>
  );
}
