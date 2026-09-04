import { Icon, SocialIcon } from "@/components/icons";
import {
  GOLD_GRADIENT,
  HOURS,
  MAPS_DIRECTIONS_LINK,
  MAPS_LINK,
  PHONE_DISPLAY,
  TEL_LINK,
  WA_LINK,
} from "@/app/_home/config";
import type { ContentOf } from "@/lib/pages/define";
import type { ABOUT_US } from "../content";

type VisitCopy = ContentOf<typeof ABOUT_US>["visit"];

/** Address, hours and contact in one wide card (about page). */
export function VisitBlock({ copy }: { copy: VisitCopy }) {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-[var(--color-md-line)] bg-[var(--color-md-card)] p-7 sm:p-9">
      <div
        className="pointer-events-none absolute -top-24 -right-16 size-64 rounded-full blur-[40px]"
        style={{ background: "radial-gradient(circle, rgba(232,195,106,.16), transparent 70%)" }}
        aria-hidden
      />

      <div className="relative grid gap-8 md:grid-cols-3 md:gap-6">
        <div>
          <h3 className="inline-flex items-center gap-2.5 text-[1.05rem] font-extrabold text-[var(--color-md-text)]">
            <Icon.MapPin className="size-5 text-[var(--color-md-champagne)]" />
            {copy.addressTitle}
          </h3>
          <p className="mt-3 text-[0.92rem] leading-[1.9] font-bold text-[rgba(246,238,223,0.72)]">{copy.address}</p>
          <a
            href={MAPS_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-[0.84rem] font-extrabold text-[var(--color-md-champagne)] transition-colors hover:text-[var(--color-md-neon)]"
          >
            {copy.mapLink}
            <Icon.ArrowLeft className="size-3.5" strokeWidth={2.4} />
          </a>
        </div>

        <div className="border-t border-[var(--color-md-line)] pt-7 md:border-t-0 md:border-r md:pt-0 md:pr-6">
          <h3 className="inline-flex items-center gap-2.5 text-[1.05rem] font-extrabold text-[var(--color-md-text)]">
            <Icon.Clock className="size-5 text-[var(--color-md-champagne)]" />
            {copy.hoursTitle}
          </h3>
          <ul className="mt-3 flex flex-col">
            {HOURS.map((row) => (
              <li
                key={row.label}
                className="flex items-center justify-between gap-4 border-b border-[var(--color-md-line)] py-2.5 last:border-b-0"
              >
                <span className="text-[0.88rem] font-bold text-[rgba(246,238,223,0.8)]">{row.label}</span>
                <span
                  className={`text-[0.86rem] font-extrabold ${
                    row.closed ? "text-[rgba(246,238,223,0.4)]" : "text-[var(--color-md-champagne)]"
                  }`}
                >
                  {row.time}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-[var(--color-md-line)] pt-7 md:border-t-0 md:border-r md:pt-0 md:pr-6">
          <h3 className="inline-flex items-center gap-2.5 text-[1.05rem] font-extrabold text-[var(--color-md-text)]">
            <Icon.Phone className="size-5 text-[var(--color-md-champagne)]" />
            {copy.contactTitle}
          </h3>
          <div className="mt-3 flex flex-col gap-2.5 text-[0.9rem]">
            <a
              href={TEL_LINK}
              className="inline-flex items-center gap-2.5 font-bold text-[rgba(246,238,223,0.75)] transition-colors hover:text-[var(--color-md-neon)]"
            >
              <Icon.Phone className="size-4 shrink-0 text-[var(--color-md-champagne)]" />
              <span dir="ltr">{PHONE_DISPLAY}</span>
            </a>
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 font-bold text-[rgba(246,238,223,0.75)] transition-colors hover:text-[var(--color-md-neon)]"
            >
              <SocialIcon name="whatsapp" className="text-[#25D366]" />
              {copy.whatsapp}
            </a>
          </div>
          <a
            href={MAPS_DIRECTIONS_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center justify-center gap-2.5 rounded-full px-6 py-3 text-[0.9rem] font-extrabold text-[var(--color-md-ink)] shadow-[0_0_30px_-8px_rgba(232,195,106,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_40px_-8px_rgba(255,223,142,0.75)]"
            style={{ background: GOLD_GRADIENT }}
          >
            <Icon.Navigation className="size-4" strokeWidth={2.2} />
            {copy.directions}
          </a>
        </div>
      </div>
    </div>
  );
}
