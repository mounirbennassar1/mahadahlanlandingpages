"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });

  // Gradient is inline so we don't need a CSS rule for it. The tokens
  // come from the landing wrapper's inline-style palette declaration.
  return (
    <motion.div
      style={{
        scaleX,
        background:
          "linear-gradient(90deg, var(--color-mrf-primary), var(--color-mrf-accent))",
        willChange: "transform",
      }}
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-right"
    />
  );
}
