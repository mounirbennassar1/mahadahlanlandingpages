import { NextRequest } from "next/server";

export const runtime = "nodejs";

/**
 * Shared lead-ingestion proxy.
 *
 * All landing pages POST here with `{ fullName, phone, city, source }`. We
 * forward to the existing dashboard's ingest endpoint at
 * `${LEAD_PANEL_URL}/api/leads` with `Authorization: Bearer ${LEAD_API_KEY}`.
 * The dashboard owns the database and validation.
 */
export async function POST(request: NextRequest) {
  const apiKey = process.env.LEAD_API_KEY;
  const panelUrl = process.env.LEAD_PANEL_URL;

  if (!apiKey || !panelUrl) {
    return Response.json(
      { error: "Lead API is not configured on the server." },
      { status: 500 },
    );
  }

  let payload: {
    fullName?: unknown;
    phone?: unknown;
    city?: unknown;
    source?: unknown;
  };
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const fullName =
    typeof payload.fullName === "string" ? payload.fullName.trim() : "";
  const phone = typeof payload.phone === "string" ? payload.phone.trim() : "";
  const city = typeof payload.city === "string" ? payload.city.trim() : "";
  const source =
    typeof payload.source === "string" && payload.source.trim()
      ? payload.source.trim()
      : "unknown";

  if (!fullName || !phone || !city) {
    return Response.json(
      { error: "الرجاء تعبئة الاسم الكامل ورقم الجوال والمدينة." },
      { status: 400 },
    );
  }

  try {
    const upstream = await fetch(
      `${panelUrl.replace(/\/+$/, "")}/api/leads`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${apiKey}`,
          "X-API-Key": apiKey,
        },
        body: JSON.stringify({ fullName, phone, city, source }),
        cache: "no-store",
      },
    );

    const text = await upstream.text();
    const data = text ? safeParse(text) : null;

    if (!upstream.ok) {
      return Response.json(
        {
          error: "تعذّر إرسال طلبكِ، حاولي مرة أخرى لاحقاً.",
          status: upstream.status,
          detail: data ?? text,
        },
        { status: 502 },
      );
    }

    return Response.json({ success: true, data });
  } catch (err) {
    return Response.json(
      {
        error: "تعذّر الاتصال بالخادم. تحققي من اتصالكِ بالإنترنت.",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 502 },
    );
  }
}

function safeParse(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
