"use client";
/* The /map page: one planned job, for Wayne.
   Opened from the "Job page" link in a mission plan email:
   /map/?pc=TS17+6AB&lat=54.55&lon=-1.31&c=HD-AB12-CP&k=construction&m=…&d=2026-11-20
   Shows the job details, a map of the site (tap to open it in a maps app),
   reference details, and the weather for the job day with a rough best time.
   The weather uses the weather check's Met Office forecast, so it asks for
   the weather check passcode if this device isn't signed in.
   Helpers: lib/siteMap.js (map, links) and lib/wxClient.js (jobDay, judge). */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SITE, travelFor } from "@/lib/site";
import { lookupPostcode, milesBetween, gridRef, mapLinks, toWorld, tidyPostcode, jobFromUrl } from "@/lib/siteMap";
import { DEFAULT_DRONES, LEVELS, jobDay, timeline, bestWindows, sunTimes, codeText, hhmm, dateLong, dayLong, MPH } from "@/lib/wxClient";

const TILE = 256;
const FC_MAX_AGE = 55 * 60e3;
const tileUrl = (z, x, y) => `https://tile.openstreetmap.org/${z}/${x}/${y}.png`;
const readLS = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } };
const writeLS = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* blocked */ } };
const shortDir = (deg) => (deg == null ? "" : ["N", "NE", "E", "SE", "S", "SW", "W", "NW"][Math.round((deg % 360) / 45) % 8]);
const ukToday = () => new Date().toLocaleDateString("en-CA", { timeZone: "Europe/London" }); // YYYY-MM-DD

/* A plain tile map with a pin. The whole map is a link. */
function TileMap({ center, zoom, href, label }) {
  const box = useRef(null);
  const [size, setSize] = useState({ w: 700, h: 360 });
  useEffect(() => {
    const el = box.current; if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const c = toWorld(center.lat, center.lon, zoom);
  const n = 2 ** zoom;
  const tiles = [];
  for (let x = Math.floor((c.x - size.w / 2) / TILE); x <= Math.floor((c.x + size.w / 2) / TILE); x++)
    for (let y = Math.floor((c.y - size.h / 2) / TILE); y <= Math.floor((c.y + size.h / 2) / TILE); y++) {
      if (y < 0 || y >= n) continue;
      tiles.push({ k: `${x}-${y}`, src: tileUrl(zoom, ((x % n) + n) % n, y), left: x * TILE - c.x, top: y * TILE - c.y });
    }
  return (
    <a className="sm-map" ref={box} href={href} target="_blank" rel="noopener" aria-label={label}>
      <span className="sm-tiles">
        {tiles.map((t) => <img key={t.k} src={t.src} alt="" width={TILE} height={TILE} style={{ left: `calc(50% + ${t.left}px)`, top: `calc(50% + ${t.top}px)` }} />)}
      </span>
      <span className="sm-pt sm-site" style={{ left: "50%", top: "50%" }}><i aria-hidden="true"></i></span>
      <span className="sm-open">Open in maps ↗</span>
    </a>
  );
}

/* Passcode box: same passcode as the weather check. */
function Passcode({ onDone }) {
  const [pin, setPin] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (value) => {
    setBusy(true); setMsg("");
    try {
      const res = await fetch("/api/wx/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ pin: value }) });
      const j = await res.json().catch(() => ({}));
      if (res.ok) { setBusy(false); return onDone(); }
      setPin("");
      setMsg(j.error === "locked" ? j.message : j.error === "wrong" ? `Wrong passcode${j.left != null ? `: ${j.left} ${j.left === 1 ? "try" : "tries"} left` : ""}` : "Couldn't check the passcode. Try again.");
    } catch { setMsg("No connection. Try again."); }
    setBusy(false);
  };
  return (
    <div className="sm-pin" role="group" aria-labelledby="sm-pin-label">
      <label id="sm-pin-label" htmlFor="sm-pin-in">Enter your weather check passcode to see the forecast</label>
      <div className="sm-pin-row">
        <input id="sm-pin-in" name="hd-wx-code" type="text" inputMode="numeric" autoComplete="off" autoCorrect="off" spellCheck="false" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" data-form-type="other"
          value={pin} disabled={busy} placeholder="••••"
          onChange={(e) => { const v = e.target.value.replace(/\D/g, "").slice(0, 8); setPin(v); if (v.length === 4) submit(v); }}
          onKeyDown={(e) => { if (e.key === "Enter" && pin) submit(pin); }} />
      </div>
      {msg && <p className="sm-pin-msg">{msg}</p>}
    </div>
  );
}

/* The weather for the job */
function JobWeather({ site, job }) {
  const [auth, setAuth] = useState("checking"); // checking | pin | ok
  const [fc, setFc] = useState(null);
  const [err, setErr] = useState("");
  const [lim, setLim] = useState(DEFAULT_DRONES[0].lim);
  const [droneName, setDroneName] = useState(DEFAULT_DRONES[0].name);

  useEffect(() => {
    const drones = readLS("hdwx.drones", DEFAULT_DRONES);
    const id = readLS("hdwx.drone", "mini4");
    const d = drones.find((x) => x.id === id) || drones[0] || DEFAULT_DRONES[0];
    setLim(d.lim); setDroneName(d.name);
  }, []);

  const load = useCallback(async () => {
    const key = `${site.lat.toFixed(3)},${site.lon.toFixed(3)}`;
    const saved = readLS(`hdwx.fc.${key}`, null);
    if (saved && Date.now() - new Date(saved.fetchedAt).getTime() < FC_MAX_AGE) { setFc(saved); setAuth("ok"); return; }
    try {
      const r = await fetch(`/api/wx/forecast?lat=${site.lat}&lon=${site.lon}`, { credentials: "same-origin" });
      const j = await r.json().catch(() => ({}));
      if (r.status === 401) { setAuth("pin"); return; }
      setAuth("ok");
      if (!r.ok) { setErr(j.message || "The forecast didn't load."); if (saved) setFc(saved); return; }
      writeLS(`hdwx.fc.${key}`, j);
      setFc(j); setErr("");
    } catch { setAuth("ok"); setErr("No connection, so no forecast right now."); if (saved) setFc(saved); }
  }, [site]);
  useEffect(() => { load(); }, [load]);

  const today = ukToday();
  const date = /^\d{4}-\d{2}-\d{2}$/.test(job.date) ? job.date : "";
  const past = date && date < today;
  const day = useMemo(() => (fc && date && !past ? jobDay(fc, date, site.lat, site.lon, lim, job.kind) : null), [fc, date, past, site, lim, job.kind]);
  const sun = sunTimes(new Date(`${date || today}T12:00:00Z`), site.lat, site.lon);
  const next = useMemo(() => {
    if (!fc || (day && day.rows.length)) return [];
    return bestWindows(timeline(fc, 96), lim, site.lat, site.lon).filter((w) => w.hours >= 1).slice(0, 4);
  }, [fc, day, lim, site]);
  const opens = date ? new Date(new Date(`${date}T12:00:00Z`).getTime() - 6 * 864e5) : null;

  return (
    <section className="sm-card sm-wx" aria-labelledby="sm-wx-h">
      <header className="sm-card-head">
        <h2 id="sm-wx-h">Weather {date ? `for ${dateLong(`${date}T12:00:00Z`)}` : "for the next few days"}</h2>
        <span className="sm-sub">Checked against your {droneName} limits</span>
      </header>

      <dl className="sm-sun">
        <div><dt>Sunrise</dt><dd>{hhmm(sun.sunrise)}</dd></div>
        <div><dt>Sunset</dt><dd>{hhmm(sun.sunset)}</dd></div>
        <div><dt>Golden hour</dt><dd>to {hhmm(sun.goldenMorningEnd)} · from {hhmm(sun.goldenEveningStart)}</dd></div>
        <div><dt>Dark after</dt><dd>{hhmm(sun.dusk)}</dd></div>
      </dl>

      {auth === "checking" && <p className="sm-muted">Loading the forecast…</p>}
      {auth === "pin" && <Passcode onDone={load} />}
      {err && <p className="sm-warn">{err}</p>}

      {auth === "ok" && fc && (
        <>
          {past && <p className="sm-muted">That date has passed. Here's the outlook for the next few days instead.</p>}
          {date && !past && !day && <p className="sm-muted">The forecast only reaches about a week ahead. The job day's forecast should be here from {dayLong(opens)}. For now, here are the next few days.</p>}

          {day && day.best && (
            <div className={`sm-best sm-${LEVELS[day.best.level].cls}`}>
              <span className="sm-best-tag">{day.best.level === 2 ? "Looks unflyable" : "Best time, roughly"}</span>
              {day.best.level === 2 ? (
                <p className="sm-best-main">Every daylight hour is over your limits right now. Think about the backup date.</p>
              ) : (
                <p className="sm-best-main"><b>{hhmm(day.best.start)} to {hhmm(day.best.end)}</b></p>
              )}
              <p className="sm-best-why">
                {day.best.sky ? `${day.best.sky}, ` : ""}gusts up to {day.best.gust} mph, {day.best.rain}% chance of rain{day.best.temp != null ? `, ${day.best.temp}°C` : ""}.
                {" "}{day.goCount} of {day.rows.length} daylight hours look good to fly. A guide only: check again the day before.
              </p>
            </div>
          )}

          {day && (
            <ol className="sm-hours" aria-label="Hour by hour, daylight only">
              {day.rows.map((r) => {
                const inBest = day.best && r.ms >= day.best.start && r.ms < day.best.end;
                const L = LEVELS[r.level];
                return (
                  <li key={r.ms} className={inBest ? "is-best" : undefined}>
                    <span className="sm-h-time">{hhmm(r.ms)}</span>
                    <span className={`sm-h-lvl sm-${L.cls}`}>{L.word}</span>
                    <span className="sm-h-data">
                      <span>{codeText(r.x) || "—"}{r.c != null ? `, ${Math.round(r.c)}°C` : ""}</span>
                      <span>Wind {Math.round((r.w || 0) * MPH)} {shortDir(r.d)}, gusts {Math.round(r.gust)} mph</span>
                      <span>Rain {r.p ?? "—"}%</span>
                    </span>
                    {r.level > 0 && r.reasons[0] && <span className="sm-h-why">{r.reasons[0].why}</span>}
                  </li>
                );
              })}
            </ol>
          )}
          {day?.coarse && <p className="sm-muted sm-small">Some hours use the Met Office's three-hourly forecast, so they're less exact.</p>}

          {!day && (
            next.length ? (
              <ul className="sm-next">
                {next.map((w) => <li key={w.start}><b>{dayLong(w.start)}</b> {hhmm(w.start)} to {hhmm(w.end)} <span>({w.hours} {w.hours === 1 ? "hour" : "hours"} good to fly)</span></li>)}
              </ul>
            ) : <p className="sm-muted">No good flying windows in the next few days.</p>
          )}
        </>
      )}
      <p className="sm-small sm-muted">Met Office forecast. Wind at 120 m is estimated from ground wind.</p>
    </section>
  );
}

export default function SiteMapView() {
  const [q, setQ] = useState(null);
  const [site, setSite] = useState(null);
  const [base, setBase] = useState(null);
  const [phone, setPhone] = useState("desktop");
  const [copied, setCopied] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    const p = new URLSearchParams(location.search);
    const lat = parseFloat(p.get("lat")), lon = parseFloat(p.get("lon"));
    const pc = tidyPostcode(p.get("pc") || "");
    setQ({ pc, code: p.get("c") || "", job: jobFromUrl(p) });
    const ua = navigator.userAgent;
    setPhone(/iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1) ? "ios" : /Android/.test(ua) ? "android" : "desktop");
    if (!pc && !Number.isFinite(lat)) { setErr("This link has no postcode in it."); return; }
    lookupPostcode(SITE.basePostcode).then(setBase);
    lookupPostcode(pc).then((s) => {
      if (s) setSite(Number.isFinite(lat) ? { ...s, lat, lon } : s);
      else if (Number.isFinite(lat)) setSite({ postcode: pc, lat, lon, area: (pc.match(/^[A-Z]+/) || [""])[0] });
      else setErr(`Couldn't find ${pc}. Check the postcode in the email.`);
    });
  }, []);

  const links = useMemo(() => site && mapLinks({ lat: site.lat, lon: site.lon, label: `${q?.code ? q.code + " " : ""}${site.postcode}` }), [site, q]);
  const miles = site && base ? milesBetween(base, site) : null;
  const travel = site ? travelFor(site.area) : null;
  const grid = site?.e != null ? gridRef(site.e, site.n, 10) : "";
  const appLink = links && (phone === "android" ? links.geo : links.apple);
  const appName = phone === "android" ? "your maps app" : "Apple Maps";
  const job = q?.job || {};
  const hasJob = job.mission || job.date || job.total;

  const copy = async (what, text) => {
    try { await navigator.clipboard.writeText(text); setCopied(what); setTimeout(() => setCopied(""), 1500); } catch { /* no clipboard */ }
  };

  return (
    <div className="sm-app">
      <header className="sm-head">
        <a className="sm-brand" href="/">Happy Drones</a>
        <span className="t-mono">Job{q?.code ? ` · ${q.code}` : ""}</span>
      </header>

      {err && <p className="sm-warn sm-pad">{err}</p>}
      {!err && !site && <p className="sm-muted sm-pad">Finding {q?.pc || "the site"}…</p>}

      {site && (
        <>
          <section className="sm-title">
            <h1>{job.mission || "Site"} <span>· {site.postcode}</span></h1>
            <p>{[site.ward, site.district].filter(Boolean).join(", ") || "Location from the plan"}{site.full === false ? " · only the first half of the postcode was given" : ""}</p>
          </section>

          <div className="sm-grid">
            <div className="sm-a-job">
              {hasJob ? (
                <section className="sm-card" aria-labelledby="sm-job-h">
                  <header className="sm-card-head"><h2 id="sm-job-h">The job</h2>{job.total && <span className="sm-price">{job.total}</span>}</header>
                  <dl className="sm-list">
                    {job.mission && <div><dt>Work</dt><dd>{job.mission}{job.scale ? ` · ${job.scale}` : ""}</dd></div>}
                    {job.freq && <div><dt>How often</dt><dd>{job.freq}</dd></div>}
                    <div><dt>Extras</dt><dd>{job.extras || "None"}</dd></div>
                    <div><dt>Date wanted</dt><dd>{job.date ? dateLong(`${job.date}T12:00:00Z`) : "No date given"}</dd></div>
                    {job.total && <div><dt>Guide price</dt><dd>{job.total}</dd></div>}
                    {job.notes && <div className="sm-notes"><dt>Their notes</dt><dd>{job.notes}</dd></div>}
                  </dl>
                </section>
              ) : (
                <p className="sm-muted">This link is from before job details were added, so only the place is shown.</p>
              )}
            </div>

            <div className="sm-a-wx"><JobWeather site={site} job={job} /></div>

            <div className="sm-a-map">
              <figure className="sm-fig">
                <TileMap center={site} zoom={site.full === false ? 13 : 16} href={links.google} label="Open the site in Google Maps" />
                <figcaption>Tap the map to open it in Google Maps. The pin is the middle of the postcode, not the exact building.</figcaption>
              </figure>
              <div className="sm-actions">
                <a className="t-btn t-btn-primary" href={links.google} target="_blank" rel="noopener">Open in Google Maps</a>
                <a className="t-btn t-btn-ghost" href={appLink} target={phone === "android" ? undefined : "_blank"} rel="noopener">Open in {appName}</a>
              </div>
              <dl className="sm-list sm-ref">
                <div><dt>From base</dt><dd>{miles != null ? `${miles.toFixed(1)} miles in a straight line` : "—"}</dd></div>
                <div><dt>Travel</dt><dd>{travel ? (travel.fee ? `${travel.name}: +£${travel.fee} a visit` : `${travel.name}: included`) : "Outside the travel zones: quote travel"}</dd></div>
                {grid && <div><dt>Grid ref</dt><dd><button type="button" className="sm-copy" onClick={() => copy("grid", grid.replace(/ /g, ""))}>{grid} <small>{copied === "grid" ? "copied" : "copy"}</small></button></dd></div>}
                <div><dt>Lat, long</dt><dd><button type="button" className="sm-copy" onClick={() => copy("ll", `${site.lat.toFixed(5)}, ${site.lon.toFixed(5)}`)}>{site.lat.toFixed(5)}, {site.lon.toFixed(5)} <small>{copied === "ll" ? "copied" : "copy"}</small></button></dd></div>
              </dl>
            </div>
          </div>

          <p className="sm-note">Map © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors. Check the airspace before quoting.</p>
        </>
      )}
    </div>
  );
}
