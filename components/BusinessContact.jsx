/* Homepage contact section (#contact): the business form, with homeowners
   pointed to the instant quote on /property. Every "/#contact" link lands here. */
import Link from "next/link";
import BusinessForm from "@/components/BusinessForm";
import { SITE, whatsappLink } from "@/lib/site";

export default function BusinessContact() {
  const wa = whatsappLink();
  return (
    <section className="t-section t-light" id="contact" aria-labelledby="contact-title">
      <div className="wrap biz-start">
        <div className="t-stack">
          <span className="t-tag">Start here</span>
          <h2 id="contact-title">Tell me what you need.</h2>
          <p className="t-lede">Two minutes. I&apos;ll reply within one working day with a fixed price and a date for a first visit.</p>
          <ul className="ticks">
            <li>Call <a href={`tel:${SITE.phone}`}>{SITE.phoneDisplay}</a>{wa && <> or <a href={wa} target="_blank" rel="noopener">WhatsApp me</a></>}</li>
            <li>Email <a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
          </ul>
          <div className="biz-home">
            <p><b>Selling or letting your own home?</b> Pick a package and see your price straight away.</p>
            <Link className="btn btn-ghost" href="/property/#quote">Get an instant home quote</Link>
          </div>
        </div>
        <BusinessForm />
      </div>
    </section>
  );
}
