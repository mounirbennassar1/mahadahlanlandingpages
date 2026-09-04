"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/icons";
import {
  GOLD_GRADIENT,
  HOURS,
  MAPS_DIRECTIONS_LINK,
  MAPS_EMBED_SRC,
  OPENING,
} from "@/app/_home/config";
import { CLINIC_ADDRESS } from "../../_booking/shared";
import type { ContentOf } from "@/lib/pages/define";
import type { BOOK_NOW } from "../content";

type VisitCopy = ContentOf<typeof BOOK_NOW>["visit"];

/** Riyadh-time open/closed state, resolved after mount (no hydration drift). */
function useOpenNow() {
  const [openNow, setOpenNow] = useState<boolean | null>(null);

  useEffect(() => {
    const compute = () => {
      const riyadh = new Date(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Riyadh" }),
      );
      const day = riyadh.getDay();
      const hour = riyadh.getHours();
      setOpenNow(
        day !== OPENING.closedDay &&
          hour >= OPENING.openHour &&
          hour < OPENING.closeHour,
      );
    };
    compute();
    const id = setInterval(compute, 60_000);
    return () => clearInterval(id);
  }, []);

  return openNow;
}

/** Hours card (with live open/closed pill) beside the dark-graded Google map. */
export function HoursAndMap({ copy }: { copy: VisitCopy }) {
  const openNow = useOpenNow();

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8">
      <div className="relative flex flex-col overflow-hidden rounded-[28px] border border-[var(--color-md-line)] bg-[var(--color-md-card)] p-7 sm:p-9">
        <div
          className="pointer-events-none absolute -top-24 -left-16 size-64 rounded-full blur-[40px]"
          style={{ background: "radial-gradient(circle, rgba(232,195,106,.18), transparent 70%)" }}
          aria-hidden
        />

        <div className="relative flex items-center justify-between gap-3">
          <h3 className="inline-flex items-center gap-2.5 text-[1.2rem] font-extrabold text-[var(--color-md-text)]">
            <Icon.Clock className="size-5 text-[var(--color-md-champagne)]" />
            {copy.hoursTitle}
          </h3>

          {/* all three states share one node; only classes + text change after mount */}
          <span
            className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[0.75rem] font-extrabold transition-colors duration-500 ${
              openNow === null
                ? "border-[var(--color-md-line)] text-[rgba(246,238,223,0.4)]"
                : openNow
                  ? "border-[rgba(140,220,160,0.4)] text-[#9BE8B0]"
                  : "border-[var(--color-md-line-strong)] text-[var(--color-md-champagne)]"
            }`}
            aria-live="polite"
          >
            <span
              className={`size-1.5 rounded-full ${
                openNow
                  ? "bg-[#7ADB96] shadow-[0_0_10px_rgba(122,219,150,0.9)]"
                  : "bg-[var(--color-md-champagne)]"
              }`}
              style={openNow ? undefined : { animation: "md-neon-pulse 2.4s ease-in-out infinite" }}
              aria-hidden
            />
            <span className={openNow === null ? "" : "hidden"}>{copy.statusIdle}</span>
            <span className={openNow === true ? "" : "hidden"}>{copy.statusOpen}</span>
            <span className={openNow === false ? "" : "hidden"}>{copy.statusClosed}</span>
          </span>
        </div>

        <ul className="relative mt-6 flex flex-col">
          {HOURS.map((row) => (
            <li
              key={row.label}
              className="flex items-center justify-between gap-4 border-b border-[var(--color-md-line)] py-4 last:border-b-0"
            >
              <span className="text-[0.95rem] font-bold text-[rgba(246,238,223,0.82)]">{row.label}</span>
              <span
                className={`text-[0.92rem] font-extrabold ${
                  row.closed ? "text-[rgba(246,238,223,0.4)]" : "text-[var(--color-md-champagne)]"
                }`}
              >
                {row.time}
              </span>
            </li>
          ))}
        </ul>

        <p className="relative mt-6 flex items-start gap-2.5 border-t border-[var(--color-md-line)] pt-6 text-[0.9rem] leading-[1.8] font-bold text-[rgba(246,238,223,0.75)]">
          <Icon.MapPin className="mt-1 size-4 shrink-0 text-[var(--color-md-champagne)]" />
          {CLINIC_ADDRESS}
        </p>

        <a
          href={MAPS_DIRECTIONS_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="relative mt-7 inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full px-7 py-3.5 text-[0.95rem] font-extrabold text-[var(--color-md-ink)] shadow-[0_0_30px_-8px_rgba(232,195,106,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_40px_-8px_rgba(255,223,142,0.75)]"
          style={{ background: GOLD_GRADIENT }}
        >
          <Icon.Navigation className="size-[17px]" strokeWidth={2.2} />
          {copy.directions}
        </a>
      </div>

      <div className="md-map-frame relative min-h-[340px] overflow-hidden rounded-[28px] border border-[var(--color-md-line-strong)] shadow-[0_0_50px_-14px_rgba(232,195,106,0.3)] lg:min-h-0">
        <iframe
          src={MAPS_EMBED_SRC}
          title={copy.mapTitle}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 size-full border-0"
        />
        <span className="pointer-events-none absolute top-4 right-4 inline-flex items-center gap-2 rounded-full border border-[rgba(240,212,138,0.4)] bg-[rgba(11,8,5,0.82)] px-4 py-2 text-[0.78rem] font-extrabold text-[var(--color-md-champagne)] backdrop-blur-md">
          <Icon.MapPin className="size-3.5" />
          {copy.mapPin}
        </span>
      </div>
    </div>
  );
}
