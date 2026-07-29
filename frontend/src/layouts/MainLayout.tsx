import type { ReactNode } from "react";
import { Navbar } from "@/components/navigation/Navbar";
import { LocalizedSkipLink } from "@/components/navigation/LocalizedSkipLink";
import { Footer } from "@/features/homepage/components/Footer/Footer";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import { CartProvider } from "@/features/commerce/CartProvider";
import { LazyCartDrawer } from "@/features/commerce/LazyCartDrawer";

export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <CartProvider>
        <LocalizedSkipLink />
        <Navbar />
        <main id="main-content">{children}</main>
        <Footer />
        <LazyCartDrawer />
      </CartProvider>
    </LanguageProvider>
  );
}
