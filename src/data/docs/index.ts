import basicsTimeline from "./basics.timeline.json";
import trackManagementTimeline from "./track-management.timeline.json";
import previewControlTimeline from "./preview-control.timeline.json";
import screenSettingsTimeline from "./screen-settings.timeline.json";
import workspaceFileTimeline from "./workspace-file.timeline.json";
import zoomTimeline from "./zoom.timeline.json";
import type { DocsCopy, DocsFeatureId } from "../../lib/translations";

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

export type DocsSidebarSizer = {
  chapterTitle: string;
  featureTitle: string;
};

export const basicsDocsTimeline = basicsTimeline as DocsTimeline;

export const docsTimelines = [
  basicsDocsTimeline,
  previewControlTimeline,
  trackManagementTimeline,
  screenSettingsTimeline,
  workspaceFileTimeline,
  zoomTimeline,
] as DocsTimeline[];

export function getDocsSidebarSizer(
  copy: DocsCopy,
  timelines: DocsTimeline[],
): DocsSidebarSizer {
  let chapterTitle = "";
  let chapterTitleScore = 0;
  let featureTitle = "";
  let featureTitleScore = 0;

  for (const timeline of timelines) {
    const feature = copy.features[timeline.featureId];
    const nextFeatureTitle = feature.title;
    const nextFeatureTitleScore = getTitleScore(nextFeatureTitle);

    if (nextFeatureTitleScore > featureTitleScore) {
      featureTitle = nextFeatureTitle;
      featureTitleScore = nextFeatureTitleScore;
    }

    for (const chapter of timeline.chapters) {
      const nextChapterTitle =
        feature.chapters[chapter.id]?.title ?? chapter.id;
      const nextChapterTitleScore = getTitleScore(nextChapterTitle);

      if (nextChapterTitleScore > chapterTitleScore) {
        chapterTitle = nextChapterTitle;
        chapterTitleScore = nextChapterTitleScore;
      }
    }
  }

  return { chapterTitle, featureTitle };
}

function getTitleScore(value: string) {
  return Array.from(value).reduce((score, character) => {
    if (/\s/.test(character)) return score + 0.5;

    return score + (character.charCodeAt(0) > 0xff ? 2 : 1);
  }, 0);
}
