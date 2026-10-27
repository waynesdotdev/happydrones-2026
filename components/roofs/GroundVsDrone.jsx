"use client";
/* Drag-to-compare: the same chimney and slope as you'd see it from the
   pavement (small, steep, blurred) and from the drone a few metres away.
   Drag the handle, use the arrow keys, or tap either side. */
import { useRef, useState } from "react";

function Closeup({ pins, id }) {
  const courses = [];
  for (let i = 0; i < 9; i++) {
    const y = 210 + i * 34;
    courses.push(<line key={`c${i}`} x1="0" x2="800" y1={y} y2={y} className="rfc-course" />);
    for (let x = (i % 2 ? 0 : 38); x < 800; x += 76) courses.push(<line key={`j${i}-${x}`} x1={x} x2={x} y1={y} y2={y + 34} className="rfc-joint" />);
  }
  return (
    <svg viewBox="0 0 800 520" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <rect width="800" height="520" className="rfc-sky" />
      <path d="M0 200 L800 170 L800 520 L0 520Z" className="rfc-slate" />
      <g clipPath={`url(#${id})`}>{courses}</g>
      <defs><clipPath id={id}><path d="M0 200 L800 170 L800 520 L0 520Z" /></clipPath></defs>
      <path d="M0 196 L800 166" className="rfc-ridge" />
      {/* chimney */}
      <rect x="430" y="20" width="190" height="215" className="rfc-brick" />
      {Array.from({ length: 13 }, (_, i) => <line key={i} x1="430" x2="620" y1={36 + i * 16} y2={36 + i * 16} className="rfc-mortar" />)}
      {Array.from({ length: 13 }, (_, i) => Array.from({ length: 4 }, (_, j) => <line key={`${i}-${j}`} x1={442 + j * 48 + (i % 2) * 24} x2={442 + j * 48 + (i % 2) * 24} y1={20 + i * 16} y2={36 + i * 16} className="rfc-mortar" />))}
      <rect x="420" y="8" width="210" height="16" className="rfc-cap" />
      <rect x="455" y="-30" width="44" height="40" className="rfc-pot" /><rect x="545" y="-24" width="44" height="34" className="rfc-pot" />
      {/* flashing, lifted at the right */}
      <path d="M418 232 L632 232 L632 252 L418 252Z" className="rfc-lead" />
      <path d="M575 232 L640 226 L646 252 L590 246Z" className="rfc-lead-lift" />
      {/* cracked slate and slipped slate */}
      <path d="M152 312 L172 330 L160 346 L180 372" className="rfc-crack" />
      <rect x="266" y="388" width="74" height="34" className="rfc-gap" />
      <rect x="270" y="404" width="74" height="34" className="rfc-slipped" transform="rotate(4 307 421)" />
      {/* moss */}
      {[[640, 430, 26], [690, 446, 18], [600, 452, 16], [668, 470, 22], [720, 420, 14]].map(([x, y, r]) => <ellipse key={x} cx={x} cy={y} rx={r} ry={r * 0.6} className="rfc-moss" />)}
      {pins && [[640, 238, 1], [168, 340, 2], [305, 418, 3], [662, 448, 4]].map(([x, y, n]) => (
        <g key={n} className="rfc-pin"><circle cx={x} cy={y} r="17" /><text x={x} y={y + 6} textAnchor="middle">{n}</text></g>
      ))}
    </svg>
  );
}

// What you see from the pavement: the house front from below, the roof squashed
// by the angle and the chimney a small shape at the top.
function FarView() {
  return (
    <svg viewBox="0 0 800 520" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <defs><linearGradient id="rfv-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8DB8E2" /><stop offset="1" stopColor="#D6E6F4" /></linearGradient></defs>
      <rect width="800" height="520" fill="url(#rfv-sky)" />
      <g className="rfv-haze">
        <path d="M-20 300 L60 196 L820 196 L840 300Z" fill="#56627A" />
        {[214, 232, 250, 268, 286].map((y) => <line key={y} x1="0" x2="800" y1={y} y2={y} stroke="rgba(10,18,32,0.35)" strokeWidth="1.5" />)}
        <path d="M60 196 L820 196" stroke="#2F3747" strokeWidth="6" />
        <rect x="196" y="128" width="58" height="72" fill="#8E5A46" />
        <rect x="192" y="124" width="66" height="7" fill="#5A3A2F" />
        <rect x="204" y="106" width="16" height="19" fill="#B8643C" /><rect x="230" y="110" width="16" height="15" fill="#B8643C" />
        <rect x="190" y="196" width="70" height="6" fill="#8E99A8" />
      </g>
      <rect x="0" y="296" width="800" height="14" fill="#E8ECF5" />
      <rect x="0" y="310" width="800" height="16" fill="#1E2430" />
      <rect x="0" y="326" width="800" height="194" fill="#C6B59A" />
      <rect x="90" y="370" width="170" height="150" fill="#2C6FB0" stroke="#E8ECF5" strokeWidth="8" />
      <rect x="520" y="370" width="170" height="150" fill="#2C6FB0" stroke="#E8ECF5" strokeWidth="8" />
      <rect x="172" y="88" width="108" height="130" className="rfv-box" />
      <text x="172" y="240" className="rfv-boxlbl">THE CHIMNEY, FROM BELOW</text>
    </svg>
  );
}

export default function GroundVsDrone() {
  const [pos, setPos] = useState(50);
  const box = useRef(null);
  const dragging = useRef(false);
  const fromEvent = (e) => {
    const r = box.current.getBoundingClientRect();
    setPos(Math.max(4, Math.min(96, ((e.clientX - r.left) / r.width) * 100)));
  };
  const down = (e) => { dragging.current = true; box.current.setPointerCapture?.(e.pointerId); fromEvent(e); };
  const move = (e) => { if (dragging.current) fromEvent(e); };
  const up = () => { dragging.current = false; };

  return (
    <div className="rf-gv">
      <div className="rf-gv-box" ref={box} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} style={{ "--pos": `${pos}%` }}>
        <div className="rf-gv-far" aria-hidden="true">
          <FarView />
          <span className="rf-gv-lbl">FROM THE PAVEMENT · LOOKING UP FROM 12 M AWAY</span>
        </div>
        <div className="rf-gv-near" aria-hidden="true">
          <Closeup pins id="rfc-near" />
          <span className="rf-gv-lbl rf-gv-lbl-r">FROM THE DRONE · A FEW METRES AWAY</span>
        </div>
        <div className="rf-gv-handle" aria-hidden="true"><span>‹ ›</span></div>
        <input className="rf-gv-range" type="range" min="4" max="96" value={Math.round(pos)} onChange={(e) => setPos(+e.target.value)} aria-label="Compare the view from the pavement with the view from the drone" />
      </div>
      <ol className="rf-gv-key">
        <li><b>1</b> Lead flashing lifting at the corner of the stack</li>
        <li><b>2</b> A crack running across a slate</li>
        <li><b>3</b> A slate slipped out of its course</li>
        <li><b>4</b> Moss building up near the gutter</li>
      </ol>
      <p className="rf-gv-note">Illustration. On a real job, these are photos, numbered and marked for your roofer. Whether they need fixing is their call.</p>
    </div>
  );
}
