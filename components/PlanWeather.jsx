"use client";
/* The weather for the customer's date, on /plan (step 07 of MissionPlanner).
   Uses the Met Office forecast through /api/plan-weather, which only answers
   once the customer has filled in their name and email, and limits how many
   areas each person can check (see functions/api/plan-weather.js).
   Shows: a verdict for their date, a rough best time, an hour-by-hour bar
   chart they can tap to pick a time (dark hours greyed out), sunrise/sunset,
   and up to 3 better dates in the forecast to switch to.
   Verdicts use the Mini 4 Pro limits (DEFAULT_DRONES in lib/wxClient.js). */
import { useEffect, useMemo, useRef, useState } from "react";
import { DEFAULT_DRONES, jobDay, dayChart, lastForecastDay, hhmm, dayLong, codeText } from "@/lib/wxClient";

const LIM = DEFAULT_DRONES[0].lim;
const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,255}\.[a-z]{2,}$/i;
const outcodeOf = (pc) => { const c = String(pc || "").toUpperCase().replace(/\s+/g, ""); const m = c.match(/^([A-Z]{1,2}\d[A-Z\d]?)(\d[A-Z]{2})?$/); return m ? m[1] : ""; };
const ymd = (d) => new Date(d).toLocaleDateString("en-CA", { timeZone: "Europe/London" });
const hourOf = (ms) => hhmm(ms).slice(0, 2) + ":00";

const VERDICT = [
  { cls: "good", word: "Looks good", say: "Light wind and a low chance of rain." },
  { cls: "risk", word: "Some risk", say: "Flyable, but wind or showers could get in the way." },
  { cls: "poor", word: "Likely to move", say: "Too windy or wet to fly well. A better date is below." },
];
const LEVEL_WORD = ["Good", "Some risk", "Poor"];

function dayVerdict(d) {
  if (!d || !d.best) return null;
  if (d.best.level === 2) return 2;
  if (d.best.level === 0 && d.goCount >= 3) return 0;
  return 1;
}

export default function PlanWeather({ st, minDate, onDate, onTime, onSummary }) {
  const opened = useRef(Date.now());
  const [fc, setFc] = useState(null);       // { area, place, lat, lon, hourly, three }
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const oc = outcodeOf(st.postcode);
  const missing = [
    !oc && "the site postcode",
    !st.date && "a date",
    st.name.trim().length < 2 && "your name",
    !EMAIL.test(st.email.trim()) && "your email",
  ].filter(Boolean);
  const stale = fc && fc.area !== oc;

  async function check() {
    if (missing.length) return;
    setBusy(true); setErr("");
    try {
      const hp = document.querySelector('form[name="mission"] input[name="bot-field"]')?.value || "";
      const r = await fetch("/api/plan-weather", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ postcode: st.postcode, name: st.name, email: st.email, hp, ms: Date.now() - opened.current }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) { setErr(j.message || "The weather check isn't available right now. Send your plan and I'll check your date for you."); setFc(null); }
      else setFc(j);
    } catch { setErr("No connection, so no weather right now. Your plan still sends."); }
    setBusy(false);
  }

  const view = useMemo(() => {
    if (!fc || stale || !st.date) return null;
    const last = lastForecastDay(fc);
    const inRange = st.date <= last;
    const day = inRange ? jobDay(fc, st.date, fc.lat, fc.lon, LIM, st.mission) : null;
    const chart = inRange ? dayChart(fc, st.date, fc.lat, fc.lon, LIM) : null;
    // other dates the forecast covers, best first
    const others = [];
    for (let t = new Date(`${minDate}T12:00:00Z`); ymd(t) <= last; t = new Date(t.getTime() + 864e5)) {
      const d = ymd(t);
      if (d === st.date) continue;
      const jd = jobDay(fc, d, fc.lat, fc.lon, LIM, st.mission);
      const v = dayVerdict(jd);
      if (v != null && v < 2) others.push({ d, v, jd });
    }
    others.sort((a, b) => a.v - b.v || b.jd.goCount - a.jd.goCount || a.d.localeCompare(b.d));
    return { last, inRange, day, chart, verdict: dayVerdict(day), others: others.slice(0, 3) };
  }, [fc, stale, st.date, st.mission, minDate]);

  const pick = view?.chart?.rows.find((r) => st.time && hourOf(r.ms) === st.time);

  // A one-line note of what the customer saw, for the email
  useEffect(() => {
    if (!view) { onSummary(""); return; }
    const when = dayLong(`${st.date}T12:00:00Z`);
    let s;
    if (!view.inRange) s = `${when}: beyond the forecast when they checked`;
    else if (view.verdict == null) s = `${when}: no forecast detail`;
    else s = `${when}: ${VERDICT[view.verdict].word}${view.day?.best && view.verdict < 2 ? `, best about ${hhmm(view.day.best.start)}–${hhmm(view.day.best.end)}` : ""}`;
    if (pick) s += `. Their time ${st.time}: ${pick.dark ? "dark" : LEVEL_WORD[pick.level].toLowerCase()}`;
    onSummary(`${s} (${fc.area}, checked ${dayLong(fc.fetchedAt)})`);
  }, [view, pick, st.date, st.time, fc, onSummary]);

  const ready = !missing.length;

  return (
    <div className="pw">
      {!fc || stale ? (
        <div className="pw-start">
          <p className="pw-lede">See the Met Office forecast for your area and date, the best time of day to fly, and a better date if yours looks poor. It reaches about a week ahead.</p>
          {!ready && <p className="pw-need">To check, add {missing.length > 1 ? `${missing.slice(0, -1).join(", ")} and ${missing.at(-1)}` : missing[0]} above.</p>}
          <button type="button" className="t-btn t-btn-ghost" onClick={check} disabled={!ready || busy}>
            {busy ? "Checking the forecast…" : stale ? `Check the weather for ${oc}` : "Check the weather for my date"}
          </button>
          {err && <p className="pw-err" role="alert">{err}</p>}
        </div>
      ) : view && (
        <div className="pw-out" aria-live="polite">
          <p className="pw-where t-mono">{dayLong(`${st.date}T12:00:00Z`)} · {fc.area}{fc.place ? `, ${fc.place}` : ""}</p>

          {!view.inRange ? (
            <div className="pw-verdict pw-none">
              <b>Too far ahead to forecast yet</b>
              <p>The forecast reaches {dayLong(`${view.last}T12:00:00Z`)}. Your date can still be booked: if the weather&apos;s bad on the day, it moves to the next good date at no cost.</p>
            </div>
          ) : view.verdict == null ? (
            <div className="pw-verdict pw-none"><b>No detail for this date yet</b><p>Try again nearer the time.</p></div>
          ) : (
            <div className={`pw-verdict pw-${VERDICT[view.verdict].cls}`}>
              <span className="pw-badge">{VERDICT[view.verdict].word}</span>
              <p>{VERDICT[view.verdict].say}</p>
              {view.verdict < 2 && view.day.best && <p className="pw-best">Best time, roughly: <b>{hhmm(view.day.best.start)} to {hhmm(view.day.best.end)}</b></p>}
            </div>
          )}

          {view.chart && (
            <figure className="pw-chart">
              <figcaption>
                <span>Flying conditions through the day. Tap an hour to pick your time.</span>
                <span className="pw-key"><i className="k-good" />Good <i className="k-risk" />Some risk <i className="k-poor" />Poor <i className="k-dark" />Dark</span>
              </figcaption>
              <div className="pw-bars" role="radiogroup" aria-label="Pick a time">
                {view.chart.rows.map((r) => {
                  const t = hourOf(r.ms);
                  const cls = !r.has ? "na" : r.dark ? "dark" : ["good", "risk", "poor"][r.level];
                  const on = st.time === t;
                  const label = `${t}: ${!r.has ? "no forecast" : r.dark ? "dark" : LEVEL_WORD[r.level]}`;
                  return (
                    <button type="button" key={r.ms} role="radio" aria-checked={on} aria-label={label} title={label}
                      className={`pw-bar pw-${cls}${on ? " is-on" : ""}`} onClick={() => onTime(on ? "" : t)}>
                      <span className="pw-fill" style={{ height: `${r.has ? (r.dark ? 100 : r.strength) : 0}%` }} />
                      <span className="pw-h">{t.slice(0, 2)}</span>
                    </button>
                  );
                })}
              </div>
              <p className="pw-sun"><span>Sunrise {hhmm(view.chart.sun.sunrise)}</span><span>Sunset {hhmm(view.chart.sun.sunset)}</span><span>Golden light to {hhmm(view.chart.sun.goldenMorningEnd)} and from {hhmm(view.chart.sun.goldenEveningStart)}</span></p>
              {st.time && (
                <p className={`pw-pick pw-${!pick || !pick.has ? "na" : pick.dark ? "dark" : ["good", "risk", "poor"][pick.level]}`}>
                  <b>Your time, {st.time}:</b>{" "}
                  {!pick ? "outside daylight, too dark for photos." : !pick.has ? "no forecast for that hour yet."
                    : pick.dark ? `dark by then (sunset ${hhmm(view.chart.sun.sunset)}), too dark for photos.`
                    : `${LEVEL_WORD[pick.level]}. ${[codeText(pick.x), `gusts ${Math.round(pick.gust)} mph`, pick.p != null ? `${pick.p}% chance of rain` : "", pick.c != null ? `${Math.round(pick.c)}°C` : ""].filter(Boolean).join(", ")}.`}
                </p>
              )}
            </figure>
          )}

          {view.others.length > 0 && (view.verdict == null || view.verdict > 0 || !view.inRange) && (
            <div className="pw-alts">
              <p>{view.inRange ? "Better dates in the forecast:" : "Dates in the forecast that look good:"}</p>
              <div className="pw-alt-row">
                {view.others.map((o) => (
                  <button type="button" key={o.d} className={`pw-alt pw-${VERDICT[o.v].cls}`} onClick={() => onDate(o.d)}>
                    <b>{dayLong(`${o.d}T12:00:00Z`)}</b>
                    <span>{VERDICT[o.v].word}{o.jd.best ? ` · ${hhmm(o.jd.best.start)}–${hhmm(o.jd.best.end)}` : ""}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className="pw-note">A rough guide from the Met Office forecast for the {fc.area} area, checked against my drone&apos;s limits. I make the final call nearer the day, and if the weather turns, your date moves to the next good one at no cost.</p>
        </div>
      )}
    </div>
  );
}
