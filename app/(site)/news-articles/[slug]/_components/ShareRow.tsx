"use client";

import { useEffect, useRef, useState } from "react";
import { LuCheckCheck, LuCopy, LuShare2 } from "react-icons/lu";
import { SocialIcon } from "@/components/icons";

const chip =
  "inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--color-md-line-strong)] px-4 text-[0.82rem] font-extrabold text-[rgba(246,238,223,0.8)] transition-all duration-300 hover:border-[rgba(232,195,106,0.6)] hover:text-[var(--color-md-champagne)]";

/** WhatsApp / X share links + copy-link button (both labels stay mounted). */
export function ShareRow({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = url;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2200);
  }

  const wa = `https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`;
  const x = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <span className="inline-flex items-center gap-1.5 text-[0.8rem] font-bold text-[rgba(246,238,223,0.5)]">
        <LuShare2 className="size-4 text-[var(--color-md-champagne)]" />
        شاركي المقال
      </span>
      <a href={wa} target="_blank" rel="noopener noreferrer" className={chip}>
        <SocialIcon name="whatsapp" className="text-[#25D366]" />
        واتساب
      </a>
      <a href={x} target="_blank" rel="noopener noreferrer" className={chip}>
        <SocialIcon name="x" />
        X
      </a>
      <button
        type="button"
        onClick={copy}
        aria-live="polite"
        className={`${chip} cursor-pointer ${copied ? "border-[rgba(140,220,160,0.5)] text-[#9BE8B0]" : ""}`}
      >
        <span className={`items-center gap-2 ${copied ? "hidden" : "flex"}`}>
          <LuCopy className="size-4" />
          <span>نسخ الرابط</span>
        </span>
        <span className={`items-center gap-2 ${copied ? "flex" : "hidden"}`}>
          <LuCheckCheck className="size-4" />
          <span>تم النسخ</span>
        </span>
      </button>
    </div>
  );
}
