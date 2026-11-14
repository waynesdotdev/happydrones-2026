"use client";
/* Drag-to-compare: the before photo on the left, the after on the right.
   Drag the handle, use the arrow keys, or tap either side. */
import { useRef, useState } from "react";

export default function BeforeAfter({ before, after, alt = "" }) {
  const [x, setX] = useState(50);
  const box = useRef(null);
  const at = (clientX) => { const r = box.current.getBoundingClientRect(); setX(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100))); };
  return (
    <div className="ba" ref={box}
      onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); at(e.clientX); }}
      onPointerMove={(e) => { if (e.buttons) at(e.clientX); }}>
      <img src={after} alt={`After: ${alt}`} draggable="false" />
      <div className="ba-before" style={{ clipPath: `inset(0 ${100 - x}% 0 0)` }}><img src={before} alt={`Before: ${alt}`} draggable="false" /></div>
      <span className="ba-tag ba-l">Before</span><span className="ba-tag ba-r">After</span>
      <button type="button" className="ba-handle" style={{ left: `${x}%` }} role="slider" aria-label="Compare before and after" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(x)}
        onKeyDown={(e) => { if (e.key === "ArrowLeft") setX((v) => Math.max(0, v - 5)); if (e.key === "ArrowRight") setX((v) => Math.min(100, v + 5)); }}><span /></button>
    </div>
  );
}
