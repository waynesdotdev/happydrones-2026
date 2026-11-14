"use client";
/* "Tell me when it's ready" form for coming-soon services.
   Sent by lib/sendForm.js as form "interest" (email via Web3Forms, backup in
   Netlify Forms; hidden copy in public/__forms.html). Used on the
   /services/<id>/ page of any service marked soon: true. */
import { useState } from "react";
import { sendEnquiry } from "@/lib/sendForm";

export default function InterestForm({ service }) {
  const [st, setSt] = useState({ name: "", email: "", postcode: "", note: "" });
  const [status, setStatus] = useState("idle");
  const [msg, setMsg] = useState("");
  const set = (k, v) => setSt((s) => ({ ...s, [k]: v }));

  async function submit(e) {
    e.preventDefault();
    if (st.name.trim().length < 2 || !/^\S+@\S+\.\S+$/.test(st.email.trim())) { setMsg("Add your name and email."); return; }
    setStatus("sending"); setMsg("");
    try {
      await sendEnquiry({ "form-name": "interest", subject: `Interest: ${service}`, service, name: st.name, email: st.email, postcode: st.postcode, message: st.note, "bot-field": "" });
      setStatus("sent");
    } catch { setStatus("idle"); setMsg("That didn't send. Try again, or message me on WhatsApp."); }
  }

  if (status === "sent") return <p className="if-done" role="status"><b>You&apos;re on the list.</b> I&apos;ll email you as soon as it&apos;s ready to book.</p>;

  return (
    <form className="if-form" name="interest" onSubmit={submit} noValidate>
      <input type="hidden" name="form-name" value="interest" />
      <p className="t-hp"><label>Leave this empty <input name="bot-field" tabIndex={-1} autoComplete="off" /></label></p>
      <b className="if-title">Tell me when it&apos;s ready</b>
      <div className="t-field"><label htmlFor="if-name">Name</label><input id="if-name" name="name" autoComplete="name" value={st.name} onChange={(e) => set("name", e.target.value)} /></div>
      <div className="t-field"><label htmlFor="if-email">Email</label><input id="if-email" name="email" type="email" autoComplete="email" value={st.email} onChange={(e) => set("email", e.target.value)} /></div>
      <div className="t-field"><label htmlFor="if-pc">Postcode <span className="if-opt">(optional)</span></label><input id="if-pc" name="postcode" autoComplete="postal-code" placeholder="TS1 2AB" value={st.postcode} onChange={(e) => set("postcode", e.target.value)} /></div>
      <div className="t-field"><label htmlFor="if-note">What would you use it for? <span className="if-opt">(optional)</span></label><textarea id="if-note" name="message" rows={3} value={st.note} onChange={(e) => set("note", e.target.value)} /></div>
      {msg && <p className="if-msg" role="alert">{msg}</p>}
      <button className="t-btn t-btn-primary t-btn-block" type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending…" : "Register my interest"}</button>
      <p className="t-pc-note">No booking and no payment. Just an email when it launches.</p>
    </form>
  );
}
