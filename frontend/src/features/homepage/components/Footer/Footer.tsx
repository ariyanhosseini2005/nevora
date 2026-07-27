"use client";

import { Mail } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { navLinks } from "@/data/navigation";
import { sectionIds } from "@/constants/routes";
import { useLanguage } from "@/i18n/LanguageProvider";
import { messages } from "@/i18n/messages";

const socialLinks = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "X", href: "https://x.com" },
  { label: "Facebook", href: "https://facebook.com" },
];

export function Footer() {
  const { locale } = useLanguage();
  const copy = messages[locale];
  const year = new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US", {
    useGrouping: false,
  }).format(new Date().getFullYear());

  return (
    <footer className="bg-coffee-dark px-sm py-lg text-cream sm:px-lg sm:py-xl md:px-xl">
      <Container>
        <div className="grid grid-cols-1 gap-lg sm:grid-cols-2 lg:grid-cols-3 lg:gap-xl">
          <div className="sm:col-span-2 lg:col-span-1">
            <a href={`#${sectionIds.hero}`} className="font-heading text-xl tracking-wide">
              NEVORA
            </a>
            <p className="mt-sm max-w-[20rem] text-sm text-cream/70">
              {copy.footer.description}
            </p>
          </div>

          <nav aria-label={copy.footer.navLabel}>
            <h2 className="text-sm tracking-widest text-cream/60 uppercase">
              {copy.footer.explore}
            </h2>
            <ul className="mt-sm space-y-xs">
              {navLinks.map((link, index) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-cream/85 hover:text-premium-gold">
                    {copy.nav.links[index]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-sm tracking-widest text-cream/60 uppercase">
              {copy.footer.connect}
            </h2>
            <a
              href="mailto:hello@nevoracoffee.com"
              className="mt-sm flex flex-wrap items-center gap-xs break-all text-sm text-cream/85 hover:text-premium-gold"
              dir="ltr"
            >
              <Mail className="size-4" aria-hidden="true" />
              hello@nevoracoffee.com
            </a>
            <ul className="mt-sm flex gap-md" dir="ltr">
              {socialLinks.map((social) => (
                <li key={social.href}>
                  <a
                    href={social.href}
                    className="text-sm text-cream/85 hover:text-premium-gold"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-xl border-t border-cream/10 pt-md text-xs text-cream/50">
          © {year} NEVORA. {copy.footer.rights}
        </p>
      </Container>
    </footer>
  );
}
