"use client";

import { useRef, useEffect } from "react";
import { motion, useInView, useAnimation, useReducedMotion } from "framer-motion";
import { BEZIER, DURATION } from "./motion.tokens";

interface RevealProps {
  children: React.ReactNode;
  width?: "fit-content" | "100%";
  delay?: number;
  direction?: "up" | "left" | "right" | "none";
}

export function Reveal({
  children,
  width = "100%",
  delay = 0,
  direction = "up",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const mainControls = useAnimation();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
    }
  }, [isInView, mainControls]);

  let hiddenState = { opacity: 0, y: 0, x: 0, filter: "blur(0px)" };

  if (!shouldReduceMotion) {
    if (direction === "up") hiddenState = { opacity: 0, y: 60, x: 0, filter: "blur(10px)" };
    if (direction === "left") hiddenState = { opacity: 0, x: 60, y: 0, filter: "blur(10px)" };
    if (direction === "right") hiddenState = { opacity: 0, x: -60, y: 0, filter: "blur(10px)" };
    if (direction === "none") hiddenState = { opacity: 0, y: 0, x: 0, filter: "blur(0px)" };
  }

  return (
    <div ref={ref} style={{ width, overflow: "visible" }} className="relative z-10">
      <motion.div
        variants={{
          hidden: hiddenState,
          visible: { opacity: 1, y: 0, x: 0, filter: "blur(0px)" },
        }}
        initial="hidden"
        animate={mainControls}
        transition={{
          duration: shouldReduceMotion ? 0.2 : DURATION.slow,
          delay: delay,
          ease: BEZIER.lux,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
