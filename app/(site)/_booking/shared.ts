import { WHATSAPP_NUMBER } from "@/app/_home/config";

/**
 * Shared bits of the two booking flows (offers modal + /book-now form):
 * city list, payment methods, Saudi mobile normalisation, field styles and
 * the `/api/leads` POST wrapper. Client-safe (no Prisma imports).
 */

export const CITIES = [
  "جدة",
  "مكة",
  "الرياض",
  "المدينة المنورة",
  "الطائف",
  "الدمام",
  "أخرى",
] as const;

export type City = (typeof CITIES)[number];

export const PAYMENT_METHODS = [
  { value: "COD", label: "نقداً في العيادة", hint: "الدفع عند الاستقبال" },
  { value: "TAMARA", label: "تمارا", hint: "قسّطيها على دفعات" },
  { value: "TABBY", label: "تابي", hint: "٤ دفعات بدون فوائد" },
  { value: "CARD", label: "بطاقة / مدى", hint: "فيزا، ماستركارد، مدى" },
] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number]["value"];

export function paymentLabel(value: PaymentMethod) {
  return PAYMENT_METHODS.find((m) => m.value === value)?.label ?? value;
}

const ARABIC_INDIC = "٠١٢٣٤٥٦٧٨٩";
const EASTERN_ARABIC = "۰۱۲۳۴۵۶۷۸۹";

/** Arabic-Indic / Persian digits → ASCII so pasted numbers validate. */
export function latinDigits(value: string) {
  return value
    .replace(/[٠-٩]/g, (d) => String(ARABIC_INDIC.indexOf(d)))
    .replace(/[۰-۹]/g, (d) => String(EASTERN_ARABIC.indexOf(d)));
}

/**
 * "05x…", "5x…", "+966 5x…", "00966 5x…" → "5xxxxxxxx".
 * Returns whatever digits remain when the input does not match, so the
 * validator can produce a precise error.
 */
export function normalizeSaudiMobile(raw: string) {
  let digits = latinDigits(raw).replace(/\D/g, "");
  if (digits.startsWith("00966")) digits = digits.slice(5);
  else if (digits.startsWith("966") && digits.length >= 12) digits = digits.slice(3);
  return digits.replace(/^0+/, "");
}

export function isValidSaudiMobile(local: string) {
  return /^5\d{8}$/.test(local);
}

export function toE164(local: string) {
  return `+966${local}`;
}

export const PHONE_ERROR = "أدخلي رقم جوال سعودي صحيح من ٩ أرقام يبدأ بـ ٥.";

export const fieldClasses =
  "w-full rounded-xl border border-[var(--color-md-line-strong)] bg-[rgba(246,238,223,0.05)] px-4 py-3.5 text-[0.95rem] text-[var(--color-md-text)] outline-none transition-colors placeholder:text-[rgba(246,238,223,0.35)] focus:border-[var(--color-md-gold-bright)] disabled:opacity-60";

export const fieldInvalidClasses = "border-rose-400/60";

export function whatsappHref(text: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export type LeadResult =
  | { ok: true; id: string }
  | { ok: false; message: string };

/** POST a lead to the shared ingest endpoint with Arabic error messages. */
export async function postLead(
  payload: Record<string, unknown>,
): Promise<LeadResult> {
  try {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await res.json().catch(() => ({}))) as {
      id?: string;
      error?: string;
    };

    if (!res.ok) {
      return {
        ok: false,
        message:
          res.status === 400
            ? "بعض البيانات غير صحيحة. راجعي الاسم ورقم الجوال ثم حاولي مرة أخرى."
            : "تعذّر إرسال طلبك الآن. حاولي مرة أخرى بعد قليل أو تواصلي معنا عبر واتساب.",
      };
    }
    return { ok: true, id: data.id ?? "" };
  } catch {
    return {
      ok: false,
      message: "تعذّر الاتصال. تحققي من اتصالك بالإنترنت ثم حاولي مرة أخرى.",
    };
  }
}

/** Full street address shown on the booking page (config's ADDRESS_DISPLAY is the short form). */
export const CLINIC_ADDRESS =
  "جدة، حي الروضة، شارع الأمير محمد بن عبدالعزيز (التحلية)، مركز بن حمران، الدور الثالث";

export const CLINIC_EMAIL = "info@mahadahlan.com";
