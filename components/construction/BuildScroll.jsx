"use client";
/* Scroll-driven build: as you scroll through this section the isometric site
   builds from bare plot to handover, with the stage, month and trade progress
   updating alongside. Stages live in BUILD_STAGES (lib/construction.js). */
import { useEffect, useRef, useState } from "react";
import { drawBuild } from "@/lib/isoBuild";
import { BUILD_STAGES, TRADES } from "@/lib/construction";

const lerp = (a, b, k) => a + (b - a) * k;

export default function BuildScroll() {
  const wrapRef = useRef(null);
  const cvRef = useRef(null);
  const [p, setP] = useState(0);
  const pRef = useRef(0);
  const sizeRef = useRef({ W: 0, H: 0 });

  // canvas sizing + drawing
  useEffect(() => {
    const cv = cvRef.current; const ctx = cv.getContext("2d");
    const resize = () => {
      const r = cv.getBoundingClientRect(); const dpr = Math.min(2, devicePixelRatio || 1);
      sizeRef.current = { W: r.width, H: r.width * 11 / 16 };
      cv.width = Math.round(r.width * dpr); cv.height = Math.round(sizeRef.current.H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const { W, H } = sizeRef.current; if (W) drawBuild(ctx, W, H, pRef.current, { points: true, label: "CP · ALL POSITIONS" });
    };
    const ro = new ResizeObserver(resize); ro.observe(cv); resize();
    return () => ro.disconnect();
  }, []);

  // scroll -> progress
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = wrapRef.current; if (!el) return;
        const r = el.getBoundingClientRect();
        const travel = r.height - innerHeight;
        const k = travel > 0 ? Math.min(1, Math.max(0, -r.top / travel)) : 0;
        if (Math.abs(k - pRef.current) > 0.002) {
          pRef.current = k; setP(k);
          const cv = cvRef.current; const { W, H } = sizeRef.current;
          if (cv && W) drawBuild(cv.getContext("2d"), W, H, k, { points: true, label: "CP · ALL POSITIONS" });
        }
      });
    };
    addEventListener("scroll", onScroll, { passive: true }); onScroll();
    return () => { removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  // current stage and interpolated trade progress
  const idx = BUILD_STAGES.reduce((a, s, i) => (p >= s.at ? i : a), 0);
  const cur = BUILD_STAGES[idx];
  const nxt = BUILD_STAGES[idx + 1];
  const k = nxt ? Math.min(1, (p - cur.at) / (nxt.at - cur.at)) : 1;
  const month = Math.max(1, Math.round(1 + p * 13));

  return (
    <section className="cx-scroll" ref={wrapRef} aria-labelledby="cx-scroll-title">
      <div className="cx-sticky">
        <div className="wrap cx-scroll-in">
          <div className="cx-scroll-copy">
            <span className="t-tag">Scroll through a 14-month build</span>
            <h2 id="cx-scroll-title">The record builds itself.</h2>
            <div className="cx-stage" key={idx}>
              <p className="cx-stage-kicker t-mono">MONTH {String(cur.month).padStart(2, "0")} · {cur.use.toUpperCase()}</p>
              <h3>{cur.title}</h3>
              <p>{cur.text}</p>
            </div>
            <ul className="cx-trades" aria-label="Progress by trade">
              {TRADES.map((t) => {
                const v = Math.round(lerp(cur.trades[t.id], nxt ? nxt.trades[t.id] : cur.trades[t.id], k));
                return (
                  <li key={t.id}>
                    <span>{t.name}</span>
                    <span className="cx-bar" aria-hidden="true"><i style={{ width: `${v}%` }} /></span>
                    <b className="t-mono">{v}%</b>
                  </li>
                );
              })}
            </ul>
            <ol className="cx-dots" aria-label="Build stages">
              {BUILD_STAGES.map((s, i) => <li key={s.month} className={i <= idx ? "on" : undefined}><span className="t-mono">M{String(s.month).padStart(2, "0")}</span></li>)}
            </ol>
          </div>
          <figure className="cx-scroll-stage t-frame">
            <canvas ref={cvRef} role="img" aria-label={`Isometric construction site, month ${month} of 14: ${cur.title}`} />
            <figcaption className="cx-scroll-cap">
              <span className="t-mono">VISIT {String(month).padStart(2, "0")} / 14</span>
              <span className="cx-scroll-track" aria-hidden="true"><i style={{ width: `${Math.round(p * 100)}%` }} /></span>
              <span className="t-mono">A · B · C · D</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
