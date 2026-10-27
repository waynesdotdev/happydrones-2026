"use client";
/* Roof anatomy explorer: a roof seen from directly above (the drone's view).
   Tap a numbered marker, or a part name, to highlight it and see what it is,
   what gets photographed and what a roofer usually looks at. Words: RF_PARTS. */
import { useState } from "react";
import { RF_PARTS } from "@/lib/roofs";

const FACES = {
  back: "80,110 640,110 530,220 190,220",
  front: "80,330 640,330 530,220 190,220",
  hipL: "80,110 190,220 80,330",
  hipR: "640,110 530,220 640,330",
  wingL: "340,330 440,230 440,380 340,480",
  wingR: "540,330 440,230 440,380 540,480",
  wingEnd: "340,480 540,480 440,380",
};
const FACE_FILL = { back: "#4C586F", front: "#5D6A84", hipL: "#53607A", hipR: "#53607A", wingL: "#56637D", wingR: "#64728E", wingEnd: "#5D6A84" };
const RIDGES = [[190, 220, 530, 220], [440, 230, 440, 380]];
const HIPS = [[80, 110, 190, 220], [80, 330, 190, 220], [640, 110, 530, 220], [640, 330, 530, 220], [340, 480, 440, 380], [540, 480, 440, 380]];
const VALLEYS = [[340, 330, 440, 230], [540, 330, 440, 230]];
const GUTTER = "M640 150 L640 110 L80 110 L80 330 L340 330 L340 480 L540 480 L540 330 L640 330";
const PANELS = [];
for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) PANELS.push([330 + c * 40, 128 + r * 34]);
const MARK = { slopes: [300, 292], ridge: [360, 204], hips: [128, 160], valleys: [384, 286], chimney: [278, 186], skylight: [236, 274], solar: [410, 158], flat: [705, 205], gutters: [600, 330] };

export default function RoofAnatomy() {
  const [on, setOn] = useState("chimney");
  const part = RF_PARTS.find((p) => p.id === on);
  const hl = (id) => (on === id ? "rfa-hl" : undefined);
  const pick = (id) => setOn(id);

  return (
    <div className="rf-anat">
      <figure className="rf-anat-fig">
        <svg viewBox="0 0 800 520" role="img" aria-label={`Roof seen from above, with the ${part.name.toLowerCase()} highlighted`}>
          <defs>
            <pattern id="rfa-tiles" width="12" height="12" patternUnits="userSpaceOnUse"><path d="M0 11.5H12" stroke="rgba(10,18,32,0.35)" strokeWidth="1" /></pattern>
          </defs>
          <rect width="800" height="520" className="rfa-bg" />
          <rect x="40" y="70" width="760" height="440" rx="6" className="rfa-plot" />
          {/* flat roof */}
          <g className={hl("flat")}>
            <rect x="640" y="150" width="130" height="180" className="rfa-flat" />
            <ellipse cx="712" cy="262" rx="38" ry="26" className="rfa-pond" />
          </g>
          <rect x="666" y="172" width="38" height="38" className={`rfa-glass ${hl("skylight") || ""}`} />
          {/* pitched roof faces */}
          <g className={hl("slopes")}>
            {Object.entries(FACES).map(([k, pts]) => <g key={k}><polygon points={pts} fill={FACE_FILL[k]} /><polygon points={pts} fill="url(#rfa-tiles)" className="rfa-face" /></g>)}
          </g>
          {/* moss patch and a slipped tile, for realism */}
          <ellipse cx="110" cy="300" rx="14" ry="8" className="rfa-moss" /><ellipse cx="126" cy="312" rx="9" ry="6" className="rfa-moss" />
          <rect x="300" y="300" width="14" height="10" className="rfa-slip" />
          {/* solar and skylight */}
          <g className={hl("solar")}>{PANELS.map(([x, y]) => <rect key={`${x}${y}`} x={x} y={y} width="36" height="30" className="rfa-panel" />)}</g>
          <rect x="220" y="252" width="32" height="44" className={`rfa-glass ${hl("skylight") || ""}`} />
          {/* lines */}
          <g className={`rfa-valleys ${hl("valleys") || ""}`}>{VALLEYS.map((l) => <line key={l.join()} x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]} />)}</g>
          <g className={`rfa-hips ${hl("hips") || ""}`}>{HIPS.map((l) => <line key={l.join()} x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]} />)}</g>
          <g className={`rfa-ridges ${hl("ridge") || ""}`}>{RIDGES.map((l) => <line key={l.join()} x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]} />)}</g>
          <path d={GUTTER} className={`rfa-gutter ${hl("gutters") || ""}`} />
          <path d="M640 150 L770 150 L770 330 L640 330" className={`rfa-gutter rfa-trim ${hl("flat") || ""}`} />
          {[[80, 110], [80, 330], [340, 480], [540, 480], [640, 110], [770, 330]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="6" className={`rfa-pipe ${hl("gutters") || ""}`} />)}
          {/* chimney */}
          <g className={hl("chimney")}>
            <rect x="258" y="202" width="40" height="36" className="rfa-chim" />
            <circle cx="270" cy="220" r="7" className="rfa-pot" /><circle cx="287" cy="220" r="7" className="rfa-pot" />
          </g>
          {/* markers */}
          {RF_PARTS.map((p, i) => {
            const [x, y] = MARK[p.id];
            return (
              <g key={p.id} className={`rfa-mark${on === p.id ? " on" : ""}`} role="button" tabIndex={0} aria-label={p.name} aria-pressed={on === p.id}
                onClick={() => pick(p.id)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(p.id); } }}>
                <circle cx={x} cy={y} r="15" /><text x={x} y={y + 5} textAnchor="middle">{i + 1}</text>
              </g>
            );
          })}
          <text x="52" y="56" className="rfa-cap">FROM DIRECTLY ABOVE · ILLUSTRATION · TAP A NUMBER</text>
        </svg>
      </figure>
      <div className="rf-anat-side">
        <div className="rf-anat-chips" role="group" aria-label="Roof parts">
          {RF_PARTS.map((p, i) => (
            <button key={p.id} type="button" aria-pressed={on === p.id} className={on === p.id ? "on" : undefined} onClick={() => pick(p.id)}>
              <span>{i + 1}</span>{p.name}
            </button>
          ))}
        </div>
        <div className="rf-anat-card" key={on} aria-live="polite">
          <h3>{part.name}</h3>
          <p>{part.what}</p>
          <p className="rf-anat-shot"><b>What I photograph:</b> {part.shot}</p>
          <p className="rf-anat-lk">What a roofer usually looks at</p>
          <ul>{part.looks.map((l, n) => <li key={l} style={{ "--n": n }}>{l}</li>)}</ul>
        </div>
      </div>
    </div>
  );
}
