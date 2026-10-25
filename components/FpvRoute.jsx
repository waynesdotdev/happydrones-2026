"use client";
/* The floor plan where the orange drone follows your scroll. */
import { useEffect, useRef, useState } from "react";
import { useQuote } from "./QuoteContext";

const ROUTE = "M170 505 L170 380 C170 340 190 340 230 340 L300 340 C320 340 320 320 300 300 L240 290 C215 285 210 260 210 230 L190 220 C160 215 160 180 170 150 L170 60 C170 40 230 30 300 50";

// The steps in the list, and how far along the route (0 to 1) each one lights up
const STEPS = [
  { at: 0, text: "Up the drive and through the front door" },
  { at: 0.3, text: "Along the hall into the living room" },
  { at: 0.55, text: "Through to the kitchen" },
  { at: 0.8, text: "Out the back doors and up over the garden" },
];

export default function FpvRoute({ quoteHref = "#quote" }) {
  const sectionRef = useRef(null);
  const liveRef = useRef(null);
  const droneRef = useRef(null);
  const [step, setStep] = useState(0);
  const { setService } = useQuote();

  useEffect(() => {
    const section = sectionRef.current, live = liveRef.current, drone = droneRef.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const L = live.getTotalLength();
    live.style.strokeDasharray = L;

    const update = () => {
      const r = section.getBoundingClientRect();
      const p = reduce ? 1 : Math.min(1, Math.max(0, (innerHeight * 0.7 - r.top) / (r.height * 0.75)));
      live.style.strokeDashoffset = L * (1 - p);
      const pt = live.getPointAtLength(L * p);
      drone.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
      let current = 0;
      STEPS.forEach((s, i) => { if (p >= s.at) current = i; });
      setStep(current);
    };
    update();
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update);
    return () => { removeEventListener("scroll", update); removeEventListener("resize", update); };
  }, []);

  return (
    <section className="fpv" id="fpv" aria-labelledby="fpv-title" ref={sectionRef}>
      <div className="wrap fpv-grid">
        <div className="fpv-copy">
          <h2 id="fpv-title" className="section-title">One take. Front door to back garden.</h2>
          <p>An FPV fly-through is a single unbroken flight through a space. Viewers feel like they&apos;re walking round it themselves, which is why these clips get watched to the end and shared.</p>
          <p>Scroll and follow the route a typical home tour takes. It&apos;s included in the Signature package, or can be added to any listing.</p>
          <ol className="route">
            {STEPS.map((s, i) => <li key={s.text} className={i === step ? "is-active" : undefined}>{s.text}</li>)}
          </ol>
          <a className="btn btn-orange" href={quoteHref} onClick={() => setService("signature")}>Price the Signature package</a>
        </div>

        <figure className="plan" aria-label="Floor plan showing a drone route from the front door, through the house, and out over the back garden">
          <svg viewBox="0 0 400 520">
            <rect x="20" y="10" width="360" height="120" rx="6" className="plan-garden" />
            <text x="200" y="40" className="plan-label">Back garden</text>
            <rect x="40" y="140" width="320" height="270" className="plan-house" />
            <path d="M40 270h170M210 140v270M210 300h150M120 270v140" className="plan-wall" />
            <text x="125" y="210" className="plan-label">Kitchen</text>
            <text x="285" y="225" className="plan-label">Dining</text>
            <text x="285" y="360" className="plan-label">Living room</text>
            <text x="80" y="345" className="plan-label">Study</text>
            <text x="194" y="398" className="plan-label">Hall</text>
            <path d="M150 410h40M150 140h40M210 320v40M280 300h40M140 270h40M210 200v40" className="plan-door" />
            <rect x="140" y="420" width="60" height="90" className="plan-drive" />
            <text x="250" y="470" className="plan-label">Front drive</text>
            <path className="plan-route-ghost" d={ROUTE} />
            <path className="plan-route" d={ROUTE} ref={liveRef} />
            <g ref={droneRef}>
              <circle r="16" className="drone-glow" />
              <circle r="7" className="drone-dot" />
            </g>
          </svg>
        </figure>
      </div>
    </section>
  );
}
