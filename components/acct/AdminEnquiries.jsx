"use client";
/* Admin: every enquiry from the website forms (quote, mission plan, agent
   account, coming-soon interest, feedback). Contact them, track where it's
   up to, or turn it into a booking they sign and pay online. */
import { useCallback, useEffect, useMemo, useState } from "react";
import { api, when, longDate } from "@/lib/acct/client";
import { CATALOG, priceFor } from "@/lib/acct/catalog";
import { money } from "@/lib/site";
import { LABELS } from "@/lib/sendForm";

const KIND = { quote: "Quote", mission: "Mission plan", "agent-account": "Agent account", interest: "Interest", feedback: "Feedback" };
const ST = { new: ["New", "warn"], contacted: ["Contacted", "info"], quoted: ["Price sent", "info"], won: ["Booked", "good"], lost: ["Lost", "muted"], scrapped: ["Scrapped", "muted"] };
const FILTERS = [["open", "Open"], ["new", "New"], ["won", "Booked"], ["lost", "Lost"], ["scrapped", "Scrapped"], ["all", "All"]];
const GROUPS = [...new Set(CATALOG.filter((c) => !c.pay).map((c) => c.group))];
const Badge = ({ s }) => { const [w, c] = ST[s] || [s, "info"]; return <span className={`ac-badge ac-${c}`}>{w}</span>; };
const waLink = (phone, text) => { let d = String(phone || "").replace(/\D/g, ""); if (d.startsWith("0")) d = `44${d.slice(1)}`; return d.length >= 10 ? `https://wa.me/${d}?text=${encodeURIComponent(text)}` : ""; };

/* (i) button: explains what something does. Hover, focus or tap. */
export function Tip({ children, label = "What this does" }) {
  const [open, setOpen] = useState(false);
  return (
    <span className={`ad-tip${open ? " is-open" : ""}`}>
      <button type="button" className="ad-tip-btn" aria-label={label} aria-expanded={open} onClick={() => setOpen(!open)} onBlur={() => setOpen(false)}>i</button>
      <span role="tooltip" className="ad-tip-box">{children}</span>
    </span>
  );
}

/* What each status means, for Wayne and for the customer's private link */
const STATUS_INFO = {
  new: ["Just arrived and nobody has replied yet. It sits at the top of Open, in bold.", "Received: Wayne will reply within a day"],
  contacted: ["You've replied, rung or messaged them. It stays in Open.", "Wayne has been in touch"],
  quoted: ["You've sent them a price. It stays in Open so you can chase it.", "Price sent"],
  won: ["Turned into a booking. Follow it in the Bookings tab.", "Booked"],
  lost: ["They didn't go ahead: went elsewhere, too dear, or stopped replying. It moves out of Open into Lost, and is deleted automatically after 12 months.", "Closed"],
  scrapped: ["Not a real job: spam, a test, a duplicate or sent by mistake. It moves out of Open into Scrapped, and is deleted automatically after 12 months.", "Closed"],
};
const MOVES = [["contacted", "Contacted"], ["quoted", "Price sent"], ["lost", "Lost"], ["scrapped", "Scrap"], ["new", "Back to new"]];

/* A field from the enquiry by its form name, e.g. f(q, "date") */
const fieldOf = (q, key) => (q.fields.find(([k]) => k === (LABELS[key] || key)) || [])[1] || "";
const ROLE_AS = { "Homeowner selling": "consumer", "Estate agent": "business", "Landlord or holiday let": "business", Business: "business" };

function BookForm({ q, account, onDone, onCancel }) {
  const svcOk = CATALOG.some((c) => c.id === q.service_id && !c.pay);
  const role = fieldOf(q, "role");
  const d0 = fieldOf(q, "date");
  const f0 = {
    service: svcOk ? q.service_id : "",
    serviceName: svcOk ? "" : (fieldOf(q, "quote-summary") || fieldOf(q, "plan") || fieldOf(q, "mission") || "").split("\n")[0].slice(0, 120),
    bookingAs: ROLE_AS[role] || (fieldOf(q, "company") || q.company ? "business" : ""),
    postcode: q.postcode || "", address: fieldOf(q, "address"),
    date: /^\d{4}-\d{2}-\d{2}$/.test(d0) ? d0 : "", time: fieldOf(q, "time"),
    total: q.price ? String(q.price) : "", travel: "", mode: "deposit",
    extras: fieldOf(q, "extras"),
    notes: [fieldOf(q, "message"), fieldOf(q, "notes")].filter(Boolean).join(" ").slice(0, 1000),
  };
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
  const from = (k) => (f0[k] ? <span className="ad-from">from the enquiry</span> : null);
  return (
    <form className="ad-edit ad-bookform" onSubmit={go} noValidate>
      <h3>Turn {q.ref} into a booking</h3>
      <p><b>Filled in from the enquiry.</b> Check it, change anything you agreed with them by phone, WhatsApp or email, then create it.</p>
      <p className="ac-small">{account ? <>They already have an account ({account.name}), so it appears there straight away.</> : <>No account yet: they&apos;ll be asked to create one with <b>{q.email}</b>, and the booking will be waiting.</>} They sign the booking agreement, then pay. Held for 7 days.</p>
      <div className="t-c2">
        <div className="t-field"><label htmlFor="bf-svc">Service {from("service")}</label>
          <select id="bf-svc" value={f.service} onChange={(e) => set("service", e.target.value)}>
            <option value="">Other (type the name)</option>
            {GROUPS.map((g) => <optgroup key={g} label={g}>{CATALOG.filter((c) => c.group === g && !c.pay).map((c) => <option key={c.id} value={c.id}>{c.name} · {money(c.price)}</option>)}</optgroup>)}
          </select></div>
        <div className="t-field"><label htmlFor="bf-name">{f.service ? "Name on the booking (optional)" : "Service name"}</label><input id="bf-name" value={f.serviceName} onChange={(e) => set("serviceName", e.target.value)} placeholder={f.service ? CATALOG.find((c) => c.id === f.service)?.name : "e.g. Showcase + 2 extra rooms"} /></div>
      </div>
      <fieldset className="ac-radio"><legend>Booking as {f0.bookingAs ? <span className="ad-from">from &ldquo;{role || "company"}&rdquo;</span> : <span className="ad-from ad-need">please choose</span>}</legend>
        <label><input type="radio" name="bf-as" checked={f.bookingAs === "consumer"} onChange={() => set("bookingAs", "consumer")} /> Private customer</label>
        <label><input type="radio" name="bf-as" checked={f.bookingAs === "business"} onChange={() => set("bookingAs", "business")} /> Business</label>
      </fieldset>
      <div className="t-c2">
        <div className="t-field"><label htmlFor="bf-pc">Site postcode {from("postcode")}</label><input id="bf-pc" value={f.postcode} onChange={(e) => set("postcode", e.target.value)} /></div>
        <div className="t-field"><label htmlFor="bf-addr">Site address {from("address") || <span className="ad-from ad-need">add if you have it</span>}</label><input id="bf-addr" value={f.address} onChange={(e) => set("address", e.target.value)} /></div>
      </div>
      <div className="t-c2">
        <div className="t-field"><label htmlFor="bf-date">Date agreed (optional) {from("date")}</label><input id="bf-date" type="date" value={f.date} onChange={(e) => set("date", e.target.value)} /></div>
        <div className="t-field"><label htmlFor="bf-time">Time</label><input id="bf-time" value={f.time} onChange={(e) => set("time", e.target.value)} placeholder="10:00" /></div>
      </div>
      <div className="t-c2">
        <div className="t-field"><label htmlFor="bf-tot">Total price (£) {f0.total ? <span className="ad-from">their guide price</span> : null}</label><input id="bf-tot" inputMode="numeric" value={f.total} onChange={(e) => set("total", e.target.value)} placeholder={auto && !auto.error ? String(auto.total) : ""} /><span className="t-hint">{auto?.error ? auto.message : auto ? `List price ${money(auto.total)}${auto.travel ? ` incl. ${money(auto.travel)} travel` : ""}. Leave blank to use it.` : "Type the price you agreed."}</span></div>
        <div className="t-field"><label htmlFor="bf-tr">Of which travel (£)</label><input id="bf-tr" inputMode="numeric" value={f.travel} onChange={(e) => set("travel", e.target.value)} placeholder={auto && !auto.error ? String(auto.travel) : "0"} /></div>
      </div>
      <div className="t-field"><label htmlFor="bf-mode">Payment terms</label><select id="bf-mode" value={f.mode} onChange={(e) => set("mode", e.target.value)}><option value="deposit">25% deposit when they sign, balance before the files</option><option value="invoice">Invoice after the visit (jobs £1,000+ or repeat visits, 3.8)</option></select></div>
      <div className="t-c2">
        <div className="t-field"><label htmlFor="bf-ex">Extras agreed {from("extras")}</label><input id="bf-ex" value={f.extras} onChange={(e) => set("extras", e.target.value)} /></div>
        <div className="t-field"><label htmlFor="bf-notes">Special notes (in the agreement) {from("notes")}</label><input id="bf-notes" value={f.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Access, site rules…" /></div>
      </div>
      {msg && <p className="ac-err" role="alert">{msg}</p>}
      <div className="ac-actions">
        <button className="t-btn t-btn-primary">Create booking and email them{total ? ` (${money(total)})` : ""}</button>
        <button type="button" className="t-btn t-btn-ghost" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

function Panel({ refId, onClose, onChanged }) {
  const [d, setD] = useState(null);
  const [note, setNote] = useState("");
  const [msg, setMsg] = useState(null);
  const [booking, setBooking] = useState(false);
  const load = useCallback(async () => { const r = await api(`/api/admin/enquiry/${refId}`); if (!r.error) { setD(r); setNote(r.enquiry.note || ""); } else setMsg(["err", r.message]); }, [refId]);
  useEffect(() => { load(); setBooking(false); window.scrollTo({ top: 0 }); }, [load]);
  async function act(action, extra = {}, done = "Saved.") {
    if (action === "delete" && !confirm("Delete this enquiry for good? Everything they sent is removed now and can't be brought back. Use this if they ask you to delete their details.")) return;
    const r = await api(`/api/admin/enquiry/${refId}`, { action, ...extra });
    if (r.error) return setMsg(["err", r.message]);
    if (r.deleted) { onChanged(); onClose("Enquiry deleted for good."); return; }
    setMsg(["ok", done]); load(); onChanged();
  }
  if (!d) return <div className="ad-panel"><button type="button" className="ac-link ad-back" onClick={() => onClose()}>← All enquiries</button><p>{msg?.[1] || "Loading…"}</p></div>;
  const q = d.enquiry;
  const mapUrl = q.fields.find(([k]) => k.startsWith("Job page"))?.[1];
  const wa = waLink(q.phone, `Hi ${q.name?.split(" ")[0] || ""}, it's Wayne from Happy Drones about your ${KIND[q.kind]?.toLowerCase() || "enquiry"} (${q.ref}).`);
  const [now, customerSees] = STATUS_INFO[q.status] || ["", ""];
  const shown = q.fields.filter(([k]) => !k.startsWith("Job page"));
  return (
    <div className="ad-panel ad-enq" aria-label={`Enquiry ${q.ref}`}>
      <button type="button" className="ac-link ad-back" onClick={() => onClose()}>← All enquiries</button>
      <div className="ad-panel-head"><span className="t-mono">{q.ref}</span><Badge s={q.status} /></div>
      <h3>{KIND[q.kind] || q.kind} from {q.name || "someone"}{q.price ? ` · guide ${money(q.price)}` : ""}</h3>
      <p className="ac-small">Received {when(q.created)}{q.booking_ref ? ` · booked as ${q.booking_ref}` : ""}</p>
      {msg && <p className={msg[0] === "ok" ? "ac-ok" : "ac-err"} role="status">{msg[1]}</p>}

      {booking ? <BookForm q={q} account={d.account} onCancel={() => setBooking(false)} onDone={(m) => { setMsg(["ok", m]); setBooking(false); load(); onChanged(); }} /> : (
      <div className="ad-enq-grid">
        <section className="ad-enq-main">
          <div className="ad-contact">
            <b>{q.name || "No name"}{q.company ? `, ${q.company}` : ""}</b>
            <div className="ac-actions">
              {q.email && <a className="t-btn t-btn-ghost" href={`mailto:${q.email}?subject=${encodeURIComponent(`Your ${KIND[q.kind]?.toLowerCase() || "enquiry"} (${q.ref})`)}`}>Email {q.email}</a>}
              {q.phone && <a className="t-btn t-btn-ghost" href={`tel:${q.phone.replace(/\s/g, "")}`}>Call {q.phone}</a>}
              {wa && <a className="t-btn t-btn-ghost" href={wa} target="_blank" rel="noopener">WhatsApp</a>}
              {mapUrl && <a className="t-btn t-btn-ghost" href={mapUrl} target="_blank" rel="noopener">Job page: map and weather ↗</a>}
            </div>
          </div>
          <h4>What they sent</h4>
          <div className="ac-jobd"><table><tbody>{shown.map(([k, v], i) => <tr key={i}><th scope="row">{k}</th><td className="ad-pre">{v}</td></tr>)}</tbody></table></div>
          {d.history.length > 0 && <><h4>History</h4><ul className="ad-hist">{d.history.map((h) => <li key={h.id}><span>{when(h.at)}</span> {h.action} {h.detail} <small>{h.actor}</small></li>)}</ul></>}
        </section>

        <aside className="ad-enq-side">
          <div className="ad-box">
            <h4>Where it&apos;s up to</h4>
            <p><Badge s={q.status} /> {now}</p>
            <p className="ac-small">Their private link says: <b>&ldquo;{customerSees}&rdquo;</b></p>
            {!q.booking_ref && (
              <ul className="ad-moves">
                {MOVES.filter(([st]) => st !== q.status).map(([st, w]) => (
                  <li key={st}>
                    <button type="button" className={`t-btn t-btn-ghost${st === "scrapped" || st === "lost" ? " ac-del" : ""}`} onClick={() => act("status", { status: st }, `Marked as ${ST[st][0]}. ${STATUS_INFO[st][0]} Their link now says "${STATUS_INFO[st][1]}".`)}>{w}</button>
                    <Tip label={`What ${w} does`}>{st === "new" ? "Puts it back to New, at the top of Open, as if nobody has replied yet." : STATUS_INFO[st][0]} Their link will say &ldquo;{STATUS_INFO[st][1]}&rdquo;.</Tip>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {!q.booking_ref && q.kind !== "feedback" && (
            <div className="ad-box">
              <h4>Book it <Tip label="What Turn into a booking does">Creates the booking with the details from this enquiry already filled in. You check and change anything you agreed, then they get an email to sign the booking agreement and pay online. If they have no account, the booking waits for them to create one with {q.email || "their email"}.</Tip></h4>
              <button type="button" className="t-btn t-btn-primary" onClick={() => { setMsg(null); setBooking(true); }} disabled={!q.email}>{q.email ? "Turn into a booking" : "Needs their email to book online"}</button>
            </div>
          )}
          <div className="ad-box">
            <h4>Private note <Tip label="About private notes">Only you see this. It isn&apos;t sent to the customer or shown on their link.</Tip></h4>
            <textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} aria-label="Private note" />
            <button type="button" className="t-btn t-btn-ghost" onClick={() => act("note", { note }, "Note saved.")}>Save note</button>
          </div>
          <div className="ad-box">
            <h4>Delete <Tip label="What Delete for good does">Removes the enquiry and everything they sent, straight away. It can&apos;t be undone. Use it if they ask you to delete their details. For spam or tests, Scrap is enough: it&apos;s deleted automatically after 12 months.</Tip></h4>
            <button type="button" className="t-btn t-btn-ghost ac-del" onClick={() => act("delete")}>Delete for good</button>
          </div>
        </aside>
      </div>
      )}
    </div>
  );
}

export default function AdminEnquiries({ startRef = "", onChanged }) {
  const [status, setStatus] = useState("open");
  const [rows, setRows] = useState(null);
  const [open, setOpen] = useState(startRef);
  const [flash, setFlash] = useState("");
  const load = useCallback(async () => { const r = await api(`/api/admin/enquiries?status=${status}`); setRows(r.enquiries || []); }, [status]);
  useEffect(() => { load(); }, [load]);
  if (open) return <Panel refId={open} onClose={(m) => { setOpen(""); setFlash(m || ""); load(); }} onChanged={() => onChanged?.()} />;
  return (
    <div>
      <div className="ac-tabs ad-filters">{FILTERS.map(([k, w]) => <button key={k} type="button" className={status === k ? "is-on" : undefined} onClick={() => setStatus(k)}>{w}</button>)}
        <Tip label="About these lists">Open shows New, Contacted and Price sent: the ones still to deal with. Lost and Scrapped move out of Open and are deleted automatically after 12 months. Booked ones are in the Bookings tab too.</Tip></div>
      {flash && <p className="ac-ok" role="status">{flash}</p>}
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
    </div>
  );
}
