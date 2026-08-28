"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { LuBriefcase, LuSend } from "react-icons/lu";
import { Icon, SocialIcon } from "@/components/icons";
import { GOLD_GRADIENT } from "@/app/_home/config";
import { readUtmFromUrl } from "@/lib/utm";
import {
  CITIES,
  isValidSaudiMobile,
  normalizeSaudiMobile,
  postLead,
  toE164,
  whatsappHref,
  fieldClasses,
  fieldInvalidClasses,
} from "../../_booking/shared";
import {
  Field,
  FormError,
  PhoneInput,
  SelectInput,
  TextInput,
} from "../../_booking/Fields";
import { CAREER_FIELDS, EXPERIENCE_LEVELS } from "./fields";

const ABOUT_MAX = 600;
const MESSAGE_MAX = 1000;

/* Western-digit copy of the shared PHONE_ERROR (the site shows Western digits). */
const PHONE_ERROR = "أدخلي رقم جوال سعودي صحيح من 9 أرقام يبدأ بـ 5.";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "ok" }
  | { kind: "error"; message: string };

type Errors = Partial<
  Record<"name" | "phone" | "email" | "field" | "experience" | "cv" | "about", string>
>;

/** "drive.google.com/…" → "https://drive.google.com/…"; empty stays empty. */
function normalizeUrl(raw: string) {
  const value = raw.trim();
  if (!value) return "";
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return (url.protocol === "https:" || url.protocol === "http:") && url.hostname.includes(".");
  } catch {
    return false;
  }
}

export function CareersForm() {
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  // Synchronous re-entry guard: state updates lag a rapid double click.
  const lock = useRef(false);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState<string>(CITIES[0]);
  const [field, setField] = useState("");
  const [experience, setExperience] = useState("");
  const [cv, setCv] = useState("");
  const [about, setAbout] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const sending = status.kind === "sending";
  const clear = (key: keyof Errors) =>
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (lock.current || sending || status.kind === "ok") return;

    const name = fullName.trim();
    const local = normalizeSaudiMobile(phone);
    const mail = email.trim();
    const cvUrl = normalizeUrl(cv);
    const next: Errors = {};
    if (name.length < 2) next.name = "اكتبي اسمكِ الكريم (حرفان على الأقل).";
    if (!isValidSaudiMobile(local)) next.phone = PHONE_ERROR;
    if (!mail) next.email = "البريد الإلكتروني مطلوب لنتواصل معكِ.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail))
      next.email = "صيغة البريد الإلكتروني غير صحيحة.";
    if (!field) next.field = "اختاري المجال الذي تودين التقديم عليه.";
    if (!experience) next.experience = "اختاري سنوات الخبرة.";
    if (cvUrl && !isValidUrl(cvUrl))
      next.cv = "أدخلي رابطاً صحيحاً، مثل رابط Google Drive أو LinkedIn.";
    if (about.length > ABOUT_MAX) next.about = `النبذة يجب ألا تتجاوز ${ABOUT_MAX} حرف.`;
    setErrors(next);
    if (Object.keys(next).length) {
      const firstKey = Object.keys(next)[0];
      formRef.current?.querySelector<HTMLElement>(`[data-field="${firstKey}"]`)?.focus();
      return;
    }

    const message = [
      `الخبرة: ${experience}`,
      `السيرة الذاتية: ${cvUrl || "لا يوجد"}`,
      about.trim(),
    ]
      .filter(Boolean)
      .join("\n")
      .slice(0, MESSAGE_MAX);

    lock.current = true;
    setStatus({ kind: "sending" });
    const result = await postLead({
      fullName: name,
      phone: toE164(local),
      city,
      email: mail,
      source: "careers",
      service: `وظيفة: ${field}`,
      message,
      ...readUtmFromUrl(),
    });
    lock.current = false;

    if (!result.ok) {
      setStatus({ kind: "error", message: result.message });
      return;
    }
    setStatus({ kind: "ok" });
  }

  const waText = [
    "مرحباً، أرسلت طلب تقديم للعمل عبر الموقع.",
    `الاسم: ${fullName.trim()}`,
    `المجال: ${field}`,
    `الخبرة: ${experience}`,
    `المدينة: ${city}`,
  ].join("\n");

  return (
    <div
      id="careers-form"
      className="relative scroll-mt-[130px] overflow-hidden rounded-[28px] border border-[var(--color-md-line-strong)] bg-[rgba(22,16,10,0.85)] p-6 shadow-[0_40px_90px_-40px_rgba(232,195,106,0.35)] backdrop-blur-xl sm:p-8"
    >
      <div
        className="pointer-events-none absolute -top-24 -left-16 size-64 rounded-full blur-[40px]"
        style={{ background: "radial-gradient(circle, rgba(232,195,106,.16), transparent 70%)" }}
        aria-hidden
      />

      {status.kind === "ok" ? (
        <div className="relative py-4">
          <CareersSuccess
            waHref={whatsappHref(waText)}
            points={["سرية تامة للبيانات", "رد خلال أيام العمل", "بيئة عمل نسائية"]}
          />
        </div>
      ) : (
        <form ref={formRef} onSubmit={onSubmit} noValidate className="relative flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="inline-flex items-center gap-2.5 text-[1.15rem] font-extrabold text-[var(--color-md-text)]">
              <LuBriefcase className="size-5 text-[var(--color-md-champagne)]" aria-hidden />
              طلب انضمام إلى الفريق
            </h2>
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-md-line-strong)] px-3 py-1.5 text-[0.72rem] font-extrabold text-[var(--color-md-champagne)]">
              <span
                className="size-1.5 rounded-full bg-[var(--color-md-neon)]"
                style={{ animation: "md-neon-pulse 2.4s ease-in-out infinite" }}
                aria-hidden
              />
              نرد خلال أيام العمل
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="الاسم الكريم" htmlFor={`${uid}-name`} required error={errors.name}>
              <TextInput
                id={`${uid}-name`}
                data-field="name"
                name="name"
                autoComplete="name"
                placeholder="اسمكِ الثلاثي"
                value={fullName}
                invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? `${uid}-name-error` : undefined}
                onChange={(e) => {
                  setFullName(e.target.value);
                  clear("name");
                }}
                disabled={sending}
              />
            </Field>

            <Field label="رقم الجوال" htmlFor={`${uid}-phone`} required error={errors.phone}>
              <PhoneInput
                id={`${uid}-phone`}
                data-field="phone"
                name="phone"
                value={phone}
                invalid={Boolean(errors.phone)}
                aria-describedby={errors.phone ? `${uid}-phone-error` : undefined}
                onChange={(e) => {
                  setPhone(e.target.value);
                  clear("phone");
                }}
                disabled={sending}
              />
            </Field>

            <Field label="البريد الإلكتروني" htmlFor={`${uid}-email`} required error={errors.email}>
              <TextInput
                id={`${uid}-email`}
                data-field="email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                dir="ltr"
                placeholder="name@example.com"
                value={email}
                invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? `${uid}-email-error` : undefined}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clear("email");
                }}
                disabled={sending}
                className="text-left placeholder:text-left"
              />
            </Field>

            <Field label="المدينة" htmlFor={`${uid}-city`} required>
              <SelectInput
                id={`${uid}-city`}
                name="city"
                autoComplete="address-level2"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={sending}
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </SelectInput>
            </Field>

            <Field label="المجال" htmlFor={`${uid}-field`} required error={errors.field}>
              <SelectInput
                id={`${uid}-field`}
                data-field="field"
                name="field"
                value={field}
                invalid={Boolean(errors.field)}
                aria-describedby={errors.field ? `${uid}-field-error` : undefined}
                onChange={(e) => {
                  setField(e.target.value);
                  clear("field");
                }}
                disabled={sending}
              >
                <option value="" disabled>
                  اختاري المجال
                </option>
                {CAREER_FIELDS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </SelectInput>
            </Field>

            <Field
              label="سنوات الخبرة"
              htmlFor={`${uid}-experience`}
              required
              error={errors.experience}
            >
              <SelectInput
                id={`${uid}-experience`}
                data-field="experience"
                name="experience"
                value={experience}
                invalid={Boolean(errors.experience)}
                aria-describedby={errors.experience ? `${uid}-experience-error` : undefined}
                onChange={(e) => {
                  setExperience(e.target.value);
                  clear("experience");
                }}
                disabled={sending}
              >
                <option value="" disabled>
                  اختاري سنوات الخبرة
                </option>
                {EXPERIENCE_LEVELS.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </SelectInput>
            </Field>

            <Field
              label="رابط السيرة الذاتية"
              htmlFor={`${uid}-cv`}
              error={errors.cv}
              hint="Google Drive أو LinkedIn"
              className="sm:col-span-2"
            >
              <TextInput
                id={`${uid}-cv`}
                data-field="cv"
                name="cv"
                type="url"
                inputMode="url"
                autoComplete="url"
                dir="ltr"
                placeholder="https://"
                value={cv}
                invalid={Boolean(errors.cv)}
                aria-describedby={errors.cv ? `${uid}-cv-error` : undefined}
                onChange={(e) => {
                  setCv(e.target.value);
                  clear("cv");
                }}
                disabled={sending}
                className="text-left placeholder:text-left"
              />
            </Field>

            <Field
              label="نبذة عنكِ"
              htmlFor={`${uid}-about`}
              error={errors.about}
              className="sm:col-span-2"
              hint={
                <span className="flex justify-between">
                  <span>خبراتكِ، شهاداتكِ، وما الذي يجعلكِ الأنسب لهذا المجال.</span>
                  <span dir="ltr" aria-live="polite">
                    {about.length}/{ABOUT_MAX}
                  </span>
                </span>
              }
            >
              <textarea
                id={`${uid}-about`}
                data-field="about"
                name="about"
                rows={4}
                maxLength={ABOUT_MAX}
                placeholder="مثال: أخصائية ليزر بخبرة 4 سنوات في عيادات جلدية بجدة، حاصلة على شهادة..."
                value={about}
                aria-invalid={errors.about ? true : undefined}
                onChange={(e) => {
                  setAbout(e.target.value.slice(0, ABOUT_MAX));
                  clear("about");
                }}
                disabled={sending}
                className={`${fieldClasses} resize-y ${errors.about ? fieldInvalidClasses : ""}`}
              />
            </Field>
          </div>

          {status.kind === "error" ? <FormError message={status.message} /> : null}

          <ApplyButton sending={sending} className="mt-1" />

          <p className="m-0 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[0.72rem] font-bold text-[rgba(246,238,223,0.45)]">
            <span className="inline-flex items-center gap-1.5">
              <Icon.Lock className="size-3.5 text-[var(--color-md-champagne)]" />
              بياناتكِ سرّية
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Icon.ShieldCheck className="size-3.5 text-[var(--color-md-champagne)]" />
              لا نشارك ملفكِ مع أي جهة
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Icon.Clock className="size-3.5 text-[var(--color-md-champagne)]" />
              رد خلال أيام العمل
            </span>
          </p>
        </form>
      )}
    </div>
  );
}

/**
 * Both labels stay mounted and swap via CSS (mirrors the shared SubmitButton,
 * with a send icon instead of the booking calendar).
 */
function ApplyButton({ sending, className = "" }: { sending: boolean; className?: string }) {
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
        <span>جارٍ الإرسال...</span>
      </span>
      <span className={`items-center gap-2.5 ${sending ? "hidden" : "flex"}`}>
        <LuSend className="size-[18px]" aria-hidden />
        <span>أرسلي طلب التقديم</span>
      </span>
    </button>
  );
}

/** In-place success state (same look as the booking SuccessPanel, careers copy). */
function CareersSuccess({ waHref, points }: { waHref: string; points: string[] }) {
  return (
    <div role="status" aria-live="polite" className="flex flex-col items-center gap-4 text-center">
      <span
        className="flex size-16 items-center justify-center rounded-full shadow-[0_0_38px_-8px_rgba(232,195,106,0.7)]"
        style={{ background: GOLD_GRADIENT }}
      >
        <Icon.Check className="size-[30px] text-[var(--color-md-ink)]" strokeWidth={2.8} />
      </span>
      <h3 className="m-0 text-[1.5rem] font-extrabold text-[var(--color-md-text)]">استلمنا طلبكِ</h3>
      <p className="m-0 max-w-[40ch] text-[0.95rem] leading-[1.9] font-light text-[rgba(246,238,223,0.7)]">
        وصل طلبكِ إلى فريق الموارد البشرية. نراجع كل طلب بعناية، وإن كان ملفكِ مناسباً لأحد المجالات نعود إليكِ خلال أيام العمل لتحديد موعد المقابلة.
      </p>

      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-8 py-3.5 text-[0.98rem] font-extrabold text-[#0B2B16] shadow-[0_0_30px_-8px_rgba(37,211,102,0.6)] transition-transform hover:-translate-y-0.5 sm:w-auto"
      >
        <SocialIcon name="whatsapp" className="text-[19px]" />
        تواصلي معنا عبر واتساب
      </a>

      <p className="m-0 inline-flex flex-wrap items-center justify-center gap-x-2 text-[0.8rem] font-bold text-[rgba(246,238,223,0.55)]">
        <Icon.Clock className="size-3.5 text-[var(--color-md-champagne)]" />
        نعود إليكِ خلال أيام العمل، من السبت إلى الخميس
      </p>

      <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-[0.8rem] font-bold text-[rgba(246,238,223,0.6)]">
        {points.map((p) => (
          <li key={p} className="inline-flex items-center gap-1.5">
            <Icon.Check className="size-3.5 text-[var(--color-md-champagne)]" strokeWidth={3} />
            {p}
          </li>
        ))}
      </ul>
    </div>
  );
}
