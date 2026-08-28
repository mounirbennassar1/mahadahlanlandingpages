import { toArabicDigits } from "@/lib/content";

/** "٣ دقائق قراءة" with correct Arabic number agreement. */
export function readingLabel(minutes: number | null | undefined) {
  const n = Math.max(1, Math.round(minutes ?? 1));
  if (n === 1) return "دقيقة واحدة للقراءة";
  if (n === 2) return "دقيقتان للقراءة";
  if (n <= 10) return `${toArabicDigits(n)} دقائق قراءة`;
  return `${toArabicDigits(n)} دقيقة قراءة`;
}
