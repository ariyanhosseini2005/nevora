"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { ProductCard } from "@/components/cards/ProductCard";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { sectionIds } from "@/constants/routes";
import { products } from "@/features/homepage/data/products";

export function ProductShowcase() {
  return (
    <Section id={sectionIds.products} ariaLabel="Our coffee collection" className="bg-cream">
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
            The Collection
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-sm max-w-[36rem] text-coffee-brown">
            A small, rotating selection of single-origin beans, chosen for character over volume.
          </motion.p>

          <motion.div
            variants={staggerContainer}
            className="mt-xl grid grid-cols-1 gap-lg sm:grid-cols-2 lg:grid-cols-3"
          >
            {products.map((product) => (
              <motion.div key={product.id} variants={fadeUp}>
                <ProductCard {...product} />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </Container>
    </Section>
  );
}
