"use client";
/* Agent package builder: pick a package, the property size, extras and how you
   work with me (pay as you go, agent account or 10-listing bundle). Shows the
   price per listing, what's discounted, and when you pay, as a simple bar.
   Prices: PRICING, AGENT_OFFER and PAYMENT in lib/site.js; models in lib/agents.js. */
import { useEffect, useMemo, useState } from "react";
import { PRICING, PAYMENT, AGENT_OFFER, money } from "@/lib/site";
import { MODELS } from "@/lib/agents";

const PKGS = ["aerial", "essentials", "showcase", "signature"];
const AGENT_EXTRAS = ["floorplan", "dusk", "extra10", "intro", "reel", "rush"];

export default function AgentBuilder() {
  const [pkg, setPkg] = useState("showcase");
  const [size, setSize] = useState(1);
  const [extras, setExtras] = useState([]);
  const [model, setModel] = useState("account");
  const [wl, setWl] = useState(false);

  useEffect(() => {
    const onPick = (e) => { setPkg(e.detail.pkg); setSize(e.detail.size); };
    window.addEventListener("ea-pick", onPick);
    return () => window.removeEventListener("ea-pick", onPick);
  }, []);

  const svc = PRICING.services.find((s) => s.id === pkg);
  const sizes = svc.sizes || [];
  const sizeIdx = Math.min(size, sizes.length - 1);
  const avail = PRICING.extras.filter((x) => AGENT_EXTRAS.includes(x.id) && x.for.includes(pkg));
  const m = MODELS.find((x) => x.id === model);

  const q = useMemo(() => {
    const base = svc.base + (sizes[sizeIdx]?.add || 0);
    const disc = Math.round(base * m.discount);
    const ex = avail.filter((x) => extras.includes(x.id));
    const exTotal = ex.reduce((a, x) => a + x.price, 0);
    const wlPrice = wl ? m.whiteLabel : 0;
    const per = base - disc + exTotal + wlPrice;
    const deposit = model === "payg" ? Math.round(per * PAYMENT.depositPct / 100) : 0;
    const bundleTotal = model === "bundle" ? per * AGENT_OFFER.bundle.size : 0;
    return { base, disc, ex, exTotal, wlPrice, per, deposit, bundleTotal };
  }, [svc, sizes, sizeIdx, m, avail, extras, wl, model]);

  const toggle = (id) => setExtras((l) => (l.includes(id) ? l.filter((x) => x !== id) : [...l, id]));

  // payment bar segments
  const segs = model === "payg"
    ? [{ k: "Deposit when you book", v: q.deposit }, { k: "Balance before full files", v: q.per - q.deposit }]
    : model === "account"
      ? [{ k: "On your month-end invoice", v: q.per }]
      : [{ k: `Paid up front, per listing (${AGENT_OFFER.bundle.size} in the bundle)`, v: q.per }];

  return (
    <div className="ea-builder">
      <div className="ea-b-form">
        <fieldset>
          <legend>1. Package</legend>
          <div className="ea-chips">
            {PKGS.map((id) => { const s = PRICING.services.find((x) => x.id === id); return (
              <button key={id} type="button" className={id === pkg ? "on" : undefined} aria-pressed={id === pkg} onClick={() => { setPkg(id); setExtras([]); }}>
                <b>{s.name}</b><small>{s.desc}</small>
              </button>
            ); })}
          </div>
        </fieldset>
        <fieldset>
          <legend>2. Property size</legend>
          <div className="ea-chips ea-chips-3">
            {sizes.map((z, n) => (
              <button key={z.name} type="button" className={n === sizeIdx ? "on" : undefined} aria-pressed={n === sizeIdx} onClick={() => setSize(n)}>
                <b>{z.name}</b><small>{z.add ? `+${money(z.add)}` : "Included"}</small>
              </button>
            ))}
          </div>
        </fieldset>
        {avail.length > 0 && (
          <fieldset>
            <legend>3. Extras</legend>
            <div className="ea-extras">
              {avail.map((x) => (
                <label key={x.id} className={extras.includes(x.id) ? "on" : undefined}>
                  <input type="checkbox" checked={extras.includes(x.id)} onChange={() => toggle(x.id)} />
                  <span><b>{x.name}</b><small>{x.desc}</small></span>
                  <em>+{money(x.price)}</em>
                </label>
              ))}
            </div>
          </fieldset>
        )}
        <fieldset>
          <legend>4. How you work with me</legend>
          <div className="ea-chips ea-chips-3">
            {MODELS.map((x) => (
              <button key={x.id} type="button" className={x.id === model ? "on" : undefined} aria-pressed={x.id === model} onClick={() => setModel(x.id)}>
                <b>{x.name}</b><small>{x.tag}</small>
              </button>
            ))}
          </div>
          <label className={`ea-wl${wl ? " on" : ""}`}>
            <input type="checkbox" checked={wl} onChange={() => setWl(!wl)} />
            <span><b>White label</b><small>Your branding only. Happy Drones appears nowhere.</small></span>
            <em>{m.whiteLabel ? `+${money(m.whiteLabel)}` : "Free"}</em>
          </label>
        </fieldset>
      </div>

      <aside className="ea-b-sum" aria-live="polite">
        <p className="ea-kicker">YOUR LISTING PACKAGE</p>
        <ul>
          <li><span>{svc.name} · {sizes[sizeIdx]?.name}</span><b>{money(q.base)}</b></li>
          {q.disc > 0 && <li className="ea-save"><span>{AGENT_OFFER.discount} agent discount</span><b>−{money(q.disc)}</b></li>}
          {q.ex.map((x) => <li key={x.id}><span>{x.name}</span><b>+{money(x.price)}</b></li>)}
          {wl && <li><span>White label</span><b>{q.wlPrice ? `+${money(q.wlPrice)}` : "Free"}</b></li>}
        </ul>
        <div className="ea-total"><span>Per listing</span><b>{money(q.per)}</b></div>
        {model === "bundle" && <p className="ea-bundle">{AGENT_OFFER.bundle.size} listings: <b>{money(q.bundleTotal)}</b>, used within {AGENT_OFFER.bundle.months} months</p>}

        <div className="ea-paybar" aria-label="When you pay">
          {segs.map((s, n) => <i key={s.k} style={{ flexGrow: Math.max(1, s.v), "--c": n ? "#8DB4DE" : "var(--orange)" }} />)}
        </div>
        <ul className="ea-paykey">
          {segs.map((s, n) => <li key={s.k}><i style={{ background: n ? "#8DB4DE" : "var(--orange)" }} /><span>{s.k}</span><b>{money(s.v)}</b></li>)}
        </ul>
        <p className="ea-fine">Guide prices. Travel included in the core area. You get a fixed price in writing before anything is booked.</p>
        <a className="btn btn-orange btn-block" href="/?role=agent#contact">Set up an agent account</a>
      </aside>
    </div>
  );
}
