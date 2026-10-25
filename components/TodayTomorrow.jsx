"use client";
/* "Today / Tomorrow": an isometric construction site you scrub through
   14 months, from bare plot to handover. It shows what a construction
   progress client gets: the same position, every visit, dated. */
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Arrow } from "./TIcons";

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
    const C = {
      dirt: [92, 72, 58], grass: [36, 74, 58], slab: [120, 128, 142],
      frameTop: "#9AA6BC", frameL: "#5D6880", frameR: "#78849C",
      glassL: "#0F3A66", glassR: "#2C6FB0", glassTop: "#CFDCEA",
    };
    const mix = (a, b, k) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * k)).join(",")})`;
    const clamp = (v) => Math.max(0, Math.min(1, v));

    function draw() {
      if (!W) return;
      const prog = pRef.current;
      ctx.clearRect(0, 0, W, H);
      const s = W / 19, ox = W * 0.5, oy = H * 0.3;
      const iso = (x, y, z) => [ox + (x - y) * s * 0.866, oy + (x + y) * s * 0.5 - z * s];
      const poly = (pts, fill, stroke) => { ctx.beginPath(); pts.forEach(([x, y, z], i) => { const [a, b] = iso(x, y, z); i ? ctx.lineTo(a, b) : ctx.moveTo(a, b); }); ctx.closePath(); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.stroke(); } };
      const box = (x, y, z, w, d, h, top, left, right, stroke) => {
        poly([[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]], left, stroke);
        poly([[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]], right, stroke);
        poly([[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]], top, stroke);
      };

      // plot: dirt turning to lawn at the end
      const green = clamp((prog - 0.84) / 0.12);
      poly([[0, 0, 0], [12, 0, 0], [12, 10, 0], [0, 10, 0]], mix(C.dirt, C.grass, green));
      // plot edge grid
      ctx.strokeStyle = "rgba(127,178,229,0.14)";
      for (let i = 0; i <= 12; i += 2) { const [a, b] = iso(i, 0, 0), [c, d] = iso(i, 10, 0); ctx.beginPath(); ctx.moveTo(a, b); ctx.lineTo(c, d); ctx.stroke(); }
      for (let j = 0; j <= 10; j += 2) { const [a, b] = iso(0, j, 0), [c, d] = iso(12, j, 0); ctx.beginPath(); ctx.moveTo(a, b); ctx.lineTo(c, d); ctx.stroke(); }

      // hoarding until handover
      if (prog < 0.9) { const k = 1 - clamp((prog - 0.84) / 0.06); ctx.globalAlpha = k; box(0, 9.7, 0, 12, 0.3, 0.5, "#2A3550", "#1A2234", "#222C42"); box(11.7, 0, 0, 0.3, 9.7, 0.5, "#2A3550", "#1A2234", "#222C42"); ctx.globalAlpha = 1; }

      // groundworks / slab
      const bx = 3, by = 2.5, bw = 6, bd = 4.2;
      if (prog > 0.05) poly([[bx - 0.3, by - 0.3, 0.02], [bx + bw + 0.3, by - 0.3, 0.02], [bx + bw + 0.3, by + bd + 0.3, 0.02], [bx - 0.3, by + bd + 0.3, 0.02]], prog < 0.16 ? "rgba(70,52,40,0.9)" : mix(C.slab, C.slab, 0));

      // floors
      const FLOORS = 6, fh = 1;
      const built = clamp((prog - 0.18) / 0.45) * FLOORS;
      const clad = clamp((prog - 0.55) / 0.3) * FLOORS;
      for (let f = 0; f < Math.ceil(built); f++) {
        const partial = Math.min(1, built - f);
        const z = f * fh;
        if (f < clad) {
          const k = Math.min(1, clad - f);
          box(bx, by, z, bw, bd, fh * partial, C.glassTop, C.glassL, C.glassR, "rgba(232,236,245,0.25)");
          // window mullions
          ctx.strokeStyle = `rgba(232,236,245,${0.35 * k})`;
          for (let i = 1; i < 6; i++) { const [a, b] = iso(bx + i, by + bd, z), [c, d] = iso(bx + i, by + bd, z + fh * partial); ctx.beginPath(); ctx.moveTo(a, b); ctx.lineTo(c, d); ctx.stroke(); }
          for (let j = 1; j < 4; j++) { const [a, b] = iso(bx + bw, by + j * 1.05, z), [c, d] = iso(bx + bw, by + j * 1.05, z + fh * partial); ctx.beginPath(); ctx.moveTo(a, b); ctx.lineTo(c, d); ctx.stroke(); }
        } else {
          // open frame: slab + columns
          box(bx, by, z + fh * partial - 0.12, bw, bd, 0.12, C.frameTop, C.frameL, C.frameR);
          ctx.strokeStyle = C.frameR; ctx.lineWidth = 2;
          [[bx, by + bd], [bx + bw, by + bd], [bx + bw, by], [bx + bw / 2, by + bd], [bx + bw, by + bd / 2]].forEach(([x, y]) => { const [a, b] = iso(x, y, z), [c, d] = iso(x, y, z + fh * partial); ctx.beginPath(); ctx.moveTo(a, b); ctx.lineTo(c, d); ctx.stroke(); });
          ctx.lineWidth = 1;
        }
      }
      // roof plant once topped out
      if (built >= FLOORS - 0.01) box(bx + 1, by + 1, FLOORS * fh, 1.6, 1.2, 0.5, "#AEB8CC", "#5D6880", "#78849C");

      // tower crane
      const craneA = prog > 0.12 && prog < 0.86 ? 1 : 0;
      if (craneA) {
        const cxw = 1.4, cyw = 7.2, top = 7;
        ctx.strokeStyle = "#FF6B35"; ctx.lineWidth = 2.2;
        const [a, b] = iso(cxw, cyw, 0), [c, d] = iso(cxw, cyw, top); ctx.beginPath(); ctx.moveTo(a, b); ctx.lineTo(c, d); ctx.stroke();
        const ang = 0.35 + prog * 0.7;
        const jx = cxw + Math.cos(ang) * 6.4, jy = cyw - Math.sin(ang) * 4.2;
        const [e, g] = iso(jx, jy, top), [h, i] = iso(cxw - Math.cos(ang) * 1.6, cyw + Math.sin(ang) * 1.1, top);
        ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(h, i); ctx.lineTo(e, g); ctx.stroke();
        const [l, m] = iso((jx + cxw) / 2, (jy + cyw) / 2, top), [n2, o] = iso((jx + cxw) / 2, (jy + cyw) / 2, Math.max(built, 1) + 0.6);
        ctx.strokeStyle = "rgba(255,107,53,0.6)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(l, m); ctx.lineTo(n2, o); ctx.stroke();
      }

      // landscaping
      if (green > 0) {
        ctx.globalAlpha = green;
        [[1.2, 1.4], [1.4, 7.6], [10.4, 8.2], [10.6, 1.6], [6, 8.6]].forEach(([x, y]) => { const [a, b] = iso(x, y, 0); ctx.fillStyle = "#1F5A44"; ctx.beginPath(); ctx.ellipse(a, b - s * 0.5, s * 0.55, s * 0.6, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#2E7A5C"; ctx.beginPath(); ctx.ellipse(a - s * 0.15, b - s * 0.7, s * 0.3, s * 0.3, 0, 0, Math.PI * 2); ctx.fill(); });
        poly([[bx + 2.6, by + bd, 0.03], [bx + 3.4, by + bd, 0.03], [bx + 3.4, 10, 0.03], [bx + 2.6, 10, 0.03]], "#9AA3B5");
        ctx.globalAlpha = 1;
      }

      // drone over the site + fixed survey point marker
      const [dx, dy] = iso(1.2, 9, 8.6);
      ctx.strokeStyle = "#E8ECF5"; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(dx - 9, dy - 3); ctx.lineTo(dx + 9, dy + 3); ctx.moveTo(dx + 9, dy - 3); ctx.lineTo(dx - 9, dy + 3); ctx.stroke();
      [[-9, -3], [9, -3], [-9, 3], [9, 3]].forEach(([a, b]) => { ctx.beginPath(); ctx.ellipse(dx + a, dy + b, 5, 1.6, 0, 0, Math.PI * 2); ctx.stroke(); });
      ctx.setLineDash([3, 4]); ctx.strokeStyle = "rgba(127,178,229,0.55)";
      const [vx, vy] = iso(bx + bw / 2, by + bd / 2, 0);
      ctx.beginPath(); ctx.moveTo(dx, dy); ctx.lineTo(vx, vy); ctx.stroke(); ctx.setLineDash([]);

      // stamp
      const month = 1 + Math.round(prog * 13);
      ctx.font = "600 12px 'Blinker', sans-serif"; ctx.fillStyle = "rgba(232,236,245,0.85)";
      ctx.fillText(`CP-04 · POSITION A`, 16, H - 40);
      ctx.fillStyle = "#FF6B35"; ctx.fillText(`VISIT ${String(month).padStart(2, "0")} · MONTH ${month} OF 14`, 16, H - 22);
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
          <div className="t-hero-ctas"><Link className="t-btn t-btn-primary" href="/plan/?mission=construction">Price monthly visits <Arrow /></Link><Link className="t-btn t-btn-ghost" href="/services/construction/">How it works</Link></div>
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
