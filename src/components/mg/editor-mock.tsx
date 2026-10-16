/**
 * Vector replica of the ScreenCam macOS editor (dark appearance), built from
 * the client's own layout tokens: 48px header, 340px inspector, playback bar
 * and the timeline track palette from TimelineTrackClipPalette.swift.
 * Everything is SVG so it stays sharp at any zoom.
 */

export const EDITOR_W = 1280;
export const EDITOR_H = 800;
export const HEADER_H = 48;
export const INSPECTOR_X = 940;
export const PREVIEW = { x: 0, y: HEADER_H, w: INSPECTOR_X, h: 464 };
export const PLAYBAR_Y = PREVIEW.y + PREVIEW.h;
export const TIMELINE_Y = PLAYBAR_Y + 36;
export const TRACK_X = 104;
export const TRACK_X1 = 1260;
export const TRACK_ROW = 28;

/** Recorded screen inside the preview (preview coordinates). */
export const SCREEN = { x: 100, y: 24, w: 740, h: 416 };
/** Click target ("Publish" button) in recording coordinates. */
export const TARGET = { x: 675, y: 365 };

export const SYSTEM_FONT = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Geist', 'PingFang SC', sans-serif";
export const MONO_FONT = "'SF Mono', 'Geist Mono', ui-monospace, monospace";

const C = {
  window: "#1c1c1e",
  panel: "#1f1f21",
  line: "rgba(255,255,255,0.08)",
  text: "rgba(255,255,255,0.88)",
  dim: "rgba(255,255,255,0.5)",
  faint: "rgba(255,255,255,0.28)",
  control: "rgba(255,255,255,0.08)",
};

/* Timeline palette, straight from TimelineTrackClipPalette.swift */
export const PALETTE = {
  recording: { fill: "#C7C7C7", fillOpacity: 0.23, border: "#A5A5A5" },
  camera: { fill: "#00C7D6", fillOpacity: 0.22, border: "#00C7D6" },
  keyboard: { fill: "#FF3E6E", fillOpacity: 0.23, border: "#FF2B75" },
  systemAudio: { fill: "#00A645", fillOpacity: 0.18, border: "#00A645" },
  microphone: { fill: "#42DC82", fillOpacity: 0.18, border: "#5ADF92" },
  zoom: { fill: "#FFA617", fillOpacity: 0.24, border: "#FFA617" },
  captions: { fill: "#0FB7D0", fillOpacity: 0.24, border: "#45DDF0" },
};

type ClipKind = keyof typeof PALETTE;

function Clip({
  kind,
  x,
  w,
  row,
  label,
  className,
  active = false,
}: {
  kind: ClipKind;
  x: number;
  w: number;
  row: number;
  label?: string;
  className?: string;
  active?: boolean;
}) {
  const p = PALETTE[kind];
  const y = TIMELINE_Y + 32 + row * TRACK_ROW + 4;
  return (
    <g className={className}>
      <rect x={x} y={y} width={w} height={20} rx={6.5} fill={p.fill} fillOpacity={p.fillOpacity} stroke={p.border} strokeOpacity={active ? 1 : 0.75} strokeWidth={active ? 1.5 : 1} />
      {label && (
        <text x={x + w / 2} y={y + 13.5} textAnchor="middle" fontSize="9.5" fontWeight="600" fill="rgba(255,255,255,0.86)" fontFamily={SYSTEM_FONT}>
          {label}
        </text>
      )}
    </g>
  );
}

function Waveform({ x, w, row, color, seed }: { x: number; w: number; row: number; color: string; seed: number }) {
  const y = TIMELINE_Y + 32 + row * TRACK_ROW + 14;
  const bars = [];
  for (let i = 0; i < Math.floor(w / 4); i += 1) {
    const h = 2 + Math.abs(Math.sin(i * 0.37 + seed) * Math.cos(i * 0.11 + seed * 2)) * 7;
    bars.push(<line key={i} x1={x + 4 + i * 4} y1={y - h} x2={x + 4 + i * 4} y2={y + h} />);
  }
  return (
    <g stroke={color} strokeOpacity="0.9" strokeWidth="1.6" strokeLinecap="round">
      {bars}
    </g>
  );
}

/** A macOS-style switch. */
export function Toggle({ x, y, on = true }: { x: number; y: number; on?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width="30" height="18" rx="9" fill={on ? "var(--mg-accent)" : "rgba(255,255,255,0.16)"} />
      <circle cx={on ? x + 21 : x + 9} cy={y + 9} r="7.5" fill="#fff" />
    </g>
  );
}

/** ScreenCam's TraceSlider: filled part + tick bars + thumb. */
export function TraceSlider({ x, y, w, value, className }: { x: number; y: number; w: number; value: number; className?: string }) {
  const ticks = [];
  for (let i = 0; i < w / 4; i += 1) ticks.push(<line key={i} x1={x + i * 4} y1={y - 5} x2={x + i * 4} y2={y + 5} />);
  return (
    <g className={className}>
      <g stroke="rgba(255,255,255,0.12)" strokeWidth="2">{ticks}</g>
      <rect className="ts-fill" x={x} y={y - 7} width={w * value} height="14" rx="3" fill="var(--mg-accent)" fillOpacity="0.75" />
      <rect className="ts-thumb" x={x + w * value - 3} y={y - 9} width="6" height="18" rx="2" fill="var(--mg-accent)" />
    </g>
  );
}

function Segmented({ x, y, w, items, selected, className }: { x: number; y: number; w: number; items: string[]; selected: number; className?: string }) {
  const seg = w / items.length;
  return (
    <g className={className}>
      <rect x={x} y={y} width={w} height="24" rx="7" fill={C.control} />
      <rect className="seg-thumb" x={x + 2 + seg * selected} y={y + 2} width={seg - 4} height="20" rx="5.5" fill="rgba(255,255,255,0.16)" />
      {items.map((item, i) => (
        <text key={item} x={x + seg * i + seg / 2} y={y + 16} textAnchor="middle" fontSize="11" fontWeight="500" fill={C.text} fontFamily={SYSTEM_FONT}>
          {item}
        </text>
      ))}
    </g>
  );
}

function Row({ y, label, value, valueClass }: { y: number; label: string; value?: string; valueClass?: string }) {
  return (
    <g>
      <text x={INSPECTOR_X + 18} y={y} fontSize="11.5" fill={C.dim} fontFamily={SYSTEM_FONT}>{label}</text>
      {value && (
        <text className={valueClass} x={EDITOR_W - 18} y={y} textAnchor="end" fontSize="11.5" fontWeight="600" fill={C.text} fontFamily={SYSTEM_FONT}>
          {value}
        </text>
      )}
    </g>
  );
}

function PanelTitle({ y, title, icon }: { y: number; title: string; icon: React.ReactNode }) {
  return (
    <g>
      <g transform={`translate(${INSPECTOR_X + 18} ${y - 12})`} stroke="var(--mg-accent)" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {icon}
      </g>
      <text x={INSPECTOR_X + 42} y={y} fontSize="13" fontWeight="600" fill={C.text} fontFamily={SYSTEM_FONT}>{title}</text>
      <path d={`M${EDITOR_W - 26} ${y - 8} l8 8 m0 -8 l-8 8`} stroke={C.dim} strokeWidth="1.4" strokeLinecap="round" />
    </g>
  );
}

export function EditorChrome({ captionClips = ["Click export…", "every zoom…", "lands."] }: { captionClips?: string[] }) {
  const trackLabels = ["Recording", "Camera", "Keyboard", "System Audio", "Microphone", "Zoom", "Captions"];
  const rulerTicks = [];
  for (let i = 0; i <= 58; i += 1) {
    const x = TRACK_X + i * 20;
    rulerTicks.push(<line key={i} x1={x} y1={TIMELINE_Y + 22} x2={x} y2={TIMELINE_Y + (i % 5 === 0 ? 12 : 17)} />);
  }

  return (
    <g fontFamily={SYSTEM_FONT}>
      {/* window */}
      <rect x="0.5" y="0.5" width={EDITOR_W - 1} height={EDITOR_H - 1} rx="14" fill={C.window} stroke="rgba(255,255,255,0.14)" />

      {/* header */}
      <line x1="0" y1={HEADER_H} x2={EDITOR_W} y2={HEADER_H} stroke={C.line} />
      <circle cx="22" cy="24" r="6" fill="#ff5f57" />
      <circle cx="42" cy="24" r="6" fill="#febc2e" />
      <circle cx="62" cy="24" r="6" fill="#28c840" />
      <g stroke={C.dim} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M92 20 h9 a5 5 0 0 1 0 10 h-4 M92 20 l3 -3 M92 20 l3 3" />
        <path d="M128 20 h-9 a5 5 0 0 0 0 10 h4 M128 20 l-3 -3 M128 20 l-3 3" />
      </g>
      <text x="146" y="28" fontSize="12" fill={C.dim}>demo3 — 01:05 — 4,318×2,600</text>
      <g stroke={C.dim} strokeWidth="1.4" fill="none">
        <rect x="560" y="17" width="16" height="12" rx="2.5" />
        <path d="M624 16 v12 h12 M620 20 h12 v12" strokeLinecap="round" />
      </g>
      <text x="582" y="28" fontSize="12" fill={C.text}>16:9</text>
      <text x="640" y="28" fontSize="12" fill={C.text}>Crop</text>
      <g stroke={C.dim} strokeWidth="1.4" fill="none" strokeLinecap="round">
        <path d="M1104 19 h12 M1104 24 h12 M1104 29 h12" />
      </g>
      <text x="1122" y="28" fontSize="12" fill={C.text}>Presets</text>
      <rect x="1184" y="12" width="82" height="24" rx="7" fill="var(--mg-accent)" />
      <path d="M1198 26 v-8 m0 0 l-3 3 m3 -3 l3 3 M1194 24 v4 h8 v-4" stroke="#fff" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <text x="1212" y="28.5" fontSize="12" fontWeight="600" fill="#fff">Export</text>

      {/* inspector */}
      <rect x={INSPECTOR_X} y={HEADER_H} width={EDITOR_W - INSPECTOR_X} height={PREVIEW.h} fill={C.panel} />
      <line x1={INSPECTOR_X} y1={HEADER_H} x2={INSPECTOR_X} y2={PLAYBAR_Y} stroke={C.line} />

      {/* playback bar */}
      <line x1="0" y1={PLAYBAR_Y} x2={EDITOR_W} y2={PLAYBAR_Y} stroke={C.line} />
      <text className="ed-time" x="20" y={PLAYBAR_Y + 23} fontSize="12" fontWeight="600" fill="var(--mg-accent)" fontFamily={MONO_FONT}>00:12 / 01:06</text>
      <text x="124" y={PLAYBAR_Y + 23} fontSize="11.5" fill={C.dim}>×1</text>
      <g stroke={C.text} strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="604" cy={PLAYBAR_Y + 18} r="8" stroke={C.dim} />
        <circle cx="676" cy={PLAYBAR_Y + 18} r="8" stroke={C.dim} />
      </g>
      <circle cx="640" cy={PLAYBAR_Y + 18} r="12" fill="rgba(255,255,255,0.1)" />
      <path d={`M636 ${PLAYBAR_Y + 12} l9 6 l-9 6 z`} fill={C.text} />
      <rect x="1050" y={PLAYBAR_Y + 15} width="70" height="6" rx="3" fill="rgba(255,255,255,0.1)" />
      <rect x="1050" y={PLAYBAR_Y + 15} width="48" height="6" rx="3" fill="#30d158" />
      <text x="1260" y={PLAYBAR_Y + 23} textAnchor="end" fontSize="11.5" fill={C.dim}>100%</text>
      <line x1="0" y1={TIMELINE_Y} x2={EDITOR_W} y2={TIMELINE_Y} stroke={C.line} />

      {/* ruler */}
      <g stroke="rgba(255,255,255,0.22)" strokeWidth="1">{rulerTicks}</g>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <text key={i} x={TRACK_X + i * 200 + 4} y={TIMELINE_Y + 11} fontSize="9" fill={C.faint} fontFamily={MONO_FONT}>{`00:${String(i * 10).padStart(2, "0")}`}</text>
      ))}

      {/* track labels */}
      {trackLabels.map((label, row) => (
        <text key={label} className={`ed-label ed-label-${row}`} x="16" y={TIMELINE_Y + 32 + row * TRACK_ROW + 18} fontSize="10.5" fill={C.dim}>
          {label}
        </text>
      ))}

      {/* clips */}
      <Clip kind="recording" x={TRACK_X} w={1150} row={0} label="Recording · 1.00x" />
      <Clip kind="camera" x={TRACK_X} w={1150} row={1} label="Camera" />
      <Clip kind="keyboard" x={330} w={46} row={2} label="⌘ K" />
      <Clip kind="keyboard" x={382} w={52} row={2} label="4 keys" />
      <Clip kind="keyboard" x={870} w={52} row={2} label="6 keys" />
      <rect x={TRACK_X} y={TIMELINE_Y + 32 + 3 * TRACK_ROW + 4} width="1150" height="20" rx="6.5" fill={PALETTE.systemAudio.fill} fillOpacity={PALETTE.systemAudio.fillOpacity} stroke={PALETTE.systemAudio.border} strokeOpacity="0.8" />
      <Waveform x={TRACK_X} w={1150} row={3} color={PALETTE.systemAudio.border} seed={1} />
      <rect x={TRACK_X} y={TIMELINE_Y + 32 + 4 * TRACK_ROW + 4} width="1150" height="20" rx="6.5" fill={PALETTE.microphone.fill} fillOpacity={PALETTE.microphone.fillOpacity} stroke={PALETTE.microphone.border} strokeOpacity="0.65" />
      <Waveform x={TRACK_X} w={1150} row={4} color={PALETTE.microphone.border} seed={4} />

      <Clip className="ed-zoom-0" kind="zoom" x={210} w={210} row={5} label="×2.0" />
      <Clip className="ed-zoom-1" kind="zoom" x={470} w={200} row={5} label="3D" />
      <Clip className="ed-zoom-2" kind="zoom" x={720} w={190} row={5} label="Lens" />

      <g className="ed-captions">
        <Clip kind="captions" x={930} w={120} row={6} label={captionClips[0]} />
        <Clip kind="captions" x={1056} w={110} row={6} label={captionClips[1]} />
        <Clip kind="captions" x={1172} w={86} row={6} label={captionClips[2]} />
      </g>

      {/* playhead */}
      <g className="ed-playhead">
        <line x1="0" y1={TIMELINE_Y + 4} x2="0" y2={EDITOR_H - 8} stroke="var(--mg-accent)" strokeWidth="1.5" />
        <rect x="-22" y={TIMELINE_Y + 2} width="44" height="16" rx="5" fill="var(--mg-accent)" />
        <text className="ed-playhead-label" x="0" y={TIMELINE_Y + 13.5} textAnchor="middle" fontSize="9.5" fontWeight="600" fill="#fff" fontFamily={MONO_FONT}>00:12</text>
      </g>
    </g>
  );
}

const ICONS = {
  zoom: <><circle cx="6" cy="6" r="5" /><path d="M10 10 l4 4" /></>,
  captions: <><rect x="0" y="1" width="15" height="11" rx="3" /><path d="M3.5 6 h4 M9.5 6 h2 M3.5 9 h2 M7.5 9 h4" /></>,
};

/** Inspector panel for the camera clip: one panel for 2D / 3D / Lens modes. */
export function ZoomInspector() {
  const x = INSPECTOR_X;
  return (
    <g className="insp-zoom" fontFamily={SYSTEM_FONT}>
      <PanelTitle y={80} title="Zoom" icon={ICONS.zoom} />
      <Row y={118} label="Enable" />
      <Toggle x={EDITOR_W - 48} y={105} />
      <text x={x + 18} y={156} fontSize="12" fontWeight="600" fill={C.text}>Clip Settings</text>
      <Row y={188} label="Camera" />
      <Segmented className="seg-mode" x={x + 118} y={172} w={204} items={["2D", "3D", "Lens"]} selected={0} />
      <Row y={224} label="Follow Mode" />
      <Segmented x={x + 158} y={208} w={164} items={["Auto", "Manual"]} selected={0} />

      {/* 2D rows */}
      <g className="rows-2d">
        <Row y={262} label="Move Speed" value="50%" />
        <TraceSlider x={x + 18} y={282} w={304} value={0.5} />
        <Row y={318} label="Zoom" value="1.00x" valueClass="val-zoom" />
        <TraceSlider className="slider-zoom" x={x + 18} y={338} w={304} value={0.2} />
        <Row y={374} label="Motion Blur" />
        <Toggle x={EDITOR_W - 48} y={361} />
      </g>

      {/* 3D rows */}
      <g className="rows-3d" opacity="0">
        <Row y={262} label="Orbit" value="-24° / 10°" valueClass="val-orbit" />
        <g>
          <rect x={x + 18} y={272} width="304" height="96" rx="8" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" />
          <g stroke="rgba(255,255,255,0.08)">
            {[1, 2, 3].map((i) => <line key={`v${i}`} x1={x + 18 + i * 76} y1={272} x2={x + 18 + i * 76} y2={368} />)}
            {[1, 2].map((i) => <line key={`h${i}`} x1={x + 18} y1={272 + i * 32} x2={x + 322} y2={272 + i * 32} />)}
          </g>
          <line x1={x + 170} y1={272} x2={x + 170} y2={368} stroke="rgba(255,255,255,0.2)" />
          <line x1={x + 18} y1={320} x2={x + 322} y2={320} stroke="rgba(255,255,255,0.2)" />
          <circle className="pad-dot" cx={x + 170} cy={320} r="7" fill="var(--mg-accent)" stroke="#fff" strokeWidth="2" />
        </g>
        <Row y={396} label="Distance" value="1.35x" />
        <TraceSlider x={x + 18} y={416} w={304} value={0.55} />
      </g>

      {/* Lens rows */}
      <g className="rows-lens" opacity="0">
        <Row y={262} label="Magnification" value="2.0x" />
        <TraceSlider x={x + 18} y={282} w={304} value={0.5} />
        <Row y={318} label="Lens Size" value="32%" />
        <TraceSlider x={x + 18} y={338} w={304} value={0.32} />
        <Row y={374} label="Refraction" />
        <Toggle x={EDITOR_W - 48} y={361} />
      </g>
    </g>
  );
}

export function CaptionsInspector() {
  const x = INSPECTOR_X;
  return (
    <g className="insp-captions" opacity="0" fontFamily={SYSTEM_FONT}>
      <PanelTitle y={80} title="Captions" icon={ICONS.captions} />
      <Row y={118} label="Provider" />
      <rect x={EDITOR_W - 140} y={104} width="122" height="22" rx="6" fill={C.control} />
      <text x={EDITOR_W - 130} y={119} fontSize="11.5" fill={C.text}>OpenAI</text>
      <path d={`M${EDITOR_W - 32} 112 l4 4 l4 -4`} stroke={C.dim} strokeWidth="1.4" fill="none" />
      <Row y={150} label="Language" />
      <rect x={EDITOR_W - 140} y={136} width="122" height="22" rx="6" fill={C.control} />
      <text x={EDITOR_W - 130} y={151} fontSize="11.5" fill={C.text}>Auto Detect</text>
      <rect x={x + 18} y={172} width="304" height="30" rx="8" fill="var(--mg-accent)" />
      <text x={x + 170} y={191} textAnchor="middle" fontSize="12" fontWeight="600" fill="#fff">Generate Captions</text>
      <text x={x + 18} y={234} fontSize="12" fontWeight="600" fill={C.text}>Read Along</text>
      <Toggle x={EDITOR_W - 48} y={221} />
      <Row y={266} label="Unread Opacity" value="35%" />
      <TraceSlider x={x + 18} y={286} w={304} value={0.35} />
      <text x={x + 18} y={326} fontSize="12" fontWeight="600" fill={C.text}>Background</text>
      <Segmented x={x + 18} y={338} w={304} items={["None", "Blur", "Glass"]} selected={2} />
      <Row y={392} label="Corner Radius" value="14" />
      <TraceSlider x={x + 18} y={412} w={304} value={0.46} />
    </g>
  );
}

/**
 * The app being recorded: a light macOS window with real text so the lens
 * and zoom can show off vector sharpness. viewBox 740 × 416.
 */
export function RecordedApp({ idPrefix = "ra" }: { idPrefix?: string }) {
  const g1 = `${idPrefix}-g1`;
  const g2 = `${idPrefix}-g2`;
  const g3 = `${idPrefix}-g3`;
  const sidebar = ["Inbox", "Projects", "Launch Plan", "Design", "Reviews", "Archive"];
  const cards: Array<[string, string, string]> = [
    ["Hero video", "In review", g1],
    ["Pricing page", "Draft", g2],
    ["Docs refresh", "Done", g3],
  ];
  const tasks: Array<[string, boolean]> = [
    ["Record walkthrough", true],
    ["Add captions", true],
    ["Export in 4K", false],
    ["Publish release", false],
  ];
  const bars = [38, 52, 44, 70, 62, 86, 78, 96];

  return (
    <g fontFamily={SYSTEM_FONT}>
      <defs>
        <linearGradient id={g1} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#7c5cff" /><stop offset="1" stopColor="#ff6ab0" /></linearGradient>
        <linearGradient id={g2} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffb347" /><stop offset="1" stopColor="#ff5e3a" /></linearGradient>
        <linearGradient id={g3} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#34c3ff" /><stop offset="1" stopColor="#2dd4a0" /></linearGradient>
      </defs>
      <rect width="740" height="416" rx="10" fill="#fbfbfd" />
      {/* titlebar */}
      <circle cx="16" cy="15" r="5" fill="#ff5f57" />
      <circle cx="32" cy="15" r="5" fill="#febc2e" />
      <circle cx="48" cy="15" r="5" fill="#28c840" />
      <text x="370" y="19" textAnchor="middle" fontSize="11" fontWeight="600" fill="#3a3a3c">Launch Plan</text>
      <line x1="0" y1="30" x2="740" y2="30" stroke="#e5e5ea" />
      {/* sidebar */}
      <rect x="0" y="30" width="150" height="386" fill="#f2f2f5" />
      <path d="M0 30 h150 v386 h-140 a10 10 0 0 1 -10 -10 z" fill="#f2f2f5" />
      {sidebar.map((item, i) => {
        const y = 56 + i * 26;
        const selected = i === 2;
        return (
          <g key={item}>
            {selected && <rect x="8" y={y - 13} width="134" height="22" rx="6" fill="#0a84ff" />}
            <rect x="18" y={y - 7} width="11" height="11" rx="3" fill={selected ? "#fff" : "#8e8e93"} fillOpacity={selected ? 0.9 : 0.5} />
            <text x="36" y={y + 2} fontSize="11.5" fontWeight={selected ? 600 : 400} fill={selected ? "#fff" : "#3a3a3c"}>{item}</text>
          </g>
        );
      })}
      {/* main */}
      <text x="172" y="66" fontSize="21" fontWeight="700" fill="#1c1c1e" letterSpacing="-0.4">Q3 Launch Plan</text>
      <text x="172" y="86" fontSize="11" fill="#8e8e93">Updated 2 min ago · 6 tasks · 3 people</text>
      {cards.map(([title, status, gradient], i) => {
        const x = 172 + i * 184;
        return (
          <g key={title}>
            <rect x={x} y="102" width="172" height="104" rx="10" fill="#fff" stroke="#e5e5ea" />
            <rect x={x + 6} y="108" width="160" height="56" rx="7" fill={`url(#${gradient})`} />
            <text x={x + 10} y="182" fontSize="11.5" fontWeight="600" fill="#1c1c1e">{title}</text>
            <rect x={x + 10} y="190" width={status.length * 5.6 + 12} height="12" rx="6" fill="#0a84ff" fillOpacity="0.12" />
            <text x={x + 16} y="199" fontSize="8.5" fontWeight="600" fill="#0a84ff">{status}</text>
          </g>
        );
      })}
      {/* chart */}
      <rect x="172" y="222" width="356" height="120" rx="10" fill="#fff" stroke="#e5e5ea" />
      <text x="186" y="242" fontSize="11.5" fontWeight="600" fill="#1c1c1e">Weekly signups</text>
      <text x="514" y="242" textAnchor="end" fontSize="11" fontWeight="600" fill="#30a14e">+24%</text>
      {bars.map((h, i) => (
        <rect key={i} x={190 + i * 41} y={330 - h * 0.8} width="26" height={h * 0.8} rx="4" fill={i === bars.length - 1 ? "#0a84ff" : "#d1d1d6"} />
      ))}
      {/* checklist */}
      <rect x="540" y="222" width="180" height="120" rx="10" fill="#fff" stroke="#e5e5ea" />
      {tasks.map(([task, done], i) => {
        const y = 246 + i * 24;
        return (
          <g key={task}>
            <rect x="552" y={y - 9} width="12" height="12" rx="3.5" fill={done ? "#0a84ff" : "#fff"} stroke={done ? "#0a84ff" : "#c7c7cc"} />
            {done && <path d={`M555 ${y - 3} l2.5 2.5 l4.5 -5`} stroke="#fff" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />}
            <text x="572" y={y + 1} fontSize="11" fill={done ? "#8e8e93" : "#1c1c1e"} textDecoration={done ? "line-through" : undefined}>{task}</text>
          </g>
        );
      })}
      {/* actions */}
      <rect x="532" y="350" width="88" height="30" rx="8" fill="#fff" stroke="#d1d1d6" />
      <text x="576" y="369" textAnchor="middle" fontSize="11.5" fontWeight="500" fill="#1c1c1e">Preview</text>
      <rect x="630" y="350" width="90" height="30" rx="8" fill="#0a84ff" />
      <text x="675" y="369" textAnchor="middle" fontSize="11.5" fontWeight="600" fill="#fff">Publish</text>
    </g>
  );
}

/** The arrow cursor, tip at (0,0). */
export function CursorArrow({ scale = 1 }: { scale?: number }) {
  return (
    <path
      transform={`scale(${scale})`}
      d="M0 0 L0 17 L4.2 12.8 L7.2 19.4 L10 18.2 L7.1 11.8 L13 11.8 Z"
      fill="#111"
      stroke="#fff"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
  );
}
