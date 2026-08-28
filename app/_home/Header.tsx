"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { Icon } from "@/components/icons";
import { GOLD_GRADIENT } from "./config";
import { LANG_META } from "./i18n/dictionary";
import { useLocale } from "./i18n/LocaleProvider";
import { Topbar } from "./Topbar";

/** Staggered CSS drop-in (clock-based, so it always reaches its end state). */
const drop = (delay: number): CSSProperties => ({ animationDelay: `${delay}s` });

const BOOK_HREF = "/book-now";

function isActive(pathname: string, href: string) {
  if (href.includes("#")) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Fixed chrome: neon topbar (collapses on scroll) + black-glass nav.
 *  Nav order requested by the clinic (2026-08-28); labels come from the locale
 *  dictionary, the language switch flips between `/` and `/en`. */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { locale, t, isRtl } = useLocale();
  const lang = LANG_META[locale];
  const NAV = t.nav.items;
  /** "Forward" arrow along the reading direction. */
  const Arrow = isRtl ? Icon.ArrowLeft : Icon.ArrowRight;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-[90]">
      {/* topbar folds away once the page is scrolled */}
      <div
        className={`overflow-hidden transition-[max-height,opacity] duration-500 ${
          scrolled ? "max-h-0 opacity-0" : "max-h-12 opacity-100"
        }`}
      >
        <Topbar />
      </div>

      <div
        className={`border-b transition-all duration-300 ${
          scrolled || open
            ? "border-[rgba(201,156,78,0.22)] bg-[rgba(11,8,5,0.88)] shadow-[0_18px_44px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-[74px] max-w-[1180px] items-center justify-between gap-6 px-[22px]">
          <Link
            href={lang.home}
            className="md-nav-item flex items-center gap-3"
            style={drop(0.05)}
            aria-label={t.nav.logoAlt}
          >
            <Image
              src="/logo.webp"
              alt={t.nav.logoAlt}
              width={54}
              height={54}
              loading="eager"
              fetchPriority="high"
              className="size-[54px] object-contain drop-shadow-[0_0_14px_rgba(232,195,106,0.35)]"
            />
          </Link>

          <nav className="hidden items-center gap-[18px] xl:gap-6 lg:flex">
            {NAV.map((item, i) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={drop(0.12 + i * 0.06)}
                  aria-current={active ? "page" : undefined}
                  className={`md-nav-item relative whitespace-nowrap text-[0.86rem] font-bold transition-colors duration-300 hover:text-[#FFE9A8] after:absolute after:-bottom-1.5 ${
                    isRtl ? "after:right-0" : "after:left-0"
                  } after:h-[2px] after:rounded-full after:bg-[var(--color-md-champagne)] after:shadow-[0_0_10px_rgba(255,233,168,0.9)] after:transition-all after:duration-300 hover:after:w-full ${
                    active
                      ? "text-[#FFE9A8] after:w-full"
                      : "text-[rgba(246,238,223,0.72)] after:w-0"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href={lang.switchHref}
              hrefLang={lang.switchHrefLang}
              aria-label={lang.switchAria}
              style={drop(0.4)}
              className="md-nav-item inline-flex h-10 items-center gap-1.5 rounded-full border border-[var(--color-md-line-strong)] bg-[rgba(22,16,10,0.8)] px-3.5 text-[0.78rem] font-extrabold tracking-wide text-[var(--color-md-champagne)] transition-colors duration-300 hover:border-[var(--color-md-gold-bright)] hover:text-[#FFE9A8]"
            >
              <Icon.Globe className="size-[15px]" strokeWidth={2} />
              <span dir="ltr">{lang.switchShort}</span>
            </Link>
            <Link
              href={BOOK_HREF}
              className="md-nav-item hidden items-center gap-2 rounded-full px-[22px] py-2.5 text-[0.85rem] font-extrabold text-[var(--color-md-ink)] shadow-[0_0_24px_-4px_rgba(232,195,106,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_34px_-4px_rgba(255,223,142,0.75)] sm:inline-flex"
              style={{ background: GOLD_GRADIENT, ...drop(0.45) }}
            >
              {t.nav.book}
              <Arrow className="size-4" strokeWidth={2.4} />
            </Link>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={t.nav.menuAria}
              style={drop(0.2)}
              className="md-nav-item relative flex size-11 items-center justify-center rounded-full border border-[var(--color-md-line-strong)] bg-[rgba(22,16,10,0.8)] text-[var(--color-md-champagne)] lg:hidden"
            >
              {/* both icons stay mounted; CSS toggles them */}
              <Icon.Menu
                className={`absolute size-5 transition-all duration-300 ${open ? "scale-50 opacity-0" : "scale-100 opacity-100"}`}
              />
              <Icon.X
                className={`absolute size-5 transition-all duration-300 ${open ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}
              />
            </button>
          </div>
        </div>

        {/* mobile sheet */}
        <div
          className={`overflow-hidden border-t border-[rgba(201,156,78,0.16)] transition-[max-height,opacity] duration-400 lg:hidden ${
            open ? "max-h-[36rem] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="mx-auto flex max-w-[1180px] flex-col gap-1 px-[22px] py-4">
            {NAV.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center justify-between rounded-xl px-3 py-3 text-[0.95rem] font-bold transition-colors hover:bg-[rgba(232,195,106,0.08)] hover:text-[#FFE9A8] ${
                    active
                      ? "bg-[rgba(232,195,106,0.08)] text-[#FFE9A8]"
                      : "text-[rgba(246,238,223,0.78)]"
                  }`}
                >
                  {item.label}
                  <Arrow className="size-4 opacity-50" />
                </Link>
              );
            })}
            <Link
              href={lang.switchHref}
              hrefLang={lang.switchHrefLang}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between rounded-xl px-3 py-3 text-[0.95rem] font-bold text-[rgba(246,238,223,0.78)] transition-colors hover:bg-[rgba(232,195,106,0.08)] hover:text-[#FFE9A8]"
            >
              <span className="inline-flex items-center gap-2">
                <Icon.Globe className="size-4 text-[var(--color-md-champagne)]" />
                {lang.switchLabel}
              </span>
              <Arrow className="size-4 opacity-50" />
            </Link>
            <Link
              href={BOOK_HREF}
              onClick={() => setOpen(false)}
              className="mt-2 flex items-center justify-center gap-2 rounded-full px-5 py-3 text-[0.9rem] font-extrabold text-[var(--color-md-ink)]"
              style={{ background: GOLD_GRADIENT }}
            >
              {t.nav.bookMobile}
              <Arrow className="size-4" strokeWidth={2.4} />
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
