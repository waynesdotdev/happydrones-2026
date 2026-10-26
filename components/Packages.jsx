"use client";
/* Homepage package cards. Words come from PACKAGES, prices from PRICING (lib/site.js).
   "Choose" picks that package in the quote builder. */
import Link from "next/link";
import KitIcon from "./KitIcon";
import { PACKAGES, SINGLES, SITE, PAYMENT, priceFrom, kitById } from "@/lib/site";
import { useQuote } from "./QuoteContext";

export default function Packages() {
  const { setService } = useQuote();
  return (
    <section className="packages" id="packages" aria-labelledby="packages-title">
      <div className="wrap">
        <div className="packages-head">
          <h2 id="packages-title" className="section-title">Property packages</h2>
          <p className="section-sub">
            Fixed prices for flats and 1–2 bed homes. Larger homes are priced in the quote builder.
            {SITE.introPricing && <span className="intro-tag">Introductory pricing</span>}
          </p>
        </div>

        <div className="pk-grid">
          {PACKAGES.map((p) => (
            <article key={p.id} className={`pk${p.featured ? " is-featured" : ""}`}>
              {p.featured && <span className="pk-flag">Most popular</span>}
              <h3>{p.title}</h3>
              <p className="pk-tag">{p.tagline}</p>
              <p className="pk-price"><small>From</small> {priceFrom(p.id)}</p>
              <ul className="pk-list">{p.gets.map((g) => <li key={g}>{g}</li>)}</ul>
              <div className="pk-kit" aria-label="Kit used">
                {p.kit.map((k) => <span key={k} title={kitById(k)?.name}><KitIcon id={k} /></span>)}
              </div>
              <a className={`btn ${p.featured ? "btn-orange" : "btn-navy"} btn-block`} href="#quote" onClick={() => setService(p.id)}>
                Choose {p.title}
              </a>
            </article>
          ))}
        </div>

        <div className="pk-singles">
          {SINGLES.map((s) => (
            <a key={s.id} className="pk-single" href="#quote" onClick={() => setService(s.id)}>
              <b>{s.title} <span>from {priceFrom(s.id)}</span></b>
              <small>{s.text}</small>
            </a>
          ))}
          <Link className="pk-single pk-compare" href="/property/">
            <b>Compare every package</b>
            <small>Side by side, with what&apos;s included and how each shoot runs.</small>
          </Link>
        </div>

        <ul className="pk-pay" aria-label="How payment works">
          <li><b>{PAYMENT.depositPct}% deposit</b> secures your date</li>
          <li><b>Balance before full files</b> are released, after you&apos;ve seen the previews</li>
          <li><b>Jobs of £{PAYMENT.largeFrom.toLocaleString("en-GB")}+</b> and repeat visits: invoiced on {PAYMENT.termsDays}-day terms</li>
        </ul>
      </div>
    </section>
  );
}
