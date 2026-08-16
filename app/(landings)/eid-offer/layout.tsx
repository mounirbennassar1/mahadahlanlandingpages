import type { Metadata } from "next";
import "./landing.css";

export const metadata: Metadata = {
  title: "عيادة مها دحلان | عرض عيد الأضحى — خصومات ذهبية",
  description:
    "احتفلوا بعيد الأضحى مع عيادة مها دحلان — خصومات تصل إلى ٤٠٪ على الهيدرافيشل، البوتوكس، الفيلر، علاج الهالات والتصبغات، الميكرونيدلينغ RF، علاجات الشعر وعلامات التمدد.",
  openGraph: {
    title: "عيادة مها دحلان | عرض عيد الأضحى",
    description:
      "خصومات ذهبية بمناسبة عيد الأضحى المبارك على باقة شاملة من خدمات التجميل والعناية بالبشرة في عيادة مها دحلان.",
    locale: "ar_SA",
    type: "website",
    siteName: "عيادات د. مها دحلان",
    images: [
      {
        url: "/eid-offer/hero.webp",
        width: 1200,
        height: 800,
        alt: "عرض عيد الأضحى — عيادة مها دحلان",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "عيادة مها دحلان | عرض عيد الأضحى",
    description:
      "خصومات ذهبية بمناسبة عيد الأضحى المبارك على خدمات التجميل في عيادة مها دحلان.",
    images: ["/eid-offer/hero.webp"],
  },
};

export default function EidOfferLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="eid-landing" dir="rtl" lang="ar">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&display=swap"
        rel="stylesheet"
      />
      {children}
    </div>
  );
}
