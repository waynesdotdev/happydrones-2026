"use client";
/* Sign in (password, then an emailed code), create an account, or reset
   a password. Used by /account and /admin. onDone(user) is called once
   signed in. */
import { useState } from "react";
import Link from "next/link";
import { api } from "@/lib/acct/client";

function Code({ email, devCode, purpose, onDone, onBack }) {
  const [code, setCode] = useState("");
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  async function go(e) {
    e.preventDefault(); setBusy(true); setMsg("");
    const path = purpose === "verify" ? "/api/acct/verify" : purpose === "reset" ? "/api/acct/reset" : "/api/acct/login-code";
    const r = await api(path, { email, code, password: pw });
    setBusy(false);
    if (r.error) return setMsg(r.message);
    onDone(r);
  }
  return (
    <form className="ac-form" onSubmit={go} noValidate>
      <h2>{purpose === "reset" ? "Set a new password" : "Check your email"}</h2>
      <p className="ac-lede">We&apos;ve sent a 6-digit code to <b>{email}</b>. It works for 10 minutes.</p>
      {devCode && <p className="ac-test">Test mode: your code is <b>{devCode}</b></p>}
      <div className="t-field"><label htmlFor="ac-code">Code</label><input id="ac-code" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} /></div>
      {purpose === "reset" && <div className="t-field"><label htmlFor="ac-newpw">New password</label><input id="ac-newpw" type="password" autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} /><span className="t-hint">At least 10 characters.</span></div>}
      {msg && <p className="ac-err" role="alert">{msg}</p>}
      <button className="t-btn t-btn-primary" disabled={busy || code.length !== 6}>{busy ? "Checking…" : purpose === "reset" ? "Save new password" : "Continue"}</button>
      <button type="button" className="ac-link" onClick={onBack}>← Start again</button>
    </form>
  );
}

export default function SignIn({ onDone, adminOnly = false }) {
  const [view, setView] = useState("signin"); // signin | register | forgot | code
  const [f, setF] = useState({ name: "", email: "", password: "", company: "", phone: "", privacy: false, marketing: false });
  const [step, setStep] = useState(null); // { email, devCode, purpose }
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));

  async function submit(e) {
    e.preventDefault(); setBusy(true); setMsg("");
    const r = view === "register" ? await api("/api/acct/register", f) : view === "forgot" ? await api("/api/acct/forgot", { email: f.email }) : await api("/api/acct/login", { email: f.email, password: f.password });
    setBusy(false);
    if (r.error) return setMsg(r.message);
    setStep({ email: r.email, devCode: r.devCode, purpose: r.step === "code" ? "login" : r.step });
  }

  if (step) return <Code {...step} onBack={() => { setStep(null); setView("signin"); }} onDone={(r) => { if (step.purpose === "reset") { setStep(null); setView("signin"); setMsg("Password changed. Sign in with your new password."); } else onDone(r.user); }} />;

  return (
    <form className="ac-form" onSubmit={submit} noValidate>
      {!adminOnly && (
        <div className="ac-tabs" role="tablist">
          <button type="button" role="tab" aria-selected={view === "signin"} className={view === "signin" ? "is-on" : undefined} onClick={() => { setView("signin"); setMsg(""); }}>Sign in</button>
          <button type="button" role="tab" aria-selected={view === "register"} className={view === "register" ? "is-on" : undefined} onClick={() => { setView("register"); setMsg(""); }}>Create an account</button>
        </div>
      )}
      <h2>{view === "register" ? "Create your account" : view === "forgot" ? "Reset your password" : adminOnly ? "Admin sign in" : "Sign in"}</h2>
      {view === "register" && <div className="t-field"><label htmlFor="ac-name">Your name</label><input id="ac-name" autoComplete="name" value={f.name} onChange={(e) => set("name", e.target.value)} /></div>}
      <div className="t-field"><label htmlFor="ac-email">Email</label><input id="ac-email" type="email" autoComplete="email" value={f.email} onChange={(e) => set("email", e.target.value)} /></div>
      {view !== "forgot" && <div className="t-field"><label htmlFor="ac-pw">Password</label><input id="ac-pw" type="password" autoComplete={view === "register" ? "new-password" : "current-password"} value={f.password} onChange={(e) => set("password", e.target.value)} />{view === "register" && <span className="t-hint">At least 10 characters. A few random words works well.</span>}</div>}
      {view === "register" && (<>
        <div className="t-c2">
          <div className="t-field"><label htmlFor="ac-co">Company <span className="if-opt">(optional)</span></label><input id="ac-co" autoComplete="organization" value={f.company} onChange={(e) => set("company", e.target.value)} /></div>
          <div className="t-field"><label htmlFor="ac-ph">Phone <span className="if-opt">(optional)</span></label><input id="ac-ph" type="tel" autoComplete="tel" value={f.phone} onChange={(e) => set("phone", e.target.value)} /></div>
        </div>
        <label className="acc-agree"><input type="checkbox" checked={f.privacy} onChange={(e) => set("privacy", e.target.checked)} /><span>I&apos;ve read the <Link href="/privacy/" target="_blank">privacy policy</Link>.</span></label>
        <label className="acc-agree"><input type="checkbox" checked={f.marketing} onChange={(e) => set("marketing", e.target.checked)} /><span>Send me the occasional email about new services (optional, unsubscribe any time).</span></label>
      </>)}
      {msg && <p className={msg.startsWith("Password changed") ? "ac-ok" : "ac-err"} role="alert">{msg}</p>}
      <button className="t-btn t-btn-primary" disabled={busy}>{busy ? "Please wait…" : view === "register" ? "Create account" : view === "forgot" ? "Send me a code" : "Sign in"}</button>
      <p className="ac-small">{view === "signin" ? <>Every sign-in also needs a code we email you. <button type="button" className="ac-link" onClick={() => { setView("forgot"); setMsg(""); }}>Forgotten your password?</button></> : view === "forgot" ? <button type="button" className="ac-link" onClick={() => setView("signin")}>← Back to sign in</button> : "We'll email you a code to check it's you."}</p>
    </form>
  );
}
