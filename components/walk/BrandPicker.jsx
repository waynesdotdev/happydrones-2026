"use client";
/* Choose how the video is branded and see the end card change.
   Options and white-label prices: AGENT_OFFER in lib/site.js. */
import { useState } from "react";
import { EndCard } from "@/components/walk/ClipView";
import { AGENT_OFFER } from "@/lib/site";

export default function BrandPicker() {
  const [b, setB] = useState("agency");
  const opt = AGENT_OFFER.branding.find((x) => x.id === b);
  return (
    <div className="wt-brand">
      <div className="wt-brand-tabs" role="group" aria-label="Branding">
        {AGENT_OFFER.branding.map((x) => (
          <button key={x.id} type="button" aria-pressed={b === x.id} className={b === x.id ? "on" : undefined} onClick={() => setB(x.id)}>
            <b>{x.name}</b><small>{x.tag}</small>
          </button>
        ))}
      </div>
      <div className="wt-brand-body">
        <div className="wt-brand-card t-frame" key={b}><EndCard branding={b} /></div>
        <div className="wt-brand-info">
          <ul>{opt.points.map((p) => <li key={p}>{p}</li>)}</ul>
          {b === "whitelabel" && (
            <dl className="wt-brand-prices">{AGENT_OFFER.whiteLabel.map((w) => <div key={w.who}><dt>{w.who}</dt><dd>{w.price}</dd></div>)}</dl>
          )}
        </div>
      </div>
    </div>
  );
}
