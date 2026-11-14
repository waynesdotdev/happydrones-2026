/* DRAFTS: blog posts waiting for Wayne's approval (draft: true in content/posts).
   Private: not linked anywhere, noindex. Tell Claude "approve <title>" to publish one. */
import Link from "next/link";
import { getDrafts } from "@/lib/posts";

export const metadata = { title: "Drafts", robots: { index: false, follow: false, nocache: true } };
const longDate = (d) => new Date(`${d}T12:00:00Z`).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });

export default function Drafts() {
  const drafts = getDrafts();
  return (
    <div className="sub-page">
      <section className="t-section t-dark" style={{ paddingTop: "clamp(48px, 7vw, 96px)" }}>
        <div className="wrap dr">
          <p className="t-mono dr-kicker">Private · not on the site yet</p>
          <h1 className="dr-title">Drafts waiting for approval</h1>
          <p className="t-lede">Read each one, then tell Claude &ldquo;approve&rdquo; with the title (or what to change). The planned date is when it would go live.</p>
          <ol className="dr-list">
            {drafts.map((d) => (
              <li key={d.slug}>
                <Link href={`/drafts/${d.slug}/`}><b>{d.title}</b><span>{d.excerpt}</span></Link>
                <span className="dr-meta"><span className="dr-badge">Waiting for approval</span>Planned {longDate(d.date)} · {d.minutes} min read</span>
              </li>
            ))}
          </ol>
          {drafts.length === 0 && <p className="t-lede">No drafts waiting.</p>}
        </div>
      </section>
    </div>
  );
}
