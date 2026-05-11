import Image from "next/image";
import BeforeAfter from "./_components/BeforeAfter";
import ContactForm from "./_components/ContactForm";
import HeroCanvas from "./_components/HeroCanvas";
import Nav from "./_components/Nav";
import ScrollAnimations from "./_components/ScrollAnimations";

export default function HyperpigmentationLanding() {
  return (
    <>
      <ScrollAnimations />

      <Nav />

      {/* ════════════ HERO ════════════ */}
      <header className="hero">
        <HeroCanvas />

        <div className="hero-content">
          <div className="hero-eyebrow eyebrow">
            عيادة مهادهلان · علاج التصبّغات
          </div>
          <h1 className="h-display">
            بشرة <em>صافية</em>،
            <br />
            تستحق أن تُروى
            <br />
            من جديد.
          </h1>
          <p className="lead">
            برنامج علاج التصبّغات في مهادهلان مصمَّم خصيصاً لكِ — جلسات هادئة،
            مكوّنات نقية، وخطة شخصية ترسمها طبيبتنا لتعيد إلى وجهكِ توازنه
            الطبيعي ولونه الصافي.
          </p>
          <div className="hero-actions">
            <a href="#cta" className="btn btn-gold">
              احصلي على خطتكِ الشخصية
              <span className="arrow" />
            </a>
            <a href="#process" className="btn btn-ghost">
              تعرّفي على المراحل
            </a>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-num">٩٤٪</span>
              <span className="stat-label">رضا العميلات</span>
            </div>
            <div className="stat">
              <span className="stat-num">+١٢</span>
              <span className="stat-label">سنة خبرة</span>
            </div>
            <div className="stat">
              <span className="stat-num">٢٨٠٠</span>
              <span className="stat-label">جلسة ناجحة</span>
            </div>
          </div>
        </div>

        <div className="hero-visual parallax-soft">
          <div className="deco-circle c1" />
          <div className="ph-main">
            <Image
              src="/hyperpigmentation/afterbeforehero.png"
              alt="نتائج علاج التصبّغات — قبل وبعد"
              fill
              priority
              sizes="(max-width: 980px) 90vw, 45vw"
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="hero-badge">
            <div className="stars">★★★★★</div>
            <div className="hero-badge-text">
              <strong>٤٫٩ / ٥</strong>
              <span>تقييم العميلات</span>
            </div>
          </div>
          <div className="hero-badge-2">
            <span className="num">+٢٠٠٠</span>
            <span className="lbl">عميلة سعيدة</span>
          </div>
        </div>
      </header>

      {/* ════════════ PROBLEM ════════════ */}
      <section className="problem" id="problem">
        <div className="problem-grid">
          <div className="problem-text">
            <div className="eyebrow reveal" style={{ marginBottom: 28 }}>
              ما هو التصبّغ
            </div>
            <h2 className="h-section reveal">
              حين تفقد البشرة <em>توازنها</em>، يظهر اللون.
            </h2>
            <p className="lead reveal">
              التصبّغ ليس عيباً — هو إشارة من بشرتكِ. تراكم الميلانين، آثار
              الشمس، التغيّرات الهرمونية أو ما تخلّفه الندبات. كلّ نوع له
              قصّته، ولكلّ قصّة علاجها الخاص في مهادهلان.
            </p>
            <ul className="problem-list">
              <li>
                <span className="num">١</span>
                <div>
                  <strong>الكَلَف (Melasma)</strong>
                  <p>
                    بقع متناظرة على الوجنتين والجبهة، غالباً مرتبطة بالهرمونات
                    والشمس.
                  </p>
                </div>
              </li>
              <li>
                <span className="num">٢</span>
                <div>
                  <strong>التصبّغ الشمسي</strong>
                  <p>
                    نقاط بُنية يخلّفها التعرّض المتكرر للشمس على البشرة المكشوفة.
                  </p>
                </div>
              </li>
              <li>
                <span className="num">٣</span>
                <div>
                  <strong>التصبّغ بعد الالتهاب</strong>
                  <p>
                    أثر يبقى بعد الحبوب أو الجروح، ويمكن تفتيحه بخطة دقيقة.
                  </p>
                </div>
              </li>
            </ul>
          </div>
          <div className="problem-visual parallax-soft">
            <div className="problem-photo">
              <Image
                src="/hyperpigmentation/zoomin.png"
                alt="دراسة قرب لملمس البشرة وتدرّج اللون"
                fill
                sizes="(max-width: 900px) 90vw, 45vw"
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="problem-photo small">
              <Image
                src="/hyperpigmentation/doc.png"
                alt="تفصيل — قطّارة سيروم ذهبي"
                fill
                sizes="(max-width: 900px) 50vw, 22vw"
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ PROCESS ════════════ */}
      <section id="process">
        <div className="section-head">
          <div className="eyebrow reveal">مراحل العلاج</div>
          <h2 className="h-section reveal">
            رحلتكِ في <em>أربع</em> خطوات هادئة
          </h2>
          <p className="lead reveal">
            من الاستشارة الأولى إلى نتيجة دائمة — كل مرحلة مدروسة، وكل جلسة
            مخصّصة لكِ.
          </p>
        </div>
        <div className="process-grid">
          <div className="process-card">
            <div className="process-num">01</div>
            <h3>استشارة وتشخيص</h3>
            <p>
              لقاء أوّل مع طبيبتكِ لفحص البشرة، تحليل نوع التصبّغ، وفهم تاريخكِ
              الصحي.
            </p>
          </div>
          <div className="process-card">
            <div className="process-num">02</div>
            <h3>خطة شخصية</h3>
            <p>
              برنامج مصمَّم خصيصاً لكِ، يجمع بين الجلسات والمكوّنات النقية
              الملائمة لبشرتكِ.
            </p>
          </div>
          <div className="process-card">
            <div className="process-num">03</div>
            <h3>الجلسات العلاجية</h3>
            <p>
              جلسات لطيفة في أجواء هادئة، باستخدام تقنيات حديثة بإشراف طبي
              مستمر.
            </p>
          </div>
          <div className="process-card">
            <div className="process-num">04</div>
            <h3>متابعة ووقاية</h3>
            <p>
              روتين منزلي ومتابعة دورية لحماية النتيجة والحفاظ على صفاء البشرة
              طويلاً.
            </p>
          </div>
        </div>
      </section>

      <div className="divider" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" />
        </svg>
      </div>

      {/* ════════════ RESULTS ════════════ */}
      <section className="results" id="results">
        <div className="section-head">
          <div className="eyebrow reveal">قبل وبعد</div>
          <h2 className="h-section reveal">
            نتائج <em>حقيقية</em> من عميلاتنا
          </h2>
          <p className="lead reveal">
            صور موثّقة بإذن من العميلات، تُظهر أثر برنامجنا خلال أسابيع قليلة.
          </p>
        </div>
        <div className="results-grid">
          <div className="result-card">
            <BeforeAfter
              beforeSrc="/hyperpigmentation/beforeafter/before1.png"
              afterSrc="/hyperpigmentation/beforeafter/after1.png"
              beforeAlt="قبل — لون غير متجانس"
              afterAlt="بعد — لون موحّد ومُشرق"
            />
            <div className="result-meta">
              <strong>الكَلَف الهرموني</strong>
              <span>٨ أسابيع</span>
            </div>
          </div>
          <div className="result-card">
            <BeforeAfter
              beforeSrc="/hyperpigmentation/beforeafter/before2.png"
              afterSrc="/hyperpigmentation/beforeafter/after2.png"
              beforeAlt="قبل — بقع شمسية"
              afterAlt="بعد — بشرة صافية مشرقة"
            />
            <div className="result-meta">
              <strong>تصبّغ شمسي</strong>
              <span>٦ أسابيع</span>
            </div>
          </div>
          <div className="result-card">
            <BeforeAfter
              beforeSrc="/hyperpigmentation/beforeafter/before3.png"
              afterSrc="/hyperpigmentation/beforeafter/after3.png"
              beforeAlt="قبل — آثار حبوب"
              afterAlt="بعد — ملمس ولون متجانس"
            />
            <div className="result-meta">
              <strong>أثر ما بعد الحبوب</strong>
              <span>١٠ أسابيع</span>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ SPECIALIST ════════════ */}
      <section id="specialist">
        <div className="specialist-grid">
          <div className="specialist-visual parallax-soft">
            <div className="specialist-photo">
              <Image
                src="/hyperpigmentation/doc.png"
                alt="د. مها دهلان"
                fill
                sizes="(max-width: 900px) 90vw, 40vw"
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
          <div className="specialist-text">
            <div className="eyebrow reveal">الطبيبة المختصة</div>
            <h2 className="spec-name reveal">
              د. <em>مها</em> دهلان
            </h2>
            <p className="spec-role reveal">استشارية الأمراض الجلدية والتجميل</p>
            <p className="spec-bio reveal">
              «إيماني الراسخ أنّ العناية بالبشرة هي حوار طويل بين الطبيب
              والعميلة — ليست وصفة، بل خطة تُرسم بهدوء، وتُطبَّق بصبر، وتُعاش
              بثقة.»
            </p>
            <div className="spec-creds">
              <div className="spec-cred">
                <strong>+١٢</strong>
                <span>سنة في علاج التصبّغات</span>
              </div>
              <div className="spec-cred">
                <strong>+٢٨٠٠</strong>
                <span>حالة تمت متابعتها</span>
              </div>
              <div className="spec-cred">
                <strong>زمالة</strong>
                <span>الكلية الملكية البريطانية</span>
              </div>
              <div className="spec-cred">
                <strong>عضوة</strong>
                <span>الجمعية الأوروبية للجلدية</span>
              </div>
            </div>
            <div className="spec-sig reveal">— Dr. Maha</div>
          </div>
        </div>
      </section>

      {/* ════════════ TESTIMONIALS ════════════ */}
      <section className="testimonials">
        <div className="section-head">
          <div className="eyebrow reveal">شهادات العميلات</div>
          <h2 className="h-section reveal">
            ثقة <em>تُروى</em> بأصواتهنّ
          </h2>
        </div>
        <div className="testi-grid">
          <div className="testi-card">
            <div className="testi-stars">★★★★★</div>
            <p className="testi-text">
              تجربة هادئة ومهنية. منذ الجلسة الأولى شعرت أن الطبيبة تستمع لي قبل
              أن تعالجني. النتيجة بعد شهرين فاقت كل توقعاتي.
            </p>
            <div className="testi-meta">
              <div className="testi-avatar" />
              <div>
                <strong>سارة م.</strong>
                <span>الرياض · علاج الكَلَف</span>
              </div>
            </div>
          </div>
          <div className="testi-card">
            <div className="testi-stars">★★★★★</div>
            <p className="testi-text">
              كنت أبحث عن مكان أثق به لسنوات. مهادهلان أعاد لي علاقتي ببشرتي —
              برنامج مدروس، ومتابعة لا تنقطع.
            </p>
            <div className="testi-meta">
              <div className="testi-avatar" />
              <div>
                <strong>نورة ع.</strong>
                <span>جدة · تصبّغ شمسي</span>
              </div>
            </div>
          </div>
          <div className="testi-card">
            <div className="testi-stars">★★★★★</div>
            <p className="testi-text">
              أكثر ما أحببته هو الصدق في التشخيص. لم يَعِدوني بمعجزات، بل برحلة
              واضحة. واليوم أرى الفرق في المرآة كل صباح.
            </p>
            <div className="testi-meta">
              <div className="testi-avatar" />
              <div>
                <strong>ريم خ.</strong>
                <span>الدمام · أثر الحبوب</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ FAQ ════════════ */}
      <section id="faq">
        <div className="section-head">
          <div className="eyebrow reveal">أسئلة شائعة</div>
          <h2 className="h-section reveal">
            إجابات قبل أن <em>تسألي</em>
          </h2>
        </div>
        <div className="faq-wrap">
          <details className="faq-item" open>
            <summary className="faq-q">
              كم تستغرق رؤية النتائج الأولى؟
              <span className="faq-icon" />
            </summary>
            <div className="faq-a">
              تظهر بوادر التحسّن عادةً بعد ٣ إلى ٤ جلسات، أي ما يقارب ٦
              أسابيع. النتيجة الكاملة ترتبط بنوع التصبّغ والالتزام بالخطة
              المنزلية.
            </div>
          </details>
          <details className="faq-item">
            <summary className="faq-q">
              هل الجلسات مؤلمة؟
              <span className="faq-icon" />
            </summary>
            <div className="faq-a">
              لا. جميع جلساتنا لطيفة وآمنة، وقد تشعرين فقط بدفء خفيف أو وخز
              بسيط لحظات قليلة.
            </div>
          </details>
          <details className="faq-item">
            <summary className="faq-q">
              هل أحتاج لفترة نقاهة بعد الجلسة؟
              <span className="faq-icon" />
            </summary>
            <div className="faq-a">
              غالباً لا. يمكنكِ العودة إلى يومكِ مباشرة، مع الالتزام بواقي
              الشمس والروتين الذي تصفه طبيبتكِ.
            </div>
          </details>
          <details className="faq-item">
            <summary className="faq-q">
              هل النتائج دائمة؟
              <span className="faq-icon" />
            </summary>
            <div className="faq-a">
              النتيجة طويلة الأمد إذا التزمتِ بالحماية من الشمس والروتين الموصى
              به. التصبّغ قد يعود إن لم تُحمَ البشرة، لذا المتابعة جزء أساسي من
              البرنامج.
            </div>
          </details>
          <details className="faq-item">
            <summary className="faq-q">
              هل البرنامج مناسب لجميع أنواع البشرة؟
              <span className="faq-icon" />
            </summary>
            <div className="faq-a">
              نعم. نُصمّم خطة مختلفة لكل نوع بشرة بعد التشخيص الأوّلي مع
              الطبيبة.
            </div>
          </details>
          <details className="faq-item">
            <summary className="faq-q">
              كيف أحجز موعد الاستشارة الأولى؟
              <span className="faq-icon" />
            </summary>
            <div className="faq-a">
              املئي النموذج في الأسفل، أو اتصلي بنا مباشرة. سنتواصل خلال ٢٤
              ساعة لتحديد أنسب وقت لكِ.
            </div>
          </details>
        </div>
      </section>

      {/* ════════════ CTA + FORM ════════════ */}
      <section className="cta" id="cta">
        <div className="cta-grid">
          <div>
            <div className="eyebrow reveal">احجزي استشارتكِ</div>
            <h2 className="h-section reveal">
              ابدئي رحلتكِ نحو <em>بشرة صافية</em>.
            </h2>
            <p className="cta-lead reveal">
              املئي النموذج وستتواصل معكِ مستشارتنا خلال ٢٤ ساعة لتحديد موعد
              الاستشارة الأولى ورسم خطتكِ الشخصية.
            </p>
            <div className="cta-contact">
              <div className="cta-contact-item">
                <span className="cta-icon">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </span>
                <span>
                  جدة، حي الروضة، شارع الأمير محمد بن عبدالعزيز (التحلية)،
                  مركز بن حمران - الدور الثالث
                </span>
              </div>
              <div className="cta-contact-item">
                <span className="cta-icon">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <path d="m22 6-10 7L2 6" />
                  </svg>
                </span>
                <a href="mailto:info@mahadahlan.com">info@mahadahlan.com</a>
              </div>
              <div className="cta-contact-item">
                <span className="cta-icon">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </span>
                <a href="tel:+966920007515" dir="ltr">
                  +966 920007515
                </a>
              </div>
              <div className="cta-contact-item">
                <span className="cta-icon">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M20.52 3.48A11.78 11.78 0 0 0 12.06 0C5.5 0 .17 5.33.17 11.89a11.83 11.83 0 0 0 1.59 5.94L0 24l6.34-1.66a11.88 11.88 0 0 0 5.72 1.46h.01c6.55 0 11.89-5.33 11.89-11.89a11.82 11.82 0 0 0-3.44-8.43Zm-8.46 18.27h-.01a9.86 9.86 0 0 1-5.03-1.38l-.36-.21-3.76.99 1-3.66-.23-.38a9.85 9.85 0 0 1-1.51-5.22c0-5.45 4.44-9.89 9.9-9.89 2.65 0 5.13 1.03 7 2.9a9.83 9.83 0 0 1 2.9 7c0 5.45-4.44 9.85-9.9 9.85Zm5.43-7.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01a1.1 1.1 0 0 0-.8.37 3.36 3.36 0 0 0-1.04 2.49c0 1.47 1.07 2.89 1.22 3.09.15.2 2.1 3.21 5.09 4.5.71.31 1.27.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35Z" />
                  </svg>
                </span>
                <a
                  href="https://wa.me/966503377702"
                  target="_blank"
                  rel="noopener noreferrer"
                  dir="ltr"
                >
                  +966 503377702
                  <span className="wa-tag">واتساب</span>
                </a>
              </div>
            </div>
          </div>

          <ContactForm />
        </div>
      </section>

      {/* ════════════ FOOTER ════════════ */}
      <footer>
        <div>© ٢٠٢٦ مهادهلان · جميع الحقوق محفوظة</div>
        <div>
          <a href="#">سياسة الخصوصية</a>
          <a href="#">شروط الاستخدام</a>
          <a href="#">إنستغرام</a>
        </div>
      </footer>
    </>
  );
}
