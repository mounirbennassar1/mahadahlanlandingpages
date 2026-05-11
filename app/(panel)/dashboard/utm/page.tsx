import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import type { UtmPlatform } from "@prisma/client";
import { CopyButton } from "./copy-button";

export const dynamic = "force-dynamic";

const PLATFORM_LABEL: Record<UtmPlatform, string> = {
  GOOGLE_ADS: "Google Ads",
  INSTAGRAM: "Instagram",
  TIKTOK: "TikTok",
  X: "X (Twitter)",
  SNAPCHAT: "Snapchat",
};

const PLATFORM_ORDER: UtmPlatform[] = ["GOOGLE_ADS", "INSTAGRAM", "TIKTOK", "X", "SNAPCHAT"];

const PLATFORM_COLOR: Record<UtmPlatform, { bg: string; fg: string }> = {
  GOOGLE_ADS: { bg: "var(--blue-soft)", fg: "var(--blue)" },
  INSTAGRAM: { bg: "var(--red-soft)", fg: "var(--red)" },
  TIKTOK: { bg: "var(--slate-soft)", fg: "var(--slate)" },
  X: { bg: "var(--slate-soft)", fg: "var(--ink)" },
  SNAPCHAT: { bg: "var(--amber-soft)", fg: "var(--amber)" },
};

export default async function UtmPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const sources = await prisma.leadSource.findMany({
    orderBy: { label: "asc" },
    include: {
      utmLinks: true,
      _count: { select: { leads: true } },
    },
  });

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 700, letterSpacing: "-0.025em", margin: 0 }}>
          UTM Links
        </h1>
        <div style={{ fontSize: 14, color: "var(--ink-3)", marginTop: 6 }}>
          Pre-generated tracked URLs for every landing × ad platform. Copy and paste straight into your campaign destination.
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {sources.map((source) => {
          const byPlatform = new Map(source.utmLinks.map((l) => [l.platform, l]));
          return (
            <section
              key={source.id}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--hairline)",
                borderRadius: "var(--radius)",
                overflow: "hidden",
              }}
            >
              <header
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: "16px 20px",
                  background: "var(--surface-2)",
                  borderBottom: "1px solid var(--hairline)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                  <div
                    style={{
                      flex: "none",
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: source.active ? "var(--green)" : "var(--slate)",
                    }}
                  />
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 17,
                        fontWeight: 700,
                        color: "var(--ink)",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {source.label}
                    </div>
                    <code
                      style={{
                        fontFamily: "var(--font-data)",
                        fontSize: 12,
                        color: "var(--ink-3)",
                      }}
                    >
                      /{source.slug}
                    </code>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: 12,
                    color: "var(--ink-3)",
                    background: "var(--primary-softer)",
                    padding: "4px 10px",
                    borderRadius: 999,
                    fontWeight: 600,
                  }}
                >
                  {source._count.leads.toLocaleString("en-US")} leads
                </span>
              </header>

              <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 13 }}>
                <thead>
                  <tr>
                    {["Platform", "Tracked URL", ""].map((h, i) => (
                      <th
                        key={h || i}
                        style={{
                          textAlign: "left",
                          padding: "10px 16px",
                          fontSize: 11,
                          fontWeight: 600,
                          color: "var(--ink-4)",
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          borderBottom: "1px solid var(--hairline)",
                          width: i === 0 ? 160 : i === 2 ? 110 : "auto",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PLATFORM_ORDER.map((platform) => {
                    const link = byPlatform.get(platform);
                    const color = PLATFORM_COLOR[platform];
                    return (
                      <tr key={platform}>
                        <td style={tdStyle}>
                          <span
                            style={{
                              display: "inline-flex",
                              padding: "3px 10px",
                              borderRadius: 999,
                              fontSize: 11.5,
                              fontWeight: 600,
                              background: color.bg,
                              color: color.fg,
                            }}
                          >
                            {PLATFORM_LABEL[platform]}
                          </span>
                        </td>
                        <td style={tdStyle}>
                          {link ? (
                            <code
                              style={{
                                fontFamily: "var(--font-data)",
                                fontSize: 12,
                                color: "var(--ink-2)",
                                wordBreak: "break-all",
                                display: "block",
                              }}
                            >
                              {link.url}
                            </code>
                          ) : (
                            <span style={{ color: "var(--ink-4)", fontStyle: "italic" }}>
                              not seeded — re-run db:seed
                            </span>
                          )}
                        </td>
                        <td style={{ ...tdStyle, textAlign: "right" }}>
                          {link && <CopyButton value={link.url} />}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </section>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 24,
          padding: "14px 18px",
          background: "var(--primary-softer)",
          border: "1px solid var(--primary-soft)",
          borderRadius: 12,
          fontSize: 13,
          color: "var(--ink-2)",
          lineHeight: 1.6,
        }}
      >
        <strong style={{ color: "var(--primary)" }}>How attribution works:</strong> when someone
        clicks one of these URLs, the landing page reads <code style={{ background: "#fff", padding: "1px 5px", borderRadius: 4 }}>utm_source</code>, <code style={{ background: "#fff", padding: "1px 5px", borderRadius: 4 }}>utm_medium</code>, and <code style={{ background: "#fff", padding: "1px 5px", borderRadius: 4 }}>utm_campaign</code> from the URL and sends them along when the form is
        submitted. The lead will appear in <code style={{ background: "#fff", padding: "1px 5px", borderRadius: 4 }}>/dashboard/leads</code> tagged with the originating platform.
      </div>
    </>
  );
}

const tdStyle: React.CSSProperties = {
  padding: "12px 16px",
  borderBottom: "1px solid var(--hairline)",
  color: "var(--ink-2)",
  verticalAlign: "middle",
};
