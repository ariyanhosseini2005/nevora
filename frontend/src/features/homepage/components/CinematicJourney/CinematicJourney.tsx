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

type FrameLoadRequest = {
  index: number;
  priority: "high" | "low";
};

const START_FRAME = 204;
const FILM_END_FRAME = 719;
const END_FRAME = 743;
const FRAME_COUNT = END_FRAME - START_FRAME + 1;
const FILM_SCROLL_END = 0.94;
const HOLD_SCROLL_END = 0.995;
const INITIAL_PRELOAD_COUNT = 3;
const MOBILE_PRELOAD_RADIUS = 8;
const DESKTOP_PRELOAD_RADIUS = 12;
const MOBILE_CACHE_LIMIT = 16;
const DESKTOP_CACHE_LIMIT = 24;
const CONSTRAINED_PRELOAD_RADIUS = 4;
const CONSTRAINED_CACHE_LIMIT = 10;
const PUBLIC_BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");
const CONTINUITY_BRIDGE_FRAMES = [312, 323, 351, 356, 540, 580, 588, 600, 608, 624, 692];
const CONTINUITY_BRIDGE_LEAD = 1.2;
const CONTINUITY_BRIDGE_TRAIL = 0.35;

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
  if (progress <= FILM_SCROLL_END) {
    return START_FRAME + (FILM_END_FRAME - START_FRAME) * clamp(progress / FILM_SCROLL_END);
  }

  const holdProgress = clamp((progress - FILM_SCROLL_END) / (HOLD_SCROLL_END - FILM_SCROLL_END));
  return FILM_END_FRAME + (END_FRAME - FILM_END_FRAME) * cinematicEase(holdProgress);
}

function copyMotion(frame: number, beat: JourneyBeatTiming) {
  const beatLength = beat.end - beat.start + 1;
  const fadeFrames = Math.min(Math.max(beatLength * 0.18, 10), 16);
  const overlap = fadeFrames * 0.5;
  const enter =
    beat.start === START_FRAME
      ? 1
      : cinematicEase(clamp((frame - (beat.start - overlap)) / fadeFrames));
  const exit =
    beat.end === END_FRAME ? 1 : cinematicEase(clamp((beat.end + overlap - frame) / fadeFrames));

  return {
    opacity: Math.min(enter, exit),
    y: (1 - enter) * 24 - (1 - exit) * 18,
  };
}

function ReducedMotionJourney() {
  const { locale } = useLanguage();
  const copy = messages[locale].journey;

  return (
    <section
      id={sectionIds.hero}
      aria-label={copy.ariaLabel}
      className="relative flex min-h-svh items-end overflow-hidden bg-[#080705] px-sm py-lg text-cream sm:px-lg sm:py-xl md:items-center md:px-xl"
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
      <LanguageSwitcher className="absolute top-sm end-sm z-20 sm:top-lg sm:end-lg md:top-xl md:end-xl" />
      <div className="relative z-10 mx-auto w-full max-w-(--container-max)">
        <p className="mb-sm text-[0.65rem] font-medium tracking-[0.34em] text-premium-gold uppercase sm:text-xs">
          {copy.reducedEyebrow}
        </p>
        <h1 className="max-w-[48rem] font-heading text-[clamp(2.25rem,7vw,6.8rem)] leading-[0.94] tracking-[-0.04em]">
          {copy.reducedTitle}
          <span className="block italic text-cream/88">{copy.reducedItalicTitle}</span>
        </h1>
        <p className="mt-md max-w-[34rem] text-sm leading-relaxed text-cream/72 sm:text-base md:text-lg">
          {copy.reducedDescription}
        </p>
        <div className="mt-lg flex flex-col gap-sm sm:flex-row sm:flex-wrap">
          <Button href={`#${sectionIds.products}`} variant="primary" className="w-full sm:w-auto">
            {copy.brand.primaryCta}
          </Button>
          <Button href={`#${sectionIds.story}`} variant="secondary" className="w-full sm:w-auto">
            {copy.brand.secondaryCta}
          </Button>
        </div>
      </div>
    </section>
  );
}

export function CinematicJourney() {
  for (let index = 0; index < INITIAL_PRELOAD_COUNT; index += 1) {
    ReactDOM.preload(frameSources[index], {
      as: "image",
      type: "image/webp",
      fetchPriority: index === 0 ? "high" : "low",
    });
  }

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
  const renderedSignatureRef = useRef("");
  const drawRequestRef = useRef<number | null>(null);
  const pendingFrameRef = useRef(START_FRAME);
  const loadQueueRef = useRef<FrameLoadRequest[]>([]);
  const activeLoadCountRef = useRef(0);
  const maxConcurrentLoadsRef = useRef(3);
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
  const activeBeatIndex = journeyBeatTimings.findIndex(
    (beat) => currentFrame >= beat.start && currentFrame <= beat.end,
  );
  const activeBeat = activeBeatIndex >= 0 ? journeyBeatTimings[activeBeatIndex] : undefined;

  const drawFrame = useCallback((frame: number) => {
    const canvas = canvasRef.current;
    const boundedFrame = clamp(frame, START_FRAME, END_FRAME);
    const continuityBridge = CONTINUITY_BRIDGE_FRAMES.find(
      (bridgeFrame) =>
        boundedFrame >= bridgeFrame - CONTINUITY_BRIDGE_LEAD &&
        boundedFrame <= bridgeFrame + CONTINUITY_BRIDGE_TRAIL,
    );
    const lowerFrame = continuityBridge ? continuityBridge - 1 : Math.floor(boundedFrame);
    const upperFrame = continuityBridge ? continuityBridge : Math.min(lowerFrame + 1, END_FRAME);
    const lowerIndex = frameToIndex(lowerFrame);
    const upperIndex = frameToIndex(upperFrame);
    const blend = continuityBridge
      ? cinematicEase(
          clamp(
            (boundedFrame - (continuityBridge - CONTINUITY_BRIDGE_LEAD)) /
              (CONTINUITY_BRIDGE_LEAD + CONTINUITY_BRIDGE_TRAIL),
          ),
        )
      : cinematicEase(boundedFrame - Math.floor(boundedFrame));
    const continuityBlur = continuityBridge ? Math.sin(blend * Math.PI) * 0.8 : 0;
    const lowerImage = imageCacheRef.current.get(lowerIndex);
    const upperImage = imageCacheRef.current.get(upperIndex);
    const lowerReady = lowerImage?.complete === true && lowerImage.naturalWidth > 0;
    const upperReady = upperImage?.complete === true && upperImage.naturalWidth > 0;
    const targetIndex = frameToIndex(Math.round(boundedFrame));
    let fallbackImage = imageCacheRef.current.get(targetIndex);
    let fallbackIndex = targetIndex;

    if (
      !lowerReady &&
      !upperReady &&
      (!fallbackImage?.complete || fallbackImage.naturalWidth === 0)
    ) {
      let nearestDistance = Number.POSITIVE_INFINITY;

      for (const [candidateIndex, candidate] of imageCacheRef.current) {
        const distance = Math.abs(candidateIndex - targetIndex);
        if (distance < nearestDistance && candidate.complete && candidate.naturalWidth > 0) {
          fallbackImage = candidate;
          nearestDistance = distance;
          fallbackIndex = candidateIndex;
        }
      }
    }

    const primaryImage =
      (lowerReady ? lowerImage : undefined) ??
      (upperReady ? upperImage : undefined) ??
      fallbackImage;
    if (!canvas || !primaryImage?.complete || primaryImage.naturalWidth === 0) return;

    const bounds = canvas.getBoundingClientRect();
    const sourceLimitedRatio = primaryImage.naturalWidth / Math.max(bounds.width, 1);
    const pixelRatio = Math.max(
      1,
      Math.min(window.devicePixelRatio || 1, bounds.width < 768 ? 1.5 : 1.35, sourceLimitedRatio),
    );
    const targetWidth = Math.max(Math.round(bounds.width * pixelRatio), 1);
    const targetHeight = Math.max(Math.round(bounds.height * pixelRatio), 1);
    const dimensionsChanged = canvas.width !== targetWidth || canvas.height !== targetHeight;
    const blendStep = Math.round(blend * 48);
    const signature =
      lowerReady && upperReady
        ? `${lowerIndex}:${upperIndex}:${blendStep}`
        : `fallback:${lowerReady ? lowerIndex : upperReady ? upperIndex : fallbackIndex}`;

    if (dimensionsChanged) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
    }

    if (!dimensionsChanged && renderedSignatureRef.current === signature) {
      return;
    }

    const context = canvas.getContext("2d", { alpha: false });
    if (!context) return;

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.filter = continuityBlur > 0.05 ? `blur(${continuityBlur.toFixed(2)}px)` : "none";

    const drawCover = (image: HTMLImageElement, opacity = 1) => {
      const scale = Math.max(targetWidth / image.naturalWidth, targetHeight / image.naturalHeight);
      const sourceWidth = targetWidth / scale;
      const sourceHeight = targetHeight / scale;
      const sourceX = (image.naturalWidth - sourceWidth) / 2;
      const sourceY = (image.naturalHeight - sourceHeight) / 2;
      context.globalAlpha = opacity;
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
    };

    if (lowerReady && upperReady) {
      drawCover(lowerImage, 1);
      if (blendStep > 0) drawCover(upperImage, blend);
    } else {
      drawCover(primaryImage, 1);
    }

    context.globalAlpha = 1;
    context.filter = "none";
    renderedSignatureRef.current = signature;
  }, []);

  const scheduleDraw = useCallback(
    (frame: number) => {
      pendingFrameRef.current = frame;
      if (drawRequestRef.current !== null) return;

      drawRequestRef.current = window.requestAnimationFrame(() => {
        drawRequestRef.current = null;
        drawFrame(pendingFrameRef.current);
      });
    },
    [drawFrame],
  );

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
        let settled = false;
        image.decoding = "async";
        image.fetchPriority = priority;

        const finish = () => {
          if (settled) return;
          settled = true;

          if (mountedRef.current) {
            imageCacheRef.current.set(index, image);
            trimImageCache();

            const centerIndex = frameToIndex(currentFrameRef.current);
            const nextIndex = Math.min(centerIndex + 1, FRAME_COUNT - 1);
            const centerImage = imageCacheRef.current.get(centerIndex);
            const nextImage = imageCacheRef.current.get(nextIndex);

            if (
              centerImage?.complete &&
              centerImage.naturalWidth > 0 &&
              nextImage?.complete &&
              nextImage.naturalWidth > 0
            ) {
              setFirstFrameReady(true);
              scheduleDraw(pendingFrameRef.current);
            }
          }
          resolve();
        };

        image.onload = () => {
          void image
            .decode()
            .catch(() => undefined)
            .finally(finish);
        };
        image.onerror = () => {
          if (!settled) {
            settled = true;
            resolve();
          }
        };
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
    [scheduleDraw, trimImageCache],
  );

  const pumpLoadQueue = useCallback(
    function pump() {
      if (!mountedRef.current) return;

      while (
        activeLoadCountRef.current < maxConcurrentLoadsRef.current &&
        loadQueueRef.current.length > 0
      ) {
        const request = loadQueueRef.current.shift();
        if (!request) break;

        const cached = imageCacheRef.current.get(request.index);
        if (cached?.complete && cached.naturalWidth > 0) continue;
        if (inFlightRef.current.has(request.index)) continue;

        activeLoadCountRef.current += 1;
        void loadFrame(request.index, request.priority).finally(() => {
          activeLoadCountRef.current = Math.max(activeLoadCountRef.current - 1, 0);
          pump();
        });
      }
    },
    [loadFrame],
  );

  useEffect(() => {
    const imageCache = imageCacheRef.current;
    const inFlight = inFlightRef.current;
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      loadQueueRef.current = [];
      imageCache.clear();
      inFlight.clear();

      if (drawRequestRef.current !== null) {
        window.cancelAnimationFrame(drawRequestRef.current);
        drawRequestRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (shouldReduceMotion) return;
    scheduleDraw(framePosition);
  }, [framePosition, scheduleDraw, shouldReduceMotion]);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const connection = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    const constrainedConnection =
      connection?.saveData === true ||
      connection?.effectiveType === "slow-2g" ||
      connection?.effectiveType === "2g";
    const baseRadius = constrainedConnection
      ? CONSTRAINED_PRELOAD_RADIUS
      : isMobile
        ? MOBILE_PRELOAD_RADIUS
        : DESKTOP_PRELOAD_RADIUS;
    const indexDelta = currentIndex - previousIndexRef.current;
    const radius = Math.min(baseRadius + Math.abs(indexDelta) * 2, baseRadius + (isMobile ? 4 : 8));
    const movingForward = indexDelta >= 0;
    const priorityOrder = [
      currentIndex,
      Math.min(currentIndex + 1, FRAME_COUNT - 1),
      Math.max(currentIndex - 1, 0),
    ];
    const trailingRadius = Math.max(Math.round(radius * 0.35), 2);

    for (let distance = 1; distance <= radius; distance += 1) {
      const forwardIndex = currentIndex + (movingForward ? distance : -distance);
      const backwardIndex = currentIndex + (movingForward ? -distance : distance);

      if (forwardIndex >= 0 && forwardIndex < FRAME_COUNT) {
        priorityOrder.push(forwardIndex);
      }
      if (distance <= trailingRadius && backwardIndex >= 0 && backwardIndex < FRAME_COUNT) {
        priorityOrder.push(backwardIndex);
      }
    }

    currentFrameRef.current = currentFrame;
    previousIndexRef.current = currentIndex;
    cacheCenterRef.current = currentIndex;
    cacheLimitRef.current = constrainedConnection
      ? CONSTRAINED_CACHE_LIMIT
      : isMobile
        ? MOBILE_CACHE_LIMIT
        : DESKTOP_CACHE_LIMIT;
    trimImageCache();
    maxConcurrentLoadsRef.current = constrainedConnection ? 2 : isMobile ? 2 : 3;
    loadQueueRef.current = [...new Set(priorityOrder)]
      .filter((index) => !imageCacheRef.current.has(index) && !inFlightRef.current.has(index))
      .map((index, queuePosition) => ({
        index,
        priority: queuePosition === 0 || Math.abs(index - currentIndex) <= 2 ? "high" : "low",
      }));
    pumpLoadQueue();
  }, [currentFrame, currentIndex, pumpLoadQueue, shouldReduceMotion, trimImageCache]);

  useEffect(() => {
    if (shouldReduceMotion) return;
    let resizeFrame = 0;
    const handleResize = () => {
      window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(() => {
        renderedSignatureRef.current = "";
        scheduleDraw(pendingFrameRef.current);
      });
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.cancelAnimationFrame(resizeFrame);
      window.removeEventListener("resize", handleResize);
    };
  }, [scheduleDraw, shouldReduceMotion]);

  if (shouldReduceMotion) {
    return <ReducedMotionJourney />;
  }

  return (
    <section
      id={sectionIds.hero}
      ref={sceneRef}
      aria-label={copy.ariaLabel}
      className="relative h-[1500svh] bg-[#080705] md:h-[1700svh]"
    >
      <h1 className="sr-only">{copy.srTitle}</h1>

      <div className="sticky top-0 h-svh overflow-hidden bg-[#080705] text-cream">
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 h-full w-full transition-opacity duration-700 ease-out [backface-visibility:hidden] [transform:translateZ(0)] ${
            firstFrameReady ? "opacity-100" : "opacity-0"
          }`}
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
          className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-sm pt-[max(1rem,env(safe-area-inset-top))] transition-opacity sm:px-lg sm:pt-lg md:px-xl md:pt-xl"
          style={{ opacity: 1 - brandOpacity }}
        >
          <span className="font-heading text-sm tracking-[0.28em] text-cream uppercase">
            Nevora
          </span>
          <div className="flex items-center gap-sm">
            <span className="hidden text-[0.58rem] tracking-[0.2em] text-cream/54 uppercase md:block">
              {copy.previewLabel}
            </span>
            {sequenceProgress < 0.93 && <LanguageSwitcher />}
          </div>
        </div>

        <div
          className="journey-brand pointer-events-none absolute inset-0 z-20 flex items-start justify-center px-sm pt-[10svh] text-center sm:px-lg md:px-xl md:pt-[9svh]"
          style={{
            opacity: brandOpacity,
            transform: `translate3d(0, ${14 * (1 - brandOpacity)}px, 0)`,
            pointerEvents: brandProgress > 0.35 ? "auto" : "none",
          }}
          aria-hidden={brandProgress < 0.2}
        >
          <div className="w-full max-w-[54rem]">
            <p className="text-[0.62rem] font-medium tracking-[0.38em] text-premium-gold uppercase sm:text-xs">
              {copy.brand.eyebrow}
            </p>
            <h2 className="mt-sm font-heading text-[clamp(3rem,12vw,10rem)] leading-[0.82] tracking-[-0.055em] text-cream">
              {copy.brand.title}
            </h2>
            <p className="mx-auto mt-md max-w-[34rem] text-sm leading-relaxed text-cream/76 sm:text-base md:text-lg">
              {copy.brand.tagline}
            </p>
            <div className="journey-brand-actions mt-md flex flex-col gap-sm sm:mt-lg sm:flex-row sm:flex-wrap sm:justify-center">
              <Button
                href={`#${sectionIds.products}`}
                variant="primary"
                className="w-full sm:w-auto"
              >
                {copy.brand.primaryCta}
              </Button>
              <Button
                href={`#${sectionIds.story}`}
                variant="secondary"
                className="w-full sm:w-auto"
              >
                {copy.brand.secondaryCta}
              </Button>
            </div>
          </div>
        </div>

        <div className="relative z-10 mx-auto h-full max-w-(--container-max) px-sm sm:px-lg md:px-xl">
          {journeyBeatTimings.map((beat, index) => {
            const motion = copyMotion(framePosition, beat);
            const beatCopy = copy.beats[index];

            return (
              <div
                key={beat.id}
                className="journey-copy absolute inset-x-sm bottom-[15svh] max-w-[42rem] will-change-[opacity,transform] sm:inset-x-lg sm:bottom-[17svh] md:inset-x-xl md:top-1/2 md:bottom-auto md:-translate-y-1/2"
                style={{
                  opacity: motion.opacity,
                  transform: `translate3d(0, ${motion.y}px, 0)`,
                  pointerEvents: activeBeat?.id === beat.id ? "auto" : "none",
                }}
                aria-hidden={activeBeat?.id !== beat.id}
              >
                <p className="mb-sm text-[0.62rem] font-medium tracking-[0.34em] text-premium-gold uppercase sm:text-xs">
                  {beatCopy.label}
                </p>
                <h2 className="font-heading text-[clamp(2rem,7vw,6.5rem)] leading-[0.94] tracking-[-0.04em]">
                  {beatCopy.title}
                  <span className="block italic text-cream/88">{beatCopy.italicTitle}</span>
                </h2>
                <p className="mt-sm max-w-[32rem] text-[0.8125rem] leading-relaxed text-cream/72 sm:mt-md sm:text-base md:text-lg">
                  {beatCopy.description}
                </p>
              </div>
            );
          })}
        </div>

        <div
          className="absolute inset-x-sm bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-30 transition-opacity sm:inset-x-lg md:inset-x-xl"
          style={{ opacity: 1 - brandOpacity }}
        >
          <div className="mb-3 flex items-center justify-between text-[0.58rem] tracking-[0.18em] text-cream/52 uppercase">
            <span className="truncate pe-sm">{copy.scrollHint}</span>
            <span className="shrink-0 font-mono text-cream/76">F{currentFrame}</span>
          </div>
          <div className="relative h-px overflow-visible bg-cream/18">
            <span
              className="absolute inset-0 bg-premium-gold will-change-transform"
              style={{
                transform: `scaleX(${sequenceProgress})`,
                transformOrigin: direction === "ltr" ? "left center" : "right center",
              }}
            />
            {journeyBeatTimings.map((beat) => {
              const isActive = activeBeat?.id === beat.id;

              return (
                <span
                  key={beat.id}
                  className={`absolute top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full transition-[transform,background-color] duration-300 ${
                    isActive ? "scale-150 bg-premium-gold" : "scale-100 bg-cream/60"
                  }`}
                  style={{
                    left: `${
                      (direction === "rtl"
                        ? 1 - frameToIndex(beat.start) / (FRAME_COUNT - 1)
                        : frameToIndex(beat.start) / (FRAME_COUNT - 1)) * 100
                    }%`,
                  }}
                />
              );
            })}
          </div>
        </div>

        <div
          className={`absolute inset-0 z-40 grid place-items-center bg-[#080705] transition-opacity duration-700 ease-out ${
            firstFrameReady ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
          aria-hidden={firstFrameReady}
        >
          <div className="w-48 text-center">
            <p className="mb-3 text-[0.6rem] tracking-[0.3em] text-cream/64 uppercase">
              {copy.loading}
            </p>
            <div className="h-px overflow-hidden bg-cream/16">
              <span className="block h-full w-1/3 animate-pulse bg-premium-gold" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
