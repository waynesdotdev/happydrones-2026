/* COMMERCIAL PROPERTY — in-depth page for commercial agents, landlords and developers.
   happydrones.co.uk/commercial-property · Words and prices: lib/cproperty.js */
import Link from "next/link";
import CtaBand from "@/components/CtaBand";
import TFaq from "@/components/TFaq";
import JsonLd from "@/components/JsonLd";
import { Arrow } from "@/components/TIcons";
import HeroUnit from "@/components/cproperty/HeroUnit";
import FlyoverReveal from "@/components/cproperty/FlyoverReveal";
import TypeExplorer from "@/components/cproperty/TypeExplorer";
import ContextMap from "@/components/cproperty/ContextMap";
import CPPricing from "@/components/cproperty/CPPricing";
import { SITE, PAYMENT, AGENT_OFFER, money, whatsappLink } from "@/lib/site";
import { CP_PACKAGES, CP_EXTRAS, CP_PROCESS, CP_PRACTICAL, CP_FAQ } from "@/lib/cproperty";

export const metadata = {
  title: "Commercial property drone photography",
  description: "Aerial and ground photography, video and FPV tours for commercial agents across the North East: industrial units, offices, retail, trade parks, land and leisure.",
  alternates: { canonical: "/commercial-property/" },
};

const WHO = [
  { t: "Commercial agents", d: "Particulars, portal listings and LinkedIn content that let units faster." },
  { t: "Landlords and asset managers", d: "Up-to-date imagery of every unit on the estate, for voids, renewals and investor reports." },
  { t: "Developers", d: "Speculative units marketed from groundworks to practical completion. Pairs with construction progress." },
  { t: "Investment agents", d: "Flagship imagery and location films for portfolio and single-asset sales." },
];

const GETS = [
  { t: "Annotated hero aerial", d: "Site edged in colour, access marked, key roads and drive times labelled." },
  { t: "Location aerials", d: "Pulled-back shots that show the site in its surroundings: roads, neighbours, the town." },
  { t: "Exterior photos", d: "Frontage, signage, entrance, parking and yard, shot from the ground and low from the air." },
  { t: "Interior photos", d: "Warehouse floor, offices, reception, welfare and plant, with the lights on and the clutter out." },
  { t: "Marketing video", d: "60–90 seconds with aerials, interiors and captions. Landscape for portals, vertical for LinkedIn." },
  { t: "FPV fly-through", d: "One take from the yard, through the loading door and up into the offices. In the Flagship package." },
];

export default function CommercialPropertyPage() {
  const from = Math.min(...CP_PACKAGES.map((p) => p.price));
  const wa = whatsappLink("Hi Happy Drones, I'm a commercial agent and I'd like a quote for a unit.");
  const schema = [
    { "@context": "https://schema.org", "@type": "Service", name: "Commercial property drone photography", areaServed: SITE.areaServed, provider: { "@type": "LocalBusiness", name: SITE.name, url: SITE.url, telephone: SITE.phone }, offers: { "@type": "Offer", price: from, priceCurrency: "GBP" } },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: CP_FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ];

  return (
    <div className="sub-page cx cp">
      <JsonLd data={schema} />

      {/* HERO */}
      <section className="cx-hero t-dark" aria-labelledby="cp-title">
        <div className="wrap cx-hero-in">
          <div className="cx-hero-copy">
            <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true"> / </span><Link href="/estate-agents/">Estate agents</Link><span aria-hidden="true"> / </span><span aria-current="page">Commercial property</span></nav>
            <span className="t-live">For commercial agents · {SITE.areaServed}</span>
            <h1 id="cp-title">Show the whole site. Let it faster.</h1>
            <p className="t-lede">Industrial units, offices, shops, trade parks, land and leisure. Aerials that show the yard, the access and the road links, plus interiors and video, all from one visit.</p>
            <div className="t-hero-ctas">
              <a className="t-btn t-btn-primary" href="#cp-pricing">See packages <Arrow /></a>
              {wa && <a className="t-btn t-btn-ghost" href={wa} target="_blank" rel="noopener">WhatsApp {SITE.phoneDisplay}</a>}
            </div>
          </div>
          <figure className="cx-hero-art t-frame"><HeroUnit /></figure>
        </div>
        <div className="wrap">
          <dl className="cx-stats">
            <div><dt>Packages from</dt><dd>{money(from)}<small>per property</small></dd></div>
            <div><dt>Extra units</dt><dd>+£75<small>same estate, same visit</small></dd></div>
            <div><dt>Delivered in</dt><dd>48–72 h<small>named by unit</small></dd></div>
            <div><dt>Insured</dt><dd>{SITE.insurance.publicLiability}<small>public liability</small></dd></div>
          </dl>
        </div>
      </section>

      {/* WHO */}
      <section className="t-section t-dark" aria-labelledby="cp-who-title" style={{ paddingTop: "clamp(40px, 6vw, 72px)" }}>
        <div className="wrap">
          <div className="t-head"><span className="t-tag">Who it&apos;s for</span><h2 id="cp-who-title">Commercial property is sold on location. Show it.</h2></div>
          <div className="t-why cp-who">{WHO.map((w) => <div key={w.t}><h3>{w.t}</h3><p>{w.d}</p></div>)}</div>
        </div>
      </section>

      {/* SCROLL FLYOVER */}
      <FlyoverReveal />

      {/* TYPES */}
      <section className="ea-sec ea-sec-alt" aria-labelledby="cp-types-title">
        <div className="wrap">
          <p className="ea-eyebrow">Every kind of commercial property</p>
          <h2 id="cp-types-title" className="section-title">Six property types, six different shot lists.</h2>
          <p className="section-sub">A warehouse occupier and a café owner want very different things. Swipe through the types to see what each one needs and how it&apos;s shot.</p>
          <TypeExplorer />
        </div>
      </section>

      {/* CONTEXT MAP */}
      <section className="ea-sec" aria-labelledby="cp-map-title">
        <div className="wrap">
          <p className="ea-eyebrow">Location sells</p>
          <h2 id="cp-map-title" className="section-title">The location aerial, explained.</h2>
          <p className="section-sub">Every package includes a hero aerial with the site edged and annotated. Switch the layers on and off to see what can be shown.</p>
          <ContextMap />
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section className="t-section t-dark" aria-labelledby="cp-get-title">
        <div className="wrap">
          <div className="t-head t-split">
            <div className="t-stack"><span className="t-tag">What you get</span><h2 id="cp-get-title">Everything the particulars need.</h2></div>
            <p className="t-lede">Files sized for Rightmove Commercial, Zoopla, EG and your own website, plus vertical cuts for LinkedIn. Named by unit so nothing gets mixed up on a multi-let estate.</p>
          </div>
          <ol className="cx-deliv cp-deliv">{GETS.map((d, i) => <li key={d.t}><span className="t-mono">CM-{String(i + 1).padStart(2, "0")}</span><div><h3>{d.t}</h3><p>{d.d}</p></div></li>)}</ol>
        </div>
      </section>

      {/* PRICING */}
      <section className="ea-sec ea-sec-alt" id="cp-pricing" aria-labelledby="cp-price-title">
        <div className="wrap">
          <p className="ea-eyebrow">Packages</p>
          <h2 id="cp-price-title" className="section-title">Three packages, priced by unit size.</h2>
          <p className="section-sub">Pick the size of the unit and the prices update. Travel is included in the core area; sites further out are quoted with travel.</p>
          <CPPricing />
          <div className="cp-extras">
            {CP_EXTRAS.map((x) => <div key={x.t}><b>{x.t}</b><em>{x.p}</em><span>{x.d}</span></div>)}
          </div>
          <div className="cp-billing">
            <h3>How billing works</h3>
            <p>Agent accounts ({AGENT_OFFER.minPerMonth}+ instructions a month) get {AGENT_OFFER.discount} off and one monthly invoice. Jobs of {money(PAYMENT.largeFrom)} or more, and repeat work, are invoiced on {PAYMENT.termsDays}-day terms. One-off jobs take a {PAYMENT.depositPct}% deposit. Agency branding and white label work exactly as on the <Link href="/estate-agents/#working">estate agents page</Link>.</p>
          </div>
        </div>
      </section>

      {/* PROCESS + PRACTICAL */}
      <section className="t-section t-dark" aria-labelledby="cp-proc-title">
        <div className="wrap">
          <div className="t-head t-split">
            <div className="t-stack"><span className="t-tag">How it works</span><h2 id="cp-proc-title">From instruction to particulars.</h2></div>
            <p className="t-lede">You send the address. I arrange access, fly, edit and deliver. One point of contact throughout.</p>
          </div>
          <ol className="cx-process">{CP_PROCESS.map((s) => <li key={s.t}><span className="t-mono">{s.tag}</span><h3>{s.t}</h3><p>{s.d}</p></li>)}</ol>
          <div className="t-head" style={{ marginTop: "clamp(48px, 7vw, 90px)" }}><span className="t-tag">On site</span><h2>Working sites, occupied units and airports.</h2></div>
          <ul className="cx-comp cp-practical">{CP_PRACTICAL.map((c) => <li key={c.t}><b>{c.t}</b><span>{c.d}</span></li>)}</ul>
          <p style={{ marginTop: 24 }}><Link className="text-link" href="/construction/">Building speculative units? See construction progress</Link></p>
        </div>
      </section>

      {/* FAQ */}
      <section className="t-section t-dark" aria-labelledby="cp-faq-title" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="t-head"><span className="t-tag">Questions from commercial agents</span><h2 id="cp-faq-title">Before you instruct.</h2></div>
          <TFaq items={CP_FAQ} />
        </div>
      </section>

      <CtaBand title="Got a unit to let?" text="Send the address and the size. You'll get a fixed price and a shoot date within a day." />
    </div>
  );
}
