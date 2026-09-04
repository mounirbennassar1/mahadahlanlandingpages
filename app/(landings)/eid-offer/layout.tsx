import "./landing.css";

export default function EidOfferLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="eid-landing" dir="rtl" lang="ar">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&display=swap"
        rel="stylesheet"
      />
      {children}
    </div>
  );
}
