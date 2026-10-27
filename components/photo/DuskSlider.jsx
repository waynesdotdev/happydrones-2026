"use client";
/* Drag through the evening: the same house front from mid-afternoon to blue
   hour, with a play button that runs the evening on its own. */
import { useEffect, useRef, useState } from "react";
import DuskHouse from "@/components/photo/DuskHouse";

const MARKS = [[0, "2 PM"], [0.5, "SUNSET"], [0.82, "BLUE HOUR"]];
const phase = (t) => (t < 0.35 ? "Daytime: bright, but every house on the street looks like this." : t < 0.65 ? "Sunset: warm light, but the sky is brighter than the house." : t < 0.8 ? "Just after sunset: the lights start to show." : "Blue hour: the sky and the lights balance. This is the dusk shot.");

export default function DuskSlider() {
  const [t, setT] = useState(0.15);
  const [playing, setPlaying] = useState(false);
  const raf = useRef(0);
  useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    const step = (now) => {
      const dt = (now - last) / 5000; last = now;
      setT((v) => { const n = v + dt; if (n >= 1) { setPlaying(false); return 1; } return n; });
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [playing]);
  return (
    <div className="pp-dusk">
      <figure className="pp-dusk-fig t-frame"><DuskHouse t={t} label={`The house front at ${Math.round(t * 100)}% of the way from afternoon to blue hour`} /></figure>
      <div className="pp-dusk-ctrl">
        <button type="button" className="pp-play" onClick={() => { if (t >= 1) setT(0); setPlaying((x) => !x); }} aria-label={playing ? "Pause" : "Play the evening"}>
          {playing ? "❚❚" : "▶"}
        </button>
        <div className="pp-dusk-track">
          <input type="range" min="0" max="1000" value={Math.round(t * 1000)} onChange={(e) => { setPlaying(false); setT(+e.target.value / 1000); }} aria-label="Time of day, from afternoon to blue hour" />
          <div className="pp-dusk-marks" aria-hidden="true">{MARKS.map(([v, l]) => <span key={l} style={{ left: `${v * 100}%` }}>{l}</span>)}</div>
        </div>
      </div>
      <p className="pp-dusk-read" aria-live="polite">{phase(t)}</p>
    </div>
  );
}
