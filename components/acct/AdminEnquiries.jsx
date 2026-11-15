"use client";
/* Admin: every enquiry from the website forms (quote, mission plan, agent
   account, coming-soon interest, feedback). Contact them, track where it's
   up to, or turn it into a booking they sign and pay online. */
import { useCallback, useEffect, useMemo, useState } from "react";
import { api, when, longDate } from "@/lib/acct/client";
import { CATALOG, priceFor } from "@/lib/acct/catalog";
import { money } from "@/lib/site";

const KIND = { quote: "Quote", mission: "Mission plan", "agent-account": "Agent account", interest: "Interest", feedback: "Feedback" };
const ST = { new: ["New", "warn"], contacted: ["Contacted", "info"], quoted: ["Price sent", "info"], won: ["Booked", "good"], lost: ["Lost", "muted"], scrapped: ["Scrapped", "muted"] };
const FILTERS = [["open", "Open"], ["new", "New"], ["won", "Booked"], ["lost", "Lost"], ["scrapped", "Scrapped"], ["all", "All"]];
const GROUPS = [...new Set(CATALOG.filter((c) => !c.pay).map((c) => c.group))];
const Badge = ({ s }) => { const [w, c] = ST[s] || [s, "info"]; return <span className={`ac-badge ac-${c}`}>{w}</span>; };
const waLink = (phone, text) => { let d = String(phone || "").replace(/\D/g, ""); if (d.startsWith("0")) d = `44${d.slice(1)}`; return d.length >= 10 ? `https://wa.me/${d}?text=${encodeURIComponent(text)}` : ""; };

function BookForm({ q, account, onDone }) {
  const f0 = { service: CATALOG.some((c) => c.id === q.service_id && !c.pay) ? q.service_id : "", serviceName: "", bookingAs: "", postcode: q.postcode || "", address: "", date: "", time: "", total: "", travel: "", mode: "deposit", extras: "", notes: "" };
  const [f, setF] = useState(f0);
  const [msg, setMsg] = useState("");
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const auto = useMemo(() => (f.service && f.postcode ? priceFor(f.service, f.postcode) : null), [f.service, f.postcode]);
  const total = f.total !== "" ? Number(f.total) : auto && !auto.error ? auto.total : null;
  async function go(e) {
    e.preventDefault(); setMsg("");
    if (!confirm(`Create the booking and email ${q.email} to sign and pay?`)) return;
    const r = await api(`/api/admin/enquiry/${q.ref}`, { action: "book", ...f });
    if (r.error) return setMsg(r.message);
    onDone(`Booking ${r.booking} created. ${q.email} has been emailed to sign and pay.`);
  }
  return (
    <form className="ad-edit" onSubmit={go} noValidate>
      <p className="ac-small">{account ? <>They already have an account ({account.name}), so it appears there straight away.</> : <>No account yet: they&apos;ll be asked to create one with <b>{q.email}</b>, and the booking will be waiting.</>} They sign the booking agreement, then pay. Held for 7 days.</p>
      <div className="t-c2">
        <div className="t-field"><label htmlFor="bf-svc">Service</label>
          <select id="bf-svc" value={f.service} onChange={(e) => set("service", e.target.value)}>
            <option value="">Other (type the name)</option>
            {GROUPS.map((g) => <optgroup key={g} label={g}>{CATALOG.filter((c) => c.group === g && !c.pay).map((c) => <option key={c.id} value={c.id}>{c.name} · {money(c.price)}</option>)}</optgroup>)}
          </select></div>
        <div className="t-field"><label htmlFor="bf-name">{f.service ? "Name on the booking (optional)" : "Service name"}</label><input id="bf-name" value={f.serviceName} onChange={(e) => set("serviceName", e.target.value)} placeholder={f.service ? CATALOG.find((c) => c.id === f.service)?.name : "e.g. Showcase + 2 extra rooms"} /></div>
      </div>
      <fieldset className="ac-radio"><legend>Booking as</legend>
        <label><input type="radio" name="bf-as" checked={f.bookingAs === "consumer"} onChange={() => set("bookingAs", "consumer")} /> Private customer</label>
        <label><input type="radio" name="bf-as" checked={f.bookingAs === "business"} onChange={() => set("bookingAs", "business")} /> Business</label>
      </fieldset>
      <div className="t-c2">
        <div className="t-field"><label htmlFor="bf-pc">Site postcode</label><input id="bf-pc" value={f.postcode} onChange={(e) => set("postcode", e.target.value)} /></div>
        <div className="t-field"><label htmlFor="bf-addr">Site address</label><input id="bf-addr" value={f.address} onChange={(e) => set("address", e.target.value)} /></div>
      </div>
      <div className="t-c2">
        <div className="t-field"><label htmlFor="bf-date">Date agreed (optional)</label><input id="bf-date" type="date" value={f.date} onChange={(e) => set("date", e.target.value)} /></div>
        <div className="t-field"><label htmlFor="bf-time">Time</label><input id="bf-time" value={f.time} onChange={(e) => set("time", e.target.value)} placeholder="10:00" /></div>
      </div>
      <div className="t-c2">
        <div className="t-field"><label htmlFor="bf-tot">Total price (£)</label><input id="bf-tot" inputMode="numeric" value={f.total} onChange={(e) => set("total", e.target.value)} placeholder={auto && !auto.error ? String(auto.total) : ""} /><span className="t-hint">{auto?.error ? auto.message : auto ? `List price ${money(auto.total)}${auto.travel ? ` incl. ${money(auto.travel)} travel` : ""}. Leave blank to use it.` : "Type the price you agreed."}</span></div>
        <div className="t-field"><label htmlFor="bf-tr">Of which travel (£)</label><input id="bf-tr" inputMode="numeric" value={f.travel} onChange={(e) => set("travel", e.target.value)} placeholder={auto && !auto.error ? String(auto.travel) : "0"} /></div>
      </div>
      <div className="t-field"><label htmlFor="bf-mode">Payment terms</label><select id="bf-mode" value={f.mode} onChange={(e) => set("mode", e.target.value)}><option value="deposit">25% deposit when they sign, balance before the files</option><option value="invoice">Invoice after the visit (jobs £1,000+ or repeat visits, 3.8)</option></select></div>
      <div className="t-c2">
        <div className="t-field"><label htmlFor="bf-ex">Extras agreed</label><input id="bf-ex" value={f.extras} onChange={(e) => set("extras", e.target.value)} /></div>
        <div className="t-field"><label htmlFor="bf-notes">Special notes (in the agreement)</label><input id="bf-notes" value={f.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Access, site rules…" /></div>
      </div>
      {msg && <p className="ac-err" role="alert">{msg}</p>}
      <button className="t-btn t-btn-primary">Create booking and email them{total ? ` (${money(total)})` : ""}</button>
    </form>
  );
}

function Panel({ refId, onClose, onChanged }) {
  const [d, setD] = useState(null);
  const [note, setNote] = useState("");
  const [msg, setMsg] = useState("");
  const [booking, setBooking] = useState(false);
  const load = useCallback(async () => { const r = await api(`/api/admin/enquiry/${refId}`); if (!r.error) { setD(r); setNote(r.enquiry.note || ""); } else setMsg(r.message); }, [refId]);
  useEffect(() => { load(); setBooking(false); }, [load]);
  async function act(action, extra = {}) {
    if (action === "delete" && !confirm("Delete this enquiry for good? Use this if they ask you to remove their details.")) return;
    const r = await api(`/api/admin/enquiry/${refId}`, { action, ...extra });
    if (r.error) return setMsg(r.message);
    if (r.deleted) { onChanged(); onClose(); return; }
    setMsg("Saved."); load(); onChanged();
  }
  if (!d) return <div className="ad-panel"><p>{msg || "Loading…"}</p></div>;
  const q = d.enquiry;
  const mapUrl = q.fields.find(([k]) => k.startsWith("Job page"))?.[1];
  const wa = waLink(q.phone, `Hi ${q.name?.split(" ")[0] || ""}, it's Wayne from Happy Drones about your ${KIND[q.kind]?.toLowerCase() || "enquiry"} (${q.ref}).`);
  return (
    <div className="ad-panel" role="dialog" aria-label={`Enquiry ${q.ref}`}>
      <div className="ad-panel-head"><span className="t-mono">{q.ref}</span><Badge s={q.status} /><button type="button" className="ac-link" onClick={onClose}>Close ✕</button></div>
      <h3>{KIND[q.kind] || q.kind}{q.price ? ` · guide ${money(q.price)}` : ""}</h3>
      <p className="ac-small">Received {when(q.created)}{q.booking_ref ? ` · booked as ${q.booking_ref}` : ""}</p>
      <div className="ad-contact">
        <b>{q.name || "No name"}{q.company ? `, ${q.company}` : ""}</b>
        <div className="ac-actions">
          {q.email && <a className="t-btn t-btn-ghost" href={`mailto:${q.email}?subject=${encodeURIComponent(`Your ${KIND[q.kind]?.toLowerCase() || "enquiry"} (${q.ref})`)}`}>Email {q.email}</a>}
          {q.phone && <a className="t-btn t-btn-ghost" href={`tel:${q.phone.replace(/\s/g, "")}`}>Call {q.phone}</a>}
          {wa && <a className="t-btn t-btn-ghost" href={wa} target="_blank" rel="noopener">WhatsApp</a>}
          {mapUrl && <a className="t-btn t-btn-ghost" href={mapUrl} target="_blank" rel="noopener">Map and weather ↗</a>}
        </div>
      </div>
      <div className="ac-jobd"><table><tbody>{q.fields.map(([k, v], i) => <tr key={i}><th scope="row">{k}</th><td className="ad-pre">{k.startsWith("Job page") ? <a href={v} target="_blank" rel="noopener">Open ↗</a> : v}</td></tr>)}</tbody></table></div>
      <div className="ad-acts">
        {!q.booking_ref && (
          <fieldset><legend>Where it&apos;s up to</legend>
            <div className="ac-actions">
              {[["contacted", "Contacted"], ["quoted", "Price sent"], ["lost", "Lost"], ["scrapped", "Scrap"], ["new", "Back to new"]].filter(([s]) => s !== q.status).map(([s, w]) => <button key={s} type="button" className={`t-btn t-btn-ghost${s === "scrapped" || s === "lost" ? " ac-del" : ""}`} onClick={() => act("status", { status: s })}>{w}</button>)}
            </div>
          </fieldset>
        )}
        {!q.booking_ref && q.kind !== "feedback" && (
          booking ? <BookForm q={q} account={d.account} onDone={(m) => { setMsg(m); setBooking(false); load(); onChanged(); }} />
            : <button type="button" className="t-btn t-btn-primary" onClick={() => setBooking(true)} disabled={!q.email}>{q.email ? "Turn into a booking" : "Turn into a booking (needs their email)"}</button>
        )}
        <fieldset><legend>Private note</legend>
          <textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} aria-label="Note" />
          <button type="button" className="t-btn t-btn-ghost" onClick={() => act("note", { note })}>Save note</button>
        </fieldset>
        <button type="button" className="t-btn t-btn-ghost ac-del" onClick={() => act("delete")}>Delete for good</button>
        {msg && <p className={msg === "Saved." || msg.startsWith("Booking") ? "ac-ok" : "ac-err"} role="status">{msg}</p>}
      </div>
      {d.history.length > 0 && <><h4>History</h4><ul className="ad-hist">{d.history.map((h) => <li key={h.id}><span>{when(h.at)}</span> {h.action} {h.detail} <small>{h.actor}</small></li>)}</ul></>}
    </div>
  );
}

export default function AdminEnquiries({ startRef = "", onChanged }) {
  const [status, setStatus] = useState("open");
  const [rows, setRows] = useState(null);
  const [open, setOpen] = useState(startRef);
  const load = useCallback(async () => { const r = await api(`/api/admin/enquiries?status=${status}`); setRows(r.enquiries || []); }, [status]);
  useEffect(() => { load(); }, [load]);
  return (
    <div>
      <div className="ac-tabs ad-filters">{FILTERS.map(([k, w]) => <button key={k} type="button" className={status === k ? "is-on" : undefined} onClick={() => setStatus(k)}>{w}</button>)}</div>
      {!rows ? <p>Loading…</p> : rows.length === 0 ? <p className="ac-lede">Nothing here. New quote requests, mission plans and messages from the website land here.</p> : (
        <div className="ad-table-wrap"><table className="ad-table">
          <thead><tr><th>Ref</th><th>Received</th><th>Name</th><th>Type</th><th>Postcode</th><th>Guide</th><th>Status</th></tr></thead>
          <tbody>{rows.map((q) => (
            <tr key={q.ref} className={q.status === "new" ? "ad-new" : undefined} onClick={() => setOpen(q.ref)} tabIndex={0} onKeyDown={(e) => e.key === "Enter" && setOpen(q.ref)}>
              <td className="t-mono">{q.ref}</td><td>{when(q.created)}</td><td>{q.name || "–"}</td><td>{KIND[q.kind] || q.kind}</td><td>{q.postcode || "–"}</td><td>{q.price ? money(q.price) : "–"}</td><td><Badge s={q.status} /></td>
            </tr>
          ))}</tbody>
        </table></div>
      )}
      {open && <Panel refId={open} onClose={() => setOpen("")} onChanged={() => { load(); onChanged?.(); }} />}
    </div>
  );
}
