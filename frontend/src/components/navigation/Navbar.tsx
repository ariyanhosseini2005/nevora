"use client";

import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { LanguageSwitcher } from "@/components/navigation/LanguageSwitcher";
import { useCart } from "@/features/commerce/CartProvider";
import { navLinks } from "@/data/navigation";
import { sectionIds } from "@/constants/routes";
import { useLanguage } from "@/i18n/LanguageProvider";
import { messages } from "@/i18n/messages";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { locale } = useLanguage();
  const copy = messages[locale].nav;
  const cartCopy = messages[locale].cart;
  const { itemCount, openCart } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isJourneyActive, setIsJourneyActive] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const localizedItemCount = new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US").format(
    itemCount,
  );
  const cartLabel =
    itemCount > 0 ? cartCopy.itemCount.replace("{count}", localizedItemCount) : cartCopy.label;

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 40);

    const journey = document.getElementById(sectionIds.hero);
    if (!journey) {
      setIsJourneyActive(false);
      return;
    }

    const sceneTravel = Math.max(journey.offsetHeight - window.innerHeight, 1);
    const navigationReveal = journey.offsetTop + sceneTravel * 0.82;
    setIsJourneyActive(latest < navigationReveal);
  });

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[color,background-color,opacity,transform] duration-500",
        isJourneyActive && "pointer-events-none -translate-y-3 opacity-0",
        isScrolled ? "bg-coffee-dark/90 backdrop-blur-sm" : "bg-transparent",
      )}
    >
      <nav
        aria-label={copy.primaryLabel}
        className="mx-auto flex max-w-(--container-max) items-center justify-between gap-xs px-sm pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 sm:gap-sm sm:px-md sm:pt-md sm:pb-md md:px-lg lg:px-xl xl:px-2xl"
      >
        <a
          href={`#${sectionIds.hero}`}
          className="shrink-0 font-heading text-lg tracking-[0.12em] text-cream sm:text-xl"
        >
          NEVORA
        </a>

        <ul className="hidden items-center gap-md xl:flex xl:gap-lg">
          {navLinks.map((link, index) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm text-cream/90 transition-colors hover:text-premium-gold"
              >
                {copy.links[index]}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-sm xl:flex">
          <LanguageSwitcher />
          <button
            type="button"
            data-cart-trigger
            className="relative grid size-11 place-items-center rounded-full border border-cream/20 text-cream transition-colors hover:border-premium-gold hover:bg-cream/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-premium-gold"
            aria-label={cartLabel}
            onClick={openCart}
          >
            <ShoppingBag className="size-4.5" aria-hidden="true" />
            {itemCount > 0 && (
              <span
                className="absolute -end-1 -top-1 grid min-h-5 min-w-5 place-items-center rounded-full bg-premium-gold px-1 text-[0.6rem] font-bold text-coffee-dark"
                aria-hidden="true"
              >
                {localizedItemCount}
              </span>
            )}
          </button>
          <Button href={`#${sectionIds.cta}`} variant="primary">
            {copy.join}
          </Button>
        </div>

        <div className="flex min-w-0 items-center gap-0.5 min-[380px]:gap-xs xl:hidden">
          <LanguageSwitcher className="border-transparent bg-transparent px-1.5 min-[380px]:border-cream/20 min-[380px]:bg-coffee-dark/55 min-[380px]:px-2.5" />
          <button
            type="button"
            data-cart-trigger
            className="relative grid size-10 shrink-0 place-items-center rounded-full text-cream transition-colors hover:bg-cream/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-premium-gold sm:size-11"
            aria-label={cartLabel}
            onClick={openCart}
          >
            <ShoppingBag className="size-5" aria-hidden="true" />
            {itemCount > 0 && (
              <span
                className="absolute end-0 top-0 grid min-h-5 min-w-5 place-items-center rounded-full bg-premium-gold px-1 text-[0.6rem] font-bold text-coffee-dark"
                aria-hidden="true"
              >
                {localizedItemCount}
              </span>
            )}
          </button>
          <button
            type="button"
            className="grid size-10 shrink-0 place-items-center rounded-full text-cream transition-colors hover:bg-cream/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-premium-gold sm:size-11"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? copy.closeMenu : copy.openMenu}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            {isMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="max-h-[calc(100svh-4.5rem)] overflow-y-auto border-t border-cream/10 bg-coffee-dark/96 shadow-2xl backdrop-blur-xl xl:hidden"
          >
            <ul className="flex flex-col px-sm pt-sm pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-md md:px-lg">
              {navLinks.map((link, index) => (
                <li key={link.href} className="border-b border-cream/10">
                  <a
                    href={link.href}
                    className="flex min-h-14 items-center font-heading text-xl text-cream/90 transition-colors hover:text-premium-gold"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {copy.links[index]}
                  </a>
                </li>
              ))}
              <li className="pt-md">
                <Button
                  href={`#${sectionIds.cta}`}
                  variant="primary"
                  className="w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {copy.join}
                </Button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
