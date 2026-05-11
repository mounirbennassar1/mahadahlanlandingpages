import type { Metadata } from "next";
import { cairo, plexArabic } from "@/lib/fonts";
import "@/lib/fa-config";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "./globals.css";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://mahadahlan.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "عيادات د. مها دحلان | Dr. Maha Dahlan Clinics",
    template: "%s | عيادات د. مها دحلان",
  },
  description:
    "عيادات د. مها دحلان — تجربة طبية تجميلية فاخرة في جدة. علاجات البشرة، الشعر، البوتوكس والفيلر، نحت الجسم، وأكثر بأحدث التقنيات وبإشراف نخبة من الاستشاريين.",
  applicationName: "عيادات د. مها دحلان",
  icons: {
    icon: [{ url: "/logo.png", type: "image/png" }],
    shortcut: ["/logo.png"],
    apple: [{ url: "/logo.png" }],
  },
  openGraph: {
    type: "website",
    locale: "ar_SA",
    siteName: "عيادات د. مها دحلان",
    title: "عيادات د. مها دحلان | Dr. Maha Dahlan Clinics",
    description:
      "عيادات د. مها دحلان — تجربة طبية تجميلية فاخرة في جدة. احجزي استشارتك اليوم.",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 800,
        alt: "شعار عيادات د. مها دحلان",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "عيادات د. مها دحلان | Dr. Maha Dahlan Clinics",
    description:
      "تجربة طبية تجميلية فاخرة في جدة — البشرة، الشعر، البوتوكس والفيلر، نحت الجسم، والمزيد.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${cairo.variable} ${plexArabic.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
