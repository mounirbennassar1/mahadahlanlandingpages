"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  beforeSrc?: string;
  afterSrc?: string;
  beforeAlt?: string;
  afterAlt?: string;
  beforeLabel?: string;
  afterLabel?: string;
  initial?: number;
};

export default function BeforeAfter({
  beforeSrc,
  afterSrc,
  beforeAlt = "قبل",
  afterAlt = "بعد",
  beforeLabel = "قبل",
  afterLabel = "بعد",
  initial = 50,
}: Props) {
  const [pos, setPos] = useState(initial);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);

  const setFromClientX = useCallback((clientX: number) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ratio = (clientX - rect.left) / rect.width;
    const next = Math.max(0, Math.min(1, ratio)) * 100;
    setPos(next);
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      setFromClientX(e.clientX);
    };
    const onUp = () => {
      draggingRef.current = false;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [setFromClientX]);

  const onPointerDown = (e: React.PointerEvent) => {
    draggingRef.current = true;
    setFromClientX(e.clientX);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 4));
    else if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 4));
    else if (e.key === "Home") setPos(0);
    else if (e.key === "End") setPos(100);
  };

  return (
    <div
      ref={wrapRef}
      className="ba-slider"
      onPointerDown={onPointerDown}
      role="slider"
      aria-label="مقارنة قبل وبعد"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pos)}
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <div
        className={`ba-slider-layer ba-before${beforeSrc ? "" : " is-placeholder"}`}
      >
        {beforeSrc ? (
          <Image
            src={beforeSrc}
            alt={beforeAlt}
            fill
            sizes="(max-width: 600px) 90vw, (max-width: 1000px) 50vw, 33vw"
            draggable={false}
            style={{ objectFit: "cover" }}
          />
        ) : null}
      </div>
      <div
        className={`ba-slider-layer ba-after${afterSrc ? "" : " is-placeholder"}`}
        style={{
          clipPath: `inset(0 ${100 - pos}% 0 0)`,
          WebkitClipPath: `inset(0 ${100 - pos}% 0 0)`,
        }}
      >
        {afterSrc ? (
          <Image
            src={afterSrc}
            alt={afterAlt}
            fill
            sizes="(max-width: 600px) 90vw, (max-width: 1000px) 50vw, 33vw"
            draggable={false}
            style={{ objectFit: "cover" }}
          />
        ) : null}
      </div>

      <span className="ba-slider-tag tag-before">{beforeLabel}</span>
      <span className="ba-slider-tag tag-after">{afterLabel}</span>

      <div
        className="ba-slider-handle"
        style={{ left: `${pos}%` }}
        aria-hidden="true"
      >
        <span className="ba-slider-line" />
        <span className="ba-slider-knob">
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
            <path
              d="M9 6 L4 12 L9 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15 6 L20 12 L15 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </div>
  );
}
