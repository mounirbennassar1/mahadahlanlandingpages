import { auth } from "@/auth";
import { getNoonConfig, getNoonPublicKeyInfo } from "@/lib/noon";
import { SITE_URL } from "@/lib/site";
import { Card } from "../_components/card";
import { Pill } from "../content/_components/table";

export const dynamic = "force-dynamic";

const code: React.CSSProperties = { background: "var(--surface-2)", padding: "2px 6px", borderRadius: 5, fontFamily: "var(--font-data)" };

export default async function SettingsPage() {
  const session = await auth();
  const noon = getNoonConfig();
  const publicKey = getNoonPublicKeyInfo();

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 700, letterSpacing: "-0.025em", margin: 0 }}>
          Settings
        </h1>
        <div style={{ fontSize: 14, color: "var(--ink-3)", marginTop: 6 }}>
          Signed in as <b style={{ color: "var(--ink)" }}>{session?.user.email}</b> · {session?.user.role}
        </div>
      </div>

      <div style={{ display: "grid", gap: 20, maxWidth: 720 }}>
        <Card
          title="Online payments (noon)"
          subtitle="Read from the server environment; values are never shown here."
          right={
            <Pill tone={noon.configured ? (noon.env === "live" ? "green" : "amber") : "red"}>
              {noon.configured ? `${noon.env === "live" ? "Live" : "Test"} mode` : "Not configured"}
            </Pill>
          }
        >
          <dl style={{ margin: 0, display: "grid", gridTemplateColumns: "auto minmax(0, 1fr)", columnGap: 16, rowGap: 10, fontSize: 13.5 }}>
            <Row label="Business id">{noon.businessId ? <Ok>set</Ok> : <Missing>NOON_BUSINESS_ID</Missing>}</Row>
            <Row label="Application id">{noon.appId ? <Ok>set</Ok> : <Missing>NOON_APP_ID</Missing>}</Row>
            <Row label="Application key">{noon.appKey ? <Ok>set</Ok> : <Missing>NOON_APP_KEY</Missing>}</Row>
            <Row label="Environment">
              <code style={code}>NOON_ENV={noon.env}</code>
              <span style={{ color: "var(--ink-4)", marginLeft: 8 }}>{noon.env === "live" ? "charges real cards" : "sandbox, test cards only"}</span>
            </Row>
            <Row label="Region">
              <code style={code}>NOON_REGION={noon.region}</code>
              <span style={{ color: "var(--ink-4)", marginLeft: 8 }}>{new URL(noon.baseUrl).host}</span>
            </Row>
            <Row label="Order category">
              <code style={code}>{noon.category}</code>
            </Row>
            <Row label="Webhook secret">{noon.webhookSecret ? <Ok>signatures verified</Ok> : <span style={{ color: "var(--amber)" }}>not set, webhooks still re-read the order from noon</span>}</Row>
            <Row label="Public key">
              {!publicKey.present ? (
                <span style={{ color: "var(--ink-4)" }}>not set (optional)</span>
              ) : publicKey.valid ? (
                <Ok>
                  set · RSA {publicKey.bits}-bit, exponent {publicKey.exponent}
                </Ok>
              ) : (
                <span style={{ color: "var(--red)", fontWeight: 600 }}>set but unreadable: {publicKey.error}</span>
              )}
              <div style={{ fontSize: 12, color: "var(--ink-4)", marginTop: 4 }}>
                Encryption key from the noon portal. The hosted checkout does not use it; payments still need the three values above.
              </div>
            </Row>
            <Row label="Webhook URL">
              <code style={code}>{SITE_URL}/api/noon/webhook</code>
              <div style={{ fontSize: 12, color: "var(--ink-4)", marginTop: 4 }}>Paste this in the noon dashboard under the application&apos;s webhook settings.</div>
            </Row>
            <Row label="Return URL">
              <code style={code}>{SITE_URL}/checkout/&lt;reference&gt;</code>
              <div style={{ fontSize: 12, color: "var(--ink-4)", marginTop: 4 }}>Sent with every order; add the domain to the allowed return URLs in noon if it asks for one.</div>
            </Row>
          </dl>
          {!noon.configured && (
            <div style={{ marginTop: 16, padding: "10px 14px", borderRadius: 10, background: "var(--amber-soft)", color: "var(--amber)", fontSize: 13, fontWeight: 500 }}>
              Until the three NOON_* variables are set, the pay buttons still collect the visitor&apos;s details as a lead and then point them to WhatsApp.
            </div>
          )}
        </Card>

        <Card title="Lead integration">
          <p style={{ fontSize: 13.5, color: "var(--ink-2)", margin: 0, marginBottom: 12 }}>
            Each landing page posts leads to <code style={code}>POST /api/leads</code> with an
            <code style={{ ...code, marginLeft: 4 }}>x-api-key</code> header.
          </p>
          <pre style={{ margin: 0, padding: 14, background: "var(--surface-2)", border: "1px solid var(--hairline)", borderRadius: 10, fontSize: 12.5, fontFamily: "var(--font-data)", overflowX: "auto", color: "var(--ink-2)" }}>{`fetch("https://mahadahlan.com/api/leads", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": process.env.LEAD_API_KEY,
  },
  body: JSON.stringify({
    fullName: "Fatima Al-Zahra",
    phone: "+966 50 128 4471",
    city: "Riyadh",
  }),
});`}</pre>
        </Card>
      </div>
    </>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <>
      <dt style={{ color: "var(--ink-4)", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", alignSelf: "start", paddingTop: 3, whiteSpace: "nowrap" }}>{label}</dt>
      <dd style={{ margin: 0, color: "var(--ink-2)", overflowWrap: "anywhere" }}>{children}</dd>
    </>
  );
}

function Ok({ children }: { children: React.ReactNode }) {
  return <span style={{ color: "var(--green)", fontWeight: 600 }}>{children}</span>;
}

function Missing({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ color: "var(--red)", fontWeight: 600 }}>
      missing <code style={code}>{children}</code>
    </span>
  );
}
