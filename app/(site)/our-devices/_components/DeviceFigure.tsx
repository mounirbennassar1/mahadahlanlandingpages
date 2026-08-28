import Image from "next/image";
import { Monogram } from "@/app/(site)/_components/Monogram";
import { safeImageSrc } from "@/app/(site)/_components/media";

export type FigureDevice = {
  name: string;
  nameEn: string | null;
  image: string | null;
  imageAlt: string | null;
};

/**
 * The device PNGs are transparent cut-outs, so instead of `object-cover`
 * they sit centered on a dark panel with a soft gold radial glow behind.
 */
export function DeviceFigure({
  device,
  variant = "card",
  sizes = "(max-width: 640px) 80vw, (max-width: 1024px) 45vw, 280px",
  priority = false,
  className = "",
}: {
  device: FigureDevice;
  variant?: "card" | "hero";
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const src = safeImageSrc(device.image);
  const hero = variant === "hero";

  return (
    <div
      className={`relative overflow-hidden border border-[var(--color-md-line)] bg-[#0E0906] ${
        hero ? "aspect-[4/5] rounded-[28px] sm:aspect-[5/6]" : "aspect-[4/5] rounded-[18px]"
      } ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 50% 58%, rgba(232,195,106,.28), rgba(201,156,78,.08) 55%, transparent 75%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(rgba(240,212,138,.14) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          maskImage: "radial-gradient(ellipse 60% 60% at 50% 50%, #000 10%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 60% 60% at 50% 50%, #000 10%, transparent 75%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-[18%] bottom-[9%] h-5 rounded-[50%] blur-md"
        style={{ background: "rgba(0,0,0,.55)" }}
        aria-hidden
      />

      {src ? (
        <Image
          src={src}
          alt={device.imageAlt ?? device.name}
          fill
          sizes={sizes}
          priority={priority}
          className={`object-contain transition-transform duration-700 ease-out group-hover:scale-[1.04] ${
            hero ? "p-10 sm:p-12" : "p-6"
          }`}
          style={{ filter: "drop-shadow(0 26px 26px rgba(0,0,0,.6))" }}
        />
      ) : (
        <Monogram text={(device.nameEn ?? device.name).slice(0, 2)} />
      )}
    </div>
  );
}
