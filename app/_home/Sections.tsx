import type { ReactNode } from "react";
import { Reveal } from "./Motion";
import { LANG_META, type Locale } from "./i18n/dictionary";

/** Eyebrow pill + gold-glow headline + optional lede. Shared by the home page
 *  and every site page so section heads stay identical across the site. */
export function SectionHead({
  eyebrow,
  title,
  gold,
  body,
  align = "center",
  as: Heading = "h2",
  locale = "ar",
}: {
  eyebrow: string;
  title: string;
  gold?: string;
  body?: string;
  align?: "center" | "start";
  /** Use "h1" for the first head on a page. */
  as?: "h1" | "h2";
  /** Decides which edge `align="start"` hugs. */
  locale?: Locale;
}) {
  const isRtl = LANG_META[locale].dir === "rtl";
  return (
    <Reveal
      className={`flex flex-col ${
        align === "center"
          ? "items-center text-center"
          : isRtl
            ? "items-start text-right"
            : "items-start text-left"
      }`}
    >
      <span className="inline-flex items-center gap-2.5 rounded-full border border-[var(--color-md-line-strong)] bg-[rgba(22,16,10,0.7)] px-[18px] py-2 text-[0.78rem] font-bold text-[var(--color-md-champagne)]">
        <span
          className="size-1.5 rounded-full bg-[var(--color-md-neon)]"
          style={{ animation: "md-neon-pulse 2.4s ease-in-out infinite" }}
        />
        {eyebrow}
      </span>
      <Heading className="mt-5 text-[clamp(1.8rem,4vw,2.8rem)] leading-[1.55] font-extrabold tracking-[-0.01em] text-[var(--color-md-text)]">
        {title}
        {gold ? (
          <>
            {" "}
            {/* glow lives on the wrapper: filter + background-clip:text on the
                same element makes Chrome paint the gradient as a box */}
            <span className="md-gold-glow inline-block">
              <span className="md-gold-text">{gold}</span>
            </span>
          </>
        ) : null}
      </Heading>
      {body ? (
        <p className="mt-4 max-w-[62ch] text-[1.02rem] leading-[1.9] font-light text-[rgba(246,238,223,0.6)]">
          {body}
        </p>
      ) : null}
    </Reveal>
  );
}

export function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`px-[22px] py-[78px] sm:py-[96px] ${className}`}>
      <div className="mx-auto max-w-[1180px]">{children}</div>
    </section>
  );
}

/** Soft champagne halo used between the dark bands. */
export function Glow({ className }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute blur-[50px] ${className ?? ""}`}
      style={{
        background:
          "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(201,156,78,.14), transparent 70%)",
      }}
      aria-hidden
    />
  );
}
