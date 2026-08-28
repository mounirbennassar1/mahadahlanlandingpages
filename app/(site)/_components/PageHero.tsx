import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "@/components/icons";
import { Glow } from "@/app/_home/Sections";

export type Crumb = { href?: string; label: string };

/**
 * Top band of every site page: breadcrumb, eyebrow pill, H1 with a gold
 * glow span, lede, optional CTAs, and (optionally) a split layout with an
 * image on the left (RTL) — copy stays on the right, per the design rules.
 *
 * Pads for the fixed header (topbar 38px + nav 74px) so nothing hides under it.
 */
export function PageHero({
  crumbs,
  eyebrow,
  title,
  gold,
  lede,
  actions,
  image,
  imageAlt,
  imagePriority = true,
  aside,
  compact = false,
}: {
  crumbs?: Crumb[];
  eyebrow: string;
  title: string;
  gold?: string;
  lede?: string;
  /** Buttons / links rendered under the lede. */
  actions?: ReactNode;
  /** Split layout: portrait/landscape image on the left (RTL). */
  image?: string;
  imageAlt?: string;
  imagePriority?: boolean;
  /** Alternative to `image`: any node for the left column (form, card, …). */
  aside?: ReactNode;
  /** Shorter band for list pages that have their own visual below. */
  compact?: boolean;
}) {
  const split = Boolean(image || aside);

  return (
    <section
      className={`relative overflow-hidden bg-[var(--color-md-bg)] px-[22px] ${
        compact ? "pt-[140px] pb-[56px] sm:pt-[160px] sm:pb-[72px]" : "pt-[150px] pb-[72px] sm:pt-[176px] sm:pb-[96px]"
      }`}
    >
      <Glow className="-top-24 right-1/4 h-[360px] w-[640px]" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(rgba(240,212,138,.12) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse 60% 70% at 70% 30%, #000 10%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse 60% 70% at 70% 30%, #000 10%, transparent 70%)",
        }}
        aria-hidden
      />

      <div
        className={`relative mx-auto max-w-[1180px] ${
          split ? "grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]" : "flex flex-col items-center text-center"
        }`}
      >
        <div className={split ? "text-right" : "flex flex-col items-center"}>
          {crumbs?.length ? (
            <nav aria-label="مسار الصفحة" className="mb-6">
              <ol className="flex flex-wrap items-center gap-1.5 text-[0.8rem] font-bold text-[rgba(246,238,223,0.5)]">
                <li>
                  <Link href="/" className="transition-colors hover:text-[var(--color-md-champagne)]">
                    الرئيسية
                  </Link>
                </li>
                {crumbs.map((c) => (
                  <li key={c.label} className="flex items-center gap-1.5">
                    <Icon.ChevronLeft className="size-3.5 text-[var(--color-md-gold)]" aria-hidden />
                    {c.href ? (
                      <Link href={c.href} className="transition-colors hover:text-[var(--color-md-champagne)]">
                        {c.label}
                      </Link>
                    ) : (
                      <span className="text-[var(--color-md-champagne)]" aria-current="page">
                        {c.label}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          ) : null}

          <span className="inline-flex items-center gap-2.5 rounded-full border border-[var(--color-md-line-strong)] bg-[rgba(22,16,10,0.7)] px-[18px] py-2 text-[0.78rem] font-bold text-[var(--color-md-champagne)]">
            <span
              className="size-1.5 rounded-full bg-[var(--color-md-neon)]"
              style={{ animation: "md-neon-pulse 2.4s ease-in-out infinite" }}
            />
            {eyebrow}
          </span>

          <h1 className="mt-5 text-[clamp(2rem,5vw,3.4rem)] leading-[1.45] font-extrabold tracking-[-0.01em] text-[var(--color-md-text)]">
            {title}
            {gold ? (
              <>
                {" "}
                <span className="md-gold-glow inline-block">
                  <span className="md-gold-text">{gold}</span>
                </span>
              </>
            ) : null}
          </h1>

          {lede ? (
            <p className={`mt-5 text-[1.05rem] leading-[1.9] font-light text-[rgba(246,238,223,0.62)] ${split ? "max-w-[58ch]" : "max-w-[64ch]"}`}>
              {lede}
            </p>
          ) : null}

          {actions ? (
            <div className={`mt-8 flex flex-wrap gap-3.5 ${split ? "" : "justify-center"}`}>{actions}</div>
          ) : null}
        </div>

        {image ? (
          <div className="relative mx-auto w-full max-w-[520px] lg:mx-0 lg:justify-self-start">
            <div
              className="pointer-events-none absolute -inset-3 rounded-[32px] border border-[rgba(201,156,78,0.3)]"
              aria-hidden
            />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] border border-[var(--color-md-line-strong)] bg-[var(--color-md-card)] shadow-[0_40px_90px_-40px_rgba(232,195,106,0.35)]">
              <Image
                src={image}
                alt={imageAlt ?? ""}
                fill
                priority={imagePriority}
                sizes="(max-width: 1024px) 90vw, 520px"
                className="object-cover object-top"
              />
            </div>
          </div>
        ) : aside ? (
          <div className="relative w-full">{aside}</div>
        ) : null}
      </div>

      <div className="md-sheen-line absolute inset-x-0 bottom-0 h-px" aria-hidden />
    </section>
  );
}
