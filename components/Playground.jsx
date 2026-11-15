"use client";
/* THE PLAYGROUND: happydrones.co.uk/playground
   A pretend booking anyone can try: pick a service from the drop-down,
   then follow the job from booking to files, with a show-around of
   what Happy Drones does at each stage.
   Everything runs in the visitor's browser. Nothing is saved or sent:
   no booking, no payment, no emails, no calendar. Prices come from the
   real settings (lib/site.js, lib/extraServices.js), the weather is
   example weather (demoForecast in lib/wxClient.js). */
import { useMemo, useState } from "react";
import Link from "next/link";
import ServiceArt from "./ServiceArt";
import { PRICING, PLANNER, VACANT, PAYMENT, BUNDLE, AGENT_DISCOUNT, SITE, money, travelFor, depositFor } from "@/lib/site";
import { DEFAULT_DRONES, demoForecast, jobDay, dayChart, hhmm, dayLong, codeText } from "@/lib/wxClient";

const LIM = DEFAULT_DRONES[0].lim;
const ymd = (ms) => new Date(ms).toLocaleDateString("en-CA", { timeZone: "Europe/London" });
const longDay = (d) => dayLong(`${d}T12:00:00Z`);
const homes = (id) => PRICING.services.find((s) => s.id === id);
const mission = (id) => PLANNER.missions.find((m) => m.id === id);

/* The drop-down. kind decides the story; pay decides how it's paid (current booking agreement). */
const showcase = homes("showcase").base;
const GROUPS = [
  { label: "Homes and property", items: [
    { id: "essentials", name: "Essentials property package", price: homes("essentials").base, kind: "property", art: "camera", real: "/?service=essentials#quote" },
    { id: "showcase", name: "Showcase property package", price: showcase, kind: "property", art: "walkthrough", real: "/?service=showcase#quote" },
    { id: "signature", name: "Signature property package", price: homes("signature").base, kind: "property", art: "glide", real: "/?service=signature#quote" },
    { id: "aerial", name: "Aerial photos only", price: homes("aerial").base, kind: "property", art: "home", real: "/?service=aerial#quote" },
    { id: "aerial-360", name: "Aerial 360° panoramas", price: mission("aerial-360").base, kind: "property", art: "home", real: "/plan/?mission=aerial-360" },
    { id: "land-plot-photos", name: "Land and plot photos", price: mission("land-plot-photos").base, kind: "property", art: "mapping", real: "/plan/?mission=land-plot-photos" },
  ] },
  { label: "Estate agents", items: [
    { id: "bundle", name: `${BUNDLE.size}-listing bundle (Showcase)`, price: Math.round(showcase * BUNDLE.size * (1 - AGENT_DISCOUNT)), kind: "bundle", art: "agent", real: "/estate-agents/" },
  ] },
  { label: "Roofs", items: [
    { id: "roofs", name: "Roof check", price: mission("roofs").base, kind: "roof", art: "roof", real: "/plan/?mission=roofs" },
    { id: "storm-claim-pack", name: "Storm and insurance claim pack", price: mission("storm-claim-pack").base, kind: "roof", art: "roof", real: "/plan/?mission=storm-claim-pack" },
    { id: "roof-health-check", name: "Yearly roof health check", price: mission("roof-health-check").base, kind: "roof", art: "roof", real: "/plan/?mission=roof-health-check" },
    { id: "gutter-check", name: "Gutter check", price: mission("gutter-check").base, kind: "roof", art: "roof", real: "/plan/?mission=gutter-check" },
    { id: "solar-pre-survey", name: "Solar pre-survey pack", price: mission("solar-pre-survey").base, kind: "roof", art: "roof", real: "/plan/?mission=solar-pre-survey" },
  ] },
  { label: "Buildings and sites", items: [
    { id: "vacant", name: "Vacant building check (monthly)", price: VACANT.perVisit, kind: "vacant", art: "construction", real: "/vacant-property-monitoring/" },
    { id: "construction", name: "Construction progress (monthly)", price: mission("construction").base, kind: "construction", art: "construction", real: "/plan/?mission=construction" },
    { id: "before-after-pack", name: "Before-and-after pack for trades", price: mission("before-after-pack").base, kind: "construction", art: "construction", real: "/plan/?mission=before-after-pack" },
    { id: "planning-context", name: "Planning and design context photos", price: mission("planning-context").base, kind: "construction", art: "mapping", real: "/plan/?mission=planning-context" },
  ] },
  { label: "Business", items: [
    { id: "business", name: "Business content", price: mission("business").base, kind: "business", art: "business", real: "/plan/?mission=business" },
    { id: "events", name: "Event filming", price: mission("events").base, kind: "business", art: "event", real: "/plan/?mission=events" },
    { id: "film", name: "Aerial film", price: mission("film").base, kind: "business", art: "film", real: "/plan/?mission=film" },
  ] },
];
const ALL = GROUPS.flatMap((g) => g.items);
const SAMPLE = { property: "Sarah (example)", bundle: "John, Northgate Estates (example)", roof: "Meredith (example)", vacant: "Priya, Riverside Holdings (example)", construction: "Dan, Teesbuild (example)", business: "Lee, Harbour Café (example)" };

const STAGES = ["Booked", "Payment", "Date confirmed", "Morning of", "The flight", "Delivered", "Afterwards"];

function payRule(s, total) {
  if (s.kind === "bundle") return { now: total, word: "Paid in full up front", note: `Bundles are paid up front, ${Math.round(AGENT_DISCOUNT * 100)}% off, used within ${BUNDLE.months} months.` };
  if (s.kind === "vacant" || s.kind === "construction" && s.id === "construction") return { now: 0, word: `Invoiced after each visit, ${PAYMENT.termsDays} days`, note: "Regular visits are invoiced, so there's nothing to pay at booking." };
  if (total >= PAYMENT.largeFrom) return { now: 0, word: `Invoiced, ${PAYMENT.termsDays} days`, note: `Jobs of ${money(PAYMENT.largeFrom)} or more are invoiced instead of a deposit.` };
  const dep = depositFor(total);
  return { now: dep, balance: total - dep, word: `${PAYMENT.depositPct}% deposit now, balance before the files`, note: `The deposit secures the date. The balance (${money(total - dep)}) is paid after the flight, then the full files unlock.` };
}

const STEPS = {
  property: ["Arrive, say hello and check the plan for each room", "Interiors: every room shot as blended exposures", "Exteriors at eye level", "Drone up: the opening aerial, the plot and the setting", "Walkthrough or glide tour if your package has one", "Pack down: about 1–2 hours in all"],
  bundle: ["Each listing shot on your weekly slot", "Interiors, exteriors and aerials in one visit", "The walkthrough video", "Branding as you chose: standard, agency or white label", "On to the next address", "About 1–2 hours per listing"],
  roof: ["Arrive, check the take-off spot and the airspace again", "The overview: the whole roof from about 30 metres", "Every slope, square on, close enough to count tiles", "Ridge, hips, chimney and lead", "Looking down into the gutters and onto flat roofs", "Land and pack down: under an hour, nobody on the roof"],
  vacant: ["Arrive at the agreed time; no keys needed", "Fly the fixed positions agreed on the first visit", "Roof, chimneys, gutters and high windows up close", "Boundary, yard and ways in, from above", "Anything urgent? You get a message the same day", "About an hour on site"],
  construction: ["Site induction and sign-in", "Fly the agreed fixed positions and heights", "Top-down overview of the whole site", "Close views of the areas that changed", "Short progress clip", "Sign out: 1–2 hours"],
  business: ["Arrive and walk through the shot list", "Aerials of the premises and the area", "Close-ups of what you do", "Your team, if they're happy to be filmed", "Vertical clips for social media", "About a morning"],
};

const DELIVER = {
  property: "Edited photos, aerials and video in a private download link, sized for portals, websites and social media.",
  bundle: "Each listing's files the moment they're ready, with no waiting for payment.",
  roof: "An online roof report: the overview with numbered close-ups, plus the full-size photos to download.",
  vacant: "A dated report: new issues first, numbered on the overview, older ones marked open or fixed.",
  construction: "A dated folder for the visit: the same fixed positions as last time, plus the overview and a short clip.",
  business: "Edited photos and short clips, landscape and vertical, ready to post.",
};

function Email({ from = `Happy Drones <${SITE.email}>`, subject, children }) {
  return (
    <div className="pg-email">
      <div className="pg-email-head"><span>Example email</span><b>{subject}</b><small>From {from}</small></div>
      <div className="pg-email-body">{children}</div>
    </div>
  );
}

export default function Playground() {
  const [svcId, setSvcId] = useState("");
  const [pc, setPc] = useState("TS17 6AB");
  const [date, setDate] = useState(() => ymd(Date.now() + 4 * 864e5));
  const [stage, setStage] = useState(-1); // -1 = setting up
  const [paid, setPaid] = useState(false);

  const s = ALL.find((x) => x.id === svcId);
  const area = (pc.toUpperCase().replace(/\s+/g, "").match(/^[A-Z]{1,2}/) || [""])[0];
  const zone = area ? travelFor(area) : null;
  const travel = s?.kind === "bundle" ? 0 : zone?.fee || 0;
  const total = s ? s.price + travel : 0;
  const pay = s ? payRule(s, total) : null;
  const name = s ? SAMPLE[s.kind] : "";
  const code = useMemo(() => `HD-DEMO-${(svcId || "x").slice(0, 2).toUpperCase()}`, [svcId]);

  // Example weather for the chosen date (not a real forecast)
  const wx = useMemo(() => {
    const fc = demoForecast(54.55, -1.3, 3);
    const day = jobDay(fc, date, 54.55, -1.3, LIM, s?.id);
    const chart = dayChart(fc, date, 54.55, -1.3, LIM);
    let alt = null;
    if (day?.best?.level === 2) for (let i = 1; i < 6 && !alt; i++) { const d2 = ymd(new Date(`${date}T12:00:00Z`).getTime() + i * 864e5); const j = jobDay(fc, d2, 54.55, -1.3, LIM, s?.id); if (j?.best && j.best.level < 2) alt = { d: d2, j }; }
    return { day, chart, alt };
  }, [date, s?.id]);
  const best = wx.day?.best;
  const flyDate = best && best.level === 2 && wx.alt ? wx.alt.d : date;
  const flyBest = best && best.level === 2 && wx.alt ? wx.alt.j.best : best;
  const slot = flyBest ? hhmm(flyBest.start) : "10:00";

  const ready = s && /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i.test(pc.trim()) && date;
  const realHref = s ? `${s.real}${s.real.includes("/plan/") ? `&pc=${encodeURIComponent(pc.trim())}&date=${flyDate}` : ""}` : "/plan/";

  const start = () => { setPaid(false); setStage(0); };
  const reset = () => { setStage(-1); setPaid(false); };

  return (
    <div className="pg">
      <p className="pg-banner" role="note"><b>Playground.</b> Nothing here is real: no booking, no payment, no emails. Try anything.</p>

      {stage < 0 ? (
        <div className="pg-setup">
          <div className="t-field pg-pick">
            <label htmlFor="pg-svc">What do you need?</label>
            <select id="pg-svc" value={svcId} onChange={(e) => setSvcId(e.target.value)}>
              <option value="">Choose a service…</option>
              {GROUPS.map((g) => (
                <optgroup key={g.label} label={g.label}>
                  {g.items.map((x) => <option key={x.id} value={x.id}>{x.name} · {money(x.price)}</option>)}
                </optgroup>
              ))}
            </select>
          </div>
          <div className="t-c2">
            <div className="t-field"><label htmlFor="pg-pc">Postcode of the site</label><input id="pg-pc" value={pc} onChange={(e) => setPc(e.target.value)} autoComplete="off" /><span className="t-hint">{!area ? "Any UK postcode." : zone ? (zone.fee ? `${zone.name}: +${money(zone.fee)} travel` : `${zone.name}: travel included`) : "Outside the usual area: travel would be quoted."}</span></div>
            <div className="t-field"><label htmlFor="pg-date">Date you'd like</label><input id="pg-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} /><span className="t-hint">The playground uses example weather.</span></div>
          </div>
          {s && (
            <div className="pg-summary">
              <div className="pg-art"><ServiceArt name={s.art} /></div>
              <div>
                <p className="t-mono">You&apos;ll play {name}</p>
                <h3>{s.name}</h3>
                <p className="pg-price">{money(total)}{travel ? <small> incl. {money(travel)} travel</small> : null}</p>
                <p className="pg-paynote">{pay.word}</p>
              </div>
            </div>
          )}
          <button type="button" className="t-btn t-btn-primary" disabled={!ready} onClick={start}>Book it in the playground</button>
          {!s && <p className="t-hint">Pick a service to start.</p>}
        </div>
      ) : (
        <div className="pg-run">
          <ol className="pg-stages" aria-label="Stages">
            {STAGES.map((t, i) => (
              <li key={t}><button type="button" className={i === stage ? "is-on" : i < stage ? "is-done" : undefined} onClick={() => setStage(i)} aria-current={i === stage ? "step" : undefined}><span>{i + 1}</span>{t}</button></li>
            ))}
          </ol>

          <div className="pg-panel">
            <p className="t-mono pg-job">{code} · {s.name} · {pc.toUpperCase()} · {name}</p>

            {stage === 0 && (<>
              <h2>Your booking is in.</h2>
              <Email subject={`Booking received: ${s.name}, ${pc.toUpperCase()}`}>
                <p>Hi {name.split(" ")[0].replace(",", "")},</p>
                <p>Thanks for booking a {s.name.toLowerCase()} at {pc.toUpperCase()} for {longDay(date)}. I&apos;ll check the airspace and the weather and confirm your date within a day.</p>
                <p>Price: <b>{money(total)}</b>. {pay.word}.</p>
                <p>Your bookings, any time: <u>My bookings</u> (a private link, no password).</p>
              </Email>
              <aside className="pg-how"><b>How Happy Drones helps</b><p>You get this straight away, with the booking agreement attached. At the same moment, Wayne sees a new booking in his admin with the job page: a map of the site and the forecast for your date.</p></aside>
            </>)}

            {stage === 1 && (<>
              <h2>{pay.now ? "Pay to secure the date." : "Nothing to pay today."}</h2>
              <div className="pg-pay">
                <p className="pg-pay-demo">Demo payment screen. No money is taken.</p>
                <div className="pg-pay-row"><span>{s.name}</span><b>{money(total)}</b></div>
                <div className="pg-pay-row"><span>Due today</span><b>{money(pay.now)}</b></div>
                {pay.now > 0 ? (
                  paid ? <p className="pg-ok">Paid (pretend). A receipt and an invoice are emailed to you.</p>
                    : <button type="button" className="t-btn t-btn-primary" onClick={() => setPaid(true)}>Pay {money(pay.now)} (demo)</button>
                ) : <p className="pg-ok">{pay.word}. Nothing to pay now.</p>}
              </div>
              <aside className="pg-how"><b>How Happy Drones helps</b><p>{pay.note} Card details go to Stripe&apos;s secure page, never to the Happy Drones website.</p></aside>
            </>)}

            {stage === 2 && (<>
              <h2>Your date is confirmed{flyDate !== date ? " (moved for the weather)" : ""}.</h2>
              <ul className="pg-checks">
                <li>Airspace checked for {pc.toUpperCase()}: clear for this flight <small>(example)</small></li>
                <li>Site and take-off spot planned from the map</li>
                <li>Weather for {longDay(date)}: {best ? (best.level === 2 ? "too windy or wet" : best.level === 1 ? "some risk" : "looks good") : "too far ahead to forecast yet"} <small>(example weather)</small></li>
              </ul>
              {wx.chart && (
                <div className="pw-chart pg-chart">
                  <div className="pw-bars" aria-hidden="true">
                    {wx.chart.rows.map((r) => <span key={r.ms} className={`pw-bar pw-${!r.has ? "na" : r.dark ? "dark" : ["good", "risk", "poor"][r.level]}`}><span className="pw-fill" style={{ height: `${r.has ? (r.dark ? 100 : r.strength) : 0}%` }} /><span className="pw-h">{hhmm(r.ms).slice(0, 2)}</span></span>)}
                  </div>
                  <p className="pw-sun"><span>Sunrise {hhmm(wx.chart.sun.sunrise)}</span><span>Sunset {hhmm(wx.chart.sun.sunset)}</span></p>
                </div>
              )}
              <Email subject={`Date confirmed: ${longDay(flyDate)}, ${slot}`}>
                <p>All checked. I&apos;ll be with you on <b>{longDay(flyDate)}</b> at about <b>{slot}</b>{flyDate !== date ? `, the next good day for flying (${longDay(date)} looks too windy or wet)` : ""}.</p>
                <p>If the weather turns, I&apos;ll move it to the next good day at no cost.</p>
              </Email>
              <aside className="pg-how"><b>How Happy Drones helps</b><p>Wayne checks the airspace, the site and the forecast before confirming. The job goes into his calendar with the map, the forecast and your notes, so nothing is missed on the day.</p></aside>
            </>)}

            {stage === 3 && (<>
              <h2>The morning of the flight.</h2>
              <Email subject={`Today's flight: weather check for ${pc.toUpperCase()}`}>
                <p>Good morning. The forecast for {pc.toUpperCase()} still looks {flyBest && flyBest.level === 1 ? "flyable, with some risk" : "good"}: {flyBest?.sky ? `${flyBest.sky.toLowerCase()}, ` : ""}gusts around {flyBest ? flyBest.gust : 10} mph, {flyBest ? flyBest.rain : 10}% chance of rain.</p>
                <p>See you at about {slot}. {s.kind === "property" || s.kind === "bundle" ? "Lights on, curtains open and cars off the drive if you can." : s.kind === "roof" ? "You don't need to be in." : "No need to wait around."}</p>
              </Email>
              <aside className="pg-how"><b>How Happy Drones helps</b><p>Every flight day starts with a fresh weather check. If it&apos;s not safe or the photos would be poor, you&apos;re told first thing and the date moves free. You never pay for a flight the weather spoiled.</p></aside>
            </>)}

            {stage === 4 && (<>
              <h2>On site.</h2>
              <div className="pg-flight">
                <div className="pg-art"><ServiceArt name={s.art} /></div>
                <ol className="pg-steps">{STEPS[s.kind].map((t) => <li key={t}>{t}</li>)}</ol>
              </div>
              <aside className="pg-how"><b>How Happy Drones helps</b><p>CAA registered, A2 CofC qualified and insured with £10 million public liability as a minimum. Flights are planned to avoid filming neighbours and people who aren&apos;t involved.</p></aside>
            </>)}

            {stage === 5 && (<>
              <h2>Your files are ready.</h2>
              {pay.balance > 0 && <p className="pg-ok">Balance of {money(pay.balance)} paid (pretend), so the full files unlocked.</p>}
              <Email subject={`Your files are ready: ${s.name}, ${pc.toUpperCase()}`}>
                <p>{DELIVER[s.kind]}</p>
                <p><u>Open your files</u> · also in <u>My bookings</u></p>
              </Email>
              <div className="pg-deliver">
                {s.kind === "roof" && <Link className="t-btn t-btn-ghost" href="/report/example/" target="_blank">See an example roof report ↗</Link>}
                {s.kind === "vacant" && <Link className="t-btn t-btn-ghost" href="/vacant-property-monitoring/#vp-rep-title" target="_blank">See an example monthly report ↗</Link>}
                {s.kind === "construction" && <Link className="t-btn t-btn-ghost" href="/construction/" target="_blank">See how progress visits line up ↗</Link>}
                {(s.kind === "property" || s.kind === "bundle") && <Link className="t-btn t-btn-ghost" href="/property-photography/" target="_blank">See the photo styles ↗</Link>}
                {s.kind === "business" && <Link className="t-btn t-btn-ghost" href="/local-business/" target="_blank">See what a shoot produces ↗</Link>}
              </div>
              {s.kind === "bundle" && <div className="pg-count"><b>1 of {BUNDLE.size}</b> listings used · {BUNDLE.size - 1} left · add your next address any time</div>}
              <aside className="pg-how"><b>How Happy Drones helps</b><p>Files arrive within 48–72 hours, in a private folder that only you can open. Your &ldquo;My bookings&rdquo; page keeps every job, date and file in one place.</p></aside>
            </>)}

            {stage === 6 && (<>
              <h2>Afterwards.</h2>
              <Email subject="How did I do?">
                <p>Thanks again for booking. If you have a minute, a short review helps other people find a careful, insured drone pilot: <u>Leave a review</u>.</p>
                {s.kind === "roof" && <p>Want a reminder next year? The yearly roof health check is {money(mission("roof-health-check").base)} a year.</p>}
                {(s.kind === "vacant" || s.id === "construction") && <p>Your next visit is booked for {longDay(ymd(new Date(`${flyDate}T12:00:00Z`).getTime() + 30 * 864e5))}, from the same positions.</p>}
                {s.kind === "bundle" && <p>You have {BUNDLE.size - 1} listings left on your bundle, to use within {BUNDLE.months} months.</p>}
              </Email>
              <aside className="pg-how"><b>How Happy Drones helps</b><p>No chasing: reminders, next visits and review requests are sent automatically, and you can unsubscribe from anything that isn&apos;t about your booking.</p></aside>
              <div className="pg-end">
                <Link className="t-btn t-btn-primary" href={realHref}>Book this for real</Link>
                <button type="button" className="t-btn t-btn-ghost" onClick={reset}>Try another service</button>
              </div>
            </>)}

            <div className="pg-nav">
              <button type="button" className="t-btn t-btn-ghost" onClick={() => (stage === 0 ? reset() : setStage(stage - 1))}>{stage === 0 ? "← Change service" : "← Back"}</button>
              {stage < STAGES.length - 1 && <button type="button" className="t-btn t-btn-primary" disabled={stage === 1 && pay.now > 0 && !paid} onClick={() => setStage(stage + 1)}>Next: {STAGES[stage + 1]} →</button>}
            </div>
            {stage === 1 && pay.now > 0 && !paid && <p className="t-hint pg-hint">Tap the demo payment to carry on.</p>}
            {stage < STAGES.length - 1 && <p className="pg-real">Ready? <Link href={realHref}>Book this for real</Link>: your postcode and date carry over.</p>}
          </div>
        </div>
      )}
    </div>
  );
}
