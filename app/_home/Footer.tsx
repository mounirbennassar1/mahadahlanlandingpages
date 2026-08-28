import Image from "next/image";
import Link from "next/link";
import { Icon, SocialIcon } from "@/components/icons";
import { PaymentBadges } from "./PaymentBadges";
import {
  MAPS_LINK,
  PHONE_DISPLAY,
  SPECIALTIES,
  TEL_LINK,
  CATEGORIES,
  CATEGORY_ALL,
  toArabicDigits,
} from "./config";
import {
  getDict,
  LANG_META,
  specialtyCopy,
  waLink,
  type Locale,
} from "./i18n/dictionary";

const SOCIAL_LINKS: { name: "instagram" | "tiktok" | "snapchat" | "x"; href: string }[] = [
  { name: "instagram", href: "https://www.instagram.com/md_clinics_" },
  { name: "tiktok", href: "https://www.tiktok.com/@md.clinics" },
  { name: "snapchat", href: "https://snapchat.com/t/RI87LsZs" },
  { name: "x", href: "https://x.com/md_clinics_" },
];

const LINK_COLUMNS = CATEGORIES.filter((c) => c !== CATEGORY_ALL);

export function Footer({ locale = "ar" }: { locale?: Locale }) {
  const t = getDict(locale);
  const copy = t.footer;
  const isRtl = LANG_META[locale].dir === "rtl";
  // Hover chevron slides in from the reading-start edge; the label is pulled
  // over the (hidden) chevron's slot with a negative start margin.
  const Chevron = isRtl ? Icon.ChevronLeft : Icon.ChevronRight;
  const slide = isRtl
    ? "-mr-[22px] transition-transform duration-300 group-hover:mr-0"
    : "-ml-[22px] transition-transform duration-300 group-hover:ml-0";

  return (
    <footer className="relative overflow-hidden border-t border-[rgba(201,156,78,0.18)] bg-[#080604] pt-16 pb-8 text-[#EFE6D6]">
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[820px] -translate-x-1/2 blur-[40px]"
        style={{
          background:
            "radial-gradient(ellipse 50% 50% at 50% 0%, rgba(201,156,78,.22), transparent 70%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1180px] px-[22px]">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1.6fr]">
          {/* brand */}
          <div>
            <Image
              src="/logo.webp"
              alt={copy.logoAlt}
              width={70}
              height={70}
              className="size-[70px] object-contain"
            />
            <p className="mt-5 max-w-[42ch] text-[0.95rem] leading-[1.9] font-light text-[#EFE6D6]/70">
              {copy.blurb}
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={copy.socials[s.name]}
                  className="flex size-10 items-center justify-center rounded-full border border-[rgba(240,212,138,0.25)] text-[#F0D48A] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#F0D48A] hover:bg-[rgba(240,212,138,0.1)]"
                >
                  <SocialIcon name={s.name} />
                </a>
              ))}
            </div>

            <div className="mt-7 flex flex-col gap-3 text-[0.9rem]">
              <a
                href={TEL_LINK}
                className="inline-flex items-center gap-2.5 font-bold text-[#EFE6D6] transition-colors hover:text-[#F0D48A]"
              >
                <Icon.Phone className="size-4 text-[var(--color-md-champagne)]" />
                {PHONE_DISPLAY}
              </a>
              <a
                href={waLink(locale)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 font-bold text-[#EFE6D6] transition-colors hover:text-[#F0D48A]"
              >
                <SocialIcon name="whatsapp" className="text-[#25D366]" />
                {copy.whatsapp}
              </a>
              <a
                href={MAPS_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 font-light text-[#EFE6D6]/70 transition-colors hover:text-[#F0D48A]"
              >
                <Icon.MapPin className="size-4 text-[var(--color-md-champagne)]" />
                {copy.address}
              </a>
              <span className="inline-flex items-center gap-2.5 font-light text-[#EFE6D6]/70">
                <Icon.Clock className="size-4 text-[var(--color-md-champagne)]" />
                {t.topbar.hoursShort}
              </span>
            </div>

            {/* split-payment badges */}
            <div className="mt-7">
              <span className="text-[0.78rem] font-bold text-[#EFE6D6]/50">
                {copy.paymentsLabel}
              </span>
              <PaymentBadges className="mt-3" locale={locale} />
            </div>
          </div>

          {/* site pages + landing links, grouped by category */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <h3 className="mb-4 text-[0.8rem] font-extrabold text-[#F0D48A]">
                {copy.siteHeading}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {copy.siteLinks.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="group inline-flex items-start gap-2 text-[0.88rem] leading-[1.7] font-light text-[#EFE6D6]/70 transition-colors duration-300 hover:text-[#EFE6D6]"
                    >
                      <Chevron className="mt-1 size-3.5 shrink-0 text-[var(--color-md-champagne)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <span className={slide}>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {LINK_COLUMNS.map((cat) => {
              const items = SPECIALTIES.filter((s) => s.category === cat);
              if (!items.length) return null;

              return (
                <div key={cat}>
                  <h3 className="mb-4 text-[0.8rem] font-extrabold text-[#F0D48A]">
                    {copy.categories[cat] ?? cat}
                  </h3>
                  <ul className="flex flex-col gap-2.5">
                    {items.map((item) => (
                      <li key={item.slug}>
                        <Link
                          href={`/${item.slug}`}
                          className="group inline-flex items-start gap-2 text-[0.88rem] leading-[1.7] font-light text-[#EFE6D6]/70 transition-colors duration-300 hover:text-[#EFE6D6]"
                        >
                          <Chevron className="mt-1 size-3.5 shrink-0 text-[var(--color-md-champagne)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                          <span className={slide}>
                            {specialtyCopy(item.slug, locale).title}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        <div
          className={`mt-14 flex flex-col items-center justify-between gap-4 border-t border-[rgba(240,212,138,0.16)] pt-7 text-center text-[0.8rem] text-[#EFE6D6]/50 sm:flex-row ${
            isRtl ? "sm:text-right" : "sm:text-left"
          }`}
        >
          <span>
            {copy.copyrightPrefix}
            {toArabicDigits(new Date().getFullYear())}
            {copy.copyrightSuffix}
          </span>
          <span className="max-w-[46ch] font-light">{copy.disclaimer}</span>
        </div>
      </div>
    </footer>
  );
}
