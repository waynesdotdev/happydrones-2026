"use client";
/* Scroll-driven shoot: as you scroll, the shoot moves from the front of the
   house, through each room, up into the air and on to the dusk shot. The big
   picture shows the photo; the floor plan in the corner shows where the camera
   stood and which way it pointed. Shots: PP_SHOTS in lib/propertyPhoto.js. */
import { useEffect, useRef, useState } from "react";
import RoomScene from "@/components/photo/RoomScene";
import DuskHouse from "@/components/photo/DuskHouse";
import { drawHouse } from "@/lib/isoHouse";
import { PP_SHOTS, PP_PLAN } from "@/lib/propertyPhoto";

function Aerial() {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current; const ctx = cv.getContext("2d");
    const draw = () => {
      const r = cv.getBoundingClientRect(); if (!r.width) return;
      const dpr = Math.min(2, devicePixelRatio || 1); const W = r.width, H = r.width * 0.65;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawHouse(ctx, W, H, { cam: { x: 8, y: 4, z: 0, zoom: 0.92 } });
    };
    const ro = new ResizeObserver(draw); ro.observe(cv); draw();
    return () => ro.disconnect();
  }, []);
  return <canvas ref={ref} role="img" aria-label="Illustration: the house, garden and plot from the drone" />;
}

function Plan({ cam }) {
  const [x, y, a, where] = cam;
  const r = 64, half = 32;
  const f = (v) => Math.round(v * 10) / 10; // rounded so the server and browser draw the same numbers
  const p1 = [f(x + r * Math.cos(((a - half) * Math.PI) / 180)), f(y + r * Math.sin(((a - half) * Math.PI) / 180))];
  const p2 = [f(x + r * Math.cos(((a + half) * Math.PI) / 180)), f(y + r * Math.sin(((a + half) * Math.PI) / 180))];
  const aerial = where === "out" && a === 90;
  return (
    <svg viewBox="0 0 420 210" aria-hidden="true">
      <text x="10" y="20" className="pp-plan-lbl">GROUND</text><text x="220" y="20" className="pp-plan-lbl">FIRST</text>
      {[...PP_PLAN.g, ...PP_PLAN.f].map(([rx, ry, w, h, n]) => (
        <g key={n}><rect x={rx} y={ry} width={w} height={h} className="pp-plan-room" /><text x={rx + 6} y={ry + 15} className="pp-plan-name">{n}</text></g>
      ))}
      {aerial
        ? <rect x="2" y="24" width="416" height="154" rx="8" className="pp-plan-aerial" />
        : <g><path d={`M${x} ${y} L${p1[0]} ${p1[1]} A${r} ${r} 0 0 1 ${p2[0]} ${p2[1]} Z`} className="pp-plan-cone" /><circle cx={x} cy={y} r="7" className="pp-plan-cam" /></g>}
    </svg>
  );
}

export default function ShotScroll() {
  const wrapRef = useRef(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = wrapRef.current.getBoundingClientRect();
        const travel = r.height - innerHeight;
        setP(travel > 0 ? Math.min(1, Math.max(0, -r.top / travel)) : 0);
      });
    };
    addEventListener("scroll", on, { passive: true }); on();
    return () => { removeEventListener("scroll", on); cancelAnimationFrame(raf); };
  }, []);

  const idx = PP_SHOTS.reduce((a, s, i) => (p >= s.at ? i : a), 0);
  const cur = PP_SHOTS[idx];
  const last = idx === PP_SHOTS.length - 1;
  // on the last stop the sky darkens as you keep scrolling
  const duskT = last ? 0.35 + 0.65 * Math.min(1, (p - cur.at) / (0.97 - cur.at)) : cur.scene.t;
  const sc = cur.scene;

  return (
    <section className="cx-scroll pp-scroll" ref={wrapRef} aria-labelledby="pp-scroll-title">
      <div className="cx-sticky">
        <div className="wrap cx-scroll-in">
          <div className="cx-scroll-copy">
            <span className="t-tag">Scroll through a shoot</span>
            <h2 id="pp-scroll-title">Every photo, planned.</h2>
            <div className="cx-stage" key={idx}>
              <p className="cx-stage-kicker t-mono">{cur.tag}</p>
              <h3>{cur.t}</h3>
              <p>{cur.d}</p>
              <ul className="pp-tips">{cur.tips.map((x) => <li key={x}>{x}</li>)}</ul>
            </div>
          </div>
          <figure className="cx-scroll-stage t-frame pp-stage">
            <div className="pp-shot" key={sc.kind + (sc.room || "")}>
              {sc.kind === "room" && <RoomScene room={sc.room} />}
              {sc.kind === "house" && <DuskHouse t={duskT} />}
              {sc.kind === "aerial" && <Aerial />}
              <span className="pp-shot-tag t-mono">{cur.tag}</span>
              <div className="pp-plan">{<Plan cam={cur.cam} />}</div>
            </div>
            <figcaption className="cx-scroll-cap">
              <span className="t-mono">{String(idx + 1).padStart(2, "0")} / {String(PP_SHOTS.length).padStart(2, "0")}</span>
              <span className="cx-scroll-track" aria-hidden="true"><i style={{ width: `${Math.round(p * 100)}%` }} /></span>
              <span className="t-mono">{last ? "BLUE HOUR" : "ABOUT 1 HOUR"}</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
