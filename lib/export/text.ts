import { EXPORT_COLUMNS, formatRiyadh, type ExportMeta, type ExportRow } from "./leads";

/** RFC 4180: quote when the value holds a comma, quote or newline. */
function csvCell(value: string) {
  return /[",\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

/** The BOM makes Excel open the file as UTF-8, so Arabic names survive. */
export function toCsv(rows: ExportRow[]) {
  const lines = [EXPORT_COLUMNS.map((c) => csvCell(c.header)).join(",")];
  for (const row of rows) lines.push(EXPORT_COLUMNS.map((c) => csvCell(row[c.key])).join(","));
  return `﻿${lines.join("\r\n")}\r\n`;
}

/** Human-readable: a header, then one block per lead with only the filled fields. */
export function toTxt(rows: ExportRow[], meta: ExportMeta) {
  const rule = "=".repeat(48);
  const thin = "-".repeat(48);
  const out = [
    "MD Clinics · Leads export",
    `Exported ${formatRiyadh(meta.generatedAt)} (Riyadh) by ${meta.generatedBy}`,
    ...meta.filters.map((f) => `Filter: ${f}`),
    `Total: ${meta.total.toLocaleString("en-US")} leads${meta.truncated ? ` (newest ${rows.length.toLocaleString("en-US")} included)` : ""}`,
    rule,
  ];
  const labelWidth = Math.max(...EXPORT_COLUMNS.map((c) => c.header.length));
  for (const row of rows) {
    out.push("");
    out.push(`${row.ref} · ${row.submitted}`);
    for (const col of EXPORT_COLUMNS) {
      if (col.key === "ref" || col.key === "submitted" || !row[col.key]) continue;
      out.push(`${`${col.header}:`.padEnd(labelWidth + 2)}${row[col.key].replace(/\s*\r?\n\s*/g, " / ")}`);
    }
    out.push(thin);
  }
  return `﻿${out.join("\r\n")}\r\n`;
}
