"use client";
/* Vacant property monitoring: the drawings and interactive pieces.
   VacantBuilding draws an empty two-storey building with its yard. Damage
   appears month by month (VP_ISSUES in lib/vacant.js), and any part can be
   highlighted (VP_CHECKS). Used by the hero, the month slider, the check
   explorer and the sample report on /vacant-property-monitoring. */
import Link from "next/link";
import { useState } from "react";
import { Arrow } from "@/components/TIcons";
import { VP_ISSUES, VP_CHECKS } from "@/lib/vacant";

/* Where each issue's marker sits on the drawing (640 × 400). */
const MARK = {
  gutter: [192, 160], slates: [230, 140], lead: [383, 112], window: [237, 214], tipping: [556, 314],
  fence: [612, 262], graffiti: [312, 292], plant: [400, 46], storm: [322, 108], entry: [240, 296],
};
/* Highlight boxes for the checks: [x, y, w, h], one or more each. */
const AREAS = {
  roof: [[96, 90, 398, 86]],
  chimney: [[356, 44, 54, 84]],
  gutters: [[90, 164, 410, 16], [470, 170, 18, 164]],
  windows: [[132, 186, 286, 58], [132, 256, 70, 76], [282, 256, 136, 76]],
  doors: [[206, 254, 66, 80]],
  walls: [[106, 176, 368, 158]],
  boundary: [[494, 244, 142, 60]],
  yard: [[494, 300, 142, 40]],
};

const UP_WIN = [140, 215, 290, 365];

export function VacantBuilding({ month = 1, highlight = null, markers = true, viewBox = "0 0 640 400", drone = false, label }) {
  const has = (id) => month >= (VP_ISSUES.find((i) => i.id === id)?.m ?? 99);
  const slateRows = [];
  for (let y = 109; y < 172; y += 9) slateRows.push(y);

  return (
    <svg viewBox={viewBox} className="vp-svg" role="img" aria-label={label || `Empty building at month ${month} of monitoring`}>
      <defs>
        <clipPath id="vp-roof-clip"><polygon points="100,172 140,100 450,100 490,172" /></clipPath>
        <linearGradient id="vp-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0B2440" /><stop offset="1" stopColor="#123456" /></linearGradient>
      </defs>
      <rect width="640" height="400" fill="url(#vp-sky)" />
      {/* ground and lane */}
      <rect y="330" width="640" height="70" fill="#0E2A47" />
      <rect y="362" width="640" height="16" fill="#0A2038" />
      <path d="M0 370 H640" stroke="#2A4A6B" strokeWidth="1.5" strokeDasharray="14 12" />
      {/* tree */}
      <rect x="44" y="270" width="8" height="62" fill="#1A3550" />
      <circle cx="48" cy="258" r="28" fill="#1C4A3E" /><circle cx="30" cy="276" r="18" fill="#1C4A3E" /><circle cx="68" cy="274" r="19" fill="#1C4A3E" />

      {/* yard fence (back of the yard) */}
      <g className="vp-fence">
        {[0, 1, 2, 3, 4].map((i) => (i === 2 && has("fence") ? null : <rect key={i} x={500 + i * 26} y="250" width="24" height="50" fill="#3A5878" stroke="#5C7894" strokeWidth="1" />))}
        <path d="M498 262 H632 M498 288 H632" stroke="#5C7894" strokeWidth="2" />
        {has("fence") && <polygon points="548,322 576,322 590,332 562,332" fill="#3A5878" stroke="#5C7894" strokeWidth="1" />}
      </g>
      {/* yard surface */}
      <rect x="494" y="300" width="146" height="30" fill="#163556" />
      {has("tipping") && (
        <g>
          <rect x="512" y="306" width="46" height="16" rx="3" fill="#8DA6BF" transform="rotate(-8 535 314)" />
          <path d="M516 310 h38" stroke="#6E869E" strokeWidth="1" transform="rotate(-8 535 314)" />
          <ellipse cx="572" cy="320" rx="11" ry="9" fill="#23272E" /><ellipse cx="586" cy="323" rx="9" ry="7" fill="#2D333C" /><ellipse cx="562" cy="326" rx="8" ry="5" fill="#1B1F25" />
        </g>
      )}

      {/* building body */}
      <rect x="110" y="172" width="360" height="158" fill="#2E4D70" stroke="#1B3350" strokeWidth="2" />
      {[198, 226, 254, 282, 310].map((y) => <path key={y} d={`M110 ${y} H470`} stroke="#28466A" strokeWidth="1" />)}
      {/* roof */}
      <polygon points="100,172 140,100 450,100 490,172" fill="#1F3550" />
      <g clipPath="url(#vp-roof-clip)">
        {slateRows.map((y) => <path key={y} d={`M90 ${y} H500`} stroke="#2A4466" strokeWidth="1" />)}
        {has("slates") && <g fill="#0A1626"><polygon points="214,136 232,136 236,145 218,145" /><polygon points="232,145 250,145 254,154 236,154" /></g>}
        {has("storm") && <g><polygon points="300,100 348,100 352,118 318,124 296,114" fill="#0A1626" /><path d="M306 104 l10 8 M326 102 l6 12 M340 104 l-4 10" stroke="#3B5878" strokeWidth="2" /></g>}
      </g>
      <path d="M140 100 H450" stroke="#355476" strokeWidth="3" />
      {has("storm") && <g fill="#2A4466"><rect x="250" y="160" width="14" height="6" transform="rotate(14 257 163)" /><rect x="378" y="150" width="14" height="6" transform="rotate(-10 385 153)" /></g>}
      {/* chimney */}
      <rect x="370" y="64" width="26" height="54" fill="#3A5878" stroke="#1B3350" strokeWidth="1.5" />
      <path d="M370 78 H396 M370 92 H396 M370 106 H396" stroke="#2E4D70" strokeWidth="1" />
      <rect x="373" y="56" width="8" height="9" fill="#5C7894" /><rect x="385" y="56" width="8" height="9" fill="#5C7894" />
      <rect x="364" y="113" width="38" height="8" fill={has("lead") ? "#0A1626" : "#9FB3C8"} />
      {has("plant") && <g fill="#4E8A5A"><path d="M389 56 q-6 -14 4 -22 q2 10 -1 22z" /><path d="M391 56 q10 -10 18 -6 q-8 6 -16 8z" /><path d="M388 56 q-12 -6 -16 0 q8 2 15 1z" /></g>}
      {/* gutter and downpipe */}
      <rect x="96" y="170" width="398" height="5" fill="#5C7894" />
      <rect x="476" y="175" width="5" height="155" fill="#5C7894" />
      {has("gutter") && <g fill="#4E8A5A"><path d="M170 171 q4 -12 8 0z" /><path d="M180 171 q5 -16 10 0z" /><path d="M193 171 q3 -10 7 0z" /><path d="M203 171 q4 -13 9 0z" /></g>}

      {/* first-floor windows */}
      {UP_WIN.map((x, i) => (
        <g key={x}>
          <rect x={x} y="192" width="44" height="46" fill={i === 1 && has("window") ? "#0A1626" : "#16304D"} stroke="#8DA6BF" strokeWidth="2" />
          <path d={`M${x + 22} 192 V238 M${x} 215 H${x + 44}`} stroke="#8DA6BF" strokeWidth="1.5" />
          {i === 1 && has("window") && <path d={`M${x + 4} 196 l10 9 l-3 8 l9 4 M${x + 18} 203 l6 -6`} stroke="#DDE7F1" strokeWidth="1.2" fill="none" />}
        </g>
      ))}
      {/* ground floor: boarded windows and door */}
      {[140, 290, 365].map((x) => (
        <g key={x}>
          <rect x={x} y="262" width="44" height="52" fill="#56677C" stroke="#3E4E61" strokeWidth="2" />
          <path d={`M${x} 262 L${x + 44} 314 M${x + 44} 262 L${x} 314`} stroke="#45566B" strokeWidth="2" />
        </g>
      ))}
      {has("graffiti") && <g fill="none" strokeWidth="2.4" strokeLinecap="round"><path d="M294 284 q6 -10 12 0 t12 0 t10 -4" stroke="#FFC15E" /><path d="M296 298 c6 -8 10 6 16 -2 s8 4 14 -4" stroke="#7FD1C7" /></g>}
      {/* door */}
      <rect x="214" y="262" width="52" height="68" fill="#0A1626" />
      <g transform={has("entry") ? "rotate(-14 214 330)" : undefined}>
        <rect x="214" y="262" width="52" height="68" fill="#56677C" stroke="#3E4E61" strokeWidth="2" />
        <path d="M214 284 H266 M214 308 H266" stroke="#45566B" strokeWidth="2" />
      </g>
      {/* "to let"-style sign */}
      <rect x="402" y="232" width="56" height="22" fill="#DDE7F1" /><path d="M408 240 h30 M408 246 h20" stroke="#003366" strokeWidth="2" />

      {/* highlight for the check explorer */}
      {highlight && AREAS[highlight]?.map(([x, y, w, h], i) => <rect key={i} x={x} y={y} width={w} height={h} rx="4" className="vp-hl" />)}

      {/* drone and flight path (hero only) */}
      {drone && (
        <g>
          <path id="vp-orbit" d="M90 60 C 200 20, 440 20, 560 60 S 600 150, 520 150" fill="none" stroke="#FF6B35" strokeWidth="1.4" strokeDasharray="4 6" opacity="0.7" />
          <g className="vp-drone">
            <circle r="10" fill="rgba(255,107,53,0.25)" /><circle r="4.5" fill="#FF6B35" />
            <animateMotion dur="9s" repeatCount="indefinite" rotate="0"><mpath href="#vp-orbit" /></animateMotion>
          </g>
        </g>
      )}

      {/* issue markers */}
      {markers && VP_ISSUES.map((it, i) => {
        if (month < it.m) return null;
        const [x, y] = MARK[it.id];
        const isNew = it.m === month;
        return (
          <g key={it.id} className={isNew ? "vp-mk vp-mk-new" : "vp-mk"} transform={`translate(${x} ${y})`}>
            {isNew && <circle r="16" className="vp-mk-ring" />}
            <circle r={isNew ? 10 : 8} className="vp-mk-dot" />
            <text y="3.5" textAnchor="middle" className="vp-mk-n">{i + 1}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ---- Hero: the building mid-way through, with the drone orbiting ---- */
export function HeroVacant() {
  return (
    <div className="vp-hero-art">
      <VacantBuilding month={7} drone label="An empty building with a drone flying a monthly check above it, seven issues marked" />
      <div className="vp-hud" aria-hidden="true">
        <span>● VISIT 07</span><span>SAME POSITION · P3</span><span>ALT 30 m</span>
      </div>
    </div>
  );
}

/* ---- Month slider: drag through a year of visits ---- */
export function MonthSlider() {
  const [month, setMonth] = useState(7);
  const seen = VP_ISSUES.map((it, i) => ({ ...it, n: i + 1 })).filter((it) => it.m <= month);
  const fresh = seen.filter((it) => it.m === month);
  const p = Math.round(((month - 1) / 11) * 100);

  return (
    <div className="t-tt vp-tt">
      <div className="t-tt-copy">
        <span className="t-tag">Drag through a year</span>
        <h2 id="vp-year-title" style={{ fontSize: "var(--t-s3)" }}>Twelve visits. Same views. Every change caught.</h2>
        <p className="t-lede">This is one empty building, checked once a month from the same positions. Drag through the year and watch what happens to a building nobody is looking at.</p>
        <div className="vp-new" aria-live="polite">
          <p className="t-mono">{month === 1 ? "VISIT 01 · STARTING RECORD" : `NEW SINCE VISIT ${String(month - 1).padStart(2, "0")}`}</p>
          {month === 1 && <p className="vp-new-none">Everything photographed as it is today. Every later visit is compared with this one.</p>}
          {month > 1 && fresh.length === 0 && <p className="vp-new-none">Nothing new this month. The report says so, with the photos to prove it.</p>}
          {fresh.map((it) => (
            <div key={it.id} className="vp-new-item"><span className="vp-n">{it.n}</span><div><b>{it.t}</b><small>{it.where}</small><p>{it.d}</p></div></div>
          ))}
        </div>
        {seen.length > fresh.length && (
          <p className="vp-open"><b>{seen.length - fresh.length}</b> earlier {seen.length - fresh.length === 1 ? "issue" : "issues"} still open: {seen.filter((it) => it.m < month).map((it) => it.n).join(", ")}</p>
        )}
      </div>
      <figure className="t-tt-stage t-frame" style={{ margin: 0 }}>
        <VacantBuilding month={month} label={`Empty building at visit ${month} of 12, with ${seen.length} issues marked`} />
        <figcaption className="t-tt-ctrl">
          <div className="t-tt-row"><label htmlFor="vp-range">DRAG THROUGH THE VISITS</label><b>VISIT {String(month).padStart(2, "0")} / 12</b></div>
          <input id="vp-range" className="t-slider" type="range" min="1" max="12" step="1" value={month}
            style={{ "--p": `${p}%` }} onChange={(e) => setMonth(+e.target.value)} aria-valuetext={`Visit ${month} of 12`} />
          <div className="t-tt-row"><span>FIRST VISIT</span><span>A YEAR LATER</span></div>
        </figcaption>
      </figure>
    </div>
  );
}

/* ---- Check explorer: tap a part to see it on the building ---- */
export function CheckExplorer() {
  const [on, setOn] = useState("chimney");
  const cur = VP_CHECKS.find((c) => c.id === on);
  return (
    <div className="vp-chk">
      <figure className="vp-chk-fig t-frame">
        <VacantBuilding month={1} markers={false} highlight={on} label={`Empty building with the ${cur.t.toLowerCase()} highlighted`} />
        <figcaption><span className="t-mono">CHECKING</span><b>{cur.t}</b><p>{cur.d}</p></figcaption>
      </figure>
      <ul className="vp-chk-list">
        {VP_CHECKS.map((c, i) => (
          <li key={c.id}>
            <button type="button" className={on === c.id ? "on" : undefined} aria-pressed={on === c.id} onClick={() => setOn(c.id)} onMouseEnter={() => setOn(c.id)}>
              <span className="t-mono">{String(i + 1).padStart(2, "0")}</span>{c.t}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---- Sample report: what lands in the inbox after visit 7 ---- */
const CROPS = { lead: "336 40 100 90", tipping: "496 268 128 72", window: "200 180 90 66", gutter: "150 140 90 48", slates: "196 120 80 50" };

export function SampleReport() {
  const month = 7;
  const rows = VP_ISSUES.map((it, i) => ({ ...it, n: i + 1 })).filter((it) => it.m <= month);
  const fresh = rows.filter((it) => it.m === month);
  const open = rows.filter((it) => it.m < month);
  const show = [...fresh, ...open.slice().reverse()].filter((it) => CROPS[it.id]).slice(0, 4);
  return (
    <article className="vp-report t-frame" aria-label="Example monthly condition report">
      <header className="vp-rep-head">
        <div><p className="t-mono">MONTHLY CONDITION REPORT · EXAMPLE</p><h3>Former works building, visit 07</h3></div>
        <ul className="vp-rep-stats">
          <li><b>{fresh.length}</b><span>new</span></li>
          <li><b>{open.length}</b><span>still open</span></li>
          <li><b>0</b><span>fixed</span></li>
        </ul>
      </header>
      <div className="vp-rep-body">
        <figure className="vp-rep-over"><VacantBuilding month={month} label="Overview photo with every issue numbered" /><figcaption className="t-mono">OVERVIEW · POSITION P1 · ISSUES NUMBERED</figcaption></figure>
        <ol className="vp-rep-list">
          {show.map((it) => (
            <li key={it.id} className={it.m === month ? "is-new" : undefined}>
              <div className="vp-rep-crop"><VacantBuilding month={month} markers={false} viewBox={CROPS[it.id]} label={`Close-up: ${it.t}`} /></div>
              <div>
                <p className="t-mono">VP-07-{String(it.n).padStart(2, "0")} · {it.m === month ? "NEW THIS VISIT" : `SINCE VISIT ${String(it.m).padStart(2, "0")}`}</p>
                <b>{it.t}</b>
                <small>{it.where}</small>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <footer className="vp-rep-foot"><span>Every photo dated and numbered. Full-size files by download link.</span></footer>
    </article>
  );
}
