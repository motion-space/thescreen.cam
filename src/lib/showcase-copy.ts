import type { Locale } from "./i18n";

export type ShowcaseFeatureKey = "zoom" | "zoom3d" | "lens" | "captions" | "keyboard" | "camera" | "screenshot";

export type ShowcaseCopy = {
  toggleZoom: string;
  replay: string;
  removeBackground: string;
  sticker: string;
  eyebrow: string;
  title: string;
  /** Sample sentence used by the read-along caption in the editor mock. */
  captionSample: string;
  items: Record<ShowcaseFeatureKey, { label: string; title: string; body: string }>;
};

export const showcaseFeatureOrder: ShowcaseFeatureKey[] = ["zoom", "zoom3d", "lens", "captions", "keyboard", "camera", "screenshot"];

const en: ShowcaseCopy = {
  toggleZoom: "Press to zoom · press again or leave to exit",
  replay: "Replay typing",
  removeBackground: "Remove background",
  sticker: "Sticker",
  eyebrow: "Inside the editor",
  title: "One editor Every camera move",
  captionSample: "Click export and every zoom lands exactly where you placed it.",
  items: {
    zoom: {
      label: "Zoom",
      title: "Zoom that follows the action",
      body: "Clicks and typing turn into smooth zoom clips. Let Auto follow the cursor, or place every target by hand.",
    },
    zoom3d: {
      label: "3D Zoom",
      title: "Turn a zoom into a camera move",
      body: "Orbit the recording in real 3D space. Yaw, pitch and push in with depth, then ease back out.",
    },
    lens: {
      label: "Lens",
      title: "A magnifier, not a crop",
      body: "A glass loupe follows the cursor and enlarges the detail while the rest of the screen stays in view.",
    },
    captions: {
      label: "Captions",
      title: "Captions that read along",
      body: "Generate captions from your voice and let each word light up as it is spoken, on a blur or glass background.",
    },
    keyboard: { label: "Keystrokes", title: "Every keystroke, made visible", body: "Watch a comment appear letter by letter, then send it with ⌘ Return. Try MacBook keycaps, flat or raised styles." },
    camera: { label: "Camera", title: "Make your camera part of the edit", body: "Remove your camera background in one click and add a sticker outline to help you stand out in the recording." },
    screenshot: {
      label: "Screenshot",
      title: "Screenshots, framed and marked up",
      body: "Capture a window, place it on a background and annotate it with arrows, counters, spotlight and mosaic.",
    },
  },
};

const zhHans: ShowcaseCopy = {
  toggleZoom: "按一下放大，再按一下缩小 · 离开自动缩小",
  replay: "重播输入",
  removeBackground: "移除背景",
  sticker: "贴纸效果",
  eyebrow: "编辑器里",
  title: "一个编辑器所有镜头运动",
  captionSample: "点击导出，每一次变焦都会精确落在你放置的位置。",
  items: {
    zoom: { label: "变焦", title: "跟着操作走的变焦", body: "点击和输入会自动变成平滑的变焦片段。可以让自动模式跟随光标，也可以手动放置每个目标。" },
    zoom3d: { label: "3D 变焦", title: "让变焦变成运镜", body: "在真实的 3D 空间里环绕录屏画面：偏航、俯仰、带纵深地推进，再平滑拉回。" },
    lens: { label: "透镜", title: "放大细节，保留全貌", body: "透镜随光标移动，放大当前操作区域，周围画面始终可见。" },
    captions: { label: "字幕", title: "逐词跟读的字幕", body: "从你的语音生成字幕，每个词在说出时点亮，可选模糊或玻璃背景。" },
    keyboard: { label: "按键", title: "每一次输入，都看得见", body: "逐字输入评论，再用 ⌘ Return 发送。默认 MacBook 键帽，也可以切换平面、立体样式。" },
    camera: { label: "人像", title: "让人像融入画面", body: "一键移除摄像头背景，加上贴纸描边，让你在录屏中更醒目。" },
    screenshot: { label: "截图", title: "截图，带背景也带标注", body: "截取窗口，放到背景上，再用箭头、序号、聚光灯和马赛克标注。" },
  },
};

const zhHant: ShowcaseCopy = {
  toggleZoom: "按一下放大，再按一下縮小 · 離開自動縮小",
  replay: "重播輸入",
  removeBackground: "移除背景",
  sticker: "貼紙效果",
  eyebrow: "編輯器裡",
  title: "一個編輯器所有鏡頭運動",
  captionSample: "點擊匯出，每一次縮放都會精確落在你放置的位置。",
  items: {
    zoom: { label: "縮放", title: "跟著操作走的縮放", body: "點擊與輸入會自動變成平滑的縮放片段。可以讓自動模式跟隨游標，也可以手動放置每個目標。" },
    zoom3d: { label: "3D 縮放", title: "讓縮放變成運鏡", body: "在真實的 3D 空間中環繞錄影畫面：偏航、俯仰、帶縱深地推進，再平滑拉回。" },
    lens: { label: "透鏡", title: "放大細節，保留全貌", body: "透鏡隨游標移動，放大目前操作區域，周圍畫面始終可見。" },
    captions: { label: "字幕", title: "逐字跟讀的字幕", body: "從你的語音產生字幕，每個詞在說出時亮起，可選模糊或玻璃背景。" },
    keyboard: { label: "按鍵", title: "每一次輸入，都看得見", body: "逐字輸入留言，再用 ⌘ Return 送出。預設 MacBook 鍵帽，也可以切換平面、立體樣式。" },
    camera: { label: "人像", title: "讓人像融入畫面", body: "一鍵移除攝影機背景，加上貼紙描邊，讓你在螢幕錄影中更醒目。" },
    screenshot: { label: "截圖", title: "截圖，加背景也加標註", body: "擷取視窗，放到背景上，再用箭頭、序號、聚光燈與馬賽克標註。" },
  },
};

const de: ShowcaseCopy = {
  toggleZoom: "Drücken zum Vergrößern · erneut drücken oder verlassen zum Verkleinern",
  replay: "Eingabe wiederholen",
  removeBackground: "Hintergrund entfernen",
  sticker: "Sticker",
  eyebrow: "Im Editor",
  title: "Ein Editor Jede Kamerafahrt",
  captionSample: "Klicke auf Exportieren und jeder Zoom landet genau dort, wo du ihn gesetzt hast.",
  items: {
    zoom: { label: "Zoom", title: "Zoom, der dem Geschehen folgt", body: "Klicks und Eingaben werden zu weichen Zoom-Clips. Lass Auto dem Cursor folgen oder setze jedes Ziel selbst." },
    zoom3d: { label: "3D-Zoom", title: "Aus einem Zoom wird eine Kamerafahrt", body: "Umkreise die Aufnahme im echten 3D-Raum. Gieren, neigen und mit Tiefe heranfahren, dann sanft zurück." },
    lens: { label: "Lupe", title: "Eine Lupe, kein Zuschnitt", body: "Eine Glaslupe folgt dem Cursor und vergrößert Details, während der Rest des Bildschirms sichtbar bleibt." },
    captions: { label: "Untertitel", title: "Untertitel, die mitlesen", body: "Erzeuge Untertitel aus deiner Stimme und lass jedes Wort beim Sprechen aufleuchten, auf Blur- oder Glas-Hintergrund." },
    keyboard: { label: "Tastendrücke", title: "Jeder Tastendruck wird sichtbar", body: "Ein Kommentar erscheint Buchstabe für Buchstabe und wird mit ⌘ Return gesendet. Wähle MacBook, flache oder erhöhte Tasten." },
    camera: { label: "Kamera", title: "Du, ohne Hintergrund", body: "Entferne den Hintergrund desselben Porträts mit einem Klick. Vergleiche das Original, den Freisteller und die Sticker-Kontur." },
    screenshot: { label: "Screenshot", title: "Screenshots mit Rahmen und Markierungen", body: "Fenster aufnehmen, auf einen Hintergrund setzen und mit Pfeilen, Zählern, Spotlight und Mosaik markieren." },
  },
};

const ja: ShowcaseCopy = {
  toggleZoom: "押して拡大 · 再度押すか離れると縮小",
  replay: "入力を再生",
  removeBackground: "背景を削除",
  sticker: "ステッカー",
  eyebrow: "エディタの中で",
  title: "ひとつのエディタであらゆるカメラワークを",
  captionSample: "書き出しをクリックすれば、すべてのズームが置いた位置にぴったり収まります。",
  items: {
    zoom: { label: "ズーム", title: "操作に追従するズーム", body: "クリックや入力がなめらかなズームクリップになります。Auto でカーソルを追うことも、ターゲットを手動で置くこともできます。" },
    zoom3d: { label: "3D ズーム", title: "ズームをカメラワークに", body: "本物の 3D 空間で録画を周回。ヨー、ピッチ、奥行きのあるプッシュインから、なめらかに戻ります。" },
    lens: { label: "レンズ", title: "切り抜きではなく、拡大鏡", body: "ガラスのルーペがカーソルを追って細部を拡大し、画面の残りはそのまま見えています。" },
    captions: { label: "字幕", title: "読み上げに合わせて光る字幕", body: "音声から字幕を生成し、話した単語から順に光らせます。背景はブラーかガラスを選べます。" },
    keyboard: { label: "キー入力", title: "一つひとつの入力を見せる", body: "コメントを一文字ずつ入力し、⌘ Return で送信。MacBook、フラット、立体のキー表示を切り替えられます。" },
    camera: { label: "カメラ", title: "背景を消して、あなたを残す", body: "同じポートレートの背景をワンクリックで削除。元画像に戻したり、ステッカーの縁取りを追加できます。" },
    screenshot: { label: "スクリーンショット", title: "背景も注釈もつくスクリーンショット", body: "ウィンドウを撮影して背景に配置し、矢印、番号、スポットライト、モザイクで注釈できます。" },
  },
};

const ko: ShowcaseCopy = {
  toggleZoom: "눌러 확대 · 다시 누르거나 벗어나면 축소",
  replay: "입력 다시 재생",
  removeBackground: "배경 제거",
  sticker: "스티커",
  eyebrow: "에디터 안에서",
  title: "하나의 에디터 모든 카메라 무빙",
  captionSample: "내보내기를 누르면 모든 줌이 정확히 놓은 자리에 맞춰집니다.",
  items: {
    zoom: { label: "줌", title: "동작을 따라가는 줌", body: "클릭과 입력이 부드러운 줌 클립이 됩니다. Auto가 커서를 따라가게 하거나 모든 타깃을 직접 배치하세요." },
    zoom3d: { label: "3D 줌", title: "줌을 카메라 무빙으로", body: "실제 3D 공간에서 녹화 화면을 돌아봅니다. 요, 피치, 깊이감 있는 푸시인 후 부드럽게 빠집니다." },
    lens: { label: "렌즈", title: "자르기가 아닌 돋보기", body: "유리 돋보기가 커서를 따라 디테일을 확대하고, 나머지 화면은 그대로 보입니다." },
    captions: { label: "자막", title: "따라 읽는 자막", body: "목소리로 자막을 만들고 말하는 순간 단어가 하나씩 밝아집니다. 블러나 글래스 배경을 고를 수 있습니다." },
    keyboard: { label: "키 입력", title: "모든 키 입력을 선명하게", body: "댓글을 한 글자씩 입력하고 ⌘ Return으로 전송합니다. MacBook, 평면, 입체 키 스타일을 선택하세요." },
    camera: { label: "카메라", title: "배경 없이, 당신만", body: "같은 인물 사진의 배경을 클릭 한 번으로 제거하세요. 원본으로 돌아가거나 스티커 테두리를 더할 수 있습니다." },
    screenshot: { label: "스크린샷", title: "배경과 주석까지 갖춘 스크린샷", body: "창을 캡처해 배경 위에 놓고 화살표, 번호, 스포트라이트, 모자이크로 주석을 다세요." },
  },
};

const es: ShowcaseCopy = {
  toggleZoom: "Pulsa para ampliar · pulsa otra vez o sal para reducir",
  replay: "Repetir escritura",
  removeBackground: "Quitar fondo",
  sticker: "Pegatina",
  eyebrow: "Dentro del editor",
  title: "Un editor Cada movimiento de cámara",
  captionSample: "Pulsa exportar y cada zoom cae justo donde lo colocaste.",
  items: {
    zoom: { label: "Zoom", title: "Zoom que sigue la acción", body: "Los clics y la escritura se convierten en clips de zoom suaves. Deja que Auto siga el cursor o coloca cada objetivo a mano." },
    zoom3d: { label: "Zoom 3D", title: "Convierte un zoom en un movimiento de cámara", body: "Orbita la grabación en un espacio 3D real. Gira, inclina y acércate con profundidad, luego vuelve con suavidad." },
    lens: { label: "Lente", title: "Una lupa, no un recorte", body: "Una lupa de cristal sigue el cursor y amplía el detalle mientras el resto de la pantalla sigue a la vista." },
    captions: { label: "Subtítulos", title: "Subtítulos que leen contigo", body: "Genera subtítulos desde tu voz y haz que cada palabra se ilumine al decirla, sobre fondo desenfocado o de cristal." },
    keyboard: { label: "Teclas", title: "Cada pulsación, a la vista", body: "Mira cómo se escribe un comentario y se envía con ⌘ Return. Prueba teclas MacBook, planas o con relieve." },
    camera: { label: "Cámara", title: "Tú, sin el fondo", body: "Quita el fondo del mismo retrato con un clic. Compara el original, el recorte y el contorno de pegatina." },
    screenshot: { label: "Captura", title: "Capturas con marco y anotaciones", body: "Captura una ventana, colócala sobre un fondo y anótala con flechas, contadores, foco y mosaico." },
  },
};

const fr: ShowcaseCopy = {
  toggleZoom: "Appuyer pour agrandir · rappuyer ou quitter pour réduire",
  replay: "Rejouer la saisie",
  removeBackground: "Retirer le fond",
  sticker: "Autocollant",
  eyebrow: "Dans l'éditeur",
  title: "Un éditeur Tous les mouvements de caméra",
  captionSample: "Cliquez sur exporter et chaque zoom tombe exactement là où vous l'avez placé.",
  items: {
    zoom: { label: "Zoom", title: "Un zoom qui suit l'action", body: "Les clics et la saisie deviennent des clips de zoom fluides. Laissez Auto suivre le curseur ou placez chaque cible à la main." },
    zoom3d: { label: "Zoom 3D", title: "Transformez un zoom en mouvement de caméra", body: "Tournez autour de l'enregistrement dans un vrai espace 3D : lacet, tangage et avancée en profondeur, puis retour en douceur." },
    lens: { label: "Loupe", title: "Une loupe, pas un recadrage", body: "Une loupe de verre suit le curseur et agrandit le détail, le reste de l'écran restant visible." },
    captions: { label: "Sous-titres", title: "Des sous-titres qui suivent la voix", body: "Générez des sous-titres depuis votre voix et faites s'allumer chaque mot au moment où il est dit, sur fond flou ou verre." },
    keyboard: { label: "Touches", title: "Chaque touche devient visible", body: "Un commentaire apparaît lettre par lettre, puis part avec ⌘ Return. Essayez les styles MacBook, plat ou en relief." },
    camera: { label: "Caméra", title: "Vous, sans le fond", body: "Retirez le fond du même portrait en un clic. Comparez l’original, le détourage et le contour autocollant." },
    screenshot: { label: "Capture", title: "Des captures encadrées et annotées", body: "Capturez une fenêtre, posez-la sur un fond et annotez-la avec flèches, compteurs, projecteur et mosaïque." },
  },
};

const ptBR: ShowcaseCopy = {
  toggleZoom: "Pressione para ampliar · pressione novamente ou saia para reduzir",
  replay: "Repetir digitação",
  removeBackground: "Remover fundo",
  sticker: "Adesivo",
  eyebrow: "Dentro do editor",
  title: "Um editor Todo movimento de câmera",
  captionSample: "Clique em exportar e cada zoom cai exatamente onde você colocou.",
  items: {
    zoom: { label: "Zoom", title: "Zoom que acompanha a ação", body: "Cliques e digitação viram clipes de zoom suaves. Deixe o Auto seguir o cursor ou posicione cada alvo à mão." },
    zoom3d: { label: "Zoom 3D", title: "Transforme um zoom em movimento de câmera", body: "Orbite a gravação em um espaço 3D real. Gire, incline e aproxime com profundidade, depois volte com suavidade." },
    lens: { label: "Lente", title: "Uma lupa, não um corte", body: "Uma lupa de vidro segue o cursor e amplia o detalhe enquanto o resto da tela continua visível." },
    captions: { label: "Legendas", title: "Legendas que acompanham a fala", body: "Gere legendas a partir da sua voz e faça cada palavra acender ao ser dita, sobre fundo desfocado ou de vidro." },
    keyboard: { label: "Teclas", title: "Cada tecla fica visível", body: "Veja um comentário ser digitado e enviado com ⌘ Return. Experimente teclas MacBook, planas ou em relevo." },
    camera: { label: "Câmera", title: "Você, sem o fundo", body: "Remova o fundo do mesmo retrato com um clique. Compare o original, o recorte e o contorno de adesivo." },
    screenshot: { label: "Captura", title: "Capturas com moldura e anotações", body: "Capture uma janela, coloque-a sobre um fundo e anote com setas, contadores, holofote e mosaico." },
  },
};

const it: ShowcaseCopy = {
  toggleZoom: "Premi per ingrandire · premi ancora o esci per ridurre",
  replay: "Ripeti digitazione",
  removeBackground: "Rimuovi sfondo",
  sticker: "Adesivo",
  eyebrow: "Dentro l'editor",
  title: "Un editor Ogni movimento di camera",
  captionSample: "Fai clic su esporta e ogni zoom arriva esattamente dove l'hai messo.",
  items: {
    zoom: { label: "Zoom", title: "Uno zoom che segue l'azione", body: "Clic e digitazione diventano clip di zoom fluide. Lascia che Auto segua il cursore o posiziona ogni obiettivo a mano." },
    zoom3d: { label: "Zoom 3D", title: "Trasforma uno zoom in un movimento di camera", body: "Orbita intorno alla registrazione in un vero spazio 3D: imbardata, beccheggio e avvicinamento in profondità, poi ritorno morbido." },
    lens: { label: "Lente", title: "Una lente, non un ritaglio", body: "Una lente di vetro segue il cursore e ingrandisce il dettaglio mentre il resto dello schermo resta visibile." },
    captions: { label: "Sottotitoli", title: "Sottotitoli che seguono la voce", body: "Genera sottotitoli dalla tua voce e fai illuminare ogni parola mentre viene pronunciata, su sfondo sfocato o vetro." },
    keyboard: { label: "Tasti", title: "Ogni tasto diventa visibile", body: "Un commento appare lettera per lettera e viene inviato con ⌘ Return. Prova i tasti MacBook, piatti o in rilievo." },
    camera: { label: "Fotocamera", title: "Tu, senza lo sfondo", body: "Rimuovi lo sfondo dello stesso ritratto con un clic. Confronta originale, ritaglio e contorno adesivo." },
    screenshot: { label: "Screenshot", title: "Screenshot con cornice e annotazioni", body: "Cattura una finestra, mettila su uno sfondo e annotala con frecce, contatori, spotlight e mosaico." },
  },
};

const showcaseCopy: Record<Locale, ShowcaseCopy> = {
  en,
  "zh-Hans": zhHans,
  "zh-Hant": zhHant,
  de,
  ja,
  ko,
  es,
  fr,
  "pt-BR": ptBR,
  it,
};

export function getShowcaseCopy(locale: Locale): ShowcaseCopy {
  return showcaseCopy[locale] ?? en;
}
