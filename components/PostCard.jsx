/* One post in a grid: picture, badge, category, title, summary, date. */
import Link from "next/link";
import PostMedia from "./PostCover";

const dateText = (d) => new Date(d + "T12:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

export function Badge({ post }) {
  return post.type === "video" ? (
    <span className="card-badge is-video">
      <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 1.5v9l7-4.5z" /></svg> Video
    </span>
  ) : (
    <span className="card-badge">{post.minutes} min read</span>
  );
}

export default function PostCard({ post }) {
  return (
    <Link className="card" href={`/journal/${post.slug}/`}>
      <div className="card-media">
        <PostMedia post={post} />
        <Badge post={post} />
      </div>
      <span className="card-cat">{post.category}</span>
      <h3>{post.title}</h3>
      <p>{post.excerpt}</p>
      <span className="card-meta">{dateText(post.date)}</span>
    </Link>
  );
}
