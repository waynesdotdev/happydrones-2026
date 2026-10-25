/* Shown for any address that doesn't exist (saved as 404.html, which Netlify uses automatically). */
import Link from "next/link";

export const metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <div className="sub-page">
      <section className="simple">
        <div className="wrap simple-inner">
          <h1 className="section-title">Lost signal.</h1>
          <p>This page doesn&apos;t exist or has moved. Head back to base and try again from there.</p>
          <div className="simple-actions">
            <Link className="btn btn-orange" href="/">Return to home</Link>
            <Link className="btn btn-navy" href="/services/">See services</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
