/* ONLINE ROOF REPORT: happydrones.co.uk/report/<id>/
   A shareable web version of a roof check's numbered photo pack.
   Data: content/reports/<id>.json, photos in public/reports/<id>/.
   Private: noindex, not in the sitemap, not linked from the site. */
import { notFound } from "next/navigation";
import Link from "next/link";
import { getReports, getReport } from "@/lib/reports";
import { SITE } from "@/lib/site";
import ReportPhotos from "@/components/tools/ReportPhotos";

export const dynamicParams = false;
export function generateStaticParams() {
  const r = getReports();
  return r.length ? r.map((x) => ({ id: x.id })) : [{ id: "none" }];
}

export async function generateMetadata({ params }) {
  const { id } = await params; const r = getReport(id);
  return { title: r ? `${r.title}: ${r.place}` : "Report", robots: { index: false, follow: false, nocache: true } };
}

const longDate = (d) => new Date(`${d}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

export default async function Report({ params }) {
  const { id } = await params; const r = getReport(id);
  if (!r) notFound();
  return (
    <div className="sub-page rp">
      <section className="t-section t-dark rp-head">
        <div className="wrap">
          {r.example && <p className="rp-example">Example report. A real one has your photos, and only you get the link.</p>}
          <p className="t-mono rp-kicker">{r.title} · {longDate(r.date)}</p>
          <h1 className="rp-title">{r.place}</h1>
          {r.client && <p className="rp-client">Prepared for {r.client}</p>}
          <p className="rp-summary">{r.summary}</p>
          <div className="rp-meta">
            <span><b>{r.photos.length}</b> numbered photos</span>
            <span>Flown by {SITE.owner || "Wayne Fox"}, {SITE.name}</span>
            {r.download && <a className="t-btn t-btn-primary" href={r.download} target="_blank" rel="noopener">Download all files</a>}
          </div>
        </div>
      </section>
      <section className="t-section t-dark" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <ReportPhotos report={r} />
          <div className="rp-note">
            <p><b>What this report is.</b> Photos of what&apos;s visible from the air, numbered and marked on the overview. It isn&apos;t a survey and doesn&apos;t diagnose faults: send it to a roofer or surveyor to assess.</p>
            <p>Questions about the photos? <Link href="/#contact">Get in touch</Link>, or reply to the message the link came in.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
