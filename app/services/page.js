/* SERVICES PAGE — words for each service live in SERVICE_PAGES in lib/site.js */
import Link from "next/link";
import ServicesCam from "@/components/ServicesCam";
import ServiceArt from "@/components/ServiceArt";
import JsonLd from "@/components/JsonLd";
import Kit from "@/components/Kit";
import { SERVICE_PAGES, SITE, priceFrom, whatsappLink, PRICING } from "@/lib/site";

export const metadata = {
  title: "Services",
  description: "Property photography, aerial, walkthrough video, construction progress, mapping, aerial film, inspections, events and business content across the North East.",
  alternates: { canonical: "/services/" },
};

// Each service as structured data for Google
const servicesSchema = {
  "@context": "https://schema.org",
  "@graph": SERVICE_PAGES.filter((s) => !s.soon).map((s) => {
    const p = PRICING.services.find((x) => x.id === s.quote);
    return {
      "@type": "Service",
      name: s.title,
      description: s.lede,
      provider: { "@type": "LocalBusiness", name: SITE.name, url: SITE.url },
      areaServed: SITE.areaServed,
      offers: p ? { "@type": "Offer", price: p.base, priceCurrency: "GBP" } : undefined,
    };
  }),
};

export default function ServicesPage() {
  const wa = whatsappLink();
  return (
    <div className="sub-page">
      <JsonLd data={servicesSchema} />

      <section className="page-hero" aria-labelledby="svc-title">
        <div className="page-hero-frame" aria-hidden="true">
          <span className="corner tl"></span><span className="corner tr"></span><span className="corner bl"></span><span className="corner br"></span>
        </div>
        <div className="wrap">
          <h1 id="svc-title">Every angle,<br />covered.</h1>
          <p>Ten services, from listing photos to mapping a construction site. Scroll through each one to see what&apos;s included, how long it takes, which aircraft flies it and what it costs.</p>
        </div>
      </section>

      <nav className="chapter-nav" aria-label="Services on this page">
        <div className="wrap chapter-nav-inner">
          {SERVICE_PAGES.map((s) => <a key={s.id} href={`#${s.id}`}>{s.nav}</a>)}
        </div>
      </nav>

      <section className="svc">
        <div className="wrap svc-grid">
          <ServicesCam items={SERVICE_PAGES} />

          <div className="chapters">
            {SERVICE_PAGES.map((s) => (
              <article className="chapter" id={s.id} key={s.id}>
                <div className="chapter-art" aria-hidden="true">
                  <ServiceArt name={s.art} />
                  <span className="art-alt"><small>ALT</small> <b>{s.alt}</b> <small>m</small></span>
                </div>
                <h2>{s.title}{s.soon && <span className="soon-tag">Coming soon</span>}</h2>
                <p className="lede">{s.lede}</p>
                <h3>What you get</h3>
                <ul className="ticks">{s.gets.map((g) => <li key={g}>{g}</li>)}</ul>
                <dl className="facts">
                  {s.soon
                    ? <div><dt>Status</dt><dd><b>Coming soon</b></dd></div>
                    : <div><dt>{s.fromLabel || "From"}</dt><dd><b>{priceFrom(s.quote)}</b></dd></div>}
                  {s.facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
                </dl>
                <p className="know">
                  <strong>Good to know.</strong> {s.know}{" "}
                  {s.knowLink && <Link href={s.knowLink.href}>{s.knowLink.text}</Link>}
                </p>
                <div className="chapter-actions">
                  {s.soon
                    ? (SITE.whatsapp && <a className="btn btn-orange" href={whatsappLink(`Hi Happy Drones, please let me know when ${s.title.toLowerCase()} launches.`)} target="_blank" rel="noopener">Tell me when it launches</a>)
                    : <Link className="btn btn-orange" href={s.group === "commercial" ? `/plan/?mission=${s.id}` : `/?service=${s.quote}#quote`}>Price this</Link>}
                  <Link className="btn btn-navy" href={`/services/${s.id}/`}>Full details</Link>
                  {s.cat && <Link className="text-link" href={`/journal/?cat=${encodeURIComponent(s.cat)}`}>See examples in the Viewing Room</Link>}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cover" aria-labelledby="cover-title">
        <div className="wrap cover-grid">
          <div>
            <h2 id="cover-title" className="section-title">Shot safely. Fully covered.</h2>
            <p className="section-sub">Every job is planned, checked and insured before the first photo is taken.</p>
          </div>
          <div className="cover-cards">
            <div className="cover-card"><b>{SITE.insurance.publicLiability}</b><span>Public liability insurance</span></div>
            <div className="cover-card"><b>{SITE.insurance.professionalIndemnity}</b><span>Professional indemnity insurance</span></div>
            {SITE.insurance.note && <p className="cover-adjust">{SITE.insurance.note}.</p>}
            <ul className="cover-list">{SITE.credentials.map((c) => <li key={c}>{c}</li>)}</ul>
          </div>
        </div>
      </section>

      <Kit />

      <section className="unsure">
        <div className="wrap unsure-inner">
          <h2 className="section-title">Not sure which one you need?</h2>
          <p>Tell me what you&apos;re trying to show and I&apos;ll suggest the best approach and a fixed price.</p>
          <div className="unsure-actions">
            <Link className="btn btn-orange" href="/#quote">Build a quote</Link>
            {wa && <a className="btn btn-ghost" href={wa} target="_blank" rel="noopener">Message on WhatsApp</a>}
          </div>
        </div>
      </section>
    </div>
  );
}
