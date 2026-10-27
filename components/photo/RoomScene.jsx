/* An illustrated room in one-point perspective, used across the property
   photography page. Everything is switchable so the same drawing can show a
   room before and after prep, or with one exposure versus a blend.

   room:     "living" | "kitchen" | "bedroom" | "bath"
   expo:     "blend" (room and window both right) | "room" (window blown out)
             | "mid" | "window" (window right, room too dark)
   lights:   true/false
   curtains: "open" | "closed"
   mess:     list of clutter to show: "surfaces", "cushions", "toys", "laundry" */
import { useId } from "react";

const BW = { x0: 230, x1: 570, y0: 120, y1: 340 }; // back wall
const k = (u) => 1 - 0.577 * u;                       // size at depth u (0 = front, 1 = back wall)
const fl = (u, s) => [400 + s * (400 - 170 * u), 520 - 180 * u]; // floor point: depth u, side s (-1..1)
const lw = (u, v) => [230 * u, 120 * u + v * (520 - 180 * u - 120 * u)];       // left wall
const rw = (u, v) => [800 - 230 * u, 120 * u + v * (520 - 180 * u - 120 * u)]; // right wall
const pts = (arr) => arr.map((p) => p.join(",")).join(" ");
const up = ([x, y], h) => [x, y - h];

// a box standing on the floor: front face + top face, footprint from depth u0 (front) to u1 (back), sides s0..s1
function FloorBox({ u0, u1, s0, s1, h, front, top, side }) {
  const a = fl(u0, s0), b = fl(u0, s1), c = fl(u1, s1), d = fl(u1, s0);
  const ha = h * k(u0), hc = h * k(u1);
  const showRight = s1 < 0, showLeft = s0 > 0;
  return (
    <g>
      {showRight && <polygon points={pts([b, c, up(c, hc), up(b, ha)])} fill={side} />}
      {showLeft && <polygon points={pts([a, d, up(d, hc), up(a, ha)])} fill={side} />}
      <polygon points={pts([up(a, ha), up(b, ha), up(c, hc), up(d, hc)])} fill={top} />
      <polygon points={pts([a, b, up(b, ha), up(a, ha)])} fill={front} />
    </g>
  );
}

function Window({ x, y, w, h, gid, expo, curtains, frosted }) {
  const blown = expo === "room" || expo === "mid";
  return (
    <g>
      <rect x={x - 6} y={y - 6} width={w + 12} height={h + 12} fill="#FFFFFF" />
      {frosted ? <rect x={x} y={y} width={w} height={h} fill="#DCE8F2" />
        : <g>
            <rect x={x} y={y} width={w} height={h} fill={`url(#${gid}-sky)`} />
            <path d={`M${x} ${y + h * 0.72} Q${x + w * 0.3} ${y + h * 0.52} ${x + w * 0.6} ${y + h * 0.66} T${x + w} ${y + h * 0.6} V${y + h} H${x}Z`} fill="#6E9E64" />
            <path d={`M${x} ${y + h * 0.86} Q${x + w * 0.5} ${y + h * 0.74} ${x + w} ${y + h * 0.84} V${y + h} H${x}Z`} fill="#4F8150" />
            <circle cx={x + w * 0.75} cy={y + h * 0.5} r={h * 0.16} fill="#3F7146" />
            <rect x={x + w * 0.74} y={y + h * 0.6} width="3" height={h * 0.2} fill="#5A4636" />
          </g>}
      {blown && <rect x={x} y={y} width={w} height={h} fill="#FFFFFF" opacity={expo === "room" ? 0.97 : 0.7} />}
      {blown && <rect x={x - 26} y={y - 26} width={w + 52} height={h + 52} rx="30" fill="#FFFFFF" opacity={expo === "room" ? 0.55 : 0.3} filter={`url(#${gid}-bloom)`} />}
      <line x1={x + w / 2} x2={x + w / 2} y1={y} y2={y + h} stroke="#FFFFFF" strokeWidth="5" />
      <line x1={x} x2={x + w} y1={y + h * 0.38} y2={y + h * 0.38} stroke="#FFFFFF" strokeWidth="4" />
      {curtains && (curtains === "closed"
        ? <g><rect x={x - 14} y={y - 14} width={w / 2 + 16} height={h + 40} fill="#7C8FAE" /><rect x={x + w / 2 - 2} y={y - 14} width={w / 2 + 16} height={h + 40} fill="#71849F" />
            {[0.15, 0.3, 0.6, 0.75, 0.9].map((f) => <line key={f} x1={x - 14 + (w + 28) * f} x2={x - 14 + (w + 28) * f} y1={y - 14} y2={y + h + 26} stroke="rgba(0,0,0,0.12)" strokeWidth="3" />)}</g>
        : <g><rect x={x - 34} y={y - 14} width="28" height={h + 40} fill="#7C8FAE" /><rect x={x + w + 6} y={y - 14} width="28" height={h + 40} fill="#71849F" /></g>)}
      {curtains && <rect x={x - 40} y={y - 20} width={w + 80} height="6" rx="3" fill="#5A6378" />}
    </g>
  );
}

function Lamp({ x, y, on, gid, small }) {
  const r = small ? 14 : 20;
  return (
    <g>
      {on && <circle cx={x} cy={y} r={small ? 70 : 110} fill={`url(#${gid}-glow)`} />}
      <polygon points={`${x - r},${y - r * 0.6} ${x + r},${y - r * 0.6} ${x + r * 1.3},${y + r * 0.6} ${x - r * 1.3},${y + r * 0.6}`} fill={on ? "#FFE3A6" : "#E7DCC6"} />
    </g>
  );
}

function Living({ mess, lights, gid }) {
  const askew = mess.includes("cushions");
  return (
    <g>
      {/* wood floor planks */}
      {[-0.9, -0.6, -0.3, 0, 0.3, 0.6, 0.9].map((s) => { const a = fl(0, s), b = fl(1, s); return <line key={s} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="rgba(80,50,25,0.22)" strokeWidth="2" />; })}
      {/* wall art on right wall */}
      <polygon points={pts([rw(0.45, 0.24), rw(0.75, 0.27), rw(0.75, 0.47), rw(0.45, 0.47)])} fill="#FFFFFF" />
      <polygon points={pts([rw(0.47, 0.27), rw(0.73, 0.295), rw(0.73, 0.445), rw(0.47, 0.44)])} fill="#E07A4F" opacity="0.85" />
      {/* TV on left wall */}
      <polygon points={pts([lw(0.5, 0.3), lw(0.82, 0.33), lw(0.82, 0.5), lw(0.5, 0.52)])} fill="#151A24" />
      {/* rug */}
      <ellipse cx="400" cy="432" rx="250" ry="58" fill="#C9B8A0" />
      <ellipse cx="400" cy="432" rx="226" ry="48" fill="none" stroke="#B5A285" strokeWidth="3" />
      {/* sofa */}
      <rect x="276" y="262" width="248" height="56" rx="12" fill="#4F6A8C" />
      <rect x="262" y="306" width="276" height="48" rx="10" fill="#5B789C" />
      <rect x="250" y="282" width="34" height="76" rx="10" fill="#4A6384" />
      <rect x="516" y="282" width="34" height="76" rx="10" fill="#4A6384" />
      <g transform={askew ? "rotate(-18 320 296)" : undefined}><rect x="296" y="276" width="48" height="40" rx="8" fill="#F1C27A" /></g>
      <g transform={askew ? "rotate(24 480 300)" : undefined}><rect x="456" y="276" width="48" height="40" rx="8" fill="#E8ECF5" /></g>
      {askew && <rect x="380" y="320" width="44" height="34" rx="8" fill="#F1C27A" transform="rotate(-62 402 337)" />}
      {/* coffee table */}
      <FloorBox u0={0.3} u1={0.48} s0={-0.24} s1={0.24} h={34} front="#5E412C" top="#7A5638" side="#4F3624" />
      {mess.includes("surfaces") && (
        <g>
          <rect x="350" y="376" width="14" height="16" rx="3" fill="#E8ECF5" /><rect x="370" y="372" width="14" height="16" rx="3" fill="#E07A4F" />
          <polygon points="400,384 448,378 456,390 408,396" fill="#FFFFFF" /><polygon points="412,380 452,376 458,386 418,390" fill="#F3F1EC" />
          <rect x="426" y="368" width="26" height="7" rx="3" fill="#1E2430" transform="rotate(-8 439 371)" />
          <rect x="560" y="404" width="22" height="10" rx="2" fill="#C9D3E0" /><path d="M582 409 C600 420 610 440 640 452" stroke="#1E2430" strokeWidth="2" fill="none" />
        </g>
      )}
      {mess.includes("toys") && (
        <g>
          <rect x="250" y="440" width="22" height="22" fill="#E04F4F" /><rect x="276" y="448" width="20" height="20" fill="#4FA0E0" /><rect x="262" y="424" width="18" height="18" fill="#F1C27A" />
          <ellipse cx="620" cy="478" rx="66" ry="22" fill="#8C6A4C" /><ellipse cx="620" cy="474" rx="48" ry="14" fill="#B08A68" />
        </g>
      )}
      {mess.includes("laundry") && (
        <g>
          <polygon points="88,430 160,430 152,492 96,492" fill="#D9CDB6" /><path d="M92 432 Q110 410 126 428 Q140 404 158 430" fill="#7C8FAE" />
          <path d="M520 300 Q560 290 552 330 Q540 350 526 340Z" fill="#E07A4F" />
          <rect x="690" y="430" width="40" height="56" rx="4" fill="#5A6378" />
        </g>
      )}
      {/* floor lamp */}
      <line x1="640" y1="236" x2="640" y2="452" stroke="#2F3747" strokeWidth="5" />
      <ellipse cx="640" cy="454" rx="22" ry="6" fill="#2F3747" />
      <Lamp x={640} y={226} on={lights} gid={gid} />
      {/* plant */}
      <polygon points="120,380 168,380 160,432 128,432" fill="#C46A3F" />
      {[[132, 360, 26], [158, 352, 22], [144, 334, 24], [124, 340, 18]].map(([x, y, r]) => <circle key={x + y} cx={x} cy={y} r={r} fill="#3F7A52" />)}
    </g>
  );
}

function Kitchen({ mess, lights, gid }) {
  return (
    <g>
      {/* tiled floor */}
      {[-0.8, -0.4, 0, 0.4, 0.8].map((s) => { const a = fl(0, s), b = fl(1, s); return <line key={s} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="rgba(0,0,0,0.1)" strokeWidth="2" />; })}
      {[0.15, 0.35, 0.55, 0.75].map((u) => { const a = fl(u, -1), b = fl(u, 1); return <line key={u} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="rgba(0,0,0,0.1)" strokeWidth="2" />; })}
      {/* wall cabinets */}
      <rect x="236" y="130" width="92" height="74" fill="#2F4A6B" /><rect x="472" y="130" width="92" height="74" fill="#2F4A6B" />
      <line x1="282" x2="282" y1="130" y2="204" stroke="rgba(255,255,255,0.18)" strokeWidth="2" /><line x1="518" x2="518" y1="130" y2="204" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
      {/* splashback + base units + worktop */}
      <rect x="230" y="250" width="340" height="30" fill="#DDE4EC" />
      <rect x="230" y="286" width="340" height="54" fill="#2F4A6B" />
      {[287, 344, 401, 458, 515].map((x) => <line key={x} x1={x} x2={x} y1="288" y2="340" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />)}
      <rect x="226" y="278" width="348" height="10" fill="#EFEAE0" />
      <rect x="372" y="279" width="56" height="6" fill="#AEB8C6" />
      {/* hob on left wall run */}
      <polygon points={pts([lw(0.62, 0.62), lw(0.95, 0.66), lw(0.95, 0.84), lw(0.62, 0.86)])} fill="#2F4A6B" />
      <polygon points={pts([lw(0.62, 0.6), lw(0.95, 0.64), lw(0.95, 0.67), lw(0.62, 0.63)])} fill="#EFEAE0" />
      {/* island */}
      <FloorBox u0={0.28} u1={0.52} s0={-0.42} s1={0.42} h={118} front="#2F4A6B" top="#EFEAE0" side="#263E5A" />
      {/* stools */}
      {[-0.28, 0, 0.28].map((s) => { const [x, y] = fl(0.12, s); return <g key={s}><line x1={x} y1={y} x2={x} y2={y - 70} stroke="#2F3747" strokeWidth="5" /><ellipse cx={x} cy={y - 72} rx="24" ry="8" fill="#C46A3F" /></g>; })}
      {/* pendants */}
      {[330, 470].map((x) => <g key={x}><line x1={x} y1="0" x2={x} y2="150" stroke="#2F3747" strokeWidth="2" /><Lamp x={x} y={160} on={lights} gid={gid} small /></g>)}
      {mess.includes("surfaces") && (
        <g>
          <rect x="300" y="262" width="22" height="18" fill="#E8ECF5" /><rect x="326" y="256" width="16" height="24" fill="#F1C27A" /><rect x="250" y="258" width="30" height="22" rx="4" fill="#C9D3E0" />
          <ellipse cx="380" cy="352" rx="30" ry="7" fill="#E8ECF5" /><ellipse cx="380" cy="348" rx="30" ry="7" fill="#F3F1EC" /><rect x="430" y="330" width="14" height="22" fill="#4F8150" /><rect x="448" y="334" width="12" height="18" fill="#E07A4F" />
          <rect x="500" y="262" width="36" height="18" fill="#E04F4F" />
        </g>
      )}
      {mess.includes("laundry") && <g><rect x="110" y="420" width="44" height="64" rx="5" fill="#AEB8C6" /><rect x="620" y="436" width="60" height="38" rx="4" fill="#D9CDB6" /></g>}
    </g>
  );
}

function Bedroom({ mess, lights, gid }) {
  return (
    <g>
      {/* carpet */}
      <polygon points={pts([fl(0, -1), fl(0, 1), fl(1, 1), fl(1, -1)])} fill="#CDBFAE" />
      {/* headboard */}
      <rect x="296" y="236" width="208" height="70" rx="10" fill="#5B789C" />
      {/* bed */}
      <FloorBox u0={0.5} u1={0.98} s0={-0.36} s1={0.36} h={64} front="#E8E3D9" top="#F6F3EE" side="#DCD5C8" />
      {(() => { const a = up(fl(0.5, -0.38), 64 * k(0.5)), b = up(fl(0.5, 0.38), 64 * k(0.5)), c = up(fl(0.68, 0.38), 64 * k(0.68)), d = up(fl(0.68, -0.38), 64 * k(0.68));
        return <polygon points={pts([a, b, c, d])} fill="#4F6A8C" />; })()}
      <rect x="326" y="290" width="64" height="24" rx="8" fill="#FFFFFF" /><rect x="410" y="290" width="64" height="24" rx="8" fill="#FFFFFF" />
      {/* side tables and lamps */}
      <rect x="240" y="300" width="44" height="44" fill="#7A5638" /><rect x="516" y="300" width="44" height="44" fill="#7A5638" />
      <Lamp x={262} y={282} on={lights} gid={gid} small /><Lamp x={538} y={282} on={lights} gid={gid} small />
      {/* wardrobe on right wall */}
      <polygon points={pts([rw(0.3, 0.05), rw(0.7, 0.12), rw(0.7, 1), rw(0.3, 1)])} fill="#EFEAE0" />
      <line x1={rw(0.5, 0.09)[0]} y1={rw(0.5, 0.09)[1]} x2={rw(0.5, 1)[0]} y2={rw(0.5, 1)[1]} stroke="rgba(0,0,0,0.12)" strokeWidth="2" />
      {mess.includes("laundry") && <g><path d="M300 340 Q340 310 380 344 Q360 360 320 356Z" fill="#E07A4F" /><path d="M180 470 Q230 440 270 476 Q240 494 196 488Z" fill="#7C8FAE" /><polygon points="600,440 660,440 654,494 606,494" fill="#D9CDB6" /></g>}
      {mess.includes("surfaces") && <g><rect x="246" y="290" width="10" height="12" fill="#E8ECF5" /><rect x="526" y="292" width="20" height="8" fill="#1E2430" /><rect x="548" y="288" width="8" height="12" fill="#E07A4F" /></g>}
    </g>
  );
}

function Bath({ mess, lights, gid }) {
  return (
    <g>
      {/* tiles */}
      <rect x="230" y="210" width="340" height="130" fill="#E3EBF2" />
      {[240, 270, 300].map((y) => <line key={y} x1="230" x2="570" y1={y} y2={y} stroke="rgba(0,51,102,0.12)" strokeWidth="2" />)}
      {Array.from({ length: 11 }, (_, i) => 230 + i * 34).map((x) => <line key={x} x1={x} x2={x} y1="210" y2="340" stroke="rgba(0,51,102,0.12)" strokeWidth="2" />)}
      <polygon points={pts([fl(0, -1), fl(0, 1), fl(1, 1), fl(1, -1)])} fill="#C9D3E0" />
      {/* bath along the back wall */}
      <FloorBox u0={0.78} u1={0.99} s0={-0.62} s1={0.62} h={74} front="#FFFFFF" top="#F3F6F9" side="#E8ECF5" />
      <rect x="300" y="128" width="8" height="70" fill="#AEB8C6" /><circle cx="304" cy="128" r="12" fill="#AEB8C6" />
      {/* basin and mirror on the right wall */}
      <polygon points={pts([rw(0.42, 0.18), rw(0.68, 0.22), rw(0.68, 0.46), rw(0.42, 0.46)])} fill="#BFD3E6" stroke="#FFFFFF" strokeWidth="4" />
      <polygon points={pts([rw(0.38, 0.55), rw(0.72, 0.57), rw(0.7, 0.66), rw(0.4, 0.66)])} fill="#FFFFFF" />
      <polygon points={pts([rw(0.46, 0.66), rw(0.64, 0.66), rw(0.62, 1), rw(0.48, 1)])} fill="#E8ECF5" />
      {/* towel rail on left wall */}
      <polygon points={pts([lw(0.5, 0.42), lw(0.75, 0.45), lw(0.75, 0.68), lw(0.5, 0.7)])} fill={mess.includes("laundry") ? "#E07A4F" : "#FFFFFF"} />
      {/* toilet, front left */}
      <ellipse cx="150" cy="458" rx="48" ry="20" fill="#FFFFFF" /><rect x="110" y="380" width="80" height="62" rx="8" fill="#FFFFFF" />
      {mess.includes("surfaces") && <g><ellipse cx="150" cy="446" rx="40" ry="44" fill="#FFFFFF" stroke="#E8ECF5" strokeWidth="3" /><rect x="330" y="252" width="10" height="20" fill="#E07A4F" /><rect x="344" y="256" width="10" height="16" fill="#4FA0E0" /><rect x="358" y="250" width="8" height="22" fill="#F1C27A" /></g>}
      {mess.includes("laundry") && <path d="M420 470 Q470 440 520 474 Q500 498 440 494Z" fill="#7C8FAE" />}
      <Lamp x={400} y={40} on={lights} gid={gid} small />
    </g>
  );
}

const WINDOWS = {
  living: { x: 330, y: 146, w: 140, h: 104, curtains: true },
  kitchen: { x: 345, y: 146, w: 110, h: 92 },
  bedroom: { x: 350, y: 140, w: 100, h: 80, curtains: true },
  bath: { x: 470, y: 140, w: 70, h: 54, frosted: true },
};

export default function RoomScene({ room = "living", expo = "blend", lights = true, curtains = "open", mess = [], label }) {
  const gid = `rs${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const w = WINDOWS[room];
  const Furn = { living: Living, kitchen: Kitchen, bedroom: Bedroom, bath: Bath }[room];
  const dim = expo === "window" ? 0.6 : expo === "mid" ? 0.28 : 0;
  const lightsOff = lights ? 0 : 0.26;
  const warm = room === "bath" ? "#E9EEF3" : "#EDE6DA";
  return (
    <svg viewBox="0 0 800 520" role="img" aria-label={label || `Illustration of a ${room === "bath" ? "bathroom" : room === "living" ? "living room" : room}`}>
      <defs>
        <linearGradient id={`${gid}-sky`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6FA6DC" /><stop offset="1" stopColor="#CFE4F5" /></linearGradient>
        <radialGradient id={`${gid}-glow`}><stop offset="0" stopColor="#FFD98A" stopOpacity="0.75" /><stop offset="1" stopColor="#FFD98A" stopOpacity="0" /></radialGradient>
        <radialGradient id={`${gid}-day`} cx="0.5" cy="0.3" r="0.7"><stop offset="0" stopColor="#FFFFFF" stopOpacity="0.35" /><stop offset="1" stopColor="#FFFFFF" stopOpacity="0" /></radialGradient>
        <filter id={`${gid}-bloom`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="18" /></filter>
      </defs>
      {/* shell */}
      <polygon points="0,0 800,0 570,120 230,120" fill="#F6F2EA" />
      <polygon points="0,0 230,120 230,340 0,520" fill="#E3DACB" />
      <polygon points="800,0 570,120 570,340 800,520" fill="#D9CFBF" />
      <rect x={BW.x0} y={BW.y0} width={BW.x1 - BW.x0} height={BW.y1 - BW.y0} fill={warm} />
      <polygon points="0,520 800,520 570,340 230,340" fill={room === "kitchen" ? "#D3CEC6" : "#B98F62"} />
      {/* skirting */}
      <polyline points="0,520 230,340 570,340 800,520" fill="none" stroke="#FFFFFF" strokeWidth="5" />
      {/* ceiling light */}
      {room === "living" && <g><line x1="400" y1="0" x2="400" y2="48" stroke="#2F3747" strokeWidth="2" /><Lamp x={400} y={58} on={lights} gid={gid} small /></g>}
      {room === "bedroom" && <g><line x1="400" y1="0" x2="400" y2="40" stroke="#2F3747" strokeWidth="2" /><Lamp x={400} y={50} on={lights} gid={gid} small /></g>}
      <Window {...w} gid={gid} expo="blend" curtains={w.curtains ? curtains : null} />
      <Furn mess={mess} lights={lights} gid={gid} />
      {/* daylight from the window when the curtains are open */}
      {curtains === "open" && <rect width="800" height="520" fill={`url(#${gid}-day)`} />}
      {(lightsOff + dim) > 0 && <rect width="800" height="520" fill="#0A1220" opacity={Math.min(0.75, lightsOff + dim)} />}
      {/* the window sits on top of any darkening, so a dark exposure still shows the view */}
      {(expo !== "blend" || lightsOff > 0) && curtains !== "closed" && <Window {...w} gid={gid} expo={expo} curtains={w.curtains ? curtains : null} />}
    </svg>
  );
}
