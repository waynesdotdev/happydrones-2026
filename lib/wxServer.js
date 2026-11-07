/* =========================================================
   WEATHER CHECK — server-side helpers for the Cloudflare functions
   in functions/api/wx/. These run on Cloudflare only, never in the browser.

   Settings (Cloudflare → happydrones project → Settings):
     MET_OFFICE_KEY  secret: the Met Office Weather DataHub (Global Spot) key
     WEATHER_PIN     secret: the passcode for /weather-check
     WEATHER_KV      KV binding (namespace "happydrones-weather"): forecast
                     copies for an hour, the daily request count, failed logins
   Optional, for testing only:
     MET_OFFICE_BASE overrides the Met Office address
   ========================================================= */

export const MET_OFFICE_BASE = "https://data.hub.api.metoffice.gov.uk/sitespecific/v0/point/";
export const DAILY_LIMIT = 360;        // Global Spot free plan
export const CACHE_SECONDS = 3600;     // keep each site's forecast for an hour
const COOKIE = "hdwx";
const SESSION_DAYS = 365;

export function json(data, status = 200, extra = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", "x-robots-tag": "noindex, nofollow", ...extra },
  });
}

async function hmacHex(key, msg) {
  const enc = new TextEncoder();
  const k = await crypto.subtle.importKey("raw", enc.encode(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", k, enc.encode(msg));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/* The session token is derived from the PIN and the key, so changing
   either one signs everybody out. */
export function sessionToken(env) {
  return hmacHex(`${env.WEATHER_PIN || ""}|${env.MET_OFFICE_KEY || ""}`, "happydrones-weather-session-v1");
}

export function readCookie(request, name = COOKIE) {
  const raw = request.headers.get("cookie") || "";
  for (const part of raw.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return v.join("=");
  }
  return null;
}

export async function isSignedIn(request, env) {
  if (!env.WEATHER_PIN) return false;
  const got = readCookie(request);
  if (!got) return false;
  return safeEqual(got, await sessionToken(env));
}

export function safeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function sessionCookie(token) {
  return `${COOKIE}=${token}; Path=/api/wx; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_DAYS * 86400}`;
}
export const clearCookie = `${COOKIE}=; Path=/api/wx; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;

export const today = () => new Date().toISOString().slice(0, 10);

export async function usedToday(env) {
  if (!env.WEATHER_KV) return null;
  return Number((await env.WEATHER_KV.get(`n:${today()}`)) || 0);
}

async function addUsed(env, n) {
  if (!env.WEATHER_KV) return null;
  const key = `n:${today()}`;
  const next = Number((await env.WEATHER_KV.get(key)) || 0) + n;
  await env.WEATHER_KV.put(key, String(next), { expirationTtl: 3 * 86400 });
  return next;
}

/* Keep only the fields the app uses, with short names. Units as the Met Office
   sends them: wind in metres per second, visibility in metres. */
function trim(series = []) {
  return series.map((s) => ({
    t: s.time,
    w: s.windSpeed10m ?? null,
    g: s.windGustSpeed10m ?? s.max10mWindGust ?? null,
    d: s.windDirectionFrom10m ?? null,
    v: s.visibility ?? null,
    p: s.probOfPrecipitation ?? null,
    r: s.precipitationRate ?? null,
    a: s.totalPrecipAmount ?? null,
    c: s.screenTemperature ?? (s.maxScreenAirTemp != null && s.minScreenAirTemp != null ? (s.maxScreenAirTemp + s.minScreenAirTemp) / 2 : null),
    f: s.feelsLikeTemperature ?? s.feelsLikeTemp ?? null,
    x: s.significantWeatherCode ?? null,
    u: s.uvIndex ?? null,
  }));
}

async function metOffice(env, step, lat, lon) {
  const base = env.MET_OFFICE_BASE || MET_OFFICE_BASE;
  const url = `${base}${step}?excludeParameterMetadata=true&includeLocationName=true&latitude=${lat}&longitude=${lon}`;
  const res = await fetch(url, { headers: { accept: "application/json", apikey: env.MET_OFFICE_KEY } });
  if (!res.ok) {
    const err = new Error(`Met Office ${step} replied ${res.status}`);
    err.status = res.status;
    throw err;
  }
  const data = await res.json();
  const feat = data?.features?.[0] || {};
  return { name: feat.properties?.location?.name || null, run: feat.properties?.modelRunDate || null, series: trim(feat.properties?.timeSeries) };
}

/* One site's forecast: from the hour-long copy if there is one, else two
   Met Office requests (hourly for 48 hours + three-hourly for 7 days). */
export async function forecastFor(env, lat, lon) {
  const key = `fc:v1:${lat},${lon}`;
  if (env.WEATHER_KV) {
    const hit = await env.WEATHER_KV.get(key, "json");
    if (hit) return { ...hit, cached: true, used: await usedToday(env) };
  }
  const used0 = await usedToday(env);
  if (used0 != null && used0 + 2 > DAILY_LIMIT) {
    const err = new Error("Today's free Met Office requests are used up");
    err.status = 429;
    throw err;
  }
  const [hourly, three] = await Promise.all([metOffice(env, "hourly", lat, lon), metOffice(env, "three-hourly", lat, lon)]);
  const out = { fetchedAt: new Date().toISOString(), lat, lon, name: hourly.name || three.name, run: hourly.run, hourly: hourly.series, three: three.series };
  if (env.WEATHER_KV) await env.WEATHER_KV.put(key, JSON.stringify(out), { expirationTtl: CACHE_SECONDS });
  const used = await addUsed(env, 2);
  return { ...out, cached: false, used };
}

/* Planetary K-index forecast from NOAA's Space Weather Prediction Center.
   Handles both the old header-row layout and the 2026 object layout. */
export async function kpForecast(env) {
  const key = "kp:v1";
  if (env.WEATHER_KV) {
    const hit = await env.WEATHER_KV.get(key, "json");
    if (hit) return hit;
  }
  const res = await fetch("https://services.swpc.noaa.gov/products/noaa-planetary-k-index-forecast.json", { headers: { accept: "application/json" } });
  if (!res.ok) throw new Error(`NOAA replied ${res.status}`);
  const raw = await res.json();
  let rows = [];
  if (Array.isArray(raw) && Array.isArray(raw[0])) {
    const head = raw[0];
    rows = raw.slice(1).map((r) => Object.fromEntries(head.map((h, i) => [h, r[i]])));
  } else if (Array.isArray(raw)) rows = raw;
  const list = rows
    .map((r) => ({ t: String(r.time_tag || "").replace(" ", "T") + (String(r.time_tag || "").endsWith("Z") ? "" : "Z"), kp: Number(r.kp ?? r.Kp), kind: r.observed || r.status || null }))
    .filter((r) => !Number.isNaN(r.kp) && r.t.length > 5);
  const out = { fetchedAt: new Date().toISOString(), list };
  if (env.WEATHER_KV) await env.WEATHER_KV.put(key, JSON.stringify(out), { expirationTtl: 3 * 3600 });
  return out;
}
