import type { Locale } from "./i18n";

export const iphoneDuoPath = "/iphone-duo-screen-recording";
export const helperDownloadUrl =
  "https://download.thescreen.cam/helper/latest/ScreenCamHelper.zip";

type StepCopy = {
  title: string;
  body: string;
};

type QuestionCopy = {
  question: string;
  answer: string;
};

export type IphoneDuoPageCopy = {
  meta: {
    title: string;
    description: string;
  };
  breadcrumbName: string;
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    downloadCta: string;
    appStoreCta: string;
  };
  requirements: {
    eyebrow: string;
    title: string;
    items: string[];
  };
  steps: {
    eyebrow: string;
    title: string;
    stepLabel: string;
    items: [StepCopy, StepCopy, StepCopy, StepCopy];
  };
  download: {
    eyebrow: string;
    title: string;
    description: string;
    button: string;
    details: string;
  };
  notes: {
    eyebrow: string;
    title: string;
    items: string[];
  };
  troubleshooting: {
    eyebrow: string;
    title: string;
    items: QuestionCopy[];
  };
  schema: {
    about: string[];
    helperDescription: string;
  };
};

const iphoneDuoCopies: Record<Locale, IphoneDuoPageCopy> = {
  en: {
    meta: {
      title: "iPhone Duo Screen Recording on Mac via USB | ScreenCam",
      description:
        "Record the iPhone Duo screen on your Mac over USB with ScreenCam. The free ScreenCam Helper captures the real hinge angle. Setup steps and fixes.",
    },
    breadcrumbName: "iPhone Duo screen recording",
    hero: {
      eyebrow: "iPhone Duo · USB recording",
      title: "iPhone Duo screen recording on Mac, with the real hinge angle",
      description:
        "ScreenCam records the screen of the foldable iPhone Duo over USB and renders it in a 3D iPhone Duo model. By default you set the hinge angle by hand in the editor. Install the free ScreenCam Helper to record the real hinge angle automatically.",
      downloadCta: "Download ScreenCam Helper",
      appStoreCta: "Get ScreenCam on the Mac App Store",
    },
    requirements: {
      eyebrow: "Before you start",
      title: "Requirements",
      items: [
        "A Mac with Apple silicon running macOS 15 or later, with ScreenCam from the Mac App Store.",
        "Xcode, installed and opened once so it can install its device support components. ScreenCam Helper uses them to talk to iPhone Duo; ScreenCam itself does not need Xcode.",
        "iPhone Duo connected with a USB cable, unlocked, and set to trust this Mac.",
        "Developer Mode turned on in Settings > Privacy & Security > Developer Mode. Xcode asks for it when pairing.",
      ],
    },
    steps: {
      eyebrow: "Setup",
      title: "How to record the iPhone Duo hinge angle",
      stepLabel: "Step",
      items: [
        {
          title: "Install and open Xcode",
          body: "Install Xcode from the Mac App Store and open it once. When asked, allow it to install additional components.",
        },
        {
          title: "Connect iPhone Duo",
          body: "Connect iPhone Duo with a USB cable, unlock it, and tap Trust. Turn on Developer Mode if asked.",
        },
        {
          title: "Install ScreenCam Helper",
          body: "Download ScreenCam Helper, unzip it, move it to the Applications folder, and open it once. Its window shows setup checks and a live iPhone Duo hinge-angle test, so you can confirm tracking works before recording. Then you can close it.",
        },
        {
          title: "Record iPhone Duo in ScreenCam",
          body: "Open ScreenCam and start an iPhone recording with iPhone Duo. ScreenCam starts the helper automatically and records the real hinge angle, and the “!” disappears. The recorded angles stay editable as pose clips in the editor.",
        },
      ],
    },
    download: {
      eyebrow: "Download",
      title: "Download ScreenCam Helper",
      description:
        "A free, optional companion app for ScreenCam. This link always points to the latest build, signed with a Developer ID and notarized by Apple.",
      button: "Download ScreenCam Helper (.zip)",
      details: "Free · macOS 15 or later · Apple silicon",
    },
    notes: {
      eyebrow: "Privacy",
      title: "About the helper",
      items: [
        "Free, signed with a Developer ID, and notarized by Apple.",
        "Starts only when ScreenCam needs it or when you open it, and quits on its own when idle.",
        "Reads the sensors of your connected devices only on this Mac.",
        "Sends nothing over the network.",
        "Optional: without the helper, iPhone Duo recording still works with manual poses.",
      ],
    },
    troubleshooting: {
      eyebrow: "FAQ",
      title: "Troubleshooting",
      items: [
        {
          question: "The helper says device support is missing. What should I do?",
          answer:
            "Open Xcode once and let it finish installing additional components, then open ScreenCam Helper again.",
        },
        {
          question: "The helper cannot find my iPhone Duo.",
          answer:
            "Reconnect the USB cable, unlock iPhone Duo, tap Trust if asked, and make sure Developer Mode is on in Settings > Privacy & Security > Developer Mode.",
        },
        {
          question: "ScreenCam still shows the “!”.",
          answer:
            "Make sure ScreenCam Helper is in the Applications folder and has been opened once, then reconnect iPhone Duo and start the recording again.",
        },
        {
          question: "Does it work on Intel Macs?",
          answer: "No. ScreenCam Helper requires a Mac with Apple silicon running macOS 15 or later.",
        },
        {
          question: "Do I need the helper to record iPhone Duo?",
          answer:
            "No. Without it, iPhone Duo screen recording works normally and you set the hinge angle manually with pose clips in the editor.",
        },
      ],
    },
    schema: {
      about: [
        "iPhone Duo screen recording",
        "Foldable iPhone",
        "iPhone Duo hinge angle",
        "iPhone screen recording on Mac via USB",
      ],
      helperDescription:
        "Free, optional companion app for ScreenCam that records the real hinge angle of a USB-connected iPhone Duo.",
    },
  },
  "zh-Hans": {
    meta: {
      title: "iPhone Duo 录屏：在 Mac 上通过 USB 录制屏幕 | ScreenCam",
      description:
        "在 Mac 上通过 USB 录制 iPhone Duo 屏幕。安装免费的 ScreenCam Helper，自动记录折叠屏 iPhone 的真实开合角度。含设置步骤与故障排查。",
    },
    breadcrumbName: "iPhone Duo 录屏",
    hero: {
      eyebrow: "iPhone Duo · USB 录制",
      title: "在 Mac 上录制 iPhone Duo 屏幕，自动记录真实开合角度",
      description:
        "ScreenCam 可以通过 USB 录制折叠屏 iPhone Duo 的屏幕，并将画面放进 3D iPhone Duo 模型中呈现。默认情况下，开合角度需要在编辑器中手动设置；安装免费的 ScreenCam Helper 后，即可自动录下真实的开合角度。",
      downloadCta: "下载 ScreenCam Helper",
      appStoreCta: "在 Mac App Store 获取 ScreenCam",
    },
    requirements: {
      eyebrow: "开始之前",
      title: "环境要求",
      items: [
        "一台搭载 Apple 芯片、运行 macOS 15 或更高版本的 Mac，并已从 Mac App Store 安装 ScreenCam。",
        "已安装 Xcode 并至少打开过一次，让它安装设备支持组件。ScreenCam Helper 通过这些组件与 iPhone Duo 通信；ScreenCam 本身不需要 Xcode。",
        "iPhone Duo 已通过 USB 线连接、已解锁，并已信任这台 Mac。",
        "已在“设置 > 隐私与安全性 > 开发者模式”中打开开发者模式。配对时 Xcode 会提示你开启。",
      ],
    },
    steps: {
      eyebrow: "设置步骤",
      title: "如何录制 iPhone Duo 的开合角度",
      stepLabel: "步骤",
      items: [
        {
          title: "安装并打开 Xcode",
          body: "从 Mac App Store 安装 Xcode 并打开一次。出现提示时，允许它安装额外组件。",
        },
        {
          title: "连接 iPhone Duo",
          body: "用 USB 线连接 iPhone Duo，解锁后轻点“信任”。如有提示，请打开开发者模式。",
        },
        {
          title: "安装 ScreenCam Helper",
          body: "下载 ScreenCam Helper，解压后移到“应用程序”文件夹，并打开一次。窗口会显示设置检查和 iPhone Duo 开合角度实时测试，录制前即可确认角度追踪正常，之后即可关闭。",
        },
        {
          title: "在 ScreenCam 中录制 iPhone Duo",
          body: "打开 ScreenCam，选择 iPhone Duo 开始 iPhone 录制。ScreenCam 会自动启动 Helper 并录下真实的开合角度，“!”提示随之消失。录下的角度会作为姿态片段保留在编辑器中，仍可随时调整。",
        },
      ],
    },
    download: {
      eyebrow: "下载",
      title: "下载 ScreenCam Helper",
      description: "ScreenCam 的免费可选配套应用。此链接始终指向最新版本，使用 Developer ID 签名并经过 Apple 公证。",
      button: "下载 ScreenCam Helper（.zip）",
      details: "免费 · macOS 15 或更高版本 · Apple 芯片",
    },
    notes: {
      eyebrow: "隐私",
      title: "关于 Helper",
      items: [
        "免费，使用 Developer ID 签名并经过 Apple 公证。",
        "仅在 ScreenCam 需要或你手动打开时启动，闲置时会自动退出。",
        "仅在这台 Mac 上读取已连接设备的传感器数据。",
        "不会通过网络发送任何数据。",
        "可选：不安装 Helper 时，仍可通过手动设置姿态正常录制 iPhone Duo。",
      ],
    },
    troubleshooting: {
      eyebrow: "常见问题",
      title: "故障排查",
      items: [
        {
          question: "Helper 提示缺少设备支持组件，怎么办？",
          answer: "打开一次 Xcode，等它装完额外组件，然后重新打开 ScreenCam Helper。",
        },
        {
          question: "Helper 找不到我的 iPhone Duo。",
          answer:
            "重新插拔 USB 线，解锁 iPhone Duo，如有提示请轻点“信任”，并确认已在“设置 > 隐私与安全性 > 开发者模式”中打开开发者模式。",
        },
        {
          question: "ScreenCam 仍然显示“!”。",
          answer:
            "确认 ScreenCam Helper 位于“应用程序”文件夹中且已打开过一次，然后重新连接 iPhone Duo 并再次开始录制。",
        },
        {
          question: "支持 Intel 芯片的 Mac 吗？",
          answer: "不支持。ScreenCam Helper 需要搭载 Apple 芯片、运行 macOS 15 或更高版本的 Mac。",
        },
        {
          question: "录制 iPhone Duo 一定要安装 Helper 吗？",
          answer: "不需要。不安装时，iPhone Duo 录屏照常可用，只需在编辑器中用姿态片段手动设置开合角度。",
        },
      ],
    },
    schema: {
      about: ["iPhone Duo 录屏", "折叠屏 iPhone 录屏", "iPhone Duo 开合角度", "在 Mac 上通过 USB 录制 iPhone 屏幕"],
      helperDescription: "ScreenCam 的免费可选配套应用，可录制通过 USB 连接的 iPhone Duo 的真实开合角度。",
    },
  },
  "zh-Hant": {
    meta: {
      title: "iPhone Duo 螢幕錄影：在 Mac 上透過 USB 錄製 | ScreenCam",
      description:
        "在 Mac 上透過 USB 錄製 iPhone Duo 螢幕。安裝免費的 ScreenCam Helper，自動記錄摺疊 iPhone 的真實開合角度。含設定步驟與疑難排解。",
    },
    breadcrumbName: "iPhone Duo 螢幕錄影",
    hero: {
      eyebrow: "iPhone Duo · USB 錄製",
      title: "在 Mac 上錄製 iPhone Duo 螢幕，自動記錄真實開合角度",
      description:
        "ScreenCam 可以透過 USB 錄製摺疊 iPhone Duo 的螢幕，並將畫面放進 3D iPhone Duo 模型中呈現。預設情況下，開合角度需要在編輯器中手動設定；安裝免費的 ScreenCam Helper 後，即可自動錄下真實的開合角度。",
      downloadCta: "下載 ScreenCam Helper",
      appStoreCta: "在 Mac App Store 取得 ScreenCam",
    },
    requirements: {
      eyebrow: "開始之前",
      title: "系統需求",
      items: [
        "一台搭載 Apple 晶片、執行 macOS 15 或以上版本的 Mac，並已從 Mac App Store 安裝 ScreenCam。",
        "已安裝 Xcode 並至少開啟過一次，讓它安裝裝置支援元件。ScreenCam Helper 透過這些元件與 iPhone Duo 溝通；ScreenCam 本身不需要 Xcode。",
        "iPhone Duo 已透過 USB 線連接、已解鎖，並已信任這部 Mac。",
        "已在「設定 > 隱私權與安全性 > 開發者模式」中開啟開發者模式。配對時 Xcode 會提示你開啟。",
      ],
    },
    steps: {
      eyebrow: "設定步驟",
      title: "如何錄製 iPhone Duo 的開合角度",
      stepLabel: "步驟",
      items: [
        {
          title: "安裝並開啟 Xcode",
          body: "從 Mac App Store 安裝 Xcode 並開啟一次。出現提示時，允許它安裝額外元件。",
        },
        {
          title: "連接 iPhone Duo",
          body: "用 USB 線連接 iPhone Duo，解鎖後點一下「信任」。如有提示，請開啟開發者模式。",
        },
        {
          title: "安裝 ScreenCam Helper",
          body: "下載 ScreenCam Helper，解壓縮後移到「應用程式」檔案夾，並開啟一次。視窗會顯示設定檢查和 iPhone Duo 開合角度即時測試，錄製前即可確認角度追蹤正常，之後即可關閉。",
        },
        {
          title: "在 ScreenCam 中錄製 iPhone Duo",
          body: "開啟 ScreenCam，選擇 iPhone Duo 開始 iPhone 錄製。ScreenCam 會自動啟動 Helper 並錄下真實的開合角度，「!」提示隨之消失。錄下的角度會以姿態片段保留在編輯器中，仍可隨時調整。",
        },
      ],
    },
    download: {
      eyebrow: "下載",
      title: "下載 ScreenCam Helper",
      description: "ScreenCam 的免費選用配套 App。此連結一律指向最新版本，使用 Developer ID 簽署並經過 Apple 公證。",
      button: "下載 ScreenCam Helper（.zip）",
      details: "免費 · macOS 15 或以上版本 · Apple 晶片",
    },
    notes: {
      eyebrow: "隱私權",
      title: "關於 Helper",
      items: [
        "免費，使用 Developer ID 簽署並經過 Apple 公證。",
        "僅在 ScreenCam 需要或你手動開啟時啟動，閒置時會自動結束。",
        "僅在這台 Mac 上讀取已連接裝置的感測器資料。",
        "不會透過網路傳送任何資料。",
        "選用：未安裝 Helper 時，仍可透過手動設定姿態正常錄製 iPhone Duo。",
      ],
    },
    troubleshooting: {
      eyebrow: "常見問題",
      title: "疑難排解",
      items: [
        {
          question: "Helper 顯示缺少裝置支援元件，該怎麼辦？",
          answer: "開啟一次 Xcode，等它安裝完額外元件，然後重新開啟 ScreenCam Helper。",
        },
        {
          question: "Helper 找不到我的 iPhone Duo。",
          answer:
            "重新插拔 USB 線，解鎖 iPhone Duo，如有提示請點一下「信任」，並確認已在「設定 > 隱私權與安全性 > 開發者模式」中開啟開發者模式。",
        },
        {
          question: "ScreenCam 仍然顯示「!」。",
          answer:
            "確認 ScreenCam Helper 位於「應用程式」檔案夾中且已開啟過一次，然後重新連接 iPhone Duo 並再次開始錄製。",
        },
        {
          question: "支援 Intel 處理器的 Mac 嗎？",
          answer: "不支援。ScreenCam Helper 需要搭載 Apple 晶片、執行 macOS 15 或以上版本的 Mac。",
        },
        {
          question: "錄製 iPhone Duo 一定要安裝 Helper 嗎？",
          answer: "不需要。未安裝時，iPhone Duo 螢幕錄影照常可用，只需在編輯器中用姿態片段手動設定開合角度。",
        },
      ],
    },
    schema: {
      about: ["iPhone Duo 螢幕錄影", "摺疊 iPhone 錄影", "iPhone Duo 開合角度", "在 Mac 上透過 USB 錄製 iPhone 螢幕"],
      helperDescription: "ScreenCam 的免費選用配套 App，可錄製透過 USB 連接的 iPhone Duo 的真實開合角度。",
    },
  },
  de: {
    meta: {
      title: "iPhone Duo Bildschirm aufnehmen am Mac per USB | ScreenCam",
      description:
        "Nimm den iPhone Duo Bildschirm per USB am Mac auf. Der kostenlose ScreenCam Helper zeichnet den echten Scharnierwinkel auf. Anleitung und Hilfe.",
    },
    breadcrumbName: "iPhone Duo Bildschirmaufnahme",
    hero: {
      eyebrow: "iPhone Duo · USB-Aufnahme",
      title: "iPhone Duo Bildschirmaufnahme am Mac – mit echtem Scharnierwinkel",
      description:
        "ScreenCam nimmt den Bildschirm des faltbaren iPhone Duo per USB auf und zeigt ihn in einem 3D-Modell des iPhone Duo. Standardmäßig stellst du den Scharnierwinkel im Editor von Hand ein. Mit dem kostenlosen ScreenCam Helper wird der echte Winkel automatisch aufgezeichnet.",
      downloadCta: "ScreenCam Helper laden",
      appStoreCta: "ScreenCam im Mac App Store",
    },
    requirements: {
      eyebrow: "Bevor du startest",
      title: "Voraussetzungen",
      items: [
        "Ein Mac mit Apple Chip und macOS 15 oder neuer sowie ScreenCam aus dem Mac App Store.",
        "Xcode, installiert und einmal geöffnet, damit es seine Gerätesupport-Komponenten installiert. ScreenCam Helper nutzt sie, um mit dem iPhone Duo zu kommunizieren; ScreenCam selbst braucht kein Xcode.",
        "Das iPhone Duo ist per USB-Kabel verbunden, entsperrt und vertraut diesem Mac.",
        "Der Entwicklermodus ist aktiviert unter Einstellungen > Datenschutz & Sicherheit > Entwicklermodus. Xcode fordert ihn beim Koppeln an.",
      ],
    },
    steps: {
      eyebrow: "Einrichtung",
      title: "So nimmst du den Scharnierwinkel des iPhone Duo auf",
      stepLabel: "Schritt",
      items: [
        {
          title: "Xcode installieren und öffnen",
          body: "Installiere Xcode aus dem Mac App Store und öffne es einmal. Erlaube auf Nachfrage die Installation zusätzlicher Komponenten.",
        },
        {
          title: "iPhone Duo verbinden",
          body: "Verbinde das iPhone Duo per USB-Kabel, entsperre es und tippe auf „Vertrauen“. Aktiviere bei Nachfrage den Entwicklermodus.",
        },
        {
          title: "ScreenCam Helper installieren",
          body: "Lade ScreenCam Helper herunter, entpacke ihn, verschiebe ihn in den Ordner „Programme“ und öffne ihn einmal. Sein Fenster zeigt Einrichtungsprüfungen und einen Live-Test des iPhone Duo Scharnierwinkels, damit du vor der Aufnahme siehst, dass die Erfassung funktioniert. Danach kannst du ihn schließen.",
        },
        {
          title: "iPhone Duo in ScreenCam aufnehmen",
          body: "Öffne ScreenCam und starte eine iPhone-Aufnahme mit dem iPhone Duo. ScreenCam startet den Helper automatisch und zeichnet den echten Scharnierwinkel auf; das „!“ verschwindet. Die Winkel bleiben im Editor als Posen-Clips bearbeitbar.",
        },
      ],
    },
    download: {
      eyebrow: "Download",
      title: "ScreenCam Helper herunterladen",
      description:
        "Eine kostenlose, optionale Begleit-App für ScreenCam. Der Link führt immer zum neuesten Build, mit einer Developer ID signiert und von Apple notarisiert.",
      button: "ScreenCam Helper herunterladen (.zip)",
      details: "Kostenlos · macOS 15 oder neuer · Apple Chip",
    },
    notes: {
      eyebrow: "Datenschutz",
      title: "Über den Helper",
      items: [
        "Kostenlos, mit einer Developer ID signiert und von Apple notarisiert.",
        "Startet nur, wenn ScreenCam ihn braucht oder du ihn öffnest, und beendet sich im Leerlauf von selbst.",
        "Liest die Sensoren deiner verbundenen Geräte nur lokal auf diesem Mac.",
        "Sendet nichts über das Netzwerk.",
        "Optional: Ohne den Helper funktioniert die Aufnahme des iPhone Duo weiterhin mit manuellen Posen.",
      ],
    },
    troubleshooting: {
      eyebrow: "FAQ",
      title: "Fehlerbehebung",
      items: [
        {
          question: "Der Helper meldet fehlenden Gerätesupport. Was tun?",
          answer:
            "Öffne Xcode einmal und lass es die zusätzlichen Komponenten fertig installieren. Öffne dann ScreenCam Helper erneut.",
        },
        {
          question: "Der Helper findet mein iPhone Duo nicht.",
          answer:
            "Stecke das USB-Kabel neu ein, entsperre das iPhone Duo, tippe bei Nachfrage auf „Vertrauen“ und prüfe, ob der Entwicklermodus unter Einstellungen > Datenschutz & Sicherheit > Entwicklermodus aktiv ist.",
        },
        {
          question: "ScreenCam zeigt weiterhin das „!“.",
          answer:
            "Stelle sicher, dass ScreenCam Helper im Ordner „Programme“ liegt und einmal geöffnet wurde. Verbinde dann das iPhone Duo neu und starte die Aufnahme erneut.",
        },
        {
          question: "Funktioniert das auf Intel-Macs?",
          answer: "Nein. ScreenCam Helper benötigt einen Mac mit Apple Chip und macOS 15 oder neuer.",
        },
        {
          question: "Brauche ich den Helper, um das iPhone Duo aufzunehmen?",
          answer:
            "Nein. Ohne ihn funktioniert die Bildschirmaufnahme des iPhone Duo normal; den Scharnierwinkel stellst du dann im Editor mit Posen-Clips von Hand ein.",
        },
      ],
    },
    schema: {
      about: [
        "iPhone Duo Bildschirmaufnahme",
        "Faltbares iPhone",
        "iPhone Duo Scharnierwinkel",
        "iPhone-Bildschirm am Mac per USB aufnehmen",
      ],
      helperDescription:
        "Kostenlose, optionale Begleit-App für ScreenCam, die den echten Scharnierwinkel eines per USB verbundenen iPhone Duo aufzeichnet.",
    },
  },
  ja: {
    meta: {
      title: "iPhone Duo 画面収録：Mac で USB 経由で録画 | ScreenCam",
      description:
        "iPhone Duo の画面を USB 経由で Mac に録画。無料の ScreenCam Helper で折りたたみ iPhone の実際の開き角度を自動記録。手順とトラブル対処。",
    },
    breadcrumbName: "iPhone Duo 画面収録",
    hero: {
      eyebrow: "iPhone Duo · USB 収録",
      title: "Mac で iPhone Duo の画面を録画し、実際の開き角度も記録",
      description:
        "ScreenCam は折りたたみ式 iPhone Duo の画面を USB 経由で収録し、3D の iPhone Duo モデルに表示します。開き角度は通常エディタで手動設定しますが、無料の ScreenCam Helper をインストールすると実際の角度を自動で記録できます。",
      downloadCta: "ScreenCam Helper をダウンロード",
      appStoreCta: "Mac App Store で ScreenCam を入手",
    },
    requirements: {
      eyebrow: "はじめる前に",
      title: "必要なもの",
      items: [
        "macOS 15 以降を搭載した Apple シリコン Mac と、Mac App Store 版の ScreenCam。",
        "インストール後に一度開き、デバイスサポートコンポーネントをインストールした Xcode。ScreenCam Helper はこれを使って iPhone Duo と通信します。ScreenCam 本体には Xcode は不要です。",
        "USB ケーブルで接続し、ロックを解除して、この Mac を信頼済みの iPhone Duo。",
        "「設定」>「プライバシーとセキュリティ」>「デベロッパモード」でデベロッパモードをオン。ペアリング時に Xcode から求められます。",
      ],
    },
    steps: {
      eyebrow: "セットアップ",
      title: "iPhone Duo の開き角度を記録する手順",
      stepLabel: "ステップ",
      items: [
        {
          title: "Xcode をインストールして開く",
          body: "Mac App Store から Xcode をインストールし、一度開きます。求められたら追加コンポーネントのインストールを許可します。",
        },
        {
          title: "iPhone Duo を接続する",
          body: "USB ケーブルで iPhone Duo を接続し、ロックを解除して「信頼」をタップします。求められたらデベロッパモードをオンにします。",
        },
        {
          title: "ScreenCam Helper をインストールする",
          body: "ScreenCam Helper をダウンロードして解凍し、「アプリケーション」フォルダに移動して一度開きます。ウインドウに設定チェックと iPhone Duo の開き角度のライブテストが表示され、収録前に角度を正しく取得できているか確認できます。確認後は閉じてかまいません。",
        },
        {
          title: "ScreenCam で iPhone Duo を収録する",
          body: "ScreenCam を開き、iPhone Duo で iPhone 収録を開始します。ScreenCam が Helper を自動で起動して実際の開き角度を記録し、「!」が消えます。記録した角度はエディタでポーズクリップとして編集できます。",
        },
      ],
    },
    download: {
      eyebrow: "ダウンロード",
      title: "ScreenCam Helper をダウンロード",
      description:
        "ScreenCam 用の無料オプションのコンパニオンアプリです。このリンクは常に最新ビルドを指し、Developer ID で署名され、Apple の公証を受けています。",
      button: "ScreenCam Helper をダウンロード（.zip）",
      details: "無料 · macOS 15 以降 · Apple シリコン",
    },
    notes: {
      eyebrow: "プライバシー",
      title: "Helper について",
      items: [
        "無料で、Developer ID で署名され、Apple の公証を受けています。",
        "ScreenCam が必要とするときか、自分で開いたときだけ起動し、使われていないときは自動で終了します。",
        "接続中のデバイスのセンサーを、この Mac 上でのみ読み取ります。",
        "ネットワーク経由で何も送信しません。",
        "オプション：Helper がなくても、手動ポーズで iPhone Duo を収録できます。",
      ],
    },
    troubleshooting: {
      eyebrow: "よくある質問",
      title: "トラブルシューティング",
      items: [
        {
          question: "Helper に「デバイスサポートがありません」と表示されます。",
          answer:
            "Xcode を一度開き、追加コンポーネントのインストールが完了するまで待ってから、ScreenCam Helper をもう一度開いてください。",
        },
        {
          question: "Helper が iPhone Duo を見つけられません。",
          answer:
            "USB ケーブルを挿し直し、iPhone Duo のロックを解除し、求められたら「信頼」をタップしてください。「設定」>「プライバシーとセキュリティ」>「デベロッパモード」がオンになっているかも確認してください。",
        },
        {
          question: "ScreenCam に「!」が表示されたままです。",
          answer:
            "ScreenCam Helper が「アプリケーション」フォルダにあり、一度開かれていることを確認してから、iPhone Duo を接続し直して収録をやり直してください。",
        },
        {
          question: "Intel Mac でも使えますか？",
          answer: "いいえ。ScreenCam Helper には macOS 15 以降を搭載した Apple シリコン Mac が必要です。",
        },
        {
          question: "iPhone Duo の収録に Helper は必須ですか？",
          answer:
            "いいえ。Helper がなくても iPhone Duo の画面収録は通常どおり使えます。その場合はエディタでポーズクリップを使って開き角度を手動で設定します。",
        },
      ],
    },
    schema: {
      about: ["iPhone Duo 画面収録", "折りたたみ iPhone の録画", "iPhone Duo 開き角度", "Mac で USB 経由の iPhone 画面収録"],
      helperDescription:
        "USB 接続した iPhone Duo の実際の開き角度を記録する、ScreenCam 用の無料オプションのコンパニオンアプリ。",
    },
  },
  ko: {
    meta: {
      title: "iPhone Duo 화면 녹화: Mac에서 USB로 녹화하기 | ScreenCam",
      description:
        "Mac에서 USB로 iPhone Duo 화면을 녹화하세요. 무료 ScreenCam Helper로 폴더블 iPhone의 실제 힌지 각도를 자동 기록합니다. 설정 방법과 문제 해결.",
    },
    breadcrumbName: "iPhone Duo 화면 녹화",
    hero: {
      eyebrow: "iPhone Duo · USB 녹화",
      title: "Mac에서 iPhone Duo 화면 녹화, 실제 힌지 각도까지",
      description:
        "ScreenCam은 폴더블 iPhone Duo의 화면을 USB로 녹화하고 3D iPhone Duo 모델 안에 보여 줍니다. 기본적으로 힌지 각도는 편집기에서 직접 설정하며, 무료 ScreenCam Helper를 설치하면 실제 각도를 자동으로 기록합니다.",
      downloadCta: "ScreenCam Helper 다운로드",
      appStoreCta: "Mac App Store에서 ScreenCam 받기",
    },
    requirements: {
      eyebrow: "시작하기 전에",
      title: "요구 사항",
      items: [
        "macOS 15 이상을 실행하는 Apple 실리콘 Mac과 Mac App Store에서 받은 ScreenCam.",
        "설치 후 한 번 실행해 기기 지원 구성 요소를 설치한 Xcode. ScreenCam Helper는 이를 사용해 iPhone Duo와 통신하며, ScreenCam 자체에는 Xcode가 필요하지 않습니다.",
        "USB 케이블로 연결되어 있고, 잠금이 해제되어 있으며, 이 Mac을 신뢰하도록 설정된 iPhone Duo.",
        "설정 > 개인정보 보호 및 보안 > 개발자 모드에서 켠 개발자 모드. 페어링할 때 Xcode가 요청합니다.",
      ],
    },
    steps: {
      eyebrow: "설정",
      title: "iPhone Duo 힌지 각도를 녹화하는 방법",
      stepLabel: "단계",
      items: [
        {
          title: "Xcode 설치 및 실행",
          body: "Mac App Store에서 Xcode를 설치하고 한 번 실행합니다. 요청이 나타나면 추가 구성 요소 설치를 허용합니다.",
        },
        {
          title: "iPhone Duo 연결",
          body: "USB 케이블로 iPhone Duo를 연결하고 잠금을 해제한 뒤 '신뢰'를 탭합니다. 요청이 나타나면 개발자 모드를 켭니다.",
        },
        {
          title: "ScreenCam Helper 설치",
          body: "ScreenCam Helper를 다운로드해 압축을 풀고 응용 프로그램 폴더로 옮긴 다음 한 번 실행합니다. 창에 설정 확인 항목과 iPhone Duo 힌지 각도 실시간 테스트가 표시되어 녹화 전에 각도 추적이 제대로 되는지 확인할 수 있습니다. 확인 후에는 닫아도 됩니다.",
        },
        {
          title: "ScreenCam에서 iPhone Duo 녹화",
          body: "ScreenCam을 열고 iPhone Duo로 iPhone 녹화를 시작합니다. ScreenCam이 Helper를 자동으로 실행해 실제 힌지 각도를 기록하고 '!' 표시가 사라집니다. 기록된 각도는 편집기에서 포즈 클립으로 계속 수정할 수 있습니다.",
        },
      ],
    },
    download: {
      eyebrow: "다운로드",
      title: "ScreenCam Helper 다운로드",
      description:
        "ScreenCam용 무료 선택형 보조 앱입니다. 이 링크는 항상 최신 빌드를 가리키며, Developer ID로 서명되고 Apple의 공증을 받았습니다.",
      button: "ScreenCam Helper 다운로드 (.zip)",
      details: "무료 · macOS 15 이상 · Apple 실리콘",
    },
    notes: {
      eyebrow: "개인정보 보호",
      title: "Helper 정보",
      items: [
        "무료이며, Developer ID로 서명되고 Apple의 공증을 받았습니다.",
        "ScreenCam이 필요로 하거나 사용자가 직접 열 때만 시작되며, 유휴 상태가 되면 스스로 종료됩니다.",
        "연결된 기기의 센서를 이 Mac에서만 읽습니다.",
        "네트워크로 아무것도 전송하지 않습니다.",
        "선택 사항: Helper가 없어도 수동 포즈로 iPhone Duo를 녹화할 수 있습니다.",
      ],
    },
    troubleshooting: {
      eyebrow: "자주 묻는 질문",
      title: "문제 해결",
      items: [
        {
          question: "Helper에 기기 지원 구성 요소가 없다고 표시됩니다.",
          answer:
            "Xcode를 한 번 실행해 추가 구성 요소 설치가 끝날 때까지 기다린 다음 ScreenCam Helper를 다시 실행하세요.",
        },
        {
          question: "Helper가 iPhone Duo를 찾지 못합니다.",
          answer:
            "USB 케이블을 다시 연결하고 iPhone Duo의 잠금을 해제한 뒤, 요청이 나타나면 '신뢰'를 탭하세요. 설정 > 개인정보 보호 및 보안 > 개발자 모드가 켜져 있는지도 확인하세요.",
        },
        {
          question: "ScreenCam에 '!'가 계속 표시됩니다.",
          answer:
            "ScreenCam Helper가 응용 프로그램 폴더에 있고 한 번 실행되었는지 확인한 다음, iPhone Duo를 다시 연결하고 녹화를 다시 시작하세요.",
        },
        {
          question: "Intel Mac에서도 작동하나요?",
          answer: "아니요. ScreenCam Helper는 macOS 15 이상을 실행하는 Apple 실리콘 Mac이 필요합니다.",
        },
        {
          question: "iPhone Duo를 녹화하려면 Helper가 꼭 필요한가요?",
          answer:
            "아니요. Helper 없이도 iPhone Duo 화면 녹화는 정상적으로 작동하며, 편집기에서 포즈 클립으로 힌지 각도를 직접 설정하면 됩니다.",
        },
      ],
    },
    schema: {
      about: ["iPhone Duo 화면 녹화", "폴더블 iPhone 녹화", "iPhone Duo 힌지 각도", "Mac에서 USB로 iPhone 화면 녹화"],
      helperDescription: "USB로 연결된 iPhone Duo의 실제 힌지 각도를 기록하는 ScreenCam용 무료 선택형 보조 앱.",
    },
  },
  es: {
    meta: {
      title: "Grabar la pantalla del iPhone Duo en Mac por USB | ScreenCam",
      description:
        "Graba la pantalla del iPhone Duo en tu Mac por USB con ScreenCam. ScreenCam Helper, gratis, capta el ángulo real de la bisagra. Pasos y soluciones.",
    },
    breadcrumbName: "Grabación de pantalla del iPhone Duo",
    hero: {
      eyebrow: "iPhone Duo · Grabación por USB",
      title: "Grabación de pantalla del iPhone Duo en Mac, con el ángulo real de la bisagra",
      description:
        "ScreenCam graba la pantalla del iPhone Duo plegable por USB y la muestra dentro de un modelo 3D del iPhone Duo. Por defecto, el ángulo de la bisagra se ajusta a mano en el editor. Instala el ScreenCam Helper gratuito para grabar el ángulo real automáticamente.",
      downloadCta: "Descargar ScreenCam Helper",
      appStoreCta: "Obtener ScreenCam en la Mac App Store",
    },
    requirements: {
      eyebrow: "Antes de empezar",
      title: "Requisitos",
      items: [
        "Un Mac con chip de Apple y macOS 15 o posterior, con ScreenCam de la Mac App Store.",
        "Xcode instalado y abierto una vez para que instale sus componentes de soporte de dispositivos. ScreenCam Helper los usa para comunicarse con el iPhone Duo; ScreenCam en sí no necesita Xcode.",
        "El iPhone Duo conectado con un cable USB, desbloqueado y configurado para confiar en este Mac.",
        "El modo de desarrollador activado en Ajustes > Privacidad y seguridad > Modo de desarrollador. Xcode lo solicita al emparejar.",
      ],
    },
    steps: {
      eyebrow: "Configuración",
      title: "Cómo grabar el ángulo de la bisagra del iPhone Duo",
      stepLabel: "Paso",
      items: [
        {
          title: "Instala y abre Xcode",
          body: "Instala Xcode desde la Mac App Store y ábrelo una vez. Cuando te lo pida, permite que instale los componentes adicionales.",
        },
        {
          title: "Conecta el iPhone Duo",
          body: "Conecta el iPhone Duo con un cable USB, desbloquéalo y toca Confiar. Activa el modo de desarrollador si se te pide.",
        },
        {
          title: "Instala ScreenCam Helper",
          body: "Descarga ScreenCam Helper, descomprímelo, muévelo a la carpeta Aplicaciones y ábrelo una vez. Su ventana muestra comprobaciones de configuración y una prueba en vivo del ángulo de la bisagra del iPhone Duo para confirmar que el seguimiento funciona antes de grabar. Después puedes cerrarlo.",
        },
        {
          title: "Graba el iPhone Duo en ScreenCam",
          body: "Abre ScreenCam e inicia una grabación de iPhone con el iPhone Duo. ScreenCam abre el helper automáticamente y graba el ángulo real de la bisagra; el «!» desaparece. Los ángulos grabados siguen siendo editables como clips de pose en el editor.",
        },
      ],
    },
    download: {
      eyebrow: "Descarga",
      title: "Descargar ScreenCam Helper",
      description:
        "Una app complementaria gratuita y opcional para ScreenCam. Este enlace siempre apunta a la última versión, firmada con un Developer ID y notarizada por Apple.",
      button: "Descargar ScreenCam Helper (.zip)",
      details: "Gratis · macOS 15 o posterior · Chip de Apple",
    },
    notes: {
      eyebrow: "Privacidad",
      title: "Sobre el helper",
      items: [
        "Gratuito, firmado con un Developer ID y notarizado por Apple.",
        "Solo se inicia cuando ScreenCam lo necesita o cuando lo abres, y se cierra solo cuando está inactivo.",
        "Lee los sensores de tus dispositivos conectados solo en este Mac.",
        "No envía nada por la red.",
        "Opcional: sin el helper, la grabación del iPhone Duo sigue funcionando con poses manuales.",
      ],
    },
    troubleshooting: {
      eyebrow: "Preguntas frecuentes",
      title: "Solución de problemas",
      items: [
        {
          question: "El helper dice que falta el soporte de dispositivos. ¿Qué hago?",
          answer:
            "Abre Xcode una vez y deja que termine de instalar los componentes adicionales. Después vuelve a abrir ScreenCam Helper.",
        },
        {
          question: "El helper no encuentra mi iPhone Duo.",
          answer:
            "Vuelve a conectar el cable USB, desbloquea el iPhone Duo, toca Confiar si se te pide y comprueba que el modo de desarrollador esté activado en Ajustes > Privacidad y seguridad > Modo de desarrollador.",
        },
        {
          question: "ScreenCam sigue mostrando el «!».",
          answer:
            "Comprueba que ScreenCam Helper esté en la carpeta Aplicaciones y que lo hayas abierto una vez. Luego vuelve a conectar el iPhone Duo e inicia la grabación de nuevo.",
        },
        {
          question: "¿Funciona en Mac con Intel?",
          answer: "No. ScreenCam Helper requiere un Mac con chip de Apple y macOS 15 o posterior.",
        },
        {
          question: "¿Necesito el helper para grabar el iPhone Duo?",
          answer:
            "No. Sin él, la grabación de pantalla del iPhone Duo funciona con normalidad y ajustas el ángulo de la bisagra a mano con clips de pose en el editor.",
        },
      ],
    },
    schema: {
      about: [
        "Grabación de pantalla del iPhone Duo",
        "iPhone plegable",
        "Ángulo de la bisagra del iPhone Duo",
        "Grabar la pantalla del iPhone en Mac por USB",
      ],
      helperDescription:
        "App complementaria gratuita y opcional para ScreenCam que graba el ángulo real de la bisagra de un iPhone Duo conectado por USB.",
    },
  },
  fr: {
    meta: {
      title: "Enregistrer l’écran iPhone Duo sur Mac en USB | ScreenCam",
      description:
        "Enregistrez l’écran de l’iPhone Duo sur Mac en USB avec ScreenCam. ScreenCam Helper, gratuit, capte l’angle réel de la charnière. Étapes et dépannage.",
    },
    breadcrumbName: "Enregistrement d’écran de l’iPhone Duo",
    hero: {
      eyebrow: "iPhone Duo · Enregistrement USB",
      title: "Enregistrement d’écran de l’iPhone Duo sur Mac, avec l’angle réel de la charnière",
      description:
        "ScreenCam enregistre l’écran de l’iPhone Duo pliable en USB et l’affiche dans un modèle 3D de l’iPhone Duo. Par défaut, l’angle de la charnière se règle à la main dans l’éditeur. Installez le ScreenCam Helper gratuit pour enregistrer automatiquement l’angle réel.",
      downloadCta: "Télécharger ScreenCam Helper",
      appStoreCta: "Obtenir ScreenCam sur le Mac App Store",
    },
    requirements: {
      eyebrow: "Avant de commencer",
      title: "Configuration requise",
      items: [
        "Un Mac avec puce Apple sous macOS 15 ou version ultérieure, avec ScreenCam installé depuis le Mac App Store.",
        "Xcode, installé et ouvert une fois pour qu’il installe ses composants de prise en charge des appareils. ScreenCam Helper les utilise pour communiquer avec l’iPhone Duo ; ScreenCam lui-même n’a pas besoin de Xcode.",
        "L’iPhone Duo branché avec un câble USB, déverrouillé et configuré pour faire confiance à ce Mac.",
        "Le mode développeur activé dans Réglages > Confidentialité et sécurité > Mode développeur. Xcode le demande lors du jumelage.",
      ],
    },
    steps: {
      eyebrow: "Configuration",
      title: "Comment enregistrer l’angle de la charnière de l’iPhone Duo",
      stepLabel: "Étape",
      items: [
        {
          title: "Installer et ouvrir Xcode",
          body: "Installez Xcode depuis le Mac App Store et ouvrez-le une fois. Lorsqu’il vous le demande, autorisez l’installation des composants supplémentaires.",
        },
        {
          title: "Brancher l’iPhone Duo",
          body: "Branchez l’iPhone Duo avec un câble USB, déverrouillez-le et touchez Se fier. Activez le mode développeur si cela vous est demandé.",
        },
        {
          title: "Installer ScreenCam Helper",
          body: "Téléchargez ScreenCam Helper, décompressez-le, placez-le dans le dossier Applications et ouvrez-le une fois. Sa fenêtre affiche des vérifications de configuration et un test en direct de l’angle de la charnière de l’iPhone Duo, pour confirmer que le suivi fonctionne avant d’enregistrer. Vous pouvez ensuite le fermer.",
        },
        {
          title: "Enregistrer l’iPhone Duo dans ScreenCam",
          body: "Ouvrez ScreenCam et lancez un enregistrement d’iPhone avec l’iPhone Duo. ScreenCam démarre automatiquement le helper et enregistre l’angle réel de la charnière ; le « ! » disparaît. Les angles enregistrés restent modifiables sous forme de clips de pose dans l’éditeur.",
        },
      ],
    },
    download: {
      eyebrow: "Téléchargement",
      title: "Télécharger ScreenCam Helper",
      description:
        "Une app compagnon gratuite et facultative pour ScreenCam. Ce lien pointe toujours vers la dernière version, signée avec un Developer ID et notarisée par Apple.",
      button: "Télécharger ScreenCam Helper (.zip)",
      details: "Gratuit · macOS 15 ou ultérieur · Puce Apple",
    },
    notes: {
      eyebrow: "Confidentialité",
      title: "À propos du helper",
      items: [
        "Gratuit, signé avec un Developer ID et notarisé par Apple.",
        "Ne démarre que lorsque ScreenCam en a besoin ou que vous l’ouvrez, et se ferme tout seul lorsqu’il est inactif.",
        "Lit les capteurs de vos appareils connectés uniquement sur ce Mac.",
        "N’envoie rien sur le réseau.",
        "Facultatif : sans le helper, l’enregistrement de l’iPhone Duo fonctionne toujours avec des poses manuelles.",
      ],
    },
    troubleshooting: {
      eyebrow: "FAQ",
      title: "Dépannage",
      items: [
        {
          question: "Le helper indique que la prise en charge des appareils est manquante. Que faire ?",
          answer:
            "Ouvrez Xcode une fois et laissez-le terminer l’installation des composants supplémentaires, puis rouvrez ScreenCam Helper.",
        },
        {
          question: "Le helper ne trouve pas mon iPhone Duo.",
          answer:
            "Rebranchez le câble USB, déverrouillez l’iPhone Duo, touchez Se fier si cela vous est demandé et vérifiez que le mode développeur est activé dans Réglages > Confidentialité et sécurité > Mode développeur.",
        },
        {
          question: "ScreenCam affiche toujours le « ! ».",
          answer:
            "Vérifiez que ScreenCam Helper se trouve dans le dossier Applications et a été ouvert une fois, puis rebranchez l’iPhone Duo et relancez l’enregistrement.",
        },
        {
          question: "Est-ce compatible avec les Mac Intel ?",
          answer: "Non. ScreenCam Helper nécessite un Mac avec puce Apple sous macOS 15 ou version ultérieure.",
        },
        {
          question: "Le helper est-il nécessaire pour enregistrer l’iPhone Duo ?",
          answer:
            "Non. Sans lui, l’enregistrement d’écran de l’iPhone Duo fonctionne normalement et vous réglez l’angle de la charnière à la main avec des clips de pose dans l’éditeur.",
        },
      ],
    },
    schema: {
      about: [
        "Enregistrement d’écran de l’iPhone Duo",
        "iPhone pliable",
        "Angle de la charnière de l’iPhone Duo",
        "Enregistrer l’écran de l’iPhone sur Mac en USB",
      ],
      helperDescription:
        "App compagnon gratuite et facultative pour ScreenCam qui enregistre l’angle réel de la charnière d’un iPhone Duo connecté en USB.",
    },
  },
  "pt-BR": {
    meta: {
      title: "Gravar a tela do iPhone Duo no Mac via USB | ScreenCam",
      description:
        "Grave a tela do iPhone Duo no Mac via USB com o ScreenCam. O ScreenCam Helper gratuito capta o ângulo real da dobradiça. Passo a passo e soluções.",
    },
    breadcrumbName: "Gravação de tela do iPhone Duo",
    hero: {
      eyebrow: "iPhone Duo · Gravação via USB",
      title: "Gravação de tela do iPhone Duo no Mac, com o ângulo real da dobradiça",
      description:
        "O ScreenCam grava a tela do iPhone Duo dobrável via USB e a exibe dentro de um modelo 3D do iPhone Duo. Por padrão, o ângulo da dobradiça é definido manualmente no editor. Instale o ScreenCam Helper gratuito para gravar o ângulo real automaticamente.",
      downloadCta: "Baixar o ScreenCam Helper",
      appStoreCta: "Obter o ScreenCam na Mac App Store",
    },
    requirements: {
      eyebrow: "Antes de começar",
      title: "Requisitos",
      items: [
        "Um Mac com Apple Silicon e macOS 15 ou posterior, com o ScreenCam da Mac App Store.",
        "Xcode instalado e aberto uma vez para instalar seus componentes de suporte a dispositivos. O ScreenCam Helper usa esses componentes para se comunicar com o iPhone Duo; o ScreenCam em si não precisa do Xcode.",
        "iPhone Duo conectado por cabo USB, desbloqueado e configurado para confiar neste Mac.",
        "Modo de Desenvolvedor ativado em Ajustes > Privacidade e Segurança > Modo de Desenvolvedor. O Xcode solicita isso ao parear.",
      ],
    },
    steps: {
      eyebrow: "Configuração",
      title: "Como gravar o ângulo da dobradiça do iPhone Duo",
      stepLabel: "Passo",
      items: [
        {
          title: "Instale e abra o Xcode",
          body: "Instale o Xcode pela Mac App Store e abra-o uma vez. Quando solicitado, permita a instalação dos componentes adicionais.",
        },
        {
          title: "Conecte o iPhone Duo",
          body: "Conecte o iPhone Duo com um cabo USB, desbloqueie-o e toque em Confiar. Ative o Modo de Desenvolvedor se for solicitado.",
        },
        {
          title: "Instale o ScreenCam Helper",
          body: "Baixe o ScreenCam Helper, descompacte-o, mova-o para a pasta Aplicativos e abra-o uma vez. A janela dele mostra verificações de configuração e um teste ao vivo do ângulo da dobradiça do iPhone Duo, para confirmar que o rastreamento funciona antes de gravar. Depois, você pode fechá-lo.",
        },
        {
          title: "Grave o iPhone Duo no ScreenCam",
          body: "Abra o ScreenCam e inicie uma gravação de iPhone com o iPhone Duo. O ScreenCam inicia o helper automaticamente e grava o ângulo real da dobradiça; o “!” desaparece. Os ângulos gravados continuam editáveis como clipes de pose no editor.",
        },
      ],
    },
    download: {
      eyebrow: "Download",
      title: "Baixar o ScreenCam Helper",
      description:
        "Um app complementar gratuito e opcional para o ScreenCam. Este link sempre aponta para a versão mais recente, assinada com um Developer ID e notarizada pela Apple.",
      button: "Baixar o ScreenCam Helper (.zip)",
      details: "Gratuito · macOS 15 ou posterior · Apple Silicon",
    },
    notes: {
      eyebrow: "Privacidade",
      title: "Sobre o helper",
      items: [
        "Gratuito, assinado com um Developer ID e notarizado pela Apple.",
        "Só é iniciado quando o ScreenCam precisa dele ou quando você o abre, e fecha sozinho quando fica ocioso.",
        "Lê os sensores dos seus dispositivos conectados apenas neste Mac.",
        "Não envia nada pela rede.",
        "Opcional: sem o helper, a gravação do iPhone Duo continua funcionando com poses manuais.",
      ],
    },
    troubleshooting: {
      eyebrow: "Perguntas frequentes",
      title: "Solução de problemas",
      items: [
        {
          question: "O helper diz que o suporte a dispositivos está faltando. O que fazer?",
          answer:
            "Abra o Xcode uma vez e deixe-o terminar de instalar os componentes adicionais. Depois, abra o ScreenCam Helper novamente.",
        },
        {
          question: "O helper não encontra meu iPhone Duo.",
          answer:
            "Reconecte o cabo USB, desbloqueie o iPhone Duo, toque em Confiar se for solicitado e verifique se o Modo de Desenvolvedor está ativado em Ajustes > Privacidade e Segurança > Modo de Desenvolvedor.",
        },
        {
          question: "O ScreenCam continua mostrando o “!”.",
          answer:
            "Verifique se o ScreenCam Helper está na pasta Aplicativos e se já foi aberto uma vez. Depois, reconecte o iPhone Duo e inicie a gravação novamente.",
        },
        {
          question: "Funciona em Macs com Intel?",
          answer: "Não. O ScreenCam Helper requer um Mac com Apple Silicon e macOS 15 ou posterior.",
        },
        {
          question: "Preciso do helper para gravar o iPhone Duo?",
          answer:
            "Não. Sem ele, a gravação de tela do iPhone Duo funciona normalmente e você define o ângulo da dobradiça manualmente com clipes de pose no editor.",
        },
      ],
    },
    schema: {
      about: [
        "Gravação de tela do iPhone Duo",
        "iPhone dobrável",
        "Ângulo da dobradiça do iPhone Duo",
        "Gravar a tela do iPhone no Mac via USB",
      ],
      helperDescription:
        "App complementar gratuito e opcional para o ScreenCam que grava o ângulo real da dobradiça de um iPhone Duo conectado via USB.",
    },
  },
  it: {
    meta: {
      title: "Registrare lo schermo iPhone Duo su Mac via USB | ScreenCam",
      description:
        "Registra lo schermo di iPhone Duo sul Mac via USB con ScreenCam. ScreenCam Helper, gratuito, rileva l’angolo reale della cerniera. Passaggi e soluzioni.",
    },
    breadcrumbName: "Registrazione schermo di iPhone Duo",
    hero: {
      eyebrow: "iPhone Duo · Registrazione USB",
      title: "Registrazione dello schermo di iPhone Duo su Mac, con l’angolo reale della cerniera",
      description:
        "ScreenCam registra lo schermo dell’iPhone Duo pieghevole via USB e lo mostra in un modello 3D di iPhone Duo. Per impostazione predefinita l’angolo della cerniera si regola a mano nell’editor. Installa il ScreenCam Helper gratuito per registrare automaticamente l’angolo reale.",
      downloadCta: "Scarica ScreenCam Helper",
      appStoreCta: "Scarica ScreenCam dal Mac App Store",
    },
    requirements: {
      eyebrow: "Prima di iniziare",
      title: "Requisiti",
      items: [
        "Un Mac con chip Apple e macOS 15 o versioni successive, con ScreenCam dal Mac App Store.",
        "Xcode, installato e aperto una volta perché installi i componenti di supporto dei dispositivi. ScreenCam Helper li usa per comunicare con iPhone Duo; ScreenCam da solo non richiede Xcode.",
        "iPhone Duo collegato con un cavo USB, sbloccato e autorizzato a fidarsi di questo Mac.",
        "Modalità sviluppatore attivata in Impostazioni > Privacy e sicurezza > Modalità sviluppatore. Xcode la richiede durante l’abbinamento.",
      ],
    },
    steps: {
      eyebrow: "Configurazione",
      title: "Come registrare l’angolo della cerniera di iPhone Duo",
      stepLabel: "Passaggio",
      items: [
        {
          title: "Installa e apri Xcode",
          body: "Installa Xcode dal Mac App Store e aprilo una volta. Quando richiesto, consenti l’installazione dei componenti aggiuntivi.",
        },
        {
          title: "Collega iPhone Duo",
          body: "Collega iPhone Duo con un cavo USB, sbloccalo e tocca Autorizza. Attiva la Modalità sviluppatore se richiesto.",
        },
        {
          title: "Installa ScreenCam Helper",
          body: "Scarica ScreenCam Helper, decomprimilo, spostalo nella cartella Applicazioni e aprilo una volta. La sua finestra mostra i controlli di configurazione e un test dal vivo dell’angolo della cerniera di iPhone Duo, per verificare che il rilevamento funzioni prima di registrare. Poi puoi chiuderlo.",
        },
        {
          title: "Registra iPhone Duo in ScreenCam",
          body: "Apri ScreenCam e avvia una registrazione iPhone con iPhone Duo. ScreenCam avvia automaticamente l’helper e registra l’angolo reale della cerniera; il “!” scompare. Gli angoli registrati restano modificabili come clip di posa nell’editor.",
        },
      ],
    },
    download: {
      eyebrow: "Download",
      title: "Scarica ScreenCam Helper",
      description:
        "Un’app complementare gratuita e facoltativa per ScreenCam. Questo link punta sempre alla build più recente, firmata con un Developer ID e autenticata da Apple.",
      button: "Scarica ScreenCam Helper (.zip)",
      details: "Gratis · macOS 15 o successivi · Chip Apple",
    },
    notes: {
      eyebrow: "Privacy",
      title: "Informazioni sull’helper",
      items: [
        "Gratuito, firmato con un Developer ID e autenticato da Apple.",
        "Si avvia solo quando ScreenCam ne ha bisogno o quando lo apri, e si chiude da solo quando è inattivo.",
        "Legge i sensori dei dispositivi collegati solo su questo Mac.",
        "Non invia nulla in rete.",
        "Facoltativo: senza l’helper, la registrazione di iPhone Duo funziona comunque con pose manuali.",
      ],
    },
    troubleshooting: {
      eyebrow: "Domande frequenti",
      title: "Risoluzione dei problemi",
      items: [
        {
          question: "L’helper segnala che manca il supporto dei dispositivi. Cosa faccio?",
          answer:
            "Apri Xcode una volta e lascia che completi l’installazione dei componenti aggiuntivi, poi riapri ScreenCam Helper.",
        },
        {
          question: "L’helper non trova il mio iPhone Duo.",
          answer:
            "Ricollega il cavo USB, sblocca iPhone Duo, tocca Autorizza se richiesto e verifica che la Modalità sviluppatore sia attiva in Impostazioni > Privacy e sicurezza > Modalità sviluppatore.",
        },
        {
          question: "ScreenCam mostra ancora il “!”.",
          answer:
            "Assicurati che ScreenCam Helper sia nella cartella Applicazioni e che sia stato aperto una volta, poi ricollega iPhone Duo e avvia di nuovo la registrazione.",
        },
        {
          question: "Funziona sui Mac con Intel?",
          answer: "No. ScreenCam Helper richiede un Mac con chip Apple e macOS 15 o versioni successive.",
        },
        {
          question: "Serve l’helper per registrare iPhone Duo?",
          answer:
            "No. Senza l’helper la registrazione dello schermo di iPhone Duo funziona normalmente e imposti a mano l’angolo della cerniera con clip di posa nell’editor.",
        },
      ],
    },
    schema: {
      about: [
        "Registrazione dello schermo di iPhone Duo",
        "iPhone pieghevole",
        "Angolo della cerniera di iPhone Duo",
        "Registrare lo schermo di iPhone su Mac via USB",
      ],
      helperDescription:
        "App complementare gratuita e facoltativa per ScreenCam che registra l’angolo reale della cerniera di un iPhone Duo collegato via USB.",
    },
  },
};

export function getIphoneDuoCopy(locale: Locale): IphoneDuoPageCopy {
  return iphoneDuoCopies[locale];
}
