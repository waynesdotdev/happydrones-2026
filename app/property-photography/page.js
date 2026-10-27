/* PROPERTY PHOTOGRAPHY — in-depth page for sellers, agents, landlords and holiday lets.
   happydrones.co.uk/property-photography · Words: lib/propertyPhoto.js · Prices: lib/site.js */
import Link from "next/link";
import CtaBand from "@/components/CtaBand";
import TFaq from "@/components/TFaq";
import JsonLd from "@/components/JsonLd";
import { Arrow } from "@/components/TIcons";
import HeroPhoto from "@/components/photo/HeroPhoto";
import ShotScroll from "@/components/photo/ShotScroll";
import BlendSlider from "@/components/photo/BlendSlider";
import PrepRoom from "@/components/photo/PrepRoom";
import DuskSlider from "@/components/photo/DuskSlider";
import PhotoPlanner from "@/components/photo/PhotoPlanner";
import { SITE, PACKAGES, PRICING, PAYMENT, money, priceFrom, whatsappLink } from "@/lib/site";
import { PP_WHO, PP_PREP_MORE, PP_EDIT, PP_PROCESS, PP_FAQ } from "@/lib/propertyPhoto";

export const metadata = {
  title: "Property photography",
  description: "Bright, straight, blended property photos with aerials included, across the North East. Fixed-price packages from " + priceFrom("essentials") + ", delivered in 48–72 hours.",
  alternates: { canonical: "/property-photography/" },
};

export default function PropertyPhotographyPage() {
  const from = PRICING.services.find((s) => s.id === "essentials")?.base;
  const wa = whatsappLink("Hi Happy Drones, I'd like property photos. The address is: ");
  const schema = [
    { "@context": "https://schema.org", "@type": "Service", name: "Property photography", areaServed: SITE.areaServed, provider: { "@type": "LocalBusiness", name: SITE.name, url: SITE.url, telephone: SITE.phone }, offers: { "@type": "Offer", price: from, priceCurrency: "GBP" } },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: PP_FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ];

  return (
    <div className="sub-page cx pp">
      <JsonLd data={schema} />

      {/* HERO */}
      <section className="cx-hero t-dark" aria-labelledby="pp-title">
        <div className="wrap cx-hero-in">
          <div className="cx-hero-copy">
            <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true"> / </span><Link href="/property/">Property</Link><span aria-hidden="true"> / </span><span aria-current="page">Photography</span></nav>
            <span className="t-live">Property photography · {SITE.areaServed}</span>
            <h1 id="pp-title">The photos buyers click first.</h1>
            <p className="t-lede">Bright rooms, straight walls and windows you can see out of, with aerials of the plot included in every package. Shot in about an hour, delivered in two or three days.</p>
            <div className="t-hero-ctas">
              <Link className="t-btn t-btn-primary" href="/?service=essentials#quote">Get my price <Arrow /></Link>
              {wa && <a className="t-btn t-btn-ghost" href={wa} target="_blank" rel="noopener">WhatsApp {SITE.phoneDisplay}</a>}
            </div>
          </div>
          <figure className="cx-hero-art t-frame"><HeroPhoto /></figure>
        </div>
        <div className="wrap">
          <dl className="cx-stats">
            <div><dt>Packages from</dt><dd>{money(from)}<small>photos and aerials</small></dd></div>
            <div><dt>Edited photos</dt><dd>20–40<small>depending on package</small></dd></div>
            <div><dt>Delivered in</dt><dd>48–72 h<small>sized for every portal</small></dd></div>
            <div><dt>On site</dt><dd>~1 h<small>for a typical house</small></dd></div>
          </dl>
        </div>
      </section>

      {/* WHO */}
      <section className="t-section t-dark" aria-labelledby="pp-who-title" style={{ paddingTop: "clamp(40px, 6vw, 72px)" }}>
        <div className="wrap">
          <div className="t-head"><span className="t-tag">Who it&apos;s for</span><h2 id="pp-who-title">Buyers scroll. Good photos make them stop.</h2></div>
          <div className="t-why pp-who">{PP_WHO.map((w) => <div key={w.t}><h3>{w.t}</h3><p>{w.d}</p>{w.link && <Link className="text-link" href={w.link.href}>{w.link.text}</Link>}</div>)}</div>
        </div>
      </section>

      {/* SCROLL SHOOT */}
      <ShotScroll />

      {/* BLEND */}
      <section className="t-section t-light" aria-labelledby="pp-blend-title">
        <div className="wrap">
          <div className="t-head t-split">
            <div className="t-stack"><span className="t-tag">Drag to compare</span><h2 id="pp-blend-title">Windows you can actually see out of.</h2></div>
            <p className="t-lede">A camera can&apos;t get a bright room and a sunny window right in one shot. So each angle is shot three times, dark, middle and bright, and blended into one photo that looks the way your eyes see it.</p>
          </div>
          <BlendSlider />
        </div>
      </section>

      {/* PREP */}
      <section className="ea-sec" aria-labelledby="pp-prep-title">
        <div className="wrap">
          <p className="ea-eyebrow">Before I arrive</p>
          <h2 id="pp-prep-title" className="section-title">Ten minutes of prep, a much better photo.</h2>
          <p className="section-sub">Tick the jobs off and watch the room change. Everything here is free and takes minutes, and it makes more difference than any camera.</p>
          <PrepRoom />
          <div className="pp-prep-more">
            {PP_PREP_MORE.map((g) => <div key={g.where}><h3>{g.where}</h3><ul>{g.items.map((i) => <li key={i}>{i}</li>)}</ul></div>)}
          </div>
        </div>
      </section>

      {/* DUSK */}
      <section className="t-section t-dark" aria-labelledby="pp-dusk-title">
        <div className="wrap">
          <div className="t-head t-split">
            <div className="t-stack"><span className="t-tag">Dusk exteriors</span><h2 id="pp-dusk-title">The 20 minutes that make a house glow.</h2></div>
            <p className="t-lede">Just after sunset, the sky turns deep blue and the lights inside balance it perfectly. Drag through the evening, or press play. Included in Signature, or {money(PRICING.extras.find((x) => x.id === "dusk")?.price || 59)} on Essentials and Showcase.</p>
          </div>
          <DuskSlider />
        </div>
      </section>

      {/* PLANNER */}
      <section className="t-section t-light" id="photos" aria-labelledby="pp-plan-title">
        <div className="wrap">
          <div className="t-head t-split">
            <div className="t-stack"><span className="t-tag">How many photos?</span><h2 id="pp-plan-title">Pick your home and a package.</h2></div>
            <p className="t-lede">See roughly how the photos are shared between the rooms, the outside and the air, and what it costs. Fixed prices, no surprises.</p>
          </div>
          <PhotoPlanner />
        </div>
      </section>

      {/* EDITING */}
      <section className="t-section t-dark" aria-labelledby="pp-edit-title">
        <div className="wrap">
          <div className="t-head t-split">
            <div className="t-stack"><span className="t-tag">Editing</span><h2 id="pp-edit-title">I fix the light and the lines. Never the house.</h2></div>
            <p className="t-lede">Every photo is edited by hand. Buyers should walk in and recognise the rooms, and agents can&apos;t publish photos that mislead, so nothing that&apos;s part of the house gets hidden.</p>
          </div>
          <div className="pp-edit">
            <div><p className="t-mono">ALWAYS</p><ul>{PP_EDIT.fix.map((x) => <li key={x}>{x}</li>)}</ul></div>
            <div className="pp-edit-no"><p className="t-mono">NEVER</p><ul>{PP_EDIT.never.map((x) => <li key={x}>{x}</li>)}</ul></div>
          </div>
        </div>
      </section>

      {/* PACKAGES */}
      <section className="t-section t-light" aria-labelledby="pp-pkg-title">
        <div className="wrap">
          <div className="t-head t-split">
            <div className="t-stack"><span className="t-tag">Packages</span><h2 id="pp-pkg-title">Every package includes the photos and the drone.</h2></div>
            <p className="t-lede">Prices are for a flat or 1–2 bed home. One-off shoots take a {PAYMENT.depositPct}% deposit. Selling more than a few a month? <Link href="/estate-agents/">See the agent offer</Link>.</p>
          </div>
          <div className="pp-pkgs">
            {PACKAGES.map((p) => (
              <div key={p.id} className={p.featured ? "pp-pkg on" : "pp-pkg"}>
                <p className="t-mono">{p.tagline.toUpperCase()}</p>
                <h3>{p.title}</h3>
                <p className="pp-pkg-price">{priceFrom(p.id)}<small>from</small></p>
                <ul>{p.gets.map((g) => <li key={g}>{g}</li>)}</ul>
                <Link className={p.featured ? "t-btn t-btn-primary" : "t-btn t-btn-ghost"} href={`/?service=${p.id}#quote`}>Price {p.title} <Arrow /></Link>
              </div>
            ))}
          </div>
          <p className="rf-note"><Link href="/property/#compare">Compare all three packages side by side</Link></p>
        </div>
      </section>

      {/* PROCESS */}
      <section className="t-section t-dark" aria-labelledby="pp-proc-title">
        <div className="wrap">
          <div className="t-head t-split">
            <div className="t-stack"><span className="t-tag">How it works</span><h2 id="pp-proc-title">Booked today, on the portals this week.</h2></div>
            <p className="t-lede">One person from start to finish: I book it, shoot it, edit it and send it.</p>
          </div>
          <ol className="cx-process">{PP_PROCESS.map((s) => <li key={s.t}><span className="t-mono">{s.tag}</span><h3>{s.t}</h3><p>{s.d}</p></li>)}</ol>
          <p style={{ marginTop: 24 }}><Link className="text-link" href="/journal/get-your-home-ready-for-drone-photos/">Read the full prep guide</Link></p>
        </div>
      </section>

      {/* FAQ */}
      <section className="t-section t-dark" aria-labelledby="pp-faq-title" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="t-head"><span className="t-tag">Questions</span><h2 id="pp-faq-title">Before you book.</h2></div>
          <TFaq items={PP_FAQ} />
        </div>
      </section>

      <CtaBand title="Ready to list it?" text="Build your fixed price in under a minute, or send the address on WhatsApp." />
    </div>
  );
}
