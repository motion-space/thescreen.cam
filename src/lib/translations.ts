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
    appStore: string;
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
        appStore: "App Store",
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
      structuredDataFeatureList: [
        "Native macOS screen recording",
        "Manual zoom anchors",
        "Motion blur transitions",
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
            title: "Shortcut Recording",
            caption: "Start, pause, and finish captures from the keyboard without breaking flow.",
          },
          {
            title: "Light Beauty",
            caption: "Includes basic beauty effects such as skin smoothing, brightening, face slimming, and eye enlargement.",
          },
        ],
      },
      faq: {
        eyebrow: "FAQ",
        title: "Questions & Answers",
        items: [
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
        appStore: "App Store",
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
            title: "快捷键录制",
            caption: "用键盘快速开始、暂停和结束录制，不打断当前操作。",
          },
          {
            title: "轻度美颜",
            caption: "提供基础美颜效果，例如磨皮、美白、瘦脸、大眼等。",
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
        appStore: "App Store",
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
            title: "Shortcut-Aufnahme",
            caption: "Aufnahmen per Tastatur starten, pausieren und beenden, ohne den Flow zu unterbrechen.",
          },
          {
            title: "Leichte Beauty",
            caption: "Bietet grundlegende Beauty-Effekte wie Hautglättung, Aufhellung, schmaleres Gesicht und größere Augen.",
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
        appStore: "App Store",
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
            title: "ショートカット録画",
            caption: "キーボードから録画の開始、一時停止、終了まで素早く操作できます。",
          },
          {
            title: "軽い美肌補正",
            caption: "肌のなめらか補正、美白、小顔、大きな目などの基本的な補正に対応します。",
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
        appStore: "App Store",
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
            title: "단축키 녹화",
            caption: "키보드로 녹화를 시작, 일시정지, 종료해 작업 흐름을 끊지 않습니다.",
          },
          {
            title: "가벼운 보정",
            caption: "피부 보정, 밝기 보정, 얼굴 슬림, 큰 눈 등 기본 보정 효과를 제공합니다.",
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
};

export const translations: Record<Locale, LocaleTranslation> =
  compileTranslations(rawTranslations);

export function getTranslation(locale: Locale): LocaleTranslation {
  return translations[locale];
}
