"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { sectionIds } from "@/constants/routes";
import { experienceSteps } from "@/features/homepage/data/coffeeExperience";
import { useLanguage } from "@/i18n/LanguageProvider";
import { messages } from "@/i18n/messages";

export function CoffeeExperience() {
  const { locale } = useLanguage();
  const copy = messages[locale].experience;

  return (
    <Section
      id={sectionIds.coffeeExperience}
      ariaLabel={copy.ariaLabel}
      className="bg-coffee-dark"
    >
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

          <motion.ol
            variants={staggerContainer}
            className="-mx-sm mt-lg flex snap-x snap-mandatory gap-sm overflow-x-auto overscroll-x-contain px-sm pb-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:mt-xl sm:grid sm:grid-cols-2 sm:gap-md sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4 lg:gap-lg"
          >
            {experienceSteps.map((step, index) => (
              <motion.li
                key={step.id}
                variants={fadeUp}
                className="w-[82vw] max-w-[22rem] shrink-0 snap-center space-y-sm sm:w-auto sm:max-w-none"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                  <Image
                    src={step.image}
                    alt={copy.items[index].title}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <p className="text-xs tracking-widest text-premium-gold uppercase">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="font-heading text-xl text-cream">
                  {copy.items[index].title}
                </h3>
                <p className="text-sm text-cream/75">{copy.items[index].description}</p>
              </motion.li>
            ))}
          </motion.ol>
        </motion.div>
      </Container>
    </Section>
  );
}
