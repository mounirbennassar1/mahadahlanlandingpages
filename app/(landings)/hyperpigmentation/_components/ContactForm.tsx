"use client";

import { useState } from "react";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "ok" }
  | { kind: "error"; message: string };

export default function ContactForm() {
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
          source: "hyperpigmentation",
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus({
          kind: "error",
          message:
            (data as { error?: string })?.error ??
            "تعذّر إرسال طلبكِ، حاولي مرة أخرى لاحقاً.",
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
        message: "تعذّر الاتصال بالخادم. تحققي من اتصالكِ بالإنترنت.",
      });
    }
  }

  const submitting = status.kind === "sending";
  const done = status.kind === "ok";

  return (
    <form className="form-card" onSubmit={onSubmit} noValidate>
      <div className="form-title">احجزي استشارتكِ المجانية</div>
      <div className="form-sub">سنتواصل معكِ خلال ٢٤ ساعة</div>

      <div className="form-row">
        <label htmlFor="cf-name">الاسم الكامل</label>
        <input
          id="cf-name"
          name="fullName"
          type="text"
          autoComplete="name"
          placeholder="اكتبي اسمكِ"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          disabled={submitting}
          required
        />
      </div>
      <div className="form-row">
        <label htmlFor="cf-phone">رقم الجوال</label>
        <input
          id="cf-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          placeholder="+966 ..."
          dir="ltr"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={submitting}
          required
        />
      </div>
      <div className="form-row">
        <label htmlFor="cf-city">المدينة</label>
        <input
          id="cf-city"
          name="city"
          type="text"
          autoComplete="address-level2"
          placeholder="مدينتكِ"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          disabled={submitting}
          required
        />
      </div>
      <div className="form-actions">
        <button
          type="submit"
          className="btn btn-gold"
          disabled={submitting || done}
        >
          {done
            ? "تم الإرسال ✓"
            : submitting
              ? "جارٍ الإرسال..."
              : "أرسلي الطلب"}
          {!done && !submitting && <span className="arrow" />}
        </button>
        <p className="form-note">
          {status.kind === "error"
            ? status.message
            : "معلوماتكِ سرية ومحمية بالكامل."}
        </p>
      </div>
    </form>
  );
}
