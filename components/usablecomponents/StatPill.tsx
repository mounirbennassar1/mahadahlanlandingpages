type Props = {
  tokenPrefix: string;
  num: string;
  label: string;
};

export function StatPill({ tokenPrefix, num, label }: Props) {
  return (
    <div className="flex flex-col">
      <span
        style={{ color: `var(--color-${tokenPrefix}-ink)` }}
        className="text-2xl font-bold"
      >
        {num}
      </span>
      <span
        style={{ color: `var(--color-${tokenPrefix}-ink-soft)` }}
        className="text-[10px] uppercase tracking-widest sm:text-xs"
      >
        {label}
      </span>
    </div>
  );
}
