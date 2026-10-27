"use client";
/* Construction page hero image: the isometric site slowly building and
   un-building on a loop. Shows one still frame if reduced motion is on. */
import { useEffect, useRef } from "react";
import { drawBuild } from "@/lib/isoBuild";

export default function HeroBuild() {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current; const ctx = cv.getContext("2d");
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0, H = 0, raf = 0, t0 = performance.now(), visible = true;
    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      if (!visible || !W) return;
      const t = ((now - t0) / 16000) % 2;           // 16 s up, 16 s down
      const p = t < 1 ? t : 2 - t;
      drawBuild(ctx, W, H, 0.04 + p * 0.92, { points: true, label: "HD-CP · LIVE SITE" });
    };
    const resize = () => {
      const r = cv.getBoundingClientRect(); const dpr = Math.min(2, devicePixelRatio || 1);
      W = r.width; H = r.width * 11 / 16; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduce) drawBuild(ctx, W, H, 0.6, { points: true, label: "HD-CP · LIVE SITE" });
    };
    const ro = new ResizeObserver(resize); ro.observe(cv); resize();
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }); io.observe(cv);
    if (!reduce) raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); };
  }, []);
  return <canvas ref={ref} role="img" aria-label="Illustration: an isometric construction site building up over time, with four fixed capture positions marked" />;
}
