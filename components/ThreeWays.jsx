/* "What I do": the homepage's main services.
   Big cards: property (with estate agents), roof inspections, construction progress.
   Smaller cards: aerial photography and walkthrough video on their own.
   Prices come from PRICING and the agent settings in lib/site.js. */
import Link from "next/link";
import ServiceArt from "./ServiceArt";
import { priceFrom, money, AGENT_OFFER, VACANT } from "@/lib/site";

const MAIN = [
  {
    id: "agents",
    cls: "tw-property",
    art: "walkthrough",
    tag: `Estate and letting agents · ${AGENT_OFFER.discount} off at ${AGENT_OFFER.minPerMonth}+ a month`,
    title: "Every listing shot in one visit",
    ticks: [
      "Photos, aerials and walkthrough video by one person",
      "Files in 48 to 72 hours, sized for every portal",
      "A set weekly slot and one monthly invoice",
    ],
    main: { label: "See the agent offer", href: "/estate-agents/", cls: "btn-orange" },
    more: { label: "Commercial property", href: "/commercial-property/" },
  },
  {
    id: "construction",
    cls: "tw-build",
    art: "construction",
    tag: `Builders and developers · from ${priceFrom("construction")} a visit`,
    title: "The build recorded month by month",
    ticks: [
      "The same positions every visit, so progress lines up",
      "Dated photos and film for clients, funders and marketing",
      "Money off when you book a run of visits",
    ],
    main: { label: "Construction progress", href: "/construction/", cls: "btn-navy" },
    more: { label: "Price a run of visits", href: "/plan/" },
  },
  {
    id: "buildings",
    cls: "tw-roofs",
    art: "roof",
    tag: `Landlords, managers and trades · from ${money(VACANT.perVisit)} a visit`,
    title: "Roofs and empty buildings checked from the air",
    ticks: [
      "Empty buildings checked every month, with a dated report",
      `Roof checks from ${priceFrom("roof")}: no scaffolding, nobody on the roof`,
      "A marked-up photo pack for your insurer or roofer",
    ],
    main: { label: "Empty building checks", href: "/vacant-property-monitoring/", cls: "btn-orange" },
    more: { label: "Roof inspections", href: "/roof-inspections/" },
  },
];

const SMALL = [
  {
    id: "home",
    art: "camera",
    tag: `Homes · from ${priceFrom("essentials")}`,
    title: "Selling or letting your own home",
    text: "Listing photos, aerials and a walkthrough video in one visit. Pick a package and see the price straight away.",
    href: "/property/",
  },
  {
    id: "roof",
    art: "home",
    tag: `Roofs · from ${priceFrom("roof")}`,
    title: "A roof you're worried about",
    text: "Close-up photos of the tiles, chimney and gutters without ladders, and a marked-up pack to show a roofer.",
    href: "/roof-inspections/",
  },
];

export default function ThreeWays() {
  return (
    <section className="threeways" id="services" aria-labelledby="tw-title">
      <div className="wrap">
        <h2 id="tw-title" className="section-title">Who I work for.</h2>
        <p className="section-sub">Businesses that need a pilot more than once. The same person, the same standard and one invoice. <Link className="text-link" href="/business/">How it works for business</Link></p>
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
        <p className="tw-home">Not a business? Homeowners are welcome too.</p>
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
