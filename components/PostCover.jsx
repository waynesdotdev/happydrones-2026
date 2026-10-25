/* The automatic map-style cover for posts that don't have a photo.
   Every post gets its own drawing, based on its file name. */
export function coverSvg(slug) {
  let seed = 0;
  for (const ch of slug) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
  const R = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  const cx = 120 + R() * 160, cy = 70 + R() * 110;
  let rings = "";
  for (let i = 1; i <= 9; i++) {
    const r = i * 26, pts = [];
    for (let a = 0; a < 24; a++) {
      const ang = (a / 24) * Math.PI * 2;
      const wob = 1 + (Math.sin(ang * 3 + (seed % 7)) * 0.08 + (R() - 0.5) * 0.08);
      pts.push(`${(cx + Math.cos(ang) * r * wob * 1.3).toFixed(1)},${(cy + Math.sin(ang) * r * wob).toFixed(1)}`);
    }
    const hi = i === 3;
    rings += `<polygon points="${pts.join(" ")}" fill="none" stroke="${hi ? "#FF6B35" : "#3D6E9E"}" stroke-width="${hi ? 2.5 : 1.5}" stroke-linejoin="round" opacity="${hi ? 1 : 0.7}"/>`;
  }
  const grid = `<path d="M0 60h400M0 120h400M0 180h400M80 0v250M160 0v250M240 0v250M320 0v250" stroke="#0B3E6B" stroke-width="1"/>`;
  const mark = `<g transform="translate(${cx.toFixed(1)} ${cy.toFixed(1)})"><circle r="16" fill="#FF6B35" opacity=".25"/><circle r="6" fill="#FF6B35" stroke="#fff" stroke-width="2"/></g>`;
  return `<svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="400" height="250" fill="#002A54"/>${grid}${rings}${mark}</svg>`;
}

/* Cover picture for a post: your photo, the YouTube thumbnail, or the map drawing */
export default function PostMedia({ post }) {
  if (post.cover) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={post.cover} alt="" loading="lazy" />;
  }
  if (post.youtubeId) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={`https://i.ytimg.com/vi/${post.youtubeId}/hqdefault.jpg`} alt="" loading="lazy" />;
  }
  return <span className="cover-art" dangerouslySetInnerHTML={{ __html: coverSvg(post.slug) }} />;
}
