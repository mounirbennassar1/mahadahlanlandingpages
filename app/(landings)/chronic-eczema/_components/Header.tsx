"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Icon } from "@/components/icons";
import { GOLD_GRADIENT, PHONE_DISPLAY, TEL_LINK } from "./config";

/** Fixed header: transparent over the frost hero, midnight glass after 30px.
 *  Logo right (RTL), phone center on desktop, gold CTA left. */
export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[90] border-b transition-all duration-300 ${
        scrolled
          ? "border-[var(--color-che-line)] bg-[rgba(20,12,34,0.85)] shadow-[0_12px_30px_-20px_rgba(0,0,0,0.6)] backdrop-blur-xl"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-[1240px] items-center justify-between px-[22px]">
        <Image
          src="/chronic-eczema/logo.webp"
          alt="MD Clinics | مجمع عيادات د. مها دحلان الطبي"
          width={54}
          height={54}
          priority
          className="size-[54px] object-contain"
        />

        <a
          dir="ltr"
          href={TEL_LINK}
          className="hidden items-center gap-2 text-[0.88rem] font-bold text-[var(--color-che-ink-2)] transition-colors hover:text-[var(--color-che-ink)] md:inline-flex"
        >
          <Icon.Phone className="size-4 text-[var(--color-che-gold-bright)]" />
          {PHONE_DISPLAY}
        </a>

        <a
          href="#booking"
          className="group inline-flex items-center gap-2.5 rounded-[4px] px-[22px] py-[11px] text-[0.85rem] font-extrabold text-[#231303] transition-all duration-300 hover:-translate-y-0.5"
          style={{ background: GOLD_GRADIENT }}
        >
          احجزي موعدك
          <Icon.ArrowLeft
            className="size-4 transition-transform duration-300 group-hover:-translate-x-1"
            strokeWidth={2.4}
          />
        </a>
      </div>
    </header>
  );
}
