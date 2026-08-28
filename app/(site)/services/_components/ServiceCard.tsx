import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/icons";
import type { Specialty } from "@/app/_home/config";
import { latinDigits } from "../../_booking/shared";

/** Config copy may carry Arabic-Indic digits; the site shows Western ones. */
function westernDigits(text: string) {
  return latinDigits(text).replace(/٪/g, "%");
}

export function ServiceCard({ item }: { item: Specialty }) {
  const CatIcon = item.icon;
  const bookHref = `/book-now?service=${encodeURIComponent(item.slug)}`;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-[var(--color-md-line)] bg-[var(--color-md-card)] transition-[transform,border-color,box-shadow] duration-400 hover:-translate-y-1.5 hover:border-[rgba(232,195,106,0.5)] hover:shadow-[0_0_40px_-14px_rgba(232,195,106,0.45)]">
      {/* visual */}
      <Link
        href={`/${item.slug}`}
        aria-label={item.title}
        tabIndex={-1}
        className="relative block aspect-[4/3] overflow-hidden"
      >
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          style={{ objectPosition: item.focus ?? "center" }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[var(--color-md-card)] to-transparent"
          aria-hidden
        />
        <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 rounded-full border border-[rgba(240,212,138,0.45)] bg-[rgba(11,8,5,0.85)] px-3.5 py-1.5 text-[0.74rem] font-extrabold text-[var(--color-md-champagne)] backdrop-blur-md">
          <span
            className="size-1.5 rounded-full bg-[var(--color-md-neon)]"
            style={{ animation: "md-neon-pulse 2.4s ease-in-out infinite" }}
            aria-hidden
          />
          {westernDigits(item.tag)}
        </span>
      </Link>

      {/* copy */}
      <div className="flex flex-1 flex-col p-7">
        <span className="inline-flex items-center gap-1.5 text-[0.74rem] font-bold text-[var(--color-md-champagne)]">
          <CatIcon className="size-3.5" strokeWidth={2} aria-hidden />
          {item.category}
        </span>

        <h3 className="mt-2 text-[1.12rem] leading-[1.5] font-extrabold text-[var(--color-md-text)]">
          <Link
            href={`/${item.slug}`}
            className="transition-colors duration-300 hover:text-[var(--color-md-champagne)]"
          >
            {item.title}
          </Link>
        </h3>

        <p className="mt-2 text-[0.9rem] leading-[1.85] font-light text-[rgba(246,238,223,0.58)]">
          {item.description}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-6">
          <Link
            href={`/${item.slug}`}
            className="inline-flex items-center gap-2 text-[0.9rem] font-extrabold text-[var(--color-md-champagne)] transition-colors duration-300 hover:text-[var(--color-md-gold-bright)]"
          >
            اعرفي المزيد
            <Icon.ArrowLeft
              className="size-4 transition-transform duration-300 group-hover:-translate-x-1"
              strokeWidth={2.4}
              aria-hidden
            />
          </Link>
          <Link
            href={bookHref}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-[rgba(240,212,138,0.35)] px-4 py-2 text-[0.82rem] font-extrabold text-[#F0D48A] transition-all duration-300 hover:bg-[rgba(240,212,138,0.1)] hover:shadow-[0_0_24px_-8px_rgba(255,233,168,0.5)]"
          >
            <Icon.CalendarCheck className="size-4" aria-hidden />
            احجزي
          </Link>
        </div>
      </div>
    </article>
  );
}
