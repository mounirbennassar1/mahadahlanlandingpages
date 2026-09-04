import Link from "next/link";
import type { Lead, LeadSource, User } from "@prisma/client";
import { formatRelative } from "@/lib/status";
import { StatusPill } from "../status-pill";
import { AssigneePill } from "../assignee-pill";
import { LeadDetails, hasLeadDetails } from "../lead-details";

export type LeadRow = Lead & {
  source: LeadSource;
  assignee: User | null;
  offer: { title: string } | null;
};

function leadAvatarHue(name: string) {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) % 360;
  const hues = [295, 220, 155, 30, 330, 250, 120];
  return hues[h % hues.length];
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "·";
}

/**
 * The leads table, shared by /dashboard/leads and a page's Leads tab.
 * `compact` drops the columns that only make sense in the full view.
 */
export function LeadsTable({
  leads,
  users,
  compact = false,
  showSource = true,
}: {
  leads: LeadRow[];
  users: { id: string; name: string; avatarHue: number }[];
  compact?: boolean;
  showSource?: boolean;
}) {
  const columns = 4 + (showSource ? 1 : 0) + (compact ? 0 : 2);

  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 14 }}
      >
        <thead>
          <tr>
            <Th>Lead</Th>
            <Th>Phone</Th>
            {!compact && <Th>City</Th>}
            {showSource && <Th>Page</Th>}
            {!compact && <Th>Details</Th>}
            <Th>Status</Th>
            <Th>Assigned to</Th>
            <Th>Submitted</Th>
          </tr>
        </thead>
        <tbody>
          {leads.length === 0 && (
            <tr>
              <td
                colSpan={columns + 1}
                style={{ padding: 40, textAlign: "center", color: "var(--ink-3)" }}
              >
                No leads match the current filter.
              </td>
            </tr>
          )}
          {leads.map((lead) => {
            const hue = leadAvatarHue(lead.fullName);
            const rel = formatRelative(lead.submittedAt);
            return (
              <tr key={lead.id}>
                <Td>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        display: "grid",
                        placeItems: "center",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: 12,
                        fontFamily: "var(--font-display)",
                        flex: "none",
                        letterSpacing: "-0.01em",
                        background: `linear-gradient(135deg, oklch(0.72 0.12 ${hue}), oklch(0.5 0.15 ${hue}))`,
                      }}
                    >
                      {initials(lead.fullName)}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        minWidth: 0,
                        lineHeight: 1.2,
                      }}
                    >
                      <Link
                        href={`/dashboard/leads/${lead.id}`}
                        style={{ color: "var(--ink)", fontWeight: 600, fontSize: 14 }}
                        className="fk-link"
                      >
                        {lead.fullName}
                      </Link>
                      <span
                        style={{
                          fontSize: 12,
                          color: "var(--ink-3)",
                          fontFamily: "var(--font-data)",
                          marginTop: 2,
                        }}
                      >
                        #LD-{lead.id.slice(-6).toUpperCase()}
                      </span>
                    </div>
                  </div>
                </Td>
                <Td>
                  <span
                    style={{
                      fontFamily: "var(--font-data)",
                      fontVariantNumeric: "tabular-nums",
                      color: "var(--ink-2)",
                      fontSize: 13.5,
                    }}
                  >
                    {lead.phone}
                  </span>
                </Td>
                {!compact && (
                  <Td>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "5px 10px",
                        background: "var(--surface-2)",
                        border: "1px solid var(--hairline)",
                        borderRadius: 7,
                        fontSize: 12.5,
                        color: "var(--ink-2)",
                        fontWeight: 500,
                      }}
                    >
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ color: "var(--ink-4)" }}
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {lead.city}
                    </span>
                  </Td>
                )}
                {showSource && (
                  <Td>
                    <Link
                      href={`/dashboard/leads?source=${lead.source.slug}`}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        padding: "4px 10px",
                        background: "var(--primary-softer)",
                        color: "var(--primary)",
                        borderRadius: 999,
                        fontFamily: "var(--font-data)",
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      {lead.source.label}
                    </Link>
                    <span
                      style={{
                        display: "block",
                        fontFamily: "var(--font-data)",
                        fontSize: 11,
                        color: "var(--ink-4)",
                        marginTop: 4,
                      }}
                    >
                      {lead.source.slug}
                    </span>
                  </Td>
                )}
                {!compact && (
                  <Td>
                    {hasLeadDetails(lead) ? (
                      <LeadDetails data={lead} />
                    ) : (
                      <span style={{ color: "var(--ink-4)" }}>—</span>
                    )}
                  </Td>
                )}
                <Td>
                  <StatusPill leadId={lead.id} status={lead.status} />
                </Td>
                <Td>
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
                </Td>
                <Td>
                  <span
                    style={{
                      fontFamily: "var(--font-data)",
                      fontVariantNumeric: "tabular-nums",
                      fontSize: 13,
                      color: "var(--ink-2)",
                      display: "block",
                      lineHeight: 1.25,
                    }}
                  >
                    {rel.when}
                    <span style={{ color: "var(--ink-4)", fontSize: 12, display: "block" }}>
                      {rel.time}
                    </span>
                  </span>
                </Td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function Th({ children }: { children?: React.ReactNode }) {
  return (
    <th
      style={{
        textAlign: "left",
        padding: "12px 16px",
        fontSize: 11.5,
        fontWeight: 600,
        color: "var(--ink-3)",
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        background: "var(--surface-2)",
        borderBottom: "1px solid var(--hairline)",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </th>
  );
}

export function Td({ children }: { children?: React.ReactNode }) {
  return (
    <td
      style={{
        padding: "14px 16px",
        borderBottom: "1px solid var(--hairline)",
        verticalAlign: "middle",
        color: "var(--ink-2)",
      }}
    >
      {children}
    </td>
  );
}
