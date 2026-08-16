"use client";

import dynamic from "next/dynamic";

/**
 * Client boundary so the decorative WebGL canvas can be code-split out of the
 * page's initial JS (`ssr: false` is only valid inside a Client Component).
 * three.js is ~700KB and this canvas is purely ornamental, so it loads after
 * hydration rather than blocking first paint.
 */
const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false });

export default function HeroCanvasLazy() {
  return <HeroCanvas />;
}
