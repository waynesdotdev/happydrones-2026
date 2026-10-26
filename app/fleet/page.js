/* FLEET: every aircraft, which job it does, and what's coming next. */
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Kit from "@/components/Kit";
import CtaBand from "@/components/CtaBand";
import { KIT, SERVICE_PAGES, ROADMAP } from "@/lib/site";

export const metadata = {
  title: "The fleet",
  description: "DJI Mini 4 Pro, Neo 2, Avata 2 and Osmo Pocket 3: which aircraft flies which job, and the Mavic 4 Pro, Mavic 3 Enterprise, Matrice 4E and mirrorless camera coming next.",
  alternates: { canonical: "/fleet/" },
};

export default function Fleet() {
  const cols = KIT.filter((k) => k.status === "active");
  return (
    <div className="sub-page">
      <PageHero crumbs={[{ label: "Fleet" }]} eyebrow="Three aircraft · one pilot · growing" title="The fleet." lede="From a palm-sized drone that follows you down a hallway to an FPV drone that flies one take through the whole house. Here's what flies which job today, and what's joining next." />
      <Kit title="Pick the job. I'll pick the aircraft." showLink={false} />

      <section className="t-section t-light" aria-labelledby="matrix-title" style={{ paddingTop: "clamp(48px, 7vw, 90px)" }}>
        <div className="wrap">
          <div className="t-head"><span className="t-tag">Job by job</span><h2 id="matrix-title">Which aircraft flies which job.</h2></div>
          <div className="matrix-wrap">
            <table className="matrix">
              <caption className="visually-hidden">Aircraft used for each service</caption>
              <thead>
                <tr><th scope="col">Service</th>{cols.map((k) => <th scope="col" key={k.id}>{k.name.replace("DJI ", "")}</th>)}</tr>
              </thead>
              <tbody>
                {SERVICE_PAGES.map((s) => (
                  <tr key={s.id}>
                    <th scope="row"><Link href={`/services/${s.id}/`}>{s.title}</Link></th>
                    {s.soon
                      ? <td colSpan={cols.length} className="matrix-soon">Coming soon, with the Matrice 4E</td>
                      : cols.map((k) => <td key={k.id}>{s.kit?.includes(k.id) ? <span className="dot" aria-label="Used">●</span> : <span className="nil" aria-label="Not used">·</span>}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="t-section t-light" aria-labelledby="road-title" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="t-head"><span className="t-tag">Roadmap</span><h2 id="road-title">What&apos;s coming next.</h2><p className="t-lede">Where the business is heading, in order. Nothing here is offered until it&apos;s ready.</p></div>
          <ol className="t-roadmap">{ROADMAP.map((r) => <li key={r.title}><span className="t-mono">{r.when}</span><b>{r.title}</b><span>{r.text}</span></li>)}</ol>
        </div>
      </section>
      <CtaBand title="Not sure which aircraft you need?" text="Tell me the job. I'll tell you what I'd fly, from where, and what it costs." />
    </div>
  );
}
