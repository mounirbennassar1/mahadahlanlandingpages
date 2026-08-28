import type { CSSProperties } from "react";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { GOLD_GRADIENT, SPECIALTIES, type Specialty } from "@/app/_home/config";

function Chip({ item }: { item: Specialty }) {
  return (
    <Link
      href={`/${item.slug}`}
      className="group inline-flex flex-none items-center gap-3 rounded-full border border-[var(--color-md-line)] bg-[var(--color-md-card)] py-2.5 pe-5 ps-2.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[rgba(232,195,106,0.55)] hover:shadow-[0_0_28px_-10px_rgba(232,195,106,0.5)]"
    >
      <span
        className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-[var(--color-md-ink)] transition-transform duration-300 group-hover:scale-110"
        style={{ background: GOLD_GRADIENT }}
        aria-hidden
      >
        <item.icon className="size-4" strokeWidth={2.2} />
      </span>
      <span className="whitespace-nowrap text-[0.9rem] font-extrabold text-[var(--color-md-text)]">{item.title}</span>
      <span className="hidden whitespace-nowrap text-[0.74rem] font-bold text-[rgba(246,238,223,0.45)] sm:inline">
        {item.tag}
      </span>
      <Icon.ArrowLeft
        className="size-3.5 shrink-0 text-[var(--color-md-champagne)] transition-transform duration-300 group-hover:-translate-x-1"
        strokeWidth={2.4}
        aria-hidden
      />
    </Link>
  );
}

function Row({ items, duration, reverse }: { items: Specialty[]; duration: string; reverse?: boolean }) {
  return (
    <div
      dir="ltr"
      className="overflow-hidden py-1"
      style={{
        maskImage: "linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent)",
        WebkitMaskImage: "linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent)",
      }}
    >
      <div
        className={`md-marquee-track gap-3 sm:gap-4 ${reverse ? "md-marquee-reverse" : ""}`}
        style={{ "--md-marquee-duration": duration } as CSSProperties}
      >
        {[0, 1].map((copy) => (
          <div key={copy} dir="rtl" className="flex gap-3 pe-3 sm:gap-4 sm:pe-4">
            {items.map((item) => (
              <Chip key={`${copy}-${item.slug}`} item={item} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/** The 14 treatment landings as linked chips in two counter-scrolling rows. */
export function SpecialtiesStrip() {
  const mid = Math.ceil(SPECIALTIES.length / 2);
  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      <Row items={SPECIALTIES.slice(0, mid)} duration="46s" />
      <Row items={SPECIALTIES.slice(mid)} duration="54s" reverse />
    </div>
  );
}
