"use client";
/* A listing, start to finish: a sideways strip of steps you can drag, swipe
   or step through with the arrows. Data: LISTING_STEPS in lib/agents.js. */
import { useEffect, useRef, useState } from "react";
import { LISTING_STEPS } from "@/lib/agents";

const ICONS = {
  key: <path d="M14 10a4 4 0 1 1-1.2-2.8L21 7v3h-2v2h-2v2h-3" />,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></>,
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />,
  cloud: <path d="M7 18h10a4 4 0 0 0 0-8 6 6 0 0 0-11.5 1.5A3.3 3.3 0 0 0 7 18z" />,
  drone: <><circle cx="5" cy="6" r="2.5" /><circle cx="19" cy="6" r="2.5" /><circle cx="5" cy="18" r="2.5" /><circle cx="19" cy="18" r="2.5" /><path d="M7 8l10 8M17 8L7 16" /></>,
  folder: <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
  screen: <><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /></>,
  check: <path d="M4 12l5 5L20 6" />,
};

export default function ListingStrip() {
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
    <div className="ea-strip">
      <div className="ea-strip-head">
        <div className="ea-strip-track" aria-hidden="true"><i style={{ width: `${Math.max(6, Math.round(pos * 100))}%` }} /></div>
        <div className="ea-strip-btns">
          <button type="button" className="ea-arrow" onClick={() => nudge(-1)} aria-label="Earlier steps">‹</button>
          <button type="button" className="ea-arrow" onClick={() => nudge(1)} aria-label="Later steps">›</button>
        </div>
      </div>
      <ol className="ea-strip-rail" ref={railRef} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerLeave={up}
        tabIndex={0} aria-label="A listing from instruction to sale. Scroll sideways.">
        {LISTING_STEPS.map((s, n) => (
          <li key={s.t}>
            <span className="ea-strip-n">{String(n + 1).padStart(2, "0")}</span>
            <svg viewBox="0 0 24 24" aria-hidden="true">{ICONS[s.icon]}</svg>
            <small>{s.day}</small>
            <b>{s.t}</b>
            <p>{s.d}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
