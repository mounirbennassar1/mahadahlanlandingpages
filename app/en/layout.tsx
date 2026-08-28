import { Plus_Jakarta_Sans } from "next/font/google";
import { LocaleProvider } from "@/app/_home/i18n/LocaleProvider";

/* Almarai (the site face) is Arabic-only, so the English tree brings its own
   Latin face. Variable font: every weight the page uses (300..800) is covered. */
const latin = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-en",
  display: "swap",
});

/**
 * English tree. The root layout is `<html lang="ar" dir="rtl">` and cannot be
 * changed per route, so direction and language are forced here on a wrapper
 * (same trick as the admin panel). `flex-1 flex-col` keeps the page filling
 * the flex body exactly as it does without the wrapper.
 */
export default function EnglishLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LocaleProvider locale="en">
      <div dir="ltr" lang="en" className={`${latin.variable} flex flex-1 flex-col`}>
        {children}
      </div>
    </LocaleProvider>
  );
}
