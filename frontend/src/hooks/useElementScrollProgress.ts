"use client";

import { useEffect, useState, type RefObject } from "react";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

/** Maps the unified scroll position to a reversible 0–1 element timeline. */
export function useElementScrollProgress<T extends HTMLElement>(elementRef: RefObject<T | null>) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let animationFrame: number | null = null;
    let disposed = false;

    function measureProgress() {
      const element = elementRef.current;
      if (!element) return 0;

      const travel = Math.max(element.offsetHeight - window.innerHeight, 1);
      return clamp(-element.getBoundingClientRect().top / travel, 0, 1);
    }

    function publish() {
      animationFrame = null;
      if (disposed || document.hidden) return;

      const nextProgress = measureProgress();
      setProgress((previousProgress) =>
        Math.abs(previousProgress - nextProgress) < 0.00004 ? previousProgress : nextProgress,
      );
    }

    function scheduleUpdate() {
      if (animationFrame === null && !document.hidden) {
        animationFrame = window.requestAnimationFrame(publish);
      }
    }

    function handleVisibilityChange() {
      if (!document.hidden) scheduleUpdate();
    }

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("pageshow", scheduleUpdate);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    scheduleUpdate();

    return () => {
      disposed = true;
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("pageshow", scheduleUpdate);
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, [elementRef]);

  return progress;
}
