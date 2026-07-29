"use client";

import { useReducedMotion } from "framer-motion";
import { useLenis } from "lenis/react";
import { Pause, Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
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

type FrameLoadJob = {
  index: number;
  priority: "high" | "low";
  promise: Promise<void>;
  cancel: () => void;
};

type FrameTier = "full" | "balanced" | "compact";

type CanvasLayout = {
  width: number;
  height: number;
};

type NavigatorWithConnection = Navigator & {
  connection?: { saveData?: boolean; effectiveType?: string };
  deviceMemory?: number;
};

const START_FRAME = 204;
const FILM_END_FRAME = 719;
const END_FRAME = 743;
const FRAME_COUNT = END_FRAME - START_FRAME + 1;
const FILM_FRAME_COUNT = FILM_END_FRAME - START_FRAME + 1;
const LAST_FILM_INDEX = FILM_FRAME_COUNT - 1;
const FILM_SCROLL_END = 0.94;
const HOLD_SCROLL_END = 0.995;
const FILM_PLAYBACK_DURATION_SECONDS = FRAME_COUNT / 24;
const MOBILE_PRELOAD_RADIUS = 7;
const DESKTOP_PRELOAD_RADIUS = 10;
const MOBILE_CACHE_LIMIT = 12;
const DESKTOP_CACHE_LIMIT = 18;
const CONSTRAINED_PRELOAD_RADIUS = 4;
const CONSTRAINED_CACHE_LIMIT = 7;
const PUBLIC_BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");
const CONTINUITY_BRIDGE_FRAMES = [312, 323, 351, 356, 540, 580, 588, 600, 608, 624, 692];
const CONTINUITY_BRIDGE_LEAD = 1.2;
const CONTINUITY_BRIDGE_TRAIL = 0.35;
const FRAME_TIER_DIRECTORY: Record<FrameTier, string> = {
  full: "frames-v010",
  balanced: "frames-v010-1024",
  compact: "frames-v010-768",
};

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

function frameSource(index: number, tier: FrameTier = "full") {
  const frame = START_FRAME + Math.min(Math.max(index, 0), LAST_FILM_INDEX);
  return `${PUBLIC_BASE_PATH}/images/journey/${FRAME_TIER_DIRECTORY[tier]}/nevora-one-take_f${String(frame).padStart(4, "0")}.webp`;
}

function frameRuntimeProfile() {
  const navigatorWithConnection = navigator as NavigatorWithConnection;
  const connection = navigatorWithConnection.connection;
  const viewport = window.visualViewport;
  const width = viewport?.width ?? window.innerWidth;
  const height = viewport?.height ?? window.innerHeight;
  const networkConstrained =
    connection?.saveData === true ||
    connection?.effectiveType === "slow-2g" ||
    connection?.effectiveType === "2g";
  const lowMemory =
    navigatorWithConnection.deviceMemory !== undefined && navigatorWithConnection.deviceMemory <= 4;
  const veryLowMemory =
    navigatorWithConnection.deviceMemory !== undefined && navigatorWithConnection.deviceMemory <= 2;

  return {
    constrained: networkConstrained || lowMemory,
    compact: networkConstrained || veryLowMemory,
    isMobile: width <= 767,
    maxViewportDimension: Math.max(width, height),
  };
}

function selectFrameTier(): FrameTier {
  const profile = frameRuntimeProfile();
  if (profile.compact) return "compact";

  const framePixelRatioCap = profile.isMobile ? 1.2 : 1.35;
  return profile.maxViewportDimension * framePixelRatioCap <= 1024 ? "balanced" : "full";
}

function JourneyPoster({
  frameIndex,
  alt,
  className,
}: {
  frameIndex: number;
  alt: string;
  className: string;
}) {
  return (
    <picture className={className}>
      <source
        media="(max-width: 767px)"
        srcSet={frameSource(frameIndex, "balanced")}
        type="image/webp"
      />
      <img
        src={frameSource(frameIndex)}
        alt={alt}
        width={1280}
        height={1280}
        loading="eager"
        fetchPriority="high"
        decoding="async"
        className="h-full w-full object-cover"
      />
    </picture>
  );
}

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
  const fadeFrames = Math.min(Math.max(beatLength * 0.15, 6), 10);
  const handoff = 0.5;
  const enter =
    beat.start === START_FRAME
      ? 1
      : cinematicEase(clamp((frame - (beat.start - handoff)) / fadeFrames));
  const exit =
    beat.end === END_FRAME
      ? 1
      : cinematicEase(clamp((beat.end + handoff - frame) / fadeFrames));

  return {
    opacity: Math.min(enter, exit),
    y: (1 - enter) * 22 - (1 - exit) * 16,
  };
}

function ReducedMotionJourney() {
  const { locale } = useLanguage();
  const copy = messages[locale].journey;

  return (
    <section
      id={sectionIds.hero}
      aria-label={copy.ariaLabel}
      className="relative flex min-h-svh items-end overflow-hidden bg-[#080705] px-sm pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(3rem,env(safe-area-inset-bottom))] text-cream sm:px-md sm:py-xl md:items-center md:px-lg lg:px-xl xl:px-2xl"
    >
      <JourneyPoster
        frameIndex={FRAME_COUNT - 1}
        alt={copy.reducedAlt}
        className="absolute inset-0 block h-full w-full"
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,7,5,0.08)_0%,rgba(8,7,5,0.24)_46%,rgba(8,7,5,0.92)_100%)] md:bg-[linear-gradient(90deg,rgba(8,7,5,0.9)_0%,rgba(8,7,5,0.28)_62%,rgba(8,7,5,0.18)_100%)]"
        aria-hidden="true"
      />
      <LanguageSwitcher className="absolute top-[max(0.75rem,env(safe-area-inset-top))] end-sm z-20 sm:top-md sm:end-md md:end-lg lg:end-xl xl:end-2xl" />
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
  const { locale, direction } = useLanguage();
  const lenis = useLenis();
  const copy = messages[locale].journey;
  const sceneRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageCacheRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const inFlightRef = useRef<Map<number, FrameLoadJob>>(new Map());
  const canvasContextRef = useRef<CanvasRenderingContext2D | null>(null);
  const canvasLayoutRef = useRef<CanvasLayout>({ width: 0, height: 0 });
  const currentFrameRef = useRef(START_FRAME);
  const previousIndexRef = useRef(0);
  const lastNonZeroDirectionRef = useRef<1 | -1>(1);
  const cacheCenterRef = useRef(0);
  const cacheLimitRef = useRef(DESKTOP_CACHE_LIMIT);
  const renderedSignatureRef = useRef("");
  const drawRequestRef = useRef<number | null>(null);
  const playbackRunRef = useRef(0);
  const isPlayingRef = useRef(false);
  const pendingFrameRef = useRef(START_FRAME);
  const loadQueueRef = useRef<FrameLoadRequest[]>([]);
  const activeLoadCountRef = useRef(0);
  const maxConcurrentLoadsRef = useRef(3);
  const mountedRef = useRef(false);
  const progress = useElementScrollProgress(sceneRef);
  const shouldReduceMotion = Boolean(useReducedMotion());
  const [firstFrameReady, setFirstFrameReady] = useState(false);
  const [frameTier, setFrameTier] = useState<FrameTier | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const framePosition = frameAtScrollProgress(progress);
  const currentFrame = Math.round(framePosition);
  const currentIndex = frameToIndex(Math.min(currentFrame, FILM_END_FRAME));
  const sequenceProgress = clamp((framePosition - START_FRAME) / (FRAME_COUNT - 1));
  const brandProgress = clamp((framePosition - 720) / (743 - 720));
  const brandOpacity = cinematicEase(clamp((brandProgress - 0.08) / 0.42));
  const activeBeatIndex = journeyBeatTimings.findIndex(
    (beat) => currentFrame >= beat.start && currentFrame <= beat.end,
  );
  const activeBeat = activeBeatIndex >= 0 ? journeyBeatTimings[activeBeatIndex] : undefined;
  const playbackLabel = isPlaying
    ? copy.pauseFilm
    : currentFrame >= END_FRAME - 1
      ? copy.replayFilm
      : copy.playFilm;

  const stopPlayback = useCallback((settleScroll = true) => {
    if (!isPlayingRef.current) return;

    playbackRunRef.current += 1;
    isPlayingRef.current = false;

    if (settleScroll && lenis) {
      // Lenis exposes cancellation through stop/start. Calling them as a pair
      // stops the film animator without leaving the visitor's scroll locked.
      lenis.stop();
      lenis.start();
    }

    setIsPlaying(false);
  }, [lenis]);

  const startPlayback = useCallback(() => {
    if (!lenis || !firstFrameReady) return;

    const scene = sceneRef.current;
    if (!scene) return;

    const travel = Math.max(scene.offsetHeight - window.innerHeight, 1);
    const sceneStart = lenis.actualScroll + scene.getBoundingClientRect().top;
    const currentScrollProgress = clamp((lenis.scroll - sceneStart) / travel);
    const shouldReplay = currentScrollProgress >= HOLD_SCROLL_END - 0.0005;
    const startProgress = shouldReplay ? 0 : currentScrollProgress;
    const targetScroll = sceneStart + travel * HOLD_SCROLL_END;
    const playbackDuration = Math.max(
      ((HOLD_SCROLL_END - startProgress) / HOLD_SCROLL_END) * FILM_PLAYBACK_DURATION_SECONDS,
      0.35,
    );
    const playbackRun = playbackRunRef.current + 1;

    playbackRunRef.current = playbackRun;
    isPlayingRef.current = true;
    setIsPlaying(true);

    if (shouldReplay) {
      lenis.scrollTo(sceneStart, { immediate: true, force: true });
    }

    lenis.scrollTo(targetScroll, {
      duration: playbackDuration,
      easing: (value) => value,
      lock: false,
      onComplete: () => {
        if (playbackRunRef.current !== playbackRun) return;

        isPlayingRef.current = false;
        setIsPlaying(false);
      },
    });
  }, [firstFrameReady, lenis]);

  const measureCanvasLayout = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return false;

    const bounds = canvas.getBoundingClientRect();
    const previous = canvasLayoutRef.current;
    const changed =
      Math.abs(previous.width - bounds.width) > 0.5 || Math.abs(previous.height - bounds.height) > 0.5;

    if (changed) {
      canvasLayoutRef.current = { width: bounds.width, height: bounds.height };
      renderedSignatureRef.current = "";
    }

    return changed;
  }, []);

  const drawFrame = useCallback((frame: number) => {
    const canvas = canvasRef.current;
    const canvasLayout = canvasLayoutRef.current;
    if (!canvas || !frameTier || canvasLayout.width < 1 || canvasLayout.height < 1) return;

    const boundedFrame = clamp(frame, START_FRAME, END_FRAME);
    const visualFrame = Math.min(boundedFrame, FILM_END_FRAME);
    const continuityBridge = CONTINUITY_BRIDGE_FRAMES.find(
      (bridgeFrame) =>
        visualFrame >= bridgeFrame - CONTINUITY_BRIDGE_LEAD &&
        visualFrame <= bridgeFrame + CONTINUITY_BRIDGE_TRAIL,
    );
    const lowerFrame = continuityBridge ? continuityBridge - 1 : Math.floor(visualFrame);
    const upperFrame = continuityBridge ? continuityBridge : Math.min(lowerFrame + 1, FILM_END_FRAME);
    const lowerIndex = frameToIndex(lowerFrame);
    const upperIndex = frameToIndex(upperFrame);
    const blend = continuityBridge
      ? cinematicEase(
          clamp(
            (visualFrame - (continuityBridge - CONTINUITY_BRIDGE_LEAD)) /
              (CONTINUITY_BRIDGE_LEAD + CONTINUITY_BRIDGE_TRAIL),
          ),
        )
      : cinematicEase(visualFrame - Math.floor(visualFrame));
    const continuityBlur = continuityBridge ? Math.sin(blend * Math.PI) * 0.8 : 0;
    const lowerImage = imageCacheRef.current.get(lowerIndex);
    const upperImage = imageCacheRef.current.get(upperIndex);
    const lowerReady = lowerImage?.complete === true && lowerImage.naturalWidth > 0;
    const upperReady = upperImage?.complete === true && upperImage.naturalWidth > 0;
    const targetIndex = frameToIndex(Math.round(visualFrame));
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
    if (!primaryImage?.complete || primaryImage.naturalWidth === 0) return;

    const framePixelRatioCap =
      frameTier === "compact" ? 1 : frameTier === "balanced" ? 1.2 : canvasLayout.width < 768 ? 1.5 : 1.35;
    const sourceLimitedRatio =
      primaryImage.naturalWidth / Math.max(canvasLayout.width, canvasLayout.height, 1);
    const pixelRatio = Math.min(window.devicePixelRatio || 1, framePixelRatioCap, sourceLimitedRatio);
    const targetWidth = Math.max(Math.round(canvasLayout.width * pixelRatio), 1);
    const targetHeight = Math.max(Math.round(canvasLayout.height * pixelRatio), 1);
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

    let context = canvasContextRef.current;
    if (!context) {
      context = canvas.getContext("2d", { alpha: false });
      canvasContextRef.current = context;
    }
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
  }, [frameTier]);

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

    const protectedIndexes = new Set([
      Math.max(center - 1, 0),
      center,
      Math.min(center + 1, LAST_FILM_INDEX),
    ]);
    const evictionOrder = [...cache.keys()]
      .filter((index) => !protectedIndexes.has(index))
      .sort((first, second) => Math.abs(second - center) - Math.abs(first - center));

    while (cache.size > limit) {
      const index = evictionOrder.shift();
      if (index === undefined) break;
      cache.delete(index);
    }
  }, []);

  const loadFrame = useCallback(
    (index: number, priority: "high" | "low" = "low") => {
      if (!frameTier) return Promise.resolve();

      const cached = imageCacheRef.current.get(index);
      if (cached?.complete && cached.naturalWidth > 0) {
        return Promise.resolve();
      }

      const inFlight = inFlightRef.current.get(index);
      if (inFlight) return inFlight.promise;

      let image: HTMLImageElement | null = null;
      let cancelled = false;
      let finish: (shouldCache?: boolean) => void = () => undefined;
      const task = new Promise<void>((resolve) => {
        image = new window.Image();
        let settled = false;
        const frameImage = image;
        frameImage.decoding = "async";
        frameImage.fetchPriority = priority;

        finish = (shouldCache = true) => {
          if (settled) return;
          settled = true;
          frameImage.onload = null;
          frameImage.onerror = null;

          if (shouldCache && !cancelled && mountedRef.current) {
            imageCacheRef.current.set(index, frameImage);
            trimImageCache();

            const centerIndex = frameToIndex(currentFrameRef.current);
            const leadingIndex = Math.min(
              Math.max(centerIndex + lastNonZeroDirectionRef.current, 0),
              LAST_FILM_INDEX,
            );
            const centerImage = imageCacheRef.current.get(centerIndex);
            const leadingImage = imageCacheRef.current.get(leadingIndex);
            const completedVisibleFrame = index === centerIndex || index === leadingIndex;

            if (
              completedVisibleFrame &&
              centerImage?.complete &&
              centerImage.naturalWidth > 0 &&
              leadingImage?.complete &&
              leadingImage.naturalWidth > 0
            ) {
              setFirstFrameReady(true);
              scheduleDraw(pendingFrameRef.current);
            }
          }
          resolve();
        };

        frameImage.onload = () => {
          void frameImage
            .decode()
            .catch(() => undefined)
            .finally(finish);
        };
        frameImage.onerror = () => finish(false);
        frameImage.src = frameSource(index, frameTier);
      });

      const job: FrameLoadJob = {
        index,
        priority,
        promise: task,
        cancel: () => {
          if (cancelled) return;
          cancelled = true;
          if (image) {
            image.onload = null;
            image.onerror = null;
            image.src = "";
          }
          finish(false);
        },
      };
      inFlightRef.current.set(index, job);
      void task.finally(() => {
        if (inFlightRef.current.get(index) === job) {
          inFlightRef.current.delete(index);
        }
      });

      return task;
    },
    [frameTier, scheduleDraw, trimImageCache],
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
      inFlight.forEach((job) => job.cancel());
      inFlight.clear();
      canvasContextRef.current = null;
      canvasLayoutRef.current = { width: 0, height: 0 };

      if (drawRequestRef.current !== null) {
        window.cancelAnimationFrame(drawRequestRef.current);
        drawRequestRef.current = null;
      }

      playbackRunRef.current += 1;
      isPlayingRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!lenis) return;

    const stopForVirtualScroll = () => {
      if (isPlayingRef.current) stopPlayback(false);
    };

    const isPlaybackControl = (target: EventTarget | null) =>
      target instanceof Element && Boolean(target.closest("[data-journey-playback-control]"));

    const stopOnPointerIntent = (event: PointerEvent) => {
      if (!isPlaybackControl(event.target) && isPlayingRef.current) stopPlayback();
    };

    const stopOnKeyboardIntent = (event: KeyboardEvent) => {
      if (isPlaybackControl(event.target)) return;

      if (
        ["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " ", "Spacebar"].includes(
          event.key,
        )
      ) {
        stopPlayback();
      }
    };

    const stopWhenHidden = () => {
      if (document.hidden) stopPlayback();
    };

    const unsubscribeVirtualScroll = lenis.on("virtual-scroll", stopForVirtualScroll);
    window.addEventListener("pointerdown", stopOnPointerIntent, { capture: true });
    window.addEventListener("keydown", stopOnKeyboardIntent, { capture: true });
    document.addEventListener("visibilitychange", stopWhenHidden);

    return () => {
      unsubscribeVirtualScroll();
      window.removeEventListener("pointerdown", stopOnPointerIntent, { capture: true });
      window.removeEventListener("keydown", stopOnKeyboardIntent, { capture: true });
      document.removeEventListener("visibilitychange", stopWhenHidden);
    };
  }, [lenis, stopPlayback]);

  useEffect(() => {
    if (shouldReduceMotion) stopPlayback();
  }, [shouldReduceMotion, stopPlayback]);

  useEffect(() => {
    if (shouldReduceMotion) return;

    const selectionFrame = window.requestAnimationFrame(() => {
      setFrameTier(selectFrameTier());
    });

    return () => window.cancelAnimationFrame(selectionFrame);
  }, [shouldReduceMotion]);

  useEffect(() => {
    if (shouldReduceMotion || !frameTier) return;
    scheduleDraw(framePosition);
  }, [framePosition, frameTier, scheduleDraw, shouldReduceMotion]);

  useEffect(() => {
    if (shouldReduceMotion || !frameTier) return;
    const profile = frameRuntimeProfile();
    const baseRadius = profile.constrained
      ? CONSTRAINED_PRELOAD_RADIUS
      : profile.isMobile
        ? MOBILE_PRELOAD_RADIUS
        : DESKTOP_PRELOAD_RADIUS;
    const indexDelta = currentIndex - previousIndexRef.current;
    const previousDirection = lastNonZeroDirectionRef.current;
    const directionOfTravel: 1 | -1 =
      indexDelta === 0 ? previousDirection : indexDelta > 0 ? 1 : -1;
    const directionChanged = indexDelta !== 0 && directionOfTravel !== previousDirection;
    if (indexDelta !== 0) lastNonZeroDirectionRef.current = directionOfTravel;

    const radius = Math.min(
      baseRadius + Math.abs(indexDelta) * 2,
      baseRadius + (profile.isMobile ? 4 : 8),
    );
    const priorityOrder = [
      currentIndex,
      Math.min(Math.max(currentIndex + directionOfTravel, 0), LAST_FILM_INDEX),
      Math.min(Math.max(currentIndex - directionOfTravel, 0), LAST_FILM_INDEX),
    ];
    const trailingRadius = Math.max(Math.round(radius * 0.35), 2);

    for (let distance = 1; distance <= radius; distance += 1) {
      const forwardIndex = currentIndex + directionOfTravel * distance;
      const backwardIndex = currentIndex - directionOfTravel * distance;

      if (forwardIndex >= 0 && forwardIndex < FILM_FRAME_COUNT) {
        priorityOrder.push(forwardIndex);
      }
      if (distance <= trailingRadius && backwardIndex >= 0 && backwardIndex < FILM_FRAME_COUNT) {
        priorityOrder.push(backwardIndex);
      }
    }

    const retainedIndexes = new Set(priorityOrder);
    const hasMeaningfulJump = Math.abs(indexDelta) >= 3;
    if (directionChanged || hasMeaningfulJump) {
      for (const [index, job] of inFlightRef.current) {
        const isCritical = Math.abs(index - currentIndex) <= 2;
        if (!isCritical && !retainedIndexes.has(index)) job.cancel();
      }
    }

    currentFrameRef.current = Math.min(currentFrame, FILM_END_FRAME);
    previousIndexRef.current = currentIndex;
    cacheCenterRef.current = currentIndex;
    cacheLimitRef.current = profile.constrained
      ? CONSTRAINED_CACHE_LIMIT
      : profile.isMobile
        ? MOBILE_CACHE_LIMIT
        : DESKTOP_CACHE_LIMIT;
    trimImageCache();
    maxConcurrentLoadsRef.current = profile.constrained ? 2 : profile.isMobile ? 2 : 3;
    loadQueueRef.current = [...retainedIndexes]
      .filter((index) => !imageCacheRef.current.has(index) && !inFlightRef.current.has(index))
      .map((index, queuePosition) => ({
        index,
        priority: queuePosition === 0 || Math.abs(index - currentIndex) <= 2 ? "high" : "low",
    }));
    pumpLoadQueue();
  }, [currentFrame, currentIndex, frameTier, pumpLoadQueue, shouldReduceMotion, trimImageCache]);

  useEffect(() => {
    if (shouldReduceMotion || !frameTier) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    let resizeFrame = 0;
    const handleResize = () => {
      window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(() => {
        if (measureCanvasLayout()) {
          scheduleDraw(pendingFrameRef.current);
        }
      });
    };
    const observer =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(handleResize);
    const viewport = window.visualViewport;

    observer?.observe(canvas);
    window.addEventListener("resize", handleResize);
    viewport?.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.cancelAnimationFrame(resizeFrame);
      observer?.disconnect();
      window.removeEventListener("resize", handleResize);
      viewport?.removeEventListener("resize", handleResize);
    };
  }, [frameTier, measureCanvasLayout, scheduleDraw, shouldReduceMotion]);

  if (shouldReduceMotion) {
    return <ReducedMotionJourney />;
  }

  return (
    <section
      id={sectionIds.hero}
      ref={sceneRef}
      aria-label={copy.ariaLabel}
      className="relative h-[1300svh] bg-[#080705] sm:h-[1450svh] md:h-[1600svh] lg:h-[1700svh]"
    >
      <h1 className="sr-only">{copy.srTitle}</h1>

      <div className="sticky top-0 h-svh overflow-hidden bg-[#080705] text-cream">
        <JourneyPoster
          frameIndex={0}
          alt=""
          className={`absolute inset-0 block h-full w-full transition-opacity duration-500 ease-out ${
            firstFrameReady ? "opacity-0" : "opacity-100"
          }`}
        />
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
          className="journey-topbar absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-sm px-sm pt-[max(0.75rem,env(safe-area-inset-top))] transition-opacity sm:px-md sm:pt-md md:px-lg lg:px-xl xl:px-2xl"
          style={{ opacity: 1 - brandOpacity }}
        >
          <span className="shrink-0 font-heading text-xs tracking-[0.28em] text-cream uppercase sm:text-sm">
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
          className="journey-brand pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-sm pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(6rem,env(safe-area-inset-bottom))] text-center sm:px-md md:items-start md:px-lg md:pt-[9svh] lg:px-xl xl:px-2xl"
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
            <h2 className="mt-sm font-heading text-[clamp(3rem,16vw,5.5rem)] leading-[0.84] tracking-[-0.055em] text-cream sm:text-[clamp(4rem,13vw,7rem)] md:text-[clamp(4.5rem,12vw,10rem)]">
              {copy.brand.title}
            </h2>
            <p className="journey-brand-tagline mx-auto mt-sm max-w-[34rem] text-[0.8125rem] leading-relaxed text-cream/76 sm:mt-md sm:text-base md:text-lg">
              {copy.brand.tagline}
            </p>
            <div className="journey-brand-actions mt-md flex flex-col gap-xs min-[480px]:flex-row min-[480px]:flex-wrap min-[480px]:justify-center sm:mt-lg sm:gap-sm">
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

        <div className="relative z-10 mx-auto h-full max-w-(--container-max) px-sm sm:px-md md:px-lg lg:px-xl xl:px-2xl">
          {journeyBeatTimings.map((beat, index) => {
            const motion = copyMotion(framePosition, beat);
            const beatCopy = copy.beats[index];

            return (
              <div
                key={beat.id}
                className="journey-copy absolute inset-x-sm bottom-[max(7.25rem,18svh)] max-w-[42rem] will-change-[opacity,transform] sm:inset-x-md sm:bottom-[17svh] md:inset-x-lg md:top-1/2 md:bottom-auto md:-translate-y-1/2 lg:inset-x-xl xl:inset-x-2xl"
                style={{
                  opacity: motion.opacity,
                  transform: `translate3d(0, ${motion.y}px, 0)`,
                  pointerEvents: activeBeat?.id === beat.id ? "auto" : "none",
                }}
                aria-hidden={activeBeat?.id !== beat.id}
              >
                <p className="mb-xs text-[0.6rem] font-medium tracking-[0.28em] text-premium-gold uppercase sm:mb-sm sm:text-xs sm:tracking-[0.34em]">
                  {beatCopy.label}
                </p>
                <h2 className="font-heading text-[clamp(1.9rem,9vw,3.3rem)] leading-[0.96] tracking-[-0.04em] sm:text-[clamp(2.5rem,7vw,5rem)] md:text-[clamp(3rem,7vw,6.5rem)]">
                  {beatCopy.title}
                  <span className="block italic text-cream/88">{beatCopy.italicTitle}</span>
                </h2>
                <p className="mt-sm max-w-[32rem] text-xs leading-[1.65] text-cream/72 min-[380px]:text-[0.8125rem] sm:mt-md sm:text-base md:text-lg">
                  {beatCopy.description}
                </p>
              </div>
            );
          })}
        </div>

        <div
          className="journey-progress absolute inset-x-sm bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-30 transition-opacity sm:inset-x-md md:inset-x-lg lg:inset-x-xl xl:inset-x-2xl"
          style={{ opacity: 1 - brandOpacity }}
        >
          <div className="mb-3 flex items-center justify-between gap-sm text-[0.58rem] tracking-[0.18em] text-cream/52 uppercase">
            <button
              type="button"
              data-journey-playback-control
              className="inline-flex min-h-9 shrink-0 items-center gap-2 rounded-full border border-cream/20 bg-coffee-dark/32 px-3 text-[0.58rem] tracking-[0.16em] text-cream/88 transition-[background-color,border-color,transform,opacity] hover:border-premium-gold hover:bg-coffee-dark/58 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-premium-gold active:scale-95 disabled:cursor-wait disabled:opacity-45 disabled:hover:border-cream/20 disabled:hover:bg-coffee-dark/32 disabled:active:scale-100"
              aria-label={playbackLabel}
              aria-pressed={isPlaying}
              disabled={!firstFrameReady || !lenis}
              onClick={() => (isPlayingRef.current ? stopPlayback() : startPlayback())}
            >
              {isPlaying ? (
                <Pause className="size-3.5 fill-current" aria-hidden="true" />
              ) : (
                <Play className="size-3.5 fill-current" aria-hidden="true" />
              )}
              <span>{playbackLabel}</span>
            </button>
            <div className="flex min-w-0 items-center justify-end gap-sm">
              <span className="journey-scroll-hint truncate">{copy.scrollHint}</span>
              <span className="shrink-0 font-mono text-cream/76">F{currentFrame}</span>
            </div>
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
          className={`absolute inset-0 z-40 grid place-items-center bg-[#080705]/28 backdrop-blur-[1px] transition-opacity duration-700 ease-out ${
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
