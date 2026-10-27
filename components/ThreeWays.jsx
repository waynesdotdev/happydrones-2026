/* "Three things I do": the homepage's main services.
   Property, roof inspections and local business content.
   Prices come from PRICING in lib/site.js (via priceFrom). */
import Link from "next/link";
import ServiceArt from "./ServiceArt";
import { priceFrom } from "@/lib/site";

const WAYS = [
  {
    id: "property",
    cls: "tw-property",
    art: "walkthrough",
    tag: `Homes · from ${priceFrom("essentials")}`,
    title: "Selling or letting a home",
    ticks: [
      "Listing photos, aerials and walkthrough video in one visit",
      "One-take FPV tours for premium homes",
      "Agent rates from 4 listings a month",
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
    id: "business",
    cls: "tw-business",
    art: "business",
    tag: `Local business · from ${priceFrom("business")}`,
    title: "Getting a local business noticed",
    ticks: [
      "Photos and short clips of your shop, gym, café or venue",
      "Sized for Google, Facebook, Instagram and TikTok",
      "Monthly content plans if you post regularly",
    ],
    main: { label: "Local business content", href: "/local-business/", cls: "btn-navy" },
  },
];

export default function ThreeWays() {
  return (
    <section className="threeways" id="services" aria-labelledby="tw-title">
      <div className="wrap">
        <h2 id="tw-title" className="section-title">Three things I do well.</h2>
        <p className="section-sub">Pick the one you need. Every job is one visit, one pilot and fast delivery.</p>
        <div className="tw-grid">
          {WAYS.map((w) => (
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
      </div>
    </section>
  );
}

/* Small strip near the end: the other pages, still live but not headline services. */
const ALSO = [
  { label: "Aerial photography", href: "/aerial-photography/" },
  { label: "Walkthrough video", href: "/walkthrough-video/" },
  { label: "FPV fly-through", href: "/fpv-fly-through/" },
  { label: "Commercial property", href: "/commercial-property/" },
  { label: "Construction progress", href: "/construction/" },
];

export function AlsoAvailable() {
  return (
    <section className="also" aria-labelledby="also-title">
      <div className="wrap also-row">
        <h2 id="also-title" className="also-title">Also available</h2>
        <ul className="also-list">
          {ALSO.map((a) => <li key={a.href}><Link href={a.href}>{a.label}</Link></li>)}
        </ul>
      </div>
    </section>
  );
}
