/* PROPERTY PAGE — the three packages in detail, a comparison table and add-ons.
   Words: PACKAGES, PACKAGE_ROWS and SINGLES in lib/site.js. Prices: PRICING. */
import Link from "next/link";
import ServicesCam from "@/components/ServicesCam";
import ServiceArt from "@/components/ServiceArt";
import KitIcon from "@/components/KitIcon";
import JsonLd from "@/components/JsonLd";
import { PACKAGES, PACKAGE_ROWS, SINGLES, PRICING, SITE, FAQ, HOME_STEPS, PAYMENT, TRAVEL_TEXT, priceFrom, money, kitById, whatsappLink } from "@/lib/site";
import MoreServices from "@/components/MoreServices";
import QuoteBuilder from "@/components/QuoteBuilder";
import ContactSection from "@/components/ContactSection";
import { QuoteProvider } from "@/components/QuoteContext";
import { Faq, faqSchema } from "@/components/HomeSections";
import Credentials from "@/components/Credentials";

export const metadata = {
  title: "For homeowners: selling, roof checks and aerial photos",
  description: "Drone photos for homeowners across the North East: listing photos and video for selling or letting from " + priceFrom("essentials") + ", roof checks without ladders from " + priceFrom("roof") + ", and aerial photos of your home from " + priceFrom("aerial") + ". Book online.",
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

/* The three homeowner paths at the top of the page */
const PATHS = [
  { id: "sell", cls: "tw-property", art: "walkthrough", tag: `Selling or letting · from ${priceFrom("essentials")}`, title: "Make your home stand out online",
    ticks: ["Listing photos, aerials and a walkthrough video in one visit", "Sized for Rightmove, Zoopla and OnTheMarket", "Three packages with the price on the page"],
    href: "#selling", label: "See the packages", book: "/account/?book=showcase" },
  { id: "roof", cls: "tw-roofs", art: "roof", tag: `Worried about your roof · from ${priceFrom("roof")}`, title: "See your roof without a ladder",
    ticks: ["Close-ups of tiles, chimney and gutters", "Problems marked on the photos", "A pack to show roofers and compare quotes"],
    href: "#roof", label: "Roof checks", book: "/account/?book=roofs" },
  { id: "aerial", cls: "tw-build", art: "home", tag: `Your home from the air · from ${priceFrom("aerial")}`, title: "See the whole plot at once",
    ticks: ["Aerial photos and a short clip", "A keepsake, or before building work", "Nobody needs to be home"],
    href: "#aerial", label: "Aerial photos", book: "/account/?book=aerial" },
];

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
          <p className="eyebrow">For homeowners</p>
          <h1 id="prop-title">Your home,<br />from every angle.</h1>
          <p>Selling or letting, worried about the roof, or just want to see your home from the air. See the price straight away, pick a date and book online.</p>
        </div>
      </section>

      <Credentials />

      <section className="threeways home-paths" aria-labelledby="paths-title">
        <div className="wrap">
          <h2 id="paths-title" className="section-title">What do you need?</h2>
          <div className="tw-grid">
            {PATHS.map((w) => (
              <article key={w.id} className={`tw ${w.cls}`}>
                <div className="tw-art" aria-hidden="true"><ServiceArt name={w.art} /></div>
                <div className="tw-body">
                  <p className="tw-tag">{w.tag}</p>
                  <h3>{w.title}</h3>
                  <ul className="ticks">{w.ticks.map((t) => <li key={t}>{t}</li>)}</ul>
                  <div className="tw-ctas">
                    <a className={`btn ${w.cls === "tw-roofs" ? "btn-navy" : "btn-orange"}`} href={w.href}>{w.label}</a>
                    <Link className="text-link" href={w.book}>Book online</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <h2 id="selling" className="sr-only">Selling or letting: the packages</h2>
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

      <MoreServices page="property" title="More for property and land" lede="Aerial 360s, land and plot photos, and indoor fly-throughs coming soon." />

      <section className="home-more" id="roof" aria-labelledby="roof-title">
        <div className="wrap home-more-grid">
          <div className="home-more-art" aria-hidden="true"><ServiceArt name="roof" /></div>
          <div>
            <p className="eyebrow">Worried about your roof? · from {priceFrom("roof")}</p>
            <h2 id="roof-title" className="section-title">See your roof without anyone climbing on it.</h2>
            <p className="lede">A leak, a slipped tile after a storm, or just not knowing. I photograph the whole roof from the air and get close enough to see each tile, so you know what you&apos;re dealing with before a roofer quotes.</p>
            <ul className="ticks">
              <li>Every slope from above, plus close-ups of the chimney, flashing, valleys and gutters</li>
              <li>Anything worth a look marked on the photos, so a roofer can see exactly what you mean</li>
              <li>Send the same pack to two or three roofers and compare their quotes fairly</li>
              <li>No ladders, no scaffolding, nobody on your roof. Files in 48 to 72 hours</li>
            </ul>
            <p className="small-note">I photograph and point things out; I don&apos;t repair roofs, so I&apos;m not trying to sell you a repair. For a survey or a repair, you&apos;ll still need a roofer or surveyor.</p>
            <div className="tw-ctas">
              <Link className="btn btn-orange" href="/account/?book=roofs">Book a roof check</Link>
              <Link className="text-link" href="/roof-inspections/">More about roof checks</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="home-more section-mist" id="aerial" aria-labelledby="aerial-title">
        <div className="wrap home-more-grid">
          <div className="home-more-art" aria-hidden="true"><ServiceArt name="home" /></div>
          <div>
            <p className="eyebrow">Your home from the air · from {priceFrom("aerial")}</p>
            <h2 id="aerial-title" className="section-title">A photo of your home you&apos;ve never seen.</h2>
            <p className="lede">Aerial photos and a short clip of your home and garden. For a keepsake, before an extension or landscaping work, or to see the whole plot at once.</p>
            <ul className="ticks">
              <li>Aerial photos of the house and plot, and a short video clip</li>
              <li>Edited and delivered by download link in 48 to 72 hours</li>
              <li>Nobody needs to be home, as long as I have your permission to fly</li>
            </ul>
            <div className="tw-ctas">
              <Link className="btn btn-orange" href="/account/?book=aerial">Book aerial photos</Link>
              <Link className="text-link" href="/aerial-photography/">More about aerial photos</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="how" aria-labelledby="how-title">
        <div className="wrap">
          <h2 id="how-title" className="section-title">How it works</h2>
          <ol className="how-steps">
            {HOME_STEPS.map((st, i) => (
              <li key={st.title}><span className="how-num">{i + 1}</span><h3>{st.title}</h3><p>{st.text}</p></li>
            ))}
          </ol>
          <div className="home-rights">
            <h3>Your rights as a homeowner</h3>
            <p>You can cancel within 14 days of booking for any reason. If the work hasn&apos;t started, you get everything back, deposit included. If you want the visit sooner than that, you can ask me to start early when you book; you&apos;d then pay only for work already done if you cancel. The full detail is in section 7 of the <Link href="/terms/">booking agreement</Link>.</p>
            <p>{TRAVEL_TEXT}</p>
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

      {/* The instant quote and the homeowner enquiry form (moved here from the homepage, 19 Nov 2026) */}
      <JsonLd data={faqSchema(FAQ)} />
      <QuoteProvider>
        <QuoteBuilder />
        <Faq items={FAQ} title="Questions homeowners ask" />
        <ContactSection />
      </QuoteProvider>
    </div>
  );
}
