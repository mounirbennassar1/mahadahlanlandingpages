// Centralized motion tokens for consistent easing and durations across GSAP and Framer Motion.

export const DURATION = {
  fast: 0.3,
  base: 0.5,
  slow: 0.8,
  cinematic: 1.2,
};

// Framer Motion spring presets
export const SPRING = {
  soft: { type: "spring", stiffness: 100, damping: 20, mass: 1 },
  tight: { type: "spring", stiffness: 300, damping: 25, mass: 0.5 },
  bouncy: { type: "spring", stiffness: 400, damping: 10, mass: 1 },
} as const;

// GSAP easing strings
export const EASE = {
  lux: "power4.inOut",
  out: "power3.out",
  inOut: "power2.inOut",
  snap: "expo.out",
};

// Framer Motion cubic-bezier arrays
export const BEZIER = {
  lux: [0.76, 0, 0.24, 1],
  out: [0.33, 1, 0.68, 1],
  inOut: [0.65, 0, 0.35, 1],
} as const;
