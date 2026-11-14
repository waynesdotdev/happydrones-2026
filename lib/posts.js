/* =========================================================
   Reads the journal posts in /content/posts at build time.
   You don't need to edit this file to add posts.
   ========================================================= */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import { youtubeId } from "./youtube";

export { youtubeId };

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

function toDateString(d) {
  if (d instanceof Date) return d.toISOString().slice(0, 10);
  return String(d || "").slice(0, 10);
}

function readPost(file) {
  const slug = file.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
  const { data, content } = matter(raw);
  const words = content.split(/\s+/).filter(Boolean).length;
  const yt = youtubeId(data.youtube);

  return {
    slug,
    title: data.title || slug,
    date: toDateString(data.date),
    type: data.type === "video" ? "video" : "article",
    category: data.category || "Journal",
    excerpt: data.excerpt || "",
    youtubeId: yt,
    cover: data.cover || "",
    service: data.service || "showcase",
    featured: Boolean(data.featured),
    draft: Boolean(data.draft),
    minutes: Math.max(1, Math.round(words / 200)),
    markdown: content,
  };
}

/** Every published post, newest first (posts with draft: true are skipped) */
export function getAllPosts() {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_")) // files starting with _ are ignored
    .map(readPost)
    .filter((p) => !p.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
}

/** One post, with its Markdown turned into HTML */
export function getPost(slug) {
  const post = getAllPosts().find((p) => p.slug === slug);
  if (!post) return null;
  return { ...post, html: newTabLinks(marked.parse(post.markdown)) };
}

/* Links that open in a new tab, so readers can keep reading the post:
   the booking agreement (/terms) and any link to another website. */
function newTabLinks(html) {
  return html.replace(/<a href="((?:\/terms\b|https?:\/\/)[^"]*)"/g, '<a href="$1" target="_blank" rel="noopener"');
}

/** Lightweight version for lists (no body text) */
export function getPostSummaries() {
  return getAllPosts().map(({ markdown, ...rest }) => ({
    ...rest,
    searchText: (rest.title + " " + rest.excerpt + " " + rest.category + " " + markdown).toLowerCase(),
  }));
}

/** The best image for sharing on social media */
export function shareImage(post) {
  if (post.cover) return post.cover;
  if (post.youtubeId) return `https://i.ytimg.com/vi/${post.youtubeId}/hqdefault.jpg`;
  return "/og.png";
}

export function formatDate(d) {
  return new Date(d + "T12:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

/* ---- Drafts waiting for Wayne's approval (draft: true) ----
   Shown only on the private /drafts page so they can be read before
   going live. To publish one: set draft: false (and the date to the
   day it goes live). */
export function getDrafts() {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .map(readPost)
    .filter((p) => p.draft)
    .sort((a, b) => a.date.localeCompare(b.date));
}
export function getDraft(slug) {
  const post = getDrafts().find((p) => p.slug === slug);
  return post ? { ...post, html: newTabLinks(marked.parse(post.markdown)) } : null;
}
