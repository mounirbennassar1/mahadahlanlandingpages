type Props = {
  tokenPrefix: string;
};

export function ConsentNote({ tokenPrefix }: Props) {
  return (
    <p
      style={{ color: `var(--color-${tokenPrefix}-muted)` }}
      className="text-center text-xs leading-relaxed"
    >
      بياناتكِ محمية وتُستخدم فقط للتواصل بشأن استشارتكِ.
    </p>
  );
}
