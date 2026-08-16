import Image from "next/image";

const LOGOS = {
  tabby: { src: "/tabby.png", w: 512, h: 204, alt: "تابي | tabby" },
  tamara: { src: "/tamara.jpeg", w: 785, h: 254, alt: "تمارا | tamara" },
} as const;

type Props = {
  brand: keyof typeof LOGOS;
  /** Rendered height in px; width follows the logo's aspect ratio. */
  height?: number;
  className?: string;
};

/** Official tabby / tamara badge. The wrapper re-rounds the corners and the
 *  slight zoom clips the white corner slivers baked into the source files. */
export function PayLogo({ brand, height = 28, className = "" }: Props) {
  const logo = LOGOS[brand];
  const width = Math.round((logo.w / logo.h) * height);
  return (
    <span
      className={`inline-flex shrink-0 overflow-hidden rounded-lg ${className}`}
      style={{ width, height }}
    >
      <Image
        src={logo.src}
        alt={logo.alt}
        width={width}
        height={height}
        className="size-full scale-110 object-cover"
      />
    </span>
  );
}
