"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Overview / Content / Leads / Packages / Orders switcher for one page. */
export function PageTabs({
  slug,
  hasLeads,
  hasPackages = false,
  hasOrders = false,
}: {
  slug: string;
  hasLeads: boolean;
  /** Landings sell packages through their pay button. */
  hasPackages?: boolean;
  /** Pages with a pay button (landings and /offers) list their orders. */
  hasOrders?: boolean;
}) {
  const pathname = usePathname();
  const base = `/dashboard/pages/${slug}`;
  const tabs = [
    { href: base, label: "Overview" },
    { href: `${base}/content`, label: "Content" },
    ...(hasLeads ? [{ href: `${base}/leads`, label: "Leads" }] : []),
    ...(hasPackages ? [{ href: `${base}/packages`, label: "Packages" }] : []),
    ...(hasOrders ? [{ href: `${base}/orders`, label: "Orders" }] : []),
  ];

  return (
    <div
      style={{
        display: "flex",
        gap: 4,
        borderBottom: "1px solid var(--hairline)",
        marginBottom: 22,
      }}
    >
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            style={{
              padding: "9px 14px",
              fontSize: 13.5,
              fontWeight: 600,
              color: active ? "var(--primary)" : "var(--ink-3)",
              borderBottom: `2px solid ${active ? "var(--primary)" : "transparent"}`,
              marginBottom: -1,
            }}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
