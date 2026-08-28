import Link from "next/link";
import { Icon } from "@/components/icons";
import { GOLD_GRADIENT, WA_LINK } from "@/app/_home/config";
import { Glow } from "@/app/_home/Sections";

/** 404 body shared by the (site) group and the root not-found page. */
export function NotFoundView() {
  return (
    <section className="relative flex min-h-[70vh] items-center overflow-hidden bg-[var(--color-md-bg)] px-[22px] pt-[150px] pb-[96px]">
      <Glow className="-top-20 left-1/2 h-[360px] w-[640px] -translate-x-1/2" />
      <div className="relative mx-auto flex max-w-[640px] flex-col items-center text-center">
        <span className="md-gold-glow inline-block">
          <span className="md-gold-text text-[clamp(4rem,14vw,7rem)] leading-none font-extrabold">404</span>
        </span>
        <h1 className="mt-4 text-[clamp(1.6rem,4vw,2.4rem)] leading-[1.5] font-extrabold text-[var(--color-md-text)]">
          هذه الصفحة غير موجودة
        </h1>
        <p className="mt-4 max-w-[48ch] text-[1.02rem] leading-[1.9] font-light text-[rgba(246,238,223,0.6)]">
          ربما تغيّر الرابط أو حُذفت الصفحة. يمكنك العودة إلى الرئيسية أو التواصل
          معنا مباشرة لنساعدك.
        </p>
        <div className="mt-9 flex flex-col gap-3.5 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2.5 rounded-full px-[30px] py-4 text-base font-extrabold text-[var(--color-md-ink)] shadow-[0_0_34px_-8px_rgba(232,195,106,0.6)] transition-all duration-300 hover:-translate-y-[3px]"
            style={{ background: GOLD_GRADIENT }}
          >
            <Icon.ArrowRight className="size-[17px]" strokeWidth={2.4} />
            العودة إلى الرئيسية
          </Link>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 rounded-full border border-[rgba(240,212,138,0.35)] px-[30px] py-4 text-base font-extrabold text-[#F0D48A] transition-all duration-300 hover:bg-[rgba(240,212,138,0.1)]"
          >
            تواصلي عبر واتساب
          </a>
        </div>
      </div>
    </section>
  );
}
