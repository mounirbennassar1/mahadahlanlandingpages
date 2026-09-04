import { SiteShell } from "@/app/_home/SiteShell";
import { getHomeDict, getSpecialtyCopy } from "@/lib/pages/home";

/**
 * Public website pages (about, offers, doctors, devices, booking, blog).
 * The landings under `(landings)` and the home page keep their own chrome.
 *
 * The header, top bar and footer copy comes from the Arabic home dictionary,
 * so this layout loads the merged version and edits made in
 * /dashboard/pages/home-ar show up across the whole site.
 */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [dict, specialties] = await Promise.all([
    getHomeDict("ar"),
    getSpecialtyCopy("ar"),
  ]);
  return (
    <SiteShell dict={dict} specialties={specialties}>
      {children}
    </SiteShell>
  );
}
