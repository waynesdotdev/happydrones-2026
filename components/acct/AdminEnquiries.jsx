"use client";
/* Admin: every enquiry from the website forms (quote, mission plan, agent
   account, coming-soon interest, feedback). Contact them, track where it's
   up to, or turn it into a booking they sign and pay online. */
import { useCallback, useEffect, useMemo, useState } from "react";
import { api, when, longDate } from "@/lib/acct/client";
import { CATALOG, zoneFor } from "@/lib/acct/catalog";
import { money, PRICING, PLANNER, PAYMENT, depositFor } from "@/lib/site";
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

/* Add-ons Wayne can pick for a service: the quote builder's extras, or the
   mission planner's extras for missions (roofs, construction…). */
function addonsFor(serviceId) {
  const list = PRICING.extras.filter((x) => !x.soon && x.for.includes(serviceId)).map((x) => [x.name, x.price]);
  if (PLANNER.missions.some((m) => m.id === serviceId)) PLANNER.extras.filter((x) => !x.soon).forEach((x) => list.push([x.name, x.price]));
  return list;
}
const travelFee = (pc) => zoneFor(pc)?.fee ?? null;
let lineId = 0;
const L = (name, price, kind, src) => ({ id: ++lineId, name, price: String(price), kind, src });

/* Everything about the job as the customer asked for it: the booking
   details and the price lines (plus travel for their postcode). */
function draftFrom(q) {
  const svcOk = CATALOG.some((c) => c.id === q.service_id && !c.pay);
  const role = fieldOf(q, "role");
  const d0 = fieldOf(q, "date");
  const f0 = {
    service: svcOk ? q.service_id : "",
    serviceName: svcOk ? "" : (fieldOf(q, "quote-summary") || fieldOf(q, "plan") || fieldOf(q, "mission") || "").split("\n")[0].slice(0, 120),
    bookingAs: ROLE_AS[role] || (fieldOf(q, "company") || q.company ? "business" : ""),
    postcode: q.postcode || "", address: fieldOf(q, "address"),
    date: /^\d{4}-\d{2}-\d{2}$/.test(d0) ? d0 : "", time: fieldOf(q, "time"),
    mode: "deposit",
    notes: [fieldOf(q, "message"), fieldOf(q, "notes")].filter(Boolean).join(" ").slice(0, 1000),
  };
  const cat = CATALOG.find((c) => c.id === q.service_id);
  let lines = q.lines?.length ? q.lines.map(([n, p, k]) => L(n, p, k, "enquiry"))
    : cat ? [L(cat.name, cat.price, "service", "list")]
    : q.price ? [L(f0.serviceName || "As quoted", q.price, "service", "enquiry")] : [];
  const fee = travelFee(q.postcode);
  if (fee && !lines.some((l) => l.kind === "travel")) lines = [...lines, L(`Travel (${zoneFor(q.postcode).name})`, fee, "travel", "auto")];
  if (lines.reduce((a, l) => a + Number(l.price), 0) >= PAYMENT.largeFrom) f0.mode = "invoice";
  return { f0, lines, role };
}
const linesTotal = (lines) => lines.reduce((a, l) => a + (Math.round(Number(l.price)) || 0), 0);
const sendLines = (lines) => lines.map((l) => [l.name.trim(), Math.round(Number(l.price)) || 0, l.kind]);
/* Quick checks before accepting: Wayne's Google Calendar for that day, and the
   job page (map, travel and the weather for that day at that postcode). */
const calendarDay = (date) => (date ? `https://calendar.google.com/calendar/r/day/${date.replace(/-/g, "/")}` : "https://calendar.google.com/calendar/r");
const jobPage = (q, f0, total) => { const p = new URLSearchParams({ pc: q.postcode || "" }); if (f0.date) p.set("d", f0.date); if (f0.time) p.set("h", f0.time); if (f0.service) p.set("k", f0.service); p.set("c", q.ref); p.set("m", f0.serviceName || CATALOG.find((c) => c.id === f0.service)?.name || ""); if (total) p.set("t", money(total)); if (f0.notes) p.set("n", f0.notes.slice(0, 300)); return `/map/?${p}`; };

/* The main thing on an enquiry: check it and accept it exactly as quoted. */
function AcceptCard({ q, account, onDone, onEdit }) {
  const { f0, lines, role } = useMemo(() => draftFrom(q), [q]);
  const [as, setAs] = useState(f0.bookingAs);
  const [when, setWhen] = useState({ date: f0.date, time: f0.time });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const total = linesTotal(lines);
  const deposit = f0.mode === "deposit" ? depositFor(total) : 0;
  const svcName = f0.serviceName || CATALOG.find((c) => c.id === f0.service)?.name || "Service to confirm";
  async function accept() {
    setMsg("");
    if (!confirm(`Accept and send ${q.name || "them"} the booking for ${money(total)}?\n\nThey'll get an email to sign the booking agreement${deposit ? ` and pay the ${money(deposit)} deposit` : ""}.`)) return;
    setBusy(true);
    const r = await api(`/api/admin/enquiry/${q.ref}`, { action: "book", ...f0, ...when, bookingAs: as, lines: sendLines(lines) });
    setBusy(false);
    if (r.error) return setMsg(r.message);
    onDone(`Accepted. Booking ${r.booking} for ${money(total)} sent to ${q.email} to sign${deposit ? " and pay" : ""}.`);
  }
  if (!lines.length) return (
    <div className="ad-accept ad-noprice">
      <h4>Check and book</h4>
      <dl className="ad-accept-dl">
        <div><dt>When</dt><dd>{f0.date ? `${longDate(f0.date)}${f0.time ? `, ${f0.time}` : ""}` : "No date given"}</dd></div>
        <div><dt>Where</dt><dd>{[f0.address, f0.postcode].filter(Boolean).join(", ") || "No postcode given"}</dd></div>
        {f0.notes && <div><dt>Their notes</dt><dd>{f0.notes}</dd></div>}
      </dl>
      <p><b>No price yet:</b> they sent the form without building a quote. Pick the service and set the price you agree with them, then book it.</p>
      <div className="ac-actions ad-checks">
        <a className="t-btn t-btn-ghost" href={calendarDay(f0.date)} target="_blank" rel="noopener">📅 Your calendar{f0.date ? ` for ${longDate(f0.date).replace(/ \d{4}$/, "")}` : ""} ↗</a>
        {q.postcode && <a className="t-btn t-btn-ghost" href={jobPage(q, f0, 0)} target="_blank" rel="noopener">🌤 Weather and map{f0.date ? " for that day" : ""} ↗</a>}
      </div>
      <div className="ac-actions"><button type="button" className="t-btn t-btn-primary ad-accept-btn" onClick={onEdit} disabled={!q.email}>Set the price and book</button></div>
    </div>
  );
  return (
    <div className="ad-accept">
      <h4>Check and accept</h4>
      <dl className="ad-accept-dl">
        <div><dt>Job</dt><dd><b>{svcName}</b></dd></div>
        <div><dt>When</dt><dd>{f0.date ? `${longDate(f0.date)}${f0.time ? `, ${f0.time}` : ""}` : <span className="ad-from ad-need">no date given: add the one you agree below</span>}</dd></div>
        <div><dt>Where</dt><dd>{[f0.address, f0.postcode].filter(Boolean).join(", ") || "No postcode given"}</dd></div>
        {f0.notes && <div><dt>Their notes</dt><dd>{f0.notes}</dd></div>}
      </dl>
      <ul className="ad-accept-lines">
        {lines.map((l) => <li key={l.id}><span>{l.name}</span><b>{Number(l.price) < 0 ? "−" : ""}{money(Math.abs(Number(l.price)))}</b></li>)}
        <li className="ad-accept-total"><span>Total</span><b>{money(total)}</b></li>
      </ul>
      <p className="ac-small">{f0.mode === "deposit" ? `They pay a ${money(deposit)} deposit when they sign, and ${money(total - deposit)} before the files.` : "Invoice after the visit (3.8): nothing to pay up front."}{q.price && total !== q.price ? ` Their on-screen quote was ${money(q.price)}${lines.some((l) => l.src === "auto") ? "; travel for their postcode is added here" : ""}.` : ""}</p>
      <div className="ac-actions ad-checks">
        <a className="t-btn t-btn-ghost" href={calendarDay(when.date)} target="_blank" rel="noopener">📅 Your calendar{when.date ? ` for ${longDate(when.date).replace(/ \d{4}$/, "")}` : ""} ↗</a>
        {q.postcode && <a className="t-btn t-btn-ghost" href={jobPage(q, { ...f0, ...when }, total)} target="_blank" rel="noopener">🌤 Weather and map{when.date ? " for that day" : ""} ↗</a>}
      </div>
      {!f0.date && (
        <div className="t-c2 ad-when">
          <div className="t-field"><label htmlFor="ac-date">Date agreed with them <span className="ad-from ad-need">needed</span></label><input id="ac-date" type="date" min={new Date().toISOString().slice(0, 10)} value={when.date} onChange={(e) => setWhen({ ...when, date: e.target.value })} /></div>
          <div className="t-field"><label htmlFor="ac-time">Time</label><input id="ac-time" value={when.time} onChange={(e) => setWhen({ ...when, time: e.target.value })} placeholder="e.g. 10:00 or Morning" /></div>
        </div>
      )}
      {!f0.bookingAs && (
        <fieldset className="ac-radio ad-as"><legend>Are they booking as a private customer or a business? <span className="ad-from ad-need">needed for the agreement</span></legend>
          <label><input type="radio" name="ac-as" checked={as === "consumer"} onChange={() => setAs("consumer")} /> Private customer</label>
          <label><input type="radio" name="ac-as" checked={as === "business"} onChange={() => setAs("business")} /> Business</label>
        </fieldset>
      )}
      {msg && <p className="ac-err" role="alert">{msg}</p>}
      <div className="ac-actions">
        <button type="button" className="t-btn t-btn-primary ad-accept-btn" disabled={busy || !q.email || !as || !when.date} onClick={accept}>{busy ? "Sending…" : `✓ Accept and send booking (${money(total)})`}</button>
        <button type="button" className="t-btn t-btn-ghost" onClick={onEdit}>Change something first</button>
      </div>
      <p className="ac-small">{!q.email ? "They didn't give an email, so they can't sign online. Call them for it first." : `Accepting emails ${q.email} to ${account ? "sign in" : "create an account"}, sign the booking agreement${deposit ? " and pay the deposit" : ""}. It's held for 7 days. You confirm the date with It's a go once they've signed${deposit ? " and paid" : ""}.`}{f0.bookingAs ? ` Booking as ${f0.bookingAs === "consumer" ? "a private customer" : "a business"} (from "${role || "company"}").` : ""}</p>
    </div>
  );
}

function BookForm({ q, account, onDone, onCancel }) {
  const draft = useMemo(() => draftFrom(q), [q]);
  const { f0, role } = draft;
  const lines0 = draft.lines;
  const [f, setF] = useState(f0);
  const [lines, setLines] = useState(lines0);
  const [pick, setPick] = useState("");
  const [msg, setMsg] = useState("");
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const total = lines.reduce((a, l) => a + (Math.round(Number(l.price)) || 0), 0);
  const deposit = f.mode === "deposit" ? depositFor(total) : 0;
  const quoted = q.price || null;
  const addons = addonsFor(f.service).filter(([n]) => !lines.some((l) => l.name === n));
  const editLine = (id, k, v) => setLines((ls) => ls.map((l) => (l.id === id ? { ...l, [k]: v, src: l.src === "auto" && k === "price" ? "edited" : l.src } : l)));
  const removeLine = (id) => setLines((ls) => ls.filter((l) => l.id !== id));

  // A different service: swap the service line for that service's price
  function changeService(id) {
    set("service", id);
    const cat = CATALOG.find((c) => c.id === id); if (!cat) return;
    setLines((ls) => { const rest = ls.filter((l) => l.kind !== "service" && l.kind !== "size"); return [L(cat.name, cat.price, "service", "list"), ...rest]; });
  }
  // A different postcode: update the travel line worked out from it
  function changePostcode(pc) {
    set("postcode", pc);
    const fee = travelFee(pc);
    setLines((ls) => {
      const auto = ls.find((l) => l.kind === "travel" && l.src === "auto");
      if (fee == null) return ls;
      if (auto) return fee ? ls.map((l) => (l === auto ? { ...l, name: `Travel (${zoneFor(pc).name})`, price: String(fee) } : l)) : ls.filter((l) => l !== auto);
      return fee && !ls.some((l) => l.kind === "travel") ? [...ls, L(`Travel (${zoneFor(pc).name})`, fee, "travel", "auto")] : ls;
    });
  }
  async function go(e) {
    e.preventDefault(); setMsg("");
    if (!confirm(`Create the booking for ${money(total)} and email ${q.email} to sign and pay?`)) return;
    const r = await api(`/api/admin/enquiry/${q.ref}`, { action: "book", ...f, lines: lines.map((l) => [l.name.trim(), Math.round(Number(l.price)) || 0, l.kind]) });
    if (r.error) return setMsg(r.message);
    onDone(`Booking ${r.booking} created for ${money(total)}. ${q.email} has been emailed to sign and pay.`);
  }
  const from = (k) => (f0[k] ? <span className="ad-from">from the enquiry</span> : null);
  const TAG = { enquiry: ["from the quote", ""], list: ["list price", " ad-need"], auto: ["travel for this postcode", ""], edited: ["changed", " ad-need"], new: ["added", " ad-need"] };
  const zone = zoneFor(f.postcode);
  return (
    <form className="ad-edit ad-bookform" onSubmit={go} noValidate>
      <h3>Turn {q.ref} into a booking</h3>
      <p><b>Filled in from the enquiry.</b> Check it, change anything you agreed with them by phone, WhatsApp or email, then create it.</p>
      <p className="ac-small">{account ? <>They already have an account ({account.name}), so it appears there straight away.</> : <>No account yet: they&apos;ll be asked to create one with <b>{q.email}</b>, and the booking will be waiting.</>} They sign the booking agreement, then pay. Held for 7 days.</p>
      <div className="t-c2">
        <div className="t-field"><label htmlFor="bf-svc">Service {from("service")} <Tip label="About the service">Decides what the agreement says they&apos;ll receive. The price comes from the lines below. Changing the service swaps the service line for that service&apos;s list price.</Tip></label>
          <select id="bf-svc" value={f.service} onChange={(e) => changeService(e.target.value)}>
            <option value="">Other (type the name)</option>
            {GROUPS.map((g) => <optgroup key={g} label={g}>{CATALOG.filter((c) => c.group === g && !c.pay).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</optgroup>)}
          </select></div>
        <div className="t-field"><label htmlFor="bf-name">{f.service ? "Name on the booking (optional)" : "Service name"}</label><input id="bf-name" value={f.serviceName} onChange={(e) => set("serviceName", e.target.value)} placeholder={f.service ? CATALOG.find((c) => c.id === f.service)?.name : "e.g. Showcase + 2 extra rooms"} /></div>
      </div>
      <fieldset className="ac-radio"><legend>Booking as {f0.bookingAs ? <span className="ad-from">from &ldquo;{role || "company"}&rdquo;</span> : <span className="ad-from ad-need">please choose</span>}</legend>
        <label><input type="radio" name="bf-as" checked={f.bookingAs === "consumer"} onChange={() => set("bookingAs", "consumer")} /> Private customer</label>
        <label><input type="radio" name="bf-as" checked={f.bookingAs === "business"} onChange={() => set("bookingAs", "business")} /> Business</label>
      </fieldset>
      <div className="t-c2">
        <div className="t-field"><label htmlFor="bf-pc">Site postcode {from("postcode")}</label><input id="bf-pc" value={f.postcode} onChange={(e) => changePostcode(e.target.value)} /><span className="t-hint">{f.postcode && !zoneFor(f.postcode) ? "Outside the travel zones: add travel yourself if you agreed it." : zone ? `${zone.name}: ${zone.fee ? `travel ${money(zone.fee)}` : "no travel charge"}` : ""}</span></div>
        <div className="t-field"><label htmlFor="bf-addr">Site address {from("address") || <span className="ad-from ad-need">add if you have it</span>}</label><input id="bf-addr" value={f.address} onChange={(e) => set("address", e.target.value)} /></div>
      </div>
      <div className="t-c2">
        <div className="t-field"><label htmlFor="bf-date">Date agreed {from("date") || <span className="ad-from ad-need">needed</span>}</label><input id="bf-date" type="date" value={f.date} onChange={(e) => set("date", e.target.value)} /></div>
        <div className="t-field"><label htmlFor="bf-time">Time {from("time")}</label><input id="bf-time" value={f.time} onChange={(e) => set("time", e.target.value)} placeholder="10:00" /></div>
      </div>

      <div className="ad-price">
        <h4>Price <Tip label="How the price works">These lines are exactly what they chose when they asked for the quote, plus travel for their postcode. Change any amount, remove a line, add an add-on, or add your own line (use a minus amount for a discount). The total is what goes in the agreement, and the add-ons are listed there too.</Tip></h4>
        <ul className="ad-lines">
          {lines.map((l) => (
            <li key={l.id}>
              <input aria-label="What it is" value={l.name} onChange={(e) => editLine(l.id, "name", e.target.value)} />
              <span className="ad-gbp">£<input aria-label={`Price for ${l.name}`} inputMode="numeric" value={l.price} onChange={(e) => editLine(l.id, "price", e.target.value.replace(/[^\d-]/g, ""))} /></span>
              {TAG[l.src] && <span className={`ad-from${TAG[l.src][1]}`}>{TAG[l.src][0]}</span>}
              <button type="button" className="ad-x" aria-label={`Remove ${l.name}`} onClick={() => removeLine(l.id)}>✕</button>
            </li>
          ))}
        </ul>
        <div className="ad-addline">
          {addons.length > 0 && (
            <select aria-label="Add an add-on" value={pick} onChange={(e) => { const a = addons.find(([n]) => n === e.target.value); if (a) setLines((ls) => [...ls, L(a[0], a[1], "extra", "new")]); setPick(""); }}>
              <option value="">+ Add an add-on…</option>
              {addons.map(([n, p]) => <option key={n} value={n}>{n} · {money(p)}</option>)}
            </select>
          )}
          <button type="button" className="t-btn t-btn-ghost" onClick={() => setLines((ls) => [...ls, L("", "", "extra", "new")])}>+ Your own line</button>
        </div>
        <div className="ad-total">
          <span>Total</span><b>{money(total)}</b>
        </div>
        {quoted && <p className="ac-small ad-compare">{total === quoted ? "✓ Same as their quote." : `Their quote was ${money(quoted)}, so this is ${money(Math.abs(total - quoted))} ${total > quoted ? "more" : "less"}${lines.some((l) => l.src === "auto") && !q.lines?.some(([, , k]) => k === "travel") ? " (their quote didn't include travel)" : ""}.`}</p>}
      </div>

      <div className="t-field"><label htmlFor="bf-mode">Payment terms</label><select id="bf-mode" value={f.mode} onChange={(e) => set("mode", e.target.value)}><option value="deposit">25% deposit when they sign, balance before the files</option><option value="invoice">Invoice after the visit (jobs £1,000+ or repeat visits, 3.8)</option></select>
        <span className="t-hint">{f.mode === "deposit" ? `They pay ${money(deposit)} when they sign, and ${money(total - deposit)} before the files.` : "Nothing to pay up front; you invoice after the visit."}{total >= PAYMENT.largeFrom && f.mode === "deposit" ? ` At ${money(PAYMENT.largeFrom)} or more, the agreement allows invoice terms instead.` : ""}</span></div>
      <div className="t-field"><label htmlFor="bf-notes">Special notes (in the agreement) {from("notes")}</label><input id="bf-notes" value={f.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Access, site rules…" /></div>
      {msg && <p className="ac-err" role="alert">{msg}</p>}
      <div className="ac-actions">
        <button className="t-btn t-btn-primary" disabled={total <= 0 || !f.date}>Create booking for {money(total)} and email them</button>
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
          {!q.booking_ref && q.kind !== "feedback" && <AcceptCard q={q} account={d.account} onEdit={() => { setMsg(null); setBooking(true); }} onDone={(m) => { setMsg(["ok", m]); load(); onChanged(); }} />}
          {q.booking_ref && <div className="ad-accept ad-accepted"><h4>✓ Accepted</h4><p>Booked as <b className="t-mono">{q.booking_ref}</b>. Follow it in the Bookings tab: they sign, pay, then you confirm the date with It&apos;s a go.</p></div>}
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
