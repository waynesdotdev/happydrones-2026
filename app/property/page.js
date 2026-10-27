/* PROPERTY PAGE — the three packages in detail, a comparison table and add-ons.
   Words: PACKAGES, PACKAGE_ROWS and SINGLES in lib/site.js. Prices: PRICING. */
import Link from "next/link";
import ServicesCam from "@/components/ServicesCam";
import ServiceArt from "@/components/ServiceArt";
import KitIcon from "@/components/KitIcon";
import JsonLd from "@/components/JsonLd";
import { PACKAGES, PACKAGE_ROWS, SINGLES, PRICING, SITE, priceFrom, money, kitById, whatsappLink } from "@/lib/site";

export const metadata = {
  title: "Property packages",
  description: "Property photography, aerial, walkthrough video packages for estate agents and homeowners across the North East. Fixed prices from " + priceFrom("essentials") + ".",
  alternates: { canonical: "/property/" },
};

const PROPERTY_IDS = ["essentials", "showcase", "signature", "aerial"];
const addons = PRICING.extras.filter((x) => x.for.some((id) => PROPERTY_IDS.includes(id)));

const schema = {
  "@context": "https://schema.org",
  "@graph": PACKAGES.map((p) => ({
    "@type": "Service",
    name: `${p.title} property package`,
    description: p.lede,
    provider: { "@type": "LocalBusiness", name: SITE.name, url: SITE.url },
    areaServed: SITE.areaServed,
    offers: { "@type": "Offer", price: PRICING.services.find((s) => s.id === p.id)?.base, priceCurrency: "GBP" },
  })),
};

export default function PropertyPage() {
  const wa = whatsappLink();
  return (
    <div className="sub-page">
      <JsonLd data={schema} />

      <section className="page-hero" aria-labelledby="prop-title">
        <div className="page-hero-frame" aria-hidden="true">
          <span className="corner tl"></span><span className="corner tr"></span><span className="corner bl"></span><span className="corner br"></span>
        </div>
        <div className="wrap">
          <h1 id="prop-title">Every angle.<br />One visit.</h1>
          <p>Three property packages, from clean listing photos to the full treatment with a one-take glide tour. Scroll through each one to see exactly what&apos;s included.</p>
        </div>
      </section>

      <nav className="chapter-nav" aria-label="Packages on this page">
        <div className="wrap chapter-nav-inner">
          {PACKAGES.map((p) => <a key={p.id} href={`#${p.id}`}>{p.title}</a>)}
          <a href="#compare">Compare</a>
          <a href="#addons">Add-ons</a>
        </div>
      </nav>

      <section className="svc">
        <div className="wrap svc-grid">
          <ServicesCam items={PACKAGES} />

          <div className="chapters">
            {PACKAGES.map((p) => (
              <article className="chapter" id={p.id} key={p.id}>
                <div className="chapter-art" aria-hidden="true">
                  <ServiceArt name={p.art} />
                  <span className="art-alt"><small>ALT</small> <b>{p.alt}</b> <small>m</small></span>
                </div>
                <h2>{p.title}</h2>
                <p className="lede">{p.lede}</p>
                <h3>What you get</h3>
                <ul className="ticks">{p.gets.map((g) => <li key={g}>{g}</li>)}</ul>
                <dl className="facts">
                  <div><dt>From</dt><dd><b>{priceFrom(p.id)}</b></dd></div>
                  <div><dt>Time on site</dt><dd>{p.time}</dd></div>
                  <div><dt>Delivered</dt><dd>{p.delivery}</dd></div>
                  <div><dt>Best for</dt><dd>{p.tagline.replace(/^For /, "").replace(/^Our /, "")}</dd></div>
                </dl>
                <div className="kit-chips">
                  {p.kit.map((k) => <span className="kit-chip" key={k}><KitIcon id={k} />{kitById(k)?.name}</span>)}
                </div>
                <div className="chapter-actions">
                  <Link className="btn btn-orange" href={`/?service=${p.id}#quote`}>Price {p.title}</Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-mist" id="compare" aria-labelledby="compare-title">
        <div className="wrap">
          <h2 id="compare-title" className="section-title">Compare packages</h2>
          <p className="section-sub">
            Prices are for flats and 1–2 bed homes. 3–4 bed adds {money(PRICING.services[0].sizes[1].add)}, 5+ bed or land adds {money(PRICING.services[0].sizes[2].add)}.
            {SITE.introPricing && <span className="intro-tag">Introductory pricing</span>}
          </p>
          <div className="compare-wrap">
            <table className="compare">
              <thead>
                <tr>
                  <td></td>
                  {PACKAGES.map((p) => (
                    <th key={p.id} scope="col" className={p.featured ? "is-featured" : undefined}>{p.title}<small>from {priceFrom(p.id)}</small></th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PACKAGE_ROWS.map(([label, ...vals]) => (
                  <tr key={label}>
                    <th scope="row">{label}</th>
                    {vals.map((v, i) => <td key={i} className={PACKAGES[i]?.featured ? "is-featured" : undefined}>{v}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 id="addons" className="addons-title" style={{ marginTop: 56, fontSize: "1.8rem" }}>Add-ons and single services</h3>
          <div className="addons">
            {SINGLES.map((s) => (
              <div className="addon" key={s.id}><div><b>{PRICING.services.find((x) => x.id === s.id)?.name}</b><small>{s.text}</small></div><span>from {priceFrom(s.id)}</span></div>
            ))}
            {addons.map((x) => (
              <div className="addon" key={x.id}><div><b>{x.name}</b><small>{x.desc}</small></div><span>+{money(x.price)}</span></div>
            ))}
          </div>
        </div>
      </section>

      <section className="unsure">
        <div className="wrap unsure-inner">
          <h2 className="section-title">Selling more than one a month?</h2>
          <p>Estate agents get a regular weekly slot, monthly invoicing and a discount on every listing.</p>
          <div className="unsure-actions">
            <Link className="btn btn-orange" href="/estate-agents/">See the agent offer</Link>
            {wa && <a className="btn btn-ghost" href={wa} target="_blank" rel="noopener">Message on WhatsApp</a>}
          </div>
        </div>
      </section>
    </div>
  );
}
