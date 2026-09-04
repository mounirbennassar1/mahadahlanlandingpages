import { LuStar } from "react-icons/lu";
import { Icon } from "@/components/icons";
import { Reveal } from "@/app/_home/Motion";
import { Section } from "@/app/_home/Sections";
import { GOLD_GRADIENT, MAPS_LINK } from "@/app/_home/config";
import type { ContentOf } from "@/lib/pages/define";
import type { NEWS_ARTICLES } from "../content";

type ReviewsCopy = ContentOf<typeof NEWS_ARTICLES>["reviews"];

/** "Visited us recently? Leave a review" band linking to the Google listing. */
export function ReviewsBand({ copy }: { copy: ReviewsCopy }) {
  return (
    <Section className="bg-[var(--color-md-bg)]">
      <Reveal className="relative overflow-hidden rounded-[32px] border border-[var(--color-md-line-strong)] bg-[#120D07] px-7 py-12 sm:px-12">
        <div
          className="pointer-events-none absolute -top-32 right-1/3 h-[360px] w-[620px] blur-[40px]"
          style={{ background: "radial-gradient(ellipse 50% 50% at 50% 0%, rgba(201,156,78,.28), transparent 70%)" }}
          aria-hidden
        />
        <div className="relative grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(240,212,138,0.3)] px-[18px] py-2 text-[0.78rem] font-bold text-[#F0D48A]">
              <span className="flex gap-0.5" aria-hidden>
                {Array.from({ length: 5 }, (_, i) => (
                  <LuStar key={i} className="size-3 fill-[var(--color-md-gold-bright)] text-[var(--color-md-gold-bright)]" />
                ))}
              </span>
              {copy.badge}
            </span>
            <h2 className="mt-5 text-[clamp(1.6rem,3.6vw,2.3rem)] leading-[1.5] font-extrabold text-[#FDF8EE]">
              {copy.title}
              <br />
              <span className="md-gold-glow inline-block">
                <span className="md-gold-text">{copy.gold}</span>
              </span>
            </h2>
            <p className="mt-4 max-w-[52ch] text-[0.98rem] leading-[1.9] font-light text-[#EFE6D6]/70">
              {copy.body}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-stretch">
            <a
              href={MAPS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full px-8 py-4 text-base font-extrabold text-[var(--color-md-ink)] shadow-[0_0_38px_-8px_rgba(232,195,106,0.6)] transition-all duration-300 hover:-translate-y-[3px] hover:shadow-[0_0_52px_-8px_rgba(255,223,142,0.8)]"
              style={{ background: GOLD_GRADIENT }}
            >
              <LuStar className="size-[18px] fill-current" />
              {copy.review}
            </a>
            <a
              href="/book-now"
              className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full border border-[rgba(240,212,138,0.35)] px-8 py-4 text-base font-extrabold text-[#F0D48A] transition-all duration-300 hover:bg-[rgba(240,212,138,0.1)]"
            >
              <Icon.CalendarCheck className="size-[18px]" />
              {copy.book}
            </a>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
