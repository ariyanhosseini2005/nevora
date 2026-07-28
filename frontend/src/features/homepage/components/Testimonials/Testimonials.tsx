"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { sectionIds } from "@/constants/routes";
import { testimonials } from "@/features/homepage/data/testimonials";
import { useLanguage } from "@/i18n/LanguageProvider";
import { messages } from "@/i18n/messages";

export function Testimonials() {
  const { locale } = useLanguage();
  const copy = messages[locale].testimonials;

  return (
    <Section id={sectionIds.testimonials} ariaLabel={copy.ariaLabel} className="bg-cream">
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

          <motion.div
            variants={staggerContainer}
            className="-mx-sm mt-lg flex snap-x snap-mandatory gap-sm overflow-x-auto overscroll-x-contain px-sm pb-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:mt-xl sm:grid sm:grid-cols-2 sm:gap-md sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3 lg:gap-lg"
          >
            {testimonials.map((testimonial, index) => (
              <motion.figure
                key={testimonial.id}
                variants={fadeUp}
                className="w-[86vw] max-w-[23rem] shrink-0 snap-center space-y-md rounded-2xl bg-soft-white p-md shadow-md sm:w-auto sm:max-w-none sm:p-lg"
              >
                <Quote className="size-6 text-premium-gold" aria-hidden="true" />
                <blockquote className="text-coffee-dark">
                  <p>&ldquo;{copy.items[index].quote}&rdquo;</p>
                </blockquote>
                <figcaption className="text-sm text-coffee-brown">
                  <span className="font-medium text-coffee-dark">{copy.items[index].name}</span>
                  {" — "}
                  {copy.items[index].role}
                </figcaption>
              </motion.figure>
            ))}
          </motion.div>
        </motion.div>
      </Container>
    </Section>
  );
}
