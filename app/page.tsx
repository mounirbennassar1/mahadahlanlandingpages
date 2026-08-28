import type { Metadata } from "next";
import { HomePage } from "./_home/HomePage";

export const metadata: Metadata = {
  title: {
    absolute: "عيادات د. مها دحلان | تجربة طبية تجميلية فاخرة في جدة",
  },
  description:
    "عيادات د. مها دحلان في جدة: البوتوكس والفيلر، شد الرقبة، الجلاس سكين الكوري، علاج التصبّغات وحب الشباب، نحت الجسم وعلاج تساقط الشعر. بإشراف نخبة الاستشاريين وطاقم نسائي بالكامل.",
  alternates: { canonical: "/", languages: { ar: "/", en: "/en" } },
};

export default function Home() {
  return <HomePage locale="ar" />;
}
