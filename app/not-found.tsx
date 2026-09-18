import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "الصفحة غير موجودة",
  robots: { index: false, follow: false },
};

/**
 * Only reachable in local dev: in production `proxy.ts` sends every path that
 * is not a landing to the website, so a 404 here means the URL is unknown on
 * both hosts.
 */
export default function RootNotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <p className="text-sm font-bold tracking-widest text-neutral-500">404</p>
      <h1 className="text-3xl font-extrabold">الصفحة غير موجودة</h1>
      <p className="max-w-md text-neutral-600">
        الرابط الذي وصلتِ إليه غير متاح. يمكنك زيارة موقع العيادة لاستعراض كل الخدمات والعروض.
      </p>
      <a
        href={SITE_URL}
        className="inline-flex items-center rounded-full bg-neutral-900 px-6 py-3 text-sm font-bold text-white"
      >
        الانتقال إلى موقع العيادة
      </a>
    </main>
  );
}
