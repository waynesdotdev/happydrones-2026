/* ROOF INSPECTIONS — in-depth page for homeowners, landlords, roofers and property managers.
   happydrones.co.uk/roof-inspections · Words and prices: lib/roofs.js */
import Link from "next/link";
import CtaBand from "@/components/CtaBand";
import TFaq from "@/components/TFaq";
import JsonLd from "@/components/JsonLd";
import KitIcon from "@/components/KitIcon";
import { Arrow } from "@/components/TIcons";
import HeroRoof from "@/components/roofs/HeroRoof";
import InspectScroll from "@/components/roofs/InspectScroll";
import GroundVsDrone from "@/components/roofs/GroundVsDrone";
import RoofAnatomy from "@/components/roofs/RoofAnatomy";
import ScenarioRail from "@/components/roofs/ScenarioRail";
import SamplePack from "@/components/roofs/SamplePack";
import { SITE, PLANNER, PAYMENT, money, kitById, whatsappLink } from "@/lib/site";
import {
  roofPrices, RF_METHODS, RF_METHOD_NOTE, RF_DELIVERABLES, RF_FOLDER, RF_PROCESS,
  RF_LIMITS, RF_KIT_NOW, RF_KIT_NEXT, RF_FAQ,
} from "@/lib/roofs";

export const metadata = {
  title: "Drone roof inspections",
  description: "Close, numbered drone photos of your roof, chimney, gutters and flat roofs, without ladders or scaffolding. Across the North East, from £99, delivered in 48–72 hours.",
  alternates: { canonical: "/roof-inspections/" },
};

const WHY = [
  { t: "Nobody goes up", d: "No ladders, no scaffold, nobody on a roof that might not be safe to stand on. The drone does the looking from a few metres away." },
  { t: "Know before you pay for access", d: "Scaffolding just to look at a chimney can cost hundreds of pounds a week. Find out first whether anyone needs to go up, and where." },
  { t: "Evidence you can send", d: "Numbered, dated photos a roofer can quote from, a surveyor can refer to and an insurer can see. Forward one link." },
];

export default function RoofInspectionsPage() {
  const prices = roofPrices();
  const extras = PLANNER.extras.filter((x) => x.id === "raw" || x.id === "rush");
  const kitNow = kitById(RF_KIT_NOW.id);
  const wa = whatsappLink("Hi Happy Drones, I'd like a drone roof check. The address is: ");
  const schema = [
    { "@context": "https://schema.org", "@type": "Service", name: "Drone roof inspection", serviceType: "Roof inspection photography (visual)", areaServed: SITE.areaServed, provider: { "@type": "LocalBusiness", name: SITE.name, url: SITE.url, telephone: SITE.phone }, offers: { "@type": "Offer", price: prices?.from, priceCurrency: "GBP" } },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: RF_FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ];

  return (
    <div className="sub-page cx rf">
      <JsonLd data={schema} />

      {/* HERO */}
      <section className="cx-hero t-dark" aria-labelledby="rf-title">
        <div className="wrap cx-hero-in">
          <div className="cx-hero-copy">
            <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true"> / </span><Link href="/services/">Services</Link><span aria-hidden="true"> / </span><span aria-current="page">Roof inspections</span></nav>
            <span className="t-live">Roofs, chimneys and gutters · {SITE.areaServed}</span>
            <h1 id="rf-title">See every inch of your roof. Nobody goes up.</h1>
            <p className="t-lede">Close, numbered drone photos of every slope, the chimney, the gutters and any flat roofs, in under an hour on site. Send them straight to your roofer, surveyor or insurer.</p>
            <div className="t-hero-ctas">
              <Link className="t-btn t-btn-primary" href="/plan/?mission=roofs">Price your roof <Arrow /></Link>
              {wa && <a className="t-btn t-btn-ghost" href={wa} target="_blank" rel="noopener">WhatsApp {SITE.phoneDisplay}</a>}
            </div>
          </div>
          <figure className="cx-hero-art t-frame"><HeroRoof /></figure>
        </div>
        <div className="wrap">
          <dl className="cx-stats">
            <div><dt>Roof checks from</dt><dd>{prices ? money(prices.from) : "—"}<small>a house or garage</small></dd></div>
            <div><dt>On site</dt><dd>&lt; 1 h<small>for most houses</small></dd></div>
            <div><dt>Delivered in</dt><dd>48–72 h<small>by download link</small></dd></div>
            <div><dt>Insured</dt><dd>{SITE.insurance.publicLiability}<small>public liability</small></dd></div>
          </dl>
        </div>
      </section>

      {/* WHY */}
      <section className="t-section t-dark" aria-labelledby="rf-why-title" style={{ paddingTop: "clamp(40px, 6vw, 72px)" }}>
        <div className="wrap">
          <div className="t-head"><span className="t-tag">Why a drone</span><h2 id="rf-why-title">Look closely first. Pay for access only if you need it.</h2></div>
          <div className="t-why cx-why">{WHY.map((w) => <div key={w.t}><h3>{w.t}</h3><p>{w.d}</p></div>)}</div>
        </div>
      </section>

      {/* SCROLL INSPECTION */}
      <InspectScroll />

      {/* GROUND VS DRONE */}
      <section className="t-section t-light" aria-labelledby="rf-gv-title">
        <div className="wrap">
          <div className="t-head t-split">
            <div className="t-stack"><span className="t-tag">Drag to compare</span><h2 id="rf-gv-title">What you can see from the pavement, and what you can&apos;t.</h2></div>
            <p className="t-lede">From the street, a chimney is a small shape at the top of a steep angle. From a few metres away, you can see the lead, the mortar and every slate. Drag the line across.</p>
          </div>
          <GroundVsDrone />
        </div>
      </section>

      {/* ANATOMY */}
      <section className="ea-sec" aria-labelledby="rf-anat-title">
        <div className="wrap">
          <p className="ea-eyebrow">The drone&apos;s view</p>
          <h2 id="rf-anat-title" className="section-title">Every part of a roof, and what gets photographed.</h2>
          <p className="section-sub">This is a roof as the drone sees it, from directly above. Tap a number to see what each part is, how I photograph it and what a roofer will usually want to see.</p>
          <RoofAnatomy />
        </div>
      </section>

      {/* SCENARIOS */}
      <section className="t-section t-dark" aria-labelledby="rf-who-title">
        <div className="wrap">
          <div className="t-head t-split">
            <div className="t-stack"><span className="t-tag">Who books a roof check</span><h2 id="rf-who-title">Nine reasons people want a closer look.</h2></div>
            <p className="t-lede">Homeowners after a storm, buyers before they commit, roofers who&apos;d rather quote from the ground. Drag or swipe through the situations.</p>
          </div>
          <ScenarioRail />
        </div>
      </section>

      {/* METHODS */}
      <section className="t-section t-light" aria-labelledby="rf-meth-title">
        <div className="wrap">
          <div className="t-head t-split">
            <div className="t-stack"><span className="t-tag">Ways to look at a roof</span><h2 id="rf-meth-title">Five ways to see a roof. One where nobody leaves the ground.</h2></div>
            <p className="t-lede">A drone doesn&apos;t replace a roofer going up when work needs doing. It tells you whether they need to, and exactly where.</p>
          </div>
          <div className="rf-methods">
            {RF_METHODS.map((m) => (
              <div key={m.id} className={m.best ? "rf-method best" : "rf-method"}>
                <h3>{m.name}</h3>
                <dl>
                  <div><dt>How close</dt><dd>{m.close}</dd></div>
                  <div><dt>Arranging it</dt><dd>{m.time}</dd></div>
                  <div><dt>Cost</dt><dd>{m.cost}</dd></div>
                  <div><dt>Risk</dt><dd>{m.risk}</dd></div>
                  <div><dt>What you keep</dt><dd>{m.keep}</dd></div>
                </dl>
              </div>
            ))}
          </div>
          <p className="rf-note">{RF_METHOD_NOTE}</p>
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section className="t-section t-dark" aria-labelledby="rf-get-title">
        <div className="wrap">
          <div className="t-head t-split">
            <div className="t-stack"><span className="t-tag">What you get</span><h2 id="rf-get-title">A numbered photo pack, ready to forward.</h2></div>
            <p className="t-lede">The overview comes first with every close-up pinned on it, so whoever opens the pack knows exactly where each photo was taken. Tap a frame to look closer.</p>
          </div>
          <SamplePack />
          <div className="cx-get rf-get">
            <ol className="cx-deliv">{RF_DELIVERABLES.map((d, i) => <li key={d.t}><span className="t-mono">RF-{String(i + 1).padStart(2, "0")}</span><div><h3>{d.t}</h3><p>{d.d}</p></div></li>)}</ol>
            <figure className="cx-folder t-frame" aria-label="Example of a delivered roof check folder">
              <p className="t-mono">DOWNLOAD LINK · EXAMPLE</p>
              <ul>{RF_FOLDER.map((f, i) => <li key={i} style={{ "--d": f.d }}><span>{f.n.endsWith("/") ? "▸" : "·"} {f.n}</span>{f.k && <small>{f.k}</small>}</li>)}</ul>
              <figcaption>Named by address, date and part of the roof.</figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="t-section t-dark" aria-labelledby="rf-proc-title" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="t-head t-split">
            <div className="t-stack"><span className="t-tag">How it works</span><h2 id="rf-proc-title">From a message to a photo pack in three days.</h2></div>
            <p className="t-lede">You deal with me from start to finish. I check the airspace, fly, edit and deliver every roof check myself.</p>
          </div>
          <ol className="cx-process">{RF_PROCESS.map((s) => <li key={s.t}><span className="t-mono">{s.tag}</span><h3>{s.t}</h3><p>{s.d}</p></li>)}</ol>
        </div>
      </section>

      {/* PRICING */}
      {prices && (
        <section className="t-section t-light" id="pricing" aria-labelledby="rf-price-title">
          <div className="wrap">
            <div className="t-head t-split">
              <div className="t-stack"><span className="t-tag">Guide prices</span><h2 id="rf-price-title">Priced by the size of the roof.</h2></div>
              <p className="t-lede">One-off checks, or a visit every quarter for landlords and property managers, with a saving on each visit. You get a fixed price in writing before anything is booked.</p>
            </div>
            <div className="cx-price-wrap">
              <table className="cx-price rf-price">
                <caption className="visually-hidden">Guide price per visit for a drone roof check</caption>
                <thead>
                  <tr><th scope="col">Roof size</th>{prices.freqs.map((f) => <th scope="col" key={f.id}>{f.name}{f.disc ? <small>save {Math.round(f.disc * 100)}%</small> : <small>single visit</small>}</th>)}</tr>
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
                <h3>Add to any check</h3>
                <ul>{extras.map((x) => <li key={x.id}><span>{x.name}</span><b>+{money(x.price)}</b></li>)}</ul>
              </div>
              <div>
                <h3>How you pay</h3>
                <p>One-off checks take a {PAYMENT.depositPct}% deposit to book the date. Repeat visits, and jobs of {money(PAYMENT.largeFrom)} or more, are invoiced on {PAYMENT.termsDays}-day terms.</p>
                <p>Travel is included across the core area. Roofs further out are quoted with travel. Everything is set out in the <Link href="/terms/">booking agreement</Link>.</p>
              </div>
            </div>
            <div className="t-hero-ctas" style={{ marginTop: 28 }}>
              <Link className="t-btn t-btn-primary" href="/plan/?mission=roofs">Build your exact price <Arrow /></Link>
            </div>
          </div>
        </section>
      )}

      {/* KIT + LIMITS */}
      <section className="t-section t-dark" aria-labelledby="rf-kit-title">
        <div className="wrap cx-two">
          <div className="t-stack-lg" style={{ minWidth: 0 }}>
            <div className="t-head" style={{ marginBottom: 0 }}><span className="t-tag">Flown today with</span><h2 id="rf-kit-title">The kit over your roof.</h2></div>
            <ul className="cx-kit">
              {kitNow && <li><span className="cx-kit-icon"><KitIcon id={kitNow.id} /></span><div><b>{kitNow.name}</b><small className="t-mono">CLOSE-UP STILLS AND VIDEO</small><p>{RF_KIT_NOW.d}</p></div></li>}
            </ul>
            <div className="rf-next">
              <p className="t-mono">COMING NEXT</p>
              <ul>{RF_KIT_NEXT.map((k) => <li key={k.name}><b>{k.name}</b><span>{k.d}</span></li>)}</ul>
            </div>
            <p><Link className="text-link" href="/fleet/">See the whole fleet</Link></p>
          </div>
          <div className="t-stack-lg" style={{ minWidth: 0 }}>
            <div className="t-head" style={{ marginBottom: 0 }}><span className="t-tag">Straight answers</span><h2>What a roof check is, and isn&apos;t.</h2></div>
            <ul className="cx-comp rf-limits">{RF_LIMITS.map((l) => <li key={l}><span>{l}</span></li>)}</ul>
            <p><Link className="text-link" href="/safety/">How every flight is planned</Link></p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="t-section t-dark" aria-labelledby="rf-faq-title" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="t-head"><span className="t-tag">Questions about roof checks</span><h2 id="rf-faq-title">Before you book.</h2></div>
          <TFaq items={RF_FAQ} />
        </div>
      </section>

      <CtaBand title="Worried about your roof?" text="Send the address and what's bothering you. You'll get a fixed price and a date within a day." />
    </div>
  );
}
