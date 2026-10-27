"use client";
/* "Every visit on record": a horizontal strip of dated visits, each showing the
   same position at that point in the build. Drag, swipe, scroll sideways or use
   the arrows; the strip advances the build from left to right. */
import { useEffect, useRef, useState } from "react";
import { drawBuild } from "@/lib/isoBuild";

const VISITS = 14;
const START = new Date(Date.UTC(2026, 8, 10)); // baseline: 10 Sep 2026 (illustration)

function visitDate(i) {
  const d = new Date(START); d.setUTCMonth(d.getUTCMonth() + i);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

function Frame({ i }) {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current; const ctx = cv.getContext("2d");
    const draw = () => {
      const r = cv.getBoundingClientRect(); if (!r.width) return;
      const dpr = Math.min(2, devicePixelRatio || 1);
      cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.width * 11 / 16 * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawBuild(ctx, r.width, r.width * 11 / 16, i / (VISITS - 1), { stamp: false });
    };
    const ro = new ResizeObserver(draw); ro.observe(cv); draw();
    return () => ro.disconnect();
  }, [i]);
  return <canvas ref={ref} aria-hidden="true" />;
}

export default function Filmstrip() {
  const railRef = useRef(null);
  const [pos, setPos] = useState(0);
  const drag = useRef(null);

  useEffect(() => {
    const el = railRef.current;
    const onScroll = () => { const max = el.scrollWidth - el.clientWidth; setPos(max > 0 ? el.scrollLeft / max : 0); };
    el.addEventListener("scroll", onScroll, { passive: true }); onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const nudge = (dir) => { const el = railRef.current; el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" }); };
  const onDown = (e) => { if (e.pointerType !== "mouse") return; drag.current = { x: e.clientX, left: railRef.current.scrollLeft }; railRef.current.classList.add("is-drag"); };
  const onMove = (e) => { if (!drag.current) return; railRef.current.scrollLeft = drag.current.left - (e.clientX - drag.current.x); };
  const onUp = () => { drag.current = null; railRef.current?.classList.remove("is-drag"); };

  const shown = Math.max(1, Math.round(1 + pos * (VISITS - 1)));

  return (
    <div className="cx-film">
      <div className="cx-film-head">
        <p className="t-mono">POSITION A · VISIT {String(shown).padStart(2, "0")} OF {VISITS}</p>
        <div className="cx-film-btns">
          <button type="button" className="t-arrow" onClick={() => nudge(-1)} aria-label="Earlier visits">‹</button>
          <button type="button" className="t-arrow" onClick={() => nudge(1)} aria-label="Later visits">›</button>
        </div>
      </div>
      <div className="cx-film-rail" ref={railRef} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerLeave={onUp}
        tabIndex={0} role="region" aria-label="Fourteen monthly visits from the same position, oldest first. Scroll sideways to move through the build.">
        {Array.from({ length: VISITS }, (_, i) => (
          <figure className="cx-film-card" key={i}>
            <Frame i={i} />
            <figcaption>
              <b className="t-mono">V{String(i + 1).padStart(2, "0")}</b>
              <span>{visitDate(i)}</span>
              {i === 0 && <em>Baseline</em>}
              {i === VISITS - 1 && <em>Handover</em>}
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="cx-film-track" aria-hidden="true"><i style={{ width: `${Math.round(pos * 100)}%` }} /></div>
      <p className="cx-film-note">Illustration. Dates show a typical monthly schedule.</p>
    </div>
  );
}
