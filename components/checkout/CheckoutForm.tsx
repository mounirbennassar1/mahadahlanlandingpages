"use client";

import { useId, useMemo, useRef, useState, type FormEvent } from "react";
import { Icon, SocialIcon } from "@/components/icons";
import { PaymentBadges } from "@/app/_home/PaymentBadges";
import { readUtmFromUrl } from "@/lib/utm";
import {
  CITIES,
  PHONE_ERROR,
  isValidSaudiMobile,
  normalizeSaudiMobile,
  toE164,
} from "@/app/(site)/_booking/shared";
import type { CheckoutPage, SellableItem } from "@/lib/checkout-types";
import { startCheckout } from "./client";
import { GOLD } from "./theme";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "redirecting" }
  | { kind: "error"; message: string; fallback: boolean };

type Errors = Partial<Record<"item" | "name" | "phone", string>>;

export type CheckoutFormProps = {
  items: SellableItem[];
  page: CheckoutPage;
  initialItemId?: string | null;
  whatsappHref: (item?: SellableItem | null) => string;
  /** The sheet has its own header; the inline panel prints one above the form. */
  variant?: "sheet" | "panel";
};

/**
 * Package picker + customer details + "pay" button. Posts to /api/checkout and
 * sends the browser to noon's hosted page. Styled only through the `--ck-*`
 * tokens so it fits both the dark sheet and the light landings.
 */
export function CheckoutForm({ items, page, initialItemId, whatsappHref, variant = "sheet" }: CheckoutFormProps) {
  const uid = useId();
  const rootRef = useRef<HTMLFormElement>(null);

  const [selectedId, setSelectedId] = useState<string>(() => {
    if (initialItemId && items.some((i) => i.id === initialItemId)) return initialItemId;
    return items.length === 1 ? items[0].id : initialItemId ?? (items[0]?.id ?? "");
  });
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState<string>(CITIES[0]);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const selected = useMemo(() => items.find((i) => i.id === selectedId) ?? null, [items, selectedId]);
  const busy = status.kind === "sending" || status.kind === "redirecting";
  const clear = (key: keyof Errors) => setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;

    const name = fullName.trim();
    const local = normalizeSaudiMobile(phone);
    const next: Errors = {};
    if (!selected) next.item = "اختاري الباقة التي تودّين دفعها.";
    if (name.length < 2) next.name = "اكتبي اسمك الكريم (حرفان على الأقل).";
    if (!isValidSaudiMobile(local)) next.phone = PHONE_ERROR;
    setErrors(next);
    if (Object.keys(next).length || !selected) {
      const first = Object.keys(next)[0];
      rootRef.current?.querySelector<HTMLElement>(`[data-field="${first}"]`)?.focus();
      return;
    }

    setStatus({ kind: "sending" });
    const result = await startCheckout({
      item: { kind: selected.kind, id: selected.id },
      fullName: name,
      phone: toE164(local),
      city,
      pageSlug: page.slug,
      ...readUtmFromUrl(),
    });

    if (!result.ok) {
      setStatus({
        kind: "error",
        message: result.error,
        fallback: result.code === "NOT_CONFIGURED" || result.code === "GATEWAY" || result.code === "ITEM_UNAVAILABLE",
      });
      return;
    }
    setStatus({ kind: "redirecting" });
    window.location.assign(result.url);
  }

  if (items.length === 0) {
    return <EmptyState whatsappHref={whatsappHref()} />;
  }

  return (
    <form ref={rootRef} onSubmit={onSubmit} noValidate className="flex flex-col gap-5" aria-busy={busy || undefined}>
      {variant === "panel" ? null : null}

      {/* ── packages ── */}
      <fieldset className="m-0 flex min-w-0 flex-col gap-2.5 border-0 p-0" disabled={busy}>
        <legend className="mb-2.5 flex items-center justify-between text-[0.86rem] font-extrabold text-[var(--ck-text)]">
          <span>
            {items.length > 1 ? "اختاري باقتك" : "باقتك"}
            <span className="ms-1 text-[var(--ck-gold)]" aria-hidden>
              *
            </span>
          </span>
          {items.length > 1 ? (
            <span className="text-[0.72rem] font-bold text-[var(--ck-faint)]">{items.length} خيارات</span>
          ) : null}
        </legend>
        {items.map((item, index) => {
          const on = item.id === selectedId;
          return (
            <label
              key={`${item.kind}-${item.id}`}
              className={`relative flex cursor-pointer gap-3.5 rounded-2xl border p-4 transition-all duration-200 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[var(--ck-line-strong)] ${
                on
                  ? "border-[var(--ck-gold)] bg-[var(--ck-selected)] shadow-[0_0_28px_-12px_rgba(232,195,106,0.55)]"
                  : "border-[var(--ck-line)] bg-[var(--ck-card)] hover:border-[var(--ck-line-strong)]"
              } ${errors.item ? "border-[var(--ck-error-line)]" : ""}`}
            >
              <input
                type="radio"
                name={`${uid}-item`}
                value={item.id}
                checked={on}
                data-field={index === 0 ? "item" : undefined}
                onChange={() => {
                  setSelectedId(item.id);
                  clear("item");
                }}
                className="sr-only"
              />
              <span
                className={`mt-1 flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                  on ? "border-[var(--ck-gold)] bg-[var(--ck-gold)] text-[var(--ck-ink)]" : "border-[var(--ck-line-strong)]"
                }`}
                aria-hidden
              >
                {on ? <Icon.Check className="size-3" strokeWidth={3.5} /> : null}
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="text-[0.98rem] leading-[1.5] font-extrabold text-[var(--ck-text)]">{item.title}</span>
                  {item.badge ? (
                    <span className="rounded-full border border-[var(--ck-line-strong)] px-2.5 py-0.5 text-[0.68rem] font-extrabold text-[var(--ck-champagne)]">
                      {item.badge}
                    </span>
                  ) : null}
                </span>
                {item.description ? (
                  <span className="line-clamp-2 text-[0.82rem] leading-[1.75] text-[var(--ck-muted)]">{item.description}</span>
                ) : null}
                {item.features.length ? (
                  <span className="mt-0.5 flex flex-wrap gap-x-3.5 gap-y-1">
                    {item.features.slice(0, 4).map((f) => (
                      <span key={f} className="inline-flex items-center gap-1.5 text-[0.76rem] font-bold text-[var(--ck-muted)]">
                        <Icon.Check className="size-3.5 text-[var(--ck-gold)]" strokeWidth={3} />
                        {f}
                      </span>
                    ))}
                  </span>
                ) : null}
                <span className="mt-1 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                  <span className="text-[1.25rem] leading-none font-extrabold text-[var(--ck-champagne)]">{item.priceLabel}</span>
                  {item.oldPriceLabel ? (
                    <s className="text-[0.82rem] font-bold text-[var(--ck-faint)]">{item.oldPriceLabel}</s>
                  ) : null}
                  {item.savePercent ? (
                    <span className="rounded-full bg-[rgba(52,211,153,0.14)] px-2 py-0.5 text-[0.68rem] font-extrabold text-[#34D399]">
                      وفّري {item.savePercent}%
                    </span>
                  ) : null}
                </span>
              </span>
            </label>
          );
        })}
        {errors.item ? <FieldError>{errors.item}</FieldError> : null}
      </fieldset>

      {/* ── customer ── */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="الاسم" htmlFor={`${uid}-name`} required error={errors.name}>
          <input
            id={`${uid}-name`}
            data-field="name"
            name="name"
            autoComplete="name"
            placeholder="اسمك الكريم"
            value={fullName}
            disabled={busy}
            aria-invalid={errors.name ? true : undefined}
            onChange={(e) => {
              setFullName(e.target.value);
              clear("name");
            }}
            className={`${INPUT} ${errors.name ? INVALID : ""}`}
          />
        </Field>

        <Field label="الجوال" htmlFor={`${uid}-phone`} required error={errors.phone} hint="9 أرقام تبدأ بـ 5، بدون الصفر.">
          <span
            dir="ltr"
            className={`flex min-h-12 items-center gap-2.5 rounded-xl border bg-[var(--ck-field)] px-4 transition-colors focus-within:border-[var(--ck-gold)] ${
              errors.phone ? INVALID : "border-[var(--ck-line-strong)]"
            }`}
          >
            <span className="select-none text-[0.92rem] font-bold text-[var(--ck-faint)]">+966</span>
            <input
              id={`${uid}-phone`}
              data-field="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              dir="ltr"
              placeholder="5X XXX XXXX"
              maxLength={16}
              value={phone}
              disabled={busy}
              aria-invalid={errors.phone ? true : undefined}
              onChange={(e) => {
                setPhone(e.target.value);
                clear("phone");
              }}
              className="min-w-0 flex-1 border-none bg-transparent py-3 text-[0.98rem] tracking-[0.04em] text-[var(--ck-text)] outline-none placeholder:text-[var(--ck-faint)] disabled:opacity-60"
            />
          </span>
        </Field>

        <Field label="المدينة" htmlFor={`${uid}-city`} required className="sm:col-span-2">
          <span className="relative block">
            <select
              id={`${uid}-city`}
              name="city"
              autoComplete="address-level2"
              value={city}
              disabled={busy}
              onChange={(e) => setCity(e.target.value)}
              className={`${INPUT} cursor-pointer appearance-none pe-11`}
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <Icon.ChevronDown className="pointer-events-none absolute end-4 top-1/2 size-4 -translate-y-1/2 text-[var(--ck-champagne)]" aria-hidden />
          </span>
        </Field>
      </div>

      {status.kind === "error" ? (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-xl border border-[var(--ck-error-line)] bg-[var(--ck-error-bg)] px-4 py-3 text-[0.86rem] font-bold text-[var(--ck-error-text)]"
        >
          <span className="flex items-start gap-2">
            <Icon.CircleAlert className="mt-0.5 size-4 shrink-0" />
            {status.message}
          </span>
        </div>
      ) : null}

      {/* ── pay ── */}
      <button
        type="submit"
        disabled={busy}
        className="inline-flex min-h-[54px] w-full cursor-pointer items-center justify-center rounded-full px-8 py-4 text-base font-extrabold text-[var(--ck-ink)] shadow-[0_0_34px_-8px_rgba(232,195,106,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_46px_-8px_rgba(255,223,142,0.8)] disabled:cursor-wait disabled:opacity-75 disabled:hover:translate-y-0"
        style={{ background: GOLD }}
      >
        <span className={`items-center gap-3 ${busy ? "flex" : "hidden"}`}>
          <span className="size-4 animate-spin rounded-full border-2 border-[rgba(36,26,14,0.3)] border-t-[var(--ck-ink)]" />
          <span>{status.kind === "redirecting" ? "جارٍ التحويل إلى صفحة الدفع..." : "لحظة من فضلك..."}</span>
        </span>
        <span className={`items-center gap-2.5 ${busy ? "hidden" : "flex"}`}>
          <Icon.Lock className="size-[18px]" strokeWidth={2.2} />
          <span>{selected ? `ادفعي ${selected.priceLabel} بأمان` : "ادفعي بأمان"}</span>
        </span>
      </button>

      <div className="flex flex-col items-center gap-3">
        <PaymentBadges withSplit={false} className="justify-center" />
        <p className="m-0 inline-flex items-center gap-1.5 text-center text-[0.74rem] font-bold text-[var(--ck-faint)]">
          <Icon.ShieldCheck className="size-3.5 text-[var(--ck-gold)]" />
          تُحوّلين إلى صفحة noon الآمنة لإتمام الدفع، ثم نعود بك إلى الموقع.
        </p>
      </div>

      {/* ── or ask ── */}
      <div className="flex items-center gap-3 text-[0.74rem] font-bold text-[var(--ck-faint)]">
        <span className="h-px flex-1 bg-[var(--ck-line)]" />
        أو
        <span className="h-px flex-1 bg-[var(--ck-line)]" />
      </div>
      <a
        href={whatsappHref(selected)}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-full border px-6 py-3 text-[0.95rem] font-extrabold transition-colors ${
          status.kind === "error" && status.fallback
            ? "border-[#25D366] bg-[#25D366] text-[#0B2B16]"
            : "border-[var(--ck-line-strong)] text-[var(--ck-champagne)] hover:bg-[var(--ck-selected)]"
        }`}
      >
        <SocialIcon name="whatsapp" className="text-[19px]" />
        اسألي عبر واتساب قبل الدفع
      </a>
    </form>
  );
}

const INPUT =
  "w-full min-h-12 rounded-xl border border-[var(--ck-line-strong)] bg-[var(--ck-field)] px-4 py-3 text-[0.95rem] text-[var(--ck-text)] outline-none transition-colors placeholder:text-[var(--ck-faint)] focus:border-[var(--ck-gold)] disabled:opacity-60";
const INVALID = "border-[var(--ck-error-line)]";

function Field({
  label,
  htmlFor,
  required,
  error,
  hint,
  className = "",
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label htmlFor={htmlFor} className="text-[0.85rem] font-bold text-[var(--ck-text)]">
        {label}
        {required ? (
          <span className="ms-1 text-[var(--ck-gold)]" aria-hidden>
            *
          </span>
        ) : null}
      </label>
      {children}
      {error ? <FieldError>{error}</FieldError> : hint ? <p className="m-0 text-[0.72rem] text-[var(--ck-faint)]">{hint}</p> : null}
    </div>
  );
}

function FieldError({ children }: { children: React.ReactNode }) {
  return (
    <p role="alert" className="m-0 flex items-start gap-1.5 text-[0.78rem] font-bold text-[var(--ck-error-text)]">
      <Icon.CircleAlert className="mt-0.5 size-3.5 shrink-0" />
      {children}
    </p>
  );
}

function EmptyState({ whatsappHref }: { whatsappHref: string }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-[var(--ck-line-strong)] bg-[var(--ck-card)] px-6 py-10 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl border border-[var(--ck-line)] text-[var(--ck-champagne)]">
        <Icon.CreditCard className="size-6" strokeWidth={1.8} />
      </span>
      <h3 className="m-0 text-[1.1rem] font-extrabold text-[var(--ck-text)]">الدفع الإلكتروني لهذه الصفحة قيد التجهيز</h3>
      <p className="m-0 max-w-[40ch] text-[0.9rem] leading-[1.85] text-[var(--ck-muted)]">
        تواصلي معنا عبر واتساب وسنرسل لك رابط الدفع أو نحجز لك الموعد مباشرة.
      </p>
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-7 py-3 text-[0.95rem] font-extrabold text-[#0B2B16] shadow-[0_0_30px_-8px_rgba(37,211,102,0.6)] transition-transform hover:-translate-y-0.5"
      >
        <SocialIcon name="whatsapp" className="text-[19px]" />
        اسألي عبر واتساب
      </a>
    </div>
  );
}
