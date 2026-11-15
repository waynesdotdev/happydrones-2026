"use client";
/* When a view inside a page changes (account tabs, sign-in steps, playground
   stages), bring its top back on screen if the visitor had scrolled past it. */
import { useEffect, useRef } from "react";

export default function useScrollToTop(dep) {
  const ref = useRef(null);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    const el = ref.current; if (!el) return;
    const top = el.getBoundingClientRect().top;
    if (top < 80 || top > innerHeight * 0.6) {
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
      scrollTo({ top: Math.max(0, top + scrollY - 100), behavior: reduce ? "auto" : "smooth" });
    }
  }, [dep]);
  return ref;
}
