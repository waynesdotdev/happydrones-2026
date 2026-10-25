"use client";
/* Share buttons under each post. */
import { useEffect, useState } from "react";

export default function ShareButtons({ url, title, text }) {
  const [canShare, setCanShare] = useState(false);
  const [copied, setCopied] = useState("Copy link");
  useEffect(() => setCanShare(typeof navigator !== "undefined" && !!navigator.share), []);

  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);

  const copy = async () => {
    try { await navigator.clipboard.writeText(url); setCopied("Link copied"); }
    catch { setCopied("Copy the address bar"); }
    setTimeout(() => setCopied("Copy link"), 2200);
  };

  return (
    <div className="share">
      <span>Share</span>
      {canShare && (
        <button type="button" onClick={() => navigator.share({ title, text, url }).catch(() => {})}>Share…</button>
      )}
      <a href={`https://wa.me/?text=${t}%20${u}`} target="_blank" rel="noopener">WhatsApp</a>
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${u}`} target="_blank" rel="noopener">Facebook</a>
      <a href={`https://x.com/intent/post?text=${t}&url=${u}`} target="_blank" rel="noopener">X</a>
      <button type="button" onClick={copy}>{copied}</button>
    </div>
  );
}
