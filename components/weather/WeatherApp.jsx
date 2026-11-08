"use client";
/* WEATHER CHECK — the private flying-weather app at /weather-check.
   Talks to the Cloudflare functions in functions/api/wx/ (which hold the
   Met Office key and passcode). Sites, drone limits and notes are kept in
   this phone's storage. Add ?demo=1 to the address for example data. */
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DEFAULT_DRONES, LIMIT_ROWS, LEVELS, MPH, HEIGHT_FACTOR, GUST_HEIGHT_FACTOR, DEMO_SITES,
  timeline, judge, bestWindows, sunTimes, codeText, fromDir, hhmm, hh, dayShort, dayLong, dateLong, demoForecast,
} from "@/lib/wxClient";

const LS = { sites: "hdwx.sites", drones: "hdwx.drones", drone: "hdwx.drone", notes: "hdwx.notes" };
const read = (k, fallback) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; } catch { return fallback; } };
const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage blocked */ } };
const FC_MAX_AGE = 55 * 60e3;

/* ---------- small pieces ---------- */
function Mark({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="6" cy="6" r="3.2" /><circle cx="18" cy="6" r="3.2" /><circle cx="6" cy="18" r="3.2" /><circle cx="18" cy="18" r="3.2" /><path d="M8.5 8.5l7 7M15.5 8.5l-7 7" />
    </svg>
  );
}
function LevelIcon({ level, size = 20, color = "currentColor" }) {
  if (level === 0) return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>;
  if (level === 1) return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.6" strokeLinecap="round" aria-hidden="true"><path d="M12 4l9 16H3z" /><path d="M12 10v4M12 17.5v0" /></svg>;
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>;
}
function Badge({ level }) {
  const L = LEVELS[level];
  return <div className={`wx-badge wx-${L.cls}`}><LevelIcon level={level} /><span>{L.word}</span></div>;
}
function Back({ onClick, label = "Your sites" }) {
  return <button type="button" className="wx-back" onClick={onClick}>← {label}</button>;
}
function DronePicker({ drones, droneId, setDrone, light }) {
  return (
    <div className={`wx-chips ${light ? "is-light" : ""}`} role="group" aria-label="Drone you're flying">
      {drones.map((d) => (
        <button key={d.id} type="button" className={d.id === droneId ? "on" : undefined} aria-pressed={d.id === droneId} onClick={() => setDrone(d.id)}>{d.name}</button>
      ))}
    </div>
  );
}

/* ---------- passcode ---------- */
function PinScreen({ onDone }) {
  const [pin, setPin] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = useCallback(async (value) => {
    setBusy(true); setMsg("");
    try {
      const res = await fetch("/api/wx/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ pin: value }) });
      const j = await res.json().catch(() => ({}));
      if (res.ok) return onDone();
      setPin("");
      setMsg(j.error === "locked" ? j.message : j.error === "wrong" ? `Wrong passcode${j.left != null ? `: ${j.left} ${j.left === 1 ? "try" : "tries"} left` : ""}` : "Couldn't check the passcode. Try again.");
    } catch { setMsg("No connection. Try again."); }
    setBusy(false);
  }, [onDone]);
  const press = (d) => {
    if (busy) return;
    const next = (pin + d).slice(0, 8);
    setPin(next);
    if (next.length === 4) submit(next);
  };
  return (
    <div className="wx-pin">
      <Mark size={72} />
      <div className="wx-pin-head"><h1>Weather check</h1><p>Happy Drones · for Wayne only</p></div>
      {/* Not a <form> and no password field, so phones and browsers don't offer to save the passcode. */}
      <div className="wx-pin-form" role="group" aria-labelledby="wx-pin-label">
        <label id="wx-pin-label" htmlFor="wx-pin-in">ENTER YOUR PASSCODE</label>
        <div className="wx-dots" aria-hidden="true">{[0, 1, 2, 3].map((i) => <span key={i} className={i < pin.length ? "on" : undefined} />)}</div>
        <input id="wx-pin-in" name="hd-wx-code" className="wx-pin-input" type="text" inputMode="numeric" autoComplete="off" autoCorrect="off" spellCheck="false" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" data-form-type="other" onKeyDown={(e) => { if (e.key === "Enter" && pin) submit(pin); }} value={pin} onChange={(e) => { const v = e.target.value.replace(/\D/g, "").slice(0, 8); setPin(v); if (v.length === 4) submit(v); }} />
        <div className="wx-keys">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => <button key={d} type="button" onClick={() => press(d)}>{d}</button>)}
          <span />
          <button type="button" onClick={() => press("0")}>0</button>
          <button type="button" className="wx-del" aria-label="Delete last digit" onClick={() => setPin(pin.slice(0, -1))}>⌫</button>
        </div>
        <p className="wx-pin-msg" aria-live="polite">{busy ? "Checking…" : msg}</p>
      </div>
      <p className="wx-pin-foot">Remembered on this phone after the first time.</p>
    </div>
  );
}

/* ---------- main app ---------- */
export default function WeatherApp() {
  const [demo, setDemo] = useState(false);
  const [auth, setAuth] = useState("checking"); // checking | pin | ok | setup | offline
  const [screen, setScreen] = useState("sites");
  const [siteId, setSiteId] = useState(null);
  const [sites, setSites] = useState([]);
  const [drones, setDrones] = useState(DEFAULT_DRONES);
  const [droneId, setDroneId] = useState("mini4");
  const [fcs, setFcs] = useState({});
  const [errs, setErrs] = useState({});
  const [kp, setKp] = useState(null);
  const [used, setUsed] = useState(null);
  const [loaded, setLoaded] = useState(false);

  /* load saved data + check sign-in */
  useEffect(() => {
    const isDemo = new URLSearchParams(window.location.search).has("demo");
    setDemo(isDemo);
    setSites(read(LS.sites, isDemo ? DEMO_SITES : []));
    if (isDemo && read(LS.sites, []).length === 0) setSites(DEMO_SITES);
    setDrones(read(LS.drones, DEFAULT_DRONES));
    setDroneId(read(LS.drone, "mini4"));
    setLoaded(true);
    if (isDemo) { setAuth("ok"); setKp({ list: [{ t: new Date().toISOString(), kp: 2 }] }); return; }
    fetch("/api/wx/me", { credentials: "same-origin" }).then(async (r) => {
      if (r.ok) { const j = await r.json(); setUsed(j.used); setAuth("ok"); }
      else if (r.status === 401) setAuth("pin");
      else if (r.status === 503) setAuth("setup");
      else setAuth("offline");
    }).catch(() => setAuth("offline"));
  }, []);

  useEffect(() => { if (loaded) write(LS.sites, sites); }, [sites, loaded]);
  useEffect(() => { if (loaded) write(LS.drones, drones); }, [drones, loaded]);
  useEffect(() => { if (loaded) write(LS.drone, droneId); }, [droneId, loaded]);

  const drone = drones.find((d) => d.id === droneId) || drones[0];

  const loadForecast = useCallback(async (site, force = false) => {
    const key = `${site.lat.toFixed(3)},${site.lon.toFixed(3)}`;
    if (demo) { setFcs((m) => ({ ...m, [site.id]: demoForecast(site.lat, site.lon, site.id.length + site.lat) })); return; }
    const saved = read(`hdwx.fc.${key}`, null);
    if (!force && saved && Date.now() - new Date(saved.fetchedAt).getTime() < FC_MAX_AGE) { setFcs((m) => ({ ...m, [site.id]: saved })); return; }
    try {
      const r = await fetch(`/api/wx/forecast?lat=${site.lat}&lon=${site.lon}`, { credentials: "same-origin" });
      const j = await r.json().catch(() => ({}));
      if (r.status === 401) { setAuth("pin"); return; }
      if (!r.ok) { setErrs((m) => ({ ...m, [site.id]: j.message || "The forecast didn't load." })); if (saved) setFcs((m) => ({ ...m, [site.id]: saved })); return; }
      write(`hdwx.fc.${key}`, j);
      if (j.used != null) setUsed(j.used);
      setErrs((m) => { const n = { ...m }; delete n[site.id]; return n; });
      setFcs((m) => ({ ...m, [site.id]: j }));
    } catch { setErrs((m) => ({ ...m, [site.id]: "No connection." })); if (saved) setFcs((m) => ({ ...m, [site.id]: saved })); }
  }, [demo]);

  useEffect(() => {
    if (auth !== "ok") return;
    sites.forEach((s) => loadForecast(s));
    if (!demo) fetch("/api/wx/kp", { credentials: "same-origin" }).then((r) => r.json()).then(setKp).catch(() => {});
  }, [auth, sites, demo, loadForecast]);

  const site = sites.find((s) => s.id === siteId);
  const go = (s, id) => { setScreen(s); if (id !== undefined) setSiteId(id); window.scrollTo(0, 0); };

  if (auth === "checking") return <div className="wx-app"><div className="wx-wait">Loading…</div></div>;
  if (auth === "pin") return <div className="wx-app wx-dark"><PinScreen onDone={() => setAuth("ok")} /></div>;
  if (auth === "setup" || auth === "offline") {
    return (
      <div className="wx-app"><div className="wx-wait">
        <Mark size={56} />
        <h1>Weather check</h1>
        <p>{auth === "setup" ? "The Met Office key or passcode isn't set up on Cloudflare yet." : "The weather service isn't reachable from here. It only runs on the live site."}</p>
        <a className="wx-btn" href="?demo=1">See it with example data</a>
      </div></div>
    );
  }

  return (
    <div className="wx-app">
      {demo && <p className="wx-demo">Example data, not a real forecast</p>}
      {screen === "sites" && <Sites {...{ sites, setSites, drones, droneId, setDroneId, drone, fcs, errs, used, go, demo, setAuth }} />}
      {screen === "site" && site && <SiteView {...{ site, drone, drones, droneId, setDroneId, fc: fcs[site.id], err: errs[site.id], kp, go, reload: () => loadForecast(site, true) }} />}
      {screen === "planner" && <Planner {...{ sites, site: site || sites[0], setSiteId, drone, drones, droneId, setDroneId, fcs, go }} />}
      {screen === "limits" && <Limits {...{ drones, setDrones, go }} />}
      {screen === "record" && site && <Record {...{ site, drone, fc: fcs[site.id], kp, go }} />}
    </div>
  );
}

/* ---------- 2 · your sites ---------- */
function Sites({ sites, setSites, drones, droneId, setDroneId, drone, fcs, errs, used, go, demo, setAuth }) {
  const [name, setName] = useState("");
  const [pc, setPc] = useState("");
  const [job, setJob] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const now = new Date();

  const add = async (e) => {
    e.preventDefault();
    const code = pc.trim().toUpperCase();
    if (!code) return;
    setBusy(true); setMsg("");
    try {
      const r = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(code)}`);
      const j = await r.json();
      if (!r.ok || !j.result) { setMsg("That postcode wasn't found."); setBusy(false); return; }
      const res = j.result;
      setSites([...sites, { id: `s${Date.now()}`, name: name.trim() || res.postcode, postcode: res.postcode, place: res.admin_district || res.region || "", lat: res.latitude, lon: res.longitude, job }]);
      setName(""); setPc(""); setJob("");
    } catch { setMsg("Couldn't look up the postcode. Check your connection."); }
    setBusy(false);
  };
  const signOut = async () => { await fetch("/api/wx/logout", { method: "POST" }).catch(() => {}); setAuth("pin"); };

  return (
    <>
      <header className="wx-top">
        <div className="wx-top-row">
          <div className="wx-brand"><Mark /><span>Weather check</span></div>
          <button type="button" className="wx-icon-btn" aria-label="Drone limits and settings" onClick={() => go("limits")}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12" /><circle cx="16" cy="6" r="2" /><circle cx="10" cy="12" r="2" /><circle cx="18" cy="18" r="2" /></svg>
          </button>
        </div>
        <p className="wx-eyebrow">FLYING TODAY</p>
        <DronePicker drones={drones} droneId={droneId} setDrone={setDroneId} />
      </header>
      <main className="wx-main">
        <div className="wx-title-row"><h1>Your sites</h1><p>{dayLong(now)} · {hhmm(now)}</p></div>
        {sites.length === 0 && <p className="wx-empty">No sites yet. Add a job's postcode below.</p>}
        {sites.map((s) => <SiteCard key={s.id} s={s} fc={fcs[s.id]} err={errs[s.id]} drone={drone} onOpen={() => go("site", s.id)} />)}

        <form className="wx-add" onSubmit={add}>
          <p className="wx-add-title">Add a site</p>
          <label className="wx-field"><span>Postcode</span><input value={pc} onChange={(e) => setPc(e.target.value)} placeholder="e.g. TS1 2AB" autoCapitalize="characters" required /></label>
          <label className="wx-field"><span>Name (optional)</span><input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Acacia Rd · roof" /></label>
          <label className="wx-field"><span>Job date (optional)</span><input type="date" value={job} onChange={(e) => setJob(e.target.value)} /></label>
          <button type="submit" className="wx-btn" disabled={busy}>{busy ? "Finding…" : "Add site"}</button>
          {msg && <p className="wx-err" role="alert">{msg}</p>}
        </form>

        <div className="wx-usage">
          <div className="wx-usage-text">
            <p><b>{used ?? (demo ? 12 : "–")} of 360</b> Met Office requests used today</p>
            <div className="wx-bar"><span style={{ width: `${Math.min(100, ((used || 0) / 360) * 100)}%` }} /></div>
          </div>
          <button type="button" className="wx-link" onClick={() => go("planner", sites[0]?.id ?? null)} disabled={!sites.length}>3-day view →</button>
        </div>
        {!demo && <button type="button" className="wx-signout" onClick={signOut}>Sign out on this phone</button>}
      </main>
    </>
  );
}

function SiteCard({ s, fc, err, drone, onOpen }) {
  const rows = useMemo(() => timeline(fc, 24), [fc]);
  let level = null, line = err || "Loading forecast…";
  if (rows.length) {
    const sun = sunTimes(new Date(), s.lat, s.lon);
    const v = judge(rows[0], drone.lim, sun);
    level = v.level;
    const todayKey = new Date().toDateString();
    const best = bestWindows(rows, drone.lim, s.lat, s.lon).filter((w) => w.dayKey === todayKey).sort((a, b) => b.hours - a.hours)[0];
    const gust = rows[0].g != null ? `gusts ${Math.round(rows[0].g * MPH)} mph` : "";
    line = v.level === 0 ? (best ? `Best today ${hhmm(best.start)}–${hhmm(best.end)} · ${gust}` : `Good now · ${gust}`)
      : v.reasons[0]?.why || "";
  }
  return (
    <button type="button" className="wx-card" onClick={onOpen}>
      <div className="wx-card-text">
        <p className="wx-card-name">{s.name}</p>
        <p className="wx-card-meta">{s.postcode}{s.place ? ` · ${s.place}` : ""}{s.job ? ` · job ${dayShort(s.job)}` : ""}</p>
        <p className="wx-card-line">{line}</p>
      </div>
      {level != null ? <Badge level={level} /> : <div className="wx-badge wx-none">…</div>}
    </button>
  );
}

/* ---------- 3 · one site ---------- */
function SiteView({ site, drone, drones, droneId, setDroneId, fc, err, kp, go, reload }) {
  const rows = useMemo(() => timeline(fc, 48), [fc]);
  const today = new Date();
  const sun = sunTimes(today, site.lat, site.lon);
  const now = rows[0];
  const v = now ? judge(now, drone.lim, sun) : null;
  const L = v ? LEVELS[v.level] : null;
  const best = rows.length ? bestWindows(rows.slice(0, 24), drone.lim, site.lat, site.lon).filter((w) => w.dayKey === today.toDateString()).sort((a, b) => b.hours - a.hours)[0] : null;
  const strip = rows.slice(0, 12);
  const kpNow = (kp?.list || []).filter((k) => new Date(k.t) <= new Date(Date.now() + 3 * 3600e3)).at(-1);
  const kpMax = Math.max(0, ...((kp?.list || []).filter((k) => new Date(k.t) >= new Date() && new Date(k.t) <= new Date(Date.now() + 24 * 3600e3)).map((k) => k.kp)));
  const dayPct = (d) => ((d.getHours() + d.getMinutes() / 60) / 24) * 100;

  return (
    <>
      <header className="wx-top">
        <Back onClick={() => go("sites")} />
        <h1 className="wx-site-h">{site.name}</h1>
        <p className="wx-top-sub">{site.postcode}{site.place ? ` · ${site.place}` : ""}{site.job ? ` · job ${dayShort(site.job)}` : ""}</p>
        <DronePicker drones={drones} droneId={droneId} setDrone={setDroneId} />
        <p className="wx-top-sub wx-small">{fc ? `Met Office forecast · ${fc.cached ? "saved" : "fetched"} ${hhmm(fc.fetchedAt)}` : ""} <button type="button" className="wx-refresh" onClick={reload}>Refresh</button></p>
      </header>
      <main className="wx-main">
        {err && <p className="wx-err" role="alert">{err}</p>}
        {!now && !err && <p className="wx-empty">Loading forecast…</p>}
        {now && (
          <>
            <section className={`wx-now wx-${L.cls}`} aria-label="Right now">
              <div className="wx-now-icon"><LevelIcon level={v.level} size={32} /></div>
              <div>
                <p className="wx-now-k">RIGHT NOW · {hhmm(new Date())}</p>
                <p className="wx-now-big">{L.long}</p>
                <p className="wx-now-why">{v.level === 0 ? `Everything is inside your ${drone.name} limits${best ? ` until ${hhmm(best.end)}` : ""}.` : v.reasons.map((r) => r.why).join(" · ")}</p>
              </div>
            </section>

            <section className="wx-grid" aria-label="Conditions now">
              <Stat k="WIND" v={Math.round(now.w * MPH)} u="mph" s={now.d != null ? `From the ${fromDir(now.d)}` : ""} />
              <Stat k="GUSTS" v={Math.round(now.g * MPH)} u="mph" s={`Your limit: ${drone.lim.gustC} caution, ${drone.lim.gustS} stop`} />
              <Stat k="AT 120 M (ESTIMATE)" v={`~${Math.round(now.w * MPH * HEIGHT_FACTOR)}`} u="mph" s={`Gusts ~${Math.round(now.g * MPH * GUST_HEIGHT_FACTOR)} mph up high`} />
              <Stat k="RAIN" v={now.p ?? "–"} u="%" s={codeText(now.x) || (now.r ? `${now.r} mm/h` : "")} />
              <Stat k="VISIBILITY" v={now.v != null ? (now.v >= 10000 ? Math.round(now.v / 1000) : (now.v / 1000).toFixed(1)) : "–"} u="km" s={now.v == null ? "" : now.v >= 10000 ? "Very good" : now.v >= 4000 ? "Good" : now.v >= 1000 ? "Poor" : "Very poor"} />
              <Stat k="TEMPERATURE" v={now.c != null ? Math.round(now.c) : "–"} u="°C" s={now.f != null ? `Feels like ${Math.round(now.f)}°C${now.c < 10 ? " · warm batteries" : ""}` : ""} />
            </section>

            <section className="wx-box" aria-labelledby="wx-hourly-h">
              <div className="wx-box-head"><h2 id="wx-hourly-h">Hour by hour</h2><p>gusts mph · rain %</p></div>
              <div className="wx-strip">
                {strip.map((h, i) => {
                  const j = judge(h, drone.lim, sunTimes(new Date(h.ms), site.lat, site.lon));
                  return (
                    <div key={h.ms} className="wx-strip-col" title={j.reasons.map((r) => r.why).join(", ") || "Within limits"}>
                      <span className="wx-strip-t">{i === 0 ? "Now" : hh(h.ms)}</span>
                      <span className={`wx-strip-b wx-${LEVELS[j.level].cls}`}><LevelIcon level={j.level} size={14} /></span>
                      <span className="wx-strip-g">{h.g != null ? Math.round(h.g * MPH) : "–"}</span>
                      <span className="wx-strip-p">{h.p ?? "–"}</span>
                    </div>
                  );
                })}
              </div>
              <p className={`wx-best ${best ? "" : "is-none"}`}>{best ? <><b>Best window today: {hhmm(best.start)}–{hhmm(best.end)}.</b> Within your {drone.name} limits in daylight.</> : <b>No clear window in daylight today.</b>}</p>
            </section>

            <section className="wx-box" aria-labelledby="wx-light-h">
              <h2 id="wx-light-h">Light</h2>
              <div className="wx-daybar" aria-hidden="true"
                style={{ background: `linear-gradient(90deg, #1C2F45 0%, #1C2F45 ${dayPct(sun.dawn)}%, #8FB0CF ${dayPct(sun.sunrise)}%, #EAF1F8 ${dayPct(sun.goldenMorningEnd)}%, #EAF1F8 ${dayPct(sun.goldenEveningStart)}%, #FFC27A ${(dayPct(sun.goldenEveningStart) + dayPct(sun.sunset)) / 2}%, #FF8A50 ${dayPct(sun.sunset)}%, #3A4F78 ${dayPct(sun.dusk)}%, #1C2F45 ${Math.min(100, dayPct(sun.dusk) + 4)}%, #1C2F45 100%)` }}>
                <span style={{ left: `${dayPct(today)}%` }} />
              </div>
              <div className="wx-light">
                <p><span>Sunrise</span><b>{hhmm(sun.sunrise)}</b></p>
                <p><span>Golden hour</span><b>{hhmm(sun.goldenEveningStart)}–{hhmm(sun.sunset)}</b></p>
                <p><span>Sunset</span><b>{hhmm(sun.sunset)}</b></p>
                <p><span>Civil twilight ends</span><b>{hhmm(sun.dusk)}</b> · lights on</p>
              </div>
            </section>

            <section className={`wx-box wx-gps ${kpMax >= 5 ? "is-bad" : ""}`} aria-label="GPS conditions">
              <div className="wx-gps-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" /></svg></div>
              <div>
                <p className="wx-gps-h">{kp?.list?.length ? (kpMax >= 5 ? `GPS warning · Kp up to ${kpMax.toFixed(0)}` : `GPS normal · Kp ${kpNow ? Math.round(kpNow.kp) : "–"}`) : "GPS conditions unavailable"}</p>
                <p className="wx-gps-s">{!kp?.list?.length ? "The space-weather feed didn't load. Check again later." : kpMax >= 5 ? "A geomagnetic storm can upset GPS. Expect drift: keep the drone close and in sight." : "Solar activity is quiet. A warning shows here from Kp 5."}</p>
              </div>
            </section>

            <section className="wx-box" aria-labelledby="wx-before-h">
              <h2 id="wx-before-h">Before you fly</h2>
              <p className="wx-row-note">Open Drone Assist on your phone and check this postcode for airspace and flight restrictions.</p>
              <a className="wx-row-link" href="https://caa.co.uk/drones/moving-on-to-more-advanced-flying/airspace/drone-apps-and-airspace-restriction-websites" target="_blank" rel="noopener">CAA list of airspace apps and restriction maps <span aria-hidden="true">↗</span></a>
            </section>

            <button type="button" className="wx-save" onClick={() => go("record")}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 4v11M7 10l5 5 5-5M5 20h14" /></svg>
              Save weather record
            </button>
            <p className="wx-save-sub">A dated A4 sheet for the job file</p>
          </>
        )}
      </main>
    </>
  );
}
function Stat({ k, v, u, s }) {
  return <div className="wx-stat"><p className="wx-stat-k">{k}</p><p className="wx-stat-v">{v} <span>{u}</span></p><p className="wx-stat-s">{s}</p></div>;
}

/* ---------- 4 · next 3 days ---------- */
function Planner({ sites, site, setSiteId, drone, drones, droneId, setDroneId, fcs, go }) {
  const [copied, setCopied] = useState(false);
  const fc = site ? fcs[site.id] : null;
  const rows = useMemo(() => timeline(fc, 72), [fc]);
  const days = useMemo(() => {
    if (!site) return [];
    const out = [];
    for (let d = 0; d < 3; d++) {
      const date = new Date(); date.setHours(12, 0, 0, 0); date.setDate(date.getDate() + d);
      const sun = sunTimes(date, site.lat, site.lon);
      const first = new Date(sun.sunrise); first.setMinutes(0, 0, 0);
      const cells = [];
      for (let t = first.getTime(); t < sun.sunset.getTime(); t += 3600e3) {
        const h = rows.find((r) => r.ms === t);
        cells.push({ t, level: h ? judge(h, drone.lim, sun).level : null, past: t + 3600e3 < Date.now() });
      }
      out.push({ date, cells });
    }
    return out;
  }, [rows, site, drone]);
  const firstHour = days[0]?.cells[0]?.t;
  const cols = Math.max(0, ...days.map((d) => d.cells.length));
  const startHours = days.map((d) => new Date(d.cells[0]?.t || 0).getHours());
  const minStart = Math.min(...startHours);
  const shown = new Set(days.map((d) => d.date.toDateString()));
  const windows = site ? bestWindows(rows, drone.lim, site.lat, site.lon).filter((w) => w.hours >= 2 && shown.has(w.dayKey)).sort((a, b) => b.hours - a.hours).slice(0, 3).sort((a, b) => a.start - b.start) : [];
  const top = windows.slice().sort((a, b) => b.hours - a.hours)[0];

  const message = top ? `Hi, the forecast for ${site.name} looks best on ${dateLong(top.start).replace(/ \d{4}$/, "")} between ${hhmm(top.start)} and ${hhmm(top.end)}, so I'm planning to fly then. I'll confirm the day before. Wayne, Happy Drones` : "";
  const copy = async () => { try { await navigator.clipboard.writeText(message); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* blocked */ } };

  return (
    <>
      <header className="wx-top">
        <Back onClick={() => go("sites")} />
        <h1 className="wx-site-h">Next 3 days</h1>
        <label className="wx-select"><span className="wx-sr">Site</span>
          <select value={site?.id || ""} onChange={(e) => setSiteId(e.target.value)}>{sites.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select>
        </label>
        <DronePicker drones={drones} droneId={droneId} setDrone={setDroneId} />
      </header>
      <main className="wx-main">
        {!fc && <p className="wx-empty">Loading forecast…</p>}
        {fc && (
          <>
            <section className="wx-box" aria-labelledby="wx-grid-h">
              <h2 id="wx-grid-h">Daylight hours</h2>
              <div className="wx-heat" style={{ gridTemplateColumns: `52px repeat(${cols}, minmax(0, 1fr))` }}>
                <span />
                {Array.from({ length: cols }, (_, i) => <span key={i} className="wx-heat-h">{(minStart + i) % 24}</span>)}
                {days.map((d) => (
                  <div key={d.date.toDateString()} className="wx-heat-row" style={{ display: "contents" }}>
                    <span className={`wx-heat-day ${site.job && new Date(site.job).toDateString() === d.date.toDateString() ? "is-job" : ""}`}>{dayShort(d.date)}</span>
                    {Array.from({ length: cols }, (_, i) => {
                      const c = d.cells.find((x) => new Date(x.t).getHours() === minStart + i);
                      return <span key={i} className={`wx-heat-c ${c ? (c.level == null ? "is-na" : `wx-${LEVELS[c.level].cls}`) : "is-off"} ${c?.past ? "is-past" : ""}`} title={c ? `${hhmm(c.t)} · ${c.level == null ? "no data" : LEVELS[c.level].word}` : ""} />;
                    })}
                  </div>
                ))}
              </div>
              <ul className="wx-key"><li><i className="wx-go" />Go</li><li><i className="wx-care" />Caution</li><li><i className="wx-stop" />No-go</li></ul>
              {firstHour && <p className="wx-small-note">Day 3 uses the Met Office three-hourly forecast, so it's less precise.</p>}
            </section>
            <section className="wx-stack" aria-labelledby="wx-best-h">
              <h2 id="wx-best-h">Best windows</h2>
              {windows.length === 0 && <div className="wx-win"><p className="wx-win-h">Nothing clear for 2+ hours</p><p>Try a different day or check again tomorrow.</p></div>}
              {windows.map((w) => (
                <div key={w.start} className={`wx-win ${w === top ? "is-top" : ""}`}>
                  <div><p className="wx-win-h">{dayShort(w.start)} · {hhmm(w.start)}–{hhmm(w.end)}</p><p>{w.hours} hours inside your {drone.name} limits.</p></div>
                  {w === top && <span className="wx-tag">BEST</span>}
                </div>
              ))}
            </section>
            {top && <button type="button" className="wx-btn wx-btn-line" onClick={copy}>{copied ? "Copied" : "Copy \"best time\" message for the client"}</button>}
          </>
        )}
      </main>
    </>
  );
}

/* ---------- 5 · drone limits ---------- */
function Limits({ drones, setDrones, go }) {
  const [newName, setNewName] = useState("");
  const set = (id, key, val) => setDrones(drones.map((d) => (d.id === id ? { ...d, lim: { ...d.lim, [key]: val === "" ? "" : Number(val) } } : d)));
  const add = (e) => { e.preventDefault(); if (!newName.trim()) return; setDrones([...drones, { id: `d${Date.now()}`, name: newName.trim(), note: "", lim: { ...DEFAULT_DRONES[0].lim } }]); setNewName(""); };
  const remove = (id) => { if (drones.length > 1 && window.confirm("Remove this drone?")) setDrones(drones.filter((d) => d.id !== id)); };
  return (
    <>
      <header className="wx-top">
        <Back onClick={() => go("sites")} />
        <h1 className="wx-site-h">Drone limits</h1>
        <p className="wx-top-sub">Your own limits, stricter than the maker's maximums. The go and no-go lights use these. Saved on this phone.</p>
      </header>
      <main className="wx-main">
        {drones.map((d) => (
          <section key={d.id} className="wx-box wx-limits">
            <div className="wx-box-head"><h2>{d.name}</h2>{d.note && <span className="wx-pill">{d.note}</span>}</div>
            <div className="wx-lim-grid">
              <span /><span className="wx-lim-c">CAUTION</span><span className="wx-lim-s">STOP</span>
              {LIMIT_ROWS.map(([k, label]) => (
                <div key={k} style={{ display: "contents" }}>
                  <label htmlFor={`${d.id}-${k}`}>{label}</label>
                  <input id={`${d.id}-${k}`} type="number" inputMode="decimal" value={d.lim[`${k}C`]} onChange={(e) => set(d.id, `${k}C`, e.target.value)} />
                  <input aria-label={`${label} stop`} type="number" inputMode="decimal" value={d.lim[`${k}S`]} onChange={(e) => set(d.id, `${k}S`, e.target.value)} />
                </div>
              ))}
            </div>
            {drones.length > 1 && <button type="button" className="wx-remove" onClick={() => remove(d.id)}>Remove {d.name}</button>}
          </section>
        ))}
        <form className="wx-add" onSubmit={add}>
          <label className="wx-field"><span>Add a drone</span><input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Mavic 4 Pro" /></label>
          <button type="submit" className="wx-btn">Add</button>
        </form>
        <p className="wx-small-note">Starting values are a guess to begin with: check them against each drone's manual and your own experience. Wind at 120 m is estimated from the forecast at 10 m.</p>
        <button type="button" className="wx-signout" onClick={() => { if (window.confirm("Put every drone back to the starting limits?")) setDrones(DEFAULT_DRONES); }}>Reset to starting limits</button>
      </main>
    </>
  );
}

/* ---------- 6 · saved weather record ---------- */
function Record({ site, drone, fc, kp, go }) {
  const rows = useMemo(() => timeline(fc, 48), [fc]);
  const [from, setFrom] = useState(0);
  const [hours, setHours] = useState(2);
  const [notes, setNotes] = useState(() => read(`${LS.notes}.${site.id}`, ""));
  const [airspace, setAirspace] = useState(false);
  const [notams, setNotams] = useState(false);
  useEffect(() => { write(`${LS.notes}.${site.id}`, notes); }, [notes, site.id]);
  if (!rows.length) return <main className="wx-main"><Back onClick={() => go("site")} label="Back" /><p className="wx-empty">Loading forecast…</p></main>;
  const win = rows.slice(from, from + hours);
  const sun = sunTimes(new Date(win[0].ms), site.lat, site.lon);
  const verdicts = win.map((h) => judge(h, drone.lim, sun));
  const worst = Math.max(...verdicts.map((v) => v.level));
  const L = LEVELS[worst];
  const saved = new Date();
  const kpMax = Math.max(0, ...((kp?.list || []).filter((k) => new Date(k.t) >= new Date(win[0].ms - 3 * 3600e3) && new Date(k.t) <= new Date(win.at(-1).ms + 3600e3)).map((k) => k.kp)));
  const l = drone.lim;

  return (
    <>
      <div className="wx-no-print">
        <header className="wx-top">
          <Back onClick={() => go("site")} label={site.name} />
          <h1 className="wx-site-h">Weather record</h1>
          <p className="wx-top-sub">Pick the flight window, tick your checks, add notes, then save it as a PDF.</p>
        </header>
        <main className="wx-main">
          <div className="wx-box wx-rec-ctrl">
            <label className="wx-field"><span>Flight starts</span>
              <select value={from} onChange={(e) => setFrom(Number(e.target.value))}>{rows.slice(0, 40).map((h, i) => <option key={h.ms} value={i}>{dayShort(h.ms)} {hhmm(h.ms)}</option>)}</select>
            </label>
            <label className="wx-field"><span>Hours</span>
              <select value={hours} onChange={(e) => setHours(Number(e.target.value))}>{[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n}</option>)}</select>
            </label>
            <label className="wx-check"><input type="checkbox" checked={airspace} onChange={(e) => setAirspace(e.target.checked)} /> Airspace checked (Drone Assist)</label>
            <label className="wx-check"><input type="checkbox" checked={notams} onChange={(e) => setNotams(e.target.checked)} /> Flight restrictions checked</label>
            <label className="wx-field"><span>Pilot's notes</span><textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Take-off spot, hazards, permissions…" /></label>
            <button type="button" className="wx-save" onClick={() => window.print()}>Save as PDF or print</button>
            <p className="wx-save-sub">In the print screen, choose "Save as PDF".</p>
          </div>
        </main>
      </div>

      <article className="wx-record" aria-label="Weather record preview">
        <header className="wx-rec-head">
          <div>
            <p className="wx-rec-k">PRE-FLIGHT WEATHER RECORD</p>
            <h2>{site.name}</h2>
            <p className="wx-rec-sub">{site.postcode}{site.place ? ` · ${site.place}` : ""} · {site.lat.toFixed(3)}, {site.lon.toFixed(3)}</p>
          </div>
          <div className="wx-rec-right">
            <p className="wx-rec-brand">HAPPY DRONES</p>
            <p>Saved {dateLong(saved)}, {hhmm(saved)}</p>
            <p>Pilot: Wayne Fox · {drone.name}</p>
          </div>
        </header>
        <section className={`wx-rec-verdict wx-${L.cls}`}>
          <span className="wx-rec-tag">{L.word}</span>
          <p><b>{worst === 0 ? "Within all set limits" : worst === 1 ? "Some limits at caution" : "Outside set limits"} for {dayShort(win[0].ms)} {hhmm(win[0].ms)}–{hhmm(win.at(-1).ms + 3600e3)}.</b> Limits used: gusts {l.gustC}/{l.gustS} mph, wind at 120 m {l.w120C}/{l.w120S} mph, rain {l.rainC}/{l.rainS}%, visibility {l.visC}/{l.visS} km, temperature {l.coldC}/{l.coldS}°C.</p>
        </section>
        <table className="wx-rec-table">
          <caption>Forecast for the flight window</caption>
          <thead><tr><th scope="col">Time</th><th scope="col">Wind</th><th scope="col">Gusts</th><th scope="col">At 120 m (est.)</th><th scope="col">Rain</th><th scope="col">Visibility</th><th scope="col">Temp</th><th scope="col">Verdict</th></tr></thead>
          <tbody>
            {win.map((h, i) => (
              <tr key={h.ms}>
                <td><b>{hhmm(h.ms)}</b></td>
                <td>{Math.round(h.w * MPH)} mph {fromDir(h.d)}</td>
                <td>{Math.round(h.g * MPH)} mph</td>
                <td>~{Math.round(h.w * MPH * HEIGHT_FACTOR)} mph</td>
                <td>{h.p ?? "–"}%</td>
                <td>{h.v != null ? `${(h.v / 1000).toFixed(h.v >= 10000 ? 0 : 1)} km` : "–"}</td>
                <td>{h.c != null ? `${Math.round(h.c)}°C` : "–"}</td>
                <td>{LEVELS[verdicts[i].level].word}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <section className="wx-rec-three">
          <div><p className="wx-rec-k2">LIGHT</p><p>Sunrise {hhmm(sun.sunrise)} · Sunset {hhmm(sun.sunset)}<br />Civil twilight ends {hhmm(sun.dusk)}</p></div>
          <div><p className="wx-rec-k2">GPS / SPACE WEATHER</p><p>{kp?.list?.length ? <>Kp up to {Math.round(kpMax)}{kpMax >= 5 ? ", storm" : ", quiet"}<br />{kpMax >= 5 ? "GPS warning" : "No GPS warning"}</> : "Not available"}</p></div>
          <div><p className="wx-rec-k2">CHECKS TICKED</p><p>Airspace (Drone Assist) {airspace ? "✓" : "–"}<br />Flight restrictions {notams ? "✓" : "–"}</p></div>
        </section>
        <section className="wx-rec-notes"><p className="wx-rec-k3">Pilot's notes</p><div>{notes || " "}</div></section>
        <footer className="wx-rec-foot"><span>Forecast: Met Office Global Spot, fetched {fc?.fetchedAt ? `${dayShort(fc.fetchedAt)} ${hhmm(fc.fetchedAt)}` : ""}. Wind at 120 m is estimated from the 10 m forecast.</span><span>happydrones.co.uk</span></footer>
      </article>
    </>
  );
}
