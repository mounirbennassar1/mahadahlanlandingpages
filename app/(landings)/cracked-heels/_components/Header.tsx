"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Icon } from "@/components/icons";

/** Fixed header: transparent over the hero, espresso glass after 30px. */
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
          ? "border-[rgba(176,141,87,0.25)] bg-[rgba(20,13,8,0.82)] shadow-[0_12px_30px_-20px_rgba(0,0,0,0.6)] backdrop-blur-xl"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[74px] max-w-[1180px] items-center justify-between px-[22px]">
        <Image
          src="/cracked-heels/logo.png"
          alt="MD Clinics | مجمع عيادات د. مها دحلان الطبي"
          width={58}
          height={58}
          priority
          className="size-[58px] object-contain"
        />
        <a
          href="#booking"
          className="inline-flex items-center gap-2 rounded-full px-[22px] py-2.5 text-[0.85rem] font-extrabold text-[#1C120C] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-12px_rgba(228,200,126,0.6)]"
          style={{
            background: "linear-gradient(135deg, #8C6A3F, #E4C87E 50%, #B08D57)",
          }}
        >
          احجزي موعدك
          <Icon.ArrowLeft className="size-4" strokeWidth={2.4} />
        </a>
      </div>
    </header>
  );
}
