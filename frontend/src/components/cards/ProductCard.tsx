import Image from "next/image";
import { Star } from "lucide-react";
import type { Product } from "@/types/product";
import { formatCurrency } from "@/utils/currency";
import type { Locale } from "@/i18n/messages";

type ProductCardProps = Product & {
  locale: Locale;
  ratingLabel: string;
};

export function ProductCard({
  name,
  origin,
  price,
  rating,
  image,
  locale,
  ratingLabel,
}: ProductCardProps) {
  const formattedRating = new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(rating);

  return (
    <article className="group overflow-hidden rounded-2xl bg-soft-white shadow-md transition-shadow duration-300 hover:shadow-xl">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={image}
          alt={`${name} — ${origin}`}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>
      <div className="space-y-xs p-md">
        <div className="flex items-start justify-between gap-sm">
          <h3 className="font-heading text-lg text-coffee-dark">{name}</h3>
          <span className="font-heading text-lg text-coffee-brown">
            {formatCurrency(price, "USD", locale === "fa" ? "fa-IR" : "en-US")}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm text-coffee-brown/80">
          <span>{origin}</span>
          <span
            className="flex items-center gap-xs"
            aria-label={ratingLabel.replace("{rating}", formattedRating)}
          >
            <Star className="size-4 fill-premium-gold text-premium-gold" aria-hidden="true" />
            {formattedRating}
          </span>
        </div>
      </div>
    </article>
  );
}
