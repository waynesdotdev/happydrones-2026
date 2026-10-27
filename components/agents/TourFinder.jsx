"use client";
/* Tour finder: pick a property type (swipe the row or use the arrows) and see
   the floor plan, the interior tour route, which kit flies it, and the package
   and starting price it usually needs. Data: TOUR_TYPES in lib/agents.js. */
import { useEffect, useRef, useState } from "react";
import KitIcon from "@/components/KitIcon";
import { TOUR_TYPES, TOUR_LABELS, pkgFrom } from "@/lib/agents";
import { money, kitById } from "@/lib/site";

const PKG_NAMES = { aerial: "Aerial only", essentials: "Essentials", showcase: "Showcase", signature: "Signature" };

export default function TourFinder() {
  const [i, setI] = useState(2);
  const [reduce, setReduce] = useState(false);
  const rowRef = useRef(null);
  const t = TOUR_TYPES[i];
  const tour = TOUR_LABELS[t.tour];
  const kit = kitById(tour.kit);
  const routeColor = t.tour === "pocket" ? "#FFC15E" : "#FF6B35";

  useEffect(() => { setReduce(matchMedia("(prefers-reduced-motion: reduce)").matches); }, []);
  useEffect(() => {
    const row = rowRef.current; const btn = row?.children[i];
    if (btn) row.scrollTo({ left: btn.offsetLeft - row.clientWidth / 2 + btn.clientWidth / 2, behavior: "smooth" });
  }, [i]);

  const pick = () => window.dispatchEvent(new CustomEvent("ea-pick", { detail: { pkg: t.pkg, size: t.size } }));
  const go = (d) => setI((v) => Math.min(TOUR_TYPES.length - 1, Math.max(0, v + d)));

  return (
    <div className="ea-finder">
      <div className="ea-finder-bar">
        <button type="button" className="ea-arrow" onClick={() => go(-1)} disabled={i === 0} aria-label="Smaller property">‹</button>
        <div className="ea-types" ref={rowRef} role="tablist" aria-label="Property type">
          {TOUR_TYPES.map((x, n) => (
            <button key={x.id} type="button" role="tab" aria-selected={n === i} className={n === i ? "on" : undefined} onClick={() => setI(n)}>
              <b>{x.name}</b><small>{x.beds}</small>
            </button>
          ))}
        </div>
        <button type="button" className="ea-arrow" onClick={() => go(1)} disabled={i === TOUR_TYPES.length - 1} aria-label="Larger property">›</button>
      </div>
      <input className="ea-range" type="range" min="0" max={TOUR_TYPES.length - 1} value={i} onChange={(e) => setI(+e.target.value)}
        aria-label="Property size, small to large" aria-valuetext={t.name} style={{ "--p": `${(i / (TOUR_TYPES.length - 1)) * 100}%` }} />

      <div className="ea-finder-main" role="tabpanel">
        <figure className="ea-plan">
          <svg viewBox="-30 -30 480 320" role="img" aria-label={`Floor plan of a ${t.name.toLowerCase()} with the ${tour.short.toLowerCase()} route`}>
            {/* outside: aerial orbit */}
            <rect x="-14" y="-14" width="448" height="288" rx="18" className="ea-orbit" />
            {!reduce && (
              <g className="ea-drone-out"><circle r="7" /><animateMotion dur="14s" repeatCount="indefinite" path="M-14,-14 H434 V274 H-14 Z" /></g>
            )}
            <text x="0" y="-19" className="ea-plan-note">AERIALS · DJI MINI 4 PRO</text>
            {/* rooms */}
            {t.plan.map(([x, y, w, h, label]) => (
              <g key={label}>
                <rect x={x} y={y} width={w} height={h} className="ea-room" />
                <text x={x + 9} y={y + 19} className="ea-room-lbl">{label}</text>
              </g>
            ))}
            {/* interior route */}
            {t.tour !== "aerial" && (
              <>
                <path key={t.id} d={t.route} className="ea-route" style={{ stroke: routeColor }} />
                {!reduce && <circle r="6" fill={routeColor}><animateMotion key={t.id} dur="7s" repeatCount="indefinite" path={t.route} /></circle>}
              </>
            )}
            {t.tour === "aerial" && <path d={t.route} className="ea-route" style={{ stroke: "#FF6B35", strokeDasharray: "8 7" }} />}
          </svg>
          <figcaption>
            <span><i style={{ background: "#FFC15E" }} />Pocket 3 glide</span>
            <span><i className="ea-key-out" />Aerial orbit</span>
          </figcaption>
        </figure>

        <div className="ea-finder-info" aria-live="polite">
          <p className="ea-kicker">{t.name.toUpperCase()} · {t.beds.toUpperCase()}</p>
          <div className="ea-tour">
            <span className="ea-tour-icon"><KitIcon id={tour.kit} /></span>
            <div><small>Interior tour</small><b>{tour.name}</b></div>
          </div>
          <p>{t.inside}</p>
          <dl className="ea-facts">
            <div><dt>Usual package</dt><dd>{PKG_NAMES[t.pkg]}</dd></div>
            <div><dt>From</dt><dd>{money(pkgFrom(t.pkg, t.size))}</dd></div>
            <div><dt>Time on site</dt><dd>{t.time}</dd></div>
            <div><dt>Aerials</dt><dd>{kit ? "Mini 4 Pro" : ""}</dd></div>
          </dl>
          <p className="ea-aerial"><b>Outside:</b> {t.aerial}</p>
          <p className="ea-note">{t.note}</p>
          <a className="btn btn-orange" href="#builder" onClick={pick}>Build this package</a>
        </div>
      </div>
    </div>
  );
}
