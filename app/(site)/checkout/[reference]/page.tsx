import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Script from "next/script";
import { Icon, SocialIcon } from "@/components/icons";
import { ConversionTracking } from "@/components/landing/ConversionTracking";
import { GOLD_GRADIENT, PHONE_DISPLAY, TEL_LINK, WHATSAPP_NUMBER } from "@/app/_home/config";
import { Glow } from "@/app/_home/Sections";
import { PaymentBadges } from "@/app/_home/PaymentBadges";
import { prisma } from "@/lib/prisma";
import { formatSar } from "@/lib/content";
import { syncOrderWithNoon } from "@/lib/orders";
import { getPageDef } from "@/lib/pages/registry";
import { StatusPoller } from "./_components/StatusPoller";
import { FirePurchase } from "./_components/FirePurchase";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "حالة الدفع",
  robots: { index: false, follow: false },
};

const REF_RE = /^MD-[A-Z0-9]{4}-[A-Z0-9]{4}$/;

/** The Google Ads accounts the landings tag with; both are configured so the
 *  page's own conversion (whichever account it belongs to) can fire here. */
const ADS_IDS = ["AW-10989762778", "AW-707324287"] as const;

type View = {
  tone: "success" | "pending" | "failed";
  eyebrow: string;
  title: string;
  body: string;
};

function viewFor(status: string, itemTitle: string): View {
  switch (status) {
    case "PAID":
      return {
        tone: "success",
        eyebrow: "تم الدفع بنجاح",
        title: "شكراً لكِ، حجزك مؤكد",
        body: `استلمنا دفعتك لـ «${itemTitle}». سيتصل بك فريق الاستقبال خلال ساعات العمل لتثبيت موعدك، ويمكنك تأكيده الآن عبر واتساب.`,
      };
    case "REFUNDED":
      return {
        tone: "pending",
        eyebrow: "تم استرداد المبلغ",
        title: "أُعيد المبلغ إلى بطاقتك",
        body: "تمت إعادة قيمة هذا الطلب. إن كان لديك أي استفسار فنحن هنا لمساعدتك.",
      };
    case "PENDING":
      return {
        tone: "pending",
        eyebrow: "بانتظار تأكيد البنك",
        title: "لحظات ونؤكد لكِ الدفع",
        body: "لم يصلنا تأكيد البنك بعد. تبقى هذه الصفحة تتحقق تلقائياً، ولن يُخصم منك أي مبلغ مرتين.",
      };
    default:
      return {
        tone: "failed",
        eyebrow: "لم تكتمل عملية الدفع",
        title: "لم يُخصم أي مبلغ",
        body: "أُلغيت العملية أو رفضها البنك. يمكنك المحاولة مرة أخرى من الصفحة نفسها، أو حجز موعدك عبر واتساب وسنساعدك.",
      };
  }
}

export default async function CheckoutReturnPage({ params }: { params: Promise<{ reference: string }> }) {
  const { reference: raw } = await params;
  const reference = decodeURIComponent(raw).toUpperCase();
  if (!REF_RE.test(reference)) notFound();

  let order = await prisma.order.findUnique({ where: { reference } });
  if (!order) notFound();

  if (order.status === "PENDING" && order.noonOrderId) {
    order = (await syncOrderWithNoon(order.id, { via: "return" })).order;
  }

  const page = order.pageSlug ? getPageDef(order.pageSlug) : undefined;
  const view = viewFor(order.status, order.itemTitle);
  const backHref = page?.path ?? "/offers";
  const backLabel = page ? `العودة إلى ${page.title}` : "العودة إلى العروض";

  const waText = [
    view.tone === "success" ? "مرحباً، أتممت الدفع عبر الموقع وأود تثبيت موعدي." : "مرحباً، حاولت الدفع عبر الموقع وأحتاج مساعدتكم.",
    `رقم الطلب: ${order.reference}`,
    `الخدمة: ${order.itemTitle}`,
    `المبلغ: ${formatSar(order.amount)}`,
    `الاسم: ${order.fullName}`,
  ].join("\n");
  const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}`;

  const iconWrap =
    view.tone === "success"
      ? "text-[var(--color-md-ink)]"
      : view.tone === "pending"
        ? "border border-[var(--color-md-line-strong)] text-[var(--color-md-champagne)]"
        : "border border-rose-400/40 bg-rose-500/10 text-rose-300";

  return (
    <section className="relative overflow-hidden bg-[var(--color-md-bg)] px-[22px] pt-[150px] pb-[96px]">
      {view.tone === "success" && order.pageSlug ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${ADS_IDS[0]}`} strategy="afterInteractive" />
          <Script id="checkout-gtag-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
${ADS_IDS.map((id) => `gtag('config', '${id}');`).join("\n")}`}
          </Script>
          <ConversionTracking slug={page?.leadSource ?? order.pageSlug} />
          <FirePurchase reference={order.reference} />
        </>
      ) : null}

      <Glow className="-top-20 left-1/2 h-[380px] w-[700px] -translate-x-1/2" />
      <div className="relative mx-auto flex max-w-[640px] flex-col items-center text-center">
        <span
          className={`flex size-20 items-center justify-center rounded-full shadow-[0_0_38px_-8px_rgba(232,195,106,0.5)] ${iconWrap}`}
          style={view.tone === "success" ? { background: GOLD_GRADIENT } : undefined}
        >
          {view.tone === "success" ? (
            <Icon.Check className="size-9" strokeWidth={2.8} />
          ) : view.tone === "pending" ? (
            <Icon.Clock className="size-8" strokeWidth={2} />
          ) : (
            <Icon.CircleAlert className="size-8" strokeWidth={2} />
          )}
        </span>

        <span className="mt-6 inline-flex items-center gap-2.5 rounded-full border border-[var(--color-md-line-strong)] bg-[rgba(22,16,10,0.7)] px-[18px] py-2 text-[0.78rem] font-bold text-[var(--color-md-champagne)]">
          {view.eyebrow}
        </span>
        <h1 className="mt-4 text-[clamp(1.7rem,4.5vw,2.6rem)] leading-[1.5] font-extrabold text-[var(--color-md-text)]">{view.title}</h1>
        <p className="mt-4 max-w-[52ch] text-[1.02rem] leading-[1.9] font-light text-[rgba(246,238,223,0.62)]">{view.body}</p>

        <div className="mt-4">
          <StatusPoller reference={order.reference} initial={order.status} />
        </div>

        <dl className="mt-8 grid w-full grid-cols-1 gap-x-8 gap-y-3 rounded-[24px] border border-[var(--color-md-line)] bg-[var(--color-md-card)] p-6 text-right sm:grid-cols-2">
          <Row label="رقم الطلب">
            <span dir="ltr" className="font-mono text-[0.95rem] font-bold tracking-[0.08em] text-[var(--color-md-champagne)]">
              {order.reference}
            </span>
          </Row>
          <Row label="المبلغ">
            <span className="text-[1.05rem] font-extrabold text-[var(--color-md-text)]">{formatSar(order.amount)}</span>
          </Row>
          <Row label="الخدمة">
            <span className="font-bold text-[var(--color-md-text)]">{order.itemTitle}</span>
          </Row>
          <Row label="الاسم">
            <span className="font-bold text-[var(--color-md-text)]">{order.fullName}</span>
          </Row>
          {order.paymentBrand ? (
            <Row label="وسيلة الدفع">
              <span dir="ltr" className="font-bold text-[var(--color-md-text)]">
                {order.paymentBrand.replace(/_/g, " ")}
              </span>
            </Row>
          ) : null}
        </dl>

        <div className="mt-8 flex w-full flex-col gap-3.5 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-center">
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-[30px] py-4 text-base font-extrabold text-[#0B2B16] shadow-[0_0_30px_-8px_rgba(37,211,102,0.6)] transition-transform hover:-translate-y-0.5"
          >
            <SocialIcon name="whatsapp" className="text-[19px]" />
            {view.tone === "success" ? "تثبيت الموعد عبر واتساب" : "تواصلي معنا عبر واتساب"}
          </a>
          <Link
            href={backHref}
            className="inline-flex items-center justify-center gap-2.5 rounded-full border border-[rgba(240,212,138,0.35)] px-[30px] py-4 text-base font-extrabold text-[#F0D48A] transition-all duration-300 hover:bg-[rgba(240,212,138,0.1)]"
          >
            {view.tone === "failed" ? <Icon.RefreshCw className="size-[17px]" /> : <Icon.ArrowRight className="size-[17px]" strokeWidth={2.4} />}
            {view.tone === "failed" ? "المحاولة مرة أخرى" : backLabel}
          </Link>
          <a
            href={TEL_LINK}
            className="inline-flex items-center justify-center gap-2.5 rounded-full border border-[rgba(240,212,138,0.35)] px-[30px] py-4 text-base font-extrabold text-[#F0D48A] transition-all duration-300 hover:bg-[rgba(240,212,138,0.1)]"
          >
            <Icon.Phone className="size-[18px]" />
            <span dir="ltr">{PHONE_DISPLAY}</span>
          </a>
        </div>

        <div className="mt-9 flex flex-col items-center gap-2">
          <PaymentBadges withSplit={false} className="justify-center" />
          <p className="m-0 inline-flex items-center gap-1.5 text-[0.76rem] font-bold text-[rgba(246,238,223,0.45)]">
            <Icon.ShieldCheck className="size-3.5 text-[var(--color-md-champagne)]" />
            الدفع يتم عبر بوابة noon payments المرخّصة، ولا نحتفظ ببيانات بطاقتك.
          </p>
        </div>
      </div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[var(--color-md-line)] pb-3 last:border-b-0 last:pb-0 sm:last:border-b sm:last:pb-3">
      <dt className="text-[0.78rem] font-bold text-[rgba(246,238,223,0.5)]">{label}</dt>
      <dd className="m-0 text-left">{children}</dd>
    </div>
  );
}
