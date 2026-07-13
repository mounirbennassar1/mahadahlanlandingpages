import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ensureConversionActionsForSource } from "@/lib/sources";
import { saveConversionAction } from "./actions";

export const dynamic = "force-dynamic";

const TYPE_LABEL = {
  WHATSAPP: "WhatsApp Click",
  FORM: "Form Submit",
} as const;

const TYPE_COLOR = {
  WHATSAPP: { bg: "var(--green-soft)", fg: "var(--green)" },
  FORM: { bg: "var(--blue-soft)", fg: "var(--blue)" },
} as const;

export default async function ConversionsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const isAdmin = session.user.role === "ADMIN";

  const sources = await prisma.leadSource.findMany({
    orderBy: { label: "asc" },
    include: { conversions: true },
  });

  // Self-heal: any source without conversion rows gets them backfilled here.
  // Covers landings created before the ConversionAction table existed.
  for (const s of sources) {
    if (s.conversions.length < 2) {
      await ensureConversionActionsForSource(s.id);
    }
  }

  const refreshed = await prisma.leadSource.findMany({
    orderBy: { label: "asc" },
    include: { conversions: true },
  });

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 700, letterSpacing: "-0.025em", margin: 0 }}>
          Google Ads Conversions
        </h1>
        <div style={{ fontSize: 14, color: "var(--ink-3)", marginTop: 6, lineHeight: 1.6 }}>
          Two conversion actions per landing — one fires on every WhatsApp
          click, the other on every form submit. Paste the snippet Google Ads
          gives you (it looks like <code style={{ background: "var(--surface-2)", padding: "2px 6px", borderRadius: 5, fontFamily: "var(--font-data)" }}>AW-1234567890/abcDEF</code>): the
          part before the slash is the Conversion ID, the part after is the
          Label.
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {refreshed.map((source) => {
          const byType = new Map(source.conversions.map((c) => [c.type, c]));
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
              </header>

              <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 13 }}>
                <thead>
                  <tr>
                    {["Event", "Conversion ID (AW-...)", "Label", "Active", ""].map((h, i) => (
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
                          width: i === 0 ? 160 : i === 3 ? 80 : i === 4 ? 110 : "auto",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(["WHATSAPP", "FORM"] as const).map((type) => {
                    const action = byType.get(type);
                    if (!action) return null;
                    const color = TYPE_COLOR[type];
                    return (
                      <tr key={type}>
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
                            {TYPE_LABEL[type]}
                          </span>
                        </td>
                        <td style={tdStyle} colSpan={isAdmin ? 1 : 2}>
                          <form
                            id={`f-${action.id}`}
                            action={saveConversionAction}
                            style={{ display: "contents" }}
                          >
                            <input type="hidden" name="id" value={action.id} />
                            {isAdmin ? (
                              <input
                                name="conversionId"
                                defaultValue={action.conversionId ?? ""}
                                placeholder="AW-1234567890"
                                style={inputStyle}
                              />
                            ) : (
                              <code
                                style={{
                                  fontFamily: "var(--font-data)",
                                  fontSize: 12,
                                  color: action.conversionId ? "var(--ink-2)" : "var(--ink-4)",
                                }}
                              >
                                {action.conversionId ?? "—"}
                              </code>
                            )}
                          </form>
                        </td>
                        {isAdmin && (
                          <td style={tdStyle}>
                            <input
                              form={`f-${action.id}`}
                              name="conversionLabel"
                              defaultValue={action.conversionLabel ?? ""}
                              placeholder="abcDEF123"
                              style={inputStyle}
                            />
                          </td>
                        )}
                        <td style={tdStyle}>
                          {isAdmin ? (
                            <label style={{ display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                              <input
                                form={`f-${action.id}`}
                                type="checkbox"
                                name="active"
                                defaultChecked={action.active}
                              />
                            </label>
                          ) : (
                            <span
                              style={{
                                fontSize: 11.5,
                                fontWeight: 600,
                                color: action.active ? "var(--green)" : "var(--slate)",
                              }}
                            >
                              {action.active ? "On" : "Off"}
                            </span>
                          )}
                        </td>
                        <td style={{ ...tdStyle, textAlign: "right" }}>
                          {isAdmin && (
                            <button
                              type="submit"
                              form={`f-${action.id}`}
                              style={{
                                padding: "6px 14px",
                                background: "var(--primary)",
                                color: "#fff",
                                border: "none",
                                borderRadius: 8,
                                fontSize: 12,
                                fontWeight: 600,
                                cursor: "pointer",
                              }}
                            >
                              Save
                            </button>
                          )}
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
        <strong style={{ color: "var(--primary)" }}>How it fires:</strong>{" "}
        The landing layout server-injects these IDs as{" "}
        <code style={{ background: "#fff", padding: "1px 5px", borderRadius: 4 }}>window.__mdConversions</code>. WhatsApp clicks are picked up by a delegated listener
        on every <code style={{ background: "#fff", padding: "1px 5px", borderRadius: 4 }}>a[href*=&quot;wa.me&quot;]</code>. Form
        success fires <code style={{ background: "#fff", padding: "1px 5px", borderRadius: 4 }}>fireConversion(&quot;form&quot;)</code>. Empty
        rows fire nothing — fill in a label only after you&apos;ve created
        the conversion action in Google Ads.
      </div>
    </>
  );
}

const tdStyle: React.CSSProperties = {
  padding: "10px 16px",
  borderBottom: "1px solid var(--hairline)",
  color: "var(--ink-2)",
  verticalAlign: "middle",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "6px 10px",
  border: "1px solid var(--hairline)",
  borderRadius: 6,
  fontFamily: "var(--font-data)",
  fontSize: 12.5,
  color: "var(--ink-2)",
  background: "#fff",
};
