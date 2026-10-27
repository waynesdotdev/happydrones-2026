"use client";
/* One frame of the walkthrough "video": the clip's scene with its camera move
   applied (k runs 0–1 through the clip), a caption, and the end card.
   Used by the hero player, the scroll-to-scrub section and the branding picker. */
import { useEffect, useRef } from "react";
import RoomScene from "@/components/photo/RoomScene";
import DuskHouse from "@/components/photo/DuskHouse";
import { drawHouse } from "@/lib/isoHouse";

const lerp = (a, b, k) => a + (b - a) * k;

export function AerialView({ zoom = 1, target = { x: 7, y: 5, z: 2 } }) {
  const ref = useRef(null);
  const state = useRef({ zoom, target });
  state.current = { zoom, target };
  const draw = () => {
    const cv = ref.current; if (!cv) return;
    const r = cv.getBoundingClientRect(); if (!r.width) return;
    const dpr = Math.min(2, devicePixelRatio || 1);
    const W = r.width, H = r.height || r.width * 9 / 16;
    if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(H * dpr)) { cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); }
    const ctx = cv.getContext("2d"); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // drawHouse sizes from width; nudge the zoom so a wide frame isn't over-zoomed
    drawHouse(ctx, W, H, { cam: { ...state.current.target, zoom: state.current.zoom * (H / W) * 1.55 } });
  };
  useEffect(() => { const ro = new ResizeObserver(draw); ro.observe(ref.current); draw(); return () => ro.disconnect(); }, []);
  useEffect(draw, [zoom, target.x, target.y, target.z]);
  return <canvas ref={ref} aria-hidden="true" />;
}

function moveStyle(move, k) {
  switch (move) {
    case "Slow push-in": case "Push-in": return { transform: `scale(${1.04 + 0.2 * k})` };
    case "Glide across": return { transform: `scale(1.16) translateX(${6 - 12 * k}%)` };
    case "Reveal": return { transform: `scale(1.14) translateX(${-7 + 7 * k}%)` };
    case "Pan": return { transform: `scale(1.14) translateX(${-5 + 10 * k}%)` };
    default: return undefined;
  }
}

export function EndCard({ branding = "agency" }) {
  return (
    <div className="wt-end">
      <div className="wt-end-logo">YOUR AGENCY</div>
      <b>14 Example Road</b>
      <span>Three-bed semi · Book a viewing today</span>
      {branding === "standard" && <small className="wt-end-credit">Filmed by Happy Drones</small>}
    </div>
  );
}

export default function ClipView({ clip, k = 0, branding = "agency" }) {
  const sc = clip.scene;
  let body;
  if (sc.kind === "aerial") {
    const into = sc.to > sc.from;
    const tgt = into ? { x: lerp(7, 4.8, k), y: lerp(6, 8.5, k), z: lerp(2, 1.5, k) } : { x: lerp(10, 7, k), y: lerp(1, 5, k), z: lerp(2, 1, k) };
    body = <AerialView zoom={lerp(sc.from, sc.to, k)} target={tgt} />;
  } else if (sc.kind === "house") {
    body = <div className="wt-move" style={moveStyle(clip.move, k)}><DuskHouse t={0.05} cover /></div>;
  } else if (sc.kind === "room") {
    body = <div className="wt-move" style={moveStyle(clip.move, k)}><RoomScene room={sc.room} cover /></div>;
  } else {
    body = <EndCard branding={branding} />;
  }
  return (
    <div className="wt-clip">
      {body}
      {clip.move === "Reveal" && <div className="wt-door" style={{ width: `${Math.max(0, 34 - 60 * k)}%` }} aria-hidden="true" />}
      {clip.cap && k > 0.08 && (
        <div className={`wt-cap${clip.s0 === 0 ? " wt-cap-title" : ""}`}>
          <b>{clip.cap}</b>{clip.sub && <span>{clip.sub}</span>}
          {clip.s0 === 0 && branding !== "standard" && <small>Presented by YOUR AGENCY</small>}
        </div>
      )}
    </div>
  );
}
