/* FPV FLY-THROUGH — in-depth page for premium homes, showhomes and venues.
   happydrones.co.uk/fpv-fly-through · Words: lib/fpv.js · Prices: lib/site.js */
import Link from "next/link";
import CtaBand from "@/components/CtaBand";
import TFaq from "@/components/TFaq";
import JsonLd from "@/components/JsonLd";
import KitIcon from "@/components/KitIcon";
import { Arrow } from "@/components/TIcons";
import { HeroDive, RouteScroll, HazardSpotter } from "@/components/fpv/FpvBits";
import { SITE, PRICING, PAYMENT, money, priceFrom, kitById, whatsappLink } from "@/lib/site";
import { FPV_PROCESS, FPV_WHICH, FPV_WHERE, FPV_FAQ } from "@/lib/fpv";

export const metadata = {
  title: "FPV fly-through videos",
  description: "One unbroken drone flight in the front door, through every room and out over the garden. For homes, showhomes and venues across the North East, from " + priceFrom("fpv") + ".",
  alternates: { canonical: "/fpv-fly-through/" },
};

const WHY = [
  { t: "Watched to the end", d: "One continuous flight feels like walking through it yourself, so people keep watching to see where it goes." },
  { t: "Shows the flow", d: "How the hall leads to the kitchen and the kitchen opens to the garden. Something photos can't do." },
  { t: "Stops the scroll", d: "Very few listings and venues have one. On social media, it's the clip people share." },
];

export default function FpvPage() {
  const fpv = PRICING.services.find((s) => s.id === "fpv");
  const add = PRICING.extras.find((x) => x.id === "fpvadd");
  const avata = kitById("avata2");
  const wa = whatsappLink("Hi Happy Drones, I'd like an FPV fly-through. The property is: ");
  const schema = [
    { "@context": "https://schema.org", "@type": "Service", name: "FPV fly-through video", areaServed: SITE.areaServed, provider: { "@type": "LocalBusiness", name: SITE.name, url: SITE.url, telephone: SITE.phone }, offers: { "@type": "Offer", price: fpv?.base, priceCurrency: "GBP" } },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FPV_FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ];

  return (
    <div className="sub-page cx fpvp">
      <JsonLd data={schema} />

      {/* HERO */}
      <section className="cx-hero t-dark" aria-labelledby="fpv-title">
        <div className="wrap cx-hero-in">
          <div className="cx-hero-copy">
            <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true"> / </span><Link href="/property/">Property</Link><span aria-hidden="true"> / </span><span aria-current="page">FPV fly-through</span></nav>
            <span className="t-live">FPV fly-throughs · {SITE.areaServed}</span>
            <h1 id="fpv-title">One take. No cuts. Every room.</h1>
            <p className="t-lede">One unbroken flight in the front door, through the rooms that matter and out over the garden. Planned, rehearsed and flown on a drone built for indoors.</p>
            <div className="t-hero-ctas">
              <Link className="t-btn t-btn-primary" href="/?service=fpv#quote">Price a fly-through <Arrow /></Link>
              {wa && <a className="t-btn t-btn-ghost" href={wa} target="_blank" rel="noopener">WhatsApp {SITE.phoneDisplay}</a>}
            </div>
          </div>
          <figure className="cx-hero-art t-frame"><HeroDive /></figure>
        </div>
        <div className="wrap">
          <dl className="cx-stats">
            <div><dt>On its own from</dt><dd>{priceFrom("fpv")}<small>or in Signature</small></dd></div>
            <div><dt>Finished length</dt><dd>45–90 s<small>one single take</small></dd></div>
            <div><dt>On site</dt><dd>~90 min<small>walk, rehearse, fly</small></dd></div>
            <div><dt>Delivered in</dt><dd>3–5 days<small>plus a vertical cut</small></dd></div>
          </dl>
        </div>
      </section>

      {/* WHY */}
      <section className="t-section t-dark" aria-labelledby="fpv-why-title" style={{ paddingTop: "clamp(40px, 6vw, 72px)" }}>
        <div className="wrap">
          <div className="t-head"><span className="t-tag">Why FPV</span><h2 id="fpv-why-title">The video people watch twice.</h2></div>
          <div className="t-why cx-why">{WHY.map((w) => <div key={w.t}><h3>{w.t}</h3><p>{w.d}</p></div>)}</div>
        </div>
      </section>

      {/* ROUTE */}
      <RouteScroll />

      {/* HAZARDS */}
      <section className="ea-sec" aria-labelledby="fpv-haz-title">
        <div className="wrap">
          <p className="ea-eyebrow">Before the drone takes off</p>
          <h2 id="fpv-haz-title" className="section-title">Spot what gets sorted first.</h2>
          <p className="section-sub">Every fly-through starts with a walk round the route. Tap the plan to find the seven things that get cleared, closed, opened or moved before the first rehearsal.</p>
          <HazardSpotter />
        </div>
      </section>

      {/* WHICH TOUR */}
      <section className="t-section t-light" aria-labelledby="fpv-which-title">
        <div className="wrap">
          <div className="t-head t-split">
            <div className="t-stack"><span className="t-tag">Which tour?</span><h2 id="fpv-which-title">The right tour for the space.</h2></div>
            <p className="t-lede">A fly-through needs room to fly. In smaller homes, a handheld glide gives a similar feel more safely. Here&apos;s how the three compare.</p>
          </div>
          <div className="fpv-which">
            {FPV_WHICH.map((w) => (
              <div key={w.t} className={w.here ? "rf-method best" : "rf-method"}>
                <p className="t-mono">{w.kit.toUpperCase()}</p>
                <h3>{w.t}</h3>
                <p>{w.d}</p>
                <dl><div><dt>Best for</dt><dd>{w.best}</dd></div></dl>
                {w.href && <Link className="text-link" href={w.href}>Find out more</Link>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHERE */}
      <section className="t-section t-dark" aria-labelledby="fpv-where-title">
        <div className="wrap">
          <div className="t-head t-split">
            <div className="t-stack"><span className="t-tag">Not just houses</span><h2 id="fpv-where-title">Anywhere the journey sells it.</h2></div>
            <p className="t-lede">If walking in is part of the experience, a fly-through shows it. <Link className="text-link" href="/local-business/">See content for local businesses</Link></p>
          </div>
          <div className="cx-uses fpv-where">{FPV_WHERE.map((w) => <div key={w.t}><h3>{w.t}</h3><p>{w.d}</p></div>)}</div>
        </div>
      </section>

      {/* PRICES */}
      <section className="t-section t-light" id="pricing" aria-labelledby="fpv-price-title">
        <div className="wrap">
          <div className="t-head t-split">
            <div className="t-stack"><span className="t-tag">Prices</span><h2 id="fpv-price-title">Three ways to get one.</h2></div>
            <p className="t-lede">On its own, added to a package, or included in Signature. One-off shoots take a {PAYMENT.depositPct}% deposit.</p>
          </div>
          <div className="ae-prices">
            <div className="pp-pkg on">
              <p className="t-mono">ON ITS OWN</p>
              <h3>FPV fly-through</h3>
              <ul className="wt-adds-list">{fpv?.sizes.map((z) => <li key={z.name}><span>{z.name}</span><b>{money(fpv.base + z.add)}</b></li>)}</ul>
              <Link className="t-btn t-btn-primary" href="/?service=fpv#quote">Price it <Arrow /></Link>
            </div>
            <div className="pp-pkg">
              <p className="t-mono">ADDED TO A PACKAGE</p>
              <h3>Add to Essentials or Showcase</h3>
              <p className="pp-pkg-price">{add ? `+${money(add.price)}` : "—"}<small>on top of the package</small></p>
              <p className="fpv-note">Shot in the same visit as the photos, so the vendor only has one appointment.</p>
              <Link className="t-btn t-btn-ghost" href="/?service=showcase#quote">Price Showcase + FPV <Arrow /></Link>
            </div>
            <div className="pp-pkg">
              <p className="t-mono">INCLUDED</p>
              <h3>Signature</h3>
              <p className="pp-pkg-price">{priceFrom("signature")}<small>from</small></p>
              <p className="fpv-note">Photos, aerials, a walkthrough video, dusk exteriors and the fly-through, all in one.</p>
              <Link className="t-btn t-btn-ghost" href="/?service=signature#quote">Price Signature <Arrow /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS + KIT */}
      <section className="t-section t-dark" aria-labelledby="fpv-proc-title">
        <div className="wrap">
          <div className="t-head t-split">
            <div className="t-stack"><span className="t-tag">How it&apos;s made</span><h2 id="fpv-proc-title">Walked, rehearsed, then flown.</h2></div>
            <p className="t-lede">Nothing is left to chance. <Link className="text-link" href="/journal/planning-a-one-take-fpv-house-tour/">Read how I plan a tour</Link></p>
          </div>
          <ol className="cx-process">{FPV_PROCESS.map((s) => <li key={s.t}><span className="t-mono">{s.tag}</span><h3>{s.t}</h3><p>{s.d}</p></li>)}</ol>
          {avata && (
            <ul className="cx-kit fpv-kit">
              <li><span className="cx-kit-icon"><KitIcon id="avata2" /></span><div><b>{avata.name}</b><small className="t-mono">{avata.spec?.toUpperCase()}</small><p>{avata.text}</p></div></li>
            </ul>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="t-section t-dark" aria-labelledby="fpv-faq-title" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="t-head"><span className="t-tag">Questions</span><h2 id="fpv-faq-title">Before you book.</h2></div>
          <TFaq items={FPV_FAQ} />
        </div>
      </section>

      <CtaBand title="Let them fly through it." text="On its own, added to a package, or in Signature. Fixed prices, planned around your space." />
    </div>
  );
}
