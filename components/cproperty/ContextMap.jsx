"use client";
/* Location context map: the site in the middle with drive-time rings, and layers
   you can switch on and off (roads, rail and ports, amenities, neighbours).
   This is what an annotated location aerial shows a buyer. Illustration only. */
import { useState } from "react";
import { CP_LAYERS } from "@/lib/cproperty";

export default function ContextMap() {
  const [on, setOn] = useState({ roads: true, rail: false, amenity: true, neighbours: false });
  const toggle = (id) => setOn((s) => ({ ...s, [id]: !s[id] }));
  return (
    <div className="cp-map">
      <figure className="cp-map-fig">
        <svg viewBox="0 0 600 420" role="img" aria-label="Illustrated location map with drive-time rings around the site">
          <rect width="600" height="420" className="cpm-bg" />
          {/* river */}
          <path d="M0 330 C120 300 200 360 320 330 S520 280 600 300 V420 H0Z" className="cpm-water" />
          {/* drive-time rings */}
          {[[170, "15 MIN"], [115, "10 MIN"], [60, "5 MIN"]].map(([r, l]) => (
            <g key={l}><circle cx="300" cy="200" r={r} className="cpm-ring" /><text x="300" y={200 - r + 14} textAnchor="middle" className="cpm-ring-lbl">{l}</text></g>
          ))}
          {/* roads */}
          {on.roads && (<g className="cpm-roads">
            <path d="M0 120 C150 140 250 170 300 200 S480 260 600 250" className="cpm-road-main" />
            <path d="M330 0 C320 80 310 140 300 200 S270 330 240 420" className="cpm-road" />
            <circle cx="300" cy="200" r="7" className="cpm-junction" />
            <text x="40" y="112" className="cpm-lbl">MAIN ROAD</text><text x="470" y="236" className="cpm-lbl">TO MOTORWAY · 6 MIN</text>
          </g>)}
          {on.rail && (<g className="cpm-rail">
            <path d="M0 60 L600 90" className="cpm-rail-line" />
            <rect x="404" y="70" width="40" height="16" rx="3" className="cpm-stn" /><text x="424" y="60" textAnchor="middle" className="cpm-lbl">STATION</text>
            <rect x="520" y="318" width="54" height="22" className="cpm-port" /><text x="547" y="310" textAnchor="middle" className="cpm-lbl">PORT · 12 MIN</text>
          </g>)}
          {on.amenity && (<g className="cpm-amen">
            {[[190, 150, "CAFÉ"], [380, 140, "TOWN CENTRE"], [220, 270, "GYM"], [420, 210, "SUPERMARKET"]].map(([x, y, l]) => (
              <g key={l}><circle cx={x} cy={y} r="7" className="cpm-dot" /><text x={x + 11} y={y + 4} className="cpm-lbl">{l}</text></g>
            ))}
          </g>)}
          {on.neighbours && (<g className="cpm-nb">
            {[[240, 186, 30, 20], [330, 214, 34, 22], [262, 226, 26, 18], [350, 170, 28, 18]].map(([x, y, w, h]) => <rect key={`${x}${y}`} x={x} y={y} width={w} height={h} className="cpm-unit" />)}
            <text x="300" y="298" className="cpm-lbl">LOGISTICS · TRADE · OFFICES</text>
          </g>)}
          {/* the site */}
          <rect x="282" y="186" width="36" height="28" className="cpm-site" />
          <text x="300" y="232" textAnchor="middle" className="cpm-site-lbl">THE SITE</text>
        </svg>
        <figcaption className="t-mono">LOCATION AERIAL · ILLUSTRATION · TOGGLE THE LAYERS</figcaption>
      </figure>
      <div className="cp-layers" role="group" aria-label="Map layers">
        {CP_LAYERS.map((l) => (
          <button key={l.id} type="button" aria-pressed={on[l.id]} className={on[l.id] ? "on" : undefined} onClick={() => toggle(l.id)}>
            <span className="cp-switch" aria-hidden="true" />
            <span><b>{l.name}</b><small>{l.d}</small></span>
          </button>
        ))}
        <p>On the real thing, these become labels and arrows on your hero aerial: drive times, the nearest junction, the station and who&apos;s next door. Send me the points you want shown.</p>
      </div>
    </div>
  );
}
