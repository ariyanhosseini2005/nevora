"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { useParallax } from "@/hooks/useParallax";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { sectionIds } from "@/constants/routes";
import { homepageImages } from "@/features/homepage/data/images";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const parallaxY = useParallax(sectionRef, isDesktop ? 80 : 24);
  const zoomScale = isDesktop ? 1.08 : 1.03;

  return (
    <section
      id={sectionIds.hero}
      ref={sectionRef}
      aria-label="Introduction"
      className="relative flex h-screen min-h-[640px] items-center overflow-hidden bg-coffee-dark"
    >
      <motion.div style={{ y: parallaxY }} className="absolute inset-0">
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: zoomScale }}
          transition={{ duration: 20, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src={homepageImages.hero}
            alt="Steaming cup of NEVORA coffee in warm, atmospheric light"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-coffee-dark via-coffee-dark/60 to-coffee-dark/20" />
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="relative mx-auto max-w-(--container-max) px-lg md:px-xl"
      >
        <motion.h1
          variants={fadeUp}
          className="max-w-[42rem] font-heading text-4xl leading-tight text-cream sm:text-5xl lg:text-6xl"
        >
          Coffee, crafted as ritual.
        </motion.h1>
        <motion.p
          variants={fadeUp}
          className="mt-md max-w-[32rem] text-base text-cream/85 sm:text-lg"
        >
          NEVORA sources rare beans and roasts them with quiet precision, for a cup that feels
          like a moment of stillness.
        </motion.p>
        <motion.div variants={fadeUp} className="mt-lg flex flex-wrap gap-md">
          <Button href={`#${sectionIds.products}`} variant="primary">
            Explore the Collection
          </Button>
          <Button href={`#${sectionIds.story}`} variant="secondary">
            Our Story
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
