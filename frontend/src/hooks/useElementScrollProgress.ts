"use client";

import { useEffect, useState, type RefObject } from "react";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Maps an element's native scroll travel to a reversible 0–1 timeline.
 * Native page scrolling remains untouched; only the visual playhead is gently
 * damped so wheel, trackpad and touch input advance through intermediate frames.
 */
export function useElementScrollProgress<T extends HTMLElement>(
  elementRef: RefObject<T | null>,
) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let animationFrame: number | null = null;
    let currentProgress = 0;
    let targetProgress = 0;
    let lastTime = 0;
    let initialized = false;
    let disposed = false;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    function measureProgress() {
      const element = elementRef.current;
      if (!element) return targetProgress;

      const travel = Math.max(element.offsetHeight - window.innerHeight, 1);
      return clamp(-element.getBoundingClientRect().top / travel, 0, 1);
    }

    function publish(nextProgress: number) {
      setProgress((previousProgress) =>
        Math.abs(previousProgress - nextProgress) < 0.0002
          ? previousProgress
          : nextProgress,
      );
    }

    function animate(time: number) {
      animationFrame = null;
      if (disposed || document.hidden) return;

      targetProgress = measureProgress();

      if (!initialized || reducedMotion.matches) {
        currentProgress = targetProgress;
        initialized = true;
      } else {
        const elapsed = Math.min(Math.max(time - lastTime, 1), 64);
        const response = 1 - Math.exp(-elapsed / 82);
        currentProgress += (targetProgress - currentProgress) * response;

        if (Math.abs(targetProgress - currentProgress) < 0.00012) {
          currentProgress = targetProgress;
        }
      }

      lastTime = time;
      publish(currentProgress);

      if (Math.abs(targetProgress - currentProgress) >= 0.00012) {
        animationFrame = window.requestAnimationFrame(animate);
      }
    }

    function scheduleUpdate() {
      targetProgress = measureProgress();
      if (animationFrame === null && !document.hidden) {
        animationFrame = window.requestAnimationFrame(animate);
      }
    }

    function handleVisibilityChange() {
      if (!document.hidden) {
        initialized = false;
        scheduleUpdate();
      }
    }

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("pageshow", scheduleUpdate);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    reducedMotion.addEventListener("change", scheduleUpdate);
    scheduleUpdate();

    return () => {
      disposed = true;
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("pageshow", scheduleUpdate);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      reducedMotion.removeEventListener("change", scheduleUpdate);

      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, [elementRef]);

  return progress;
}
