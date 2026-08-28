"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LuCircleHelp } from "react-icons/lu";
import { Icon } from "@/components/icons";

export type FaqItem = { q: string; a: string };

const EASE = [0.22, 1, 0.36, 1] as const;

/** Accessible single-open accordion (button + region, aria-expanded/controls). */
export function Faq({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const uid = useId();

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, i) => {
        const on = open === i;
        const buttonId = `${uid}-q${i}`;
        const panelId = `${uid}-a${i}`;
        return (
          <div
            key={item.q}
            className={`rounded-[20px] border bg-[var(--color-md-card)] transition-colors duration-300 ${
              on ? "border-[rgba(232,195,106,0.5)]" : "border-[var(--color-md-line)] hover:border-[rgba(232,195,106,0.35)]"
            }`}
          >
            <h3 className="m-0">
              <button
                id={buttonId}
                type="button"
                aria-expanded={on}
                aria-controls={panelId}
                onClick={() => setOpen(on ? null : i)}
                className="flex min-h-14 w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-right text-[0.98rem] font-extrabold text-[var(--color-md-text)] sm:px-6"
              >
                <span className="inline-flex items-center gap-3">
                  <LuCircleHelp className="size-5 shrink-0 text-[var(--color-md-champagne)]" />
                  {item.q}
                </span>
                <Icon.ChevronDown
                  className={`size-5 shrink-0 text-[var(--color-md-champagne)] transition-transform duration-300 ${
                    on ? "rotate-180" : ""
                  }`}
                  aria-hidden
                />
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {on ? (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.32, ease: EASE }}
                  className="overflow-hidden"
                >
                  <p className="m-0 px-5 pb-5 text-[0.92rem] leading-[1.9] font-light text-[rgba(246,238,223,0.65)] sm:px-6 sm:ps-14">
                    {item.a}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
