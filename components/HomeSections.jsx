/* Smaller homepage sections: showreel, how it works, reviews, FAQ.
   Their words live in lib/site.js (HOW_STEPS, FAQ, SITE.reviews, SITE.showreel). */
import VideoEmbed from "./VideoEmbed";
import Link from "next/link";
import { FAQ, HOW_STEPS, SITE, BUSINESS_STEPS, fillInsurance } from "@/lib/site";
import { youtubeId } from "@/lib/youtube";

export function Showreel() {
  const id = youtubeId(SITE.showreel);
  if (!id) return null;
  return (
    <section className="reel" id="reel" aria-labelledby="reel-title">
      <div className="wrap">
        <h2 id="reel-title" className="section-title">The showreel</h2>
        <VideoEmbed id={id} title="Happy Drones showreel" />
      </div>
    </section>
  );
}

export function HowItWorks() {
  return (
    <section className="how" aria-labelledby="how-title">
      <div className="wrap">
        <h2 id="how-title" className="section-title">How a shoot works</h2>
        <ol className="how-steps">
          {HOW_STEPS.map((s, i) => (
            <li key={s.title}>
              <span className="how-num">{i + 1}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Reviews() {
  if (!SITE.reviews.length) return null;
  return (
    <section className="reviews" id="reviews" aria-labelledby="reviews-title">
      <div className="wrap">
        <h2 id="reviews-title" className="section-title">What customers say</h2>
        <div className="review-row">
          {SITE.reviews.map((r) => (
            <figure className="review" key={r.name + r.text}>
              <div className="stars" aria-label="5 out of 5 stars">★★★★★</div>
              <blockquote>{r.text}</blockquote>
              <figcaption>{r.name}<small>{r.detail}</small></figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Faq({ items = FAQ, title = "Questions people ask" }) {
  return (
    <section className="faq" id="faq" aria-labelledby="faq-title">
      <div className="wrap faq-grid">
        <h2 id="faq-title" className="section-title">{title}</h2>
        <div className="faq-list">
          {items.map((f) => (
            <details key={f.q} name="faq">
              <summary>{f.q}</summary>
              <p>{fillInsurance(f.a)}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/** FAQ as structured data, so Google can show it in search results */
export function faqSchema(items = FAQ) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: fillInsurance(f.a) },
    })),
  };
}

/* How business work starts (homepage): the same steps as /business */
export function BusinessSteps() {
  return (
    <section className="t-section t-dark" aria-labelledby="bs-title">
      <div className="wrap">
        <div className="t-head t-split">
          <div className="t-stack"><span className="t-tag">How it starts</span><h2 id="bs-title">One job first. A regular slot if it works.</h2></div>
          <p className="t-lede">Nobody should sign up for a year of visits on a promise. Try one job at the normal price and judge the result. <Link className="text-link" href="/business/">More for business</Link></p>
        </div>
        <ol className="cx-process">{BUSINESS_STEPS.map((s) => <li key={s.t}><span className="t-mono">{s.tag}</span><h3>{s.t}</h3><p>{s.d}</p></li>)}</ol>
      </div>
    </section>
  );
}
