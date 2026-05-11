"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitBodyLead, type LeadFormState } from "../_actions";

const initialState: LeadFormState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-primary-body w-full disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {pending ? (
        <>
          <span className="inline-block h-3 w-3 rounded-full bg-white/80 animate-pulse" />
          جارٍ الإرسال…
        </>
      ) : (
        <>
          <span>احجزي استشارتك</span>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
          >
            <path
              d="M14 5l-7 7 7 7"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </>
      )}
    </button>
  );
}

export default function LeadForm({ id }: { id?: string }) {
  const [state, formAction] = useActionState(submitBodyLead, initialState);

  const fieldError = (name: "fullName" | "phone" | "city") =>
    state.issues?.[name];
  const defaultValue = (name: "fullName" | "phone" | "city") =>
    state.values?.[name] ?? "";

  return (
    <form
      id={id}
      action={formAction}
      className="card-body p-6 sm:p-8 lg:p-10 grid gap-5"
      noValidate
    >
      <div className="grid gap-1.5">
        <span className="eyebrow-body">احجزي استشارتك</span>
        <h3 className="font-display-body text-3xl sm:text-4xl leading-tight text-body-fg">
          جلسة تحليل قوام مجانية
        </h3>
        <p className="text-body-muted text-sm leading-7">
          اتركي بياناتك وسيعاود فريق الاستشارات التواصل خلال ساعة عمل واحدة
          لتحديد موعدك في أقرب فرع.
        </p>
      </div>

      {state.status === "server_error" && state.message && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {state.message}
        </div>
      )}

      <label className="grid gap-2 text-sm">
        <span className="text-body-muted">الاسم الكامل</span>
        <input
          name="fullName"
          required
          autoComplete="name"
          placeholder="اكتبي اسمك"
          defaultValue={defaultValue("fullName")}
          aria-invalid={Boolean(fieldError("fullName"))}
          className={`w-full rounded-xl border bg-white/70 px-4 py-3 text-body-fg placeholder:text-body-muted/70 focus:outline-none focus:ring-2 focus:ring-body-accent/25 transition ${
            fieldError("fullName")
              ? "border-red-400 bg-red-50/30"
              : "border-body-line focus:border-body-accent"
          }`}
        />
        {fieldError("fullName") && (
          <span className="text-xs text-red-600">{fieldError("fullName")}</span>
        )}
      </label>

      <label className="grid gap-2 text-sm">
        <span className="text-body-muted">رقم الجوال</span>
        <input
          name="phone"
          required
          type="tel"
          autoComplete="tel"
          dir="ltr"
          placeholder="+9665xxxxxxxx"
          defaultValue={defaultValue("phone")}
          aria-invalid={Boolean(fieldError("phone"))}
          className={`w-full rounded-xl border bg-white/70 px-4 py-3 text-body-fg placeholder:text-body-muted/70 focus:outline-none focus:ring-2 focus:ring-body-accent/25 transition text-right ${
            fieldError("phone")
              ? "border-red-400 bg-red-50/30"
              : "border-body-line focus:border-body-accent"
          }`}
        />
        {fieldError("phone") && (
          <span className="text-xs text-red-600">{fieldError("phone")}</span>
        )}
      </label>

      <label className="grid gap-2 text-sm">
        <span className="text-body-muted">المدينة</span>
        <input
          name="city"
          required
          type="text"
          autoComplete="address-level2"
          placeholder="مثال: جدة"
          defaultValue={defaultValue("city")}
          aria-invalid={Boolean(fieldError("city"))}
          className={`w-full rounded-xl border bg-white/70 px-4 py-3 text-body-fg placeholder:text-body-muted/70 focus:outline-none focus:ring-2 focus:ring-body-accent/25 transition ${
            fieldError("city")
              ? "border-red-400 bg-red-50/30"
              : "border-body-line focus:border-body-accent"
          }`}
        />
        {fieldError("city") && (
          <span className="text-xs text-red-600">{fieldError("city")}</span>
        )}
      </label>

      <SubmitButton />

      <p className="text-body-muted text-xs leading-6">
        بالضغط على الزر أنت توافقين على سياسة الخصوصية والتواصل عبر قنواتنا.
        بياناتك محفوظة ولن تُشارك مع أي طرف ثالث.
      </p>
    </form>
  );
}
