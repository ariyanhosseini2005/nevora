"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { sectionIds } from "@/constants/routes";
import { testimonials } from "@/features/homepage/data/testimonials";

export function Testimonials() {
  return (
    <Section id={sectionIds.testimonials} ariaLabel="Customer reviews" className="bg-cream">
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
            What People Are Saying
          </motion.h2>

          <motion.div
            variants={staggerContainer}
            className="mt-xl grid grid-cols-1 gap-lg sm:grid-cols-2 lg:grid-cols-3"
          >
            {testimonials.map((testimonial) => (
              <motion.figure
                key={testimonial.id}
                variants={fadeUp}
                className="space-y-md rounded-2xl bg-soft-white p-lg shadow-md"
              >
                <Quote className="size-6 text-premium-gold" aria-hidden="true" />
                <blockquote className="text-coffee-dark">
                  <p>&ldquo;{testimonial.quote}&rdquo;</p>
                </blockquote>
                <figcaption className="text-sm text-coffee-brown">
                  <span className="font-medium text-coffee-dark">{testimonial.name}</span>
                  {" — "}
                  {testimonial.role}
                </figcaption>
              </motion.figure>
            ))}
          </motion.div>
        </motion.div>
      </Container>
    </Section>
  );
}
