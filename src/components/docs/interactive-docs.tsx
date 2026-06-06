"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Pause,
  Play,
  RotateCcw,
  SkipBack,
  SkipForward,
  Video,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import type {
  DocsSidebarSizer,
  DocsTimeline,
  DocsTimelineChapter,
} from "../../data/docs";
import type { DocsCopy, DocsFeatureId } from "../../lib/translations";

type InteractiveDocsProps = {
  copy: DocsCopy;
  sidebarSizer: DocsSidebarSizer;
  timelines: DocsTimeline[];
};

type VideoDocPlayerCopy = Pick<
  DocsCopy,
  | "emptyVideoDescription"
  | "emptyVideoTitle"
  | "playback"
  | "progressLabel"
  | "videoAriaLabel"
>;

export type DocsFeatureDemoCopy = VideoDocPlayerCopy;

type DocsFeatureCopy = DocsCopy["features"][DocsFeatureId];

type ChapterView = DocsTimelineChapter & {
  descriptionHtml: string;
  index: number;
  title: string;
};

type ChapterRequest = {
  chapterId: string;
  requestId: number;
};

function getChapterViews(
  timeline: DocsTimeline,
  feature: DocsFeatureCopy,
): ChapterView[] {
  return timeline.chapters.map((chapter, index) => {
    const chapterCopy = feature.chapters[chapter.id];

    return {
      ...chapter,
      descriptionHtml:
        chapterCopy?.descriptionHtml ?? chapterCopy?.description ?? "",
      index,
      title: chapterCopy?.title ?? chapter.id,
    };
  });
}

function getChapterListProgress(
  chapters: ChapterView[],
  selectedChapterId: string | null,
  selectedChapterProgress: number,
) {
  if (!chapters.length || !selectedChapterId) return 0;

  const selectedIndex = chapters.findIndex(
    (chapter) => chapter.id === selectedChapterId,
  );
  if (selectedIndex === -1) return 0;
  if (chapters.length === 1) return 1;

  const clampedChapterProgress = Math.min(
    1,
    Math.max(0, selectedChapterProgress),
  );
  const itemHeight = 20;
  const itemGap = 10;
  const totalHeight =
    chapters.length * itemHeight + (chapters.length - 1) * itemGap;
  const selectedItemStart = selectedIndex * (itemHeight + itemGap);
  const selectedItemRange =
    selectedIndex === chapters.length - 1 ? itemHeight : itemHeight + itemGap;
  const selectedItemProgress =
    selectedItemStart + selectedItemRange * clampedChapterProgress;

  return Math.min(1, Math.max(0, selectedItemProgress / totalHeight));
}

function formatTime(value: number) {
  const safeValue = Math.max(0, Math.floor(value));
  const minutes = Math.floor(safeValue / 60);
  const seconds = `${safeValue % 60}`.padStart(2, "0");

  return `${minutes}:${seconds}`;
}

function findChapterAtTime(chapters: ChapterView[], currentTime: number) {
  return (
    chapters.find(
      (chapter) => currentTime >= chapter.start && currentTime < chapter.end,
    ) ??
    chapters[chapters.length - 1] ??
    null
  );
}

function writeDocsHash(featureId: DocsFeatureId, chapterId?: string) {
  if (typeof window === "undefined") return;

  const hash = chapterId ? `${featureId}:${chapterId}` : featureId;
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${window.location.search}#${hash}`,
  );
}

function isSpaceKey(event: KeyboardEvent) {
  return (
    event.code === "Space" || event.key === " " || event.key === "Spacebar"
  );
}

function isInteractiveShortcutTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) return false;

  if (target instanceof HTMLElement && target.isContentEditable) return true;

  return Boolean(
    target.closest(
      "a, button, input, textarea, select, [contenteditable='true'], [role='button'], [role='link']",
    ),
  );
}

export function InteractiveDocs({
  copy,
  sidebarSizer,
  timelines,
}: InteractiveDocsProps) {
  const firstFeatureId = timelines[0]?.featureId ?? "record";
  const shouldReduceMotion = useReducedMotion();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [activeFeatureId, setActiveFeatureId] =
    useState<DocsFeatureId>(firstFeatureId);
  const [hoveredFeatureId, setHoveredFeatureId] =
    useState<DocsFeatureId | null>(null);
  const [featurePopoverY, setFeaturePopoverY] = useState(0);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(
    null,
  );
  const [selectedChapterProgress, setSelectedChapterProgress] = useState(0);
  const [chapterRequest, setChapterRequest] = useState<ChapterRequest | null>(
    null,
  );
  const activeTimeline =
    timelines.find((timeline) => timeline.featureId === activeFeatureId) ??
    timelines[0];
  const hoveredTimeline = timelines.find(
    (timeline) => timeline.featureId === hoveredFeatureId,
  );
  const activeChapters = useMemo(
    () =>
      activeTimeline
        ? getChapterViews(
            activeTimeline,
            copy.features[activeTimeline.featureId],
          )
        : [],
    [activeTimeline, copy.features],
  );
  const visibleHoveredTimeline =
    hoveredTimeline?.featureId === activeFeatureId ? null : hoveredTimeline;
  const activeSidebarProgress = getChapterListProgress(
    activeChapters,
    selectedChapterId,
    selectedChapterProgress,
  );

  useEffect(() => {
    const readHash = () => {
      const hash = window.location.hash.replace(/^#/, "");
      if (!hash) return;

      const [featureId, chapterId] = hash.split(":");
      const matchingTimeline = timelines.find(
        (timeline) => timeline.featureId === featureId,
      );
      if (!matchingTimeline) return;

      setActiveFeatureId(matchingTimeline.featureId);
      setSelectedChapterId(chapterId ?? null);
      setSelectedChapterProgress(0);
      if (!chapterId) {
        setChapterRequest(null);
        return;
      }

      setChapterRequest((current) => ({
        chapterId,
        requestId: (current?.requestId ?? 0) + 1,
      }));
    };

    readHash();
    window.addEventListener("hashchange", readHash);

    return () => {
      window.removeEventListener("hashchange", readHash);
    };
  }, [timelines]);

  const selectFeature = (featureId: DocsFeatureId) => {
    setActiveFeatureId(featureId);
    setSelectedChapterId(null);
    setSelectedChapterProgress(0);
    setChapterRequest(null);
    writeDocsHash(featureId);
  };

  const updateHoveredFeature = (
    featureId: DocsFeatureId,
    target: HTMLElement,
  ) => {
    const sidebarRect = sidebarRef.current?.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    setHoveredFeatureId(featureId);
    setFeaturePopoverY(
      sidebarRect
        ? targetRect.top - sidebarRect.top + targetRect.height / 2
        : 0,
    );
  };

  const selectChapter = (featureId: DocsFeatureId, chapterId: string) => {
    setActiveFeatureId(featureId);
    setSelectedChapterId(chapterId);
    setSelectedChapterProgress(0);
    setChapterRequest((current) => ({
      chapterId,
      requestId: (current?.requestId ?? 0) + 1,
    }));
    writeDocsHash(featureId, chapterId);
  };

  const updateSelectedChapter = (
    featureId: DocsFeatureId,
    chapterId: string,
  ) => {
    setActiveFeatureId(featureId);
    setSelectedChapterId(chapterId);
    setSelectedChapterProgress(0);
    writeDocsHash(featureId, chapterId);
  };

  const updatePlaybackState = useCallback(
    (
      featureId: DocsFeatureId,
      chapterId: string | null,
      chapterProgress: number,
    ) => {
      if (featureId !== activeFeatureId) return;

      if (chapterId) {
        setSelectedChapterId(chapterId);
        setSelectedChapterProgress(chapterProgress);
      }
    },
    [activeFeatureId],
  );

  return (
    <section className="min-h-screen pb-24 pt-32">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-12">
        <motion.header
          initial={shouldReduceMotion ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl"
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
            {copy.eyebrow}
          </p>
          <h1 className="text-[clamp(2.25rem,7vw,5.75rem)] font-bold leading-[0.96] tracking-tight text-foreground">
            {copy.title}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
            {copy.description}
          </p>
        </motion.header>

        <div className="mt-14 grid gap-8 lg:grid-cols-[max-content_minmax(0,1fr)] lg:gap-16 xl:gap-20">
          <nav aria-label={copy.featureListAria} className="relative min-w-0">
            <div
              aria-hidden="true"
              className="pointer-events-none invisible hidden h-0 w-max overflow-hidden lg:block"
            >
              <div className="w-max">
                <div className="py-1.5 text-base font-semibold">
                  {sidebarSizer.featureTitle}
                </div>
                {sidebarSizer.chapterTitle && (
                  <div className="pl-4 pt-4">
                    <div className="text-xs font-medium leading-5">
                      {sidebarSizer.chapterTitle}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div
              ref={sidebarRef}
              onMouseLeave={() => setHoveredFeatureId(null)}
              className="relative flex gap-6 overflow-x-auto pb-3 lg:block lg:space-y-2.5 lg:overflow-visible lg:pb-0"
            >
              {timelines.map((timeline) => {
                const feature = copy.features[timeline.featureId];
                const isActive = timeline.featureId === activeFeatureId;

                const chapters =
                  isActive && timeline.featureId === activeTimeline?.featureId
                    ? activeChapters
                    : [];

                return (
                  <motion.div
                    key={timeline.featureId}
                    layout
                    className="w-max max-w-[calc(100vw-3rem)] shrink-0 lg:max-w-none"
                    transition={{
                      layout: {
                        duration: shouldReduceMotion ? 0 : 0.26,
                        ease: [0.16, 1, 0.3, 1],
                      },
                    }}
                  >
                    <motion.button
                      type="button"
                      aria-current={isActive ? "page" : undefined}
                      onClick={() => selectFeature(timeline.featureId)}
                      onFocus={(event) =>
                        updateHoveredFeature(
                          timeline.featureId,
                          event.currentTarget,
                        )
                      }
                      onPointerEnter={(event) =>
                        updateHoveredFeature(
                          timeline.featureId,
                          event.currentTarget,
                        )
                      }
                      onMouseEnter={(event) =>
                        updateHoveredFeature(
                          timeline.featureId,
                          event.currentTarget,
                        )
                      }
                      className={`group block w-fit py-1.5 text-left text-base font-semibold transition-colors ${
                        isActive
                          ? "text-red-400"
                          : "text-foreground hover:text-white"
                      }`}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="relative inline-block">
                        {feature.title}
                        <span
                          className={`absolute -bottom-1 left-0 h-px w-full origin-left transition-transform duration-300 ${
                            isActive
                              ? "scale-x-100 bg-red-400"
                              : "scale-x-0 bg-white group-hover:scale-x-100"
                          }`}
                          aria-hidden="true"
                        />
                      </span>
                    </motion.button>

                    <AnimatePresence initial={false}>
                      {chapters.length > 0 && (
                        <motion.div
                          key={`${timeline.featureId}-chapters`}
                          className="overflow-hidden"
                          initial={
                            shouldReduceMotion
                              ? { opacity: 0 }
                              : { height: 0, opacity: 0 }
                          }
                          animate={
                            shouldReduceMotion
                              ? { opacity: 1 }
                              : { height: "auto", opacity: 1 }
                          }
                          exit={
                            shouldReduceMotion
                              ? { opacity: 0 }
                              : { height: 0, opacity: 0 }
                          }
                          transition={{
                            duration: shouldReduceMotion ? 0.16 : 0.28,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                        >
                          <div className="relative pl-4 pt-4">
                            <span
                              className="absolute bottom-0 left-0 top-4 w-px bg-white/15"
                              aria-hidden="true"
                            />
                            <motion.span
                              className="absolute bottom-0 left-0 top-4 w-px origin-top bg-white/50"
                              aria-hidden="true"
                              animate={{ scaleY: activeSidebarProgress }}
                              transition={{
                                duration: shouldReduceMotion ? 0 : 0.18,
                                ease: [0.16, 1, 0.3, 1],
                              }}
                            />
                            <div className="grid gap-2.5">
                              {chapters.map((chapter) => {
                                const isSelected =
                                  selectedChapterId === chapter.id;

                                return (
                                  <button
                                    type="button"
                                    key={chapter.id}
                                    aria-current={
                                      isSelected ? "location" : undefined
                                    }
                                    onClick={() =>
                                      selectChapter(
                                        timeline.featureId,
                                        chapter.id,
                                      )
                                    }
                                    className={`block w-full text-left text-xs font-medium leading-5 transition-colors focus:outline-none focus-visible:underline focus-visible:underline-offset-4 ${
                                      isSelected
                                        ? "text-red-300"
                                        : "text-white/50 hover:text-white/80"
                                    } break-words`}
                                  >
                                    {chapter.title}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}

              <AnimatePresence>
                {visibleHoveredTimeline && (
                  <motion.div
                    key="feature-popover"
                    className="pointer-events-none absolute left-[calc(100%+1.25rem)] top-0 z-30 hidden w-72 border border-white/10 bg-black p-5 shadow-[0_24px_70px_rgba(0,0,0,0.48)] lg:block"
                    initial={
                      shouldReduceMotion
                        ? { opacity: 0 }
                        : { opacity: 0, x: -10, y: featurePopoverY - 38 }
                    }
                    animate={
                      shouldReduceMotion
                        ? { opacity: 1 }
                        : { opacity: 1, x: 0, y: featurePopoverY - 38 }
                    }
                    exit={
                      shouldReduceMotion
                        ? { opacity: 0 }
                        : { opacity: 0, x: -8 }
                    }
                    transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <p className="text-sm font-semibold text-white">
                      {copy.features[visibleHoveredTimeline.featureId].title}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-white/65">
                      {copy.features[visibleHoveredTimeline.featureId].summary}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          <div className="min-w-0">
            {activeTimeline && (
              <motion.div
                key={activeTimeline.featureId}
                initial={shouldReduceMotion ? false : { opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
              >
                <VideoDocPlayer
                  copy={copy}
                  deferMediaUntilVisible={false}
                  enableKeyboardPlayback
                  feature={copy.features[activeTimeline.featureId]}
                  requestedChapter={chapterRequest}
                  timeline={activeTimeline}
                  onChapterSelect={updateSelectedChapter}
                  onPlaybackStateChange={updatePlaybackState}
                />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export function DocsFeatureDemo({
  copy,
  deferMediaUntilVisible = false,
  feature,
  timeline,
}: {
  copy: DocsFeatureDemoCopy;
  deferMediaUntilVisible?: boolean;
  feature: DocsFeatureCopy;
  timeline: DocsTimeline;
}) {
  return (
    <VideoDocPlayer
      copy={copy}
      deferMediaUntilVisible={deferMediaUntilVisible}
      feature={feature}
      requestedChapter={null}
      timeline={timeline}
      onChapterSelect={() => {}}
      onPlaybackStateChange={() => {}}
    />
  );
}

function VideoDocPlayer({
  copy,
  deferMediaUntilVisible = false,
  enableKeyboardPlayback = false,
  feature,
  requestedChapter,
  timeline,
  onChapterSelect,
  onPlaybackStateChange,
}: {
  copy: VideoDocPlayerCopy;
  deferMediaUntilVisible?: boolean;
  enableKeyboardPlayback?: boolean;
  feature: DocsFeatureCopy;
  requestedChapter: ChapterRequest | null;
  timeline: DocsTimeline;
  onChapterSelect: (featureId: DocsFeatureId, chapterId: string) => void;
  onPlaybackStateChange: (
    featureId: DocsFeatureId,
    chapterId: string | null,
    chapterProgress: number,
  ) => void;
}) {
  const playerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [canLoadMedia, setCanLoadMedia] = useState(!deferMediaUntilVisible);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const duration = timeline.duration;
  const chapters = useMemo<ChapterView[]>(
    () => getChapterViews(timeline, feature),
    [feature, timeline],
  );
  const activeChapter = findChapterAtTime(chapters, currentTime);
  const activeChapterIndex = activeChapter?.index ?? 0;
  const currentChapter = activeChapter ?? chapters[0] ?? null;
  const hasConfiguredVideo = Boolean(timeline.video);
  const hasVideo = hasConfiguredVideo && !videoError;
  const canControlVideo = hasVideo && canLoadMedia;
  const progress =
    duration > 0 ? Math.min(1, Math.max(0, currentTime / duration)) : 0;

  useEffect(() => {
    setCanLoadMedia(!deferMediaUntilVisible);

    if (!deferMediaUntilVisible) return;

    const player = playerRef.current;
    if (!player || typeof IntersectionObserver === "undefined") {
      setCanLoadMedia(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;

        setCanLoadMedia(true);
        observer.disconnect();
      },
      { threshold: 0.01 },
    );

    observer.observe(player);

    return () => {
      observer.disconnect();
    };
  }, [deferMediaUntilVisible, timeline.featureId]);

  useEffect(() => {
    setCurrentTime(0);
    setIsPlaying(false);
    setVideoError(false);
    videoRef.current?.pause();
  }, [timeline.featureId]);

  useEffect(() => {
    if (!requestedChapter) return;

    const chapter = chapters.find(
      (item) => item.id === requestedChapter.chapterId,
    );
    if (!chapter) return;

    seekToChapter(chapter, false, false);
  }, [chapters, requestedChapter]);

  useEffect(() => {
    const chapterProgress =
      activeChapter && activeChapter.end > activeChapter.start
        ? (currentTime - activeChapter.start) /
          (activeChapter.end - activeChapter.start)
        : 0;

    onPlaybackStateChange(
      timeline.featureId,
      activeChapter?.id ?? null,
      chapterProgress,
    );
  }, [
    activeChapter?.id,
    activeChapter?.end,
    activeChapter?.start,
    currentTime,
    onPlaybackStateChange,
    timeline.featureId,
  ]);

  const seekToChapter = (
    chapter: ChapterView,
    shouldPlay = true,
    shouldNotify = true,
  ) => {
    setCurrentTime(chapter.start);
    if (shouldNotify) {
      onChapterSelect(timeline.featureId, chapter.id);
    }

    const video = videoRef.current;
    if (!video || !canControlVideo) return;

    video.currentTime = chapter.start;

    if (shouldPlay) {
      void video
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  const togglePlayback = useCallback(() => {
    const video = videoRef.current;
    if (!video || !canControlVideo) return;

    if (video.paused) {
      void video
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, [canControlVideo]);

  useEffect(() => {
    if (!enableKeyboardPlayback) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.repeat ||
        !isSpaceKey(event) ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        !canControlVideo ||
        isInteractiveShortcutTarget(event.target)
      ) {
        return;
      }

      event.preventDefault();
      togglePlayback();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [canControlVideo, enableKeyboardPlayback, togglePlayback]);

  const restart = () => {
    const firstChapter = chapters[0];
    if (!firstChapter) return;

    seekToChapter(firstChapter, canControlVideo);
  };

  const seekRelativeChapter = (direction: -1 | 1) => {
    const nextIndex = Math.min(
      chapters.length - 1,
      Math.max(0, activeChapterIndex + direction),
    );
    const nextChapter = chapters[nextIndex];
    if (nextChapter) seekToChapter(nextChapter, canControlVideo);
  };

  const getMarkerX = (chapter: ChapterView, isExpanded: boolean) => {
    const position = duration > 0 ? chapter.start / duration : 0;

    if (!isExpanded) return -5.25;
    if (position > 0.72) return -280;
    if (position > 0.2) return -140;
    return 0;
  };

  return (
    <article ref={playerRef} className="grid gap-5">
      <div className="overflow-visible border border-border/70 bg-card">
        <div className="relative aspect-video w-full bg-black">
          {hasVideo ? (
            <video
              ref={videoRef}
              aria-label={copy.videoAriaLabel}
              className="h-full w-full object-contain"
              poster={canLoadMedia ? timeline.poster ?? undefined : undefined}
              preload={canLoadMedia ? "metadata" : "none"}
              playsInline
              muted
              src={canLoadMedia ? timeline.video ?? undefined : undefined}
              onEnded={() => setIsPlaying(false)}
              onError={() => {
                setVideoError(true);
                setIsPlaying(false);
              }}
              onLoadedMetadata={(event) => {
                setCurrentTime(event.currentTarget.currentTime);
              }}
              onPause={() => setIsPlaying(false)}
              onPlay={() => setIsPlaying(true)}
              onTimeUpdate={(event) => {
                setCurrentTime(event.currentTarget.currentTime);
              }}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center px-6 text-center">
              <Video
                className="h-10 w-10 text-muted-foreground"
                aria-hidden="true"
              />
              <h2 className="mt-5 text-xl font-semibold text-foreground">
                {copy.emptyVideoTitle}
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
                {copy.emptyVideoDescription}
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-border/70 p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span aria-hidden="true">/</span>
              <span>{formatTime(duration)}</span>
            </div>

            <div className="flex items-center gap-2">
              <IconButton
                label={copy.playback.previous}
                onClick={() => seekRelativeChapter(-1)}
                disabled={activeChapterIndex === 0}
              >
                <SkipBack className="h-4 w-4" aria-hidden="true" />
              </IconButton>
              <IconButton
                label={isPlaying ? copy.playback.pause : copy.playback.play}
                onClick={togglePlayback}
                disabled={!canControlVideo}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Play className="h-4 w-4" aria-hidden="true" />
                )}
              </IconButton>
              <IconButton
                label={copy.playback.restart}
                onClick={restart}
                disabled={!chapters.length}
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
              </IconButton>
              <IconButton
                label={copy.playback.next}
                onClick={() => seekRelativeChapter(1)}
                disabled={activeChapterIndex >= chapters.length - 1}
              >
                <SkipForward className="h-4 w-4" aria-hidden="true" />
              </IconButton>
            </div>
          </div>

          <div className="relative ml-1 mt-3 h-5">
            <div
              aria-label={copy.progressLabel}
              aria-valuemax={Math.round(duration)}
              aria-valuemin={0}
              aria-valuenow={Math.round(currentTime)}
              className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 bg-muted"
              role="progressbar"
            >
              <motion.div
                className="h-full bg-foreground"
                animate={{ scaleX: progress }}
                style={{ originX: 0 }}
                transition={{ duration: 0.18 }}
              />
            </div>

            {chapters.map((chapter) => {
              const isActive = chapter.id === activeChapter?.id;
              const isPlayed = currentTime >= chapter.end;
              const markerLeft =
                duration > 0
                  ? `${Math.min(100, Math.max(0, (chapter.start / duration) * 100))}%`
                  : "0%";

              return (
                <button
                  type="button"
                  key={chapter.id}
                  aria-label={`${String(chapter.index + 1).padStart(2, "0")} ${chapter.title}`}
                  onClick={() => seekToChapter(chapter, canControlVideo)}
                  className="docs-marker absolute top-[calc(50%-5.25px)] z-20"
                  style={
                    {
                      left: markerLeft,
                      "--docs-marker-expanded-x": `${getMarkerX(chapter, true)}px`,
                      "--docs-marker-x": `${getMarkerX(chapter, false)}px`,
                      "--docs-marker-color": isActive
                        ? "rgb(248 113 113)"
                        : isPlayed
                          ? "var(--foreground)"
                          : "var(--muted-foreground)",
                    } as CSSProperties
                  }
                >
                  <span
                    className="docs-marker-visual absolute left-0 top-0 block overflow-hidden text-left shadow-[0_18px_46px_rgba(0,0,0,0.42)]"
                    aria-hidden="true"
                  >
                    <span className="docs-marker-content block p-4">
                      <span className="flex items-center justify-between gap-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-black/55">
                        <span>
                          {String(chapter.index + 1).padStart(2, "0")}
                        </span>
                        <span>{formatTime(chapter.start)}</span>
                      </span>
                      <span className="mt-3 block text-sm font-semibold text-black">
                        {chapter.title}
                      </span>
                      <span
                        className="mt-2 block text-xs leading-5 text-black/70 [&_strong]:font-semibold [&_strong]:text-black"
                        dangerouslySetInnerHTML={{
                          __html: chapter.descriptionHtml,
                        }}
                      />
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {currentChapter && (
            <div className="mt-5 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.section
                  key={`${timeline.featureId}-${currentChapter.id}`}
                  className="pt-2"
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={
                    shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -22 }
                  }
                  transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="flex items-center gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center bg-foreground text-xs font-semibold text-background">
                      {String(currentChapter.index + 1).padStart(2, "0")}
                    </span>
                    <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                      {currentChapter.title}
                    </h2>
                  </div>
                  <div
                    className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4 [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm [&_code]:text-foreground [&_em]:text-foreground [&_strong]:font-semibold [&_strong]:text-foreground"
                    dangerouslySetInnerHTML={{
                      __html: currentChapter.descriptionHtml,
                    }}
                  />
                </motion.section>
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function IconButton({
  children,
  disabled,
  label,
  onClick,
}: {
  children: ReactNode;
  disabled?: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center border border-border/70 bg-background text-foreground transition-colors hover:border-foreground/40 disabled:cursor-not-allowed disabled:opacity-35"
    >
      {children}
    </button>
  );
}
