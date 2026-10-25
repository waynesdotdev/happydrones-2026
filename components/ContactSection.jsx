"use client";
/* "Ready to book?" contact section and enquiry form.
   Sending is handled by lib/sendForm.js (email via Web3Forms, backup copy in
   Netlify Forms). The matching hidden form lives in public/__forms.html.
   If you add or rename a field here, add/rename it there too. */
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SITE, whatsappLink } from "@/lib/site";
import { useQuote } from "./QuoteContext";
import { sendEnquiry } from "@/lib/sendForm";

// Options for "I am a…". Rename freely, but keep them short.
const ROLES = ["Estate agent", "Homeowner selling", "Landlord or holiday let", "Business", "Something else"];

export default function ContactSection() {
  const { plan, setPlan, role, setRole } = useQuote();
  const router = useRouter();
  const nameRef = useRef(null);
  const [status, setStatus] = useState("idle"); // idle | sending | error
  const [minDate, setMinDate] = useState("");

  useEffect(() => setMinDate(new Date().toISOString().split("T")[0]), []);
  // A link like /?role=agent#contact pre-picks "Estate agent"
  useEffect(() => {
    const r = new URLSearchParams(window.location.search).get("role");
    const match = ROLES.find((x) => x.toLowerCase().includes((r || "").toLowerCase()));
    if (r && match) setRole(match);
  }, [setRole]);
  useEffect(() => {
    if (plan) setTimeout(() => nameRef.current?.focus({ preventScroll: true }), 600);
  }, [plan]);

  async function onSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      await sendEnquiry(data);
      setPlan(null);
      router.push("/thanks/");
    } catch {
      setStatus("error");
    }
  }

  const wa = whatsappLink();

  return (
    <section className="contact" id="contact" aria-labelledby="contact-title">
      <div className="wrap contact-grid">
        <div className="contact-copy">
          <h2 id="contact-title" className="section-title">Ready to book?</h2>
          <p>Tell me about the property or business and I&apos;ll reply within a day with a fixed price and available dates.</p>
          <div className="direct">
            {wa && (
              <a className="direct-link" href={wa} target="_blank" rel="noopener">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20l1.3-4A8 8 0 1 1 8 18.7z" /><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8a4 4 0 0 1-1.8-1.8l.8-1-1-2z" /></svg>
                <span><b>WhatsApp</b><small>Quickest reply</small></span>
              </a>
            )}
            {SITE.phone && (
              <a className="direct-link" href={`tel:${SITE.phone}`}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></svg>
                <span><b>Call</b><small>{SITE.phoneDisplay}</small></span>
              </a>
            )}
            {SITE.email && (
              <a className="direct-link" href={`mailto:${SITE.email}`}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>
                <span><b>Email</b><small>{SITE.email}</small></span>
              </a>
            )}
          </div>
        </div>

        <form className="form" name="quote" onSubmit={onSubmit}>
          <input type="hidden" name="form-name" value="quote" />
          <input type="hidden" name="quote-summary" value={plan?.summary || ""} />
          <input type="hidden" name="quote-total" value={plan?.total || ""} />
          {/* The subject line of the enquiry email you receive */}
          <input type="hidden" name="subject" value={`New enquiry${role ? " from " + role.toLowerCase() : ""}${plan ? " · " + plan.total : ""}`} />
          <p className="bot"><label>Leave this empty <input name="bot-field" tabIndex={-1} autoComplete="off" /></label></p>

          {plan && (
            <div className="attached">
              <span>Your quote is attached: <b>{plan.summary} ({plan.total})</b></span>
              <button type="button" onClick={() => setPlan(null)}>Remove</button>
            </div>
          )}

          <div className="field">
            <span id="role-label">I am a…</span>
            <div className="roles" role="radiogroup" aria-labelledby="role-label">
              {ROLES.map((r, i) => (
                <span className="role" key={r}>
                  <input type="radio" name="role" id={`role-${i}`} value={r} checked={role === r} onChange={() => setRole(r)} />
                  <label htmlFor={`role-${i}`}>{r}</label>
                </span>
              ))}
            </div>
          </div>
          <div className="field-pair">
            <label className="field"><span>Name</span><input name="name" autoComplete="name" required ref={nameRef} /></label>
            <label className="field"><span>Company <em>(optional)</em></span><input name="company" autoComplete="organization" /></label>
          </div>
          <div className="field-pair">
            <label className="field"><span>Email</span><input type="email" name="email" autoComplete="email" required /></label>
            <label className="field"><span>Phone</span><input type="tel" name="phone" autoComplete="tel" /></label>
          </div>
          <div className="field-pair">
            <label className="field"><span>Property postcode</span><input name="postcode" autoComplete="postal-code" /></label>
            <label className="field"><span>Preferred date</span><input type="date" name="date" min={minDate || undefined} /></label>
          </div>
          <label className="field"><span>Anything I should know?</span><textarea name="message" rows={4} placeholder="Number of bedrooms, access, deadlines, how many listings a month…"></textarea></label>

          {status === "error" && (
            <p className="form-error" role="alert">
              Your enquiry didn&apos;t send. Check your connection and try again, or message me on WhatsApp.
            </p>
          )}
          <button className="btn btn-orange btn-block" type="submit" disabled={status === "sending"}>
            {status === "sending" ? "Sending…" : "Send my enquiry"}
          </button>
          <p className="form-note">I&apos;ll only use your details to reply. <Link href="/privacy/">Privacy policy</Link></p>
        </form>
      </div>
    </section>
  );
}
