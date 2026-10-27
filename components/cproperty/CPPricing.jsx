"use client";
/* Commercial property packages with a unit-size switch that updates the prices. */
import { useState } from "react";
import { CP_PACKAGES, CP_SIZES } from "@/lib/cproperty";
import { money } from "@/lib/site";

export default function CPPricing() {
  const [sz, setSz] = useState(0);
  const add = CP_SIZES[sz].add;
  return (
    <div className="cp-pricing">
      <div className="cp-size" role="radiogroup" aria-label="Unit size">
        {CP_SIZES.map((s, n) => (
          <button key={s.id} type="button" role="radio" aria-checked={n === sz} className={n === sz ? "on" : undefined} onClick={() => setSz(n)}>
            {s.name}{s.add ? <small>+{money(s.add)}</small> : <small>Base price</small>}
          </button>
        ))}
      </div>
      <div className="cp-pkgs">
        {CP_PACKAGES.map((p) => (
          <article key={p.id} className={`cp-pkg${p.featured ? " is-featured" : ""}`}>
            <span className="cp-pkg-tag">{p.tag}</span>
            <h3>{p.name}</h3>
            <p className="cp-pkg-price"><small>From</small> {money(p.price + add)}</p>
            <ul>{p.gets.map((g) => <li key={g}>{g}</li>)}</ul>
          </article>
        ))}
      </div>
      <p className="cp-pricing-note">Over 100,000 sq ft, or a whole estate? Priced per job. Guide prices; you get a fixed quote in writing before anything is booked.</p>
    </div>
  );
}
