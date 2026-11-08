"use client";
/* Agent account: how it works, plus the sign-up form (/estate-agents/#account).
   Sent by lib/sendForm.js as form "agent-account" (email via Web3Forms, backup in
   Netlify Forms). The hidden copy of this form is in public/__forms.html: keep
   the field names the same. Credit limit: AGENT_ACCOUNT in lib/site.js.
   The account terms are clause 3.9 of the booking agreement (/terms). */
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AGENT_OFFER, AGENT_ACCOUNT, PAYMENT, SITE, money, whatsappLink } from "@/lib/site";
import { sendEnquiry } from "@/lib/sendForm";

const VOLUME = [`${AGENT_OFFER.minPerMonth}–6`, "7–9", "10 or more", "Not sure yet"];
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Any day"];
const BRANDING = ["Standard", "Agency-branded", "White label", "Decide per listing"];

export const ACCOUNT_STEPS = [
  { t: "Apply", d: "Fill in this form. I reply within a day with the booking agreement to sign once. It covers every listing on the account." },
  { t: "Send addresses", d: "Book each listing by WhatsApp, email or phone. I confirm the address, package and shoot date in writing." },
  { t: "Files straight away", d: "Shoots on your weekly slot, files in 48–72 hours. No deposit, and no waiting for payment per listing." },
  { t: "One invoice a month", d: `Every listing that month on one invoice, itemised by address, at ${AGENT_OFFER.discount} off. Paid within ${PAYMENT.termsDays} days.` },
];

function Pills({ name, options, value, onChange, label }) {
  return (
    <div className="field">
      <span id={`${name}-label`}>{label}</span>
      <div className="roles" role="radiogroup" aria-labelledby={`${name}-label`}>
        {options.map((o, i) => (
          <span className="role" key={o}>
            <input type="radio" name={name} id={`${name}-${i}`} value={o} checked={value === o} onChange={() => onChange(o)} />
            <label htmlFor={`${name}-${i}`}>{o}</label>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function AccountSignup() {
  const [st, setSt] = useState({ agency: "", branches: "", name: "", email: "", phone: "", invoiceEmail: "", po: "No", poNote: "", volume: "", day: "", branding: "", message: "", agreed: false });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [msg, setMsg] = useState("");
  const box = useRef(null);
  const set = (k, v) => setSt((s) => ({ ...s, [k]: v }));

  useEffect(() => {
    if (status !== "sent" || !box.current) return;
    const y = box.current.getBoundingClientRect().top + scrollY - 100;
    scrollTo({ top: Math.max(0, y), behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }, [status]);

  async function submit(e) {
    e.preventDefault();
    if (!st.agency.trim() || !st.name.trim() || !st.email.trim()) { setMsg("Add your agency, your name and your email."); return; }
    if (!st.agreed) { setMsg("Tick the box to say you've read the account terms."); return; }
    setStatus("sending"); setMsg("");
    const fields = {
      "form-name": "agent-account",
      subject: `Agent account request · ${st.agency.trim()}`,
      agency: st.agency, branches: st.branches, name: st.name, email: st.email, phone: st.phone,
      "invoice-email": st.invoiceEmail || st.email,
      "purchase-orders": st.po === "Yes" ? `Yes${st.poNote ? `: ${st.poNote}` : ""}` : "No",
      volume: st.volume, "shoot-day": st.day, branding: st.branding, message: st.message,
      agreed: `Read the booking agreement and account terms (3.9, ${money(AGENT_ACCOUNT.creditLimit)} credit limit)`,
      "bot-field": "",
    };
    try { await sendEnquiry(fields); setStatus("sent"); }
    catch { setStatus("error"); setMsg("That didn't send. Use WhatsApp or email instead and I'll set it up from there."); }
  }

  const wa = whatsappLink(`Hi Happy Drones, I'd like to open an agent account for ${st.agency || "our agency"}.`);

  return (
    <div className="acc" ref={box}>
      <div className="acc-how">
        <ol className="acc-steps">
          {ACCOUNT_STEPS.map((s, i) => (
            <li key={s.t}><span className="acc-n">{i + 1}</span><div><b>{s.t}</b><p>{s.d}</p></div></li>
          ))}
        </ol>
        <div className="acc-limit">
          <b>{money(AGENT_ACCOUNT.creditLimit)}</b>
          <p><strong>Credit limit.</strong> The most that can be owed at once, counting shoots done but not yet paid for. If it&apos;s reached, new shoots wait until a payment comes in. If an invoice goes overdue, bookings pause until it&apos;s paid.</p>
        </div>
        <p className="acc-terms">Full terms: clause 3.9 of the <Link href="/terms/">booking agreement</Link>. Accounts are for agencies booking {AGENT_OFFER.minPerMonth} or more listings a month.</p>
      </div>

      {status === "sent" ? (
        <div className="form acc-sent" role="status">
          <h3>Account request sent.</h3>
          <p>Thanks{st.name ? `, ${st.name.split(" ")[0]}` : ""}. I&apos;ll reply within a day with the agreement to sign. Once it&apos;s signed, just send your first address.</p>
          <p>If you&apos;ve got a logo for branded videos, email it to <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.</p>
        </div>
      ) : (
        <form className="form acc-form" name="agent-account" onSubmit={submit} noValidate>
          <input type="hidden" name="form-name" value="agent-account" />
          <p className="bot"><label>Leave this empty <input name="bot-field" tabIndex={-1} autoComplete="off" /></label></p>
          <h3>Open an agent account</h3>
          <div className="field-pair">
            <label className="field"><span>Agency</span><input name="agency" autoComplete="organization" value={st.agency} onChange={(e) => set("agency", e.target.value)} required /></label>
            <label className="field"><span>Branches <em>(optional)</em></span><input name="branches" placeholder="e.g. Stockton, Yarm" value={st.branches} onChange={(e) => set("branches", e.target.value)} /></label>
          </div>
          <div className="field-pair">
            <label className="field"><span>Your name</span><input name="name" autoComplete="name" value={st.name} onChange={(e) => set("name", e.target.value)} required /></label>
            <label className="field"><span>Phone <em>(optional)</em></span><input type="tel" name="phone" autoComplete="tel" value={st.phone} onChange={(e) => set("phone", e.target.value)} /></label>
          </div>
          <div className="field-pair">
            <label className="field"><span>Your email</span><input type="email" name="email" autoComplete="email" value={st.email} onChange={(e) => set("email", e.target.value)} required /></label>
            <label className="field"><span>Send invoices to <em>(if different)</em></span><input type="email" name="invoice-email" autoComplete="off" placeholder="accounts@agency.co.uk" value={st.invoiceEmail} onChange={(e) => set("invoiceEmail", e.target.value)} /></label>
          </div>
          <Pills name="purchase-orders" label="Do you need a purchase order (PO) number on invoices?" options={["No", "Yes"]} value={st.po} onChange={(v) => set("po", v)} />
          {st.po === "Yes" && (
            <label className="field"><span>How do POs work at your agency? <em>(optional)</em></span><input name="po-note" placeholder="e.g. one PO a month from the office manager" value={st.poNote} onChange={(e) => set("poNote", e.target.value)} /></label>
          )}
          <Pills name="volume" label="Listings a month" options={VOLUME} value={st.volume} onChange={(v) => set("volume", v)} />
          <Pills name="shoot-day" label="Preferred shoot day" options={DAYS} value={st.day} onChange={(v) => set("day", v)} />
          <Pills name="branding" label="Branding on your videos" options={BRANDING} value={st.branding} onChange={(v) => set("branding", v)} />
          <label className="field"><span>Anything else? <em>(optional)</em></span><textarea name="message" rows={3} placeholder="Areas you cover, a first listing waiting, questions…" value={st.message} onChange={(e) => set("message", e.target.value)} /></label>
          <label className="acc-agree">
            <input type="checkbox" name="agreed" checked={st.agreed} onChange={(e) => set("agreed", e.target.checked)} />
            <span>I&apos;ve read the <Link href="/terms/" target="_blank">booking agreement</Link>, including the agent account terms in 3.9 (monthly invoice, {PAYMENT.termsDays}-day payment, {money(AGENT_ACCOUNT.creditLimit)} credit limit).</span>
          </label>
          {msg && <p className="form-error" role="alert">{msg}</p>}
          <button className="btn btn-orange btn-block" type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending…" : "Request an account"}</button>
          <p className="form-note">Nothing is signed or charged yet. {wa && <><a href={wa} target="_blank" rel="noopener">Or WhatsApp me</a>.</>}</p>
        </form>
      )}
    </div>
  );
}
