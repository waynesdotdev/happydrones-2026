"use client";
/* Scroll-driven flyover: the camera starts at the frontage of an industrial unit
   and rises as you scroll, labelling each shot a commercial listing needs, until
   the whole site sits in its surroundings. Shots: CP_REVEAL in lib/cproperty.js. */
import { useEffect, useRef, useState } from "react";
import { drawUnit } from "@/lib/isoUnit";
import { CP_REVEAL } from "@/lib/cproperty";

export default function FlyoverReveal() {
  const wrapRef = useRef(null);
  const cvRef = useRef(null);
  const [p, setP] = useState(0);
  const pRef = useRef(0);
  const size = useRef({ W: 0, H: 0 });

  const stageAt = (v) => CP_REVEAL.reduce((a, s, i) => (v >= s.at ? i : a), 0);
  const paint = (v) => {
    const cv = cvRef.current; const { W, H } = size.current;
    if (cv && W) drawUnit(cv.getContext("2d"), W, H, v, stageAt(v));
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
        if (Math.abs(v - pRef.current) > 0.002) { pRef.current = v; setP(v); paint(v); }
      });
    };
    addEventListener("scroll", on, { passive: true }); on();
    return () => { removeEventListener("scroll", on); cancelAnimationFrame(raf); };
  }, []);

  const idx = stageAt(p);
  const cur = CP_REVEAL[idx];
  const alt = Math.round(4 + p * 116);

  return (
    <section className="cx-scroll" ref={wrapRef} aria-labelledby="cp-fly-title">
      <div className="cx-sticky">
        <div className="wrap cx-scroll-in">
          <div className="cx-scroll-copy">
            <span className="t-tag">Scroll to fly up</span>
            <h2 id="cp-fly-title">Every shot an occupier asks for.</h2>
            <div className="cx-stage" key={idx}>
              <p className="cx-stage-kicker t-mono">SHOT {String(idx + 1).padStart(2, "0")} OF {CP_REVEAL.length} · ALT {alt} M</p>
              <h3>{cur.t}</h3>
              <p>{cur.d}</p>
            </div>
            <ol className="cp-shots" aria-label="Shot list">
              {CP_REVEAL.map((s, i) => <li key={s.t} className={i < idx ? "done" : i === idx ? "on" : undefined}>{s.t}</li>)}
            </ol>
          </div>
          <figure className="cx-scroll-stage t-frame">
            <canvas ref={cvRef} role="img" aria-label={`Illustration of an industrial unit from ${alt} metres, showing ${cur.t.toLowerCase()}`} />
            <figcaption className="cx-scroll-cap">
              <span className="t-mono">ALT {String(alt).padStart(3, "0")} M</span>
              <span className="cx-scroll-track" aria-hidden="true"><i style={{ width: `${Math.round(p * 100)}%` }} /></span>
              <span className="t-mono">120 M</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
