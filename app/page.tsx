import Link from "next/link";
import { Icon } from "@/components/icons";

type Landing = {
  slug: string;
  title: string;
  description: string;
};

const LANDINGS: Landing[] = [
  {
    slug: "acne",
    title: "علاج حب الشباب وآثاره",
    description:
      "الخيار الأول في جدة لعلاج حب الشباب وآثاره — أحدث أجهزة الليزر وبإشراف نخبة استشاريي الجلدية.",
  },
  {
    slug: "botox",
    title: "البوتوكس والفيلر",
    description:
      "عيادة مها دحلان لتجميل الوجه — بوتوكس، فيلر جلدي، وعلاجات الإشراقة بأيدي خبراء معتمدين.",
  },
  {
    slug: "dark-circles",
    title: "علاج الهالات والتصبّغات حول العين",
    description:
      "برنامج طبي متخصص في علاج الهالات السوداء والتصبّغات حول العين بأحدث التقنيات في جدة.",
  },
  {
    slug: "facial",
    title: "العناية بالبشرة والهايدرافيشل",
    description:
      "باقة متكاملة من جلسات تنظيف البشرة والهايدرافيشل وعلاج تساقط الشعر — MD Clinics.",
  },
  {
    slug: "hair",
    title: "علاج تساقط الشعر",
    description:
      "حلول طبية متكاملة لعلاج تساقط الشعر — Regenera Evo، PRP، الميزوثيرابي، Exosome وغيرها.",
  },
  {
    slug: "hyperpigmentation",
    title: "علاج التصبّغات",
    description:
      "برنامج علاج التصبّغات في مهادهلان — جلسات هادئة، خطة شخصية، ونتائج موثّقة.",
  },
  {
    slug: "stretchmarks",
    title: "علاج التشققات وعلامات التمدد",
    description:
      "الفيلر الهجين المحفّز للكولاجين وفيلر الكالسيوم — حلول طبية لتشققات الحمل وعلامات التمدد.",
  },
  {
    slug: "body",
    title: "نحت الجسم بتقنية التحفيز العضلي",
    description:
      "تجربة HIFEM لنحت الجسم وتفعيل العضلات بدون جراحة — تجربة طبية فاخرة في عيادات د. مها دحلان.",
  },
  {
    slug: "sample",
    title: "نموذج صفحة هبوط",
    description: "صفحة مرجعية تستخدم Framer Motion و GSAP و Lenis مع دعم العربية.",
  },
  // Add a new entry here for every landing under app/(landings)/<slug>.
];

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 py-20">
      <header className="flex flex-col gap-3">
        <span className="text-sm uppercase tracking-[0.3em] text-zinc-500">
          مها دحلان
        </span>
        <h1 className="font-display text-4xl font-bold sm:text-5xl">
          صفحات الهبوط المركزية
        </h1>
        <p className="max-w-xl text-zinc-600 dark:text-zinc-400">
          جميع صفحات الهبوط في مشروع واحد، قاعدة بيانات واحدة، ونشر واحد. أضف صفحة
          جديدة عبر إنشاء مجلد داخل <code>app/(landings)/</code>.
        </p>
      </header>

      <ul className="flex flex-col gap-3">
        {LANDINGS.map((landing) => (
          <li key={landing.slug}>
            <Link
              href={`/${landing.slug}`}
              className="group flex items-center justify-between gap-4 rounded-xl border border-zinc-200 px-5 py-4 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
            >
              <div className="flex flex-col">
                <span className="text-lg font-semibold">{landing.title}</span>
                <span className="text-sm text-zinc-500">
                  {landing.description}
                </span>
              </div>
              <Icon.ArrowLeft className="size-5 transition-transform group-hover:-translate-x-1" />
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
