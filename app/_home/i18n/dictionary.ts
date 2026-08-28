import {
  ADDRESS_DISPLAY,
  HOURS,
  HOURS_SHORT,
  MAPS_EMBED_SRC,
  SPECIALTIES,
  WA_LINK,
  WA_TOPIC_MESSAGE,
  WHATSAPP_NUMBER,
  type OpeningHours,
} from "../config";

export type Locale = "ar" | "en";

export const DEFAULT_LOCALE: Locale = "ar";

/* ——— per-locale chrome facts: direction, language switch, WhatsApp, map ——— */

export type LangMeta = {
  dir: "rtl" | "ltr";
  lang: string;
  /** Where the language switch in the header points. */
  switchHref: string;
  /** `hrefLang` of the switch target. */
  switchHrefLang: string;
  /** Long label (mobile sheet). */
  switchLabel: string;
  /** Two-letter pill label (desktop). */
  switchShort: string;
  /** aria-label of the switch. */
  switchAria: string;
  /** Prefilled WhatsApp message for every wa.me link on the page. */
  waMessage: string;
  /** Home URL of this locale (logo + "Home" nav item). */
  home: string;
};

export const LANG_META: Record<Locale, LangMeta> = {
  ar: {
    dir: "rtl",
    lang: "ar",
    switchHref: "/en",
    switchHrefLang: "en",
    switchLabel: "English",
    switchShort: "EN",
    switchAria: "English version",
    waMessage: WA_TOPIC_MESSAGE,
    home: "/",
  },
  en: {
    dir: "ltr",
    lang: "en",
    switchHref: "/",
    switchHrefLang: "ar",
    switchLabel: "العربية",
    switchShort: "AR",
    switchAria: "النسخة العربية",
    waMessage: "Hello, I'd like to book a consultation at Dr. Maha Dahlan Clinics",
    home: "/en",
  },
};

/** wa.me link with the locale's prefilled message (Arabic keeps `WA_LINK` byte-for-byte). */
export function waLink(locale: Locale = DEFAULT_LOCALE) {
  if (locale === "ar") return WA_LINK;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    LANG_META[locale].waMessage,
  )}`;
}

/** Google-map embed in the locale's UI language. */
export function mapsEmbedSrc(locale: Locale = DEFAULT_LOCALE) {
  if (locale === "ar") return MAPS_EMBED_SRC;
  return MAPS_EMBED_SRC.replace("&hl=ar&", `&hl=${LANG_META[locale].lang}&`);
}

/* ——— dictionary ——— */

export type NavItem = { href: string; label: string };
export type Head = { eyebrow: string; title: string; gold: string; body: string };

export type DoctorEntry = {
  label: string;
  name: string;
  title: string;
  credentials: string[];
  image: string;
  imageAlt: string;
};

export type ReviewEntry = {
  quote: string;
  name: string;
  caption: string;
  initial: string;
};

export type SpecialtyCopy = { title: string; description: string; tag: string };

export type Dict = {
  nav: {
    items: NavItem[];
    /** Desktop gold button. */
    book: string;
    /** Mobile-sheet gold button. */
    bookMobile: string;
    menuAria: string;
    logoAlt: string;
  };
  topbar: {
    announcements: string[];
    hoursShort: string;
    splitTitle: string;
    socials: { instagram: string; tiktok: string; snapchat: string; x: string };
  };
  hero: {
    eyebrow: string;
    line1: string;
    line2: string;
    body: string;
    portraitAlt: string;
    book: string;
    whatsapp: string;
    scrollCue: string;
  };
  marquee: string[];
  specialties: Head;
  why: Head & { cta: string; cards: { title: string; body: string }[] };
  team: Head;
  reviews: Head;
  visit: Head;
  pay: Head;
  contact: {
    badge: string;
    title: string;
    gold: string;
    body: string;
    whatsapp: string;
    points: string[];
  };
  doctors: {
    items: DoctorEntry[];
    caption: string;
    prevAria: string;
    nextAria: string;
  };
  testimonials: { rowA: ReviewEntry[]; rowB: ReviewEntry[] };
  hours: {
    title: string;
    statusPending: string;
    openNow: string;
    closedNow: string;
    rows: OpeningHours[];
    address: string;
    whatsapp: string;
    directions: string;
    mapTitle: string;
    mapBadge: string;
  };
  payments: {
    providers: { id: "tabby" | "tamara"; title: string; body: string }[];
    perks: string[];
    methodsTitle: string;
    methodsBody: string;
    madaAria: string;
  };
  footer: {
    logoAlt: string;
    blurb: string;
    whatsapp: string;
    address: string;
    paymentsLabel: string;
    siteHeading: string;
    siteLinks: NavItem[];
    /** Footer column headings, keyed by the Arabic category names in `config.ts`. */
    categories: Record<string, string>;
    socials: { instagram: string; tiktok: string; snapchat: string; x: string };
    /** Rendered as prefix + current year + suffix. */
    copyrightPrefix: string;
    copyrightSuffix: string;
    disclaimer: string;
  };
  sticky: { book: string; whatsappAria: string };
  backToTop: string;
};

const AR: Dict = {
  nav: {
    items: [
      { href: "/", label: "الرئيسية" },
      { href: "/about-us", label: "من نحن" },
      { href: "/services", label: "الخدمات" },
      { href: "/offers", label: "العروض" },
      { href: "/doctors", label: "الأطباء" },
      { href: "/our-devices", label: "الأجهزة" },
      { href: "/careers", label: "الوظائف" },
      { href: "/book-now", label: "تواصل معنا" },
      { href: "/news-articles", label: "المقالات" },
    ],
    book: "احجزي موعدك",
    bookMobile: "احجزي استشارتك",
    menuAria: "قائمة التنقل",
    logoAlt: "عيادات د. مها دحلان",
  },
  topbar: {
    announcements: [
      "قسّطي جلساتك مع تابي وتمارا على 4 دفعات بدون فوائد",
      "طاقم نسائي بالكامل وخصوصية تامة",
      "تقييم 4.8 من 5 بأكثر من 1270 تقييماً على Google",
    ],
    hoursShort: HOURS_SHORT,
    splitTitle: "قسّطي جلساتك مع تابي وتمارا",
    socials: {
      instagram: "إنستغرام",
      tiktok: "تيك توك",
      snapchat: "سناب شات",
      x: "إكس",
    },
  },
  hero: {
    eyebrow: "تجربة جمالية متخصصة في جدة",
    line1: "جمالٌ مدروس.",
    line2: "ونتيجة تليق بكِ.",
    body: "رعاية متخصصة في الجلدية والتجميل والليزر، تجمع بين الخبرة الطبية والتفاصيل التي تصنع فرقًا في تجربة راقية تحفظ خصوصيتكِ وتضع احتياجاتكِ أولًا.",
    portraitAlt: "طبيبة بالبالطو الأبيض في عيادات د. مها دحلان",
    book: "احجزي استشارتك",
    whatsapp: "تواصلي معنا عبر الواتس آب",
    scrollCue: "مرّري للاكتشاف",
  },
  marquee: [
    "علاج حب الشباب",
    "علاج التصبغات",
    "علاج تساقط الشعر",
    "شد الوجه",
    "شد الرقبة",
    "علاج الوردية",
    "علاج الإكزيما",
    "بوتوكس",
    "فيلر",
    "تنظيف بشرة طبي",
    "هايدرافيشل",
    "ديتوكس فروة الرأس",
    "نحت الجسم وتكسير الدهون",
    "علاج الوحمات",
  ],
  specialties: {
    eyebrow: "تخصصاتنا",
    title: "عناية متكاملة،",
    gold: "بخبرات متخصصة",
    body: "اكتشفي مجموعة متكاملة من خدمات الجلدية والتجميل والليزر، صُممت لتلبي احتياجاتكِ المختلفة ضمن تجربة طبية راقية ومخصصة لكِ.",
  },
  why: {
    eyebrow: "لماذا عياداتنا",
    title: "حلول علاجية",
    gold: "تبدأ من احتياجك",
    body: "دقة الاختيار تصنع فرق النتيجة.",
    cta: "احجزي استشارتك الخاصة",
    cards: [
      {
        title: "تقييم صادق",
        body: "لا نقترح عليكِ إلا ما تحتاجينه فعلاً، وقد نكتفي بتقنية واحدة بدل باقة كاملة.",
      },
      {
        title: "مواد أصلية معتمدة",
        body: "أجهزة ومستحضرات من شركات عالمية موثّقة، تُفتح أمامك داخل الجلسة.",
      },
      {
        title: "طاقم نسائي بالكامل",
        body: "خصوصية تامة من الاستقبال حتى غرفة الجلسة وملفك الطبي.",
      },
      {
        title: "متابعة حتى النتيجة",
        body: "مراجعات دورية مجدولة نطمئن فيها على تطور نتيجتك حتى اكتمالها.",
      },
    ],
  },
  team: {
    eyebrow: "من يقف خلف نتيجتك",
    title: "أيدٍ خبيرة",
    gold: "وعينٌ تعرف التفاصيل",
    body: "نخبة من طبيبات الجلدية والتجميل بقيادة د. مها دحلان، استشارية الجلدية والتجميل والليزر، كل خطة علاجية تمرّ على عينها قبل أن تبدأ.",
  },
  reviews: {
    eyebrow: "آراء العميلات",
    title: "4.8 من 5",
    gold: "بأكثر من 1270 تقييماً",
    body: "مقتطفات حقيقية من تقييمات زائرات العيادة على خرائط Google.",
  },
  visit: {
    eyebrow: "زورينا في جدة",
    title: "موقعنا",
    gold: "وساعات العمل",
    body: "نستقبلك في أجواء هادئة تحفظ خصوصيتك. اطمئني على وقت الدوام، واتركي للخريطة أن تدلّك علينا.",
  },
  pay: {
    eyebrow: "الدفع على راحتك",
    title: "جمالك اليوم،",
    gold: "والدفع على دفعات",
    body: "نوفر التقسيط عبر تابي وتمارا داخل العيادة، لتبدئي برنامجك العلاجي اليوم وتقسّمي قيمته على دفعات مريحة.",
  },
  contact: {
    badge: "المواعيد محدودة أسبوعياً",
    title: "ابدئي باستشارة،",
    gold: "لا بقرارٍ متعجّل",
    body: "لأن القرار الأفضل يبدأ بمعرفة ما يناسبك.",
    whatsapp: "تواصلي معنا عبر الواتس آب",
    points: ["استشارة مع مختص", "خيارات تناسب حالتكِ", "خصوصية تامة"],
  },
  doctors: {
    items: [
      {
        label: "الطبيبة الأولى",
        name: "د. مها دحلان",
        title: "استشارية الجلدية والتجميل والليزر",
        credentials: [
          "البورد السعودي في طب الأمراض الجلدية والتجميل والليزر",
          "البورد العربي في طب الأمراض الجلدية والتناسلية",
          "ماجستير صحة عامة من جامعة بوسطن",
          "زمالة البرنامج العالمي من جامعة هارفارد للأمراض الجلدية",
        ],
        image: "/team/dr-maha.avif",
        imageAlt: "د. مها دحلان، استشارية الجلدية والتجميل والليزر",
      },
      {
        label: "الطبيبة الثانية",
        name: "د. إيناس عبدالعزيز",
        title: "طبيب مقيم الأمراض الجلدية",
        credentials: [
          "بكالوريوس طب وجراحة عامة، تخصص الجلدية",
          "الدبلوم الأمريكي للجلدية والتجميل والليزر",
        ],
        image: "/team/dr-inas.avif",
        imageAlt: "د. إيناس عبدالعزيز، طبيب مقيم الأمراض الجلدية",
      },
      {
        label: "الطبيبة الثالثة",
        name: "د. لجين الجرماني",
        title: "نائب الجلدية والتجميل والليزر",
        credentials: [
          "البورد السوري في طب الأمراض الجلدية",
          "الدبلوم الأمريكي للجلدية والتجميل والليزر",
        ],
        image: "/team/dr-lajin.avif",
        imageAlt: "د. لجين الجرماني، نائب الجلدية والتجميل والليزر",
      },
    ],
    caption: "علاج يُدار بعلم، لا بالتجربة",
    prevAria: "الطبيبة السابقة",
    nextAria: "الطبيبة التالية",
  },
  testimonials: {
    rowA: [
      {
        quote:
          "الدكتورة مها دحلان من أفضل الدكاترة، يدها خفيفة ورائعة في عملها، وتسمع للمريض وتعطيه شرحاً كاملاً وافياً لما يحتاجه دون مبالغة.",
        name: "عبير علي",
        caption: "تقييم Google، 5 نجوم",
        initial: "ع",
      },
      {
        quote:
          "بكل أمانة: الدكتورة مها دحلان من أفضل أطباء واستشاريي الجلدية في جدة بدون مبالغة. تعاملها راقٍ جداً وتشرح الخطوات بكل وضوح.",
        name: "مصطفى الحاتم",
        caption: "تقييم Google، 5 نجوم",
        initial: "م",
      },
      {
        quote:
          "أتقدم بجزيل الشكر للدكتورة مها دحلان على احترافيتها العالية وخبرتها المميزة، حرصت على شرح الحالة وخطة العلاج بكل وضوح.",
        name: "ملك نواوي",
        caption: "تقييم Google، 5 نجوم",
        initial: "م",
      },
      {
        quote:
          "أكثر من 1270 تقييماً على خرائط Google بمتوسط 4.8 من 5. ثقة تتجدد كل يوم.",
        name: "عيادات مها دحلان",
        caption: "خرائط Google",
        initial: "★",
      },
    ],
    rowB: [
      {
        quote:
          "تهتم بأدق التفاصيل ولا تقترح إلا ما يحتاجه المريض فعلاً، هذه خلاصة تجربتي معها.",
        name: "عبير علي",
        caption: "تقييم Google، 5 نجوم",
        initial: "ع",
      },
      {
        quote: "تجاوب على كل الأسئلة بصدر رحب، وتشرح خطوات العلاج قبل البدء.",
        name: "مصطفى الحاتم",
        caption: "تقييم Google، 5 نجوم",
        initial: "م",
      },
      {
        quote:
          "أظهرت اهتماماً كبيراً بمتابعة النتائج والاطمئنان على تحسّن الحالة، والطاقم في غاية اللطف.",
        name: "ملك نواوي",
        caption: "تقييم Google، 5 نجوم",
        initial: "م",
      },
      {
        quote: "دكتورة إيناس عبد العزيز ممتازة وتعامل راقٍ.",
        name: "زائرة العيادة",
        caption: "من تحديثات الزوار على Google",
        initial: "ز",
      },
    ],
  },
  hours: {
    title: "ساعات العمل",
    statusPending: "الدوام",
    openNow: "مفتوح الآن",
    closedNow: "مغلق الآن",
    rows: HOURS,
    address: ADDRESS_DISPLAY,
    whatsapp: "استشارة عبر واتساب",
    directions: "احصلي على الاتجاهات",
    mapTitle: "موقع عيادات د. مها دحلان على خرائط Google",
    mapBadge: "عيادات د. مها دحلان",
  },
  payments: {
    providers: [
      {
        id: "tabby",
        title: "قسّطيها مع تابي",
        body: "قسّمي قيمة جلستك على 4 دفعات متساوية بدون فوائد وبدون رسوم تأخير خفية.",
      },
      {
        id: "tamara",
        title: "أو مع تمارا",
        body: "ادفعي لاحقاً أو على دفعات مرنة، بموافقة فورية داخل العيادة وبلا تعقيد.",
      },
    ],
    perks: [
      "4 دفعات متساوية بدون فوائد",
      "موافقة فورية عند الاستقبال",
      "بدون بطاقة ائتمانية",
    ],
    methodsTitle: "طرق الدفع المقبولة في العيادة",
    methodsBody:
      "ادفعي بالطريقة الأنسب لكِ: Apple Pay، مدى، فيزا، ماستركارد، أو قسّطيها مع تابي وتمارا.",
    madaAria: "مدى | mada",
  },
  footer: {
    logoAlt: "عيادات د. مها دحلان",
    blurb:
      "مجمع عيادات د. مها دحلان الطبي في جدة. تجربة طبية تجميلية فاخرة بإشراف نخبة من الاستشاريين، وطاقم نسائي بالكامل يحفظ خصوصيتك من الاستقبال حتى المتابعة.",
    whatsapp: "استشارة عبر واتساب",
    address: "جدة، المملكة العربية السعودية",
    paymentsLabel: "طرق الدفع المقبولة",
    siteHeading: "الموقع",
    siteLinks: [
      { href: "/about-us", label: "من نحن" },
      { href: "/services", label: "الخدمات" },
      { href: "/offers", label: "العروض" },
      { href: "/doctors", label: "الأطباء" },
      { href: "/our-devices", label: "الأجهزة" },
      { href: "/careers", label: "الوظائف" },
      { href: "/news-articles", label: "المقالات" },
      { href: "/book-now", label: "تواصل معنا" },
    ],
    categories: {},
    socials: {
      instagram: "إنستغرام",
      tiktok: "تيك توك",
      snapchat: "سناب شات",
      x: "إكس",
    },
    copyrightPrefix: "© ",
    copyrightSuffix: " عيادات د. مها دحلان. جميع الحقوق محفوظة.",
    disclaimer:
      "المحتوى هنا للتوعية العامة ولا يُغني عن الاستشارة الطبية. النتائج تختلف من حالة إلى أخرى.",
  },
  sticky: { book: "احجزي الآن", whatsappAria: "تواصلي عبر واتساب" },
  backToTop: "العودة إلى الأعلى",
};

const EN: Dict = {
  nav: {
    items: [
      { href: "/en", label: "Home" },
      { href: "/about-us", label: "About Us" },
      { href: "/services", label: "Services" },
      { href: "/offers", label: "Offers" },
      { href: "/doctors", label: "Doctors" },
      { href: "/our-devices", label: "Devices" },
      { href: "/careers", label: "Careers" },
      { href: "/book-now", label: "Contact Us" },
      { href: "/news-articles", label: "Articles" },
    ],
    book: "Book an Appointment",
    bookMobile: "Book Your Consultation",
    menuAria: "Navigation menu",
    logoAlt: "Dr. Maha Dahlan Clinics",
  },
  topbar: {
    announcements: [
      "Split your sessions into 4 interest-free payments with Tabby and Tamara",
      "All-female staff and complete privacy",
      "Rated 4.8 out of 5 by more than 1270 reviews on Google",
    ],
    hoursShort: "Saturday to Thursday · 12 PM to 8 PM",
    splitTitle: "Split your sessions with Tabby and Tamara",
    socials: {
      instagram: "Instagram",
      tiktok: "TikTok",
      snapchat: "Snapchat",
      x: "X",
    },
  },
  hero: {
    eyebrow: "A specialised aesthetic experience in Jeddah",
    line1: "Beauty, by design.",
    line2: "Results worthy of you.",
    body: "Specialised care in dermatology, aesthetics and laser, combining medical expertise with the details that make the difference: a refined experience that protects your privacy and puts your needs first.",
    portraitAlt: "Doctor in a white coat at Dr. Maha Dahlan Clinics",
    book: "Book Your Consultation",
    whatsapp: "Chat With Us on WhatsApp",
    scrollCue: "Scroll to explore",
  },
  marquee: [
    "Acne Treatment",
    "Pigmentation Treatment",
    "Hair Loss Treatment",
    "Face Lift",
    "Neck Lift",
    "Rosacea Treatment",
    "Eczema Treatment",
    "Botox",
    "Fillers",
    "Medical Facial Cleansing",
    "HydraFacial",
    "Scalp Detox",
    "Body Sculpting and Fat Reduction",
    "Birthmark Treatment",
  ],
  specialties: {
    eyebrow: "Our Specialties",
    title: "Comprehensive care,",
    gold: "delivered by specialists",
    body: "Discover a complete range of dermatology, aesthetic and laser services, designed around your different needs within a refined medical experience tailored to you.",
  },
  why: {
    eyebrow: "Why Our Clinics",
    title: "Treatment plans",
    gold: "that start from your needs",
    body: "The right choice makes all the difference in the result.",
    cta: "Book Your Private Consultation",
    cards: [
      {
        title: "An honest assessment",
        body: "We only recommend what you truly need, and sometimes a single treatment does the job better than a full package.",
      },
      {
        title: "Genuine, certified products",
        body: "Devices and products from trusted global brands, opened in front of you during your session.",
      },
      {
        title: "An all-female team",
        body: "Complete privacy from reception to the treatment room and your medical file.",
      },
      {
        title: "Follow-up until the result",
        body: "Scheduled check-ins where we track how your result is developing until it is complete.",
      },
    ],
  },
  team: {
    eyebrow: "Behind Your Result",
    title: "Expert hands",
    gold: "and an eye for detail",
    body: "A select team of dermatology and aesthetic doctors led by Dr. Maha Dahlan, consultant in dermatology, aesthetics and laser. Every treatment plan passes under her eye before it begins.",
  },
  reviews: {
    eyebrow: "What Our Clients Say",
    title: "4.8 out of 5",
    gold: "from more than 1270 reviews",
    body: "Genuine excerpts from our visitors' reviews on Google Maps.",
  },
  visit: {
    eyebrow: "Visit Us in Jeddah",
    title: "Our location",
    gold: "and opening hours",
    body: "We welcome you in a calm setting that protects your privacy. Check our opening hours, and let the map guide you to us.",
  },
  pay: {
    eyebrow: "Pay at Your Own Pace",
    title: "Your beauty today,",
    gold: "paid in instalments",
    body: "We offer instalments through Tabby and Tamara in the clinic, so you can start your treatment programme today and split its cost into comfortable payments.",
  },
  contact: {
    badge: "Limited appointments each week",
    title: "Start with a consultation,",
    gold: "not a rushed decision",
    body: "Because the best decision starts with knowing what suits you.",
    whatsapp: "Chat With Us on WhatsApp",
    points: [
      "Consultation with a specialist",
      "Options that suit your case",
      "Complete privacy",
    ],
  },
  doctors: {
    items: [
      {
        label: "Dr. Maha Dahlan",
        name: "Dr. Maha Dahlan",
        title: "Consultant Dermatologist, Aesthetics and Laser",
        credentials: [
          "Saudi Board in Dermatology, Aesthetics and Laser",
          "Arab Board in Dermatology and Venereology",
          "Master of Public Health, Boston University",
          "Harvard Global Dermatology Fellowship Programme",
        ],
        image: "/team/dr-maha.avif",
        imageAlt: "Dr. Maha Dahlan, consultant in dermatology, aesthetics and laser",
      },
      {
        label: "Dr. Inas Abdulaziz",
        name: "Dr. Inas Abdulaziz",
        title: "Dermatology Resident",
        credentials: [
          "Bachelor of Medicine and Surgery, dermatology specialty",
          "American Diploma in Dermatology, Aesthetics and Laser",
        ],
        image: "/team/dr-inas.avif",
        imageAlt: "Dr. Inas Abdulaziz, dermatology resident",
      },
      {
        label: "Dr. Lujain Al Jarmani",
        name: "Dr. Lujain Al Jarmani",
        title: "Dermatology, Aesthetics and Laser Registrar",
        credentials: [
          "Syrian Board in Dermatology",
          "American Diploma in Dermatology, Aesthetics and Laser",
        ],
        image: "/team/dr-lajin.avif",
        imageAlt: "Dr. Lujain Al Jarmani, dermatology, aesthetics and laser registrar",
      },
    ],
    caption: "Treatment guided by science, not by trial and error",
    prevAria: "Previous doctor",
    nextAria: "Next doctor",
  },
  testimonials: {
    rowA: [
      {
        quote:
          "Dr. Maha Dahlan is one of the best doctors. She has a gentle hand and is wonderful at her work. She listens to the patient and gives a complete, thorough explanation of what they need, without exaggeration.",
        name: "Abeer Ali",
        caption: "Google review, 5 stars",
        initial: "A",
      },
      {
        quote:
          "In all honesty, Dr. Maha Dahlan is one of the best dermatologists and consultants in Jeddah, no exaggeration. Her manner is very refined and she explains every step clearly.",
        name: "Mustafa Al Hatem",
        caption: "Google review, 5 stars",
        initial: "M",
      },
      {
        quote:
          "My sincere thanks to Dr. Maha Dahlan for her high professionalism and remarkable expertise. She made sure to explain my condition and the treatment plan with complete clarity.",
        name: "Malak Nawawi",
        caption: "Google review, 5 stars",
        initial: "M",
      },
      {
        quote:
          "More than 1270 reviews on Google Maps, with an average of 4.8 out of 5. Trust renewed every day.",
        name: "Maha Dahlan Clinics",
        caption: "Google Maps",
        initial: "★",
      },
    ],
    rowB: [
      {
        quote:
          "She pays attention to the smallest details and only suggests what the patient really needs. That sums up my experience with her.",
        name: "Abeer Ali",
        caption: "Google review, 5 stars",
        initial: "A",
      },
      {
        quote:
          "She answers every question patiently and explains the treatment steps before starting.",
        name: "Mustafa Al Hatem",
        caption: "Google review, 5 stars",
        initial: "M",
      },
      {
        quote:
          "She showed great care in following up on the results and checking on my progress, and the staff were extremely kind.",
        name: "Malak Nawawi",
        caption: "Google review, 5 stars",
        initial: "M",
      },
      {
        quote: "Dr. Inas Abdulaziz is excellent, with a very refined manner.",
        name: "Clinic visitor",
        caption: "From visitor updates on Google",
        initial: "V",
      },
    ],
  },
  hours: {
    title: "Opening Hours",
    statusPending: "Hours",
    openNow: "Open now",
    closedNow: "Closed now",
    rows: [
      { label: "Saturday to Thursday", time: "12:00 PM to 8:00 PM" },
      { label: "Friday", time: "Closed", closed: true },
    ],
    address:
      "Jeddah, Al Rawdah, Prince Mohammed bin Abdulaziz St (Tahlia), Bin Hamran Center, 3rd floor",
    whatsapp: "Consultation via WhatsApp",
    directions: "Get Directions",
    mapTitle: "Dr. Maha Dahlan Clinics on Google Maps",
    mapBadge: "Dr. Maha Dahlan Clinics",
  },
  payments: {
    providers: [
      {
        id: "tabby",
        title: "Split it with Tabby",
        body: "Split the cost of your session into 4 equal payments, interest-free and with no hidden late fees.",
      },
      {
        id: "tamara",
        title: "Or with Tamara",
        body: "Pay later or in flexible instalments, with instant approval in the clinic and no complications.",
      },
    ],
    perks: [
      "4 equal interest-free payments",
      "Instant approval at reception",
      "No credit card needed",
    ],
    methodsTitle: "Payment methods accepted in the clinic",
    methodsBody:
      "Pay the way that suits you best: Apple Pay, mada, Visa, Mastercard, or split it with Tabby and Tamara.",
    madaAria: "mada",
  },
  footer: {
    logoAlt: "Dr. Maha Dahlan Clinics",
    blurb:
      "Dr. Maha Dahlan Medical Clinics in Jeddah. A refined medical and aesthetic experience supervised by leading consultants, with an all-female team that protects your privacy from reception to follow-up.",
    whatsapp: "Consultation via WhatsApp",
    address: "Jeddah, Saudi Arabia",
    paymentsLabel: "Accepted payment methods",
    siteHeading: "Site",
    siteLinks: [
      { href: "/about-us", label: "About Us" },
      { href: "/services", label: "Services" },
      { href: "/offers", label: "Offers" },
      { href: "/doctors", label: "Doctors" },
      { href: "/our-devices", label: "Devices" },
      { href: "/careers", label: "Careers" },
      { href: "/news-articles", label: "Articles" },
      { href: "/book-now", label: "Contact Us" },
    ],
    categories: {
      "تجميل الوجه": "Facial Aesthetics",
      "نضارة البشرة": "Skin Radiance",
      "الجسم": "Body",
      "الشعر": "Hair",
      "عروض": "Offers",
    },
    socials: {
      instagram: "Instagram",
      tiktok: "TikTok",
      snapchat: "Snapchat",
      x: "X",
    },
    copyrightPrefix: "© ",
    copyrightSuffix: " Dr. Maha Dahlan Clinics. All rights reserved.",
    disclaimer:
      "The content here is for general awareness and is not a substitute for medical advice. Results vary from one case to another.",
  },
  sticky: { book: "Book Now", whatsappAria: "Chat on WhatsApp" },
  backToTop: "Back to top",
};

export const DICT: Record<Locale, Dict> = { ar: AR, en: EN };

/** Server-safe accessor (client components use `useLocale()` instead). */
export function getDict(locale: Locale = DEFAULT_LOCALE): Dict {
  return DICT[locale];
}

/* ——— English copy for the treatment cards (Arabic lives in `config.ts`) ——— */

export const SPECIALTIES_EN: Record<string, SpecialtyCopy> = {
  botox: {
    title: "Botox and Fillers",
    description:
      "Measured doses by a certified consultant smooth lines and restore balance to your features, while fully preserving your expressions.",
    tag: "Results from the first session",
  },
  "neck-lift": {
    title: "Neck and Jawline Lift",
    description:
      "Threads, HIFU, Nefertiti Botox and jawline filler, for a firmer neck and a defined jawline without surgery.",
    tag: "No surgery",
  },
  "facial-atrophy": {
    title: "Facial Volume Loss After Weight Loss",
    description:
      "Lost weight successfully? We restore your face's fullness and glow with fillers, collagen stimulators and threads, in a plan drawn for your features alone.",
    tag: "Restored fullness",
  },
  "dark-circles": {
    title: "Dark Circles and Under-Eye Pigmentation",
    description:
      "A precise programme for the most delicate area of the face that evens tone, softens hollows and brings back a brighter look.",
    tag: "A brighter look",
  },
  acne: {
    title: "Acne and Acne Scar Treatment",
    description:
      "A step-by-step protocol that stops new breakouts first, then treats their scars with the latest certified medical lasers.",
    tag: "Certified medical laser",
  },
  hyperpigmentation: {
    title: "Pigmentation and Melasma Treatment",
    description:
      "Gentle sessions, pure ingredients and a personal plan drawn by your doctor, to restore your skin's clear, even tone.",
    tag: "Even tone",
  },
  "glass-skin": {
    title: "Korean Glass Skin",
    description:
      "Deep cleansing, gentle exfoliation and intensive hydration in a single session, for glass-like skin that glows from within.",
    tag: "No needles",
  },
  "korean-spicules": {
    title: "Korean Spicules",
    description:
      "Natural micro-needles from sea sponge open thousands of tiny channels and stimulate collagen, no device required.",
    tag: "100% natural",
  },
  "microneedling-rf": {
    title: "Radiofrequency Microneedling",
    description:
      "Targeted heat beneath the skin's surface tightens from within, refines pores and improves texture session after session.",
    tag: "Tightening from within",
  },
  facial: {
    title: "HydraFacial and Skincare",
    description:
      "A complete package of deep-cleansing and HydraFacial sessions, for instant radiance you can see before you leave the clinic.",
    tag: "Instant radiance",
  },
  hair: {
    title: "Hair Loss Treatment",
    description:
      "Regenera Evo, PRP, mesotherapy and exosomes, to stop hair loss and restore density with a clear medical plan.",
    tag: "Density restored",
  },
  body: {
    title: "HIFEM Body Sculpting",
    description:
      "A single session equals thousands of muscle contractions, burning localised fat and toning muscles without surgery.",
    tag: "No downtime",
  },
  stretchmarks: {
    title: "Stretch Marks",
    description:
      "Hybrid collagen-stimulating filler and calcium filler rebuild the skin and gradually soften stretch marks.",
    tag: "Collagen stimulators",
  },
  "eid-offer": {
    title: "Eid Al Adha Offer",
    description:
      "Golden discounts on HydraFacial, Botox, fillers, dark-circle treatment and hair and skin treatments.",
    tag: "Up to 40% off",
  },
};

/** Card copy for a treatment in the given locale (falls back to the Arabic entry). */
export function specialtyCopy(
  slug: string,
  locale: Locale = DEFAULT_LOCALE,
): SpecialtyCopy {
  if (locale !== "ar") {
    const en = SPECIALTIES_EN[slug];
    if (en) return en;
  }
  const base = SPECIALTIES.find((s) => s.slug === slug);
  return base
    ? { title: base.title, description: base.description, tag: base.tag }
    : { title: slug, description: "", tag: "" };
}
