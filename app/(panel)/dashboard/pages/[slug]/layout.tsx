import { notFound } from "next/navigation";
import { PageHeader } from "@/app/(panel)/dashboard/_components/forms";
import { secondaryButtonStyle } from "@/app/(panel)/dashboard/_components/forms/styles";
import { Pill, SITE_URL } from "@/app/(panel)/dashboard/content/_components/table";
import { getPageDef } from "@/lib/pages/registry";
import { PageTabs } from "../_components/page-tabs";

export const dynamic = "force-dynamic";

const KIND_TONE = { home: "primary", site: "blue", landing: "green" } as const;

export default async function PageShell({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const def = getPageDef(slug);
  if (!def) notFound();

  return (
    <div>
      <PageHeader
        title={def.title}
        subtitle={
          <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
            <Pill tone={KIND_TONE[def.kind]}>{def.kind}</Pill>
            <code style={{ fontFamily: "var(--font-data)", fontSize: 12.5 }}>{def.path}</code>
          </span>
        }
        right={
          <a
            href={`${SITE_URL}${def.path}`}
            target="_blank"
            rel="noreferrer"
            className="fk-btn"
            style={secondaryButtonStyle}
          >
            View on site ↗
          </a>
        }
      />
      <PageTabs slug={def.slug} hasLeads={Boolean(def.leadSource)} />
      {children}
    </div>
  );
}
