"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type FormEvent,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { LuBanknote } from "react-icons/lu";
import { Icon } from "@/components/icons";
import { GOLD_GRADIENT } from "@/app/_home/config";
import { PayLogo } from "@/app/_home/PayLogo";
import { readUtmFromUrl } from "@/lib/utm";
import { fireConversion } from "@/lib/gtag";
import {
  CITIES,
  PAYMENT_METHODS,
  PHONE_ERROR,
  isValidSaudiMobile,
  normalizeSaudiMobile,
  paymentLabel,
  postLead,
  toE164,
  whatsappHref,
  type PaymentMethod,
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
import type { OfferItem } from "./types";

const EASE = [0.22, 1, 0.36, 1] as const;

const subscribeNoop = () => () => {};
const getPortalHost = () =>
  document.querySelector<HTMLElement>(".md-home") ?? document.body;
const getServerHost = () => null;

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Portal-mounted booking dialog for one offer. Bottom sheet on phones,
 * centred card on larger screens. Focus-trapped, Esc / overlay to close,
 * body scroll locked (Lenis ignores wheel events under `data-lenis-prevent`).
 *
 * Mounted into `.md-home` (not `document.body`) so the palette tokens and
 * Almarai font set on that wrapper still apply inside the portal.
 */
export function OfferBookingModal({
  offer,
  onClose,
}: {
  offer: OfferItem | null;
  onClose: () => void;
}) {
  const host = useSyncExternalStore(subscribeNoop, getPortalHost, getServerHost);

  if (!host) return null;

  return createPortal(
    <AnimatePresence>
      {offer ? <Dialog key={offer.id} offer={offer} onClose={onClose} /> : null}
    </AnimatePresence>,
    host,
  );
}

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "ok" }
  | { kind: "error"; message: string };

type Errors = Partial<Record<"name" | "phone" | "payment" | "terms", string>>;

function Dialog({ offer, onClose }: { offer: OfferItem; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const uid = useId();
  const titleId = `${uid}-title`;

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState<string>(CITIES[0]);
  const [payment, setPayment] = useState<PaymentMethod | "">("");
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const sending = status.kind === "sending";

  /* scroll lock + focus trap + Esc + focus restore */
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => panelRef.current?.focus(), 40);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const nodes = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((el) => el.offsetParent !== null);
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const current = document.activeElement;
      if (e.shiftKey && (current === first || current === panelRef.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && current === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  const clearError = useCallback((key: keyof Errors) => {
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending || status.kind === "ok") return;

    const name = fullName.trim();
    const local = normalizeSaudiMobile(phone);
    const next: Errors = {};
    if (name.length < 2) next.name = "اكتبي اسمك الكريم (حرفان على الأقل).";
    if (!isValidSaudiMobile(local)) next.phone = PHONE_ERROR;
    if (!payment) next.payment = "اختاري طريقة الدفع المفضلة.";
    if (!terms) next.terms = "يلزم الموافقة على الشروط والأحكام للمتابعة.";
    setErrors(next);
    if (Object.keys(next).length) {
      const firstKey = Object.keys(next)[0];
      panelRef.current
        ?.querySelector<HTMLElement>(`[data-field="${firstKey}"]`)
        ?.focus();
      return;
    }

    setStatus({ kind: "sending" });
    const result = await postLead({
      fullName: name,
      phone: toE164(local),
      city,
      source: "offers",
      offerId: offer.id,
      service: offer.title,
      paymentMethod: payment,
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
    `مرحباً، حجزت عرض «${offer.title}» عبر الموقع.`,
    `السعر: ${offer.priceLabel}`,
    `الاسم: ${fullName.trim()}`,
    `المدينة: ${city}`,
    payment ? `طريقة الدفع: ${paymentLabel(payment)}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <motion.div
      className="fixed inset-0 z-[140] flex items-end justify-center sm:items-center sm:p-6"
      data-lenis-prevent
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
    >
      <button
        type="button"
        aria-label="إغلاق النافذة"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-[rgba(5,3,1,0.74)] backdrop-blur-sm"
        tabIndex={-1}
      />

      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        initial={{ y: 48, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0, transition: { duration: 0.22 } }}
        transition={{ duration: 0.4, ease: EASE }}
        className="relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-[28px] border border-[var(--color-md-line-strong)] bg-[#120D07] shadow-[0_-20px_80px_-30px_rgba(232,195,106,0.35)] outline-none sm:max-w-[560px] sm:rounded-[28px] sm:shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9),0_0_60px_-20px_rgba(232,195,106,0.35)]"
      >
        <span
          className="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-[rgba(246,238,223,0.18)] sm:hidden"
          aria-hidden
        />

        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-[var(--color-md-line)] px-6 pt-4 pb-4 sm:pt-6">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-2 text-[0.74rem] font-bold text-[var(--color-md-champagne)]">
              <span
                className="size-1.5 rounded-full bg-[var(--color-md-neon)]"
                style={{ animation: "md-neon-pulse 2.4s ease-in-out infinite" }}
                aria-hidden
              />
              حجز العرض
            </span>
            <h2
              id={titleId}
              className="mt-1.5 text-[1.15rem] leading-[1.5] font-extrabold text-[var(--color-md-text)]"
            >
              {offer.title}
            </h2>
            <div className="mt-1.5 flex flex-wrap items-baseline gap-x-2.5">
              <span className="md-gold-text text-[1.35rem] leading-none font-extrabold">
                {offer.priceLabel}
              </span>
              {offer.oldPriceLabel ? (
                <s className="text-[0.85rem] font-bold text-[rgba(246,238,223,0.38)]">
                  {offer.oldPriceLabel}
                </s>
              ) : null}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[var(--color-md-line-strong)] text-[rgba(246,238,223,0.7)] transition-colors hover:border-[rgba(232,195,106,0.6)] hover:text-[var(--color-md-champagne)]"
          >
            <Icon.X className="size-5" />
          </button>
        </header>

        <div className="overflow-y-auto overscroll-contain px-6 py-5" data-lenis-prevent>
          {status.kind === "ok" ? (
            <SuccessPanel
              title="تم استلام طلب حجزك"
              body={`سجّلنا طلبك لعرض «${offer.title}». سيتصل بك فريق الاستقبال لتأكيد الموعد، والدفع يتم داخل العيادة بالطريقة التي اخترتها.`}
              waHref={whatsappHref(waText)}
              waLabel="تأكيد الحجز عبر واتساب"
              points={["تكلفة واضحة قبل الجلسة", "طاقم نسائي بالكامل", "خصوصية تامة"]}
            >
              <button
                type="button"
                onClick={onClose}
                className="mt-2 cursor-pointer text-[0.84rem] font-bold text-[rgba(246,238,223,0.55)] underline-offset-4 hover:text-[var(--color-md-champagne)] hover:underline"
              >
                العودة إلى العروض
              </button>
            </SuccessPanel>
          ) : (
            <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
              <Field label="الاسم" htmlFor={`${uid}-name`} required error={errors.name}>
                <TextInput
                  id={`${uid}-name`}
                  data-field="name"
                  name="name"
                  autoComplete="name"
                  placeholder="اسمك الكريم"
                  value={fullName}
                  invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? `${uid}-name-error` : undefined}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    clearError("name");
                  }}
                  disabled={sending}
                />
              </Field>

              <Field
                label="الجوال"
                htmlFor={`${uid}-phone`}
                required
                error={errors.phone}
                hint="9 أرقام تبدأ بـ 5، بدون الصفر."
              >
                <PhoneInput
                  id={`${uid}-phone`}
                  data-field="phone"
                  name="phone"
                  value={phone}
                  invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? `${uid}-phone-error` : undefined}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    clearError("phone");
                  }}
                  disabled={sending}
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

              <fieldset className="flex flex-col gap-2" disabled={sending}>
                <legend className="mb-2 text-[0.85rem] font-bold text-[rgba(246,238,223,0.85)]">
                  طريقة الدفع
                  <span className="ms-1 text-[var(--color-md-gold-bright)]" aria-hidden>
                    *
                  </span>
                </legend>
                <div className="grid grid-cols-2 gap-2.5">
                  {PAYMENT_METHODS.map((m, i) => {
                    const on = payment === m.value;
                    return (
                      <label
                        key={m.value}
                        className={`relative flex min-h-[64px] cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-3 transition-all duration-200 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[rgba(240,212,138,0.5)] ${
                          on
                            ? "border-[var(--color-md-gold-bright)] bg-[rgba(232,195,106,0.1)] shadow-[0_0_24px_-10px_rgba(232,195,106,0.6)]"
                            : "border-[var(--color-md-line-strong)] bg-[rgba(246,238,223,0.03)] hover:border-[rgba(232,195,106,0.5)]"
                        } ${errors.payment ? "border-rose-400/50" : ""}`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={m.value}
                          checked={on}
                          data-field={i === 0 ? "payment" : undefined}
                          onChange={() => {
                            setPayment(m.value);
                            clearError("payment");
                          }}
                          className="sr-only"
                        />
                        <PaymentGlyph method={m.value} />
                        <span className="min-w-0 leading-[1.3]">
                          <span className="block text-[0.86rem] font-extrabold text-[var(--color-md-text)]">
                            {m.label}
                          </span>
                          <span className="block text-[0.7rem] text-[rgba(246,238,223,0.45)]">
                            {m.hint}
                          </span>
                        </span>
                        {on ? (
                          <Icon.CircleCheck
                            className="absolute top-2 left-2 size-4 text-[var(--color-md-gold-bright)]"
                            aria-hidden
                          />
                        ) : null}
                      </label>
                    );
                  })}
                </div>
                {errors.payment ? (
                  <p role="alert" className="flex items-center gap-1.5 text-[0.78rem] font-bold text-rose-300">
                    <Icon.CircleAlert className="size-3.5" />
                    {errors.payment}
                  </p>
                ) : (
                  <p className="text-[0.72rem] text-[rgba(246,238,223,0.42)]">
                    لا يُطلب أي دفع الآن. الدفع يتم داخل العيادة بعد تأكيد الموعد.
                  </p>
                )}
              </fieldset>

              <label className="flex cursor-pointer items-start gap-3 text-[0.84rem] font-bold text-[rgba(246,238,223,0.75)]">
                <input
                  type="checkbox"
                  name="terms"
                  data-field="terms"
                  checked={terms}
                  onChange={(e) => {
                    setTerms(e.target.checked);
                    clearError("terms");
                  }}
                  disabled={sending}
                  className="mt-0.5 size-5 shrink-0 cursor-pointer rounded accent-[#E8C36A]"
                />
                <span>
                  أوافق على الشروط والأحكام، وعلى تواصل العيادة معي هاتفياً أو عبر واتساب لتأكيد الموعد.
                </span>
              </label>
              {errors.terms ? (
                <p role="alert" className="-mt-2 flex items-center gap-1.5 text-[0.78rem] font-bold text-rose-300">
                  <Icon.CircleAlert className="size-3.5" />
                  {errors.terms}
                </p>
              ) : null}

              {status.kind === "error" ? <FormError message={status.message} /> : null}

              <SubmitButton sending={sending} label="تأكيد الحجز" className="mt-1" />

              <p className="m-0 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[0.72rem] font-bold text-[rgba(246,238,223,0.45)]">
                <span className="inline-flex items-center gap-1.5">
                  <Icon.ShieldCheck className="size-3.5 text-[var(--color-md-champagne)]" />
                  تكلفة واضحة قبل الجلسة
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Icon.Lock className="size-3.5 text-[var(--color-md-champagne)]" />
                  بياناتك سرّية
                </span>
              </p>
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function PaymentGlyph({ method }: { method: PaymentMethod }) {
  if (method === "TABBY") return <PayLogo brand="tabby" height={22} />;
  if (method === "TAMARA") return <PayLogo brand="tamara" height={22} />;
  return (
    <span
      className="flex size-9 shrink-0 items-center justify-center rounded-lg text-[var(--color-md-ink)]"
      style={{ background: GOLD_GRADIENT }}
      aria-hidden
    >
      {method === "COD" ? (
        <LuBanknote className="size-[18px]" />
      ) : (
        <Icon.CreditCard className="size-[18px]" strokeWidth={2} />
      )}
    </span>
  );
}
