import Link from "next/link";
import { Icon } from "@/components/icons";
import { toArabicDigits } from "@/app/_home/config";
import { CARD, CHIP } from "@/app/(site)/_components/SiteButtons";
import { DeviceFigure } from "./DeviceFigure";

export type DeviceCardData = {
  slug: string;
  name: string;
  nameEn: string | null;
  tagline: string | null;
  usedFor: string[];
  image: string | null;
  imageAlt: string | null;
};

export function DeviceCard({ device, className = "" }: { device: DeviceCardData; className?: string }) {
  const shown = device.usedFor.slice(0, 3);
  const extra = device.usedFor.length - shown.length;

  return (
    <Link href={`/our-devices/${device.slug}`} className={`group flex flex-col ${CARD} p-4 sm:p-5 ${className}`}>
      <DeviceFigure device={device} />

      <div className="mt-5">
        <h3 className="text-[1.12rem] leading-[1.5] font-extrabold text-[var(--color-md-text)]">{toArabicDigits(device.name)}</h3>
        {device.nameEn ? (
          <span
            dir="ltr"
            className="mt-0.5 inline-block text-[0.72rem] font-bold tracking-[0.14em] text-[var(--color-md-gold)] uppercase"
          >
            {device.nameEn}
          </span>
        ) : null}
        {device.tagline ? (
          <p className="mt-2 text-[0.88rem] leading-[1.8] font-light text-[rgba(246,238,223,0.6)]">{device.tagline}</p>
        ) : null}
      </div>

      {shown.length ? (
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {shown.map((u) => (
            <li key={u} className={CHIP}>
              {u}
            </li>
          ))}
          {extra > 0 ? <li className={`${CHIP} text-[var(--color-md-champagne)]`}>+{toArabicDigits(extra)}</li> : null}
        </ul>
      ) : null}

      <span className="mt-auto inline-flex items-center gap-2 pt-5 text-[0.86rem] font-extrabold text-[var(--color-md-champagne)] transition-colors group-hover:text-[var(--color-md-neon)]">
        تفاصيل الجهاز
        <Icon.ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" strokeWidth={2.4} />
      </span>
    </Link>
  );
}
