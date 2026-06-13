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
        "Screen Studio is great when you want automatic polish. ScreenCam is for Mac creators who want a lighter app, measured performance wins, and more direct control after recording.",
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
          body: "Mac, iPhone, and Studio Display-style framing for polished product demos.",
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
        "Both tools can create polished videos. The difference is where they put their weight: Screen Studio leans automatic, while ScreenCam leans native, compact, and manual.",
      headers: {
        feature: "Feature",
        screenCam: "ScreenCam",
        screenStudio: "Screen Studio",
      },
      rows: [
        {
          feature: "Performance footprint",
          screenCam: "About 30x smaller, lower CPU and memory use, faster exports.",
          screenStudio: "Polished recorder with a heavier installed footprint.",
        },
        {
          feature: "Zoom control",
          screenCam: "Manual anchors, multiple centers, per-anchor scale, tunable curves.",
          screenStudio: "Strong auto zoom and smooth cursor-driven motion.",
        },
        {
          feature: "Layers",
          screenCam: "Mosaic, text, focus, image layers, unlimited overlap.",
          screenStudio: "Focused editor for cursor motion, backgrounds, and masking.",
        },
        {
          feature: "Device presentation",
          screenCam: "Built-in Mac, iPhone, and Studio Display mockups.",
          screenStudio: "Strong iOS and device capture workflow.",
        },
        {
          feature: "Export formats",
          screenCam: "Video, GIF, and Live Photo.",
          screenStudio: "Video and GIF with strong defaults.",
        },
        {
          feature: "Camera polish",
          screenCam: "Camera overlay controls plus lightweight beauty effects.",
          screenStudio: "Dynamic camera layouts and webcam presentation.",
        },
        {
          feature: "Pricing",
          screenCam: "Free download; subscription is below one-third in supported App Store regions.",
          screenStudio: "Subscription pricing is shown on Screen Studio's official purchase flow.",
        },
        {
          feature: "Captions and transcripts",
          screenCam: "Not yet. Apple-native and third-party BYOK transcription are planned.",
          screenStudio: "Transcript and subtitle workflows are available today.",
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
      gapEyebrow: "Current gap",
      gapTitle: "Subtitles are not here yet.",
      gapDescription:
        "ScreenCam does not support subtitles today. Planned support is expected to offer Apple-native transcription and third-party BYOK transcription, without ScreenCam operating its own transcription service.",
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
            "Not yet. Subtitle support is planned. The current direction is to offer Apple-native transcription and third-party transcription through BYOK, without ScreenCam running its own transcription service.",
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
        "Screen Studio 很适合自动化打磨。ScreenCam 面向想要更轻应用、可量化性能优势，以及录制后更直接控制的 Mac 创作者。",
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
          body: "用 Mac、iPhone 和 Studio Display 风格外框完成更精致的产品演示。",
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
        "两款工具都能制作精致视频。差异在于重心：Screen Studio 偏自动化，ScreenCam 更偏原生、轻量和手动控制。",
      headers: {
        feature: "功能",
        screenCam: "ScreenCam",
        screenStudio: "Screen Studio",
      },
      rows: [
        {
          feature: "性能负担",
          screenCam: "体积约小 30 倍，CPU 和内存占用更低，导出更快。",
          screenStudio: "打磨完善，但安装体积更重。",
        },
        {
          feature: "变焦控制",
          screenCam: "手动锚点、多个中心、单独缩放比例、可调曲线。",
          screenStudio: "强项是自动变焦和顺滑的光标驱动运动。",
        },
        {
          feature: "图层",
          screenCam: "马赛克、文字、聚焦、图片图层，可不限量重叠。",
          screenStudio: "聚焦于光标运动、背景和遮罩的编辑流程。",
        },
        {
          feature: "设备呈现",
          screenCam: "内置 Mac、iPhone 和 Studio Display 样机。",
          screenStudio: "iOS 和设备录制流程较强。",
        },
        {
          feature: "导出格式",
          screenCam: "视频、GIF 和 Live Photo。",
          screenStudio: "视频和 GIF，并带有成熟默认设置。",
        },
        {
          feature: "摄像头修饰",
          screenCam: "摄像头浮窗控制，加轻量美颜效果。",
          screenStudio: "动态摄像头布局和演示者呈现。",
        },
        {
          feature: "价格",
          screenCam: "免费下载；在支持地区订阅价格低于三分之一。",
          screenStudio: "订阅价格以 Screen Studio 官方购买流程为准。",
        },
        {
          feature: "字幕和转写",
          screenCam: "暂未支持。已计划 Apple 原生转写和第三方 BYOK 转写。",
          screenStudio: "目前已有转写和字幕工作流。",
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
      gapEyebrow: "当前差距",
      gapTitle: "字幕功能还没上线。",
      gapDescription:
        "ScreenCam 目前不支持字幕。计划中的方向是提供 Apple 原生转写和第三方 BYOK 转写，同时不由 ScreenCam 自己运营转写服务。",
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
            "暂未支持。字幕功能已在计划中，目前方向是提供 Apple 原生转写和第三方 BYOK 转写，不由 ScreenCam 自己运营转写服务。",
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
        "Screen Studio ist stark, wenn du automatische Politur möchtest. ScreenCam ist für Mac-Creator, die eine leichtere App, messbare Performance-Vorteile und mehr direkte Kontrolle nach der Aufnahme wollen.",
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
          body: "Mac-, iPhone- und Studio-Display-Rahmen für hochwertige Produktdemos.",
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
        "Beide Tools können hochwertige Videos erstellen. Der Unterschied liegt im Schwerpunkt: Screen Studio setzt stärker auf Automatik, ScreenCam auf native, kompakte und manuelle Kontrolle.",
      headers: {
        feature: "Funktion",
        screenCam: "ScreenCam",
        screenStudio: "Screen Studio",
      },
      rows: [
        {
          feature: "Performance-Fußabdruck",
          screenCam: "Etwa 30x kleiner, niedrigere CPU- und Speichernutzung, schnellere Exporte.",
          screenStudio: "Ausgereifter Recorder mit schwererem Installationsumfang.",
        },
        {
          feature: "Zoom-Steuerung",
          screenCam: "Manuelle Anker, mehrere Zentren, Skalierung pro Anker, anpassbare Kurven.",
          screenStudio: "Starker Auto-Zoom und geschmeidige, cursorbasierte Bewegung.",
        },
        {
          feature: "Ebenen",
          screenCam: "Mosaik, Text, Fokus, Bildebenen und unbegrenzte Überlappung.",
          screenStudio: "Fokussierter Editor für Cursorbewegung, Hintergründe und Maskierung.",
        },
        {
          feature: "Gerätepräsentation",
          screenCam: "Integrierte Mac-, iPhone- und Studio-Display-Mockups.",
          screenStudio: "Starker Workflow für iOS- und Geräteaufnahmen.",
        },
        {
          feature: "Exportformate",
          screenCam: "Video, GIF und Live Photo.",
          screenStudio: "Video und GIF mit starken Voreinstellungen.",
        },
        {
          feature: "Kamera-Polish",
          screenCam: "Kamera-Overlay-Steuerung plus leichte Beauty-Effekte.",
          screenStudio: "Dynamische Kamera-Layouts und Webcam-Präsentation.",
        },
        {
          feature: "Preis",
          screenCam: "Kostenloser Download; das Abo liegt in unterstützten App-Store-Regionen unter einem Drittel.",
          screenStudio: "Abo-Preise stehen im offiziellen Kaufprozess von Screen Studio.",
        },
        {
          feature: "Untertitel und Transkripte",
          screenCam: "Noch nicht. Apple-native und BYOK-Transkription über Drittanbieter sind geplant.",
          screenStudio: "Transkript- und Untertitel-Workflows sind heute verfügbar.",
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
      gapEyebrow: "Aktuelle Lücke",
      gapTitle: "Untertitel sind noch nicht da.",
      gapDescription:
        "ScreenCam unterstützt heute noch keine Untertitel. Geplant ist Apple-native Transkription und BYOK-Transkription über Drittanbieter, ohne dass ScreenCam selbst einen Transkriptionsdienst betreibt.",
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
            "Noch nicht. Untertitel sind geplant. Die aktuelle Richtung ist Apple-native Transkription und BYOK-Transkription über Drittanbieter, ohne dass ScreenCam einen eigenen Transkriptionsdienst betreibt.",
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
        "自動で整った仕上がりが欲しいとき、Screen Studio は優れています。ScreenCam は、より軽いアプリ、測定可能な性能差、録画後の直接的なコントロールを求める Mac クリエイター向けです。",
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
          body: "Mac、iPhone、Studio Display 風のフレームで、プロダクトデモをきれいに見せられます。",
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
        "どちらのツールでも洗練された動画を作れます。違いは重心です。Screen Studio は自動化寄り、ScreenCam はネイティブ、コンパクト、手動制御寄りです。",
      headers: {
        feature: "機能",
        screenCam: "ScreenCam",
        screenStudio: "Screen Studio",
      },
      rows: [
        {
          feature: "パフォーマンス負荷",
          screenCam: "約 30 倍小さく、CPU とメモリ使用量が低く、書き出しも高速です。",
          screenStudio: "洗練されたレコーダーですが、インストールサイズは大きめです。",
        },
        {
          feature: "ズーム制御",
          screenCam: "手動アンカー、複数中心、アンカーごとの拡大率、調整可能なカーブ。",
          screenStudio: "強力な自動ズームと、カーソル駆動のなめらかな動き。",
        },
        {
          feature: "レイヤー",
          screenCam: "モザイク、テキスト、フォーカス、画像レイヤーを無制限に重ねられます。",
          screenStudio: "カーソル動作、背景、マスク向けの集中した編集体験。",
        },
        {
          feature: "デバイス表示",
          screenCam: "Mac、iPhone、Studio Display のモックアップを内蔵。",
          screenStudio: "iOS とデバイス収録のワークフローが強力です。",
        },
        {
          feature: "書き出し形式",
          screenCam: "動画、GIF、Live Photo。",
          screenStudio: "動画と GIF。優れたデフォルト設定があります。",
        },
        {
          feature: "カメラ仕上げ",
          screenCam: "カメラオーバーレイ制御と軽い補正効果。",
          screenStudio: "動的なカメラレイアウトと Web カメラ表示。",
        },
        {
          feature: "価格",
          screenCam: "無料ダウンロード。対応 App Store 地域ではサブスクリプション価格が 3 分の 1 未満です。",
          screenStudio: "サブスクリプション価格は Screen Studio 公式購入フローで表示されます。",
        },
        {
          feature: "字幕と文字起こし",
          screenCam: "未対応です。Apple ネイティブとサードパーティ BYOK の文字起こしを計画しています。",
          screenStudio: "文字起こしと字幕ワークフローを現在利用できます。",
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
      gapEyebrow: "現在の未対応点",
      gapTitle: "字幕はまだありません。",
      gapDescription:
        "ScreenCam は現在字幕に対応していません。予定している方向性は、Apple ネイティブ文字起こしとサードパーティ BYOK 文字起こしで、ScreenCam 自身が文字起こしサービスを運営するものではありません。",
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
            "まだ対応していません。字幕機能は計画中です。現在の方向性は Apple ネイティブ文字起こしとサードパーティ BYOK 文字起こしで、ScreenCam 自身が文字起こしサービスを運営するものではありません。",
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
        "자동으로 다듬어진 결과가 필요하다면 Screen Studio도 좋습니다. ScreenCam은 더 가벼운 앱, 측정 가능한 성능 이점, 녹화 후 더 직접적인 제어를 원하는 Mac 크리에이터를 위한 도구입니다.",
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
          body: "Mac, iPhone, Studio Display 스타일 프레임으로 제품 데모를 더 완성도 있게 보여줍니다.",
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
        "두 도구 모두 세련된 영상을 만들 수 있습니다. 차이는 무게중심입니다. Screen Studio는 자동화에, ScreenCam은 네이티브, 컴팩트함, 수동 제어에 더 가깝습니다.",
      headers: {
        feature: "기능",
        screenCam: "ScreenCam",
        screenStudio: "Screen Studio",
      },
      rows: [
        {
          feature: "성능 부담",
          screenCam: "약 30배 더 작고, CPU 및 메모리 사용량이 낮으며, 내보내기가 더 빠릅니다.",
          screenStudio: "세련된 레코더지만 설치 크기가 더 무겁습니다.",
        },
        {
          feature: "줌 제어",
          screenCam: "수동 앵커, 여러 중심, 앵커별 배율, 조정 가능한 곡선.",
          screenStudio: "강력한 자동 줌과 부드러운 커서 기반 움직임.",
        },
        {
          feature: "레이어",
          screenCam: "모자이크, 텍스트, 포커스, 이미지 레이어를 제한 없이 겹칠 수 있습니다.",
          screenStudio: "커서 움직임, 배경, 마스킹 중심의 편집 흐름.",
        },
        {
          feature: "기기 표현",
          screenCam: "Mac, iPhone, Studio Display 목업이 내장되어 있습니다.",
          screenStudio: "iOS 및 기기 녹화 워크플로가 강합니다.",
        },
        {
          feature: "내보내기 형식",
          screenCam: "동영상, GIF, Live Photo.",
          screenStudio: "동영상과 GIF, 강력한 기본값.",
        },
        {
          feature: "카메라 연출",
          screenCam: "카메라 오버레이 제어와 가벼운 보정 효과.",
          screenStudio: "동적인 카메라 레이아웃과 웹캠 프레젠테이션.",
        },
        {
          feature: "가격",
          screenCam: "무료 다운로드. 지원되는 App Store 지역에서는 구독 가격이 3분의 1 미만입니다.",
          screenStudio: "구독 가격은 Screen Studio 공식 구매 흐름에서 표시됩니다.",
        },
        {
          feature: "자막과 전사",
          screenCam: "아직 없습니다. Apple 네이티브 및 서드파티 BYOK 전사를 계획 중입니다.",
          screenStudio: "전사와 자막 워크플로를 현재 사용할 수 있습니다.",
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
      gapEyebrow: "현재 빈틈",
      gapTitle: "자막은 아직 없습니다.",
      gapDescription:
        "ScreenCam은 현재 자막을 지원하지 않습니다. 계획 중인 방향은 Apple 네이티브 전사와 서드파티 BYOK 전사를 제공하되, ScreenCam이 자체 전사 서비스를 운영하지 않는 것입니다.",
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
            "아직은 아닙니다. 자막 기능은 계획 중입니다. 현재 방향은 Apple 네이티브 전사와 서드파티 BYOK 전사를 제공하되, ScreenCam이 자체 전사 서비스를 운영하지 않는 것입니다.",
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
};

export function getScreenStudioAlternativeCopy(locale: Locale): ScreenStudioAlternativePageCopy {
  return screenStudioAlternativeCopies[locale];
}
