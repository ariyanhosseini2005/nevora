"use client";

import { cancelFrame, frame, useReducedMotion } from "framer-motion";
import { ReactLenis, type LenisRef } from "lenis/react";
import { useEffect, useRef, type ReactNode } from "react";

const smoothScrollOptions = {
  autoRaf: false,
  smoothWheel: true,
  syncTouch: false,
  lerp: 0.085,
  wheelMultiplier: 0.82,
  touchMultiplier: 1,
  overscroll: true,
  stopInertiaOnNavigate: true,
  anchors: {
    duration: 1.15,
    easing: (progress: number) => 1 - Math.pow(1 - progress, 4),
  },
} as const;

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);
  const shouldReduceMotion = Boolean(useReducedMotion());

  useEffect(() => {
    if (shouldReduceMotion) return;

    const update = ({ timestamp }: { timestamp: number }) => {
      lenisRef.current?.lenis?.raf(timestamp);
    };

    frame.update(update, true);
    return () => cancelFrame(update);
  }, [shouldReduceMotion]);

  return (
    <>
      {!shouldReduceMotion && <ReactLenis ref={lenisRef} root options={smoothScrollOptions} />}
      {children}
    </>
  );
}
