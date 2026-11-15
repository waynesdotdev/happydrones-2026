/* =========================================================
   ONE PLACE THAT WORKS OUT A QUOTE.
   The quote builder and the mission planner use it to show a price, and the
   server (functions/api/enquiry.js) uses it again on what the customer chose.
   The server never trusts a price sent by a browser: it only takes the
   CHOICES (which service, size, extras…) and works the price out here.

   Prices themselves live in PRICING and PLANNER in lib/site.js.
   A "line" is [name, pounds, kind]; kind = service | size | extra | discount | travel.
   ========================================================= */
import { PRICING, PLANNER, travelFor, missionBase } from "./site.js";

const sum = (lines) => lines.reduce((a, [, p]) => a + p, 0);

/* Homepage quote builder: a service, a size (its position in the list) and extras */
export function quotePrice({ service, size = 0, extras = [] }) {
  const svc = PRICING.services.find((s) => s.id === service && !s.soon);
  if (!svc) return null;
  const z = svc.sizes[Number(size)] || svc.sizes[0];
  const picked = PRICING.extras.filter((x) => extras.includes(x.id) && x.for.includes(svc.id));
  const lines = [[svc.name, svc.base, "service"], ...(z.add ? [[z.name, z.add, "size"]] : []), ...picked.map((x) => [x.name, x.price, "extra"])];
  return { serviceId: svc.id, lines, total: sum(lines), summary: [svc.name, z.name, ...picked.map((x) => x.name)].join(", ") };
}

/* Mission planner: a mission, its scale, how often, extras, and the postcode for travel */
const areaOf = (pc) => (String(pc || "").toUpperCase().replace(/\s+/g, "").match(/^[A-Z]{1,2}/) || [""])[0];
export function missionPrice({ mission, scale, freq, extras = [], postcode = "" }) {
  const m = PLANNER.missions.find((x) => x.id === mission);
  const sc = PLANNER.scale.find((x) => x.id === scale);
  const fr = PLANNER.frequency.find((x) => x.id === freq);
  if (!m || !sc || !fr) return null;
  const base = missionBase(m.base, sc.mult);
  const picked = PLANNER.extras.filter((x) => extras.includes(x.id));
  const perVisit = base + picked.reduce((a, x) => a + x.price, 0);
  const gross = perVisit * fr.visits;
  const disc = Math.round(gross * fr.disc);
  const travel = travelFor(areaOf(postcode))?.fee || 0;
  const v = fr.visits, times = v > 1 ? ` × ${v} visits` : "";
  const lines = [[`${m.name}, ${sc.name}${times}`, base * v, "service"], ...picked.map((x) => [`${x.name}${times}`, x.price * v, "extra"]),
    ...(disc ? [[`${fr.name} saving`, -disc, "discount"]] : []), ...(travel ? [[`Travel${times}`, travel * v, "travel"]] : [])];
  return { serviceId: m.id, m, sc, fr, base, extras: picked, perVisit, gross, disc, travel, lines, total: sum(lines),
    summary: [`${m.name}, ${sc.name}, ${fr.name}`, ...picked.map((x) => x.name)].join(", ") };
}

/* What the forms send: {"t":"quote",…} or {"t":"mission",…}. Returns null if it isn't a real choice. */
export function priceChoice(choice, postcode) {
  if (!choice || typeof choice !== "object") return null;
  const list = (v) => (Array.isArray(v) ? v.filter((x) => typeof x === "string").slice(0, 20) : []);
  if (choice.t === "quote") return quotePrice({ service: String(choice.service || ""), size: Number(choice.size) || 0, extras: list(choice.extras) });
  if (choice.t === "mission") return missionPrice({ mission: String(choice.mission || ""), scale: String(choice.scale || ""), freq: String(choice.freq || ""), extras: list(choice.extras), postcode });
  return null;
}
