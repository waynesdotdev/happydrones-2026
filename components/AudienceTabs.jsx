"use client";
/* "Who it's for" tabs. Edit the words in AUDIENCES in lib/site.js */
import Link from "next/link";
import { useRef, useState } from "react";
import ServiceArt from "./ServiceArt";
import { AUDIENCES, priceFrom } from "@/lib/site";
import { useQuote } from "./QuoteContext";

export default function AudienceTabs() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef([]);
  const { setService } = useQuote();

  const select = (i, focus) => {
    setActive(i);
    if (focus) tabRefs.current[i]?.focus();
    tabRefs.current[i]?.scrollIntoView({ block: "nearest", inline: "nearest" });
  };
  const onKey = (e, i) => {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (dir) { e.preventDefault(); select((i + dir + AUDIENCES.length) % AUDIENCES.length, true); }
  };

  return (
    <section className="who" id="who" aria-labelledby="who-title">
      <div className="wrap">
        <h2 id="who-title" className="section-title">Who it&apos;s for</h2>
        <p className="section-sub">Pick the one that sounds like you to see what you get and what it costs.</p>

        <div className="tabs" role="tablist" aria-label="Choose who you are">
          {AUDIENCES.map((a, i) => (
            <button
              key={a.tab}
              role="tab"
              id={`tab-${i}`}
              aria-controls={`panel-${i}`}
              aria-selected={i === active}
              tabIndex={i === active ? 0 : -1}
              ref={(el) => (tabRefs.current[i] = el)}
              onClick={() => select(i)}
              onKeyDown={(e) => onKey(e, i)}
            >
              {a.tab}
            </button>
          ))}
        </div>

        <div className="tab-panels">
          {AUDIENCES.map((a, i) => (
            <article key={a.tab} className="panel" role="tabpanel" id={`panel-${i}`} aria-labelledby={`tab-${i}`} hidden={i !== active}>
              <div className="panel-copy">
                <h3>{a.title}</h3>
                <p>{a.text}</p>
                <ul className="ticks">{a.ticks.map((t) => <li key={t}>{t}</li>)}</ul>
                <div className="panel-foot">
                  <span className="from">From <b>{priceFrom(a.quote)}</b></span>
                  <Link className="text-link" href={a.details}>Full details</Link>
                  <a className="btn btn-navy" href="#quote" onClick={() => setService(a.quote)}>{a.cta}</a>
                </div>
              </div>
              <figure className="panel-art" aria-hidden="true"><ServiceArt name={a.art} /></figure>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
