/* One draft blog post, for approval. Looks the same as the live post will.
   Private: noindex, not linked. */
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDrafts, getDraft } from "@/lib/posts";

export const dynamicParams = false;
export function generateStaticParams() {
  const d = getDrafts();
  return d.length ? d.map((p) => ({ slug: p.slug })) : [{ slug: "none" }];
}
export const metadata = { title: "Draft", robots: { index: false, follow: false, nocache: true } };

export default async function Draft({ params }) {
  const { slug } = await params; const p = getDraft(slug);
  if (!p) notFound();
  return (
    <div className="sub-page">
      <article className="post">
        <header className="post-head">
          <div className="wrap">
            <p className="dr-banner">Draft, waiting for your approval. Not on the site yet. <Link href="/drafts/">All drafts</Link></p>
            <span className="post-cat">{p.category}</span>
            <h1>{p.title}</h1>
            <p className="post-meta">Planned for {new Date(`${p.date}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}, {p.minutes} min read</p>
          </div>
        </header>
        <div className="post-dark-band" aria-hidden="true"></div>
        <div className="post-body">
          <p className="dr-excerpt"><b>Summary on the card:</b> {p.excerpt}</p>
          <div className="prose" dangerouslySetInnerHTML={{ __html: p.html }} />
        </div>
      </article>
    </div>
  );
}
