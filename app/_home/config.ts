import { Icon } from "@/components/icons";

const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

/** Numbers are shown in Western digits site-wide (client decision, 2026-08-28).
 *  Kept under its historical name so the many call sites don't churn: it now
 *  normalises any Arabic-Indic digits (and ٫ ٬ ٪) in the input to Western forms. */
export function toArabicDigits(value: string | number) {
  return String(value)
    .replace(/[٠-٩]/g, (d) => String(ARABIC_DIGITS.indexOf(d)))
    .replace(/٫/g, ".")
    .replace(/٬/g, ",")
    .replace(/٪/g, "%");
}

export const WHATSAPP_NUMBER = "966503377702";
export const PHONE_DISPLAY = "920007515";
export const TEL_LINK = "tel:+966920007515";

export const WA_TOPIC_MESSAGE =
  "مرحباً، أرغب بحجز استشارة في عيادات د. مها دحلان";

export const WA_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WA_TOPIC_MESSAGE,
)}`;

export const GOLD_GRADIENT =
  "linear-gradient(135deg, #8A6430, #E0BE7A 50%, #A67C3D)";

/* ——— clinic info: hours, location, payments ——— */

export const ADDRESS_DISPLAY = "جدة، المملكة العربية السعودية";

const MAPS_QUERY = "عيادات الدكتورة مها دحلان جدة";

export const MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  MAPS_QUERY,
)}`;

export const MAPS_DIRECTIONS_LINK = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  MAPS_QUERY,
)}`;

export const MAPS_EMBED_SRC = `https://maps.google.com/maps?q=${encodeURIComponent(
  MAPS_QUERY,
)}&hl=ar&z=15&output=embed`;

export type OpeningHours = {
  label: string;
  time: string;
  closed?: boolean;
};

/** Weekly schedule shown in the hours section and the topbar. */
export const HOURS: OpeningHours[] = [
  { label: "السبت إلى الخميس", time: "12:00 ظهراً حتى 8:00 مساءً" },
  { label: "الجمعة", time: "مغلق", closed: true },
];

export const HOURS_SHORT = "السبت إلى الخميس · 12 ظهراً حتى 8 مساءً";

/** Open Sat–Thu 12:00–20:00, Riyadh time. Friday = day 5. */
export const OPENING = { openHour: 12, closeHour: 20, closedDay: 5 };

/** Category filters for the specialties grid. `ALL` is prepended in the UI. */
export const CATEGORY_ALL = "الكل";

export const CATEGORIES = [
  CATEGORY_ALL,
  "تجميل الوجه",
  "نضارة البشرة",
  "الجسم",
  "الشعر",
  "عروض",
] as const;

export type Category = (typeof CATEGORIES)[number];

export type Specialty = {
  slug: string;
  title: string;
  description: string;
  image: string;
  /** object-position for the card crop, when centering misses the subject. */
  focus?: string;
  category: Exclude<Category, typeof CATEGORY_ALL>;
  tag: string;
  icon: typeof Icon.Sparkles;
};

/**
 * Every landing under `app/(landings)/` that is a real treatment page.
 * Add a new entry here whenever a landing is added, so it shows on the home grid.
 * (`sample` is a developer reference page and is intentionally excluded.)
 */
export const SPECIALTIES: Specialty[] = [
  {
    slug: "botox",
    title: "البوتوكس والفيلر",
    description:
      "جرعات محسوبة بيد استشارية معتمدة تنعّم الخطوط وتعيد توازن الملامح، مع حفاظ كامل على تعابير وجهك.",
    image: "/botox/botox_about.webp",
    category: "تجميل الوجه",
    tag: "نتيجة من أول جلسة",
    icon: Icon.Syringe,
  },
  {
    slug: "neck-lift",
    title: "شد الرقبة وخط الفك",
    description:
      "خيوط وهايفو وبوتوكس نفرتيتي وفيلر خط الفك، لرقبة مشدودة وزاوية فكٍّ محدّدة بلا جراحة.",
    image: "/neck-lift/hero-main.webp",
    category: "تجميل الوجه",
    tag: "بدون جراحة",
    icon: Icon.MoveUpLeft,
  },
  {
    slug: "facial-atrophy",
    title: "علاج ضمور الوجه بعد التنحيف",
    description:
      "خسرتِ الوزن بنجاح؟ نعيد لوجهك امتلاءه وإشراقته بفيلر ومحفزات كولاجين وخيوط، بخطة تُرسم لملامحك وحدها.",
    image: "/facial-atrophy/hero-center.webp",
    category: "تجميل الوجه",
    tag: "استعادة الامتلاء",
    icon: Icon.Smile,
  },
  {
    slug: "dark-circles",
    title: "الهالات والتصبّغات حول العين",
    description:
      "برنامج دقيق لأكثر مناطق الوجه حساسية، يوحّد اللون ويخفف الغور ويعيد للنظرة إشراقها.",
    image: "/dark-circles/hero.webp",
    category: "تجميل الوجه",
    tag: "نظرة أكثر إشراقاً",
    icon: Icon.Eye,
  },
  {
    slug: "acne",
    title: "علاج حب الشباب وآثاره",
    description:
      "بروتوكول متدرّج يوقف ظهور الحبوب أولاً ثم يعالج آثارها بأحدث أجهزة الليزر الطبية المعتمدة.",
    image: "/acne/acneshow/img1.webp",
    category: "نضارة البشرة",
    tag: "ليزر طبي معتمد",
    icon: Icon.ShieldCheck,
  },
  {
    slug: "hyperpigmentation",
    title: "علاج التصبّغات والكلف",
    description:
      "جلسات هادئة ومكوّنات نقية وخطة شخصية ترسمها طبيبتك، لتعيد إلى بشرتك لونها الصافي المتوازن.",
    image: "/hyperpigmentation/zoomin.webp",
    category: "نضارة البشرة",
    tag: "لون موحّد",
    icon: Icon.Palette,
  },
  {
    slug: "glass-skin",
    title: "الجلاس سكين الكوري",
    description:
      "تنظيف عميق وتقشير لطيف وترطيب مكثّف في جلسة واحدة، لبشرة زجاجية تتوهّج من الداخل.",
    image: "/glass-skin/koreanglass.webp",
    category: "نضارة البشرة",
    tag: "بدون إبر",
    icon: Icon.Sparkles,
  },
  {
    slug: "korean-spicules",
    title: "السبيكولز الكورية",
    description:
      "إبر مجهرية طبيعية من الإسفنج البحري تفتح آلاف القنوات الدقيقة وتحفّز الكولاجين بلا جهاز.",
    image: "/korean-spicules/hero.webp",
    category: "نضارة البشرة",
    tag: "طبيعي 100%",
    icon: Icon.Waves,
  },
  {
    slug: "microneedling-rf",
    title: "الميكرونيدلينغ بالترددات الراديوية",
    description:
      "حرارة موجّهة تحت سطح الجلد تشدّ من الداخل وتصغّر المسام وتحسّن الملمس جلسةً بعد جلسة.",
    image: "/microneedling-rf/hero.webp",
    category: "نضارة البشرة",
    tag: "شدٌّ من الداخل",
    icon: Icon.Radio,
  },
  {
    slug: "facial",
    title: "الهايدرافيشل والعناية بالبشرة",
    description:
      "باقة متكاملة من جلسات التنظيف العميق والهايدرافيشل، لنضارة فورية تُرى قبل مغادرتك العيادة.",
    image: "/facial/closeup-portrait-beautiful-woman-cosmetology-therapy-beauty-salon-professional-dermatology-procedures-lifting-rejuvenation-modern-devices-healthcare.jpg",
    category: "نضارة البشرة",
    tag: "نضارة فورية",
    icon: Icon.Droplets,
  },
  {
    slug: "hair",
    title: "علاج تساقط الشعر",
    description:
      "ريجينيرا إيفو وبلازما وميزوثيرابي وإكسوزوم، لإيقاف التساقط وإعادة الكثافة بخطة طبية واضحة.",
    image: "/hair/ct.avif",
    category: "الشعر",
    tag: "كثافة تعود",
    icon: Icon.Wind,
  },
  {
    slug: "body",
    title: "نحت الجسم بتقنية HIFEM",
    description:
      "الجلسة الواحدة تعادل آلاف الانقباضات العضلية، تحرق الدهون الموضعية وتشدّ العضلات بلا جراحة.",
    // Cropped from hero-hifem.png to drop the baked-in English headline.
    image: "/body/card.webp",
    category: "الجسم",
    tag: "بلا فترة نقاهة",
    icon: Icon.Activity,
  },
  {
    slug: "stretchmarks",
    title: "التشققات وعلامات التمدد",
    description:
      "الفيلر الهجين المحفّز للكولاجين وفيلر الكالسيوم يعيدان بناء الجلد ويخففان التشققات تدريجياً.",
    image: "/stretchmarks/afterbefore/stratchmark.jpg",
    category: "الجسم",
    tag: "محفّزات كولاجين",
    icon: Icon.Layers,
  },
  {
    slug: "eid-offer",
    title: "عرض عيد الأضحى",
    description:
      "خصومات ذهبية على الهيدرافيشل والبوتوكس والفيلر وعلاج الهالات وعلاجات الشعر والبشرة.",
    image: "/eid-offer/hero.webp",
    category: "عروض",
    tag: "خصم حتى 40%",
    icon: Icon.Gift,
  },
];

export type Slide = {
  slug: string;
  eyebrow: string;
  titleTop: string;
  titleGold: string;
  body: string;
  chips: string[];
  main: string;
  mainAlt: string;
  focus?: string;
};

/** Flagship treatments featured in the hero slider. */
export const SLIDES: Slide[] = [
  {
    slug: "glass-skin",
    eyebrow: "بروتوكول كوري أصيل",
    titleTop: "بشرةٌ زجاجية",
    titleGold: "تتوهّج من الداخل",
    body: "تنظيف عميق، تقشير لطيف، وترطيب مكثّف في جلسة واحدة تخرجين بعدها بإشراقة تُرى فوراً، بلا إبر وبلا فترة نقاهة.",
    chips: ["بدون إبر", "60 دقيقة", "نتيجة فورية"],
    main: "/glass-skin/closeup.webp",
    mainAlt: "بشرة صافية بإشراقة زجاجية",
  },
  {
    slug: "neck-lift",
    eyebrow: "شدٌّ غير جراحي",
    titleTop: "رقبةٌ مشدودة",
    titleGold: "وخطُّ فكٍّ أنيق",
    body: "خيوط وهايفو وبوتوكس نفرتيتي وفيلر خط الفك، في بروتوكول يُبنى بعد تقييم صادق لحالتك، بنتيجة طبيعية وعودة فورية ليومك.",
    chips: ["بدون جراحة", "أقل من ساعة", "نتيجة طبيعية"],
    main: "/neck-lift/hero-main.webp",
    mainAlt: "رقبة مشدودة بملامح أنيقة",
  },
  {
    slug: "botox",
    eyebrow: "بوتوكس وفيلر",
    titleTop: "ملامحُكِ كما هي",
    titleGold: "بلا خطوطٍ تُعكّرها",
    body: "جرعات محسوبة بيد استشارية معتمدة تنعّم الخطوط وتعيد التوازن للملامح، مع الحفاظ الكامل على تعابير وجهك الطبيعية.",
    chips: ["مواد أصلية", "تعابير طبيعية", "جلسة سريعة"],
    main: "/botox/botox_about.webp",
    mainAlt: "ملامح متوازنة بعد جلسة بوتوكس",
  },
  {
    slug: "body",
    eyebrow: "نحت الجسم بتقنية HIFEM",
    titleTop: "قوامٌ متناسق",
    titleGold: "بلا جراحة ولا نقاهة",
    body: "الجلسة الواحدة تعادل آلاف الانقباضات العضلية، تحرق الدهون الموضعية وتشدّ العضلات، وأنتِ مستلقية في راحة تامة.",
    chips: ["30 دقيقة", "بلا جراحة", "نتائج تُقاس"],
    main: "/body/card.webp",
    mainAlt: "نحت الجسم بجهاز التحفيز العضلي",
  },
];
