"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { sectionIds } from "@/constants/routes";
import { homepageImages } from "@/features/homepage/data/images";

export function StorySection() {
  return (
    <Section id={sectionIds.story} ariaLabel="Our story" className="bg-cream">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
          className="grid grid-cols-1 items-center gap-xl lg:grid-cols-2"
        >
          <motion.div variants={fadeUp} className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src={homepageImages.story}
              alt="Coffee beans resting in warm afternoon light"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </motion.div>

          <motion.div variants={fadeUp}>
            <h2 className="font-heading text-3xl text-coffee-dark sm:text-4xl">
              A brand built on patience
            </h2>
            <p className="mt-md text-coffee-brown">
              NEVORA began with a simple frustration: coffee that moved fast and tasted like it.
              We slowed everything down — sourcing, roasting, and the way a cup is meant to be
              enjoyed — to build something that feels less like a product and more like a ritual.
            </p>
            <p className="mt-sm text-coffee-brown">
              Every bag carries the story of the hands that grew it and the care taken to roast
              it well.
            </p>
          </motion.div>
        </motion.div>
      </Container>
    </Section>
  );
}
