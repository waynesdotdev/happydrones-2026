"use client";
/* Roof page hero: the drone circles the house while its camera sweeps the
   roof slope. One still frame if reduced motion is on. */
import { useEffect, useRef } from "react";
import { drawHouse, roofZ } from "@/lib/isoHouse";

const CAM = { x: 7.2, y: 5, z: 3.6, zoom: 1.05 };

function frameAt(t) {
  const a = t * Math.PI * 2;
  const drone = { x: 6.5 + Math.cos(a) * 6.5, y: 6 + Math.sin(a) * 4.5, z: 12.5 };
  const ly = 4.6 + (Math.sin(a * 3) + 1) * 1.1;
  const look = { x: 5 + Math.sin(a * 2) * 4, y: ly, z: roofZ(ly) };
  return { cam: CAM, drone, look, tag: "HD-RF · ROOF CHECK · ILLUSTRATION" };
}

export default function HeroRoof() {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current; const ctx = cv.getContext("2d");
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0, H = 0, raf = 0, visible = true; const t0 = performance.now();
    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      if (!visible || !W) return;
      drawHouse(ctx, W, H, frameAt(((now - t0) / 16000) % 1));
    };
    const resize = () => {
      const r = cv.getBoundingClientRect(); const dpr = Math.min(2, devicePixelRatio || 1);
      W = r.width; H = r.width * 11 / 16; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduce) drawHouse(ctx, W, H, frameAt(0.12));
    };
    const ro = new ResizeObserver(resize); ro.observe(cv); resize();
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }); io.observe(cv);
    if (!reduce) raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); };
  }, []);
  return <canvas ref={ref} role="img" aria-label="Illustration: a drone circling a house, its camera sweeping across the roof" />;
}
