import { NextRequest } from "next/server";

export const runtime = "nodejs";

/**
 * Shared lead-ingestion proxy.
 *
 * Each landing POSTs here with `{ fullName, phone, city, source }`. We look
 * up the per-source API key in the env (`LEAD_API_KEY_<UPPER_SLUG>`) and
 * forward to the dashboard's ingest endpoint. The dashboard derives the
 * source from the API key, so the body is just the lead fields.
 *
 *   slug: "dark-circles"  →  env: LEAD_API_KEY_DARK_CIRCLES
 *   slug: "hyperpigmentation"  →  env: LEAD_API_KEY_HYPERPIGMENTATION
 */
export async function POST(request: NextRequest) {
  const panelUrl = process.env.LEAD_PANEL_URL;

  if (!panelUrl) {
    return Response.json(
      { error: "Lead panel URL is not configured." },
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
    typeof payload.source === "string" ? payload.source.trim() : "";

  if (!fullName || !phone || !city) {
    return Response.json(
      { error: "الرجاء تعبئة الاسم الكامل ورقم الجوال والمدينة." },
      { status: 400 },
    );
  }
  if (!source) {
    return Response.json({ error: "Missing source." }, { status: 400 });
  }

  const apiKey = apiKeyForSource(source);
  if (!apiKey) {
    console.error(`[api/leads] No API key configured for source "${source}"`);
    return Response.json(
      { error: "Lead source is not configured on the server." },
      { status: 500 },
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
          "x-api-key": apiKey,
        },
        // dashboard derives source from key — body is just the lead fields
        body: JSON.stringify({ fullName, phone, city }),
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

function apiKeyForSource(source: string): string | undefined {
  const envName = `LEAD_API_KEY_${source.replace(/-/g, "_").toUpperCase()}`;
  return process.env[envName];
}

function safeParse(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
