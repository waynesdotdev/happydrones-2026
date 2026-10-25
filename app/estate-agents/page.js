/* ESTATE AGENTS PAGE — the pitch for agencies.
   Words: AGENT_OFFER in lib/site.js. Packages and prices: PACKAGES and PRICING. */
import Link from "next/link";
import FpvRoute from "@/components/FpvRoute";
import JsonLd from "@/components/JsonLd";
import { QuoteProvider } from "@/components/QuoteContext";
import { AGENT_OFFER, PACKAGES, SITE, priceFrom, whatsappLink } from "@/lib/site";

export const metadata = {
  title: "For estate agents",
  description: `Photos, aerial, walkthrough video and FPV tours for estate agents across the North East. One visit per property, files in 48–72 hours, ${AGENT_OFFER.discount} off for ${AGENT_OFFER.minPerMonth}+ listings a month.`,
  alternates: { canonical: "/estate-agents/" },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: AGENT_OFFER.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
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

      <section className="how" aria-labelledby="agent-how-title">
        <div className="wrap">
          <h2 id="agent-how-title" className="section-title">How it works for agents</h2>
          <ol className="how-steps">
            {AGENT_OFFER.steps.map((s, i) => (
              <li key={s.title}><span className="how-num">{i + 1}</span><h3>{s.title}</h3><p>{s.text}</p></li>
            ))}
          </ol>
        </div>
      </section>

      <QuoteProvider>
        <FpvRoute quoteHref="/?service=signature#quote" />
      </QuoteProvider>

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
            <p>every listing when you book {AGENT_OFFER.minPerMonth}+ a month, with a regular weekly slot and one monthly invoice.</p>
            <Link className="btn btn-orange" href="/?role=agent#contact">Set up an agent account</Link>
          </div>
        </div>
      </section>

      <section className="faq" aria-labelledby="agent-faq-title">
        <div className="wrap faq-grid">
          <h2 id="agent-faq-title" className="section-title">Questions from agents</h2>
          <div className="faq-list">
            {AGENT_OFFER.faq.map((f) => (
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
