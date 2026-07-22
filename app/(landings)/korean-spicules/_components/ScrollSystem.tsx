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
 *   data-words                        paragraph words brighten as you scroll (scrub)
 *   data-parallax="12"                yPercent drift, scrubbed (halved on mobile)
 *   data-glow="x,y,opacity"           moves the fixed orange aura when the
 *                                     section is in view (bg stays 100% black)
 *
 * Also renders the fixed layers: pure-black ground + traveling orange glow +
 * vignette + grain, and the top scroll-progress bar (origin-right for RTL).
 */
export function ScrollSystem() {
  const glowRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return; // static page — everything stays visible

    /* ── scroll progress bar ──────────────────────────────── */
    gsap.to(barRef.current, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { start: 0, end: "max", scrub: 0.4 },
    });

    /* ── word-brighten paragraphs (same on all breakpoints) ─ */
    // Word-level spans are shaping-safe in Arabic (no cross-word joining);
    // never split by letter. Guarded so a matchMedia re-run can't double-wrap.
    document.querySelectorAll<HTMLElement>("[data-words]").forEach((p) => {
      if (!p.dataset.split) {
        const words = (p.textContent ?? "").trim().split(/\s+/);
        p.innerHTML = words
          .map((w) => `<span class="kos-w">${w}</span>`)
          .join(" ");
        p.dataset.split = "1";
      }
      gsap.fromTo(
        p.querySelectorAll(".kos-w"),
        { opacity: 0.16 },
        {
          opacity: 1,
          stagger: 0.035,
          ease: "none",
          scrollTrigger: { trigger: p, start: "top 82%", end: "top 34%", scrub: 0.5 },
        },
      );
    });

    /* ── glow choreography: aura travels between sections ─── */
    const glow = glowRef.current;
    if (glow) {
      document.querySelectorAll<HTMLElement>("[data-glow]").forEach((sec) => {
        const [gx = 50, gy = 0, go = 0.4] = (sec.dataset.glow ?? "")
          .split(",")
          .map((n) => parseFloat(n));
        const apply = () =>
          gsap.to(glow, {
            "--gx": `${gx}%`,
            "--gy": `${gy}%`,
            opacity: go,
            duration: 1.3,
            ease: "power2.out",
            overwrite: "auto",
          });
        ScrollTrigger.create({
          trigger: sec,
          start: "top 55%",
          end: "bottom 55%",
          onEnter: apply,
          onEnterBack: apply,
        });
      });
    }

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

    // Pins (hero / protocol) are created by sibling components whose effects
    // run before this one; sort by document position so refresh math is right.
    requestAnimationFrame(() => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    });
  });

  return (
    <>
      {/* fixed cinematic ground — 100% black, traveling orange aura, vignette, grain */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
        <div className="absolute inset-0 bg-black" />
        <div
          ref={glowRef}
          className="absolute inset-0 opacity-50"
          style={
            {
              "--gx": "50%",
              "--gy": "-12%",
              background:
                "radial-gradient(58rem 40rem at var(--gx) var(--gy), rgba(255,107,26,0.16), rgba(255,107,26,0.05) 45%, transparent 68%)",
            } as React.CSSProperties
          }
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(130% 130% at 50% 50%, transparent 56%, rgba(0,0,0,0.5) 100%)",
          }}
        />
        <div className="kos-grain absolute inset-0" />
      </div>

      {/* scroll progress — origin-right for RTL */}
      <div
        ref={barRef}
        className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-right scale-x-0"
        style={{
          background:
            "linear-gradient(90deg, var(--color-kos-primary), var(--color-kos-accent))",
          willChange: "transform",
        }}
        aria-hidden
      />
    </>
  );
}
