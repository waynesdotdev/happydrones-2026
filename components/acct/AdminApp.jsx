"use client";
/* Wayne's admin at /admin: bookings (confirm, mark paid, deliver, cancel),
   customers (view, export, delete), the email outbox, the activity log,
   and test tools. Talks to /api/admin (functions/api/admin/[[path]].js). */
import { useCallback, useEffect, useState } from "react";
import SignIn from "./SignIn";
import { api, STATUS, longDate, when } from "@/lib/acct/client";
import { money } from "@/lib/site";

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
  const [f, setF] = useState({ date: "", time: "", files: "", amount: "", how: "", note: "", reason: "" });
  const [msg, setMsg] = useState("");
  const load = useCallback(async () => { const r = await api(`/api/admin/booking/${refId}`); if (!r.error) { setD(r); setF((x) => ({ ...x, date: r.booking.confirmed_date || r.booking.wanted_date || "", time: r.booking.confirmed_time || r.booking.wanted_time || "", files: r.booking.files || "", note: r.booking.admin_note || "" })); } }, [refId]);
  useEffect(() => { load(); }, [load]);
  async function act(action, extra = {}) {
    if (action === "cancel" && !confirm("Cancel this booking? The customer is emailed. Refund any payment in Stripe yourself.")) return;
    const r = await api(`/api/admin/booking/${refId}`, { action, ...f, ...extra });
    setMsg(r.error ? r.message : "Done."); if (!r.error) { load(); onChanged(); }
  }
  if (!d) return <div className="ad-panel"><p>Loading…</p></div>;
  const b = d.booking;
  return (
    <div className="ad-panel" role="dialog" aria-label={`Booking ${b.ref}`}>
      <div className="ad-panel-head"><span className="t-mono">{b.ref}</span><Badge status={b.status} /><button type="button" className="ac-link" onClick={onClose}>Close ✕</button></div>
      <h3>{b.service}</h3>
      <dl className="ac-dl">
        <div><dt>Customer</dt><dd>{b.name || "Deleted customer"}{b.company ? `, ${b.company}` : ""}<br />{b.email} {b.phone}</dd></div>
        <div><dt>Site</dt><dd>{b.address ? `${b.address}, ` : ""}{b.postcode} · <a href={`/map/?pc=${encodeURIComponent(b.postcode)}&c=${b.ref}&m=${encodeURIComponent(b.service)}&d=${b.wanted_date || ""}`} target="_blank">job page ↗</a></dd></div>
        <div><dt>Wanted</dt><dd>{longDate(b.wanted_date) || "Any date"} {b.wanted_time}</dd></div>
        <div><dt>Money</dt><dd>{money(b.total)} total{b.travel ? ` (incl. ${money(b.travel)} travel)` : ""} · paid {money(b.paid)} · {b.mode}</dd></div>
        <div><dt>Booked as</dt><dd>{b.booking_as}{b.early_start ? ", asked to start within 14 days" : ""} · agreement {b.agreement} accepted {when(b.agreed_at)}</dd></div>
        {b.notes && <div><dt>Their notes</dt><dd>{b.notes}</dd></div>}
      </dl>
      <div className="ad-acts">
        <fieldset><legend>Confirm the flying date</legend>
          <div className="t-c2"><input type="date" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} aria-label="Date" /><input value={f.time} onChange={(e) => setF({ ...f, time: e.target.value })} placeholder="10:00" aria-label="Time" /></div>
          <button type="button" className="t-btn t-btn-primary" onClick={() => act("confirm")}>Confirm date and email them</button>
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
          {open.bundles.map((b) => <p key={b.id} className="ac-small">Bundle: {b.used} of {b.size} used{b.active ? "" : " (not paid yet)"}</p>)}
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

function TestTools() {
  const [f, setF] = useState({ name: "Lynn Fox", email: "lynn.fox@example.com", company: "", password: "" });
  const [msg, setMsg] = useState("");
  async function create(e) { e.preventDefault(); const r = await api("/api/admin/test/customer", f); setMsg(r.error ? r.message : `Test customer created. Sign in at /account as ${f.email}.`); }
  async function wipe() { if (!confirm("Delete every test customer and their bookings?")) return; const r = await api("/api/admin/test/wipe", {}); setMsg(r.error ? r.message : `Removed ${r.removed} test accounts.`); }
  return (
    <div className="ac-details">
      <form className="ac-form" onSubmit={create}>
        <h2>Create a test customer</h2>
        <p className="ac-small">Marked as test, ready to sign in (no verification email). @example.com addresses never get real emails.</p>
        <div className="t-field"><label htmlFor="tt-n">Name</label><input id="tt-n" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
        <div className="t-field"><label htmlFor="tt-e">Email</label><input id="tt-e" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></div>
        <div className="t-field"><label htmlFor="tt-p">Password</label><input id="tt-p" type="text" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} placeholder="At least 10 characters" /></div>
        <button className="t-btn t-btn-primary">Create test customer</button>
      </form>
      <div className="ac-form"><h2>Clear test data</h2><p className="ac-small">Deletes every test customer, their bookings and bundles.</p><button type="button" className="t-btn t-btn-ghost ac-del" onClick={wipe}>Delete all test data</button></div>
      {msg && <p className="ac-ok">{msg}</p>}
    </div>
  );
}

export default function AdminApp() {
  const [st, setSt] = useState({ loading: true });
  const [tab, setTab] = useState("bookings");
  const load = useCallback(async () => { const r = await api("/api/admin/overview"); setSt(r.error ? { error: r, loading: false } : r); }, []);
  useEffect(() => { load(); }, [load]);
  if (st.loading) return <p className="ac-lede">Loading…</p>;
  if (st.error?.status === 401) return <div className="ac-wrap"><SignIn adminOnly onDone={load} /></div>;
  if (st.error) return <div className="ac-wrap"><p className="ac-err">{st.error.message}</p>{st.error.status === 403 && <button type="button" className="t-btn t-btn-ghost" onClick={async () => { await api("/api/acct/logout", {}); load(); }}>Sign out</button>}</div>;
  const tabs = [["bookings", `Bookings (${st.counts.toDo} to do)`], ["customers", `Customers (${st.counts.customers})`], ["outbox", "Emails"], ["activity", "Activity"], ...(st.config.test ? [["test", "Test tools"]] : [])];
  return (
    <div className="ad">
      {st.config.test && <p className="ac-test ac-banner">Test mode. Payments {st.config.stripe ? "go to Stripe" : "are simulated"}; emails {st.config.mail ? "are sent" : "go to the outbox only"}.</p>}
      <div className="ac-top">
        <h2>Admin</h2>
        <nav className="ac-tabs">
          {tabs.map(([k, w]) => <button key={k} type="button" className={tab === k ? "is-on" : undefined} onClick={() => setTab(k)}>{w}</button>)}
          <a href="/account/">My account</a>
          <button type="button" onClick={async () => { await api("/api/acct/logout", {}); load(); }}>Sign out</button>
        </nav>
      </div>
      {tab === "bookings" && <Bookings />}
      {tab === "customers" && <Customers />}
      {tab === "outbox" && <Outbox />}
      {tab === "activity" && <Activity />}
      {tab === "test" && <TestTools />}
    </div>
  );
}
