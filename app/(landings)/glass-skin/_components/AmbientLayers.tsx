"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Fixed cinematic layers behind the whole page:
 *   ambient  — one background color, tweened per section (data-ambient)
 *   glow     — soft gold radial light
 *   vignette — subtle edge darkening
 *   grain    — faint film grain (from landing.css)
 *
 * Sections opt in via `data-ambient="#26292c"` — the page keeps ONE unified
 * dark family; only the warmth shifts as you travel between sections.
 */
export function AmbientLayers() {
  const ambientRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-ambient]"),
    );

    const apply = (color?: string) => {
      if (!color || !ambientRef.current) return;
      if (reduced) {
        ambientRef.current.style.backgroundColor = color;
        return;
      }
      gsap.to(ambientRef.current, {
        backgroundColor: color,
        duration: 1.1,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    const triggers = sections.map((el) =>
      ScrollTrigger.create({
        trigger: el,
        start: "top 58%",
        end: "bottom 58%",
        onEnter: () => apply(el.dataset.ambient),
        onEnterBack: () => apply(el.dataset.ambient),
      }),
    );

    return () => triggers.forEach((t) => t.kill());
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      <div
        ref={ambientRef}
        className="absolute inset-0"
        style={{ backgroundColor: "#26292c" }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(90rem 52rem at 50% -14%, rgba(212,175,55,0.08), transparent 62%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(130% 130% at 50% 50%, transparent 58%, rgba(0,0,0,0.34) 100%)",
        }}
      />
      <div className="gls-grain absolute inset-0" />
    </div>
  );
}
