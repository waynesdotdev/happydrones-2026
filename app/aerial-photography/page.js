/* AERIAL PHOTOGRAPHY — in-depth page for agents, sellers, land agents and housebuilders.
   happydrones.co.uk/aerial-photography · Words: lib/aerial.js · Prices: lib/site.js */
import Link from "next/link";
import CtaBand from "@/components/CtaBand";
import TFaq from "@/components/TFaq";
import JsonLd from "@/components/JsonLd";
import KitIcon from "@/components/KitIcon";
import { Arrow } from "@/components/TIcons";
import { HeroOrbit, HeightSlider, AnnotateAerial, StreetVsAir, ShotRail } from "@/components/aerial/AerialBits";
import { SITE, PACKAGES, PACKAGE_ROWS, PRICING, PAYMENT, money, priceFrom, kitById, whatsappLink } from "@/lib/site";
import { AE_CLIPS, AE_RULES, AE_FAQ } from "@/lib/aerial";

export const metadata = {
  title: "Aerial property photography",
  description: "Drone photos and video of the house, the plot and the street, with the boundary outlined. Across the North East, aerial only from " + priceFrom("aerial") + ", or included in every property package.",
  alternates: { canonical: "/aerial-photography/" },
};

const WHY = [
  { t: "Buyers buy the location", d: "The garden, the plot, the street and what's nearby. Things a ground-level photo can't show." },
  { t: "Gardens make sense", d: "From above, buyers see the size and shape of the garden and where the boundary runs." },
  { t: "The listing stands out", d: "On a page of front-of-house photos, an aerial is the one people stop on." },
];

export default function AerialPage() {
  const aerial = PRICING.services.find((s) => s.id === "aerial");
  const aerialRow = PACKAGE_ROWS.find((r) => r[0] === "Aerial photos")?.slice(1) || [];
  const extras = PRICING.extras.filter((x) => x.for.includes("aerial"));
  const mini = kitById("mini4");
  const wa = whatsappLink("Hi Happy Drones, I'd like aerial photos of a property. The address is: ");
  const schema = [
    { "@context": "https://schema.org", "@type": "Service", name: "Aerial property photography", areaServed: SITE.areaServed, provider: { "@type": "LocalBusiness", name: SITE.name, url: SITE.url, telephone: SITE.phone }, offers: { "@type": "Offer", price: aerial?.base, priceCurrency: "GBP" } },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: AE_FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ];

  return (
    <div className="sub-page cx aep">
      <JsonLd data={schema} />

      {/* HERO */}
      <section className="cx-hero t-dark" aria-labelledby="ae-title">
        <div className="wrap cx-hero-in">
          <div className="cx-hero-copy">
            <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true"> / </span><Link href="/property/">Property</Link><span aria-hidden="true"> / </span><span aria-current="page">Aerial</span></nav>
            <span className="t-live">Aerial photography · {SITE.areaServed}</span>
            <h1 id="ae-title">Show the plot, the street and the view.</h1>
            <p className="t-lede">Drone photos and video of the house, the garden and everything around it, with the plot outlined so buyers understand it at a glance. On its own, or in every property package.</p>
            <div className="t-hero-ctas">
              <Link className="t-btn t-btn-primary" href="/?service=aerial#quote">Price aerials <Arrow /></Link>
              {wa && <a className="t-btn t-btn-ghost" href={wa} target="_blank" rel="noopener">WhatsApp {SITE.phoneDisplay}</a>}
            </div>
          </div>
          <figure className="cx-hero-art t-frame"><HeroOrbit /></figure>
        </div>
        <div className="wrap">
          <dl className="cx-stats">
            <div><dt>Aerial only from</dt><dd>{priceFrom("aerial")}<small>photos and a short clip</small></dd></div>
            <div><dt>On site</dt><dd>~30 min<small>no one needs to be in</small></dd></div>
            <div><dt>Height</dt><dd>5–120 m<small>120 m is the legal limit</small></dd></div>
            <div><dt>Delivered in</dt><dd>48–72 h<small>by download link</small></dd></div>
          </dl>
        </div>
      </section>

      {/* WHY */}
      <section className="t-section t-dark" aria-labelledby="ae-why-title" style={{ paddingTop: "clamp(40px, 6vw, 72px)" }}>
        <div className="wrap">
          <div className="t-head"><span className="t-tag">Why aerials</span><h2 id="ae-why-title">The photos that answer buyers&apos; first questions.</h2></div>
          <div className="t-why cx-why">{WHY.map((w) => <div key={w.t}><h3>{w.t}</h3><p>{w.d}</p></div>)}</div>
        </div>
      </section>

      {/* HEIGHT */}
      <section className="t-section t-dark" aria-labelledby="ae-h-title" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="t-head t-split">
            <div className="t-stack"><span className="t-tag">Drag the height</span><h2 id="ae-h-title">Every height tells buyers something different.</h2></div>
            <p className="t-lede">From just above the hedge to the 120-metre limit. Drag the slider, or tap a height, to see what each one shows.</p>
          </div>
          <HeightSlider />
        </div>
      </section>

      {/* STREET VS AIR */}
      <section className="t-section t-light" aria-labelledby="ae-sva-title">
        <div className="wrap">
          <div className="t-head t-split">
            <div className="t-stack"><span className="t-tag">Drag to compare</span><h2 id="ae-sva-title">What the front photo can&apos;t tell a buyer.</h2></div>
            <p className="t-lede">From the pavement you see a front door. From 30 metres you see the garden, the parking, the neighbours and the park over the road.</p>
          </div>
          <div className="rf-gv"><StreetVsAir /></div>
        </div>
      </section>

      {/* ANNOTATE */}
      <section className="ea-sec" aria-labelledby="ae-ann-title">
        <div className="wrap">
          <p className="ea-eyebrow">The hero aerial</p>
          <h2 id="ae-ann-title" className="section-title">One photo, labelled with what matters.</h2>
          <p className="section-sub">Every package includes a hero aerial with the plot outlined. Switch the labels on and off to see what else can be marked.</p>
          <AnnotateAerial />
        </div>
      </section>

      {/* SHOT LIST */}
      <section className="t-section t-dark" aria-labelledby="ae-shots-title">
        <div className="wrap">
          <div className="t-head t-split">
            <div className="t-stack"><span className="t-tag">The shot list</span><h2 id="ae-shots-title">Eight angles, every time.</h2></div>
            <p className="t-lede">The same tried-and-tested list on every shoot, adjusted for the house. Drag or swipe through them.</p>
          </div>
          <ShotRail />
          <div className="ae-clips">
            <p className="t-mono">AND ON VIDEO</p>
            <ul>{AE_CLIPS.map((c) => <li key={c.t}><b>{c.t}</b><span>{c.d}</span></li>)}</ul>
          </div>
        </div>
      </section>

      {/* PRICES */}
      <section className="t-section t-light" id="pricing" aria-labelledby="ae-price-title">
        <div className="wrap">
          <div className="t-head t-split">
            <div className="t-stack"><span className="t-tag">Prices</span><h2 id="ae-price-title">On its own, or in every package.</h2></div>
            <p className="t-lede">Aerial only is for agents and sellers who already have interior photos. Every property package includes aerials too. One-off shoots take a {PAYMENT.depositPct}% deposit.</p>
          </div>
          <div className="ae-prices">
            <div className="pp-pkg on">
              <p className="t-mono">AERIAL ONLY</p>
              <h3>Drone photos and a short clip</h3>
              <ul className="wt-adds-list ae-sizes">{aerial?.sizes.map((z) => <li key={z.name}><span>{z.name}</span><b>{money(aerial.base + z.add)}</b></li>)}</ul>
              <Link className="t-btn t-btn-primary" href="/?service=aerial#quote">Price aerial only <Arrow /></Link>
            </div>
            <div className="pp-pkg">
              <p className="t-mono">INCLUDED IN EVERY PACKAGE</p>
              <h3>Aerial photos in each package</h3>
              <ul className="wt-adds-list">{PACKAGES.map((p, i) => <li key={p.id}><span>{p.title}<small>from {priceFrom(p.id)}</small></span><b>{aerialRow[i]} aerials</b></li>)}</ul>
              <Link className="t-btn t-btn-ghost" href="/property/#compare">Compare packages <Arrow /></Link>
            </div>
            <div className="pp-pkg">
              <p className="t-mono">ADD TO AERIALS</p>
              <h3>Extras</h3>
              <ul className="wt-adds-list">{extras.map((x) => <li key={x.id}><span>{x.name}<small>{x.desc}</small></span><b>+{money(x.price)}</b></li>)}</ul>
            </div>
          </div>
        </div>
      </section>

      {/* RULES + KIT */}
      <section className="t-section t-dark" aria-labelledby="ae-rules-title">
        <div className="wrap cx-two">
          <div className="t-stack-lg" style={{ minWidth: 0 }}>
            <div className="t-head" style={{ marginBottom: 0 }}><span className="t-tag">Flying by the rules</span><h2 id="ae-rules-title">Legal, insured and considerate.</h2></div>
            <ul className="cx-comp">{AE_RULES.map((r) => <li key={r.t}><b>{r.t}</b><span>{r.d}</span></li>)}</ul>
            <p><Link className="text-link" href="/safety/">How every flight is planned</Link></p>
          </div>
          <div className="t-stack-lg" style={{ minWidth: 0 }}>
            <div className="t-head" style={{ marginBottom: 0 }}><span className="t-tag">Flown with</span><h2>The drone over your roof.</h2></div>
            {mini && <ul className="cx-kit"><li><span className="cx-kit-icon"><KitIcon id="mini4" /></span><div><b>{mini.name}</b><small className="t-mono">{mini.spec?.toUpperCase()}</small><p>{mini.text}</p></div></li></ul>}
            <div className="rf-next">
              <p className="t-mono">COMING NEXT</p>
              <ul><li><b>Mavic 4 Pro</b><span>A triple-camera flagship for premium homes and films.</span></li></ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="t-section t-dark" aria-labelledby="ae-faq-title" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="t-head"><span className="t-tag">Questions</span><h2 id="ae-faq-title">Before you book.</h2></div>
          <TFaq items={AE_FAQ} />
        </div>
      </section>

      <CtaBand title="Show buyers the whole picture." text="Aerial only, or as part of a package. Fixed prices, delivered in 48–72 hours." />
    </div>
  );
}
