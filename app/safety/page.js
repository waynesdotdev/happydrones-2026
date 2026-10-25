/* SAFETY & COMPLIANCE */
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import { Shield, Radar, Doc, Pound, Eye, Wind } from "@/components/TIcons";
import { SAFETY, SITE } from "@/lib/site";

export const metadata = {
  title: "Safety & compliance",
  description: "CAA registered, insured, airspace checked and risk assessed for every flight. How Happy Drones keeps homes, sites and people safe.",
  alternates: { canonical: "/safety/" },
};

const ICONS = [Shield, Radar, Doc, Pound, Eye, Wind];
const PREFLIGHT = [
  "Airspace and restrictions checked, and NOTAMs on the day",
  "Landowner or homeowner permission confirmed",
  "Site induction and permit-to-work completed on construction sites",
  "Take-off and landing zone set and kept clear",
  "Wind, rain and visibility within the minimums for that aircraft",
  "Batteries, propellers and firmware checked",
  "The right aircraft and category for how close we'll be to people",
];

export default function Safety() {
  return (
    <div className="sub-page">
      <PageHero small crumbs={[{ label: "Safety" }]} eyebrow="Compliance" title="Flown legally. Planned in writing. Insured." lede="Homeowners, site managers and insurers all ask. Here's the answer, before they do." />
      <section className="t-section t-dark">
        <div className="wrap">
          <div className="t-safety">
            {SAFETY.map((s, i) => { const I = ICONS[i % ICONS.length]; return <div key={s.t}><I /><h3>{s.t}</h3><p>{s.d}</p></div>; })}
          </div>
        </div>
      </section>
      <section className="t-section t-light">
        <div className="wrap t-about">
          <div className="t-stack">
            <span className="t-tag">Pre-flight</span>
            <h2 style={{ fontSize: "var(--t-s3)" }}>Before every flight.</h2>
            <p className="t-lede">The same checklist every time, recorded in the flight log. Ask for a copy of the RAMS and insurance certificates with your quote.</p>
            <p className="t-lede">Credentials: {SITE.credentials.join(" · ")}.</p>
          </div>
          <ul className="t-checks">{PREFLIGHT.map((p) => <li key={p}>{p}</li>)}</ul>
        </div>
      </section>
      <CtaBand title="Need the paperwork first?" text="Insurance certificates and a sample RAMS come with every commercial quote." />
    </div>
  );
}
