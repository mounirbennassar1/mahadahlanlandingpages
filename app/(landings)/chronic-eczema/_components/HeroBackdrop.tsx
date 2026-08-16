"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";

// three.js is ~700KB — keep it out of the initial bundle. The video and the
// CSS overlay below paint immediately; the dust fades in after hydration.
const HeroDust = dynamic(() => import("./HeroDust"), { ssr: false });

const VIDEO_SRC = "/chronic-eczema/hero-bg.mp4";
const POSTER_SRC = "/chronic-eczema/hero-bg.jpg";

const subscribeReducedMotion = (cb: () => void) => {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

/**
 * Hero backdrop, layered bottom-up:
 *   1. the clinic video, crisp and untouched
 *   2. a cinematic overlay — even darkening, two slow-drifting aurora glows
 *      in the brand gold/plum, a vignette, and a bottom melt into the page
 *   3. a lazily-loaded WebGL layer of floating gold bokeh dust, above the
 *      overlay
 * Under prefers-reduced-motion the video and the dust are both replaced by
 * a static poster.
 */
export function HeroBackdrop({ className }: { className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const reduced = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );

  // keep the loop playing when it scrolls back into view (mobile browsers
  // suspend offscreen video)
  useEffect(() => {
    if (reduced) return;
    const video = videoRef.current;
    if (!video) return;

    video.play().catch(() => {
      /* poster keeps covering if autoplay is blocked */
    });

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && video.paused) video.play().catch(() => {});
    });
    io.observe(video);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <div className={`overflow-hidden ${className ?? ""}`} aria-hidden>
      {reduced ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={POSTER_SRC}
          alt=""
          className="absolute inset-0 size-full object-cover"
        />
      ) : (
        <video
          ref={videoRef}
          className="absolute inset-0 size-full object-cover"
          src={VIDEO_SRC}
          poster={POSTER_SRC}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      )}

      {/* even cinematic darkening — text is readable anywhere on the frame */}
      <div className="absolute inset-0 bg-[rgba(14,7,25,0.58)]" />

      {/* aurora: two slow-drifting brand glows breathing over the footage */}
      <div
        className="che-aurora absolute -top-[18%] -right-[12%] size-[68vmax] rounded-full mix-blend-screen"
        style={{
          background:
            "radial-gradient(circle, rgba(201,164,92,0.32) 0%, rgba(201,164,92,0.1) 38%, transparent 68%)",
        }}
      />
      <div
        className="che-aurora-2 absolute -bottom-[22%] -left-[14%] size-[74vmax] rounded-full mix-blend-screen"
        style={{
          background:
            "radial-gradient(circle, rgba(92,59,142,0.4) 0%, rgba(92,59,142,0.14) 40%, transparent 68%)",
        }}
      />

      {/* vignette + melt the bottom into the page ground */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 120% 90% at 50% 42%, transparent 55%, rgba(10,4,20,0.5) 100%), linear-gradient(to top, var(--color-che-bg) 0%, rgba(20,12,34,0.4) 14%, transparent 32%)",
        }}
      />

      {/* gold bokeh, above the overlay */}
      {!reduced && <HeroDust className="absolute inset-0" />}
    </div>
  );
}
