import ExcelJS from "exceljs";
import { EXPORT_COLUMNS, formatRiyadh, type ExportMeta, type ExportRow } from "./leads";

const RIYADH_OFFSET_MS = 3 * 60 * 60 * 1000;

/**
 * Excel has no time zones: a cell holds wall-clock time. Shift to Riyadh so the
 * cell reads the same as the panel, and stays a real date for sorting/filtering.
 */
function riyadhWallClock(date: Date) {
  return new Date(date.getTime() + RIYADH_OFFSET_MS);
}

export async function toXlsx(rows: ExportRow[], meta: ExportMeta): Promise<Buffer> {
  const wb = new ExcelJS.Workbook();
  wb.creator = "MD Clinics panel";
  wb.created = meta.generatedAt;

  const sheet = wb.addWorksheet("Leads", { views: [{ state: "frozen", ySplit: 1 }] });
  sheet.columns = EXPORT_COLUMNS.map((c) => ({ header: c.header, key: c.key, width: c.width }));

  for (const row of rows) {
    sheet.addRow({ ...row, submitted: riyadhWallClock(row.submittedAt) });
  }

  sheet.getColumn("submitted").numFmt = "yyyy-mm-dd hh:mm";
  // Phone numbers are text: never let Excel turn them into 9.66E+11.
  sheet.getColumn("phone").numFmt = "@";
  sheet.getColumn("message").alignment = { wrapText: true, vertical: "top" };

  const header = sheet.getRow(1);
  header.font = { bold: true, color: { argb: "FFFFFFFF" } };
  header.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF4B2E83" } };
  header.alignment = { vertical: "middle" };
  header.height = 22;
  sheet.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: EXPORT_COLUMNS.length } };

  const info = wb.addWorksheet("About this export");
  info.columns = [{ width: 22 }, { width: 70 }];
  info.addRows([
    ["Exported", `${formatRiyadh(meta.generatedAt)} (Riyadh)`],
    ["Exported by", meta.generatedBy],
    ["Leads", meta.truncated ? `${rows.length} of ${meta.total} (newest first)` : String(meta.total)],
    ...meta.filters.map((f, i) => [i === 0 ? "Filters" : "", f]),
  ]);
  info.getColumn(1).font = { bold: true };

  return Buffer.from(await wb.xlsx.writeBuffer());
}
