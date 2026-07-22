"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@/components/icons";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "ok" }
  | { kind: "error"; message: string };

const ORANGE_GRADIENT =
  "linear-gradient(120deg, #ffb473 0%, #ff6b1a 55%, #e35500 100%)";

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
          source: "korean-spicules",
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus({
          kind: "error",
          message:
            (data as { error?: string })?.error ??
            "تعذّر إرسال طلبكِ. حاولي مرة أخرى بعد قليل.",
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
          "تعذّر الاتصال. تحققي من اتصالكِ بالإنترنت ثم حاولي مرة أخرى.",
      });
    }
  }

  const submitting = status.kind === "sending";

  return (
    <div className="relative w-full overflow-hidden rounded-[1.75rem] border border-[var(--color-kos-line)] bg-[var(--color-kos-surface)] p-5 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.7)] sm:rounded-[2rem] sm:p-7 lg:p-9">
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
            <div className="flex size-16 items-center justify-center rounded-full bg-[var(--color-kos-primary)]/20">
              <Icon.Check className="size-8 text-[var(--color-kos-primary-dim)]" />
            </div>
            <h3 className="text-2xl font-bold text-[var(--color-kos-ink)]">
              تم استلام طلبكِ
            </h3>
            <p className="max-w-md text-sm leading-7 text-[var(--color-kos-ink-soft)]">
              سيتواصل معكِ فريقنا خلال ٢٤ ساعة لتأكيد موعدكِ وتقييم بشرتكِ
              وتحديد كثافة السبيكولز المناسبة لها.
            </p>
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
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-kos-primary)]/20 bg-[var(--color-kos-primary)]/5 px-4 py-1.5 text-xs font-semibold tracking-normal text-[var(--color-kos-primary-dim)]">
                <Icon.Sparkles className="size-3.5" />
                مقاعد محدودة أسبوعياً
              </span>
              <h3 className="pt-2 text-2xl font-bold text-[var(--color-kos-ink)] sm:text-3xl">
                احجزي جلسة السبيكولز
              </h3>
              <p className="text-sm text-[var(--color-kos-ink-soft)]">
                اتركي بياناتكِ، وسنتواصل معكِ خلال ٢٤ ساعة.
              </p>
            </div>

            <div className="space-y-4">
              <Field
                id="kos-name"
                label="الاسم الكامل"
                placeholder="اكتبي اسمكِ"
                autoComplete="name"
                value={fullName}
                onChange={setFullName}
                disabled={submitting}
              />
              <Field
                id="kos-phone"
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
                id="kos-city"
                label="المدينة"
                placeholder="مثال: جدة"
                autoComplete="address-level2"
                value={city}
                onChange={setCity}
                disabled={submitting}
              />
            </div>

            {/* Both button states stay mounted (toggled via CSS) — swapping raw
                text nodes crashes React when translate extensions rewrap them. */}
            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={!submitting ? { y: -2 } : undefined}
              whileTap={!submitting ? { scale: 0.97 } : undefined}
              className="w-full rounded-2xl px-7 py-4 text-base font-extrabold text-[#180a02] shadow-[0_14px_34px_-12px_rgba(255,107,26,0.6)] transition-transform hover:scale-[1.01] disabled:opacity-70"
              style={{ background: ORANGE_GRADIENT }}
            >
              <span
                className={`items-center justify-center gap-3 ${submitting ? "flex" : "hidden"}`}
              >
                <span className="size-4 animate-spin rounded-full border-2 border-[#180a02]/30 border-t-[#180a02]" />
                <span>جارٍ الإرسال...</span>
              </span>
              <span
                className={`items-center justify-center gap-3 ${submitting ? "hidden" : "flex"}`}
              >
                <Icon.CalendarCheck className="size-5" />
                <span>أرسلي الطلب الآن</span>
                <Icon.ArrowLeft className="size-4" />
              </span>
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

            <p className="text-center text-xs leading-relaxed text-[var(--color-kos-muted)]">
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
        className="mb-2 block text-sm font-bold text-[var(--color-kos-ink)]"
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
        className="w-full rounded-xl border border-[var(--color-kos-line)] bg-black px-4 py-3 text-base text-[var(--color-kos-ink)] outline-none transition-colors placeholder:text-[var(--color-kos-muted)] focus:border-[var(--color-kos-primary)] focus:ring-4 focus:ring-[var(--color-kos-primary)]/15 disabled:opacity-60 sm:py-3.5"
      />
    </div>
  );
}
