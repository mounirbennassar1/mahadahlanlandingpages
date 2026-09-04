/**
 * Fields we keep CVs on file for. No specific vacancies are advertised, so
 * the page presents these as areas that continuously accept applications.
 * Plain module (no "use client") so both the server page and the client
 * form can read the array.
 *
 * These are the VALUES recorded on the lead; the labels shown to visitors are
 * editable in `../content.ts` (`fields.items` and `form.experience`) and are
 * paired with these arrays by index.
 */
export const CAREER_FIELDS = [
  "طبيبة جلدية وتجميل",
  "أخصائية تجميل وليزر",
  "ممرضة",
  "أخصائية عناية بالبشرة",
  "موظفة استقبال وخدمة عملاء",
  "أخصائية تسويق ومحتوى",
  "أخرى",
] as const;

export const EXPERIENCE_LEVELS = [
  "أقل من سنة",
  "1 إلى 3 سنوات",
  "3 إلى 5 سنوات",
  "أكثر من 5 سنوات",
] as const;
