"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { sectionIds } from "@/constants/routes";
import { whyUsItems } from "@/features/homepage/data/whyUs";
import { useLanguage } from "@/i18n/LanguageProvider";
import { messages } from "@/i18n/messages";

export function WhyUs() {
  const { locale } = useLanguage();
  const copy = messages[locale].whyUs;

  return (
    <Section id={sectionIds.whyUs} ariaLabel={copy.ariaLabel} className="bg-coffee-dark">
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
            {copy.heading}
          </motion.h2>

          <motion.div
            variants={staggerContainer}
            className="mt-lg grid grid-cols-1 gap-md sm:mt-xl sm:grid-cols-2 sm:gap-lg lg:grid-cols-4"
          >
            {whyUsItems.map(({ icon: Icon }, index) => (
              <motion.div key={copy.items[index].title} variants={fadeUp} className="space-y-sm">
                <Icon className="size-8 text-premium-gold" aria-hidden="true" />
                <h3 className="font-heading text-lg text-cream">{copy.items[index].title}</h3>
                <p className="text-sm text-cream/75">{copy.items[index].description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </Container>
    </Section>
  );
}
