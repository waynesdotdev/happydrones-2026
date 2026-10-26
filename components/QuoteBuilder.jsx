"use client";
/* The 3-step quote builder and the "shoot plan" ticket.
   Prices and options come from PRICING in lib/site.js */
import { useEffect, useMemo, useRef, useState } from "react";
import { PRICING, PAYMENT, SITE, money, depositFor } from "@/lib/site";
import { useQuote } from "./QuoteContext";

const GROUPS = [
  { id: "property", title: "Property" },
  { id: "business", title: "Business & other" },
];

export default function QuoteBuilder() {
  const { service, setService, setPlan } = useQuote();
  const [size, setSize] = useState(0);
  const [extras, setExtras] = useState([]);
  const [bump, setBump] = useState(false);
  const firstRender = useRef(true);

  const svc = PRICING.services.find((s) => s.id === service) || PRICING.services[0];
  const visibleExtras = PRICING.extras.filter((x) => x.for.includes(svc.id));

  // A link like /?service=signature#quote picks that option
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("service");
    if (fromUrl && PRICING.services.some((s) => s.id === fromUrl && !s.soon)) setService(fromUrl);
  }, [setService]);

  // New option: reset size and drop extras that don't apply
  useEffect(() => {
    setSize(0);
    setExtras((list) => list.filter((id) => PRICING.extras.find((x) => x.id === id)?.for.includes(service)));
  }, [service]);

  const { items, total, summary } = useMemo(() => {
    const z = svc.sizes[size] || svc.sizes[0];
    const items = [[svc.name, svc.base], [z.name, z.add]];
    PRICING.extras.forEach((x) => { if (extras.includes(x.id) && x.for.includes(svc.id)) items.push([x.name, x.price]); });
    const total = items.reduce((a, [, v]) => a + v, 0);
    return { items, total, summary: items.map(([n]) => n).join(", ") };
  }, [svc, size, extras]);

  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    setBump(true);
    const t = setTimeout(() => setBump(false), 320);
    return () => clearTimeout(t);
  }, [total]);

  const toggleExtra = (id) => setExtras((list) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]));

  return (
    <section className="quote" id="quote" aria-labelledby="quote-title">
      <div className="wrap">
        <h2 id="quote-title" className="section-title">Build your quote</h2>
        <p className="section-sub">Three quick choices and you&apos;ll see a price. It&apos;s an estimate: I confirm the final figure after a quick chat about the property.</p>

        <div className="quote-grid">
          <div className="quote-steps">
            <fieldset className="qstep">
              <legend><span className="qnum">1</span> What do you need?</legend>
              {GROUPS.map((g) => (
                <div key={g.id} className="qgroup">
                  <p className="qgroup-title">{g.title}</p>
                  <div className="choices">
                    {PRICING.services.filter((s) => s.group === g.id && !s.soon).map((s) => (
                      <div className="choice" key={s.id}>
                        <input type="radio" name="q-service" id={`qs-${s.id}`} value={s.id} checked={s.id === svc.id} onChange={() => setService(s.id)} />
                        <label htmlFor={`qs-${s.id}`}><b>{s.name}</b><small>{s.desc}. From {money(s.base)}</small></label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </fieldset>

            <fieldset className="qstep">
              <legend><span className="qnum">2</span> <span>{svc.sizeTitle}</span></legend>
              <div className="choices choices-row">
                {svc.sizes.map((z, i) => (
                  <div className="choice" key={z.name}>
                    <input type="radio" name="q-size" id={`qz-${i}`} value={i} checked={i === size} onChange={() => setSize(i)} />
                    <label htmlFor={`qz-${i}`}><b>{z.name}</b><small>{z.add ? "+" + money(z.add) : "Included"}</small></label>
                  </div>
                ))}
              </div>
            </fieldset>

            {visibleExtras.length > 0 && (
              <fieldset className="qstep">
                <legend><span className="qnum">3</span> Any extras?</legend>
                <div className="extras">
                  {visibleExtras.map((x) => (
                    <div className="extra" key={x.id}>
                      <input type="checkbox" id={`qe-${x.id}`} checked={extras.includes(x.id)} onChange={() => toggleExtra(x.id)} />
                      <label htmlFor={`qe-${x.id}`}>
                        <span className="extra-name">{x.name}<small>{x.desc}</small></span>
                        <span className="extra-price">+{money(x.price)}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </fieldset>
            )}
          </div>

          <aside className="ticket" aria-live="polite">
            <div className="ticket-top">
              <span>Shoot plan</span>
              <svg className="ticket-icon" viewBox="0 0 40 40" aria-hidden="true"><g stroke="#FF6B35" strokeWidth="3" strokeLinecap="round"><path d="M15 17L8 10M25 17l7-7M15 23l-7 7M25 23l7 7" /></g><g fill="#FF6B35"><circle cx="8" cy="10" r="5" /><circle cx="32" cy="10" r="5" /><circle cx="8" cy="30" r="5" /><circle cx="32" cy="30" r="5" /></g><rect x="13" y="14" width="14" height="12" rx="5" fill="#fff" /></svg>
            </div>
            <ul className="ticket-lines">
              {items.map(([n, v]) => <li key={n}><span>{n}</span><span>{v ? money(v) : "Included"}</span></li>)}
            </ul>
            <div className="ticket-total">
              <span>Estimated total</span>
              <b className={bump ? "bump" : undefined}>{money(total)}</b>
            </div>
            <p className="ticket-note">
              Travel {SITE.areaShort} is included.{SITE.introPricing ? " Introductory pricing." : ""}{" "}
              {total >= PAYMENT.largeFrom
                ? `Invoiced on ${PAYMENT.termsDays}-day terms.`
                : `A ${PAYMENT.depositPct}% deposit (${money(depositFor(total))}) secures your date; the balance is due before full files are released.`}
            </p>
            <a className="btn btn-orange btn-block" href="#contact" onClick={() => setPlan({ summary, total: money(total) })}>
              Send me this quote
            </a>
          </aside>
        </div>
      </div>
    </section>
  );
}
