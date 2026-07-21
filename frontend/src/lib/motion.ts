import type { Variants } from "framer-motion";
import { motionTiming } from "@/constants/animations";

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: motionTiming.slideDistance },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: motionTiming.fadeDuration, ease: motionTiming.ease },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: motionTiming.fadeDuration, ease: motionTiming.ease },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 1 / motionTiming.scaleAmount },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: motionTiming.fadeDuration, ease: motionTiming.ease },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};
