"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Declarative scroll-animation system for the whole landing.
 *
 * Sections opt in via data attributes — no per-section animation code:
 *   data-reveal="up|fade|zoom|mask"   one-shot entrance when scrolled into view
 *   data-reveal-delay="0.15"          optional stagger offset (seconds)
 *   data-reveal-group / data-reveal-child   parent-driven staggered entrance
 *   data-words                        paragraph words darken as you scroll (scrub)
 *   data-parallax="12"                yPercent drift, scrubbed (halved on mobile)
 *
 * Also renders the fixed layers: porcelain paper ground + faint warm aura +
 * paper grain, and the top scroll-progress hairline (origin-right for RTL).
 */
export function ScrollSystem() {
  const barRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return; // static page — everything stays visible

    /* ── scroll progress hairline ─────────────────────────── */
    gsap.to(barRef.current, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { start: 0, end: "max", scrub: 0.4 },
    });

    /* ── word-darken paragraphs ───────────────────────────── */
    // Word-level spans are shaping-safe in Arabic (no cross-word joining);
    // never split by letter. Guarded so a matchMedia re-run can't double-wrap.
    document.querySelectorAll<HTMLElement>("[data-words]").forEach((p) => {
      if (!p.dataset.split) {
        const words = (p.textContent ?? "").trim().split(/\s+/);
        p.innerHTML = words
          .map((w) => `<span class="che-w">${w}</span>`)
          .join(" ");
        p.dataset.split = "1";
      }
      gsap.fromTo(
        p.querySelectorAll(".che-w"),
        { opacity: 0.2 },
        {
          opacity: 1,
          stagger: 0.035,
          ease: "none",
          scrollTrigger: { trigger: p, start: "top 82%", end: "top 34%", scrub: 0.5 },
        },
      );
    });

    /* ── breakpoint-aware reveals + parallax ──────────────── */
    const mm = gsap.matchMedia();
    mm.add(
      {
        isMobile: "(max-width: 767px)",
        isDesktop: "(min-width: 768px)",
      },
      (ctx) => {
        const { isMobile } = ctx.conditions as { isMobile: boolean };
        // Mobile: shorter travel + quicker tweens = lighter & smoother.
        const dist = isMobile ? 26 : 42;
        const dur = isMobile ? 0.65 : 0.85;

        document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
          const kind = el.dataset.reveal || "up";
          const delay = parseFloat(el.dataset.revealDelay ?? "0");

          const from: gsap.TweenVars = { opacity: 0 };
          const to: gsap.TweenVars = {
            opacity: 1,
            duration: dur,
            delay,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          };
          if (kind === "up") {
            from.y = dist;
            to.y = 0;
          } else if (kind === "zoom") {
            from.scale = 0.94;
            from.y = dist / 2;
            to.scale = 1;
            to.y = 0;
          } else if (kind === "mask") {
            from.clipPath = "inset(0% 0% 100% 0%)";
            from.y = 0;
            to.clipPath = "inset(0% 0% 0% 0%)";
          }
          gsap.fromTo(el, from, to);
        });

        document
          .querySelectorAll<HTMLElement>("[data-reveal-group]")
          .forEach((group) => {
            const children = group.querySelectorAll<HTMLElement>(
              "[data-reveal-child]",
            );
            if (!children.length) return;
            gsap.fromTo(
              children,
              { opacity: 0, y: dist * 0.85 },
              {
                opacity: 1,
                y: 0,
                duration: dur,
                ease: "power3.out",
                stagger: isMobile ? 0.08 : 0.1,
                scrollTrigger: { trigger: group, start: "top 85%", once: true },
              },
            );
          });

        document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
          const v = parseFloat(el.dataset.parallax ?? "12");
          const amt = isMobile ? v * 0.5 : v;
          gsap.fromTo(
            el,
            { yPercent: amt },
            {
              yPercent: -amt,
              ease: "none",
              scrollTrigger: {
                trigger: el.closest("[data-parallax-root]") ?? el,
                start: "top bottom",
                end: "bottom top",
                scrub: isMobile ? 0.6 : 1,
              },
            },
          );
        });
      },
    );

    // Pins (approach section) are created by sibling components whose effects
    // run before this one; sort by document position so refresh math is right.
    requestAnimationFrame(() => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    });
  });

  return (
    <>
      {/* fixed cinematic ground — midnight aubergine, faint gold aura,
          violet under-glow, vignette, grain */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, var(--color-che-bg), var(--color-che-bg-2) 55%, var(--color-che-bg))",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(70rem 46rem at 78% -12%, rgba(229,199,127,0.1), transparent 62%), radial-gradient(80rem 50rem at 50% 112%, rgba(92,59,142,0.24), transparent 60%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(130% 130% at 50% 50%, transparent 58%, rgba(8,3,16,0.5) 100%)",
          }}
        />
        <div className="che-grain absolute inset-0" />
      </div>

      {/* scroll progress — origin-right for RTL */}
      <div
        ref={barRef}
        className="fixed inset-x-0 top-0 z-[120] h-[2px] origin-right scale-x-0"
        style={{
          background:
            "linear-gradient(90deg, var(--color-che-gold-deep), var(--color-che-gold))",
          willChange: "transform",
        }}
        aria-hidden
      />
    </>
  );
}
