/* FOR BUSINESS — the front door for customers who need a pilot more than once:
   estate and letting agents, builders and developers, landlords, property
   managers, roofers and surveyors.
   happydrones.co.uk/business
   Prices come from lib/site.js (AGENT_OFFER, PRICING, VACANT). Form: components/BusinessForm.jsx */
import Credentials from "@/components/Credentials";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import BusinessForm from "@/components/BusinessForm";
import { Arrow } from "@/components/TIcons";
import { SITE, AGENT_OFFER, BUNDLE, VACANT, PAYMENT, TRAVEL_TEXT, BUSINESS_STEPS as STEPS, money, priceFrom } from "@/lib/site";

export const metadata = {
  title: "Drone photography and inspections for business",
  description: "A regular drone pilot for North East businesses: listings for estate agents, monthly progress visits for builders, and roof and empty-building checks for landlords and trades. Fixed prices, one invoice.",
  alternates: { canonical: "/business/" },
};

const WHY = [
  { t: "The same pilot every time", d: "You deal with Wayne from the first call to the last file. He flies, edits and sends every job himself, so the standard doesn't change." },
  { t: "A set slot, not a scramble", d: "Agents get a regular weekly slot. Sites and buildings get the same week every month. You don't have to chase a date." },
  { t: "Fixed prices and one invoice", d: `Every price is on this website. Regular work goes on one monthly invoice on ${PAYMENT.termsDays}-day terms.` },
];


export default function BusinessPage() {
  const WHO = [
    {
      id: "agents", tag: "Estate and letting agents", title: "Every listing shot in one visit",
      price: `${AGENT_OFFER.discount} off at ${AGENT_OFFER.minPerMonth}+ listings a month`,
      ticks: ["Photos, aerials and walkthrough video by one person, in one visit", "Edited files in 48 to 72 hours, sized for every portal", `An agent account with one monthly invoice, or a bundle of ${BUNDLE.size} listings paid up front`, "Your branding on the video, or none at all"],
      href: "/estate-agents/", label: "See the agent offer", more: { href: "/commercial-property/", label: "Commercial property" },
    },
    {
      id: "builders", tag: "Builders and developers", title: "The build recorded month by month",
      price: `From ${priceFrom("construction")} a visit`,
      ticks: ["The same positions and heights every visit, so progress lines up", "Dated photos and film for clients, funders and your own marketing", "Money off when you book a run of monthly visits", "Site rules followed: your induction, hi-vis and sign-in, with a risk assessment in writing"],
      href: "/construction/", label: "Construction progress", more: { href: "/plan/", label: "Price a run of visits" },
    },
    {
      id: "buildings", tag: "Landlords, managers and trades", title: "Roofs and empty buildings checked from the air",
      price: `From ${money(VACANT.perVisit)} a visit`,
      ticks: [`Empty buildings checked monthly for ${money(VACANT.perVisit)} a visit, with a dated report`, `Roof checks from ${priceFrom("roof")}: no scaffolding, nobody on the roof`, "A marked-up photo pack for your insurer, your client or your roofer", "Roofers and surveyors: send me the roofs you can't safely reach"],
      href: "/vacant-property-monitoring/", label: "Empty building checks", more: { href: "/roof-inspections/", label: "Roof inspections" },
    },
  ];
  const schema = { "@context": "https://schema.org", "@type": "Service", name: "Drone photography and inspections for business", areaServed: SITE.areaServed, provider: { "@type": "LocalBusiness", name: SITE.name, url: SITE.url, telephone: SITE.phone } };

  return (
    <div className="sub-page cx biz">
      <JsonLd data={schema} />

      <section className="cx-hero t-dark" aria-labelledby="biz-title">
        <div className="wrap">
          <div className="cx-hero-copy">
            <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true"> / </span><span aria-current="page">For business</span></nav>
            <span className="t-live">For business · {SITE.areaServed}</span>
            <h1 id="biz-title">Your regular drone pilot.</h1>
            <p className="t-lede">Listings for estate agents. Monthly progress for builders. Roof and empty-building checks for landlords and trades. One pilot, fixed prices and one invoice.</p>
            <div className="t-hero-ctas">
              <Link className="t-btn t-btn-primary" href="#start">Start with one job <Arrow /></Link>
              <a className="t-btn t-btn-ghost" href={`tel:${SITE.phone}`}>Call {SITE.phoneDisplay}</a>
            </div>
          </div>
          <dl className="cx-stats">
            <div><dt>Files in</dt><dd>48–72 h<small>every job</small></dd></div>
            <div><dt>Insured</dt><dd>{SITE.insurance.publicLiability}<small>public liability</small></dd></div>
            <div><dt>Registered</dt><dd>CAA · ICO<small>operator and data protection</small></dd></div>
            <div><dt>Paying</dt><dd>{PAYMENT.termsDays} days<small>monthly invoice on regular work</small></dd></div>
          </dl>
        </div>
      </section>
      <Credentials />

      <section className="t-section t-light" aria-labelledby="biz-who-title">
        <div className="wrap">
          <div className="t-head t-split">
            <div className="t-stack"><span className="t-tag">Who I work for</span><h2 id="biz-who-title">Three kinds of business. One kind of service.</h2></div>
            <p className="t-lede">Pick the one closest to you. Each has its own page with examples, the full price list and the small print.</p>
          </div>
          <div className="biz-who">
            {WHO.map((w) => (
              <article key={w.id} className="biz-card">
                <p className="t-mono">{w.tag}</p>
                <h3>{w.title}</h3>
                <p className="biz-price">{w.price}</p>
                <ul className="ticks">{w.ticks.map((t) => <li key={t}>{t}</li>)}</ul>
                <div className="biz-ctas">
                  <Link className="btn btn-orange" href={w.href}>{w.label}</Link>
                  <Link className="text-link" href={w.more.href}>{w.more.label}</Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="t-section t-dark" aria-labelledby="biz-why-title">
        <div className="wrap">
          <div className="t-head"><span className="t-tag">Why a regular pilot</span><h2 id="biz-why-title">Booked once. Then it&apos;s one less thing to organise.</h2></div>
          <div className="t-why cx-why">{WHY.map((w) => <div key={w.t}><h3>{w.t}</h3><p>{w.d}</p></div>)}</div>
        </div>
      </section>

      <section className="t-section t-dark" aria-labelledby="biz-how-title" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="t-head t-split">
            <div className="t-stack"><span className="t-tag">How it starts</span><h2 id="biz-how-title">One job first. A regular slot if it works.</h2></div>
            <p className="t-lede">Nobody should sign up for a year of visits on a promise. Try one job at the normal price and judge the result.</p>
          </div>
          <ol className="cx-process">{STEPS.map((s) => <li key={s.t}><span className="t-mono">{s.tag}</span><h3>{s.t}</h3><p>{s.d}</p></li>)}</ol>
        </div>
      </section>

      <section className="t-section t-light" id="start" aria-labelledby="biz-start-title">
        <div className="wrap biz-start">
          <div className="t-stack">
            <span className="t-tag">Start here</span>
            <h2 id="biz-start-title">Tell me what you need.</h2>
            <p className="t-lede">Two minutes. I&apos;ll reply within one working day with a fixed price and a date for a first visit.</p>
            <ul className="ticks">
              <li>{SITE.insurance.publicLiability} public liability insurance, certificate on request</li>
              <li>CAA registered operator, ICO registered for data protection</li>
              <li>Risk assessment and method statement for site work</li>
              <li>Agreement signed online, with a copy emailed to you</li>
              <li>Repeat visits and jobs of {money(PAYMENT.largeFrom)} or more go on invoice terms: no deposit, {PAYMENT.termsDays} days to pay. Put your purchase order number in the notes and it goes into the Job Details.</li>
            </ul>
            <p className="biz-travel">{TRAVEL_TEXT}</p>
          </div>
          <BusinessForm />
        </div>
      </section>
    </div>
  );
}
