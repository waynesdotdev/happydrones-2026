/* Turn any YouTube link (watch, youtu.be, shorts, embed) or a plain ID into the 11-character video ID. */
export function youtubeId(value) {
  if (!value) return null;
  const v = String(value).trim();
  if (/^[\w-]{11}$/.test(v)) return v;
  try {
    const u = new URL(v);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1, 12) || null;
    if (u.searchParams.get("v")) return u.searchParams.get("v");
    const m = u.pathname.match(/\/(shorts|embed|live)\/([\w-]{11})/);
    return m ? m[2] : null;
  } catch {
    return null;
  }
}
