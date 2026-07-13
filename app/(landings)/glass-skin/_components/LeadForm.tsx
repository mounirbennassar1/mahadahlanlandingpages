"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@/components/icons";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "ok" }
  | { kind: "error"; message: string };

export function LeadForm() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status.kind === "sending" || status.kind === "ok") return;

    if (!fullName.trim() || !phone.trim() || !city.trim()) {
      setStatus({
        kind: "error",
        message: "الرجاء تعبئة الاسم الكامل ورقم الجوال والمدينة.",
      });
      return;
    }

    setStatus({ kind: "sending" });

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          phone: phone.trim(),
          city: city.trim(),
          source: "glass-skin",
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus({
          kind: "error",
          message:
            (data as { error?: string })?.error ??
            "تعذّر إرسال طلبكِ. حاولي مرة أخرى أو تواصلي معنا عبر واتساب.",
        });
        return;
      }

      setStatus({ kind: "ok" });
      setFullName("");
      setPhone("");
      setCity("");
    } catch {
      setStatus({
        kind: "error",
        message:
          "تعذّر الاتصال. تحققي من اتصالكِ بالإنترنت أو راسلينا على واتساب.",
      });
    }
  }

  const submitting = status.kind === "sending";

  return (
    <div className="relative w-full overflow-hidden rounded-[1.75rem] border border-[var(--color-gls-line)] bg-[var(--color-gls-surface)] p-5 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.18)] sm:rounded-[2rem] sm:p-7 lg:p-9">
      <AnimatePresence mode="wait">
        {status.kind === "ok" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex flex-col items-center gap-4 py-8 text-center"
          >
            <div className="flex size-16 items-center justify-center rounded-full bg-[var(--color-gls-accent)]/30">
              <Icon.Check className="size-8 text-[var(--color-gls-primary-dim)]" />
            </div>
            <h3 className="text-2xl font-bold text-[var(--color-gls-ink)]">
              تم استلام طلبكِ
            </h3>
            <p className="max-w-md text-sm leading-7 text-[var(--color-gls-ink-soft)]">
              سيتواصل معكِ فريقنا خلال ٢٤ ساعة لتحديد موعد استشارتكِ الخاصة.
              يمكنكِ أيضاً مراسلتنا مباشرة على واتساب لتسريع الحجز.
            </p>
            <a
              href={`https://wa.me/966503377702?text=${encodeURIComponent("مرحباً عندي استفسار عن الجلاس سكين الكوري")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-transform hover:scale-[1.02]"
            >
              <Icon.MessageCircle className="size-4" />
              تواصلي عبر واتساب
            </a>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={onSubmit}
            noValidate
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 space-y-5"
          >
            <div className="space-y-1.5 text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-gls-primary)]/20 bg-[var(--color-gls-primary)]/5 px-4 py-1.5 text-xs font-semibold tracking-normal text-[var(--color-gls-primary-dim)]">
                <Icon.Sparkles className="size-3.5" />
                استشارة مجانية
              </span>
              <h3 className="pt-2 text-2xl font-bold text-[var(--color-gls-ink)] sm:text-3xl">
                احجزي استشارتكِ المجانية
              </h3>
              <p className="text-sm text-[var(--color-gls-ink-soft)]">
                اتركي بياناتكِ، وسنتواصل معكِ خلال ٢٤ ساعة.
              </p>
            </div>

            <div className="space-y-4">
              <Field
                id="gls-name"
                label="الاسم الكامل"
                placeholder="اكتبي اسمكِ"
                autoComplete="name"
                value={fullName}
                onChange={setFullName}
                disabled={submitting}
              />
              <Field
                id="gls-phone"
                label="رقم الجوال"
                placeholder="مثال: ٠٥٠ ١٢٣ ٤٥٦٧"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                ltr
                value={phone}
                onChange={setPhone}
                disabled={submitting}
              />
              <Field
                id="gls-city"
                label="المدينة"
                placeholder="مثال: جدة"
                autoComplete="address-level2"
                value={city}
                onChange={setCity}
                disabled={submitting}
              />
            </div>

            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={!submitting ? { y: -2 } : undefined}
              whileTap={!submitting ? { scale: 0.97 } : undefined}
              className="flex w-full items-center justify-center gap-3 rounded-2xl px-7 py-4 text-base font-extrabold text-[#1d2023] shadow-[0_14px_34px_-12px_rgba(212,175,55,0.55)] transition-transform hover:scale-[1.01] disabled:opacity-70"
              style={{
                background:
                  "linear-gradient(120deg, #f0d98c 0%, #d4af37 55%, #b8912e 100%)",
              }}
            >
              {submitting ? (
                <>
                  <span className="size-4 animate-spin rounded-full border-2 border-[#1d2023]/30 border-t-[#1d2023]" />
                  جارٍ الإرسال...
                </>
              ) : (
                <>
                  <Icon.CalendarCheck className="size-5" />
                  أرسلي الطلب الآن
                  <Icon.ArrowLeft className="size-4" />
                </>
              )}
            </motion.button>

            <AnimatePresence>
              {status.kind === "error" && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-start gap-2 rounded-xl border border-rose-400/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-300"
                >
                  <Icon.AlertCircle className="mt-0.5 size-4 shrink-0" />
                  {status.message}
                </motion.p>
              )}
            </AnimatePresence>

            <p className="text-center text-xs leading-relaxed text-[var(--color-gls-muted)]">
              بياناتكِ محمية وتُستخدم فقط للتواصل بشأن استشارتكِ.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

type FieldProps = {
  id: string;
  label: string;
  placeholder?: string;
  type?: string;
  inputMode?: "tel" | "text" | "email";
  autoComplete?: string;
  ltr?: boolean;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
};

function Field({
  id,
  label,
  placeholder,
  type = "text",
  inputMode,
  autoComplete,
  ltr,
  value,
  onChange,
  disabled,
}: FieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-bold text-[var(--color-gls-ink)]"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        placeholder={placeholder}
        dir={ltr ? "ltr" : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        required
        className="w-full rounded-xl border border-[var(--color-gls-line)] bg-[var(--color-gls-bg)] px-4 py-3 text-base text-[var(--color-gls-ink)] outline-none transition-colors placeholder:text-[var(--color-gls-muted)] focus:border-[var(--color-gls-primary)] focus:ring-4 focus:ring-[var(--color-gls-primary)]/15 disabled:opacity-60 sm:py-3.5"
      />
    </div>
  );
}
