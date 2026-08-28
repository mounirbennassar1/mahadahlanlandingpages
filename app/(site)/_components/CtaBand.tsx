import Link from "next/link";
import { Icon, SocialIcon } from "@/components/icons";
import { Reveal } from "@/app/_home/Motion";
import { Section } from "@/app/_home/Sections";
import { GOLD_GRADIENT, PHONE_DISPLAY, TEL_LINK, WA_LINK } from "@/app/_home/config";

/**
 * Closing booking band shared by the site pages (mirrors the home #contact
 * block): gold WhatsApp button, phone, and a link to the booking page.
 */
export function CtaBand({
  eyebrow = "المواعيد محدودة أسبوعياً",
  title = "ابدئي باستشارة،",
  gold = "لا بقرارٍ متعجّل",
  body = "لأن القرار الأفضل يبدأ بمعرفة ما يناسبك.",
  bookHref = "/book-now",
  bookLabel = "احجزي موعدك",
  whatsappHref = WA_LINK,
  points = ["استشارة مع مختص", "خيارات تناسب حالتكِ", "خصوصية تامة"],
  id = "contact",
}: {
  eyebrow?: string;
  title?: string;
  gold?: string;
  body?: string;
  bookHref?: string;
  bookLabel?: string;
  whatsappHref?: string;
  points?: string[];
  id?: string;
}) {
  return (
    <Section id={id} className="bg-[var(--color-md-band)]">
      <Reveal className="relative overflow-hidden rounded-[32px] border border-[var(--color-md-line-strong)] bg-[#120D07] px-7 py-14 text-center sm:px-14">
        <div
          className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[760px] -translate-x-1/2 blur-[40px]"
          style={{
            background:
              "radial-gradient(ellipse 50% 50% at 50% 0%, rgba(201,156,78,.32), transparent 70%)",
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(rgba(240,212,138,.14) 1px, transparent 1px)",
            backgroundSize: "26px 26px",
            maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, #000 20%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, #000 20%, transparent 75%)",
          }}
          aria-hidden
        />

        <div className="relative mx-auto flex max-w-[640px] flex-col items-center">
          <span className="inline-flex items-center gap-2.5 rounded-full border border-[rgba(240,212,138,0.3)] px-[18px] py-2 text-[0.78rem] font-bold text-[#F0D48A]">
            <span
              className="size-1.5 rounded-full bg-[var(--color-md-neon)]"
              style={{ animation: "md-neon-pulse 2.4s ease-in-out infinite" }}
            />
            {eyebrow}
          </span>

          <h2 className="mt-6 text-[clamp(1.8rem,4.2vw,2.7rem)] leading-[1.55] font-extrabold text-[#FDF8EE]">
            {title}
            <br />
            <span className="md-gold-glow inline-block">
              <span className="md-gold-text">{gold}</span>
            </span>
          </h2>
          <p className="mt-4 text-[1rem] leading-[1.9] font-light text-[#EFE6D6]/70">{body}</p>

          <div className="mt-9 flex w-full flex-col gap-3.5 sm:w-auto sm:flex-row">
            <Link
              href={bookHref}
              className="inline-flex items-center justify-center gap-2.5 rounded-full px-[32px] py-4 text-base font-extrabold text-[var(--color-md-ink)] shadow-[0_0_38px_-8px_rgba(232,195,106,0.6)] transition-all duration-300 hover:-translate-y-[3px] hover:shadow-[0_0_52px_-8px_rgba(255,223,142,0.8)]"
              style={{ background: GOLD_GRADIENT }}
            >
              <Icon.CalendarCheck className="size-[18px]" />
              {bookLabel}
            </Link>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 rounded-full border border-[rgba(240,212,138,0.35)] px-[30px] py-4 text-base font-extrabold text-[#F0D48A] transition-all duration-300 hover:bg-[rgba(240,212,138,0.1)] hover:shadow-[0_0_28px_-8px_rgba(255,233,168,0.5)]"
            >
              <SocialIcon name="whatsapp" className="text-[19px]" />
              واتساب
            </a>
            <a
              href={TEL_LINK}
              className="inline-flex items-center justify-center gap-2.5 rounded-full border border-[rgba(240,212,138,0.35)] px-[30px] py-4 text-base font-extrabold text-[#F0D48A] transition-all duration-300 hover:bg-[rgba(240,212,138,0.1)] hover:shadow-[0_0_28px_-8px_rgba(255,233,168,0.5)]"
            >
              <Icon.Phone className="size-[18px]" />
              <span dir="ltr">{PHONE_DISPLAY}</span>
            </a>
          </div>

          {points.length ? (
            <ul className="mt-9 flex flex-wrap justify-center gap-x-6 gap-y-3 text-[0.84rem] font-bold text-[#EFE6D6]/60">
              {points.map((item) => (
                <li key={item} className="inline-flex items-center gap-2">
                  <Icon.Check className="size-4 text-[var(--color-md-champagne)]" strokeWidth={3} />
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </Reveal>
    </Section>
  );
}
