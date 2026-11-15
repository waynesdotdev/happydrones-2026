"use client";
/* The customer's account at /account: their bookings, booking and paying,
   their details, downloading their data and deleting their account.
   Talks to /api/acct (functions/api/acct/[[path]].js). */
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import SignIn from "./SignIn";
import { api, STATUS, longDate, when } from "@/lib/acct/client";
import { PasswordField, NewPassword, newPasswordProblem } from "./PasswordField";
import { CATALOG, priceFor, zoneFor, MODE_WORDS, bundleSize, greeting } from "@/lib/acct/catalog";
import { money } from "@/lib/site";
import useScrollToTop from "@/components/useScrollToTop";

const GROUPS = [...new Set(CATALOG.map((c) => c.group))];
const minDate = () => new Date(Date.now() + 2 * 864e5).toISOString().slice(0, 10);

function Badge({ status }) { const [w, c] = STATUS[status] || [status, "info"]; return <span className={`ac-badge ac-${c}`}>{w}</span>; }

function Bookings({ data, reload, onBook, confirming }) {
  const [busy, setBusy] = useState("");
  const [msg, setMsg] = useState("");
  async function pay(ref) {
    setBusy(ref); setMsg("");
    const r = await api(`/api/acct/booking/${ref}/pay`, {});
    setBusy("");
    if (r.url) { location.href = r.url; return; }
    if (r.error) return setMsg(r.message);
    setMsg("Test payment recorded. No money was taken."); reload();
  }
  async function cancel(ref) {
    if (!confirm("Cancel this booking? If you've paid, any refund follows the booking agreement.")) return;
    setBusy(ref); const r = await api(`/api/acct/booking/${ref}/cancel`, {}); setBusy("");
    setMsg(r.error ? r.message : r.booking.status === "cancelled" ? "Booking cancelled." : "Cancellation requested. Wayne will be in touch."); reload();
  }
  if (!data) return <p className="ac-lede">Loading your bookings…</p>;
  return (
    <div className="ac-list">
      {data.bundles.map((b) => (
        <div className="ac-bundle" key={b.id}><b>{b.used} of {b.size}</b> bundle listings used · {b.size - b.used} left · use by {longDate(new Date(b.expires * 1000).toISOString().slice(0, 10))}{b.extended ? " (extended)" : ""}
          {b.used < b.size && <button type="button" className="t-btn t-btn-ghost" onClick={() => onBook(true)}>Book a listing</button>}
          {b.canExtend && b.used < b.size && <button type="button" className="t-btn t-btn-ghost" onClick={async () => {
            if (!confirm("Extend your bundle by 1 month? You can only do this once.")) return;
            const r = await api(`/api/acct/bundle/${b.id}/extend`, {}); setMsg(r.error ? r.message : "Extended by 1 month. Check your email for the new end date."); reload();
          }}>Extend by 1 month</button>}</div>
      ))}
      {msg && <p className="ac-ok" role="status">{msg}</p>}
      {data.bookings.length === 0 && <div className="ac-empty"><p>No bookings yet.</p><button type="button" className="t-btn t-btn-primary" onClick={() => onBook(false)}>Book a job</button></div>}
      {data.bookings.map((b) => (
        <article className="ac-card" key={b.ref} id={`booking-${b.ref}`}>
          <header><span className="t-mono">{b.ref}</span>{confirming === b.ref ? <span className="ac-badge ac-confirming">Confirming payment…</span> : <Badge status={b.status} />}</header>
          <h3>{b.service}</h3>
          <p className="ac-meta">{b.postcode}{b.address ? ` · ${b.address}` : ""}</p>
          <dl className="ac-dl">
            <div><dt>{b.confirmedDate ? "Flying on" : "Date wanted"}</dt><dd>{b.confirmedDate ? `${longDate(b.confirmedDate)}${b.confirmedTime ? `, ${b.confirmedTime}` : ""}` : b.wantedDate ? `${longDate(b.wantedDate)}${b.wantedTime ? `, ${b.wantedTime}` : ""}` : "Any date"}</dd></div>
            <div><dt>Price</dt><dd>{money(b.total)}{b.travel ? ` (incl. ${money(b.travel)} travel)` : ""}</dd></div>
            <div><dt>Paid</dt><dd>{money(b.paid)} · {MODE_WORDS[b.mode]}</dd></div>
          </dl>
          {b.files && <a className="t-btn t-btn-primary" href={b.files} target="_blank" rel="noopener">Open your files ↗</a>}
          {b.filesWaiting && <p className="ac-note">Your files are ready. Pay the balance to unlock them.</p>}
          <div className="ac-actions">
            {confirming === b.ref && <p className="ac-note" role="status">Thanks, Stripe has taken your payment. Just confirming it now; you don&apos;t need to pay again.</p>}
            {b.owed > 0 && confirming !== b.ref && <button type="button" className="t-btn t-btn-primary" disabled={busy === b.ref} onClick={() => pay(b.ref)}>Pay {money(b.owed)}</button>}
            {!["cancelled", "delivered", "cancel_requested"].includes(b.status) && <button type="button" className="t-btn t-btn-ghost" disabled={busy === b.ref} onClick={() => cancel(b.ref)}>{b.status === "confirmed" ? "Ask to cancel" : "Cancel"}</button>}
          </div>
          <p className="ac-small">Booked {when(b.created)} under booking agreement version {b.agreement}.</p>
        </article>
      ))}
    </div>
  );
}

function Book({ hasBundle, startWithBundle, onBooked, config }) {
  const [f, setF] = useState({ service: "", useBundle: startWithBundle, postcode: "", address: "", date: "", time: "", notes: "", bookingAs: "", earlyStart: false, agree: false });
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const zone = zoneFor(f.postcode);
  const p = useMemo(() => ((f.service || f.useBundle) && f.postcode ? priceFor(f.service, f.postcode, { bundleListing: f.useBundle }) : null), [f.service, f.useBundle, f.postcode]);
  const within14 = f.date && f.date < new Date(Date.now() + 14 * 864e5).toISOString().slice(0, 10);
  async function submit(e) {
    e.preventDefault(); setBusy(true); setMsg("");
    const r = await api("/api/acct/book", f);
    setBusy(false);
    if (r.error) return setMsg(r.message);
    onBooked(r.booking);
  }
  return (
    <form className="ac-form ac-book" onSubmit={submit} noValidate>
      <h2>Book a job</h2>
      {hasBundle && <label className="acc-agree"><input type="checkbox" checked={f.useBundle} onChange={(e) => set("useBundle", e.target.checked)} /><span>Use a listing from my bundle (Showcase)</span></label>}
      {!f.useBundle && (
        <div className="t-field"><label htmlFor="bk-svc">What do you need?</label>
          <select id="bk-svc" value={f.service} onChange={(e) => set("service", e.target.value)}>
            <option value="">Choose a service…</option>
            {GROUPS.map((g) => <optgroup key={g} label={g}>{CATALOG.filter((c) => c.group === g).map((c) => <option key={c.id} value={c.id}>{c.name} · {money(c.price)}</option>)}</optgroup>)}
          </select>
        </div>
      )}
      <div className="t-c2">
        <div className="t-field"><label htmlFor="bk-pc">Site postcode</label><input id="bk-pc" autoComplete="postal-code" value={f.postcode} onChange={(e) => set("postcode", e.target.value)} placeholder="TS17 6AB" /><span className="t-hint">{!f.postcode ? "The postcode where the flying happens." : zone ? (zone.fee ? `${zone.name}: +${money(zone.fee)} travel` : `${zone.name}: travel included`) : "Full postcode please, inside the travel zones."}</span></div>
        <div className="t-field"><label htmlFor="bk-addr">First line of the address</label><input id="bk-addr" autoComplete="address-line1" value={f.address} onChange={(e) => set("address", e.target.value)} /></div>
      </div>
      <div className="t-c2">
        <div className="t-field"><label htmlFor="bk-date">Date you&apos;d like</label><input id="bk-date" type="date" min={minDate()} value={f.date} onChange={(e) => set("date", e.target.value)} /><span className="t-hint">Optional. Wayne confirms the date after checking the weather and airspace.</span></div>
        <div className="t-field"><label htmlFor="bk-time">Time you&apos;d like</label><input id="bk-time" value={f.time} onChange={(e) => set("time", e.target.value)} placeholder="e.g. morning, or 10:00" /></div>
      </div>
      <div className="t-field"><label htmlFor="bk-notes">Anything I should know? <span className="if-opt">(optional)</span></label><textarea id="bk-notes" rows={3} value={f.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Access, parking, site rules, what the photos are for" /></div>
      <fieldset className="ac-radio"><legend>Booking as</legend>
        <label><input type="radio" name="as" checked={f.bookingAs === "consumer"} onChange={() => set("bookingAs", "consumer")} /> A private customer (e.g. your own home)</label>
        <label><input type="radio" name="as" checked={f.bookingAs === "business"} onChange={() => set("bookingAs", "business")} /> A business</label>
      </fieldset>
      {f.bookingAs === "consumer" && (
        <div className="ac-note">
          <p>As a private customer you can cancel within 14 days of booking for a full refund (section 7 of the booking agreement).</p>
          {within14 && <label className="acc-agree"><input type="checkbox" checked={f.earlyStart} onChange={(e) => set("earlyStart", e.target.checked)} /><span>Please start within the 14 days. I understand that if I cancel after work has started I pay for the work done, and once it&apos;s complete I lose the right to cancel.</span></label>}
        </div>
      )}
      {p && !p.error && (
        <div className="ac-price">
          <div><span>{p.name}</span><b>{money(p.base)}</b></div>
          {p.travel > 0 && <div><span>Travel ({p.zone.name})</span><b>{money(p.travel)}</b></div>}
          <div className="ac-total"><span>Total</span><b>{money(p.total)}</b></div>
          <div><span>{MODE_WORDS[p.mode]}</span><b>{p.dueNow ? `${money(p.dueNow)} today` : "Nothing today"}</b></div>
        </div>
      )}
      {p?.error && <p className="ac-err">{p.message}</p>}
      <label className="acc-agree"><input type="checkbox" checked={f.agree} onChange={(e) => set("agree", e.target.checked)} /><span>I accept the <Link href="/terms/" target="_blank">booking agreement</Link> (version {config.agreement}).</span></label>
      {msg && <p className="ac-err" role="alert">{msg}</p>}
      <button className="t-btn t-btn-primary" disabled={busy}>{busy ? "Booking…" : p?.dueNow ? `Book and continue to payment` : "Book"}</button>
      {config.test && <p className="ac-test">{config.stripe ? "Test mode: pay on Stripe\u2019s test page with card 4242 4242 4242 4242. No real money moves." : "Test mode: payments are simulated and no money is taken."}</p>}
    </form>
  );
}

function Details({ user, onUser, onGone }) {
  const [f, setF] = useState({ name: user.name, phone: user.phone, company: user.company, marketing: user.marketing });
  const [pw, setPw] = useState({ current: "", password: "", password2: "" });
  const [del, setDel] = useState("");
  const [msg, setMsg] = useState({});
  async function save(e) { e.preventDefault(); const r = await api("/api/acct/profile", f); setMsg({ p: r.error ? r.message : "Saved." }); if (!r.error) onUser(r.user); }
  async function changePw(e) {
    e.preventDefault();
    const p = newPasswordProblem(pw.password, pw.password2); if (p) return setMsg({ pw: p });
    const r = await api("/api/acct/password", { current: pw.current, password: pw.password });
    setMsg({ pw: r.error ? r.message : "Password changed. Other devices have been signed out." });
    if (!r.error) setPw({ current: "", password: "", password2: "" });
  }
  async function remove(e) {
    e.preventDefault();
    if (!confirm("Delete your account? Your details are removed for good. This can't be undone.")) return;
    const r = await api("/api/acct/delete", { password: del });
    if (r.error) return setMsg({ d: r.message });
    onGone();
  }
  return (
    <div className="ac-details">
      <form className="ac-form" onSubmit={save}>
        <h2>Your details</h2>
        <p className="ac-small">Signed in as {user.email}</p>
        <div className="t-field"><label htmlFor="d-name">Name</label><input id="d-name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
        <div className="t-c2">
          <div className="t-field"><label htmlFor="d-co">Company</label><input id="d-co" value={f.company} onChange={(e) => setF({ ...f, company: e.target.value })} /></div>
          <div className="t-field"><label htmlFor="d-ph">Phone</label><input id="d-ph" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></div>
        </div>
        <label className="acc-agree"><input type="checkbox" checked={f.marketing} onChange={(e) => setF({ ...f, marketing: e.target.checked })} /><span>Send me the occasional email about new services.</span></label>
        {msg.p && <p className="ac-ok">{msg.p}</p>}
        <button className="t-btn t-btn-primary">Save</button>
      </form>
      <form className="ac-form" onSubmit={changePw}>
        <h2>Change password</h2>
        <PasswordField id="d-cur" label="Current password" value={pw.current} onChange={(v) => setPw({ ...pw, current: v })} />
        <NewPassword id="d-new" label="New password" value={pw.password} confirm={pw.password2} onChange={(v) => setPw({ ...pw, password: v })} onConfirm={(v) => setPw({ ...pw, password2: v })} />
        {msg.pw && <p className={msg.pw.startsWith("Password changed") ? "ac-ok" : "ac-err"}>{msg.pw}</p>}
        <button className="t-btn t-btn-ghost">Change password</button>
      </form>
      <div className="ac-form">
        <h2>Your data</h2>
        <p className="ac-lede">Download everything held about you in the booking system.</p>
        <a className="t-btn t-btn-ghost" href="/api/acct/export">Download my data</a>
        <form onSubmit={remove} className="ac-danger">
          <h3>Delete my account</h3>
          <p className="ac-small">Your name, email, phone and addresses are deleted. Payment records stay with Stripe for as long as tax law requires.</p>
          <PasswordField id="d-del" label="Your password" value={del} onChange={setDel} />
          {msg.d && <p className="ac-err">{msg.d}</p>}
          <button className="t-btn t-btn-ghost ac-del">Delete my account</button>
        </form>
      </div>
    </div>
  );
}

export default function AccountApp() {
  const [state, setState] = useState({ loading: true });
  const [tab, setTab] = useState("bookings");
  const [data, setData] = useState(null);
  const [bundleStart, setBundleStart] = useState(false);
  const [flash, setFlash] = useState("");
  const load = useCallback(async () => { const r = await api("/api/acct/me"); setState(r.error ? { error: r.message } : { user: r.user, config: r.config }); }, []);
  const reload = useCallback(async () => { const r = await api("/api/acct/bookings"); if (!r.error) setData(r); }, []);
  const [confirming, setConfirming] = useState("");
  useEffect(() => {
    load();
    const h = location.hash;
    if (h.startsWith("#paid-")) setConfirming(h.slice(6));
    if (h.startsWith("#booking-")) setFlash("Payment not finished, so nothing was taken. You can pay whenever you're ready.");
    if (h) history.replaceState(null, "", location.pathname);
  }, [load]);
  // Back from Stripe: check with Stripe until the payment shows (usually straight away)
  useEffect(() => {
    if (!confirming || !state.user) return;
    let stop = false;
    (async () => {
      // Quick checks for 20 seconds, then every 15 seconds for 5 minutes. The Pay
      // button stays hidden meanwhile so nobody pays twice.
      for (let i = 0; i < 28 && !stop; i++) {
        const r = await api(`/api/acct/booking/${confirming}/check`, {});
        if (r.paid) { if (!stop) { setFlash("Payment received, thank you. Your receipt is on its way by email."); setConfirming(""); reload(); } return; }
        if (i === 7 && !stop) setFlash("Stripe has your payment and is still confirming it. You don't need to pay again; it'll show here within a few minutes.");
        await new Promise((ok) => setTimeout(ok, i < 8 ? 2500 : 15000));
      }
      if (!stop) { setFlash("Still waiting for Stripe to confirm. If you paid, you don't need to pay again: Wayne will check and it'll show here. Any questions, just reply to your booking email."); setConfirming(""); reload(); }
    })();
    return () => { stop = true; };
  }, [confirming, state.user, reload]);
  useEffect(() => { if (state.user) reload(); }, [state.user, reload]);

  const topRef = useScrollToTop(`${tab}|${!!state.user}`);
  if (state.loading) return <p className="ac-lede">Loading…</p>;
  if (state.error) return <p className="ac-err">{state.error}</p>;
  const test = state.config?.test && <p className="ac-test ac-banner">{state.config?.stripe ? "Test mode: sign-in codes appear on screen and emails go to the admin outbox. Payments use Stripe\u2019s test checkout (card 4242 4242 4242 4242), so no real money moves." : "Test mode: sign-in codes appear on screen, emails go to the admin outbox, and payments are simulated. Nothing is charged."}</p>;
  if (!state.user) return <div className="ac-wrap" ref={topRef}>{test}<SignIn onDone={(user) => setState((s) => ({ ...s, user }))} /></div>;
  const u = state.user;
  return (
    <div className="ac-wrap ac-in" ref={topRef}>
      {test}
      <div className="ac-top">
        <h2>{greeting(u.name)}</h2>
        <nav className="ac-tabs">
          {[["bookings", "My bookings"], ["book", "Book a job"], ["details", "My details"]].map(([k, w]) => <button key={k} type="button" className={tab === k ? "is-on" : undefined} onClick={() => { setTab(k); setBundleStart(false); }}>{w}</button>)}
          {u.role === "admin" && <a href="/admin/">Admin</a>}
          <button type="button" onClick={async () => { await api("/api/acct/logout", {}); setState((s) => ({ ...s, user: null })); setData(null); }}>Sign out</button>
        </nav>
      </div>
      {flash && <p className="ac-ok">{flash}</p>}
      {tab === "bookings" && <Bookings data={data} confirming={confirming} reload={reload} onBook={(b) => { setBundleStart(b); setTab("book"); }} />}
      {tab === "book" && <Book config={state.config} hasBundle={!!data?.bundles?.some((b) => b.used < b.size)} startWithBundle={bundleStart} onBooked={() => { setFlash("Booked. Check your bookings for what happens next."); setTab("bookings"); reload(); }} />}
      {tab === "details" && <Details user={u} onUser={(user) => setState((s) => ({ ...s, user }))} onGone={() => { setState((s) => ({ ...s, user: null })); setFlash(""); alert("Your account has been deleted."); }} />}
    </div>
  );
}
