/* VACANT PROPERTY MONITORING — monthly drone checks of empty buildings.
   For developers waiting on planning, owners, receivers and agents.
   happydrones.co.uk/vacant-property-monitoring
   Words: lib/vacant.js · Price: VACANT in lib/site.js (null = "price on request") */
import Link from "next/link";
import TFaq from "@/components/TFaq";
import JsonLd from "@/components/JsonLd";
import KitIcon from "@/components/KitIcon";
import { Arrow } from "@/components/TIcons";
import { HeroVacant, MonthSlider, CheckExplorer, SampleReport } from "@/components/vacant/VacantBits";
import { SITE, PAYMENT, VACANT, money, kitById, whatsappLink } from "@/lib/site";
import { VP_SPLIT, VP_WHO, VP_PROCESS, VP_LIMITS, VP_FAQ } from "@/lib/vacant";

export const metadata = {
  title: "Vacant property drone monitoring",
  description: "Monthly drone checks of empty buildings across the North East: roof, lead, gutters, windows, fences and fly-tipping, from the same positions every visit, with a dated report.",
  alternates: { canonical: "/vacant-property-monitoring/" },
};

const WHY = [
  { t: "Nobody's looking", d: "An empty building gets worse quietly. A slipped slate in March is a wet floor by October, and nobody sees it happen." },
  { t: "The roof goes first", d: "Stolen lead, storm damage and blocked gutters all start up high, where a walk round the outside can't see." },
  { t: "A dated record", d: "The same views every month, dated and numbered. Useful for your insurer, your lender, a buyer or your own files." },
];

export default function VacantPage() {
  const price = VACANT.perVisit;
  const mini = kitById("mini4");
  const wa = whatsappLink("Hi Happy Drones, I'd like monthly drone checks on an empty building. The address is: ");
  const schema = [
    { "@context": "https://schema.org", "@type": "Service", name: "Vacant property drone monitoring", serviceType: "Vacant building condition monitoring (visual)", areaServed: SITE.areaServed, provider: { "@type": "LocalBusiness", name: SITE.name, url: SITE.url, telephone: SITE.phone }, ...(price ? { offers: { "@type": "Offer", price, priceCurrency: "GBP" } } : {}) },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: VP_FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ];

  return (
    <div className="sub-page cx vp">
      <JsonLd data={schema} />

      {/* HERO */}
      <section className="cx-hero t-dark" aria-labelledby="vp-title">
        <div className="wrap cx-hero-in">
          <div className="cx-hero-copy">
            <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true"> / </span><span aria-current="page">Vacant property monitoring</span></nav>
            <span className="t-live">Empty buildings · {SITE.areaServed}</span>
            <h1 id="vp-title">Empty building? Know it isn&apos;t getting worse.</h1>
            <p className="t-lede">A drone check every month from the same positions: the roof, the lead, the gutters, the windows, the fences and the yard. Then a dated report with anything new at the top.</p>
            <div className="t-hero-ctas">
              <Link className="t-btn t-btn-primary" href="/#contact">Ask about monthly checks <Arrow /></Link>
              {wa && <a className="t-btn t-btn-ghost" href={wa} target="_blank" rel="noopener">WhatsApp {SITE.phoneDisplay}</a>}
            </div>
          </div>
          <figure className="cx-hero-art t-frame"><HeroVacant /></figure>
        </div>
        <div className="wrap">
          <dl className="cx-stats">
            <div><dt>Visits</dt><dd>Monthly<small>or quarterly, from the same positions</small></dd></div>
            <div><dt>Report in</dt><dd>48–72 h<small>new issues first</small></dd></div>
            <div><dt>Price</dt><dd>{price ? money(price) : "On request"}<small>{price ? "per visit" : "fixed per visit, in writing"}</small></dd></div>
            <div><dt>Insured</dt><dd>{SITE.insurance.publicLiability}<small>public liability</small></dd></div>
          </dl>
        </div>
      </section>

      {/* WHY */}
      <section className="t-section t-dark" aria-labelledby="vp-why-title" style={{ paddingTop: "clamp(40px, 6vw, 72px)" }}>
        <div className="wrap">
          <div className="t-head"><span className="t-tag">Why check from the air</span><h2 id="vp-why-title">An empty building can&apos;t tell you it&apos;s leaking.</h2></div>
          <div className="t-why cx-why">{WHY.map((w) => <div key={w.t}><h3>{w.t}</h3><p>{w.d}</p></div>)}</div>
        </div>
      </section>

      {/* A YEAR OF VISITS */}
      <section className="t-section t-dark" aria-labelledby="vp-year-title" style={{ paddingTop: 0 }}>
        <div className="wrap"><MonthSlider /></div>
      </section>

      {/* WHAT GETS CHECKED */}
      <section className="t-section t-light" aria-labelledby="vp-chk-title">
        <div className="wrap">
          <div className="t-head t-split">
            <div className="t-stack"><span className="t-tag">Every visit</span><h2 id="vp-chk-title">Eight things checked, every month.</h2></div>
            <p className="t-lede">Tap a part of the building to see what the drone looks at. Every visit covers all eight, from the same positions and heights.</p>
          </div>
          <CheckExplorer />
        </div>
      </section>

      {/* DRONE VS WALK-ROUND */}
      <section className="t-section t-light" aria-labelledby="vp-split-title" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="t-head t-split">
            <div className="t-stack"><span className="t-tag">Alongside your inspections</span><h2 id="vp-split-title">The drone sees the outside. Your walk-round sees the inside.</h2></div>
            <p className="t-lede">Most insurers ask for weekly inside-and-outside checks on empty buildings. This doesn&apos;t replace them. It adds the parts nobody can see from the ground, with photos to prove it.</p>
          </div>
          <div className="vp-split">
            <div className="vp-split-col vp-split-drone">
              <p className="t-mono">MONTHLY DRONE CHECK</p>
              <ul>{VP_SPLIT.drone.map((d) => <li key={d}>{d}</li>)}</ul>
            </div>
            <div className="vp-split-col">
              <p className="t-mono">YOUR WEEKLY WALK-ROUND OR KEY-HOLDER</p>
              <ul>{VP_SPLIT.walk.map((d) => <li key={d}>{d}</li>)}</ul>
            </div>
          </div>
        </div>
      </section>

      {/* SAMPLE REPORT */}
      <section className="t-section t-dark" aria-labelledby="vp-rep-title">
        <div className="wrap">
          <div className="t-head t-split">
            <div className="t-stack"><span className="t-tag">What you get</span><h2 id="vp-rep-title">A short report, new things first.</h2></div>
            <p className="t-lede">The overview photo comes first with every issue numbered on it, then a close-up of each one. Anything new since last month is flagged, so you can see what&apos;s changed in a minute.</p>
          </div>
          <SampleReport />
        </div>
      </section>

      {/* WHO */}
      <section className="t-section t-dark" aria-labelledby="vp-who-title" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="t-head"><span className="t-tag">Who it&apos;s for</span><h2 id="vp-who-title">Buildings waiting for their next chapter.</h2></div>
          <div className="vp-who">{VP_WHO.map((w) => <div key={w.t}><h3>{w.t}</h3><p>{w.d}</p></div>)}</div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="t-section t-dark" aria-labelledby="vp-proc-title" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="t-head t-split">
            <div className="t-stack"><span className="t-tag">How it works</span><h2 id="vp-proc-title">From a starting record to the day work begins.</h2></div>
            <p className="t-lede">You deal with me from start to finish. I check the airspace, fly, write up and send every report myself.</p>
          </div>
          <ol className="cx-process">{VP_PROCESS.map((s) => <li key={s.t}><span className="t-mono">{s.tag}</span><h3>{s.t}</h3><p>{s.d}</p></li>)}</ol>
          <p style={{ marginTop: 24 }}><Link className="text-link" href="/construction/">See how construction progress works</Link></p>
        </div>
      </section>

      {/* PRICE */}
      <section className="t-section t-light" id="pricing" aria-labelledby="vp-price-title">
        <div className="wrap">
          <div className="t-head t-split">
            <div className="t-stack"><span className="t-tag">Price</span><h2 id="vp-price-title">{price ? `${money(price)} a visit.` : "A fixed price per visit."}</h2></div>
            <p className="t-lede">{price ? "For a typical empty building and its yard. Larger sites are quoted by size." : "Every building is different, so send me the address and I'll come back with a fixed price per visit, in writing, before anything is booked."}</p>
          </div>
          <div className="cx-price-notes">
            <div>
              <h3>What&apos;s included</h3>
              <ul className="vp-incl">
                <li>The same fixed positions and heights every visit</li>
                <li>All eight checks, with close-ups of anything new</li>
                <li>A dated report within 48–72 hours</li>
                <li>Extra visits after storms, booked between the monthly ones</li>
              </ul>
            </div>
            <div>
              <h3>How you pay</h3>
              <p>Regular visits are invoiced on {PAYMENT.termsDays}-day terms. You can change the schedule, monthly or quarterly, as the building&apos;s plans change.</p>
              <p>Travel is included across the core area. Buildings further out are quoted with travel. Everything is set out in the <Link href="/terms/">booking agreement</Link>.</p>
            </div>
          </div>
          <div className="t-hero-ctas" style={{ marginTop: 28 }}>
            <Link className="t-btn t-btn-primary" href="/#contact">Get a price for your building <Arrow /></Link>
          </div>
        </div>
      </section>

      {/* KIT + LIMITS */}
      <section className="t-section t-dark" aria-labelledby="vp-kit-title">
        <div className="wrap cx-two">
          <div className="t-stack-lg" style={{ minWidth: 0 }}>
            <div className="t-head" style={{ marginBottom: 0 }}><span className="t-tag">Flown today with</span><h2 id="vp-kit-title">Small, quiet and quick to set up.</h2></div>
            <ul className="cx-kit">
              {mini && <li><span className="cx-kit-icon"><KitIcon id={mini.id} /></span><div><b>{mini.name}</b><small className="t-mono">CLOSE-UP STILLS AND 4K VIDEO</small><p>Light enough to fly close to roofs and chimneys, and quick to get in the air between other jobs.</p></div></li>}
            </ul>
            <p><Link className="text-link" href="/fleet/">See the whole fleet</Link></p>
          </div>
          <div className="t-stack-lg" style={{ minWidth: 0 }}>
            <div className="t-head" style={{ marginBottom: 0 }}><span className="t-tag">Straight answers</span><h2>What a monthly check is, and isn&apos;t.</h2></div>
            <ul className="cx-comp rf-limits">{VP_LIMITS.map((l) => <li key={l}><span>{l}</span></li>)}</ul>
            <p><Link className="text-link" href="/safety/">How every flight is planned</Link></p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="t-section t-dark" aria-labelledby="vp-faq-title" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="t-head"><span className="t-tag">Questions about empty buildings</span><h2 id="vp-faq-title">Before you book.</h2></div>
          <TFaq items={VP_FAQ} />
        </div>
      </section>

      {/* CTA */}
      <section className="t-section t-dark vp-cta" aria-labelledby="vp-cta-title" style={{ paddingTop: 0 }}>
        <div className="wrap vp-cta-in">
          <div className="t-stack"><span className="t-live">Taking on buildings now</span><h2 id="vp-cta-title">Got a building sitting empty?</h2></div>
          <div className="t-stack">
            <p className="t-lede">Send the address and how long it&apos;s likely to stay empty. You&apos;ll get a fixed price per visit and a date for the first check within a day.</p>
            <div className="t-hero-ctas">
              <Link className="t-btn t-btn-primary" href="/#contact">Send a message <Arrow /></Link>
              {wa && <a className="t-btn t-btn-ghost" href={wa} target="_blank" rel="noopener">WhatsApp</a>}
            </div>
            <p className="t-cta-contact">Or call <b>{SITE.phoneDisplay}</b></p>
          </div>
        </div>
      </section>
    </div>
  );
}
