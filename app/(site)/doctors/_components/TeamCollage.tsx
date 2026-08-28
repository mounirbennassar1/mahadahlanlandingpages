import { DoctorPortrait, type PortraitDoctor } from "./DoctorPortrait";

/** Hero aside for /doctors: up to three arch portraits, the middle one lifted. */
export function TeamCollage({ doctors }: { doctors: (PortraitDoctor & { slug: string })[] }) {
  const trio = doctors.slice(0, 3);
  if (!trio.length) return null;

  return (
    <div className="relative mx-auto flex max-w-[520px] items-end justify-center gap-4 pt-8 sm:gap-6 lg:mx-0">
      <div
        className="pointer-events-none absolute inset-x-6 bottom-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(232,195,106,.6) 50%, transparent)",
        }}
        aria-hidden
      />
      {trio.map((d, i) => (
        <div
          key={d.slug}
          className={`w-[30%] ${trio.length === 3 && i === 1 ? "-translate-y-6 sm:-translate-y-9" : ""}`}
        >
          <DoctorPortrait
            doctor={d}
            priority={i === 0}
            sizes="(max-width: 1024px) 30vw, 165px"
          />
          <p className="mt-3 truncate text-center text-[0.76rem] font-bold text-[rgba(246,238,223,0.55)]">
            {d.name}
          </p>
        </div>
      ))}
    </div>
  );
}
