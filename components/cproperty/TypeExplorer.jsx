"use client";
/* Property type explorer: swipe or tap through six kinds of commercial property.
   Each shows a simple elevation drawing, what occupiers look for, the shot list,
   how the inside is filmed and the usual package. Data: CP_TYPES, CP_PACKAGES. */
import { useEffect, useRef, useState } from "react";
import { CP_TYPES, CP_PACKAGES } from "@/lib/cproperty";
import { money } from "@/lib/site";

// Simple elevation drawings, 360 × 150, ground line at y=130
const ART = {
  industrial: (<>
    <rect x="40" y="58" width="230" height="72" className="cpa-clad" />
    <path d="M40 58L155 38L270 58" className="cpa-roof" />
    <rect x="200" y="84" width="26" height="46" className="cpa-door" /><rect x="234" y="84" width="26" height="46" className="cpa-door" />
    <rect x="40" y="70" width="90" height="60" className="cpa-glass" /><path d="M40 100H130M70 70V130M100 70V130" className="cpa-mull" />
    <rect x="288" y="104" width="52" height="26" rx="4" className="cpa-truck" />
  </>),
  office: (<>
    <rect x="100" y="22" width="150" height="108" className="cpa-glass" />
    {[44, 66, 88, 110].map((y) => <path key={y} d={`M100 ${y}H250`} className="cpa-mull" />)}
    {[130, 160, 190, 220].map((x) => <path key={x} d={`M${x} 22V130`} className="cpa-mull" />)}
    <rect x="160" y="108" width="30" height="22" className="cpa-door" />
    <rect x="270" y="112" width="70" height="18" className="cpa-park" /><rect x="20" y="112" width="60" height="18" className="cpa-park" />
  </>),
  retail: (<>
    {[20, 100, 180, 260].map((x, i) => (
      <g key={x}><rect x={x} y="50" width="78" height="80" className={i === 1 ? "cpa-clad cpa-hi" : "cpa-clad"} />
        <rect x={x + 6} y="58" width="66" height="14" className={i === 1 ? "cpa-fascia" : "cpa-sign"} />
        <rect x={x + 8} y="82" width="62" height="48" className="cpa-glass" /></g>
    ))}
  </>),
  trade: (<>
    <rect x="30" y="66" width="200" height="64" className="cpa-clad" />
    <rect x="40" y="76" width="56" height="54" className="cpa-glass" /><rect x="130" y="86" width="30" height="44" className="cpa-door" /><rect x="170" y="86" width="30" height="44" className="cpa-door" />
    <rect x="300" y="30" width="16" height="100" className="cpa-totem" /><rect x="286" y="30" width="44" height="34" className="cpa-fascia" />
    <rect x="240" y="114" width="40" height="16" className="cpa-park" />
  </>),
  land: (<>
    <path d="M10 130 Q90 104 180 116 T350 108 V130Z" className="cpa-field" />
    <path d="M40 124 L320 112" className="cpa-edge" />
    <path d="M40 124 L60 96 L300 90 L320 112" className="cpa-edge" />
    <circle cx="80" cy="102" r="12" className="cpa-tree" /><circle cx="270" cy="96" r="14" className="cpa-tree" />
    <path d="M180 60 V96" className="cpa-pin" /><circle cx="180" cy="56" r="8" className="cpa-pinhead" />
  </>),
  leisure: (<>
    <rect x="70" y="56" width="200" height="74" className="cpa-clad" />
    <path d="M60 56L170 24L280 56Z" className="cpa-roofsolid" />
    {[90, 140, 190, 240].map((x) => <rect key={x} x={x - 10} y="72" width="22" height="26" className="cpa-glass" />)}
    <rect x="160" y="100" width="22" height="30" className="cpa-door" />
    <circle cx="310" cy="110" r="14" className="cpa-tree" /><rect x="296" y="122" width="30" height="8" className="cpa-park" />
  </>),
};

export default function TypeExplorer() {
  const [i, setI] = useState(0);
  const rowRef = useRef(null);
  const t = CP_TYPES[i];
  const pkg = CP_PACKAGES.find((p) => p.id === t.pkg);

  useEffect(() => {
    const row = rowRef.current; const b = row?.children[i];
    if (b) row.scrollTo({ left: b.offsetLeft - row.clientWidth / 2 + b.clientWidth / 2, behavior: "smooth" });
  }, [i]);
  const go = (d) => setI((v) => Math.min(CP_TYPES.length - 1, Math.max(0, v + d)));

  return (
    <div className="cp-types">
      <div className="ea-finder-bar">
        <button type="button" className="ea-arrow" onClick={() => go(-1)} disabled={i === 0} aria-label="Previous type">‹</button>
        <div className="ea-types" ref={rowRef} role="tablist" aria-label="Commercial property type">
          {CP_TYPES.map((x, n) => (
            <button key={x.id} type="button" role="tab" aria-selected={n === i} className={n === i ? "on" : undefined} onClick={() => setI(n)}>
              <b>{x.name}</b><small>{x.sub}</small>
            </button>
          ))}
        </div>
        <button type="button" className="ea-arrow" onClick={() => go(1)} disabled={i === CP_TYPES.length - 1} aria-label="Next type">›</button>
      </div>

      <div className="cp-type" role="tabpanel" key={t.id}>
        <figure className="cp-art">
          <svg viewBox="0 0 360 150" role="img" aria-label={`Drawing of ${t.name.toLowerCase()}`}>
            <rect x="0" y="0" width="360" height="150" className="cpa-sky" />
            {ART[t.id]}
            <path d="M0 130H360" className="cpa-ground" />
          </svg>
        </figure>
        <div className="cp-type-info">
          <h3>{t.name}</h3>
          <p className="cp-need">{t.need}</p>
          <p className="ea-kicker">THE SHOT LIST</p>
          <ul className="cp-chips">{t.shots.map((s, n) => <li key={s} style={{ "--n": n }}>{s}</li>)}</ul>
          <p><b>Inside:</b> {t.inside}</p>
          <div className="cp-type-foot">
            <span>Usual package: <b>{pkg?.name}</b> from <b>{money(pkg?.price || 0)}</b></span>
            <a className="btn btn-orange btn-small" href="#cp-pricing">See packages</a>
          </div>
        </div>
      </div>
    </div>
  );
}
