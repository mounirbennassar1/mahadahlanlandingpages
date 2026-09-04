"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { motion } from "framer-motion";
import { submitHairLead, type LeadFormState } from "../_actions";
import { readUtmFromUrl } from "@/lib/utm";
import type { ContentOf } from "@/lib/pages/define";
import type { HAIR } from "../content";

const initialState: LeadFormState = { status: "idle" };

type BookingCopy = ContentOf<typeof HAIR>["booking"];

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
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
          {pendingLabel}
        </>
      ) : (
        <>
          <span className="material-symbols-outlined">event_available</span>
          {label}
        </>
      )}
    </motion.button>
  );
}

export default function LeadForm({ id, copy }: { id?: string; copy: BookingCopy }) {
  const [state, formAction] = useActionState(submitHairLead, initialState);

  // Attribution is read at submit time, in the browser, so no effect or extra
  // render is needed and the values are always the ones on the current URL.
  function submit(formData: FormData) {
    for (const [key, value] of Object.entries(readUtmFromUrl())) {
      formData.set(key, value);
    }
    formAction(formData);
  }

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
          {copy.formBadge}
        </div>
        <h3 className="text-2xl md:text-3xl font-bold text-[#1a3a2a] mb-2">
          {copy.formTitle}
        </h3>
        <p className="text-slate-500 text-sm">
          {copy.formSub}
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

      <form action={submit} className="space-y-5" noValidate>
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-bold text-[#1a3a2a] mb-2"
          >
            {copy.nameLabel}
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            required
            defaultValue={defaultValue("fullName")}
            placeholder={copy.namePlaceholder}
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
            {copy.phoneLabel}
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            defaultValue={defaultValue("phone")}
            placeholder={copy.phonePlaceholder}
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
            {copy.cityLabel}
          </label>
          <input
            id="city"
            name="city"
            type="text"
            autoComplete="address-level2"
            required
            defaultValue={defaultValue("city")}
            placeholder={copy.cityPlaceholder}
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

        <SubmitButton label={copy.submit} pendingLabel={copy.submitting} />

        <p className="text-xs text-slate-400 text-center leading-relaxed">
          {copy.consent}
        </p>
      </form>
    </div>
  );
}
