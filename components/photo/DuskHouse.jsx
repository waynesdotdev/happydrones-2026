/* The front of a house, from the pavement corner, at any time from early
   afternoon (t = 0) through sunset (t ≈ 0.5) to blue hour (t = 1), when
   the dusk shot is taken: sky deepening, windows glowing, lights on. */
import { useId } from "react";

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mixc = (a, b, k) => { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * k)).join(",")})`; };
// three-stop colour: day -> sunset -> blue hour
const tri = (t, day, sun, blue) => (t < 0.5 ? mixc(day, sun, t / 0.5) : mixc(sun, blue, (t - 0.5) / 0.5));
const clamp = (v) => Math.max(0, Math.min(1, v));

export default function DuskHouse({ t = 0, label }) {
  const gid = `dh${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const glow = clamp((t - 0.45) / 0.4);      // interior lights showing
  const dark = clamp((t - 0.3) / 0.7) * 0.55; // how much the outside falls into shadow
  const skyTop = tri(t, "#6FA6DC", "#5E7FB8", "#16255A");
  const skyBot = tri(t, "#D5E8F6", "#F6B26B", "#C9785A");
  const sunY = 70 + t * 260;
  const win = (x, y, w, h) => (
    <g key={`${x}${y}`}>
      <rect x={x - 5} y={y - 5} width={w + 10} height={h + 10} fill={mixc("#F2F6FB", "#C9D3E0", t)} />
      <rect x={x} y={y} width={w} height={h} fill={mixc("#9CC3E6", "#3A4E78", Math.min(1, t * 1.4))} />
      <rect x={x} y={y} width={w} height={h} fill="#FFD27A" opacity={glow * 0.95} />
      {glow > 0 && <rect x={x - 30} y={y - 30} width={w + 60} height={h + 60} rx="30" fill="#FFC86B" opacity={glow * 0.35} filter={`url(#${gid}-b)`} />}
      <line x1={x + w / 2} x2={x + w / 2} y1={y} y2={y + h} stroke={mixc("#F2F6FB", "#C9D3E0", t)} strokeWidth="4" />
    </g>
  );
  return (
    <svg viewBox="0 0 800 520" role="img" aria-label={label || "Illustration of the front of a house"}>
      <defs>
        <linearGradient id={`${gid}-sky`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={skyTop} /><stop offset="1" stopColor={skyBot} /></linearGradient>
        <filter id={`${gid}-b`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14" /></filter>
        <radialGradient id={`${gid}-lamp`}><stop offset="0" stopColor="#FFD98A" stopOpacity="0.85" /><stop offset="1" stopColor="#FFD98A" stopOpacity="0" /></radialGradient>
      </defs>
      <rect width="800" height="520" fill={`url(#${gid}-sky)`} />
      {/* sun sinking behind the house */}
      <circle cx="660" cy={sunY} r="34" fill={tri(t, "#FFF6D8", "#FFC15E", "#E07A4F")} opacity={1 - clamp((t - 0.6) / 0.25)} />
      {/* stars at blue hour */}
      {t > 0.8 && [[80, 50], [180, 90], [300, 40], [520, 70], [720, 120], [620, 30]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="1.6" fill="#FFFFFF" opacity={(t - 0.8) * 4} />)}
      {/* distant rooftops */}
      <path d="M0 300 L60 270 L120 300 L120 290 L190 260 L240 290 V330 H0Z" fill={mixc("#7E92AE", "#1E2A4A", t)} />
      <path d="M600 330 V285 L660 255 L720 285 L780 262 L800 272 V330Z" fill={mixc("#7E92AE", "#1E2A4A", t)} />
      {/* garage */}
      <rect x="560" y="300" width="150" height="130" fill={mixc("#B9775A", "#5A3E3A", t)} />
      <polygon points="550,300 720,300 690,270 580,270" fill={mixc("#4F5D73", "#232B3D", t)} />
      <rect x="580" y="330" width="110" height="100" fill={mixc("#E8ECF5", "#8E99A8", t)} />
      {[350, 370, 390, 410].map((y) => <line key={y} x1="580" x2="690" y1={y} y2={y} stroke="rgba(0,0,0,0.12)" strokeWidth="2" />)}
      {/* house */}
      <rect x="170" y="190" width="390" height="240" fill={mixc("#C0805F", "#5E4038", t)} />
      {[214, 238, 262, 286, 310, 334, 358, 382, 406].map((y) => <line key={y} x1="170" x2="560" y1={y} y2={y} stroke="rgba(60,30,20,0.12)" strokeWidth="1.5" />)}
      <polygon points="150,192 580,192 500,96 230,96" fill={mixc("#4F5D73", "#1F2737", t)} />
      <rect x="440" y="62" width="34" height="54" fill={mixc("#8E5A46", "#45302A", t)} />
      <rect x="436" y="58" width="42" height="8" fill={mixc("#5A3A2F", "#2A1E1A", t)} />
      <line x1="150" y1="194" x2="580" y2="194" stroke={mixc("#F2F6FB", "#8E99A8", t)} strokeWidth="6" />
      {win(205, 220, 96, 70)}{win(420, 220, 96, 70)}{win(205, 330, 96, 74)}{win(420, 330, 96, 74)}
      {/* door + porch light */}
      <rect x="326" y="322" width="70" height="108" fill={mixc("#003366", "#0B1B33", t)} />
      <rect x="338" y="334" width="46" height="26" fill="#FFD27A" opacity={0.2 + glow * 0.8} />
      <polygon points="312,316 410,316 400,300 322,300" fill={mixc("#E8ECF5", "#8E99A8", t)} />
      {glow > 0 && <circle cx="414" cy="340" r="60" fill={`url(#${gid}-lamp)`} opacity={glow} />}
      <rect x="408" y="332" width="10" height="16" rx="2" fill={glow > 0.1 ? "#FFE3A6" : "#2F3747"} />
      {/* ground */}
      <rect x="0" y="430" width="800" height="90" fill={mixc("#5E9A5A", "#1E3A2A", t)} />
      <polygon points="300,430 420,430 470,520 250,520" fill={mixc("#B7AFA3", "#4A4A52", t)} />
      <polygon points="560,430 710,430 800,520 600,520" fill={mixc("#8E8E96", "#3A3C46", t)} />
      {/* garden lights along the path */}
      {[[292, 470], [452, 470], [280, 506], [466, 506]].map(([x, y]) => <g key={x + y}>
        {glow > 0 && <circle cx={x} cy={y} r="26" fill={`url(#${gid}-lamp)`} opacity={glow} />}
        <rect x={x - 3} y={y - 14} width="6" height="14" fill={glow > 0.1 ? "#FFE3A6" : "#2F3747"} />
      </g>)}
      {/* tree */}
      <rect x="86" y="340" width="12" height="92" fill={mixc("#5A4636", "#231A14", t)} />
      <circle cx="92" cy="320" r="54" fill={mixc("#3F7A52", "#16301F", t)} />
      <circle cx="66" cy="350" r="34" fill={mixc("#4A8A5E", "#1A3824", t)} />
      {/* outdoor shading */}
      <rect width="800" height="520" fill="#0A1430" opacity={dark * 0.35} />
    </svg>
  );
}
