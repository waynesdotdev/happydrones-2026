"use client";
/* Interactive pieces for the aerial photography page:
   HouseCanvas (shared), HeroOrbit, HeightSlider, AnnotateAerial, StreetVsAir, ShotRail.
   Words: lib/aerial.js. Drawing: lib/isoHouse.js. */
import { useEffect, useRef, useState } from "react";
import { drawHouse } from "@/lib/isoHouse";
import DuskHouse from "@/components/photo/DuskHouse";
import { AE_HEIGHTS, AE_LAYERS, AE_SHOTS } from "@/lib/aerial";

const lerp = (a, b, k) => a + (b - a) * k;

/* A canvas that draws the house scene and redraws when the scene changes. */
export function HouseCanvas({ scene, ratio = 11 / 16, label }) {
  const ref = useRef(null);
  const sc = useRef(scene); sc.current = scene;
  const draw = () => {
    const cv = ref.current; if (!cv) return;
    const r = cv.getBoundingClientRect(); if (!r.width) return;
    const dpr = Math.min(2, devicePixelRatio || 1); const W = r.width, H = r.width * ratio;
    if (cv.width !== Math.round(W * dpr)) { cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); }
    const ctx = cv.getContext("2d"); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawHouse(ctx, W, H, sc.current);
    if (sc.current.warm) { ctx.fillStyle = "rgba(255,160,80,0.2)"; ctx.fillRect(0, 0, W, H); }
  };
  useEffect(() => { const ro = new ResizeObserver(draw); ro.observe(ref.current); draw(); return () => ro.disconnect(); }, []);
  useEffect(draw, [scene]);
  return <canvas ref={ref} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true} style={{ aspectRatio: `${1 / ratio}` }} />;
}

/* Hero: the drone orbits high over the plot, which is outlined. */
export function HeroOrbit() {
  const [t, setT] = useState(0.1);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0, last = performance.now();
    const step = (now) => { setT((v) => (v + (now - last) / 20000) % 1); last = now; raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step); return () => cancelAnimationFrame(raf);
  }, []);
  const a = t * Math.PI * 2;
  const scene = { cam: { x: 7, y: 5, z: 1, zoom: 0.9 + 0.12 * Math.sin(a) }, context: true, boundary: true,
    drone: { x: 7.5 + Math.cos(a) * 11, y: 4.5 + Math.sin(a) * 8, z: 16 }, look: { x: 7.5, y: 4.5, z: 2 }, tag: "HD-AE · HERO AERIAL · ILLUSTRATION" };
  return <HouseCanvas scene={scene} label="Illustration: a drone circling high above a house with its plot outlined in orange" />;
}

/* Drag the height from 5 m to 120 m. */
export function HeightSlider() {
  const [v, setV] = useState(1); // 0..4 along the stops, fractional while dragging
  const i = Math.min(AE_HEIGHTS.length - 2, Math.floor(v)); const k = v - i;
  const A = AE_HEIGHTS[i], B = AE_HEIGHTS[i + 1];
  const alt = Math.round(Math.exp(lerp(Math.log(A.alt), Math.log(B.alt), k)));
  const zoom = Math.exp(lerp(Math.log(A.zoom), Math.log(B.zoom), k));
  const cam = { x: lerp(A.tgt.x, B.tgt.x, k), y: lerp(A.tgt.y, B.tgt.y, k), z: lerp(A.tgt.z, B.tgt.z, k), zoom };
  const near = AE_HEIGHTS[Math.round(v)];
  return (
    <div className="ae-height">
      <figure className="ae-height-fig t-frame">
        <HouseCanvas scene={{ cam, context: true, boundary: v >= 1.6 }} label={`Illustration: the house and area seen from ${alt} metres`} />
        <div className="ae-alt" aria-hidden="true"><b>{alt}</b><small>METRES</small></div>
      </figure>
      <div className="ae-height-ctrl">
        <div className="ae-gauge">
          <input type="range" min="0" max={AE_HEIGHTS.length - 1} step="0.01" value={v} onChange={(e) => setV(+e.target.value)} aria-label="Drone height" aria-valuetext={`${alt} metres`} />
          <div className="ae-gauge-marks" aria-hidden="true">{AE_HEIGHTS.map((h, n) => <button key={h.alt} type="button" tabIndex={-1} style={{ left: `${(n / (AE_HEIGHTS.length - 1)) * 100}%` }} onClick={() => setV(n)}>{h.alt} m</button>)}</div>
        </div>
        <div className="ae-height-read" key={near.alt} aria-live="polite">
          <p className="t-mono">AT ABOUT {near.alt} M</p>
          <h3>{near.t}</h3>
          <p>{near.d}</p>
        </div>
      </div>
    </div>
  );
}

/* Hero aerial with switchable annotations. */
function pill(ctx, x, y, text, color = "#FF6B35") {
  ctx.font = "700 13px 'Blinker', sans-serif"; const w = ctx.measureText(text).width + 18;
  ctx.fillStyle = "rgba(0,26,51,0.9)"; ctx.fillRect(x, y - 14, w, 26);
  ctx.fillStyle = color; ctx.fillRect(x, y - 14, 4, 26);
  ctx.fillStyle = "#F2F6FB"; ctx.fillText(text, x + 11, y + 4);
}
export function AnnotateAerial() {
  const [on, setOn] = useState({ plot: true, garden: true, parking: false, nearby: false });
  const flip = (id) => setOn((s) => ({ ...s, [id]: !s[id] }));
  const overlay = (ctx, iso, s) => {
    if (on.garden) {
      const [gx, gy] = iso(6, -2.5, 0.1); pill(ctx, gx - 60, gy, "SOUTH-FACING GARDEN", "#4ADE80");
      const nx = ctx.canvas.clientWidth - 46, ny = 48; // north arrow, top-right corner
      ctx.save(); ctx.translate(nx, ny); ctx.strokeStyle = "#F2F6FB"; ctx.fillStyle = "#F2F6FB"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(0, 0, 22, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-14, 7); ctx.lineTo(0, 7 - 22); ctx.lineTo(14, 7); ctx.closePath(); ctx.globalAlpha = 0.9; ctx.fill(); ctx.globalAlpha = 1;
      ctx.font = "800 14px 'Blinker', sans-serif"; ctx.textAlign = "center"; ctx.fillText("N", 0, 42); ctx.restore(); ctx.textAlign = "left";
    }
    if (on.parking) {
      const [px, py] = iso(16, 11, 1); pill(ctx, px + 10, py, "DRIVEWAY · 2 CARS", "#FFC15E");
      const [sx, sy] = iso(30, 16, 0); pill(ctx, sx, sy, "ON-STREET PARKING", "#FFC15E");
    }
    if (on.nearby) {
      const [ax, ay] = iso(-40, 44, 0); pill(ctx, ax, ay, "PARK · 2 MIN WALK", "#6FA6DC");
      const [bx, by] = iso(40, 17, 0); pill(ctx, bx, by, "BUS STOP · 1 MIN", "#6FA6DC");
      const [cx2, cy2] = iso(-30, 16.75, 0); pill(ctx, cx2 - 140, cy2, "← TOWN CENTRE · 10 MIN", "#6FA6DC");
    }
    if (on.plot) { const [lx, ly] = iso(18, 13.8, 0.1); pill(ctx, lx + 6, ly + 6, "PLOT OUTLINED"); }
  };
  return (
    <div className="cp-map ae-annot">
      <figure className="cp-map-fig ae-annot-fig">
        <HouseCanvas scene={{ cam: { x: 4, y: 8, z: 0, zoom: 0.62 }, context: true, boundary: on.plot, overlay }} label="Illustration: an annotated hero aerial of a house with switchable labels" />
        <figcaption className="t-mono">HERO AERIAL · ILLUSTRATION · TOGGLE THE LABELS</figcaption>
      </figure>
      <div className="cp-layers" role="group" aria-label="Labels">
        {AE_LAYERS.map((l) => (
          <button key={l.id} type="button" aria-pressed={on[l.id]} className={on[l.id] ? "on" : undefined} onClick={() => flip(l.id)}>
            <span className="cp-switch" aria-hidden="true" /><span><b>{l.name}</b><small>{l.d}</small></span>
          </button>
        ))}
        <p>On a real listing, these are added to your best aerial photo. Tell me what you want shown: the boundary, parking, schools, the station, the view.</p>
      </div>
    </div>
  );
}

/* Drag to compare the street view with the aerial. */
export function StreetVsAir() {
  const [pos, setPos] = useState(50);
  const box = useRef(null); const dragging = useRef(false);
  const fromEvent = (e) => { const r = box.current.getBoundingClientRect(); setPos(Math.max(3, Math.min(97, ((e.clientX - r.left) / r.width) * 100))); };
  return (
    <div className="rf-gv-box ae-sva" ref={box} style={{ "--pos": `${pos}%` }}
      onPointerDown={(e) => { dragging.current = true; fromEvent(e); }} onPointerMove={(e) => dragging.current && fromEvent(e)}
      onPointerUp={() => { dragging.current = false; }} onPointerCancel={() => { dragging.current = false; }}>
      <div className="rf-gv-far" aria-hidden="true"><DuskHouse t={0.05} cover /><span className="rf-gv-lbl">FROM THE PAVEMENT</span></div>
      <div className="rf-gv-near" aria-hidden="true"><HouseCanvas scene={{ cam: { x: 7, y: 4, z: 1, zoom: 0.85 }, context: true, boundary: true }} ratio={0.625} /><span className="rf-gv-lbl rf-gv-lbl-r">FROM 30 M · THE GARDEN, THE PLOT, THE STREET</span></div>
      <div className="rf-gv-handle" aria-hidden="true"><span>‹ ›</span></div>
      <input className="rf-gv-range" type="range" min="3" max="97" value={Math.round(pos)} onChange={(e) => setPos(+e.target.value)} aria-label="Compare the street view with the aerial view" />
    </div>
  );
}

/* Sideways rail of the standard shot list, each drawn live. */
export function ShotRail() {
  const railRef = useRef(null); const drag = useRef(null); const [pos, setPos] = useState(0);
  useEffect(() => {
    const el = railRef.current; const on = () => { const max = el.scrollWidth - el.clientWidth; setPos(max > 0 ? el.scrollLeft / max : 0); };
    el.addEventListener("scroll", on, { passive: true }); on(); return () => el.removeEventListener("scroll", on);
  }, []);
  const nudge = (d) => railRef.current.scrollBy({ left: d * railRef.current.clientWidth * 0.7, behavior: "smooth" });
  const down = (e) => { if (e.pointerType !== "mouse") return; drag.current = { x: e.clientX, l: railRef.current.scrollLeft }; railRef.current.classList.add("is-drag"); };
  const move = (e) => { if (drag.current) railRef.current.scrollLeft = drag.current.l - (e.clientX - drag.current.x); };
  const up = () => { drag.current = null; railRef.current?.classList.remove("is-drag"); };
  return (
    <div className="ea-strip rf-rail ae-rail">
      <div className="ea-strip-head">
        <div className="ea-strip-track" aria-hidden="true"><i style={{ width: `${Math.max(6, Math.round(pos * 100))}%` }} /></div>
        <div className="ea-strip-btns">
          <button type="button" className="ea-arrow" onClick={() => nudge(-1)} aria-label="Previous shots">‹</button>
          <button type="button" className="ea-arrow" onClick={() => nudge(1)} aria-label="More shots">›</button>
        </div>
      </div>
      <ul className="ea-strip-rail" ref={railRef} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerLeave={up} tabIndex={0} aria-label="The standard aerial shot list. Scroll sideways.">
        {AE_SHOTS.map((s, n) => (
          <li key={s.t}>
            <div className="ae-thumb"><HouseCanvas scene={s.scene} ratio={0.62} /></div>
            <span className="ea-strip-n">{String(n + 1).padStart(2, "0")}</span>
            <b>{s.t}</b>
            <p>{s.d}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
