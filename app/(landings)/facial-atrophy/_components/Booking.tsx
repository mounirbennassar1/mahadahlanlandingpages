"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@/components/icons";
import { EASE } from "./Reveal";
import { GOLD_GRADIENT, WHATSAPP_NUMBER } from "./config";

const CITIES = [
  "جدة",
  "مكة المكرمة",
  "الرياض",
  "المدينة المنورة",
  "الدمام / الخبر",
  "مدينة أخرى",
];

const TIMES = ["صباحاً", "ظهراً", "مساءً"] as const;

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "ok" }
  | { kind: "error"; message: string };

const inputClasses =
  "w-full rounded-xl border-[1.5px] border-[rgba(217,179,108,0.22)] bg-[var(--color-faa-bg)] px-4 py-3.5 text-[0.98rem] text-[var(--color-faa-ink)] outline-none transition-colors focus:border-[var(--color-faa-gold)] focus:ring-4 focus:ring-[rgba(217,179,108,0.15)] disabled:opacity-60";

/**
 * Booking card with the design's animated conic border. Posts
 * { fullName, phone, city, source } to /api/leads; the preferred contact
 * time only rides along in the WhatsApp follow-up message.
 */
export function Booking() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState(CITIES[0]);
  const [time, setTime] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status.kind === "sending" || status.kind === "ok") return;

    if (!fullName.trim() || !phone.trim()) {
      setStatus({
        kind: "error",
        message: "الرجاء تعبئة الاسم ورقم الجوال.",
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
          city,
          source: "facial-atrophy",
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
      "مرحباً، أرسلت طلب حجز استشارة لعلاج ضمور الوجه بعد إبر التنحيف.",
      `الاسم: ${fullName.trim()}`,
      `الجوال: +966${phone.trim().replace(/^0+/, "")}`,
      `المدينة: ${city}`,
    ];
    if (time) parts.push(`الوقت الأنسب: ${time}`);
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(parts.join("\n"))}`;
  };

  return (
    <div className="relative overflow-hidden rounded-[26px] p-[1.5px]">
      <div
        className="absolute -inset-[130%]"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0 62%, rgba(240,212,138,.9) 76%, rgba(166,124,61,.9) 86%, transparent 97%)",
          animation: "faa-spin 5s linear infinite",
        }}
        aria-hidden
      />
      <div
        className="relative rounded-[25px] p-[clamp(26px,4vw,38px)]"
        style={{ background: "linear-gradient(165deg, #2E0D18, #1D060D)" }}
      >
        <AnimatePresence mode="wait">
          {status.kind === "ok" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="px-1.5 py-[26px] text-center"
            >
              <div
                className="mx-auto mb-[18px] flex size-16 items-center justify-center rounded-full text-[var(--color-faa-cta-ink)] shadow-[0_18px_44px_-14px_rgba(240,212,138,0.6)]"
                style={{ background: GOLD_GRADIENT }}
              >
                <Icon.Check className="size-7" strokeWidth={2.6} />
              </div>
              <h3 className="mb-2 text-[1.45rem] font-extrabold">
                استلمنا طلبك بنجاح
              </h3>
              <p className="mx-auto mb-[22px] max-w-[38ch] text-[0.95rem] font-light text-[rgba(243,233,220,0.65)]">
                سيتواصل معك فريقنا خلال ساعات العمل. وإن أحببتِ، أكملي التنسيق
                الآن عبر واتساب.
              </p>
              <a
                href={waFollowUp()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full bg-[#25D366] px-[30px] py-3.5 text-[0.98rem] font-extrabold text-[#0B2B18] transition-transform hover:-translate-y-0.5"
              >
                متابعة عبر واتساب
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
            >
              <h3 className="mb-1.5 text-[1.4rem] font-extrabold">نموذج الحجز</h3>
              <p className="mb-6 text-[0.9rem] font-light text-[rgba(243,233,220,0.6)]">
                يستغرق أقل من دقيقة، ونتواصل معك في نفس اليوم.
              </p>

              <div className="mb-4">
                <label
                  htmlFor="faa-name"
                  className="mb-[7px] block text-[0.82rem] font-extrabold text-[var(--color-faa-ink-soft)]"
                >
                  الاسم الكريم
                </label>
                <input
                  id="faa-name"
                  name="name"
                  autoComplete="name"
                  placeholder="مثال: نورة"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={submitting}
                  className={inputClasses}
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="faa-phone"
                  className="mb-[7px] block text-[0.82rem] font-extrabold text-[var(--color-faa-ink-soft)]"
                >
                  رقم الجوال
                </label>
                <div dir="ltr" className="flex gap-[9px]">
                  <span className="flex shrink-0 items-center rounded-xl border-[1.5px] border-[rgba(217,179,108,0.22)] bg-[rgba(217,179,108,0.1)] px-[15px] text-[0.92rem] font-extrabold text-[var(--color-faa-gold-bright)]">
                    +966
                  </span>
                  <input
                    id="faa-phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel-national"
                    placeholder="5X XXX XXXX"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={submitting}
                    className={`${inputClasses} min-w-0 flex-1 text-left`}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="faa-city"
                  className="mb-[7px] block text-[0.82rem] font-extrabold text-[var(--color-faa-ink-soft)]"
                >
                  المدينة
                </label>
                <select
                  id="faa-city"
                  name="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  disabled={submitting}
                  className={inputClasses}
                >
                  {CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-[22px]">
                <span className="mb-[7px] block text-[0.82rem] font-extrabold text-[var(--color-faa-ink-soft)]">
                  الوقت الأنسب للتواصل
                </span>
                <div className="flex gap-[9px]">
                  {TIMES.map((t) => {
                    const on = time === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTime(t)}
                        disabled={submitting}
                        className={`flex-1 rounded-xl border-[1.5px] px-2 py-[11px] text-[0.86rem] font-bold transition-all duration-200 ${
                          on
                            ? "border-[var(--color-faa-gold)] text-[var(--color-faa-cta-ink)]"
                            : "border-[rgba(217,179,108,0.25)] bg-transparent text-[rgba(243,233,220,0.65)] hover:border-[var(--color-faa-gold)]"
                        }`}
                        style={on ? { background: GOLD_GRADIENT } : undefined}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Both button states stay mounted (toggled via CSS) — swapping raw
                  text nodes crashes React when translate extensions rewrap them. */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full cursor-pointer rounded-full border-none py-4 text-[1.02rem] font-extrabold text-[var(--color-faa-cta-ink)] shadow-[0_18px_44px_-14px_rgba(217,179,108,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_54px_-14px_rgba(240,212,138,0.6)] disabled:opacity-70"
                style={{ background: GOLD_GRADIENT }}
              >
                <span
                  className={`items-center justify-center gap-3 ${submitting ? "flex" : "hidden"}`}
                >
                  <span className="size-4 animate-spin rounded-full border-2 border-[rgba(42,9,19,0.3)] border-t-[var(--color-faa-cta-ink)]" />
                  <span>جارٍ الإرسال...</span>
                </span>
                <span
                  className={`items-center justify-center gap-3 ${submitting ? "hidden" : "flex"}`}
                >
                  <span>أرسلي طلب الحجز</span>
                </span>
              </button>

              <AnimatePresence>
                {status.kind === "error" && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 flex items-start gap-2 rounded-xl border border-rose-400/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-300"
                  >
                    <Icon.CircleAlert className="mt-0.5 size-4 shrink-0" />
                    {status.message}
                  </motion.p>
                )}
              </AnimatePresence>

              <p className="mt-[13px] mb-0 text-center text-[0.74rem] text-[rgba(243,233,220,0.42)]">
                بإرسال الطلب أنتِ توافقين على تواصل العيادة معك هاتفياً أو عبر
                واتساب.
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
