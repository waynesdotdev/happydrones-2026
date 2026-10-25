"use client";
/* Homepage band that points estate agents to their own page. Offer is AGENT_OFFER in lib/site.js */
import Link from "next/link";
import { AGENT_OFFER } from "@/lib/site";
import { useQuote } from "./QuoteContext";

export default function AgentBand() {
  const { setRole } = useQuote();
  return (
    <section className="agent-band" aria-labelledby="agent-band-title">
      <div className="wrap agent-band-grid">
        <div>
          <h2 id="agent-band-title" className="section-title">Estate agent? Make every listing look like this.</h2>
          <p className="section-sub">A regular weekly slot, one visit per property, files in 48–72 hours, and {AGENT_OFFER.discount} off when you book {AGENT_OFFER.minPerMonth} or more listings a month.</p>
          <div className="agent-band-ctas">
            <Link className="btn btn-orange" href="/estate-agents/">See the agent offer</Link>
            <a className="btn btn-ghost" href="#contact" onClick={() => setRole("Estate agent")}>Set up an account</a>
          </div>
        </div>
        <ul className="agent-band-list">
          {AGENT_OFFER.perks.slice(0, 4).map((p) => <li key={p}>{p}</li>)}
        </ul>
      </div>
    </section>
  );
}
