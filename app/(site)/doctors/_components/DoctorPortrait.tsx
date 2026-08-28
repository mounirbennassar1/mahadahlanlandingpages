import Image from "next/image";
import { Monogram } from "@/app/(site)/_components/Monogram";
import { initialOf, safeImageSrc } from "@/app/(site)/_components/media";

export type PortraitDoctor = {
  name: string;
  image: string | null;
  imageAlt: string | null;
};

/**
 * Arch portrait with the offset hairline echo from the home team slider.
 * Falls back to a gold monogram when the DB has no (renderable) image.
 */
export function DoctorPortrait({
  doctor,
  sizes = "(max-width: 768px) 70vw, 260px",
  className = "",
  priority = false,
  echo = true,
}: {
  doctor: PortraitDoctor;
  sizes?: string;
  className?: string;
  priority?: boolean;
  echo?: boolean;
}) {
  const src = safeImageSrc(doctor.image);

  return (
    <div className={`relative ${className}`}>
      {echo ? (
        <div
          className="pointer-events-none absolute -inset-x-3 -top-3 bottom-5 rounded-t-full border border-[rgba(201,156,78,0.38)]"
          aria-hidden
        />
      ) : null}
      <div className="relative aspect-[3/4] overflow-hidden rounded-t-full bg-[var(--color-md-card)]">
        {src ? (
          <Image
            src={src}
            alt={doctor.imageAlt ?? doctor.name}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <Monogram text={initialOf(doctor.name)} />
        )}
      </div>
    </div>
  );
}
