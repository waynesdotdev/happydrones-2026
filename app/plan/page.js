/* PLAN A MISSION: commercial guide prices (homes use the quote builder on the homepage) */
import Link from "next/link";
import PageHero from "@/components/PageHero";
import MissionPlanner from "@/components/MissionPlanner";
import TFaq from "@/components/TFaq";

export const metadata = {
  title: "Plan a commercial mission",
  description: "Build a commercial drone mission in six steps and see a guide price instantly. Fixed quote and written flight plan within a day.",
  alternates: { canonical: "/plan/" },
};

const FAQ = [
  { q: "Selling or letting a home?", a: "Use the property quote builder on the homepage instead. It's set up for listings and gives a fixed price straight away." },
  { q: "Why is it a guide price?", a: "Every site is different. I check the airspace and access, then confirm a fixed price and a written flight plan within a day." },
  { q: "How far do you travel?", a: "Travel is included across NE, SR, DH, TS and DL postcodes. Nearby areas have a small travel fee; anywhere else is quoted." },
  { q: "What about bad weather?", a: "Every booking has a backup date. If the forecast fails the minimums, your mission moves for free." },
];

export default function Plan() {
  return (
    <div className="sub-page">
      <PageHero small crumbs={[{ label: "Commercial", href: "/commercial/" }, { label: "Plan a mission" }]} eyebrow="Mission planner" title="Build your flight plan." lede="Six quick choices give you a guide price straight away. Send it, and I reply within a day with a fixed quote and a written plan.">
        <p style={{ fontSize: "1rem" }}>Selling a home? <Link href="/#quote" style={{ color: "#FF915F" }}>Use the property quote builder</Link>.</p>
      </PageHero>
      <section className="t-section t-dark" style={{ paddingTop: "clamp(40px, 6vw, 72px)" }}>
        <div className="wrap"><MissionPlanner /></div>
      </section>
      <section className="t-section t-light">
        <div className="wrap" style={{ maxWidth: 980 }}>
          <div className="t-head"><span className="t-tag">Before you send</span><h2>Good to know.</h2></div>
          <TFaq items={FAQ} />
        </div>
      </section>
    </div>
  );
}
