"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { sectionIds } from "@/constants/routes";
import { whyUsItems } from "@/features/homepage/data/whyUs";

export function WhyUs() {
  return (
    <Section id={sectionIds.whyUs} ariaLabel="Why choose NEVORA" className="bg-coffee-dark">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          <motion.h2
            variants={fadeUp}
            className="max-w-[36rem] font-heading text-3xl text-cream sm:text-4xl"
          >
            Why NEVORA
          </motion.h2>

          <motion.div
            variants={staggerContainer}
            className="mt-xl grid grid-cols-1 gap-lg sm:grid-cols-2 lg:grid-cols-4"
          >
            {whyUsItems.map(({ icon: Icon, title, description }) => (
              <motion.div key={title} variants={fadeUp} className="space-y-sm">
                <Icon className="size-8 text-premium-gold" aria-hidden="true" />
                <h3 className="font-heading text-lg text-cream">{title}</h3>
                <p className="text-sm text-cream/75">{description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </Container>
    </Section>
  );
}
