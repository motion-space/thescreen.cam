import type { Locale } from "./i18n";

export type RichTextSegment = string | { href: string; text: string };

export type HeaderCopy = {
  appStore: string;
  backToMenuAria: string;
  closeMenuAria: string;
  homeAria: string;
  logoAlt: string;
  menuAria: string;
  nav: {
    changelog: string;
    docs: string;
    privacy: string;
    support: string;
    terms: string;
  };
  primaryNavigationAria: string;
};

export type FooterCopy = {
  appStoreButton: string;
  copyright: string;
  ctaText: string;
  ctaTitle: string;
  description: string;
  groups: {
    legal: string;
    product: string;
    resources: string;
  };
  language: string;
  legalLinks: {
    privacy: string;
    terms: string;
  };
  productLinks: {
    controls: string;
    export: string;
    faq: string;
    zoom: string;
  };
  resourceLinks: {
    alternatives?: string;
    bgm: string;
    changelog: string;
    docs: string;
    motionBlurMask: string;
    support: string;
  };
  supportChannelsAria: string;
  systemStatus: string;
};

export type HeroCopy = {
  appStoreButton: string;
  builtWithLabel: string;
  builtWithValue: string;
  systemLabel: string;
  systemValue: string;
  tagline: string;
  titleLines: Array<[string, string]>;
};

export type ZoomFeatureCopy = {
  canvasLabels: {
    autoPlayingDemo: string;
    playMarker: string;
    previewMarker: string;
    recordingClip: string;
    recordingTrack: string;
    timelinePreview: string;
    zoomClip: string;
    zoomTrack: string;
  };
  features: Array<{
    description: string;
    title: string;
  }>;
  subtitle: string;
  timelineAria: string;
  title: string;
};

export type DeviceMockupsCopy = {
  description: string;
  eyebrow: string;
  formats: string[];
  imageAlt: {
    iPhone: string;
    macBook: string;
    studioDisplay: string;
  };
  title: string;
};

export type CustomControlsCopy = {
  body: string;
  centerLabel: string;
  dragCenter: string;
  eyebrow: string;
  features: string[];
  pauseAria: string;
  pauseTitle: string;
  playAria: string;
  playTitle: string;
  scaleAria: string;
  scaleLabel: string;
  titleMuted: string;
  titleStart: string;
};

export type PerformanceCopy = {
  cta: string;
  metrics: {
    appSize: string;
    appSizeNote: string;
    cpuUsage: string;
    exportTime: string;
    exportTimeNote: string;
    memory: string;
    others: string;
    screenCam: string;
  };
  subtitle: string;
  title: string;
};

export type AlternativeLinkCopy = {
  cta: string;
  description: string;
  eyebrow: string;
  title: string;
};

export type FeatureCardsCopy = {
  beautyThumb: {
    afterLabel: string;
    beforeLabel: string;
    disclosure: string;
    enterFloatingAria: string;
    exitFloatingAria: string;
    pauseAria: string;
    playAria: string;
    shapeCycleAria: string;
    shapeLabels: {
      circle: string;
      square: string;
      wide: string;
    };
  };
  dynamicIslandThumb: {
    ariaLabel: string;
    materialLabel: string;
    modeLabels: {
      black: string;
      glass: string;
    };
    tasks: Array<{
      detail: string;
      primaryAction: string;
      secondary: string;
      secondaryAction: string;
      size: string;
      title: string;
    }>;
    wallpaperButtonAria: string;
  };
  effectLayersThumb: {
    ariaLabel: string;
    dragHint: string;
    effects: Array<{
      clipLabel: string;
      description: string;
      id: "mosaic" | "focus" | "text" | "image";
      title: string;
    }>;
  };
  eyebrow: string;
  glassThumb: {
    modeLabels: {
      clear: string;
      regular: string;
    };
    toolbarItems: {
      area: string;
      camera: string;
      close: string;
      display: string;
      iphone: string;
      keyboard: string;
      microphone: string;
      settings: string;
      systemAudio: string;
      window: string;
      workspace: string;
    };
    wallpaperButtonAria: string;
  };
  items: Array<{
    caption: string;
    title: string;
  }>;
  subtitle: string;
  title: string;
};

export type FAQCopy = {
  eyebrow: string;
  items: Array<{
    answer: string;
    question: string;
  }>;
  title: string;
};

export type MotionBlurMaskToolCopy = {
  addMaskAria: string;
  addMaskButton: string;
  angleAria: string;
  angleLabel: string;
  blurSettingsTitle: string;
  chooseImage: string;
  clearImage: string;
  defaultMaskName: string;
  deleteSelectedMaskAria: string;
  description: string;
  emptyMasksWithImage: string;
  emptyMasksWithoutImage: string;
  exportButton: string;
  heightLabel: string;
  linearMode: string;
  maskButton: string;
  masksTitle: string;
  modeLabel: string;
  nameLabel: string;
  previewAria: string;
  replaceImageAria: string;
  selectedMaskEmpty: string;
  sourceTitle: string;
  strengthAria: string;
  strengthLabel: string;
  title: string;
  toolEyebrow: string;
  uniformMode: string;
  uploadDescription: string;
  uploadTitle: string;
  widthLabel: string;
  xLabel: string;
  yLabel: string;
};

export type DocsFeatureId =
  | "basics"
  | "preview-control"
  | "track-management"
  | "screen-settings"
  | "workspace-file"
  | "record"
  | "zoom"
  | "camera"
  | "shortcuts"
  | "export";

type DocsChapterCopy = {
  description: string;
  descriptionHtml: string;
  title: string;
};

type RawDocsChapterCopy = Omit<DocsChapterCopy, "descriptionHtml"> &
  Partial<Pick<DocsChapterCopy, "descriptionHtml">>;

type DocsFeatureCopy<TChapterCopy extends RawDocsChapterCopy = DocsChapterCopy> = {
  chapters: Record<string, TChapterCopy>;
  summary: string;
  title: string;
};

export type DocsCopy = {
  chaptersTitle: string;
  description: string;
  emptyVideoDescription: string;
  emptyVideoTitle: string;
  eyebrow: string;
  featureListAria: string;
  playback: {
    next: string;
    pause: string;
    play: string;
    previous: string;
    restart: string;
  };
  progressLabel: string;
  title: string;
  videoAriaLabel: string;
  features: Record<
    DocsFeatureId,
    DocsFeatureCopy
  >;
};

export type LegalPageCopy = {
  eyebrow: string;
  supportChannelsAria?: string;
  title: string;
  updated: string;
  sections: Array<{
    paragraphs: RichTextSegment[][];
    showSupportChannels?: boolean;
    title: string;
  }>;
};

type PageMeta = {
  description: string;
  title: string;
};

type LocaleTranslation = {
  changelog: {
    description: string;
    eyebrow: string;
    intro: string;
    linkVersionLabel: string;
    title: string;
  };
  common: {
    skipToContent: string;
  };
  footer: FooterCopy;
  header: HeaderCopy;
  docs: DocsCopy;
  home: {
    controls: CustomControlsCopy;
    deviceMockups: DeviceMockupsCopy;
    featureCards: FeatureCardsCopy;
    faq: FAQCopy;
    hero: HeroCopy;
    performance: PerformanceCopy;
    screenStudioAlternative: AlternativeLinkCopy;
    structuredDataFeatureList: string[];
    zoom: ZoomFeatureCopy;
  };
  legal: {
    privacy: LegalPageCopy;
    support: LegalPageCopy;
    terms: LegalPageCopy;
  };
  meta: {
    changelog: PageMeta;
    docs: PageMeta;
    home: PageMeta;
    motionBlurMask: PageMeta;
    privacy: PageMeta;
    support: PageMeta;
    terms: PageMeta;
  };
  motionBlurTool: MotionBlurMaskToolCopy;
};

type RawDocsCopy = Omit<DocsCopy, "features"> & {
  features: Record<DocsFeatureId, DocsFeatureCopy<RawDocsChapterCopy>>;
};

type RawLocaleTranslation = Omit<LocaleTranslation, "docs"> & {
  docs: RawDocsCopy;
};

const emailLink = { href: "mailto:cats_juice@outlook.com", text: "cats_juice@outlook.com" };
const appleEulaLink = {
  href: "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/",
  text: "apple.com/legal/internet-services/itunes/dev/stdeula",
};

const docsMarkdownIcons = {
  eye: [
    '<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/>',
    '<circle cx="12" cy="12" r="3"/>',
  ],
  grip: [
    '<circle cx="9" cy="5" r="1"/>',
    '<circle cx="9" cy="12" r="1"/>',
    '<circle cx="9" cy="19" r="1"/>',
    '<circle cx="15" cy="5" r="1"/>',
    '<circle cx="15" cy="12" r="1"/>',
    '<circle cx="15" cy="19" r="1"/>',
  ],
  trash: [
    '<path d="M10 11v6"/>',
    '<path d="M14 11v6"/>',
    '<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>',
    '<path d="M3 6h18"/>',
    '<path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  ],
} as const;

type DocsMarkdownIconId = keyof typeof docsMarkdownIcons;

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function isSafeMarkdownUrl(value: string) {
  const url = value.trim();

  if (
    url.startsWith("/") ||
    url.startsWith("#") ||
    url.startsWith("./") ||
    url.startsWith("../")
  ) {
    return true;
  }

  try {
    const parsedUrl = new URL(url);
    return ["http:", "https:", "mailto:"].includes(parsedUrl.protocol);
  } catch {
    return false;
  }
}

function renderDocsMarkdownIcon(iconId: DocsMarkdownIconId) {
  return `<svg class="docs-inline-icon docs-inline-icon-${iconId}" aria-hidden="true" focusable="false" viewBox="0 0 24 24">${docsMarkdownIcons[iconId].join("")}</svg>`;
}

function renderDocsKey(value: string) {
  return `<kbd class="docs-key">${renderBasicMarkdownInline(value)}</kbd>`;
}

function renderBasicMarkdownInline(markdown: string): string {
  let html = "";
  let index = 0;

  while (index < markdown.length) {
    if (markdown.startsWith("{{icon:", index)) {
      const end = markdown.indexOf("}}", index + 7);

      if (end !== -1) {
        const iconId = markdown.slice(index + 7, end).trim();

        if (iconId in docsMarkdownIcons) {
          html += renderDocsMarkdownIcon(iconId as DocsMarkdownIconId);
          index = end + 2;
          continue;
        }
      }
    }

    if (markdown.startsWith("<kbd>", index)) {
      const end = markdown.indexOf("</kbd>", index + 5);

      if (end !== -1) {
        html += renderDocsKey(markdown.slice(index + 5, end));
        index = end + 6;
        continue;
      }
    }

    if (markdown.startsWith("**", index)) {
      const end = markdown.indexOf("**", index + 2);

      if (end !== -1) {
        html += `<strong>${renderBasicMarkdownInline(markdown.slice(index + 2, end))}</strong>`;
        index = end + 2;
        continue;
      }
    }

    if (markdown[index] === "`") {
      const end = markdown.indexOf("`", index + 1);

      if (end !== -1) {
        html += `<code>${escapeHtml(markdown.slice(index + 1, end))}</code>`;
        index = end + 1;
        continue;
      }
    }

    if (markdown[index] === "[") {
      const labelEnd = markdown.indexOf("](", index + 1);
      const urlEnd = labelEnd === -1 ? -1 : markdown.indexOf(")", labelEnd + 2);

      if (labelEnd !== -1 && urlEnd !== -1) {
        const label = markdown.slice(index + 1, labelEnd);
        const url = markdown.slice(labelEnd + 2, urlEnd).trim();

        if (isSafeMarkdownUrl(url)) {
          html += `<a href="${escapeHtml(url)}">${renderBasicMarkdownInline(label)}</a>`;
          index = urlEnd + 1;
          continue;
        }
      }
    }

    if (markdown[index] === "*") {
      const end = markdown.indexOf("*", index + 1);

      if (end !== -1) {
        html += `<em>${renderBasicMarkdownInline(markdown.slice(index + 1, end))}</em>`;
        index = end + 1;
        continue;
      }
    }

    html += escapeHtml(markdown[index] ?? "");
    index += 1;
  }

  return html.replace(/\r?\n/g, "<br>");
}

function compileDocsCopy(docs: RawDocsCopy): DocsCopy {
  const features = Object.fromEntries(
    Object.entries(docs.features).map(([featureId, feature]) => [
      featureId,
      {
        ...feature,
        chapters: Object.fromEntries(
          Object.entries(feature.chapters).map(([chapterId, chapter]) => [
            chapterId,
            {
              ...chapter,
              descriptionHtml:
                chapter.descriptionHtml ??
                renderBasicMarkdownInline(chapter.description),
            },
          ]),
        ),
      },
    ]),
  ) as DocsCopy["features"];

  return {
    ...docs,
    features,
  };
}

function compileTranslations(
  rawTranslations: Record<Locale, RawLocaleTranslation>,
): Record<Locale, LocaleTranslation> {
  return Object.fromEntries(
    Object.entries(rawTranslations).map(([locale, translation]) => [
      locale,
      {
        ...translation,
        docs: compileDocsCopy(translation.docs),
      },
    ]),
  ) as Record<Locale, LocaleTranslation>;
}

const rawTranslations: Record<Locale, RawLocaleTranslation> = {
  en: {
    common: {
      skipToContent: "Skip to content",
    },
    header: {
      appStore: "App Store",
      backToMenuAria: "Back to menu",
      closeMenuAria: "Close menu",
      homeAria: "ScreenCam home",
      logoAlt: "ScreenCam Logo",
      menuAria: "Open menu",
      nav: {
        changelog: "Changelog",
        docs: "Docs",
        privacy: "Privacy",
        support: "Support",
        terms: "Terms",
      },
      primaryNavigationAria: "Primary navigation",
    },
    footer: {
      appStoreButton: "View on App Store",
      copyright: "All rights reserved.",
      ctaText: "Get ScreenCam from the Mac App Store.",
      ctaTitle: "Ready to capture better?",
      description: "Native screen recording for Mac. Fast, lightweight, powerful.",
      groups: {
        legal: "Legal",
        product: "Product",
        resources: "Resources",
      },
      language: "Language",
      legalLinks: {
        privacy: "Privacy",
        terms: "Terms",
      },
      productLinks: {
        controls: "Controls",
        export: "Export",
        faq: "FAQ",
        zoom: "Zoom",
      },
      resourceLinks: {
        alternatives: "Alternatives",
        bgm: "BGM",
        changelog: "Changelog",
        docs: "Docs",
        motionBlurMask: "Motion Blur Mask",
        support: "Support",
      },
      supportChannelsAria: "Support channels",
      systemStatus: "All systems operational",
    },
    meta: {
      changelog: {
        title: "Changelog - ScreenCam",
        description: "Follow ScreenCam release notes, product improvements, bug fixes, and update history.",
      },
      docs: {
        title: "Docs - ScreenCam",
        description:
          "Learn ScreenCam with guided video walkthroughs, chaptered steps, and interactive playback.",
      },
      home: {
        title: "ScreenCam - Native macOS screen recording with directed zoom",
        description:
          "ScreenCam is a native macOS screen recorder for sharp capture, manual zoom control, timeline anchors, curve tuning, and preview-accurate export.",
      },
      motionBlurMask: {
        title: "Motion Blur Mask Tool - ScreenCam",
        description:
          "Upload an image, draw rectangular motion blur masks, tune blur strength and direction, then export the composited result.",
      },
      privacy: {
        title: "Privacy Policy - ScreenCam",
        description:
          "ScreenCam's privacy policy explains how the macOS app handles recordings, permissions, optional analytics, purchases, and website data.",
      },
      support: {
        title: "Support - ScreenCam",
        description:
          "Get help with ScreenCam for macOS, including support contact, App Store purchases, requirements, and troubleshooting.",
      },
      terms: {
        title: "Terms of Use - ScreenCam",
        description:
          "ScreenCam's terms of use explain the app license, subscriptions, purchases, and support contact information.",
      },
    },
    docs: {
      chaptersTitle: "Steps",
      description:
        "Watch the workflow, then jump straight to the step you need.",
      emptyVideoDescription:
        "Drop the demo file into public/docs for this feature, then add the video path and calibrated timestamps to the timeline JSON.",
      emptyVideoTitle: "Video coming soon",
      eyebrow: "Docs",
      featureListAria: "Documentation topics",
      playback: {
        next: "Next step",
        pause: "Pause",
        play: "Play",
        previous: "Previous step",
        restart: "Restart",
      },
      progressLabel: "Progress",
      title: "ScreenCam Guides.",
      videoAriaLabel: "Documentation demo video",
      features: {
        basics: {
          title: "Basics",
          summary: "Get familiar with the preview, sidebar, settings panels, and timeline tracks.",
          chapters: {
            preview: {
              title: "Preview",
              description: "Use the preview area to watch the current final export result in real time.",
            },
            sidebar: {
              title: "Sidebar",
              description: "The main configuration panels live in the sidebar.",
            },
            "screen-settings": {
              title: "Screen settings",
              description: "Configure the screen content, including wallpaper, margins, size, and related layout options.",
            },
            "device-settings": {
              title: "Device settings",
              description: "Wrap the screen in a device frame, choose the device, and tune frame styling such as the background.",
            },
            "keyboard-settings": {
              title: "Keyboard settings",
              description: "Set how recorded shortcuts appear, including their default size and position.",
            },
            "beauty-settings": {
              title: "Beauty settings",
              description: "After camera recording is enabled, apply subtle portrait enhancements to the camera image.",
            },
            "mouse-settings": {
              title: "Mouse settings",
              description: "Adjust the basic visual style for the mouse pointer.",
            },
            "animation-settings": {
              title: "Animation settings",
              description: "Customize camera motion, including motion blur strength and custom curves.",
            },
            tracks: {
              title: "Tracks",
              description: "Recording, camera, system audio, microphone, zoom, and keyboard events appear here as timeline clips.",
            },
          },
        },
        "preview-control": {
          title: "Preview Controls",
          summary: "Adjust preview playback speed, preview volume, and timeline track zoom while editing.",
          chapters: {
            "playback-rate": {
              title: "Playback speed",
              description:
                "Adjust the preview playback speed here. **This only affects the preview stage and does not affect export.**",
            },
            volume: {
              title: "Volume",
              description:
                "Adjust the sound you hear during preview. **This only affects the preview stage and does not affect export.**",
            },
            "track-zoom": {
              title: "Track zoom",
              description: "Change the zoom level of the timeline tracks.",
            },
          },
        },
        "track-management": {
          title: "Track Management",
          summary: "Open track settings, reorder tracks, hide them, delete them, and restore deleted tracks.",
          chapters: {
            entry: {
              title: "Entry",
              description: "Open the track settings panel from the left side of the tracks.",
            },
            sort: {
              title: "Sort",
              description:
                "Drag the leading {{icon:grip}} sort handle to reorder tracks. This order is saved as a preference and reused next time.",
            },
            hide: {
              title: "Hide",
              description:
                "Click {{icon:eye}} to hide tracks you do not need. **This does not affect export.**",
            },
            delete: {
              title: "Delete",
              description:
                "Click {{icon:trash}} to delete tracks you do not need. **This affects the final export.**",
            },
            restore: {
              title: "Restore",
              description:
                "Deleted tracks appear separately below, where you can restore them at any time.",
            },
          },
        },
        "screen-settings": {
          title: "Screen Settings",
          summary: "Tune the recorded screen, its background, margins, and output size behavior.",
          chapters: {
            wallpaper: {
              title: "Wallpaper",
              description:
                "Choose wallpapers read from the system, including dynamic wallpapers. They are not bundled with the app, do not take app space, and keep the highest wallpaper quality. Click Custom to configure more wallpaper folders in Settings.",
            },
            "no-background": {
              title: "No background",
              description:
                "Choose no background, which is especially important for full-screen recording or custom area recording. **Currently, switching to no wallpaper keeps the previous margin or size settings by default, so set them to 0 manually to remove black borders.**",
            },
            gradient: {
              title: "Gradient",
              description:
                "Choose a preset linear gradient, or freely edit gradient anchors and colors, adding or removing anchors as needed.",
            },
            "solid-color": {
              title: "Solid color",
              description: "Choose a single color as the background.",
            },
            "custom-background": {
              title: "Custom",
              description: "Upload your own photo or video as the background.",
            },
            "adaptive-size": {
              title: "Adaptive screen size",
              description:
                "In this mode, the screen size is controlled by adjusting vertical and horizontal margins.",
            },
            "sync-margins": {
              title: "Sync margins",
              description:
                "Enable sync margins to keep all four sides consistent. Disable it to control vertical and horizontal margins separately. **If aspect ratio is enabled, the final image visually conforms to that ratio, so margins may look different from the entered values.**",
            },
            "fixed-size": {
              title: "Fixed screen size",
              description:
                "In this mode, manually enter the screen size. **If aspect ratio is enabled, the canvas expands outward to the target ratio.**",
            },
          },
        },
        "workspace-file": {
          title: "Project File",
          summary:
            "A project file contains all raw files generated for a completed recording, including every asset and configuration. You can share it, and **it is automatically created and saved to a default location when recording finishes.**",
          chapters: {
            "default-directory": {
              title: "Change the default directory",
              description:
                "Open <kbd>ScreenCam</kbd> > <kbd>Settings</kbd> > <kbd>Recording</kbd> > <kbd>Default workspace directory</kbd>, then choose the default folder.",
            },
            "recent-projects": {
              title: "Open recent projects",
              description: "Use <kbd>File</kbd> > <kbd>Recent</kbd>.",
            },
            "default-directory-projects": {
              title: "Open projects in the default location",
              description:
                "Use <kbd>File</kbd> > <kbd>Default Directory</kbd>.",
            },
            "show-in-finder": {
              title: "Show the current file in Finder",
              description:
                "Click the project file name at the top of the editor, or use <kbd>File</kbd> > <kbd>Show in Finder</kbd>.",
            },
            "manual-save": {
              title: "Save manually",
              description:
                "Use <kbd>File</kbd> > <kbd>Save</kbd>, or press <kbd>⌘</kbd><kbd>S</kbd> to save manually. In most cases, the project is saved automatically.",
            },
            "save-as": {
              title: "Save As",
              description:
                "Use <kbd>File</kbd> > <kbd>Save As</kbd>, or press <kbd>⌘</kbd><kbd>⇧</kbd><kbd>S</kbd> to save a copy to a custom folder.",
            },
          },
        },
        record: {
          title: "Record",
          summary: "Set up a capture, choose the source, and start recording.",
          chapters: {
            "prepare-capture": {
              title: "Prepare the capture",
              description: "Open ScreenCam and confirm the recording controls are ready before selecting a source.",
            },
            "choose-source": {
              title: "Choose a source",
              description: "Pick the display, window, area, camera, microphone, and system audio options for the recording.",
            },
            "start-recording": {
              title: "Start recording",
              description: "Start the capture and verify the recording state before moving into the workflow.",
            },
          },
        },
        zoom: {
          title: "Zoom",
          summary: "Add timeline anchors and tune how the camera moves through the recording.",
          chapters: {
            "zoom-track": {
              title: "Zoom track",
              description: "Create and delete zoom clips freely on the zoom track.",
            },
            "delete-clip": {
              title: "Delete",
              description: "Select a clip, then press Backspace or Delete to remove it.",
              descriptionHtml:
                'Select a clip, then press <kbd class="docs-key">Backspace</kbd> or <kbd class="docs-key">Delete</kbd> to remove it.',
            },
            "create-clip": {
              title: "Create",
              description: "Click or drag on an empty area to create a new zoom clip.",
            },
            "merge-clips": {
              title: "Merge",
              description: "Resize or drag a clip until it intersects another clip, then release to confirm the merge.",
            },
            "manual-mode": {
              title: "Manual mode",
              description: "Switch from automatic motion to manual mode and customize each anchor's count, center, and scale.",
            },
            "select-anchor": {
              title: "Select an anchor",
              description: "Select an anchor to edit its individual zoom settings.",
            },
            "adjust-center": {
              title: "Adjust center",
              description: "Drag directly in the preview to set the visual center of the zoom.",
            },
            "adjust-scale-wheel": {
              title: "Adjust scale",
              description: "Use the mouse wheel in the preview to control the zoom scale.",
            },
            "adjust-scale-panel": {
              title: "Adjust scale in settings",
              description: "Select an anchor, then tune the scale slider in the right settings panel.",
            },
          },
        },
        camera: {
          title: "Camera",
          summary: "Shape the camera overlay and apply lightweight appearance adjustments.",
          chapters: {
            "enable-camera": {
              title: "Enable the camera",
              description: "Turn on the camera layer and position it where it supports the recording.",
            },
            "shape-frame": {
              title: "Shape the frame",
              description: "Switch between frame shapes and size the camera overlay for the scene.",
            },
            "apply-beauty": {
              title: "Apply beauty effects",
              description: "Tune subtle appearance settings while keeping the preview aligned with the final export.",
            },
          },
        },
        shortcuts: {
          title: "Shortcuts",
          summary: "Use keyboard actions to control capture without breaking flow.",
          chapters: {
            "capture-shortcut": {
              title: "Start with a shortcut",
              description: "Trigger recording controls from the keyboard instead of reaching for the toolbar.",
            },
            "pause-resume": {
              title: "Pause or resume",
              description: "Use shortcut actions to pause and continue capture during longer recordings.",
            },
            "finish-recording": {
              title: "Finish the take",
              description: "Stop the recording and move to the editor without losing context.",
            },
          },
        },
        export: {
          title: "Export",
          summary: "Review the result, choose output settings, and export the recording.",
          chapters: {
            "choose-format": {
              title: "Choose the format",
              description: "Select the export format and output settings for the destination.",
            },
            "review-preview": {
              title: "Review the preview",
              description: "Check the final preview before rendering the file.",
            },
            "export-file": {
              title: "Export the file",
              description: "Render the recording and save the exported result.",
            },
          },
        },
      },
    },
    home: {
      screenStudioAlternative: {
        eyebrow: "Screen Studio Alternative",
        title: "Need a lighter Mac screen recorder with deeper manual control?",
        description:
          "Compare ScreenCam with Screen Studio across app size, CPU and memory use, export speed, manual zoom anchors, layers, device mockups, and export formats.",
        cta: "Screen Studio alternative for Mac",
      },
      structuredDataFeatureList: [
        "Native macOS screen recording",
        "Manual zoom anchors",
        "Custom animation curves",
        "Device mockups",
        "Mosaic, text, focus, and custom image layers",
        "Motion blur transitions",
        "GIF export",
        "Live Photo export",
        "Camera beauty effects",
        "Preview-accurate export",
      ],
      hero: {
        appStoreButton: "View on App Store",
        builtWithLabel: "Built with",
        builtWithValue: "100% Native",
        systemLabel: "System",
        systemValue: "macOS 15+",
        tagline: "High-resolution recording with a camera you can shape after the take.",
        titleLines: [
          ["Capture", "Sharp."],
          ["Direct", "The Frame."],
        ],
      },
      zoom: {
        canvasLabels: {
          autoPlayingDemo: "Auto-playing demo",
          playMarker: "Play",
          previewMarker: "Preview",
          recordingClip: "Recording",
          recordingTrack: "Recording",
          timelinePreview: "Timeline preview",
          zoomClip: "Auto Zoom",
          zoomTrack: "Zoom",
        },
        features: [
          {
            title: "Dynamic Zoom",
            description: "Camera movement follows the same spring timing used by ScreenCam exports.",
          },
          {
            title: "Timeline Preview",
            description: "Hover the Recording or Zoom track to scrub the exact preview frame.",
          },
          {
            title: "Motion Blur",
            description: "Zoom, pan, and click states are sampled with shutter-style blur.",
          },
        ],
        subtitle: "Zoom with motion blur.",
        timelineAria: "Timeline preview tracks",
        title: "Focus on what matters.",
      },
      deviceMockups: {
        description:
          "Export with stunning device frames. iPhone, Mac, Studio Display - your content, perfectly presented.",
        eyebrow: "Export Options",
        formats: ["Original Resolution", "Live Photo", "MP4 / MOV"],
        imageAlt: {
          iPhone: "iPhone 17 Pro Max",
          macBook: "ScreenCam app running on MacBook Pro",
          studioDisplay: "ScreenCam running on Studio Display with MacBook",
        },
        title: "Beautiful on every screen.",
      },
      controls: {
        body:
          "Manual mode gives you complete creative freedom. Add multiple anchors to a single zoom clip, each with its own scale and center point.",
        centerLabel: "Center",
        dragCenter: "Drag to adjust center",
        eyebrow: "Advanced Controls",
        features: [
          "Drag anchors to reposition on timeline",
          "Adjust scale from 1x to 5x per anchor",
          "Set custom focus center for each zoom",
          "Smooth transitions between anchors",
        ],
        pauseAria: "Pause mock timeline playback",
        pauseTitle: "Pause",
        playAria: "Play mock timeline playback",
        playTitle: "Play",
        scaleAria: "Scale",
        scaleLabel: "Scale",
        titleMuted: "every zoom point.",
        titleStart: "Total control over",
      },
      performance: {
        cta: "View full benchmark data",
        metrics: {
          appSize: "App Size",
          appSizeNote: "about 20MB vs 600MB",
          cpuUsage: "CPU Usage",
          exportTime: "Export Time",
          exportTimeNote: "shorter is faster",
          memory: "Memory",
          others: "Others",
          screenCam: "ScreenCam",
        },
        subtitle: "No Electron. No web views. Pure native performance.",
        title: "Native means fast.",
      },
      featureCards: {
        eyebrow: "More Features",
        title: "Small details, ready for real workflows.",
        subtitle: "Native touches that make recording feel fast, polished, and Mac-first.",
        beautyThumb: {
          beforeLabel: "Beauty Off",
          afterLabel: "Beauty On",
          disclosure:
            "AI-generated portrait, used only to demonstrate the real beauty effect.",
          enterFloatingAria: "Show as floating camera window",
          exitFloatingAria: "Return camera window to full preview",
          pauseAria: "Pause beauty comparison demo",
          playAria: "Play beauty comparison demo",
          shapeCycleAria: "Switch floating window shape",
          shapeLabels: {
            circle: "Circle",
            square: "Rounded square",
            wide: "16:9",
          },
        },
        dynamicIslandThumb: {
          ariaLabel: "Dynamic Island background task preview",
          materialLabel: "Notch material",
          modeLabels: {
            black: "Black",
            glass: "Glass",
          },
          tasks: [
            {
              title: "ScreenCam launch film",
              detail: "Ready to reveal in Finder.",
              primaryAction: "Open Finder",
              secondary: "Complete",
              secondaryAction: "Done",
              size: "384 MB",
            },
            {
              title: "4K tutorial export",
              detail: "Encoding H.265 with camera and cursor layers.",
              primaryAction: "Open Finder",
              secondary: "2m left",
              secondaryAction: "Done",
              size: "1.2 GB",
            },
            {
              title: "GIF preview compression",
              detail: "Optimizing frames for a smaller shareable clip.",
              primaryAction: "Open Finder",
              secondary: "42s left",
              secondaryAction: "Done",
              size: "18 MB",
            },
          ],
          wallpaperButtonAria: "Change wallpaper",
        },
        effectLayersThumb: {
          ariaLabel: "Effect layers timeline preview",
          dragHint: "Drag to the track to add",
          effects: [
            {
              id: "mosaic",
              title: "Mosaic",
              description: "Pixelate sensitive areas on top of the recording.",
              clipLabel: "Mosaic",
            },
            {
              id: "focus",
              title: "Focus",
              description: "Highlight one region while keeping context visible.",
              clipLabel: "Focus",
            },
            {
              id: "text",
              title: "Text",
              description: "Add a text layer anywhere in the edit.",
              clipLabel: "Text",
            },
            {
              id: "image",
              title: "Image",
              description: "Place an image overlay as a timed layer.",
              clipLabel: "Image",
            },
          ],
        },
        glassThumb: {
          modeLabels: {
            clear: "Clear",
            regular: "regular",
          },
          toolbarItems: {
            area: "Area",
            camera: "Camera",
            close: "Hide ScreenCam",
            display: "Display",
            iphone: "iPhone",
            keyboard: "Keyboard event recording",
            microphone: "Microphone",
            settings: "Settings",
            systemAudio: "System sound recording",
            window: "Window",
            workspace: "Open Workspace",
          },
          wallpaperButtonAria: "Change wallpaper",
        },
        items: [
          {
            title: "Liquid Glass",
            caption: "Native glass materials keep controls crisp while matching modern macOS surfaces.",
          },
          {
            title: "Shortcut Capture",
            caption: "Record keyboard shortcuts during capture and display them clearly in the final video.",
          },
          {
            title: "Light Beauty",
            caption: "Apply subtle beauty effects for a cleaner camera look.",
          },
          {
            title: "Dynamic Island",
            caption: "Put long exports in the background and keep progress visible from the notch.",
          },
          {
            title: "Effect Layers",
            caption: "Add as many effect layers as you need, then move, resize, and stack every clip on the timeline.",
          },
        ],
      },
      faq: {
        eyebrow: "FAQ",
        title: "Questions & Answers",
        items: [
          {
            question: "Is ScreenCam a Screen Studio alternative?",
            answer:
              "Yes. ScreenCam is a native macOS Screen Studio alternative for creators who want a smaller app footprint, lower resource use, faster exports, manual zoom anchors, device mockups, richer layers, GIF export, Live Photo export, and a Mac-first editing experience.",
          },
          {
            question: "How is ScreenCam different from browser-based recorders?",
            answer:
              "ScreenCam is built for macOS as a native recording and editing app. The goal is a compact Mac-first workflow with local capture, smooth editing controls, and preview-accurate export.",
          },
          {
            question: "What's the minimum macOS version required?",
            answer: "ScreenCam requires macOS 15 or later.",
          },
          {
            question: "Is there a Windows version?",
            answer:
              "Not right now. ScreenCam is focused on macOS, and we do not plan to develop a Windows version in the short term.",
          },
          {
            question: "Can I export to different formats?",
            answer:
              "ScreenCam is designed for high-quality video export from the editor, with framing and motion controls reflected in the final output.",
          },
          {
            question: "How does the zoom feature work?",
            answer:
              "You can add zoom points anywhere on your timeline. In manual mode, you have complete control: set multiple anchors with different zoom levels and focus centers. Transitions include smooth motion blur effects.",
          },
          {
            question: "Does it support multiple monitors?",
            answer:
              "ScreenCam is built for Mac screen recording workflows, including connected displays, windows, and capture regions.",
          },
        ],
      },
    },
    legal: {
      privacy: {
        eyebrow: "Privacy",
        title: "Privacy Policy",
        updated: "Last updated: June 3, 2026",
        sections: [
          {
            title: "Overview",
            paragraphs: [
              [
                "ScreenCam is a native macOS screen recording and editing app. The app is designed to process recordings locally on your Mac. ScreenCam may make network requests for app functionality such as App Store purchase status and, when you choose to enable it, optional anonymous usage analytics. We do not use advertising trackers in the app.",
              ],
            ],
          },
          {
            title: "Recordings and local files",
            paragraphs: [
              [
                "Screen recordings, camera video, microphone audio, system audio, cursor data, exported videos, workspace files, and custom wallpaper files stay on your device or in locations you choose. ScreenCam does not upload this content to ScreenCam servers.",
              ],
            ],
          },
          {
            title: "Anonymous usage analytics",
            paragraphs: [
              [
                "ScreenCam may ask whether you want to share anonymous usage analytics to help us understand which recording and editing features work well. You can turn analytics sharing on or off at any time in the app. If analytics sharing is disabled, ScreenCam does not send usage analytics.",
              ],
              [
                "Analytics are limited to product usage, diagnostics, and performance information, such as feature interactions, app version, macOS version, and general device information. We never collect screen content, audio, camera video, project files, file names, or typed text through analytics.",
              ],
            ],
          },
          {
            title: "Permissions",
            paragraphs: [
              [
                "ScreenCam may ask macOS for screen recording, microphone, camera, and file access permissions. These permissions are used only to provide recording, editing, exporting, and user-selected file features. You can manage these permissions in System Settings.",
              ],
            ],
          },
          {
            title: "Purchases",
            paragraphs: [
              [
                "ScreenCam Pro subscriptions and purchases are processed by Apple through the Mac App Store. ScreenCam reads purchase and subscription status from StoreKit so the app can unlock Pro features. ScreenCam does not receive or store your payment card details.",
              ],
            ],
          },
          {
            title: "Website",
            paragraphs: [
              [
                "When you visit thescreen.cam, our hosting and infrastructure providers may process standard server log data such as IP address, browser user agent, request URL, and request time for security, diagnostics, and delivery of the website. The website does not use advertising trackers.",
              ],
            ],
          },
          {
            title: "Changes and contact",
            paragraphs: [
              ["We may update this policy as ScreenCam changes. If you have privacy questions, contact us at ", emailLink, "."],
            ],
          },
        ],
      },
      support: {
        eyebrow: "Support",
        title: "ScreenCam Support",
        updated: "For help with ScreenCam for macOS.",
        supportChannelsAria: "Support channels",
        sections: [
          {
            title: "Contact",
            showSupportChannels: true,
            paragraphs: [
              [
                "Email ",
                emailLink,
                " for product support, bug reports, purchase questions, and feedback.",
              ],
            ],
          },
          {
            title: "Include these details",
            paragraphs: [
              [
                "When reporting an issue, include your macOS version, ScreenCam version, Mac model, recording settings, export format, and a short description of what happened. Screenshots or short recordings are useful when the issue is visual.",
              ],
            ],
          },
          {
            title: "App Store purchases",
            paragraphs: [
              [
                "ScreenCam is distributed through the Mac App Store. Billing, subscriptions, renewals, cancellations, and refunds are handled by Apple through your Apple ID and App Store account settings.",
              ],
            ],
          },
          {
            title: "Requirements",
            paragraphs: [
              [
                "ScreenCam is currently built for macOS. There is no Windows version, and Windows development is not planned in the short term.",
              ],
            ],
          },
          {
            title: "Privacy",
            paragraphs: [
              [
                "Recordings and workspace files are processed locally on your Mac. Read the ",
                { href: "/privacy", text: "Privacy Policy" },
                " for more detail.",
              ],
            ],
          },
        ],
      },
      terms: {
        eyebrow: "Terms",
        title: "Terms of Use",
        updated: "Last updated: May 20, 2026",
        sections: [
          {
            title: "App license",
            paragraphs: [
              [
                "ScreenCam is licensed to you under Apple's Standard End User License Agreement (EULA), unless otherwise required by applicable law. You can review Apple's Standard EULA at ",
                appleEulaLink,
                ".",
              ],
            ],
          },
          {
            title: "Subscriptions and purchases",
            paragraphs: [
              [
                "ScreenCam Pro subscriptions and purchases are processed by Apple through the Mac App Store. Subscription billing, renewal, cancellation, refunds, and account management are handled through your Apple ID and App Store account settings.",
              ],
            ],
          },
          {
            title: "Use of ScreenCam",
            paragraphs: [
              [
                "You are responsible for the recordings, files, and exports you create with ScreenCam. Only record, edit, and share content when you have the rights and permissions required to do so.",
              ],
            ],
          },
          {
            title: "Privacy",
            paragraphs: [
              ["ScreenCam's privacy practices are described in the ", { href: "/privacy", text: "Privacy Policy" }, "."],
            ],
          },
          {
            title: "Contact",
            paragraphs: [
              ["If you have questions about these terms, contact us at ", emailLink, "."],
            ],
          },
        ],
      },
    },
    changelog: {
      description: "Product updates, fixes, and release notes.",
      eyebrow: "Changelog",
      intro: "Product updates, fixes, and release notes.",
      linkVersionLabel: "Link to version",
      title: "ScreenCam Changelog",
    },
    motionBlurTool: {
      addMaskAria: "Add mask",
      addMaskButton: "Mask",
      angleAria: "Blur angle",
      angleLabel: "Angle",
      blurSettingsTitle: "Blur Settings",
      chooseImage: "Choose Image",
      clearImage: "Clear Image",
      defaultMaskName: "Mask",
      deleteSelectedMaskAria: "Delete selected mask",
      description:
        "Build rectangular blur regions, tune direction and intensity, then export the composited image.",
      emptyMasksWithImage: "Add a mask to blur part of the image.",
      emptyMasksWithoutImage: "Upload an image first.",
      exportButton: "Export",
      heightLabel: "Height",
      linearMode: "Linear",
      maskButton: "Mask",
      masksTitle: "Masks",
      modeLabel: "Mode",
      nameLabel: "Name",
      previewAria: "Motion blur preview",
      replaceImageAria: "Replace image",
      selectedMaskEmpty: "Select a mask to edit its blur direction, intensity, position, and size.",
      sourceTitle: "Source",
      strengthAria: "Blur strength",
      strengthLabel: "Strength",
      title: "Motion Blur Mask",
      toolEyebrow: "Tool",
      uniformMode: "Uniform",
      uploadDescription: "Drop a local image here or choose a file to start editing.",
      uploadTitle: "Upload an image",
      widthLabel: "Width",
      xLabel: "X",
      yLabel: "Y",
    },
  },
  "zh-Hans": {
    common: {
      skipToContent: "跳到正文",
    },
    header: {
      appStore: "App Store",
      backToMenuAria: "返回菜单",
      closeMenuAria: "关闭菜单",
      homeAria: "ScreenCam 首页",
      logoAlt: "ScreenCam 标志",
      menuAria: "打开菜单",
      nav: {
        changelog: "更新日志",
        docs: "文档",
        privacy: "隐私",
        support: "支持",
        terms: "条款",
      },
      primaryNavigationAria: "主导航",
    },
    footer: {
      appStoreButton: "在 App Store 查看",
      copyright: "保留所有权利。",
      ctaText: "从 Mac App Store 获取 ScreenCam。",
      ctaTitle: "准备录得更好吗？",
      description: "Mac 原生屏幕录制。快速、轻量、强大。",
      groups: {
        legal: "法律",
        product: "产品",
        resources: "资源",
      },
      language: "语言",
      legalLinks: {
        privacy: "隐私",
        terms: "条款",
      },
      productLinks: {
        controls: "控制",
        export: "导出",
        faq: "FAQ",
        zoom: "变焦",
      },
      resourceLinks: {
        alternatives: "替代方案",
        bgm: "BGM",
        changelog: "更新日志",
        docs: "文档",
        motionBlurMask: "运动模糊遮罩",
        support: "支持",
      },
      supportChannelsAria: "支持渠道",
      systemStatus: "所有系统运行正常",
    },
    meta: {
      changelog: {
        title: "更新日志 - ScreenCam",
        description: "查看 ScreenCam 的版本说明、产品改进、问题修复和更新历史。",
      },
      docs: {
        title: "文档 - ScreenCam",
        description: "通过带章节的视频演示和互动播放，快速上手 ScreenCam 的核心功能。",
      },
      home: {
        title: "ScreenCam - 带定向变焦的原生 macOS 屏幕录制",
        description:
          "ScreenCam 是一款原生 macOS 屏幕录制工具，支持高清录制、手动变焦控制、时间线锚点、曲线调节和所见即所得导出。",
      },
      motionBlurMask: {
        title: "运动模糊遮罩工具 - ScreenCam",
        description: "上传图片，绘制矩形运动模糊遮罩，调整模糊强度和方向，然后导出合成结果。",
      },
      privacy: {
        title: "隐私政策 - ScreenCam",
        description:
          "ScreenCam 的隐私政策说明 macOS app 如何处理录制内容、权限、可选分析、购买和网站数据。",
      },
      support: {
        title: "支持 - ScreenCam",
        description: "获取 ScreenCam macOS 版帮助，包括支持联系方式、App Store 购买、系统要求和故障排查。",
      },
      terms: {
        title: "使用条款 - ScreenCam",
        description: "ScreenCam 使用条款说明 app 授权、订阅、购买和支持联系方式。",
      },
    },
    docs: {
      chaptersTitle: "步骤",
      description:
        "看一遍流程，直接跳到需要的步骤。",
      emptyVideoDescription:
        "把这个功能的演示视频放到 public/docs，然后在 timeline JSON 里填入视频路径和校准后的时间点。",
      emptyVideoTitle: "视频稍后添加",
      eyebrow: "文档",
      featureListAria: "文档主题",
      playback: {
        next: "下一步",
        pause: "暂停",
        play: "播放",
        previous: "上一步",
        restart: "重新开始",
      },
      progressLabel: "进度",
      title: "ScreenCam 指南。",
      videoAriaLabel: "文档演示视频",
      features: {
        basics: {
          title: "基础布局",
          summary: "了解预览画面、侧边栏、各类设置面板和时间线轨道。",
          chapters: {
            preview: {
              title: "预览画面",
              description: "用来实时预览当前最终导出的效果。",
            },
            sidebar: {
              title: "侧边栏",
              description: "所有的主要配置都在这里。",
            },
            "screen-settings": {
              title: "屏幕设置",
              description: "用来设置屏幕内容，包括壁纸、边距、尺寸等。",
            },
            "device-settings": {
              title: "设备设置",
              description: "给屏幕套上设备外壳，在这里选择设备，并配置设备的样式，例如背景。",
            },
            "keyboard-settings": {
              title: "按键设置",
              description: "设置录制的快捷键显示样式、默认尺寸和位置。",
            },
            "beauty-settings": {
              title: "美颜设置",
              description: "开启相机录制后，在这里对相机画面做一些轻微的人像美颜。",
            },
            "mouse-settings": {
              title: "鼠标设置",
              description: "设置鼠标的基础样式。",
            },
            "animation-settings": {
              title: "动画设置",
              description: "自定义镜头动画，包括运动模糊强度和自定义曲线。",
            },
            tracks: {
              title: "轨道",
              description: "录制、摄像头、系统音频、麦克风、缩放、键盘都会以时间轴片段的形式在这里展示。",
            },
          },
        },
        "preview-control": {
          title: "预览控制",
          summary: "调整预览播放速度、预览音量和时间线轨道缩放。",
          chapters: {
            "playback-rate": {
              title: "倍数播放",
              description:
                "这里调整预览的播放速度，**只影响预览阶段，不会影响导出**。",
            },
            volume: {
              title: "音量调节",
              description:
                "调整预览的声音，**只影响预览阶段，不会影响导出**。",
            },
            "track-zoom": {
              title: "轨道缩放",
              description: "调整轨道的缩放比例。",
            },
          },
        },
        "track-management": {
          title: "轨道管理",
          summary: "打开轨道设置、调整排序、隐藏轨道、删除轨道，并恢复已删除轨道。",
          chapters: {
            entry: {
              title: "入口",
              description: "在轨道左侧打开轨道设置面板。",
            },
            sort: {
              title: "排序",
              description:
                "拖拽前面的 {{icon:grip}} 排序图标来进行排序，这个排序将会作为偏好保存，下次也会使用这个排序。",
            },
            hide: {
              title: "隐藏",
              description:
                "点击 {{icon:eye}} 图标，隐藏不需要的轨道，这 **不会影响导出**。",
            },
            delete: {
              title: "删除",
              description:
                "点击 {{icon:trash}} 图标，删除不需要的轨道，这**会影响最终的导出**。",
            },
            restore: {
              title: "恢复",
              description: "已删除的轨道会单独显示在下方，可以随时点击恢复。",
            },
          },
        },
        "screen-settings": {
          title: "屏幕设置",
          summary: "这里的屏幕指录制画面以及画面可能带有的背景部分，用来调整这些样式。",
          chapters: {
            wallpaper: {
              title: "壁纸",
              description:
                "选择从系统读取的壁纸，包括动态壁纸。这部分不包含在应用安装包内，不占据空间，并且确保了最高的壁纸质量。可以点击自定义在设置中配置更多的壁纸目录。",
            },
            "no-background": {
              title: "无背景",
              description:
                "可以选择不要背景，这在全屏录制，或自己选择区域录制中尤其重要。但是要注意，**目前默认切换到无壁纸时，会保留之前的边距或尺寸设置，需要手动调成 0 来去掉黑边**。",
            },
            gradient: {
              title: "渐变",
              description:
                "选择预设的线性渐变，你也可以自己任意地编辑渐变锚点和颜色，随意加减锚点。",
            },
            "solid-color": {
              title: "纯色",
              description: "选择一个单一的颜色作为背景。",
            },
            "custom-background": {
              title: "自定义",
              description: "上传自己的照片或视频作为背景。",
            },
            "adaptive-size": {
              title: "屏幕尺寸自适应模式",
              description: "在这个模式下画面的大小通过调整上下或左右的边距来控制。",
            },
            "sync-margins": {
              title: "同步边距",
              description:
                "开启同步边距后确保 4 边的边距是一致的，关闭后可以单独控制上下或左右。注意，**如果选择了画面比例的功能，视觉上会确保最终的画面符合比例，边距看起来会和调的参数不一致**。",
            },
            "fixed-size": {
              title: "屏幕尺寸固定模式",
              description:
                "这个模式下你可以手动输入屏幕的尺寸。同样，**如果选择了画面比例，会向外补充至目标的比例**。",
            },
          },
        },
        "workspace-file": {
          title: "工程文件",
          summary:
            "工程文件是一次录制完成时生成的所有录制相关的原始文件，包括全部素材与配置，可以用于分享，**在录制完成时自动创建并保存到一个默认位置**。",
          chapters: {
            "default-directory": {
              title: "修改默认目录",
              description:
                "打开 <kbd>ScreenCam</kbd> > <kbd>设置</kbd> > <kbd>录制</kbd> > <kbd>默认工作区目录</kbd>，选择默认目录。",
            },
            "recent-projects": {
              title: "快速访问最近项目",
              description: "在 <kbd>文件</kbd> > <kbd>最近</kbd>。",
            },
            "default-directory-projects": {
              title: "快速访问默认位置的项目",
              description: "在 <kbd>文件</kbd> > <kbd>默认目录</kbd>。",
            },
            "show-in-finder": {
              title: "在 Finder 查看当前文件",
              description:
                "可以直接点击编辑器顶部的工程文件名，或者在 <kbd>文件</kbd> > <kbd>在访达打开</kbd>。",
            },
            "manual-save": {
              title: "手动保存",
              description:
                "可以点击 <kbd>文件</kbd> > <kbd>保存</kbd>，或使用快捷键 <kbd>⌘</kbd><kbd>S</kbd> 手动保存。大部分情况下会自动保存。",
            },
            "save-as": {
              title: "另存为",
              description:
                "点击 <kbd>文件</kbd> > <kbd>另存为</kbd>，或使用快捷键 <kbd>⌘</kbd><kbd>⇧</kbd><kbd>S</kbd>，将副本保存到自定义目录。",
            },
          },
        },
        record: {
          title: "录制",
          summary: "设置录制内容、选择来源，然后开始录制。",
          chapters: {
            "prepare-capture": {
              title: "准备录制",
              description: "打开 ScreenCam，并确认录制控制区已经准备好，再选择录制来源。",
            },
            "choose-source": {
              title: "选择来源",
              description: "选择显示器、窗口、区域、摄像头、麦克风和系统声音等录制选项。",
            },
            "start-recording": {
              title: "开始录制",
              description: "启动录制，并确认当前录制状态后再继续后续流程。",
            },
          },
        },
        zoom: {
          title: "变焦",
          summary: "添加时间线锚点，调整画面在录制中的移动方式。",
          chapters: {
            "zoom-track": {
              title: "Zoom 轴",
              description: "在 zoom 轴上自由创建或删除 zoom 片段。",
            },
            "delete-clip": {
              title: "删除",
              description: "选中一个 clip 后，按 Backspace 或 Delete 删除。",
              descriptionHtml:
                '选中一个 clip 后，按 <kbd class="docs-key">Backspace</kbd> 或 <kbd class="docs-key">Delete</kbd> 删除。',
            },
            "create-clip": {
              title: "新建",
              description: "在空白处点击或拖拽，直接新建 zoom clip。",
            },
            "merge-clips": {
              title: "合并",
              description: "resize 一个 clip，或拖拽它与另一个 clip 相交，松开后确认合并。",
            },
            "manual-mode": {
              title: "手动模式",
              description: "默认会根据点击事件自动运镜，也可以切到手动模式，自定义锚点数量、缩放中心和放大比例。",
            },
            "select-anchor": {
              title: "选择锚点",
              description: "选中一个锚点，编辑它自己的 zoom 设置。",
            },
            "adjust-center": {
              title: "调整中心",
              description: "直接拖拽预览画面，调整缩放的视觉中心。",
            },
            "adjust-scale-wheel": {
              title: "调整缩放",
              description: "在预览画面里使用鼠标滚轮，直接控制放大比例。",
            },
            "adjust-scale-panel": {
              title: "设置面板调整",
              description: "选中锚点后，也可以在右侧设置面板里拖动滑块调整缩放。",
            },
          },
        },
        camera: {
          title: "摄像头",
          summary: "调整摄像头浮窗形状，并应用轻量的外观效果。",
          chapters: {
            "enable-camera": {
              title: "启用摄像头",
              description: "打开摄像头图层，并把它放到适合当前录制的位置。",
            },
            "shape-frame": {
              title: "调整画框",
              description: "切换画框形状，并调整摄像头浮窗尺寸来适配画面。",
            },
            "apply-beauty": {
              title: "应用美颜效果",
              description: "调整轻量外观设置，并保持预览效果和最终导出一致。",
            },
          },
        },
        shortcuts: {
          title: "快捷键",
          summary: "用键盘动作控制录制，不打断当前操作节奏。",
          chapters: {
            "capture-shortcut": {
              title: "用快捷键开始",
              description: "通过键盘触发录制控制，不需要频繁回到工具栏。",
            },
            "pause-resume": {
              title: "暂停或继续",
              description: "在较长录制中，用快捷键暂停和继续录制。",
            },
            "finish-recording": {
              title: "结束录制",
              description: "停止录制并进入编辑流程，同时保持当前上下文。",
            },
          },
        },
        export: {
          title: "导出",
          summary: "检查结果、选择输出设置，并导出录制文件。",
          chapters: {
            "choose-format": {
              title: "选择格式",
              description: "根据目标用途选择导出格式和输出设置。",
            },
            "review-preview": {
              title: "检查预览",
              description: "在渲染文件前确认最终预览效果。",
            },
            "export-file": {
              title: "导出文件",
              description: "渲染录制内容，并保存导出的结果文件。",
            },
          },
        },
      },
    },
    home: {
      screenStudioAlternative: {
        eyebrow: "Screen Studio 替代方案",
        title: "想要更轻巧、手动控制更深入的 Mac 录屏工具吗？",
        description:
          "从应用体积、CPU 与内存占用、导出速度、手动变焦锚点、图层、设备样机和导出格式等方面对比 ScreenCam 与 Screen Studio。",
        cta: "查看 Mac 版 Screen Studio 替代方案",
      },
      structuredDataFeatureList: ["原生 macOS 屏幕录制", "手动变焦锚点", "运动模糊转场", "精确预览导出"],
      hero: {
        appStoreButton: "在 App Store 查看",
        builtWithLabel: "构建方式",
        builtWithValue: "100% 原生",
        systemLabel: "系统",
        systemValue: "macOS 15+",
        tagline: "原生 macOS 录屏，带手动变焦、运动模糊和精确导出。",
        titleLines: [
          ["让每一帧", "都清晰。"],
          ["让重点", "被看见。"],
        ],
      },
      zoom: {
        canvasLabels: {
          autoPlayingDemo: "自动播放演示",
          playMarker: "播放",
          previewMarker: "预览",
          recordingClip: "录制",
          recordingTrack: "录制",
          timelinePreview: "时间线预览",
          zoomClip: "自动变焦",
          zoomTrack: "变焦",
        },
        features: [
          {
            title: "动态变焦",
            description: "镜头运动沿用 ScreenCam 导出时的同一套弹簧时序。",
          },
          {
            title: "时间线预览",
            description: "悬停在录制或变焦轨道上，即可拖看精确的预览帧。",
          },
          {
            title: "运动模糊",
            description: "变焦、平移和点击状态都会按快门感采样模糊。",
          },
        ],
        subtitle: "带运动模糊的变焦。",
        timelineAria: "时间线预览轨道",
        title: "聚焦真正重要的画面。",
      },
      deviceMockups: {
        description: "用精致设备框导出内容。iPhone、Mac、Studio Display，让画面呈现得刚刚好。",
        eyebrow: "导出选项",
        formats: ["原始分辨率", "Live Photo", "MP4 / MOV"],
        imageAlt: {
          iPhone: "iPhone 17 Pro Max",
          macBook: "在 MacBook Pro 上运行的 ScreenCam app",
          studioDisplay: "在 Studio Display 和 MacBook 上运行的 ScreenCam",
        },
        title: "每块屏幕都好看",
      },
      controls: {
        body: "手动模式给你完整的创作自由。给同一个变焦片段添加多个锚点，每个锚点都有自己的倍率和中心点。",
        centerLabel: "中心",
        dragCenter: "拖动调整中心",
        eyebrow: "高级控制",
        features: ["拖动锚点调整时间线位置", "为每个锚点设置 1x 到 5x 倍率", "为每次变焦设置自定义焦点", "锚点之间平滑过渡"],
        pauseAria: "暂停模拟时间线播放",
        pauseTitle: "暂停",
        playAria: "播放模拟时间线",
        playTitle: "播放",
        scaleAria: "缩放倍率",
        scaleLabel: "倍率",
        titleMuted: "每个变焦点。",
        titleStart: "完全掌控",
      },
      performance: {
        cta: "查看完整基准数据",
        metrics: {
          appSize: "App 体积",
          appSizeNote: "约 20MB vs 600MB",
          cpuUsage: "CPU 使用率",
          exportTime: "导出时间",
          exportTimeNote: "越短越快",
          memory: "内存",
          others: "其他",
          screenCam: "ScreenCam",
        },
        subtitle: "没有 Electron。没有 WebView。纯原生性能。",
        title: "原生，所以快",
      },
      featureCards: {
        eyebrow: "更多特色",
        title: "每一处小细节，都认真打磨。",
        subtitle: "从录制、编辑到导出，围绕 Mac 原生体验，把常用流程做得更顺手。",
        beautyThumb: {
          beforeLabel: "美颜关闭",
          afterLabel: "美颜开启",
          disclosure: "人像由 AI 生成，仅用于演示产品真实的美颜效果。",
          enterFloatingAria: "切换为摄像头浮窗",
          exitFloatingAria: "恢复完整摄像头预览",
          pauseAria: "暂停美颜对比演示",
          playAria: "播放美颜对比演示",
          shapeCycleAria: "切换浮窗形状",
          shapeLabels: {
            circle: "圆形",
            square: "圆角方形",
            wide: "16:9",
          },
        },
        dynamicIslandThumb: {
          ariaLabel: "Dynamic Island 后台任务预览",
          materialLabel: "刘海材质",
          modeLabels: {
            black: "黑色",
            glass: "Glass",
          },
          tasks: [
            {
              title: "ScreenCam 发布视频",
              detail: "已完成，可在 Finder 中查看。",
              primaryAction: "打开 Finder",
              secondary: "已完成",
              secondaryAction: "完成",
              size: "384 MB",
            },
            {
              title: "4K 教程导出",
              detail: "正在编码 H.265，包含摄像头和光标图层。",
              primaryAction: "打开 Finder",
              secondary: "剩 2 分钟",
              secondaryAction: "完成",
              size: "1.2 GB",
            },
            {
              title: "GIF 预览压缩",
              detail: "正在优化帧，生成更小的分享片段。",
              primaryAction: "打开 Finder",
              secondary: "剩 42 秒",
              secondaryAction: "完成",
              size: "18 MB",
            },
          ],
          wallpaperButtonAria: "切换壁纸",
        },
        effectLayersThumb: {
          ariaLabel: "特效图层时间线预览",
          dragHint: "拖拽到轨道添加",
          effects: [
            {
              id: "mosaic",
              title: "马赛克",
              description: "给画面中的敏感区域叠加马赛克。",
              clipLabel: "马赛克",
            },
            {
              id: "focus",
              title: "聚焦",
              description: "突出重点区域，同时保留上下文。",
              clipLabel: "聚焦",
            },
            {
              id: "text",
              title: "文字",
              description: "在剪辑中任意位置添加文字图层。",
              clipLabel: "文字",
            },
            {
              id: "image",
              title: "图片",
              description: "把图片作为可计时的叠加图层放入时间线。",
              clipLabel: "图片",
            },
          ],
        },
        glassThumb: {
          modeLabels: {
            clear: "通透",
            regular: "常规",
          },
          toolbarItems: {
            area: "区域",
            camera: "摄像头",
            close: "隐藏 ScreenCam",
            display: "屏幕",
            iphone: "iPhone",
            keyboard: "键盘事件录制",
            microphone: "麦克风",
            settings: "设置",
            systemAudio: "系统声音录制",
            window: "窗口",
            workspace: "打开工作区",
          },
          wallpaperButtonAria: "切换壁纸",
        },
        items: [
          {
            title: "Liquid Glass",
            caption: "支持原生 glass 材质，让控制层通透、清晰，并贴合现代 macOS 视觉。",
          },
          {
            title: "快捷键展示",
            caption: "录制键盘快捷键操作，并在视频中清晰展示出来。",
          },
          {
            title: "轻度美颜",
            caption: "轻微优化相机画面，让人像更清爽自然。",
          },
          {
            title: "Dynamic Island",
            caption: "将长任务放到后台，在 notch 中随时关注进度。",
          },
          {
            title: "特效图层",
            caption: "可以添加任意数量的特效图层，在时间线上移动、缩放并堆叠每个 clip。",
          },
        ],
      },
      faq: {
        eyebrow: "FAQ",
        title: "常见问题",
        items: [
          {
            question: "ScreenCam 和基于浏览器的录屏工具有什么不同？",
            answer:
              "ScreenCam 是为 macOS 打造的原生录制和编辑 app。目标是提供紧凑、Mac 优先的工作流，包括本地捕捉、顺滑编辑控制和精确预览导出。",
          },
          {
            question: "最低需要哪个 macOS 版本？",
            answer: "ScreenCam 需要 macOS 15 或更高版本。",
          },
          {
            question: "有 Windows 版本吗？",
            answer: "目前没有。ScreenCam 专注于 macOS，短期内没有开发 Windows 版本的计划。",
          },
          {
            question: "可以导出不同格式吗？",
            answer: "ScreenCam 面向高质量视频导出，编辑器中的画幅和运动控制会反映到最终输出里。",
          },
          {
            question: "变焦功能如何工作？",
            answer:
              "你可以在时间线任意位置添加变焦点。手动模式下可以完全控制：设置多个不同倍率和焦点中心的锚点，并带有顺滑的运动模糊转场。",
          },
          {
            question: "支持多个显示器吗？",
            answer: "ScreenCam 面向 Mac 屏幕录制工作流，支持连接的显示器、窗口和选定录制区域。",
          },
        ],
      },
    },
    legal: {
      privacy: {
        eyebrow: "隐私",
        title: "隐私政策",
        updated: "最后更新：2026 年 6 月 3 日",
        sections: [
          {
            title: "概览",
            paragraphs: [
              [
                "ScreenCam 是一款原生 macOS 屏幕录制和编辑 app。它的设计目标是在你的 Mac 本地处理录制内容。ScreenCam 可能会为了 app 功能发起网络请求，例如 App Store 购买状态；当你选择启用时，也可能发送可选的匿名使用分析。我们不会在 app 中使用广告追踪器。",
              ],
            ],
          },
          {
            title: "录制内容和本地文件",
            paragraphs: [
              [
                "屏幕录制、摄像头视频、麦克风音频、系统音频、光标数据、导出视频、工作区文件和自定义壁纸文件会保留在你的设备或你选择的位置。ScreenCam 不会把这些内容上传到 ScreenCam 服务器。",
              ],
            ],
          },
          {
            title: "匿名使用分析",
            paragraphs: [
              [
                "ScreenCam 可能会询问你是否愿意分享匿名使用分析，以帮助我们了解哪些录制和编辑功能运行良好。你可以随时在 app 中开启或关闭分析共享。如果关闭，ScreenCam 不会发送使用分析。",
              ],
              [
                "分析内容仅限产品使用、诊断和性能信息，例如功能交互、app 版本、macOS 版本和一般设备信息。我们绝不会通过分析收集屏幕内容、音频、摄像头视频、项目文件、文件名或输入文本。",
              ],
            ],
          },
          {
            title: "权限",
            paragraphs: [
              [
                "ScreenCam 可能会请求 macOS 的屏幕录制、麦克风、摄像头和文件访问权限。这些权限只用于提供录制、编辑、导出和用户选择文件等功能。你可以在系统设置中管理这些权限。",
              ],
            ],
          },
          {
            title: "购买",
            paragraphs: [
              [
                "ScreenCam Pro 订阅和购买由 Apple 通过 Mac App Store 处理。ScreenCam 会通过 StoreKit 读取购买和订阅状态，以解锁 Pro 功能。ScreenCam 不会接收或保存你的支付卡信息。",
              ],
            ],
          },
          {
            title: "网站",
            paragraphs: [
              [
                "当你访问 thescreen.cam 时，我们的托管和基础设施提供商可能会处理标准服务器日志数据，例如 IP 地址、浏览器 user agent、请求 URL 和请求时间，用于安全、诊断和网站交付。本网站不使用广告追踪器。",
              ],
            ],
          },
          {
            title: "变更和联系",
            paragraphs: [["随着 ScreenCam 变化，我们可能会更新本政策。如果你有隐私问题，请通过 ", emailLink, " 联系我们。"]],
          },
        ],
      },
      support: {
        eyebrow: "支持",
        title: "ScreenCam 支持",
        updated: "获取 ScreenCam macOS 版帮助。",
        supportChannelsAria: "支持渠道",
        sections: [
          {
            title: "联系",
            showSupportChannels: true,
            paragraphs: [["如需产品支持、报告问题、购买咨询或反馈，请发送邮件至 ", emailLink, "。"]],
          },
          {
            title: "请包含这些信息",
            paragraphs: [
              [
                "报告问题时，请包含 macOS 版本、ScreenCam 版本、Mac 型号、录制设置、导出格式，以及简短的问题描述。如果是视觉问题，截图或短录屏会很有帮助。",
              ],
            ],
          },
          {
            title: "App Store 购买",
            paragraphs: [
              [
                "ScreenCam 通过 Mac App Store 分发。计费、订阅、续订、取消和退款由 Apple 通过你的 Apple ID 与 App Store 账户设置处理。",
              ],
            ],
          },
          {
            title: "系统要求",
            paragraphs: [["ScreenCam 目前为 macOS 构建。没有 Windows 版本，短期内也没有 Windows 开发计划。"]],
          },
          {
            title: "隐私",
            paragraphs: [["录制内容和工作区文件会在你的 Mac 本地处理。更多详情请阅读", { href: "/privacy", text: "隐私政策" }, "。"]],
          },
        ],
      },
      terms: {
        eyebrow: "条款",
        title: "使用条款",
        updated: "最后更新：2026 年 5 月 20 日",
        sections: [
          {
            title: "App 授权",
            paragraphs: [
              [
                "除非适用法律另有要求，ScreenCam 根据 Apple 标准最终用户许可协议 (EULA) 授权给你使用。你可以在 ",
                appleEulaLink,
                " 查看 Apple 标准 EULA。",
              ],
            ],
          },
          {
            title: "订阅和购买",
            paragraphs: [
              [
                "ScreenCam Pro 订阅和购买由 Apple 通过 Mac App Store 处理。订阅计费、续订、取消、退款和账户管理均通过你的 Apple ID 与 App Store 账户设置完成。",
              ],
            ],
          },
          {
            title: "ScreenCam 的使用",
            paragraphs: [["你需要对使用 ScreenCam 创建的录制内容、文件和导出结果负责。只有在拥有所需权利和许可时，才应录制、编辑和分享内容。"]],
          },
          {
            title: "隐私",
            paragraphs: [["ScreenCam 的隐私实践见", { href: "/privacy", text: "隐私政策" }, "。"]],
          },
          {
            title: "联系",
            paragraphs: [["如果你对这些条款有疑问，请通过 ", emailLink, " 联系我们。"]],
          },
        ],
      },
    },
    changelog: {
      description: "产品更新、修复和版本说明。",
      eyebrow: "更新日志",
      intro: "产品更新、修复和版本说明。",
      linkVersionLabel: "链接到版本",
      title: "ScreenCam 更新日志",
    },
    motionBlurTool: {
      addMaskAria: "添加遮罩",
      addMaskButton: "遮罩",
      angleAria: "模糊角度",
      angleLabel: "角度",
      blurSettingsTitle: "模糊设置",
      chooseImage: "选择图片",
      clearImage: "清除图片",
      defaultMaskName: "遮罩",
      deleteSelectedMaskAria: "删除选中的遮罩",
      description: "创建矩形模糊区域，调整方向和强度，然后导出合成图片。",
      emptyMasksWithImage: "添加一个遮罩来模糊图片的一部分。",
      emptyMasksWithoutImage: "请先上传图片。",
      exportButton: "导出",
      heightLabel: "高度",
      linearMode: "线性",
      maskButton: "遮罩",
      masksTitle: "遮罩",
      modeLabel: "模式",
      nameLabel: "名称",
      previewAria: "运动模糊预览",
      replaceImageAria: "替换图片",
      selectedMaskEmpty: "选择一个遮罩，以编辑模糊方向、强度、位置和大小。",
      sourceTitle: "来源",
      strengthAria: "模糊强度",
      strengthLabel: "强度",
      title: "运动模糊遮罩",
      toolEyebrow: "工具",
      uniformMode: "均匀",
      uploadDescription: "将本地图片拖到这里，或选择一个文件开始编辑。",
      uploadTitle: "上传图片",
      widthLabel: "宽度",
      xLabel: "X",
      yLabel: "Y",
    },
  },
  de: {
    common: {
      skipToContent: "Zum Inhalt springen",
    },
    header: {
      appStore: "App Store",
      backToMenuAria: "Zurück zum Menü",
      closeMenuAria: "Menü schließen",
      homeAria: "ScreenCam Startseite",
      logoAlt: "ScreenCam Logo",
      menuAria: "Menü öffnen",
      nav: {
        changelog: "Changelog",
        docs: "Docs",
        privacy: "Datenschutz",
        support: "Support",
        terms: "Bedingungen",
      },
      primaryNavigationAria: "Hauptnavigation",
    },
    footer: {
      appStoreButton: "Im App Store ansehen",
      copyright: "Alle Rechte vorbehalten.",
      ctaText: "Lade ScreenCam aus dem Mac App Store.",
      ctaTitle: "Bereit, besser aufzunehmen?",
      description: "Native Bildschirmaufnahme für Mac. Schnell, leichtgewichtig, leistungsstark.",
      groups: {
        legal: "Rechtliches",
        product: "Produkt",
        resources: "Ressourcen",
      },
      language: "Sprache",
      legalLinks: {
        privacy: "Datenschutz",
        terms: "Bedingungen",
      },
      productLinks: {
        controls: "Steuerung",
        export: "Export",
        faq: "FAQ",
        zoom: "Zoom",
      },
      resourceLinks: {
        alternatives: "Alternativen",
        bgm: "BGM",
        changelog: "Changelog",
        docs: "Docs",
        motionBlurMask: "Motion Blur Mask",
        support: "Support",
      },
      supportChannelsAria: "Support-Kanäle",
      systemStatus: "Alle Systeme betriebsbereit",
    },
    meta: {
      changelog: {
        title: "Changelog - ScreenCam",
        description: "Lies ScreenCam Versionshinweise, Produktverbesserungen, Fehlerbehebungen und Update-Historie.",
      },
      docs: {
        title: "Docs - ScreenCam",
        description:
          "Lerne ScreenCam mit geführten Video-Walkthroughs, Kapitelschritten und interaktiver Wiedergabe.",
      },
      home: {
        title: "ScreenCam - Native macOS-Bildschirmaufnahme mit gerichtetem Zoom",
        description:
          "ScreenCam ist ein nativer macOS-Bildschirmrekorder für scharfe Aufnahmen, manuelle Zoomsteuerung, Timeline-Anker, Kurvenabstimmung und preview-genauen Export.",
      },
      motionBlurMask: {
        title: "Motion Blur Mask Tool - ScreenCam",
        description:
          "Lade ein Bild hoch, zeichne rechteckige Motion-Blur-Masken, passe Stärke und Richtung an und exportiere das zusammengesetzte Ergebnis.",
      },
      privacy: {
        title: "Datenschutzerklärung - ScreenCam",
        description:
          "Die Datenschutzerklärung von ScreenCam erklärt, wie die macOS-App Aufnahmen, Berechtigungen, optionale Analysen, Käufe und Website-Daten verarbeitet.",
      },
      support: {
        title: "Support - ScreenCam",
        description:
          "Erhalte Hilfe zu ScreenCam für macOS, einschließlich Support-Kontakt, App-Store-Käufen, Anforderungen und Fehlerbehebung.",
      },
      terms: {
        title: "Nutzungsbedingungen - ScreenCam",
        description:
          "Die Nutzungsbedingungen von ScreenCam erklären App-Lizenz, Abonnements, Käufe und Support-Kontakt.",
      },
    },
    docs: {
      chaptersTitle: "Schritte",
      description:
        "Workflow ansehen, direkt zum gewünschten Schritt springen.",
      emptyVideoDescription:
        "Lege die Demo-Datei für diese Funktion in public/docs ab und trage anschließend Videopfad und kalibrierte Zeitpunkte in die Timeline-JSON ein.",
      emptyVideoTitle: "Video folgt",
      eyebrow: "Docs",
      featureListAria: "Dokumentationsthemen",
      playback: {
        next: "Nächster Schritt",
        pause: "Pausieren",
        play: "Abspielen",
        previous: "Vorheriger Schritt",
        restart: "Neu starten",
      },
      progressLabel: "Fortschritt",
      title: "ScreenCam Guides.",
      videoAriaLabel: "Dokumentations-Demo-Video",
      features: {
        basics: {
          title: "Grundlagen",
          summary: "Lerne Vorschau, Seitenleiste, Einstellbereiche und Timeline-Spuren kennen.",
          chapters: {
            preview: {
              title: "Vorschau",
              description: "Nutze die Vorschau, um das aktuelle finale Exportergebnis in Echtzeit zu sehen.",
            },
            sidebar: {
              title: "Seitenleiste",
              description: "Alle wichtigen Konfigurationsbereiche befinden sich in der Seitenleiste.",
            },
            "screen-settings": {
              title: "Bildschirmeinstellungen",
              description:
                "Konfiguriere den Bildschirminhalt, einschließlich Hintergrundbildern, Rändern, Größe und Layoutoptionen.",
            },
            "device-settings": {
              title: "Geräte-Einstellungen",
              description: "Lege einen Geräte-Rahmen um den Bildschirm, wähle das Gerät und passe Stile wie den Hintergrund an.",
            },
            "keyboard-settings": {
              title: "Tasten-Einstellungen",
              description: "Lege fest, wie aufgezeichnete Shortcuts erscheinen, einschließlich Standardgröße und Position.",
            },
            "beauty-settings": {
              title: "Beauty-Einstellungen",
              description: "Nach Aktivierung der Kamera kannst du dezente Portrait-Optimierungen auf das Kamerabild anwenden.",
            },
            "mouse-settings": {
              title: "Maus-Einstellungen",
              description: "Passe den grundlegenden visuellen Stil des Mauszeigers an.",
            },
            "animation-settings": {
              title: "Animations-Einstellungen",
              description: "Passe Kamerabewegungen an, einschließlich Motion-Blur-Stärke und eigener Kurven.",
            },
            tracks: {
              title: "Spuren",
              description: "Aufnahme, Kamera, Systemaudio, Mikrofon, Zoom und Tastaturereignisse erscheinen hier als Timeline-Clips.",
            },
          },
        },
        "preview-control": {
          title: "Vorschau-Steuerung",
          summary: "Passe Wiedergabegeschwindigkeit, Vorschau-Lautstärke und Timeline-Spur-Zoom beim Bearbeiten an.",
          chapters: {
            "playback-rate": {
              title: "Wiedergabegeschwindigkeit",
              description:
                "Passe hier die Wiedergabegeschwindigkeit der Vorschau an. **Das wirkt sich nur auf die Vorschauphase aus und nicht auf den Export.**",
            },
            volume: {
              title: "Lautstärke",
              description:
                "Passe den Ton an, den du in der Vorschau hörst. **Das wirkt sich nur auf die Vorschauphase aus und nicht auf den Export.**",
            },
            "track-zoom": {
              title: "Spur-Zoom",
              description: "Ändert die Zoomstufe der Timeline-Spuren.",
            },
          },
        },
        "track-management": {
          title: "Spurverwaltung",
          summary: "Öffne Spureinstellungen, sortiere Spuren, blende sie aus, lösche sie und stelle gelöschte Spuren wieder her.",
          chapters: {
            entry: {
              title: "Einstieg",
              description: "Öffne links neben den Spuren das Panel für die Spureinstellungen.",
            },
            sort: {
              title: "Sortieren",
              description:
                "Ziehe den vorderen {{icon:grip}} Sortiergriff, um Spuren neu anzuordnen. Diese Reihenfolge wird als Präferenz gespeichert und beim nächsten Mal wiederverwendet.",
            },
            hide: {
              title: "Ausblenden",
              description:
                "Klicke auf das {{icon:eye}} Symbol, um nicht benötigte Spuren auszublenden. **Dies wirkt sich nicht auf den Export aus.**",
            },
            delete: {
              title: "Löschen",
              description:
                "Klicke auf das {{icon:trash}} Symbol, um nicht benötigte Spuren zu löschen. **Dies wirkt sich auf den finalen Export aus.**",
            },
            restore: {
              title: "Wiederherstellen",
              description:
                "Gelöschte Spuren erscheinen separat darunter und können jederzeit wiederhergestellt werden.",
            },
          },
        },
        "screen-settings": {
          title: "Bildschirmeinstellungen",
          summary: "Passe den aufgenommenen Bildschirminhalt, den möglichen Hintergrund, Ränder und Größenverhalten an.",
          chapters: {
            wallpaper: {
              title: "Hintergrundbild",
              description:
                "Wähle Hintergrundbilder, die aus dem System gelesen werden, einschließlich dynamischer Hintergrundbilder. Sie sind nicht im App-Paket enthalten, belegen keinen App-Speicher und behalten die höchste Hintergrundbild-Qualität. Klicke auf Benutzerdefiniert, um in den Einstellungen weitere Hintergrundbild-Ordner zu konfigurieren.",
            },
            "no-background": {
              title: "Kein Hintergrund",
              description:
                "Wähle keinen Hintergrund, besonders wichtig bei Vollbildaufnahmen oder selbst gewählten Aufnahmebereichen. **Aktuell bleiben beim Wechsel zu keinem Hintergrundbild standardmäßig vorherige Rand- oder Größeneinstellungen erhalten. Stelle sie manuell auf 0, um schwarze Ränder zu entfernen.**",
            },
            gradient: {
              title: "Verlauf",
              description:
                "Wähle einen vorgegebenen linearen Verlauf oder bearbeite Ankerpunkte und Farben frei, inklusive Hinzufügen und Entfernen von Ankern.",
            },
            "solid-color": {
              title: "Einfarbig",
              description: "Wähle eine einzelne Farbe als Hintergrund.",
            },
            "custom-background": {
              title: "Benutzerdefiniert",
              description: "Lade ein eigenes Foto oder Video als Hintergrund hoch.",
            },
            "adaptive-size": {
              title: "Adaptive Bildschirmgröße",
              description:
                "In diesem Modus wird die Bildgröße über obere/untere oder linke/rechte Ränder gesteuert.",
            },
            "sync-margins": {
              title: "Ränder synchronisieren",
              description:
                "Aktiviere synchronisierte Ränder, damit alle vier Seiten gleich bleiben. Deaktiviere es, um vertikale oder horizontale Ränder separat zu steuern. **Wenn das Seitenverhältnis aktiviert ist, wird das finale Bild visuell an dieses Verhältnis angepasst, sodass die Ränder anders aussehen können als die eingestellten Werte.**",
            },
            "fixed-size": {
              title: "Feste Bildschirmgröße",
              description:
                "In diesem Modus gibst du die Bildschirmgröße manuell ein. **Wenn das Seitenverhältnis aktiviert ist, wird nach außen bis zum Zielverhältnis ergänzt.**",
            },
          },
        },
        "workspace-file": {
          title: "Projektdatei",
          summary:
            "Eine Projektdatei enthält alle Rohdateien, die nach einer abgeschlossenen Aufnahme erzeugt werden, einschließlich aller Medien und Konfigurationen. Du kannst sie teilen, und **sie wird nach Abschluss der Aufnahme automatisch erstellt und an einem Standardort gespeichert.**",
          chapters: {
            "default-directory": {
              title: "Standardordner ändern",
              description:
                "Öffne <kbd>ScreenCam</kbd> > <kbd>Einstellungen</kbd> > <kbd>Aufnahme</kbd> > <kbd>Standard-Arbeitsbereichsordner</kbd> und wähle den Standardordner.",
            },
            "recent-projects": {
              title: "Zuletzt verwendete Projekte öffnen",
              description: "Nutze <kbd>Datei</kbd> > <kbd>Zuletzt</kbd>.",
            },
            "default-directory-projects": {
              title: "Projekte am Standardort öffnen",
              description: "Nutze <kbd>Datei</kbd> > <kbd>Standardordner</kbd>.",
            },
            "show-in-finder": {
              title: "Aktuelle Datei im Finder anzeigen",
              description:
                "Klicke direkt auf den Projektdateinamen oben im Editor, oder nutze <kbd>Datei</kbd> > <kbd>Im Finder anzeigen</kbd>.",
            },
            "manual-save": {
              title: "Manuell speichern",
              description:
                "Nutze <kbd>Datei</kbd> > <kbd>Speichern</kbd>, oder drücke <kbd>⌘</kbd><kbd>S</kbd>, um manuell zu speichern. In den meisten Fällen wird automatisch gespeichert.",
            },
            "save-as": {
              title: "Speichern unter",
              description:
                "Nutze <kbd>Datei</kbd> > <kbd>Speichern unter</kbd>, oder drücke <kbd>⌘</kbd><kbd>⇧</kbd><kbd>S</kbd>, um eine Kopie in einem eigenen Ordner zu speichern.",
            },
          },
        },
        record: {
          title: "Aufnehmen",
          summary: "Richte die Aufnahme ein, wähle die Quelle und starte die Aufzeichnung.",
          chapters: {
            "prepare-capture": {
              title: "Aufnahme vorbereiten",
              description: "Öffne ScreenCam und prüfe, ob die Aufnahmesteuerung bereit ist, bevor du eine Quelle auswählst.",
            },
            "choose-source": {
              title: "Quelle wählen",
              description: "Wähle Display, Fenster, Bereich, Kamera, Mikrofon und Systemaudio für die Aufnahme aus.",
            },
            "start-recording": {
              title: "Aufnahme starten",
              description: "Starte die Aufnahme und prüfe den Aufnahmestatus, bevor du im Workflow fortfährst.",
            },
          },
        },
        zoom: {
          title: "Zoom",
          summary: "Füge Timeline-Anker hinzu und steuere, wie sich die Kamera durch die Aufnahme bewegt.",
          chapters: {
            "zoom-track": {
              title: "Zoom-Spur",
              description: "Erstelle und lösche Zoom-Clips frei auf der Zoom-Spur.",
            },
            "delete-clip": {
              title: "Löschen",
              description: "Wähle einen Clip aus und drücke Backspace oder Delete, um ihn zu entfernen.",
              descriptionHtml:
                'Wähle einen Clip aus und drücke <kbd class="docs-key">Backspace</kbd> oder <kbd class="docs-key">Delete</kbd>, um ihn zu entfernen.',
            },
            "create-clip": {
              title: "Erstellen",
              description: "Klicke oder ziehe in einem leeren Bereich, um einen neuen Zoom-Clip zu erstellen.",
            },
            "merge-clips": {
              title: "Zusammenführen",
              description: "Vergrößere oder ziehe einen Clip, bis er einen anderen überlappt, und lasse los, um das Zusammenführen zu bestätigen.",
            },
            "manual-mode": {
              title: "Manueller Modus",
              description: "Wechsle vom automatischen Kameramove in den manuellen Modus und passe Anzahl, Zentrum und Skalierung der Anker frei an.",
            },
            "select-anchor": {
              title: "Anker auswählen",
              description: "Wähle einen Anker aus, um seine individuellen Zoom-Einstellungen zu bearbeiten.",
            },
            "adjust-center": {
              title: "Zentrum anpassen",
              description: "Ziehe direkt in der Vorschau, um das visuelle Zentrum des Zooms festzulegen.",
            },
            "adjust-scale-wheel": {
              title: "Skalierung anpassen",
              description: "Nutze das Mausrad in der Vorschau, um die Zoom-Skalierung zu steuern.",
            },
            "adjust-scale-panel": {
              title: "Skalierung im Panel",
              description: "Wähle einen Anker aus und stelle die Skalierung im rechten Einstellungsbereich per Slider ein.",
            },
          },
        },
        camera: {
          title: "Kamera",
          summary: "Forme das Kamera-Overlay und wende leichte Darstellungsanpassungen an.",
          chapters: {
            "enable-camera": {
              title: "Kamera aktivieren",
              description: "Schalte die Kameraebene ein und positioniere sie passend zur Aufnahme.",
            },
            "shape-frame": {
              title: "Rahmen formen",
              description: "Wechsle zwischen Rahmenformen und passe die Größe des Kamera-Overlays an.",
            },
            "apply-beauty": {
              title: "Beauty-Effekte anwenden",
              description: "Passe subtile Darstellungseinstellungen an, während die Vorschau dem Export entspricht.",
            },
          },
        },
        shortcuts: {
          title: "Shortcuts",
          summary: "Steuere die Aufnahme per Tastatur, ohne den Arbeitsfluss zu unterbrechen.",
          chapters: {
            "capture-shortcut": {
              title: "Mit Shortcut starten",
              description: "Löse die Aufnahme per Tastatur aus, statt zur Toolbar zu wechseln.",
            },
            "pause-resume": {
              title: "Pausieren oder fortsetzen",
              description: "Nutze Shortcut-Aktionen, um längere Aufnahmen zu pausieren und fortzusetzen.",
            },
            "finish-recording": {
              title: "Take beenden",
              description: "Stoppe die Aufnahme und wechsle in den Editor, ohne den Kontext zu verlieren.",
            },
          },
        },
        export: {
          title: "Export",
          summary: "Prüfe das Ergebnis, wähle Ausgabeeinstellungen und exportiere die Aufnahme.",
          chapters: {
            "choose-format": {
              title: "Format wählen",
              description: "Wähle Exportformat und Ausgabeeinstellungen für das Ziel aus.",
            },
            "review-preview": {
              title: "Vorschau prüfen",
              description: "Kontrolliere die finale Vorschau, bevor die Datei gerendert wird.",
            },
            "export-file": {
              title: "Datei exportieren",
              description: "Rendere die Aufnahme und speichere das exportierte Ergebnis.",
            },
          },
        },
      },
    },
    home: {
      screenStudioAlternative: {
        eyebrow: "Screen-Studio-Alternative",
        title: "Brauchst du einen leichteren Mac-Screenrecorder mit mehr manueller Kontrolle?",
        description:
          "Vergleiche ScreenCam mit Screen Studio bei App-Größe, CPU- und Speichernutzung, Exportgeschwindigkeit, manuellen Zoom-Ankern, Ebenen, Geräte-Mockups und Exportformaten.",
        cta: "Screen-Studio-Alternative für Mac",
      },
      structuredDataFeatureList: [
        "Native macOS-Bildschirmaufnahme",
        "Manuelle Zoom-Anker",
        "Motion-Blur-Übergänge",
        "Preview-genauer Export",
      ],
      hero: {
        appStoreButton: "Im App Store ansehen",
        builtWithLabel: "Gebaut mit",
        builtWithValue: "100% nativ",
        systemLabel: "System",
        systemValue: "macOS 15+",
        tagline: "Hochauflösende Aufnahme mit einer Kamera, die du nach dem Take formen kannst.",
        titleLines: [
          ["Scharf", "aufnehmen."],
          ["Frame", "führen."],
        ],
      },
      zoom: {
        canvasLabels: {
          autoPlayingDemo: "Automatische Demo",
          playMarker: "Play",
          previewMarker: "Preview",
          recordingClip: "Aufnahme",
          recordingTrack: "Aufnahme",
          timelinePreview: "Timeline-Vorschau",
          zoomClip: "Auto-Zoom",
          zoomTrack: "Zoom",
        },
        features: [
          {
            title: "Dynamischer Zoom",
            description: "Kamerabewegungen folgen demselben Spring-Timing wie ScreenCam-Exporte.",
          },
          {
            title: "Timeline-Vorschau",
            description: "Bewege den Cursor über Aufnahme- oder Zoom-Spur, um exakt zur Vorschau zu scrubben.",
          },
          {
            title: "Motion Blur",
            description: "Zoom-, Schwenk- und Klickzustände werden mit shutter-artiger Unschärfe gesampelt.",
          },
        ],
        subtitle: "Zoom mit Bewegungsunschärfe.",
        timelineAria: "Timeline-Vorschauspuren",
        title: "Fokussiere, worauf es ankommt.",
      },
      deviceMockups: {
        description:
          "Exportiere mit eleganten Geräteframes. iPhone, Mac, Studio Display - deine Inhalte perfekt präsentiert.",
        eyebrow: "Exportoptionen",
        formats: ["Originalauflösung", "Live Photo", "MP4 / MOV"],
        imageAlt: {
          iPhone: "iPhone 17 Pro Max",
          macBook: "ScreenCam-App auf einem MacBook Pro",
          studioDisplay: "ScreenCam auf Studio Display mit MacBook",
        },
        title: "Schön auf jedem Bildschirm.",
      },
      controls: {
        body:
          "Der manuelle Modus gibt dir volle kreative Freiheit. Füge einem Zoomclip mehrere Anker hinzu, jeder mit eigener Skalierung und eigenem Mittelpunkt.",
        centerLabel: "Mitte",
        dragCenter: "Ziehen, um die Mitte anzupassen",
        eyebrow: "Erweiterte Steuerung",
        features: [
          "Anker auf der Timeline verschieben",
          "Skalierung pro Anker von 1x bis 5x anpassen",
          "Eigenen Fokuspunkt für jeden Zoom setzen",
          "Weiche Übergänge zwischen Ankern",
        ],
        pauseAria: "Mock-Timeline-Wiedergabe pausieren",
        pauseTitle: "Pause",
        playAria: "Mock-Timeline-Wiedergabe starten",
        playTitle: "Play",
        scaleAria: "Skalierung",
        scaleLabel: "Skalierung",
        titleMuted: "jeden Zoompunkt.",
        titleStart: "Volle Kontrolle über",
      },
      performance: {
        cta: "Vollständige Benchmark-Daten ansehen",
        metrics: {
          appSize: "App-Größe",
          appSizeNote: "ca. 20MB vs. 600MB",
          cpuUsage: "CPU-Auslastung",
          exportTime: "Exportzeit",
          exportTimeNote: "kürzer ist schneller",
          memory: "Speicher",
          others: "Andere",
          screenCam: "ScreenCam",
        },
        subtitle: "Kein Electron. Keine Webviews. Reine native Performance.",
        title: "Nativ heißt schnell.",
      },
      featureCards: {
        eyebrow: "Weitere Features",
        title: "Kleine Details, bereit für echte Workflows.",
        subtitle: "Native Feinheiten, damit Aufnahmen schnell, sauber und Mac-first wirken.",
        beautyThumb: {
          beforeLabel: "Beauty aus",
          afterLabel: "Beauty an",
          disclosure:
            "KI-generiertes Porträt, nur zur Demonstration des echten Beauty-Effekts.",
          enterFloatingAria: "Als schwebendes Kamerafenster anzeigen",
          exitFloatingAria: "Kamerafenster zur Vollvorschau zurücksetzen",
          pauseAria: "Beauty-Vergleich pausieren",
          playAria: "Beauty-Vergleich abspielen",
          shapeCycleAria: "Form des schwebenden Fensters wechseln",
          shapeLabels: {
            circle: "Kreis",
            square: "Abgerundetes Quadrat",
            wide: "16:9",
          },
        },
        dynamicIslandThumb: {
          ariaLabel: "Dynamic-Island-Vorschau für Hintergrundaufgaben",
          materialLabel: "Notch-Material",
          modeLabels: {
            black: "Schwarz",
            glass: "Glass",
          },
          tasks: [
            {
              title: "ScreenCam Launch-Film",
              detail: "Fertig und im Finder bereit.",
              primaryAction: "Finder öffnen",
              secondary: "Fertig",
              secondaryAction: "Erledigt",
              size: "384 MB",
            },
            {
              title: "4K-Tutorial-Export",
              detail: "Codiert H.265 mit Kamera- und Cursor-Ebenen.",
              primaryAction: "Finder öffnen",
              secondary: "2 Min. übrig",
              secondaryAction: "Erledigt",
              size: "1,2 GB",
            },
            {
              title: "GIF-Vorschau komprimieren",
              detail: "Optimiert Frames für einen kleineren Clip.",
              primaryAction: "Finder öffnen",
              secondary: "42 s übrig",
              secondaryAction: "Erledigt",
              size: "18 MB",
            },
          ],
          wallpaperButtonAria: "Hintergrund wechseln",
        },
        effectLayersThumb: {
          ariaLabel: "Timeline-Vorschau für Effekt-Ebenen",
          dragHint: "Auf die Spur ziehen",
          effects: [
            {
              id: "mosaic",
              title: "Mosaik",
              description: "Pixeliert sensible Bereiche über der Aufnahme.",
              clipLabel: "Mosaik",
            },
            {
              id: "focus",
              title: "Fokus",
              description: "Hebt einen Bereich hervor und lässt Kontext sichtbar.",
              clipLabel: "Fokus",
            },
            {
              id: "text",
              title: "Text",
              description: "Fügt eine Textebene an jeder Stelle im Schnitt hinzu.",
              clipLabel: "Text",
            },
            {
              id: "image",
              title: "Bild",
              description: "Platziert ein Bild-Overlay als zeitgesteuerte Ebene.",
              clipLabel: "Bild",
            },
          ],
        },
        glassThumb: {
          modeLabels: {
            clear: "Klar",
            regular: "Normal",
          },
          toolbarItems: {
            area: "Bereich",
            camera: "Kamera",
            close: "ScreenCam ausblenden",
            display: "Bildschirm",
            iphone: "iPhone",
            keyboard: "Tastaturereignisse aufzeichnen",
            microphone: "Mikrofon",
            settings: "Einstellungen",
            systemAudio: "Systemton aufzeichnen",
            window: "Fenster",
            workspace: "Arbeitsbereich öffnen",
          },
          wallpaperButtonAria: "Hintergrund wechseln",
        },
        items: [
          {
            title: "Liquid Glass",
            caption: "Native Glass-Materialien halten Bedienelemente klar und passen zu modernem macOS.",
          },
          {
            title: "Tastenkürzel-Aufzeichnung",
            caption: "Zeichnet Tastenkombinationen während der Aufnahme auf und zeigt sie im Video klar an.",
          },
          {
            title: "Leichte Beauty",
            caption: "Dezente Beauty-Effekte für ein klareres Kamerabild.",
          },
          {
            title: "Dynamic Island",
            caption: "Lange Exporte laufen im Hintergrund, während der Fortschritt in der Notch sichtbar bleibt.",
          },
          {
            title: "Effekt-Ebenen",
            caption: "Füge beliebig viele Effekt-Ebenen hinzu und verschiebe, skaliere und staple jeden Clip direkt auf der Timeline.",
          },
        ],
      },
      faq: {
        eyebrow: "FAQ",
        title: "Fragen & Antworten",
        items: [
          {
            question: "Wie unterscheidet sich ScreenCam von browserbasierten Recordern?",
            answer:
              "ScreenCam ist als native Aufnahme- und Bearbeitungs-App für macOS gebaut. Ziel ist ein kompakter Mac-first Workflow mit lokaler Aufnahme, flüssigen Bearbeitungssteuerungen und preview-genauem Export.",
          },
          {
            question: "Welche macOS-Version ist mindestens erforderlich?",
            answer: "ScreenCam benötigt macOS 15 oder neuer.",
          },
          {
            question: "Gibt es eine Windows-Version?",
            answer:
              "Derzeit nicht. ScreenCam konzentriert sich auf macOS, und eine Windows-Version ist kurzfristig nicht geplant.",
          },
          {
            question: "Kann ich in verschiedene Formate exportieren?",
            answer:
              "ScreenCam ist für hochwertigen Videoexport aus dem Editor ausgelegt, wobei Framing und Bewegungssteuerung im finalen Output übernommen werden.",
          },
          {
            question: "Wie funktioniert die Zoom-Funktion?",
            answer:
              "Du kannst Zoompunkte überall auf der Timeline hinzufügen. Im manuellen Modus hast du volle Kontrolle: mehrere Anker mit unterschiedlichen Zoomstufen und Fokuszentren. Übergänge enthalten weiche Motion-Blur-Effekte.",
          },
          {
            question: "Unterstützt ScreenCam mehrere Monitore?",
            answer:
              "ScreenCam ist für Mac-Bildschirmaufnahme-Workflows gebaut, einschließlich verbundener Displays, Fenster und Aufnahmebereiche.",
          },
        ],
      },
    },
    legal: {
      privacy: {
        eyebrow: "Datenschutz",
        title: "Datenschutzerklärung",
        updated: "Zuletzt aktualisiert: 3. Juni 2026",
        sections: [
          {
            title: "Überblick",
            paragraphs: [
              [
                "ScreenCam ist eine native macOS-App für Bildschirmaufnahme und Bearbeitung. Die App ist darauf ausgelegt, Aufnahmen lokal auf deinem Mac zu verarbeiten. ScreenCam kann Netzwerkaufrufe für App-Funktionen ausführen, etwa für den App-Store-Kaufstatus und, wenn du es aktivierst, optionale anonyme Nutzungsanalysen. Wir verwenden in der App keine Werbetracker.",
              ],
            ],
          },
          {
            title: "Aufnahmen und lokale Dateien",
            paragraphs: [
              [
                "Bildschirmaufnahmen, Kameravideo, Mikrofon-Audio, Systemaudio, Cursordaten, exportierte Videos, Workspace-Dateien und eigene Wallpaper-Dateien bleiben auf deinem Gerät oder an Orten, die du auswählst. ScreenCam lädt diese Inhalte nicht auf ScreenCam-Server hoch.",
              ],
            ],
          },
          {
            title: "Anonyme Nutzungsanalysen",
            paragraphs: [
              [
                "ScreenCam kann dich fragen, ob du anonyme Nutzungsanalysen teilen möchtest, damit wir verstehen, welche Aufnahme- und Bearbeitungsfunktionen gut funktionieren. Du kannst die Analysefreigabe jederzeit in der App ein- oder ausschalten. Wenn sie deaktiviert ist, sendet ScreenCam keine Nutzungsanalysen.",
              ],
              [
                "Analysen beschränken sich auf Produktnutzung, Diagnose- und Leistungsinformationen, etwa Feature-Interaktionen, App-Version, macOS-Version und allgemeine Geräteinformationen. Wir erfassen über Analysen niemals Bildschirminhalte, Audio, Kameravideo, Projektdateien, Dateinamen oder getippten Text.",
              ],
            ],
          },
          {
            title: "Berechtigungen",
            paragraphs: [
              [
                "ScreenCam kann macOS um Berechtigungen für Bildschirmaufnahme, Mikrofon, Kamera und Dateizugriff bitten. Diese Berechtigungen werden nur für Aufnahme, Bearbeitung, Export und vom Nutzer gewählte Dateifunktionen verwendet. Du kannst sie in den Systemeinstellungen verwalten.",
              ],
            ],
          },
          {
            title: "Käufe",
            paragraphs: [
              [
                "ScreenCam Pro Abonnements und Käufe werden von Apple über den Mac App Store verarbeitet. ScreenCam liest den Kauf- und Abonnementstatus über StoreKit, damit Pro-Funktionen freigeschaltet werden können. ScreenCam erhält oder speichert keine Zahlungskartendaten.",
              ],
            ],
          },
          {
            title: "Website",
            paragraphs: [
              [
                "Wenn du thescreen.cam besuchst, können unsere Hosting- und Infrastrukturprovider standardmäßige Serverlogdaten wie IP-Adresse, Browser-User-Agent, Anfrage-URL und Anfragezeit für Sicherheit, Diagnose und Auslieferung der Website verarbeiten. Die Website verwendet keine Werbetracker.",
              ],
            ],
          },
          {
            title: "Änderungen und Kontakt",
            paragraphs: [["Wir können diese Richtlinie aktualisieren, wenn sich ScreenCam verändert. Bei Datenschutzfragen kontaktiere uns unter ", emailLink, "."]],
          },
        ],
      },
      support: {
        eyebrow: "Support",
        title: "ScreenCam Support",
        updated: "Hilfe zu ScreenCam für macOS.",
        supportChannelsAria: "Support-Kanäle",
        sections: [
          {
            title: "Kontakt",
            showSupportChannels: true,
            paragraphs: [["Sende eine E-Mail an ", emailLink, " für Produktsupport, Fehlerberichte, Kaufanfragen und Feedback."]],
          },
          {
            title: "Diese Details angeben",
            paragraphs: [
              [
                "Gib beim Melden eines Problems deine macOS-Version, ScreenCam-Version, dein Mac-Modell, Aufnahmeeinstellungen, Exportformat und eine kurze Beschreibung an. Screenshots oder kurze Aufnahmen helfen bei visuellen Problemen.",
              ],
            ],
          },
          {
            title: "App-Store-Käufe",
            paragraphs: [
              [
                "ScreenCam wird über den Mac App Store verteilt. Abrechnung, Abonnements, Verlängerungen, Kündigungen und Rückerstattungen werden von Apple über deine Apple-ID und die App-Store-Account-Einstellungen abgewickelt.",
              ],
            ],
          },
          {
            title: "Anforderungen",
            paragraphs: [["ScreenCam ist derzeit für macOS gebaut. Es gibt keine Windows-Version, und eine Windows-Entwicklung ist kurzfristig nicht geplant."]],
          },
          {
            title: "Datenschutz",
            paragraphs: [["Aufnahmen und Workspace-Dateien werden lokal auf deinem Mac verarbeitet. Lies die ", { href: "/privacy", text: "Datenschutzerklärung" }, " für weitere Details."]],
          },
        ],
      },
      terms: {
        eyebrow: "Bedingungen",
        title: "Nutzungsbedingungen",
        updated: "Zuletzt aktualisiert: 20. Mai 2026",
        sections: [
          {
            title: "App-Lizenz",
            paragraphs: [
              [
                "ScreenCam wird dir unter Apples Standard End User License Agreement (EULA) lizenziert, sofern geltendes Recht nichts anderes verlangt. Apples Standard-EULA findest du unter ",
                appleEulaLink,
                ".",
              ],
            ],
          },
          {
            title: "Abonnements und Käufe",
            paragraphs: [
              [
                "ScreenCam Pro Abonnements und Käufe werden von Apple über den Mac App Store verarbeitet. Abonnementabrechnung, Verlängerung, Kündigung, Rückerstattung und Accountverwaltung erfolgen über deine Apple-ID und App-Store-Account-Einstellungen.",
              ],
            ],
          },
          {
            title: "Nutzung von ScreenCam",
            paragraphs: [["Du bist für die Aufnahmen, Dateien und Exporte verantwortlich, die du mit ScreenCam erstellst. Nimm, bearbeite und teile Inhalte nur, wenn du die erforderlichen Rechte und Berechtigungen hast."]],
          },
          {
            title: "Datenschutz",
            paragraphs: [["Die Datenschutzpraktiken von ScreenCam sind in der ", { href: "/privacy", text: "Datenschutzerklärung" }, " beschrieben."]],
          },
          {
            title: "Kontakt",
            paragraphs: [["Wenn du Fragen zu diesen Bedingungen hast, kontaktiere uns unter ", emailLink, "."]],
          },
        ],
      },
    },
    changelog: {
      description: "Produktupdates, Fehlerbehebungen und Versionshinweise.",
      eyebrow: "Changelog",
      intro: "Produktupdates, Fehlerbehebungen und Versionshinweise.",
      linkVersionLabel: "Link zu Version",
      title: "ScreenCam Changelog",
    },
    motionBlurTool: {
      addMaskAria: "Maske hinzufügen",
      addMaskButton: "Maske",
      angleAria: "Unschärfewinkel",
      angleLabel: "Winkel",
      blurSettingsTitle: "Unschärfe-Einstellungen",
      chooseImage: "Bild wählen",
      clearImage: "Bild löschen",
      defaultMaskName: "Maske",
      deleteSelectedMaskAria: "Ausgewählte Maske löschen",
      description: "Erstelle rechteckige Unschärfebereiche, passe Richtung und Intensität an und exportiere das zusammengesetzte Bild.",
      emptyMasksWithImage: "Füge eine Maske hinzu, um einen Teil des Bildes zu verwischen.",
      emptyMasksWithoutImage: "Lade zuerst ein Bild hoch.",
      exportButton: "Exportieren",
      heightLabel: "Höhe",
      linearMode: "Linear",
      maskButton: "Maske",
      masksTitle: "Masken",
      modeLabel: "Modus",
      nameLabel: "Name",
      previewAria: "Motion-Blur-Vorschau",
      replaceImageAria: "Bild ersetzen",
      selectedMaskEmpty: "Wähle eine Maske aus, um Richtung, Intensität, Position und Größe der Unschärfe zu bearbeiten.",
      sourceTitle: "Quelle",
      strengthAria: "Unschärfestärke",
      strengthLabel: "Stärke",
      title: "Motion Blur Mask",
      toolEyebrow: "Tool",
      uniformMode: "Gleichmäßig",
      uploadDescription: "Lege ein lokales Bild hier ab oder wähle eine Datei, um mit der Bearbeitung zu starten.",
      uploadTitle: "Bild hochladen",
      widthLabel: "Breite",
      xLabel: "X",
      yLabel: "Y",
    },
  },
  ja: {
    common: {
      skipToContent: "本文へスキップ",
    },
    header: {
      appStore: "App Store",
      backToMenuAria: "メニューに戻る",
      closeMenuAria: "メニューを閉じる",
      homeAria: "ScreenCam ホーム",
      logoAlt: "ScreenCam ロゴ",
      menuAria: "メニューを開く",
      nav: {
        changelog: "変更履歴",
        docs: "ドキュメント",
        privacy: "プライバシー",
        support: "サポート",
        terms: "規約",
      },
      primaryNavigationAria: "メインナビゲーション",
    },
    footer: {
      appStoreButton: "App Store で見る",
      copyright: "All rights reserved.",
      ctaText: "Mac App Store から ScreenCam を入手。",
      ctaTitle: "もっときれいに録画する準備はできましたか？",
      description: "Mac のためのネイティブ画面録画。高速、軽量、パワフル。",
      groups: {
        legal: "法務",
        product: "製品",
        resources: "リソース",
      },
      language: "言語",
      legalLinks: {
        privacy: "プライバシー",
        terms: "規約",
      },
      productLinks: {
        controls: "コントロール",
        export: "書き出し",
        faq: "FAQ",
        zoom: "ズーム",
      },
      resourceLinks: {
        alternatives: "代替ツール",
        bgm: "BGM",
        changelog: "変更履歴",
        docs: "ドキュメント",
        motionBlurMask: "モーションブラー マスク",
        support: "サポート",
      },
      supportChannelsAria: "サポート窓口",
      systemStatus: "すべてのシステムは正常です",
    },
    meta: {
      changelog: {
        title: "変更履歴 - ScreenCam",
        description: "ScreenCam のリリースノート、製品改善、バグ修正、更新履歴を確認できます。",
      },
      docs: {
        title: "ドキュメント - ScreenCam",
        description: "チャプター付き動画とインタラクティブ再生で、ScreenCam の主要機能を学べます。",
      },
      home: {
        title: "ScreenCam - 指向性ズーム付きのネイティブ macOS 画面録画",
        description:
          "ScreenCam は、鮮明な録画、手動ズーム制御、タイムラインアンカー、カーブ調整、プレビュー通りの書き出しに対応したネイティブ macOS 画面録画アプリです。",
      },
      motionBlurMask: {
        title: "モーションブラー マスクツール - ScreenCam",
        description: "画像をアップロードし、矩形のモーションブラーマスクを描き、強度と方向を調整して合成結果を書き出します。",
      },
      privacy: {
        title: "プライバシーポリシー - ScreenCam",
        description:
          "ScreenCam のプライバシーポリシーでは、macOS アプリが録画、権限、任意の分析、購入、Web サイトデータをどう扱うかを説明します。",
      },
      support: {
        title: "サポート - ScreenCam",
        description: "ScreenCam for macOS のサポート連絡先、App Store 購入、要件、トラブルシューティングについて確認できます。",
      },
      terms: {
        title: "利用規約 - ScreenCam",
        description: "ScreenCam の利用規約では、アプリのライセンス、サブスクリプション、購入、サポート連絡先について説明します。",
      },
    },
    docs: {
      chaptersTitle: "手順",
      description:
        "流れを見て、必要な手順へすぐ移動。",
      emptyVideoDescription:
        "この機能のデモファイルを public/docs に置き、timeline JSON に動画パスと調整済みの時間を追加してください。",
      emptyVideoTitle: "動画は準備中です",
      eyebrow: "ドキュメント",
      featureListAria: "ドキュメントのトピック",
      playback: {
        next: "次の手順",
        pause: "一時停止",
        play: "再生",
        previous: "前の手順",
        restart: "最初から",
      },
      progressLabel: "進行状況",
      title: "ScreenCam ガイド。",
      videoAriaLabel: "ドキュメントのデモ動画",
      features: {
        basics: {
          title: "基本レイアウト",
          summary: "プレビュー、サイドバー、設定パネル、タイムライントラックの位置を確認します。",
          chapters: {
            preview: {
              title: "プレビュー",
              description: "現在の最終書き出し結果をリアルタイムで確認するための領域です。",
            },
            sidebar: {
              title: "サイドバー",
              description: "主要な設定はすべてここにあります。",
            },
            "screen-settings": {
              title: "画面設定",
              description: "壁紙、余白、サイズなど、画面内容に関する設定を行います。",
            },
            "device-settings": {
              title: "デバイス設定",
              description: "画面にデバイスフレームを付け、デバイスの選択や背景などのスタイルを調整します。",
            },
            "keyboard-settings": {
              title: "キー設定",
              description: "録画されたショートカットの表示スタイル、標準サイズ、位置を設定します。",
            },
            "beauty-settings": {
              title: "ビューティー設定",
              description: "カメラ録画を有効にした後、カメラ映像に控えめな人物補正を適用します。",
            },
            "mouse-settings": {
              title: "マウス設定",
              description: "マウスポインターの基本的な見た目を設定します。",
            },
            "animation-settings": {
              title: "アニメーション設定",
              description: "モーションブラーの強さやカスタムカーブを含む、カメラアニメーションを調整します。",
            },
            tracks: {
              title: "トラック",
              description: "録画、カメラ、システム音声、マイク、ズーム、キーボードがタイムラインクリップとして表示されます。",
            },
          },
        },
        "preview-control": {
          title: "プレビュー制御",
          summary: "編集中に、プレビューの再生速度、音量、タイムライントラックのズームを調整します。",
          chapters: {
            "playback-rate": {
              title: "再生速度",
              description:
                "ここでプレビューの再生速度を調整します。**プレビュー段階にのみ影響し、書き出しには影響しません。**",
            },
            volume: {
              title: "音量調整",
              description:
                "プレビュー中に聞こえる音量を調整します。**プレビュー段階にのみ影響し、書き出しには影響しません。**",
            },
            "track-zoom": {
              title: "トラックズーム",
              description: "タイムライントラックのズーム倍率を調整します。",
            },
          },
        },
        "track-management": {
          title: "トラック管理",
          summary: "トラック設定を開き、並べ替え、非表示、削除、削除済みトラックの復元を行います。",
          chapters: {
            entry: {
              title: "入口",
              description: "トラック左側からトラック設定パネルを開きます。",
            },
            sort: {
              title: "並べ替え",
              description:
                "先頭の {{icon:grip}} 並べ替えアイコンをドラッグして順序を変更します。この順序は設定として保存され、次回も使用されます。",
            },
            hide: {
              title: "非表示",
              description:
                "{{icon:eye}} アイコンをクリックして不要なトラックを非表示にします。**書き出しには影響しません。**",
            },
            delete: {
              title: "削除",
              description:
                "{{icon:trash}} アイコンをクリックして不要なトラックを削除します。**最終書き出しに影響します。**",
            },
            restore: {
              title: "復元",
              description: "削除済みトラックは下に別表示され、いつでもクリックして復元できます。",
            },
          },
        },
        "screen-settings": {
          title: "画面設定",
          summary: "録画された画面と、その周囲に表示される背景、余白、サイズの挙動を調整します。",
          chapters: {
            wallpaper: {
              title: "壁紙",
              description:
                "システムから読み込んだ壁紙を選択します。動的壁紙も含まれます。これらはアプリ本体には含まれないため容量を占有せず、最高品質の壁紙を使用できます。カスタムをクリックすると、設定で追加の壁紙フォルダを指定できます。",
            },
            "no-background": {
              title: "背景なし",
              description:
                "背景なしを選択できます。全画面録画や自分で範囲を選ぶ録画では特に重要です。**現在、壁紙なしへ切り替えた場合も以前の余白やサイズ設定が既定で残るため、黒い縁を消すには手動で 0 に調整する必要があります。**",
            },
            gradient: {
              title: "グラデーション",
              description:
                "プリセットの線形グラデーションを選択できます。アンカーや色は自由に編集でき、アンカーの追加や削除もできます。",
            },
            "solid-color": {
              title: "単色",
              description: "背景として単一の色を選択します。",
            },
            "custom-background": {
              title: "カスタム",
              description: "自分の写真や動画を背景としてアップロードします。",
            },
            "adaptive-size": {
              title: "画面サイズ自動調整",
              description:
                "このモードでは、上下または左右の余白を調整して画面サイズを制御します。",
            },
            "sync-margins": {
              title: "余白を同期",
              description:
                "余白同期をオンにすると 4 辺の余白を一致させます。オフにすると上下または左右を個別に制御できます。**画面比率機能を選んでいる場合、最終画面は視覚的にその比率へ合わせられるため、余白が設定値と違って見えることがあります。**",
            },
            "fixed-size": {
              title: "固定画面サイズ",
              description:
                "このモードでは画面サイズを手動で入力できます。**画面比率を選んでいる場合は、目標比率になるよう外側へ補われます。**",
            },
          },
        },
        "workspace-file": {
          title: "プロジェクトファイル",
          summary:
            "プロジェクトファイルには、録画完了時に生成される録画関連のすべての元ファイル、素材、設定が含まれます。共有にも使用でき、**録画完了時に自動作成されて既定の場所へ保存されます。**",
          chapters: {
            "default-directory": {
              title: "既定フォルダを変更",
              description:
                "<kbd>ScreenCam</kbd> > <kbd>設定</kbd> > <kbd>録画</kbd> > <kbd>デフォルトのワークスペースフォルダ</kbd> を開き、既定フォルダを選択します。",
            },
            "recent-projects": {
              title: "最近のプロジェクトをすばやく開く",
              description: "<kbd>ファイル</kbd> > <kbd>最近使った項目</kbd> から開きます。",
            },
            "default-directory-projects": {
              title: "既定場所のプロジェクトを開く",
              description: "<kbd>ファイル</kbd> > <kbd>デフォルトディレクトリ</kbd> から開きます。",
            },
            "show-in-finder": {
              title: "現在のファイルを Finder で表示",
              description:
                "エディタ上部のプロジェクトファイル名を直接クリックするか、<kbd>ファイル</kbd> > <kbd>Finder で表示</kbd> を使います。",
            },
            "manual-save": {
              title: "手動保存",
              description:
                "<kbd>ファイル</kbd> > <kbd>保存</kbd> をクリックするか、<kbd>⌘</kbd><kbd>S</kbd> を押して手動保存します。ほとんどの場合は自動保存されます。",
            },
            "save-as": {
              title: "別名で保存",
              description:
                "<kbd>ファイル</kbd> > <kbd>別名で保存</kbd> をクリックするか、<kbd>⌘</kbd><kbd>⇧</kbd><kbd>S</kbd> を押して、コピーを任意のフォルダに保存します。",
            },
          },
        },
        record: {
          title: "録画",
          summary: "キャプチャを設定し、ソースを選び、録画を開始します。",
          chapters: {
            "prepare-capture": {
              title: "キャプチャを準備",
              description: "ScreenCam を開き、録画コントロールが準備できていることを確認してからソースを選びます。",
            },
            "choose-source": {
              title: "ソースを選択",
              description: "ディスプレイ、ウィンドウ、範囲、カメラ、マイク、システム音声の録画オプションを選びます。",
            },
            "start-recording": {
              title: "録画を開始",
              description: "録画を開始し、録画状態を確認してからワークフローを進めます。",
            },
          },
        },
        zoom: {
          title: "ズーム",
          summary: "タイムラインアンカーを追加し、録画内でカメラがどう動くかを調整します。",
          chapters: {
            "zoom-track": {
              title: "Zoom トラック",
              description: "Zoom トラック上で、Zoom クリップを自由に作成・削除できます。",
            },
            "delete-clip": {
              title: "削除",
              description: "クリップを選択して Backspace または Delete を押すと削除できます。",
              descriptionHtml:
                'クリップを選択して <kbd class="docs-key">Backspace</kbd> または <kbd class="docs-key">Delete</kbd> を押すと削除できます。',
            },
            "create-clip": {
              title: "新規作成",
              description: "空白部分をクリックまたはドラッグして、新しい Zoom クリップを作成します。",
            },
            "merge-clips": {
              title: "結合",
              description: "クリップをリサイズするかドラッグして別のクリップと重ね、離すと結合を確認できます。",
            },
            "manual-mode": {
              title: "手動モード",
              description: "クリックイベントに基づく自動モーションから手動モードに切り替え、アンカー数、中心、倍率を自由に調整できます。",
            },
            "select-anchor": {
              title: "アンカーを選択",
              description: "アンカーを選択して、そのアンカーの Zoom 設定を編集します。",
            },
            "adjust-center": {
              title: "中心を調整",
              description: "プレビュー画面を直接ドラッグして、Zoom の視覚的な中心を調整します。",
            },
            "adjust-scale-wheel": {
              title: "倍率を調整",
              description: "プレビュー画面でマウスホイールを使い、拡大率を直接調整します。",
            },
            "adjust-scale-panel": {
              title: "パネルで倍率調整",
              description: "アンカーを選択したあと、右側の設定パネルにあるスライダーでも倍率を調整できます。",
            },
          },
        },
        camera: {
          title: "カメラ",
          summary: "カメラオーバーレイの形を整え、軽い見た目の調整を適用します。",
          chapters: {
            "enable-camera": {
              title: "カメラを有効化",
              description: "カメラレイヤーをオンにし、録画に合う位置へ配置します。",
            },
            "shape-frame": {
              title: "フレームを調整",
              description: "フレーム形状を切り替え、シーンに合わせてカメラオーバーレイのサイズを調整します。",
            },
            "apply-beauty": {
              title: "ビューティー効果を適用",
              description: "プレビューと最終書き出しが一致する状態で、控えめな外観設定を調整します。",
            },
          },
        },
        shortcuts: {
          title: "ショートカット",
          summary: "作業の流れを止めずに、キーボード操作で録画を制御します。",
          chapters: {
            "capture-shortcut": {
              title: "ショートカットで開始",
              description: "ツールバーに戻らず、キーボードから録画コントロールを実行します。",
            },
            "pause-resume": {
              title: "一時停止または再開",
              description: "長めの録画では、ショートカットで一時停止と再開を操作します。",
            },
            "finish-recording": {
              title: "録画を終了",
              description: "録画を停止し、文脈を保ったままエディタへ移動します。",
            },
          },
        },
        export: {
          title: "書き出し",
          summary: "結果を確認し、出力設定を選んで録画を書き出します。",
          chapters: {
            "choose-format": {
              title: "形式を選択",
              description: "出力先に合わせて書き出し形式と設定を選びます。",
            },
            "review-preview": {
              title: "プレビューを確認",
              description: "ファイルを書き出す前に、最終プレビューを確認します。",
            },
            "export-file": {
              title: "ファイルを書き出し",
              description: "録画をレンダリングし、書き出した結果を保存します。",
            },
          },
        },
      },
    },
    home: {
      screenStudioAlternative: {
        eyebrow: "Screen Studio の代替",
        title: "より軽く、手動調整もしやすい Mac 画面録画ツールが必要ですか？",
        description:
          "アプリサイズ、CPU とメモリ使用量、書き出し速度、手動ズームアンカー、レイヤー、デバイスモックアップ、書き出し形式で ScreenCam と Screen Studio を比較できます。",
        cta: "Mac 向け Screen Studio 代替を見る",
      },
      structuredDataFeatureList: ["ネイティブ macOS 画面録画", "手動ズームアンカー", "モーションブラー遷移", "プレビュー通りの書き出し"],
      hero: {
        appStoreButton: "App Store で見る",
        builtWithLabel: "構成",
        builtWithValue: "100% ネイティブ",
        systemLabel: "システム",
        systemValue: "macOS 15+",
        tagline: "高解像度で録画し、撮影後にカメラワークを調整できます。",
        titleLines: [
          ["鮮明に", "収録。"],
          ["フレームを", "導く。"],
        ],
      },
      zoom: {
        canvasLabels: {
          autoPlayingDemo: "自動再生デモ",
          playMarker: "再生",
          previewMarker: "プレビュー",
          recordingClip: "録画",
          recordingTrack: "録画",
          timelinePreview: "タイムラインプレビュー",
          zoomClip: "自動ズーム",
          zoomTrack: "ズーム",
        },
        features: [
          {
            title: "ダイナミックズーム",
            description: "カメラの動きは ScreenCam の書き出しと同じスプリングタイミングに従います。",
          },
          {
            title: "タイムラインプレビュー",
            description: "録画またはズームトラックにホバーして、正確なプレビューフレームをスクラブできます。",
          },
          {
            title: "モーションブラー",
            description: "ズーム、パン、クリック状態をシャッター風のブラーでサンプリングします。",
          },
        ],
        subtitle: "モーションブラー付きズーム。",
        timelineAria: "タイムラインプレビュートラック",
        title: "大事な部分にフォーカス。",
      },
      deviceMockups: {
        description: "美しいデバイスフレームで書き出し。iPhone、Mac、Studio Display に、あなたのコンテンツをきれいに表示します。",
        eyebrow: "書き出しオプション",
        formats: ["元の解像度", "Live Photo", "MP4 / MOV"],
        imageAlt: {
          iPhone: "iPhone 17 Pro Max",
          macBook: "MacBook Pro 上で動作する ScreenCam アプリ",
          studioDisplay: "Studio Display と MacBook 上で動作する ScreenCam",
        },
        title: "どの画面でも美しく。",
      },
      controls: {
        body: "手動モードでは創作の自由度が広がります。1 つのズームクリップに複数のアンカーを追加し、それぞれに倍率と中心点を設定できます。",
        centerLabel: "中心",
        dragCenter: "ドラッグして中心を調整",
        eyebrow: "高度なコントロール",
        features: ["アンカーをドラッグしてタイムライン上で移動", "アンカーごとに 1x から 5x の倍率を調整", "各ズームの焦点中心をカスタム設定", "アンカー間を滑らかに遷移"],
        pauseAria: "モックタイムライン再生を一時停止",
        pauseTitle: "一時停止",
        playAria: "モックタイムラインを再生",
        playTitle: "再生",
        scaleAria: "倍率",
        scaleLabel: "倍率",
        titleMuted: "すべてのズームポイント。",
        titleStart: "完全にコントロール",
      },
      performance: {
        cta: "ベンチマークデータを見る",
        metrics: {
          appSize: "アプリサイズ",
          appSizeNote: "約 20MB vs 600MB",
          cpuUsage: "CPU 使用率",
          exportTime: "書き出し時間",
          exportTimeNote: "短いほど高速",
          memory: "メモリ",
          others: "その他",
          screenCam: "ScreenCam",
        },
        subtitle: "Electron なし。WebView なし。純粋なネイティブ性能。",
        title: "ネイティブだから速い。",
      },
      featureCards: {
        eyebrow: "その他の機能",
        title: "録画の細部まで、実用向けに磨き込み。",
        subtitle: "Mac らしいネイティブ体験で、日常の録画フローをもっと軽快にします。",
        beautyThumb: {
          beforeLabel: "美肌補正オフ",
          afterLabel: "美肌補正オン",
          disclosure: "AI 生成の人物画像を、実際の美肌補正効果のデモにのみ使用しています。",
          enterFloatingAria: "カメラをフローティング表示に切り替え",
          exitFloatingAria: "カメラを全体プレビューに戻す",
          pauseAria: "美肌補正の比較デモを一時停止",
          playAria: "美肌補正の比較デモを再生",
          shapeCycleAria: "フローティング表示の形状を切り替え",
          shapeLabels: {
            circle: "円形",
            square: "角丸正方形",
            wide: "16:9",
          },
        },
        dynamicIslandThumb: {
          ariaLabel: "Dynamic Island のバックグラウンドタスクプレビュー",
          materialLabel: "ノッチのマテリアル",
          modeLabels: {
            black: "ブラック",
            glass: "Glass",
          },
          tasks: [
            {
              title: "ScreenCam ローンチ映像",
              detail: "完了済み。Finder で確認できます。",
              primaryAction: "Finder を開く",
              secondary: "完了",
              secondaryAction: "閉じる",
              size: "384 MB",
            },
            {
              title: "4K チュートリアル書き出し",
              detail: "カメラとカーソルレイヤー込みで H.265 にエンコード中。",
              primaryAction: "Finder を開く",
              secondary: "残り 2 分",
              secondaryAction: "閉じる",
              size: "1.2 GB",
            },
            {
              title: "GIF プレビュー圧縮",
              detail: "共有しやすい小さなクリップ向けにフレームを最適化中。",
              primaryAction: "Finder を開く",
              secondary: "残り 42 秒",
              secondaryAction: "閉じる",
              size: "18 MB",
            },
          ],
          wallpaperButtonAria: "壁紙を変更",
        },
        effectLayersThumb: {
          ariaLabel: "エフェクトレイヤーのタイムラインプレビュー",
          dragHint: "トラックへドラッグして追加",
          effects: [
            {
              id: "mosaic",
              title: "モザイク",
              description: "録画上の隠したい範囲をピクセル化します。",
              clipLabel: "モザイク",
            },
            {
              id: "focus",
              title: "フォーカス",
              description: "文脈を残したまま、重要な範囲を強調します。",
              clipLabel: "フォーカス",
            },
            {
              id: "text",
              title: "テキスト",
              description: "編集内の任意の位置にテキストレイヤーを追加します。",
              clipLabel: "テキスト",
            },
            {
              id: "image",
              title: "画像",
              description: "画像オーバーレイを時間指定のレイヤーとして配置します。",
              clipLabel: "画像",
            },
          ],
        },
        glassThumb: {
          modeLabels: {
            clear: "クリア",
            regular: "通常",
          },
          toolbarItems: {
            area: "範囲",
            camera: "カメラ",
            close: "ScreenCam を隠す",
            display: "画面",
            iphone: "iPhone",
            keyboard: "キーボード操作を録画",
            microphone: "マイク",
            settings: "設定",
            systemAudio: "システム音声を録音",
            window: "ウィンドウ",
            workspace: "ワークスペースを開く",
          },
          wallpaperButtonAria: "壁紙を変更",
        },
        items: [
          {
            title: "Liquid Glass",
            caption: "ネイティブの glass マテリアルに対応し、操作面をクリアで macOS らしく保ちます。",
          },
          {
            title: "ショートカット表示",
            caption: "録画中のキーボードショートカット操作を記録し、動画内にわかりやすく表示します。",
          },
          {
            title: "軽い美肌補正",
            caption: "カメラ映像を自然にすっきり見せます。",
          },
          {
            title: "Dynamic Island",
            caption: "長い書き出しをバックグラウンドに回し、ノッチから進行状況を確認できます。",
          },
          {
            title: "エフェクトレイヤー",
            caption: "必要なだけエフェクトレイヤーを追加し、タイムライン上で各 clip を移動・リサイズ・重ね合わせできます。",
          },
        ],
      },
      faq: {
        eyebrow: "FAQ",
        title: "よくある質問",
        items: [
          {
            question: "ScreenCam はブラウザベースの録画ツールと何が違いますか？",
            answer:
              "ScreenCam は macOS 向けのネイティブ録画・編集アプリです。ローカル録画、滑らかな編集操作、プレビュー通りの書き出しを備えた、Mac 優先のコンパクトなワークフローを目指しています。",
          },
          {
            question: "必要な macOS の最小バージョンは？",
            answer: "ScreenCam には macOS 15 以降が必要です。",
          },
          {
            question: "Windows 版はありますか？",
            answer: "現在はありません。ScreenCam は macOS に集中しており、短期的に Windows 版を開発する予定はありません。",
          },
          {
            question: "異なる形式で書き出せますか？",
            answer: "ScreenCam は、エディタ上のフレーミングとモーション制御を最終出力に反映する高品質な動画書き出しを想定しています。",
          },
          {
            question: "ズーム機能はどのように動作しますか？",
            answer:
              "タイムライン上の任意の位置にズームポイントを追加できます。手動モードでは、異なるズームレベルと焦点中心を持つ複数のアンカーを設定でき、滑らかなモーションブラー遷移も含まれます。",
          },
          {
            question: "複数モニターに対応していますか？",
            answer: "ScreenCam は、接続されたディスプレイ、ウィンドウ、録画範囲を含む Mac の画面録画ワークフロー向けに作られています。",
          },
        ],
      },
    },
    legal: {
      privacy: {
        eyebrow: "プライバシー",
        title: "プライバシーポリシー",
        updated: "最終更新日: 2026年6月3日",
        sections: [
          {
            title: "概要",
            paragraphs: [
              [
                "ScreenCam はネイティブ macOS 画面録画・編集アプリです。録画は Mac 上でローカルに処理されるよう設計されています。ScreenCam は、App Store の購入状態などのアプリ機能や、あなたが有効にした場合の任意の匿名使用分析のために、ネットワークリクエストを行うことがあります。アプリ内で広告トラッカーは使用しません。",
              ],
            ],
          },
          {
            title: "録画とローカルファイル",
            paragraphs: [
              [
                "画面録画、カメラ映像、マイク音声、システム音声、カーソルデータ、書き出した動画、ワークスペースファイル、カスタム壁紙ファイルは、あなたのデバイスまたは選択した場所に残ります。ScreenCam はこれらの内容を ScreenCam サーバーへアップロードしません。",
              ],
            ],
          },
          {
            title: "匿名使用分析",
            paragraphs: [
              [
                "ScreenCam は、録画・編集機能の改善のため、匿名使用分析を共有するか尋ねることがあります。分析共有はアプリ内でいつでもオンまたはオフにできます。無効にした場合、ScreenCam は使用分析を送信しません。",
              ],
              [
                "分析は、機能操作、アプリバージョン、macOS バージョン、一般的なデバイス情報など、製品利用、診断、パフォーマンス情報に限定されます。分析を通じて画面内容、音声、カメラ映像、プロジェクトファイル、ファイル名、入力テキストを収集することはありません。",
              ],
            ],
          },
          {
            title: "権限",
            paragraphs: [
              [
                "ScreenCam は、画面録画、マイク、カメラ、ファイルアクセスの macOS 権限を求めることがあります。これらの権限は、録画、編集、書き出し、ユーザーが選択したファイル機能の提供にのみ使用されます。権限はシステム設定で管理できます。",
              ],
            ],
          },
          {
            title: "購入",
            paragraphs: [
              [
                "ScreenCam Pro のサブスクリプションと購入は、Apple が Mac App Store を通じて処理します。ScreenCam は StoreKit から購入・サブスクリプション状態を読み取り、Pro 機能を有効にします。ScreenCam が支払いカード情報を受け取ったり保存したりすることはありません。",
              ],
            ],
          },
          {
            title: "Web サイト",
            paragraphs: [
              [
                "thescreen.cam にアクセスすると、ホスティングおよびインフラ提供者が、IP アドレス、ブラウザ user agent、リクエスト URL、リクエスト時刻などの標準サーバーログデータを、セキュリティ、診断、Web サイト配信のために処理することがあります。この Web サイトは広告トラッカーを使用しません。",
              ],
            ],
          },
          {
            title: "変更とお問い合わせ",
            paragraphs: [["ScreenCam の変更に伴い、このポリシーを更新することがあります。プライバシーに関する質問は ", emailLink, " までご連絡ください。"]],
          },
        ],
      },
      support: {
        eyebrow: "サポート",
        title: "ScreenCam サポート",
        updated: "ScreenCam for macOS のヘルプ。",
        supportChannelsAria: "サポート窓口",
        sections: [
          {
            title: "お問い合わせ",
            showSupportChannels: true,
            paragraphs: [["製品サポート、バグ報告、購入に関する質問、フィードバックは ", emailLink, " までメールしてください。"]],
          },
          {
            title: "含めてほしい情報",
            paragraphs: [
              [
                "問題を報告する際は、macOS バージョン、ScreenCam バージョン、Mac モデル、録画設定、書き出し形式、起きたことの短い説明を含めてください。視覚的な問題では、スクリーンショットや短い録画が役立ちます。",
              ],
            ],
          },
          {
            title: "App Store 購入",
            paragraphs: [
              [
                "ScreenCam は Mac App Store を通じて配布されます。請求、サブスクリプション、更新、キャンセル、返金は、Apple ID と App Store アカウント設定を通じて Apple が処理します。",
              ],
            ],
          },
          {
            title: "要件",
            paragraphs: [["ScreenCam は現在 macOS 向けに作られています。Windows 版はなく、短期的に Windows 版を開発する予定もありません。"]],
          },
          {
            title: "プライバシー",
            paragraphs: [["録画とワークスペースファイルは Mac 上でローカルに処理されます。詳しくは ", { href: "/privacy", text: "プライバシーポリシー" }, " をお読みください。"]],
          },
        ],
      },
      terms: {
        eyebrow: "規約",
        title: "利用規約",
        updated: "最終更新日: 2026年5月20日",
        sections: [
          {
            title: "アプリライセンス",
            paragraphs: [
              [
                "適用法で別途求められる場合を除き、ScreenCam は Apple の Standard End User License Agreement (EULA) に基づいてあなたにライセンスされます。Apple の標準 EULA は ",
                appleEulaLink,
                " で確認できます。",
              ],
            ],
          },
          {
            title: "サブスクリプションと購入",
            paragraphs: [
              [
                "ScreenCam Pro のサブスクリプションと購入は、Apple が Mac App Store を通じて処理します。サブスクリプションの請求、更新、キャンセル、返金、アカウント管理は、Apple ID と App Store アカウント設定を通じて行われます。",
              ],
            ],
          },
          {
            title: "ScreenCam の使用",
            paragraphs: [["ScreenCam で作成する録画、ファイル、書き出し結果についてはあなたが責任を負います。必要な権利と許可がある場合にのみ、コンテンツを録画、編集、共有してください。"]],
          },
          {
            title: "プライバシー",
            paragraphs: [["ScreenCam のプライバシー慣行は ", { href: "/privacy", text: "プライバシーポリシー" }, " に記載されています。"]],
          },
          {
            title: "お問い合わせ",
            paragraphs: [["この規約について質問がある場合は ", emailLink, " までご連絡ください。"]],
          },
        ],
      },
    },
    changelog: {
      description: "製品アップデート、修正、リリースノート。",
      eyebrow: "変更履歴",
      intro: "製品アップデート、修正、リリースノート。",
      linkVersionLabel: "バージョンへのリンク",
      title: "ScreenCam 変更履歴",
    },
    motionBlurTool: {
      addMaskAria: "マスクを追加",
      addMaskButton: "マスク",
      angleAria: "ブラー角度",
      angleLabel: "角度",
      blurSettingsTitle: "ブラー設定",
      chooseImage: "画像を選択",
      clearImage: "画像をクリア",
      defaultMaskName: "マスク",
      deleteSelectedMaskAria: "選択中のマスクを削除",
      description: "矩形のブラー領域を作成し、方向と強度を調整して合成画像を書き出します。",
      emptyMasksWithImage: "画像の一部をぼかすにはマスクを追加してください。",
      emptyMasksWithoutImage: "まず画像をアップロードしてください。",
      exportButton: "書き出し",
      heightLabel: "高さ",
      linearMode: "リニア",
      maskButton: "マスク",
      masksTitle: "マスク",
      modeLabel: "モード",
      nameLabel: "名前",
      previewAria: "モーションブラープレビュー",
      replaceImageAria: "画像を置き換え",
      selectedMaskEmpty: "マスクを選択して、ブラーの方向、強度、位置、サイズを編集します。",
      sourceTitle: "ソース",
      strengthAria: "ブラー強度",
      strengthLabel: "強度",
      title: "モーションブラー マスク",
      toolEyebrow: "ツール",
      uniformMode: "均一",
      uploadDescription: "ローカル画像をここにドロップするか、ファイルを選んで編集を開始します。",
      uploadTitle: "画像をアップロード",
      widthLabel: "幅",
      xLabel: "X",
      yLabel: "Y",
    },
  },
  ko: {
    common: {
      skipToContent: "본문으로 건너뛰기",
    },
    header: {
      appStore: "App Store",
      backToMenuAria: "메뉴로 돌아가기",
      closeMenuAria: "메뉴 닫기",
      homeAria: "ScreenCam 홈",
      logoAlt: "ScreenCam 로고",
      menuAria: "메뉴 열기",
      nav: {
        changelog: "변경 내역",
        docs: "문서",
        privacy: "개인정보",
        support: "지원",
        terms: "약관",
      },
      primaryNavigationAria: "기본 내비게이션",
    },
    footer: {
      appStoreButton: "App Store에서 보기",
      copyright: "All rights reserved.",
      ctaText: "Mac App Store에서 ScreenCam을 받으세요.",
      ctaTitle: "더 좋은 캡처를 시작할까요?",
      description: "Mac용 네이티브 화면 녹화. 빠르고 가볍고 강력합니다.",
      groups: {
        legal: "법적 고지",
        product: "제품",
        resources: "리소스",
      },
      language: "언어",
      legalLinks: {
        privacy: "개인정보",
        terms: "약관",
      },
      productLinks: {
        controls: "컨트롤",
        export: "내보내기",
        faq: "FAQ",
        zoom: "줌",
      },
      resourceLinks: {
        alternatives: "대안",
        bgm: "BGM",
        changelog: "변경 내역",
        docs: "문서",
        motionBlurMask: "모션 블러 마스크",
        support: "지원",
      },
      supportChannelsAria: "지원 채널",
      systemStatus: "모든 시스템 정상 작동 중",
    },
    meta: {
      changelog: {
        title: "변경 내역 - ScreenCam",
        description: "ScreenCam 릴리스 노트, 제품 개선, 버그 수정, 업데이트 기록을 확인하세요.",
      },
      docs: {
        title: "문서 - ScreenCam",
        description: "챕터가 있는 동영상 안내와 인터랙티브 재생으로 ScreenCam의 핵심 기능을 익히세요.",
      },
      home: {
        title: "ScreenCam - 방향성 줌을 갖춘 네이티브 macOS 화면 녹화",
        description:
          "ScreenCam은 선명한 캡처, 수동 줌 제어, 타임라인 앵커, 곡선 조정, 미리보기와 일치하는 내보내기를 위한 네이티브 macOS 화면 녹화 앱입니다.",
      },
      motionBlurMask: {
        title: "모션 블러 마스크 도구 - ScreenCam",
        description: "이미지를 업로드하고 직사각형 모션 블러 마스크를 그린 뒤 강도와 방향을 조정하여 합성 결과를 내보내세요.",
      },
      privacy: {
        title: "개인정보 처리방침 - ScreenCam",
        description:
          "ScreenCam 개인정보 처리방침은 macOS 앱이 녹화, 권한, 선택적 분석, 구매, 웹사이트 데이터를 어떻게 처리하는지 설명합니다.",
      },
      support: {
        title: "지원 - ScreenCam",
        description: "ScreenCam for macOS 도움말, 지원 연락처, App Store 구매, 요구 사항, 문제 해결 정보를 확인하세요.",
      },
      terms: {
        title: "이용 약관 - ScreenCam",
        description: "ScreenCam 이용 약관은 앱 라이선스, 구독, 구매, 지원 연락처 정보를 설명합니다.",
      },
    },
    docs: {
      chaptersTitle: "단계",
      description:
        "흐름을 보고, 필요한 단계로 바로 이동하세요.",
      emptyVideoDescription:
        "이 기능의 데모 파일을 public/docs에 넣은 뒤 timeline JSON에 영상 경로와 보정된 타임스탬프를 추가하세요.",
      emptyVideoTitle: "동영상 준비 중",
      eyebrow: "문서",
      featureListAria: "문서 주제",
      playback: {
        next: "다음 단계",
        pause: "일시 정지",
        play: "재생",
        previous: "이전 단계",
        restart: "처음부터",
      },
      progressLabel: "진행률",
      title: "ScreenCam 가이드.",
      videoAriaLabel: "문서 데모 동영상",
      features: {
        basics: {
          title: "기본 레이아웃",
          summary: "미리보기, 사이드바, 설정 패널, 타임라인 트랙의 위치를 익힙니다.",
          chapters: {
            preview: {
              title: "미리보기",
              description: "현재 최종 내보내기 결과를 실시간으로 확인하는 영역입니다.",
            },
            sidebar: {
              title: "사이드바",
              description: "주요 설정은 모두 이곳에 있습니다.",
            },
            "screen-settings": {
              title: "화면 설정",
              description: "배경화면, 여백, 크기 등 화면 콘텐츠 관련 설정을 조정합니다.",
            },
            "device-settings": {
              title: "기기 설정",
              description: "화면에 기기 프레임을 씌우고 기기 선택과 배경 같은 스타일을 설정합니다.",
            },
            "keyboard-settings": {
              title: "키 설정",
              description: "녹화된 단축키의 표시 스타일, 기본 크기와 위치를 설정합니다.",
            },
            "beauty-settings": {
              title: "뷰티 설정",
              description: "카메라 녹화를 켠 뒤 카메라 화면에 가벼운 인물 보정을 적용합니다.",
            },
            "mouse-settings": {
              title: "마우스 설정",
              description: "마우스 포인터의 기본 시각 스타일을 설정합니다.",
            },
            "animation-settings": {
              title: "애니메이션 설정",
              description: "모션 블러 강도와 사용자 지정 곡선을 포함해 카메라 애니메이션을 조정합니다.",
            },
            tracks: {
              title: "트랙",
              description: "녹화, 카메라, 시스템 오디오, 마이크, 줌, 키보드가 타임라인 클립 형태로 표시됩니다.",
            },
          },
        },
        "preview-control": {
          title: "미리보기 컨트롤",
          summary: "편집 중 미리보기 재생 속도, 미리보기 음량, 타임라인 트랙 줌을 조정합니다.",
          chapters: {
            "playback-rate": {
              title: "재생 속도",
              description:
                "여기에서 미리보기 재생 속도를 조정합니다. **미리보기 단계에만 영향을 주며 내보내기에는 영향을 주지 않습니다.**",
            },
            volume: {
              title: "음량 조정",
              description:
                "미리보기 중 들리는 소리를 조정합니다. **미리보기 단계에만 영향을 주며 내보내기에는 영향을 주지 않습니다.**",
            },
            "track-zoom": {
              title: "트랙 줌",
              description: "타임라인 트랙의 줌 비율을 조정합니다.",
            },
          },
        },
        "track-management": {
          title: "트랙 관리",
          summary: "트랙 설정을 열고, 순서를 바꾸고, 숨기고, 삭제하고, 삭제한 트랙을 복원합니다.",
          chapters: {
            entry: {
              title: "입구",
              description: "트랙 왼쪽에서 트랙 설정 패널을 엽니다.",
            },
            sort: {
              title: "정렬",
              description:
                "앞쪽의 {{icon:grip}} 정렬 아이콘을 드래그해 순서를 바꿉니다. 이 순서는 환경설정으로 저장되어 다음에도 사용됩니다.",
            },
            hide: {
              title: "숨기기",
              description:
                "{{icon:eye}} 아이콘을 클릭해 필요 없는 트랙을 숨깁니다. **내보내기에는 영향을 주지 않습니다.**",
            },
            delete: {
              title: "삭제",
              description:
                "{{icon:trash}} 아이콘을 클릭해 필요 없는 트랙을 삭제합니다. **최종 내보내기에 영향을 줍니다.**",
            },
            restore: {
              title: "복원",
              description: "삭제된 트랙은 아래에 따로 표시되며 언제든 클릭해 복원할 수 있습니다.",
            },
          },
        },
        "screen-settings": {
          title: "화면 설정",
          summary: "녹화된 화면과 화면 주변의 배경, 여백, 크기 동작을 조정합니다.",
          chapters: {
            wallpaper: {
              title: "배경화면",
              description:
                "시스템에서 읽어 온 배경화면을 선택합니다. 동적 배경화면도 포함됩니다. 이 파일들은 앱 설치 패키지에 포함되지 않아 용량을 차지하지 않고, 가장 높은 배경화면 품질을 유지합니다. 사용자 지정을 클릭하면 설정에서 더 많은 배경화면 폴더를 구성할 수 있습니다.",
            },
            "no-background": {
              title: "배경 없음",
              description:
                "배경을 없앨 수 있습니다. 전체 화면 녹화나 직접 선택한 영역 녹화에서 특히 중요합니다. **현재 기본적으로 배경화면 없음으로 전환해도 이전 여백 또는 크기 설정이 유지되므로, 검은 테두리를 없애려면 수동으로 0으로 조정해야 합니다.**",
            },
            gradient: {
              title: "그라데이션",
              description:
                "미리 준비된 선형 그라데이션을 선택하거나, 그라데이션 앵커와 색상을 자유롭게 편집하고 앵커를 추가하거나 삭제할 수 있습니다.",
            },
            "solid-color": {
              title: "단색",
              description: "단일 색상을 배경으로 선택합니다.",
            },
            "custom-background": {
              title: "사용자 지정",
              description: "직접 준비한 사진이나 동영상을 배경으로 업로드합니다.",
            },
            "adaptive-size": {
              title: "화면 크기 자동 맞춤",
              description:
                "이 모드에서는 위/아래 또는 좌/우 여백을 조정해 화면 크기를 제어합니다.",
            },
            "sync-margins": {
              title: "여백 동기화",
              description:
                "여백 동기화를 켜면 네 방향 여백이 같게 유지됩니다. 끄면 위/아래 또는 좌/우를 따로 제어할 수 있습니다. **화면 비율 기능을 선택한 경우 최종 화면이 시각적으로 그 비율에 맞춰지므로 여백이 입력한 값과 다르게 보일 수 있습니다.**",
            },
            "fixed-size": {
              title: "고정 화면 크기",
              description:
                "이 모드에서는 화면 크기를 직접 입력할 수 있습니다. **화면 비율을 선택한 경우 목표 비율에 맞도록 바깥쪽으로 보충됩니다.**",
            },
          },
        },
        "workspace-file": {
          title: "프로젝트 파일",
          summary:
            "프로젝트 파일은 녹화가 완료될 때 생성되는 모든 녹화 관련 원본 파일이며, 모든 소재와 설정을 포함합니다. 공유에도 사용할 수 있고, **녹화가 완료되면 자동으로 생성되어 기본 위치에 저장됩니다.**",
          chapters: {
            "default-directory": {
              title: "기본 디렉터리 변경",
              description:
                "<kbd>ScreenCam</kbd> > <kbd>설정</kbd> > <kbd>녹화</kbd> > <kbd>기본 작업 공간 디렉터리</kbd>를 열고 기본 폴더를 선택합니다.",
            },
            "recent-projects": {
              title: "최근 프로젝트 빠르게 열기",
              description: "<kbd>파일</kbd> > <kbd>최근 항목</kbd>에서 엽니다.",
            },
            "default-directory-projects": {
              title: "기본 위치의 프로젝트 열기",
              description: "<kbd>파일</kbd> > <kbd>기본 디렉터리</kbd>에서 엽니다.",
            },
            "show-in-finder": {
              title: "현재 파일을 Finder에서 보기",
              description:
                "에디터 상단의 프로젝트 파일 이름을 직접 클릭하거나 <kbd>파일</kbd> > <kbd>Finder에서 보기</kbd>를 사용합니다.",
            },
            "manual-save": {
              title: "수동 저장",
              description:
                "<kbd>파일</kbd> > <kbd>저장</kbd>을 클릭하거나 <kbd>⌘</kbd><kbd>S</kbd> 단축키로 수동 저장할 수 있습니다. 대부분의 경우 자동 저장됩니다.",
            },
            "save-as": {
              title: "다른 이름으로 저장",
              description:
                "<kbd>파일</kbd> > <kbd>다른 이름으로 저장</kbd>을 클릭하거나 <kbd>⌘</kbd><kbd>⇧</kbd><kbd>S</kbd> 단축키로 복사본을 원하는 폴더에 저장합니다.",
            },
          },
        },
        record: {
          title: "녹화",
          summary: "캡처를 설정하고 소스를 선택한 뒤 녹화를 시작합니다.",
          chapters: {
            "prepare-capture": {
              title: "캡처 준비",
              description: "ScreenCam을 열고 녹화 컨트롤이 준비되었는지 확인한 뒤 소스를 선택합니다.",
            },
            "choose-source": {
              title: "소스 선택",
              description: "디스플레이, 창, 영역, 카메라, 마이크, 시스템 오디오 옵션을 선택합니다.",
            },
            "start-recording": {
              title: "녹화 시작",
              description: "녹화를 시작하고 녹화 상태를 확인한 뒤 다음 흐름으로 이동합니다.",
            },
          },
        },
        zoom: {
          title: "줌",
          summary: "타임라인 앵커를 추가하고 녹화 안에서 카메라 움직임을 조정합니다.",
          chapters: {
            "zoom-track": {
              title: "Zoom 트랙",
              description: "Zoom 트랙에서 zoom 클립을 자유롭게 만들고 삭제할 수 있습니다.",
            },
            "delete-clip": {
              title: "삭제",
              description: "클립을 선택한 뒤 Backspace 또는 Delete를 눌러 삭제합니다.",
              descriptionHtml:
                '클립을 선택한 뒤 <kbd class="docs-key">Backspace</kbd> 또는 <kbd class="docs-key">Delete</kbd>를 눌러 삭제합니다.',
            },
            "create-clip": {
              title: "새로 만들기",
              description: "빈 영역을 클릭하거나 드래그해서 새 zoom 클립을 만듭니다.",
            },
            "merge-clips": {
              title: "병합",
              description: "클립을 리사이즈하거나 다른 클립과 겹치도록 드래그한 뒤 놓으면 병합을 확인할 수 있습니다.",
            },
            "manual-mode": {
              title: "수동 모드",
              description: "클릭 이벤트 기반 자동 모션에서 수동 모드로 전환하고 앵커 수, 중심, 확대 비율을 자유롭게 조정합니다.",
            },
            "select-anchor": {
              title: "앵커 선택",
              description: "앵커를 선택해 해당 앵커의 zoom 설정을 편집합니다.",
            },
            "adjust-center": {
              title: "중심 조정",
              description: "미리보기 화면을 직접 드래그해서 zoom의 시각적 중심을 조정합니다.",
            },
            "adjust-scale-wheel": {
              title: "배율 조정",
              description: "미리보기 화면에서 마우스 휠로 확대 비율을 직접 조정합니다.",
            },
            "adjust-scale-panel": {
              title: "패널에서 배율 조정",
              description: "앵커를 선택한 뒤 오른쪽 설정 패널의 슬라이더로도 배율을 조정할 수 있습니다.",
            },
          },
        },
        camera: {
          title: "카메라",
          summary: "카메라 오버레이 모양을 조정하고 가벼운 외형 효과를 적용합니다.",
          chapters: {
            "enable-camera": {
              title: "카메라 켜기",
              description: "카메라 레이어를 켜고 녹화에 어울리는 위치에 배치합니다.",
            },
            "shape-frame": {
              title: "프레임 조정",
              description: "프레임 모양을 전환하고 장면에 맞게 카메라 오버레이 크기를 조정합니다.",
            },
            "apply-beauty": {
              title: "뷰티 효과 적용",
              description: "미리보기와 최종 내보내기가 일치하는 상태에서 섬세한 외형 설정을 조정합니다.",
            },
          },
        },
        shortcuts: {
          title: "단축키",
          summary: "작업 흐름을 끊지 않고 키보드 동작으로 캡처를 제어합니다.",
          chapters: {
            "capture-shortcut": {
              title: "단축키로 시작",
              description: "도구 막대로 이동하지 않고 키보드로 녹화 컨트롤을 실행합니다.",
            },
            "pause-resume": {
              title: "일시 정지 또는 재개",
              description: "긴 녹화 중에는 단축키로 캡처를 멈추고 다시 이어갑니다.",
            },
            "finish-recording": {
              title: "녹화 마무리",
              description: "녹화를 중지하고 흐름을 유지한 채 편집기로 이동합니다.",
            },
          },
        },
        export: {
          title: "내보내기",
          summary: "결과를 확인하고 출력 설정을 선택한 뒤 녹화를 내보냅니다.",
          chapters: {
            "choose-format": {
              title: "형식 선택",
              description: "대상에 맞는 내보내기 형식과 출력 설정을 선택합니다.",
            },
            "review-preview": {
              title: "미리보기 확인",
              description: "파일을 렌더링하기 전에 최종 미리보기를 확인합니다.",
            },
            "export-file": {
              title: "파일 내보내기",
              description: "녹화를 렌더링하고 내보낸 결과를 저장합니다.",
            },
          },
        },
      },
    },
    home: {
      screenStudioAlternative: {
        eyebrow: "Screen Studio 대안",
        title: "더 가볍고 수동 제어가 깊은 Mac 화면 녹화 도구가 필요하신가요?",
        description:
          "앱 크기, CPU 및 메모리 사용량, 내보내기 속도, 수동 줌 앵커, 레이어, 기기 목업, 내보내기 형식으로 ScreenCam과 Screen Studio를 비교하세요.",
        cta: "Mac용 Screen Studio 대안 보기",
      },
      structuredDataFeatureList: ["네이티브 macOS 화면 녹화", "수동 줌 앵커", "모션 블러 전환", "미리보기와 일치하는 내보내기"],
      hero: {
        appStoreButton: "App Store에서 보기",
        builtWithLabel: "제작 방식",
        builtWithValue: "100% 네이티브",
        systemLabel: "시스템",
        systemValue: "macOS 15+",
        tagline: "고해상도로 녹화하고, 촬영 후 카메라 움직임을 원하는 대로 다듬으세요.",
        titleLines: [
          ["선명하게", "녹화."],
          ["프레임을", "이끌기."],
        ],
      },
      zoom: {
        canvasLabels: {
          autoPlayingDemo: "자동 재생 데모",
          playMarker: "재생",
          previewMarker: "미리보기",
          recordingClip: "녹화",
          recordingTrack: "녹화",
          timelinePreview: "타임라인 미리보기",
          zoomClip: "자동 줌",
          zoomTrack: "줌",
        },
        features: [
          {
            title: "다이내믹 줌",
            description: "카메라 움직임은 ScreenCam 내보내기에 사용되는 동일한 스프링 타이밍을 따릅니다.",
          },
          {
            title: "타임라인 미리보기",
            description: "녹화 또는 줌 트랙에 마우스를 올려 정확한 미리보기 프레임을 스크럽하세요.",
          },
          {
            title: "모션 블러",
            description: "줌, 팬, 클릭 상태를 셔터 느낌의 블러로 샘플링합니다.",
          },
        ],
        subtitle: "모션 블러가 있는 줌.",
        timelineAria: "타임라인 미리보기 트랙",
        title: "중요한 부분에 집중하세요.",
      },
      deviceMockups: {
        description: "멋진 기기 프레임으로 내보내세요. iPhone, Mac, Studio Display에서 콘텐츠를 완성도 있게 보여줍니다.",
        eyebrow: "내보내기 옵션",
        formats: ["원본 해상도", "Live Photo", "MP4 / MOV"],
        imageAlt: {
          iPhone: "iPhone 17 Pro Max",
          macBook: "MacBook Pro에서 실행 중인 ScreenCam 앱",
          studioDisplay: "Studio Display와 MacBook에서 실행 중인 ScreenCam",
        },
        title: "모든 화면에서 아름답게.",
      },
      controls: {
        body: "수동 모드는 완전한 창작 자유를 제공합니다. 하나의 줌 클립에 여러 앵커를 추가하고, 각 앵커마다 배율과 중심점을 설정하세요.",
        centerLabel: "중심",
        dragCenter: "드래그해 중심 조정",
        eyebrow: "고급 컨트롤",
        features: ["앵커를 드래그해 타임라인 위치 변경", "앵커별 1x에서 5x까지 배율 조정", "각 줌의 사용자 지정 초점 중심 설정", "앵커 사이의 부드러운 전환"],
        pauseAria: "모의 타임라인 재생 일시정지",
        pauseTitle: "일시정지",
        playAria: "모의 타임라인 재생",
        playTitle: "재생",
        scaleAria: "배율",
        scaleLabel: "배율",
        titleMuted: "모든 줌 포인트.",
        titleStart: "완전한 제어",
      },
      performance: {
        cta: "전체 벤치마크 데이터 보기",
        metrics: {
          appSize: "앱 크기",
          appSizeNote: "약 20MB vs 600MB",
          cpuUsage: "CPU 사용량",
          exportTime: "내보내기 시간",
          exportTimeNote: "짧을수록 빠름",
          memory: "메모리",
          others: "기타",
          screenCam: "ScreenCam",
        },
        subtitle: "Electron 없음. WebView 없음. 순수 네이티브 성능.",
        title: "네이티브라서 빠릅니다.",
      },
      featureCards: {
        eyebrow: "더 많은 기능",
        title: "녹화의 작은 디테일까지 실전 흐름에 맞게.",
        subtitle: "Mac다운 네이티브 경험으로 자주 쓰는 녹화 흐름을 더 매끄럽게 만듭니다.",
        beautyThumb: {
          beforeLabel: "보정 끔",
          afterLabel: "보정 켬",
          disclosure: "AI로 생성한 인물이며 실제 보정 효과를 보여주기 위한 데모입니다.",
          enterFloatingAria: "카메라를 플로팅 창으로 표시",
          exitFloatingAria: "카메라를 전체 미리보기로 되돌리기",
          pauseAria: "보정 비교 데모 일시정지",
          playAria: "보정 비교 데모 재생",
          shapeCycleAria: "플로팅 창 모양 전환",
          shapeLabels: {
            circle: "원형",
            square: "둥근 사각형",
            wide: "16:9",
          },
        },
        dynamicIslandThumb: {
          ariaLabel: "Dynamic Island 백그라운드 작업 미리보기",
          materialLabel: "노치 소재",
          modeLabels: {
            black: "Black",
            glass: "Glass",
          },
          tasks: [
            {
              title: "ScreenCam 런칭 영상",
              detail: "완료됨. Finder에서 확인할 수 있습니다.",
              primaryAction: "Finder 열기",
              secondary: "완료",
              secondaryAction: "닫기",
              size: "384 MB",
            },
            {
              title: "4K 튜토리얼 내보내기",
              detail: "카메라와 커서 레이어를 포함해 H.265로 인코딩 중입니다.",
              primaryAction: "Finder 열기",
              secondary: "2분 남음",
              secondaryAction: "닫기",
              size: "1.2 GB",
            },
            {
              title: "GIF 미리보기 압축",
              detail: "더 작은 공유용 클립을 위해 프레임을 최적화 중입니다.",
              primaryAction: "Finder 열기",
              secondary: "42초 남음",
              secondaryAction: "닫기",
              size: "18 MB",
            },
          ],
          wallpaperButtonAria: "배경화면 변경",
        },
        effectLayersThumb: {
          ariaLabel: "효과 레이어 타임라인 미리보기",
          dragHint: "트랙으로 드래그해 추가",
          effects: [
            {
              id: "mosaic",
              title: "모자이크",
              description: "녹화 위의 민감한 영역을 픽셀 처리합니다.",
              clipLabel: "모자이크",
            },
            {
              id: "focus",
              title: "포커스",
              description: "맥락은 유지하면서 특정 영역을 강조합니다.",
              clipLabel: "포커스",
            },
            {
              id: "text",
              title: "텍스트",
              description: "편집의 원하는 위치에 텍스트 레이어를 추가합니다.",
              clipLabel: "텍스트",
            },
            {
              id: "image",
              title: "이미지",
              description: "이미지 오버레이를 시간 지정 레이어로 배치합니다.",
              clipLabel: "이미지",
            },
          ],
        },
        glassThumb: {
          modeLabels: {
            clear: "클리어",
            regular: "일반",
          },
          toolbarItems: {
            area: "영역",
            camera: "카메라",
            close: "ScreenCam 숨기기",
            display: "디스플레이",
            iphone: "iPhone",
            keyboard: "키보드 이벤트 녹화",
            microphone: "마이크",
            settings: "설정",
            systemAudio: "시스템 사운드 녹음",
            window: "윈도우",
            workspace: "작업 공간 열기",
          },
          wallpaperButtonAria: "배경화면 변경",
        },
        items: [
          {
            title: "Liquid Glass",
            caption: "네이티브 glass 소재를 지원해 컨트롤을 선명하게 유지하고 최신 macOS 느낌에 맞춥니다.",
          },
          {
            title: "단축키 표시",
            caption: "녹화 중 키보드 단축키 입력을 기록하고 영상에 선명하게 표시합니다.",
          },
          {
            title: "가벼운 보정",
            caption: "카메라 화면을 자연스럽고 깔끔하게 다듬습니다.",
          },
          {
            title: "Dynamic Island",
            caption: "긴 내보내기를 백그라운드로 보내고 노치에서 진행 상황을 계속 확인할 수 있습니다.",
          },
          {
            title: "효과 레이어",
            caption: "필요한 만큼 효과 레이어를 추가하고 타임라인에서 각 clip을 이동, 리사이즈, 스택할 수 있습니다.",
          },
        ],
      },
      faq: {
        eyebrow: "FAQ",
        title: "질문과 답변",
        items: [
          {
            question: "ScreenCam은 브라우저 기반 녹화 도구와 무엇이 다른가요?",
            answer:
              "ScreenCam은 macOS용 네이티브 녹화 및 편집 앱입니다. 로컬 캡처, 부드러운 편집 컨트롤, 미리보기와 일치하는 내보내기를 갖춘 컴팩트한 Mac 우선 워크플로를 목표로 합니다.",
          },
          {
            question: "필요한 최소 macOS 버전은 무엇인가요?",
            answer: "ScreenCam은 macOS 15 이상이 필요합니다.",
          },
          {
            question: "Windows 버전이 있나요?",
            answer: "현재는 없습니다. ScreenCam은 macOS에 집중하고 있으며 단기적으로 Windows 버전을 개발할 계획은 없습니다.",
          },
          {
            question: "다른 형식으로 내보낼 수 있나요?",
            answer: "ScreenCam은 에디터의 프레이밍과 모션 컨트롤이 최종 출력에 반영되는 고품질 비디오 내보내기를 위해 설계되었습니다.",
          },
          {
            question: "줌 기능은 어떻게 작동하나요?",
            answer:
              "타임라인 어디에나 줌 포인트를 추가할 수 있습니다. 수동 모드에서는 서로 다른 줌 레벨과 초점 중심을 가진 여러 앵커를 설정할 수 있으며, 부드러운 모션 블러 전환도 포함됩니다.",
          },
          {
            question: "여러 모니터를 지원하나요?",
            answer: "ScreenCam은 연결된 디스플레이, 창, 캡처 영역을 포함한 Mac 화면 녹화 워크플로를 위해 만들어졌습니다.",
          },
        ],
      },
    },
    legal: {
      privacy: {
        eyebrow: "개인정보",
        title: "개인정보 처리방침",
        updated: "마지막 업데이트: 2026년 6월 3일",
        sections: [
          {
            title: "개요",
            paragraphs: [
              [
                "ScreenCam은 네이티브 macOS 화면 녹화 및 편집 앱입니다. 앱은 녹화물을 Mac에서 로컬로 처리하도록 설계되었습니다. ScreenCam은 App Store 구매 상태와 같은 앱 기능, 그리고 사용자가 선택적으로 활성화한 익명 사용 분석을 위해 네트워크 요청을 할 수 있습니다. 앱에서 광고 트래커를 사용하지 않습니다.",
              ],
            ],
          },
          {
            title: "녹화 및 로컬 파일",
            paragraphs: [
              [
                "화면 녹화, 카메라 비디오, 마이크 오디오, 시스템 오디오, 커서 데이터, 내보낸 비디오, 워크스페이스 파일, 사용자 지정 배경화면 파일은 사용자의 기기 또는 사용자가 선택한 위치에 남습니다. ScreenCam은 이러한 콘텐츠를 ScreenCam 서버로 업로드하지 않습니다.",
              ],
            ],
          },
          {
            title: "익명 사용 분석",
            paragraphs: [
              [
                "ScreenCam은 녹화 및 편집 기능이 어떻게 작동하는지 이해하기 위해 익명 사용 분석 공유 여부를 물을 수 있습니다. 앱에서 언제든지 분석 공유를 켜거나 끌 수 있습니다. 비활성화하면 ScreenCam은 사용 분석을 보내지 않습니다.",
              ],
              [
                "분석은 기능 상호작용, 앱 버전, macOS 버전, 일반 기기 정보와 같은 제품 사용, 진단, 성능 정보로 제한됩니다. 분석을 통해 화면 콘텐츠, 오디오, 카메라 비디오, 프로젝트 파일, 파일 이름 또는 입력된 텍스트를 수집하지 않습니다.",
              ],
            ],
          },
          {
            title: "권한",
            paragraphs: [
              [
                "ScreenCam은 화면 녹화, 마이크, 카메라, 파일 접근에 대한 macOS 권한을 요청할 수 있습니다. 이러한 권한은 녹화, 편집, 내보내기, 사용자가 선택한 파일 기능 제공에만 사용됩니다. 시스템 설정에서 권한을 관리할 수 있습니다.",
              ],
            ],
          },
          {
            title: "구매",
            paragraphs: [
              [
                "ScreenCam Pro 구독 및 구매는 Apple이 Mac App Store를 통해 처리합니다. ScreenCam은 Pro 기능을 잠금 해제하기 위해 StoreKit에서 구매 및 구독 상태를 읽습니다. ScreenCam은 결제 카드 정보를 받거나 저장하지 않습니다.",
              ],
            ],
          },
          {
            title: "웹사이트",
            paragraphs: [
              [
                "thescreen.cam을 방문하면 호스팅 및 인프라 제공업체가 보안, 진단, 웹사이트 제공을 위해 IP 주소, 브라우저 user agent, 요청 URL, 요청 시간과 같은 표준 서버 로그 데이터를 처리할 수 있습니다. 웹사이트는 광고 트래커를 사용하지 않습니다.",
              ],
            ],
          },
          {
            title: "변경 및 연락처",
            paragraphs: [["ScreenCam이 변경됨에 따라 이 정책을 업데이트할 수 있습니다. 개인정보 관련 질문은 ", emailLink, " 로 문의하세요."]],
          },
        ],
      },
      support: {
        eyebrow: "지원",
        title: "ScreenCam 지원",
        updated: "ScreenCam for macOS 도움말.",
        supportChannelsAria: "지원 채널",
        sections: [
          {
            title: "연락처",
            showSupportChannels: true,
            paragraphs: [["제품 지원, 버그 보고, 구매 질문, 피드백은 ", emailLink, " 로 이메일을 보내주세요."]],
          },
          {
            title: "포함하면 좋은 정보",
            paragraphs: [
              [
                "문제를 보고할 때 macOS 버전, ScreenCam 버전, Mac 모델, 녹화 설정, 내보내기 형식, 발생한 일에 대한 짧은 설명을 포함해 주세요. 시각적 문제라면 스크린샷이나 짧은 녹화가 도움이 됩니다.",
              ],
            ],
          },
          {
            title: "App Store 구매",
            paragraphs: [
              [
                "ScreenCam은 Mac App Store를 통해 배포됩니다. 결제, 구독, 갱신, 취소, 환불은 Apple ID 및 App Store 계정 설정을 통해 Apple이 처리합니다.",
              ],
            ],
          },
          {
            title: "요구 사항",
            paragraphs: [["ScreenCam은 현재 macOS용으로 제작되었습니다. Windows 버전은 없으며 단기적으로 Windows 개발 계획도 없습니다."]],
          },
          {
            title: "개인정보",
            paragraphs: [["녹화 및 워크스페이스 파일은 Mac에서 로컬로 처리됩니다. 자세한 내용은 ", { href: "/privacy", text: "개인정보 처리방침" }, " 을 읽어보세요."]],
          },
        ],
      },
      terms: {
        eyebrow: "약관",
        title: "이용 약관",
        updated: "마지막 업데이트: 2026년 5월 20일",
        sections: [
          {
            title: "앱 라이선스",
            paragraphs: [
              [
                "적용 법률에서 달리 요구하지 않는 한, ScreenCam은 Apple의 Standard End User License Agreement(EULA)에 따라 사용자에게 라이선스됩니다. Apple 표준 EULA는 ",
                appleEulaLink,
                " 에서 확인할 수 있습니다.",
              ],
            ],
          },
          {
            title: "구독 및 구매",
            paragraphs: [
              [
                "ScreenCam Pro 구독 및 구매는 Apple이 Mac App Store를 통해 처리합니다. 구독 결제, 갱신, 취소, 환불, 계정 관리는 Apple ID 및 App Store 계정 설정을 통해 처리됩니다.",
              ],
            ],
          },
          {
            title: "ScreenCam 사용",
            paragraphs: [["ScreenCam으로 생성한 녹화, 파일, 내보내기 결과에 대한 책임은 사용자에게 있습니다. 필요한 권리와 권한이 있을 때만 콘텐츠를 녹화, 편집, 공유하세요."]],
          },
          {
            title: "개인정보",
            paragraphs: [["ScreenCam의 개인정보 처리 방식은 ", { href: "/privacy", text: "개인정보 처리방침" }, " 에 설명되어 있습니다."]],
          },
          {
            title: "연락처",
            paragraphs: [["이 약관에 대해 질문이 있으면 ", emailLink, " 로 문의하세요."]],
          },
        ],
      },
    },
    changelog: {
      description: "제품 업데이트, 수정 사항, 릴리스 노트.",
      eyebrow: "변경 내역",
      intro: "제품 업데이트, 수정 사항, 릴리스 노트.",
      linkVersionLabel: "버전 링크",
      title: "ScreenCam 변경 내역",
    },
    motionBlurTool: {
      addMaskAria: "마스크 추가",
      addMaskButton: "마스크",
      angleAria: "블러 각도",
      angleLabel: "각도",
      blurSettingsTitle: "블러 설정",
      chooseImage: "이미지 선택",
      clearImage: "이미지 지우기",
      defaultMaskName: "마스크",
      deleteSelectedMaskAria: "선택한 마스크 삭제",
      description: "직사각형 블러 영역을 만들고 방향과 강도를 조정한 뒤 합성 이미지를 내보내세요.",
      emptyMasksWithImage: "이미지의 일부를 흐리게 하려면 마스크를 추가하세요.",
      emptyMasksWithoutImage: "먼저 이미지를 업로드하세요.",
      exportButton: "내보내기",
      heightLabel: "높이",
      linearMode: "선형",
      maskButton: "마스크",
      masksTitle: "마스크",
      modeLabel: "모드",
      nameLabel: "이름",
      previewAria: "모션 블러 미리보기",
      replaceImageAria: "이미지 교체",
      selectedMaskEmpty: "마스크를 선택해 블러 방향, 강도, 위치, 크기를 편집하세요.",
      sourceTitle: "소스",
      strengthAria: "블러 강도",
      strengthLabel: "강도",
      title: "모션 블러 마스크",
      toolEyebrow: "도구",
      uniformMode: "균일",
      uploadDescription: "로컬 이미지를 여기에 놓거나 파일을 선택해 편집을 시작하세요.",
      uploadTitle: "이미지 업로드",
      widthLabel: "너비",
      xLabel: "X",
      yLabel: "Y",
    },
  },
  "zh-Hant": {
    common: {
      skipToContent: "跳到正文",
    },
    header: {
      appStore: "App Store",
      backToMenuAria: "返回選單",
      closeMenuAria: "關閉選單",
      homeAria: "ScreenCam 首頁",
      logoAlt: "ScreenCam 標誌",
      menuAria: "開啟選單",
      nav: {
        changelog: "更新日誌",
        docs: "文件",
        privacy: "隱私",
        support: "支援",
        terms: "條款",
      },
      primaryNavigationAria: "主導航",
    },
    footer: {
      appStoreButton: "在 App Store 檢視",
      copyright: "保留所有權利。",
      ctaText: "從 Mac App Store 獲取 ScreenCam。",
      ctaTitle: "準備錄得更好嗎？",
      description: "Mac 原生螢幕錄製。快速、輕量、強大。",
      groups: {
        legal: "法律",
        product: "產品",
        resources: "資源",
      },
      language: "語言",
      legalLinks: {
        privacy: "隱私",
        terms: "條款",
      },
      productLinks: {
        controls: "控制",
        export: "匯出",
        faq: "FAQ",
        zoom: "變焦",
      },
      resourceLinks: {
        alternatives: "替代方案",
        bgm: "BGM",
        changelog: "更新日誌",
        docs: "文件",
        motionBlurMask: "運動模糊遮罩",
        support: "支援",
      },
      supportChannelsAria: "支援渠道",
      systemStatus: "所有系統執行正常",
    },
    meta: {
      changelog: {
        title: "更新日誌 - ScreenCam",
        description: "檢視 ScreenCam 的版本說明、產品改進、問題修復和更新歷史。",
      },
      docs: {
        title: "文件 - ScreenCam",
        description: "透過帶章節的影片演示和互動播放，快速上手 ScreenCam 的核心功能。",
      },
      home: {
        title: "ScreenCam - 帶定向變焦的原生 macOS 螢幕錄製",
        description:
          "ScreenCam 是一款原生 macOS 螢幕錄製工具，支援高畫質錄製、手動變焦控制、時間線錨點、曲線調節和所見即所得匯出。",
      },
      motionBlurMask: {
        title: "運動模糊遮罩工具 - ScreenCam",
        description: "上傳圖片，繪製矩形運動模糊遮罩，調整模糊強度和方向，然後匯出合成結果。",
      },
      privacy: {
        title: "隱私政策 - ScreenCam",
        description:
          "ScreenCam 的隱私政策說明 macOS app 如何處理錄製內容、許可權、可選分析、購買和網站資料。",
      },
      support: {
        title: "支援 - ScreenCam",
        description: "獲取 ScreenCam macOS 版幫助，包括支援聯絡方式、App Store 購買、系統要求和故障排查。",
      },
      terms: {
        title: "使用條款 - ScreenCam",
        description: "ScreenCam 使用條款說明 app 授權、訂閱、購買和支援聯絡方式。",
      },
    },
    docs: {
      chaptersTitle: "步驟",
      description:
        "看一遍流程，直接跳到需要的步驟。",
      emptyVideoDescription:
        "把這個功能的演示影片放到 public/docs，然後在 timeline JSON 裡填入影片路徑和校準後的時間點。",
      emptyVideoTitle: "影片稍後新增",
      eyebrow: "文件",
      featureListAria: "文件主題",
      playback: {
        next: "下一步",
        pause: "暫停",
        play: "播放",
        previous: "上一步",
        restart: "重新開始",
      },
      progressLabel: "進度",
      title: "ScreenCam 指南。",
      videoAriaLabel: "文件演示影片",
      features: {
        basics: {
          title: "基礎佈局",
          summary: "瞭解預覽畫面、側邊欄、各類設定面板和時間線軌道。",
          chapters: {
            preview: {
              title: "預覽畫面",
              description: "用來實時預覽當前最終匯出的效果。",
            },
            sidebar: {
              title: "側邊欄",
              description: "所有的主要配置都在這裡。",
            },
            "screen-settings": {
              title: "螢幕設定",
              description: "用來設定螢幕內容，包括桌布、邊距、尺寸等。",
            },
            "device-settings": {
              title: "裝置設定",
              description: "給螢幕套上裝置外殼，在這裡選擇裝置，並配置裝置的樣式，例如背景。",
            },
            "keyboard-settings": {
              title: "按鍵設定",
              description: "設定錄製的快捷鍵顯示樣式、預設尺寸和位置。",
            },
            "beauty-settings": {
              title: "美顏設定",
              description: "開啟相機錄製後，在這裡對相機畫面做一些輕微的人像美顏。",
            },
            "mouse-settings": {
              title: "滑鼠設定",
              description: "設定滑鼠的基礎樣式。",
            },
            "animation-settings": {
              title: "動畫設定",
              description: "自定義鏡頭動畫，包括運動模糊強度和自定義曲線。",
            },
            tracks: {
              title: "軌道",
              description: "錄製、攝像頭、系統音訊、麥克風、縮放、鍵盤都會以時間軸片段的形式在這裡展示。",
            },
          },
        },
        "preview-control": {
          title: "預覽控制",
          summary: "調整預覽播放速度、預覽音量和時間線軌道縮放。",
          chapters: {
            "playback-rate": {
              title: "倍數播放",
              description:
                "這裡調整預覽的播放速度，**隻影響預覽階段，不會影響匯出**。",
            },
            volume: {
              title: "音量調節",
              description:
                "調整預覽的聲音，**隻影響預覽階段，不會影響匯出**。",
            },
            "track-zoom": {
              title: "軌道縮放",
              description: "調整軌道的縮放比例。",
            },
          },
        },
        "track-management": {
          title: "軌道管理",
          summary: "開啟軌道設定、調整排序、隱藏軌道、刪除軌道，並恢復已刪除軌道。",
          chapters: {
            entry: {
              title: "入口",
              description: "在軌道左側開啟軌道設定面板。",
            },
            sort: {
              title: "排序",
              description:
                "拖拽前面的 {{icon:grip}} 排序圖示來進行排序，這個排序將會作為偏好儲存，下次也會使用這個排序。",
            },
            hide: {
              title: "隱藏",
              description:
                "點選 {{icon:eye}} 圖示，隱藏不需要的軌道，這 **不會影響匯出**。",
            },
            delete: {
              title: "刪除",
              description:
                "點選 {{icon:trash}} 圖示，刪除不需要的軌道，這**會影響最終的匯出**。",
            },
            restore: {
              title: "恢復",
              description: "已刪除的軌道會單獨顯示在下方，可以隨時點選恢復。",
            },
          },
        },
        "screen-settings": {
          title: "螢幕設定",
          summary: "這裡的螢幕指錄製畫面以及畫面可能帶有的背景部分，用來調整這些樣式。",
          chapters: {
            wallpaper: {
              title: "桌布",
              description:
                "選擇從系統讀取的桌布，包括動態桌布。這部分不包含在應用安裝包內，不佔據空間，並且確保了最高的桌布質量。可以點選自定義在設定中配置更多的桌布目錄。",
            },
            "no-background": {
              title: "無背景",
              description:
                "可以選擇不要背景，這在全屏錄製，或自己選擇區域錄製中尤其重要。但是要注意，**目前預設切換到無桌布時，會保留之前的邊距或尺寸設定，需要手動調成 0 來去掉黑邊**。",
            },
            gradient: {
              title: "漸變",
              description:
                "選擇預設的線性漸變，你也可以自己任意地編輯漸變錨點和顏色，隨意加減錨點。",
            },
            "solid-color": {
              title: "純色",
              description: "選擇一個單一的顏色作為背景。",
            },
            "custom-background": {
              title: "自定義",
              description: "上傳自己的照片或影片作為背景。",
            },
            "adaptive-size": {
              title: "螢幕尺寸自適應模式",
              description: "在這個模式下畫面的大小透過調整上下或左右的邊距來控制。",
            },
            "sync-margins": {
              title: "同步邊距",
              description:
                "開啟同步邊距後確保 4 邊的邊距是一致的，關閉後可以單獨控制上下或左右。注意，**如果選擇了畫面比例的功能，視覺上會確保最終的畫面符合比例，邊距看起來會和調的引數不一致**。",
            },
            "fixed-size": {
              title: "螢幕尺寸固定模式",
              description:
                "這個模式下你可以手動輸入螢幕的尺寸。同樣，**如果選擇了畫面比例，會向外補充至目標的比例**。",
            },
          },
        },
        "workspace-file": {
          title: "工程檔案",
          summary:
            "工程檔案是一次錄製完成時生成的所有錄製相關的原始檔案，包括全部素材與配置，可以用於分享，**在錄製完成時自動建立並儲存到一個預設位置**。",
          chapters: {
            "default-directory": {
              title: "修改預設目錄",
              description:
                "開啟 <kbd>ScreenCam</kbd> > <kbd>設定</kbd> > <kbd>錄製</kbd> > <kbd>預設工作區目錄</kbd>，選擇預設目錄。",
            },
            "recent-projects": {
              title: "快速訪問最近專案",
              description: "在 <kbd>檔案</kbd> > <kbd>最近</kbd>。",
            },
            "default-directory-projects": {
              title: "快速訪問預設位置的專案",
              description: "在 <kbd>檔案</kbd> > <kbd>預設目錄</kbd>。",
            },
            "show-in-finder": {
              title: "在 Finder 檢視當前檔案",
              description:
                "可以直接點選編輯器頂部的工程檔名，或者在 <kbd>檔案</kbd> > <kbd>在訪達開啟</kbd>。",
            },
            "manual-save": {
              title: "手動儲存",
              description:
                "可以點選 <kbd>檔案</kbd> > <kbd>儲存</kbd>，或使用快捷鍵 <kbd>⌘</kbd><kbd>S</kbd> 手動儲存。大部分情況下會自動儲存。",
            },
            "save-as": {
              title: "另存為",
              description:
                "點選 <kbd>檔案</kbd> > <kbd>另存為</kbd>，或使用快捷鍵 <kbd>⌘</kbd><kbd>⇧</kbd><kbd>S</kbd>，將副本儲存到自定義目錄。",
            },
          },
        },
        record: {
          title: "錄製",
          summary: "設定錄製內容、選擇來源，然後開始錄製。",
          chapters: {
            "prepare-capture": {
              title: "準備錄製",
              description: "開啟 ScreenCam，並確認錄製控制區已經準備好，再選擇錄製來源。",
            },
            "choose-source": {
              title: "選擇來源",
              description: "選擇顯示器、視窗、區域、攝像頭、麥克風和系統聲音等錄製選項。",
            },
            "start-recording": {
              title: "開始錄製",
              description: "啟動錄製，並確認當前錄製狀態後再繼續後續流程。",
            },
          },
        },
        zoom: {
          title: "變焦",
          summary: "新增時間線錨點，調整畫面在錄製中的移動方式。",
          chapters: {
            "zoom-track": {
              title: "Zoom 軸",
              description: "在 zoom 軸上自由建立或刪除 zoom 片段。",
            },
            "delete-clip": {
              title: "刪除",
              description: "選中一個 clip 後，按 Backspace 或 Delete 刪除。",
              descriptionHtml:
                "選中一個 clip 後，按 <kbd class=\"docs-key\">Backspace</kbd> 或 <kbd class=\"docs-key\">Delete</kbd> 刪除。",
            },
            "create-clip": {
              title: "新建",
              description: "在空白處點選或拖拽，直接新建 zoom clip。",
            },
            "merge-clips": {
              title: "合併",
              description: "resize 一個 clip，或拖拽它與另一個 clip 相交，鬆開後確認合併。",
            },
            "manual-mode": {
              title: "手動模式",
              description: "預設會根據點選事件自動運鏡，也可以切到手動模式，自定義錨點數量、縮放中心和放大比例。",
            },
            "select-anchor": {
              title: "選擇錨點",
              description: "選中一個錨點，編輯它自己的 zoom 設定。",
            },
            "adjust-center": {
              title: "調整中心",
              description: "直接拖拽預覽畫面，調整縮放的視覺中心。",
            },
            "adjust-scale-wheel": {
              title: "調整縮放",
              description: "在預覽畫面裡使用滑鼠滾輪，直接控制放大比例。",
            },
            "adjust-scale-panel": {
              title: "設定面板調整",
              description: "選中錨點後，也可以在右側設定面板裡拖動滑塊調整縮放。",
            },
          },
        },
        camera: {
          title: "攝像頭",
          summary: "調整攝像頭浮窗形狀，並應用輕量的外觀效果。",
          chapters: {
            "enable-camera": {
              title: "啟用攝像頭",
              description: "開啟攝像頭圖層，並把它放到適合當前錄製的位置。",
            },
            "shape-frame": {
              title: "調整畫框",
              description: "切換畫框形狀，並調整攝像頭浮窗尺寸來適配畫面。",
            },
            "apply-beauty": {
              title: "應用美顏效果",
              description: "調整輕量外觀設定，並保持預覽效果和最終匯出一致。",
            },
          },
        },
        shortcuts: {
          title: "快捷鍵",
          summary: "用鍵盤動作控制錄製，不打斷當前操作節奏。",
          chapters: {
            "capture-shortcut": {
              title: "用快捷鍵開始",
              description: "透過鍵盤觸發錄製控制，不需要頻繁回到工具欄。",
            },
            "pause-resume": {
              title: "暫停或繼續",
              description: "在較長錄製中，用快捷鍵暫停和繼續錄製。",
            },
            "finish-recording": {
              title: "結束錄製",
              description: "停止錄製並進入編輯流程，同時保持當前上下文。",
            },
          },
        },
        export: {
          title: "匯出",
          summary: "檢查結果、選擇輸出設定，並匯出錄製檔案。",
          chapters: {
            "choose-format": {
              title: "選擇格式",
              description: "根據目標用途選擇匯出格式和輸出設定。",
            },
            "review-preview": {
              title: "檢查預覽",
              description: "在渲染檔案前確認最終預覽效果。",
            },
            "export-file": {
              title: "匯出檔案",
              description: "渲染錄製內容，並儲存匯出的結果檔案。",
            },
          },
        },
      },
    },
    home: {
      screenStudioAlternative: {
        eyebrow: "Screen Studio 替代方案",
        title: "想要更輕巧、手動控制更深入的 Mac 錄屏工具嗎？",
        description:
          "從應用體積、CPU 與記憶體佔用、匯出速度、手動變焦錨點、圖層、裝置樣機和匯出格式等方面對比 ScreenCam 與 Screen Studio。",
        cta: "檢視 Mac 版 Screen Studio 替代方案",
      },
      structuredDataFeatureList: ["原生 macOS 螢幕錄製", "手動變焦錨點", "運動模糊轉場", "精確預覽匯出"],
      hero: {
        appStoreButton: "在 App Store 檢視",
        builtWithLabel: "構建方式",
        builtWithValue: "100% 原生",
        systemLabel: "系統",
        systemValue: "macOS 15+",
        tagline: "原生 macOS 錄屏，帶手動變焦、運動模糊和精確匯出。",
        titleLines: [
          ["讓每一幀", "都清晰。"],
          ["讓重點", "被看見。"],
        ],
      },
      zoom: {
        canvasLabels: {
          autoPlayingDemo: "自動播放演示",
          playMarker: "播放",
          previewMarker: "預覽",
          recordingClip: "錄製",
          recordingTrack: "錄製",
          timelinePreview: "時間線預覽",
          zoomClip: "自動變焦",
          zoomTrack: "變焦",
        },
        features: [
          {
            title: "動態變焦",
            description: "鏡頭運動沿用 ScreenCam 匯出時的同一套彈簧時序。",
          },
          {
            title: "時間線預覽",
            description: "懸停在錄製或變焦軌道上，即可拖看精確的預覽幀。",
          },
          {
            title: "運動模糊",
            description: "變焦、平移和點選狀態都會按快門感取樣模糊。",
          },
        ],
        subtitle: "帶運動模糊的變焦。",
        timelineAria: "時間線預覽軌道",
        title: "聚焦真正重要的畫面。",
      },
      deviceMockups: {
        description: "用精緻裝置框匯出內容。iPhone、Mac、Studio Display，讓畫面呈現得剛剛好。",
        eyebrow: "匯出選項",
        formats: ["原始解析度", "Live Photo", "MP4 / MOV"],
        imageAlt: {
          iPhone: "iPhone 17 Pro Max",
          macBook: "在 MacBook Pro 上執行的 ScreenCam app",
          studioDisplay: "在 Studio Display 和 MacBook 上執行的 ScreenCam",
        },
        title: "每塊螢幕都好看",
      },
      controls: {
        body: "手動模式給你完整的創作自由。給同一個變焦片段新增多個錨點，每個錨點都有自己的倍率和中心點。",
        centerLabel: "中心",
        dragCenter: "拖動調整中心",
        eyebrow: "高階控制",
        features: ["拖動錨點調整時間線位置", "為每個錨點設定 1x 到 5x 倍率", "為每次變焦設定自定義焦點", "錨點之間平滑過渡"],
        pauseAria: "暫停模擬時間線播放",
        pauseTitle: "暫停",
        playAria: "播放模擬時間線",
        playTitle: "播放",
        scaleAria: "縮放倍率",
        scaleLabel: "倍率",
        titleMuted: "每個變焦點。",
        titleStart: "完全掌控",
      },
      performance: {
        cta: "檢視完整基準資料",
        metrics: {
          appSize: "App 體積",
          appSizeNote: "約 20MB vs 600MB",
          cpuUsage: "CPU 使用率",
          exportTime: "匯出時間",
          exportTimeNote: "越短越快",
          memory: "記憶體",
          others: "其他",
          screenCam: "ScreenCam",
        },
        subtitle: "沒有 Electron。沒有 WebView。純原生效能。",
        title: "原生，所以快",
      },
      featureCards: {
        eyebrow: "更多特色",
        title: "每一處小細節，都認真打磨。",
        subtitle: "從錄製、編輯到匯出，圍繞 Mac 原生體驗，把常用流程做得更順手。",
        beautyThumb: {
          beforeLabel: "美顏關閉",
          afterLabel: "美顏開啟",
          disclosure: "人像由 AI 生成，僅用於演示產品真實的美顏效果。",
          enterFloatingAria: "切換為攝像頭浮窗",
          exitFloatingAria: "恢復完整攝像頭預覽",
          pauseAria: "暫停美顏對比演示",
          playAria: "播放美顏對比演示",
          shapeCycleAria: "切換浮窗形狀",
          shapeLabels: {
            circle: "圓形",
            square: "圓角方形",
            wide: "16:9",
          },
        },
        dynamicIslandThumb: {
          ariaLabel: "Dynamic Island 後臺任務預覽",
          materialLabel: "劉海材質",
          modeLabels: {
            black: "黑色",
            glass: "Glass",
          },
          tasks: [
            {
              title: "ScreenCam 釋出影片",
              detail: "已完成，可在 Finder 中檢視。",
              primaryAction: "開啟 Finder",
              secondary: "已完成",
              secondaryAction: "完成",
              size: "384 MB",
            },
            {
              title: "4K 教程匯出",
              detail: "正在編碼 H.265，包含攝像頭和游標圖層。",
              primaryAction: "開啟 Finder",
              secondary: "剩 2 分鐘",
              secondaryAction: "完成",
              size: "1.2 GB",
            },
            {
              title: "GIF 預覽壓縮",
              detail: "正在最佳化幀，生成更小的分享片段。",
              primaryAction: "開啟 Finder",
              secondary: "剩 42 秒",
              secondaryAction: "完成",
              size: "18 MB",
            },
          ],
          wallpaperButtonAria: "切換桌布",
        },
        effectLayersThumb: {
          ariaLabel: "特效圖層時間線預覽",
          dragHint: "拖拽到軌道新增",
          effects: [
            {
              id: "mosaic",
              title: "馬賽克",
              description: "給畫面中的敏感區域疊加馬賽克。",
              clipLabel: "馬賽克",
            },
            {
              id: "focus",
              title: "聚焦",
              description: "突出重點區域，同時保留上下文。",
              clipLabel: "聚焦",
            },
            {
              id: "text",
              title: "文字",
              description: "在剪輯中任意位置新增文字圖層。",
              clipLabel: "文字",
            },
            {
              id: "image",
              title: "圖片",
              description: "把圖片作為可計時的疊加圖層放入時間線。",
              clipLabel: "圖片",
            },
          ],
        },
        glassThumb: {
          modeLabels: {
            clear: "通透",
            regular: "常規",
          },
          toolbarItems: {
            area: "區域",
            camera: "攝像頭",
            close: "隱藏 ScreenCam",
            display: "螢幕",
            iphone: "iPhone",
            keyboard: "鍵盤事件錄製",
            microphone: "麥克風",
            settings: "設定",
            systemAudio: "系統聲音錄製",
            window: "視窗",
            workspace: "開啟工作區",
          },
          wallpaperButtonAria: "切換桌布",
        },
        items: [
          {
            title: "Liquid Glass",
            caption: "支援原生 glass 材質，讓控制層通透、清晰，並貼合現代 macOS 視覺。",
          },
          {
            title: "快捷鍵展示",
            caption: "錄製鍵盤快捷鍵操作，並在影片中清晰展示出來。",
          },
          {
            title: "輕度美顏",
            caption: "輕微最佳化相機畫面，讓人像更清爽自然。",
          },
          {
            title: "Dynamic Island",
            caption: "將長任務放到後臺，在 notch 中隨時關注進度。",
          },
          {
            title: "特效圖層",
            caption: "可以新增任意數量的特效圖層，在時間線上移動、縮放並堆疊每個 clip。",
          },
        ],
      },
      faq: {
        eyebrow: "FAQ",
        title: "常見問題",
        items: [
          {
            question: "ScreenCam 和基於瀏覽器的錄屏工具有什麼不同？",
            answer:
              "ScreenCam 是為 macOS 打造的原生錄製和編輯 app。目標是提供緊湊、Mac 優先的工作流，包括本地捕捉、順滑編輯控制和精確預覽匯出。",
          },
          {
            question: "最低需要哪個 macOS 版本？",
            answer: "ScreenCam 需要 macOS 15 或更高版本。",
          },
          {
            question: "有 Windows 版本嗎？",
            answer: "目前沒有。ScreenCam 專注於 macOS，短期內沒有開發 Windows 版本的計劃。",
          },
          {
            question: "可以匯出不同格式嗎？",
            answer: "ScreenCam 面向高質量影片匯出，編輯器中的畫幅和運動控制會反映到最終輸出裡。",
          },
          {
            question: "變焦功能如何工作？",
            answer:
              "你可以在時間線任意位置新增變焦點。手動模式下可以完全控制：設定多個不同倍率和焦點中心的錨點，並帶有順滑的運動模糊轉場。",
          },
          {
            question: "支援多個顯示器嗎？",
            answer: "ScreenCam 面向 Mac 螢幕錄製工作流，支援連線的顯示器、視窗和選定錄製區域。",
          },
        ],
      },
    },
    legal: {
      privacy: {
        eyebrow: "隱私",
        title: "隱私政策",
        updated: "最後更新：2026 年 6 月 3 日",
        sections: [
          {
            title: "概覽",
            paragraphs: [
              [
                "ScreenCam 是一款原生 macOS 螢幕錄製和編輯 app。它的設計目標是在你的 Mac 本地處理錄製內容。ScreenCam 可能會為了 app 功能發起網路請求，例如 App Store 購買狀態；當你選擇啟用時，也可能傳送可選的匿名使用分析。我們不會在 app 中使用廣告追蹤器。",
              ],
            ],
          },
          {
            title: "錄製內容和本地檔案",
            paragraphs: [
              [
                "螢幕錄製、攝像頭影片、麥克風音訊、系統音訊、游標資料、匯出影片、工作區檔案和自定義桌布檔案會保留在你的裝置或你選擇的位置。ScreenCam 不會把這些內容上傳到 ScreenCam 伺服器。",
              ],
            ],
          },
          {
            title: "匿名使用分析",
            paragraphs: [
              [
                "ScreenCam 可能會詢問你是否願意分享匿名使用分析，以幫助我們瞭解哪些錄製和編輯功能執行良好。你可以隨時在 app 中開啟或關閉分析共享。如果關閉，ScreenCam 不會傳送使用分析。",
              ],
              [
                "分析內容僅限產品使用、診斷和效能資訊，例如功能互動、app 版本、macOS 版本和一般裝置資訊。我們絕不會透過分析收集螢幕內容、音訊、攝像頭影片、專案檔案、檔名或輸入文字。",
              ],
            ],
          },
          {
            title: "許可權",
            paragraphs: [
              [
                "ScreenCam 可能會請求 macOS 的螢幕錄製、麥克風、攝像頭和檔案訪問許可權。這些許可權只用於提供錄製、編輯、匯出和使用者選擇檔案等功能。你可以在系統設定中管理這些許可權。",
              ],
            ],
          },
          {
            title: "購買",
            paragraphs: [
              [
                "ScreenCam Pro 訂閱和購買由 Apple 透過 Mac App Store 處理。ScreenCam 會透過 StoreKit 讀取購買和訂閱狀態，以解鎖 Pro 功能。ScreenCam 不會接收或儲存你的支付卡資訊。",
              ],
            ],
          },
          {
            title: "網站",
            paragraphs: [
              [
                "當你訪問 thescreen.cam 時，我們的託管和基礎設施提供商可能會處理標準伺服器日誌資料，例如 IP 地址、瀏覽器 user agent、請求 URL 和請求時間，用於安全、診斷和網站交付。本網站不使用廣告追蹤器。",
              ],
            ],
          },
          {
            title: "變更和聯絡",
            paragraphs: [["隨著 ScreenCam 變化，我們可能會更新本政策。如果你有隱私問題，請透過 ", emailLink, " 聯絡我們。"]],
          },
        ],
      },
      support: {
        eyebrow: "支援",
        title: "ScreenCam 支援",
        updated: "獲取 ScreenCam macOS 版幫助。",
        supportChannelsAria: "支援渠道",
        sections: [
          {
            title: "聯絡",
            showSupportChannels: true,
            paragraphs: [["如需產品支援、報告問題、購買諮詢或反饋，請傳送郵件至 ", emailLink, "。"]],
          },
          {
            title: "請包含這些資訊",
            paragraphs: [
              [
                "報告問題時，請包含 macOS 版本、ScreenCam 版本、Mac 型號、錄製設定、匯出格式，以及簡短的問題描述。如果是視覺問題，截圖或短錄屏會很有幫助。",
              ],
            ],
          },
          {
            title: "App Store 購買",
            paragraphs: [
              [
                "ScreenCam 透過 Mac App Store 分發。計費、訂閱、續訂、取消和退款由 Apple 透過你的 Apple ID 與 App Store 賬戶設定處理。",
              ],
            ],
          },
          {
            title: "系統要求",
            paragraphs: [["ScreenCam 目前為 macOS 構建。沒有 Windows 版本，短期內也沒有 Windows 開發計劃。"]],
          },
          {
            title: "隱私",
            paragraphs: [["錄製內容和工作區檔案會在你的 Mac 本地處理。更多詳情請閱讀", { href: "/privacy", text: "隱私政策" }, "。"]],
          },
        ],
      },
      terms: {
        eyebrow: "條款",
        title: "使用條款",
        updated: "最後更新：2026 年 5 月 20 日",
        sections: [
          {
            title: "App 授權",
            paragraphs: [
              [
                "除非適用法律另有要求，ScreenCam 根據 Apple 標準終端使用者許可協議 (EULA) 授權給你使用。你可以在 ",
                appleEulaLink,
                " 檢視 Apple 標準 EULA。",
              ],
            ],
          },
          {
            title: "訂閱和購買",
            paragraphs: [
              [
                "ScreenCam Pro 訂閱和購買由 Apple 透過 Mac App Store 處理。訂閱計費、續訂、取消、退款和賬戶管理均透過你的 Apple ID 與 App Store 賬戶設定完成。",
              ],
            ],
          },
          {
            title: "ScreenCam 的使用",
            paragraphs: [["你需要對使用 ScreenCam 建立的錄製內容、檔案和匯出結果負責。只有在擁有所需權利和許可時，才應錄製、編輯和分享內容。"]],
          },
          {
            title: "隱私",
            paragraphs: [["ScreenCam 的隱私實踐見", { href: "/privacy", text: "隱私政策" }, "。"]],
          },
          {
            title: "聯絡",
            paragraphs: [["如果你對這些條款有疑問，請透過 ", emailLink, " 聯絡我們。"]],
          },
        ],
      },
    },
    changelog: {
      description: "產品更新、修復和版本說明。",
      eyebrow: "更新日誌",
      intro: "產品更新、修復和版本說明。",
      linkVersionLabel: "連結到版本",
      title: "ScreenCam 更新日誌",
    },
    motionBlurTool: {
      addMaskAria: "新增遮罩",
      addMaskButton: "遮罩",
      angleAria: "模糊角度",
      angleLabel: "角度",
      blurSettingsTitle: "模糊設定",
      chooseImage: "選擇圖片",
      clearImage: "清除圖片",
      defaultMaskName: "遮罩",
      deleteSelectedMaskAria: "刪除選中的遮罩",
      description: "建立矩形模糊區域，調整方向和強度，然後匯出合成圖片。",
      emptyMasksWithImage: "新增一個遮罩來模糊圖片的一部分。",
      emptyMasksWithoutImage: "請先上傳圖片。",
      exportButton: "匯出",
      heightLabel: "高度",
      linearMode: "線性",
      maskButton: "遮罩",
      masksTitle: "遮罩",
      modeLabel: "模式",
      nameLabel: "名稱",
      previewAria: "運動模糊預覽",
      replaceImageAria: "替換圖片",
      selectedMaskEmpty: "選擇一個遮罩，以編輯模糊方向、強度、位置和大小。",
      sourceTitle: "來源",
      strengthAria: "模糊強度",
      strengthLabel: "強度",
      title: "運動模糊遮罩",
      toolEyebrow: "工具",
      uniformMode: "均勻",
      uploadDescription: "將本地圖片拖到這裡，或選擇一個檔案開始編輯。",
      uploadTitle: "上傳圖片",
      widthLabel: "寬度",
      xLabel: "X",
      yLabel: "Y",
    },
  },
  es: {
    common: {
      skipToContent: "Saltar al contenido",
    },
    header: {
      appStore: "App Store",
      backToMenuAria: "Volver al menú",
      closeMenuAria: "Cerrar menú",
      homeAria: "Inicio de ScreenCam",
      logoAlt: "Logotipo ScreenCam",
      menuAria: "abrir menú",
      nav: {
        changelog: "Registro de cambios",
        docs: "Documentos",
        privacy: "Privacidad",
        support: "Soporte",
        terms: "Términos",
      },
      primaryNavigationAria: "Navegación primaria",
    },
    footer: {
      appStoreButton: "Ver en App Store",
      copyright: "Todos los derechos reservados.",
      ctaText: "Obtenga ScreenCam del Mac App Store.",
      ctaTitle: "¿Listo para capturar mejor?",
      description: "Grabación de pantalla nativa para Mac. Rápido, ligero, potente.",
      groups: {
        legal: "Legales",
        product: "Producto",
        resources: "Recursos",
      },
      language: "Idioma",
      legalLinks: {
        privacy: "Privacidad",
        terms: "Términos",
      },
      productLinks: {
        controls: "Controles",
        export: "Exportar",
        faq: "Preguntas frecuentes",
        zoom: "Ampliar",
      },
      resourceLinks: {
        alternatives: "Alternativas",
        bgm: "BGM",
        changelog: "Registro de cambios",
        docs: "Documentos",
        motionBlurMask: "Máscara de desenfoque de movimiento",
        support: "Soporte",
      },
      supportChannelsAria: "Canales de soporte",
      systemStatus: "Todos los sistemas funcionan correctamente",
    },
    meta: {
      changelog: {
        title: "Registro de cambios: ScreenCam",
        description: "Siga las notas de la versión del ScreenCam, las mejoras del producto, las correcciones de errores y el historial de actualizaciones.",
      },
      docs: {
        title: "Documentos - ScreenCam",
        description:
          "Aprenda ScreenCam con tutoriales en vídeo guiados, pasos por capítulos y reproducción interactiva.",
      },
      home: {
        title: "ScreenCam - Grabación de pantalla nativa macOS con zoom dirigido",
        description:
          "ScreenCam es un grabador de pantalla nativo macOS para capturas nítidas, control de zoom manual, anclajes de línea de tiempo, ajuste de curvas y exportación con vista previa precisa.",
      },
      motionBlurMask: {
        title: "Herramienta Máscara de desenfoque de movimiento - ScreenCam",
        description:
          "Cargue una imagen, dibuje máscaras de desenfoque de movimiento rectangulares, ajuste la intensidad y la dirección del desenfoque y luego exporte el resultado compuesto.",
      },
      privacy: {
        title: "Política de privacidad - ScreenCam",
        description:
          "La política de privacidad de ScreenCam explica cómo la aplicación macOS maneja grabaciones, permisos, análisis opcionales, compras y datos del sitio web.",
      },
      support: {
        title: "Soporte - ScreenCam",
        description:
          "Obtenga ayuda con ScreenCam para macOS, incluido el contacto de soporte, compras de App Store, requisitos y solución de problemas.",
      },
      terms: {
        title: "Condiciones de uso - ScreenCam",
        description:
          "Los términos de uso de ScreenCam explican la licencia de la aplicación, las suscripciones, las compras y la información de contacto de soporte.",
      },
    },
    docs: {
      chaptersTitle: "Pasos",
      description:
        "Observe el flujo de trabajo y luego vaya directamente al paso que necesita.",
      emptyVideoDescription:
        "Coloque el archivo de demostración en public/docs para esta función, luego agregue la ruta del video y las marcas de tiempo calibradas a la línea de tiempo JSON.",
      emptyVideoTitle: "Vídeo próximamente",
      eyebrow: "Documentos",
      featureListAria: "Temas de documentación",
      playback: {
        next: "Siguiente paso",
        pause: "Pausa",
        play: "Jugar",
        previous: "Paso anterior",
        restart: "Reiniciar",
      },
      progressLabel: "Progreso",
      title: "Guías ScreenCam.",
      videoAriaLabel: "Vídeo de demostración de documentación",
      features: {
        basics: {
          title: "Conceptos básicos",
          summary: "Familiarícese con la vista previa, la barra lateral, los paneles de configuración y las pistas de la línea de tiempo.",
          chapters: {
            preview: {
              title: "Vista previa",
              description: "Utilice el área de vista previa para ver el resultado final de la exportación actual en tiempo real.",
            },
            sidebar: {
              title: "Barra lateral",
              description: "Los paneles de configuración principales se encuentran en la barra lateral.",
            },
            "screen-settings": {
              title: "Configuración de pantalla",
              description: "Configure el contenido de la pantalla, incluido el fondo de pantalla, los márgenes, el tamaño y las opciones de diseño relacionadas.",
            },
            "device-settings": {
              title: "Configuración del dispositivo",
              description: "Envuelva la pantalla en un marco de dispositivo, elija el dispositivo y ajuste el estilo del marco, como el fondo.",
            },
            "keyboard-settings": {
              title: "Configuración del teclado",
              description: "Configure cómo aparecen los atajos grabados, incluido su tamaño y posición predeterminados.",
            },
            "beauty-settings": {
              title: "Configuraciones de belleza",
              description: "Una vez habilitada la grabación de la cámara, aplique mejoras sutiles del retrato a la imagen de la cámara.",
            },
            "mouse-settings": {
              title: "Configuración del ratón",
              description: "Ajuste el estilo visual básico del puntero del mouse.",
            },
            "animation-settings": {
              title: "Configuración de animación",
              description: "Personalice el movimiento de la cámara, incluida la intensidad del desenfoque de movimiento y curvas personalizadas.",
            },
            tracks: {
              title: "Pistas",
              description: "Los eventos de grabación, cámara, audio del sistema, micrófono, zoom y teclado aparecen aquí como clips de línea de tiempo.",
            },
          },
        },
        "preview-control": {
          title: "Controles de vista previa",
          summary: "Ajuste la velocidad de reproducción de la vista previa, el volumen de la vista previa y el zoom de la pista de la línea de tiempo mientras edita.",
          chapters: {
            "playback-rate": {
              title: "Velocidad de reproducción",
              description:
                "Ajuste la velocidad de reproducción de la vista previa aquí. **Esto solo afecta la etapa de vista previa y no afecta la exportación.**",
            },
            volume: {
              title: "Volumen",
              description:
                "Ajusta el sonido que escuchas durante la vista previa. **Esto solo afecta la etapa de vista previa y no afecta la exportación.**",
            },
            "track-zoom": {
              title: "Zoom de seguimiento",
              description: "Cambia el nivel de zoom de las pistas de la línea de tiempo.",
            },
          },
        },
        "track-management": {
          title: "Gestión de seguimiento",
          summary: "Abra la configuración de pistas, reordene las pistas, ocúltelas, elimínelas y restaure las pistas eliminadas.",
          chapters: {
            entry: {
              title: "Entrada",
              description: "Abra el panel de configuración de pistas desde el lado izquierdo de las pistas.",
            },
            sort: {
              title: "ordenar",
              description:
                "Arrastre el controlador de clasificación {{icon:grip}} principal para reordenar las pistas. Este pedido se guarda como preferencia y se reutiliza la próxima vez.",
            },
            hide: {
              title: "Ocultar",
              description:
                "Haga clic en {{icon:eye}} para ocultar las pistas que no necesita. **Esto no afecta la exportación.**",
            },
            delete: {
              title: "Delete",
              description:
                "Haga clic en {{icon:trash}} para eliminar pistas que no necesita. **Esto afecta la exportación final.**",
            },
            restore: {
              title: "Restaurar",
              description:
                "Las pistas Deleted aparecen por separado a continuación, donde puedes restaurarlas en cualquier momento.",
            },
          },
        },
        "screen-settings": {
          title: "Configuración de pantalla",
          summary: "Ajuste la pantalla grabada, su fondo, márgenes y comportamiento del tamaño de salida.",
          chapters: {
            wallpaper: {
              title: "Fondo de pantalla",
              description:
                "Elija fondos de pantalla leídos desde el sistema, incluidos fondos de pantalla dinámicos. No están incluidos con la aplicación, no ocupan espacio en la aplicación y mantienen la más alta calidad de fondo de pantalla. Haga clic en Personalizado para configurar más carpetas de fondos de pantalla en Configuración.",
            },
            "no-background": {
              title: "Sin antecedentes",
              description:
                "No elija ningún fondo, lo cual es especialmente importante para la grabación de pantalla completa o la grabación de área personalizada. **Actualmente, al cambiar a ningún fondo de pantalla se mantienen las configuraciones anteriores de margen o tamaño de forma predeterminada, así que configúrelas en 0 manualmente para eliminar los bordes negros.**",
            },
            gradient: {
              title: "gradiente",
              description:
                "Elija un degradado lineal preestablecido o edite libremente los anclajes y colores del degradado, agregando o eliminando anclajes según sea necesario.",
            },
            "solid-color": {
              title: "color sólido",
              description: "Elija un solo color como fondo.",
            },
            "custom-background": {
              title: "personalizado",
              description: "Sube tu propia foto o vídeo como fondo.",
            },
            "adaptive-size": {
              title: "Tamaño de pantalla adaptable",
              description:
                "En este modo, el tamaño de la pantalla se controla ajustando los márgenes verticales y horizontales.",
            },
            "sync-margins": {
              title: "Márgenes de sincronización",
              description:
                "Habilite los márgenes de sincronización para mantener los cuatro lados consistentes. Desactívelo para controlar los márgenes verticales y horizontales por separado. **Si la relación de aspecto está habilitada, la imagen final se ajusta visualmente a esa relación, por lo que los márgenes pueden verse diferentes de los valores ingresados.**",
            },
            "fixed-size": {
              title: "Tamaño de pantalla fijo",
              description:
                "En este modo, ingrese manualmente el tamaño de la pantalla. **Si la relación de aspecto está habilitada, el lienzo se expande hacia afuera hasta la relación objetivo.**",
            },
          },
        },
        "workspace-file": {
          title: "Archivo Project",
          summary:
            "Un archivo de proyecto contiene todos los archivos sin procesar generados para una grabación completa, incluidos todos los activos y configuraciones. Puedes compartirlo y **se crea y guarda automáticamente en una ubicación predeterminada cuando finaliza la grabación.**",
          chapters: {
            "default-directory": {
              title: "Cambiar el directorio predeterminado",
              description:
                "Abra <kbd>ScreenCam</kbd> > <kbd>Configuración</kbd> > <kbd>Grabación</kbd> > <kbd>Directorio del espacio de trabajo predeterminado</kbd>, luego elija la carpeta predeterminada.",
            },
            "recent-projects": {
              title: "Abrir proyectos recientes",
              description: "Utilice <kbd>File</kbd> > <kbd>Recent</kbd>.",
            },
            "default-directory-projects": {
              title: "Abrir proyectos en la ubicación predeterminada",
              description:
                "Utilice <kbd>File</kbd> > <kbd>Directorio predeterminado</kbd>.",
            },
            "show-in-finder": {
              title: "Mostrar el archivo actual en Finder",
              description:
                "Haga clic en el nombre del archivo del proyecto en la parte superior del editor o use <kbd>File</kbd> > <kbd>Mostrar en Finder</kbd>.",
            },
            "manual-save": {
              title: "Guardar manualmente",
              description:
                "Utilice <kbd>File</kbd> > <kbd>Save</kbd>, o presione <kbd>⌘</kbd><kbd>S</kbd> para guardar manualmente. En la mayoría de los casos, el proyecto se guarda automáticamente.",
            },
            "save-as": {
              title: "Guardar como",
              description:
                "Utilice <kbd>File</kbd> > <kbd>Save As</kbd>, o presione <kbd>⌘</kbd><kbd>⇧</kbd><kbd>S</kbd> para guardar una copia en una carpeta personalizada.",
            },
          },
        },
        record: {
          title: "Registro",
          summary: "Configure una captura, elija la fuente y comience a grabar.",
          chapters: {
            "prepare-capture": {
              title: "preparar la captura",
              description: "Abra ScreenCam y confirme que los controles de grabación estén listos antes de seleccionar una fuente.",
            },
            "choose-source": {
              title: "Elige una fuente",
              description: "Elija las opciones de pantalla, ventana, área, cámara, micrófono y audio del sistema para la grabación.",
            },
            "start-recording": {
              title: "Empezar a grabar",
              description: "Inicie la captura y verifique el estado de la grabación antes de pasar al flujo de trabajo.",
            },
          },
        },
        zoom: {
          title: "Ampliar",
          summary: "Agregue anclajes a la línea de tiempo y ajuste cómo se mueve la cámara a lo largo de la grabación.",
          chapters: {
            "zoom-track": {
              title: "Pista de zoom",
              description: "Cree y elimine clips de zoom libremente en la pista de zoom.",
            },
            "delete-clip": {
              title: "Delete",
              description: "Seleccione un clip y luego presione Backspace o Delete para eliminarlo.",
              descriptionHtml:
                "Seleccione un clip y luego presione <kbd class=\"docs-key\">Backspace</kbd> o <kbd class=\"docs-key\">Delete</kbd> para eliminarlo.",
            },
            "create-clip": {
              title: "crear",
              description: "Haga clic o arrastre en un área vacía para crear un nuevo clip de zoom.",
            },
            "merge-clips": {
              title: "fusionar",
              description: "Cambie el tamaño o arrastre un clip hasta que se cruce con otro clip, luego suéltelo para confirmar la fusión.",
            },
            "manual-mode": {
              title: "Modo manual",
              description: "Cambie del movimiento automático al modo manual y personalice el recuento, el centro y la escala de cada ancla.",
            },
            "select-anchor": {
              title: "Seleccione un ancla",
              description: "Seleccione un ancla para editar su configuración de zoom individual.",
            },
            "adjust-center": {
              title: "Ajustar centro",
              description: "Arrastre directamente en la vista previa para establecer el centro visual del zoom.",
            },
            "adjust-scale-wheel": {
              title: "Ajustar escala",
              description: "Utilice la rueda del mouse en la vista previa para controlar la escala de zoom.",
            },
            "adjust-scale-panel": {
              title: "Ajustar la escala en la configuración",
              description: "Seleccione un ancla, luego ajuste el control deslizante de escala en el panel de configuración derecho.",
            },
          },
        },
        camera: {
          title: "cámara",
          summary: "Dale forma a la superposición de la cámara y aplica ajustes de apariencia livianos.",
          chapters: {
            "enable-camera": {
              title: "Habilitar la cámara",
              description: "Encienda la capa de la cámara y colóquela donde admita la grabación.",
            },
            "shape-frame": {
              title: "Dar forma al marco",
              description: "Cambie entre formas de marco y ajuste el tamaño de la superposición de la cámara para la escena.",
            },
            "apply-beauty": {
              title: "Aplicar efectos de belleza",
              description: "Ajuste la configuración de apariencia sutil mientras mantiene la vista previa alineada con la exportación final.",
            },
          },
        },
        shortcuts: {
          title: "Atajos",
          summary: "Utilice las acciones del teclado para controlar la captura sin interrumpir el flujo.",
          chapters: {
            "capture-shortcut": {
              title: "Comience con un atajo",
              description: "Active los controles de grabación desde el teclado en lugar de recurrir a la barra de herramientas.",
            },
            "pause-resume": {
              title: "Pausar o reanudar",
              description: "Utilice acciones de acceso directo para pausar y continuar la captura durante grabaciones más largas.",
            },
            "finish-recording": {
              title: "terminar la toma",
              description: "Detén la grabación y pasa al editor sin perder el contexto.",
            },
          },
        },
        export: {
          title: "Exportar",
          summary: "Revise el resultado, elija la configuración de salida y exporte la grabación.",
          chapters: {
            "choose-format": {
              title: "Elige el formato",
              description: "Seleccione el formato de exportación y la configuración de salida para el destino.",
            },
            "review-preview": {
              title: "Revisa la vista previa",
              description: "Verifique la vista previa final antes de renderizar el archivo.",
            },
            "export-file": {
              title: "Exportar el archivo",
              description: "Renderice la grabación y guarde el resultado exportado.",
            },
          },
        },
      },
    },
    home: {
      screenStudioAlternative: {
        eyebrow: "Alternativa Screen Studio",
        title: "¿Necesita un grabador de pantalla Mac más ligero y con un control manual más profundo?",
        description:
          "Compare ScreenCam con Screen Studio en términos de tamaño de aplicación, uso de CPU y memoria, velocidad de exportación, anclajes de zoom manual, capas, maquetas de dispositivos y formatos de exportación.",
        cta: "Screen Studio alternativa para Mac",
      },
      structuredDataFeatureList: [
        "Grabación de pantalla nativa macOS",
        "Anclajes de zoom manual",
        "Curvas de animación personalizadas",
        "Maquetas de dispositivos",
        "Capas de mosaico, texto, enfoque e imágenes personalizadas",
        "Transiciones de desenfoque de movimiento",
        "Exportación GIF",
        "Exportación Live Photo",
        "Efectos de belleza de la cámara.",
        "Exportación con vista previa precisa",
      ],
      hero: {
        appStoreButton: "Ver en App Store",
        builtWithLabel: "Construido con",
        builtWithValue: "100% Nativo",
        systemLabel: "Sistema",
        systemValue: "macOS 15+",
        tagline: "Grabación en alta resolución con una cámara a la que puedes darle forma después de la toma.",
        titleLines: [
          ["Capturar", "Afilado."],
          ["directo", "El marco."],
        ],
      },
      zoom: {
        canvasLabels: {
          autoPlayingDemo: "Demostración de reproducción automática",
          playMarker: "Jugar",
          previewMarker: "Vista previa",
          recordingClip: "Grabación",
          recordingTrack: "Grabación",
          timelinePreview: "Vista previa de la línea de tiempo",
          zoomClip: "Zoom automático",
          zoomTrack: "Ampliar",
        },
        features: [
          {
            title: "Zoom dinámico",
            description: "El movimiento de la cámara sigue el mismo ritmo de resorte utilizado en las exportaciones ScreenCam.",
          },
          {
            title: "Vista previa de la línea de tiempo",
            description: "Pase el cursor sobre la pista Grabación o Zoom para desplazarse por el cuadro de vista previa exacto.",
          },
          {
            title: "Desenfoque de movimiento",
            description: "Los estados de zoom, panorámica y clic se muestran con un desenfoque estilo obturador.",
          },
        ],
        subtitle: "Zoom con desenfoque de movimiento.",
        timelineAria: "Pistas de vista previa de la línea de tiempo",
        title: "Concéntrate en lo que importa.",
      },
      deviceMockups: {
        description:
          "Exporta con impresionantes marcos de dispositivo. iPhone, Mac, Studio Display: su contenido perfectamente presentado.",
        eyebrow: "Exportar Option",
        formats: ["Resolución original", "Live Photo", "MP4 / MOV"],
        imageAlt: {
          iPhone: "iPhone 17 Pro Máximo",
          macBook: "Aplicación ScreenCam ejecutándose en MacBook Pro",
          studioDisplay: "ScreenCam ejecutándose en Studio Display con MacBook",
        },
        title: "Hermosa en cada pantalla.",
      },
      controls: {
        body:
          "El modo manual te ofrece total libertad creativa. Agregue múltiples anclajes a un único clip de zoom, cada uno con su propia escala y punto central.",
        centerLabel: "Centro",
        dragCenter: "Arrastra para ajustar el centro",
        eyebrow: "Controles avanzados",
        features: [
          "Arrastre los anclajes para reposicionarlos en la línea de tiempo",
          "Ajuste la escala de 1x a 5x por ancla",
          "Establecer un centro de enfoque personalizado para cada zoom",
          "Transiciones suaves entre anclajes",
        ],
        pauseAria: "Pausar la reproducción de la línea de tiempo simulada",
        pauseTitle: "Pausa",
        playAria: "Reproducir reproducción de línea de tiempo simulada",
        playTitle: "Jugar",
        scaleAria: "Escala",
        scaleLabel: "Escala",
        titleMuted: "cada punto de zoom.",
        titleStart: "Control total sobre",
      },
      performance: {
        cta: "Ver datos de referencia completos",
        metrics: {
          appSize: "Tamaño de la aplicación",
          appSizeNote: "alrededor de 20 MB frente a 600 MB",
          cpuUsage: "Uso de CPU",
          exportTime: "Tiempo de exportación",
          exportTimeNote: "más corto es más rápido",
          memory: "Memoria",
          others: "Otros",
          screenCam: "ScreenCam",
        },
        subtitle: "Sin electrón. Sin vistas web. Puro rendimiento nativo.",
        title: "Nativo significa rápido.",
      },
      featureCards: {
        eyebrow: "Características More",
        title: "Pequeños detalles, listos para flujos de trabajo reales.",
        subtitle: "Toques nativos que hacen que la grabación se sienta rápida, pulida y Mac-primera.",
        beautyThumb: {
          beforeLabel: "Belleza apagada",
          afterLabel: "belleza en",
          disclosure:
            "Retrato generado por IA, utilizado únicamente para demostrar el efecto de belleza real.",
          enterFloatingAria: "Mostrar como ventana de cámara flotante",
          exitFloatingAria: "Volver la ventana de la cámara a la vista previa completa",
          pauseAria: "Pausar demostración de comparación de belleza",
          playAria: "Juegue la demostración de comparación de belleza",
          shapeCycleAria: "Cambiar la forma de la ventana flotante",
          shapeLabels: {
            circle: "circulo",
            square: "cuadrado redondeado",
            wide: "16:9",
          },
        },
        dynamicIslandThumb: {
          ariaLabel: "Vista previa de la tarea en segundo plano de la isla dinámica",
          materialLabel: "Material de muesca",
          modeLabels: {
            black: "negro",
            glass: "vidrio",
          },
          tasks: [
            {
              title: "Película de lanzamiento ScreenCam",
              detail: "Listo para revelar en Finder.",
              primaryAction: "Abrir Finder",
              secondary: "completo",
              secondaryAction: "hecho",
              size: "384 megas",
            },
            {
              title: "Exportación de tutoriales 4K",
              detail: "Codificación H.265 con capas de cámara y cursor.",
              primaryAction: "Abrir Finder",
              secondary: "quedan 2m",
              secondaryAction: "hecho",
              size: "1,2GB",
            },
            {
              title: "Compresión de vista previa GIF",
              detail: "Optimización de fotogramas para un clip compartible más pequeño.",
              primaryAction: "Abrir Finder",
              secondary: "42 quedan",
              secondaryAction: "hecho",
              size: "18 megas",
            },
          ],
          wallpaperButtonAria: "Cambiar fondo de pantalla",
        },
        effectLayersThumb: {
          ariaLabel: "Vista previa de la línea de tiempo de capas de efectos",
          dragHint: "Arrastra a la pista para agregar",
          effects: [
            {
              id: "mosaic",
              title: "mosaico",
              description: "Pixelate áreas sensibles encima de la grabación.",
              clipLabel: "mosaico",
            },
            {
              id: "focus",
              title: "Enfoque",
              description: "Resalte una región manteniendo visible el contexto.",
              clipLabel: "Enfoque",
            },
            {
              id: "text",
              title: "Texto",
              description: "Agrega una capa de texto en cualquier lugar de la edición.",
              clipLabel: "Texto",
            },
            {
              id: "image",
              title: "Imagen",
              description: "Coloque una superposición de imagen como una capa cronometrada.",
              clipLabel: "Imagen",
            },
          ],
        },
        glassThumb: {
          modeLabels: {
            clear: "Borrar",
            regular: "regular",
          },
          toolbarItems: {
            area: "Área",
            camera: "cámara",
            close: "Ocultar ScreenCam",
            display: "Pantalla",
            iphone: "iPhone",
            keyboard: "Grabación de eventos de teclado",
            microphone: "micrófono",
            settings: "Configuración",
            systemAudio: "Grabación de sonido del sistema.",
            window: "ventana",
            workspace: "Abrir espacio de trabajo",
          },
          wallpaperButtonAria: "Cambiar fondo de pantalla",
        },
        items: [
          {
            title: "Vidrio líquido",
            caption: "Los materiales de vidrio nativos mantienen los controles nítidos y combinan con las modernas superficies macOS.",
          },
          {
            title: "Captura de acceso directo",
            caption: "Grabe atajos de teclado durante la captura y muéstrelos claramente en el vídeo final.",
          },
          {
            title: "Belleza ligera",
            caption: "Aplique efectos de belleza sutiles para una apariencia de cámara más limpia.",
          },
          {
            title: "Isla dinámica",
            caption: "Coloque las exportaciones largas en segundo plano y mantenga el progreso visible desde el primer momento.",
          },
          {
            title: "Capas de efectos",
            caption: "Agregue tantas capas de efectos como necesite, luego mueva, cambie el tamaño y apile cada clip en la línea de tiempo.",
          },
        ],
      },
      faq: {
        eyebrow: "Preguntas frecuentes",
        title: "Preguntas y respuestas",
        items: [
          {
            question: "¿Es ScreenCam una alternativa al Screen Studio?",
            answer:
              "Sí. ScreenCam es una alternativa nativa de macOS Screen Studio para creadores que desean una aplicación más pequeña, menor uso de recursos, exportaciones más rápidas, anclajes de zoom manuales, maquetas de dispositivos, capas más ricas, exportación GIF, exportación Live Photo y una primera experiencia de edición Mac.",
          },
          {
            question: "¿En qué se diferencia el ScreenCam de las grabadoras basadas en navegador?",
            answer:
              "ScreenCam está diseñado para macOS como una aplicación nativa de grabación y edición. El objetivo es un flujo de trabajo compacto, pionero en el Mac, con captura local, controles de edición fluidos y exportación con vista previa precisa.",
          },
          {
            question: "¿Cuál es la versión mínima requerida de macOS?",
            answer: "ScreenCam requiere macOS 15 o posterior.",
          },
          {
            question: "¿Existe una versión para Windows?",
            answer:
              "No ahora mismo. ScreenCam se centra en macOS y no planeamos desarrollar una versión para Windows en el corto plazo.",
          },
          {
            question: "¿Puedo exportar a diferentes formatos?",
            answer:
              "ScreenCam está diseñado para exportar vídeo de alta calidad desde el editor, con controles de encuadre y movimiento reflejados en el resultado final.",
          },
          {
            question: "¿Cómo funciona la función de zoom?",
            answer:
              "Puede agregar puntos de zoom en cualquier lugar de su línea de tiempo. En el modo manual, tienes control total: establece múltiples anclajes con diferentes niveles de zoom y centros de enfoque. Las transiciones incluyen efectos de desenfoque de movimiento suave.",
          },
          {
            question: "¿Admite varios monitores?",
            answer:
              "ScreenCam está diseñado para los flujos de trabajo de grabación de pantalla Mac, incluidas pantallas, ventanas y regiones de captura conectadas.",
          },
        ],
      },
    },
    legal: {
      privacy: {
        eyebrow: "Privacidad",
        title: "Política de privacidad",
        updated: "Última actualización: 3 de junio de 2026",
        sections: [
          {
            title: "Descripción general",
            paragraphs: [
              [
                "ScreenCam es una aplicación nativa de grabación y edición de pantalla macOS. La aplicación está diseñada para procesar grabaciones localmente en su Mac. ScreenCam puede realizar solicitudes de red para la funcionalidad de la aplicación, como el estado de compra de App Store y, cuando usted elige habilitarlo, análisis de uso anónimos opcionales. No utilizamos rastreadores de publicidad en la aplicación.",
              ],
            ],
          },
          {
            title: "Grabaciones y archivos locales.",
            paragraphs: [
              [
                "Las grabaciones de pantalla, el video de la cámara, el audio del micrófono, el audio del sistema, los datos del cursor, los videos exportados, los archivos del espacio de trabajo y los archivos de fondo de pantalla personalizados permanecen en su dispositivo o en las ubicaciones que elija. ScreenCam no carga este contenido a los servidores ScreenCam.",
              ],
            ],
          },
          {
            title: "Análisis de uso anónimo",
            paragraphs: [
              [
                "ScreenCam puede preguntarle si desea compartir análisis de uso anónimos para ayudarnos a comprender qué funciones de grabación y edición funcionan bien. Puede activar o desactivar el uso compartido de análisis en cualquier momento en la aplicación. Si el uso compartido de análisis está deshabilitado, ScreenCam no envía análisis de uso.",
              ],
              [
                "Los análisis se limitan al uso del producto, diagnósticos e información de rendimiento, como interacciones de funciones, versión de la aplicación, versión macOS e información general del dispositivo. Nunca recopilamos contenido de pantalla, audio, video de cámara, archivos de proyecto, nombres de archivos o texto escrito a través de análisis.",
              ],
            ],
          },
          {
            title: "Permisos",
            paragraphs: [
              [
                "ScreenCam puede solicitarle a macOS permisos de grabación de pantalla, micrófono, cámara y acceso a archivos. Estos permisos se utilizan únicamente para proporcionar funciones de grabación, edición, exportación y archivos seleccionados por el usuario. Puede administrar estos permisos en Configuración del sistema.",
              ],
            ],
          },
          {
            title: "Compras",
            paragraphs: [
              [
                "Las suscripciones y compras ScreenCam Pro son procesadas por Apple a través de Mac App Store. ScreenCam lee el estado de compra y suscripción de StoreKit para que la aplicación pueda desbloquear las funciones de Pro. ScreenCam no recibe ni almacena los datos de su tarjeta de pago.",
              ],
            ],
          },
          {
            title: "Sitio web",
            paragraphs: [
              [
                "Cuando visita la pantalla .cam, nuestros proveedores de infraestructura y alojamiento pueden procesar datos de registro del servidor estándar, como la dirección IP, el agente de usuario del navegador, la URL de solicitud y la hora de solicitud para seguridad, diagnóstico y entrega del sitio web. El sitio web no utiliza rastreadores de publicidad.",
              ],
            ],
          },
          {
            title: "Cambios y contacto",
            paragraphs: [
              ["Podemos actualizar esta política a medida que cambie ScreenCam. Si tiene preguntas sobre privacidad, contáctenos en", emailLink, "."],
            ],
          },
        ],
      },
      support: {
        eyebrow: "Soporte",
        title: "Soporte ScreenCam",
        updated: "Para obtener ayuda con ScreenCam para macOS.",
        supportChannelsAria: "Canales de soporte",
        sections: [
          {
            title: "Contacto",
            showSupportChannels: true,
            paragraphs: [
              [
                "Correo electrónico",
                emailLink,
                "para soporte de productos, informes de errores, preguntas sobre compras y comentarios.",
              ],
            ],
          },
          {
            title: "Incluye estos detalles",
            paragraphs: [
              [
                "Al informar un problema, incluya su versión macOS, versión ScreenCam, modelo Mac, configuración de grabación, formato de exportación y una breve descripción de lo sucedido. Las capturas de pantalla o grabaciones breves son útiles cuando el problema es visual.",
              ],
            ],
          },
          {
            title: "App Store compras",
            paragraphs: [
              [
                "ScreenCam se distribuye a través de Mac App Store. Apple maneja la facturación, las suscripciones, las renovaciones, las cancelaciones y los reembolsos a través de su ID de Apple y la configuración de su cuenta App Store.",
              ],
            ],
          },
          {
            title: "Requisitos",
            paragraphs: [
              [
                "ScreenCam está actualmente diseñado para macOS. No existe una versión para Windows y el desarrollo de Windows no está previsto a corto plazo.",
              ],
            ],
          },
          {
            title: "Privacidad",
            paragraphs: [
              [
                "Las grabaciones y los archivos del espacio de trabajo se procesan localmente en su Mac. Lea el",
                { href: "/privacy", text: "Política de privacidad" },
                "para más detalles.",
              ],
            ],
          },
        ],
      },
      terms: {
        eyebrow: "Términos",
        title: "Términos de uso",
        updated: "Última actualización: 20 de mayo de 2026",
        sections: [
          {
            title: "licencia de aplicación",
            paragraphs: [
              [
                "ScreenCam tiene licencia para usted según el Acuerdo de licencia de usuario final estándar (EULA) de Apple, a menos que la ley aplicable exija lo contrario. Puede revisar el CLUF estándar de Apple en",
                appleEulaLink,
                ".",
              ],
            ],
          },
          {
            title: "Suscripciones y compras",
            paragraphs: [
              [
                "Las suscripciones y compras ScreenCam Pro son procesadas por Apple a través de Mac App Store. La facturación de la suscripción, la renovación, la cancelación, los reembolsos y la administración de la cuenta se manejan a través de su ID Apple y la configuración de su cuenta App Store.",
              ],
            ],
          },
          {
            title: "Uso de ScreenCam",
            paragraphs: [
              [
                "Usted es responsable de las grabaciones, archivos y exportaciones que cree con ScreenCam. Grabe, edite y comparta contenido únicamente cuando tenga los derechos y permisos necesarios para hacerlo.",
              ],
            ],
          },
          {
            title: "Privacidad",
            paragraphs: [
              ["Las prácticas de privacidad de ScreenCam se describen en la", { href: "/privacy", text: "Política de privacidad" }, "."],
            ],
          },
          {
            title: "Contacto",
            paragraphs: [
              ["Si tiene preguntas sobre estos términos, contáctenos en", emailLink, "."],
            ],
          },
        ],
      },
    },
    changelog: {
      description: "ProActualizaciones de conductos, correcciones y notas de la versión.",
      eyebrow: "Registro de cambios",
      intro: "ProActualizaciones de conductos, correcciones y notas de la versión.",
      linkVersionLabel: "Enlace a la versión",
      title: "Registro de cambios ScreenCam",
    },
    motionBlurTool: {
      addMaskAria: "Agregar máscara",
      addMaskButton: "máscara",
      angleAria: "ángulo de desenfoque",
      angleLabel: "ángulo",
      blurSettingsTitle: "Configuración de desenfoque",
      chooseImage: "Elige Imagen",
      clearImage: "Imagen clara",
      defaultMaskName: "máscara",
      deleteSelectedMaskAria: "Delete máscara seleccionada",
      description:
        "Cree regiones de desenfoque rectangulares, ajuste la dirección y la intensidad y luego exporte la imagen compuesta.",
      emptyMasksWithImage: "Agrega una máscara para difuminar parte de la imagen.",
      emptyMasksWithoutImage: "Sube una imagen primero.",
      exportButton: "Exportar",
      heightLabel: "altura",
      linearMode: "lineal",
      maskButton: "máscara",
      masksTitle: "Máscaras",
      modeLabel: "Modo",
      nameLabel: "Nombre",
      previewAria: "Vista previa del desenfoque de movimiento",
      replaceImageAria: "Reemplazar imagen",
      selectedMaskEmpty: "Seleccione una máscara para editar la dirección, intensidad, posición y tamaño del desenfoque.",
      sourceTitle: "Fuente",
      strengthAria: "Fuerza de desenfoque",
      strengthLabel: "fuerza",
      title: "Máscara de desenfoque de movimiento",
      toolEyebrow: "Herramienta",
      uniformMode: "uniforme",
      uploadDescription: "Suelta una imagen local aquí o elige un archivo para comenzar a editar.",
      uploadTitle: "Sube una imagen",
      widthLabel: "Ancho",
      xLabel: "X",
      yLabel: "Y",
    },
  },
  fr: {
    common: {
      skipToContent: "Passer au contenu",
    },
    header: {
      appStore: "App Store",
      backToMenuAria: "Retour au menu",
      closeMenuAria: "Fermer le menu",
      homeAria: "Accueil ScreenCam",
      logoAlt: "Logo ScreenCam",
      menuAria: "Ouvrir le menu",
      nav: {
        changelog: "Journal des modifications",
        docs: "Documents",
        privacy: "Confidentialité",
        support: "Assistance",
        terms: "Conditions",
      },
      primaryNavigationAria: "Navigation principale",
    },
    footer: {
      appStoreButton: "Voir sur App Store",
      copyright: "Tous droits réservés.",
      ctaText: "Obtenez ScreenCam à partir du Mac App Store.",
      ctaTitle: "Prêt à mieux capturer ?",
      description: "Enregistrement d'écran natif pour Mac. Rapide, léger, puissant.",
      groups: {
        legal: "Juridique",
        product: "Produit",
        resources: "Ressources",
      },
      language: "Langue",
      legalLinks: {
        privacy: "Confidentialité",
        terms: "Conditions",
      },
      productLinks: {
        controls: "Contrôles",
        export: "Exporter",
        faq: "FAQ",
        zoom: "Zoomer",
      },
      resourceLinks: {
        alternatives: "Alternatives",
        bgm: "BGM",
        changelog: "Journal des modifications",
        docs: "Documents",
        motionBlurMask: "Masque de flou de mouvement",
        support: "Assistance",
      },
      supportChannelsAria: "Canaux d'assistance",
      systemStatus: "Tous les systèmes opérationnels",
    },
    meta: {
      changelog: {
        title: "Journal des modifications - ScreenCam",
        description: "Suivez les notes de version de ScreenCam, les améliorations du produit, les corrections de bugs et l'historique des mises à jour.",
      },
      docs: {
        title: "Documents - ScreenCam",
        description:
          "Apprenez ScreenCam avec des procédures vidéo guidées, des étapes en chapitres et une lecture interactive.",
      },
      home: {
        title: "ScreenCam - Enregistrement d'écran natif macOS avec zoom dirigé",
        description:
          "ScreenCam est un enregistreur d'écran natif macOS pour une capture nette, un contrôle manuel du zoom, des ancres de chronologie, un réglage des courbes et une exportation précise avec un aperçu.",
      },
      motionBlurMask: {
        title: "Outil de masque de flou de mouvement - ScreenCam",
        description:
          "Téléchargez une image, dessinez des masques de flou de mouvement rectangulaires, ajustez la force et la direction du flou, puis exportez le résultat composé.",
      },
      privacy: {
        title: "Politique de confidentialité - ScreenCam",
        description:
          "La politique de confidentialité de ScreenCam explique comment l'application macOS gère les enregistrements, les autorisations, les analyses facultatives, les achats et les données du site Web.",
      },
      support: {
        title: "Assistance-ScreenCam",
        description:
          "Obtenez de l'aide sur ScreenCam pour macOS, y compris le contact de l'assistance, les achats de App Store, les exigences et le dépannage.",
      },
      terms: {
        title: "Conditions d'utilisation - ScreenCam",
        description:
          "Les conditions d'utilisation de ScreenCam expliquent la licence de l'application, les abonnements, les achats et les coordonnées de l'assistance.",
      },
    },
    docs: {
      chaptersTitle: "Étapes",
      description:
        "Regardez le flux de travail, puis passez directement à l'étape dont vous avez besoin.",
      emptyVideoDescription:
        "Déposez le fichier de démonstration dans public/docs pour cette fonctionnalité, puis ajoutez le chemin vidéo et les horodatages calibrés à la chronologie JSON.",
      emptyVideoTitle: "Vidéo à venir",
      eyebrow: "Documents",
      featureListAria: "Sujets de documentation",
      playback: {
        next: "Étape suivante",
        pause: "Pause",
        play: "Jouer",
        previous: "Étape précédente",
        restart: "Redémarrer",
      },
      progressLabel: "Progress",
      title: "Guides ScreenCam.",
      videoAriaLabel: "Vidéo de démonstration de la documentation",
      features: {
        basics: {
          title: "Les bases",
          summary: "Familiarisez-vous avec l'aperçu, la barre latérale, les panneaux de paramètres et les pistes de la chronologie.",
          chapters: {
            preview: {
              title: "Aperçu",
              description: "Utilisez la zone d'aperçu pour visualiser le résultat final de l'exportation en temps réel.",
            },
            sidebar: {
              title: "Barre latérale",
              description: "Les principaux panneaux de configuration se trouvent dans la barre latérale.",
            },
            "screen-settings": {
              title: "Paramètres de l'écran",
              description: "Configurez le contenu de l'écran, y compris le fond d'écran, les marges, la taille et les options de mise en page associées.",
            },
            "device-settings": {
              title: "Paramètres de l'appareil",
              description: "Enveloppez l'écran dans un cadre d'appareil, choisissez l'appareil et ajustez le style du cadre tel que l'arrière-plan.",
            },
            "keyboard-settings": {
              title: "Paramètres du clavier",
              description: "Définissez la façon dont les raccourcis enregistrés apparaissent, y compris leur taille et leur position par défaut.",
            },
            "beauty-settings": {
              title: "Paramètres de beauté",
              description: "Une fois l'enregistrement de la caméra activé, appliquez de subtiles améliorations de portrait à l'image de la caméra.",
            },
            "mouse-settings": {
              title: "Paramètres de la souris",
              description: "Ajustez le style visuel de base du pointeur de la souris.",
            },
            "animation-settings": {
              title: "Paramètres d'animation",
              description: "Personnalisez le mouvement de la caméra, y compris la force du flou de mouvement et les courbes personnalisées.",
            },
            tracks: {
              title: "Pistes",
              description: "Les événements d’enregistrement, de caméra, d’audio système, de microphone, de zoom et de clavier apparaissent ici sous forme de clips de chronologie.",
            },
          },
        },
        "preview-control": {
          title: "Contrôles d'aperçu",
          summary: "Ajustez la vitesse de lecture de l'aperçu, le volume de l'aperçu et le zoom de la piste temporelle pendant l'édition.",
          chapters: {
            "playback-rate": {
              title: "Vitesse de lecture",
              description:
                "Ajustez ici la vitesse de lecture de l’aperçu. **Cela affecte uniquement l'étape de prévisualisation et n'affecte pas l'exportation.**",
            },
            volume: {
              title: "Volume",
              description:
                "Ajustez le son que vous entendez pendant l'aperçu. **Cela affecte uniquement l'étape de prévisualisation et n'affecte pas l'exportation.**",
            },
            "track-zoom": {
              title: "Zoom sur piste",
              description: "Modifiez le niveau de zoom des pistes de la timeline.",
            },
          },
        },
        "track-management": {
          title: "Gestion des pistes",
          summary: "Ouvrez les paramètres des pistes, réorganisez les pistes, masquez-les, supprimez-les et restaurez les pistes supprimées.",
          chapters: {
            entry: {
              title: "Entrée",
              description: "Ouvrez le panneau des paramètres de piste sur le côté gauche des pistes.",
            },
            sort: {
              title: "Trier",
              description:
                "Faites glisser la première poignée de tri {{icon:grip}} pour réorganiser les pistes. Cette commande est enregistrée comme préférence et réutilisée la prochaine fois.",
            },
            hide: {
              title: "Masquer",
              description:
                "Cliquez sur {{icon:eye}} pour masquer les pistes dont vous n'avez pas besoin. **Cela n'affecte pas l'exportation.**",
            },
            delete: {
              title: "Delete",
              description:
                "Cliquez sur {{icon:trash}} pour supprimer les pistes dont vous n'avez pas besoin. **Cela affecte l'exportation finale.**",
            },
            restore: {
              title: "Restaurer",
              description:
                "Les pistes Deleted apparaissent séparément ci-dessous, où vous pouvez les restaurer à tout moment.",
            },
          },
        },
        "screen-settings": {
          title: "Paramètres d'écran",
          summary: "Ajustez l'écran enregistré, son arrière-plan, ses marges et le comportement de la taille de sortie.",
          chapters: {
            wallpaper: {
              title: "Fond d'écran",
              description:
                "Choisissez les fonds d'écran lus sur le système, y compris les fonds d'écran dynamiques. Ils ne sont pas fournis avec l'application, ne prennent pas d'espace dans l'application et conservent la qualité de fond d'écran la plus élevée. Cliquez sur Personnalisé pour configurer davantage de dossiers de fonds d'écran dans Paramètres.",
            },
            "no-background": {
              title: "Aucun arrière-plan",
              description:
                "Ne choisissez aucun arrière-plan, ce qui est particulièrement important pour l’enregistrement en plein écran ou l’enregistrement dans une zone personnalisée. **Actuellement, le passage à l'absence de fond d'écran conserve les paramètres de marge ou de taille précédents par défaut, vous devez donc les définir manuellement sur 0 pour supprimer les bordures noires.**",
            },
            gradient: {
              title: "Dégradé",
              description:
                "Choisissez un dégradé linéaire prédéfini ou modifiez librement les ancres et les couleurs du dégradé, en ajoutant ou en supprimant des ancres selon vos besoins.",
            },
            "solid-color": {
              title: "Couleur unie",
              description: "Choisissez une seule couleur comme arrière-plan.",
            },
            "custom-background": {
              title: "Personnalisé",
              description: "Téléchargez votre propre photo ou vidéo comme arrière-plan.",
            },
            "adaptive-size": {
              title: "Taille d'écran adaptative",
              description:
                "Dans ce mode, la taille de l'écran est contrôlée en ajustant les marges verticales et horizontales.",
            },
            "sync-margins": {
              title: "Marges de synchronisation",
              description:
                "Activez les marges de synchronisation pour que les quatre côtés restent cohérents. Désactivez-le pour contrôler séparément les marges verticales et horizontales. **Si le rapport hauteur/largeur est activé, l'image finale est visuellement conforme à ce rapport, les marges peuvent donc sembler différentes des valeurs saisies.**",
            },
            "fixed-size": {
              title: "Taille d'écran fixe",
              description:
                "Dans ce mode, entrez manuellement la taille de l'écran. **Si le rapport hauteur/largeur est activé, le canevas s'étend vers l'extérieur jusqu'au rapport cible.**",
            },
          },
        },
        "workspace-file": {
          title: "Fichier Project",
          summary:
            "Un fichier de projet contient tous les fichiers bruts générés pour un enregistrement terminé, y compris chaque actif et configuration. Vous pouvez le partager, et **il est automatiquement créé et enregistré dans un emplacement par défaut une fois l'enregistrement terminé.**",
          chapters: {
            "default-directory": {
              title: "Changer le répertoire par défaut",
              description:
                "Ouvrez <kbd>ScreenCam</kbd> > <kbd>Settings</kbd> > <kbd>Recording</kbd> > <kbd>Default workspace directory</kbd>, puis choisissez le dossier par défaut.",
            },
            "recent-projects": {
              title: "Ouvrir les projets récents",
              description: "Utilisez <kbd>File</kbd> > <kbd>Recent</kbd>.",
            },
            "default-directory-projects": {
              title: "Ouvrir les projets à l'emplacement par défaut",
              description:
                "Utilisez <kbd>File</kbd> > <kbd>Default Directory</kbd>.",
            },
            "show-in-finder": {
              title: "Afficher le fichier actuel dans Finder",
              description:
                "Cliquez sur le nom du fichier de projet en haut de l'éditeur ou utilisez <kbd>File</kbd> > <kbd>Show dans Finder</kbd>.",
            },
            "manual-save": {
              title: "Enregistrer manuellement",
              description:
                "Utilisez <kbd>File</kbd> > <kbd>Save</kbd> ou appuyez sur <kbd>⌘</kbd><kbd>S</kbd> pour enregistrer manuellement. Dans la plupart des cas, le projet est enregistré automatiquement.",
            },
            "save-as": {
              title: "Enregistrer sous",
              description:
                "Utilisez <kbd>File</kbd> > <kbd>Save As</kbd>, ou appuyez sur <kbd>⌘</kbd><kbd>⇧</kbd><kbd>S</kbd> pour enregistrer une copie dans un dossier personnalisé.",
            },
          },
        },
        record: {
          title: "Enregistrer",
          summary: "Configurez une capture, choisissez la source et démarrez l'enregistrement.",
          chapters: {
            "prepare-capture": {
              title: "Préparez la capture",
              description: "Ouvrez ScreenCam et confirmez que les commandes d'enregistrement sont prêtes avant de sélectionner une source.",
            },
            "choose-source": {
              title: "Choisissez une source",
              description: "Choisissez les options d’affichage, de fenêtre, de zone, de caméra, de microphone et d’audio système pour l’enregistrement.",
            },
            "start-recording": {
              title: "Commencer l'enregistrement",
              description: "Démarrez la capture et vérifiez l’état de l’enregistrement avant de passer au flux de travail.",
            },
          },
        },
        zoom: {
          title: "Zoomer",
          summary: "Ajoutez des ancres de chronologie et ajustez la façon dont la caméra se déplace tout au long de l'enregistrement.",
          chapters: {
            "zoom-track": {
              title: "Zoom sur la piste",
              description: "Créez et supprimez librement des clips de zoom sur la piste de zoom.",
            },
            "delete-clip": {
              title: "Delete",
              description: "Sélectionnez un clip, puis appuyez sur Backspace ou Delete pour le supprimer.",
              descriptionHtml:
                "Sélectionnez un clip, puis appuyez sur <kbd class=\"docs-key\">Backspace</kbd> ou <kbd class=\"docs-key\">Delete</kbd> pour le supprimer.",
            },
            "create-clip": {
              title: "Créer",
              description: "Cliquez ou faites glisser sur une zone vide pour créer un nouveau clip de zoom.",
            },
            "merge-clips": {
              title: "Fusionner",
              description: "Redimensionnez ou faites glisser un clip jusqu'à ce qu'il croise un autre clip, puis relâchez pour confirmer la fusion.",
            },
            "manual-mode": {
              title: "Mode manuel",
              description: "Passez du mouvement automatique au mode manuel et personnalisez le nombre, le centre et l'échelle de chaque ancre.",
            },
            "select-anchor": {
              title: "Sélectionnez une ancre",
              description: "Sélectionnez une ancre pour modifier ses paramètres de zoom individuels.",
            },
            "adjust-center": {
              title: "Ajuster le centre",
              description: "Faites glisser directement dans l'aperçu pour définir le centre visuel du zoom.",
            },
            "adjust-scale-wheel": {
              title: "Ajuster l'échelle",
              description: "Utilisez la molette de la souris dans l'aperçu pour contrôler l'échelle de zoom.",
            },
            "adjust-scale-panel": {
              title: "Ajuster l'échelle dans les paramètres",
              description: "Sélectionnez une ancre, puis réglez le curseur d'échelle dans le panneau de paramètres de droite.",
            },
          },
        },
        camera: {
          title: "Appareil photo",
          summary: "Façonnez la superposition de la caméra et appliquez des ajustements d’apparence légers.",
          chapters: {
            "enable-camera": {
              title: "Activer la caméra",
              description: "Allumez la couche de caméra et positionnez-la là où elle prend en charge l'enregistrement.",
            },
            "shape-frame": {
              title: "Façonner le cadre",
              description: "Basculez entre les formes de cadre et dimensionnez la superposition de caméra pour la scène.",
            },
            "apply-beauty": {
              title: "Appliquer des effets de beauté",
              description: "Ajustez les paramètres d’apparence subtils tout en gardant l’aperçu aligné sur l’exportation finale.",
            },
          },
        },
        shortcuts: {
          title: "Raccourcis",
          summary: "Utilisez les actions du clavier pour contrôler la capture sans interrompre le flux.",
          chapters: {
            "capture-shortcut": {
              title: "Commencez par un raccourci",
              description: "Déclenchez les commandes d’enregistrement à partir du clavier au lieu d’accéder à la barre d’outils.",
            },
            "pause-resume": {
              title: "Mettre en pause ou reprendre",
              description: "Utilisez des actions de raccourci pour suspendre et poursuivre la capture lors d'enregistrements plus longs.",
            },
            "finish-recording": {
              title: "Terminez la prise",
              description: "Arrêtez l'enregistrement et passez à l'éditeur sans perdre le contexte.",
            },
          },
        },
        export: {
          title: "Exporter",
          summary: "Examinez le résultat, choisissez les paramètres de sortie et exportez l'enregistrement.",
          chapters: {
            "choose-format": {
              title: "Choisissez le format",
              description: "Sélectionnez le format d'exportation et les paramètres de sortie pour la destination.",
            },
            "review-preview": {
              title: "Revoir l'aperçu",
              description: "Vérifiez l'aperçu final avant de rendre le fichier.",
            },
            "export-file": {
              title: "Exporter le fichier",
              description: "Effectuez le rendu de l'enregistrement et enregistrez le résultat exporté.",
            },
          },
        },
      },
    },
    home: {
      screenStudioAlternative: {
        eyebrow: "Screen Studio Alternative",
        title: "Besoin d'un enregistreur d'écran Mac plus léger avec un contrôle manuel plus profond ?",
        description:
          "Comparez ScreenCam avec Screen Studio en termes de taille de l'application, d'utilisation du processeur et de la mémoire, de la vitesse d'exportation, des ancres de zoom manuel, des calques, des maquettes d'appareil et des formats d'exportation.",
        cta: "Alternative au Screen Studio pour le Mac",
      },
      structuredDataFeatureList: [
        "Enregistrement d'écran natif macOS",
        "Ancres de zoom manuel",
        "Courbes d'animation personnalisées",
        "Maquettes d'appareils",
        "Couches de mosaïque, de texte, de focus et d'images personnalisées",
        "Transitions de flou de mouvement",
        "Exportation GIF",
        "Exportation Live Photo",
        "Effets de beauté de l'appareil photo",
        "Exportation avec un aperçu précis",
      ],
      hero: {
        appStoreButton: "Voir sur App Store",
        builtWithLabel: "Construit avec",
        builtWithValue: "100% natif",
        systemLabel: "Système",
        systemValue: "macOS 15+",
        tagline: "Enregistrement haute résolution avec une caméra que vous pouvez façonner après la prise.",
        titleLines: [
          ["Capturer", "Sharp."],
          ["Direct", "Le cadre."],
        ],
      },
      zoom: {
        canvasLabels: {
          autoPlayingDemo: "Démo à lecture automatique",
          playMarker: "Jouer",
          previewMarker: "Aperçu",
          recordingClip: "Enregistrement",
          recordingTrack: "Enregistrement",
          timelinePreview: "Aperçu de la chronologie",
          zoomClip: "Zoom automatique",
          zoomTrack: "Zoomer",
        },
        features: [
          {
            title: "Zoom dynamique",
            description: "Le mouvement de la caméra suit le même timing à ressort que celui utilisé par les exportations ScreenCam.",
          },
          {
            title: "Aperçu de la chronologie",
            description: "Survolez la piste d'enregistrement ou de zoom pour parcourir l'image d'aperçu exacte.",
          },
          {
            title: "Flou de mouvement",
            description: "Les états de zoom, de panoramique et de clic sont échantillonnés avec un flou de type obturateur.",
          },
        ],
        subtitle: "Zoomez avec le flou de mouvement.",
        timelineAria: "Pistes d'aperçu de la chronologie",
        title: "Concentrez-vous sur ce qui compte.",
      },
      deviceMockups: {
        description:
          "Exportez avec de superbes images d’appareil. iPhone, Mac, Studio Display - votre contenu, parfaitement présenté.",
        eyebrow: "Exporter les Option",
        formats: ["Résolution originale", "Live Photo", "MP4 / MOUVEMENT"],
        imageAlt: {
          iPhone: "iPhone 17 Pro Max.",
          macBook: "Application ScreenCam exécutée sur MacBook Pro",
          studioDisplay: "ScreenCam exécuté sur Studio Display avec MacBook",
        },
        title: "Magnifique sur tous les écrans.",
      },
      controls: {
        body:
          "Le mode manuel vous offre une totale liberté de création. Ajoutez plusieurs ancres à un seul clip de zoom, chacune avec sa propre échelle et son propre point central.",
        centerLabel: "Centre",
        dragCenter: "Faites glisser pour ajuster le centre",
        eyebrow: "Contrôles avancés",
        features: [
          "Faites glisser les ancres pour les repositionner sur la chronologie",
          "Ajustez l'échelle de 1x à 5x par ancre",
          "Définir un centre de mise au point personnalisé pour chaque zoom",
          "Transitions fluides entre les ancres",
        ],
        pauseAria: "Suspendre la lecture de la chronologie simulée",
        pauseTitle: "Pause",
        playAria: "Jouer une simulation de lecture de la chronologie",
        playTitle: "Jouer",
        scaleAria: "Échelle",
        scaleLabel: "Échelle",
        titleMuted: "chaque point de zoom.",
        titleStart: "Contrôle total sur",
      },
      performance: {
        cta: "Afficher les données de référence complètes",
        metrics: {
          appSize: "Taille de l'application",
          appSizeNote: "environ 20 Mo contre 600 Mo",
          cpuUsage: "Utilisation du processeur",
          exportTime: "Temps d'exportation",
          exportTimeNote: "plus court est plus rapide",
          memory: "Mémoire",
          others: "D'autres",
          screenCam: "ScreenCam",
        },
        subtitle: "Pas d'électron. Aucune vue Web. Performances natives pures.",
        title: "Natif signifie rapide.",
      },
      featureCards: {
        eyebrow: "More Caractéristiques",
        title: "Des petits détails, prêts pour de vrais flux de travail.",
        subtitle: "Des touches natives qui rendent l'enregistrement rapide, soigné et Mac-first.",
        beautyThumb: {
          beforeLabel: "Beauté Off",
          afterLabel: "Beauté sur",
          disclosure:
            "Portrait généré par l'IA, utilisé uniquement pour démontrer le véritable effet de beauté.",
          enterFloatingAria: "Afficher sous forme de fenêtre de caméra flottante",
          exitFloatingAria: "Remettre la fenêtre de la caméra en aperçu complet",
          pauseAria: "Suspendre la démo de comparaison beauté",
          playAria: "Jouer à la démo de comparaison beauté",
          shapeCycleAria: "Changer la forme de la fenêtre flottante",
          shapeLabels: {
            circle: "Cercle",
            square: "Carré arrondi",
            wide: "16:9",
          },
        },
        dynamicIslandThumb: {
          ariaLabel: "Aperçu de la tâche en arrière-plan de Dynamic Island",
          materialLabel: "Matériau d'encoche",
          modeLabels: {
            black: "Noir",
            glass: "Verre",
          },
          tasks: [
            {
              title: "Film de lancement ScreenCam",
              detail: "Prêt à être révélé dans Finder.",
              primaryAction: "Ouvrir Finder",
              secondary: "Terminé",
              secondaryAction: "Terminé",
              size: "384 Mo",
            },
            {
              title: "Exportation du didacticiel 4K",
              detail: "Encodage H.265 avec couches de caméra et de curseur.",
              primaryAction: "Ouvrir Finder",
              secondary: "il reste 2 m",
              secondaryAction: "Terminé",
              size: "1,2 Go",
            },
            {
              title: "Compression d'aperçu GIF",
              detail: "Optimisation des images pour un clip partageable plus petit.",
              primaryAction: "Ouvrir Finder",
              secondary: "Il reste 42 secondes",
              secondaryAction: "Terminé",
              size: "18 Mo",
            },
          ],
          wallpaperButtonAria: "Changer le fond d'écran",
        },
        effectLayersThumb: {
          ariaLabel: "Aperçu de la chronologie des calques d'effet",
          dragHint: "Faites glisser vers la piste pour ajouter",
          effects: [
            {
              id: "mosaic",
              title: "Mosaïque",
              description: "Pixelisez les zones sensibles au-dessus de l'enregistrement.",
              clipLabel: "Mosaïque",
            },
            {
              id: "focus",
              title: "Concentrez-vous",
              description: "Mettez en surbrillance une région tout en gardant le contexte visible.",
              clipLabel: "Concentrez-vous",
            },
            {
              id: "text",
              title: "Texte",
              description: "Ajoutez un calque de texte n'importe où dans la modification.",
              clipLabel: "Texte",
            },
            {
              id: "image",
              title: "Images",
              description: "Placez une superposition d'image en tant que calque chronométré.",
              clipLabel: "Images",
            },
          ],
        },
        glassThumb: {
          modeLabels: {
            clear: "Effacer",
            regular: "régulier",
          },
          toolbarItems: {
            area: "Zone",
            camera: "Appareil photo",
            close: "Masquer ScreenCam",
            display: "Affichage",
            iphone: "iPhone",
            keyboard: "Enregistrement d'événements de clavier",
            microphone: "Micro",
            settings: "Paramètres",
            systemAudio: "Enregistrement sonore du système",
            window: "Fenêtre",
            workspace: "Espace de travail ouvert",
          },
          wallpaperButtonAria: "Changer le fond d'écran",
        },
        items: [
          {
            title: "Verre liquide",
            caption: "Les matériaux en verre natif maintiennent les commandes nettes tout en s'adaptant aux surfaces modernes macOS.",
          },
          {
            title: "Capture de raccourci",
            caption: "Enregistrez les raccourcis clavier pendant la capture et affichez-les clairement dans la vidéo finale.",
          },
          {
            title: "Beauté légère",
            caption: "Appliquez des effets de beauté subtils pour un look plus propre de l'appareil photo.",
          },
          {
            title: "Île dynamique",
            caption: "Mettez les exportations longues en arrière-plan et gardez les progrès visibles depuis l'encoche.",
          },
          {
            title: "Calques d'effet",
            caption: "Ajoutez autant de calques d’effets que nécessaire, puis déplacez, redimensionnez et empilez chaque clip sur la timeline.",
          },
        ],
      },
      faq: {
        eyebrow: "FAQ",
        title: "Questions et réponses",
        items: [
          {
            question: "ScreenCam est-il une alternative à Screen Studio ?",
            answer:
              "Oui. ScreenCam est une alternative native à macOS Screen Studio pour les créateurs qui souhaitent une empreinte d'application plus petite, une utilisation réduite des ressources, des exportations plus rapides, des ancres de zoom manuel, des maquettes d'appareil, des couches plus riches, une exportation GIF, une exportation Live Photo et une première expérience d'édition Mac.",
          },
          {
            question: "En quoi le ScreenCam est-il différent des enregistreurs basés sur navigateur ?",
            answer:
              "ScreenCam est conçu pour macOS en tant qu'application native d'enregistrement et d'édition. L'objectif est un flux de travail compact, comparable à celui du Mac, avec une capture locale, des commandes d'édition fluides et une exportation précise avec un aperçu précis.",
          },
          {
            question: "Quelle est la version minimale de macOS requise ?",
            answer: "ScreenCam nécessite macOS 15 ou version ultérieure.",
          },
          {
            question: "Existe-t-il une version Windows ?",
            answer:
              "Pas maintenant. ScreenCam se concentre sur macOS, et nous ne prévoyons pas de développer une version Windows à court terme.",
          },
          {
            question: "Puis-je exporter vers différents formats ?",
            answer:
              "ScreenCam est conçu pour l'exportation vidéo de haute qualité depuis l'éditeur, avec des commandes de cadrage et de mouvement reflétées dans la sortie finale.",
          },
          {
            question: "Comment fonctionne la fonction zoom ?",
            answer:
              "Vous pouvez ajouter des points de zoom n'importe où sur votre timeline. En mode manuel, vous avez un contrôle total : définissez plusieurs ancres avec différents niveaux de zoom et centres de mise au point. Les transitions incluent des effets de flou de mouvement fluides.",
          },
          {
            question: "Est-ce qu'il prend en charge plusieurs moniteurs ?",
            answer:
              "ScreenCam est conçu pour les flux de travail d'enregistrement d'écran Mac, y compris les écrans connectés, les fenêtres et les régions de capture.",
          },
        ],
      },
    },
    legal: {
      privacy: {
        eyebrow: "Confidentialité",
        title: "Politique de confidentialité",
        updated: "Dernière mise à jour : 3 juin 2026",
        sections: [
          {
            title: "Aperçu",
            paragraphs: [
              [
                "ScreenCam est une application native d'enregistrement et d'édition d'écran macOS. L'application est conçue pour traiter les enregistrements localement sur votre Mac. ScreenCam peut effectuer des requêtes réseau pour des fonctionnalités d'application telles que le statut d'achat de App Store et, lorsque vous choisissez de l'activer, des analyses d'utilisation anonymes facultatives. Nous n'utilisons pas de trackers publicitaires dans l'application.",
              ],
            ],
          },
          {
            title: "Enregistrements et fichiers locaux",
            paragraphs: [
              [
                "Les enregistrements d'écran, la vidéo de la caméra, l'audio du microphone, l'audio du système, les données du curseur, les vidéos exportées, les fichiers de l'espace de travail et les fichiers de fond d'écran personnalisés restent sur votre appareil ou dans les emplacements de votre choix. ScreenCam ne télécharge pas ce contenu sur les serveurs ScreenCam.",
              ],
            ],
          },
          {
            title: "Analyse d'utilisation anonyme",
            paragraphs: [
              [
                "ScreenCam peut vous demander si vous souhaitez partager des analyses d'utilisation anonymes pour nous aider à comprendre quelles fonctionnalités d'enregistrement et d'édition fonctionnent bien. Vous pouvez activer ou désactiver le partage d'analyses à tout moment dans l'application. Si le partage d'analyses est désactivé, ScreenCam n'envoie pas d'analyses d'utilisation.",
              ],
              [
                "Les analyses se limitent à l'utilisation du produit, aux diagnostics et aux informations sur les performances, telles que les interactions avec les fonctionnalités, la version de l'application, la version macOS et les informations générales sur l'appareil. Nous ne collectons jamais le contenu de l'écran, l'audio, la vidéo de la caméra, les fichiers de projet, les noms de fichiers ou le texte saisi via des analyses.",
              ],
            ],
          },
          {
            title: "Autorisations",
            paragraphs: [
              [
                "ScreenCam peut demander à macOS les autorisations d'enregistrement d'écran, de microphone, de caméra et d'accès aux fichiers. Ces autorisations sont utilisées uniquement pour fournir des fonctionnalités d'enregistrement, d'édition, d'exportation et de fichiers sélectionnés par l'utilisateur. Vous pouvez gérer ces autorisations dans les paramètres système.",
              ],
            ],
          },
          {
            title: "Achats",
            paragraphs: [
              [
                "Les abonnements et achats ScreenCam Pro sont traités par Apple via le Mac App Store. ScreenCam lit le statut d'achat et d'abonnement de StoreKit afin que l'application puisse déverrouiller les fonctionnalités de Pro. ScreenCam ne reçoit ni ne stocke les détails de votre carte de paiement.",
              ],
            ],
          },
          {
            title: "Site Web",
            paragraphs: [
              [
                "Lorsque vous visitez thescreen.cam, nos fournisseurs d'hébergement et d'infrastructure peuvent traiter les données de journal de serveur standard telles que l'adresse IP, l'agent utilisateur du navigateur, l'URL de la demande et l'heure de la demande pour la sécurité, les diagnostics et la livraison du site Web. Le site Internet n'utilise pas de trackers publicitaires.",
              ],
            ],
          },
          {
            title: "Modifications et contact",
            paragraphs: [
              ["Nous pouvons mettre à jour cette politique à mesure que ScreenCam change. Si vous avez des questions sur la confidentialité, contactez-nous à", emailLink, "."],
            ],
          },
        ],
      },
      support: {
        eyebrow: "Assistance",
        title: "ScreenCam Prise en charge",
        updated: "Pour obtenir de l'aide sur ScreenCam pour macOS.",
        supportChannelsAria: "Canaux d'assistance",
        sections: [
          {
            title: "Contacter",
            showSupportChannels: true,
            paragraphs: [
              [
                "Courriel",
                emailLink,
                "pour l'assistance produit, les rapports de bogues, les questions d'achat et les commentaires.",
              ],
            ],
          },
          {
            title: "Inclure ces détails",
            paragraphs: [
              [
                "Lorsque vous signalez un problème, indiquez votre version macOS, votre version ScreenCam, votre modèle Mac, vos paramètres d'enregistrement, votre format d'exportation et une brève description de ce qui s'est passé. Les captures d'écran ou les courts enregistrements sont utiles lorsque le problème est visuel.",
              ],
            ],
          },
          {
            title: "App Store achats",
            paragraphs: [
              [
                "ScreenCam est distribué via le Mac App Store. La facturation, les abonnements, les renouvellements, les annulations et les remboursements sont gérés par Apple via votre identifiant Apple et les paramètres de votre compte App Store.",
              ],
            ],
          },
          {
            title: "Exigences",
            paragraphs: [
              [
                "ScreenCam est actuellement construit pour macOS. Il n’existe pas de version Windows, et le développement de Windows n’est pas prévu à court terme.",
              ],
            ],
          },
          {
            title: "Confidentialité",
            paragraphs: [
              [
                "Les enregistrements et les fichiers de l'espace de travail sont traités localement sur votre Mac. Lire le",
                { href: "/privacy", text: "Politique de confidentialité" },
                "pour plus de détails.",
              ],
            ],
          },
        ],
      },
      terms: {
        eyebrow: "Conditions",
        title: "Conditions d'utilisation",
        updated: "Dernière mise à jour : 20 mai 2026",
        sections: [
          {
            title: "Licence d'application",
            paragraphs: [
              [
                "ScreenCam vous est concédé sous licence en vertu du contrat de licence utilisateur final standard (CLUF) de Apple, sauf disposition contraire de la loi applicable. Vous pouvez consulter le CLUF standard de Apple sur",
                appleEulaLink,
                ".",
              ],
            ],
          },
          {
            title: "Abonnements et achats",
            paragraphs: [
              [
                "Les abonnements et achats ScreenCam Pro sont traités par Apple via le Mac App Store. La facturation, le renouvellement, l'annulation, les remboursements et la gestion du compte des abonnements sont gérés via votre identifiant Apple et les paramètres de votre compte App Store.",
              ],
            ],
          },
          {
            title: "Utilisation de ScreenCam",
            paragraphs: [
              [
                "Vous êtes responsable des enregistrements, fichiers et exportations que vous créez avec ScreenCam. Enregistrez, modifiez et partagez du contenu uniquement lorsque vous disposez des droits et autorisations requis pour le faire.",
              ],
            ],
          },
          {
            title: "Confidentialité",
            paragraphs: [
              ["Les pratiques de confidentialité de ScreenCam sont décrites dans le", { href: "/privacy", text: "Politique de confidentialité" }, "."],
            ],
          },
          {
            title: "Contacter",
            paragraphs: [
              ["Si vous avez des questions sur ces conditions, contactez-nous à", emailLink, "."],
            ],
          },
        ],
      },
    },
    changelog: {
      description: "Product mises à jour, correctifs et notes de version.",
      eyebrow: "Journal des modifications",
      intro: "Product mises à jour, correctifs et notes de version.",
      linkVersionLabel: "Lien vers la version",
      title: "Journal des modifications ScreenCam",
    },
    motionBlurTool: {
      addMaskAria: "Ajouter un masque",
      addMaskButton: "Masque",
      angleAria: "Angle de flou",
      angleLabel: "Angle",
      blurSettingsTitle: "Paramètres de flou",
      chooseImage: "Choisir une image",
      clearImage: "Image claire",
      defaultMaskName: "Masque",
      deleteSelectedMaskAria: "Delete masque sélectionné",
      description:
        "Créez des zones de flou rectangulaires, ajustez la direction et l'intensité, puis exportez l'image composée.",
      emptyMasksWithImage: "Ajoutez un masque pour flouter une partie de l'image.",
      emptyMasksWithoutImage: "Téléchargez d'abord une image.",
      exportButton: "Exporter",
      heightLabel: "Hauteur",
      linearMode: "Linéaire",
      maskButton: "Masque",
      masksTitle: "Masques",
      modeLabel: "Mode",
      nameLabel: "Nom",
      previewAria: "Aperçu du flou de mouvement",
      replaceImageAria: "Remplacer l'image",
      selectedMaskEmpty: "Sélectionnez un masque pour modifier la direction, l'intensité, la position et la taille du flou.",
      sourceTitle: "Origine",
      strengthAria: "Force du flou",
      strengthLabel: "Force",
      title: "Masque de flou de mouvement",
      toolEyebrow: "Outil",
      uniformMode: "Uniforme",
      uploadDescription: "Déposez une image locale ici ou choisissez un fichier pour commencer l'édition.",
      uploadTitle: "Télécharger une image",
      widthLabel: "Largeur",
      xLabel: "X",
      yLabel: "Y",
    },
  },
  "pt-BR": {
    common: {
      skipToContent: "Pular para o conteúdo",
    },
    header: {
      appStore: "App Store",
      backToMenuAria: "Voltar ao cardápio",
      closeMenuAria: "Fechar menu",
      homeAria: "Início do ScreenCam",
      logoAlt: "ScreenCam Logo",
      menuAria: "Abrir menu",
      nav: {
        changelog: "Registro de alterações",
        docs: "Documentos",
        privacy: "Privacidade",
        support: "Suporte",
        terms: "Termos",
      },
      primaryNavigationAria: "Navegação primária",
    },
    footer: {
      appStoreButton: "Ver em App Store",
      copyright: "Todos os direitos reservados.",
      ctaText: "Obtenha ScreenCam do Mac App Store.",
      ctaTitle: "Pronto para capturar melhor?",
      description: "Gravação de tela nativa para Mac. Rápido, leve, poderoso.",
      groups: {
        legal: "Jurídico",
        product: "Produto",
        resources: "Recursos",
      },
      language: "Idioma",
      legalLinks: {
        privacy: "Privacidade",
        terms: "Termos",
      },
      productLinks: {
        controls: "Controles",
        export: "Exportar",
        faq: "Perguntas frequentes",
        zoom: "Zoom",
      },
      resourceLinks: {
        alternatives: "Alternativas",
        bgm: "BGM",
        changelog: "Registro de alterações",
        docs: "Documentos",
        motionBlurMask: "Máscara de desfoque de movimento",
        support: "Suporte",
      },
      supportChannelsAria: "Canais de suporte",
      systemStatus: "Todos os sistemas operando normalmente",
    },
    meta: {
      changelog: {
        title: "Registro de alterações - ScreenCam",
        description: "Siga as notas de versão do ScreenCam, melhorias do produto, correções de bugs e histórico de atualizações.",
      },
      docs: {
        title: "Documentos - ScreenCam",
        description:
          "Aprenda ScreenCam com tutoriais em vídeo guiados, etapas em capítulos e reprodução interativa.",
      },
      home: {
        title: "ScreenCam - Gravação de tela nativa macOS com zoom direcionado",
        description:
          "ScreenCam é um gravador de tela nativo macOS para captura nítida, controle de zoom manual, âncoras de linha de tempo, ajuste de curva e exportação com visualização precisa.",
      },
      motionBlurMask: {
        title: "Ferramenta de máscara de desfoque de movimento - ScreenCam",
        description:
          "Carregue uma imagem, desenhe máscaras retangulares de desfoque de movimento, ajuste a intensidade e a direção do desfoque e exporte o resultado composto.",
      },
      privacy: {
        title: "Política de Privacidade - ScreenCam",
        description:
          "A política de privacidade do ScreenCam explica como o aplicativo macOS lida com gravações, permissões, análises opcionais, compras e dados do site.",
      },
      support: {
        title: "Suporte - ScreenCam",
        description:
          "Obtenha ajuda com ScreenCam para macOS, incluindo contato de suporte, compras de App Store, requisitos e solução de problemas.",
      },
      terms: {
        title: "Termos de Uso - ScreenCam",
        description:
          "Os termos de uso do ScreenCam explicam a licença do aplicativo, assinaturas, compras e informações de contato de suporte.",
      },
    },
    docs: {
      chaptersTitle: "Passos",
      description:
        "Observe o fluxo de trabalho e vá direto para a etapa necessária.",
      emptyVideoDescription:
        "Coloque o arquivo de demonstração em public/docs para esse recurso e adicione o caminho do vídeo e os carimbos de data/hora calibrados ao JSON da linha do tempo.",
      emptyVideoTitle: "Vídeo em breve",
      eyebrow: "Documentos",
      featureListAria: "Tópicos de documentação",
      playback: {
        next: "Próxima etapa",
        pause: "Pausa",
        play: "Jogar",
        previous: "Etapa anterior",
        restart: "Reiniciar",
      },
      progressLabel: "Progresso",
      title: "Guias ScreenCam.",
      videoAriaLabel: "Vídeo de demonstração da documentação",
      features: {
        basics: {
          title: "Noções básicas",
          summary: "Familiarize-se com a visualização, a barra lateral, os painéis de configurações e as trilhas da linha do tempo.",
          chapters: {
            preview: {
              title: "Visualização",
              description: "Use a área de visualização para assistir ao resultado final da exportação atual em tempo real.",
            },
            sidebar: {
              title: "Barra lateral",
              description: "Os principais painéis de configuração ficam na barra lateral.",
            },
            "screen-settings": {
              title: "Configurações de tela",
              description: "Configure o conteúdo da tela, incluindo papel de parede, margens, tamanho e opções de layout relacionadas.",
            },
            "device-settings": {
              title: "Configurações do dispositivo",
              description: "Envolva a tela em um quadro de dispositivo, escolha o dispositivo e ajuste o estilo do quadro, como o plano de fundo.",
            },
            "keyboard-settings": {
              title: "Configurações do teclado",
              description: "Defina como os atalhos gravados aparecem, incluindo seu tamanho e posição padrão.",
            },
            "beauty-settings": {
              title: "Configurações de beleza",
              description: "Depois que a gravação da câmera for ativada, aplique aprimoramentos sutis de retrato à imagem da câmera.",
            },
            "mouse-settings": {
              title: "Configurações do mouse",
              description: "Ajuste o estilo visual básico do ponteiro do mouse.",
            },
            "animation-settings": {
              title: "Configurações de animação",
              description: "Personalize o movimento da câmera, incluindo intensidade de desfoque de movimento e curvas personalizadas.",
            },
            tracks: {
              title: "Faixas",
              description: "Eventos de gravação, câmera, áudio do sistema, microfone, zoom e teclado aparecem aqui como clipes da linha do tempo.",
            },
          },
        },
        "preview-control": {
          title: "Controles de visualização",
          summary: "Ajuste a velocidade de reprodução da visualização, o volume da visualização e o zoom da trilha da linha do tempo durante a edição.",
          chapters: {
            "playback-rate": {
              title: "Velocidade de reprodução",
              description:
                "Ajuste a velocidade de reprodução da visualização aqui. **Isso afeta apenas o estágio de visualização e não afeta a exportação.**",
            },
            volume: {
              title: "Volume",
              description:
                "Ajuste o som que você ouve durante a visualização. **Isso afeta apenas o estágio de visualização e não afeta a exportação.**",
            },
            "track-zoom": {
              title: "Rastrear zoom",
              description: "Altere o nível de zoom das trilhas da linha do tempo.",
            },
          },
        },
        "track-management": {
          title: "Gerenciamento de trilhas",
          summary: "Abra as configurações da trilha, reordene as trilhas, oculte-as, exclua-as e restaure as trilhas excluídas.",
          chapters: {
            entry: {
              title: "Entrada",
              description: "Abra o painel de configurações da trilha no lado esquerdo das trilhas.",
            },
            sort: {
              title: "Classificar",
              description:
                "Arraste o identificador de classificação {{icon:grip}} inicial para reordenar as faixas. Este pedido é salvo como preferência e reutilizado na próxima vez.",
            },
            hide: {
              title: "Esconder",
              description:
                "Clique em {{icon:eye}} para ocultar faixas desnecessárias. **Isso não afeta a exportação.**",
            },
            delete: {
              title: "Delete",
              description:
                "Clique em {{icon:trash}} para excluir faixas desnecessárias. **Isso afeta a exportação final.**",
            },
            restore: {
              title: "Restaurar",
              description:
                "As trilhas Deleted aparecem separadamente abaixo, onde você pode restaurá-las a qualquer momento.",
            },
          },
        },
        "screen-settings": {
          title: "Configurações de tela",
          summary: "Ajuste a tela gravada, seu plano de fundo, margens e comportamento do tamanho de saída.",
          chapters: {
            wallpaper: {
              title: "Papel de parede",
              description:
                "Escolha papéis de parede lidos no sistema, incluindo papéis de parede dinâmicos. Eles não vêm com o aplicativo, não ocupam espaço do aplicativo e mantêm a mais alta qualidade de papel de parede. Clique em Personalizado para configurar mais pastas de papel de parede em Configurações.",
            },
            "no-background": {
              title: "Sem plano de fundo",
              description:
                "Não escolha nenhum plano de fundo, o que é especialmente importante para gravação em tela inteira ou gravação de área personalizada. **Atualmente, mudar para nenhum papel de parede mantém as configurações anteriores de margem ou tamanho por padrão, então defina-as como 0 manualmente para remover bordas pretas.**",
            },
            gradient: {
              title: "Gradiente",
              description:
                "Escolha um gradiente linear predefinido ou edite livremente âncoras e cores de gradiente, adicionando ou removendo âncoras conforme necessário.",
            },
            "solid-color": {
              title: "Cor sólida",
              description: "Escolha uma única cor como plano de fundo.",
            },
            "custom-background": {
              title: "Personalizado",
              description: "Carregue sua própria foto ou vídeo como plano de fundo.",
            },
            "adaptive-size": {
              title: "Tamanho de tela adaptável",
              description:
                "Neste modo, o tamanho da tela é controlado ajustando as margens verticais e horizontais.",
            },
            "sync-margins": {
              title: "Margens de sincronização",
              description:
                "Ative as margens de sincronização para manter todos os quatro lados consistentes. Desative-o para controlar as margens verticais e horizontais separadamente. **Se a proporção estiver ativada, a imagem final estará visualmente em conformidade com essa proporção, portanto as margens poderão parecer diferentes dos valores inseridos.**",
            },
            "fixed-size": {
              title: "Tamanho de tela fixo",
              description:
                "Neste modo, insira manualmente o tamanho da tela. **Se a proporção estiver ativada, a tela se expandirá até a proporção desejada.**",
            },
          },
        },
        "workspace-file": {
          title: "Arquivo de projeto Pro",
          summary:
            "Um arquivo de projeto contém todos os arquivos brutos gerados para uma gravação concluída, incluindo todos os ativos e configurações. Você pode compartilhá-lo e **ele será criado e salvo automaticamente em um local padrão quando a gravação terminar.**",
          chapters: {
            "default-directory": {
              title: "Alterar o diretório padrão",
              description:
                "Abra <kbd>ScreenCam</kbd> > <kbd>Settings</kbd> > <kbd>Recording</kbd> > <kbd>Diretório de espaço de trabalho padrão</kbd> e escolha a pasta padrão.",
            },
            "recent-projects": {
              title: "Abra projetos recentes",
              description: "Use <kbd>Arquivo</kbd> > <kbd>Recente</kbd>.",
            },
            "default-directory-projects": {
              title: "Abra projetos no local padrão",
              description:
                "Use <kbd>Arquivo</kbd> > <kbd>Diretório padrão</kbd>.",
            },
            "show-in-finder": {
              title: "Mostrar o arquivo atual em Finder",
              description:
                "Clique no nome do arquivo do projeto na parte superior do editor ou use <kbd>File</kbd> > <kbd>Show em Finder</kbd>.",
            },
            "manual-save": {
              title: "Salvar manualmente",
              description:
                "Use <kbd>File</kbd> > <kbd>Save</kbd> ou pressione <kbd>⌘</kbd><kbd>S</kbd> para salvar manualmente. Na maioria dos casos, o projeto é salvo automaticamente.",
            },
            "save-as": {
              title: "Salvar como",
              description:
                "Use <kbd>File</kbd> > <kbd>Salvar como</kbd> ou pressione <kbd>⌘</kbd><kbd>⇧</kbd><kbd>S</kbd> para salvar uma cópia em uma pasta personalizada.",
            },
          },
        },
        record: {
          title: "Gravar",
          summary: "Configure uma captura, escolha a fonte e comece a gravar.",
          chapters: {
            "prepare-capture": {
              title: "Prepare a captura",
              description: "Abra ScreenCam e confirme se os controles de gravação estão prontos antes de selecionar uma fonte.",
            },
            "choose-source": {
              title: "Escolha uma fonte",
              description: "Escolha as opções de exibição, janela, área, câmera, microfone e áudio do sistema para a gravação.",
            },
            "start-recording": {
              title: "Comece a gravar",
              description: "Inicie a captura e verifique o estado da gravação antes de passar para o fluxo de trabalho.",
            },
          },
        },
        zoom: {
          title: "Zoom",
          summary: "Adicione âncoras na linha do tempo e ajuste como a câmera se move durante a gravação.",
          chapters: {
            "zoom-track": {
              title: "Faixa de zoom",
              description: "Crie e exclua clipes de zoom livremente na trilha de zoom.",
            },
            "delete-clip": {
              title: "Delete",
              description: "Selecione um clipe e pressione Backspace ou Delete para removê-lo.",
              descriptionHtml:
                "Selecione um clipe e pressione <kbd class=\"docs-key\">Backspace</kbd> ou <kbd class=\"docs-key\">Delete</kbd> para removê-lo.",
            },
            "create-clip": {
              title: "Criar",
              description: "Clique ou arraste em uma área vazia para criar um novo clipe de zoom.",
            },
            "merge-clips": {
              title: "Mesclar",
              description: "Redimensione ou arraste um clipe até que ele cruze outro clipe e solte para confirmar a mesclagem.",
            },
            "manual-mode": {
              title: "Modo manual",
              description: "Mude do movimento automático para o modo manual e personalize a contagem, o centro e a escala de cada âncora.",
            },
            "select-anchor": {
              title: "Selecione uma âncora",
              description: "Selecione uma âncora para editar suas configurações de zoom individuais.",
            },
            "adjust-center": {
              title: "Ajustar centro",
              description: "Arraste diretamente na visualização para definir o centro visual do zoom.",
            },
            "adjust-scale-wheel": {
              title: "Ajustar escala",
              description: "Use a roda do mouse na visualização para controlar a escala de zoom.",
            },
            "adjust-scale-panel": {
              title: "Ajustar escala nas configurações",
              description: "Selecione uma âncora e ajuste o controle deslizante de escala no painel de configurações direito.",
            },
          },
        },
        camera: {
          title: "Câmera",
          summary: "Dê forma à sobreposição da câmera e aplique ajustes leves de aparência.",
          chapters: {
            "enable-camera": {
              title: "Habilite a câmera",
              description: "Ligue a camada da câmera e posicione-a onde ela suporta a gravação.",
            },
            "shape-frame": {
              title: "Dê forma à moldura",
              description: "Alterne entre formatos de quadro e dimensione a sobreposição da câmera para a cena.",
            },
            "apply-beauty": {
              title: "Aplique efeitos de beleza",
              description: "Ajuste configurações sutis de aparência enquanto mantém a visualização alinhada com a exportação final.",
            },
          },
        },
        shortcuts: {
          title: "Atalhos",
          summary: "Use ações do teclado para controlar a captura sem interromper o fluxo.",
          chapters: {
            "capture-shortcut": {
              title: "Comece com um atalho",
              description: "Acione controles de gravação a partir do teclado em vez de acessar a barra de ferramentas.",
            },
            "pause-resume": {
              title: "Pausar ou retomar",
              description: "Use ações de atalho para pausar e continuar a captura durante gravações mais longas.",
            },
            "finish-recording": {
              title: "Termine a tomada",
              description: "Pare a gravação e vá para o editor sem perder o contexto.",
            },
          },
        },
        export: {
          title: "Exportar",
          summary: "Revise o resultado, escolha as configurações de saída e exporte a gravação.",
          chapters: {
            "choose-format": {
              title: "Escolha o formato",
              description: "Selecione o formato de exportação e as configurações de saída para o destino.",
            },
            "review-preview": {
              title: "Revise a visualização",
              description: "Verifique a visualização final antes de renderizar o arquivo.",
            },
            "export-file": {
              title: "Exporte o arquivo",
              description: "Renderize a gravação e salve o resultado exportado.",
            },
          },
        },
      },
    },
    home: {
      screenStudioAlternative: {
        eyebrow: "Alternativa Screen Studio",
        title: "Precisa de um gravador de tela Mac mais leve com controle manual mais profundo?",
        description:
          "Compare ScreenCam com Screen Studio em tamanho de aplicativo, uso de CPU e memória, velocidade de exportação, âncoras de zoom manual, camadas, modelos de dispositivos e formatos de exportação.",
        cta: "Alternativa Screen Studio para Mac",
      },
      structuredDataFeatureList: [
        "Gravação de tela nativa macOS",
        "Âncoras de zoom manuais",
        "Curvas de animação personalizadas",
        "Maquetes de dispositivos",
        "Camadas de mosaico, texto, foco e imagem personalizada",
        "Transições de desfoque de movimento",
        "Exportação GIF",
        "Exportação Live Photo",
        "Efeitos de beleza da câmera",
        "Exportação com visualização precisa",
      ],
      hero: {
        appStoreButton: "Ver em App Store",
        builtWithLabel: "Construído com",
        builtWithValue: "100% nativo",
        systemLabel: "Sistema",
        systemValue: "macOS 15+",
        tagline: "Gravação de alta resolução com uma câmera que você pode moldar após a captura.",
        titleLines: [
          ["Capturar", "Afiado."],
          ["Direto", "O quadro."],
        ],
      },
      zoom: {
        canvasLabels: {
          autoPlayingDemo: "Demonstração de reprodução automática",
          playMarker: "Jogar",
          previewMarker: "Visualização",
          recordingClip: "Gravação",
          recordingTrack: "Gravação",
          timelinePreview: "Visualização da linha do tempo",
          zoomClip: "Zoom automático",
          zoomTrack: "Zoom",
        },
        features: [
          {
            title: "Zoom Dinâmico",
            description: "O movimento da câmera segue o mesmo tempo de mola usado pelas exportações ScreenCam.",
          },
          {
            title: "Visualização da linha do tempo",
            description: "Passe o mouse sobre a trilha Gravação ou Zoom para limpar o quadro de visualização exato.",
          },
          {
            title: "Desfoque de movimento",
            description: "Os estados de zoom, panorâmica e clique são amostrados com desfoque estilo obturador.",
          },
        ],
        subtitle: "Zoom com desfoque de movimento.",
        timelineAria: "Faixas de visualização da linha do tempo",
        title: "Concentre-se no que importa.",
      },
      deviceMockups: {
        description:
          "Exporte com molduras de dispositivos impressionantes. iPhone, Mac, Studio Display - seu conteúdo, perfeitamente apresentado.",
        eyebrow: "Exportar Options",
        formats: ["Resolução original", "Live Photo", "MP4/MOV"],
        imageAlt: {
          iPhone: "iPhone 17 Pro Máx.",
          macBook: "Aplicativo ScreenCam em execução no MacBook Pro",
          studioDisplay: "ScreenCam em execução no Studio Display com MacBook",
        },
        title: "Linda em todas as telas.",
      },
      controls: {
        body:
          "O modo manual oferece total liberdade criativa. Adicione várias âncoras a um único clipe de zoom, cada uma com sua própria escala e ponto central.",
        centerLabel: "Centro",
        dragCenter: "Arraste para ajustar o centro",
        eyebrow: "Controles Avançados",
        features: [
          "Arraste as âncoras para reposicionar na linha do tempo",
          "Ajuste a escala de 1x a 5x por âncora",
          "Defina o centro de foco personalizado para cada zoom",
          "Transições suaves entre âncoras",
        ],
        pauseAria: "Pausar a reprodução simulada da linha do tempo",
        pauseTitle: "Pausa",
        playAria: "Reproduzir reprodução simulada da linha do tempo",
        playTitle: "Jogar",
        scaleAria: "Escala",
        scaleLabel: "Escala",
        titleMuted: "cada ponto de zoom.",
        titleStart: "Controle total sobre",
      },
      performance: {
        cta: "Veja dados completos de benchmark",
        metrics: {
          appSize: "Tamanho do aplicativo",
          appSizeNote: "cerca de 20 MB contra 600 MB",
          cpuUsage: "Uso da CPU",
          exportTime: "Tempo de exportação",
          exportTimeNote: "mais curto é mais rápido",
          memory: "Memória",
          others: "Outros",
          screenCam: "ScreenCam",
        },
        subtitle: "Sem elétron. Sem visualizações na web. Desempenho nativo puro.",
        title: "Nativo significa rápido.",
      },
      featureCards: {
        eyebrow: "Recursos do More",
        title: "Pequenos detalhes, prontos para fluxos de trabalho reais.",
        subtitle: "Toques nativos que tornam a gravação rápida, refinada e Mac em primeiro lugar.",
        beautyThumb: {
          beforeLabel: "Beleza desligada",
          afterLabel: "Beleza ligada",
          disclosure:
            "Retrato gerado por IA, usado apenas para demonstrar o verdadeiro efeito de beleza.",
          enterFloatingAria: "Mostrar como janela de câmera flutuante",
          exitFloatingAria: "Retornar a janela da câmera para visualização completa",
          pauseAria: "Pausar demonstração de comparação de beleza",
          playAria: "Jogue uma demonstração de comparação de beleza",
          shapeCycleAria: "Mudar o formato da janela flutuante",
          shapeLabels: {
            circle: "Círculo",
            square: "Quadrado arredondado",
            wide: "16:9",
          },
        },
        dynamicIslandThumb: {
          ariaLabel: "Pré-visualização da tarefa em segundo plano da Ilha Dinâmica",
          materialLabel: "Material de entalhe",
          modeLabels: {
            black: "Preto",
            glass: "Vidro",
          },
          tasks: [
            {
              title: "Filme de lançamento ScreenCam",
              detail: "Pronto para revelar em Finder.",
              primaryAction: "Abra Finder",
              secondary: "Completo",
              secondaryAction: "Concluído",
              size: "384MB",
            },
            {
              title: "Exportação de tutoriais em 4K",
              detail: "Codificação H.265 com camadas de câmera e cursor.",
              primaryAction: "Abra Finder",
              secondary: "2m restantes",
              secondaryAction: "Concluído",
              size: "1,2GB",
            },
            {
              title: "Compressão de visualização GIF",
              detail: "Otimizando quadros para um clipe compartilhável menor.",
              primaryAction: "Abra Finder",
              secondary: "Faltam 42s",
              secondaryAction: "Concluído",
              size: "18MB",
            },
          ],
          wallpaperButtonAria: "Alterar papel de parede",
        },
        effectLayersThumb: {
          ariaLabel: "Visualização da linha do tempo das camadas de efeito",
          dragHint: "Arraste até a faixa para adicionar",
          effects: [
            {
              id: "mosaic",
              title: "Mosaico",
              description: "Pixelize áreas sensíveis na parte superior da gravação.",
              clipLabel: "Mosaico",
            },
            {
              id: "focus",
              title: "Foco",
              description: "Destaque uma região enquanto mantém o contexto visível.",
              clipLabel: "Foco",
            },
            {
              id: "text",
              title: "Texto",
              description: "Adicione uma camada de texto em qualquer lugar da edição.",
              clipLabel: "Texto",
            },
            {
              id: "image",
              title: "Imagem",
              description: "Coloque uma sobreposição de imagem como uma camada cronometrada.",
              clipLabel: "Imagem",
            },
          ],
        },
        glassThumb: {
          modeLabels: {
            clear: "Limpar",
            regular: "normal",
          },
          toolbarItems: {
            area: "Área",
            camera: "Câmera",
            close: "Ocultar ScreenCam",
            display: "Exibição",
            iphone: "iPhone",
            keyboard: "Gravação de eventos de teclado",
            microphone: "Microfone",
            settings: "Configurações",
            systemAudio: "Gravação de som do sistema",
            window: "Janela",
            workspace: "Abrir espaço de trabalho",
          },
          wallpaperButtonAria: "Alterar papel de parede",
        },
        items: [
          {
            title: "Vidro Líquido",
            caption: "Os materiais de vidro nativos mantêm os controles nítidos enquanto combinam com as superfícies macOS modernas.",
          },
          {
            title: "Captura de atalho",
            caption: "Grave atalhos de teclado durante a captura e exiba-os claramente no vídeo final.",
          },
          {
            title: "Beleza leve",
            caption: "Aplique efeitos de beleza sutis para obter uma aparência de câmera mais limpa.",
          },
          {
            title: "Ilha Dinâmica",
            caption: "Coloque as exportações longas em segundo plano e mantenha o progresso visível desde o nível.",
          },
          {
            title: "Camadas de Efeito",
            caption: "Adicione quantas camadas de efeitos forem necessárias e, em seguida, mova, redimensione e empilhe cada clipe na linha do tempo.",
          },
        ],
      },
      faq: {
        eyebrow: "Perguntas frequentes",
        title: "Perguntas e respostas",
        items: [
          {
            question: "ScreenCam é uma alternativa Screen Studio?",
            answer:
              "Sim. ScreenCam é uma alternativa macOS Screen Studio nativa para criadores que desejam um tamanho menor de aplicativo, menor uso de recursos, exportações mais rápidas, âncoras de zoom manuais, maquetes de dispositivos, camadas mais ricas, exportação GIF, exportação Live Photo e uma experiência de edição Mac inovadora.",
          },
          {
            question: "Qual a diferença entre o ScreenCam e os gravadores baseados em navegador?",
            answer:
              "ScreenCam foi desenvolvido para macOS como um aplicativo nativo de gravação e edição. O objetivo é um fluxo de trabalho compacto, pioneiro no Mac, com captura local, controles de edição suaves e exportação com visualização precisa.",
          },
          {
            question: "Qual é a versão mínima do macOS necessária?",
            answer: "ScreenCam requer macOS 15 ou posterior.",
          },
          {
            question: "Existe uma versão para Windows?",
            answer:
              "Agora não. ScreenCam está focado em macOS e não planejamos desenvolver uma versão para Windows no curto prazo.",
          },
          {
            question: "Posso exportar para diferentes formatos?",
            answer:
              "ScreenCam foi projetado para exportação de vídeo de alta qualidade do editor, com enquadramento e controles de movimento refletidos na saída final.",
          },
          {
            question: "Como funciona o recurso de zoom?",
            answer:
              "Você pode adicionar pontos de zoom em qualquer lugar da sua linha do tempo. No modo manual, você tem controle total: defina múltiplas âncoras com diferentes níveis de zoom e centros de foco. As transições incluem efeitos de desfoque de movimento suave.",
          },
          {
            question: "Suporta vários monitores?",
            answer:
              "ScreenCam foi desenvolvido para fluxos de trabalho de gravação de tela Mac, incluindo monitores conectados, janelas e regiões de captura.",
          },
        ],
      },
    },
    legal: {
      privacy: {
        eyebrow: "Privacidade",
        title: "Política de Privacidade",
        updated: "Última atualização: 3 de junho de 2026",
        sections: [
          {
            title: "Visão geral",
            paragraphs: [
              [
                "ScreenCam é um aplicativo nativo de gravação e edição de tela macOS. O aplicativo foi projetado para processar gravações localmente em seu Mac. ScreenCam pode fazer solicitações de rede para funcionalidades do aplicativo, como status de compra App Store e, quando você optar por ativá-lo, análises de uso anônimas opcionais. Não usamos rastreadores de publicidade no aplicativo.",
              ],
            ],
          },
          {
            title: "Gravações e arquivos locais",
            paragraphs: [
              [
                "Gravações de tela, vídeo da câmera, áudio do microfone, áudio do sistema, dados do cursor, vídeos exportados, arquivos do espaço de trabalho e arquivos de papel de parede personalizados permanecem no seu dispositivo ou nos locais que você escolher. ScreenCam não carrega este conteúdo para servidores ScreenCam.",
              ],
            ],
          },
          {
            title: "Análise de uso anônima",
            paragraphs: [
              [
                "ScreenCam pode perguntar se você deseja compartilhar análises de uso anônimas para nos ajudar a entender quais recursos de gravação e edição funcionam bem. Você pode ativar ou desativar o compartilhamento de análises a qualquer momento no aplicativo. Se o compartilhamento de análises estiver desativado, ScreenCam não enviará análises de uso.",
              ],
              [
                "As análises são limitadas ao uso do produto, diagnóstico e informações de desempenho, como interações de recursos, versão do aplicativo, versão macOS e informações gerais do dispositivo. Nunca coletamos conteúdo de tela, áudio, vídeo de câmera, arquivos de projeto, nomes de arquivos ou texto digitado por meio de análises.",
              ],
            ],
          },
          {
            title: "Permissões",
            paragraphs: [
              [
                "ScreenCam pode solicitar a macOS permissões de gravação de tela, microfone, câmera e acesso a arquivos. Essas permissões são usadas apenas para fornecer recursos de gravação, edição, exportação e arquivos selecionados pelo usuário. Você pode gerenciar essas permissões nas configurações do sistema.",
              ],
            ],
          },
          {
            title: "Compras",
            paragraphs: [
              [
                "Assinaturas e compras ScreenCam Pro são processadas por Apple por meio do Mac App Store. ScreenCam lê o status de compra e assinatura de StoreKit para que o aplicativo possa desbloquear os recursos do Pro. ScreenCam não recebe nem armazena os detalhes do seu cartão de pagamento.",
              ],
            ],
          },
          {
            title: "Site",
            paragraphs: [
              [
                "Quando você visita thescreen.cam, nossos provedores de hospedagem e infraestrutura podem processar dados de registro de servidor padrão, como endereço IP, agente do usuário do navegador, URL de solicitação e tempo de solicitação para segurança, diagnóstico e entrega do site. O site não usa rastreadores de publicidade.",
              ],
            ],
          },
          {
            title: "Mudanças e contato",
            paragraphs: [
              ["Poderemos atualizar esta política à medida que ScreenCam mudar. Se você tiver dúvidas sobre privacidade, entre em contato conosco em", emailLink, "."],
            ],
          },
        ],
      },
      support: {
        eyebrow: "Suporte",
        title: "Suporte ScreenCam",
        updated: "Para obter ajuda com ScreenCam para macOS.",
        supportChannelsAria: "Canais de suporte",
        sections: [
          {
            title: "Contato",
            showSupportChannels: true,
            paragraphs: [
              [
                "E-mail",
                emailLink,
                "para suporte ao produto, relatórios de bugs, perguntas sobre compras e feedback.",
              ],
            ],
          },
          {
            title: "Inclua esses detalhes",
            paragraphs: [
              [
                "Ao relatar um problema, inclua sua versão macOS, versão ScreenCam, modelo Mac, configurações de gravação, formato de exportação e uma breve descrição do que aconteceu. Capturas de tela ou gravações curtas são úteis quando o problema é visual.",
              ],
            ],
          },
          {
            title: "Compras de App Store",
            paragraphs: [
              [
                "ScreenCam é distribuído por meio do Mac App Store. Faturamento, assinaturas, renovações, cancelamentos e reembolsos são gerenciados por Apple por meio de seu ID Apple e configurações de conta App Store.",
              ],
            ],
          },
          {
            title: "Requisitos",
            paragraphs: [
              [
                "ScreenCam é atualmente construído para macOS. Não existe uma versão para Windows e o desenvolvimento do Windows não está planejado no curto prazo.",
              ],
            ],
          },
          {
            title: "Privacidade",
            paragraphs: [
              [
                "As gravações e os arquivos do espaço de trabalho são processados localmente em seu Mac. Leia o",
                { href: "/privacy", text: "Política de Privacidade" },
                "para mais detalhes.",
              ],
            ],
          },
        ],
      },
      terms: {
        eyebrow: "Termos",
        title: "Termos de Uso",
        updated: "Última atualização: 20 de maio de 2026",
        sections: [
          {
            title: "Licença do aplicativo",
            paragraphs: [
              [
                "ScreenCam é licenciado para você sob o Contrato de Licença de Usuário Final Padrão (EULA) de Apple, a menos que exigido de outra forma pela lei aplicável. Você pode revisar o EULA padrão do Apple em",
                appleEulaLink,
                ".",
              ],
            ],
          },
          {
            title: "Assinaturas e compras",
            paragraphs: [
              [
                "Assinaturas e compras ScreenCam Pro são processadas por Apple por meio do Mac App Store. O faturamento, a renovação, o cancelamento, os reembolsos e o gerenciamento da conta da assinatura são feitos por meio do seu ID Apple e das configurações da conta App Store.",
              ],
            ],
          },
          {
            title: "Uso de ScreenCam",
            paragraphs: [
              [
                "Você é responsável pelas gravações, arquivos e exportações criadas com ScreenCam. Grave, edite e compartilhe conteúdo somente quando você tiver os direitos e permissões necessários para fazê-lo.",
              ],
            ],
          },
          {
            title: "Privacidade",
            paragraphs: [
              ["As práticas de privacidade de ScreenCam estão descritas no", { href: "/privacy", text: "Política de Privacidade" }, "."],
            ],
          },
          {
            title: "Contato",
            paragraphs: [
              ["Se você tiver dúvidas sobre estes termos, entre em contato conosco em", emailLink, "."],
            ],
          },
        ],
      },
    },
    changelog: {
      description: "Atualizações, correções e notas de versão do Product.",
      eyebrow: "Registro de alterações",
      intro: "Atualizações, correções e notas de versão do Product.",
      linkVersionLabel: "Link para a versão",
      title: "Registro de alterações ScreenCam",
    },
    motionBlurTool: {
      addMaskAria: "Adicionar máscara",
      addMaskButton: "Máscara",
      angleAria: "Ângulo de desfoque",
      angleLabel: "Ângulo",
      blurSettingsTitle: "Configurações de desfoque",
      chooseImage: "Escolha a imagem",
      clearImage: "Limpar imagem",
      defaultMaskName: "Máscara",
      deleteSelectedMaskAria: "Máscara selecionada Delete",
      description:
        "Crie regiões de desfoque retangulares, ajuste a direção e a intensidade e exporte a imagem composta.",
      emptyMasksWithImage: "Adicione uma máscara para desfocar parte da imagem.",
      emptyMasksWithoutImage: "Carregue uma imagem primeiro.",
      exportButton: "Exportar",
      heightLabel: "Altura",
      linearMode: "linear",
      maskButton: "Máscara",
      masksTitle: "Máscaras",
      modeLabel: "Modo",
      nameLabel: "Nome",
      previewAria: "Visualização do desfoque de movimento",
      replaceImageAria: "Substituir imagem",
      selectedMaskEmpty: "Selecione uma máscara para editar a direção, intensidade, posição e tamanho do desfoque.",
      sourceTitle: "Fonte",
      strengthAria: "Força do desfoque",
      strengthLabel: "Força",
      title: "Máscara de desfoque de movimento",
      toolEyebrow: "Ferramenta",
      uniformMode: "Uniforme",
      uploadDescription: "Solte uma imagem local aqui ou escolha um arquivo para começar a editar.",
      uploadTitle: "Carregar uma imagem",
      widthLabel: "Largura",
      xLabel: "X",
      yLabel: "Y",
    },
  },
  it: {
    common: {
      skipToContent: "Vai al contenuto",
    },
    header: {
      appStore: "App Store",
      backToMenuAria: "Torna al menù",
      closeMenuAria: "Chiudi menù",
      homeAria: "Home ScreenCam",
      logoAlt: "Logo ScreenCam",
      menuAria: "Apri il menu",
      nav: {
        changelog: "Registro delle modifiche",
        docs: "Documenti",
        privacy: "Privacy",
        support: "Supporto",
        terms: "Termini",
      },
      primaryNavigationAria: "Navigazione primaria",
    },
    footer: {
      appStoreButton: "Visualizza su App Store",
      copyright: "Tutti i diritti riservati.",
      ctaText: "Ottieni ScreenCam da Mac App Store.",
      ctaTitle: "Pronti per catturare meglio?",
      description: "Registrazione dello schermo nativa per Mac. Veloce, leggero, potente.",
      groups: {
        legal: "Legale",
        product: "Prodotto",
        resources: "Risorse",
      },
      language: "Lingua",
      legalLinks: {
        privacy: "Privacy",
        terms: "Termini",
      },
      productLinks: {
        controls: "Controlli",
        export: "Esporta",
        faq: "Domande frequenti",
        zoom: "Zoom",
      },
      resourceLinks: {
        alternatives: "Alternative",
        bgm: "BGM",
        changelog: "Registro delle modifiche",
        docs: "Documenti",
        motionBlurMask: "Maschera di sfocatura movimento",
        support: "Supporto",
      },
      supportChannelsAria: "Canali di supporto",
      systemStatus: "Tutti i sistemi sono operativi",
    },
    meta: {
      changelog: {
        title: "Registro delle modifiche: ScreenCam",
        description: "Segui le note di rilascio di ScreenCam, i miglioramenti del prodotto, le correzioni di bug e la cronologia degli aggiornamenti.",
      },
      docs: {
        title: "Documenti: ScreenCam",
        description:
          "Impara ScreenCam con procedure video guidate, passaggi suddivisi in capitoli e riproduzione interattiva.",
      },
      home: {
        title: "ScreenCam - Registrazione nativa dello schermo macOS con zoom diretto",
        description:
          "ScreenCam è un registratore di schermo macOS nativo per cattura nitida, controllo manuale dello zoom, ancoraggi della timeline, regolazione della curva ed esportazione accurata in anteprima.",
      },
      motionBlurMask: {
        title: "Strumento maschera effetto movimento - ScreenCam",
        description:
          "Carica un'immagine, disegna maschere di motion blur rettangolari, regola l'intensità e la direzione della sfocatura, quindi esporta il risultato composito.",
      },
      privacy: {
        title: "Informativa sulla privacy - ScreenCam",
        description:
          "L'informativa sulla privacy di ScreenCam spiega come l'app macOS gestisce registrazioni, autorizzazioni, analisi opzionali, acquisti e dati del sito Web.",
      },
      support: {
        title: "Supporto: ScreenCam",
        description:
          "Ottieni assistenza con ScreenCam per macOS, inclusi contatto di supporto, acquisti App Store, requisiti e risoluzione dei problemi.",
      },
      terms: {
        title: "Condizioni d'uso - ScreenCam",
        description:
          "I termini di utilizzo di ScreenCam spiegano la licenza dell'app, gli abbonamenti, gli acquisti e le informazioni di contatto del supporto.",
      },
    },
    docs: {
      chaptersTitle: "Passi",
      description:
        "Guarda il flusso di lavoro, quindi vai direttamente al passaggio che ti serve.",
      emptyVideoDescription:
        "Trascina il file demo in public/docs per questa funzionalità, quindi aggiungi il percorso video e i timestamp calibrati al JSON della timeline.",
      emptyVideoTitle: "Video in arrivo",
      eyebrow: "Documenti",
      featureListAria: "Argomenti della documentazione",
      playback: {
        next: "Prossimo passo",
        pause: "Pausa",
        play: "Gioca",
        previous: "Passaggio precedente",
        restart: "Ricominciare",
      },
      progressLabel: "Progresso",
      title: "ScreenCam Guide.",
      videoAriaLabel: "Video dimostrativo della documentazione",
      features: {
        basics: {
          title: "Nozioni di base",
          summary: "Acquisisci familiarità con l'anteprima, la barra laterale, i pannelli delle impostazioni e le tracce della timeline.",
          chapters: {
            preview: {
              title: "Anteprima",
              description: "Utilizza l'area di anteprima per guardare il risultato finale dell'esportazione corrente in tempo reale.",
            },
            sidebar: {
              title: "Barra laterale",
              description: "I principali pannelli di configurazione si trovano nella barra laterale.",
            },
            "screen-settings": {
              title: "Impostazioni dello schermo",
              description: "Configura il contenuto dello schermo, inclusi sfondo, margini, dimensioni e relative opzioni di layout.",
            },
            "device-settings": {
              title: "Impostazioni del dispositivo",
              description: "Avvolgi lo schermo nella cornice di un dispositivo, scegli il dispositivo e regola lo stile della cornice, ad esempio lo sfondo.",
            },
            "keyboard-settings": {
              title: "Impostazioni della tastiera",
              description: "Imposta la modalità di visualizzazione dei collegamenti registrati, comprese le dimensioni e la posizione predefinite.",
            },
            "beauty-settings": {
              title: "Impostazioni di bellezza",
              description: "Dopo aver abilitato la registrazione della fotocamera, applica sottili miglioramenti al ritratto all'immagine della fotocamera.",
            },
            "mouse-settings": {
              title: "Impostazioni del mouse",
              description: "Regola lo stile visivo di base per il puntatore del mouse.",
            },
            "animation-settings": {
              title: "Impostazioni dell'animazione",
              description: "Personalizza il movimento della fotocamera, inclusa l'intensità del motion blur e le curve personalizzate.",
            },
            tracks: {
              title: "Tracce",
              description: "Gli eventi di registrazione, fotocamera, audio di sistema, microfono, zoom e tastiera vengono visualizzati qui come clip della timeline.",
            },
          },
        },
        "preview-control": {
          title: "Controlli di anteprima",
          summary: "Regola la velocità di riproduzione dell'anteprima, il volume dell'anteprima e lo zoom della traccia della timeline durante la modifica.",
          chapters: {
            "playback-rate": {
              title: "Velocità di riproduzione",
              description:
                "Regola qui la velocità di riproduzione dell'anteprima. **Ciò influisce solo sulla fase di anteprima e non influisce sull'esportazione.**",
            },
            volume: {
              title: "Volume",
              description:
                "Regola il suono che senti durante l'anteprima. **Ciò influisce solo sulla fase di anteprima e non influisce sull'esportazione.**",
            },
            "track-zoom": {
              title: "Traccia lo zoom",
              description: "Modifica il livello di zoom delle tracce della timeline.",
            },
          },
        },
        "track-management": {
          title: "Gestione delle tracce",
          summary: "Apri le impostazioni della traccia, riordina le tracce, nascondile, eliminale e ripristina le tracce eliminate.",
          chapters: {
            entry: {
              title: "Entrata",
              description: "Apri il pannello delle impostazioni della traccia dal lato sinistro delle tracce.",
            },
            sort: {
              title: "Ordina",
              description:
                "Trascina la maniglia di ordinamento {{icon:grip}} principale per riordinare le tracce. Questo ordine viene salvato come preferenza e riutilizzato la prossima volta.",
            },
            hide: {
              title: "Nasconditi",
              description:
                "Fai clic su {{icon:eye}} per nascondere le tracce che non ti servono. **Ciò non influisce sull'esportazione.**",
            },
            delete: {
              title: "Delete",
              description:
                "Fare clic su {{icon:trash}} per eliminare le tracce non necessarie. **Ciò influisce sull'esportazione finale.**",
            },
            restore: {
              title: "Ripristina",
              description:
                "Le tracce Deleted vengono visualizzate separatamente di seguito, dove puoi ripristinarle in qualsiasi momento.",
            },
          },
        },
        "screen-settings": {
          title: "Impostazioni dello schermo",
          summary: "Ottimizza lo schermo registrato, il suo sfondo, i margini e il comportamento delle dimensioni di output.",
          chapters: {
            wallpaper: {
              title: "Carta da parati",
              description:
                "Scegli gli sfondi letti dal sistema, inclusi gli sfondi dinamici. Non sono inclusi nell'app, non occupano spazio nell'app e mantengono la massima qualità dello sfondo. Fai clic su Personalizzato per configurare più cartelle di sfondi in Impostazioni.",
            },
            "no-background": {
              title: "Nessuno sfondo",
              description:
                "Non scegliere lo sfondo, il che è particolarmente importante per la registrazione a schermo intero o per la registrazione in aree personalizzate. **Attualmente, il passaggio a nessuno sfondo mantiene le impostazioni di margine o dimensione precedenti per impostazione predefinita, quindi impostale manualmente su 0 per rimuovere i bordi neri.**",
            },
            gradient: {
              title: "Gradiente",
              description:
                "Scegli un gradiente lineare preimpostato o modifica liberamente gli ancoraggi e i colori del gradiente, aggiungendo o rimuovendo gli ancoraggi secondo necessità.",
            },
            "solid-color": {
              title: "Colore solido",
              description: "Scegli un singolo colore come sfondo.",
            },
            "custom-background": {
              title: "Personalizzato",
              description: "Carica la tua foto o il tuo video come sfondo.",
            },
            "adaptive-size": {
              title: "Dimensioni dello schermo adattabili",
              description:
                "In questa modalità, la dimensione dello schermo viene controllata regolando i margini verticali e orizzontali.",
            },
            "sync-margins": {
              title: "Sincronizza i margini",
              description:
                "Abilita i margini di sincronizzazione per mantenere coerenti tutti e quattro i lati. Disabilitalo per controllare separatamente i margini verticali e orizzontali. **Se le proporzioni sono abilitate, l'immagine finale è visivamente conforme a tali proporzioni, pertanto i margini potrebbero apparire diversi dai valori immessi.**",
            },
            "fixed-size": {
              title: "Dimensioni dello schermo fisse",
              description:
                "In questa modalità, inserire manualmente le dimensioni dello schermo. **Se le proporzioni sono abilitate, la tela si espande verso l'esterno fino alle proporzioni target.**",
            },
          },
        },
        "workspace-file": {
          title: "File Project",
          summary:
            "Un file di progetto contiene tutti i file grezzi generati per una registrazione completata, incluse tutte le risorse e configurazioni. Puoi condividerlo e **viene creato e salvato automaticamente in una posizione predefinita al termine della registrazione.**",
          chapters: {
            "default-directory": {
              title: "Cambia la directory predefinita",
              description:
                "Apri <kbd>ScreenCam</kbd> > <kbd>Impostazioni</kbd> > <kbd>Registrazione</kbd> > <kbd>Directory area di lavoro predefinita</kbd>, quindi scegli la cartella predefinita.",
            },
            "recent-projects": {
              title: "Apri progetti recenti",
              description: "Utilizza <kbd>File</kbd> > <kbd>Recente</kbd>.",
            },
            "default-directory-projects": {
              title: "Apri i progetti nella posizione predefinita",
              description:
                "Utilizza <kbd>File</kbd> > <kbd>Directory predefinita</kbd>.",
            },
            "show-in-finder": {
              title: "Mostra il file corrente in Finder",
              description:
                "Fai clic sul nome del file di progetto nella parte superiore dell'editor oppure utilizza <kbd>File</kbd> > <kbd>Mostra in Finder</kbd>.",
            },
            "manual-save": {
              title: "Salva manualmente",
              description:
                "Utilizzare <kbd>File</kbd> > <kbd>Salva</kbd> oppure premere <kbd>⌘</kbd><kbd>S</kbd> per salvare manualmente. Nella maggior parte dei casi, il progetto viene salvato automaticamente.",
            },
            "save-as": {
              title: "Salva con nome",
              description:
                "Utilizzare <kbd>File</kbd> > <kbd>Salva con nome</kbd> oppure premere <kbd>⌘</kbd><kbd>⇧</kbd><kbd>S</kbd> per salvare una copia in una cartella personalizzata.",
            },
          },
        },
        record: {
          title: "Registra",
          summary: "Imposta un'acquisizione, scegli la sorgente e avvia la registrazione.",
          chapters: {
            "prepare-capture": {
              title: "Preparare la cattura",
              description: "Apri ScreenCam e conferma che i controlli di registrazione sono pronti prima di selezionare una sorgente.",
            },
            "choose-source": {
              title: "Scegli una fonte",
              description: "Scegli le opzioni di visualizzazione, finestra, area, fotocamera, microfono e audio di sistema per la registrazione.",
            },
            "start-recording": {
              title: "Inizia a registrare",
              description: "Avvia l'acquisizione e verifica lo stato della registrazione prima di passare al flusso di lavoro.",
            },
          },
        },
        zoom: {
          title: "Zoom",
          summary: "Aggiungi ancoraggi alla timeline e regola il modo in cui la telecamera si muove durante la registrazione.",
          chapters: {
            "zoom-track": {
              title: "Zoom traccia",
              description: "Crea ed elimina liberamente clip di zoom sulla traccia di zoom.",
            },
            "delete-clip": {
              title: "Delete",
              description: "Selezionare una clip, quindi premere Backspace o Delete per rimuoverla.",
              descriptionHtml:
                "Selezionare una clip, quindi premere <kbd class=\"docs-key\">Backspace</kbd> o <kbd class=\"docs-key\">Delete</kbd> per rimuoverla.",
            },
            "create-clip": {
              title: "Crea",
              description: "Fare clic o trascinare su un'area vuota per creare una nuova clip di zoom.",
            },
            "merge-clips": {
              title: "Unisci",
              description: "Ridimensiona o trascina una clip finché non interseca un'altra clip, quindi rilascia per confermare l'unione.",
            },
            "manual-mode": {
              title: "Modalità manuale",
              description: "Passa dal movimento automatico alla modalità manuale e personalizza il conteggio, il centro e la scala di ogni ancora.",
            },
            "select-anchor": {
              title: "Seleziona un'ancora",
              description: "Seleziona un'ancora per modificarne le singole impostazioni di zoom.",
            },
            "adjust-center": {
              title: "Regolare il centro",
              description: "Trascina direttamente nell'anteprima per impostare il centro visivo dello zoom.",
            },
            "adjust-scale-wheel": {
              title: "Regola la scala",
              description: "Utilizzare la rotellina del mouse nell'anteprima per controllare la scala dello zoom.",
            },
            "adjust-scale-panel": {
              title: "Regola la scala nelle impostazioni",
              description: "Seleziona un'ancora, quindi regola il cursore della scala nel pannello delle impostazioni di destra.",
            },
          },
        },
        camera: {
          title: "Fotocamera",
          summary: "Modella la sovrapposizione della fotocamera e applica leggere regolazioni dell'aspetto.",
          chapters: {
            "enable-camera": {
              title: "Abilita la fotocamera",
              description: "Accendi il livello della fotocamera e posizionalo dove supporta la registrazione.",
            },
            "shape-frame": {
              title: "Modella la cornice",
              description: "Passa da una forma all'altra della cornice e ridimensiona la sovrapposizione della telecamera per la scena.",
            },
            "apply-beauty": {
              title: "Applicare effetti di bellezza",
              description: "Ottimizza le impostazioni dell'aspetto discreto mantenendo l'anteprima allineata con l'esportazione finale.",
            },
          },
        },
        shortcuts: {
          title: "Scorciatoie",
          summary: "Utilizza le azioni della tastiera per controllare l'acquisizione senza interrompere il flusso.",
          chapters: {
            "capture-shortcut": {
              title: "Inizia con una scorciatoia",
              description: "Attiva i controlli di registrazione dalla tastiera invece di raggiungere la barra degli strumenti.",
            },
            "pause-resume": {
              title: "Metti in pausa o riprendi",
              description: "Utilizza le azioni di scelta rapida per mettere in pausa e continuare l'acquisizione durante registrazioni più lunghe.",
            },
            "finish-recording": {
              title: "Finisci la ripresa",
              description: "Interrompi la registrazione e passa all'editor senza perdere il contesto.",
            },
          },
        },
        export: {
          title: "Esporta",
          summary: "Controlla il risultato, scegli le impostazioni di output ed esporta la registrazione.",
          chapters: {
            "choose-format": {
              title: "Scegli il formato",
              description: "Seleziona il formato di esportazione e le impostazioni di output per la destinazione.",
            },
            "review-preview": {
              title: "Esamina l'anteprima",
              description: "Controlla l'anteprima finale prima di eseguire il rendering del file.",
            },
            "export-file": {
              title: "Esporta il file",
              description: "Esegui il rendering della registrazione e salva il risultato esportato.",
            },
          },
        },
      },
    },
    home: {
      screenStudioAlternative: {
        eyebrow: "Screen Studio Alternativa",
        title: "Hai bisogno di un registratore dello schermo Mac più leggero con un controllo manuale più approfondito?",
        description:
          "Confronta ScreenCam con Screen Studio in base alle dimensioni dell'app, all'utilizzo della CPU e della memoria, alla velocità di esportazione, agli ancoraggi dello zoom manuale, ai livelli, ai modelli di dispositivi e ai formati di esportazione.",
        cta: "Screen Studio alternativa a Mac",
      },
      structuredDataFeatureList: [
        "Registrazione dello schermo nativa macOS",
        "Ancoraggi zoom manuali",
        "Curve di animazione personalizzate",
        "Mockup del dispositivo",
        "Livelli di mosaico, testo, messa a fuoco e immagini personalizzate",
        "Transizioni di motion blur",
        "Esportazione GIF",
        "Esportazione Live Photo",
        "Effetti di bellezza della fotocamera",
        "Esportazione accurata in anteprima",
      ],
      hero: {
        appStoreButton: "Visualizza su App Store",
        builtWithLabel: "Costruito con",
        builtWithValue: "100% nativo",
        systemLabel: "Sistema",
        systemValue: "macOS 15+",
        tagline: "Registrazione ad alta risoluzione con una fotocamera che puoi modellare dopo la ripresa.",
        titleLines: [
          ["Cattura", "Affilato."],
          ["Diretto", "La cornice."],
        ],
      },
      zoom: {
        canvasLabels: {
          autoPlayingDemo: "Demo con riproduzione automatica",
          playMarker: "Gioca",
          previewMarker: "Anteprima",
          recordingClip: "Registrazione",
          recordingTrack: "Registrazione",
          timelinePreview: "Anteprima della sequenza temporale",
          zoomClip: "Zoom automatico",
          zoomTrack: "Zoom",
        },
        features: [
          {
            title: "Zoom dinamico",
            description: "Il movimento della fotocamera segue lo stesso tempismo primaverile utilizzato dalle esportazioni ScreenCam.",
          },
          {
            title: "Anteprima della sequenza temporale",
            description: "Passa il mouse sulla traccia Registrazione o Zoom per scorrere l'esatto fotogramma di anteprima.",
          },
          {
            title: "Sfocatura movimento",
            description: "Gli stati di zoom, panoramica e clic vengono campionati con sfocatura in stile otturatore.",
          },
        ],
        subtitle: "Zoom con motion blur.",
        timelineAria: "Tracce di anteprima della timeline",
        title: "Concentrati su ciò che conta.",
      },
      deviceMockups: {
        description:
          "Esporta con straordinari frame di dispositivi. iPhone, Mac, Studio Display: i tuoi contenuti presentati alla perfezione.",
        eyebrow: "Esporta Option",
        formats: ["Risoluzione originale", "Live Photo", "MP4/MOV"],
        imageAlt: {
          iPhone: "iPhone 17 Pro Velocità max",
          macBook: "Applicazione ScreenCam in esecuzione su MacBook Pro",
          studioDisplay: "ScreenCam in esecuzione su Studio Display con MacBook",
        },
        title: "Bellissimo su ogni schermo.",
      },
      controls: {
        body:
          "La modalità manuale ti offre completa libertà creativa. Aggiungi più ancoraggi a un singolo clip zoom, ciascuno con la propria scala e il proprio punto centrale.",
        centerLabel: "Centro",
        dragCenter: "Trascina per regolare il centro",
        eyebrow: "Controlli avanzati",
        features: [
          "Trascina le ancore per riposizionarle sulla timeline",
          "Regola la scala da 1x a 5x per ancoraggio",
          "Imposta un centro di messa a fuoco personalizzato per ogni zoom",
          "Transizioni fluide tra le ancore",
        ],
        pauseAria: "Metti in pausa la riproduzione della timeline fittizia",
        pauseTitle: "Pausa",
        playAria: "Riproduci la riproduzione della timeline simulata",
        playTitle: "Gioca",
        scaleAria: "Scala",
        scaleLabel: "Scala",
        titleMuted: "ogni punto di zoom.",
        titleStart: "Controllo totale su",
      },
      performance: {
        cta: "Visualizza i dati benchmark completi",
        metrics: {
          appSize: "Dimensioni dell'app",
          appSizeNote: "circa 20 MB contro 600 MB",
          cpuUsage: "Utilizzo della CPU",
          exportTime: "Orario di esportazione",
          exportTimeNote: "più corto è più veloce",
          memory: "Memoria",
          others: "Altri",
          screenCam: "ScreenCam",
        },
        subtitle: "Nessun elettrone. Nessuna visualizzazione web. Pura prestazione nativa.",
        title: "Nativo significa veloce.",
      },
      featureCards: {
        eyebrow: "Caratteristiche More",
        title: "Piccoli dettagli, pronti per flussi di lavoro reali.",
        subtitle: "Tocchi nativi che rendono la registrazione veloce, raffinata e Mac-first.",
        beautyThumb: {
          beforeLabel: "Bellezza spenta",
          afterLabel: "Bellezza accesa",
          disclosure:
            "Ritratto generato dall'intelligenza artificiale, utilizzato solo per dimostrare il reale effetto di bellezza.",
          enterFloatingAria: "Mostra come finestra della fotocamera mobile",
          exitFloatingAria: "Riporta la finestra della fotocamera all'anteprima completa",
          pauseAria: "Metti in pausa la demo del confronto di bellezza",
          playAria: "Gioca alla demo comparativa di bellezza",
          shapeCycleAria: "Cambia la forma della finestra mobile",
          shapeLabels: {
            circle: "Cerchio",
            square: "Quadrato arrotondato",
            wide: "16:9",
          },
        },
        dynamicIslandThumb: {
          ariaLabel: "Anteprima dell'attività in background dell'isola dinamica",
          materialLabel: "Materiale della tacca",
          modeLabels: {
            black: "Nero",
            glass: "Vetro",
          },
          tasks: [
            {
              title: "ScreenCam filmato di lancio",
              detail: "Pronto per essere rivelato in Finder.",
              primaryAction: "Apri Finder",
              secondary: "Completo",
              secondaryAction: "Fatto",
              size: "384 MB",
            },
            {
              title: "Esportazione tutorial 4K",
              detail: "Codifica H.265 con livelli di fotocamera e cursore.",
              primaryAction: "Apri Finder",
              secondary: "2m rimasti",
              secondaryAction: "Fatto",
              size: "1,2GB",
            },
            {
              title: "Compressione dell'anteprima GIF",
              detail: "Ottimizzazione dei fotogrammi per una clip condivisibile più piccola.",
              primaryAction: "Apri Finder",
              secondary: "42 rimasti",
              secondaryAction: "Fatto",
              size: "18MB",
            },
          ],
          wallpaperButtonAria: "Cambia lo sfondo",
        },
        effectLayersThumb: {
          ariaLabel: "Anteprima della timeline dei livelli di effetti",
          dragHint: "Trascina sulla traccia per aggiungerla",
          effects: [
            {
              id: "mosaic",
              title: "Mosaico",
              description: "Pixela le aree sensibili sopra la registrazione.",
              clipLabel: "Mosaico",
            },
            {
              id: "focus",
              title: "Concentrarsi",
              description: "Evidenzia una regione mantenendo visibile il contesto.",
              clipLabel: "Concentrarsi",
            },
            {
              id: "text",
              title: "Testo",
              description: "Aggiungi un livello di testo ovunque nella modifica.",
              clipLabel: "Testo",
            },
            {
              id: "image",
              title: "Immagine",
              description: "Posiziona una sovrapposizione di immagini come livello temporizzato.",
              clipLabel: "Immagine",
            },
          ],
        },
        glassThumb: {
          modeLabels: {
            clear: "Chiaro",
            regular: "regolare",
          },
          toolbarItems: {
            area: "Zona",
            camera: "Fotocamera",
            close: "Nascondi ScreenCam",
            display: "Visualizzazione",
            iphone: "iPhone",
            keyboard: "Registrazione degli eventi da tastiera",
            microphone: "Microfono",
            settings: "Impostazioni",
            systemAudio: "Registrazione audio del sistema",
            window: "Finestra",
            workspace: "Apri l'area di lavoro",
          },
          wallpaperButtonAria: "Cambia lo sfondo",
        },
        items: [
          {
            title: "Vetro liquido",
            caption: "I materiali in vetro nativi mantengono i controlli nitidi abbinandosi alle moderne superfici macOS.",
          },
          {
            title: "Cattura scorciatoia",
            caption: "Registra le scorciatoie da tastiera durante l'acquisizione e visualizzale chiaramente nel video finale.",
          },
          {
            title: "Bellezza leggera",
            caption: "Applica delicati effetti di bellezza per un aspetto più pulito della fotocamera.",
          },
          {
            title: "Isola dinamica",
            caption: "Metti le esportazioni lunghe in background e mantieni i progressi visibili dalla tacca.",
          },
          {
            title: "Livelli di effetti",
            caption: "Aggiungi tutti i livelli di effetti di cui hai bisogno, quindi sposta, ridimensiona e impila ogni clip sulla timeline.",
          },
        ],
      },
      faq: {
        eyebrow: "Domande frequenti",
        title: "Domande e risposte",
        items: [
          {
            question: "ScreenCam è un'alternativa a Screen Studio?",
            answer:
              "Sì. ScreenCam è un'alternativa nativa a macOS Screen Studio per i creatori che desiderano un ingombro ridotto dell'app, un minore utilizzo delle risorse, esportazioni più veloci, ancoraggi di zoom manuali, modelli di dispositivi, livelli più ricchi, esportazione GIF, esportazione Live Photo e un'esperienza di modifica Mac inedita.",
          },
          {
            question: "In cosa differisce il ScreenCam dai registratori basati su browser?",
            answer:
              "ScreenCam è progettato per macOS come app nativa di registrazione e modifica. L'obiettivo è un flusso di lavoro compatto Mac con acquisizione locale, controlli di modifica fluidi ed esportazione accurata in anteprima.",
          },
          {
            question: "Qual è la versione minima macOS richiesta?",
            answer: "ScreenCam richiede macOS 15 o successivo.",
          },
          {
            question: "Esiste una versione per Windows?",
            answer:
              "Non adesso. ScreenCam è focalizzato su macOS e non prevediamo di sviluppare una versione Windows a breve termine.",
          },
          {
            question: "Posso esportare in formati diversi?",
            answer:
              "ScreenCam è progettato per l'esportazione di video di alta qualità dall'editor, con controlli di inquadratura e movimento riflessi nell'output finale.",
          },
          {
            question: "Come funziona la funzione di zoom?",
            answer:
              "Puoi aggiungere punti di zoom ovunque sulla timeline. In modalità manuale, hai il controllo completo: imposta più ancoraggi con diversi livelli di zoom e centri di messa a fuoco. Le transizioni includono effetti di motion blur fluidi.",
          },
          {
            question: "Supporta più monitor?",
            answer:
              "ScreenCam è progettato per i flussi di lavoro di registrazione dello schermo Mac, inclusi display collegati, finestre e regioni di acquisizione.",
          },
        ],
      },
    },
    legal: {
      privacy: {
        eyebrow: "Privacy",
        title: "Informativa sulla privacy",
        updated: "Ultimo aggiornamento: 3 giugno 2026",
        sections: [
          {
            title: "Panoramica",
            paragraphs: [
              [
                "ScreenCam è un'app nativa per la registrazione e la modifica dello schermo macOS. L'app è progettata per elaborare le registrazioni localmente sul tuo Mac. ScreenCam può effettuare richieste di rete per funzionalità dell'app come lo stato di acquisto di App Store e, quando si sceglie di abilitarlo, analisi facoltative sull'utilizzo anonimo. Non utilizziamo tracker pubblicitari nell'app.",
              ],
            ],
          },
          {
            title: "Registrazioni e file locali",
            paragraphs: [
              [
                "Le registrazioni dello schermo, i video della fotocamera, l'audio del microfono, l'audio del sistema, i dati del cursore, i video esportati, i file dell'area di lavoro e i file degli sfondi personalizzati rimangono sul tuo dispositivo o nelle posizioni che scegli. ScreenCam non carica questo contenuto sui server ScreenCam.",
              ],
            ],
          },
          {
            title: "Analisi dell'utilizzo anonimo",
            paragraphs: [
              [
                "ScreenCam potrebbe chiederti se desideri condividere analisi anonime sull'utilizzo per aiutarci a capire quali funzionalità di registrazione e modifica funzionano bene. Puoi attivare o disattivare la condivisione delle analisi in qualsiasi momento nell'app. Se la condivisione delle analisi è disabilitata, ScreenCam non invia analisi sull'utilizzo.",
              ],
              [
                "Le analisi sono limitate all'utilizzo del prodotto, alla diagnostica e alle informazioni sulle prestazioni, come interazioni con le funzionalità, versione dell'app, versione macOS e informazioni generali sul dispositivo. Non raccogliamo mai contenuti dello schermo, audio, video della fotocamera, file di progetto, nomi di file o testo digitato tramite analisi.",
              ],
            ],
          },
          {
            title: "Autorizzazioni",
            paragraphs: [
              [
                "ScreenCam potrebbe chiedere a macOS le autorizzazioni per la registrazione dello schermo, il microfono, la fotocamera e l'accesso ai file. Queste autorizzazioni vengono utilizzate solo per fornire funzionalità di registrazione, modifica, esportazione e file selezionati dall'utente. Puoi gestire queste autorizzazioni nelle Impostazioni di sistema.",
              ],
            ],
          },
          {
            title: "Acquisti",
            paragraphs: [
              [
                "Gli abbonamenti e gli acquisti ScreenCam Pro vengono elaborati da Apple tramite Mac App Store. ScreenCam legge lo stato dell'acquisto e dell'abbonamento da StoreKit in modo che l'app possa sbloccare le funzionalità Pro. ScreenCam non riceve né memorizza i dettagli della tua carta di pagamento.",
              ],
            ],
          },
          {
            title: "Sito web",
            paragraphs: [
              [
                "Quando visiti la schermata.cam, i nostri fornitori di hosting e infrastruttura possono elaborare dati di registro del server standard come indirizzo IP, agente utente del browser, URL di richiesta e tempo di richiesta per la sicurezza, la diagnostica e la consegna del sito web. Il sito web non utilizza tracker pubblicitari.",
              ],
            ],
          },
          {
            title: "Modifiche e contatti",
            paragraphs: [
              ["Potremmo aggiornare questa politica man mano che ScreenCam cambia. Se hai domande sulla privacy, contattaci all'indirizzo", emailLink, "."],
            ],
          },
        ],
      },
      support: {
        eyebrow: "Supporto",
        title: "Supporto ScreenCam",
        updated: "Per assistenza con ScreenCam per macOS.",
        supportChannelsAria: "Canali di supporto",
        sections: [
          {
            title: "Contatto",
            showSupportChannels: true,
            paragraphs: [
              [
                "E-mail",
                emailLink,
                "per supporto prodotto, segnalazioni di bug, domande sull'acquisto e feedback.",
              ],
            ],
          },
          {
            title: "Includi questi dettagli",
            paragraphs: [
              [
                "Quando segnali un problema, includi la versione macOS, la versione ScreenCam, il modello Mac, le impostazioni di registrazione, il formato di esportazione e una breve descrizione dell'accaduto. Schermate o brevi registrazioni sono utili quando il problema è visivo.",
              ],
            ],
          },
          {
            title: "Acquisti App Store",
            paragraphs: [
              [
                "ScreenCam è distribuito tramite Mac App Store. Fatturazione, abbonamenti, rinnovi, cancellazioni e rimborsi vengono gestiti da Apple tramite l'ID Apple e le impostazioni dell'account App Store.",
              ],
            ],
          },
          {
            title: "Requisiti",
            paragraphs: [
              [
                "ScreenCam è attualmente costruito per macOS. Non esiste una versione per Windows e lo sviluppo di Windows non è pianificato a breve termine.",
              ],
            ],
          },
          {
            title: "Privacy",
            paragraphs: [
              [
                "Le registrazioni e i file dell'area di lavoro vengono elaborati localmente sul tuo Mac. Leggi il",
                { href: "/privacy", text: "Informativa sulla privacy" },
                "per maggiori dettagli.",
              ],
            ],
          },
        ],
      },
      terms: {
        eyebrow: "Termini",
        title: "Condizioni d'uso",
        updated: "Ultimo aggiornamento: 20 maggio 2026",
        sections: [
          {
            title: "Licenza dell'app",
            paragraphs: [
              [
                "ScreenCam viene concesso in licenza ai sensi del contratto di licenza standard per l'utente finale (EULA) di Apple, salvo diversamente richiesto dalla legge applicabile. È possibile consultare l'EULA standard di Apple all'indirizzo",
                appleEulaLink,
                ".",
              ],
            ],
          },
          {
            title: "Abbonamenti e acquisti",
            paragraphs: [
              [
                "Gli abbonamenti e gli acquisti ScreenCam Pro vengono elaborati da Apple tramite Mac App Store. La fatturazione, il rinnovo, l'annullamento, i rimborsi e la gestione dell'account dell'abbonamento vengono gestiti tramite l'ID Apple e le impostazioni dell'account App Store.",
              ],
            ],
          },
          {
            title: "Utilizzo di ScreenCam",
            paragraphs: [
              [
                "Sei responsabile delle registrazioni, dei file e delle esportazioni che crei con ScreenCam. Registra, modifica e condividi contenuti solo quando disponi dei diritti e delle autorizzazioni necessari per farlo.",
              ],
            ],
          },
          {
            title: "Privacy",
            paragraphs: [
              ["Le pratiche sulla privacy di ScreenCam sono descritte nel", { href: "/privacy", text: "Informativa sulla privacy" }, "."],
            ],
          },
          {
            title: "Contatto",
            paragraphs: [
              ["Se hai domande su questi termini, contattaci all'indirizzo", emailLink, "."],
            ],
          },
        ],
      },
    },
    changelog: {
      description: "Proaggiornamenti, correzioni e note di rilascio del condotto.",
      eyebrow: "Registro delle modifiche",
      intro: "Proaggiornamenti, correzioni e note di rilascio del condotto.",
      linkVersionLabel: "Collegamento alla versione",
      title: "ScreenCam Registro modifiche",
    },
    motionBlurTool: {
      addMaskAria: "Aggiungi maschera",
      addMaskButton: "Maschera",
      angleAria: "Angolo di sfocatura",
      angleLabel: "Angolo",
      blurSettingsTitle: "Impostazioni di sfocatura",
      chooseImage: "Scegli Immagine",
      clearImage: "Immagine chiara",
      defaultMaskName: "Maschera",
      deleteSelectedMaskAria: "Delete maschera selezionata",
      description:
        "Costruisci regioni di sfocatura rettangolari, regola la direzione e l'intensità, quindi esporta l'immagine composita.",
      emptyMasksWithImage: "Aggiungi una maschera per sfocare parte dell'immagine.",
      emptyMasksWithoutImage: "Carica prima un'immagine.",
      exportButton: "Esporta",
      heightLabel: "Altezza",
      linearMode: "Lineare",
      maskButton: "Maschera",
      masksTitle: "Maschere",
      modeLabel: "Modalità",
      nameLabel: "Nome",
      previewAria: "Anteprima della sfocatura del movimento",
      replaceImageAria: "Sostituisci l'immagine",
      selectedMaskEmpty: "Seleziona una maschera per modificarne la direzione, l'intensità, la posizione e le dimensioni della sfocatura.",
      sourceTitle: "Fonte",
      strengthAria: "Intensità della sfocatura",
      strengthLabel: "Forza",
      title: "Maschera di sfocatura movimento",
      toolEyebrow: "Strumento",
      uniformMode: "Uniforme",
      uploadDescription: "Trascina qui un'immagine locale o scegli un file per iniziare a modificare.",
      uploadTitle: "Carica un'immagine",
      widthLabel: "Larghezza",
      xLabel: "X",
      yLabel: "Y",
    },
  },
};

export const translations: Record<Locale, LocaleTranslation> =
  compileTranslations(rawTranslations);

export function getTranslation(locale: Locale): LocaleTranslation {
  return translations[locale];
}
