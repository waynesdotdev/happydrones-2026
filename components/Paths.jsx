/* "Two ways I fly": the fork between homes and commercial work. */
import Link from "next/link";
import ServiceArt from "./ServiceArt";
import { PRICING, PAYMENT, money } from "@/lib/site";

const from = (id) => money(PRICING.services.find((s) => s.id === id)?.base || 0);

export default function Paths() {
  return (
    <section className="paths" aria-labelledby="paths-title">
      <div className="wrap">
        <h2 id="paths-title" className="section-title">Two ways I fly.</h2>
        <div className="paths-grid">
          <article className="path path-homes">
            <div className="path-art" aria-hidden="true"><ServiceArt name="walkthrough" /></div>
            <div className="path-body">
              <p className="path-tag">Homes · from {from("essentials")}</p>
              <h3>Selling or letting a home</h3>
              <ul className="ticks">
                <li>Listing photos, aerials and walkthrough video in one visit</li>
                <li>One-take FPV tours for premium homes</li>
                <li>Agent rates from 4 listings a month</li>
              </ul>
              <div className="path-ctas">
                <Link className="btn btn-orange" href="/#packages">See property packages</Link>
                <Link className="btn btn-navy" href="/estate-agents/">For estate agents</Link>
              </div>
            </div>
          </article>
          <article className="path path-commercial">
            <div className="path-art" aria-hidden="true"><ServiceArt name="mapping" /></div>
            <div className="path-body">
              <p className="path-tag">Commercial · from {from("construction")}</p>
              <h3>Building, running or promoting a site</h3>
              <ul className="ticks">
                <li><Link href="/construction/">Construction progress</Link> from the same positions every visit</li>
                <li>Monthly visits on {PAYMENT.termsDays}-day invoice terms</li>
                <li>Aerial film, events and inspections</li>
              </ul>
              <div className="path-ctas">
                <Link className="btn btn-orange" href="/commercial/">Commercial services</Link>
                <Link className="btn btn-ghost" href="/plan/">Plan a mission</Link>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
