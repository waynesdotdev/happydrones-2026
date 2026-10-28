/* CONSTRUCTION — the in-depth sales page for construction progress work.
   Send developers, contractors and funders here: happydrones.co.uk/construction
   Words and lists: lib/construction.js. Prices come from the mission planner. */
import Link from "next/link";
import CtaBand from "@/components/CtaBand";
import TFaq from "@/components/TFaq";
import JsonLd from "@/components/JsonLd";
import KitIcon from "@/components/KitIcon";
import { Arrow } from "@/components/TIcons";
import HeroBuild from "@/components/construction/HeroBuild";
import BuildScroll from "@/components/construction/BuildScroll";
import Filmstrip from "@/components/construction/Filmstrip";
import CapturePlan from "@/components/construction/CapturePlan";
import { SITE, PLANNER, PAYMENT, money, kitById, whatsappLink } from "@/lib/site";
import {
  constructionPrices, DELIVERABLES, FOLDER, USES, PROCESS, COMPLIANCE,
  TODAY_KIT, LIMITS, MEASURED, CONSTRUCTION_FAQ,
} from "@/lib/construction";

export const metadata = {
  title: "Construction progress drone photography",
  description: "Monthly construction progress photos and film from fixed positions, across the North East. Dated records for developers, contractors and funders, delivered in 48–72 hours.",
  alternates: { canonical: "/construction/" },
};

const WHY = [
  { t: "The ground swallows the evidence", d: "Foundations, drainage and services are covered within weeks. A dated overhead from the same spot proves what went in, and when." },
  { t: "Funders want to see it", d: "A two-minute film says more than ten pages of a monthly report. Lenders and investors stay confident when they can watch the build." },
  { t: "Buyers buy the story", d: "Progress footage turns into launch films, hoardings and social posts, and keeps off-plan buyers excited until handover." },
];

export default function ConstructionPage() {
  const prices = constructionPrices();
  const extras = PLANNER.extras;
  const wa = whatsappLink("Hi Happy Drones, I'd like to talk about construction progress visits for a site.");
  const waMeasured = whatsappLink("Hi Happy Drones, I'd like to talk about measured mapping (RTK) on a construction contract.");
  const schema = [
    { "@context": "https://schema.org", "@type": "Service", name: "Construction progress drone photography", serviceType: "Construction progress monitoring (visual)", areaServed: SITE.areaServed, provider: { "@type": "LocalBusiness", name: SITE.name, url: SITE.url, telephone: SITE.phone }, offers: { "@type": "Offer", price: prices?.from, priceCurrency: "GBP" } },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: CONSTRUCTION_FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ];

  return (
    <div className="sub-page cx">
      <JsonLd data={schema} />

      {/* HERO */}
      <section className="cx-hero t-dark" aria-labelledby="cx-title">
        <div className="wrap cx-hero-in">
          <div className="cx-hero-copy">
            <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true"> / </span><Link href="/commercial/">Commercial</Link><span aria-hidden="true"> / </span><span aria-current="page">Construction</span></nav>
            <span className="t-live">Construction progress · {SITE.areaServed}</span>
            <h1 id="cx-title">Every month of the build, from the same spot in the sky.</h1>
            <p className="t-lede">Fixed-position aerial photos and film of your site, flown on a regular schedule and delivered within 72 hours. A dated record your team, funders and buyers can actually see.</p>
            <div className="t-hero-ctas">
              <Link className="t-btn t-btn-primary" href="/plan/?mission=construction">Price your site <Arrow /></Link>
              {wa && <a className="t-btn t-btn-ghost" href={wa} target="_blank" rel="noopener">WhatsApp {SITE.phoneDisplay}</a>}
            </div>
          </div>
          <figure className="cx-hero-art t-frame"><HeroBuild /></figure>
        </div>
        <div className="wrap">
          <dl className="cx-stats">
            <div><dt>Monthly visits from</dt><dd>{prices ? money(prices.monthlyFrom) : "—"}<small>per visit</small></dd></div>
            <div><dt>Fixed positions</dt><dd>4–6<small>same every visit</small></dd></div>
            <div><dt>Delivered in</dt><dd>48–72 h<small>by download link</small></dd></div>
            <div><dt>Insured</dt><dd>{SITE.insurance.publicLiability}<small>public liability</small></dd></div>
          </dl>
        </div>
      </section>

      {/* WHY */}
      <section className="t-section t-dark" aria-labelledby="cx-why-title" style={{ paddingTop: "clamp(40px, 6vw, 72px)" }}>
        <div className="wrap">
          <div className="t-head"><span className="t-tag">Why sites pay for it</span><h2 id="cx-why-title">A build only happens once. Record it properly.</h2></div>
          <div className="t-why cx-why">{WHY.map((w) => <div key={w.t}><h3>{w.t}</h3><p>{w.d}</p></div>)}</div>
        </div>
      </section>

      {/* SCROLL BUILD */}
      <BuildScroll />

      {/* FILMSTRIP */}
      <section className="t-section t-dark" aria-labelledby="cx-film-title">
        <div className="wrap">
          <div className="t-head t-split">
            <div className="t-stack"><span className="t-tag">Same position, every visit</span><h2 id="cx-film-title">Slide through the whole build.</h2></div>
            <p className="t-lede">Each visit is flown from saved routes, so position A in month 1 lines up with position A in month 14. Drag or swipe the strip to move through a typical programme.</p>
          </div>
          <Filmstrip />
        </div>
      </section>

      {/* CAPTURE PLAN */}
      <section className="t-section t-light" aria-labelledby="cx-plan-title">
        <div className="wrap">
          <div className="t-head t-split">
            <div className="t-stack"><span className="t-tag">The capture plan</span><h2 id="cx-plan-title">We agree the positions once. Then every visit matches.</h2></div>
            <p className="t-lede">Before visit one, we fix four to six positions with you: height, angle and what each one is for. They&apos;re written down and saved as flight routes, so nothing depends on memory.</p>
          </div>
          <CapturePlan />
        </div>
      </section>

      {/* DELIVERABLES */}
      <section className="t-section t-dark" aria-labelledby="cx-get-title">
        <div className="wrap cx-get">
          <div className="t-stack-lg" style={{ minWidth: 0 }}>
            <div className="t-head" style={{ marginBottom: 0 }}><span className="t-tag">After every visit</span><h2 id="cx-get-title">What lands in your inbox.</h2></div>
            <ol className="cx-deliv">{DELIVERABLES.map((d, i) => <li key={d.t}><span className="t-mono">CP-{String(i + 1).padStart(2, "0")}</span><div><h3>{d.t}</h3><p>{d.d}</p></div></li>)}</ol>
          </div>
          <figure className="cx-folder t-frame" aria-label="Example of a delivered visit folder">
            <p className="t-mono">DOWNLOAD LINK · EXAMPLE</p>
            <ul>{FOLDER.map((f, i) => <li key={i} style={{ "--d": f.d }}><span>{f.n.endsWith("/") ? "▸" : "·"} {f.n}</span>{f.k && <small>{f.k}</small>}</li>)}</ul>
            <figcaption>Named by site, visit and position. Nothing to rename before it goes in a report.</figcaption>
          </figure>
        </div>
      </section>

      {/* USES */}
      <section className="t-section t-light" aria-labelledby="cx-uses-title">
        <div className="wrap">
          <div className="t-head"><span className="t-tag">Who it&apos;s for</span><h2 id="cx-uses-title">One record. Used by everyone on the project.</h2></div>
          <div className="cx-uses">{USES.map((u) => <div key={u.who}><h3>{u.who}</h3><p>{u.what}</p></div>)}</div>
          <div className="vp-xlink">
            <div><p className="t-mono">BEFORE THE BUILD STARTS</p><h3>Site sitting empty while you wait on planning?</h3><p>The same fixed positions can check an empty building every month for lead theft, roof damage, fly-tipping and break-ins, then carry straight on as your progress record when work begins.</p></div>
            <Link className="t-btn t-btn-primary" href="/vacant-property-monitoring/">Vacant property monitoring <Arrow /></Link>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="t-section t-dark" aria-labelledby="cx-proc-title">
        <div className="wrap">
          <div className="t-head t-split">
            <div className="t-stack"><span className="t-tag">How we work together</span><h2 id="cx-proc-title">From first call to handover film.</h2></div>
            <p className="t-lede">One point of contact from start to finish: me. I plan, fly, edit and deliver every visit myself.</p>
          </div>
          <ol className="cx-process">{PROCESS.map((s) => <li key={s.t}><span className="t-mono">{s.tag}</span><h3>{s.t}</h3><p>{s.d}</p></li>)}</ol>
        </div>
      </section>

      {/* PRICING */}
      {prices && (
        <section className="t-section t-light" id="pricing" aria-labelledby="cx-price-title">
          <div className="wrap">
            <div className="t-head t-split">
              <div className="t-stack"><span className="t-tag">Guide prices</span><h2 id="cx-price-title">Price per visit, by site size and how often.</h2></div>
              <p className="t-lede">The more often I visit, the less each visit costs. You get a fixed quote in writing before anything is booked.</p>
            </div>
            <div className="cx-price-wrap">
              <table className="cx-price">
                <caption className="visually-hidden">Guide price per visit for construction progress</caption>
                <thead>
                  <tr><th scope="col">Site size</th>{prices.freqs.map((f) => <th scope="col" key={f.id}>{f.name}{f.disc ? <small>save {Math.round(f.disc * 100)}%</small> : <small>single visit</small>}</th>)}</tr>
                </thead>
                <tbody>
                  {prices.rows.map((r) => (
                    <tr key={r.id}>
                      <th scope="row">{r.name}<small>{r.note}</small></th>
                      {r.cells.map((c) => <td key={c.id}><b>{money(c.perVisit)}</b><small>{c.visits > 1 ? `${money(c.total)} for ${c.visits}` : "per visit"}</small></td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="cx-price-notes">
              <div>
                <h3>Add to any visit</h3>
                <ul>{extras.map((x) => <li key={x.id}><span>{x.name}</span><b>+{money(x.price)}</b></li>)}</ul>
              </div>
              <div>
                <h3>How it&apos;s invoiced</h3>
                <p>Repeat-visit contracts and jobs of {money(PAYMENT.largeFrom)} or more are invoiced per visit on {PAYMENT.termsDays}-day terms. One-off visits take a {PAYMENT.depositPct}% deposit to secure the date.</p>
                <p>Travel is included across the core area. Sites further out are quoted with travel. Everything is set out in the <Link href="/terms/">booking agreement</Link>.</p>
              </div>
            </div>
            <div className="t-hero-ctas" style={{ marginTop: 28 }}>
              <Link className="t-btn t-btn-primary" href="/plan/?mission=construction">Build your exact price <Arrow /></Link>
            </div>
          </div>
        </section>
      )}

      {/* KIT + COMPLIANCE */}
      <section className="t-section t-dark" aria-labelledby="cx-kit-title">
        <div className="wrap cx-two">
          <div className="t-stack-lg" style={{ minWidth: 0 }}>
            <div className="t-head" style={{ marginBottom: 0 }}><span className="t-tag">Flown today with</span><h2 id="cx-kit-title">The kit on your site.</h2></div>
            <ul className="cx-kit">
              {TODAY_KIT.map((k) => { const item = kitById(k.id); return item ? (
                <li key={k.id}><span className="cx-kit-icon"><KitIcon id={k.id} /></span><div><b>{item.name}</b><small className="t-mono">{k.role.toUpperCase()}</small><p>{k.d}</p></div></li>
              ) : null; })}
            </ul>
            <p><Link className="text-link" href="/fleet/">See the whole fleet</Link></p>
          </div>
          <div className="t-stack-lg" style={{ minWidth: 0 }}>
            <div className="t-head" style={{ marginBottom: 0 }}><span className="t-tag">On site, by the book</span><h2>Safety and paperwork, sorted before visit one.</h2></div>
            <ul className="cx-comp">{COMPLIANCE.map((c) => <li key={c.t}><b>{c.t}</b><span>{c.d}</span></li>)}</ul>
            <p><Link className="text-link" href="/safety/">How every flight is planned</Link></p>
          </div>
        </div>
      </section>

      {/* LIMITS */}
      <section className="t-section t-light" aria-labelledby="cx-lim-title" style={{ paddingBlock: "clamp(40px, 6vw, 72px)" }}>
        <div className="wrap">
          <div className="cx-limits">
            <h2 id="cx-lim-title">Straight answers: what this service is, and isn&apos;t.</h2>
            <ul>{LIMITS.map((l) => <li key={l}>{l}</li>)}</ul>
          </div>
        </div>
      </section>

      {/* MEASURED / RTK ROADMAP */}
      <section className="t-section t-dark cx-measured" id="measured" aria-labelledby="cx-meas-title">
        <div className="wrap">
          <div className="t-head t-split">
            <div className="t-stack"><span className="t-tag">Coming next · Measured progress</span><h2 id="cx-meas-title">From pictures of progress to measurements of it.</h2></div>
            <p className="t-lede">The next step for Happy Drones is RTK mapping: centimetre-level positioning that turns each visit into maps, models and volumes you can measure. It isn&apos;t offered yet, but it can arrive sooner for the right contract.</p>
          </div>
          <div className="cx-compare">
            <div className="cx-col">
              <p className="t-mono">AVAILABLE NOW · VISUAL</p>
              <ul>{MEASURED.now.map((m) => <li key={m}>{m}</li>)}</ul>
            </div>
            <div className="cx-col cx-col-next">
              <p className="t-mono">COMING NEXT · MEASURED (RTK)</p>
              <ul>{MEASURED.next.map((m) => <li key={m}>{m}</li>)}</ul>
            </div>
          </div>
          <div className="cx-aircraft">
            {MEASURED.aircraft.map((a, i) => (
              <div key={a.name}><span className="t-mono">STEP {i + 1}</span><h3>{a.name}</h3><p>{a.d}</p></div>
            ))}
          </div>
          <div className="cx-contract t-frame">
            <div>
              <h3>Need measured outputs now?</h3>
              <p>For a contract of the right length, I&apos;ll hire or buy the RTK aircraft and set up the mapping workflow to suit your programme. Tell me about the site, the outputs you need and the timescale, and I&apos;ll come back with a plan, a start date and a price.</p>
            </div>
            <div className="t-hero-ctas">
              {waMeasured && <a className="t-btn t-btn-primary" href={waMeasured} target="_blank" rel="noopener">Talk about a measured contract <Arrow /></a>}
              <Link className="t-btn t-btn-ghost" href="/#contact">Send the details</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="t-section t-dark" aria-labelledby="cx-faq-title" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="t-head"><span className="t-tag">Questions from site teams</span><h2 id="cx-faq-title">Before you book.</h2></div>
          <TFaq items={CONSTRUCTION_FAQ} />
        </div>
      </section>

      <CtaBand title="Tell me about your site." text="Get a guide price in under a minute, then a fixed quote, capture plan and paperwork within a day." />
    </div>
  );
}
