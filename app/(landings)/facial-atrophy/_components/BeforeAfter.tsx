"use client";

import Image from "next/image";
import { useCallback, useRef } from "react";
import { Icon } from "@/components/icons";
import { GOLD_GRADIENT } from "./config";

/**
 * Draggable before/after comparison — the after layer is clipped from the
 * left (LTR inset) and a gold handle follows the pointer, as in the design.
 */
export function BeforeAfter() {
  const frameRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);

  const setPosition = useCallback((clientX: number) => {
    const frame = frameRef.current;
    if (!frame) return;
    const r = frame.getBoundingClientRect();
    const x = Math.min(r.width - 10, Math.max(10, clientX - r.left));
    if (topRef.current)
      topRef.current.style.clipPath = `inset(0 ${r.width - x}px 0 0)`;
    if (handleRef.current) handleRef.current.style.left = `${x}px`;
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      setPosition(e.clientX);
      const move = (ev: PointerEvent) => setPosition(ev.clientX);
      const up = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
      };
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
    },
    [setPosition],
  );

  return (
    <div
      ref={frameRef}
      onPointerDown={onPointerDown}
      className="relative mx-auto aspect-[4/3] max-w-[760px] touch-pan-y overflow-hidden rounded-[22px] border border-[var(--color-faa-line-strong)] shadow-[0_40px_90px_-36px_rgba(0,0,0,0.85)] select-none"
    >
      <div className="absolute inset-0">
        <Image
          src="/facial-atrophy/before.jpg"
          alt="قبل علاج ضمور الوجه"
          fill
          sizes="(max-width: 800px) 94vw, 760px"
          draggable={false}
          className="object-cover"
        />
      </div>
      <div ref={topRef} className="absolute inset-0" style={{ clipPath: "inset(0 50% 0 0)" }}>
        <Image
          src="/facial-atrophy/after.jpg"
          alt="بعد علاج ضمور الوجه"
          fill
          sizes="(max-width: 800px) 94vw, 760px"
          draggable={false}
          className="object-cover"
        />
      </div>

      <span className="pointer-events-none absolute top-3.5 right-3.5 z-[3] rounded-full border border-[rgba(243,233,220,0.25)] bg-[rgba(21,4,9,0.72)] px-3.5 py-1.5 text-[0.72rem] font-extrabold tracking-[0.08em] text-[var(--color-faa-ink)] backdrop-blur-md">
        قبل
      </span>
      <span
        className="pointer-events-none absolute top-3.5 left-3.5 z-[3] rounded-full px-3.5 py-1.5 text-[0.72rem] font-extrabold tracking-[0.08em] text-[var(--color-faa-cta-ink)]"
        style={{ background: GOLD_GRADIENT }}
      >
        بعد
      </span>

      <div
        ref={handleRef}
        className="absolute top-0 bottom-0 left-1/2 z-[4] flex w-12 -translate-x-1/2 cursor-ew-resize touch-none items-center justify-center"
      >
        <div
          className="absolute top-0 bottom-0 left-1/2 w-0.5 -translate-x-1/2"
          style={{
            background:
              "linear-gradient(180deg, rgba(240,212,138,.15), #F0D48A, rgba(240,212,138,.15))",
          }}
        />
        <div
          className="relative flex size-[46px] items-center justify-center rounded-full text-[var(--color-faa-cta-ink)] shadow-[0_10px_26px_-6px_rgba(0,0,0,0.6)]"
          style={{ background: GOLD_GRADIENT }}
        >
          <Icon.ChevronsLeftRight className="size-5" strokeWidth={2.4} />
        </div>
      </div>
    </div>
  );
}
