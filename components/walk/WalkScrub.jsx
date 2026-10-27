"use client";
/* Scroll to scrub: the page's scroll position is the playhead of a 75-second
   walkthrough. The preview plays each clip's camera move as you scroll, and the
   edit timeline underneath shows where you are. Tap a clip to jump to it.
   Clips: WT_CLIPS in lib/walkthrough.js. */
import { useEffect, useRef, useState } from "react";
import ClipView from "@/components/walk/ClipView";
import { WT_CLIPS, WT_LENGTH } from "@/lib/walkthrough";

const tc = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

export default function WalkScrub() {
  const wrapRef = useRef(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = wrapRef.current.getBoundingClientRect();
        const travel = r.height - innerHeight;
        setP(travel > 0 ? Math.min(1, Math.max(0, -r.top / travel)) : 0);
      });
    };
    addEventListener("scroll", on, { passive: true }); on();
    return () => { removeEventListener("scroll", on); cancelAnimationFrame(raf); };
  }, []);
  const jump = (s) => {
    const el = wrapRef.current; const top = el.getBoundingClientRect().top + scrollY;
    scrollTo({ top: top + ((s + 0.5) / WT_LENGTH) * (el.offsetHeight - innerHeight), behavior: "smooth" });
  };

  const time = Math.min(WT_LENGTH - 0.01, p * WT_LENGTH);
  const idx = WT_CLIPS.findIndex((c) => time >= c.s0 && time < c.s1);
  const clip = WT_CLIPS[Math.max(0, idx)];
  const k = (time - clip.s0) / (clip.s1 - clip.s0);

  return (
    <section className="cx-scroll wt-scroll" ref={wrapRef} aria-labelledby="wt-scrub-title">
      <div className="cx-sticky">
        <div className="wrap cx-scroll-in">
          <div className="cx-scroll-copy">
            <span className="t-tag">Scroll to play the edit</span>
            <h2 id="wt-scrub-title">75 seconds, clip by clip.</h2>
            <div className="cx-stage" key={clip.s0}>
              <p className="cx-stage-kicker t-mono">CLIP {String(Math.max(0, idx) + 1).padStart(2, "0")} · {tc(clip.s0)}–{tc(clip.s1)} · {clip.move.toUpperCase()}</p>
              <h3>{clip.t}</h3>
              <p>{clip.d}</p>
            </div>
          </div>
          <figure className="cx-scroll-stage t-frame wt-stage">
            <ClipView clip={clip} k={k} />
            <div className="wt-tl" aria-label="Edit timeline">
              <div className="wt-tl-clips">
                {WT_CLIPS.map((c, i) => (
                  <button key={c.s0} type="button" className={i === idx ? "on" : i < idx ? "done" : undefined} style={{ flexGrow: c.s1 - c.s0 }} onClick={() => jump(c.s0)} aria-label={`Jump to ${c.t}`}>
                    <span>{c.cap || "End"}</span>
                  </button>
                ))}
              </div>
              <i className="wt-tl-head" style={{ "--t": time / WT_LENGTH }} aria-hidden="true" />
            </div>
            <figcaption className="cx-scroll-cap">
              <span className="t-mono">▶ {tc(time)} / {tc(WT_LENGTH)}</span>
              <span className="cx-scroll-track" aria-hidden="true"><i style={{ width: `${Math.round(p * 100)}%` }} /></span>
              <span className="t-mono">MUSIC · CAPTIONS</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
