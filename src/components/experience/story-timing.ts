/** One recording clock shared by the story, tracks, preview and scroll tour. */
export const RECORDING_DURATION = 24;
export const SCREENSHOT_TIME = 22.3;

export const STORY = {
  menuOpen: 1.8,
  done: 2.8,
  toastEnd: 4.2,
  openDetail: 4.8,
  play: 6.5,
  focusComment: 15.55,
  typeStart: 15.8,
  submit: 18.17,
  cameraSplit: 20.5,
  closeDetail: 23.7,
} as const;

export const CAPTION = { start: 11.8, end: 15.2, fade: 0.2, readTail: 0.4 } as const;
export const CAPTION_CLIPS = [
  [11.6, 12.7],
  [12.8, 13.9],
  [14.0, 15.4],
] as const;

/** Chapter framing stays independent from the recording's continuous clock. */
export const CHAPTERS = [
  { key: "zoom", from: 0.16, to: 0.28, scrub: [0.1825, 0.28], time: [0.8, 4.5] },
  { key: "zoom3d", from: 0.28, to: 0.385, scrub: [0.3025, 0.385], time: [5.4, 8.1] },
  { key: "lens", from: 0.385, to: 0.475, scrub: [0.4075, 0.475], time: [8.4, 11.4] },
  { key: "captions", from: 0.475, to: 0.58, scrub: [0.4975, 0.58], time: [11.6, 15.4] },
  { key: "keyboard", from: 0.58, to: 0.69, scrub: [0.6, 0.676], time: [15.5, 19.1] },
  { key: "camera", from: 0.69, to: 0.8, scrub: [0.715, 0.78], time: [19.4, 22.0] },
  { key: "screenshot", from: 0.8, to: 0.95, scrub: [0.8, 0.815], time: [SCREENSHOT_TIME, SCREENSHOT_TIME] },
] as const;

/** Pure sampling makes reverse scrolling and direct chapter navigation agree. */
export function tourTimeAt(progress: number) {
  let previousProgress: number = CHAPTERS[0].scrub[0];
  let previousTime: number = CHAPTERS[0].time[0];
  for (const chapter of CHAPTERS) {
    const points = [[chapter.scrub[0], chapter.time[0]], [chapter.scrub[1], chapter.time[1]]] as const;
    for (const [nextProgress, nextTime] of points) {
      if (progress <= nextProgress) {
        const span = nextProgress - previousProgress;
        const amount = span > 0 ? Math.max(0, Math.min(1, (progress - previousProgress) / span)) : 0;
        return previousTime + (nextTime - previousTime) * amount;
      }
      previousProgress = nextProgress;
      previousTime = nextTime;
    }
  }
  return previousTime;
}
