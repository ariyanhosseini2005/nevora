import { useScroll, useTransform, type MotionValue } from "framer-motion";
import type { RefObject } from "react";

export function useParallax(
  ref: RefObject<HTMLElement | null>,
  distance = 120,
): MotionValue<number> {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  return useTransform(scrollYProgress, [0, 1], [-distance, distance]);
}
