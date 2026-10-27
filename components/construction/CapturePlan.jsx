"use client";
/* Top-down site plan with the fixed capture positions. Tap a position (on the
   plan or in the list) to see its height, angle and what it's for.
   Position details live in POSITIONS (lib/construction.js). */
import { useState } from "react";
import { POSITIONS } from "@/lib/construction";

// Where each position sits on the plan, and which way it looks (degrees, 0 = east, 90 = south)
const GEO = {
  A: { x: 46, y: 384, dir: -45 },
  B: { x: 554, y: 384, dir: -135 },
  C: { x: 554, y: 36, dir: 135 },
  D: { x: 310, y: 205, dir: null },
  E: { x: 310, y: 408, dir: -90 },
  F: { x: 30, y: 24, dir: 38 },
};

function cone({ x, y, dir }, len = 240, spread = 24) {
  const r = (d) => (d * Math.PI) / 180;
  const a1 = r(dir - spread), a2 = r(dir + spread);
  return `M${x},${y} L${x + Math.cos(a1) * len},${y + Math.sin(a1) * len} A${len},${len} 0 0 1 ${x + Math.cos(a2) * len},${y + Math.sin(a2) * len} Z`;
}

export default function CapturePlan() {
  const [sel, setSel] = useState("A");
  const p = POSITIONS.find((x) => x.id === sel);
  const g = GEO[sel];

  return (
    <div className="cx-plan">
      <figure className="cx-plan-map t-frame">
        <svg viewBox="0 0 600 430" role="img" aria-label={`Site plan showing capture positions A to F. Selected: ${p.id}, ${p.name}.`}>
          <defs>
            <pattern id="cxgrid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="rgba(140,185,235,0.08)" /></pattern>
            <radialGradient id="cxcone" cx="0" cy="0" r="1"><stop offset="0" stopColor="#FF6B35" stopOpacity="0.55" /><stop offset="1" stopColor="#FF6B35" stopOpacity="0.04" /></radialGradient>
          </defs>
          <rect width="600" height="430" fill="url(#cxgrid)" />
          {/* road */}
          <rect x="0" y="396" width="600" height="34" fill="#0A2A4A" />
          <path d="M0 413H600" stroke="rgba(242,246,251,0.35)" strokeDasharray="14 12" />
          {/* site boundary + hoarding */}
          <rect x="70" y="56" width="460" height="320" fill="rgba(92,72,58,0.35)" stroke="#FF915F" strokeWidth="2" strokeDasharray="8 6" />
          {/* building footprint */}
          <rect x="230" y="140" width="170" height="120" fill="#5D6880" stroke="#9AA6BC" />
          <path d="M230 170H400M230 200H400M230 230H400M272 140V260M315 140V260M357 140V260" stroke="rgba(207,220,234,0.25)" />
          {/* compound and laydown */}
          <rect x="92" y="300" width="96" height="56" fill="#1A2234" stroke="rgba(140,185,235,0.4)" />
          <text x="140" y="333" textAnchor="middle" className="cx-plan-lbl">COMPOUND</text>
          <rect x="430" y="76" width="80" height="50" fill="#1A2234" stroke="rgba(140,185,235,0.4)" />
          <text x="470" y="105" textAnchor="middle" className="cx-plan-lbl">LAYDOWN</text>
          {/* crane */}
          <circle cx="190" cy="118" r="7" fill="#FF6B35" />
          <path d="M190 118L330 92" stroke="#FF6B35" strokeWidth="3" />
          <circle cx="190" cy="118" r="150" fill="none" stroke="rgba(255,107,53,0.18)" strokeDasharray="4 6" />
          {/* trees */}
          {[[96, 82], [500, 340], [520, 168], [110, 210]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="11" fill="#1F5A44" />)}
          {/* site entrance */}
          <path d="M440 376v20M480 376v20" stroke="#FFC15E" strokeWidth="2" />
          <text x="460" y="392" textAnchor="middle" className="cx-plan-lbl">GATE</text>
          {/* selected view cone or overhead frame */}
          {g.dir === null
            ? <rect x="120" y="80" width="380" height="270" fill="rgba(255,107,53,0.12)" stroke="#FF6B35" strokeDasharray="6 5" />
            : <path d={cone(g)} fill="url(#cxcone)" stroke="rgba(255,107,53,0.6)" />}
          {/* positions */}
          {POSITIONS.map((pos) => {
            const q = GEO[pos.id];
            const on = pos.id === sel;
            return (
              <g key={pos.id} className={`cx-pt${on ? " on" : ""}`} onClick={() => setSel(pos.id)} role="button" tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSel(pos.id); } }}
                aria-label={`Position ${pos.id}: ${pos.name}`} aria-pressed={on}>
                <circle cx={q.x} cy={q.y} r="16" />
                <text x={q.x} y={q.y + 5} textAnchor="middle">{pos.id}</text>
              </g>
            );
          })}
          {/* north arrow */}
          <g transform="translate(572 70)"><path d="M0 -18L7 6L0 1L-7 6Z" fill="#F2F6FB" /><text y="22" textAnchor="middle" className="cx-plan-lbl">N</text></g>
        </svg>
        <figcaption className="t-mono">SITE PLAN · ILLUSTRATION · TAP A POSITION</figcaption>
      </figure>

      <div className="cx-plan-side">
        <div className="cx-plan-list" role="tablist" aria-label="Capture positions">
          {POSITIONS.map((pos) => (
            <button key={pos.id} type="button" role="tab" aria-selected={pos.id === sel} className={pos.id === sel ? "on" : undefined} onClick={() => setSel(pos.id)}>
              <b>{pos.id}</b><span>{pos.name}</span>
            </button>
          ))}
        </div>
        <div className="cx-plan-detail" role="tabpanel" aria-live="polite">
          <p className="t-mono">POSITION {p.id} · {p.type.toUpperCase()}</p>
          <h3>{p.name}</h3>
          <dl>
            <div><dt>Height</dt><dd>{p.alt}</dd></div>
            <div><dt>Angle</dt><dd>{p.angle}</dd></div>
          </dl>
          <p>{p.why}</p>
        </div>
      </div>
    </div>
  );
}
