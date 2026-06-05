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
import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import type { DocsTimeline, DocsTimelineChapter } from "../../data/docs";
import type { DocsCopy, DocsFeatureId } from "../../lib/translations";

type InteractiveDocsProps = {
  copy: DocsCopy;
  timelines: DocsTimeline[];
};

type ChapterView = DocsTimelineChapter & {
  description: string;
  index: number;
  title: string;
};

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

export function InteractiveDocs({ copy, timelines }: InteractiveDocsProps) {
  const firstFeatureId = timelines[0]?.featureId ?? "record";
  const shouldReduceMotion = useReducedMotion();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [activeFeatureId, setActiveFeatureId] =
    useState<DocsFeatureId>(firstFeatureId);
  const [hoveredFeatureId, setHoveredFeatureId] =
    useState<DocsFeatureId | null>(null);
  const [featurePopoverY, setFeaturePopoverY] = useState(0);
  const [requestedChapterId, setRequestedChapterId] = useState<string | null>(
    null,
  );
  const activeTimeline =
    timelines.find((timeline) => timeline.featureId === activeFeatureId) ??
    timelines[0];
  const hoveredTimeline = timelines.find(
    (timeline) => timeline.featureId === hoveredFeatureId,
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
      setRequestedChapterId(chapterId ?? null);
    };

    readHash();
    window.addEventListener("hashchange", readHash);

    return () => {
      window.removeEventListener("hashchange", readHash);
    };
  }, [timelines]);

  const selectFeature = (featureId: DocsFeatureId) => {
    setActiveFeatureId(featureId);
    setRequestedChapterId(null);
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
    setRequestedChapterId(chapterId);
    writeDocsHash(featureId, chapterId);
  };

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
              ref={sidebarRef}
              onMouseLeave={() => setHoveredFeatureId(null)}
              className="relative flex gap-6 overflow-x-auto pb-3 lg:block lg:space-y-2.5 lg:overflow-visible lg:pb-0"
            >
              {timelines.map((timeline) => {
                const feature = copy.features[timeline.featureId];
                const isActive = timeline.featureId === activeFeatureId;

                return (
                  <motion.button
                    type="button"
                    key={timeline.featureId}
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
                    className={`group block w-fit shrink-0 py-1.5 text-left text-base font-semibold transition-colors ${
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
                );
              })}

              <AnimatePresence>
                {hoveredTimeline && (
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
                      {copy.features[hoveredTimeline.featureId].title}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-white/65">
                      {copy.features[hoveredTimeline.featureId].summary}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          <div className="min-w-0">
            <AnimatePresence mode="wait">
              {activeTimeline && (
                <motion.div
                  key={activeTimeline.featureId}
                  initial={shouldReduceMotion ? false : { opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={
                    shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -18 }
                  }
                  transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
                >
                  <VideoDocPlayer
                    copy={copy}
                    requestedChapterId={requestedChapterId}
                    timeline={activeTimeline}
                    onChapterSelect={selectChapter}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

function VideoDocPlayer({
  copy,
  requestedChapterId,
  timeline,
  onChapterSelect,
}: {
  copy: DocsCopy;
  requestedChapterId: string | null;
  timeline: DocsTimeline;
  onChapterSelect: (featureId: DocsFeatureId, chapterId: string) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const feature = copy.features[timeline.featureId];
  const duration = timeline.duration;
  const chapters = useMemo<ChapterView[]>(
    () =>
      timeline.chapters.map((chapter, index) => {
        const chapterCopy = feature.chapters[chapter.id];

        return {
          ...chapter,
          description: chapterCopy?.description ?? "",
          index,
          title: chapterCopy?.title ?? chapter.id,
        };
      }),
    [feature.chapters, timeline.chapters],
  );
  const activeChapter = findChapterAtTime(chapters, currentTime);
  const activeChapterIndex = activeChapter?.index ?? 0;
  const currentChapter = activeChapter ?? chapters[0] ?? null;
  const hasVideo = Boolean(timeline.video) && !videoError;
  const progress =
    duration > 0 ? Math.min(1, Math.max(0, currentTime / duration)) : 0;

  useEffect(() => {
    setCurrentTime(0);
    setIsPlaying(false);
    setVideoError(false);
    videoRef.current?.pause();
  }, [timeline.featureId]);

  useEffect(() => {
    if (!requestedChapterId) return;

    const chapter = chapters.find((item) => item.id === requestedChapterId);
    if (!chapter) return;

    seekToChapter(chapter, false);
  }, [chapters, requestedChapterId]);

  const seekToChapter = (chapter: ChapterView, shouldPlay = true) => {
    setCurrentTime(chapter.start);
    onChapterSelect(timeline.featureId, chapter.id);

    const video = videoRef.current;
    if (!video || !hasVideo) return;

    video.currentTime = chapter.start;

    if (shouldPlay) {
      void video
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video || !hasVideo) return;

    if (video.paused) {
      void video
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const restart = () => {
    const firstChapter = chapters[0];
    if (!firstChapter) return;

    seekToChapter(firstChapter, hasVideo);
  };

  const seekRelativeChapter = (direction: -1 | 1) => {
    const nextIndex = Math.min(
      chapters.length - 1,
      Math.max(0, activeChapterIndex + direction),
    );
    const nextChapter = chapters[nextIndex];
    if (nextChapter) seekToChapter(nextChapter, hasVideo);
  };

  const getMarkerX = (chapter: ChapterView, isExpanded: boolean) => {
    const position = duration > 0 ? chapter.start / duration : 0;

    if (!isExpanded) return -5.25;
    if (position > 0.72) return -280;
    if (position > 0.2) return -140;
    return 0;
  };

  return (
    <article className="grid gap-5">
      <div className="overflow-visible border border-border/70 bg-card">
        <div className="relative aspect-video w-full bg-black">
          {hasVideo ? (
            <video
              ref={videoRef}
              aria-label={copy.videoAriaLabel}
              className="h-full w-full object-contain"
              poster={timeline.poster ?? undefined}
              preload="metadata"
              playsInline
              muted
              src={timeline.video ?? undefined}
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
                disabled={!hasVideo}
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
                  onClick={() => seekToChapter(chapter, hasVideo)}
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
                      <span className="mt-2 block text-xs leading-5 text-black/70">
                        {chapter.description}
                      </span>
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
                  <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">
                    {currentChapter.description}
                  </p>
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
