"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { sectionIds } from "@/constants/routes";
import { homepageImages } from "@/features/homepage/data/images";
import { useLanguage } from "@/i18n/LanguageProvider";
import { messages } from "@/i18n/messages";

export function StorySection() {
  const { locale } = useLanguage();
  const copy = messages[locale].story;

  return (
    <Section id={sectionIds.story} ariaLabel={copy.ariaLabel} className="bg-cream">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
          className="grid grid-cols-1 items-center gap-lg lg:grid-cols-2 lg:gap-xl"
        >
          <motion.div variants={fadeUp} className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src={homepageImages.story}
              alt={copy.imageAlt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </motion.div>

          <motion.div variants={fadeUp}>
            <h2 className="font-heading text-3xl text-coffee-dark sm:text-4xl">
              {copy.heading}
            </h2>
            <p className="mt-md text-coffee-brown">{copy.paragraphOne}</p>
            <p className="mt-sm text-coffee-brown">{copy.paragraphTwo}</p>
          </motion.div>
        </motion.div>
      </Container>
    </Section>
  );
}
