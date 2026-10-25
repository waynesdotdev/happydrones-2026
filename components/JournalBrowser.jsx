"use client";
/* Viewing Room filters and search. The buttons are made from your post categories. */
import { useEffect, useMemo, useState } from "react";
import PostCard from "./PostCard";

export default function JournalBrowser({ posts, featuredSlug }) {
  const [current, setCurrent] = useState("all");
  const [query, setQuery] = useState("");

  const options = useMemo(() => {
    const cats = [...new Set(posts.map((p) => p.category))];
    return [
      { key: "all", label: "All", test: () => true },
      { key: "video", label: "Videos", test: (p) => p.type === "video" },
      ...cats.map((c) => ({ key: c, label: c, test: (p) => p.category === c })),
    ];
  }, [posts]);

  // Links like /journal/?cat=Guides open that filter
  useEffect(() => {
    const cat = new URLSearchParams(window.location.search).get("cat");
    if (cat && options.some((o) => o.key === cat)) setCurrent(cat);
  }, [options]);

  // Hide the featured post at the top while filtering or searching
  const filtering = current !== "all" || query.trim() !== "";
  useEffect(() => {
    const box = document.getElementById("featured");
    if (box) box.hidden = filtering;
  }, [filtering]);

  const choose = (key) => {
    setCurrent(key);
    const u = new URL(window.location.href);
    key === "all" ? u.searchParams.delete("cat") : u.searchParams.set("cat", key);
    window.history.replaceState(null, "", u);
  };

  const q = query.trim().toLowerCase();
  const opt = options.find((o) => o.key === current) || options[0];
  const shown = posts
    .filter((p) => filtering || p.slug !== featuredSlug)
    .filter(opt.test)
    .filter((p) => !q || p.searchText.includes(q));

  return (
    <>
      <div className="log-tools">
        <div className="filters" role="group" aria-label="Filter posts">
          {options.map((o) => (
            <button key={o.key} type="button" aria-pressed={o.key === current} onClick={() => choose(o.key)}>
              {o.label}<small>{posts.filter(o.test).length}</small>
            </button>
          ))}
        </div>
        <label className="search">
          <span className="visually-hidden">Search the Viewing Room</span>
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
          <input type="search" placeholder="Search posts" autoComplete="off" value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
      </div>

      {shown.length ? (
        <div className="cards">{shown.map((p) => <PostCard key={p.slug} post={p} />)}</div>
      ) : (
        <div className="empty">
          <p>{q ? `No posts match "${query.trim()}".` : "No posts here yet. Check back soon."}</p>
          <button className="btn btn-navy btn-small" type="button" onClick={() => { setQuery(""); choose("all"); }}>
            Show all posts
          </button>
        </div>
      )}
    </>
  );
}
