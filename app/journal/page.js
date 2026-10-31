/* VIEWING ROOM — list of every post. Posts are Markdown files in /content/posts */
import Link from "next/link";
import JournalBrowser from "@/components/JournalBrowser";
import PostMedia from "@/components/PostCover";
import { Badge } from "@/components/PostCard";
import Follow from "@/components/Follow";
import SocialIcon from "@/components/SocialIcon";
import { getPostSummaries, formatDate } from "@/lib/posts";
import { liveSocials } from "@/lib/site";

export const metadata = {
  title: "Viewing Room",
  description: "Property walkthroughs, aerial photos, roof checks and practical guides for sellers, landlords and estate agents.",
  alternates: { canonical: "/journal/" },
};

export default function JournalPage() {
  const posts = getPostSummaries();
  const featured = posts.find((p) => p.featured) || posts[0];
  const followButtons = liveSocials().slice(0, 2);

  return (
    <div className="sub-page">
      <section className="log-hero" aria-labelledby="log-title">
        <div className="wrap log-hero-inner">
          <div>
            <h1 id="log-title">Viewing Room</h1>
            <p>Walkthroughs, aerials and practical guides for sellers, landlords and estate agents.</p>
          </div>
          <div className="log-hero-actions">
            {followButtons.map((s, i) => (
              <a key={s.id} className={`btn ${i === 0 ? "btn-orange" : "btn-ghost"} btn-social`} href={s.url} target="_blank" rel="noopener">
                <SocialIcon id={s.id} /> Follow on {s.name}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="log" aria-label="Posts">
        <div className="wrap">
          {featured && (
            <div id="featured">
              <Link className="featured" href={`/journal/${featured.slug}/`}>
                <div className="card-media">
                  <PostMedia post={featured} />
                  {featured.type === "video" && <Badge post={featured} />}
                </div>
                <div className="featured-body">
                  <span className="featured-flag">Featured</span>
                  <h2>{featured.title}</h2>
                  <p>{featured.excerpt}</p>
                  <span className="card-meta">{featured.category}, {formatDate(featured.date)}</span>
                </div>
              </Link>
            </div>
          )}
          <JournalBrowser posts={posts} featuredSlug={featured?.slug} />
        </div>
      </section>

      <Follow intro="New clips go up every week. Pick the platform you already scroll." />
    </div>
  );
}
