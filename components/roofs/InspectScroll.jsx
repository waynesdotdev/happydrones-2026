"use client";
/* Scroll-driven inspection flight: as you scroll, the drone works round the
   roof stop by stop (slopes, ridge, chimney, gutters, flat roof, verges),
   dropping a numbered pin at each, then pulls back to the marked overview.
   Stops and pins: RF_STOPS and RF_PINS in lib/roofs.js. */
import { useEffect, useRef, useState } from "react";
import { drawHouse } from "@/lib/isoHouse";
import { RF_STOPS, RF_PINS } from "@/lib/roofs";

const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const lerp = (a, b, k) => a + (b - a) * k;
const mix = (A, B, k) => ({ x: lerp(A.x, B.x, k), y: lerp(A.y, B.y, k), z: lerp(A.z, B.z, k) });
const stopAt = (v) => RF_STOPS.reduce((a, s, i) => (v >= s.at ? i : a), 0);

// Hold on each stop for most of its slot, then glide to the next.
function sceneAt(v) {
  const i = stopAt(v);
  const A = RF_STOPS[i], B = RF_STOPS[i + 1];
  let k = 0;
  if (B) { const local = (v - A.at) / (B.at - A.at); k = ease(Math.max(0, Math.min(1, (local - 0.55) / 0.45))); }
  const T = B || A;
  const cam = { ...mix(A.cam, T.cam, k), zoom: lerp(A.cam.zoom, T.cam.zoom, k) };
  let drone = null, look = null, droneAlpha = 1;
  if (A.drone && T.drone) { drone = mix(A.drone, T.drone, k); look = mix(A.look, T.look, k); }
  else if (A.drone) { drone = A.drone; look = A.look; droneAlpha = 1 - k; }
  else if (T.drone) { drone = T.drone; look = T.look; droneAlpha = k; }
  const last = i === RF_STOPS.length - 1;
  const pins = RF_PINS.filter((p) => last || p.n <= i).map((p) => ({ ...p, state: !last && p.n === i ? "on" : "done" }));
  return { cam, drone, look, droneAlpha, pins, tag: last ? "00 · OVERVIEW, MARKED" : `STOP ${String(i).padStart(2, "0")} · ${A.t.toUpperCase()}` };
}

export default function InspectScroll() {
  const wrapRef = useRef(null);
  const cvRef = useRef(null);
  const [p, setP] = useState(0);
  const pRef = useRef(0);
  const size = useRef({ W: 0, H: 0 });

  const paint = (v) => {
    const cv = cvRef.current; const { W, H } = size.current;
    if (cv && W) drawHouse(cv.getContext("2d"), W, H, sceneAt(v));
  };

  useEffect(() => {
    const cv = cvRef.current; const ctx = cv.getContext("2d");
    const resize = () => {
      const r = cv.getBoundingClientRect(); const dpr = Math.min(2, devicePixelRatio || 1);
      size.current = { W: r.width, H: r.width * 11 / 16 };
      cv.width = Math.round(r.width * dpr); cv.height = Math.round(size.current.H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); paint(pRef.current);
    };
    const ro = new ResizeObserver(resize); ro.observe(cv); resize();
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = wrapRef.current.getBoundingClientRect();
        const travel = r.height - innerHeight;
        const v = travel > 0 ? Math.min(1, Math.max(0, -r.top / travel)) : 0;
        if (Math.abs(v - pRef.current) > 0.001) { pRef.current = v; setP(v); paint(v); }
      });
    };
    addEventListener("scroll", on, { passive: true }); on();
    return () => { removeEventListener("scroll", on); cancelAnimationFrame(raf); };
  }, []);

  const idx = stopAt(p);
  const cur = RF_STOPS[idx];
  const last = idx === RF_STOPS.length - 1;

  return (
    <section className="cx-scroll rf-scroll" ref={wrapRef} aria-labelledby="rf-fly-title">
      <div className="cx-sticky">
        <div className="wrap cx-scroll-in">
          <div className="cx-scroll-copy">
            <span className="t-tag">Scroll to fly the inspection</span>
            <h2 id="rf-fly-title">How every roof gets checked.</h2>
            <div className="cx-stage" key={idx}>
              <p className="cx-stage-kicker t-mono">{last ? "YOUR PACK" : idx === 0 ? "OVERVIEW" : `STOP ${idx} OF ${RF_STOPS.length - 2}`} · ALT {cur.alt} M{cur.dist ? ` · ${cur.dist} M FROM THE ROOF` : ""}</p>
              <h3>{cur.t}</h3>
              <p>{cur.d}</p>
            </div>
            <ol className="cp-shots rf-stops" aria-label="Inspection stops">
              {RF_STOPS.slice(1, -1).map((s, n) => {
                const i = n + 1;
                return <li key={s.t} className={i < idx || last ? "done" : i === idx ? "on" : undefined}>{s.t}</li>;
              })}
            </ol>
          </div>
          <figure className="cx-scroll-stage t-frame">
            <canvas ref={cvRef} role="img" aria-label={`Illustration of a drone inspecting a house roof: ${cur.t}`} />
            <figcaption className="cx-scroll-cap">
              <span className="t-mono">ALT {String(cur.alt).padStart(2, "0")} M</span>
              <span className="cx-scroll-track" aria-hidden="true"><i style={{ width: `${Math.round(p * 100)}%` }} /></span>
              <span className="t-mono">{RF_PINS.filter((x) => last || x.n <= idx).length} / {RF_PINS.length} MARKED</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
