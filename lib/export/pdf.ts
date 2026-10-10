import path from "node:path";
import PDFDocument from "pdfkit";
import bidiFactory from "bidi-js";
import { formatRiyadh, type ExportKey, type ExportMeta, type ExportRow } from "./leads";

/**
 * pdfkit shapes Arabic (joined letters) but has no bidi: it lays words out
 * left to right and reverses Latin/digits inside RTL text. So each cell is
 * split into directional runs with bidi-js, the runs are placed in visual
 * order, and every run is drawn on its own (RTL runs with the `rtla` feature).
 * Checked against mixed strings like "محمد 0501234567" and "(Botox)".
 */

const bidi = bidiFactory();

// next.config.ts traces this folder into the export route's bundle.
const FONT_DIR = path.join(process.cwd(), "lib/export/fonts");

type Run = { text: string; rtl: boolean };

const RTL_CHARS = /[\u0590-\u08FF\uFB1D-\uFDFF\uFE70-\uFEFF]/;

function visualRuns(text: string): Run[] {
  // Most cells (refs, dates, phones, Latin names) need no reordering.
  if (!RTL_CHARS.test(text)) return [{ text, rtl: false }];
  const levels = bidi.getEmbeddingLevels(text);
  const order = Array.from({ length: text.length }, (_, i) => i);
  for (const [start, end] of bidi.getReorderSegments(text, levels)) {
    const flipped = order.slice(start, end + 1).reverse();
    order.splice(start, flipped.length, ...flipped);
  }
  const mirrored = bidi.getMirroredCharactersMap(text, levels.levels);

  const spans: { rtl: boolean; min: number; max: number }[] = [];
  for (const idx of order) {
    const rtl = (levels.levels[idx] & 1) === 1;
    const last = spans[spans.length - 1];
    if (last && last.rtl === rtl && (rtl ? idx === last.min - 1 : idx === last.max + 1)) {
      if (rtl) last.min = idx;
      else last.max = idx;
    } else {
      spans.push({ rtl, min: idx, max: idx });
    }
  }
  return spans.map(({ rtl, min, max }) => {
    let s = "";
    for (let i = min; i <= max; i++) s += mirrored.get(i) ?? text[i];
    return { text: s, rtl };
  });
}

const ARABIC = /[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]/;

type Doc = InstanceType<typeof PDFDocument>;

function runOptions(run: Run) {
  return { lineBreak: false, features: run.rtl ? (["rtla"] as const) : [] } as PDFKit.Mixins.TextOptions;
}

function measure(doc: Doc, runs: Run[]) {
  return runs.reduce((sum, r) => sum + doc.widthOfString(r.text, runOptions(r)), 0);
}

/** Longest prefix (in logical order) that fits, with an ellipsis. */
function fit(doc: Doc, text: string, width: number): Run[] {
  const full = visualRuns(text);
  if (measure(doc, full) <= width) return full;
  let lo = 0;
  let hi = text.length;
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2);
    if (measure(doc, visualRuns(`${text.slice(0, mid).trimEnd()}…`)) <= width) lo = mid;
    else hi = mid - 1;
  }
  return visualRuns(`${text.slice(0, lo).trimEnd()}…`);
}

/** One line of mixed Arabic/Latin text; Arabic-led text is right-aligned. */
function drawText(doc: Doc, text: string, x: number, y: number, width: number) {
  if (!text) return;
  const runs = fit(doc, text, width);
  const rtlParagraph = ARABIC.test(text.match(/[A-Za-z؀-ۿ]/)?.[0] ?? "");
  let cursor = rtlParagraph ? x + width - measure(doc, runs) : x;
  for (const run of runs) {
    const opts = runOptions(run);
    doc.text(run.text, cursor, y, opts);
    cursor += doc.widthOfString(run.text, opts);
  }
}

const COLUMNS: { key: ExportKey; header: string; weight: number }[] = [
  { key: "ref", header: "Ref", weight: 8.5 },
  { key: "submitted", header: "Submitted", weight: 10 },
  { key: "name", header: "Name", weight: 15 },
  { key: "phone", header: "Phone", weight: 11 },
  { key: "city", header: "City", weight: 8 },
  { key: "source", header: "Source", weight: 15 },
  { key: "status", header: "Status", weight: 9.5 },
  { key: "assignee", header: "Assigned to", weight: 10 },
  { key: "service", header: "Service", weight: 11 },
];

const INK = "#1d1830";
const MUTED = "#6b6680";
const BRAND = "#4b2e83";
const HAIRLINE = "#e4e1ec";
const ZEBRA = "#f7f6fa";

export function toPdf(rows: ExportRow[], meta: ExportMeta): Promise<Buffer> {
  const doc = new PDFDocument({
    size: "A4",
    layout: "landscape",
    margins: { top: 36, bottom: 40, left: 32, right: 32 },
    bufferPages: true,
    info: { Title: "Leads export", Author: "MD Clinics panel" },
  });
  doc.registerFont("regular", path.join(FONT_DIR, "Almarai-Regular.ttf"));
  doc.registerFont("bold", path.join(FONT_DIR, "Almarai-Bold.ttf"));

  const chunks: Buffer[] = [];
  doc.on("data", (c: Buffer) => chunks.push(c));
  const done = new Promise<Buffer>((resolve, reject) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
  });

  const left = doc.page.margins.left;
  const tableWidth = doc.page.width - left - doc.page.margins.right;
  const totalWeight = COLUMNS.reduce((s, c) => s + c.weight, 0);
  const widths = COLUMNS.map((c) => (c.weight / totalWeight) * tableWidth);
  const pad = 5;
  const rowHeight = 20;
  const bottom = doc.page.height - doc.page.margins.bottom;

  // Title block (first page only).
  doc.font("bold").fontSize(18).fillColor(INK);
  drawText(doc, "Leads export", left, 36, tableWidth);
  doc.font("regular").fontSize(9.5).fillColor(MUTED);
  let y = 62;
  const summary = [
    `Exported ${formatRiyadh(meta.generatedAt)} (Riyadh) by ${meta.generatedBy}`,
    `${meta.total.toLocaleString("en-US")} leads${meta.truncated ? `, newest ${rows.length.toLocaleString("en-US")} included` : ""}`,
    ...meta.filters,
  ];
  for (const line of summary) {
    drawText(doc, line, left, y, tableWidth);
    y += 14;
  }
  y += 8;

  const drawHeader = () => {
    doc.rect(left, y, tableWidth, rowHeight).fill(BRAND);
    doc.font("bold").fontSize(9).fillColor("#ffffff");
    let x = left;
    COLUMNS.forEach((c, i) => {
      drawText(doc, c.header, x + pad, y + 6, widths[i] - pad * 2);
      x += widths[i];
    });
    y += rowHeight;
    doc.font("regular").fontSize(9).fillColor(INK);
  };

  drawHeader();
  rows.forEach((row, index) => {
    if (y + rowHeight > bottom) {
      doc.addPage();
      y = doc.page.margins.top;
      drawHeader();
    }
    if (index % 2 === 1) doc.rect(left, y, tableWidth, rowHeight).fill(ZEBRA);
    doc.moveTo(left, y + rowHeight).lineTo(left + tableWidth, y + rowHeight).lineWidth(0.5).strokeColor(HAIRLINE).stroke();
    doc.fillColor(INK);
    let x = left;
    COLUMNS.forEach((c, i) => {
      drawText(doc, row[c.key], x + pad, y + 6, widths[i] - pad * 2);
      x += widths[i];
    });
    y += rowHeight;
  });

  if (rows.length === 0) {
    doc.fillColor(MUTED);
    drawText(doc, "No leads match this filter.", left + pad, y + 8, tableWidth);
  }

  // Page numbers, written once every page exists.
  const range = doc.bufferedPageRange();
  for (let i = 0; i < range.count; i++) {
    doc.switchToPage(range.start + i);
    doc.font("regular").fontSize(8).fillColor(MUTED);
    const label = `Page ${i + 1} of ${range.count}`;
    // Writing below the bottom margin would make pdfkit add a page.
    const footerY = doc.page.height - 26;
    const savedBottom = doc.page.margins.bottom;
    doc.page.margins.bottom = 0;
    doc.text(label, left, footerY, { width: tableWidth, align: "right", lineBreak: false });
    doc.text("MD Clinics", left, footerY, { lineBreak: false });
    doc.page.margins.bottom = savedBottom;
  }

  doc.end();
  return done;
}
