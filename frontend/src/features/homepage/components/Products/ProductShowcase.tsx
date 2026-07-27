"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { ProductCard } from "@/components/cards/ProductCard";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { sectionIds } from "@/constants/routes";
import { products } from "@/features/homepage/data/products";
import { useLanguage } from "@/i18n/LanguageProvider";
import { messages } from "@/i18n/messages";

export function ProductShowcase() {
  const { locale } = useLanguage();
  const copy = messages[locale].products;

  return (
    <Section id={sectionIds.products} ariaLabel={copy.ariaLabel} className="bg-cream">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          <motion.h2
            variants={fadeUp}
            className="max-w-[36rem] font-heading text-3xl text-coffee-dark sm:text-4xl"
          >
            {copy.heading}
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-sm max-w-[36rem] text-coffee-brown">
            {copy.intro}
          </motion.p>

          <motion.div
            variants={staggerContainer}
            className="mt-lg grid grid-cols-1 gap-md sm:mt-xl sm:grid-cols-2 sm:gap-lg lg:grid-cols-3"
          >
            {products.map((product, index) => (
              <motion.div key={product.id} variants={fadeUp}>
                <ProductCard
                  {...product}
                  name={copy.items[index].name}
                  origin={copy.items[index].origin}
                  locale={locale}
                  ratingLabel={copy.ratingLabel}
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </Container>
    </Section>
  );
}
