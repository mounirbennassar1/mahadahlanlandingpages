/**
 * FormData coercion helpers. Every field is optional on the wire; schemas in
 * ./schemas.ts decide what is required.
 */

export function text(fd: FormData, name: string) {
  const v = fd.get(name);
  return typeof v === "string" ? v.trim() : "";
}

/** Empty string → null. */
export function optText(fd: FormData, name: string) {
  const v = text(fd, name);
  return v === "" ? null : v;
}

export function bool(fd: FormData, name: string) {
  const v = fd.get(name);
  return v === "on" || v === "true" || v === "1";
}

/** Empty → null; anything else → number (NaN is left for zod to reject). */
export function int(fd: FormData, name: string): number | null {
  const v = text(fd, name);
  if (v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : Number.NaN;
}

/** ISO string from DateTimeInput's hidden field → Date, empty → null. */
export function dateTime(fd: FormData, name: string): Date | null {
  const v = text(fd, name);
  if (v === "") return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** ListInput submits JSON (`["a","b"]`); also accepts newline-separated text. */
export function list(fd: FormData, name: string): string[] {
  const raw = text(fd, name);
  if (raw === "") return [];
  if (raw.startsWith("[")) {
    try {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map((x) => String(x).trim()).filter(Boolean);
      }
    } catch {
      /* fall through to newline parsing */
    }
  }
  return raw
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}
