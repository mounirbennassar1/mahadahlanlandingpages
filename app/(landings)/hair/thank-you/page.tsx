import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "شكراً لك - عيادة مها دهلان",
  description: "تم استلام طلبك بنجاح، سنتواصل معك قريباً",
};

export default function HairThankYouPage() {
  return (
    <main className="min-h-screen bg-[#f9f7f2] text-[#1a3a2a] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-xl">
        <div className="bg-white rounded-[2.5rem] border border-[#1a3a2a]/10 shadow-2xl shadow-[#1a3a2a]/10 p-8 md:p-12 text-center">
          <div className="mx-auto mb-8 size-20 rounded-full bg-[#c9a84c]/15 border border-[#c9a84c]/30 flex items-center justify-center">
            <span
              className="material-symbols-outlined text-[#c9a84c]"
              style={{ fontSize: 48 }}
            >
              check_circle
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-[#1a3a2a] mb-4 leading-tight">
            تم استلام طلبك بنجاح
          </h1>

          <p className="text-slate-600 leading-relaxed mb-8">
            شكراً لتواصلك مع عيادة د. مها دهلان. فريقنا الطبي سيقوم بالتواصل
            معك خلال أقرب وقت لتأكيد موعد استشارتك.
          </p>

          <div className="bg-[#f9f7f2] border border-[#1a3a2a]/10 rounded-2xl p-5 mb-8 text-right">
            <h4 className="font-bold text-[#1a3a2a] mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#c9a84c]">
                info
              </span>
              الخطوات التالية
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex gap-2 items-start">
                <span className="material-symbols-outlined text-[#c9a84c] text-base shrink-0 mt-0.5">
                  call
                </span>
                سيتصل بك أحد مستشارينا لتحديد موعد يناسبك
              </li>
              <li className="flex gap-2 items-start">
                <span className="material-symbols-outlined text-[#c9a84c] text-base shrink-0 mt-0.5">
                  schedule
                </span>
                موعد الاستشارة خلال 24 ساعة عمل
              </li>
              <li className="flex gap-2 items-start">
                <span className="material-symbols-outlined text-[#c9a84c] text-base shrink-0 mt-0.5">
                  location_on
                </span>
                جدة - حي الروضة، مركز بن حمران - الدور الثالث
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/hair"
              className="inline-flex items-center justify-center gap-2 bg-[#1a3a2a] text-[#c9a84c] px-6 py-3 rounded-xl font-bold border border-[#c9a84c]/30 hover:bg-[#1a3a2a]/90 transition-colors"
            >
              <span className="material-symbols-outlined">home</span>
              العودة للصفحة الرئيسية
            </Link>
            <a
              href="tel:+966920007515"
              className="inline-flex items-center justify-center gap-2 border border-[#1a3a2a]/15 text-[#1a3a2a] px-6 py-3 rounded-xl font-bold hover:bg-[#1a3a2a]/5 transition-colors"
              dir="ltr"
            >
              <span className="material-symbols-outlined">call</span>
              920007515
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
