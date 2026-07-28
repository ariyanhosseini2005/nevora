"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Plus, Star, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import type { Product } from "@/types/product";
import type { Locale } from "@/i18n/messages";
import { formatCurrency } from "@/utils/currency";

type LocalizedProduct = {
  name: string;
  origin: string;
  description: string;
  notes: string[];
  roast: string;
  process: string;
};

type ProductQuickViewProps = {
  product: Product | null;
  localized: LocalizedProduct | null;
  locale: Locale;
  ratingLabel: string;
  bagWeight: string;
  tastingNotes: string;
  roastLabel: string;
  processLabel: string;
  addToCart: string;
  closeLabel: string;
  onClose: () => void;
  onAddToCart: (productId: string) => void;
};

export function ProductQuickView({
  product,
  localized,
  locale,
  ratingLabel,
  bagWeight,
  tastingNotes,
  roastLabel,
  processLabel,
  addToCart,
  closeLabel,
  onClose,
  onAddToCart,
}: ProductQuickViewProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const isOpen = Boolean(product && localized);
  const numberLocale = locale === "fa" ? "fa-IR" : "en-US";

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const formattedRating = product
    ? new Intl.NumberFormat(numberLocale, {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }).format(product.rating)
    : "";
  const formattedWeight = product
    ? new Intl.NumberFormat(numberLocale).format(product.weightGrams)
    : "";

  return (
    <AnimatePresence>
      {product && localized && (
        <div className="fixed inset-0 z-[90] grid place-items-end overflow-y-auto p-0 pt-[env(safe-area-inset-top)] sm:place-items-center sm:p-md">
          <motion.button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            aria-label={closeLabel}
            className="fixed inset-0 bg-coffee-dark/72 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            data-lenis-prevent
            role="dialog"
            aria-modal="true"
            aria-labelledby={`product-${product.id}-title`}
            className="relative z-10 grid max-h-[calc(100svh-env(safe-area-inset-top))] w-full max-w-[68rem] overscroll-contain overflow-y-auto rounded-t-[2rem] bg-soft-white pb-[env(safe-area-inset-bottom)] shadow-2xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:max-h-[88svh] sm:rounded-[2rem] sm:pb-0 min-[700px]:grid-cols-[0.88fr_1.12fr] min-[700px]:overflow-hidden lg:grid-cols-[1.05fr_0.95fr]"
            initial={{ opacity: 0, y: 36, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.99 }}
            transition={{ duration: 0.44, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              ref={closeButtonRef}
              type="button"
              className="absolute end-sm top-sm z-30 grid size-11 place-items-center rounded-full border border-coffee-dark/12 bg-soft-white/92 shadow-lg backdrop-blur-md transition-colors hover:border-premium-gold hover:bg-premium-gold/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-premium-gold sm:end-md sm:top-md"
              aria-label={closeLabel}
              onClick={onClose}
            >
              <X className="size-5" aria-hidden="true" />
            </button>

            <div className="relative h-[34svh] min-h-[14rem] max-h-[20rem] overflow-hidden bg-cream sm:h-auto sm:max-h-none sm:min-h-[24rem] min-[700px]:min-h-full lg:min-h-[38rem]">
              <Image
                src={product.image}
                alt={`${localized.name} — ${localized.origin}`}
                fill
                sizes="(min-width: 1024px) 54vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-coffee-dark/34 via-transparent to-transparent" />
              <span className="absolute bottom-sm start-sm rounded-full border border-cream/30 bg-coffee-dark/48 px-sm py-xs text-[0.65rem] tracking-[0.18em] text-cream uppercase backdrop-blur-md sm:bottom-md sm:start-md">
                {localized.origin}
              </span>
            </div>

            <div className="relative flex flex-col overflow-y-auto p-md [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:p-lg lg:p-xl">
              <div className="pe-xl">
                <p className="text-[0.65rem] font-medium tracking-[0.28em] text-coffee-brown uppercase">
                  {bagWeight.replace("{weight}", formattedWeight)}
                </p>
                <h2
                  id={`product-${product.id}-title`}
                  className="mt-sm max-w-[26rem] font-heading text-[clamp(1.75rem,9vw,2.5rem)] leading-tight sm:text-4xl"
                >
                  {localized.name}
                </h2>
              </div>

              <div className="mt-sm flex flex-wrap items-center gap-sm text-sm text-coffee-brown/78">
                <span
                  className="inline-flex items-center gap-xs"
                  aria-label={ratingLabel.replace("{rating}", formattedRating)}
                >
                  <Star className="size-4 fill-premium-gold text-premium-gold" aria-hidden="true" />
                  {formattedRating}
                </span>
                <span aria-hidden="true">·</span>
                <span>{localized.origin}</span>
              </div>

              <p className="mt-md text-sm leading-7 text-coffee-brown/82 sm:text-base">
                {localized.description}
              </p>

              <div className="mt-md">
                <h3 className="text-[0.68rem] font-medium tracking-[0.24em] text-coffee-brown uppercase">
                  {tastingNotes}
                </h3>
                <ul className="mt-sm flex flex-wrap gap-xs">
                  {localized.notes.map((note) => (
                    <li
                      key={note}
                      className="rounded-full border border-coffee-dark/12 bg-cream px-sm py-xs text-sm"
                    >
                      {note}
                    </li>
                  ))}
                </ul>
              </div>

              <dl className="mt-md grid grid-cols-2 gap-sm border-y border-coffee-dark/10 py-md text-sm">
                <div>
                  <dt className="text-xs text-coffee-brown/60">{roastLabel}</dt>
                  <dd className="mt-1 font-medium">{localized.roast}</dd>
                </div>
                <div>
                  <dt className="text-xs text-coffee-brown/60">{processLabel}</dt>
                  <dd className="mt-1 font-medium">{localized.process}</dd>
                </div>
              </dl>

              <div className="mt-auto flex flex-col gap-sm pt-md sm:flex-row sm:items-center sm:justify-between">
                <span className="font-heading text-2xl text-coffee-brown">
                  {formatCurrency(product.price, "USD", numberLocale)}
                </span>
                <Button
                  className="w-full gap-xs sm:w-auto"
                  onClick={() => {
                    onClose();
                    onAddToCart(product.id);
                  }}
                >
                  <Plus className="size-4" aria-hidden="true" />
                  {addToCart}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
