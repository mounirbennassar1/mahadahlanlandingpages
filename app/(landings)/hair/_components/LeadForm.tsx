"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { motion } from "framer-motion";
import { submitHairLead, type LeadFormState } from "../_actions";
import { readUtmFromUrl } from "@/lib/utm";

const initialState: LeadFormState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <motion.button
      type="submit"
      disabled={pending}
      whileHover={!pending ? { scale: 1.03 } : undefined}
      whileTap={!pending ? { scale: 0.97 } : undefined}
      className="w-full bg-[#c9a84c] hover:bg-[#c9a84c]/90 disabled:bg-[#c9a84c]/60 disabled:cursor-not-allowed text-[#1a3a2a] font-bold text-lg px-8 py-4 rounded-xl shadow-lg shadow-[#c9a84c]/30 inline-flex items-center justify-center gap-3 transition-colors"
    >
      {pending ? (
        <>
          <span className="material-symbols-outlined animate-spin">
            progress_activity
          </span>
          جاري الإرسال...
        </>
      ) : (
        <>
          <span className="material-symbols-outlined">event_available</span>
          احجزي موعدك الآن
        </>
      )}
    </motion.button>
  );
}

export default function LeadForm({ id }: { id?: string }) {
  const [state, formAction] = useActionState(submitHairLead, initialState);
  const [utm, setUtm] = useState<Record<string, string>>({});

  // Capture UTM params on mount so the server action sees them.
  useEffect(() => {
    setUtm(readUtmFromUrl());
  }, []);

  const fieldError = (name: "fullName" | "phone" | "city") =>
    state.issues?.[name];

  const defaultValue = (name: "fullName" | "phone" | "city") =>
    state.values?.[name] ?? "";

  return (
    <div
      id={id}
      className="bg-white rounded-3xl border border-[#1a3a2a]/10 shadow-2xl shadow-[#1a3a2a]/10 p-6 md:p-8 w-full"
    >
      <div className="mb-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/30 text-[#c9a84c] text-sm font-medium mb-4">
          <span className="material-symbols-outlined text-base">
            calendar_add_on
          </span>
          احجزي استشارتك المجانية
        </div>
        <h3 className="text-2xl md:text-3xl font-bold text-[#1a3a2a] mb-2">
          اتركي بياناتك وسنتواصل معك
        </h3>
        <p className="text-slate-500 text-sm">
          فريقنا الطبي سيتواصل معك لتحديد موعدك خلال أقرب وقت
        </p>
      </div>

      {state.status === "server_error" && (
        <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 text-red-800 rounded-2xl px-4 py-3 text-sm">
          <span className="material-symbols-outlined text-red-500 shrink-0">
            error
          </span>
          <span>{state.message}</span>
        </div>
      )}

      <form action={formAction} className="space-y-5" noValidate>
        {Object.entries(utm).map(([k, v]) => (
          <input key={k} type="hidden" name={k} value={v} />
        ))}
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-bold text-[#1a3a2a] mb-2"
          >
            الاسم الكامل
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            required
            defaultValue={defaultValue("fullName")}
            placeholder="مثال: سارة أحمد"
            aria-invalid={Boolean(fieldError("fullName"))}
            className={`w-full rounded-xl border px-4 py-3 text-[#1a3a2a] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#c9a84c]/40 transition-colors ${
              fieldError("fullName")
                ? "border-red-400 bg-red-50/30"
                : "border-[#1a3a2a]/15 bg-[#f9f7f2]/60 focus:border-[#c9a84c]"
            }`}
          />
          {fieldError("fullName") && (
            <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">error</span>
              {fieldError("fullName")}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-bold text-[#1a3a2a] mb-2"
          >
            رقم الجوال
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            defaultValue={defaultValue("phone")}
            placeholder="+966 5X XXX XXXX"
            dir="ltr"
            aria-invalid={Boolean(fieldError("phone"))}
            className={`w-full rounded-xl border px-4 py-3 text-[#1a3a2a] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#c9a84c]/40 transition-colors text-right ${
              fieldError("phone")
                ? "border-red-400 bg-red-50/30"
                : "border-[#1a3a2a]/15 bg-[#f9f7f2]/60 focus:border-[#c9a84c]"
            }`}
          />
          {fieldError("phone") && (
            <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">error</span>
              {fieldError("phone")}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="city"
            className="block text-sm font-bold text-[#1a3a2a] mb-2"
          >
            المدينة
          </label>
          <input
            id="city"
            name="city"
            type="text"
            autoComplete="address-level2"
            required
            defaultValue={defaultValue("city")}
            placeholder="مثال: جدة"
            aria-invalid={Boolean(fieldError("city"))}
            className={`w-full rounded-xl border px-4 py-3 text-[#1a3a2a] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#c9a84c]/40 transition-colors ${
              fieldError("city")
                ? "border-red-400 bg-red-50/30"
                : "border-[#1a3a2a]/15 bg-[#f9f7f2]/60 focus:border-[#c9a84c]"
            }`}
          />
          {fieldError("city") && (
            <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">error</span>
              {fieldError("city")}
            </p>
          )}
        </div>

        <SubmitButton />

        <p className="text-xs text-slate-400 text-center leading-relaxed">
          بالنقر على &ldquo;احجزي موعدك الآن&rdquo; فإنك توافقين على تواصلنا
          معك بخصوص استشارتك.
        </p>
      </form>
    </div>
  );
}
