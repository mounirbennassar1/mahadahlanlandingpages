"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Icon } from "@/components/icons";
import { PHONE_DISPLAY, TEL_LINK } from "./config";

/** Fixed header — transparent over the hero, burgundy glass after 30px. */
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
          ? "border-[var(--color-faa-line)] bg-[rgba(21,4,9,0.86)] backdrop-blur-xl"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[74px] max-w-[1160px] items-center justify-between px-[22px]">
        <Image
          src="/facial-atrophy/logo.png"
          alt="MD Clinics — مجمع عيادات د. مها دحلان الطبي"
          width={58}
          height={58}
          priority
          className="size-[58px] object-contain"
        />
        <a
          href={TEL_LINK}
          className="inline-flex items-center gap-[9px] text-[0.92rem] font-extrabold text-[var(--color-faa-gold)] transition-colors hover:text-[var(--color-faa-gold-bright)]"
        >
          <Icon.Phone className="size-[17px]" />
          <span dir="ltr">{PHONE_DISPLAY}</span>
        </a>
      </div>
    </header>
  );
}
