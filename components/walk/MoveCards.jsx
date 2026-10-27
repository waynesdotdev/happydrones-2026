"use client";
/* The six camera moves, each as a small looping clip. They play while the
   card is on screen (or on hover with reduced motion off). */
import { useEffect, useRef, useState } from "react";
import RoomScene from "@/components/photo/RoomScene";
import DuskHouse from "@/components/photo/DuskHouse";
import { AerialView } from "@/components/walk/ClipView";
import { WT_MOVES } from "@/lib/walkthrough";

export default function MoveCards() {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { threshold: 0.2 });
    io.observe(ref.current); return () => io.disconnect();
  }, []);
  return (
    <ul className={`wt-moves${on ? " play" : ""}`} ref={ref}>
      {WT_MOVES.map((m, i) => (
        <li key={m.id}>
          <div className={`wt-mv-thumb wt-mv-${m.id}`} aria-hidden="true">
            <div className="wt-mv-in">
              {m.scene === "house" ? <DuskHouse t={0.05} cover /> : m.scene === "aerial" ? <AerialView zoom={1} target={{ x: 7, y: 5, z: 2 }} /> : <RoomScene room={m.scene} cover />}
            </div>
            {m.id === "reveal" && <i className="wt-mv-door" />}
            <span className="t-mono">{String(i + 1).padStart(2, "0")}</span>
          </div>
          <h3>{m.t}</h3>
          <p>{m.d}</p>
        </li>
      ))}
    </ul>
  );
}
