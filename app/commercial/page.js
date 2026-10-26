/* COMMERCIAL: construction, mapping, film, inspections, events, business.
   The dark "ops" look, merged in from the Tomorrow UAV design. */
import Link from "next/link";
import CommercialHero from "@/components/CommercialHero";
import TodayTomorrow from "@/components/TodayTomorrow";
import MissionCard from "@/components/MissionCard";
import CtaBand from "@/components/CtaBand";
import TFaq from "@/components/TFaq";
import KitIcon from "@/components/KitIcon";
import JsonLd from "@/components/JsonLd";
import { QuoteProvider } from "@/components/QuoteContext";
import { SERVICE_PAGES, KIT, MISSION_STEPS, SITE, fromPrice } from "@/lib/site";

export const metadata = {
  title: "Commercial & construction drone services",
  description: "Construction progress records, aerial film, inspections and events across the North East, with mapping and 3D models coming soon.",
  alternates: { canonical: "/commercial/" },
};

const TICKER = ["Construction progress", "Mapping & 3D (coming soon)", "Aerial film", "Roof & building inspections", "Events & venues", "Written RAMS every mission", `${SITE.insurance.publicLiability} public liability`, "Backup date for weather", "Fixed quote within a day"];
const COMMERCIAL_FAQ = [
  { q: "Can you work on live construction sites?", a: "Yes. I bring my own insurance and RAMS, complete your induction and follow your permit-to-work process." },
  { q: "Are your maps survey-grade?", a: "Without ground control, maps and models are for planning, marketing and progress. Ground control points can be added when you need higher accuracy." },
  { q: "Who owns the footage?", a: "You get a licence to use it for your business, anywhere, for good. I may show selected work in my portfolio unless you ask me not to." },
  { q: "How does payment work?", a: "Jobs of £1,000 or more and repeat-visit contracts are invoiced on 30-day terms, per visit for ongoing programmes. Smaller one-off jobs take a 25% deposit to secure the date. Any large one-off costs, such as equipment hire or specialist permissions, are invoiced up front." },
  { q: "Why are prices shown as guides?", a: "Every site is different. The planner gives a realistic figure straight away, then I confirm a fixed price in writing before anything is booked." },
];

export default function Commercial() {
  const missions = SERVICE_PAGES.filter((s) => s.group === "commercial");
  const heavy = KIT.filter((k) => k.tier === "heavy" || k.tier === "flagship");
  const liveCount = missions.filter((s) => !s.soon).length;
  const WORDS = ["None", "One", "Two", "Three", "Four", "Five", "Six", "Seven"];
  const schema = { "@context": "https://schema.org", "@graph": missions.filter((s) => !s.soon).map((s) => ({ "@type": "Service", name: s.title, description: s.lede, areaServed: SITE.areaServed, provider: { "@type": "LocalBusiness", name: SITE.name, url: SITE.url }, offers: { "@type": "Offer", price: fromPrice(s), priceCurrency: "GBP" } })) };
  return (
    <QuoteProvider>
      <JsonLd data={schema} />
      <div className="t-dark">
        <CommercialHero />
        <div className="t-ticker" aria-label="Commercial services at a glance">
          <div className="t-ticker-track">{[...TICKER, ...TICKER].map((t, i) => <span key={i} aria-hidden={i >= TICKER.length ? "true" : undefined}>{t}</span>)}</div>
        </div>

        <section className="t-section" id="missions" aria-labelledby="m-title">
          <div className="wrap">
            <div className="t-head t-split">
              <div className="t-stack"><span className="t-tag">Commercial services</span><h2 id="m-title">{WORDS[liveCount] || liveCount} missions. Each one planned like it matters.</h2></div>
              <p className="t-lede">From a monthly record of a twelve-storey build to a measured roof inspection. Pick the closest match and the planner prices it in seconds.</p>
            </div>
            <div className="t-svc-grid">{missions.map((s) => <MissionCard key={s.id} s={s} />)}</div>
          </div>
        </section>
      </div>

      <section className="t-section t-light" aria-labelledby="heavy-title">
        <div className="wrap t-stack-lg">
          <div className="t-head t-split" style={{ marginBottom: 0 }}>
            <div className="t-stack"><span className="t-tag">Where we&apos;re heading</span><h2 id="heavy-title">Heavier aircraft are on the way.</h2></div>
            <p className="t-lede">Wind on an exposed site, a map that needs measuring, a launch film that needs a cinema camera. These three are the next aircraft joining the fleet. They&apos;re not offered until they arrive.</p>
          </div>
          <div className="t-facts">
            {heavy.map((k) => (
              <div className="t-fact" key={k.id}>
                <span className="heavy-icon" aria-hidden="true"><KitIcon id={k.id} /></span>
                <span className="t-mono" style={{ color: "var(--orange-deep)" }}>{k.status === "soon" ? "COMING SOON" : "IN THE FLEET"}</span>
                <b style={{ fontSize: "1.6rem" }}>{k.name}</b>
                <span className="t-mono" style={{ color: "var(--orange-deep)" }}>{k.spec}</span>
                <span>{k.text}</span>
              </div>
            ))}
          </div>
          <p><Link className="text-link" href="/fleet/">See the whole fleet</Link></p>
        </div>
      </section>

      <TodayTomorrow />

      <section className="t-section t-dark" aria-labelledby="proc-title" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="t-head t-split">
            <div className="t-stack"><span className="t-tag">How a mission runs</span><h2 id="proc-title">From brief to delivery in four moves.</h2></div>
            <p className="t-lede">Every mission follows the same flight plan, so nothing is left to the day. <Link href="/safety/" style={{ color: "var(--t-accent-hi)" }}>How I keep it safe and legal</Link>.</p>
          </div>
          <ol className="t-process">{MISSION_STEPS.map((p) => (<li key={p.t}><span className="t-mono">{p.tag}</span><h3>{p.t}</h3><p>{p.d}</p></li>))}</ol>
        </div>
      </section>

      <section className="t-section t-light" aria-labelledby="cfaq-title">
        <div className="wrap" style={{ maxWidth: 980 }}>
          <div className="t-head"><span className="t-tag">Straight answers</span><h2 id="cfaq-title">Before you book.</h2></div>
          <TFaq items={COMMERCIAL_FAQ} />
        </div>
      </section>

      <CtaBand />
    </QuoteProvider>
  );
}
