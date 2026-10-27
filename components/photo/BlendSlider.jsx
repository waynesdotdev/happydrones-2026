"use client";
/* Drag to compare one exposure (the window blows out to white) with the
   blended photo (room bright, view outside intact). Below it, the three
   bracketed exposures that make the blend. */
import { useRef, useState } from "react";
import RoomScene from "@/components/photo/RoomScene";

export default function BlendSlider() {
  const [pos, setPos] = useState(50);
  const box = useRef(null);
  const dragging = useRef(false);
  const fromEvent = (e) => { const r = box.current.getBoundingClientRect(); setPos(Math.max(3, Math.min(97, ((e.clientX - r.left) / r.width) * 100))); };
  return (
    <div className="pp-blend">
      <div className="rf-gv-box pp-blend-box" ref={box} style={{ "--pos": `${pos}%` }}
        onPointerDown={(e) => { dragging.current = true; fromEvent(e); }} onPointerMove={(e) => dragging.current && fromEvent(e)}
        onPointerUp={() => { dragging.current = false; }} onPointerCancel={() => { dragging.current = false; }}>
        <div className="rf-gv-far" aria-hidden="true"><RoomScene room="living" expo="room" /><span className="rf-gv-lbl">ONE EXPOSURE · THE WINDOW BURNS OUT</span></div>
        <div className="rf-gv-near" aria-hidden="true"><RoomScene room="living" expo="blend" /><span className="rf-gv-lbl rf-gv-lbl-r">BLENDED · ROOM AND VIEW BOTH RIGHT</span></div>
        <div className="rf-gv-handle" aria-hidden="true"><span>‹ ›</span></div>
        <input className="rf-gv-range" type="range" min="3" max="97" value={Math.round(pos)} onChange={(e) => setPos(+e.target.value)} aria-label="Compare a single exposure with a blended photo" />
      </div>
      <div className="pp-brackets" aria-label="How a blended photo is made">
        <figure><RoomScene room="living" expo="window" label="Dark exposure: the window is right, the room is too dark" /><figcaption><b>Dark</b>Exposed for the view</figcaption></figure>
        <span aria-hidden="true">+</span>
        <figure><RoomScene room="living" expo="mid" label="Middle exposure" /><figcaption><b>Middle</b>The overall balance</figcaption></figure>
        <span aria-hidden="true">+</span>
        <figure><RoomScene room="living" expo="room" label="Bright exposure: the room is right, the window is white" /><figcaption><b>Bright</b>Exposed for the room</figcaption></figure>
        <span aria-hidden="true">=</span>
        <figure className="on"><RoomScene room="living" expo="blend" label="The blended photo" /><figcaption><b>Blended</b>What you get</figcaption></figure>
      </div>
    </div>
  );
}
