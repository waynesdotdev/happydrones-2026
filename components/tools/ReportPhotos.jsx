"use client";
/* The photos in an online roof report: the marked overview, then each
   numbered close-up. Tap a photo to see it full size; arrows or
   swipe to move between them; Esc to close. */
import { useEffect, useState } from "react";

export default function ReportPhotos({ report }) {
  const all = [{ n: 0, src: report.overview, title: "Overview", note: "The whole roof from above, with every close-up numbered." }, ...report.photos];
  const [open, setOpen] = useState(-1);
  useEffect(() => {
    if (open < 0) return;
    const key = (e) => {
      if (e.key === "Escape") setOpen(-1);
      if (e.key === "ArrowRight") setOpen((i) => Math.min(all.length - 1, i + 1));
      if (e.key === "ArrowLeft") setOpen((i) => Math.max(0, i - 1));
    };
    addEventListener("keydown", key);
    return () => removeEventListener("keydown", key);
  }, [open, all.length]);
  const cur = all[open];
  return (
    <>
      <figure className="rp-overview">
        <button type="button" onClick={() => setOpen(0)} aria-label="Open the overview full size"><img src={report.overview} alt="The whole roof from above, with the close-ups numbered" /></button>
        <figcaption><span className="t-mono">00</span> Overview: every close-up is numbered on this photo</figcaption>
      </figure>
      <ol className="rp-grid">
        {report.photos.map((p, i) => (
          <li key={p.n}>
            <button type="button" onClick={() => setOpen(i + 1)} aria-label={`Open photo ${p.n} full size`}><img src={p.src} alt={p.title} loading="lazy" /></button>
            <div className="rp-cap"><span className="rp-n">{String(p.n).padStart(2, "0")}</span><div><b>{p.title}</b><p>{p.note}</p></div></div>
          </li>
        ))}
      </ol>
      {cur && (
        <div className="rp-box" role="dialog" aria-modal="true" aria-label={`Photo ${cur.n}: ${cur.title}`} onClick={() => setOpen(-1)}>
          <img src={cur.src} alt={cur.title} onClick={(e) => e.stopPropagation()} />
          <p onClick={(e) => e.stopPropagation()}><span className="rp-n">{String(cur.n).padStart(2, "0")}</span> <b>{cur.title}</b> {cur.note}</p>
          <div className="rp-box-nav" onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={() => setOpen((i) => Math.max(0, i - 1))} disabled={open === 0}>← Previous</button>
            <button type="button" onClick={() => setOpen(-1)}>Close</button>
            <button type="button" onClick={() => setOpen((i) => Math.min(all.length - 1, i + 1))} disabled={open === all.length - 1}>Next →</button>
          </div>
        </div>
      )}
    </>
  );
}
