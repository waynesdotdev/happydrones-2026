"use client";
/* The sticky camera view used on the Services and Property pages.
   As you scroll, it switches picture and the height readout moves to
   that item's typical camera height. It also highlights the matching
   button in the menu bar under the page heading.
   items: a list with id, art, alt and label (SERVICE_PAGES or PACKAGES in lib/site.js) */
import { useEffect, useRef, useState } from "react";
import ServiceArt from "./ServiceArt";

const fmt = (n) => (n < 10 ? n.toFixed(1).replace(/\.0$/, "") : Math.round(n));

export default function ServicesCam({ items, note = "Typical camera height for this job" }) {
  const [active, setActive] = useState(items[0]);
  const altRef = useRef(null);
  const current = useRef(items[0].alt);

  // Which chapter is on screen?
  useEffect(() => {
    const chapters = items.map((s) => document.getElementById(s.id)).filter(Boolean);
    const pick = () => {
      const line = innerHeight * 0.4;
      let best = chapters[0];
      chapters.forEach((ch) => { if (ch.getBoundingClientRect().top < line) best = ch; });
      const it = items.find((s) => s.id === best?.id);
      if (it) setActive((prev) => (prev.id === it.id ? prev : it));
    };
    pick();
    addEventListener("scroll", pick, { passive: true });
    return () => removeEventListener("scroll", pick);
  }, [items]);

  // Animate the height number and update the menu bar
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf;
    const tick = () => {
      current.current += (active.alt - current.current) * 0.15;
      if (Math.abs(active.alt - current.current) < 0.05) current.current = active.alt;
      if (altRef.current) altRef.current.textContent = fmt(current.current);
      if (current.current !== active.alt) raf = requestAnimationFrame(tick);
    };
    if (reduce) { current.current = active.alt; if (altRef.current) altRef.current.textContent = fmt(active.alt); }
    else tick();

    document.querySelectorAll(".chapter-nav a").forEach((a) => {
      const on = a.getAttribute("href") === "#" + active.id;
      a.classList.toggle("is-active", on);
      if (on) a.scrollIntoView({ block: "nearest", inline: "center", behavior: reduce ? "auto" : "smooth" });
    });
    return () => cancelAnimationFrame(raf);
  }, [active]);

  return (
    <div className="cam" aria-hidden="true">
      <div className="cam-screen">
        {items.map((s) => (
          <div key={s.id} className={`cam-art${s.id === active.id ? " is-on" : ""}`}>
            <ServiceArt name={s.art} />
          </div>
        ))}
        <span className="corner tl"></span><span className="corner tr"></span>
        <span className="corner bl"></span><span className="corner br"></span>
        <span className="cam-rec"><i></i> REC</span>
        <span className="cam-label">{active.label}</span>
        <span className="cam-alt"><small>ALT</small> <b ref={altRef}>{fmt(items[0].alt)}</b> <small>m</small></span>
      </div>
      <p className="cam-note">{note}</p>
    </div>
  );
}
