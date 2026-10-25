/* One page per service: /services/<id>/  (content from SERVICE_PAGES in lib/site.js) */
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import MissionCard from "@/components/MissionCard";
import CtaBand from "@/components/CtaBand";
import TFaq from "@/components/TFaq";
import JsonLd from "@/components/JsonLd";
import KitIcon from "@/components/KitIcon";
import { Arrow } from "@/components/TIcons";
import { SERVICE_PAGES, SITE, serviceById, money, fromPrice, kitById, whatsappLink } from "@/lib/site";

export const dynamicParams = false;
export function generateStaticParams() { return SERVICE_PAGES.map((s) => ({ slug: s.id })); }

export async function generateMetadata({ params }) {
  const { slug } = await params; const s = serviceById(slug);
  if (!s) return {};
  return { title: s.title, description: `${s.lede} From ${money(fromPrice(s))}. Across the North East.`, alternates: { canonical: `/services/${s.id}/` } };
}

export default async function ServiceDetail({ params }) {
  const { slug } = await params; const s = serviceById(slug);
  if (!s) notFound();
  const homes = s.group === "homes";
  const priceHref = homes ? `/?service=${s.quote}#quote` : `/plan/?mission=${s.id}`;
  const others = SERVICE_PAGES.filter((x) => x.group === s.group && x.id !== s.id).slice(0, 3);
  const kit = (s.kit || []).map(kitById).filter(Boolean);
  const schema = [
    { "@context": "https://schema.org", "@type": "Service", name: s.title, description: s.lede, areaServed: SITE.areaServed, provider: { "@type": "LocalBusiness", name: SITE.name, url: SITE.url }, offers: { "@type": "Offer", price: fromPrice(s), priceCurrency: "GBP" } },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: s.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ];
  return (
    <div className="sub-page">
      <JsonLd data={schema} />
      <PageHero small crumbs={[{ label: "Services", href: "/services/" }, { label: s.title }]} eyebrow={`${homes ? "Homes" : "Commercial"} · ${s.code} · ALT ${s.alt} m`} title={s.hero} lede={s.lede}>
        <ul className="t-chips" aria-label="Who it's for">{s.forWho.map((w) => <li key={w}>{w}</li>)}</ul>
      </PageHero>
      <section className="t-section t-dark" style={{ paddingTop: "clamp(40px, 6vw, 72px)" }}>
        <div className="wrap t-sd">
          <div className="t-stack-lg" style={{ minWidth: 0 }}>
            <div className="t-stack">
              <h2 className="t-sub">What you get</h2>
              <ol className="t-checklist">{s.gets.map((g, i) => <li key={g}><span className="t-mono">{s.code}-{String(i + 1).padStart(2, "0")}</span><span>{g}</span></li>)}</ol>
            </div>
            <div className="t-stack">
              <h2 className="t-sub">Why it works</h2>
              <div className="t-why">{s.why.map((w) => <div key={w.t}><h3>{w.t}</h3><p>{w.d}</p></div>)}</div>
            </div>
            {kit.length > 0 && (
              <div className="t-stack">
                <h2 className="t-sub">Flown with</h2>
                <div className="flown">{kit.map((k) => <Link key={k.id} href="/fleet/" className="flown-item"><span className="flown-icon"><KitIcon id={k.id} /></span><span><b>{k.name}</b><small>{k.role}</small></span></Link>)}</div>
              </div>
            )}
            <div className="t-stack">
              <h2 className="t-sub">Questions</h2>
              <TFaq items={s.faq} />
            </div>
          </div>
          <aside className="t-spec t-frame" aria-label="Service spec">
            <span className="t-tag">{homes ? "Fixed price" : "Mission spec"}</span>
            <div className="t-spec-price">{money(fromPrice(s))}<small>FROM{s.fromLabel ? " · PER VISIT" : ""}{homes ? "" : " · GUIDE PRICE"}</small></div>
            {s.facts.map(([k, v]) => <div className="t-spec-row" key={k}><span>{k}</span><span>{v}</span></div>)}
            <div className="t-spec-row"><span>Area</span><span>{SITE.areaServed}</span></div>
            <Link className="t-btn t-btn-primary t-btn-block" href={priceHref}>{homes ? "Get my price" : "Price this mission"} <Arrow /></Link>
            {SITE.whatsapp && <a className="t-btn t-btn-ghost t-btn-block" href={whatsappLink(`Hi Happy Drones, I'd like to ask about ${s.title.toLowerCase()}.`)} target="_blank" rel="noopener">Ask on WhatsApp</a>}
            {s.know && <p className="t-pc-note">{s.know}</p>}
          </aside>
        </div>
      </section>
      {others.length > 0 && (
        <section className="t-section t-dark" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="t-head"><span className="t-tag">More {homes ? "for homes" : "commercial services"}</span></div>
            <div className="t-svc-grid">{others.map((o) => <MissionCard key={o.id} s={o} />)}</div>
          </div>
        </section>
      )}
      <CtaBand title={homes ? "Ready to list it?" : "Tell me what you're building."} text={homes ? "Build your fixed price on the homepage in under a minute." : "Get a guide price in under a minute, then a fixed quote and flight plan within a day."} />
    </div>
  );
}
