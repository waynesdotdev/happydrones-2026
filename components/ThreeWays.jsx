/* "What I do": the homepage's main services.
   Big cards: property (with estate agents), roof inspections, construction progress.
   Smaller cards: aerial photography and walkthrough video on their own.
   Prices come from PRICING and the agent settings in lib/site.js. */
import Link from "next/link";
import ServiceArt from "./ServiceArt";
import { priceFrom, AGENT_OFFER } from "@/lib/site";

const MAIN = [
  {
    id: "property",
    cls: "tw-property",
    art: "walkthrough",
    tag: `Homes · from ${priceFrom("essentials")}`,
    title: "Selling or letting a home",
    ticks: [
      "Listing photos, aerials and walkthrough video in one visit",
      "Signature adds a one-take glide tour, front door to garden",
      `Estate agents: ${AGENT_OFFER.discount} off at ${AGENT_OFFER.minPerMonth}+ listings a month, plus white label`,
    ],
    main: { label: "See property packages", href: "/#packages", cls: "btn-orange" },
    more: { label: "For estate agents", href: "/estate-agents/" },
  },
  {
    id: "roofs",
    cls: "tw-roofs",
    art: "roof",
    tag: `Roofs · from ${priceFrom("roof")}`,
    title: "Checking a roof without ladders",
    ticks: [
      "Close-up photos of tiles, chimneys, flashing and gutters",
      "No scaffolding, nobody on the roof",
      "A marked-up photo pack you can send to a roofer",
    ],
    main: { label: "Roof inspections", href: "/roof-inspections/", cls: "btn-orange" },
  },
  {
    id: "construction",
    cls: "tw-build",
    art: "construction",
    tag: `Construction · from ${priceFrom("construction")} a visit`,
    title: "Recording a build, month by month",
    ticks: [
      "The same positions every visit, so progress lines up",
      "Dated photos and film for developers, contractors and funders",
      "Empty buildings checked monthly too, before work starts",
    ],
    main: { label: "Construction progress", href: "/construction/", cls: "btn-navy" },
    more: { label: "Vacant buildings", href: "/vacant-property-monitoring/" },
  },
];

const SMALL = [
  {
    id: "aerial",
    art: "home",
    tag: `On its own · from ${priceFrom("aerial")}`,
    title: "Aerial photography",
    text: "Drone photos and a short clip of the property, the plot and the street. For agents who already have a photographer.",
    href: "/aerial-photography/",
  },
  {
    id: "walkthrough",
    art: "camera",
    tag: `In Showcase · from ${priceFrom("showcase")}`,
    title: "Walkthrough video",
    text: "A smooth room-by-room tour at walking height, with captions, cut for Rightmove, YouTube and social media.",
    href: "/walkthrough-video/",
  },
];

export default function ThreeWays() {
  return (
    <section className="threeways" id="services" aria-labelledby="tw-title">
      <div className="wrap">
        <h2 id="tw-title" className="section-title">What I do.</h2>
        <p className="section-sub">Pick the one you need. Every job is one visit, one pilot and fast delivery.</p>
        <div className="tw-grid">
          {MAIN.map((w) => (
            <article key={w.id} className={`tw ${w.cls}`}>
              <div className="tw-art" aria-hidden="true"><ServiceArt name={w.art} /></div>
              <div className="tw-body">
                <p className="tw-tag">{w.tag}</p>
                <h3>{w.title}</h3>
                <ul className="ticks">{w.ticks.map((t) => <li key={t}>{t}</li>)}</ul>
                <div className="tw-ctas">
                  <Link className={`btn ${w.main.cls}`} href={w.main.href}>{w.main.label}</Link>
                  {w.more && <Link className="text-link" href={w.more.href}>{w.more.label}</Link>}
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="tw-small">
          {SMALL.map((w) => (
            <Link key={w.id} className="tw-mini" href={w.href}>
              <div className="tw-mini-art" aria-hidden="true"><ServiceArt name={w.art} /></div>
              <div className="tw-mini-body">
                <p className="tw-tag">{w.tag}</p>
                <h3>{w.title}</h3>
                <p>{w.text}</p>
                <span className="text-link">Find out more</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
