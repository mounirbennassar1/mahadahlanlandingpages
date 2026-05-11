"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Props = {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
  delay?: number;
  aspectClass?: string;
};

export default function BeforeAfter({
  beforeSrc,
  afterSrc,
  beforeAlt,
  afterAlt,
  delay = 0,
  aspectClass = "aspect-[16/10]",
}: Props) {
  const [pos, setPos] = useState(50);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const container = containerRef.current;
    if (!container) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const obj = { v: 50 };
    const ctx = gsap.context(() => {
      gsap
        .timeline({
          delay,
          scrollTrigger: {
            trigger: container,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        })
        .to(obj, {
          v: 18,
          duration: 1,
          ease: "sine.inOut",
          onUpdate: () => {
            if (!draggingRef.current) setPos(obj.v);
          },
        })
        .to(obj, {
          v: 82,
          duration: 1.6,
          ease: "sine.inOut",
          onUpdate: () => {
            if (!draggingRef.current) setPos(obj.v);
          },
        })
        .to(obj, {
          v: 50,
          duration: 1,
          ease: "sine.inOut",
          onUpdate: () => {
            if (!draggingRef.current) setPos(obj.v);
          },
        });
    });

    return () => ctx.revert();
  }, [delay]);

  const movePointer = (clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const raw = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(98, Math.max(2, raw)));
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    try {
      (e.target as Element).setPointerCapture?.(e.pointerId);
    } catch {}
    movePointer(e.clientX);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    movePointer(e.clientX);
  };

  const onPointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = false;
    try {
      (e.target as Element).releasePointerCapture?.(e.pointerId);
    } catch {}
  };

  return (
    <div
      ref={containerRef}
      className={`relative ${aspectClass} w-full overflow-hidden rounded-3xl border border-body-line bg-body-surface select-none`}
      style={{ touchAction: "pan-y" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      role="region"
      aria-label="مقارنة قبل وبعد — اسحبي العصا لرؤية الفرق"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={beforeSrc}
        alt={beforeAlt}
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={afterSrc}
          alt={afterAlt}
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      <span className="pointer-events-none absolute top-4 left-4 rounded-full bg-body-bg/85 px-3 py-1 text-xs backdrop-blur">
        قبل
      </span>
      <span className="pointer-events-none absolute top-4 right-4 rounded-full bg-body-fg text-body-bg px-3 py-1 text-xs">
        بعد
      </span>

      <div
        className="pointer-events-none absolute inset-y-0 w-[2px] bg-body-bg/90 shadow-[0_0_0_1px_rgba(0,0,0,0.08)]"
        style={{ left: `${pos}%` }}
      >
        <div className="pointer-events-auto absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 grid h-12 w-12 place-items-center rounded-full bg-body-bg border border-body-line shadow-lg cursor-ew-resize">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
          >
            <path
              d="M9 7l-5 5 5 5M15 7l5 5-5 5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
