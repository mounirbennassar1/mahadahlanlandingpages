"use client";

import { useId, useMemo, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { Icon } from "@/components/icons";
import { toArabicDigits } from "@/app/_home/config";
import { readUtmFromUrl } from "@/lib/utm";
import { fireConversion } from "@/lib/gtag";
import {
  CITIES,
  PHONE_ERROR,
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
  SubmitButton,
  SuccessPanel,
  TextInput,
} from "../../_booking/Fields";

export type ServiceGroup = {
  group: string;
  items: { slug: string; name: string }[];
};

export type BookingFormProps = {
  groups: ServiceGroup[];
  /** Service slug from `?service=`; preselected when it exists. */
  initialService?: string | null;
  /** From `?doctor=`; shown as a chip and appended to the message. */
  doctor?: { slug: string; name: string } | null;
  /** From `?offer=`; becomes the preselected service label. */
  offer?: { slug: string; title: string } | null;
};

const CONSULT_VALUE = "consultation";
const CONSULT_LABEL = "لست متأكدة، أريد استشارة";
const NOTES_MAX = 500;

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "ok" }
  | { kind: "error"; message: string };

type Errors = Partial<Record<"name" | "phone" | "email" | "service" | "notes", string>>;

const subscribeNoop = () => () => {};
const getServerMinDate = () => "";

/** Local calendar date as YYYY-MM-DD (for the date input's `min`). */
function todayIso() {
  const d = new Date();
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

export function BookingForm({ groups, initialService, doctor, offer }: BookingFormProps) {
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);

  /** value → human label, used for the `service` field we post. */
  const labels = useMemo(() => {
    const map = new Map<string, string>();
    if (offer) map.set(`offer:${offer.slug}`, offer.title);
    for (const g of groups) for (const s of g.items) map.set(`svc:${s.slug}`, s.name);
    map.set(CONSULT_VALUE, CONSULT_LABEL);
    return map;
  }, [groups, offer]);

  const initialValue = offer
    ? `offer:${offer.slug}`
    : initialService && labels.has(`svc:${initialService}`)
      ? `svc:${initialService}`
      : "";

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState<string>(CITIES[0]);
  const [service, setService] = useState(initialValue);
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  // "" on the server and during hydration, today's date after mount.
  const minDate = useSyncExternalStore(subscribeNoop, todayIso, getServerMinDate);

  const sending = status.kind === "sending";
  const clear = (key: keyof Errors) =>
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending || status.kind === "ok") return;

    const name = fullName.trim();
    const local = normalizeSaudiMobile(phone);
    const mail = email.trim();
    const next: Errors = {};
    if (name.length < 2) next.name = "اكتبي اسمك الكريم (حرفان على الأقل).";
    if (!isValidSaudiMobile(local)) next.phone = PHONE_ERROR;
    if (mail && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail))
      next.email = "صيغة البريد الإلكتروني غير صحيحة.";
    if (!service) next.service = "اختاري الخدمة، أو «لست متأكدة» لنساعدك.";
    if (notes.length > NOTES_MAX) next.notes = `الملاحظات يجب ألا تتجاوز ${toArabicDigits(NOTES_MAX)} حرف.`;
    setErrors(next);
    if (Object.keys(next).length) {
      const firstKey = Object.keys(next)[0];
      formRef.current?.querySelector<HTMLElement>(`[data-field="${firstKey}"]`)?.focus();
      return;
    }

    const messageParts = [notes.trim()];
    if (doctor) messageParts.push(`الطبيبة المفضلة: ${doctor.name}`);
    const message = messageParts.filter(Boolean).join("\n").slice(0, 1000);

    setStatus({ kind: "sending" });
    const result = await postLead({
      fullName: name,
      phone: toE164(local),
      city,
      source: "book-now",
      ...(mail ? { email: mail } : {}),
      service: labels.get(service) ?? service,
      ...(date ? { preferredAt: date } : {}),
      ...(message ? { message } : {}),
      ...readUtmFromUrl(),
    });

    if (!result.ok) {
      setStatus({ kind: "error", message: result.message });
      return;
    }
    fireConversion("form");
    setStatus({ kind: "ok" });
  }

  const waText = [
    "مرحباً، أرسلت طلب حجز موعد عبر الموقع.",
    `الاسم: ${fullName.trim()}`,
    `الخدمة: ${labels.get(service) ?? ""}`,
    `المدينة: ${city}`,
    date ? `التاريخ المفضل: ${toArabicDigits(date)}` : null,
    doctor ? `الطبيبة المفضلة: ${doctor.name}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-[var(--color-md-line-strong)] bg-[rgba(22,16,10,0.85)] p-6 shadow-[0_40px_90px_-40px_rgba(232,195,106,0.35)] backdrop-blur-xl sm:p-8">
      <div
        className="pointer-events-none absolute -top-24 -left-16 size-64 rounded-full blur-[40px]"
        style={{ background: "radial-gradient(circle, rgba(232,195,106,.16), transparent 70%)" }}
        aria-hidden
      />

      {status.kind === "ok" ? (
        <div className="relative py-4">
          <SuccessPanel
            title="تم استلام طلب حجزك"
            body="سيتصل بك فريق الاستقبال لتأكيد الموعد وشرح الخطة والتكلفة المتوقعة قبل الجلسة. وإن أحببتِ، أكملي الآن عبر واتساب."
            waHref={whatsappHref(waText)}
            waLabel="متابعة الحجز عبر واتساب"
            points={["تكلفة واضحة قبل الجلسة", "طاقم نسائي بالكامل", "خصوصية تامة"]}
          />
        </div>
      ) : (
        <form ref={formRef} onSubmit={onSubmit} noValidate className="relative flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="inline-flex items-center gap-2.5 text-[1.15rem] font-extrabold text-[var(--color-md-text)]">
              <Icon.CalendarCheck className="size-5 text-[var(--color-md-champagne)]" />
              طلب حجز موعد
            </h2>
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-md-line-strong)] px-3 py-1.5 text-[0.72rem] font-extrabold text-[var(--color-md-champagne)]">
              <span
                className="size-1.5 rounded-full bg-[var(--color-md-neon)]"
                style={{ animation: "md-neon-pulse 2.4s ease-in-out infinite" }}
                aria-hidden
              />
              نرد خلال ساعات العمل
            </span>
          </div>

          {doctor ? (
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[rgba(240,212,138,0.4)] bg-[rgba(232,195,106,0.1)] px-3.5 py-1.5 text-[0.8rem] font-extrabold text-[var(--color-md-champagne)]">
              <Icon.Stethoscope className="size-4" strokeWidth={2} />
              طلب موعد مع {doctor.name}
            </span>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="الاسم الكريم" htmlFor={`${uid}-name`} required error={errors.name}>
              <TextInput
                id={`${uid}-name`}
                data-field="name"
                name="name"
                autoComplete="name"
                placeholder="اسمك الثلاثي"
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

            <Field label="البريد الإلكتروني" htmlFor={`${uid}-email`} error={errors.email}>
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

            <Field
              label="الخدمة"
              htmlFor={`${uid}-service`}
              required
              error={errors.service}
              className="sm:col-span-2"
            >
              <SelectInput
                id={`${uid}-service`}
                data-field="service"
                name="service"
                value={service}
                invalid={Boolean(errors.service)}
                aria-describedby={errors.service ? `${uid}-service-error` : undefined}
                onChange={(e) => {
                  setService(e.target.value);
                  clear("service");
                }}
                disabled={sending}
              >
                <option value="" disabled>
                  اختاري الخدمة
                </option>
                {offer ? (
                  <optgroup label="العرض المختار">
                    <option value={`offer:${offer.slug}`}>{offer.title}</option>
                  </optgroup>
                ) : null}
                {groups.map((g) => (
                  <optgroup key={g.group} label={g.group}>
                    {g.items.map((s) => (
                      <option key={s.slug} value={`svc:${s.slug}`}>
                        {s.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
                <optgroup label="غير متأكدة؟">
                  <option value={CONSULT_VALUE}>{CONSULT_LABEL}</option>
                </optgroup>
              </SelectInput>
            </Field>

            <Field
              label="التاريخ المفضل"
              htmlFor={`${uid}-date`}
              hint="نقترح عليك أقرب موعد متاح إن لم يتوفر هذا اليوم."
            >
              <TextInput
                id={`${uid}-date`}
                name="preferredAt"
                type="date"
                min={minDate || undefined}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                disabled={sending}
                className="[color-scheme:dark]"
              />
            </Field>

            <Field
              label="ملاحظات"
              htmlFor={`${uid}-notes`}
              error={errors.notes}
              className="sm:col-span-2"
              hint={
                <span className="flex justify-between">
                  <span>أخبرينا بما يشغلك أو بالوقت الأنسب للاتصال.</span>
                  <span dir="ltr" aria-live="polite">
                    {toArabicDigits(notes.length)}/{toArabicDigits(NOTES_MAX)}
                  </span>
                </span>
              }
            >
              <textarea
                id={`${uid}-notes`}
                data-field="notes"
                name="message"
                rows={3}
                maxLength={NOTES_MAX}
                placeholder="مثال: أفضّل الاتصال بعد العصر"
                value={notes}
                aria-invalid={errors.notes ? true : undefined}
                onChange={(e) => {
                  setNotes(e.target.value.slice(0, NOTES_MAX));
                  clear("notes");
                }}
                disabled={sending}
                className={`${fieldClasses} resize-y ${errors.notes ? fieldInvalidClasses : ""}`}
              />
            </Field>
          </div>

          {status.kind === "error" ? <FormError message={status.message} /> : null}

          <SubmitButton sending={sending} label="أرسلي طلب الحجز" className="mt-1" />

          <p className="m-0 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[0.72rem] font-bold text-[rgba(246,238,223,0.45)]">
            <span className="inline-flex items-center gap-1.5">
              <Icon.ShieldCheck className="size-3.5 text-[var(--color-md-champagne)]" />
              تكلفة واضحة قبل الجلسة
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Icon.Lock className="size-3.5 text-[var(--color-md-champagne)]" />
              بياناتك سرّية
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Icon.Clock className="size-3.5 text-[var(--color-md-champagne)]" />
              المواعيد محدودة أسبوعياً
            </span>
          </p>
        </form>
      )}
    </div>
  );
}
