import Image from "next/image";
import { LuNewspaper } from "react-icons/lu";
import { isOptimizableImage } from "@/lib/site";

/** Cover image (fills its positioned parent) with a gold-on-onyx fallback. */
export function ArticleCover({
  src,
  alt,
  sizes,
  priority = false,
  className = "",
}: {
  src: string | null;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  if (!src) {
    return (
      <div
        className={`absolute inset-0 flex items-center justify-center ${className}`}
        style={{ background: "linear-gradient(135deg, #16100A, #2A1D0E 55%, #3A2A14)" }}
        aria-hidden
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            backgroundImage: "radial-gradient(rgba(240,212,138,.14) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, #000 20%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, #000 20%, transparent 75%)",
          }}
        />
        <span className="relative flex size-16 items-center justify-center rounded-full border border-[rgba(240,212,138,0.3)] bg-[rgba(232,195,106,0.08)] text-[var(--color-md-champagne)]">
          <LuNewspaper className="size-7" />
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={!isOptimizableImage(src)}
      className={`object-cover ${className}`}
    />
  );
}
