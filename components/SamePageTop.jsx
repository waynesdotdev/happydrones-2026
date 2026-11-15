"use client";
/* Clicking a link to the page you're already on goes back to the top,
   instead of doing nothing while you sit at the footer. */
import { useEffect } from "react";

export default function SamePageTop() {
  useEffect(() => {
    const onClick = (e) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest?.("a[href]"); if (!a || a.target === "_blank") return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.hash) return;
      const norm = (p) => p.replace(/\/+$/, "") || "/";
      if (norm(url.pathname) === norm(location.pathname) && url.search === location.search) scrollTo({ top: 0, behavior: "smooth" });
    };
    document.addEventListener("click", onClick, true); // capture: runs before Next's link handler
    return () => document.removeEventListener("click", onClick, true);
  }, []);
  return null;
}
