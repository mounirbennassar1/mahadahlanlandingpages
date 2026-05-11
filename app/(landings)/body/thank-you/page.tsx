import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "شكراً لكِ — عيادات د. مها دحلان",
  description: "تم استلام طلبك بنجاح، سنتواصل معك خلال ساعة عمل واحدة.",
};

export default function BodyThankYouPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16 bg-body-bg text-body-fg">
      <div className="w-full max-w-xl">
        <div className="card-body p-8 md:p-12 text-center">
          <div className="mx-auto mb-8 size-20 rounded-full bg-body-accent/15 border border-body-accent/30 flex items-center justify-center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 12l4 4L19 6"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-body-accent"
              />
            </svg>
          </div>

          <h1 className="font-display-body text-3xl md:text-4xl font-bold leading-tight mb-4">
            تم استلام طلبك بنجاح
          </h1>

          <p className="text-body-muted leading-relaxed mb-8">
            شكراً لتواصلك مع عيادات د. مها دحلان. فريقنا سيقوم بالتواصل معك
            خلال ساعة عمل واحدة لتأكيد موعد جلسة تحليل القوام المجانية.
          </p>

          <div className="rounded-2xl border border-body-line bg-white/40 p-5 mb-8 text-right">
            <h4 className="font-display-body font-bold mb-3">الخطوات التالية</h4>
            <ul className="space-y-2 text-sm text-body-muted">
              <li>• سيتصل بك أحد مستشارينا لتحديد موعد يناسبك</li>
              <li>• موعد الاستشارة خلال ٢٤ ساعة عمل</li>
              <li>
                • جدة — حي الروضة، شارع التحلية، مركز بن حمران، الدور الثالث
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/body" className="btn-primary-body">
              العودة للصفحة الرئيسية
            </Link>
            <a
              href="tel:+966920007515"
              className="btn-ghost-body"
              dir="ltr"
            >
              920007515
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
