"use client";
/* Interactive pieces for the FPV fly-through page:
   HeroDive (a looping first-person dive from room to room),
   RouteScroll (scroll flies the route across the floor plan, with the view alongside),
   HazardSpotter (tap the plan to find what gets cleared before flying).
   Words and the route: lib/fpv.js. */
import { useEffect, useRef, useState } from "react";
import RoomScene from "@/components/photo/RoomScene";
import DuskHouse from "@/components/photo/DuskHouse";
import { HouseCanvas } from "@/components/aerial/AerialBits";
import { FPV_ROUTE, FPV_SEGMENTS, FPV_ROOMS, FPV_HAZARDS } from "@/lib/fpv";

function View({ scene, cover = true }) {
  if (scene === "house" || scene === "door") return <DuskHouse t={0.05} cover={cover} />;
  if (scene === "aerial") return <HouseCanvas scene={{ cam: { x: 7, y: 2, z: 2, zoom: 1.2 } }} ratio={0.5625} />;
  const room = scene === "garden" ? "kitchen" : scene;
  return <RoomScene room={room} cover={cover} />;
}

/* ---------- Hero: dive through the house ---------- */
const DIVE = [
  { scene: "house", origin: "50% 76%", tag: "00:02 · FRONT DOOR" },
  { scene: "living", origin: "88% 62%", tag: "00:14 · LIVING ROOM" },
  { scene: "kitchen", origin: "50% 42%", tag: "00:31 · KITCHEN" },
  { scene: "aerial", origin: "50% 50%", tag: "00:52 · UP OVER THE GARDEN", rise: true },
];
export function HeroDive() {
  const [i, setI] = useState(0);
  const [still, setStill] = useState(false);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { setStill(true); return; }
    const id = setInterval(() => setI((v) => (v + 1) % DIVE.length), 2800);
    return () => clearInterval(id);
  }, []);
  const d = DIVE[i];
  return (
    <div className="fpv-hero" role="img" aria-label="Illustration: a one-take FPV flight from the front door, through the living room and kitchen, and up over the garden">
      <div key={i} className={`fpv-dive${d.rise ? " rise" : ""}${still ? " still" : ""}`} style={{ transformOrigin: d.origin }}>
        <View scene={d.scene} />
      </div>
      <div className="fpv-hud" aria-hidden="true">
        <span className="fpv-rec">● TAKE 3 · ONE SHOT</span>
        <span className="fpv-tag">{d.tag}</span>
        <i className="fpv-cross" />
        <span className="fpv-nocut">NO CUTS</span>
      </div>
    </div>
  );
}

/* ---------- Scroll flies the route ---------- */
export function RouteScroll() {
  const wrapRef = useRef(null);
  const pathRef = useRef(null);
  const [p, setP] = useState(0);
  const [pt, setPt] = useState({ x: 290, y: 505, a: -90, L: 1 });
  useEffect(() => {
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = wrapRef.current.getBoundingClientRect(); const travel = r.height - innerHeight;
        const v = travel > 0 ? Math.min(1, Math.max(0, -r.top / travel)) : 0;
        setP(v);
        const path = pathRef.current; if (!path) return;
        const L = path.getTotalLength(); const at = Math.min(L - 1, v * L);
        const a = path.getPointAtLength(at), b = path.getPointAtLength(Math.min(L, at + 2));
        setPt({ x: a.x, y: a.y, a: (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI, L });
      });
    };
    addEventListener("scroll", on, { passive: true }); on();
    return () => { removeEventListener("scroll", on); cancelAnimationFrame(raf); };
  }, []);
  const idx = FPV_SEGMENTS.reduce((acc, s, n) => (p >= s.at ? n : acc), 0);
  const seg = FPV_SEGMENTS[idx];
  const next = FPV_SEGMENTS[idx + 1];
  const k = Math.min(1, (p - seg.at) / ((next ? next.at : 1) - seg.at));
  const rise = seg.scene === "aerial";
  const scale = rise ? 2.2 - 1.2 * k : seg.scene === "door" ? 1.6 + 1.6 * k : 1 + 0.6 * k;
  const secs = Math.round(p * 62);
  return (
    <section className="cx-scroll fpv-scroll" ref={wrapRef} aria-labelledby="fpv-route-title">
      <div className="cx-sticky">
        <div className="wrap fpv-scroll-in">
          <div className="fpv-plan-col">
            <span className="t-tag">Scroll to fly the route</span>
            <h2 id="fpv-route-title">One take, planned to the metre.</h2>
            <figure className="fpv-plan t-frame">
              <svg viewBox="0 0 600 520" aria-label="Floor plan with the flight route">
                <rect width="600" height="520" className="fpv-bg" />
                <rect x="40" y="20" width="520" height="90" rx="6" className="fpv-garden" /><text x="56" y="44" className="fpv-lbl">GARDEN</text>
                <rect x="250" y="430" width="80" height="90" className="fpv-drive" /><text x="340" y="500" className="fpv-lbl">DRIVE</text>
                {FPV_ROOMS.map(([x, y, w, h, n]) => <g key={n}><rect x={x} y={y} width={w} height={h} className="fpv-room" /><text x={x + 10} y={y + 22} className="fpv-name">{n}</text></g>)}
                <rect x="270" y="414" width="40" height="12" className="fpv-gap" /><rect x="330" y="114" width="90" height="12" className="fpv-gap" />
                <path d={FPV_ROUTE} className="fpv-route-ghost" />
                <path ref={pathRef} d={FPV_ROUTE} className="fpv-route" style={{ strokeDasharray: pt.L, strokeDashoffset: pt.L * (1 - p) }} />
                <g transform={`translate(${pt.x} ${pt.y}) rotate(${pt.a + 90})`} className="fpv-drone">
                  <path d="M0 -40 L-26 -4 L26 -4 Z" className="fpv-fov" />
                  <rect x="-11" y="-11" width="22" height="22" rx="7" />
                  {[[-11, -11], [11, -11], [11, 11], [-11, 11]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="7" />)}
                </g>
              </svg>
            </figure>
          </div>
          <div className="fpv-view-col">
            <figure className="fpv-view t-frame">
              <div className="fpv-view-in" key={seg.scene} style={{ transform: `scale(${scale})`, transformOrigin: seg.origin }}><View scene={seg.scene} /></div>
              <div className="fpv-hud" aria-hidden="true">
                <span className="fpv-rec">● 00:{String(secs).padStart(2, "0")}</span>
                <span className="fpv-tag">ALT ~{seg.alt} M</span>
                <i className="fpv-cross" />
              </div>
            </figure>
            <div className="cx-stage fpv-stage" key={idx}>
              <p className="cx-stage-kicker t-mono">SEGMENT {idx + 1} OF {FPV_SEGMENTS.length}</p>
              <h3>{seg.t}</h3>
              <p>{seg.d}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Spot the hazards ---------- */
export function HazardSpotter() {
  const [found, setFound] = useState([]);
  const [open, setOpen] = useState(null);
  const tap = (id) => { setOpen(id); setFound((f) => (f.includes(id) ? f : [...f, id])); };
  const cur = FPV_HAZARDS.find((h) => h.id === open);
  const all = found.length === FPV_HAZARDS.length;
  return (
    <div className="fpv-haz">
      <figure className="fpv-haz-fig">
        <svg viewBox="0 0 600 520" aria-label="Floor plan with hazards to find">
          <rect width="600" height="520" className="fpv-bg" />
          <rect x="40" y="20" width="520" height="90" rx="6" className="fpv-garden" />
          {FPV_ROOMS.map(([x, y, w, h, n]) => <g key={n}><rect x={x} y={y} width={w} height={h} className="fpv-room" /><text x={x + 10} y={y + 22} className="fpv-name">{n}</text></g>)}
          <path d={FPV_ROUTE} className="fpv-route-ghost on" />
          {FPV_HAZARDS.map((h) => {
            const got = found.includes(h.id);
            return (
              <g key={h.id} className={`fpv-hz${got ? " got" : ""}${open === h.id ? " open" : ""}`} role="button" tabIndex={0} aria-label={got ? h.t : "Hidden hazard"}
                onClick={() => tap(h.id)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); tap(h.id); } }}>
                <circle cx={h.x} cy={h.y} r="22" className="ring" />
                <circle cx={h.x} cy={h.y} r="13" className="dot" />
                <text x={h.x} y={h.y + 5} textAnchor="middle">{got ? "✓" : "?"}</text>
              </g>
            );
          })}
        </svg>
      </figure>
      <div className="fpv-haz-side">
        <p className="fpv-haz-count"><b>{found.length}</b> of {FPV_HAZARDS.length} found</p>
        <div className="fpv-haz-card" key={open || "none"} aria-live="polite">
          {cur ? <><h3>{cur.t}</h3><p>{cur.d}</p></> : <><h3>Tap the question marks</h3><p>Each one is something that gets sorted before the drone leaves the ground. Find all seven.</p></>}
        </div>
        <ul className="fpv-haz-list">
          {FPV_HAZARDS.map((h) => <li key={h.id} className={found.includes(h.id) ? "got" : undefined}><button type="button" onClick={() => tap(h.id)}>{found.includes(h.id) ? h.t : "?"}</button></li>)}
        </ul>
        {all ? <p className="fpv-haz-done">All clear. That&apos;s the walk-round done before every flight.</p>
          : <button type="button" className="t-btn t-btn-ghost" onClick={() => setFound(FPV_HAZARDS.map((h) => h.id))}>Show them all</button>}
      </div>
    </div>
  );
}
