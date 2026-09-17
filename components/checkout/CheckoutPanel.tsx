"use client";

import type { ReactNode } from "react";
import { Icon } from "@/components/icons";
import { almarai } from "@/lib/fonts";
import { CheckoutForm } from "./CheckoutForm";
import { useCheckout } from "./CheckoutContext";
import { themeVars, type CheckoutTheme } from "./theme";

/**
 * Inline version of the checkout for a landing's booking section (where the
 * lead form used to be). Must sit inside the page's <CheckoutProvider>.
 */
export function CheckoutPanel({
  theme = "light",
  badge = "الدفع الإلكتروني الآمن",
  title = "احجزي وادفعي الآن",
  subtitle = "اختاري باقتك، أدخلي بياناتك، وادفعي بأمان عبر noon. نتصل بك خلال ساعات العمل لتثبيت الموعد.",
  id,
  className = "",
  useAlmarai = false,
  aside,
}: {
  theme?: CheckoutTheme;
  badge?: string | null;
  title?: string;
  subtitle?: string | null;
  id?: string;
  className?: string;
  /** Landings that do not load Almarai themselves can ask the panel to. */
  useAlmarai?: boolean;
  /** Extra content under the heading, e.g. a reassurance row. */
  aside?: ReactNode;
}) {
  const { items, page, whatsappHref } = useCheckout();
  return (
    <div
      id={id}
      dir="rtl"
      className={`${useAlmarai ? almarai.className : ""} relative overflow-hidden rounded-[28px] border border-[var(--ck-line-strong)] bg-[var(--ck-bg)] p-5 text-[var(--ck-text)] shadow-[0_40px_90px_-40px_rgba(138,100,48,0.35)] sm:p-7 ${className}`}
      style={{ ...themeVars(theme), lineHeight: 1.7 }}
    >
      <div
        className="pointer-events-none absolute -top-24 -left-16 size-64 rounded-full blur-[40px]"
        style={{ background: "radial-gradient(circle, rgba(232,195,106,.16), transparent 70%)" }}
        aria-hidden
      />
      <div className="relative mb-5 flex flex-col gap-2">
        {badge ? (
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--ck-line-strong)] px-3.5 py-1.5 text-[0.72rem] font-extrabold text-[var(--ck-champagne)]">
            <Icon.Lock className="size-3.5" strokeWidth={2.4} />
            {badge}
          </span>
        ) : null}
        <h3 className="m-0 text-[1.35rem] leading-[1.4] font-extrabold text-[var(--ck-text)] sm:text-[1.6rem]">{title}</h3>
        {subtitle ? <p className="m-0 text-[0.9rem] leading-[1.85] text-[var(--ck-muted)]">{subtitle}</p> : null}
        {aside}
      </div>
      <div className="relative">
        <CheckoutForm items={items} page={page} whatsappHref={whatsappHref} variant="panel" />
      </div>
    </div>
  );
}
