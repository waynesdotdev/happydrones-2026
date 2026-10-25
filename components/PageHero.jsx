/* Navy page header used on inner pages: breadcrumb, eyebrow, big title, intro. */
import Link from "next/link";

export default function PageHero({ crumbs = [], eyebrow, title, lede, children, small = false }) {
  return (
    <section className={`page-hero${small ? " page-hero-small" : ""}`}>
      <div className="page-hero-frame" aria-hidden="true">
        <span className="corner tl"></span><span className="corner tr"></span><span className="corner bl"></span><span className="corner br"></span>
      </div>
      <div className="wrap">
        {crumbs.length > 0 && (
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            {crumbs.map((c) => (
              <span key={c.label}><span aria-hidden="true"> / </span>{c.href ? <Link href={c.href}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}</span>
            ))}
          </nav>
        )}
        {eyebrow && <p className="page-eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {lede && <p>{lede}</p>}
        {children}
      </div>
    </section>
  );
}
