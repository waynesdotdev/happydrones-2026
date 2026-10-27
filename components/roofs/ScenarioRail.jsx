"use client";
/* Who books a roof check: a sideways rail of situations you can drag, swipe
   or step through with the arrows. Data: RF_SCENARIOS in lib/roofs.js. */
import { useEffect, useRef, useState } from "react";
import { RF_SCENARIOS } from "@/lib/roofs";

export default function ScenarioRail() {
  const railRef = useRef(null);
  const drag = useRef(null);
  const [pos, setPos] = useState(0);

  useEffect(() => {
    const el = railRef.current;
    const on = () => { const max = el.scrollWidth - el.clientWidth; setPos(max > 0 ? el.scrollLeft / max : 0); };
    el.addEventListener("scroll", on, { passive: true }); on();
    return () => el.removeEventListener("scroll", on);
  }, []);

  const nudge = (d) => railRef.current.scrollBy({ left: d * railRef.current.clientWidth * 0.7, behavior: "smooth" });
  const down = (e) => { if (e.pointerType !== "mouse") return; drag.current = { x: e.clientX, l: railRef.current.scrollLeft }; railRef.current.classList.add("is-drag"); };
  const move = (e) => { if (drag.current) railRef.current.scrollLeft = drag.current.l - (e.clientX - drag.current.x); };
  const up = () => { drag.current = null; railRef.current?.classList.remove("is-drag"); };

  return (
    <div className="ea-strip rf-rail">
      <div className="ea-strip-head">
        <div className="ea-strip-track" aria-hidden="true"><i style={{ width: `${Math.max(6, Math.round(pos * 100))}%` }} /></div>
        <div className="ea-strip-btns">
          <button type="button" className="ea-arrow" onClick={() => nudge(-1)} aria-label="Previous situations">‹</button>
          <button type="button" className="ea-arrow" onClick={() => nudge(1)} aria-label="More situations">›</button>
        </div>
      </div>
      <ul className="ea-strip-rail" ref={railRef} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerLeave={up}
        tabIndex={0} aria-label="Situations where people book a roof check. Scroll sideways.">
        {RF_SCENARIOS.map((s, n) => (
          <li key={s.t}>
            <span className="ea-strip-n">{String(n + 1).padStart(2, "0")}</span>
            <small>{s.tag}</small>
            <b>{s.t}</b>
            <p>{s.d}</p>
            <p className="rf-rail-order"><span>Usually booked as</span>{s.order}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
