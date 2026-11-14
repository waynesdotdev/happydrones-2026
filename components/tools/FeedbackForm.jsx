"use client";
/* Private feedback after a job (/review). Sent by lib/sendForm.js as form
   "feedback" (hidden copy in public/__forms.html). Only Wayne sees it. */
import { useState } from "react";
import { sendEnquiry } from "@/lib/sendForm";

export default function FeedbackForm() {
  const [st, setSt] = useState({ rating: "", good: "", better: "", name: "", quote: false });
  const [status, setStatus] = useState("idle");
  const [msg, setMsg] = useState("");
  const set = (k, v) => setSt((s) => ({ ...s, [k]: v }));
  async function submit(e) {
    e.preventDefault();
    if (!st.rating && !st.good.trim() && !st.better.trim()) { setMsg("Pick a score or write a few words."); return; }
    setStatus("sending"); setMsg("");
    try {
      await sendEnquiry({ "form-name": "feedback", subject: `Feedback${st.rating ? ` · ${st.rating}/5` : ""}${st.name ? ` · ${st.name}` : ""}`, rating: st.rating, good: st.good, better: st.better, name: st.name, quote: st.quote ? "Yes, happy to be quoted" : "No", "bot-field": "" });
      setStatus("sent");
    } catch { setStatus("idle"); setMsg("That didn't send. Try again in a minute."); }
  }
  if (status === "sent") return <p className="if-done" role="status"><b>Thank you.</b> I read every one of these.</p>;
  return (
    <form className="fb-form" name="feedback" onSubmit={submit} noValidate>
      <input type="hidden" name="form-name" value="feedback" />
      <p className="t-hp"><label>Leave this empty <input name="bot-field" tabIndex={-1} autoComplete="off" /></label></p>
      <fieldset className="fb-stars"><legend>Overall, how did it go?</legend>
        {[1, 2, 3, 4, 5].map((n) => (
          <label key={n} className={Number(st.rating) >= n ? "on" : undefined}>
            <input type="radio" name="rating" value={n} checked={st.rating === String(n)} onChange={() => set("rating", String(n))} />
            <span aria-hidden="true">★</span><span className="sr-only">{n} out of 5</span>
          </label>
        ))}
      </fieldset>
      <div className="t-field"><label htmlFor="fb-good">What went well?</label><textarea id="fb-good" name="good" rows={3} value={st.good} onChange={(e) => set("good", e.target.value)} /></div>
      <div className="t-field"><label htmlFor="fb-better">What could I do better?</label><textarea id="fb-better" name="better" rows={3} value={st.better} onChange={(e) => set("better", e.target.value)} /></div>
      <div className="t-field"><label htmlFor="fb-name">Your name <span className="if-opt">(optional)</span></label><input id="fb-name" name="name" autoComplete="name" value={st.name} onChange={(e) => set("name", e.target.value)} /></div>
      <label className="acc-agree fb-quote"><input type="checkbox" checked={st.quote} onChange={(e) => set("quote", e.target.checked)} /><span>I&apos;m happy for you to quote this on the website (first name and area only).</span></label>
      {msg && <p className="if-msg" role="alert">{msg}</p>}
      <button className="t-btn t-btn-primary" type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending…" : "Send feedback"}</button>
    </form>
  );
}
