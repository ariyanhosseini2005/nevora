"use client";

import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { LanguageSwitcher } from "@/components/navigation/LanguageSwitcher";
import { navLinks } from "@/data/navigation";
import { sectionIds } from "@/constants/routes";
import { useLanguage } from "@/i18n/LanguageProvider";
import { messages } from "@/i18n/messages";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { locale } = useLanguage();
  const copy = messages[locale].nav;
  const [isScrolled, setIsScrolled] = useState(false);
  const [isJourneyActive, setIsJourneyActive] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollY } = useScroll();

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
        className="mx-auto flex max-w-(--container-max) items-center justify-between px-lg py-sm md:px-xl"
      >
        <a href={`#${sectionIds.hero}`} className="font-heading text-xl tracking-wide text-cream">
          NEVORA
        </a>

        <ul className="hidden items-center gap-lg md:flex">
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

        <div className="hidden items-center gap-sm md:flex">
          <LanguageSwitcher />
          <Button href={`#${sectionIds.cta}`} variant="primary">
            {copy.join}
          </Button>
        </div>

        <div className="flex items-center gap-xs md:hidden">
          <LanguageSwitcher className="h-9 px-2" />
          <button
            type="button"
            className="text-cream"
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
            className="overflow-hidden bg-coffee-dark md:hidden"
          >
            <ul className="flex flex-col gap-md px-lg py-md">
              {navLinks.map((link, index) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-cream/90"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {copy.links[index]}
                  </a>
                </li>
              ))}
              <li>
                <Button
                  href={`#${sectionIds.cta}`}
                  variant="primary"
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
