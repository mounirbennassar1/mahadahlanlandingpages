import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashApiKey } from "@/lib/api-key";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Unified lead-ingest endpoint.
 *
 * Two ways to identify the source:
 *   1. External clients send an `x-api-key` header (issued via /dashboard/sources).
 *      The source is derived from the key's sha256 hash.
 *   2. Same-origin clients (our landings) send `source: "<slug>"` in the JSON
 *      body. The source is looked up by slug.
 *
 * In both cases the body must be `{ fullName, phone, city }`.
 */
const BodySchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(5).max(32),
  city: z.string().trim().min(2).max(80),
  source: z.string().trim().min(1).max(64).optional(),
  // Optional UTM attribution captured from the landing page's URL params.
  utmSource: z.string().trim().max(64).optional(),
  utmMedium: z.string().trim().max(64).optional(),
  utmCampaign: z.string().trim().max(120).optional(),
  utmContent: z.string().trim().max(120).optional(),
  utmTerm: z.string().trim().max(120).optional(),
});

const ALLOWED_ORIGINS = (process.env.LANDING_ORIGINS ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

function corsHeaders(origin: string | null): Record<string, string> {
  const allow =
    origin && (ALLOWED_ORIGINS.length === 0 || ALLOWED_ORIGINS.includes(origin))
      ? origin
      : ALLOWED_ORIGINS[0] ?? "*";
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-api-key",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(req.headers.get("origin")),
  });
}

export async function POST(req: NextRequest) {
  const cors = corsHeaders(req.headers.get("origin"));

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400, headers: cors });
  }

  const parsed = BodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 400, headers: cors },
    );
  }

  // Resolve source — either by API key (external) or by slug (same-origin).
  const apiKey = req.headers.get("x-api-key");
  let source:
    | Awaited<ReturnType<typeof prisma.leadSource.findUnique>>
    | null = null;

  if (apiKey) {
    source = await prisma.leadSource.findUnique({
      where: { apiKeyHash: hashApiKey(apiKey) },
    });
  } else if (parsed.data.source) {
    source = await prisma.leadSource.findUnique({
      where: { slug: parsed.data.source },
    });
  }

  if (!source || !source.active) {
    return NextResponse.json(
      { error: "Unknown or inactive source." },
      { status: 401, headers: cors },
    );
  }

  const lead = await prisma.lead.create({
    data: {
      fullName: parsed.data.fullName,
      phone: parsed.data.phone,
      city: parsed.data.city,
      sourceId: source.id,
      utmSource: parsed.data.utmSource || null,
      utmMedium: parsed.data.utmMedium || null,
      utmCampaign: parsed.data.utmCampaign || null,
      utmContent: parsed.data.utmContent || null,
      utmTerm: parsed.data.utmTerm || null,
    },
    select: { id: true, submittedAt: true },
  });

  return NextResponse.json(
    { ok: true, id: lead.id, submittedAt: lead.submittedAt, source: source.slug },
    { status: 201, headers: cors },
  );
}
