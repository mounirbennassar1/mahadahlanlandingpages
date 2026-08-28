/** Plain, client-safe projection of a Prisma `Offer` (prices pre-formatted on the server). */
export type OfferItem = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  price: number;
  priceLabel: string;
  oldPriceLabel: string | null;
  /** Rounded % saved versus `oldPrice`, when the old price is higher. */
  savePercent: number | null;
  badge: string | null;
  category: string | null;
  image: string | null;
  imageAlt: string | null;
};
