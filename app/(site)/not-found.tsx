import type { Metadata } from "next";
import { NotFoundView } from "./_components/NotFoundView";

export const metadata: Metadata = {
  title: "الصفحة غير موجودة",
  robots: { index: false, follow: false },
};

export default function SiteNotFound() {
  return <NotFoundView />;
}
