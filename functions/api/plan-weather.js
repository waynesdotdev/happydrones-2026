/* POST /api/plan-weather: the weather for a customer's date on /plan.
   Public (no passcode), so it is fenced in to protect the Met Office
   free allowance that the weather check also uses:
   - the customer must have filled in their name and email, the hidden
     honeypot box must be empty, and the form must have been open a few seconds
   - forecasts are shared by postcode district (e.g. TS17): one copy an hour,
     reused by everyone in that area (and by the weather check)
   - each person (by internet address) can check up to PER_PERSON districts a day
   - customers can use at most PUBLIC_LIMIT Met Office requests a day, leaving
     the rest of the 360 for Wayne's weather check
   If anything says no, the /plan form still works, just without the weather.
   Helpers: lib/wxServer.js. Client: components/PlanWeather.jsx */
import { json, forecastFor, today } from "../../lib/wxServer.js";

const PUBLIC_LIMIT = 200; // Met Office requests a day for customers (each new forecast uses 2)
const PER_PERSON = 3;     // postcode districts each person can check a day
const MIN_MS = 3000;      // the form must have been open at least this long
const OUTCODE = /^[A-Z]{1,2}\d[A-Z\d]?$/;
const FULL = /^([A-Z]{1,2}\d[A-Z\d]?)(\d[A-Z]{2})$/;
const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,255}\.[a-z]{2,}$/i;

const no = (error, message, status = 400) => json({ error, message }, status);

async function bump(kv, key, by = 1) {
  const n = Number((await kv.get(key)) || 0) + by;
  await kv.put(key, String(n), { expirationTtl: 2 * 86400 });
  return n;
}

// The middle of a postcode district, from postcodes.io, kept for 30 days
async function districtCentre(kv, oc) {
  const key = `oc:v1:${oc}`;
  const hit = await kv.get(key, "json");
  if (hit) return hit;
  const r = await fetch(`https://api.postcodes.io/outcodes/${oc}`, { headers: { accept: "application/json" } });
  if (!r.ok) return null;
  const x = (await r.json())?.result;
  if (!x || x.latitude == null) return null;
  const district = Array.isArray(x.admin_district) ? x.admin_district[0] : x.admin_district;
  const out = { lat: Number(x.latitude).toFixed(3), lon: Number(x.longitude).toFixed(3), place: district || "" };
  await kv.put(key, JSON.stringify(out), { expirationTtl: 30 * 86400 });
  return out;
}

export async function onRequest({ request, env }) {
  if (request.method !== "POST") return no("method", "Use POST.", 405);
  if (!env.MET_OFFICE_KEY || !env.WEATHER_KV) return no("setup", "The weather check isn't available right now.", 503);

  // Only from the site's own pages
  const origin = request.headers.get("origin") || "";
  if (origin && !/^https:\/\/([a-z0-9-]+\.)*(happydrones\.co\.uk|happydrones[a-z0-9-]*\.pages\.dev)$|^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
    return no("origin", "Not allowed.", 403);
  }

  let b;
  try { b = await request.json(); } catch { return no("details", "Something went wrong. Refresh the page and try again."); }
  if (b.hp) return no("details", "Something went wrong. Refresh the page and try again.");
  if (!(Number(b.ms) >= MIN_MS)) return no("details", "Give it a moment and try again.");
  if (String(b.name || "").trim().length < 2 || !EMAIL.test(String(b.email || "").trim())) {
    return no("details", "Add your name and email first, then check the weather.");
  }
  const pc = String(b.postcode || "").toUpperCase().replace(/\s+/g, "");
  const oc = FULL.test(pc) ? pc.match(FULL)[1] : OUTCODE.test(pc) ? pc : null;
  if (!oc) return no("postcode", "That doesn't look like a UK postcode.");

  const kv = env.WEATHER_KV;
  const day = today();

  const centre = await districtCentre(kv, oc);
  if (!centre) return no("postcode", `Couldn't find ${oc}. Check the postcode.`);
  const lat = Number(centre.lat), lon = Number(centre.lon);
  if (lat < 49 || lat > 61 || lon < -9 || lon > 3) return no("postcode", "The weather check only covers the UK.");

  // Each person: up to PER_PERSON different districts a day (checking the same one again is free)
  const ip = request.headers.get("cf-connecting-ip") || "unknown";
  const pKey = `pub:p:${day}:${ip}`;
  const seen = (await kv.get(pKey, "json")) || [];
  if (!seen.includes(oc)) {
    if (seen.length >= PER_PERSON) return no("person", `You've checked the weather for ${PER_PERSON} areas today. Send your plan and I'll check your date for you.`, 429);
    seen.push(oc);
    await kv.put(pKey, JSON.stringify(seen), { expirationTtl: 2 * 86400 });
  }

  // Customers' share of the daily allowance: only new forecasts count
  const cached = await kv.get(`fc:v1:${centre.lat},${centre.lon}`);
  const pubKey = `pub:n:${day}`;
  if (!cached && Number((await kv.get(pubKey)) || 0) + 2 > PUBLIC_LIMIT) {
    return no("busy", "The weather check is busy today. Send your plan and I'll check your date for you.", 429);
  }

  try {
    const fc = await forecastFor(env, centre.lat, centre.lon);
    if (!fc.cached) await bump(kv, pubKey, 2);
    return json({ area: oc, place: centre.place || fc.name || "", lat, lon, fetchedAt: fc.fetchedAt, hourly: fc.hourly, three: fc.three });
  } catch (e) {
    return no("upstream", e.status === 429 ? "The weather check is busy today. Send your plan and I'll check your date for you." : "The forecast didn't load. Try again in a minute.", 502);
  }
}
