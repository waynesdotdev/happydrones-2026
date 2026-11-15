"use client";
/* Wayne's admin at /admin: bookings (confirm, mark paid, deliver, cancel),
   customers (view, export, delete), the email outbox, the activity log,
   and test tools. Talks to /api/admin (functions/api/admin/[[path]].js). */
import { useCallback, useEffect, useState } from "react";
import SignIn from "./SignIn";
import { api, STATUS, longDate, when } from "@/lib/acct/client";
import { money } from "@/lib/site";
import useScrollToTop from "@/components/useScrollToTop";
import AdminEnquiries from "./AdminEnquiries";

const FILTERS = [["", "All"], ["awaiting_payment", "Waiting for payment"], ["requested", "Date to confirm"], ["confirmed", "Confirmed"], ["delivered", "Delivered"], ["cancel_requested", "Cancel requests"], ["cancelled", "Cancelled"]];
function Badge({ status }) { const [w, c] = STATUS[status] || [status, "info"]; return <span className={`ac-badge ac-${c}`}>{w}</span>; }
const calLink = (b) => {
  const d = (b.confirmed_date || "").replace(/-/g, "");
  const t = /^\d{1,2}:\d{2}$/.test(b.confirmed_time || "") ? b.confirmed_time.padStart(5, "0").replace(":", "") + "00" : "100000";
  const end = String(Number(t.slice(0, 2)) + 2).padStart(2, "0") + t.slice(2);
  const p = new URLSearchParams({ action: "TEMPLATE", text: `${b.service} · ${b.postcode} (${b.ref})`, dates: `${d}T${t}/${d}T${end}`, ctz: "Europe/London", location: `${b.address ? `${b.address}, ` : ""}${b.postcode}`, details: `${b.name || ""} ${b.email || ""} ${b.phone || ""}\n${b.notes || ""}\nhttps://happydrones.co.uk/admin/` });
  return `https://calendar.google.com/calendar/render?${p}`;
};

function BookingPanel({ refId, onClose, onChanged }) {
  const [d, setD] = useState(null);
  const [f, setF] = useState({ date: "", time: "", files: "", amount: "", how: "", note: "", reason: "", refund: "", refundHow: "", anyway: false });
  const [ed, setEd] = useState(null);
  const [msg, setMsg] = useState("");
  const load = useCallback(async () => { const r = await api(`/api/admin/booking/${refId}`); if (!r.error) { setD(r); setF((x) => ({ ...x, date: r.booking.confirmed_date || r.booking.wanted_date || "", time: r.booking.confirmed_time || r.booking.wanted_time || "", files: r.booking.files || "", note: r.booking.admin_note || "", anyway: false }));
    const k = r.booking; setEd({ service: k.service, address: k.address || "", postcode: k.postcode, deliverables: k.deliverables || "", delivery: k.delivery || "", licence: k.licence || "", branding: k.branding || "", extras: k.extras || "", notes: k.notes || "", total: k.total, travel: k.travel, mode: k.mode, wanted_date: k.wanted_date || "", wanted_time: k.wanted_time || "" }); } }, [refId]);
  useEffect(() => { load(); }, [load]);
  async function act(action, extra = {}) {
    if (action === "cancel" && !confirm("Cancel this booking? The customer is emailed. Refund any payment in Stripe yourself.")) return;
    const r = await api(`/api/admin/booking/${refId}`, action === "refund" ? { action, amount: f.refund, how: f.refundHow } : { action, ...f, ...extra });
    setMsg(r.error ? r.message : "Done."); if (!r.error) { load(); onChanged(); }
  }
  if (!d) return <div className="ad-panel"><p>Loading…</p></div>;
  const b = d.booking;
  return (
    <div className="ad-panel" role="dialog" aria-label={`Booking ${b.ref}`}>
      <div className="ad-panel-head"><span className="t-mono">{b.ref}</span><Badge status={b.status} /><button type="button" className="ac-link" onClick={onClose}>Close ✕</button></div>
      <h3>{b.service}</h3>
      <dl className="ac-dl">
        <div><dt>Customer</dt><dd>{b.name || (b.invite_email ? `${b.invite_email} (no account yet)` : "Deleted customer")}{b.company ? `, ${b.company}` : ""}<br />{b.email} {b.phone}</dd></div>
        <div><dt>Site</dt><dd>{b.address ? `${b.address}, ` : ""}{b.postcode} · <a href={`/map/?pc=${encodeURIComponent(b.postcode)}&c=${b.ref}&m=${encodeURIComponent(b.service)}&d=${b.wanted_date || ""}`} target="_blank">job page ↗</a></dd></div>
        <div><dt>Wanted</dt><dd>{longDate(b.wanted_date) || "Any date"} {b.wanted_time}</dd></div>
        <div><dt>Money</dt><dd>{money(b.total)} total{b.travel ? ` (incl. ${money(b.travel)} travel)` : ""} · paid {money(b.paid)} · {b.mode}</dd></div>
        <div><dt>Booked as</dt><dd>{b.booking_as}{b.early_start ? ", asked to start within 14 days" : ""}</dd></div>
        <div><dt>Agreement</dt><dd>{d.signatures.length ? d.signatures.map((g) => <span key={g.id} className="ad-sig">{g.kind === "change" ? "Changes approved" : "Signed"} by {g.name}, {when(g.at)} · <a href={`/api/admin/booking/${b.ref}/agreement/${g.id}`} target="_blank" rel="noopener">view ↗</a><br /></span>) : <b className="ad-warn">Not signed yet</b>}</dd></div>
        {b.refunded > 0 && <div><dt>Refunded</dt><dd>{money(b.refunded)}</dd></div>}
        {b.notes && <div><dt>Their notes</dt><dd>{b.notes}</dd></div>}
      </dl>
      {d.changes && (
        <div className="ac-next ac-changes"><p><b>Waiting for them to approve your changes:</b></p>
          <ul>{d.changes.map((c) => <li key={c.key}>{c.label}: <s>{c.from || "–"}</s> → <b>{c.to || "–"}</b></li>)}</ul>
          <button type="button" className="t-btn t-btn-ghost" onClick={() => act("undo-changes")}>Withdraw the changes</button></div>
      )}
      <div className="ad-acts">
        <fieldset className="ad-go"><legend>{b.go_at ? "Change the confirmed date" : "It\u2019s a go: confirm the date"}</legend>
          <div className="t-c2"><input type="date" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} aria-label="Date" /><input value={f.time} onChange={(e) => setF({ ...f, time: e.target.value })} placeholder="10:00" aria-label="Time" /></div>
          {b.mode !== "invoice" && b.paid < b.due_now && <label className="acc-agree"><input type="checkbox" checked={f.anyway} onChange={(e) => setF({ ...f, anyway: e.target.checked })} /><span>Confirm before the {money(b.due_now - b.paid)} is paid</span></label>}
          <button type="button" className="t-btn t-btn-primary" disabled={!d.signatures.length || !!d.changes} onClick={() => act("confirm")}>{b.go_at ? "Save new date and email them" : "It\u2019s a go: confirm and email them"}</button>
          {(!d.signatures.length || d.changes) && <p className="ac-small">{!d.signatures.length ? "Waiting for them to sign the agreement." : "Waiting for them to approve your changes."}</p>}
          {b.confirmed_date && <a className="t-btn t-btn-ghost" href={calLink(b)} target="_blank" rel="noopener">Add to Google Calendar ↗</a>}
        </fieldset>
        <fieldset><legend>Deliver</legend>
          <input value={f.files} onChange={(e) => setF({ ...f, files: e.target.value })} placeholder="Google Drive folder link" aria-label="Files link" />
          <button type="button" className="t-btn t-btn-primary" onClick={() => act("deliver")}>Mark delivered and email them</button>
          <p className="ac-small">On a deposit booking, the files unlock once the balance is paid.</p>
        </fieldset>
        <fieldset><legend>Record a payment (bank transfer, invoice)</legend>
          <div className="t-c2"><input inputMode="numeric" value={f.amount} onChange={(e) => setF({ ...f, amount: e.target.value })} placeholder={`£ up to ${b.total - b.paid}`} aria-label="Amount" /><input value={f.how} onChange={(e) => setF({ ...f, how: e.target.value })} placeholder="How: bank transfer, invoice 123" aria-label="How" /></div>
          <button type="button" className="t-btn t-btn-ghost" onClick={() => act("paid")}>Record payment</button>
        </fieldset>
        {ed && (
          <details className="ad-edit"><summary>Edit the booking (agreed by phone, WhatsApp or email)</summary>
            <p className="ac-small">{d.signatures.length ? "They've signed, so changes to the service, address, what's included, price or terms are sent to them to approve. Date and time wanted change straight away." : "Not signed yet, so changes apply straight away and they sign the updated version."}</p>
            <div className="t-c2">
              <div className="t-field"><label htmlFor="ed-svc">Service and package</label><input id="ed-svc" value={ed.service} onChange={(e) => setEd({ ...ed, service: e.target.value })} /></div>
              <div className="t-field"><label htmlFor="ed-ext">Extras agreed</label><input id="ed-ext" value={ed.extras} onChange={(e) => setEd({ ...ed, extras: e.target.value })} placeholder="e.g. 5 extra photos, £30" /></div>
            </div>
            <div className="t-c2">
              <div className="t-field"><label htmlFor="ed-addr">Site address</label><input id="ed-addr" value={ed.address} onChange={(e) => setEd({ ...ed, address: e.target.value })} /></div>
              <div className="t-field"><label htmlFor="ed-pc">Postcode</label><input id="ed-pc" value={ed.postcode} onChange={(e) => setEd({ ...ed, postcode: e.target.value })} /></div>
            </div>
            <div className="t-field"><label htmlFor="ed-del">What they&apos;ll receive</label><textarea id="ed-del" rows={3} value={ed.deliverables} onChange={(e) => setEd({ ...ed, deliverables: e.target.value })} /></div>
            <div className="t-c2">
              <div className="t-field"><label htmlFor="ed-dt">Delivery time</label><input id="ed-dt" value={ed.delivery} onChange={(e) => setEd({ ...ed, delivery: e.target.value })} /></div>
              <div className="t-field"><label htmlFor="ed-lic">Licence (section 9)</label><select id="ed-lic" value={ed.licence} onChange={(e) => setEd({ ...ed, licence: e.target.value })}>{["Personal", "Property marketing", "Business"].map((x) => <option key={x}>{x}</option>)}</select></div>
            </div>
            <div className="t-c2">
              <div className="t-field"><label htmlFor="ed-br">Branding (9.6)</label><select id="ed-br" value={ed.branding} onChange={(e) => setEd({ ...ed, branding: e.target.value })}>{["Not applicable", "Standard", "Agency-branded (included)", "White label"].map((x) => <option key={x}>{x}</option>)}</select></div>
              <div className="t-field"><label htmlFor="ed-mode">Payment terms</label><select id="ed-mode" value={ed.mode} onChange={(e) => setEd({ ...ed, mode: e.target.value })}>{[["deposit", "25% deposit, balance before files"], ["invoice", "Invoice after the visit (3.8)"], ...(["bundle", "full", "none"].includes(b.mode) ? [[b.mode, "Bundle terms (3.10)"]] : [])].map(([v, w]) => <option key={v} value={v}>{w}</option>)}</select></div>
            </div>
            <div className="t-c2">
              <div className="t-field"><label htmlFor="ed-tot">Total price (£)</label><input id="ed-tot" inputMode="numeric" value={ed.total} onChange={(e) => setEd({ ...ed, total: e.target.value })} /></div>
              <div className="t-field"><label htmlFor="ed-tr">Of which travel (£)</label><input id="ed-tr" inputMode="numeric" value={ed.travel} onChange={(e) => setEd({ ...ed, travel: e.target.value })} /></div>
            </div>
            <div className="t-c2">
              <div className="t-field"><label htmlFor="ed-wd">Date wanted</label><input id="ed-wd" type="date" value={ed.wanted_date} onChange={(e) => setEd({ ...ed, wanted_date: e.target.value })} /></div>
              <div className="t-field"><label htmlFor="ed-wt">Time wanted</label><input id="ed-wt" value={ed.wanted_time} onChange={(e) => setEd({ ...ed, wanted_time: e.target.value })} /></div>
            </div>
            <div className="t-field"><label htmlFor="ed-notes">Special notes (in the agreement)</label><textarea id="ed-notes" rows={2} value={ed.notes} onChange={(e) => setEd({ ...ed, notes: e.target.value })} /></div>
            <button type="button" className="t-btn t-btn-primary" onClick={() => act("edit", { changes: ed })}>{d.signatures.length ? "Save and send to them to approve" : "Save changes"}</button>
          </details>
        )}
        <fieldset><legend>Record a refund (after refunding in Stripe or by bank)</legend>
          <div className="t-c2"><input inputMode="numeric" value={f.refund} onChange={(e) => setF({ ...f, refund: e.target.value })} placeholder={`£ up to ${b.paid - (b.refunded || 0)}`} aria-label="Refund amount" /><input value={f.refundHow} onChange={(e) => setF({ ...f, refundHow: e.target.value })} placeholder="How: Stripe, bank transfer" aria-label="Refund how" /></div>
          <button type="button" className="t-btn t-btn-ghost" onClick={() => { if (confirm("Record this refund and email them? Do the actual refund in Stripe or your bank first.")) act("refund"); }}>Record refund</button>
        </fieldset>
        <fieldset><legend>Private note</legend>
          <textarea rows={3} value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} aria-label="Note" />
          <button type="button" className="t-btn t-btn-ghost" onClick={() => act("note")}>Save note</button>
        </fieldset>
        <div className="ac-actions">
          {b.status !== "cancelled" && <button type="button" className="t-btn t-btn-ghost ac-del" onClick={() => act("cancel")}>Cancel booking</button>}
          {["confirmed", "cancelled", "cancel_requested"].includes(b.status) && <button type="button" className="t-btn t-btn-ghost" onClick={() => act("reopen")}>Re-open</button>}
        </div>
        {msg && <p className={msg === "Done." ? "ac-ok" : "ac-err"}>{msg}</p>}
      </div>
      <h4>History</h4>
      <ul className="ad-hist">{d.history.map((h) => <li key={h.id}><span>{when(h.at)}</span> {h.action} {h.detail} <small>{h.actor}</small></li>)}</ul>
    </div>
  );
}

function Bookings() {
  const [status, setStatus] = useState("");
  const [rows, setRows] = useState(null);
  const [open, setOpen] = useState("");
  const load = useCallback(async () => { const r = await api(`/api/admin/bookings${status ? `?status=${status}` : ""}`); setRows(r.bookings || []); }, [status]);
  useEffect(() => { load(); }, [load]);
  return (
    <div>
      <div className="ad-filters">{FILTERS.map(([k, w]) => <button key={k} type="button" className={status === k ? "is-on" : undefined} onClick={() => setStatus(k)}>{w}</button>)}</div>
      {!rows ? <p>Loading…</p> : rows.length === 0 ? <p className="ac-lede">No bookings here.</p> : (
        <div className="ad-table-wrap"><table className="ad-table">
          <thead><tr><th>Ref</th><th>Service</th><th>Customer</th><th>Postcode</th><th>Date</th><th>Total</th><th>Paid</th><th>Status</th></tr></thead>
          <tbody>{rows.map((b) => (
            <tr key={b.ref} onClick={() => setOpen(b.ref)} tabIndex={0} onKeyDown={(e) => e.key === "Enter" && setOpen(b.ref)}>
              <td className="t-mono">{b.ref}</td><td>{b.service}</td><td>{b.name || "Deleted"}</td><td>{b.postcode}</td>
              <td>{longDate(b.confirmed_date || b.wanted_date) || "Any"}</td><td>{money(b.total)}</td><td>{money(b.paid)}</td><td><Badge status={b.status} /></td>
            </tr>))}</tbody>
        </table></div>
      )}
      {open && <BookingPanel refId={open} onClose={() => setOpen("")} onChanged={load} />}
    </div>
  );
}

function Customers() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState(null);
  const [open, setOpen] = useState(null);
  const load = useCallback(async () => { const r = await api(`/api/admin/customers?q=${encodeURIComponent(q)}`); setRows(r.customers || []); }, [q]);
  useEffect(() => { const t = setTimeout(load, 250); return () => clearTimeout(t); }, [load]);
  async function view(id) { const r = await api(`/api/admin/customer/${id}`); setOpen(r.error ? null : r); }
  async function extend(id) {
    if (!confirm("Extend this bundle by 1 month? It's the one extension in 3.10, and the customer gets an email.")) return;
    const r = await api(`/api/admin/bundle/${id}/extend`, {}); if (r.error) return alert(r.message); view(open.customer.id);
  }
  async function del(id) {
    if (!confirm("Delete this customer's account and personal details? Their bookings stay, without their details, for the tax records. This can't be undone.")) return;
    const r = await api(`/api/admin/customer/${id}/delete`, {}); if (r.error) return alert(r.message); setOpen(null); load();
  }
  return (
    <div>
      <input className="ad-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, email or company" aria-label="Search customers" />
      {!rows ? <p>Loading…</p> : (
        <div className="ad-table-wrap"><table className="ad-table">
          <thead><tr><th>Name</th><th>Email</th><th>Company</th><th>Bookings</th><th>Joined</th><th></th></tr></thead>
          <tbody>{rows.map((c) => (
            <tr key={c.id} onClick={() => view(c.id)} tabIndex={0} onKeyDown={(e) => e.key === "Enter" && view(c.id)}>
              <td>{c.name}{c.role === "admin" ? " (admin)" : ""}{c.test ? " · test" : ""}</td><td>{c.email}</td><td>{c.company}</td><td>{c.bookings}</td><td>{when(c.created)}</td><td>{c.verified ? "" : "not verified"}</td>
            </tr>))}</tbody>
        </table></div>
      )}
      {open && (
        <div className="ad-panel" role="dialog" aria-label={open.customer.name}>
          <div className="ad-panel-head"><b>{open.customer.name}</b><button type="button" className="ac-link" onClick={() => setOpen(null)}>Close ✕</button></div>
          <dl className="ac-dl">
            <div><dt>Email</dt><dd>{open.customer.email}</dd></div>
            <div><dt>Phone</dt><dd>{open.customer.phone || "–"}</dd></div>
            <div><dt>Company</dt><dd>{open.customer.company || "–"}</dd></div>
            <div><dt>Marketing emails</dt><dd>{open.customer.marketing ? "Yes" : "No"}</dd></div>
            <div><dt>Joined · last sign-in</dt><dd>{when(open.customer.created)} · {when(open.customer.last_login) || "never"}{open.customer.locked ? " · locked out" : ""}</dd></div>
          </dl>
          <h4>Bookings</h4>
          <ul className="ad-hist">{open.bookings.map((b) => <li key={b.ref}><span className="t-mono">{b.ref}</span> {b.service} · {b.postcode} · {money(b.total)} · {STATUS[b.status]?.[0]}</li>)}</ul>
          {open.bundles.map((b) => (
            <div key={b.id} className="ac-small ad-bundle">
              Bundle: {b.used} of {b.size} used
              {!b.active ? " (not paid yet)" : b.closed ? ` · ended${b.refund ? ` · refund due £${b.refund}` : ""}` : ` · ends ${when(b.expires)}${b.extended ? " (extended)" : ""}`}
              {b.active && !b.closed && !b.extended && <button type="button" className="ac-link" onClick={() => extend(b.id)}> Extend by 1 month</button>}
            </div>
          ))}
          <div className="ac-actions">
            <a className="t-btn t-btn-ghost" href={`/api/admin/customer/${open.customer.id}/export`}>Export their data</a>
            {open.customer.role !== "admin" && <button type="button" className="t-btn t-btn-ghost ac-del" onClick={() => del(open.customer.id)}>Delete customer</button>}
          </div>
        </div>
      )}
    </div>
  );
}

function Outbox() {
  const [rows, setRows] = useState(null);
  useEffect(() => { api("/api/admin/outbox").then((r) => setRows(r.outbox || [])); }, []);
  if (!rows) return <p>Loading…</p>;
  return (
    <div>
      <p className="ac-small">Every email the system sends, kept 30 days. Sign-in codes are hidden. &ldquo;Not sent&rdquo; means real email isn&apos;t switched on yet (or it&apos;s a test address).</p>
      {rows.map((m) => <details className="ad-mail" key={m.id}><summary><span>{when(m.created)}</span> <b>{m.subject}</b> <small>to {m.to_addr} · {m.sent ? "sent" : "not sent"}</small></summary><pre>{m.body}</pre></details>)}
    </div>
  );
}

function Activity() {
  const [rows, setRows] = useState(null);
  useEffect(() => { api("/api/admin/audit").then((r) => setRows(r.audit || [])); }, []);
  if (!rows) return <p>Loading…</p>;
  return <ul className="ad-hist ad-audit">{rows.map((h) => <li key={h.id}><span>{when(h.at)}</span> <b>{h.action}</b> {h.target} {h.detail} <small>{h.actor}</small></li>)}</ul>;
}

function TestTools({ counts, onChanged }) {
  const [f, setF] = useState({ name: "Lynn Fox", email: "lynn.fox@example.com", company: "", password: "" });
  const [msg, setMsg] = useState({});
  const plural = (n, w) => `${n} ${w}${n === 1 ? "" : "s"}`;
  async function create(e) {
    e.preventDefault(); const r = await api("/api/admin/test/customer", f);
    setMsg({ create: r.error ? ["err", r.message] : ["ok", `Created. Sign in at /account as ${f.email}.`] }); if (!r.error) onChanged();
  }
  async function wipe() {
    if (!confirm(`Delete ${plural(counts.testCustomers, "test customer")} and their bookings?`)) return;
    const r = await api("/api/admin/test/wipe", {}); setMsg({ wipe: r.error ? ["err", r.message] : ["ok", `Done: deleted ${plural(r.removed, "test customer")} and their bookings.`] }); if (!r.error) onChanged();
  }
  async function reset() {
    const c = prompt("This deletes every account except yours and every booking. Type RESET to confirm."); if (c === null) return;
    const r = await api("/api/admin/test/reset", { confirm: c.trim().toUpperCase() });
    setMsg({ reset: r.error ? ["err", r.message] : ["ok", `Done: deleted ${plural(r.accounts, "account")} and ${plural(r.bookings, "booking")}. Everything is clear and your admin account is untouched.`] }); if (!r.error) onChanged();
  }
  const Msg = ({ k }) => (msg[k] ? <p className={msg[k][0] === "ok" ? "ac-ok" : "ac-err"} role="status">{msg[k][1]}</p> : null);
  const empty = !counts.customers && !counts.bookings;
  return (
    <div className="ac-details">
      <p className="ad-now"><b>Right now:</b> {plural(counts.customers, "customer account")} ({counts.testCustomers} made here as test), {plural(counts.bookings, "booking")}.</p>
      <form className="ac-form" onSubmit={create}>
        <h2>Create a test customer</h2>
        <p className="ac-small">Marked as test, ready to sign in (no verification email). @example.com addresses never get real emails.</p>
        <div className="t-field"><label htmlFor="tt-n">Name</label><input id="tt-n" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
        <div className="t-field"><label htmlFor="tt-e">Email</label><input id="tt-e" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></div>
        <div className="t-field"><label htmlFor="tt-p">Password</label><input id="tt-p" type="text" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} placeholder="At least 10 characters" /></div>
        <button className="t-btn t-btn-primary">Create test customer</button>
        <Msg k="create" />
      </form>
      <div className="ac-form"><h2>Clear test customers</h2><p className="ac-small">Deletes only the test customers made on this page, and their bookings and bundles. Accounts made through the normal sign-up stay.</p>
        <button type="button" className="t-btn t-btn-ghost ac-del" disabled={!counts.testCustomers} onClick={wipe}>{counts.testCustomers ? `Delete ${plural(counts.testCustomers, "test customer")}` : "No test customers to delete"}</button><Msg k="wipe" /></div>
      <div className="ac-form"><h2>Start completely fresh</h2><p className="ac-small">Deletes every account except yours, plus every booking, signed agreement, bundle, email copy and activity record. Only works in test mode. Use it before testing from scratch, and once more before real customers.</p>
        <button type="button" className="t-btn t-btn-ghost ac-del" disabled={empty} onClick={reset}>{empty ? "Already clear: nothing to reset" : "Reset everything"}</button><Msg k="reset" /></div>
    </div>
  );
}

export default function AdminApp() {
  const [st, setSt] = useState({ loading: true });
  const [tab, setTab] = useState("bookings");
  const [startEnq, setStartEnq] = useState("");
  const topRef = useScrollToTop(tab);
  // Links in Wayne's emails: /admin/#enquiry-Q-123ABC opens that enquiry
  useEffect(() => { const m = location.hash.match(/^#enquiry-(Q-[A-F0-9]{6})$/); if (m) { setStartEnq(m[1]); setTab("enquiries"); history.replaceState(null, "", location.pathname); } }, []);
  const load = useCallback(async () => { const r = await api("/api/admin/overview"); setSt(r.error ? { error: r, loading: false } : r); }, []);
  useEffect(() => { load(); }, [load]);
  if (st.loading) return <p className="ac-lede">Loading…</p>;
  if (st.error?.status === 401) return <div className="ac-wrap"><SignIn adminOnly onDone={load} /></div>;
  if (st.error) return <div className="ac-wrap"><p className="ac-err">{st.error.message}</p>{st.error.status === 403 && <button type="button" className="t-btn t-btn-ghost" onClick={async () => { await api("/api/acct/logout", {}); load(); }}>Sign out</button>}</div>;
  const tabs = [["enquiries", `Enquiries${st.counts.newEnquiries ? ` (${st.counts.newEnquiries} new)` : ""}`], ["bookings", `Bookings (${st.counts.toDo} to do)`], ["customers", `Customers (${st.counts.customers})`], ["outbox", "Emails"], ["activity", "Activity"], ...(st.config.test ? [["test", "Test tools"]] : [])];
  return (
    <div className="ad" ref={topRef}>
      {st.config.test && <p className="ac-test ac-banner">Test mode. Payments {st.config.stripe ? "use Stripe's test checkout (no real money)" : "are simulated"}; emails {st.config.mail ? "are sent" : "go to the outbox only"}.</p>}
      <div className="ac-top">
        <h2>Admin</h2>
        <nav className="ac-tabs">
          {tabs.map(([k, w]) => <button key={k} type="button" className={tab === k ? "is-on" : undefined} onClick={() => setTab(k)}>{w}</button>)}
          <a href="/account/">My account</a>
          <button type="button" onClick={async () => { await api("/api/acct/logout", {}); load(); }}>Sign out</button>
        </nav>
      </div>
      {tab === "enquiries" && <AdminEnquiries startRef={startEnq} onChanged={load} />}
      {tab === "bookings" && <Bookings />}
      {tab === "customers" && <Customers />}
      {tab === "outbox" && <Outbox />}
      {tab === "activity" && <Activity />}
      {tab === "test" && <TestTools counts={st.counts} onChanged={load} />}
    </div>
  );
}
