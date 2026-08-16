"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@/components/icons";
import { GOLD_GRADIENT, WHATSAPP_NUMBER } from "./config";

const EASE = [0.22, 1, 0.36, 1] as const;
const TIMES = ["صباحاً", "مساءً", "في أقرب وقت"] as const;

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "ok" }
  | { kind: "error"; message: string };

const fieldClasses =
  "rounded-[14px] border border-[rgba(228,200,126,0.25)] bg-[rgba(244,233,216,0.06)] px-4 py-3.5 text-[0.95rem] text-[var(--color-crh-cream)] outline-none transition-colors focus:border-[var(--color-crh-gold-soft)] focus:bg-[rgba(244,233,216,0.09)] disabled:opacity-60";

/**
 * Booking form inside the dark card. Posts { fullName, phone, city, source }
 * to /api/leads; the preferred time only rides along in the WhatsApp
 * follow-up message.
 */
export function Booking() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [time, setTime] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status.kind === "sending" || status.kind === "ok") return;

    if (!fullName.trim() || !phone.trim() || !city.trim()) {
      setStatus({
        kind: "error",
        message: "الرجاء تعبئة الاسم ورقم الجوال والمدينة.",
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
          phone: `+966${phone.trim().replace(/^0+/, "")}`,
          city: city.trim(),
          source: "cracked-heels",
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
    } catch {
      setStatus({
        kind: "error",
        message: "تعذّر الاتصال. تحققي من اتصالكِ بالإنترنت ثم حاولي مرة أخرى.",
      });
    }
  }

  const submitting = status.kind === "sending";

  const waFollowUp = () => {
    const parts = [
      "مرحباً، أرسلت طلب حجز جلسة تقييم لعلاج تشقق القدمين.",
      `الاسم: ${fullName.trim()}`,
      `الجوال: +966${phone.trim().replace(/^0+/, "")}`,
      `المدينة: ${city.trim()}`,
    ];
    if (time) parts.push(`الوقت الأنسب: ${time}`);
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(parts.join("\n"))}`;
  };

  return (
    <AnimatePresence mode="wait">
      {status.kind === "ok" ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.45, ease: EASE }}
          className="flex flex-col items-center gap-4 rounded-3xl border border-[rgba(228,200,126,0.35)] bg-[rgba(244,233,216,0.04)] px-[34px] py-11 text-center backdrop-blur-md"
        >
          <span
            className="flex size-16 items-center justify-center rounded-full shadow-[0_14px_34px_-12px_rgba(212,175,55,0.6)]"
            style={{ background: GOLD_GRADIENT }}
          >
            <Icon.Check className="size-[30px] text-[#1C120C]" strokeWidth={2.6} />
          </span>
          <h3 className="m-0 text-2xl font-extrabold text-[var(--color-crh-cream)]">
            شكراً لثقتك
          </h3>
          <p className="m-0 text-[0.95rem] font-light text-[rgba(244,233,216,0.7)]">
            استلمنا طلبك وسيتواصل معك فريقنا خلال ساعات العمل. وإن أحببتِ،
            أكملي الآن عبر واتساب.
          </p>
          <a
            href={waFollowUp()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 rounded-full bg-[#25D366] px-8 py-[15px] text-[0.98rem] font-extrabold text-[#0B2B16] transition-transform hover:-translate-y-0.5"
            style={{ animation: "crh-pulse 2s infinite" }}
          >
            فتح واتساب وإرسال الطلب
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
          className="flex flex-col gap-4 rounded-3xl border border-[rgba(228,200,126,0.25)] bg-[rgba(244,233,216,0.04)] p-[clamp(24px,4vw,36px)] backdrop-blur-md"
        >
          <label className="flex flex-col gap-2 text-[0.85rem] font-bold text-[rgba(244,233,216,0.85)]">
            الاسم الكريم
            <input
              name="name"
              autoComplete="name"
              placeholder="اسمك الثلاثي"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={submitting}
              className={fieldClasses}
            />
          </label>

          <label className="flex flex-col gap-2 text-[0.85rem] font-bold text-[rgba(244,233,216,0.85)]">
            رقم الجوال
            <span
              dir="ltr"
              className="flex items-center gap-2.5 rounded-[14px] border border-[rgba(228,200,126,0.25)] bg-[rgba(244,233,216,0.06)] px-4 transition-colors focus-within:border-[var(--color-crh-gold-soft)]"
            >
              <span className="text-[0.9rem] font-bold text-[rgba(244,233,216,0.55)]">
                +966
              </span>
              <input
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                placeholder="5X XXX XXXX"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={submitting}
                className="min-w-0 flex-1 border-none bg-transparent py-3.5 text-[0.95rem] text-[var(--color-crh-cream)] outline-none disabled:opacity-60"
              />
            </span>
          </label>

          <label className="flex flex-col gap-2 text-[0.85rem] font-bold text-[rgba(244,233,216,0.85)]">
            المدينة
            <input
              name="city"
              autoComplete="address-level2"
              placeholder="جدة، مكة…"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              disabled={submitting}
              className={fieldClasses}
            />
          </label>

          <div className="flex flex-col gap-2.5 text-[0.85rem] font-bold text-[rgba(244,233,216,0.85)]">
            الوقت الأنسب للتواصل
            <div className="flex flex-wrap gap-2.5">
              {TIMES.map((t) => {
                const on = time === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTime(t)}
                    disabled={submitting}
                    className={`rounded-full border px-5 py-[9px] text-[0.85rem] font-bold transition-all duration-200 ${
                      on
                        ? "border-[var(--color-crh-gold-soft)] text-[#1C120C]"
                        : "border-[rgba(228,200,126,0.28)] bg-transparent text-[rgba(244,233,216,0.7)] hover:border-[var(--color-crh-gold-soft)]"
                    }`}
                    style={on ? { background: GOLD_GRADIENT } : undefined}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Both button states stay mounted (toggled via CSS): swapping raw
              text nodes crashes React when translate extensions rewrap them. */}
          <button
            type="submit"
            disabled={submitting}
            className="mt-1.5 cursor-pointer rounded-full border-none py-4 text-base font-extrabold text-[#1C120C] shadow-[0_16px_40px_-14px_rgba(212,175,55,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_50px_-14px_rgba(228,200,126,0.6)] disabled:opacity-70"
            style={{ background: GOLD_GRADIENT }}
          >
            <span
              className={`items-center justify-center gap-3 ${submitting ? "flex" : "hidden"}`}
            >
              <span className="size-4 animate-spin rounded-full border-2 border-[rgba(28,18,12,0.3)] border-t-[#1C120C]" />
              <span>جارٍ الإرسال...</span>
            </span>
            <span
              className={`items-center justify-center gap-3 ${submitting ? "hidden" : "flex"}`}
            >
              <span>إرسال طلب الحجز</span>
            </span>
          </button>

          <AnimatePresence>
            {status.kind === "error" && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="m-0 flex items-start gap-2 rounded-xl border border-rose-400/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-300"
              >
                <Icon.CircleAlert className="mt-0.5 size-4 shrink-0" />
                {status.message}
              </motion.p>
            )}
          </AnimatePresence>

          <p className="m-0 text-center text-[0.72rem] text-[rgba(244,233,216,0.4)]">
            بإرسال الطلب أنتِ توافقين على تواصل العيادة معك هاتفياً أو عبر
            واتساب.
          </p>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
