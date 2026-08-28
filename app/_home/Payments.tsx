import { Icon } from "@/components/icons";
import { getDict, LANG_META, type Locale } from "./i18n/dictionary";
import { PayLogo } from "./PayLogo";
import { PaymentBadges } from "./PaymentBadges";

/** Split-payment section: Tabby + Tamara cards with a perks row. */
export function Payments({ locale = "ar" }: { locale?: Locale }) {
  const copy = getDict(locale).payments;
  const isRtl = LANG_META[locale].dir === "rtl";
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:gap-6">
      {copy.providers.map((p) => (
        <article
          key={p.id}
          className="group relative overflow-hidden rounded-[26px] border border-[var(--color-md-line)] bg-[var(--color-md-card)] p-7 transition-all duration-400 hover:-translate-y-1.5 hover:border-[rgba(232,195,106,0.5)] hover:shadow-[0_0_44px_-12px_rgba(232,195,106,0.4)] sm:p-8"
        >
          <div
            className={`pointer-events-none absolute -top-20 ${
              isRtl ? "-left-14" : "-right-14"
            } size-52 rounded-full blur-[36px] opacity-60 transition-opacity duration-500 group-hover:opacity-100`}
            style={{
              background:
                "radial-gradient(circle, rgba(232,195,106,.2), transparent 70%)",
            }}
            aria-hidden
          />

          <div className="relative flex items-center justify-between gap-4">
            <PayLogo
              brand={p.id}
              height={44}
              className="shadow-[0_10px_26px_-12px_rgba(0,0,0,0.8)]"
            />
            <span
              className="inline-flex size-10 items-center justify-center rounded-full border border-[var(--color-md-line-strong)] text-[var(--color-md-champagne)]"
              aria-hidden
            >
              <Icon.CreditCard className="size-[18px]" strokeWidth={1.9} />
            </span>
          </div>

          <h3 className="relative mt-6 text-[1.15rem] font-extrabold text-[var(--color-md-text)]">
            {p.title}
          </h3>
          <p className="relative mt-2.5 text-[0.93rem] leading-[1.9] font-light text-[rgba(246,238,223,0.6)]">
            {p.body}
          </p>
        </article>
      ))}

      {/* every accepted payment method, incl. cards and Apple Pay */}
      <div
        className={`flex flex-col items-center gap-4 rounded-[26px] border border-[var(--color-md-line)] bg-[var(--color-md-card)] px-6 py-6 text-center md:col-span-2 md:flex-row md:justify-between ${
          isRtl ? "md:text-right" : "md:text-left"
        }`}
      >
        <div>
          <h3 className="text-[1.05rem] font-extrabold text-[var(--color-md-text)]">
            {copy.methodsTitle}
          </h3>
          <p className="mt-1.5 text-[0.9rem] leading-[1.8] font-light text-[rgba(246,238,223,0.6)]">
            {copy.methodsBody}
          </p>
        </div>
        <PaymentBadges className="justify-center md:justify-end" locale={locale} />
      </div>

      <ul className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3 md:col-span-2">
        {copy.perks.map((perk) => (
          <li
            key={perk}
            className="inline-flex items-center gap-2 text-[0.86rem] font-bold text-[rgba(246,238,223,0.65)]"
          >
            <Icon.Check
              className="size-4 text-[var(--color-md-champagne)]"
              strokeWidth={3}
            />
            {perk}
          </li>
        ))}
      </ul>
    </div>
  );
}
