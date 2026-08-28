import type { Metadata } from "next";
import { SiteShell } from "@/app/_home/SiteShell";
import { NotFoundView } from "@/app/(site)/_components/NotFoundView";

export const metadata: Metadata = {
  title: "الصفحة غير موجودة",
  robots: { index: false, follow: false },
};

/** Root 404 (any URL outside a route group). Rendered inside the site chrome. */
export default function RootNotFound() {
  return (
    <SiteShell>
      <NotFoundView />
    </SiteShell>
  );
}
