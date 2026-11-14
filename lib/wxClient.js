/* =========================================================
   WEATHER CHECK — the browser-side logic for /weather-check.
   Drone limits, the go/caution/no-go verdict, sun times, the best
   flying window, and example data for ?demo=1.
   ========================================================= */

export const MPH = 2.23694;          // metres per second → mph
export const HEIGHT_FACTOR = 1.43;   // wind at 120 m ≈ wind at 10 m × (120/10)^(1/7). An estimate only.
export const GUST_HEIGHT_FACTOR = 1.3;

/* ---- Starting limits for each drone (Wayne edits these in the app) ----
   gust / w120 in mph, rain in % chance, vis in km (below = bad), cold in °C (below = bad).
   Starting values only: check against each drone's manual. */
export const DEFAULT_DRONES = [
  { id: "mini4", name: "Mini 4 Pro", note: "Main drone", lim: { gustC: 15, gustS: 22, w120C: 16, w120S: 20, rainC: 30, rainS: 60, visC: 3, visS: 1, coldC: 3, coldS: -5 } },
  { id: "neo2", name: "Neo 2", note: "", lim: { gustC: 10, gustS: 14, w120C: 11, w120S: 14, rainC: 20, rainS: 40, visC: 3, visS: 1, coldC: 3, coldS: 0 } },
  { id: "avata2", name: "Avata 2", note: "Practice only", lim: { gustC: 12, gustS: 18, w120C: 14, w120S: 18, rainC: 20, rainS: 40, visC: 3, visS: 1, coldC: 3, coldS: -5 } },
];

export const LIMIT_ROWS = [
  ["gust", "Gusts (mph)"],
  ["w120", "Wind at 120 m (mph)"],
  ["rain", "Rain chance (%)"],
  ["vis", "Visibility under (km)"],
  ["cold", "Colder than (°C)"],
];

/* Met Office significant weather codes. */
const CODES = {
  0: "Clear", 1: "Sunny", 2: "Partly cloudy", 3: "Partly cloudy", 5: "Mist", 6: "Fog", 7: "Cloudy", 8: "Overcast",
  9: "Light showers", 10: "Light showers", 11: "Drizzle", 12: "Light rain", 13: "Heavy showers", 14: "Heavy showers", 15: "Heavy rain",
  16: "Sleet showers", 17: "Sleet showers", 18: "Sleet", 19: "Hail showers", 20: "Hail showers", 21: "Hail",
  22: "Light snow showers", 23: "Light snow showers", 24: "Light snow", 25: "Heavy snow showers", 26: "Heavy snow showers", 27: "Heavy snow",
  28: "Thunder showers", 29: "Thunder showers", 30: "Thunder",
};
export const codeText = (c) => CODES[c] ?? "";
const THUNDER = new Set([28, 29, 30]);
const SNOW_OR_HAIL = new Set([16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27]);

export const COMPASS = ["north", "north-east", "east", "south-east", "south", "south-west", "west", "north-west"];
export const fromDir = (deg) => (deg == null ? "" : COMPASS[Math.round(((deg % 360) / 45)) % 8]);

/* ---- Sun times (NOAA/SunCalc method), for one day at one place ---- */
const rad = Math.PI / 180, dayMs = 864e5, J1970 = 2440588, J2000 = 2451545, obl = rad * 23.4397, J0 = 0.0009;
const toDays = (d) => d.valueOf() / dayMs - 0.5 + J1970 - J2000;
const fromJ = (j) => new Date((j + 0.5 - J1970) * dayMs);
export function sunTimes(date, lat, lon) {
  const lw = rad * -lon, phi = rad * lat, d = toDays(date);
  const n = Math.round(d - J0 - lw / (2 * Math.PI));
  const ds = J0 + lw / (2 * Math.PI) + n;
  const M = rad * (357.5291 + 0.98560028 * ds);
  const C = rad * (1.9148 * Math.sin(M) + 0.02 * Math.sin(2 * M) + 0.0003 * Math.sin(3 * M));
  const L = M + C + rad * 102.9372 + Math.PI;
  const dec = Math.asin(Math.sin(L) * Math.sin(obl));
  const noon = J2000 + ds + 0.0053 * Math.sin(M) - 0.0069 * Math.sin(2 * L);
  const at = (h) => {
    const w = Math.acos((Math.sin(h * rad) - Math.sin(phi) * Math.sin(dec)) / (Math.cos(phi) * Math.cos(dec)));
    const set = J2000 + J0 + (w + lw) / (2 * Math.PI) + n + 0.0053 * Math.sin(M) - 0.0069 * Math.sin(2 * L);
    return { rise: fromJ(noon - (set - noon)), set: fromJ(set) };
  };
  const sun = at(-0.833), civil = at(-6), golden = at(6);
  return { sunrise: sun.rise, sunset: sun.set, dawn: civil.rise, dusk: civil.set, goldenMorningEnd: golden.rise, goldenEveningStart: golden.set, noon: fromJ(noon) };
}

/* ---- Turn the Met Office series into one row per hour for 72 hours ---- */
export function timeline(fc, hours = 72) {
  if (!fc) return [];
  const byTime = new Map((fc.hourly || []).map((h) => [new Date(h.t).getTime(), h]));
  const three = (fc.three || []).map((h) => ({ ...h, ms: new Date(h.t).getTime() }));
  const start = new Date(); start.setMinutes(0, 0, 0);
  const rows = [];
  for (let i = 0; i < hours; i++) {
    const ms = start.getTime() + i * 3600e3;
    let h = byTime.get(ms);
    let coarse = false;
    if (!h) {
      const near = three.filter((x) => x.ms <= ms).at(-1) || three.find((x) => x.ms > ms);
      if (!near || Math.abs(near.ms - ms) > 3 * 3600e3) continue;
      h = near; coarse = true;
    }
    rows.push({ ...h, ms, coarse });
  }
  return rows;
}

/* ---- The verdict for one hour: 0 go, 1 caution, 2 no-go ---- */
export function judge(h, lim, sun) {
  const reasons = [];
  let level = 0;
  const bump = (l, why) => { if (l > 0) reasons.push({ l, why }); level = Math.max(level, l); };
  const gust = h.g != null ? h.g * MPH : null;
  const w120 = h.w != null ? h.w * MPH * HEIGHT_FACTOR : null;
  const vis = h.v != null ? h.v / 1000 : null;
  if (gust != null) bump(gust >= lim.gustS ? 2 : gust >= lim.gustC ? 1 : 0, `Gusts ${Math.round(gust)} mph`);
  if (w120 != null) bump(w120 >= lim.w120S ? 2 : w120 >= lim.w120C ? 1 : 0, `About ${Math.round(w120)} mph at 120 m`);
  if (h.p != null) bump(h.p >= lim.rainS ? 2 : h.p >= lim.rainC ? 1 : 0, `${h.p}% chance of rain`);
  if (h.r != null && h.r >= 1) bump(2, "Rain falling");
  if (vis != null) bump(vis < lim.visS ? 2 : vis < lim.visC ? 1 : 0, `Visibility ${vis < 10 ? vis.toFixed(1) : Math.round(vis)} km`);
  if (h.c != null) bump(h.c < lim.coldS ? 2 : h.c < lim.coldC ? 1 : 0, `${Math.round(h.c)}°C, cold batteries`);
  if (THUNDER.has(h.x)) bump(2, "Thunder");
  else if (SNOW_OR_HAIL.has(h.x)) bump(2, codeText(h.x));
  if (sun) {
    const t = new Date(h.ms);
    if (t < sun.dawn || t > sun.dusk) bump(1, "Dark: green flashing light on");
  }
  reasons.sort((a, b) => b.l - a.l);
  return { level, reasons };
}

export const LEVELS = [
  { word: "GO", long: "Good to fly", cls: "go" },
  { word: "CAUTION", long: "Fly with care", cls: "care" },
  { word: "NO-GO", long: "Don't fly", cls: "stop" },
];

/* ---- Best runs of "go" hours in daylight ---- */
export function bestWindows(rows, lim, lat, lon) {
  const out = [];
  let cur = null;
  for (const h of rows) {
    const sun = sunTimes(new Date(h.ms), lat, lon);
    const day = new Date(h.ms) >= sun.sunrise && new Date(h.ms) <= sun.sunset;
    const ok = day && judge(h, lim, sun).level === 0;
    const dayKey = new Date(h.ms).toDateString();
    if (ok && cur && cur.dayKey === dayKey && h.ms === cur.end) { cur.end = h.ms + 3600e3; cur.hours++; }
    else if (ok) { if (cur) out.push(cur); cur = { start: h.ms, end: h.ms + 3600e3, hours: 1, dayKey }; }
    else if (cur) { out.push(cur); cur = null; }
  }
  if (cur) out.push(cur);
  // a window never runs past sunset
  return out.map((w) => {
    const set = sunTimes(new Date(w.start), lat, lon).sunset.getTime();
    const end = Math.min(w.end, set);
    return { ...w, end, hours: Math.max(1, Math.round((end - w.start) / 3600e3)) };
  });
}

/* ---- Formatting (UK time) ---- */
const tz = { timeZone: "Europe/London" };
export const hhmm = (d) => new Date(d).toLocaleTimeString("en-GB", { ...tz, hour: "2-digit", minute: "2-digit" });
export const hh = (d) => new Date(d).toLocaleTimeString("en-GB", { ...tz, hour: "2-digit" }).padStart(2, "0");
export const dayShort = (d) => new Date(d).toLocaleDateString("en-GB", { ...tz, weekday: "short", day: "numeric" });
export const dayLong = (d) => new Date(d).toLocaleDateString("en-GB", { ...tz, weekday: "short", day: "numeric", month: "short" });
export const dateLong = (d) => new Date(d).toLocaleDateString("en-GB", { ...tz, weekday: "long", day: "numeric", month: "long", year: "numeric" });

/* ---- Example data for ?demo=1 (no Met Office requests) ---- */
export function demoForecast(lat, lon, seed = 1) {
  const start = new Date(); start.setMinutes(0, 0, 0);
  const rnd = (i) => { const x = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453; return x - Math.floor(x); };
  const make = (i, step) => {
    const ms = start.getTime() + i * step * 3600e3;
    const hour = new Date(ms).getHours();
    const wave = Math.sin((i * step) / 9 + seed) * 0.5 + 0.5;
    const w = 2 + wave * 6 + rnd(i) * 1.5;
    const p = Math.round(Math.min(95, Math.max(0, (wave - 0.35) * 160 + rnd(i + 5) * 15)));
    return {
      t: new Date(ms).toISOString(), w: +w.toFixed(1), g: +(w * 1.55).toFixed(1), d: 200 + Math.round(rnd(i) * 60),
      v: Math.round(25000 - wave * 18000), p, r: p > 70 ? 1.2 : p > 45 ? 0.3 : 0, a: 0,
      c: +(6 + Math.sin(((hour - 9) / 24) * 2 * Math.PI) * 4 + rnd(i + 2)).toFixed(1), f: null, x: p > 60 ? 12 : p > 35 ? 7 : 3, u: 1,
    };
  };
  const hourly = Array.from({ length: 48 }, (_, i) => make(i, 1)).map((h) => ({ ...h, f: +(h.c - 3).toFixed(1) }));
  const three = Array.from({ length: 56 }, (_, i) => make(i, 3)).map((h) => ({ ...h, f: +(h.c - 3).toFixed(1) }));
  return { fetchedAt: new Date().toISOString(), lat, lon, name: "Example data", hourly, three, cached: true, used: 12, limit: 360, demo: true };
}

export const DEMO_SITES = [
  { id: "demo1", name: "Acacia Rd · roof", postcode: "TS18 3AB", place: "Stockton-on-Tees", lat: 54.564, lon: -1.318, job: "" },
  { id: "demo2", name: "Redcar seafront flats", postcode: "TS10 3AE", place: "Redcar and Cleveland", lat: 54.618, lon: -1.069, job: "" },
  { id: "demo3", name: "Durham build · visit 3", postcode: "DH1 3LE", place: "County Durham", lat: 54.775, lon: -1.584, job: "" },
];

/* ---- One job day: daylight hours, a verdict for each, and a rough best time ----
   Used by the /map page (components/SiteMapView.jsx).
   date: "YYYY-MM-DD". kind: the planner mission id, used only to nudge the
   suggestion (filming jobs lean towards softer light, inspections to midday).
   Returns null when the forecast doesn't reach that day yet. */
const LOOKS = new Set(["film", "events", "business"]);
export function jobDay(fc, date, lat, lon, lim, kind) {
  const noonUtc = new Date(`${date}T12:00:00Z`);
  const sun = sunTimes(noonUtc, lat, lon);
  const out = { sun, rows: [], best: null };
  if (!fc) return out;
  const byTime = new Map((fc.hourly || []).map((h) => [new Date(h.t).getTime(), h]));
  const three = (fc.three || []).map((h) => ({ ...h, ms: new Date(h.t).getTime() }));
  const first = new Date(sun.sunrise); first.setMinutes(0, 0, 0);
  for (let ms = first.getTime(); ms <= sun.sunset.getTime(); ms += 3600e3) {
    let h = byTime.get(ms), coarse = false;
    if (!h) {
      const near = three.filter((x) => x.ms <= ms).at(-1);
      if (!near || ms - near.ms >= 3 * 3600e3) continue;
      h = near; coarse = true;
    }
    const v = judge({ ...h, ms }, lim, sun);
    const gust = h.g != null ? h.g * MPH : 0, w120 = h.w != null ? h.w * MPH * HEIGHT_FACTOR : 0;
    const mid = Math.abs(ms - sun.noon.getTime()) / 3600e3;           // hours from midday
    const edge = ms - sun.sunrise.getTime() < 3600e3 || sun.sunset.getTime() - ms < 3600e3;
    let score = v.level * 40 + gust + w120 * 0.4 + (h.p || 0) * 0.3 + (h.v != null && h.v < 5000 ? 10 : 0) + (edge ? 4 : 0);
    score += LOOKS.has(kind) ? (mid < 1.5 ? 2 : 0) : mid * 0.8;        // inspections: closer to midday is better
    out.rows.push({ ...h, ms, coarse, level: v.level, reasons: v.reasons, gust, w120, score });
  }
  if (!out.rows.length) return null;
  // best two-hour stretch (or the best single hour on a short day)
  let best = null;
  for (let i = 0; i < out.rows.length; i++) {
    const pair = out.rows.slice(i, i + 2).filter((r, j, a) => j === 0 || r.ms - a[0].ms === 3600e3);
    const s = pair.reduce((a, r) => a + r.score, 0) / pair.length + (pair.length < 2 ? 3 : 0);
    if (!best || s < best.s) best = { s, rows: pair };
  }
  const r = best.rows;
  out.best = {
    start: r[0].ms,
    end: Math.min(r.at(-1).ms + 3600e3, sun.sunset.getTime()),
    level: Math.max(...r.map((x) => x.level)),
    gust: Math.round(Math.max(...r.map((x) => x.gust))),
    rain: Math.max(...r.map((x) => x.p || 0)),
    sky: codeText(r[0].x),
    temp: r[0].c != null ? Math.round(r[0].c) : null,
  };
  out.goCount = out.rows.filter((x) => x.level === 0).length;
  out.coarse = out.rows.some((x) => x.coarse);
  return out;
}

/* ---- A whole day hour by hour, for the /plan weather chart ----
   From two hours before sunrise to two hours after sunset. Each hour gets a
   verdict (judge), a rough 0–100 "flying conditions" strength for the bar,
   and dark: true when it's outside civil twilight (no photos then).
   Hours the forecast doesn't reach have has: false. */
export function dayChart(fc, date, lat, lon, lim) {
  const sun = sunTimes(new Date(`${date}T12:00:00Z`), lat, lon);
  const byTime = new Map((fc?.hourly || []).map((h) => [new Date(h.t).getTime(), h]));
  const three = (fc?.three || []).map((h) => ({ ...h, ms: new Date(h.t).getTime() }));
  const first = new Date(sun.sunrise.getTime() - 2 * 3600e3); first.setMinutes(0, 0, 0);
  const rows = [];
  for (let ms = first.getTime(); ms <= sun.sunset.getTime() + 2 * 3600e3; ms += 3600e3) {
    const dark = ms < sun.dawn.getTime() || ms > sun.dusk.getTime();
    let h = byTime.get(ms), coarse = false;
    if (!h) {
      const near = three.filter((x) => x.ms <= ms).at(-1);
      if (near && ms - near.ms < 3 * 3600e3) { h = near; coarse = true; }
    }
    if (!h) { rows.push({ ms, dark, has: false }); continue; }
    const v = judge({ ...h, ms }, lim, null);
    const gust = h.g != null ? h.g * MPH : 0;
    const strength = dark ? 0 : Math.max(18, Math.min(100, Math.round(100 - v.level * 30 - Math.max(0, gust - 8) * 1.6 - (h.p || 0) * 0.35)));
    rows.push({ ...h, ms, dark, has: true, coarse, level: dark ? 2 : v.level, reasons: v.reasons, gust, strength });
  }
  return { sun, rows };
}

// The last day the forecast covers, as "YYYY-MM-DD" (UK time)
export function lastForecastDay(fc) {
  const all = [...(fc?.hourly || []), ...(fc?.three || [])].map((h) => new Date(h.t).getTime());
  if (!all.length) return "";
  return new Date(Math.max(...all)).toLocaleDateString("en-CA", { timeZone: "Europe/London" });
}
