import { GOLD_GRADIENT } from "@/app/_home/config";

/**
 * Gold initials block used wherever a DB image is missing (doctor portrait,
 * device figure). Fills its parent; pair it with an aspect-ratio container.
 */
export function Monogram({
  text,
  className = "",
  size = "clamp(2.4rem, 9vw, 4.6rem)",
}: {
  text: string;
  className?: string;
  size?: string;
}) {
  return (
    <div
      className={`relative flex size-full items-center justify-center overflow-hidden ${className}`}
      style={{ background: GOLD_GRADIENT }}
      aria-hidden
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(rgba(36,26,14,.22) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />
      <span
        className="relative font-extrabold leading-none text-[var(--color-md-ink)]"
        style={{ fontSize: size }}
      >
        {text}
      </span>
    </div>
  );
}
