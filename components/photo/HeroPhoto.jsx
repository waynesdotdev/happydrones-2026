"use client";
/* Property photography hero: the living room through a camera's viewfinder,
   cycling through the bracketed exposures to the blended photo. */
import { useEffect, useState } from "react";
import RoomScene from "@/components/photo/RoomScene";

const STEPS = [["window", "BRACKET 1 / 3 · DARK"], ["mid", "BRACKET 2 / 3 · MIDDLE"], ["room", "BRACKET 3 / 3 · BRIGHT"], ["blend", "BLENDED · FINAL PHOTO"]];

export default function HeroPhoto() {
  const [i, setI] = useState(3);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setI((v) => (v + 1) % STEPS.length), 1500);
    return () => clearInterval(id);
  }, []);
  const [expo, tag] = STEPS[i];
  return (
    <div className="pp-hero-vf">
      <RoomScene room="living" expo={expo} label="Illustration: a living room photographed in three exposures and blended" />
      <div className="pp-vf" aria-hidden="true">
        <i className="g1" /><i className="g2" /><i className="g3" /><i className="g4" />
        <span className="pp-vf-tag">{tag}</span>
        <span className="pp-vf-level">LEVEL 0.0°</span>
        <span className={i === 3 ? "pp-vf-flash on" : "pp-vf-flash"} />
      </div>
    </div>
  );
}
