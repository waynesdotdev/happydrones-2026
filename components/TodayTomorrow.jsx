"use client";
/* "Today / Tomorrow": an isometric construction site you scrub through
   14 months, from bare plot to handover. It shows what a construction
   progress client gets: the same position, every visit, dated. */
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Arrow } from "./TIcons";
import { drawBuild } from "@/lib/isoBuild";

const MILESTONES = [
  { at: 0, m: 1, t: "Site cleared and set out" },
  { at: 0.16, m: 3, t: "Foundations and ground slab" },
  { at: 0.45, m: 7, t: "Frame rising, floor by floor" },
  { at: 0.66, m: 10, t: "Topped out, cladding on" },
  { at: 0.92, m: 14, t: "Landscaped and handed over" },
];

export default function TodayTomorrow() {
  const cvRef = useRef(null);
  const [p, setP] = useState(0.5);
  const pRef = useRef(0.5);
  const drawRef = useRef(() => {});

  useEffect(() => {
    const cv = cvRef.current; const ctx = cv.getContext("2d");
    let W = 0, H = 0;

    function draw() {
      if (!W) return;
      drawBuild(ctx, W, H, pRef.current);
    }
    drawRef.current = draw;

    const resize = () => { const r = cv.getBoundingClientRect(); const dpr = Math.min(2, devicePixelRatio || 1); W = r.width; H = r.width * 11 / 16; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); draw(); };
    const ro = new ResizeObserver(resize); ro.observe(cv); resize();
    return () => ro.disconnect();
  }, []);

  useEffect(() => { pRef.current = p; drawRef.current(); }, [p]);

  const month = 1 + Math.round(p * 13);
  const active = MILESTONES.reduce((a, m, i) => (p >= m.at ? i : a), 0);

  return (
    <section className="t-section t-dark" id="build" aria-labelledby="tt-title">
      <div className="wrap t-tt">
        <div className="t-tt-copy">
          <span className="t-tag">The job build · Construction progress</span>
          <h2 id="tt-title" style={{ fontSize: "var(--t-s3)" }}>Today on the left. Tomorrow on the right.</h2>
          <p className="t-lede">Every visit is flown from the same fixed positions, so month 3 lines up with month 14. Drag through a typical build and see the record your team, funders and buyers get.</p>
          <ol className="t-milestones">
            {MILESTONES.map((m, i) => (
              <li key={m.m} className={i <= active ? "t-on" : undefined}><span className="t-mono">M{String(m.m).padStart(2, "0")}</span>{m.t}</li>
            ))}
          </ol>
          <div className="t-hero-ctas"><Link className="t-btn t-btn-primary" href="/plan/?mission=construction">Price monthly visits <Arrow /></Link><Link className="t-btn t-btn-ghost" href="/construction/">How it works</Link></div>
        </div>
        <figure className="t-tt-stage t-frame" style={{ margin: 0 }}>
          <canvas ref={cvRef} role="img" aria-label={`Isometric construction site at month ${month} of 14`} />
          <figcaption className="t-tt-ctrl">
            <div className="t-tt-row"><label htmlFor="tt-range">DRAG THROUGH THE BUILD</label><b>MONTH {month} / 14</b></div>
            <input id="tt-range" className="t-slider" type="range" min="0" max="100" value={Math.round(p * 100)}
              style={{ "--p": `${Math.round(p * 100)}%` }}
              onChange={(e) => setP(+e.target.value / 100)} aria-valuetext={`Month ${month} of 14`} />
            <div className="t-tt-row"><span>TODAY</span><span>TOMORROW</span></div>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
