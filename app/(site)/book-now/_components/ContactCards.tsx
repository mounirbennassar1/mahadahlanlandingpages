import { LuMail } from "react-icons/lu";
import { Icon, SocialIcon } from "@/components/icons";
import { RevealGroup } from "@/app/_home/Motion";
import {
  MAPS_DIRECTIONS_LINK,
  PHONE_DISPLAY,
  TEL_LINK,
  WA_LINK,
} from "@/app/_home/config";
import { CLINIC_ADDRESS, CLINIC_EMAIL } from "../../_booking/shared";
import type { ContentOf } from "@/lib/pages/define";
import type { BOOK_NOW } from "../content";

type ContactCopy = ContentOf<typeof BOOK_NOW>["contact"];

/** Four contact tiles: phone, WhatsApp, email, address. */
export function ContactCards({ copy }: { copy: ContactCopy }) {
  const cards = [
    {
      key: "phone",
      title: copy.phoneTitle,
      body: copy.phoneBody,
      value: PHONE_DISPLAY,
      valueDir: "ltr" as const,
      href: TEL_LINK,
      external: false,
      icon: <Icon.Phone className="size-[22px]" strokeWidth={1.9} />,
    },
    {
      key: "whatsapp",
      title: copy.whatsappTitle,
      body: copy.whatsappBody,
      value: copy.whatsappAction,
      valueDir: "rtl" as const,
      href: WA_LINK,
      external: true,
      icon: <SocialIcon name="whatsapp" className="text-[22px]" />,
    },
    {
      key: "email",
      title: copy.emailTitle,
      body: copy.emailBody,
      value: CLINIC_EMAIL,
      valueDir: "ltr" as const,
      href: `mailto:${CLINIC_EMAIL}`,
      external: false,
      icon: <LuMail className="size-[22px]" />,
    },
    {
      key: "address",
      title: copy.addressTitle,
      body: CLINIC_ADDRESS,
      value: copy.addressAction,
      valueDir: "rtl" as const,
      href: MAPS_DIRECTIONS_LINK,
      external: true,
      icon: <Icon.MapPin className="size-[22px]" strokeWidth={1.9} />,
    },
  ];

  return (
    <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
      {cards.map((c) => (
        <a
          key={c.key}
          href={c.href}
          target={c.external ? "_blank" : undefined}
          rel={c.external ? "noopener noreferrer" : undefined}
          className="group flex flex-col rounded-[24px] border border-[var(--color-md-line)] bg-[var(--color-md-card)] p-6 transition-[transform,border-color,box-shadow] duration-400 hover:-translate-y-1.5 hover:border-[rgba(232,195,106,0.5)] hover:shadow-[0_0_40px_-14px_rgba(232,195,106,0.45)]"
        >
          <span className="mb-4 inline-flex size-12 items-center justify-center rounded-2xl border border-[var(--color-md-line)] bg-[rgba(232,195,106,0.08)] text-[var(--color-md-champagne)] transition-transform duration-400 group-hover:scale-110">
            {c.icon}
          </span>
          <h3 className="text-[1.02rem] font-extrabold text-[var(--color-md-text)]">{c.title}</h3>
          <p className="mt-1.5 text-[0.86rem] leading-[1.8] font-light text-[rgba(246,238,223,0.58)]">
            {c.body}
          </p>
          <span
            dir={c.valueDir}
            className="mt-auto inline-flex items-center gap-1.5 pt-4 text-[0.9rem] font-extrabold text-[var(--color-md-champagne)] transition-colors group-hover:text-[var(--color-md-neon)]"
          >
            {c.value}
            {c.valueDir === "rtl" ? (
              <Icon.ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" strokeWidth={2.4} />
            ) : null}
          </span>
        </a>
      ))}
    </RevealGroup>
  );
}
