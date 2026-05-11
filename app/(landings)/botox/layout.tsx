import type { Metadata } from "next";
import "./landing.css";

export const metadata: Metadata = {
  title: "عيادة مها دحلان | البوتوكس والفيلر",
  description:
    "عيادة مها دحلان لتجميل الوجه — بوتوكس، فيلر جلدي، وتجديد البشرة بأيدي خبراء معتمدين.",
  openGraph: {
    title: "عيادة مها دحلان | البوتوكس والفيلر",
    description:
      "بوتوكس، فيلر جلدي، وتجديد البشرة بأيدي خبراء معتمدين — احجزي استشارتك في عيادات د. مها دحلان.",
    locale: "ar_SA",
    type: "website",
    siteName: "عيادات د. مها دحلان",
    images: [
      {
        url: "/botox/hero_section_botox.png",
        width: 1200,
        height: 630,
        alt: "عيادات د. مها دحلان — البوتوكس والفيلر",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "عيادة مها دحلان | البوتوكس والفيلر",
    description:
      "بوتوكس، فيلر جلدي، وتجديد البشرة بأيدي خبراء معتمدين في جدة.",
    images: ["/botox/hero_section_botox.png"],
  },
};

export default function BotoxLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="botox-landing">{children}</div>;
}
