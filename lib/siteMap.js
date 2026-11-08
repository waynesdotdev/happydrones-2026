/* =========================================================
   SITE MAP HELPERS: where a planned job is, for Wayne.
   Used by the mission planner (to add an "Area" line and a map link to
   the enquiry email) and by the unlisted page /map (the map itself).
   Postcodes are looked up with postcodes.io (free, no key).
   Map pictures are OpenStreetMap tiles (free, credit shown on the page).
   ========================================================= */
import { SITE, travelFor } from "./site";

const PC_API = "https://api.postcodes.io";
const FULL = /^[A-Z]{1,2}\d[A-Z\d]?\d[A-Z]{2}$/;

// "ts17 6ab" -> "TS17 6AB"; "ts17" -> "TS17"
export function tidyPostcode(pc) {
  const c = String(pc || "").toUpperCase().replace(/\s+/g, "");
  return FULL.test(c) ? `${c.slice(0, -3)} ${c.slice(-3)}` : c;
}

// Look up a full postcode or just the first half. Returns null if not found.
export async function lookupPostcode(pc) {
  const c = String(pc || "").toUpperCase().replace(/\s+/g, "");
  if (!c) return null;
  const url = FULL.test(c) ? `${PC_API}/postcodes/${c}` : `${PC_API}/outcodes/${c}`;
  try {
    const r = await fetch(url);
    if (!r.ok) return null;
    const { result: x } = await r.json();
    if (!x || x.latitude == null) return null;
    const district = Array.isArray(x.admin_district) ? x.admin_district[0] : x.admin_district;
    return {
      postcode: tidyPostcode(x.postcode || x.outcode || c),
      full: FULL.test(c),
      lat: x.latitude, lon: x.longitude,
      e: x.eastings, n: x.northings,
      ward: x.admin_ward || "",
      district: district || "",
      area: (x.postcode || x.outcode || c).match(/^[A-Z]+/)[0],
    };
  } catch {
    return null;
  }
}

// Straight-line distance in miles
export function milesBetween(a, b) {
  const R = 3958.8, rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad, dLon = (b.lon - a.lon) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// Ordnance Survey grid reference from eastings/northings, e.g. "NZ 44123 18456"
export function gridRef(e, n, digits = 10) {
  if (e == null || n == null) return "";
  const e100 = Math.floor(e / 100000), n100 = Math.floor(n / 100000);
  let l1 = (19 - n100) - ((19 - n100) % 5) + Math.floor((e100 + 10) / 5);
  let l2 = ((19 - n100) * 5) % 25 + (e100 % 5);
  if (l1 > 7) l1++;
  if (l2 > 7) l2++;
  const half = digits / 2;
  const f = (v) => String(Math.floor((v % 100000) / 10 ** (5 - half))).padStart(half, "0");
  return `${String.fromCharCode(65 + l1)}${String.fromCharCode(65 + l2)} ${f(e)} ${f(n)}`;
}

// One line for the email, e.g. "Hartburn, Stockton-on-Tees · 2.1 miles from base · free travel"
export function areaLine(site, base) {
  const place = [site.ward, site.district].filter(Boolean).join(", ") || site.postcode;
  const bits = [place];
  if (base) bits.push(`${milesBetween(base, site).toFixed(1)} miles from base`);
  const t = travelFor(site.area);
  bits.push(t ? (t.fee ? `travel zone ${t.name} (+£${t.fee})` : "free travel zone") : "outside the travel zones, quote travel");
  if (site.e != null) bits.push(`grid ${gridRef(site.e, site.n, 6)}`);
  return bits.join(" · ");
}

// Link to the job page, e.g. https://happydrones.co.uk/map/?pc=TS17+6AB&lat=…&lon=…&c=HD-AB12-CP&k=construction&m=…
// job (optional): { kind, mission, scale, freq, extras, date, total, notes }
const JOB_KEYS = { kind: "k", mission: "m", scale: "s", freq: "f", extras: "x", date: "d", total: "t", notes: "n" };
export function mapPageUrl(site, code, job = {}) {
  const p = new URLSearchParams({ pc: site.postcode, lat: site.lat.toFixed(5), lon: site.lon.toFixed(5) });
  if (code) p.set("c", code);
  for (const [k, short] of Object.entries(JOB_KEYS)) {
    const v = String(job[k] || "").trim();
    if (v) p.set(short, k === "notes" ? v.slice(0, 400) : v);
  }
  return `${SITE.url}/map/?${p.toString()}`;
}
export function jobFromUrl(p) {
  const job = {};
  for (const [k, short] of Object.entries(JOB_KEYS)) job[k] = p.get(short) || "";
  return job;
}

// Links that open the place in a maps app
export const mapLinks = ({ lat, lon, label }) => {
  const q = `${lat},${lon}`;
  return {
    google: `https://www.google.com/maps/search/?api=1&query=${q}`,
    apple: `https://maps.apple.com/?ll=${q}&q=${encodeURIComponent(label || q)}`,
    geo: `geo:${q}?q=${q}(${encodeURIComponent(label || "Site")})`,
    directions: (from) => `https://www.google.com/maps/dir/?api=1${from ? `&origin=${from.lat},${from.lon}` : ""}&destination=${q}`,
  };
};

/* ---- Map tile maths (Web Mercator, 256px tiles) ---- */
export const toWorld = (lat, lon, z) => {
  const s = 256 * 2 ** z, r = (lat * Math.PI) / 180;
  return { x: ((lon + 180) / 360) * s, y: ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * s };
};

// Pick a zoom that fits two points inside a box of the given size (pixels)
export function fitZoom(a, b, w, h, max = 15) {
  for (let z = max; z > 3; z--) {
    const p = toWorld(a.lat, a.lon, z), q = toWorld(b.lat, b.lon, z);
    if (Math.abs(p.x - q.x) < w * 0.6 && Math.abs(p.y - q.y) < h * 0.6) return z;
  }
  return 4;
}
