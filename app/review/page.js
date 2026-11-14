/* REVIEW PAGE: happydrones.co.uk/review — the link to send customers after a job.
   Google and Facebook review buttons (links set in SITE in lib/site.js),
   plus a private feedback form. Not in the menu, noindex. */
import PageHero from "@/components/PageHero";
import FeedbackForm from "@/components/tools/FeedbackForm";
import { SITE } from "@/lib/site";

export const metadata = { title: "How did I do?", description: "Leave a review for Happy Drones.", robots: { index: false, follow: false } };

export default function ReviewPage() {
  return (
    <div className="sub-page">
      <PageHero small crumbs={[{ label: "Review" }]} eyebrow="Thank you" title="How did I do?" lede="Thanks for booking Happy Drones. A short review helps other people in Teesside find a careful, insured drone pilot. It takes a minute." />
      <section className="t-section t-dark" style={{ paddingTop: "clamp(32px, 5vw, 56px)" }}>
        <div className="wrap rv-grid">
          <div className="rv-public">
            <h2 className="t-sub">Leave a public review</h2>
            <p className="t-lede">Pick whichever you use.</p>
            <div className="rv-btns">
              {SITE.googleReviewUrl && <a className="t-btn t-btn-primary" href={SITE.googleReviewUrl} target="_blank" rel="noopener">Review on Google</a>}
              {SITE.facebookReviewUrl && <a className={`t-btn ${SITE.googleReviewUrl ? "t-btn-ghost" : "t-btn-primary"}`} href={SITE.facebookReviewUrl} target="_blank" rel="noopener">Recommend on Facebook</a>}
            </div>
            <p className="rv-tip">Mentioning the service and the area (e.g. &ldquo;roof check in Yarm&rdquo;) helps local people find it.</p>
          </div>
          <div className="rv-private">
            <h2 className="t-sub">Or tell me privately</h2>
            <p className="t-lede">Something I could do better? This goes only to me.</p>
            <FeedbackForm />
          </div>
        </div>
      </section>
    </div>
  );
}
