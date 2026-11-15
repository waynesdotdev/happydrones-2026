/* =========================================================
   WHAT CAN BE BOOKED ONLINE, AND HOW IT'S PAID
   Shared by the booking page (browser) and the booking functions
   (Cloudflare). The server always works the price out again from
   here, so a changed price in the browser can't be used.
   Prices come from lib/site.js and lib/extraServices.js.
   Payment rules follow the booking agreement (/terms):
     deposit ... 25% deposit, balance before the full files (3.2–3.5)
     invoice ... invoiced after each visit, 30 days (3.8): repeat visits,
                 and anything of £1,000 or more
     bundle .... 10 listings paid up front (bundle clause, to be added)
   ========================================================= */
import { PRICING, PLANNER, VACANT, PAYMENT, BUNDLE, AGENT_DISCOUNT, travelFor } from "../site.js";

const home = (id) => PRICING.services.find((s) => s.id === id);
const mis = (id) => PLANNER.missions.find((m) => m.id === id);
const showcase = home("showcase").base;

export const AGREEMENT_VERSION = "2026-11-15"; // the date on /terms ("Last updated")

export const CATALOG = [
  { group: "Homes and property", id: "essentials", name: "Essentials property package", price: home("essentials").base },
  { group: "Homes and property", id: "showcase", name: "Showcase property package", price: showcase },
  { group: "Homes and property", id: "signature", name: "Signature property package", price: home("signature").base },
  { group: "Homes and property", id: "aerial", name: "Aerial photos only", price: home("aerial").base },
  { group: "Homes and property", id: "aerial-360", name: "Aerial 360° panoramas", price: mis("aerial-360").base },
  { group: "Homes and property", id: "land-plot-photos", name: "Land and plot photos", price: mis("land-plot-photos").base },
  { group: "Estate agents", id: "bundle", name: `${BUNDLE.size}-listing bundle (Showcase)`, price: Math.round(showcase * BUNDLE.size * (1 - AGENT_DISCOUNT)), pay: "bundle" },
  { group: "Roofs", id: "roofs", name: "Roof check", price: mis("roofs").base },
  { group: "Roofs", id: "storm-claim-pack", name: "Storm and insurance claim pack", price: mis("storm-claim-pack").base },
  { group: "Roofs", id: "roof-health-check", name: "Yearly roof health check", price: mis("roof-health-check").base },
  { group: "Roofs", id: "gutter-check", name: "Gutter check", price: mis("gutter-check").base },
  { group: "Roofs", id: "solar-pre-survey", name: "Solar pre-survey pack", price: mis("solar-pre-survey").base },
  { group: "Buildings and sites", id: "vacant", name: "Vacant building check (per visit)", price: VACANT.perVisit, pay: "invoice" },
  { group: "Buildings and sites", id: "construction", name: "Construction progress (per visit)", price: mis("construction").base, pay: "invoice" },
  { group: "Buildings and sites", id: "before-after-pack", name: "Before-and-after pack for trades", price: mis("before-after-pack").base },
  { group: "Buildings and sites", id: "planning-context", name: "Planning and design context photos", price: mis("planning-context").base },
  { group: "Business", id: "business", name: "Business content", price: mis("business").base },
  { group: "Business", id: "events", name: "Event filming", price: mis("events").base },
  { group: "Business", id: "film", name: "Aerial film", price: mis("film").base },
];
export const BUNDLE_LISTING = { id: "bundle-listing", name: "Listing from your bundle (Showcase)" };
export const bundleSize = BUNDLE.size, bundleMonths = BUNDLE.months;
/* Bundle timings (booking agreement 3.10): 3 months to use it, a reminder
   2 weeks before the end, one free 1-month extension. */
export const BUNDLE_DAYS = 92, BUNDLE_WARN_DAYS = 14, BUNDLE_EXTEND_DAYS = 31;

export const POSTCODE = /^([A-Z]{1,2}\d[A-Z\d]?)\s*(\d[A-Z]{2})$/;
export const tidyPostcode = (pc) => { const m = String(pc || "").toUpperCase().trim().match(POSTCODE); return m ? `${m[1]} ${m[2]}` : null; };

/* Travel for a postcode: { fee, name } inside the zones, or null outside them. */
export function zoneFor(pc) {
  const p = tidyPostcode(pc); if (!p) return null;
  return travelFor(p.match(/^[A-Z]+/)[0]);
}

/* The price and how it's paid. Returns null if it can't be booked online. */
export function priceFor(serviceId, postcode, { bundleListing = false } = {}) {
  const zone = zoneFor(postcode);
  if (!zone) return { error: "outside", message: "That postcode is outside the travel zones, so it needs a quote. Use the mission planner or get in touch." };
  if (bundleListing) {
    return { name: BUNDLE_LISTING.name, base: 0, travel: zone.fee, total: zone.fee, mode: zone.fee ? "full" : "none", dueNow: zone.fee, zone };
  }
  const s = CATALOG.find((x) => x.id === serviceId);
  if (!s) return { error: "service", message: "Pick a service." };
  const travel = s.pay === "bundle" ? 0 : zone.fee;
  const total = s.price + travel;
  let mode = s.pay || "deposit";
  if (mode === "deposit" && total >= PAYMENT.largeFrom) mode = "invoice";
  const dueNow = mode === "bundle" ? total : mode === "deposit" ? Math.round((total * PAYMENT.depositPct) / 100) : 0;
  return { name: s.name, base: s.price, travel, total, mode, dueNow, zone };
}

export const MODE_WORDS = {
  deposit: `${PAYMENT.depositPct}% deposit now, balance before the full files`,
  invoice: `Invoiced after the visit, ${PAYMENT.termsDays} days`,
  bundle: "Paid in full up front",
  full: "Travel fee paid now",
  none: "Nothing to pay",
};

/* First name for greetings, with no titles (Mr, Mrs, Dr…), so nobody is
   gendered. "Mr Smith" has no first name, so it greets with "Hello". */
const TITLES = new Set(["mr", "mrs", "ms", "miss", "mx", "dr", "prof", "professor", "sir", "dame", "lady", "lord", "rev", "revd", "reverend", "master", "mstr", "madam", "madame", "fr", "father", "sister", "brother"]);
export function firstName(name) {
  const words = String(name || "").trim().split(/\s+/).filter(Boolean);
  let hadTitle = false;
  while (words.length && TITLES.has(words[0].toLowerCase().replace(/\.$/, ""))) { words.shift(); hadTitle = true; }
  if (!words.length || (hadTitle && words.length === 1)) return "";
  const w = words[0];
  return w.charAt(0).toUpperCase() + w.slice(1);
}
/* Name without titles, for checking a typed signature against the account */
export const plainName = (name) => {
  const words = String(name || "").trim().split(/\s+/).filter(Boolean);
  while (words.length > 1 && TITLES.has(words[0].toLowerCase().replace(/\.$/, ""))) words.shift();
  return words.join(" ");
};
export const sameName = (a, b) => plainName(a).toLowerCase().replace(/[^a-z\u00c0-\u024f' -]/g, "") === plainName(b).toLowerCase().replace(/[^a-z\u00c0-\u024f' -]/g, "");
export const greeting = (name) => (firstName(name) ? `Hi ${firstName(name)}` : "Hello");
