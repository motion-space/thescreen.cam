import basicsTimeline from "./basics.timeline.json";
import zoomTimeline from "./zoom.timeline.json";
import type { DocsFeatureId } from "../../lib/translations";

export type DocsTimelineChapter = {
  id: string;
  start: number;
  end: number;
};

export type DocsTimeline = {
  chapters: DocsTimelineChapter[];
  duration: number;
  featureId: DocsFeatureId;
  poster: string | null;
  video: string | null;
};

export const basicsDocsTimeline = basicsTimeline as DocsTimeline;

export const docsTimelines = [
  basicsDocsTimeline,
  zoomTimeline,
] as DocsTimeline[];
