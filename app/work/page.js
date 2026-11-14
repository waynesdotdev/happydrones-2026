/* REAL JOBS: before-and-after gallery. Jobs live in WORK in lib/gallery.js.
   Hidden from Google and the menu until the first job is added. */
import Link from "next/link";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import BeforeAfter from "@/components/tools/BeforeAfter";
import { WORK } from "@/lib/gallery";

export const metadata = {
  title: "Real jobs: before and after",
  description: "Before-and-after photos from real Happy Drones jobs across Teesside and the North East.",
  alternates: { canonical: "/work/" },
  ...(WORK.length ? {} : { robots: { index: false, follow: true } }),
};

const longDate = (d) => new Date(`${d}T12:00:00Z`).toLocaleDateString("en-GB", { month: "long", year: "numeric" });

export default function WorkPage() {
  return (
    <div className="sub-page">
      <PageHero small crumbs={[{ label: "Real jobs" }]} eyebrow="Before and after" title="Real jobs, from above." lede="Drag across each photo to see the before and after. Every job here is shared with the customer's permission." />
      <section className="t-section t-dark" style={{ paddingTop: "clamp(32px, 5vw, 56px)" }}>
        <div className="wrap">
          {WORK.length === 0 ? (
            <div className="work-empty">
              <p>The first jobs are being added. In the meantime, see what a job looks like:</p>
              <ul>
                <li><Link href="/report/example/">An example online roof report</Link></li>
                <li><Link href="/services/before-after-pack/">The before-and-after pack for trades</Link></li>
                <li><Link href="/construction/">Construction progress, month by month</Link></li>
              </ul>
            </div>
          ) : (
            <div className="work-grid">
              {WORK.map((w) => (
                <figure className="work-item" key={w.id}>
                  <BeforeAfter before={w.before} after={w.after} alt={w.title} />
                  <figcaption><b>{w.title}</b><span className="t-mono">{w.service} · {longDate(w.date)}</span>{w.caption && <p>{w.caption}</p>}{w.credit && <small>{w.credit}</small>}</figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>
      </section>
      <CtaBand title="Want a job like this?" text="Tell me what you need and get a guide price in under a minute." />
    </div>
  );
}
