import { getDict, type Locale } from "./i18n/dictionary";
import { PayLogo } from "./PayLogo";

/**
 * Accepted-payment badges: Apple Pay, Visa, Mastercard, mada, plus the tabby /
 * tamara split-payment logos. The card brands are drawn inline (simple
 * wordmarks, no external assets) so they stay crisp on the dark ground.
 */

type Brand = "applepay" | "visa" | "mastercard" | "mada";

const BADGE =
  "inline-flex h-9 shrink-0 items-center justify-center rounded-lg px-3 select-none";

function AppleLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M16.37 12.64c.02 2.62 2.3 3.49 2.33 3.5-.02.06-.36 1.24-1.2 2.45-.72 1.05-1.47 2.09-2.65 2.11-1.16.02-1.53-.69-2.86-.69-1.33 0-1.74.67-2.84.71-1.14.04-2-1.13-2.73-2.18-1.49-2.15-2.62-6.08-1.09-8.73.76-1.32 2.12-2.15 3.59-2.17 1.12-.02 2.17.75 2.86.75.68 0 1.97-.93 3.32-.79.56.02 2.15.23 3.17 1.71-.08.05-1.89 1.1-1.87 3.33M14.15 5.4c.6-.73 1.01-1.75.9-2.76-.87.04-1.92.58-2.54 1.31-.56.65-1.05 1.69-.92 2.68.97.08 1.96-.49 2.56-1.23" />
    </svg>
  );
}

function CardBadge({ brand, madaAria }: { brand: Brand; madaAria: string }) {
  switch (brand) {
    case "applepay":
      return (
        <span
          className={`${BADGE} gap-0.5 bg-black text-white ring-1 ring-white/15`}
          aria-label="Apple Pay"
          dir="ltr"
        >
          <AppleLogo className="size-[15px]" />
          <span className="text-[0.95rem] font-semibold tracking-tight">Pay</span>
        </span>
      );
    case "visa":
      return (
        <span className={`${BADGE} bg-white`} aria-label="Visa" dir="ltr">
          <span
            className="text-[1.05rem] font-black italic tracking-tight text-[#1A1F71]"
            style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
          >
            VISA
          </span>
        </span>
      );
    case "mastercard":
      return (
        <span
          className={`${BADGE} gap-1.5 bg-[#1C1C1C] ring-1 ring-white/15`}
          aria-label="Mastercard"
          dir="ltr"
        >
          <span className="relative block h-[18px] w-[28px]" aria-hidden>
            <span className="absolute left-0 top-0 size-[18px] rounded-full bg-[#EB001B]" />
            <span className="absolute left-[10px] top-0 size-[18px] rounded-full bg-[#F79E1B] mix-blend-screen" />
          </span>
          <span
            className="text-[0.72rem] font-semibold text-white"
            style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
          >
            mastercard
          </span>
        </span>
      );
    case "mada":
      return (
        <span className={`${BADGE} gap-1.5 bg-white`} aria-label={madaAria} dir="ltr">
          <span className="flex flex-col gap-[3px]" aria-hidden>
            <span className="block h-[5px] w-[22px] rounded-sm bg-[#84B740]" />
            <span className="block h-[5px] w-[22px] rounded-sm bg-[#259BD6]" />
          </span>
          <span
            className="text-[0.95rem] font-bold tracking-tight text-[#1B2E4B]"
            style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
          >
            mada
          </span>
        </span>
      );
  }
}

export const CARD_BRANDS: Brand[] = ["applepay", "mada", "visa", "mastercard"];

/** Row of every accepted payment method. */
export function PaymentBadges({
  withSplit = true,
  className = "",
  locale = "ar",
}: {
  /** Include the tabby / tamara logos at the end. */
  withSplit?: boolean;
  className?: string;
  locale?: Locale;
}) {
  const { madaAria } = getDict(locale).payments;
  return (
    <ul className={`flex flex-wrap items-center gap-2.5 ${className}`}>
      {CARD_BRANDS.map((brand) => (
        <li key={brand}>
          <CardBadge brand={brand} madaAria={madaAria} />
        </li>
      ))}
      {withSplit ? (
        <>
          <li>
            <PayLogo brand="tabby" height={36} />
          </li>
          <li>
            <PayLogo brand="tamara" height={36} />
          </li>
        </>
      ) : null}
    </ul>
  );
}
