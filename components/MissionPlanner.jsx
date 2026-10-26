"use client";
/* Plan a mission: pick the job, its scale, how often, extras and where.
   A live flight-plan card shows the guide price and a mission code.
   Sent by lib/sendForm.js (email via Web3Forms, backup in Netlify Forms,
   form name "mission"). The hidden copy of this form lives in
   public/__forms.html: keep the field names the same. */
import { useEffect, useMemo, useState } from "react";
import { PLANNER, PAYMENT, SITE, money, depositFor, whatsappLink } from "@/lib/site";
import { Arrow } from "./TIcons";
import { sendEnquiry } from "@/lib/sendForm";

const INCLUDED = ["NE", "SR", "DH", "TS", "DL"];
const NEARBY = ["CA", "YO", "HG", "DG", "TD"];

function postcodeInfo(pc) {
  const clean = pc.toUpperCase().replace(/\s+/g, "");
  if (!clean) return { ok: false, msg: "Travel is included across NE, SR, DH, TS and DL postcodes." };
  if (!/^[A-Z]{1,2}\d[A-Z\d]?(\d[A-Z]{2})?$/.test(clean)) return { ok: false, cls: "warn", msg: "That doesn't look like a UK postcode yet, for example NE1 4ST." };
  const area = clean.match(/^[A-Z]{1,2}/)[0];
  if (INCLUDED.includes(area)) return { ok: true, cls: "ok", msg: `${area}: inside the core area. Travel included.` };
  if (NEARBY.includes(area)) return { ok: true, cls: "warn", travel: 45, msg: `${area}: covered, with a £45 travel fee.` };
  return { ok: true, cls: "warn", travel: null, msg: `${area}: outside the usual area. Travel will be quoted with your plan.` };
}

export function priceMission(st) {
  const m = PLANNER.missions.find((x) => x.id === st.mission);
  const sc = PLANNER.scale.find((x) => x.id === st.scale);
  const fr = PLANNER.frequency.find((x) => x.id === st.freq);
  if (!m || !sc || !fr) return null;
  const base = Math.round((m.base * sc.mult) / 5) * 5;
  const extras = PLANNER.extras.filter((x) => st.extras.includes(x.id));
  const perVisit = base + extras.reduce((a, x) => a + x.price, 0);
  const gross = perVisit * fr.visits;
  const disc = Math.round(gross * fr.disc);
  const travel = postcodeInfo(st.postcode).travel || 0;
  const total = gross - disc + travel * fr.visits;
  return { m, sc, fr, base, extras, perVisit, gross, disc, travel, total };
}

export default function MissionPlanner() {
  const [st, setSt] = useState({ mission: "construction", scale: "medium", freq: "monthly", extras: [], postcode: "", date: "", name: "", company: "", email: "", phone: "", notes: "" });
  const [code, setCode] = useState("HD-····");
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const q = new URLSearchParams(location.search).get("mission");
    if (q && PLANNER.missions.some((m) => m.id === q)) setSt((s) => ({ ...s, mission: q, freq: q === "construction" ? "monthly" : "once" }));
    setCode(`HD-${Math.random().toString(36).slice(2, 6).toUpperCase()}`);
  }, []);

  const set = (k, v) => setSt((s) => ({ ...s, [k]: v }));
  const toggle = (id) => setSt((s) => ({ ...s, extras: s.extras.includes(id) ? s.extras.filter((x) => x !== id) : [...s.extras, id] }));
  const q = useMemo(() => priceMission(st), [st]);
  const pc = postcodeInfo(st.postcode);
  const fullCode = q ? `${code}-${q.m.code}` : code;

  const summary = q ? [
    `${q.m.name} · ${q.sc.name} · ${q.fr.name}`,
    `Per visit ${money(q.perVisit)} (${q.extras.map((x) => x.name).join(", ") || "no extras"})`,
    q.disc ? `Multi-visit saving -${money(q.disc)}` : "",
    q.travel ? `Travel ${money(q.travel)} per visit` : "",
    `Guide total ${money(q.total)}`,
    `Location ${st.postcode.toUpperCase() || "not given"}${st.date ? ` · first date ${st.date}` : ""}`,
  ].filter(Boolean).join("\n") : "";

  async function submit(e) {
    e.preventDefault();
    if (!st.name.trim() || (!st.email.trim() && st.phone.replace(/\D/g, "").length < 10)) { setMsg("Add your name and an email or phone number so I can send the plan."); return; }
    if (!pc.ok) { setMsg("Add the site postcode so I can check the airspace."); return; }
    setStatus("sending"); setMsg("");
    const fields = { "form-name": "mission", subject: `Mission ${fullCode} · ${q.m.name} · ${money(q.total)}`, code: fullCode, plan: summary, total: money(q.total), ...Object.fromEntries(Object.entries(st).map(([k, v]) => [k, Array.isArray(v) ? v.join(", ") : v])), "bot-field": "" };
    try {
      await sendEnquiry(fields);
      setStatus("sent");
    } catch {
      setStatus("error"); setMsg("That didn't send. Use WhatsApp below and your plan goes with it.");
    }
  }

  const today = new Date(); today.setDate(today.getDate() + 3);
  const minDate = today.toISOString().slice(0, 10);

  return (
    <div className="t-planner">
      {status === "sent" ? (
        <div className="t-sent">
          <span className="t-tag">Plan received</span>
          <h2 style={{ fontSize: "var(--t-s3)" }}>Mission {fullCode} is logged.</h2>
          <p className="t-lede">I&apos;ll check the airspace for {st.postcode.toUpperCase()} and reply within a day with a fixed price and a written flight plan.</p>
          <a className="t-btn t-btn-ghost" href={whatsappLink(`Mission ${fullCode}\n${summary}`)} target="_blank" rel="noopener">Follow up on WhatsApp <Arrow /></a>
        </div>
      ) : (
        <form className="t-pl-form" name="mission" onSubmit={submit} noValidate>
          <input type="hidden" name="form-name" value="mission" />
          <p className="t-hp"><label>Leave this empty <input name="bot-field" tabIndex={-1} autoComplete="off" /></label></p>

          <fieldset className="t-pl-step" style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}>
            <header><span className="t-mono">01</span><h2>Mission type</h2></header>
            <div className="t-opts t-c2">
              {PLANNER.missions.map((m) => (
                <label className="t-opt" key={m.id}>
                  <input type="radio" name="mission" value={m.id} checked={st.mission === m.id} onChange={() => setSt((s) => ({ ...s, mission: m.id, freq: m.id === "construction" ? s.freq : "once" }))} />
                  <span className="t-o"><span className="t-r"><b>{m.name}</b><span className="t-m">{m.code}</span></span><small>From {money(m.base)}{m.unit ? ` ${m.unit}` : ""}</small></span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="t-pl-step" style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}>
            <header><span className="t-mono">02</span><h2>Scale</h2></header>
            <div className="t-opts t-c3">
              {PLANNER.scale.map((s) => (
                <label className="t-opt" key={s.id}>
                  <input type="radio" name="scale" value={s.id} checked={st.scale === s.id} onChange={() => set("scale", s.id)} />
                  <span className="t-o"><span className="t-r"><b>{s.name}</b><span className="t-m">×{s.mult}</span></span><small>{s.note}</small></span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="t-pl-step" style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}>
            <header><span className="t-mono">03</span><h2>How often</h2></header>
            <div className="t-opts t-c2">
              {PLANNER.frequency.map((f) => (
                <label className="t-opt" key={f.id}>
                  <input type="radio" name="freq" value={f.id} checked={st.freq === f.id} onChange={() => set("freq", f.id)} />
                  <span className="t-o"><span className="t-r"><b>{f.name}</b><span className="t-m">{f.disc ? `−${f.disc * 100}%` : "single"}</span></span><small>{f.visits === 1 ? "One visit" : `${f.visits} visits from the same positions`}</small></span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="t-pl-step" style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}>
            <header><span className="t-mono">04</span><h2>Extras <span className="t-mono" style={{ color: "var(--fg-soft)" }}>per visit</span></h2></header>
            <div className="t-opts t-c2">
              {PLANNER.extras.map((x) => (
                <label className="t-opt" key={x.id}>
                  <input type="checkbox" name="extras" value={x.id} checked={st.extras.includes(x.id)} onChange={() => toggle(x.id)} />
                  <span className="t-o"><span className="t-r"><b>{x.name}</b><span className="t-m">+{money(x.price)}</span></span></span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="t-pl-step" style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}>
            <header><span className="t-mono">05</span><h2>Where and when</h2></header>
            <div className="t-fields t-c2">
              <div className="t-field"><label htmlFor="pl-postcode">Site postcode</label><input id="pl-postcode" name="postcode" autoComplete="postal-code" placeholder="NE1 4ST" value={st.postcode} onChange={(e) => set("postcode", e.target.value)} aria-describedby="pl-pc-hint" /><span id="pl-pc-hint" className={`t-hint ${pc.cls ? "t-" + pc.cls : ""}`}>{pc.msg}</span></div>
              <div className="t-field"><label htmlFor="pl-date">First flight (preferred)</label><input id="pl-date" name="date" type="date" min={minDate} value={st.date} onChange={(e) => set("date", e.target.value)} /><span className="t-hint">A backup weather date is set when you book.</span></div>
            </div>
          </fieldset>

          <fieldset className="t-pl-step" style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}>
            <header><span className="t-mono">06</span><h2>Send the plan to</h2></header>
            <div className="t-fields t-c2">
              <div className="t-field"><label htmlFor="pl-name">Name</label><input id="pl-name" name="name" autoComplete="name" value={st.name} onChange={(e) => set("name", e.target.value)} /></div>
              <div className="t-field"><label htmlFor="pl-company">Company</label><input id="pl-company" name="company" autoComplete="organization" value={st.company} onChange={(e) => set("company", e.target.value)} /></div>
              <div className="t-field"><label htmlFor="pl-email">Email</label><input id="pl-email" name="email" type="email" autoComplete="email" value={st.email} onChange={(e) => set("email", e.target.value)} /></div>
              <div className="t-field"><label htmlFor="pl-phone">Phone</label><input id="pl-phone" name="phone" type="tel" autoComplete="tel" value={st.phone} onChange={(e) => set("phone", e.target.value)} /></div>
              <div className="t-field" style={{ gridColumn: "1 / -1" }}><label htmlFor="pl-notes">Anything I should know?</label><textarea id="pl-notes" name="notes" placeholder="Site access, deadlines, what the footage is for…" value={st.notes} onChange={(e) => set("notes", e.target.value)} /></div>
            </div>
          </fieldset>

          <div style={{ display: "grid", gap: 12 }}>
            <p className="t-form-msg" role="status">{msg}</p>
            <div className="t-hero-ctas">
              <button className="t-btn t-btn-primary" type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending…" : "Send my mission plan"} <Arrow /></button>
              {status === "error" && <a className="t-btn t-btn-ghost" href={whatsappLink(`Mission ${fullCode}\n${summary}`)} target="_blank" rel="noopener">Send on WhatsApp</a>}
            </div>
            <p className="t-pc-note">I reply within a day with a fixed price. Nothing is booked until you say yes.</p>
          </div>
        </form>
      )}

      <aside className="t-plan-card t-frame" aria-live="polite" aria-label="Your flight plan">
        <header><b>{fullCode}</b><span className="t-live">Draft</span></header>
        {q && (
          <div className="t-plan-body">
            <div className="t-pc-line"><span>{q.m.name} · {q.sc.name}</span><span>{money(q.base)}</span></div>
            {q.extras.map((x) => <div className="t-pc-line" key={x.id}><span>{x.name}</span><span>+{money(x.price)}</span></div>)}
            <div className="t-pc-line"><span>Per visit</span><span>{money(q.perVisit)}</span></div>
            <div className="t-pc-line"><span>Visits</span><span>× {q.fr.visits}</span></div>
            {q.disc > 0 && <div className="t-pc-line t-disc"><span>Multi-visit saving ({q.fr.disc * 100}%)</span><span>−{money(q.disc)}</span></div>}
            {q.travel > 0 && <div className="t-pc-line"><span>Travel ({money(q.travel)} per visit)</span><span>+{money(q.travel * q.fr.visits)}</span></div>}
            <div className="t-pc-total"><span className="t-mono">GUIDE TOTAL</span><b>{money(q.total)}</b></div>
            <p className="t-pc-note">{q.fr.visits > 1 ? `${money(Math.round(q.total / q.fr.visits))} per visit on average. ` : ""}Guide price. A fixed quote and written flight plan follow within a day. {q.total >= PAYMENT.largeFrom || q.fr.visits > 1 ? `Invoiced${q.fr.visits > 1 ? " per visit" : ""} on ${PAYMENT.termsDays}-day terms.` : `A ${PAYMENT.depositPct}% deposit (${money(depositFor(q.total))}) secures the date.`}</p>
          </div>
        )}
      </aside>
    </div>
  );
}
