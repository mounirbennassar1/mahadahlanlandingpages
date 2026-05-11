import type { Metadata } from "next";
import "./landing.css";

export const metadata: Metadata = {
  title: "عيادة مها دحلان | البوتوكس والفيلر",
  description:
    "عيادة مها دحلان لتجميل الوجه — بوتوكس، فيلر جلدي، وتجديد البشرة بأيدي خبراء معتمدين.",
};

export default function BotoxLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="botox-landing">{children}</div>;
}
