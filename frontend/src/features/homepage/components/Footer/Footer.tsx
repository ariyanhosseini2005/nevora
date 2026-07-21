import { Mail } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { navLinks } from "@/data/navigation";
import { sectionIds } from "@/constants/routes";

const socialLinks = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Twitter", href: "https://twitter.com" },
  { label: "Facebook", href: "https://facebook.com" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-coffee-dark px-lg py-xl text-cream md:px-xl">
      <Container>
        <div className="grid grid-cols-1 gap-xl sm:grid-cols-3">
          <div>
            <a href={`#${sectionIds.hero}`} className="font-heading text-xl tracking-wide">
              NEVORA
            </a>
            <p className="mt-sm max-w-[20rem] text-sm text-cream/70">
              A premium coffee brand crafting a slower, more deliberate cup.
            </p>
          </div>

          <nav aria-label="Footer">
            <h2 className="text-sm uppercase tracking-widest text-cream/60">Explore</h2>
            <ul className="mt-sm space-y-xs">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-cream/85 hover:text-premium-gold">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-sm uppercase tracking-widest text-cream/60">Connect</h2>
            <a
              href="mailto:hello@nevoracoffee.com"
              className="mt-sm flex items-center gap-xs text-sm text-cream/85 hover:text-premium-gold"
            >
              <Mail className="size-4" aria-hidden="true" />
              hello@nevoracoffee.com
            </a>
            <ul className="mt-sm flex gap-md">
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
          © {year} NEVORA. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
