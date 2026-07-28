"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { products } from "@/features/homepage/data/products";
import { useCart } from "@/features/commerce/CartProvider";
import { useLanguage } from "@/i18n/LanguageProvider";
import { messages } from "@/i18n/messages";
import { formatCurrency } from "@/utils/currency";

function restoreCartTriggerFocus() {
  const triggers = Array.from(document.querySelectorAll<HTMLElement>("[data-cart-trigger]"));
  triggers.find((trigger) => trigger.offsetParent !== null)?.focus();
}

export function CartDrawer() {
  const { locale, direction } = useLanguage();
  const { lines, itemCount, isOpen, closeCart, removeItem, setQuantity } = useCart();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const copy = messages[locale];
  const numberLocale = locale === "fa" ? "fa-IR" : "en-US";
  const localizedCount = new Intl.NumberFormat(numberLocale).format(itemCount);
  const cartLines = lines.flatMap((line) => {
    const productIndex = products.findIndex((product) => product.id === line.productId);
    if (productIndex < 0) return [];

    return [
      {
        ...line,
        product: products[productIndex],
        localized: copy.products.items[productIndex],
      },
    ];
  });
  const subtotal = cartLines.reduce((total, line) => total + line.product.price * line.quantity, 0);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCart();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      restoreCartTriggerFocus();
    };
  }, [closeCart, isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100]">
          <motion.button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            aria-label={copy.cart.close}
            className="absolute inset-0 bg-coffee-dark/58 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />

          <motion.aside
            data-lenis-prevent
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
            className="absolute inset-y-0 end-0 flex w-full max-w-[31rem] flex-col bg-soft-white pt-[env(safe-area-inset-top)] text-coffee-dark shadow-2xl"
            initial={{ x: direction === "rtl" ? "-100%" : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: direction === "rtl" ? "-100%" : "100%" }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between border-b border-coffee-dark/10 px-md py-md sm:px-lg">
              <div>
                <p className="text-[0.62rem] font-medium tracking-[0.28em] text-coffee-brown uppercase">
                  {copy.cart.label}
                </p>
                <h2 id="cart-title" className="mt-1 font-heading text-2xl">
                  {copy.cart.title}
                </h2>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                className="grid size-11 place-items-center rounded-full border border-coffee-dark/12 transition-colors hover:border-premium-gold hover:bg-premium-gold/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-premium-gold"
                aria-label={copy.cart.close}
                onClick={closeCart}
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>

            <div
              data-lenis-prevent
              className="flex-1 overscroll-contain overflow-y-auto px-sm py-md min-[380px]:px-md sm:px-lg"
            >
              {cartLines.length === 0 ? (
                <div className="grid min-h-full place-items-center py-xl text-center">
                  <div className="max-w-[22rem]">
                    <span className="mx-auto grid size-16 place-items-center rounded-full bg-premium-gold/14 text-coffee-brown">
                      <ShoppingBag className="size-7" aria-hidden="true" />
                    </span>
                    <h3 className="mt-md font-heading text-2xl">{copy.cart.emptyTitle}</h3>
                    <p className="mt-sm text-sm leading-relaxed text-coffee-brown/76">
                      {copy.cart.emptyDescription}
                    </p>
                    <Button className="mt-md" onClick={closeCart}>
                      {copy.cart.continueShopping}
                    </Button>
                  </div>
                </div>
              ) : (
                <ul className="space-y-md">
                  {cartLines.map(({ product, localized, quantity }) => (
                    <li
                      key={product.id}
                      className="grid grid-cols-[4.75rem_1fr] gap-sm border-b border-coffee-dark/10 pb-md min-[380px]:grid-cols-[5.5rem_1fr]"
                    >
                      <div className="relative aspect-square overflow-hidden rounded-2xl bg-cream">
                        <Image
                          src={product.image}
                          alt={`${localized.name} — ${localized.origin}`}
                          fill
                          sizes="88px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-start justify-between gap-xs">
                          <div className="min-w-0">
                            <h3 className="truncate font-heading text-base">{localized.name}</h3>
                            <p className="mt-1 text-xs text-coffee-brown/70">{localized.origin}</p>
                          </div>
                          <button
                            type="button"
                            className="grid size-9 shrink-0 place-items-center rounded-full text-coffee-brown/65 transition-colors hover:bg-coffee-dark/6 hover:text-coffee-dark"
                            aria-label={`${copy.cart.remove}: ${localized.name}`}
                            onClick={() => removeItem(product.id)}
                          >
                            <Trash2 className="size-4" aria-hidden="true" />
                          </button>
                        </div>

                        <div className="mt-sm flex flex-wrap items-center justify-between gap-xs">
                          <div
                            className="inline-flex items-center rounded-full border border-coffee-dark/12"
                            aria-label={`${copy.cart.quantity}: ${quantity}`}
                          >
                            <button
                              type="button"
                              className="grid size-9 place-items-center rounded-full transition-colors hover:bg-premium-gold/12"
                              aria-label={copy.cart.decrease.replace("{product}", localized.name)}
                              onClick={() => setQuantity(product.id, quantity - 1)}
                            >
                              <Minus className="size-3.5" aria-hidden="true" />
                            </button>
                            <span className="min-w-8 text-center text-sm tabular-nums">
                              {new Intl.NumberFormat(numberLocale).format(quantity)}
                            </span>
                            <button
                              type="button"
                              className="grid size-9 place-items-center rounded-full transition-colors hover:bg-premium-gold/12"
                              aria-label={copy.cart.increase.replace("{product}", localized.name)}
                              onClick={() => setQuantity(product.id, quantity + 1)}
                            >
                              <Plus className="size-3.5" aria-hidden="true" />
                            </button>
                          </div>
                          <span className="font-heading text-base">
                            {formatCurrency(product.price * quantity, "USD", numberLocale)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {cartLines.length > 0 && (
              <div className="border-t border-coffee-dark/10 bg-cream/60 px-sm pt-md pb-[max(1rem,env(safe-area-inset-bottom))] min-[380px]:px-md sm:px-lg">
                <div className="space-y-xs text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-coffee-brown/72">{copy.cart.subtotal}</span>
                    <span className="font-heading text-xl">
                      {formatCurrency(subtotal, "USD", numberLocale)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-sm text-xs text-coffee-brown/66">
                    <span>{copy.cart.shipping}</span>
                    <span>{copy.cart.shippingNote}</span>
                  </div>
                </div>
                <button
                  type="button"
                  disabled
                  className="mt-md flex min-h-12 w-full cursor-not-allowed items-center justify-center rounded-full bg-coffee-dark px-md text-sm font-medium text-cream/78"
                >
                  {copy.cart.checkout}
                </button>
                <p className="mt-xs text-center text-[0.7rem] leading-relaxed text-coffee-brown/62">
                  {copy.cart.checkoutNote}
                </p>
                <p className="sr-only" aria-live="polite">
                  {copy.cart.itemCount.replace("{count}", localizedCount)}
                </p>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
