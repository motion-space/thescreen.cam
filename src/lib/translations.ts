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
  timelineAria: string;
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
    exportSpeed: string;
    memory: string;
    others: string;
    screenCam: string;
  };
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
  home: {
    controls: CustomControlsCopy;
    deviceMockups: DeviceMockupsCopy;
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
    home: PageMeta;
    motionBlurMask: PageMeta;
    privacy: PageMeta;
    support: PageMeta;
    terms: PageMeta;
  };
  motionBlurTool: MotionBlurMaskToolCopy;
};

const emailLink = { href: "mailto:cats_juice@outlook.com", text: "cats_juice@outlook.com" };
const appleEulaLink = {
  href: "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/",
  text: "apple.com/legal/internet-services/itunes/dev/stdeula",
};

export const translations: Record<Locale, LocaleTranslation> = {
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
        timelineAria: "Timeline preview tracks",
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
          exportSpeed: "Export Speed",
          memory: "Memory",
          others: "Others",
          screenCam: "ScreenCam",
        },
        subtitle: "No Electron. No web views. Pure native performance.",
        title: "Native means fast.",
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
        timelineAria: "时间线预览轨道",
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
          exportSpeed: "导出速度",
          memory: "内存",
          others: "其他",
          screenCam: "ScreenCam",
        },
        subtitle: "没有 Electron。没有 WebView。纯原生性能。",
        title: "原生，所以快。",
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
        timelineAria: "Timeline-Vorschauspuren",
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
          exportSpeed: "Exportgeschwindigkeit",
          memory: "Speicher",
          others: "Andere",
          screenCam: "ScreenCam",
        },
        subtitle: "Kein Electron. Keine Webviews. Reine native Performance.",
        title: "Nativ heißt schnell.",
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
        timelineAria: "タイムラインプレビュートラック",
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
          exportSpeed: "書き出し速度",
          memory: "メモリ",
          others: "その他",
          screenCam: "ScreenCam",
        },
        subtitle: "Electron なし。WebView なし。純粋なネイティブ性能。",
        title: "ネイティブだから速い。",
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
        timelineAria: "타임라인 미리보기 트랙",
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
          exportSpeed: "내보내기 속도",
          memory: "메모리",
          others: "기타",
          screenCam: "ScreenCam",
        },
        subtitle: "Electron 없음. WebView 없음. 순수 네이티브 성능.",
        title: "네이티브라서 빠릅니다.",
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

export function getTranslation(locale: Locale): LocaleTranslation {
  return translations[locale];
}
