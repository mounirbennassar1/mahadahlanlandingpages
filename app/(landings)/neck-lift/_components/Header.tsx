"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Icon } from "@/components/icons";

/** Fixed header: transparent over the hero, ivory glass after 30px. */
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
          ? "border-[rgba(166,124,61,0.2)] bg-[rgba(251,248,243,0.88)] shadow-[0_12px_30px_-20px_rgba(138,100,48,0.3)] backdrop-blur-xl"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[74px] max-w-[1180px] items-center justify-between px-[22px]">
        <Image
          src="/neck-lift/logo.png"
          alt="MD Clinics | مجمع عيادات د. مها دحلان الطبي"
          width={58}
          height={58}
          priority
          className="size-[58px] object-contain"
        />
        <a
          href="#booking"
          className="inline-flex items-center gap-2 rounded-full bg-[var(--color-nkl-dark)] px-[22px] py-2.5 text-[0.85rem] font-extrabold text-[#F0D48A] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#3A2A1A]"
        >
          احجزي موعدك
          <Icon.ArrowLeft className="size-4" strokeWidth={2.4} />
        </a>
      </div>
    </header>
  );
}
