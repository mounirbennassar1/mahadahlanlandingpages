import type { Metadata } from "next";
import { cairo, plexArabic } from "@/lib/fonts";
import "@/lib/fa-config";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Maha Dahlan — Landing Pages",
  description: "Centralized landing pages for Maha Dahlan campaigns.",
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
