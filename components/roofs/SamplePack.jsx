"use client";
/* The photo pack, as a contact sheet: the marked overview and one frame from
   each inspection stop, all drawn live from the same house as the scroll
   section. Tap a frame to make it the big one. */
import { useEffect, useRef, useState } from "react";
import { drawHouse } from "@/lib/isoHouse";
import { RF_STOPS, RF_PINS } from "@/lib/roofs";

const FRAMES = [
  { n: 0, t: "Overview, marked", scene: { cam: { x: 7, y: 5.2, z: 3, zoom: 1.08 }, pins: RF_PINS.map((p) => ({ ...p, state: "done" })) } },
  ...RF_PINS.map((p) => {
    const st = RF_STOPS[p.n];
    return { n: p.n, t: st.t, scene: { cam: { ...st.cam, zoom: st.cam.zoom * 1.15 }, pins: [{ ...p, state: "on" }] } };
  }),
];

function Frame({ scene, big, ratio = 2 / 3 }) {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current; const ctx = cv.getContext("2d");
    const draw = () => {
      const r = cv.getBoundingClientRect(); if (!r.width) return;
      const dpr = Math.min(2, devicePixelRatio || 1);
      const W = r.width, H = r.width * ratio;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawHouse(ctx, W, H, big ? scene : { ...scene, pins: scene.pins.map((p) => ({ ...p, label: null })) });
    };
    const ro = new ResizeObserver(draw); ro.observe(cv); draw();
    return () => ro.disconnect();
  }, [scene, big, ratio]);
  return <canvas ref={ref} aria-hidden="true" style={{ aspectRatio: `${1 / ratio}` }} />;
}

export default function SamplePack() {
  const [sel, setSel] = useState(0);
  const f = FRAMES[sel];
  return (
    <div className="rf-pack">
      <figure className="rf-pack-big t-frame">
        <Frame scene={f.scene} big />
        <figcaption><span className="t-mono">{String(f.n).padStart(2, "0")}</span>{f.t}{f.n > 0 ? ` · ${RF_PINS[f.n - 1].label.split("· ")[1].toLowerCase()}` : " · every close-up pinned"}</figcaption>
      </figure>
      <ul className="rf-pack-grid" aria-label="Frames in the example pack">
        {FRAMES.map((x, i) => (
          <li key={x.n}>
            <button type="button" aria-pressed={sel === i} className={sel === i ? "on" : undefined} onClick={() => setSel(i)} aria-label={`Show frame ${x.n}: ${x.t}`}>
              <Frame scene={x.scene} ratio={0.62} />
              <span><b>{String(x.n).padStart(2, "0")}</b> {x.t}</span>
            </button>
          </li>
        ))}
        <li className="rf-pack-more"><b>+ 70</b><span>more photos in the folders, slope by slope</span></li>
      </ul>
    </div>
  );
}
