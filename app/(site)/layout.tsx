import { SiteShell } from "@/app/_home/SiteShell";

/**
 * Public website pages (about, offers, doctors, devices, booking, blog).
 * The landings under `(landings)` and the home page keep their own chrome.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell>{children}</SiteShell>;
}
