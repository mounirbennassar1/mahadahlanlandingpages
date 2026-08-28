import Link from "next/link";
import { Icon } from "@/components/icons";
import { Section, SectionHead } from "@/app/_home/Sections";
import { RevealGroup } from "@/app/_home/Motion";

export type OtherServiceGroup = {
  group: string;
  items: { slug: string; name: string }[];
};

/**
 * Compact chip list of the booking services that do not have a treatment
 * page of their own. Each chip preselects the service on /book-now.
 */
export function OtherServices({ groups }: { groups: OtherServiceGroup[] }) {
  if (!groups.length) return null;

  return (
    <Section id="other-services" className="relative bg-[var(--color-md-bg)]">
      <SectionHead
        eyebrow="خدمات أخرى"
        title="خدمات أخرى"
        gold="نقدّمها في العيادة"
        body="خدمات نقدّمها داخل العيادة ولا تحتاج إلى صفحة مستقلة. اختاري ما يناسبكِ وسنحدد لكِ الموعد مباشرة من نموذج الحجز."
      />

      <RevealGroup className="mt-12 flex flex-col gap-8" stagger={0.08}>
        {groups.map((g) => (
          <div key={g.group}>
            <h3 className="mb-3.5 inline-flex items-center gap-2 text-[0.82rem] font-extrabold text-[var(--color-md-champagne)]">
              <span className="size-1.5 rounded-full bg-[var(--color-md-gold)]" aria-hidden />
              {g.group}
            </h3>
            <ul className="flex flex-wrap gap-2.5">
              {g.items.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/book-now?service=${encodeURIComponent(s.slug)}`}
                    className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--color-md-line)] bg-[var(--color-md-card)] px-4 py-2 text-[0.86rem] font-bold text-[rgba(246,238,223,0.8)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[rgba(232,195,106,0.55)] hover:text-[var(--color-md-champagne)] hover:shadow-[0_0_24px_-10px_rgba(232,195,106,0.5)]"
                  >
                    <Icon.CalendarCheck
                      className="size-3.5 text-[var(--color-md-champagne)] transition-transform duration-300 group-hover:scale-110"
                      strokeWidth={2.2}
                      aria-hidden
                    />
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </RevealGroup>
    </Section>
  );
}
