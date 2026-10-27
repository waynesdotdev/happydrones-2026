/* ESTATE AGENTS PAGE — the pitch for agencies.
   Words: AGENT_OFFER in lib/site.js. Packages and prices: PACKAGES and PRICING. */
import Link from "next/link";
import FpvRoute from "@/components/FpvRoute";
import JsonLd from "@/components/JsonLd";
import { QuoteProvider } from "@/components/QuoteContext";
import { AGENT_OFFER, PACKAGES, SITE, priceFrom, whatsappLink } from "@/lib/site";
import { MORE_AGENT_FAQ } from "@/lib/agents";
import TourFinder from "@/components/agents/TourFinder";
import TourFlow from "@/components/agents/TourFlow";
import WorkingModels from "@/components/agents/WorkingModels";
import AgentBuilder from "@/components/agents/AgentBuilder";
import ListingStrip from "@/components/agents/ListingStrip";

const ALL_FAQ = [...AGENT_OFFER.faq, ...MORE_AGENT_FAQ];

export const metadata = {
  title: "For estate agents",
  description: `Photos, aerial, walkthrough video and FPV tours for estate agents across the North East. One visit per property, files in 48–72 hours, ${AGENT_OFFER.discount} off for ${AGENT_OFFER.minPerMonth}+ listings a month.`,
  alternates: { canonical: "/estate-agents/" },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: ALL_FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

export default function EstateAgentsPage() {
  const wa = whatsappLink("Hi Happy Drones, I'm an estate agent and I'd like to set up an account.");
  return (
    <div className="sub-page">
      <JsonLd data={faqSchema} />

      <section className="page-hero agent-hero" aria-labelledby="agent-title">
        <div className="page-hero-frame" aria-hidden="true">
          <span className="corner tl"></span><span className="corner tr"></span><span className="corner bl"></span><span className="corner br"></span>
        </div>
        <div className="wrap">
          <h1 id="agent-title">Win the<br />instruction.</h1>
          <p>Vendors pick the agent whose marketing looks best. I give every one of your listings photos, aerial, walkthrough video and an FPV tour from a single visit, so yours is the agency they remember.</p>
          <div className="hero-ctas">
            <Link className="btn btn-orange" href="/?role=agent#contact">Set up an agent account</Link>
            {wa && <a className="btn btn-ghost" href={wa} target="_blank" rel="noopener">WhatsApp {SITE.phoneDisplay}</a>}
          </div>
          <dl className="agent-stats">
            <div><dt className="visually-hidden">Visits</dt><dd style={{ margin: 0 }}><b>1</b><span>visit per property</span></dd></div>
            <div><dt className="visually-hidden">Delivery</dt><dd style={{ margin: 0 }}><b>48–72h</b><span>to portal-ready files</span></dd></div>
            <div><dt className="visually-hidden">Formats</dt><dd style={{ margin: 0 }}><b>4</b><span>formats: photo, aerial, video, FPV</span></dd></div>
            <div><dt className="visually-hidden">Discount</dt><dd style={{ margin: 0 }}><b>{AGENT_OFFER.discount}</b><span>off at {AGENT_OFFER.minPerMonth}+ listings a month</span></dd></div>
          </dl>
        </div>
      </section>

      <section className="kit" aria-labelledby="why-title">
        <div className="wrap">
          <h2 id="why-title" className="section-title">Why agents use Happy Drones</h2>
          <div className="perks">
            {AGENT_OFFER.perks.map((p) => <div className="perk" key={p}><i></i>{p}</div>)}
          </div>
        </div>
      </section>

      <section className="ea-sec" id="tours" aria-labelledby="ea-tours-title">
        <div className="wrap">
          <p className="ea-eyebrow">Every property, the right tour</p>
          <h2 id="ea-tours-title" className="section-title">From one-bed flats to country houses.</h2>
          <p className="section-sub">Slide through the property types to see how each one is shot: the aerials outside, the tour inside, and the package it usually needs. Small homes get a smooth handheld glide; bigger homes get a full drone fly-through.</p>
          <TourFinder />
        </div>
      </section>

      <section className="ea-sec ea-sec-alt" aria-labelledby="ea-flow-title-h">
        <div className="wrap">
          <p className="ea-eyebrow">How I choose</p>
          <h2 id="ea-flow-title-h" className="section-title">Which tour? It depends on the space.</h2>
          <p className="section-sub">Flying a drone indoors needs room. Where halls are narrow or ceilings are low, the Osmo Pocket 3 in its FPV mode gives the same flowing, front-door-to-garden feel at walking height, with no risk to the home.</p>
          <TourFlow />
        </div>
      </section>

      <section className="ea-sec ea-dark" aria-labelledby="ea-strip-title">
        <div className="wrap">
          <p className="ea-eyebrow">A listing, start to finish</p>
          <h2 id="ea-strip-title" className="section-title">Instruction to live listing in under a week.</h2>
          <p className="section-sub">Drag or swipe through what happens after you send me an address. You handle the vendor relationship; I handle everything else.</p>
          <ListingStrip />
        </div>
      </section>

      <QuoteProvider>
        <FpvRoute quoteHref="/?service=signature#quote" />
      </QuoteProvider>

      <section className="ea-sec" id="working" aria-labelledby="ea-models-title">
        <div className="wrap">
          <p className="ea-eyebrow">Working together</p>
          <h2 id="ea-models-title" className="section-title">Three ways to work with me.</h2>
          <p className="section-sub">Pay per listing, open an agent account, or buy a bundle. Each one shows what happens, and when you pay.</p>
          <WorkingModels />
        </div>
      </section>

      <section className="ea-sec ea-sec-alt" id="builder" aria-labelledby="ea-builder-title">
        <div className="wrap">
          <p className="ea-eyebrow">Package builder</p>
          <h2 id="ea-builder-title" className="section-title">Build a listing package.</h2>
          <p className="section-sub">Pick the package, the size of the home and the extras, then choose how you work with me. The price per listing and when you pay update as you go.</p>
          <AgentBuilder />
        </div>
      </section>

      <section className="kit" aria-labelledby="offer-title">
        <div className="wrap agent-offer">
          <div>
            <h2 id="offer-title" className="section-title">Agent pricing</h2>
            <p className="section-sub">Book {AGENT_OFFER.minPerMonth} or more listings a month and every package is {AGENT_OFFER.discount} off, invoiced monthly.</p>
            <ul className="ticks" style={{ marginTop: 24 }}>
              {PACKAGES.map((p) => <li key={p.id}>{p.title}: from {priceFrom(p.id)}, {p.tagline.toLowerCase()}</li>)}
            </ul>
            <p style={{ marginTop: 18 }}><Link className="text-link" href="/property/">Compare every package</Link></p>
          </div>
          <div className="offer-card">
            <b>{AGENT_OFFER.discount} off</b>
            <p>every listing when you book {AGENT_OFFER.minPerMonth}+ a month, with a regular weekly slot and one monthly invoice. Book {AGENT_OFFER.bundle.size} at once and white label is free too.</p>
            <Link className="btn btn-orange" href="/?role=agent#contact">Set up an agent account</Link>
          </div>
        </div>
      </section>

      <section className="brand-choice" aria-labelledby="brand-title">
        <div className="wrap">
          <h2 id="brand-title" className="section-title">Your brand, not mine.</h2>
          <p className="section-sub">Choose how each listing is branded. Agency-branded is included on every shoot. White label takes Happy Drones out of the picture completely.</p>
          <div className="brand-grid">
            {AGENT_OFFER.branding.map((b) => (
              <article key={b.id} className={`brand-card${b.featured ? " is-featured" : ""}`}>
                <span className="brand-tag">{b.tag}</span>
                <h3>{b.name}</h3>
                <ul>{b.points.map((p) => <li key={p}>{p}</li>)}</ul>
              </article>
            ))}
          </div>
          <div className="wl-tiers">
            <h3>White label pricing</h3>
            <table>
              <tbody>
                {AGENT_OFFER.whiteLabel.map((t) => <tr key={t.who}><th scope="row">{t.who}</th><td>{t.price}</td></tr>)}
              </tbody>
            </table>
            <p>A bundle is {AGENT_OFFER.bundle.size} listings booked and paid for up front, used within {AGENT_OFFER.bundle.months} months, on properties inside my normal travel area.</p>
          </div>
          <p className="brand-note">You choose per listing, and it&apos;s written into the booking agreement. I keep the copyright either way; you get the licence to market the property. <Link href="/terms/">Read the agreement</Link></p>
        </div>
      </section>

      <section className="ea-sec ea-commercial" aria-labelledby="ea-com-title">
        <div className="wrap ea-com-in">
          <div>
            <p className="ea-eyebrow">Commercial agents</p>
            <h2 id="ea-com-title">Shops, offices and new-build units?</h2>
            <p>Commercial property needs different shots: frontages, access, parking, loading, signage and the location around it. A dedicated commercial property page is on the way. Message me now and I&apos;ll quote.</p>
          </div>
          {wa && <a className="btn btn-orange" href={wa} target="_blank" rel="noopener">Ask about commercial</a>}
        </div>
      </section>

      <section className="faq" aria-labelledby="agent-faq-title">
        <div className="wrap faq-grid">
          <h2 id="agent-faq-title" className="section-title">Questions from agents</h2>
          <div className="faq-list">
            {ALL_FAQ.map((f) => (
              <details key={f.q} name="agent-faq"><summary>{f.q}</summary><p>{f.a}</p></details>
            ))}
          </div>
        </div>
      </section>

      <section className="unsure">
        <div className="wrap unsure-inner">
          <h2 className="section-title">Try it on your next listing.</h2>
          <p>Send me the address of your next instruction and see the results for yourself before setting anything up.</p>
          <div className="unsure-actions">
            <Link className="btn btn-orange" href="/?role=agent#contact">Book a first listing</Link>
            {wa && <a className="btn btn-ghost" href={wa} target="_blank" rel="noopener">Message on WhatsApp</a>}
          </div>
        </div>
      </section>
    </div>
  );
}
