"use client";
/* Commercial property hero: the industrial unit with the camera slowly rising
   and falling. One still frame if reduced motion is on. */
import { useEffect, useRef } from "react";
import { drawUnit } from "@/lib/isoUnit";

export default function HeroUnit() {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current; const ctx = cv.getContext("2d");
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0, H = 0, raf = 0, visible = true; const t0 = performance.now();
    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      if (!visible || !W) return;
      const t = ((now - t0) / 12000) % 2; const p = t < 1 ? t : 2 - t;
      drawUnit(ctx, W, H, 0.35 + p * 0.5, 3);
    };
    const resize = () => {
      const r = cv.getBoundingClientRect(); const dpr = Math.min(2, devicePixelRatio || 1);
      W = r.width; H = r.width * 11 / 16; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduce) drawUnit(ctx, W, H, 0.6, 3);
    };
    const ro = new ResizeObserver(resize); ro.observe(cv); resize();
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }); io.observe(cv);
    if (!reduce) raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); };
  }, []);
  return <canvas ref={ref} role="img" aria-label="Illustration: an industrial unit with offices, yard and parking, seen from a drone as it rises" />;
}
