"use client";
/* "Start a regular arrangement" form on /business.
   Sent by lib/sendForm.js as form "business": saved in the admin's
   Enquiries tab, the customer gets a confirmation, Wayne gets an email. */
import { useEffect, useState } from "react";
import Link from "next/link";
import { sendEnquiry } from "@/lib/sendForm";
import { SITE, whatsappLink } from "@/lib/site";

const WHO = ["Estate or letting agent", "Builder or developer", "Landlord or property manager", "Roofer, surveyor or other trade", "Something else"];
const NEED = ["Listing photos and video", "Site progress visits", "Empty building checks", "Roof checks", "Not sure yet"];
const OFTEN = ["Weekly", "Monthly", "Every few months", "Just one to start"];

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

export default function BusinessForm() {
  const [st, setSt] = useState({ role: "", need: "", often: "", company: "", name: "", email: "", phone: "", postcode: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [msg, setMsg] = useState("");
  const [ref, setRef] = useState("");
  const set = (k, v) => setSt((s) => ({ ...s, [k]: v }));
  // A link like /?role=agent#contact picks the matching kind of business
  useEffect(() => {
    const r = (new URLSearchParams(window.location.search).get("role") || "").toLowerCase();
    const pick = { agent: 0, estate: 0, letting: 0, builder: 1, construction: 1, developer: 1, landlord: 2, manager: 2, property: 2, roof: 3, trade: 3, surveyor: 3 };
    const k = Object.keys(pick).find((w) => r.includes(w));
    if (k !== undefined) setSt((s) => (s.role ? s : { ...s, role: WHO[pick[k]] }));
  }, []);

  async function submit(e) {
    e.preventDefault();
    if (!st.role) { setMsg("Pick what kind of business you are."); return; }
    if (!st.company.trim() || !st.name.trim()) { setMsg("Add your business name and your own name."); return; }
    if (!st.email.trim() && st.phone.replace(/\D/g, "").length < 10) { setMsg("Add an email address or a phone number so I can reply."); return; }
    setStatus("sending"); setMsg("");
    const fields = {
      "form-name": "business",
      subject: `Business enquiry · ${st.company.trim()}`,
      role: st.role, need: st.need, "how-often": st.often,
      company: st.company, name: st.name, email: st.email, phone: st.phone,
      postcode: st.postcode, message: st.message, "bot-field": "",
    };
    try { setRef(await sendEnquiry(fields)); setStatus("sent"); }
    catch { setStatus("error"); setMsg("That didn't send. Call or WhatsApp instead and I'll take it from there."); }
  }

  const wa = whatsappLink(`Hi Happy Drones, I'd like to talk about regular drone work for ${st.company || "our business"}.`);

  if (status === "sent") {
    return (
      <div className="form acc-sent" role="status">
        <h3>Sent. Thank you{st.name ? `, ${st.name.split(" ")[0]}` : ""}.</h3>
        <p>I&apos;ll reply within one working day with a fixed price and a date for a first visit.{ref ? ` Your reference is ${ref}.` : ""}</p>
        {st.email && <p>A confirmation is on its way to {st.email}.</p>}
        <p>Need it sooner? Call <a href={`tel:${SITE.phone}`}>{SITE.phoneDisplay}</a>.</p>
      </div>
    );
  }

  return (
    <form className="form acc-form" name="business" onSubmit={submit} noValidate>
      <input type="hidden" name="form-name" value="business" />
      <p className="bot"><label>Leave this empty <input name="bot-field" tabIndex={-1} autoComplete="off" /></label></p>
      <h3>Tell me about your business</h3>
      <Pills name="role" label="You are a" options={WHO} value={st.role} onChange={(v) => set("role", v)} />
      <Pills name="need" label="What you need (optional)" options={NEED} value={st.need} onChange={(v) => set("need", v)} />
      <Pills name="how-often" label="How often (optional)" options={OFTEN} value={st.often} onChange={(v) => set("often", v)} />
      <div className="field-pair">
        <label className="field"><span>Business name</span><input name="company" autoComplete="organization" value={st.company} onChange={(e) => set("company", e.target.value)} required /></label>
        <label className="field"><span>Your name</span><input name="name" autoComplete="name" value={st.name} onChange={(e) => set("name", e.target.value)} required /></label>
      </div>
      <div className="field-pair">
        <label className="field"><span>Email</span><input type="email" name="email" autoComplete="email" value={st.email} onChange={(e) => set("email", e.target.value)} /></label>
        <label className="field"><span>Phone</span><input type="tel" name="phone" autoComplete="tel" value={st.phone} onChange={(e) => set("phone", e.target.value)} /></label>
      </div>
      <label className="field"><span>Postcode of the first property or site <em>(optional)</em></span><input name="postcode" autoComplete="postal-code" placeholder="e.g. TS18 1AB" value={st.postcode} onChange={(e) => set("postcode", e.target.value)} /></label>
      <label className="field"><span>Anything else? <em>(optional)</em></span><textarea name="message" rows={3} placeholder="How many listings, sites or buildings, and when you'd like to start" value={st.message} onChange={(e) => set("message", e.target.value)} /></label>
      {msg && <p className="form-error" role="alert">{msg}</p>}
      <button className="btn btn-orange btn-block" type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending…" : "Send it to Wayne"}</button>
      <p className="form-note">Nothing is signed or charged. Your details are only used to reply to you: see the <Link href="/privacy/">privacy policy</Link>. {wa && <><a href={wa} target="_blank" rel="noopener">Or WhatsApp me</a>.</>}</p>
    </form>
  );
}
