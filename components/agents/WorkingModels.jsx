"use client";
/* Three ways to work together: pay as you go, agent account, 10-listing bundle.
   Each tab shows a sideways timeline of what happens and when money changes hands.
   Data: MODELS in lib/agents.js. */
import { useState } from "react";
import { MODELS } from "@/lib/agents";

export default function WorkingModels() {
  const [id, setId] = useState("account");
  const m = MODELS.find((x) => x.id === id);
  return (
    <div className="ea-models">
      <div className="ea-tabs" role="tablist" aria-label="Ways to work together">
        {MODELS.map((x) => (
          <button key={x.id} type="button" role="tab" aria-selected={x.id === id} className={x.id === id ? "on" : undefined} onClick={() => setId(x.id)}>
            <b>{x.name}</b><small>{x.tag}</small>
          </button>
        ))}
      </div>
      <div className="ea-model" role="tabpanel">
        <div className="ea-model-sum">
          <dl>
            <div><dt>Package discount</dt><dd>{m.discount ? `${Math.round(m.discount * 100)}% off` : "Standard price"}</dd></div>
            <div><dt>White label</dt><dd>{m.whiteLabel ? `£${m.whiteLabel} per listing` : "Free"}</dd></div>
          </dl>
          <p><b>How you pay:</b> {m.billing}</p>
          <p><b>Best for:</b> {m.best}</p>
        </div>
        <div className="ea-tl-scroll" tabIndex={0} role="region" aria-label={`${m.name} timeline. Scroll sideways.`}>
          <ol className="ea-tl" key={m.id}>
            {m.timeline.map((s, n) => (
              <li key={s.t} style={{ "--n": n }}>
                <span className="ea-tl-day">{s.day}</span>
                <span className="ea-tl-dot" aria-hidden="true" />
                <b>{s.t}</b>
                <span>{s.d}</span>
                {s.pay && <em>£ {s.pay}</em>}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
