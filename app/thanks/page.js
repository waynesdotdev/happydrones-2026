/* Shown after someone sends the contact form. Hidden from Google. */
import Link from "next/link";

export const metadata = {
  title: "Enquiry sent",
  robots: { index: false, follow: false },
};

export default function ThanksPage() {
  return (
    <div className="sub-page">
      <section className="simple">
        <div className="wrap simple-inner">
          <h1 className="section-title">Enquiry sent. I&apos;ll be in touch within a day.</h1>
          <p>I&apos;ve got your details and your flight plan. If it&apos;s urgent, call or WhatsApp and I&apos;ll pick it up straight away.</p>
          <div className="simple-actions">
            <Link className="btn btn-orange" href="/">Back to home</Link>
            <Link className="btn btn-navy" href="/journal/">Browse the Viewing Room</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
