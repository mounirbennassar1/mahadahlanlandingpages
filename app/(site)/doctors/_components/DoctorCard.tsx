import Link from "next/link";
import { Icon } from "@/components/icons";
import { GOLD_GRADIENT } from "@/app/_home/config";
import { CARD, CHIP } from "@/app/(site)/_components/SiteButtons";
import { DoctorPortrait } from "./DoctorPortrait";

export type DoctorCardData = {
  slug: string;
  name: string;
  title: string;
  credentials: string[];
  specialties: string[];
  image: string | null;
  imageAlt: string | null;
};

/**
 * Team card: arch portrait, name, role, two credentials, specialty chips and
 * the profile / booking links. `compact` drops the lists (teasers, "others").
 */
export function DoctorCard({
  doctor,
  variant = "full",
  className = "",
}: {
  doctor: DoctorCardData;
  variant?: "full" | "compact";
  className?: string;
}) {
  const compact = variant === "compact";
  const profile = `/doctors/${doctor.slug}`;
  const book = `/book-now?doctor=${encodeURIComponent(doctor.slug)}`;

  return (
    <article className={`group relative flex flex-col ${CARD} p-6 sm:p-7 ${className}`}>
      <DoctorPortrait
        doctor={doctor}
        className={`mx-auto mt-3 w-[68%] ${compact ? "max-w-[190px]" : "max-w-[230px]"}`}
        sizes="(max-width: 768px) 55vw, 230px"
      />

      <div className="mt-6 text-center">
        <h3 className={`font-extrabold text-[var(--color-md-text)] ${compact ? "text-[1.08rem]" : "text-[1.25rem]"}`}>
          <Link href={profile} className="transition-colors hover:text-[var(--color-md-champagne)]">
            {doctor.name}
          </Link>
        </h3>
        <p className="mt-1 text-[0.86rem] font-bold text-[var(--color-md-champagne)]">{doctor.title}</p>
      </div>

      {!compact && doctor.credentials.length ? (
        <ul className="mt-5 border-t border-[var(--color-md-line)]">
          {doctor.credentials.slice(0, 2).map((c) => (
            <li key={c} className="flex items-start gap-3 border-b border-[var(--color-md-line)] py-2.5">
              <Icon.BadgeCheck className="mt-1 size-4 shrink-0 text-[var(--color-md-gold)]" />
              <span className="text-[0.84rem] leading-6 font-bold text-[rgba(246,238,223,0.75)]">{c}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {!compact && doctor.specialties.length ? (
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {doctor.specialties.slice(0, 4).map((s) => (
            <li key={s} className={CHIP}>
              {s}
            </li>
          ))}
        </ul>
      ) : null}

      <div className={`mt-auto flex items-center justify-between gap-3 ${compact ? "pt-5" : "pt-6"}`}>
        <Link
          href={profile}
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[0.86rem] font-extrabold text-[var(--color-md-ink)] shadow-[0_0_24px_-8px_rgba(232,195,106,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_34px_-8px_rgba(255,223,142,0.8)]"
          style={{ background: GOLD_GRADIENT }}
        >
          الملف الكامل
          <Icon.ArrowLeft className="size-4" strokeWidth={2.4} />
        </Link>
        <Link
          href={book}
          className="inline-flex items-center gap-1.5 text-[0.84rem] font-extrabold text-[var(--color-md-champagne)] transition-colors hover:text-[var(--color-md-neon)]"
        >
          <Icon.CalendarCheck className="size-4" />
          احجزي معها
        </Link>
      </div>
    </article>
  );
}
