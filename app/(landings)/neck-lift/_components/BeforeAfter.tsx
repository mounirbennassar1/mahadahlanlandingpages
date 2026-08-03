"use client";

import Image from "next/image";
import { useCallback, useRef } from "react";
import { Icon } from "@/components/icons";
import { GOLD_GRADIENT } from "./config";

/**
 * Draggable before/after comparison, per the design: the after image is the
 * base layer, the before layer is clipped from the left so it occupies the
 * right (RTL start) half, and a glowing champagne line follows the pointer.
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
      className="relative touch-pan-y overflow-hidden rounded-[26px] border-2 border-[rgba(201,156,78,0.45)] bg-[var(--color-nkl-band)] shadow-[0_40px_90px_-36px_rgba(138,100,48,0.5)] select-none"
      style={{ aspectRatio: "16/10" }}
    >
      <div className="absolute inset-0">
        <Image
          src="/neck-lift/after.jpg"
          alt="بعد علاج ترهل الرقبة"
          fill
          sizes="(max-width: 1060px) 94vw, 1020px"
          draggable={false}
          className="object-cover"
        />
      </div>
      <div
        ref={topRef}
        className="absolute inset-0"
        style={{ clipPath: "inset(0 50% 0 0)" }}
      >
        <Image
          src="/neck-lift/before.jpg"
          alt="قبل علاج ترهل الرقبة"
          fill
          sizes="(max-width: 1060px) 94vw, 1020px"
          draggable={false}
          className="object-cover"
        />
      </div>

      <span className="pointer-events-none absolute top-4 right-4 z-[3] rounded-full bg-[rgba(39,28,17,0.75)] px-3.5 py-1.5 text-[0.76rem] font-extrabold text-[#F0D48A] backdrop-blur-md">
        قبل
      </span>
      <span className="pointer-events-none absolute top-4 left-4 z-[3] rounded-full bg-[rgba(39,28,17,0.75)] px-3.5 py-1.5 text-[0.76rem] font-extrabold text-[#F0D48A] backdrop-blur-md">
        بعد
      </span>

      <div
        ref={handleRef}
        className="absolute top-0 bottom-0 left-1/2 z-[4] w-0.5 cursor-ew-resize touch-none bg-[var(--color-nkl-champagne)]"
        style={{ boxShadow: "0 0 20px rgba(201,156,78,.7)" }}
      >
        <span
          className="absolute top-1/2 left-1/2 flex size-[46px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-[#FFFDF8] shadow-[0_10px_30px_-8px_rgba(138,100,48,0.7)]"
          style={{ background: GOLD_GRADIENT }}
        >
          <Icon.ChevronsLeftRight className="size-5" strokeWidth={2.4} />
        </span>
      </div>
    </div>
  );
}
