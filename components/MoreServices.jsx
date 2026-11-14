/* "More services" cards for a page: the newer services from
   lib/extraServices.js whose "page" matches (roofs, construction,
   property, or "all"). Coming-soon ones are shown last, marked as such.
   Each card links to /services/<id>/. */
import MissionCard from "./MissionCard";
import { EXTRA_SERVICES, extrasFor } from "@/lib/extraServices";

export default function MoreServices({ page, title = "More services", lede }) {
  const list = (page === "all" ? [...EXTRA_SERVICES] : extrasFor(page)).sort((a, b) => Number(!!a.soon) - Number(!!b.soon));
  if (!list.length) return null;
  return (
    <section className="t-section t-dark more-svc" aria-labelledby={`more-${page}`}>
      <div className="wrap">
        <div className="t-head">
          <span className="t-tag">New</span>
          <h2 id={`more-${page}`} className="t-sub" style={{ marginTop: 10 }}>{title}</h2>
          {lede && <p className="t-lede" style={{ marginTop: 8 }}>{lede}</p>}
        </div>
        <div className="t-svc-grid">{list.map((s) => <MissionCard key={s.id} s={s} />)}</div>
      </div>
    </section>
  );
}
