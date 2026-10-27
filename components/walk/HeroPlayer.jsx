"use client";
/* Walkthrough hero: the edit plays on a loop at three times speed, like a
   muted autoplay preview. One frame if reduced motion is on. */
import { useEffect, useState } from "react";
import ClipView from "@/components/walk/ClipView";
import { WT_CLIPS, WT_LENGTH } from "@/lib/walkthrough";

const tc = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

export default function HeroPlayer() {
  const [time, setTime] = useState(16);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0, last = performance.now();
    const step = (now) => {
      const dt = Math.min(0.1, (now - last) / 1000); last = now;
      setTime((t) => (t + dt * 3) % WT_LENGTH);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);
  const clip = WT_CLIPS.find((c) => time >= c.s0 && time < c.s1) || WT_CLIPS[0];
  const k = (time - clip.s0) / (clip.s1 - clip.s0);
  return (
    <div className="wt-hero" role="img" aria-label="Illustration: a property walkthrough video playing, from an aerial opening through each room to the end card">
      <ClipView clip={clip} k={k} />
      <div className="wt-hero-ui" aria-hidden="true">
        <span className="wt-hero-rec">● PREVIEW · 3×</span>
        <div className="wt-hero-bar"><b>▶</b><span className="cx-scroll-track"><i style={{ width: `${(time / WT_LENGTH) * 100}%` }} /></span><b>{tc(time)} / {tc(WT_LENGTH)}</b></div>
      </div>
    </div>
  );
}
