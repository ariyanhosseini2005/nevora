"use client";

import { useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { LanguageSwitcher } from "@/components/navigation/LanguageSwitcher";
import { Button } from "@/components/ui/Button";
import { sectionIds } from "@/constants/routes";
import { useElementScrollProgress } from "@/hooks/useElementScrollProgress";
import { useLanguage } from "@/i18n/LanguageProvider";
import { messages } from "@/i18n/messages";

type JourneyBeatTiming = {
  id: string;
  start: number;
  end: number;
};

type ScrollSegment = {
  scrollStart: number;
  scrollEnd: number;
  frameStart: number;
  frameEnd: number;
};

const START_FRAME = 204;
const END_FRAME = 743;
const FRAME_COUNT = END_FRAME - START_FRAME + 1;
const MOBILE_PRELOAD_RADIUS = 7;
const DESKTOP_PRELOAD_RADIUS = 11;
const MOBILE_CACHE_LIMIT = 18;
const DESKTOP_CACHE_LIMIT = 28;
const PUBLIC_BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");

const journeyBeatTimings: JourneyBeatTiming[] = [
  {
    id: "release",
    start: 204,
    end: 227,
  },
  {
    id: "water",
    start: 228,
    end: 299,
  },
  {
    id: "drying",
    start: 300,
    end: 331,
  },
  {
    id: "threshold",
    start: 332,
    end: 347,
  },
  {
    id: "roaster",
    start: 348,
    end: 395,
  },
  {
    id: "heat",
    start: 396,
    end: 443,
  },
  {
    id: "roast",
    start: 444,
    end: 491,
  },
  {
    id: "grind",
    start: 492,
    end: 539,
  },
  {
    id: "descent",
    start: 540,
    end: 587,
  },
  {
    id: "extraction",
    start: 588,
    end: 635,
  },
  {
    id: "glass",
    start: 636,
    end: 683,
  },
  {
    id: "ritual",
    start: 684,
    end: 719,
  },
];

const scrollTimeline: ScrollSegment[] = [
  { scrollStart: 0, scrollEnd: 0.05, frameStart: 204, frameEnd: 227 },
  { scrollStart: 0.05, scrollEnd: 0.19, frameStart: 228, frameEnd: 299 },
  { scrollStart: 0.19, scrollEnd: 0.255, frameStart: 300, frameEnd: 331 },
  { scrollStart: 0.255, scrollEnd: 0.295, frameStart: 332, frameEnd: 347 },
  { scrollStart: 0.295, scrollEnd: 0.385, frameStart: 348, frameEnd: 395 },
  { scrollStart: 0.385, scrollEnd: 0.475, frameStart: 396, frameEnd: 443 },
  { scrollStart: 0.475, scrollEnd: 0.56, frameStart: 444, frameEnd: 491 },
  { scrollStart: 0.56, scrollEnd: 0.645, frameStart: 492, frameEnd: 539 },
  { scrollStart: 0.645, scrollEnd: 0.73, frameStart: 540, frameEnd: 587 },
  { scrollStart: 0.73, scrollEnd: 0.8, frameStart: 588, frameEnd: 635 },
  { scrollStart: 0.8, scrollEnd: 0.87, frameStart: 636, frameEnd: 683 },
  { scrollStart: 0.87, scrollEnd: 0.94, frameStart: 684, frameEnd: 719 },
  { scrollStart: 0.94, scrollEnd: 0.995, frameStart: 720, frameEnd: 743 },
];

const frameSources = Array.from({ length: FRAME_COUNT }, (_, index) => {
  const frame = START_FRAME + index;
  return `${PUBLIC_BASE_PATH}/images/journey/frames-v010/nevora-one-take_f${String(frame).padStart(4, "0")}.webp`;
});

function clamp(value: number, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max);
}

function frameToIndex(frame: number) {
  return frame - START_FRAME;
}

function cinematicEase(value: number) {
  const smoothstep = value * value * (3 - 2 * value);
  return value + (smoothstep - value) * 0.34;
}

function frameAtScrollProgress(progress: number) {
  const segment =
    scrollTimeline.find(
      (candidate) => progress >= candidate.scrollStart && progress <= candidate.scrollEnd,
    ) ?? scrollTimeline[scrollTimeline.length - 1];
  const localProgress = clamp(
    (progress - segment.scrollStart) / (segment.scrollEnd - segment.scrollStart),
  );
  return (
    segment.frameStart +
    (segment.frameEnd - segment.frameStart) * cinematicEase(localProgress)
  );
}

function copyOpacity(frame: number, beat: JourneyBeatTiming) {
  const fadeFrames = 5;
  const enter =
    beat.start === START_FRAME ? 1 : clamp((frame - beat.start + fadeFrames) / fadeFrames);
  const exit = beat.end === END_FRAME ? 1 : clamp((beat.end - frame + fadeFrames) / fadeFrames);
  return Math.min(enter, exit);
}

function ReducedMotionJourney() {
  const { locale } = useLanguage();
  const copy = messages[locale].journey;

  return (
    <section
      id={sectionIds.hero}
      aria-label={copy.ariaLabel}
      className="relative flex min-h-svh items-end overflow-hidden bg-[#080705] px-lg py-xl text-cream md:items-center md:px-xl"
    >
      <Image
        src={frameSources[539]}
        alt={copy.reducedAlt}
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,7,5,0.08)_0%,rgba(8,7,5,0.24)_46%,rgba(8,7,5,0.92)_100%)] md:bg-[linear-gradient(90deg,rgba(8,7,5,0.9)_0%,rgba(8,7,5,0.28)_62%,rgba(8,7,5,0.18)_100%)]"
        aria-hidden="true"
      />
      <LanguageSwitcher className="absolute top-lg end-lg z-20 md:top-xl md:end-xl" />
      <div className="relative z-10 mx-auto w-full max-w-(--container-max)">
        <p className="mb-sm text-[0.65rem] font-medium tracking-[0.34em] text-premium-gold uppercase sm:text-xs">
          {copy.reducedEyebrow}
        </p>
        <h1 className="max-w-[48rem] font-heading text-[clamp(2.8rem,7vw,6.8rem)] leading-[0.94] tracking-[-0.04em]">
          {copy.reducedTitle}
          <span className="block italic text-cream/88">{copy.reducedItalicTitle}</span>
        </h1>
        <p className="mt-md max-w-[34rem] text-sm leading-relaxed text-cream/72 sm:text-base md:text-lg">
          {copy.reducedDescription}
        </p>
        <div className="mt-lg flex flex-wrap gap-sm">
          <Button href={`#${sectionIds.products}`} variant="primary">
            {copy.brand.primaryCta}
          </Button>
          <Button href={`#${sectionIds.story}`} variant="secondary">
            {copy.brand.secondaryCta}
          </Button>
        </div>
      </div>
    </section>
  );
}

export function CinematicJourney() {
  ReactDOM.preload(frameSources[0], {
    as: "image",
    type: "image/webp",
    fetchPriority: "high",
  });

  const { locale, direction } = useLanguage();
  const copy = messages[locale].journey;
  const sceneRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageCacheRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const inFlightRef = useRef<Map<number, Promise<void>>>(new Map());
  const currentFrameRef = useRef(START_FRAME);
  const previousIndexRef = useRef(0);
  const cacheCenterRef = useRef(0);
  const cacheLimitRef = useRef(DESKTOP_CACHE_LIMIT);
  const mountedRef = useRef(false);
  const progress = useElementScrollProgress(sceneRef);
  const shouldReduceMotion = Boolean(useReducedMotion());
  const [firstFrameReady, setFirstFrameReady] = useState(false);

  const framePosition = frameAtScrollProgress(progress);
  const currentFrame = Math.round(framePosition);
  const currentIndex = frameToIndex(currentFrame);
  const sequenceProgress = clamp((framePosition - START_FRAME) / (FRAME_COUNT - 1));
  const brandProgress = clamp((framePosition - 720) / (743 - 720));
  const brandOpacity = cinematicEase(clamp((brandProgress - 0.08) / 0.42));
  const activeBeat = journeyBeatTimings.find(
    (beat) => currentFrame >= beat.start && currentFrame <= beat.end,
  );

  const drawFrame = useCallback((frame: number) => {
    const canvas = canvasRef.current;
    const targetIndex = frameToIndex(frame);
    let image = imageCacheRef.current.get(targetIndex);

    if (!image?.complete || image.naturalWidth === 0) {
      let nearestDistance = Number.POSITIVE_INFINITY;

      for (const [candidateIndex, candidate] of imageCacheRef.current) {
        const distance = Math.abs(candidateIndex - targetIndex);
        if (
          distance < nearestDistance &&
          candidate.complete &&
          candidate.naturalWidth > 0
        ) {
          image = candidate;
          nearestDistance = distance;
        }
      }
    }

    if (!canvas || !image?.complete || image.naturalWidth === 0) return;

    const bounds = canvas.getBoundingClientRect();
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    const targetWidth = Math.max(Math.round(bounds.width * pixelRatio), 1);
    const targetHeight = Math.max(Math.round(bounds.height * pixelRatio), 1);

    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
    }

    const context = canvas.getContext("2d", { alpha: false });
    if (!context) return;

    const scale = Math.max(targetWidth / image.naturalWidth, targetHeight / image.naturalHeight);
    const sourceWidth = targetWidth / scale;
    const sourceHeight = targetHeight / scale;
    const sourceX = (image.naturalWidth - sourceWidth) / 2;
    const sourceY = (image.naturalHeight - sourceHeight) / 2;

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(
      image,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      targetWidth,
      targetHeight,
    );
  }, []);

  const trimImageCache = useCallback(() => {
    const cache = imageCacheRef.current;
    const center = cacheCenterRef.current;
    const limit = cacheLimitRef.current;
    if (cache.size <= limit) return;

    const evictionOrder = [...cache.keys()].sort(
      (first, second) => Math.abs(second - center) - Math.abs(first - center),
    );

    while (cache.size > limit) {
      const index = evictionOrder.shift();
      if (index === undefined) break;
      cache.delete(index);
    }
  }, []);

  const loadFrame = useCallback(
    (index: number, priority: "high" | "low" = "low") => {
      const cached = imageCacheRef.current.get(index);
      if (cached?.complete && cached.naturalWidth > 0) {
        return Promise.resolve();
      }

      const inFlight = inFlightRef.current.get(index);
      if (inFlight) return inFlight;

      const task = new Promise<void>((resolve) => {
        const image = new window.Image();
        image.decoding = "async";
        image.fetchPriority = priority;
        image.onload = () => {
          if (mountedRef.current) {
            imageCacheRef.current.set(index, image);
            trimImageCache();

            if (index === 0) {
              setFirstFrameReady(true);
            }

            if (Math.abs(index - frameToIndex(currentFrameRef.current)) <= 2) {
              setFirstFrameReady(true);
              drawFrame(currentFrameRef.current);
            }
          }
          resolve();
        };
        image.onerror = () => resolve();
        image.src = frameSources[index];
      });

      inFlightRef.current.set(index, task);
      void task.finally(() => {
        if (inFlightRef.current.get(index) === task) {
          inFlightRef.current.delete(index);
        }
      });

      return task;
    },
    [drawFrame, trimImageCache],
  );

  useEffect(() => {
    const imageCache = imageCacheRef.current;
    const inFlight = inFlightRef.current;
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      imageCache.clear();
      inFlight.clear();
    };
  }, []);

  useEffect(() => {
    if (shouldReduceMotion) return;

    let cancelled = false;
    let cursor = 0;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const radius = isMobile ? MOBILE_PRELOAD_RADIUS : DESKTOP_PRELOAD_RADIUS;
    const movingForward = currentIndex >= previousIndexRef.current;
    const priorityOrder = [currentIndex];

    for (let distance = 1; distance <= radius; distance += 1) {
      const forwardIndex = currentIndex + (movingForward ? distance : -distance);
      const backwardIndex = currentIndex + (movingForward ? -distance : distance);

      if (forwardIndex >= 0 && forwardIndex < FRAME_COUNT) {
        priorityOrder.push(forwardIndex);
      }
      if (backwardIndex >= 0 && backwardIndex < FRAME_COUNT) {
        priorityOrder.push(backwardIndex);
      }
    }

    currentFrameRef.current = currentFrame;
    previousIndexRef.current = currentIndex;
    cacheCenterRef.current = currentIndex;
    cacheLimitRef.current = isMobile ? MOBILE_CACHE_LIMIT : DESKTOP_CACHE_LIMIT;
    trimImageCache();
    drawFrame(currentFrame);

    async function loadWorker() {
      while (!cancelled) {
        const queueIndex = cursor;
        cursor += 1;
        if (queueIndex >= priorityOrder.length) return;

        const index = priorityOrder[queueIndex];
        await loadFrame(index, index === currentIndex ? "high" : "low");
      }
    }

    void Promise.all(Array.from({ length: isMobile ? 2 : 3 }, () => loadWorker()));

    return () => {
      cancelled = true;
    };
  }, [
    currentFrame,
    currentIndex,
    drawFrame,
    loadFrame,
    shouldReduceMotion,
    trimImageCache,
  ]);

  useEffect(() => {
    if (shouldReduceMotion) return;
    let resizeFrame = 0;
    const handleResize = () => {
      window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(() => {
        drawFrame(currentFrameRef.current);
      });
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.cancelAnimationFrame(resizeFrame);
      window.removeEventListener("resize", handleResize);
    };
  }, [drawFrame, shouldReduceMotion]);

  if (shouldReduceMotion) {
    return <ReducedMotionJourney />;
  }

  return (
    <section
      id={sectionIds.hero}
      ref={sceneRef}
      aria-label={copy.ariaLabel}
      className="relative h-[1750svh] bg-[#080705] md:h-[2000svh]"
    >
      <h1 className="sr-only">{copy.srTitle}</h1>

      <div className="sticky top-0 h-svh overflow-hidden bg-[#080705] text-cream">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          role="img"
          aria-label={`${copy.frameLabel} ${currentFrame}`}
        />

        <div
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,7,5,0.06)_0%,rgba(8,7,5,0.12)_38%,rgba(8,7,5,0.86)_100%)] md:bg-[linear-gradient(90deg,rgba(8,7,5,0.84)_0%,rgba(8,7,5,0.16)_56%,rgba(8,7,5,0.08)_100%)]"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_32%,rgba(8,7,5,0.42)_100%)]"
          aria-hidden="true"
        />

        <div
          className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-lg pt-lg transition-opacity md:px-xl md:pt-xl"
          style={{ opacity: 1 - brandOpacity }}
        >
          <span className="font-heading text-sm tracking-[0.28em] text-cream uppercase">
            Nevora
          </span>
          <div className="flex items-center gap-sm">
            <span className="hidden text-[0.58rem] tracking-[0.2em] text-cream/54 uppercase sm:block">
              {copy.previewLabel}
            </span>
            {sequenceProgress < 0.93 && <LanguageSwitcher />}
          </div>
        </div>

        <div
          className="pointer-events-none absolute inset-0 z-20 flex items-start justify-center px-lg pt-[11svh] text-center md:px-xl md:pt-[9svh]"
          style={{
            opacity: brandOpacity,
            transform: `translate3d(0, ${14 * (1 - brandOpacity)}px, 0)`,
            pointerEvents: brandProgress > 0.35 ? "auto" : "none",
          }}
          aria-hidden={brandProgress < 0.2}
        >
          <div className="max-w-[54rem]">
            <p className="text-[0.62rem] font-medium tracking-[0.38em] text-premium-gold uppercase sm:text-xs">
              {copy.brand.eyebrow}
            </p>
            <h2 className="mt-sm font-heading text-[clamp(4rem,12vw,10rem)] leading-[0.82] tracking-[-0.055em] text-cream">
              {copy.brand.title}
            </h2>
            <p className="mx-auto mt-md max-w-[34rem] text-sm leading-relaxed text-cream/76 sm:text-base md:text-lg">
              {copy.brand.tagline}
            </p>
            <div className="mt-lg flex flex-wrap justify-center gap-sm">
              <Button href={`#${sectionIds.products}`} variant="primary">
                {copy.brand.primaryCta}
              </Button>
              <Button href={`#${sectionIds.story}`} variant="secondary">
                {copy.brand.secondaryCta}
              </Button>
            </div>
          </div>
        </div>

        <div className="relative z-10 mx-auto h-full max-w-(--container-max) px-lg md:px-xl">
          {journeyBeatTimings.map((beat, index) => {
            const opacity = copyOpacity(currentFrame, beat);
            const beatCopy = copy.beats[index];

            return (
              <div
                key={beat.id}
                className="absolute inset-x-lg bottom-[17svh] max-w-[42rem] will-change-[opacity,transform] md:inset-x-xl md:top-1/2 md:bottom-auto md:-translate-y-1/2"
                style={{
                  opacity,
                  transform: `translate3d(0, ${18 * (1 - opacity)}px, 0)`,
                  pointerEvents: activeBeat?.id === beat.id ? "auto" : "none",
                }}
                aria-hidden={activeBeat?.id !== beat.id}
              >
                <p className="mb-sm text-[0.62rem] font-medium tracking-[0.34em] text-premium-gold uppercase sm:text-xs">
                  {beatCopy.label}
                </p>
                <h2 className="font-heading text-[clamp(2.5rem,7vw,6.5rem)] leading-[0.94] tracking-[-0.04em]">
                  {beatCopy.title}
                  <span className="block italic text-cream/88">{beatCopy.italicTitle}</span>
                </h2>
                <p className="mt-md max-w-[32rem] text-sm leading-relaxed text-cream/72 sm:text-base md:text-lg">
                  {beatCopy.description}
                </p>
              </div>
            );
          })}
        </div>

        <div
          className="absolute inset-x-lg bottom-7 z-30 transition-opacity md:inset-x-xl"
          style={{ opacity: 1 - brandOpacity }}
        >
          <div className="mb-3 flex items-center justify-between text-[0.58rem] tracking-[0.18em] text-cream/52 uppercase">
            <span>{copy.scrollHint}</span>
            <span className="font-mono text-cream/76">F{currentFrame}</span>
          </div>
          <div className="relative h-px overflow-visible bg-cream/18">
            <span
              className="absolute inset-y-0 bg-premium-gold"
              style={{
                width: `${sequenceProgress * 100}%`,
                left: direction === "ltr" ? 0 : undefined,
                right: direction === "rtl" ? 0 : undefined,
              }}
            />
            {journeyBeatTimings.map((beat) => (
              <span
                key={beat.id}
                className="absolute top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cream/70"
                style={{
                  left: `${
                    (direction === "rtl"
                      ? 1 - frameToIndex(beat.start) / (FRAME_COUNT - 1)
                      : frameToIndex(beat.start) / (FRAME_COUNT - 1)) * 100
                  }%`,
                }}
              />
            ))}
          </div>
        </div>

        {!firstFrameReady && (
          <div className="absolute inset-0 z-40 grid place-items-center bg-[#080705]">
            <div className="w-48 text-center">
              <p className="mb-3 text-[0.6rem] tracking-[0.3em] text-cream/64 uppercase">
                {copy.loading}
              </p>
              <div className="h-px overflow-hidden bg-cream/16">
                <span
                  className="block h-full w-1/3 animate-pulse bg-premium-gold"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
