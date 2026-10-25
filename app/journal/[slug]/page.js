/* ONE POST — built as its own HTML page for every file in /content/posts,
   with its own title, description, share image and Google data. */
import Link from "next/link";
import { notFound } from "next/navigation";
import PostMedia from "@/components/PostCover";
import PostCard from "@/components/PostCard";
import VideoEmbed from "@/components/VideoEmbed";
import ShareButtons from "@/components/ShareButtons";
import Follow from "@/components/Follow";
import JsonLd from "@/components/JsonLd";
import { getAllPosts, getPost, getPostSummaries, shareImage, formatDate } from "@/lib/posts";
import { PRICING, SITE, money } from "@/lib/site";

// Only the posts that exist get pages (needed for a static site)
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const image = shareImage(post);
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/journal/${post.slug}/` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `/journal/${post.slug}/`,
      publishedTime: post.date,
      section: post.category,
      images: [{ url: image }],
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.excerpt, images: [image] },
  };
}

export default async function PostPage({ params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const url = `${SITE.url}/journal/${post.slug}/`;
  const svc = PRICING.services.find((s) => s.id === post.service) || PRICING.services[0];
  const all = getPostSummaries();
  const related = [
    ...all.filter((p) => p.slug !== post.slug && p.category === post.category),
    ...all.filter((p) => p.slug !== post.slug && p.category !== post.category),
  ].slice(0, 3);

  // Google data: an article, plus a video if there is one
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    image: new URL(shareImage(post), SITE.url).toString(),
    url,
    mainEntityOfPage: url,
    author: { "@type": "Organization", name: SITE.name, url: SITE.url },
    publisher: { "@type": "Organization", name: SITE.name, logo: { "@type": "ImageObject", url: `${SITE.url}/logo.png` } },
    ...(post.youtubeId && {
      video: {
        "@type": "VideoObject",
        name: post.title,
        description: post.excerpt,
        uploadDate: post.date,
        thumbnailUrl: `https://i.ytimg.com/vi/${post.youtubeId}/hqdefault.jpg`,
        embedUrl: `https://www.youtube-nocookie.com/embed/${post.youtubeId}`,
      },
    }),
  };

  return (
    <div className="sub-page">
      <JsonLd data={schema} />
      <article className="post">
        <header className="post-head">
          <div className="wrap">
            <Link className="post-back" href="/journal/">← Viewing Room</Link><br />
            <span className="post-cat">{post.category}</span>
            <h1>{post.title}</h1>
            <p className="post-meta">
              <time dateTime={post.date}>{formatDate(post.date)}</time>, {post.type === "video" ? "video" : `${post.minutes} min read`}
            </p>
          </div>
        </header>
        <div className="post-dark-band" aria-hidden="true"></div>

        <div className="post-media">
          {post.youtubeId ? (
            <VideoEmbed id={post.youtubeId} title={post.title} />
          ) : (
            <div className="post-media-inner">
              <PostMedia post={post} />
              {post.type === "video" && <span className="soon">Video coming soon</span>}
            </div>
          )}
        </div>

        <div className="post-body">
          <div className="prose" dangerouslySetInnerHTML={{ __html: post.html }} />
          <ShareButtons url={url} title={post.title} text={post.excerpt} />
          <aside className="post-cta">
            <div>
              <h2>Want something like this?</h2>
              <p>{svc.name} filming starts from {money(svc.base)}. See your price in under a minute.</p>
            </div>
            <Link className="btn btn-orange" href={`/?service=${svc.id}#quote`}>Get my quote</Link>
          </aside>
        </div>
      </article>

      {related.length > 0 && (
        <section className="related" aria-labelledby="related-title">
          <div className="wrap">
            <h2 id="related-title" className="section-title">More from the Viewing Room</h2>
            <div className="cards">{related.map((p) => <PostCard key={p.slug} post={p} />)}</div>
          </div>
        </section>
      )}

      <Follow intro="" />
    </div>
  );
}
