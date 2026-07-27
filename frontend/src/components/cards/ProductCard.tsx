import Image from "next/image";
import { ArrowUpRight, ShoppingBag, Star } from "lucide-react";
import type { Product } from "@/types/product";
import { formatCurrency } from "@/utils/currency";
import type { Locale } from "@/i18n/messages";

type ProductCardProps = Product & {
  locale: Locale;
  ratingLabel: string;
  bagWeight: string;
  viewDetails: string;
  addToCart: string;
  onViewDetails: () => void;
  onAddToCart: () => void;
};

export function ProductCard({
  name,
  origin,
  price,
  rating,
  image,
  weightGrams,
  locale,
  ratingLabel,
  bagWeight,
  viewDetails,
  addToCart,
  onViewDetails,
  onAddToCart,
}: ProductCardProps) {
  const numberLocale = locale === "fa" ? "fa-IR" : "en-US";
  const formattedRating = new Intl.NumberFormat(numberLocale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(rating);
  const formattedWeight = new Intl.NumberFormat(numberLocale).format(weightGrams);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-coffee-dark/8 bg-soft-white shadow-[0_18px_60px_rgba(27,18,13,0.08)] transition-[transform,box-shadow] duration-500 ease-(--ease-nevora) hover:-translate-y-1.5 hover:shadow-[0_28px_80px_rgba(27,18,13,0.14)]">
      <button
        type="button"
        className="relative block aspect-[4/4.25] w-full overflow-hidden text-start focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-premium-gold"
        aria-label={`${viewDetails}: ${name}`}
        onClick={onViewDetails}
      >
        <Image
          src={image}
          alt={`${name} — ${origin}`}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-(--ease-nevora) group-hover:scale-[1.045]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-coffee-dark/45 via-transparent to-coffee-dark/8" />
        <div className="absolute inset-x-sm top-sm flex items-center justify-between gap-xs">
          <span className="rounded-full border border-cream/28 bg-coffee-dark/36 px-sm py-xs text-[0.62rem] tracking-[0.16em] text-cream uppercase backdrop-blur-md">
            {origin}
          </span>
          <span className="rounded-full border border-cream/28 bg-cream/88 px-sm py-xs text-[0.62rem] font-medium text-coffee-dark backdrop-blur-md">
            {bagWeight.replace("{weight}", formattedWeight)}
          </span>
        </div>
        <span className="absolute bottom-sm end-sm grid size-11 place-items-center rounded-full border border-cream/35 bg-cream/92 text-coffee-dark transition-transform duration-500 group-hover:rotate-12 group-hover:scale-105">
          <ArrowUpRight className="size-4.5" aria-hidden="true" />
        </span>
      </button>

      <div className="flex flex-1 flex-col p-md">
        <div className="flex flex-col gap-xs min-[420px]:flex-row min-[420px]:items-start min-[420px]:justify-between min-[420px]:gap-sm">
          <h3 className="min-w-0 break-words font-heading text-lg text-coffee-dark">{name}</h3>
          <span className="shrink-0 font-heading text-lg text-coffee-brown">
            {formatCurrency(price, "USD", numberLocale)}
          </span>
        </div>
        <div className="mt-xs flex flex-wrap items-center justify-between gap-xs text-sm text-coffee-brown/80">
          <span>{origin}</span>
          <span
            className="flex items-center gap-xs"
            aria-label={ratingLabel.replace("{rating}", formattedRating)}
          >
            <Star className="size-4 fill-premium-gold text-premium-gold" aria-hidden="true" />
            {formattedRating}
          </span>
        </div>

        <div className="mt-auto grid grid-cols-[1fr_auto] gap-xs border-t border-coffee-dark/8 pt-sm">
          <button
            type="button"
            className="min-h-11 rounded-full border border-coffee-dark/12 px-sm text-sm font-medium text-coffee-brown transition-colors hover:border-premium-gold hover:bg-premium-gold/8 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-premium-gold"
            onClick={onViewDetails}
          >
            {viewDetails}
          </button>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full bg-coffee-dark text-cream transition-[background-color,transform] hover:scale-105 hover:bg-coffee-brown focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-premium-gold"
            aria-label={`${addToCart}: ${name}`}
            onClick={onAddToCart}
          >
            <ShoppingBag className="size-4.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}
