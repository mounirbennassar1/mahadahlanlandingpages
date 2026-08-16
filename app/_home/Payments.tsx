import { Icon } from "@/components/icons";
import { PayLogo } from "./PayLogo";

const PROVIDERS = [
  {
    id: "tabby",
    title: "قسّطيها مع تابي",
    body: "قسّمي قيمة جلستك على ٤ دفعات متساوية بدون فوائد وبدون رسوم تأخير خفية.",
  },
  {
    id: "tamara",
    title: "أو مع تمارا",
    body: "ادفعي لاحقاً أو على دفعات مرنة، بموافقة فورية داخل العيادة وبلا تعقيد.",
  },
] as const;

const PERKS = [
  "٤ دفعات متساوية بدون فوائد",
  "موافقة فورية عند الاستقبال",
  "بدون بطاقة ائتمانية",
];

/** Split-payment section: Tabby + Tamara cards with a perks row. */
export function Payments() {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:gap-6">
      {PROVIDERS.map((p) => (
        <article
          key={p.id}
          className="group relative overflow-hidden rounded-[26px] border border-[var(--color-md-line)] bg-[var(--color-md-card)] p-7 transition-all duration-400 hover:-translate-y-1.5 hover:border-[rgba(232,195,106,0.5)] hover:shadow-[0_0_44px_-12px_rgba(232,195,106,0.4)] sm:p-8"
        >
          <div
            className="pointer-events-none absolute -top-20 -left-14 size-52 rounded-full blur-[36px] opacity-60 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(circle, rgba(232,195,106,.2), transparent 70%)",
            }}
            aria-hidden
          />

          <div className="relative flex items-center justify-between gap-4">
            <PayLogo
              brand={p.id}
              height={44}
              className="shadow-[0_10px_26px_-12px_rgba(0,0,0,0.8)]"
            />
            <span
              className="inline-flex size-10 items-center justify-center rounded-full border border-[var(--color-md-line-strong)] text-[var(--color-md-champagne)]"
              aria-hidden
            >
              <Icon.CreditCard className="size-[18px]" strokeWidth={1.9} />
            </span>
          </div>

          <h3 className="relative mt-6 text-[1.15rem] font-extrabold text-[var(--color-md-text)]">
            {p.title}
          </h3>
          <p className="relative mt-2.5 text-[0.93rem] leading-[1.9] font-light text-[rgba(246,238,223,0.6)]">
            {p.body}
          </p>
        </article>
      ))}

      <ul className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3 md:col-span-2">
        {PERKS.map((perk) => (
          <li
            key={perk}
            className="inline-flex items-center gap-2 text-[0.86rem] font-bold text-[rgba(246,238,223,0.65)]"
          >
            <Icon.Check
              className="size-4 text-[var(--color-md-champagne)]"
              strokeWidth={3}
            />
            {perk}
          </li>
        ))}
      </ul>
    </div>
  );
}
