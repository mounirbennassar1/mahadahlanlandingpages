import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatRelative } from "@/lib/status";
import { pageForSource } from "@/lib/pages/registry";
import { Card } from "@/app/(panel)/dashboard/_components/card";
import { PageHeader } from "@/app/(panel)/dashboard/_components/forms";
import { secondaryButtonStyle } from "@/app/(panel)/dashboard/_components/forms/styles";
import { DeleteButton } from "@/app/(panel)/dashboard/_components/forms/delete-button";
import { StatusPill } from "../status-pill";
import { AssigneePill } from "../assignee-pill";
import { extraEntries } from "../lead-details";
import { deleteLead } from "../actions";
import { NoteForm } from "./note-form";
import { Timeline } from "./timeline";

export const dynamic = "force-dynamic";

const PAYMENT_LABEL = {
  COD: "Cash at clinic",
  TAMARA: "Tamara",
  TABBY: "Tabby",
  CARD: "Card",
} as const;

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { id } = await params;
  const [lead, users] = await Promise.all([
    prisma.lead.findUnique({
      where: { id },
      include: {
        source: true,
        assignee: true,
        offer: { select: { title: true } },
        activities: {
          orderBy: { createdAt: "desc" },
          include: { user: { select: { name: true } } },
        },
      },
    }),
    prisma.user.findMany({ select: { id: true, name: true, avatarHue: true } }),
  ]);

  if (!lead) notFound();

  const page = pageForSource(lead.source.slug);
  const rel = formatRelative(lead.submittedAt);
  const labels = Object.fromEntries((page?.formFields ?? []).map((f) => [f.key, f.label]));
  const extras = extraEntries(lead.data, labels);

  // Every lead has a submission; older rows predate the activity log.
  const timeline = [
    ...lead.activities,
    ...(lead.activities.some((a) => a.type === "CREATED")
      ? []
      : [
          {
            id: `synthetic-${lead.id}`,
            type: "CREATED" as const,
            body: null,
            meta: null,
            createdAt: lead.submittedAt,
            user: null,
          },
        ]),
  ];

  return (
    <div>
      <PageHeader
        title={<span dir="auto" style={{ unicodeBidi: "plaintext" }}>{lead.fullName}</span>}
        subtitle={
          <span style={{ display: "inline-flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <code style={{ fontFamily: "var(--font-data)" }}>
              #LD-{lead.id.slice(-6).toUpperCase()}
            </code>
            <span>
              {rel.when} · {rel.time}
            </span>
            {page ? (
              <Link href={`/dashboard/pages/${page.slug}/leads`} className="fk-link">
                {page.title}
              </Link>
            ) : (
              <Link href={`/dashboard/leads?source=${lead.source.slug}`} className="fk-link">
                {lead.source.label}
              </Link>
            )}
          </span>
        }
        right={
          <>
            <Link href="/dashboard/leads" className="fk-btn" style={secondaryButtonStyle}>
              Back to leads
            </Link>
            {session.user.role === "ADMIN" && (
              <DeleteButton
                action={deleteLead}
                id={lead.id}
                redirectTo="/dashboard/leads"
                warning="Delete this lead and its history permanently?"
              />
            )}
          </>
        }
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) 380px",
          gap: 20,
          alignItems: "start",
        }}
      >
        <div style={{ display: "grid", gap: 20, minWidth: 0 }}>
          <Card title="Contact">
            <dl style={dlStyle}>
              <Row label="Phone">
                <a href={`tel:${lead.phone}`} style={dataLink}>
                  {lead.phone}
                </a>
              </Row>
              <Row label="WhatsApp">
                <a
                  href={`https://wa.me/${lead.phone.replace(/[^\d]/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  style={dataLink}
                >
                  Open chat ↗
                </a>
              </Row>
              <Row label="City">
                <Ar>{lead.city}</Ar>
              </Row>
              {lead.email && (
                <Row label="Email">
                  <a href={`mailto:${lead.email}`} style={dataLink}>
                    {lead.email}
                  </a>
                </Row>
              )}
            </dl>
          </Card>

          <Card title="Submission">
            <dl style={dlStyle}>
              <Row label="Page">
                <Ar>{page?.title ?? lead.source.label}</Ar>
              </Row>
              {lead.service && (
                <Row label="Service">
                  <Ar>{lead.service}</Ar>
                </Row>
              )}
              {lead.offer && (
                <Row label="Offer">
                  <Ar>{lead.offer.title}</Ar>
                </Row>
              )}
              {lead.preferredAt && (
                <Row label="Preferred time">
                  <span style={{ fontFamily: "var(--font-data)" }}>
                    {lead.preferredAt.toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </Row>
              )}
              {lead.paymentMethod && (
                <Row label="Payment">{PAYMENT_LABEL[lead.paymentMethod]}</Row>
              )}
              {extras.map((extra) => (
                <Row key={extra.key} label={extra.label}>
                  <Ar>{extra.value}</Ar>
                </Row>
              ))}
              {lead.message && (
                <Row label="Message">
                  <Ar>{lead.message}</Ar>
                </Row>
              )}
            </dl>
          </Card>

          {(lead.utmSource || lead.utmMedium || lead.utmCampaign) && (
            <Card title="Campaign">
              <dl style={dlStyle}>
                {lead.utmSource && <Row label="Source">{lead.utmSource}</Row>}
                {lead.utmMedium && <Row label="Medium">{lead.utmMedium}</Row>}
                {lead.utmCampaign && <Row label="Campaign">{lead.utmCampaign}</Row>}
                {lead.utmContent && <Row label="Content">{lead.utmContent}</Row>}
                {lead.utmTerm && <Row label="Term">{lead.utmTerm}</Row>}
              </dl>
            </Card>
          )}
        </div>

        <div style={{ display: "grid", gap: 20 }}>
          <Card title="Status">
            <div style={{ display: "grid", gap: 14 }}>
              <div>
                <div style={labelStyle}>Pipeline</div>
                <StatusPill leadId={lead.id} status={lead.status} />
              </div>
              <div>
                <div style={labelStyle}>Assigned to</div>
                <AssigneePill
                  leadId={lead.id}
                  assignee={
                    lead.assignee
                      ? {
                          id: lead.assignee.id,
                          name: lead.assignee.name,
                          avatarHue: lead.assignee.avatarHue,
                        }
                      : null
                  }
                  users={users}
                />
              </div>
            </div>
          </Card>

          <Card title="Add a note">
            <NoteForm leadId={lead.id} />
          </Card>

          <Card title="History" subtitle={`${lead.notesCount} note${lead.notesCount === 1 ? "" : "s"}`}>
            <Timeline rows={timeline} sourceLabel={page?.title ?? lead.source.label} />
          </Card>
        </div>
      </div>
    </div>
  );
}

const dlStyle: React.CSSProperties = {
  margin: 0,
  display: "grid",
  gridTemplateColumns: "auto minmax(0, 1fr)",
  columnGap: 16,
  rowGap: 10,
  fontSize: 13.5,
};

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: "var(--ink-4)",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  marginBottom: 6,
};

const dataLink: React.CSSProperties = {
  fontFamily: "var(--font-data)",
  color: "var(--primary)",
};

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <>
      <dt
        style={{
          color: "var(--ink-4)",
          fontWeight: 600,
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          alignSelf: "start",
          paddingTop: 3,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </dt>
      <dd style={{ margin: 0, color: "var(--ink-2)", overflowWrap: "anywhere" }}>{children}</dd>
    </>
  );
}

function Ar({ children }: { children: React.ReactNode }) {
  return (
    <span
      dir="auto"
      style={{ fontFamily: "var(--font-display), system-ui, sans-serif", unicodeBidi: "plaintext" }}
    >
      {children}
    </span>
  );
}
