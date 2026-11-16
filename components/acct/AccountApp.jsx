"use client";
/* The customer's account at /account: their bookings, booking and paying,
   their details, downloading their data and deleting their account.
   Talks to /api/acct (functions/api/acct/[[path]].js). */
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import SignIn from "./SignIn";
import { api, STATUS, longDate, when } from "@/lib/acct/client";
import { PasswordField, NewPassword, newPasswordProblem } from "./PasswordField";
import { CATALOG, priceFor, zoneFor, MODE_WORDS, bundleSize, greeting, optionsFor, TIME_CHOICES, dateProblem, ukToday, addDays } from "@/lib/acct/catalog";
import { money } from "@/lib/site";
import useScrollToTop from "@/components/useScrollToTop";

const GROUPS = [...new Set(CATALOG.map((c) => c.group))];
const minDate = () => addDays(ukToday(), 2);
const maxDate = () => addDays(ukToday(), 366);

/* The time box: the same choices as the quote form, nothing typed */
function TimeSelect({ id, value, onChange }) {
  return (
    <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">Any time that day</option>
      {TIME_CHOICES.map((t) => <option key={t} value={t}>{t}</option>)}
    </select>
  );
}
/* Link to the job page: hour-by-hour weather for that day and place */
const weatherLink = (postcode, date, time) => `/map/?pc=${encodeURIComponent(postcode)}${date ? `&d=${date}` : ""}${/^\d\d:\d\d$/.test(time || "") ? `&h=${time}` : ""}`;

/* Ask for a different date. Before Wayne confirms it just changes; after, he has to agree. */
function MoveDate({ b, onDone }) {
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ date: "", time: "" });
  const [msg, setMsg] = useState(""); const [busy, setBusy] = useState(false);
  if (["cancelled", "delivered", "cancel_requested"].includes(b.status)) return null;
  if (b.moveRequest) return <p className="ac-note" role="status">You&apos;ve asked to move this to {longDate(b.moveRequest.date)}{b.moveRequest.time ? `, ${b.moveRequest.time}` : ""}. Wayne will confirm or get in touch. Until then it stays on its current date.</p>;
  if (!open) return <button type="button" className="t-btn t-btn-ghost" onClick={() => setOpen(true)} title="Pick a different day. Before Wayne confirms, it changes straight away. After he confirms, he has to agree the new date.">Change the date</button>;
  async function send(e) {
    e.preventDefault(); const p = dateProblem(f.date); if (p) return setMsg(p);
    setBusy(true); const r = await api(`/api/acct/booking/${b.ref}/date`, f); setBusy(false);
    if (r.error) return setMsg(r.message);
    setOpen(false); onDone(r.message);
  }
  return (
    <form className="ac-move" onSubmit={send} noValidate>
      <div className="t-c2">
        <div className="t-field"><label htmlFor={`mv-d-${b.ref}`}>New date</label><input id={`mv-d-${b.ref}`} type="date" min={minDate()} max={maxDate()} value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} required /></div>
        <div className="t-field"><label htmlFor={`mv-t-${b.ref}`}>Time</label><TimeSelect id={`mv-t-${b.ref}`} value={f.time} onChange={(v) => setF({ ...f, time: v })} /></div>
      </div>
      {f.date && <a className="ac-link" href={weatherLink(b.postcode, f.date, f.time)} target="_blank" rel="noopener">See the weather for that day ↗</a>}
      {msg && <p className="ac-err" role="alert">{msg}</p>}
      <div className="ac-actions"><button className="t-btn t-btn-primary" disabled={busy}>{busy ? "Sending…" : b.go ? "Ask Wayne for this date" : "Change to this date"}</button><button type="button" className="ac-link" onClick={() => setOpen(false)}>Keep the current date</button></div>
    </form>
  );
}

function Badge({ status }) { const [w, c] = STATUS[status] || [status, "info"]; return <span className={`ac-badge ac-${c}`}>{w}</span>; }

function Bookings({ data, reload, onBook, onSign, confirming }) {
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
        <article className={`ac-card${b.go && b.status === "confirmed" ? " ac-go" : ""}${b.status === "awaiting_signature" || b.changes ? " ac-todo" : ""}`} key={b.ref} id={`booking-${b.ref}`}>
          {b.go && b.status === "confirmed" && <p className="ac-go-banner">✓ Confirmed: it&apos;s a go{b.confirmedDate ? ` · ${longDate(b.confirmedDate)}${b.confirmedTime ? `, ${b.confirmedTime}` : ""}` : ""}</p>}
          <header><span className="t-mono">{b.ref}</span>{confirming === b.ref ? <span className="ac-badge ac-confirming">Confirming payment…</span> : <Badge status={b.status} />}</header>
          <h3>{b.service}</h3>
          <p className="ac-meta">{b.postcode}{b.address ? ` · ${b.address}` : ""}</p>
          <dl className="ac-dl">
            <div><dt>{b.confirmedDate ? "Flying on" : "Date wanted"}</dt><dd>{b.confirmedDate ? `${longDate(b.confirmedDate)}${b.confirmedTime ? `, ${b.confirmedTime}` : ""}` : b.wantedDate ? `${longDate(b.wantedDate)}${b.wantedTime ? `, ${b.wantedTime}` : ""}` : "Any date"}</dd></div>
            <div><dt>Price</dt><dd>{money(b.total)}{b.travel ? ` (incl. ${money(b.travel)} travel)` : ""}</dd></div>
            <div><dt>Paid</dt><dd>{money(b.paid)} · {MODE_WORDS[b.mode]}</dd></div>
          </dl>
          {b.status === "awaiting_signature" && <div className="ac-next"><p><b>Next step:</b> read and sign your booking agreement{b.dueNow ? `, then pay ${money(b.dueNow)}` : ""}.</p><button type="button" className="t-btn t-btn-primary" onClick={() => onSign(b.ref)}>Sign the agreement</button></div>}
          {b.changes && (
            <div className="ac-next ac-changes"><p><b>Wayne has updated your booking.</b> Please check and approve:</p>
              <ul>{b.changes.map((c) => <li key={c.key}>{c.label}: <s>{c.from || "–"}</s> → <b>{c.to || "–"}</b></li>)}</ul>
              <button type="button" className="t-btn t-btn-primary" onClick={() => onSign(b.ref)}>Review and approve</button></div>
          )}
          {b.files && <a className="t-btn t-btn-primary" href={b.files} target="_blank" rel="noopener">Open your files ↗</a>}
          {(b.receipts?.length > 0 || b.invoice) && (
            <p className="ac-docs">{b.invoice && <a href={`/api/acct/booking/${b.ref}/invoice`} target="_blank" rel="noopener">Invoice {b.invoice} ↗</a>}
              {b.receipts?.map((r) => <a key={r.id} href={`/api/acct/booking/${b.ref}/receipt/${r.id}`} target="_blank" rel="noopener">Receipt {r.no}: {money(r.amount)} ↗</a>)}</p>
          )}
          {b.filesWaiting && <p className="ac-note">Your files are ready. Pay the balance to unlock them.</p>}
          <div className="ac-actions">
            {confirming === b.ref && <p className="ac-note" role="status">Thanks, Stripe has taken your payment. Just confirming it now; you don&apos;t need to pay again.</p>}
            {b.owed > 0 && b.signed && !b.changes && confirming !== b.ref && <button type="button" className="t-btn t-btn-primary" disabled={busy === b.ref} onClick={() => pay(b.ref)}>Pay {money(b.owed)}</button>}
            <MoveDate b={b} onDone={(m) => { setMsg(m); reload(); }} />
            {!["cancelled", "delivered", "cancel_requested"].includes(b.status) && <button type="button" className="t-btn t-btn-ghost" disabled={busy === b.ref} onClick={() => cancel(b.ref)}>{b.status === "confirmed" ? "Ask to cancel" : "Cancel"}</button>}
          </div>
          <p className="ac-small">Booked {when(b.created)}.{b.signed ? <> Signed {when(b.signedAt)}, agreement version {b.agreement} · <a href={`/api/acct/booking/${b.ref}/agreement/${b.signatureId}`} target="_blank" rel="noopener">Your signed agreement ↗</a></> : " Not signed yet."}{b.refunded ? ` Refunded ${money(b.refunded)}.` : ""}</p>
        </article>
      ))}
    </div>
  );
}

/* Read and sign the booking agreement (or approve Wayne's changes) */
function SignView({ refId, onDone, onBack, config }) {
  const [d, setD] = useState(null);
  const [f, setF] = useState({ name: "", agree: false, earlyStart: false });
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(null);
  useEffect(() => { api(`/api/acct/booking/${refId}/agreement`).then((r) => { if (r.error) setMsg(r.message); else { setD(r); setF((x) => ({ ...x, earlyStart: r.early })); } }); }, [refId]);
  async function sign(e) {
    e.preventDefault(); setMsg(""); setBusy(true);
    const r = await api(`/api/acct/booking/${refId}/sign`, f); setBusy(false);
    if (r.error) return setMsg(r.message);
    setDone(r);
  }
  async function decline() {
    if (!confirm("Decline these changes? Your booking stays as it was, and Wayne will be in touch.")) return;
    const r = await api(`/api/acct/booking/${refId}/decline`, {}); if (r.error) return setMsg(r.message); onDone("Changes declined. Your booking stays as it was; Wayne will be in touch.");
  }
  async function pay() {
    setBusy(true); const r = await api(`/api/acct/booking/${refId}/pay`, {}); setBusy(false);
    if (r.url) { location.href = r.url; return; }
    if (r.error) return setMsg(r.message);
    onDone("Payment recorded (test mode, no money taken). Wayne will confirm your date.");
  }
  if (!d) return <div className="ac-form"><p className="ac-lede">{msg || "Loading your agreement…"}</p><button type="button" className="ac-link" onClick={onBack}>← Back to my bookings</button></div>;
  if (done) {
    const owed = done.booking.owed;
    return (
      <div className="ac-form ac-signed" role="status">
        <h2>Signed. Thank you.</h2>
        <p>A copy of your signed agreement is on its way to your email. It&apos;s also in your account whenever you need it.</p>
        <p className="ac-small">Fingerprint: <span className="t-mono ac-fp">{done.fingerprint}</span></p>
        {owed > 0 ? (<>
          <p><b>Last step:</b> pay {done.booking.paid ? "the extra" : done.booking.mode === "deposit" ? "the deposit" : "for your booking"} of {money(owed)} to secure your date.</p>
          {msg && <p className="ac-err" role="alert">{msg}</p>}
          <button type="button" className="t-btn t-btn-primary" disabled={busy} onClick={pay}>{busy ? "Opening payment…" : `Pay ${money(owed)}`}</button>
          {config.test && <p className="ac-test">Test mode: {config.stripe ? "use card 4242 4242 4242 4242 on Stripe\u2019s test page." : "payment is simulated."} No real money moves.</p>}
        </>) : <p><b>Next:</b> Wayne checks the weather and airspace and confirms your date, usually within a day.</p>}
        <button type="button" className="ac-link" onClick={() => onDone("")}>Back to my bookings</button>
      </div>
    );
  }
  if (!d.toSign) return <div className="ac-form"><p>There&apos;s nothing to sign on this booking.</p><button type="button" className="ac-link" onClick={onBack}>← Back to my bookings</button></div>;
  const change = d.toSign === "change";
  return (
    <form className="ac-form ac-sign" onSubmit={sign} noValidate>
      <ol className="ac-progress" aria-label="Booking steps">
        {["Book", change ? "Approve changes" : "Sign", "Pay", "Wayne confirms"].map((t, i) => <li key={t} className={i === 0 || (change && i > 1) ? "is-done" : i === 1 ? "is-on" : undefined}>{t}</li>)}
      </ol>
      <h2>{change ? "Approve the changes to your booking" : "Your booking agreement"}</h2>
      <p className="ac-lede">{change ? "Wayne has updated your booking as you discussed. Check the changes, then sign to approve them, or decline to keep it as it was." : <>Please read it all. It&apos;s the agreement every customer signs, with your Job Details filled in. Booking <b>{d.ref}</b>.</>}</p>
      {change && d.changes && (
        <div className="ac-changes"><h3>What&apos;s changing</h3>
          <ul>{d.changes.map((c) => <li key={c.key}><b>{c.label}:</b> <s>{c.from || "–"}</s> → <b>{c.to || "–"}</b></li>)}</ul>
          {d.dueAfter > 0 && <p className="ac-small">After you approve, there&apos;s {money(d.dueAfter)} more to pay before your date.</p>}
        </div>
      )}
      <h3>Job Details</h3>
      <div className="ac-jobd"><table><tbody>{d.rows.map(([k, v]) => <tr key={k}><th scope="row">{k}</th><td>{v}</td></tr>)}</tbody></table></div>
      <h3>The terms <span className="ac-small">(version {d.version})</span></h3>
      <div className="ac-terms" tabIndex={0} aria-label="Booking agreement terms" dangerouslySetInnerHTML={{ __html: d.terms + d.cancel }} />
      <p className="ac-small"><a href="/terms/" target="_blank" rel="noopener">Open the agreement full screen ↗</a></p>
      {d.consumer && d.askEarly && (
        <div className="ac-note">
          <label className="acc-agree"><input type="checkbox" checked={f.earlyStart} onChange={(e) => setF({ ...f, earlyStart: e.target.checked })} /><span><b>Please start within the 14-day cancellation period.</b> I understand that if I cancel after work has started, I&apos;ll pay for the work done. Once the work is complete, I lose my right to cancel.</span></label>
          {!f.earlyStart && <p className="ac-small">Leave this unticked and the shoot can&apos;t take place until the 14 days are up.</p>}
        </div>
      )}
      <div className="t-field"><label htmlFor="sg-name">Type your full name to sign</label><input id="sg-name" className="ac-signame" autoComplete="name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder={d.name} /><span className="t-hint">As it is on your account: {d.name}</span></div>
      <label className="acc-agree"><input type="checkbox" checked={f.agree} onChange={(e) => setF({ ...f, agree: e.target.checked })} /><span>I&apos;ve read and agree to the Happy Drones Booking Agreement (version {d.version}) and the Job Details above. Typing my name is my signature.</span></label>
      {msg && <p className="ac-err" role="alert">{msg}</p>}
      <button className="t-btn t-btn-primary" disabled={busy}>{busy ? "Signing…" : change ? "Sign to approve the changes" : "Sign the agreement"}</button>
      {change ? <button type="button" className="t-btn t-btn-ghost" onClick={decline}>Decline the changes</button> : <button type="button" className="ac-link" onClick={onBack}>Not now, back to my bookings</button>}
      <p className="ac-small">When you sign, we record your name, the time, your IP address and an exact copy of what you signed, and email you a copy.</p>
    </form>
  );
}

function Book({ hasBundle, startWithBundle, onBooked, config, initialService = "" }) {
  const [f, setF] = useState({ service: CATALOG.some((c) => c.id === initialService) ? initialService : "", useBundle: startWithBundle, postcode: "", address: "", date: "", time: "", notes: "", bookingAs: "", size: 0, extras: [], buildings: 1, owner: "" });
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const zone = zoneFor(f.postcode);
  const pick = (id) => setF((s) => ({ ...s, service: id, size: 0, extras: [], buildings: 1 }));
  const toggle = (id) => setF((s) => ({ ...s, extras: s.extras.includes(id) ? s.extras.filter((x) => x !== id) : [...s.extras, id] }));
  const opts = useMemo(() => optionsFor(f.useBundle ? "" : f.service), [f.service, f.useBundle]);
  const buyingBundle = f.service === "bundle" && !f.useBundle;
  const p = useMemo(() => ((f.service || f.useBundle) && f.postcode ? priceFor(f.service, f.postcode, { bundleListing: f.useBundle, size: f.size, extras: f.extras, buildings: f.buildings }) : null), [f.service, f.useBundle, f.postcode, f.size, f.extras, f.buildings]);
  const dateMsg = f.date ? dateProblem(f.date) : "";
  async function submit(e) {
    e.preventDefault(); setMsg("");
    if (dateMsg) return setMsg(dateMsg);
    if (!buyingBundle && f.owner === "not-yet") return setMsg("I can only fly a property with the owner's OK. Ask the owner (or the seller's agent) first, then book.");
    setBusy(true);
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
          <select id="bk-svc" value={f.service} onChange={(e) => pick(e.target.value)}>
            <option value="">Choose a service…</option>
            {GROUPS.map((g) => <optgroup key={g} label={g}>{CATALOG.filter((c) => c.group === g).map((c) => <option key={c.id} value={c.id}>{c.name} · {money(c.price)}</option>)}</optgroup>)}
          </select>
        </div>
      )}
      {opts.sizes.length > 1 && (
        <div className="t-field"><label htmlFor="bk-size">{opts.sizeTitle}</label>
          <select id="bk-size" value={f.size} onChange={(e) => set("size", Number(e.target.value))}>
            {opts.sizes.map((z) => <option key={z.i} value={z.i}>{z.name}{z.add ? ` (+${money(z.add)})` : ""}</option>)}
          </select>
        </div>
      )}
      {opts.perBuilding && (
        <div className="t-field"><label htmlFor="bk-bld">How many buildings on this visit?</label>
          <input id="bk-bld" type="number" min={1} max={20} value={f.buildings} onChange={(e) => set("buildings", Math.max(1, Math.min(20, Number(e.target.value) || 1)))} />
          <span className="t-hint">Each building is a separate check and a separate report.</span></div>
      )}
      {opts.extras.length > 0 && (
        <fieldset className="ac-extras"><legend>Extras <span className="if-opt">(optional)</span></legend>
          {opts.extras.map((x) => <label key={x.id}><input type="checkbox" checked={f.extras.includes(x.id)} onChange={() => toggle(x.id)} /> {x.name} <b>+{money(x.price)}</b></label>)}
        </fieldset>
      )}
      <div className="t-c2">
        <div className="t-field"><label htmlFor="bk-pc">Site postcode</label><input id="bk-pc" autoComplete="postal-code" value={f.postcode} onChange={(e) => set("postcode", e.target.value)} placeholder="TS17 6AB" /><span className="t-hint">{!f.postcode ? "The postcode sets any travel fee." : zone ? zone.name : "Check the postcode: the full one, e.g. TS17 6AB."}</span></div>
        <div className="t-field"><label htmlFor="bk-addr">First line of the address</label><input id="bk-addr" autoComplete="address-line1" value={f.address} onChange={(e) => set("address", e.target.value)} /></div>
      </div>
      {!buyingBundle && (
        <div className="t-c2">
          <div className="t-field"><label htmlFor="bk-date">Date you&apos;d like</label><input id="bk-date" type="date" min={minDate()} max={maxDate()} value={f.date} onChange={(e) => set("date", e.target.value)} required />
            <span className="t-hint">{dateMsg || "Wayne confirms it after checking the weather and the airspace."}</span></div>
          <div className="t-field"><label htmlFor="bk-time">Time you&apos;d like</label><TimeSelect id="bk-time" value={f.time} onChange={(v) => set("time", v)} />
            {f.date && !dateMsg && zone && <a className="ac-link" href={weatherLink(f.postcode, f.date, f.time)} target="_blank" rel="noopener">See the weather hour by hour for that day ↗</a>}</div>
        </div>
      )}
      {!buyingBundle && (
        <fieldset className="ac-radio"><legend>The property</legend>
          <label><input type="radio" name="owner" checked={f.owner === "own"} onChange={() => set("owner", "own")} /> I own it</label>
          <label><input type="radio" name="owner" checked={f.owner === "act"} onChange={() => set("owner", "act")} /> I act for the owner (estate agent, letting agent, manager)</label>
          <label><input type="radio" name="owner" checked={f.owner === "agreed"} onChange={() => set("owner", "agreed")} /> It isn&apos;t mine, but the owner has agreed (for example, I&apos;m buying it)</label>
          <label><input type="radio" name="owner" checked={f.owner === "not-yet"} onChange={() => set("owner", "not-yet")} /> It isn&apos;t mine and I haven&apos;t asked the owner yet</label>
          {f.owner === "agreed" && <p className="ac-note">Fine: Wayne will ask to see the owner&apos;s OK (an email or message is enough) before he flies.</p>}
          {f.owner === "not-yet" && <p className="ac-err">I can only fly with the owner&apos;s OK. If you&apos;re buying, ask the seller or their estate agent first.</p>}
        </fieldset>
      )}
      <div className="t-field"><label htmlFor="bk-notes">Anything I should know? <span className="if-opt">(optional)</span></label><textarea id="bk-notes" rows={3} value={f.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Access, parking, site contact, keys…" /></div>
      <fieldset className="ac-radio"><legend>Booking as</legend>
        <label><input type="radio" name="as" checked={f.bookingAs === "consumer"} onChange={() => set("bookingAs", "consumer")} /> A private customer (e.g. your own home)</label>
        <label><input type="radio" name="as" checked={f.bookingAs === "business"} onChange={() => set("bookingAs", "business")} /> A business</label>
      </fieldset>
      {f.bookingAs === "consumer" && (
        <div className="ac-note">
          <p>As a private customer you can cancel within 14 days of booking for a full refund (section 7 of the booking agreement).</p>
        </div>
      )}
      {p && !p.error && (
        <div className="ac-price">
          {(p.lines?.length ? p.lines : [[p.name, p.base]]).map(([n, v], i) => <div key={i}><span>{n}</span><b>{money(v)}</b></div>)}
          {p.travel > 0 && <div><span>Travel ({p.zone.name})</span><b>{money(p.travel)}</b></div>}
          <div className="ac-total"><span>Total</span><b>{money(p.total)}</b></div>
          <div><span>{MODE_WORDS[p.mode]}</span><b>{p.dueNow ? `${money(p.dueNow)} today` : "Nothing today"}</b></div>
        </div>
      )}
      {p?.error && <p className="ac-err">{p.message}</p>}
      <p className="ac-steps"><b>Next:</b> read and sign the <Link href="/terms/" target="_blank">booking agreement</Link> with your details filled in{p?.dueNow ? ", then pay" : ""}. Wayne then confirms your date.</p>
      {msg && <p className="ac-err" role="alert">{msg}</p>}
      <button className="t-btn t-btn-primary" disabled={busy}>{busy ? "Saving…" : "Continue to the agreement"}</button>
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
  const [signing, setSigning] = useState("");
  const [initialService, setInitialService] = useState("");
  useEffect(() => {
    load();
    const h = location.hash;
    if (h.startsWith("#paid-")) setConfirming(h.slice(6));
    if (h.startsWith("#sign-")) setSigning(h.slice(6));
    const want = new URLSearchParams(location.search).get("book");
    if (want) { setInitialService(want); setTab("book"); history.replaceState(null, "", location.pathname); }
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

  const topRef = useScrollToTop(`${tab}|${!!state.user}|${signing}`);
  if (state.loading) return <p className="ac-lede">Loading…</p>;
  if (state.error) return <p className="ac-err">{state.error}</p>;
  const test = state.config?.test && <p className="ac-test ac-banner">{state.config?.stripe ? "Test mode: test accounts see their sign-in code on screen (everyone else gets it by email) and emails go to the admin outbox. Payments use Stripe\u2019s test checkout (card 4242 4242 4242 4242), so no real money moves." : "Test mode: test accounts see their sign-in code on screen (everyone else gets it by email), emails go to the admin outbox, and payments are simulated. Nothing is charged."}</p>;
  const wanted = CATALOG.find((c) => c.id === initialService);
  if (!state.user) return <div className="ac-wrap" ref={topRef}>{test}{signing && !wanted && <p className="ac-note ac-want">Your booking is waiting. Sign in, or create a free account <b>with the email address the booking was sent to</b>, and it&apos;ll open for you to sign.</p>}{wanted && <p className="ac-note ac-want">To book <b>{wanted.name}</b>, sign in or create a free account. It takes a minute, and your bookings, signed agreements and files stay in one place.</p>}<SignIn onDone={(user) => setState((s) => ({ ...s, user }))} /></div>;
  const u = state.user;
  return (
    <div className="ac-wrap ac-in" ref={topRef}>
      {test}
      <div className="ac-top">
        <h2>{greeting(u.name)}</h2>
        <nav className="ac-tabs">
          {[["bookings", "My bookings"], ["book", "Book a job"], ["details", "My details"]].map(([k, w]) => <button key={k} type="button" className={tab === k ? "is-on" : undefined} onClick={() => { setTab(k); setBundleStart(false); setSigning(""); }}>{w}</button>)}
          {u.role === "admin" && <a href="/admin/">Admin</a>}
          <button type="button" onClick={async () => { await api("/api/acct/logout", {}); setState((s) => ({ ...s, user: null })); setData(null); }}>Sign out</button>
        </nav>
      </div>
      {flash && <p className="ac-ok">{flash}</p>}
      {signing && <SignView refId={signing} config={state.config} onBack={() => { setSigning(""); setTab("bookings"); reload(); }} onDone={(m) => { setSigning(""); setTab("bookings"); if (m) setFlash(m); reload(); }} />}
      {!signing && tab === "bookings" && <Bookings data={data} onSign={(ref) => { setFlash(""); setSigning(ref); }} confirming={confirming} reload={reload} onBook={(b) => { setBundleStart(b); setTab("book"); }} />}
      {!signing && tab === "book" && <Book config={state.config} initialService={initialService} hasBundle={!!data?.bundles?.some((b) => b.used < b.size)} startWithBundle={bundleStart} onBooked={(b) => { setFlash(""); setInitialService(""); setSigning(b.ref); reload(); }} />}
      {!signing && tab === "details" && <Details user={u} onUser={(user) => setState((s) => ({ ...s, user }))} onGone={() => { setState((s) => ({ ...s, user: null })); setFlash(""); alert("Your account has been deleted."); }} />}
    </div>
  );
}
