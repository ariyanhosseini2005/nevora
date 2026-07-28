"use client";

import { motion } from "framer-motion";
import { useCallback, useState } from "react";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { ProductCard } from "@/components/cards/ProductCard";
import { ProductQuickView } from "@/features/commerce/ProductQuickView";
import { useCart } from "@/features/commerce/CartProvider";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { sectionIds } from "@/constants/routes";
import { products } from "@/features/homepage/data/products";
import { useLanguage } from "@/i18n/LanguageProvider";
import { messages } from "@/i18n/messages";
import type { Product } from "@/types/product";

export function ProductShowcase() {
  const { locale } = useLanguage();
  const { addItem } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const copy = messages[locale].products;
  const selectedProductIndex = selectedProduct
    ? products.findIndex((product) => product.id === selectedProduct.id)
    : -1;
  const selectedLocalized = selectedProductIndex >= 0 ? copy.items[selectedProductIndex] : null;
  const closeQuickView = useCallback(() => setSelectedProduct(null), []);

  return (
    <Section id={sectionIds.products} ariaLabel={copy.ariaLabel} className="bg-cream">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          <div className="grid gap-md border-b border-coffee-dark/10 pb-md md:grid-cols-[1fr_0.9fr] md:items-end">
            <div>
              <motion.p
                variants={fadeUp}
                className="text-[0.66rem] font-medium tracking-[0.3em] text-coffee-brown uppercase"
              >
                {copy.eyebrow}
              </motion.p>
              <motion.h2
                variants={fadeUp}
                className="mt-xs max-w-[36rem] font-heading text-3xl text-coffee-dark sm:text-4xl lg:text-5xl"
              >
                {copy.heading}
              </motion.h2>
            </div>
            <motion.p
              variants={fadeUp}
              className="max-w-[36rem] text-sm leading-relaxed text-coffee-brown md:justify-self-end md:text-base"
            >
              {copy.intro}
            </motion.p>
          </div>

          <motion.div
            variants={staggerContainer}
            className="-mx-sm mt-lg flex snap-x snap-mandatory gap-sm overflow-x-auto overscroll-x-contain px-sm pb-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:mt-xl sm:grid sm:grid-cols-2 sm:gap-md sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3 lg:gap-lg"
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                variants={fadeUp}
                className="w-[84vw] max-w-[23rem] shrink-0 snap-center sm:w-auto sm:max-w-none sm:last:col-span-2 sm:last:mx-auto sm:last:w-[calc(50%-0.75rem)] lg:last:col-span-1 lg:last:w-auto"
              >
                <ProductCard
                  {...product}
                  name={copy.items[index].name}
                  origin={copy.items[index].origin}
                  locale={locale}
                  ratingLabel={copy.ratingLabel}
                  bagWeight={copy.bagWeight}
                  viewDetails={copy.viewDetails}
                  addToCart={copy.addToCart}
                  onViewDetails={() => setSelectedProduct(product)}
                  onAddToCart={() => addItem(product.id)}
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </Container>

      <ProductQuickView
        product={selectedProduct}
        localized={selectedLocalized}
        locale={locale}
        ratingLabel={copy.ratingLabel}
        bagWeight={copy.bagWeight}
        tastingNotes={copy.tastingNotes}
        roastLabel={copy.roastLabel}
        processLabel={copy.processLabel}
        addToCart={copy.addToCart}
        closeLabel={copy.closeDetails}
        onClose={closeQuickView}
        onAddToCart={addItem}
      />
    </Section>
  );
}
