"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Icon } from "@/components/icons";
import { GOLD_GRADIENT } from "./config";

const NAV = [
  { href: "#specialties", label: "التخصصات" },
  { href: "#why", label: "لماذا نحن" },
  { href: "#journey", label: "رحلتك معنا" },
  { href: "#reviews", label: "آراء العميلات" },
  { href: "#contact", label: "تواصلي" },
];

/** Fixed header: transparent over the hero, ivory glass after 30px. */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[90] border-b transition-all duration-300 ${
        scrolled || open
          ? "border-[rgba(166,124,61,0.2)] bg-[rgba(251,248,243,0.9)] shadow-[0_12px_30px_-20px_rgba(138,100,48,0.3)] backdrop-blur-xl"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[74px] max-w-[1180px] items-center justify-between gap-6 px-[22px]">
        <a href="#top" className="flex items-center gap-3" aria-label="عيادات د. مها دحلان">
          <Image
            src="/logo.png"
            alt="عيادات د. مها دحلان"
            width={54}
            height={54}
            loading="eager"
            fetchPriority="high"
            className="size-[54px] object-contain"
          />
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative text-[0.9rem] font-bold text-[var(--color-md-ink-soft)] transition-colors duration-300 hover:text-[var(--color-md-bronze)] after:absolute after:-bottom-1.5 after:right-0 after:h-[2px] after:w-0 after:bg-[var(--color-md-gold)] after:transition-all after:duration-300 hover:after:w-full"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="#contact"
            className="hidden items-center gap-2 rounded-full bg-[var(--color-md-dark)] px-[22px] py-2.5 text-[0.85rem] font-extrabold text-[#F0D48A] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#3A2A1A] sm:inline-flex"
          >
            احجزي موعدك
            <Icon.ArrowLeft className="size-4" strokeWidth={2.4} />
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="قائمة التنقل"
            className="relative flex size-11 items-center justify-center rounded-full border border-[var(--color-md-line-strong)] bg-[rgba(255,253,249,0.8)] text-[var(--color-md-bronze)] lg:hidden"
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
        className={`overflow-hidden border-t border-[rgba(166,124,61,0.16)] transition-[max-height,opacity] duration-400 lg:hidden ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="mx-auto flex max-w-[1180px] flex-col gap-1 px-[22px] py-4">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between rounded-xl px-3 py-3 text-[0.95rem] font-bold text-[var(--color-md-ink-soft)] transition-colors hover:bg-[var(--color-md-cream)]"
            >
              {item.label}
              <Icon.ArrowLeft className="size-4 opacity-50" />
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="mt-2 flex items-center justify-center gap-2 rounded-full px-5 py-3 text-[0.9rem] font-extrabold text-[var(--color-md-ink)]"
            style={{ background: GOLD_GRADIENT }}
          >
            احجزي استشارتك
            <Icon.ArrowLeft className="size-4" strokeWidth={2.4} />
          </a>
        </nav>
      </div>
    </header>
  );
}
