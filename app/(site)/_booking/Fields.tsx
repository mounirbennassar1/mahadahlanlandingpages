"use client";

import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";
import { Icon, SocialIcon } from "@/components/icons";
import { GOLD_GRADIENT, HOURS_SHORT } from "@/app/_home/config";
import { fieldClasses, fieldInvalidClasses } from "./shared";

/* ───────────────────────── field wrapper ───────────────────────── */

export function Field({
  label,
  htmlFor,
  required,
  error,
  hint,
  children,
  className = "",
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  hint?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label
        htmlFor={htmlFor}
        className="text-[0.85rem] font-bold text-[rgba(246,238,223,0.85)]"
      >
        {label}
        {required ? (
          <span className="ms-1 text-[var(--color-md-gold-bright)]" aria-hidden>
            *
          </span>
        ) : (
          <span className="ms-1.5 text-[0.72rem] font-normal text-[rgba(246,238,223,0.4)]">
            (اختياري)
          </span>
        )}
      </label>
      {children}
      {error ? (
        <p
          id={`${htmlFor}-error`}
          role="alert"
          className="flex items-start gap-1.5 text-[0.78rem] font-bold text-rose-300"
        >
          <Icon.CircleAlert className="mt-0.5 size-3.5 shrink-0" />
          {error}
        </p>
      ) : hint ? (
        <p className="text-[0.74rem] text-[rgba(246,238,223,0.42)]">{hint}</p>
      ) : null}
    </div>
  );
}

/* ───────────────────────── inputs ───────────────────────── */

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean };

export function TextInput({ invalid, className = "", ...rest }: TextInputProps) {
  return (
    <input
      {...rest}
      aria-invalid={invalid || undefined}
      className={`${fieldClasses} min-h-12 ${invalid ? fieldInvalidClasses : ""} ${className}`}
    />
  );
}

/** Saudi mobile with a fixed +966 prefix (LTR box inside the RTL form). */
export function PhoneInput({
  invalid,
  className = "",
  ...rest
}: TextInputProps) {
  return (
    <span
      dir="ltr"
      className={`flex min-h-12 items-center gap-2.5 rounded-xl border bg-[rgba(246,238,223,0.05)] px-4 transition-colors focus-within:border-[var(--color-md-gold-bright)] ${
        invalid ? fieldInvalidClasses : "border-[var(--color-md-line-strong)]"
      } ${className}`}
    >
      <span className="select-none text-[0.92rem] font-bold text-[rgba(246,238,223,0.55)]">
        +966
      </span>
      <input
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        dir="ltr"
        placeholder="5X XXX XXXX"
        maxLength={16}
        aria-invalid={invalid || undefined}
        {...rest}
        className="min-w-0 flex-1 border-none bg-transparent py-3 text-[0.98rem] tracking-[0.04em] text-[var(--color-md-text)] outline-none placeholder:text-[rgba(246,238,223,0.3)] disabled:opacity-60"
      />
    </span>
  );
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean };

export function SelectInput({ invalid, className = "", children, ...rest }: SelectProps) {
  return (
    <span className="relative block">
      <select
        {...rest}
        aria-invalid={invalid || undefined}
        className={`${fieldClasses} min-h-12 cursor-pointer appearance-none pe-11 ${
          invalid ? fieldInvalidClasses : ""
        } ${className}`}
      >
        {children}
      </select>
      <Icon.ChevronDown
        className="pointer-events-none absolute end-4 top-1/2 size-4 -translate-y-1/2 text-[var(--color-md-champagne)]"
        aria-hidden
      />
    </span>
  );
}

/* ───────────────────────── submit + status ───────────────────────── */

/**
 * Both labels stay mounted and swap via CSS: browser translate extensions
 * re-wrap raw text nodes and crash React when a label is replaced in place.
 */
export function SubmitButton({
  sending,
  label,
  sendingLabel = "جارٍ الإرسال...",
  className = "",
}: {
  sending: boolean;
  label: string;
  sendingLabel?: string;
  className?: string;
}) {
  return (
    <button
      type="submit"
      disabled={sending}
      aria-busy={sending || undefined}
      className={`inline-flex min-h-[52px] w-full cursor-pointer items-center justify-center rounded-full px-8 py-4 text-base font-extrabold text-[var(--color-md-ink)] shadow-[0_0_34px_-8px_rgba(232,195,106,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_46px_-8px_rgba(255,223,142,0.8)] disabled:cursor-wait disabled:opacity-75 disabled:hover:translate-y-0 ${className}`}
      style={{ background: GOLD_GRADIENT }}
    >
      <span className={`items-center gap-3 ${sending ? "flex" : "hidden"}`}>
        <span className="size-4 animate-spin rounded-full border-2 border-[rgba(36,26,14,0.3)] border-t-[var(--color-md-ink)]" />
        <span>{sendingLabel}</span>
      </span>
      <span className={`items-center gap-2.5 ${sending ? "hidden" : "flex"}`}>
        <Icon.CalendarCheck className="size-[18px]" />
        <span>{label}</span>
      </span>
    </button>
  );
}

export function FormError({ message }: { message: string }) {
  return (
    <p
      role="alert"
      className="m-0 flex items-start gap-2 rounded-xl border border-rose-400/25 bg-rose-500/10 px-4 py-3 text-[0.86rem] font-bold text-rose-200"
    >
      <Icon.CircleAlert className="mt-0.5 size-4 shrink-0" />
      {message}
    </p>
  );
}

/* ───────────────────────── success ───────────────────────── */

export function SuccessPanel({
  title = "تم استلام طلبك",
  body,
  waHref,
  waLabel = "أكملي عبر واتساب",
  points,
  children,
}: {
  title?: string;
  body: string;
  waHref: string;
  waLabel?: string;
  points?: string[];
  children?: ReactNode;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center gap-4 text-center"
    >
      <span
        className="flex size-16 items-center justify-center rounded-full shadow-[0_0_38px_-8px_rgba(232,195,106,0.7)]"
        style={{ background: GOLD_GRADIENT }}
      >
        <Icon.Check className="size-[30px] text-[var(--color-md-ink)]" strokeWidth={2.8} />
      </span>
      <h3 className="m-0 text-[1.5rem] font-extrabold text-[var(--color-md-text)]">{title}</h3>
      <p className="m-0 max-w-[40ch] text-[0.95rem] leading-[1.9] font-light text-[rgba(246,238,223,0.7)]">
        {body}
      </p>

      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-8 py-3.5 text-[0.98rem] font-extrabold text-[#0B2B16] shadow-[0_0_30px_-8px_rgba(37,211,102,0.6)] transition-transform hover:-translate-y-0.5 sm:w-auto"
      >
        <SocialIcon name="whatsapp" className="text-[19px]" />
        {waLabel}
      </a>

      <p className="m-0 inline-flex flex-wrap items-center justify-center gap-x-2 text-[0.8rem] font-bold text-[rgba(246,238,223,0.55)]">
        <Icon.Clock className="size-3.5 text-[var(--color-md-champagne)]" />
        سنتواصل معك خلال ساعات العمل:
        <span className="text-[var(--color-md-champagne)]">{HOURS_SHORT}</span>
      </p>

      {points?.length ? (
        <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-[0.8rem] font-bold text-[rgba(246,238,223,0.6)]">
          {points.map((p) => (
            <li key={p} className="inline-flex items-center gap-1.5">
              <Icon.Check className="size-3.5 text-[var(--color-md-champagne)]" strokeWidth={3} />
              {p}
            </li>
          ))}
        </ul>
      ) : null}

      {children}
    </div>
  );
}
