"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Next.js App Router-safe wrapper around `gsap.context()`. Automatically
 * reverts timelines and ScrollTriggers on unmount.
 */
export function useGSAPContext(
  callback: (context: gsap.Context) => void,
  dependencies: React.DependencyList = [],
) {
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      callback(gsap.context(() => {}));
    });

    return () => {
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
}
