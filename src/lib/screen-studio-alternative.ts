import type { Locale } from "./i18n";
import type { FAQCopy } from "./translations";

type HighlightCopy = {
  body?: string;
  detail?: string;
  label?: string;
  title?: string;
  value?: string;
};

type ComparisonRowCopy = {
  feature: string;
  screenCam: string;
  screenStudio: string;
};

export type ScreenStudioAlternativePageCopy = {
  meta: {
    title: string;
    description: string;
  };
  imageAlt: string;
  lastUpdated: string;
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    appStoreCta: string;
    benchmarkCta: string;
    lastUpdatedLabel: string;
  };
  performanceHighlights: Array<Required<Pick<HighlightCopy, "value" | "label" | "detail">>>;
  whySwitch: {
    eyebrow: string;
    title: string;
    description: string;
  };
  features: {
    eyebrow: string;
    title: string;
    items: Array<Required<Pick<HighlightCopy, "title" | "body">>>;
  };
  comparison: {
    eyebrow: string;
    title: string;
    description: string;
    headers: {
      feature: string;
      screenCam: string;
      screenStudio: string;
    };
    rows: ComparisonRowCopy[];
  };
  bestFit: {
    eyebrow: string;
    title: string;
    items: string[];
    gapEyebrow: string;
    gapTitle: string;
    gapDescription: string;
    pricingCta: string;
    screenStudioCta: string;
  };
  faq: FAQCopy;
  schema: {
    breadcrumbName: string;
    about: string[];
    softwareDescription: string;
    featureList: string[];
  };
};

const screenStudioAlternativeCopies: Record<Locale, ScreenStudioAlternativePageCopy> = {
  en: {
    meta: {
      title: "Screen Studio Alternative for Mac | ScreenCam",
      description:
        "Looking for a Screen Studio alternative? ScreenCam is a native macOS screen recorder with a smaller app size, lower resource use, faster exports, manual zoom anchors, layers, device mockups, GIF, and Live Photo export.",
    },
    imageAlt: "ScreenCam screen recorder interface with native macOS controls",
    lastUpdated: "June 13, 2026",
    hero: {
      eyebrow: "Screen Studio Alternative for Mac",
      title: "A lighter Screen Studio alternative.",
      description:
        "ScreenCam keeps the polished Mac screen-recording workflow, then adds deeper manual zoom, richer layers, smaller footprint, and more export shapes.",
      appStoreCta: "View ScreenCam on the Mac App Store",
      benchmarkCta: "View benchmark data",
      lastUpdatedLabel: "Last updated:",
    },
    performanceHighlights: [
      {
        value: "30x",
        label: "smaller app footprint",
        detail: "About 20MB vs the roughly 600MB benchmark baseline.",
      },
      {
        value: "Lower",
        label: "CPU + memory use",
        detail: "Side-by-side benchmark data keeps the claim measurable.",
      },
      {
        value: "Faster",
        label: "native export path",
        detail: "Shorter export timing in the benchmark comparison.",
      },
      {
        value: "< 1/3",
        label: "subscription price",
        detail: "Current App Store pricing varies by region.",
      },
    ],
    whySwitch: {
      eyebrow: "Why switch",
      title: "Speed and control, without the heavy footprint.",
      description:
        "Screen Studio covers the core automated recording workflow. ScreenCam goes further with a lighter native app, measured performance wins, and deeper automatic and manual control after recording.",
    },
    features: {
      eyebrow: "Creative control",
      title: "The parts ScreenCam makes easier to direct.",
      items: [
        {
          title: "Manual zoom anchors",
          body: "Multiple centers, per-anchor scale, and custom curves in one zoom clip.",
        },
        {
          title: "Unlimited layers",
          body: "Mosaic, text, focus effects, and custom images can overlap in the same time range.",
        },
        {
          title: "Device mockups",
          body: "Mac, iPhone, Apple Watch, and Studio Display-style framing for product demos.",
        },
        {
          title: "GIF + Live Photo",
          body: "Ship recordings as quick visual assets, not only full video files.",
        },
        {
          title: "Camera beauty",
          body: "Light presenter polish for camera-led walkthroughs.",
        },
        {
          title: "Native Mac feel",
          body: "Liquid Glass-style surfaces, keyboard-first capture, and Mac App Store distribution.",
        },
      ],
    },
    comparison: {
      eyebrow: "Comparison",
      title: "ScreenCam vs Screen Studio",
      description:
        "Screen Studio covers the core recording and editing workflow. ScreenCam builds on it with a smaller native footprint, deeper control, richer creative tools, and more output options.",
      headers: {
        feature: "Feature",
        screenCam: "ScreenCam",
        screenStudio: "Screen Studio",
      },
      rows: [
        {
          feature: "Performance footprint",
          screenCam: "About 30x smaller, lower CPU and memory use, faster exports.",
          screenStudio: "Standard screen recording, editing, and export pipeline.",
        },
        {
          feature: "Zoom control",
          screenCam: "Auto zoom with highly customizable animation curves.",
          screenStudio: "Auto zoom and cursor-driven motion.",
        },
        {
          feature: "Layers",
          screenCam: "Mosaic, text, focus, image layers, unlimited overlap.",
          screenStudio: "Core overlays, backgrounds, and masking.",
        },
        {
          feature: "Device presentation",
          screenCam: "Built-in Mac, iPhone, Apple Watch, and Studio Display mockups.",
          screenStudio: "Core device capture and presentation workflow.",
        },
        {
          feature: "Export formats",
          screenCam: "Video, GIF, and Live Photo.",
          screenStudio: "Video and GIF export.",
        },
        {
          feature: "Background music",
          screenCam: "Freely trim and arrange music with fade-in and fade-out controls.",
          screenStudio: "Basic background music selection.",
        },
        {
          feature: "Camera polish",
          screenCam: "Camera layouts, background removal, beauty controls, and sticker effects.",
          screenStudio: "Camera layouts and webcam presentation.",
        },
        {
          feature: "Pricing",
          screenCam: "Free download; subscription is below one-third in supported App Store regions.",
          screenStudio: "Subscription pricing is shown on Screen Studio's official purchase flow.",
        },
        {
          feature: "Captions and transcripts",
          screenCam: "More transcription providers with BYOK, highly customizable read-along captions, and Liquid Glass backgrounds.",
          screenStudio: "Core transcription and subtitle workflow.",
        },
      ],
    },
    bestFit: {
      eyebrow: "Best fit",
      title: "Choose ScreenCam if...",
      items: [
        "Product demos that need multiple directed zoom centers",
        "Mac app walkthroughs with device mockups and custom framing",
        "Clips that need redaction, focus highlights, text, and images",
        "Exports that need GIF or Live Photo output",
      ],
      gapEyebrow: "Captions",
      gapTitle: "Captions styled your way.",
      gapDescription:
        "Choose from multiple transcription providers with BYOK, fine-tune highly customizable read-along captions, and style them with reusable presets, including blur and Liquid Glass backgrounds.",
      pricingCta: "Check App Store pricing",
      screenStudioCta: "View Screen Studio",
    },
    faq: {
      eyebrow: "FAQ",
      title: "Questions about switching from Screen Studio",
      items: [
        {
          question: "Is ScreenCam a Screen Studio alternative?",
          answer:
            "Yes. ScreenCam is a native macOS screen recorder and editor for polished product demos, tutorials, app walkthroughs, and social clips. It is especially strong if you want a smaller app, lower resource use, faster exports, and deeper manual zoom control.",
        },
        {
          question: "What makes ScreenCam different from Screen Studio?",
          answer:
            "ScreenCam focuses on native Mac performance, manual zoom anchors, richer time-based layers, device mockups, Liquid Glass-style UI, configurable animation curves, GIF export, and Live Photo export.",
        },
        {
          question: "Is ScreenCam cheaper than Screen Studio?",
          answer:
            "ScreenCam is a free download with in-app purchases on the Mac App Store. Current pricing varies by region, but ScreenCam's subscription is positioned below one-third of Screen Studio's subscription price in supported regions.",
        },
        {
          question: "Does ScreenCam support subtitles?",
          answer:
            "Yes. ScreenCam offers multiple transcription providers with BYOK, highly customizable read-along captions, per-caption visibility, reusable styles, and blur or Liquid Glass backgrounds.",
        },
        {
          question: "Does ScreenCam support custom zoom animations?",
          answer:
            "Yes. Manual zoom mode supports custom anchors, multiple zoom centers, per-anchor scale, and configurable animation curves, so you can direct the viewer's attention after recording.",
        },
        {
          question: "Can ScreenCam export GIF or Live Photo files?",
          answer:
            "Yes. ScreenCam supports richer export workflows, including GIF and Live Photo, alongside video-focused exports.",
        },
      ],
    },
    schema: {
      breadcrumbName: "Screen Studio Alternative",
      about: ["Screen Studio alternative", "Mac screen recorder with zoom"],
      softwareDescription:
        "ScreenCam is a native macOS screen recorder for sharp capture, manual zoom anchors, layers, device mockups, motion blur, and preview-accurate export.",
      featureList: [
        "Native macOS screen recording",
        "Manual zoom anchors",
        "Custom animation curves",
        "Device mockups",
        "Mosaic, text, focus, and custom image layers",
        "GIF export",
        "Live Photo export",
        "Camera beauty effects",
        "Preview-accurate export",
      ],
    },
  },
  "zh-Hans": {
    meta: {
      title: "Mac 版 Screen Studio 替代方案 | ScreenCam",
      description:
        "在找 Screen Studio 替代方案？ScreenCam 是原生 macOS 录屏工具，应用体积更小、资源占用更低、导出更快，并支持手动变焦锚点、图层、设备样机、GIF 和 Live Photo 导出。",
    },
    imageAlt: "带有原生 macOS 控制区的 ScreenCam 录屏界面",
    lastUpdated: "2026 年 6 月 13 日",
    hero: {
      eyebrow: "Mac 版 Screen Studio 替代方案",
      title: "更轻量的 Screen Studio 替代方案。",
      description:
        "ScreenCam 保留精致的 Mac 录屏工作流，同时加入更深入的手动变焦、更丰富的图层、更小的体积和更多导出形态。",
      appStoreCta: "在 Mac App Store 查看 ScreenCam",
      benchmarkCta: "查看基准测试数据",
      lastUpdatedLabel: "最后更新：",
    },
    performanceHighlights: [
      {
        value: "30x",
        label: "更小应用体积",
        detail: "约 20MB，对比基准约 600MB。",
      },
      {
        value: "更低",
        label: "CPU + 内存占用",
        detail: "并排基准测试让性能结论保持可衡量。",
      },
      {
        value: "更快",
        label: "原生导出链路",
        detail: "基准对比中导出耗时更短。",
      },
      {
        value: "< 1/3",
        label: "订阅价格",
        detail: "当前 App Store 价格会因地区而不同。",
      },
    ],
    whySwitch: {
      eyebrow: "为什么切换",
      title: "更快、更可控，同时没有沉重负担。",
      description:
        "Screen Studio 覆盖基础自动化录制流程。ScreenCam 在此之上提供更轻的原生应用、可量化的性能优势，以及录制后更深入的自动与手动控制。",
    },
    features: {
      eyebrow: "创作控制",
      title: "ScreenCam 让这些部分更容易被你掌控。",
      items: [
        {
          title: "手动变焦锚点",
          body: "一个变焦片段里可以设置多个中心、每个锚点的缩放比例和自定义曲线。",
        },
        {
          title: "不限数量的图层",
          body: "马赛克、文字、聚焦效果和自定义图片可以在同一时间段内重叠。",
        },
        {
          title: "设备样机",
          body: "用 Mac、iPhone、Apple Watch 和 Studio Display 风格外框制作产品演示。",
        },
        {
          title: "GIF + Live Photo",
          body: "不仅能导出完整视频，也能交付更轻的视觉素材。",
        },
        {
          title: "摄像头美颜",
          body: "给真人讲解类录制提供轻量的人像修饰。",
        },
        {
          title: "原生 Mac 体验",
          body: "Liquid Glass 风格界面、键盘优先录制，以及 Mac App Store 分发。",
        },
      ],
    },
    comparison: {
      eyebrow: "对比",
      title: "ScreenCam vs Screen Studio",
      description:
        "Screen Studio 覆盖基础录制和编辑流程。ScreenCam 在此之上提供更小的原生体积、更深入的控制、更丰富的创作工具和更多输出格式。",
      headers: {
        feature: "功能",
        screenCam: "ScreenCam",
        screenStudio: "Screen Studio",
      },
      rows: [
        {
          feature: "性能负担",
          screenCam: "体积约小 30 倍，CPU 和内存占用更低，导出更快。",
          screenStudio: "提供基础录屏、编辑和导出流程。",
        },
        {
          feature: "变焦控制",
          screenCam: "自动变焦，并支持高度可自定义的动画曲线。",
          screenStudio: "提供自动变焦和光标驱动运动。",
        },
        {
          feature: "图层",
          screenCam: "马赛克、文字、聚焦、图片图层，可不限量重叠。",
          screenStudio: "提供基础浮层、背景和遮罩功能。",
        },
        {
          feature: "设备呈现",
          screenCam: "内置 Mac、iPhone、Apple Watch 和 Studio Display 样机。",
          screenStudio: "提供基础设备录制和呈现流程。",
        },
        {
          feature: "导出格式",
          screenCam: "视频、GIF 和 Live Photo。",
          screenStudio: "支持视频和 GIF 导出。",
        },
        {
          feature: "背景音乐",
          screenCam: "支持自由剪辑和编排音乐，并可设置淡入淡出。",
          screenStudio: "提供基础背景音乐选择。",
        },
        {
          feature: "摄像头修饰",
          screenCam: "支持摄像头布局、背景移除、美颜控制和贴纸效果。",
          screenStudio: "提供摄像头布局和演示者呈现。",
        },
        {
          feature: "价格",
          screenCam: "免费下载；在支持地区订阅价格低于三分之一。",
          screenStudio: "订阅价格以 Screen Studio 官方购买流程为准。",
        },
        {
          feature: "字幕和转写",
          screenCam: "更多转写 Provider 选择并支持 BYOK，高度可定制的 Read Along 字幕及 Liquid Glass 背景。",
          screenStudio: "提供基础转写和字幕工作流。",
        },
      ],
    },
    bestFit: {
      eyebrow: "适合场景",
      title: "如果你需要这些，选 ScreenCam...",
      items: [
        "需要多个定向变焦中心的产品演示",
        "带设备样机和自定义画幅的 Mac app 演示",
        "需要打码、聚焦高亮、文字和图片的短片",
        "需要 GIF 或 Live Photo 输出的导出流程",
      ],
      gapEyebrow: "字幕功能",
      gapTitle: "字幕样式，由你定义。",
      gapDescription:
        "可从多个转写 Provider 中选择并使用 BYOK，精细定制 Read Along 字幕，还能通过可复用预设设置模糊和 Liquid Glass 背景。",
      pricingCta: "查看 App Store 价格",
      screenStudioCta: "查看 Screen Studio",
    },
    faq: {
      eyebrow: "FAQ",
      title: "从 Screen Studio 切换前的常见问题",
      items: [
        {
          question: "ScreenCam 是 Screen Studio 替代方案吗？",
          answer:
            "是。ScreenCam 是原生 macOS 录屏和编辑工具，适合制作精致产品演示、教程、app walkthrough 和社媒短片。如果你想要更小体积、更低资源占用、更快导出和更深入的手动变焦控制，它会特别合适。",
        },
        {
          question: "ScreenCam 和 Screen Studio 有什么不同？",
          answer:
            "ScreenCam 更关注原生 Mac 性能、手动变焦锚点、更丰富的时间线图层、设备样机、Liquid Glass 风格界面、可配置动画曲线、GIF 导出和 Live Photo 导出。",
        },
        {
          question: "ScreenCam 比 Screen Studio 便宜吗？",
          answer:
            "ScreenCam 可在 Mac App Store 免费下载，并提供应用内购买。当前价格因地区而异，但在支持地区 ScreenCam 的订阅价格定位低于 Screen Studio 订阅价的三分之一。",
        },
        {
          question: "ScreenCam 支持字幕吗？",
          answer:
            "支持。ScreenCam 提供多个转写 Provider 和 BYOK、高度可定制的 Read Along 字幕、单条字幕显隐、可复用样式，以及模糊或 Liquid Glass 背景。",
        },
        {
          question: "ScreenCam 支持自定义变焦动画吗？",
          answer:
            "支持。手动变焦模式支持自定义锚点、多个变焦中心、每个锚点的缩放比例和可配置动画曲线，让你在录制后继续引导观众注意力。",
        },
        {
          question: "ScreenCam 可以导出 GIF 或 Live Photo 吗？",
          answer:
            "可以。ScreenCam 除了面向视频的导出，也支持 GIF 和 Live Photo 等更丰富的导出流程。",
        },
      ],
    },
    schema: {
      breadcrumbName: "Screen Studio 替代方案",
      about: ["Screen Studio 替代方案", "带变焦的 Mac 录屏工具"],
      softwareDescription:
        "ScreenCam 是原生 macOS 录屏工具，支持清晰录制、手动变焦锚点、图层、设备样机、运动模糊和精确预览导出。",
      featureList: ["原生 macOS 屏幕录制", "手动变焦锚点", "自定义动画曲线", "设备样机", "马赛克、文字、聚焦和自定义图片图层", "GIF 导出", "Live Photo 导出", "摄像头美颜", "精确预览导出"],
    },
  },
  de: {
    meta: {
      title: "Screen-Studio-Alternative für Mac | ScreenCam",
      description:
        "Suchst du eine Screen-Studio-Alternative? ScreenCam ist ein nativer macOS-Screenrecorder mit kleinerer App, niedrigerer Ressourcennutzung, schnellerem Export, manuellen Zoom-Ankern, Ebenen, Geräte-Mockups, GIF- und Live-Photo-Export.",
    },
    imageAlt: "ScreenCam-Oberfläche für Bildschirmaufnahmen mit nativen macOS-Steuerelementen",
    lastUpdated: "13. Juni 2026",
    hero: {
      eyebrow: "Screen-Studio-Alternative für Mac",
      title: "Eine leichtere Screen-Studio-Alternative.",
      description:
        "ScreenCam behält den hochwertigen Mac-Screenrecording-Workflow bei und ergänzt ihn um mehr manuellen Zoom, reichere Ebenen, eine kleinere App und mehr Exportformen.",
      appStoreCta: "ScreenCam im Mac App Store ansehen",
      benchmarkCta: "Benchmark-Daten ansehen",
      lastUpdatedLabel: "Zuletzt aktualisiert:",
    },
    performanceHighlights: [
      {
        value: "30x",
        label: "kleinere App",
        detail: "Etwa 20 MB gegenüber der Benchmark-Basis von ungefähr 600 MB.",
      },
      {
        value: "Niedriger",
        label: "CPU + Speicher",
        detail: "Der direkte Benchmark-Vergleich macht die Aussage messbar.",
      },
      {
        value: "Schneller",
        label: "nativer Exportpfad",
        detail: "Kürzere Exportzeiten im Benchmark-Vergleich.",
      },
      {
        value: "< 1/3",
        label: "Abo-Preis",
        detail: "Aktuelle App-Store-Preise unterscheiden sich je nach Region.",
      },
    ],
    whySwitch: {
      eyebrow: "Warum wechseln",
      title: "Geschwindigkeit und Kontrolle, ohne schweres Gepäck.",
      description:
        "Screen Studio deckt den grundlegenden automatisierten Aufnahme-Workflow ab. ScreenCam geht mit einer leichteren nativen App, messbaren Performance-Vorteilen und tieferer automatischer wie manueller Kontrolle weiter.",
    },
    features: {
      eyebrow: "Kreative Kontrolle",
      title: "Die Bereiche, die ScreenCam leichter steuerbar macht.",
      items: [
        {
          title: "Manuelle Zoom-Anker",
          body: "Mehrere Zentren, Skalierung pro Anker und eigene Kurven in einem Zoom-Clip.",
        },
        {
          title: "Unbegrenzte Ebenen",
          body: "Mosaik, Text, Fokus-Effekte und eigene Bilder können im selben Zeitraum überlappen.",
        },
        {
          title: "Geräte-Mockups",
          body: "Mac-, iPhone-, Apple-Watch- und Studio-Display-Rahmen für Produktdemos.",
        },
        {
          title: "GIF + Live Photo",
          body: "Exportiere Aufnahmen als schnelle visuelle Assets, nicht nur als vollständige Videos.",
        },
        {
          title: "Kamera-Beauty",
          body: "Leichte Presenter-Optimierung für kamerageführte Walkthroughs.",
        },
        {
          title: "Natives Mac-Gefühl",
          body: "Liquid-Glass-Oberflächen, tastaturbasierte Aufnahme und Vertrieb über den Mac App Store.",
        },
      ],
    },
    comparison: {
      eyebrow: "Vergleich",
      title: "ScreenCam vs Screen Studio",
      description:
        "Screen Studio deckt den grundlegenden Aufnahme- und Bearbeitungs-Workflow ab. ScreenCam erweitert ihn um einen kleineren nativen Footprint, tiefere Kontrolle, mehr Kreativwerkzeuge und zusätzliche Ausgabeformate.",
      headers: {
        feature: "Funktion",
        screenCam: "ScreenCam",
        screenStudio: "Screen Studio",
      },
      rows: [
        {
          feature: "Performance-Fußabdruck",
          screenCam: "Etwa 30x kleiner, niedrigere CPU- und Speichernutzung, schnellere Exporte.",
          screenStudio: "Grundlegender Workflow für Bildschirmaufnahme, Bearbeitung und Export.",
        },
        {
          feature: "Zoom-Steuerung",
          screenCam: "Auto-Zoom mit umfassend anpassbaren Animationskurven.",
          screenStudio: "Auto-Zoom und cursorbasierte Bewegung.",
        },
        {
          feature: "Ebenen",
          screenCam: "Mosaik, Text, Fokus, Bildebenen und unbegrenzte Überlappung.",
          screenStudio: "Grundlegende Overlays, Hintergründe und Maskierung.",
        },
        {
          feature: "Gerätepräsentation",
          screenCam: "Integrierte Mac-, iPhone-, Apple-Watch- und Studio-Display-Mockups.",
          screenStudio: "Grundlegender Workflow für Geräteaufnahme und -präsentation.",
        },
        {
          feature: "Exportformate",
          screenCam: "Video, GIF und Live Photo.",
          screenStudio: "Video- und GIF-Export.",
        },
        {
          feature: "Hintergrundmusik",
          screenCam: "Musik frei schneiden und anordnen, inklusive Ein- und Ausblendsteuerung.",
          screenStudio: "Grundlegende Auswahl an Hintergrundmusik.",
        },
        {
          feature: "Kamera-Polish",
          screenCam: "Kamera-Layouts, Hintergrundentfernung, Beauty-Steuerung und Sticker-Effekte.",
          screenStudio: "Kamera-Layouts und Webcam-Präsentation.",
        },
        {
          feature: "Preis",
          screenCam: "Kostenloser Download; das Abo liegt in unterstützten App-Store-Regionen unter einem Drittel.",
          screenStudio: "Abo-Preise stehen im offiziellen Kaufprozess von Screen Studio.",
        },
        {
          feature: "Untertitel und Transkripte",
          screenCam: "Mehr Transkriptionsanbieter mit BYOK, umfassend anpassbare Read-along-Untertitel und Liquid-Glass-Hintergründe.",
          screenStudio: "Grundlegender Workflow für Transkription und Untertitel.",
        },
      ],
    },
    bestFit: {
      eyebrow: "Passt besonders gut",
      title: "Wähle ScreenCam, wenn...",
      items: [
        "Produktdemos mehrere gezielte Zoom-Zentren brauchen",
        "Mac-App-Walkthroughs Geräte-Mockups und eigenes Framing brauchen",
        "Clips Unkenntlichmachung, Fokus-Highlights, Text und Bilder brauchen",
        "Exports GIF- oder Live-Photo-Ausgabe brauchen",
      ],
      gapEyebrow: "Untertitel",
      gapTitle: "Untertitel in deinem Stil.",
      gapDescription:
        "Wähle aus mehreren Transkriptionsanbietern mit BYOK, passe Read-along-Untertitel detailliert an und gestalte sie mit wiederverwendbaren Vorlagen sowie Unschärfe- oder Liquid-Glass-Hintergründen.",
      pricingCta: "App-Store-Preis prüfen",
      screenStudioCta: "Screen Studio ansehen",
    },
    faq: {
      eyebrow: "FAQ",
      title: "Fragen zum Wechsel von Screen Studio",
      items: [
        {
          question: "Ist ScreenCam eine Screen-Studio-Alternative?",
          answer:
            "Ja. ScreenCam ist ein nativer macOS-Screenrecorder und Editor für hochwertige Produktdemos, Tutorials, App-Walkthroughs und Social Clips. Besonders stark ist ScreenCam, wenn du eine kleinere App, niedrigere Ressourcennutzung, schnellere Exporte und tiefere manuelle Zoom-Kontrolle möchtest.",
        },
        {
          question: "Was unterscheidet ScreenCam von Screen Studio?",
          answer:
            "ScreenCam fokussiert native Mac-Performance, manuelle Zoom-Anker, reichere zeitbasierte Ebenen, Geräte-Mockups, Liquid-Glass-Oberflächen, konfigurierbare Animationskurven, GIF-Export und Live-Photo-Export.",
        },
        {
          question: "Ist ScreenCam günstiger als Screen Studio?",
          answer:
            "ScreenCam ist ein kostenloser Download mit In-App-Käufen im Mac App Store. Aktuelle Preise variieren je nach Region, aber das ScreenCam-Abo liegt in unterstützten Regionen unter einem Drittel des Screen-Studio-Abopreises.",
        },
        {
          question: "Unterstützt ScreenCam Untertitel?",
          answer:
            "Ja. ScreenCam bietet mehrere Transkriptionsanbieter mit BYOK, umfassend anpassbare Read-along-Untertitel, Sichtbarkeit pro Untertitel, wiederverwendbare Stile sowie Unschärfe- oder Liquid-Glass-Hintergründe.",
        },
        {
          question: "Unterstützt ScreenCam eigene Zoom-Animationen?",
          answer:
            "Ja. Der manuelle Zoom-Modus unterstützt eigene Anker, mehrere Zoom-Zentren, Skalierung pro Anker und konfigurierbare Animationskurven, damit du die Aufmerksamkeit nach der Aufnahme lenken kannst.",
        },
        {
          question: "Kann ScreenCam GIFs oder Live Photos exportieren?",
          answer:
            "Ja. ScreenCam unterstützt reichere Export-Workflows, darunter GIF und Live Photo, zusätzlich zu videoorientierten Exporten.",
        },
      ],
    },
    schema: {
      breadcrumbName: "Screen-Studio-Alternative",
      about: ["Screen-Studio-Alternative", "Mac-Screenrecorder mit Zoom"],
      softwareDescription:
        "ScreenCam ist ein nativer macOS-Screenrecorder für scharfe Aufnahmen, manuelle Zoom-Anker, Ebenen, Geräte-Mockups, Motion Blur und vorschaugenauen Export.",
      featureList: ["Native macOS-Bildschirmaufnahme", "Manuelle Zoom-Anker", "Eigene Animationskurven", "Geräte-Mockups", "Mosaik-, Text-, Fokus- und Bildebenen", "GIF-Export", "Live-Photo-Export", "Kamera-Beauty-Effekte", "Vorschaugenauer Export"],
    },
  },
  ja: {
    meta: {
      title: "Mac 向け Screen Studio 代替 | ScreenCam",
      description:
        "Screen Studio の代替を探していますか？ScreenCam は、より小さなアプリサイズ、低いリソース使用量、速い書き出し、手動ズームアンカー、レイヤー、デバイスモックアップ、GIF と Live Photo 書き出しに対応したネイティブ macOS 画面録画ツールです。",
    },
    imageAlt: "ネイティブ macOS コントロールを備えた ScreenCam の画面録画インターフェイス",
    lastUpdated: "2026 年 6 月 13 日",
    hero: {
      eyebrow: "Mac 向け Screen Studio 代替",
      title: "より軽い Screen Studio 代替。",
      description:
        "ScreenCam は洗練された Mac 画面録画ワークフローを保ちながら、より深い手動ズーム、豊富なレイヤー、小さなアプリサイズ、より多様な書き出し形態を追加します。",
      appStoreCta: "Mac App Store で ScreenCam を見る",
      benchmarkCta: "ベンチマークデータを見る",
      lastUpdatedLabel: "最終更新：",
    },
    performanceHighlights: [
      {
        value: "30x",
        label: "小さいアプリサイズ",
        detail: "約 20MB。比較ベースラインはおよそ 600MB です。",
      },
      {
        value: "低い",
        label: "CPU + メモリ使用量",
        detail: "横並びのベンチマークで、主張を測定可能にしています。",
      },
      {
        value: "高速",
        label: "ネイティブ書き出し経路",
        detail: "ベンチマーク比較では書き出し時間が短くなっています。",
      },
      {
        value: "< 1/3",
        label: "サブスクリプション価格",
        detail: "現在の App Store 価格は地域によって異なります。",
      },
    ],
    whySwitch: {
      eyebrow: "切り替える理由",
      title: "重さを抑えながら、速度とコントロールを。",
      description:
        "Screen Studio は基本的な自動収録ワークフローをカバーします。ScreenCam は、より軽いネイティブアプリ、測定可能な性能差、録画後の高度な自動・手動制御を追加します。",
    },
    features: {
      eyebrow: "クリエイティブ制御",
      title: "ScreenCam で指示しやすくなる部分。",
      items: [
        {
          title: "手動ズームアンカー",
          body: "1 つのズームクリップ内で、複数の中心、アンカーごとの拡大率、カスタムカーブを設定できます。",
        },
        {
          title: "無制限のレイヤー",
          body: "モザイク、テキスト、フォーカス効果、カスタム画像を同じ時間範囲で重ねられます。",
        },
        {
          title: "デバイスモックアップ",
          body: "Mac、iPhone、Apple Watch、Studio Display 風のフレームでプロダクトデモを作れます。",
        },
        {
          title: "GIF + Live Photo",
          body: "録画をフル動画だけでなく、軽いビジュアル素材として書き出せます。",
        },
        {
          title: "カメラ補正",
          body: "カメラ付きウォークスルーに、軽い人物補正を加えられます。",
        },
        {
          title: "ネイティブ Mac 体験",
          body: "Liquid Glass 風の画面、キーボード中心の録画、Mac App Store 配布に対応します。",
        },
      ],
    },
    comparison: {
      eyebrow: "比較",
      title: "ScreenCam vs Screen Studio",
      description:
        "Screen Studio は基本的な収録・編集ワークフローをカバーします。ScreenCam は、より小さなネイティブ構成、高度な制御、豊富なクリエイティブ機能、より多くの出力形式を追加します。",
      headers: {
        feature: "機能",
        screenCam: "ScreenCam",
        screenStudio: "Screen Studio",
      },
      rows: [
        {
          feature: "パフォーマンス負荷",
          screenCam: "約 30 倍小さく、CPU とメモリ使用量が低く、書き出しも高速です。",
          screenStudio: "基本的な画面収録、編集、書き出しのワークフロー。",
        },
        {
          feature: "ズーム制御",
          screenCam: "自動ズームと高度にカスタマイズできるアニメーションカーブ。",
          screenStudio: "自動ズームとカーソル駆動の動き。",
        },
        {
          feature: "レイヤー",
          screenCam: "モザイク、テキスト、フォーカス、画像レイヤーを無制限に重ねられます。",
          screenStudio: "基本的なオーバーレイ、背景、マスク機能。",
        },
        {
          feature: "デバイス表示",
          screenCam: "Mac、iPhone、Apple Watch、Studio Display のモックアップを内蔵。",
          screenStudio: "基本的なデバイス収録と表示のワークフロー。",
        },
        {
          feature: "書き出し形式",
          screenCam: "動画、GIF、Live Photo。",
          screenStudio: "動画と GIF の書き出し。",
        },
        {
          feature: "BGM",
          screenCam: "音楽を自由に編集・配置し、フェードインとフェードアウトを設定できます。",
          screenStudio: "基本的な BGM 選択。",
        },
        {
          feature: "カメラ仕上げ",
          screenCam: "カメラレイアウト、背景除去、補正コントロール、ステッカー効果。",
          screenStudio: "カメラレイアウトと Web カメラ表示。",
        },
        {
          feature: "価格",
          screenCam: "無料ダウンロード。対応 App Store 地域ではサブスクリプション価格が 3 分の 1 未満です。",
          screenStudio: "サブスクリプション価格は Screen Studio 公式購入フローで表示されます。",
        },
        {
          feature: "字幕と文字起こし",
          screenCam: "複数の文字起こしプロバイダーと BYOK、高度にカスタマイズできる Read Along 字幕、Liquid Glass 背景に対応。",
          screenStudio: "基本的な文字起こしと字幕のワークフロー。",
        },
      ],
    },
    bestFit: {
      eyebrow: "向いている用途",
      title: "ScreenCam を選ぶなら...",
      items: [
        "複数のズーム中心が必要なプロダクトデモ",
        "デバイスモックアップとカスタムフレーミングを使う Mac アプリ紹介",
        "ぼかし、フォーカス強調、テキスト、画像が必要なクリップ",
        "GIF または Live Photo として書き出したい録画",
      ],
      gapEyebrow: "字幕",
      gapTitle: "字幕を思いどおりのスタイルに。",
      gapDescription:
        "複数の文字起こしプロバイダーと BYOK を選択でき、Read Along 字幕を細かくカスタマイズし、再利用可能なプリセットでぼかしや Liquid Glass 背景を設定できます。",
      pricingCta: "App Store 価格を確認",
      screenStudioCta: "Screen Studio を見る",
    },
    faq: {
      eyebrow: "FAQ",
      title: "Screen Studio から切り替える前の質問",
      items: [
        {
          question: "ScreenCam は Screen Studio の代替になりますか？",
          answer:
            "はい。ScreenCam は、洗練されたプロダクトデモ、チュートリアル、アプリ紹介、SNS クリップ向けのネイティブ macOS 画面録画・編集ツールです。より小さいアプリ、低いリソース使用量、高速な書き出し、深い手動ズーム制御が欲しい場合に特に向いています。",
        },
        {
          question: "ScreenCam は Screen Studio と何が違いますか？",
          answer:
            "ScreenCam は、ネイティブ Mac 性能、手動ズームアンカー、より豊富な時間ベースのレイヤー、デバイスモックアップ、Liquid Glass 風 UI、設定可能なアニメーションカーブ、GIF 書き出し、Live Photo 書き出しに重点を置いています。",
        },
        {
          question: "ScreenCam は Screen Studio より安いですか？",
          answer:
            "ScreenCam は Mac App Store から無料でダウンロードでき、アプリ内課金があります。現在の価格は地域によって異なりますが、対応地域では ScreenCam のサブスクリプションは Screen Studio のサブスクリプション価格の 3 分の 1 未満に設定されています。",
        },
        {
          question: "ScreenCam は字幕に対応していますか？",
          answer:
            "はい。複数の文字起こしプロバイダーと BYOK、高度にカスタマイズできる Read Along 字幕、字幕ごとの表示切り替え、再利用可能なスタイル、ぼかしや Liquid Glass 背景に対応しています。",
        },
        {
          question: "ScreenCam はカスタムズームアニメーションに対応していますか？",
          answer:
            "はい。手動ズームモードでは、カスタムアンカー、複数のズーム中心、アンカーごとの拡大率、設定可能なアニメーションカーブを使えるため、録画後に視線を誘導できます。",
        },
        {
          question: "ScreenCam は GIF や Live Photo を書き出せますか？",
          answer:
            "はい。ScreenCam は動画向けの書き出しに加えて、GIF や Live Photo などの豊富な書き出しワークフローに対応しています。",
        },
      ],
    },
    schema: {
      breadcrumbName: "Screen Studio 代替",
      about: ["Screen Studio 代替", "ズーム付き Mac 画面録画ツール"],
      softwareDescription:
        "ScreenCam は、鮮明な録画、手動ズームアンカー、レイヤー、デバイスモックアップ、モーションブラー、プレビュー通りの書き出しに対応したネイティブ macOS 画面録画ツールです。",
      featureList: ["ネイティブ macOS 画面録画", "手動ズームアンカー", "カスタムアニメーションカーブ", "デバイスモックアップ", "モザイク、テキスト、フォーカス、カスタム画像レイヤー", "GIF 書き出し", "Live Photo 書き出し", "カメラ補正効果", "プレビュー通りの書き出し"],
    },
  },
  ko: {
    meta: {
      title: "Mac용 Screen Studio 대안 | ScreenCam",
      description:
        "Screen Studio 대안을 찾고 있나요? ScreenCam은 더 작은 앱 크기, 낮은 리소스 사용량, 빠른 내보내기, 수동 줌 앵커, 레이어, 기기 목업, GIF 및 Live Photo 내보내기를 제공하는 네이티브 macOS 화면 녹화 도구입니다.",
    },
    imageAlt: "네이티브 macOS 컨트롤이 있는 ScreenCam 화면 녹화 인터페이스",
    lastUpdated: "2026년 6월 13일",
    hero: {
      eyebrow: "Mac용 Screen Studio 대안",
      title: "더 가벼운 Screen Studio 대안.",
      description:
        "ScreenCam은 세련된 Mac 화면 녹화 워크플로를 유지하면서 더 깊은 수동 줌, 풍부한 레이어, 작은 설치 크기, 더 다양한 내보내기 방식을 더합니다.",
      appStoreCta: "Mac App Store에서 ScreenCam 보기",
      benchmarkCta: "벤치마크 데이터 보기",
      lastUpdatedLabel: "마지막 업데이트:",
    },
    performanceHighlights: [
      {
        value: "30x",
        label: "더 작은 앱 크기",
        detail: "약 20MB로, 약 600MB 벤치마크 기준과 비교됩니다.",
      },
      {
        value: "낮음",
        label: "CPU + 메모리 사용량",
        detail: "나란히 비교한 벤치마크 데이터로 주장을 측정 가능하게 유지합니다.",
      },
      {
        value: "빠름",
        label: "네이티브 내보내기 경로",
        detail: "벤치마크 비교에서 더 짧은 내보내기 시간을 보입니다.",
      },
      {
        value: "< 1/3",
        label: "구독 가격",
        detail: "현재 App Store 가격은 지역에 따라 달라집니다.",
      },
    ],
    whySwitch: {
      eyebrow: "전환 이유",
      title: "무거운 부담 없이 속도와 제어를.",
      description:
        "Screen Studio는 기본 자동 녹화 워크플로를 제공합니다. ScreenCam은 더 가벼운 네이티브 앱, 측정 가능한 성능 이점, 녹화 후 더 깊은 자동 및 수동 제어를 더합니다.",
    },
    features: {
      eyebrow: "창작 제어",
      title: "ScreenCam이 더 쉽게 연출하게 해주는 부분.",
      items: [
        {
          title: "수동 줌 앵커",
          body: "하나의 줌 클립 안에서 여러 중심, 앵커별 배율, 사용자 지정 곡선을 설정할 수 있습니다.",
        },
        {
          title: "무제한 레이어",
          body: "모자이크, 텍스트, 포커스 효과, 사용자 이미지가 같은 시간 범위에서 겹칠 수 있습니다.",
        },
        {
          title: "기기 목업",
          body: "Mac, iPhone, Apple Watch, Studio Display 스타일 프레임으로 제품 데모를 구성합니다.",
        },
        {
          title: "GIF + Live Photo",
          body: "녹화를 전체 영상뿐 아니라 빠른 시각 자료로도 내보낼 수 있습니다.",
        },
        {
          title: "카메라 보정",
          body: "카메라 중심의 설명 영상에 가벼운 인물 보정을 더합니다.",
        },
        {
          title: "네이티브 Mac 감각",
          body: "Liquid Glass 스타일 화면, 키보드 중심 녹화, Mac App Store 배포를 제공합니다.",
        },
      ],
    },
    comparison: {
      eyebrow: "비교",
      title: "ScreenCam vs Screen Studio",
      description:
        "Screen Studio는 기본 녹화 및 편집 워크플로를 제공합니다. ScreenCam은 더 작은 네이티브 구성, 깊은 제어, 풍부한 창작 도구, 더 많은 출력 형식을 추가합니다.",
      headers: {
        feature: "기능",
        screenCam: "ScreenCam",
        screenStudio: "Screen Studio",
      },
      rows: [
        {
          feature: "성능 부담",
          screenCam: "약 30배 더 작고, CPU 및 메모리 사용량이 낮으며, 내보내기가 더 빠릅니다.",
          screenStudio: "기본 화면 녹화, 편집 및 내보내기 워크플로.",
        },
        {
          feature: "줌 제어",
          screenCam: "자동 줌과 고도로 사용자 지정 가능한 애니메이션 곡선.",
          screenStudio: "자동 줌과 커서 기반 움직임.",
        },
        {
          feature: "레이어",
          screenCam: "모자이크, 텍스트, 포커스, 이미지 레이어를 제한 없이 겹칠 수 있습니다.",
          screenStudio: "기본 오버레이, 배경 및 마스킹 기능.",
        },
        {
          feature: "기기 표현",
          screenCam: "Mac, iPhone, Apple Watch, Studio Display 목업이 내장되어 있습니다.",
          screenStudio: "기본 기기 녹화 및 프레젠테이션 워크플로.",
        },
        {
          feature: "내보내기 형식",
          screenCam: "동영상, GIF, Live Photo.",
          screenStudio: "동영상 및 GIF 내보내기.",
        },
        {
          feature: "배경 음악",
          screenCam: "음악을 자유롭게 편집하고 배치하며 페이드 인과 페이드 아웃을 설정할 수 있습니다.",
          screenStudio: "기본 배경 음악 선택.",
        },
        {
          feature: "카메라 연출",
          screenCam: "카메라 레이아웃, 배경 제거, 보정 제어 및 스티커 효과.",
          screenStudio: "카메라 레이아웃과 웹캠 프레젠테이션.",
        },
        {
          feature: "가격",
          screenCam: "무료 다운로드. 지원되는 App Store 지역에서는 구독 가격이 3분의 1 미만입니다.",
          screenStudio: "구독 가격은 Screen Studio 공식 구매 흐름에서 표시됩니다.",
        },
        {
          feature: "자막과 전사",
          screenCam: "더 다양한 전사 제공자와 BYOK, 고도로 사용자 지정 가능한 Read Along 자막, Liquid Glass 배경을 지원합니다.",
          screenStudio: "기본 전사 및 자막 워크플로.",
        },
      ],
    },
    bestFit: {
      eyebrow: "잘 맞는 경우",
      title: "이런 경우 ScreenCam을 선택하세요...",
      items: [
        "여러 개의 지정된 줌 중심이 필요한 제품 데모",
        "기기 목업과 사용자 지정 프레이밍이 필요한 Mac 앱 워크스루",
        "모자이크, 포커스 강조, 텍스트, 이미지가 필요한 클립",
        "GIF 또는 Live Photo 출력이 필요한 내보내기",
      ],
      gapEyebrow: "자막",
      gapTitle: "원하는 방식으로 자막을 스타일링하세요.",
      gapDescription:
        "여러 전사 제공자와 BYOK를 선택하고, Read Along 자막을 세밀하게 사용자 지정하며, 재사용 가능한 프리셋으로 블러 또는 Liquid Glass 배경을 적용할 수 있습니다.",
      pricingCta: "App Store 가격 확인",
      screenStudioCta: "Screen Studio 보기",
    },
    faq: {
      eyebrow: "FAQ",
      title: "Screen Studio에서 전환하기 전 질문",
      items: [
        {
          question: "ScreenCam은 Screen Studio 대안인가요?",
          answer:
            "예. ScreenCam은 세련된 제품 데모, 튜토리얼, 앱 워크스루, 소셜 클립을 위한 네이티브 macOS 화면 녹화 및 편집 도구입니다. 더 작은 앱, 낮은 리소스 사용량, 빠른 내보내기, 더 깊은 수동 줌 제어를 원한다면 특히 강합니다.",
        },
        {
          question: "ScreenCam은 Screen Studio와 무엇이 다른가요?",
          answer:
            "ScreenCam은 네이티브 Mac 성능, 수동 줌 앵커, 더 풍부한 시간 기반 레이어, 기기 목업, Liquid Glass 스타일 UI, 설정 가능한 애니메이션 곡선, GIF 내보내기, Live Photo 내보내기에 집중합니다.",
        },
        {
          question: "ScreenCam은 Screen Studio보다 저렴한가요?",
          answer:
            "ScreenCam은 Mac App Store에서 무료로 다운로드할 수 있으며 앱 내 구입을 제공합니다. 현재 가격은 지역별로 다르지만, 지원 지역에서 ScreenCam 구독은 Screen Studio 구독 가격의 3분의 1 미만으로 설정되어 있습니다.",
        },
        {
          question: "ScreenCam은 자막을 지원하나요?",
          answer:
            "예. ScreenCam은 여러 전사 제공자와 BYOK, 고도로 사용자 지정 가능한 Read Along 자막, 자막별 표시 여부, 재사용 가능한 스타일, 블러 또는 Liquid Glass 배경을 지원합니다.",
        },
        {
          question: "ScreenCam은 사용자 지정 줌 애니메이션을 지원하나요?",
          answer:
            "예. 수동 줌 모드는 사용자 지정 앵커, 여러 줌 중심, 앵커별 배율, 설정 가능한 애니메이션 곡선을 지원하므로 녹화 후에도 시청자의 시선을 유도할 수 있습니다.",
        },
        {
          question: "ScreenCam은 GIF나 Live Photo를 내보낼 수 있나요?",
          answer:
            "예. ScreenCam은 동영상 중심 내보내기뿐 아니라 GIF와 Live Photo를 포함한 더 풍부한 내보내기 워크플로를 지원합니다.",
        },
      ],
    },
    schema: {
      breadcrumbName: "Screen Studio 대안",
      about: ["Screen Studio 대안", "줌 기능이 있는 Mac 화면 녹화 도구"],
      softwareDescription:
        "ScreenCam은 선명한 캡처, 수동 줌 앵커, 레이어, 기기 목업, 모션 블러, 미리보기와 일치하는 내보내기를 위한 네이티브 macOS 화면 녹화 도구입니다.",
      featureList: ["네이티브 macOS 화면 녹화", "수동 줌 앵커", "사용자 지정 애니메이션 곡선", "기기 목업", "모자이크, 텍스트, 포커스, 사용자 이미지 레이어", "GIF 내보내기", "Live Photo 내보내기", "카메라 보정 효과", "미리보기와 일치하는 내보내기"],
    },
  },
  "zh-Hant": {
    meta: {
      title: "Mac 版 Screen Studio 替代方案 | ScreenCam",
      description:
        "在找 Screen Studio 替代方案？ScreenCam 是原生 macOS 錄屏工具，應用體積更小、資源佔用更低、匯出更快，並支援手動變焦錨點、圖層、裝置樣機、GIF 和 Live Photo 匯出。",
    },
    imageAlt: "帶有原生 macOS 控制區的 ScreenCam 錄屏介面",
    lastUpdated: "2026 年 6 月 13 日",
    hero: {
      eyebrow: "Mac 版 Screen Studio 替代方案",
      title: "更輕量的 Screen Studio 替代方案。",
      description:
        "ScreenCam 保留精緻的 Mac 錄屏工作流，同時加入更深入的手動變焦、更豐富的圖層、更小的體積和更多匯出形態。",
      appStoreCta: "在 Mac App Store 檢視 ScreenCam",
      benchmarkCta: "檢視基準測試資料",
      lastUpdatedLabel: "最後更新：",
    },
    performanceHighlights: [
      {
        value: "30x",
        label: "更小應用體積",
        detail: "約 20MB，對比基準約 600MB。",
      },
      {
        value: "更低",
        label: "CPU + 記憶體佔用",
        detail: "並排基準測試讓效能結論保持可衡量。",
      },
      {
        value: "更快",
        label: "原生匯出鏈路",
        detail: "基準對比中匯出耗時更短。",
      },
      {
        value: "< 1/3",
        label: "訂閱價格",
        detail: "當前 App Store 價格會因地區而不同。",
      },
    ],
    whySwitch: {
      eyebrow: "為什麼切換",
      title: "更快、更可控，同時沒有沉重負擔。",
      description:
        "Screen Studio 覆蓋基礎自動化錄製流程。ScreenCam 在此之上提供更輕的原生應用、可量化的效能優勢，以及錄製後更深入的自動與手動控制。",
    },
    features: {
      eyebrow: "創作控制",
      title: "ScreenCam 讓這些部分更容易被你掌控。",
      items: [
        {
          title: "手動變焦錨點",
          body: "一個變焦片段裡可以設定多箇中心、每個錨點的縮放比例和自定義曲線。",
        },
        {
          title: "不限數量的圖層",
          body: "馬賽克、文字、聚焦效果和自定義圖片可以在同一時間段內重疊。",
        },
        {
          title: "裝置樣機",
          body: "用 Mac、iPhone、Apple Watch 和 Studio Display 風格外框製作產品演示。",
        },
        {
          title: "GIF + Live Photo",
          body: "不僅能匯出完整影片，也能交付更輕的視覺素材。",
        },
        {
          title: "攝像頭美顏",
          body: "給真人講解類錄製提供輕量的人像修飾。",
        },
        {
          title: "原生 Mac 體驗",
          body: "Liquid Glass 風格介面、鍵盤優先錄製，以及 Mac App Store 分發。",
        },
      ],
    },
    comparison: {
      eyebrow: "對比",
      title: "ScreenCam vs Screen Studio",
      description:
        "Screen Studio 覆蓋基礎錄製和編輯流程。ScreenCam 在此之上提供更小的原生體積、更深入的控制、更豐富的創作工具和更多輸出格式。",
      headers: {
        feature: "功能",
        screenCam: "ScreenCam",
        screenStudio: "Screen Studio",
      },
      rows: [
        {
          feature: "效能負擔",
          screenCam: "體積約小 30 倍，CPU 和記憶體佔用更低，匯出更快。",
          screenStudio: "提供基礎錄屏、編輯和匯出流程。",
        },
        {
          feature: "變焦控制",
          screenCam: "自動變焦，並支援高度可自訂的動畫曲線。",
          screenStudio: "提供自動變焦和游標驅動運動。",
        },
        {
          feature: "圖層",
          screenCam: "馬賽克、文字、聚焦、圖片圖層，可不限量重疊。",
          screenStudio: "提供基礎浮層、背景和遮罩功能。",
        },
        {
          feature: "裝置呈現",
          screenCam: "內建 Mac、iPhone、Apple Watch 和 Studio Display 樣機。",
          screenStudio: "提供基礎裝置錄製和呈現流程。",
        },
        {
          feature: "匯出格式",
          screenCam: "影片、GIF 和 Live Photo。",
          screenStudio: "支援影片和 GIF 匯出。",
        },
        {
          feature: "背景音樂",
          screenCam: "支援自由剪輯和編排音樂，並可設定淡入淡出。",
          screenStudio: "提供基礎背景音樂選擇。",
        },
        {
          feature: "攝像頭修飾",
          screenCam: "支援攝像頭佈局、背景移除、美顏控制和貼紙效果。",
          screenStudio: "提供攝像頭佈局和演示者呈現。",
        },
        {
          feature: "價格",
          screenCam: "免費下載；在支援地區訂閱價格低於三分之一。",
          screenStudio: "訂閱價格以 Screen Studio 官方購買流程為準。",
        },
        {
          feature: "字幕和轉寫",
          screenCam: "更多轉寫 Provider 選擇並支援 BYOK，高度可自訂的 Read Along 字幕及 Liquid Glass 背景。",
          screenStudio: "提供基礎轉寫和字幕工作流。",
        },
      ],
    },
    bestFit: {
      eyebrow: "適合場景",
      title: "如果你需要這些，選 ScreenCam...",
      items: [
        "需要多個定向變焦中心的產品演示",
        "帶裝置樣機和自定義畫幅的 Mac app 演示",
        "需要打碼、聚焦高亮、文字和圖片的短片",
        "需要 GIF 或 Live Photo 輸出的匯出流程",
      ],
      gapEyebrow: "字幕功能",
      gapTitle: "字幕樣式，由你定義。",
      gapDescription:
        "可從多個轉寫 Provider 中選擇並使用 BYOK，精細自訂 Read Along 字幕，還能透過可重用預設設定模糊和 Liquid Glass 背景。",
      pricingCta: "檢視 App Store 價格",
      screenStudioCta: "檢視 Screen Studio",
    },
    faq: {
      eyebrow: "FAQ",
      title: "從 Screen Studio 切換前的常見問題",
      items: [
        {
          question: "ScreenCam 是 Screen Studio 替代方案嗎？",
          answer:
            "是。ScreenCam 是原生 macOS 錄屏和編輯工具，適合製作精緻產品演示、教程、app walkthrough 和社媒短片。如果你想要更小體積、更低資源佔用、更快匯出和更深入的手動變焦控制，它會特別合適。",
        },
        {
          question: "ScreenCam 和 Screen Studio 有什麼不同？",
          answer:
            "ScreenCam 更關注原生 Mac 效能、手動變焦錨點、更豐富的時間線圖層、裝置樣機、Liquid Glass 風格介面、可配置動畫曲線、GIF 匯出和 Live Photo 匯出。",
        },
        {
          question: "ScreenCam 比 Screen Studio 便宜嗎？",
          answer:
            "ScreenCam 可在 Mac App Store 免費下載，並提供應用內購買。當前價格因地區而異，但在支援地區 ScreenCam 的訂閱價格定位低於 Screen Studio 訂閱價的三分之一。",
        },
        {
          question: "ScreenCam 支援字幕嗎？",
          answer:
            "支援。ScreenCam 提供多個轉寫 Provider 和 BYOK、高度可自訂的 Read Along 字幕、單條字幕顯示隱藏、可重用樣式，以及模糊或 Liquid Glass 背景。",
        },
        {
          question: "ScreenCam 支援自定義變焦動畫嗎？",
          answer:
            "支援。手動變焦模式支援自定義錨點、多個變焦中心、每個錨點的縮放比例和可配置動畫曲線，讓你在錄製後繼續引導觀眾注意力。",
        },
        {
          question: "ScreenCam 可以匯出 GIF 或 Live Photo 嗎？",
          answer:
            "可以。ScreenCam 除了面向影片的匯出，也支援 GIF 和 Live Photo 等更豐富的匯出流程。",
        },
      ],
    },
    schema: {
      breadcrumbName: "Screen Studio 替代方案",
      about: ["Screen Studio 替代方案", "帶變焦的 Mac 錄屏工具"],
      softwareDescription:
        "ScreenCam 是原生 macOS 錄屏工具，支援清晰錄製、手動變焦錨點、圖層、裝置樣機、運動模糊和精確預覽匯出。",
      featureList: ["原生 macOS 螢幕錄製", "手動變焦錨點", "自定義動畫曲線", "裝置樣機", "馬賽克、文字、聚焦和自定義圖片圖層", "GIF 匯出", "Live Photo 匯出", "攝像頭美顏", "精確預覽匯出"],
    },
  },
  es: {
    meta: {
      title: "Screen Studio Alternativa para Mac | ScreenCam",
      description:
        "¿Busca una alternativa al Screen Studio? ScreenCam es un grabador de pantalla nativo macOS con un tamaño de aplicación más pequeño, menor uso de recursos, exportaciones más rápidas, anclajes de zoom manuales, capas, maquetas de dispositivos, exportación GIF y Live Photo.",
    },
    imageAlt: "Interfaz de grabación de pantalla ScreenCam con controles nativos macOS",
    lastUpdated: "13 de junio de 2026",
    hero: {
      eyebrow: "Screen Studio Alternativa para Mac",
      title: "Una alternativa más ligera al Screen Studio.",
      description:
        "ScreenCam mantiene el pulido flujo de trabajo de grabación de pantalla Mac, luego agrega un zoom manual más profundo, capas más ricas, espacio más pequeño y más formas de exportación.",
      appStoreCta: "Ver ScreenCam en el Mac App Store",
      benchmarkCta: "Ver datos de referencia",
      lastUpdatedLabel: "Última actualización:",
    },
    performanceHighlights: [
      {
        value: "30x",
        label: "huella de aplicación más pequeña",
        detail: "Aproximadamente 20 MB frente a la base de referencia de aproximadamente 600 MB.",
      },
      {
        value: "inferior",
        label: "Uso de CPU + memoria",
        detail: "Los datos comparativos en paralelo mantienen el reclamo mensurable.",
      },
      {
        value: "Más rápido",
        label: "ruta de exportación nativa",
        detail: "Calendario de exportación más corto en la comparación de referencia.",
      },
      {
        value: "< 1/3",
        label: "precio de suscripción",
        detail: "El precio actual del App Store varía según la región.",
      },
    ],
    whySwitch: {
      eyebrow: "¿Por qué cambiar?",
      title: "Velocidad y control, sin pisar demasiado.",
      description:
        "Screen Studio cubre el flujo automatizado básico de grabación. ScreenCam va más allá con una app nativa más ligera, ventajas de rendimiento medibles y un control automático y manual más profundo tras grabar.",
    },
    features: {
      eyebrow: "control creativo",
      title: "Las piezas ScreenCam facilitan el manejo.",
      items: [
        {
          title: "Anclajes de zoom manual",
          body: "Múltiples centros, escala por anclaje y curvas personalizadas en un clip de zoom.",
        },
        {
          title: "Capas ilimitadas",
          body: "Los mosaicos, el texto, los efectos de enfoque y las imágenes personalizadas pueden superponerse en el mismo rango de tiempo.",
        },
        {
          title: "Maquetas de dispositivos",
          body: "Marcos estilo Mac, iPhone, Apple Watch y Studio Display para demostraciones de productos.",
        },
        {
          title: "GIF + Live Photo",
          body: "Envíe grabaciones como recursos visuales rápidos, no solo archivos de vídeo completos.",
        },
        {
          title: "Belleza de la cámara",
          body: "Pulido ligero del presentador para recorridos guiados por cámaras.",
        },
        {
          title: "Sensación nativa de Mac",
          body: "Superficies estilo Liquid Glass, captura con teclado y distribución Mac App Store.",
        },
      ],
    },
    comparison: {
      eyebrow: "Comparación",
      title: "ScreenCam y Screen Studio",
      description:
        "Screen Studio cubre el flujo básico de grabación y edición. ScreenCam lo amplía con una app nativa más pequeña, controles más profundos, más herramientas creativas y más formatos de salida.",
      headers: {
        feature: "Característica",
        screenCam: "ScreenCam",
        screenStudio: "Screen Studio",
      },
      rows: [
        {
          feature: "Huella de rendimiento",
          screenCam: "Aproximadamente 30 veces más pequeño, menor uso de CPU y memoria, exportaciones más rápidas.",
          screenStudio: "Flujo básico de grabación, edición y exportación de pantalla.",
        },
        {
          feature: "control de zoom",
          screenCam: "Zoom automático con curvas de animación altamente personalizables.",
          screenStudio: "Zoom automático y movimiento impulsado por el cursor.",
        },
        {
          feature: "capas",
          screenCam: "Mosaico, texto, enfoque, capas de imágenes, superposición ilimitada.",
          screenStudio: "Superposiciones, fondos y enmascaramiento básicos.",
        },
        {
          feature: "Presentación del dispositivo",
          screenCam: "Maquetas integradas de Mac, iPhone, Apple Watch y Studio Display.",
          screenStudio: "Flujo básico de captura y presentación de dispositivos.",
        },
        {
          feature: "Formatos de exportación",
          screenCam: "Vídeo, GIF y Live Photo.",
          screenStudio: "Exportación de video y GIF.",
        },
        {
          feature: "Música de fondo",
          screenCam: "Recorta y organiza la música libremente con controles de entrada y salida gradual.",
          screenStudio: "Selección básica de música de fondo.",
        },
        {
          feature: "Pulido de cámara",
          screenCam: "Diseños de cámara, eliminación de fondo, controles de belleza y efectos de pegatinas.",
          screenStudio: "Diseños de cámara y presentación de cámara web.",
        },
        {
          feature: "Precios",
          screenCam: "Descarga gratuita; la suscripción es inferior a un tercio en las regiones App Store admitidas.",
          screenStudio: "El precio de la suscripción se muestra en el flujo de compras oficial de Screen Studio.",
        },
        {
          feature: "Subtítulos y transcripciones",
          screenCam: "Más proveedores de transcripción con BYOK, subtítulos Read Along muy personalizables y fondos Liquid Glass.",
          screenStudio: "Flujo básico de transcripción y subtítulos.",
        },
      ],
    },
    bestFit: {
      eyebrow: "Mejor ajuste",
      title: "Elija ScreenCam si...",
      items: [
        "ProDemostraciones de conductos que necesitan múltiples centros de zoom dirigidos",
        "Tutoriales de la aplicación Mac con maquetas de dispositivos y marcos personalizados",
        "Clips que necesitan redacción, resaltados de enfoque, texto e imágenes",
        "Exportaciones que necesitan salida GIF o Live Photo",
      ],
      gapEyebrow: "Subtítulos",
      gapTitle: "Subtítulos con tu propio estilo.",
      gapDescription:
        "Elige entre varios proveedores de transcripción con BYOK, personaliza al detalle los subtítulos Read Along y aplica ajustes reutilizables con fondos desenfocados o Liquid Glass.",
      pricingCta: "Consultar precios de App Store",
      screenStudioCta: "Ver Screen Studio",
    },
    faq: {
      eyebrow: "Preguntas frecuentes",
      title: "Preguntas sobre el cambio de Screen Studio",
      items: [
        {
          question: "¿Es ScreenCam una alternativa al Screen Studio?",
          answer:
            "Sí. ScreenCam es un grabador y editor de pantalla nativo macOS para demostraciones de productos, tutoriales, recorridos de aplicaciones y clips sociales. Es especialmente sólido si desea una aplicación más pequeña, un menor uso de recursos, exportaciones más rápidas y un control de zoom manual más profundo.",
        },
        {
          question: "¿Qué diferencia al ScreenCam del Screen Studio?",
          answer:
            "ScreenCam se centra en el rendimiento nativo de Mac, anclajes de zoom manuales, capas más ricas basadas en el tiempo, maquetas de dispositivos, interfaz de usuario estilo Liquid Glass, curvas de animación configurables, exportación GIF y exportación Live Photo.",
        },
        {
          question: "¿ScreenCam es más barato que Screen Studio?",
          answer:
            "ScreenCam es una descarga gratuita con compras dentro de la aplicación en el Mac App Store. El precio actual varía según la región, pero la suscripción de ScreenCam se ubica por debajo de un tercio del precio de suscripción de Screen Studio en las regiones admitidas.",
        },
        {
          question: "¿ScreenCam admite subtítulos?",
          answer:
            "Sí. ScreenCam ofrece varios proveedores de transcripción con BYOK, subtítulos Read Along muy personalizables, visibilidad por subtítulo, estilos reutilizables y fondos desenfocados o Liquid Glass.",
        },
        {
          question: "¿ScreenCam admite animaciones de zoom personalizadas?",
          answer:
            "Sí. El modo de zoom manual admite anclajes personalizados, múltiples centros de zoom, escala por anclaje y curvas de animación configurables, para que pueda dirigir la atención del espectador después de la grabación.",
        },
        {
          question: "¿Puede ScreenCam exportar archivos GIF o Live Photo?",
          answer:
            "Sí. ScreenCam admite flujos de trabajo de exportación más completos, incluidos GIF y Live Photo, junto con exportaciones centradas en video.",
        },
      ],
    },
    schema: {
      breadcrumbName: "Alternativa Screen Studio",
      about: ["Alternativa Screen Studio", "Grabador de pantalla Mac con zoom"],
      softwareDescription:
        "ScreenCam es un grabador de pantalla nativo macOS para capturas nítidas, anclajes de zoom manuales, capas, maquetas de dispositivos, desenfoque de movimiento y exportación con vista previa precisa.",
      featureList: [
        "Grabación de pantalla nativa macOS",
        "Anclajes de zoom manual",
        "Curvas de animación personalizadas",
        "Maquetas de dispositivos",
        "Capas de mosaico, texto, enfoque e imágenes personalizadas",
        "Exportación GIF",
        "Exportación Live Photo",
        "Efectos de belleza de la cámara.",
        "Exportación con vista previa precisa",
      ],
    },
  },
  fr: {
    meta: {
      title: "Screen Studio Alternative à Mac | ScreenCam",
      description:
        "Vous recherchez une alternative au Screen Studio ? ScreenCam est un enregistreur d'écran natif macOS avec une taille d'application plus petite, une utilisation réduite des ressources, des exportations plus rapides, des ancres de zoom manuel, des calques, des maquettes d'appareil, GIF et une exportation Live Photo.",
    },
    imageAlt: "Interface d'enregistrement d'écran ScreenCam avec commandes natives macOS",
    lastUpdated: "13 juin 2026",
    hero: {
      eyebrow: "Screen Studio Alternative à Mac",
      title: "Une alternative plus légère au Screen Studio.",
      description:
        "ScreenCam conserve le flux de travail d'enregistrement d'écran raffiné du Mac, puis ajoute un zoom manuel plus profond, des calques plus riches, un encombrement réduit et davantage de formes d'exportation.",
      appStoreCta: "Voir ScreenCam sur le Mac App Store",
      benchmarkCta: "Afficher les données de référence",
      lastUpdatedLabel: "Dernière mise à jour :",
    },
    performanceHighlights: [
      {
        value: "30x",
        label: "empreinte d'application réduite",
        detail: "Environ 20 Mo par rapport à la référence de référence d’environ 600 Mo.",
      },
      {
        value: "Inférieur",
        label: "Utilisation CPU + mémoire",
        detail: "Les données de référence côte à côte permettent de maintenir la réclamation mesurable.",
      },
      {
        value: "Plus rapide",
        label: "chemin d'exportation natif",
        detail: "Délais d’exportation plus courts dans la comparaison de référence.",
      },
      {
        value: "< 1/3",
        label: "prix d'abonnement",
        detail: "Le prix actuel du App Store varie selon la région.",
      },
    ],
    whySwitch: {
      eyebrow: "Pourquoi changer",
      title: "Vitesse et contrôle, sans encombrement important.",
      description:
        "Screen Studio couvre le flux automatisé de base pour l’enregistrement. ScreenCam va plus loin avec une app native plus légère, des gains de performance mesurables et un contrôle automatique et manuel plus poussé après l’enregistrement.",
    },
    features: {
      eyebrow: "Contrôle créatif",
      title: "Les pièces ScreenCam facilitent la direction.",
      items: [
        {
          title: "Ancres de zoom manuel",
          body: "Plusieurs centres, échelle par ancre et courbes personnalisées dans un seul clip de zoom.",
        },
        {
          title: "Couches illimitées",
          body: "La mosaïque, le texte, les effets de mise au point et les images personnalisées peuvent se chevaucher dans la même plage horaire.",
        },
        {
          title: "Maquettes d'appareils",
          body: "Cadrage de style Mac, iPhone, Apple Watch et Studio Display pour les démonstrations de produits.",
        },
        {
          title: "GIF + Live Photo",
          body: "Expédiez les enregistrements sous forme de ressources visuelles rapides, et pas seulement de fichiers vidéo complets.",
        },
        {
          title: "Beauté de l'appareil photo",
          body: "Vernissage du présentateur léger pour les visites guidées par caméra.",
        },
        {
          title: "Sensation native Mac",
          body: "Surfaces de style verre liquide, capture par le clavier en premier et distribution Mac App Store.",
        },
      ],
    },
    comparison: {
      eyebrow: "Comparaison",
      title: "ScreenCam contre Screen Studio",
      description:
        "Screen Studio couvre le flux de base pour l’enregistrement et le montage. ScreenCam l’enrichit avec une app native plus compacte, des contrôles plus poussés, davantage d’outils créatifs et plus de formats de sortie.",
      headers: {
        feature: "Caractéristique",
        screenCam: "ScreenCam",
        screenStudio: "Screen Studio",
      },
      rows: [
        {
          feature: "Empreinte de performance",
          screenCam: "Environ 30 fois plus petit, utilisation réduite du processeur et de la mémoire, exportations plus rapides.",
          screenStudio: "Flux de base pour l’enregistrement, le montage et l’exportation d’écran.",
        },
        {
          feature: "Contrôle du zoom",
          screenCam: "Zoom automatique avec des courbes d’animation hautement personnalisables.",
          screenStudio: "Zoom automatique et mouvement piloté par le curseur.",
        },
        {
          feature: "Calques",
          screenCam: "Mosaïque, texte, focus, calques d'image, chevauchement illimité.",
          screenStudio: "Superpositions, arrière-plans et masquage de base.",
        },
        {
          feature: "Présentation de l'appareil",
          screenCam: "Maquettes Mac, iPhone, Apple Watch et Studio Display intégrées.",
          screenStudio: "Flux de base pour la capture et la présentation d’appareils.",
        },
        {
          feature: "Formats d'exportation",
          screenCam: "Vidéo, GIF et Live Photo.",
          screenStudio: "Exportation vidéo et GIF.",
        },
        {
          feature: "Musique de fond",
          screenCam: "Découpez et organisez librement la musique avec des fondus d’entrée et de sortie.",
          screenStudio: "Sélection basique de musique de fond.",
        },
        {
          feature: "Polissage de l'appareil photo",
          screenCam: "Dispositions de caméra, suppression de l’arrière-plan, retouches beauté et effets d’autocollants.",
          screenStudio: "Dispositions de caméra et présentation par webcam.",
        },
        {
          feature: "Tarifs",
          screenCam: "Téléchargement gratuit ; l'abonnement est inférieur à un tiers dans les régions App Store prises en charge.",
          screenStudio: "Le prix de l'abonnement est indiqué sur le flux d'achat officiel de Screen Studio.",
        },
        {
          feature: "Légendes et transcriptions",
          screenCam: "Davantage de fournisseurs de transcription avec BYOK, des sous-titres Read Along hautement personnalisables et des arrière-plans Liquid Glass.",
          screenStudio: "Flux de base pour la transcription et les sous-titres.",
        },
      ],
    },
    bestFit: {
      eyebrow: "Meilleur ajustement",
      title: "Choisissez ScreenCam si...",
      items: [
        "Démonstrations Product nécessitant plusieurs centres de zoom dirigés",
        "Procédures pas à pas de l'application Mac avec maquettes d'appareils et cadrage personnalisé",
        "Clips nécessitant une rédaction, des surbrillances, du texte et des images",
        "Exportations nécessitant une sortie GIF ou Live Photo",
      ],
      gapEyebrow: "Sous-titres",
      gapTitle: "Des sous-titres à votre image.",
      gapDescription:
        "Choisissez parmi plusieurs fournisseurs de transcription avec BYOK, personnalisez précisément les sous-titres Read Along et appliquez des préréglages réutilisables avec des arrière-plans flous ou Liquid Glass.",
      pricingCta: "Vérifiez les prix du App Store",
      screenStudioCta: "Voir Screen Studio",
    },
    faq: {
      eyebrow: "FAQ",
      title: "Questions sur le passage de Screen Studio",
      items: [
        {
          question: "ScreenCam est-il une alternative à Screen Studio ?",
          answer:
            "Oui. ScreenCam est un enregistreur et éditeur d'écran natif macOS pour des démonstrations de produits raffinées, des didacticiels, des procédures pas à pas d'applications et des clips sociaux. Il est particulièrement efficace si vous souhaitez une application plus petite, une utilisation moindre des ressources, des exportations plus rapides et un contrôle manuel plus approfondi du zoom.",
        },
        {
          question: "Qu'est-ce qui différencie le ScreenCam du Screen Studio ?",
          answer:
            "ScreenCam se concentre sur les performances natives du Mac, les ancres de zoom manuel, les couches temporelles plus riches, les maquettes d'appareils, l'interface utilisateur de style Liquid Glass, les courbes d'animation configurables, l'exportation GIF et l'exportation Live Photo.",
        },
        {
          question: "Le ScreenCam est-il moins cher que le Screen Studio ?",
          answer:
            "ScreenCam est un téléchargement gratuit avec achats intégrés sur le Mac App Store. Le prix actuel varie selon les régions, mais l'abonnement de ScreenCam est positionné en dessous d'un tiers du prix de l'abonnement de Screen Studio dans les régions prises en charge.",
        },
        {
          question: "ScreenCam prend-il en charge les sous-titres ?",
          answer:
            "Oui. ScreenCam propose plusieurs fournisseurs de transcription avec BYOK, des sous-titres Read Along hautement personnalisables, la visibilité par sous-titre, des styles réutilisables et des arrière-plans flous ou Liquid Glass.",
        },
        {
          question: "ScreenCam prend-il en charge les animations de zoom personnalisées ?",
          answer:
            "Oui. Le mode de zoom manuel prend en charge les ancres personnalisées, plusieurs centres de zoom, l'échelle par ancre et les courbes d'animation configurables, afin que vous puissiez diriger l'attention du spectateur après l'enregistrement.",
        },
        {
          question: "ScreenCam peut-il exporter des fichiers GIF ou Live Photo ?",
          answer:
            "Oui. ScreenCam prend en charge des flux de travail d'exportation plus riches, notamment GIF et Live Photo, ainsi que des exportations axées sur la vidéo.",
        },
      ],
    },
    schema: {
      breadcrumbName: "Screen Studio Alternative",
      about: ["Screen Studio alternative", "Enregistreur d'écran Mac avec zoom"],
      softwareDescription:
        "ScreenCam est un enregistreur d'écran natif macOS pour une capture nette, des ancres de zoom manuel, des calques, des maquettes d'appareils, un flou de mouvement et une exportation précise avec un aperçu.",
      featureList: [
        "Enregistrement d'écran natif macOS",
        "Ancres de zoom manuel",
        "Courbes d'animation personnalisées",
        "Maquettes d'appareils",
        "Couches de mosaïque, de texte, de focus et d'images personnalisées",
        "Exportation GIF",
        "Exportation Live Photo",
        "Effets de beauté de l'appareil photo",
        "Exportation avec un aperçu précis",
      ],
    },
  },
  "pt-BR": {
    meta: {
      title: "Screen Studio Alternativa para Mac | ScreenCam",
      description:
        "Procurando uma alternativa Screen Studio? ScreenCam é um gravador de tela macOS nativo com tamanho de aplicativo menor, menor uso de recursos, exportações mais rápidas, âncoras de zoom manuais, camadas, maquetes de dispositivos, GIF e exportação Live Photo.",
    },
    imageAlt: "Interface do gravador de tela ScreenCam com controles nativos macOS",
    lastUpdated: "13 de junho de 2026",
    hero: {
      eyebrow: "Screen Studio Alternativa para Mac",
      title: "Uma alternativa Screen Studio mais leve.",
      description:
        "ScreenCam mantém o fluxo de trabalho de gravação de tela Mac sofisticado e, em seguida, adiciona zoom manual mais profundo, camadas mais ricas, espaço menor e mais formas de exportação.",
      appStoreCta: "Veja ScreenCam no Mac App Store",
      benchmarkCta: "Ver dados de referência",
      lastUpdatedLabel: "Última atualização:",
    },
    performanceHighlights: [
      {
        value: "30x",
        label: "pegada de aplicativo menor",
        detail: "Cerca de 20 MB versus a linha de base do benchmark de aproximadamente 600 MB.",
      },
      {
        value: "Inferior",
        label: "Uso de CPU + memória",
        detail: "Dados de benchmark lado a lado mantêm a afirmação mensurável.",
      },
      {
        value: "Mais rápido",
        label: "caminho de exportação nativo",
        detail: "Menor tempo de exportação na comparação de benchmark.",
      },
      {
        value: "<1/3",
        label: "preço da assinatura",
        detail: "O preço atual do App Store varia de acordo com a região.",
      },
    ],
    whySwitch: {
      eyebrow: "Por que mudar",
      title: "Velocidade e controle, sem ocupar muito espaço.",
      description:
        "Screen Studio cobre o fluxo automatizado básico de gravação. ScreenCam vai além com um app nativo mais leve, ganhos de desempenho mensuráveis e controles automáticos e manuais mais profundos após a gravação.",
    },
    features: {
      eyebrow: "Controle criativo",
      title: "As peças ScreenCam facilitam o direcionamento.",
      items: [
        {
          title: "Âncoras de zoom manuais",
          body: "Vários centros, escala por âncora e curvas personalizadas em um clipe de zoom.",
        },
        {
          title: "Camadas ilimitadas",
          body: "Mosaico, texto, efeitos de foco e imagens personalizadas podem se sobrepor no mesmo intervalo de tempo.",
        },
        {
          title: "Maquetes de dispositivos",
          body: "Enquadramento estilo Mac, iPhone, Apple Watch e Studio Display para demonstrações de produtos.",
        },
        {
          title: "GIF + Live Photo",
          body: "Envie gravações como recursos visuais rápidos, não apenas arquivos de vídeo completos.",
        },
        {
          title: "Beleza da câmera",
          body: "Polimento leve do apresentador para orientações conduzidas por câmera.",
        },
        {
          title: "Sensação nativa Mac",
          body: "Superfícies estilo Liquid Glass, captura com teclado e distribuição Mac App Store.",
        },
      ],
    },
    comparison: {
      eyebrow: "Comparação",
      title: "ScreenCam vs Screen Studio",
      description:
        "Screen Studio cobre o fluxo básico de gravação e edição. ScreenCam o amplia com um app nativo menor, controles mais profundos, mais ferramentas criativas e mais formatos de saída.",
      headers: {
        feature: "Recurso",
        screenCam: "ScreenCam",
        screenStudio: "Screen Studio",
      },
      rows: [
        {
          feature: "Pegada de desempenho",
          screenCam: "Cerca de 30x menor, menor uso de CPU e memória, exportações mais rápidas.",
          screenStudio: "Fluxo básico de gravação, edição e exportação de tela.",
        },
        {
          feature: "Controle de zoom",
          screenCam: "Zoom automático com curvas de animação altamente personalizáveis.",
          screenStudio: "Zoom automático e movimento acionado pelo cursor.",
        },
        {
          feature: "Camadas",
          screenCam: "Mosaico, texto, foco, camadas de imagem, sobreposição ilimitada.",
          screenStudio: "Sobreposições, planos de fundo e mascaramento básicos.",
        },
        {
          feature: "Apresentação do dispositivo",
          screenCam: "Maquetes Mac, iPhone, Apple Watch e Studio Display integradas.",
          screenStudio: "Fluxo básico de captura e apresentação de dispositivos.",
        },
        {
          feature: "Exportar formatos",
          screenCam: "Vídeo, GIF e Live Photo.",
          screenStudio: "Exportação de vídeo e GIF.",
        },
        {
          feature: "Música de fundo",
          screenCam: "Corte e organize músicas livremente com controles de fade-in e fade-out.",
          screenStudio: "Seleção básica de música de fundo.",
        },
        {
          feature: "Polimento de câmera",
          screenCam: "Layouts de câmera, remoção de fundo, controles de beleza e efeitos de adesivos.",
          screenStudio: "Layouts de câmera e apresentação de webcam.",
        },
        {
          feature: "Preços",
          screenCam: "Download grátis; a assinatura está abaixo de um terço nas regiões App Store suportadas.",
          screenStudio: "O preço da assinatura é mostrado no fluxo de compra oficial do Screen Studio.",
        },
        {
          feature: "Legendas e transcrições",
          screenCam: "Mais provedores de transcrição com BYOK, legendas Read Along altamente personalizáveis e fundos Liquid Glass.",
          screenStudio: "Fluxo básico de transcrição e legendas.",
        },
      ],
    },
    bestFit: {
      eyebrow: "Melhor ajuste",
      title: "Escolha ScreenCam se...",
      items: [
        "Demonstrações de dutos Pro que precisam de vários centros de zoom direcionados",
        "Passo a passo do aplicativo Mac com modelos de dispositivos e enquadramento personalizado",
        "Clipes que precisam de redação, realces de foco, texto e imagens",
        "Exportações que precisam de saída GIF ou Live Photo",
      ],
      gapEyebrow: "Legendas",
      gapTitle: "Legendas com o seu estilo.",
      gapDescription:
        "Escolha entre vários provedores de transcrição com BYOK, personalize detalhadamente as legendas Read Along e aplique predefinições reutilizáveis com fundos desfocados ou Liquid Glass.",
      pricingCta: "Verifique o preço App Store",
      screenStudioCta: "Ver Screen Studio",
    },
    faq: {
      eyebrow: "Perguntas frequentes",
      title: "Perguntas sobre a mudança de Screen Studio",
      items: [
        {
          question: "ScreenCam é uma alternativa Screen Studio?",
          answer:
            "Sim. ScreenCam é um gravador de tela e editor nativo macOS para demonstrações de produtos sofisticados, tutoriais, orientações de aplicativos e clipes sociais. É especialmente forte se você deseja um aplicativo menor, menor uso de recursos, exportações mais rápidas e controle de zoom manual mais profundo.",
        },
        {
          question: "O que torna ScreenCam diferente de Screen Studio?",
          answer:
            "ScreenCam se concentra no desempenho nativo do Mac, âncoras de zoom manuais, camadas mais ricas baseadas em tempo, modelos de dispositivos, interface de usuário estilo Liquid Glass, curvas de animação configuráveis, exportação GIF e exportação Live Photo.",
        },
        {
          question: "ScreenCam é mais barato que Screen Studio?",
          answer:
            "ScreenCam é um download gratuito com compras no aplicativo no Mac App Store. O preço atual varia de acordo com a região, mas a assinatura do ScreenCam está posicionada abaixo de um terço do preço da assinatura do Screen Studio nas regiões suportadas.",
        },
        {
          question: "ScreenCam suporta legendas?",
          answer:
            "Sim. ScreenCam oferece vários provedores de transcrição com BYOK, legendas Read Along altamente personalizáveis, visibilidade por legenda, estilos reutilizáveis e fundos desfocados ou Liquid Glass.",
        },
        {
          question: "ScreenCam oferece suporte a animações de zoom personalizadas?",
          answer:
            "Sim. O modo de zoom manual oferece suporte a âncoras personalizadas, vários centros de zoom, escala por âncora e curvas de animação configuráveis, para que você possa direcionar a atenção do visualizador após a gravação.",
        },
        {
          question: "ScreenCam pode exportar arquivos GIF ou Live Photo?",
          answer:
            "Sim. ScreenCam suporta fluxos de trabalho de exportação mais ricos, incluindo GIF e Live Photo, juntamente com exportações focadas em vídeo.",
        },
      ],
    },
    schema: {
      breadcrumbName: "Alternativa Screen Studio",
      about: ["Alternativa Screen Studio", "Gravador de tela Mac com zoom"],
      softwareDescription:
        "ScreenCam é um gravador de tela nativo macOS para captura nítida, âncoras de zoom manual, camadas, maquetes de dispositivos, desfoque de movimento e exportação com visualização precisa.",
      featureList: [
        "Gravação de tela nativa macOS",
        "Âncoras de zoom manuais",
        "Curvas de animação personalizadas",
        "Maquetes de dispositivos",
        "Camadas de mosaico, texto, foco e imagem personalizada",
        "Exportação GIF",
        "Exportação Live Photo",
        "Efeitos de beleza da câmera",
        "Exportação com visualização precisa",
      ],
    },
  },
  it: {
    meta: {
      title: "Screen Studio Alternativa a Mac | ScreenCam",
      description:
        "Cerchi un'alternativa Screen Studio? ScreenCam è un registratore dello schermo macOS nativo con dimensioni dell'app più piccole, utilizzo inferiore delle risorse, esportazioni più veloci, ancoraggi dello zoom manuale, livelli, modelli di dispositivi, GIF ed esportazione Live Photo.",
    },
    imageAlt: "Interfaccia del registratore dello schermo ScreenCam con controlli nativi macOS",
    lastUpdated: "13 giugno 2026",
    hero: {
      eyebrow: "Screen Studio Alternativa a Mac",
      title: "Un'alternativa Screen Studio più leggera.",
      description:
        "ScreenCam mantiene il raffinato flusso di lavoro di registrazione dello schermo Mac, quindi aggiunge uno zoom manuale più profondo, livelli più ricchi, ingombro ridotto e più forme di esportazione.",
      appStoreCta: "Visualizza ScreenCam su Mac App Store",
      benchmarkCta: "Visualizza i dati di riferimento",
      lastUpdatedLabel: "Ultimo aggiornamento:",
    },
    performanceHighlights: [
      {
        value: "30x",
        label: "ingombro ridotto dell'app",
        detail: "Circa 20 MB rispetto ai circa 600 MB di base del benchmark.",
      },
      {
        value: "Più in basso",
        label: "Utilizzo della CPU e della memoria",
        detail: "I dati di benchmark affiancati mantengono l'affermazione misurabile.",
      },
      {
        value: "Più veloce",
        label: "percorso di esportazione nativo",
        detail: "Tempi di esportazione più brevi nel confronto benchmark.",
      },
      {
        value: "<1/3",
        label: "prezzo di abbonamento",
        detail: "I prezzi attuali di App Store variano in base alla regione.",
      },
    ],
    whySwitch: {
      eyebrow: "Perché cambiare",
      title: "Velocità e controllo, senza l'ingombro pesante.",
      description:
        "Screen Studio copre il flusso automatizzato di base per la registrazione. ScreenCam va oltre con un’app nativa più leggera, vantaggi prestazionali misurabili e controlli automatici e manuali più profondi dopo la registrazione.",
    },
    features: {
      eyebrow: "Controllo creativo",
      title: "Le parti ScreenCam facilitano la direzione.",
      items: [
        {
          title: "Ancoraggi zoom manuali",
          body: "Centri multipli, scala per ancoraggio e curve personalizzate in un unico clip zoom.",
        },
        {
          title: "Livelli illimitati",
          body: "Mosaico, testo, effetti di messa a fuoco e immagini personalizzate possono sovrapporsi nello stesso intervallo di tempo.",
        },
        {
          title: "Mockup del dispositivo",
          body: "Cornici in stile Mac, iPhone, Apple Watch e Studio Display per le demo di prodotto.",
        },
        {
          title: "GIF + Live Photo",
          body: "Spedisci le registrazioni come risorse visive rapide, non solo come file video completi.",
        },
        {
          title: "Bellezza della fotocamera",
          body: "Lucido per presentatore di luci per procedure dettagliate guidate dalla telecamera.",
        },
        {
          title: "Sensazione Mac nativa",
          body: "Superfici in stile Liquid Glass, acquisizione tramite tastiera e distribuzione Mac App Store.",
        },
      ],
    },
    comparison: {
      eyebrow: "Confronto",
      title: "ScreenCam rispetto a Screen Studio",
      description:
        "Screen Studio copre il flusso di base per registrazione e modifica. ScreenCam lo amplia con un’app nativa più compatta, controlli più profondi, più strumenti creativi e più formati di output.",
      headers: {
        feature: "Caratteristica",
        screenCam: "ScreenCam",
        screenStudio: "Screen Studio",
      },
      rows: [
        {
          feature: "Impronta prestazionale",
          screenCam: "Circa 30 volte più piccolo, utilizzo inferiore di CPU e memoria, esportazioni più veloci.",
          screenStudio: "Flusso di base per registrazione, modifica ed esportazione dello schermo.",
        },
        {
          feature: "Controllo dello zoom",
          screenCam: "Zoom automatico con curve di animazione altamente personalizzabili.",
          screenStudio: "Zoom automatico e movimento guidato dal cursore.",
        },
        {
          feature: "Strati",
          screenCam: "Mosaico, testo, messa a fuoco, livelli di immagini, sovrapposizione illimitata.",
          screenStudio: "Sovrapposizioni, sfondi e mascheramento di base.",
        },
        {
          feature: "Presentazione del dispositivo",
          screenCam: "Mockup Mac, iPhone, Apple Watch e Studio Display integrati.",
          screenStudio: "Flusso di base per acquisizione e presentazione dei dispositivi.",
        },
        {
          feature: "Formati di esportazione",
          screenCam: "Video, GIF e Live Photo.",
          screenStudio: "Esportazione video e GIF.",
        },
        {
          feature: "Musica di sottofondo",
          screenCam: "Taglia e organizza liberamente la musica con controlli di dissolvenza in entrata e in uscita.",
          screenStudio: "Selezione di base della musica di sottofondo.",
        },
        {
          feature: "Lucidatura della fotocamera",
          screenCam: "Layout della fotocamera, rimozione dello sfondo, controlli di bellezza ed effetti adesivo.",
          screenStudio: "Layout della fotocamera e presentazione tramite webcam.",
        },
        {
          feature: "Prezzi",
          screenCam: "Download gratuito; l'abbonamento è inferiore a un terzo nelle regioni App Store supportate.",
          screenStudio: "Il prezzo dell'abbonamento è mostrato nel flusso di acquisto ufficiale di Screen Studio.",
        },
        {
          feature: "Didascalie e trascrizioni",
          screenCam: "Più provider di trascrizione con BYOK, sottotitoli Read Along altamente personalizzabili e sfondi Liquid Glass.",
          screenStudio: "Flusso di base per trascrizione e sottotitoli.",
        },
      ],
    },
    bestFit: {
      eyebrow: "La migliore vestibilità",
      title: "Scegli ScreenCam se...",
      items: [
        "Pro demo di condotti che richiedono più centri di zoom diretti",
        "Procedure dettagliate sull'app Mac con modelli di dispositivi e inquadrature personalizzate",
        "Clip che necessitano di redazione, messa a fuoco di evidenziazioni, testo e immagini",
        "Esportazioni che richiedono l'output GIF o Live Photo",
      ],
      gapEyebrow: "Sottotitoli",
      gapTitle: "Sottotitoli con il tuo stile.",
      gapDescription:
        "Scegli tra più provider di trascrizione con BYOK, personalizza nel dettaglio i sottotitoli Read Along e applica preset riutilizzabili con sfondi sfocati o Liquid Glass.",
      pricingCta: "Controlla i prezzi App Store",
      screenStudioCta: "Visualizza Screen Studio",
    },
    faq: {
      eyebrow: "Domande frequenti",
      title: "Domande sul passaggio da Screen Studio",
      items: [
        {
          question: "ScreenCam è un'alternativa a Screen Studio?",
          answer:
            "Sì. ScreenCam è un registratore ed editor di schermo nativo macOS per demo di prodotti, tutorial, procedure dettagliate di app e clip social raffinati. È particolarmente efficace se desideri un'app più piccola, un minore utilizzo delle risorse, esportazioni più veloci e un controllo manuale dello zoom più approfondito.",
        },
        {
          question: "Cosa rende ScreenCam diverso da Screen Studio?",
          answer:
            "ScreenCam si concentra su prestazioni Mac native, ancoraggi di zoom manuale, livelli più ricchi basati sul tempo, modelli di dispositivi, interfaccia utente in stile vetro liquido, curve di animazione configurabili, esportazione GIF ed esportazione Live Photo.",
        },
        {
          question: "ScreenCam è più economico di Screen Studio?",
          answer:
            "ScreenCam è un download gratuito con acquisti in-app su Mac App Store. I prezzi attuali variano in base alla regione, ma l'abbonamento a ScreenCam è posizionato al di sotto di un terzo del prezzo dell'abbonamento a Screen Studio nelle regioni supportate.",
        },
        {
          question: "ScreenCam supporta i sottotitoli?",
          answer:
            "Sì. ScreenCam offre più provider di trascrizione con BYOK, sottotitoli Read Along altamente personalizzabili, visibilità per sottotitolo, stili riutilizzabili e sfondi sfocati o Liquid Glass.",
        },
        {
          question: "ScreenCam supporta animazioni zoom personalizzate?",
          answer:
            "Sì. La modalità zoom manuale supporta ancoraggi personalizzati, centri di zoom multipli, scala per ancoraggio e curve di animazione configurabili, in modo da poter dirigere l'attenzione dello spettatore dopo la registrazione.",
        },
        {
          question: "ScreenCam può esportare file GIF o Live Photo?",
          answer:
            "Sì. ScreenCam supporta flussi di lavoro di esportazione più ricchi, inclusi GIF e Live Photo, insieme alle esportazioni incentrate sui video.",
        },
      ],
    },
    schema: {
      breadcrumbName: "Screen Studio Alternativa",
      about: ["Alternativa Screen Studio", "Registratore dello schermo Mac con zoom"],
      softwareDescription:
        "ScreenCam è un registratore di schermo macOS nativo per acquisizioni nitide, ancoraggi di zoom manuali, livelli, modelli di dispositivi, motion blur ed esportazione accurata in anteprima.",
      featureList: [
        "Registrazione dello schermo nativa macOS",
        "Ancoraggi zoom manuali",
        "Curve di animazione personalizzate",
        "Mockup del dispositivo",
        "Livelli di mosaico, testo, messa a fuoco e immagini personalizzate",
        "Esportazione GIF",
        "Esportazione Live Photo",
        "Effetti di bellezza della fotocamera",
        "Esportazione accurata in anteprima",
      ],
    },
  },
};

export function getScreenStudioAlternativeCopy(locale: Locale): ScreenStudioAlternativePageCopy {
  return screenStudioAlternativeCopies[locale];
}
