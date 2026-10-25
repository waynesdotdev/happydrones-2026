import Link from "next/link";
import { Arrow } from "./TIcons";
import { SITE } from "@/lib/site";

export default function CtaBand({ title = "Tell me what you're building.", text = "Get a guide price in under a minute, then a fixed quote and flight plan within a day." }) {
  return (
    <section className="t-cta t-dark">
      <div className="t-cta-glow" aria-hidden="true" />
      <div className="wrap t-cta-in">
        <div className="t-stack">
          <span className="t-live">Taking bookings for this month</span>
          <h2>{title}</h2>
        </div>
        <div className="t-cta-actions">
          <p className="t-lede">{text}</p>
          <div className="t-hero-ctas">
            <Link className="t-btn t-btn-primary" href="/plan/">Plan a mission <Arrow /></Link>
            <Link className="t-btn t-btn-ghost" href="/#contact">Send a message</Link>
          </div>
          <p className="t-cta-contact">Or call <b>{SITE.phoneDisplay}</b></p>
        </div>
      </div>
    </section>
  );
}
