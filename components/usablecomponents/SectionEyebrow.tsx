import type { ComponentType, SVGProps } from "react";
import { Icon } from "@/components/icons";

type Props = {
  tokenPrefix: string;
  children: React.ReactNode;
  icon?: keyof typeof Icon;
};

export function SectionEyebrow({ tokenPrefix, children, icon }: Props) {
  const IconCmp = (icon ? Icon[icon] : Icon.Sparkles) as ComponentType<
    SVGProps<SVGSVGElement> & { className?: string }
  >;

  return (
    <span
      style={{
        borderColor: `color-mix(in oklab, var(--color-${tokenPrefix}-primary) 25%, transparent)`,
        background: `color-mix(in oklab, var(--color-${tokenPrefix}-primary) 5%, transparent)`,
        color: `var(--color-${tokenPrefix}-primary-dim)`,
      }}
      className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold tracking-[0.22em]"
    >
      <IconCmp className="size-3.5" />
      {children}
    </span>
  );
}
