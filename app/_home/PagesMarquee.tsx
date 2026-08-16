import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { SPECIALTIES, type Specialty } from "./config";

function PageCard({ item }: { item: Specialty }) {
  return (
    <Link
      href={`/${item.slug}`}
      className="group relative block w-[240px] flex-none overflow-hidden rounded-[22px] border border-[var(--color-md-line)] bg-[var(--color-md-card)] transition-all duration-400 hover:-translate-y-1 hover:border-[rgba(232,195,106,0.55)] hover:shadow-[0_0_36px_-8px_rgba(232,195,106,0.45)] sm:w-[300px]"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="300px"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
          style={{ objectPosition: item.focus ?? "center" }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(8,6,4,.92), rgba(8,6,4,.25) 55%, transparent 80%)",
          }}
          aria-hidden
        />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4">
          <span className="text-[0.92rem] leading-[1.5] font-extrabold text-[#F7F0E2] sm:text-[1rem]">
            {item.title}
          </span>
          <span
            className="mb-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border border-[rgba(240,212,138,0.4)] text-[var(--color-md-champagne)] transition-all duration-300 group-hover:bg-[var(--color-md-champagne)] group-hover:text-[var(--color-md-ink)] group-hover:shadow-[0_0_14px_rgba(255,233,168,0.7)]"
            aria-hidden
          >
            <Icon.ArrowLeft className="size-3.5" strokeWidth={2.4} />
          </span>
        </div>
      </div>
    </Link>
  );
}

function Row({
  items,
  duration,
  reverse,
}: {
  items: Specialty[];
  duration: string;
  reverse?: boolean;
}) {
  return (
    <div
      dir="ltr"
      className="overflow-hidden py-1"
      style={{
        maskImage:
          "linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent)",
        WebkitMaskImage:
          "linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent)",
      }}
    >
      <div
        className={`md-marquee-track gap-4 sm:gap-5 ${reverse ? "md-marquee-reverse" : ""}`}
        style={{ "--md-marquee-duration": duration } as React.CSSProperties}
      >
        {[0, 1].map((copy) => (
          <div key={copy} dir="rtl" className="flex gap-4 pe-4 sm:gap-5 sm:pe-5">
            {items.map((item) => (
              <PageCard key={`${copy}-${item.slug}`} item={item} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Every landing page as a card, flowing in two counter-scrolling marquee rows.
 * Hover pauses the row (see .md-marquee-track:hover).
 */
export function PagesMarquee() {
  const mid = Math.ceil(SPECIALTIES.length / 2);
  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      <Row items={SPECIALTIES.slice(0, mid)} duration="64s" />
      <Row items={SPECIALTIES.slice(mid)} duration="74s" reverse />
    </div>
  );
}
