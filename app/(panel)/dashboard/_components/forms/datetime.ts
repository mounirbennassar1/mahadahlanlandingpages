/** datetime-local ("YYYY-MM-DDTHH:mm", browser local time) ⇄ ISO 8601 helpers. */

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function isoToLocalInput(iso: string | Date | null | undefined) {
  if (!iso) return "";
  const d = iso instanceof Date ? iso : new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function localInputToIso(local: string) {
  if (!local) return "";
  const d = new Date(local);
  return Number.isNaN(d.getTime()) ? "" : d.toISOString();
}
