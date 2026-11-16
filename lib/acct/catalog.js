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
import { PRICING, PLANNER, VACANT, PAYMENT, BUNDLE, AGENT_DISCOUNT, CLOSED_DAYS, travelFor } from "../site.js";
import { quotePrice } from "../pricing.js";

const home = (id) => PRICING.services.find((s) => s.id === id);
const mis = (id) => PLANNER.missions.find((m) => m.id === id);
const showcase = home("showcase").base;

export const AGREEMENT_VERSION = "2026-11-15"; // the date on /terms ("Last updated")

export const CATALOG = [
  { group: "Homes and property", id: "essentials", quote: "essentials", name: "Essentials property package", price: home("essentials").base },
  { group: "Homes and property", id: "showcase", quote: "showcase", name: "Showcase property package", price: showcase },
  { group: "Homes and property", id: "signature", quote: "signature", name: "Signature property package", price: home("signature").base },
  { group: "Homes and property", id: "aerial", quote: "aerial", name: "Aerial photos only", price: home("aerial").base },
  { group: "Homes and property", id: "aerial-360", name: "Aerial 360° panoramas", price: mis("aerial-360").base },
  { group: "Homes and property", id: "land-plot-photos", name: "Land and plot photos", price: mis("land-plot-photos").base },
  { group: "Estate agents", id: "bundle", name: `${BUNDLE.size}-listing bundle (Showcase)`, price: Math.round(showcase * BUNDLE.size * (1 - AGENT_DISCOUNT)), pay: "bundle" },
  { group: "Roofs", id: "roofs", quote: "roof", name: "Roof check", price: mis("roofs").base },
  { group: "Roofs", id: "storm-claim-pack", name: "Storm and insurance claim pack", price: mis("storm-claim-pack").base },
  { group: "Roofs", id: "roof-health-check", name: "Yearly roof health check", price: mis("roof-health-check").base },
  { group: "Roofs", id: "gutter-check", name: "Gutter check", price: mis("gutter-check").base },
  { group: "Roofs", id: "solar-pre-survey", name: "Solar pre-survey pack", price: mis("solar-pre-survey").base },
  { group: "Buildings and sites", id: "vacant", name: "Vacant building check (per visit)", price: VACANT.perVisit, pay: "invoice", per: "building" },
  { group: "Buildings and sites", id: "construction", name: "Construction progress (per visit)", price: mis("construction").base, pay: "invoice" },
  { group: "Buildings and sites", id: "before-after-pack", name: "Before-and-after pack for trades", price: mis("before-after-pack").base },
  { group: "Buildings and sites", id: "planning-context", name: "Planning and design context photos", price: mis("planning-context").base },
  { group: "Business", id: "business", quote: "business", name: "Business content", price: mis("business").base },
  { group: "Business", id: "events", quote: "event", name: "Event filming", price: mis("events").base },
  { group: "Business", id: "film", quote: "film", name: "Aerial film", price: mis("film").base },
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

/* The sizes and extras the booking form offers for a service: the same
   choices, and the same prices, as the homepage quote builder (lib/pricing.js). */
const quoteOf = (s) => s?.quote && PRICING.services.find((p) => p.id === s.quote && !p.soon);
export function optionsFor(serviceId) {
  const s = CATALOG.find((x) => x.id === serviceId), q = quoteOf(s);
  return {
    sizeTitle: q?.sizeTitle || "", sizes: q ? q.sizes.map((z, i) => ({ i, name: z.name, add: z.add || 0 })) : [],
    extras: q ? PRICING.extras.filter((x) => !x.soon && x.for.includes(q.id)).map((x) => ({ id: x.id, name: x.name, price: x.price })) : [],
    perBuilding: s?.per === "building",
  };
}
const WHITE_LABEL_WORDS = "White label: your branding only, no Happy Drones logo or contact details";

/* The price and how it's paid. size = position in the size list, extras = ids,
   buildings = how many on one visit (vacant checks). The server works this out
   again from the choices, so a price changed in the browser is ignored. */
export function priceFor(serviceId, postcode, { bundleListing = false, size = 0, extras = [], buildings = 1 } = {}) {
  const zone = zoneFor(postcode);
  if (!zone) return { error: "outside", message: "That postcode is outside the travel zones, so it needs a quote. Use the mission planner or get in touch." };
  if (bundleListing) {
    return { name: BUNDLE_LISTING.name, base: 0, travel: zone.fee, total: zone.fee, mode: zone.fee ? "full" : "none", dueNow: zone.fee, zone, lines: [], extras: "", branding: null };
  }
  const s = CATALOG.find((x) => x.id === serviceId);
  if (!s) return { error: "service", message: "Pick a service." };
  let base = s.price, name = s.name, lines = [[s.name, s.price, "service"]], extrasText = "", branding = null;
  const list = Array.isArray(extras) ? extras.filter((x) => typeof x === "string").slice(0, 20) : [];
  if (quoteOf(s)) {
    const q = quotePrice({ service: s.quote, size: Math.max(0, Math.min(9, Number(size) || 0)), extras: list });
    if (q) {
      base = q.total; lines = q.lines;
      const z = q.lines.find(([, , k]) => k === "size"); if (z) name = `${s.name}, ${z[0]}`;
      extrasText = q.lines.filter(([, , k]) => k === "extra").map(([n, p]) => `${n} £${p}`).join("; ");
      if (list.includes("whitelabel") && q.lines.some(([, , k], i) => k === "extra" && PRICING.extras.find((x) => x.id === "whitelabel")?.name === q.lines[i][0])) branding = WHITE_LABEL_WORDS;
    }
  }
  if (s.per === "building") {
    const n = Math.max(1, Math.min(20, Math.round(Number(buildings) || 1)));
    base = s.price * n; if (n > 1) { name = `${s.name} × ${n} buildings`; lines = [[name, base, "service"]]; }
  }
  const travel = s.pay === "bundle" ? 0 : zone.fee;
  const total = base + travel;
  let mode = s.pay || "deposit";
  if (mode === "deposit" && total >= PAYMENT.largeFrom) mode = "invoice";
  const dueNow = mode === "bundle" ? total : mode === "deposit" ? Math.round((total * PAYMENT.depositPct) / 100) : 0;
  return { name, base, travel, total, mode, dueNow, zone, lines, extras: extrasText, branding };
}

/* ---------- dates and times (Wayne, 16 Nov 2026) ----------
   Every form and every server route uses these, so the rules are the same
   everywhere: a real calendar date, not too soon, within 12 months, not a
   closed day (CLOSED_DAYS in lib/site.js), and a daytime flying time. */
export const ukToday = () => new Date().toLocaleDateString("en-CA", { timeZone: "Europe/London" });
export const addDays = (d, n) => new Date(Date.parse(`${d}T12:00:00Z`) + n * 864e5).toISOString().slice(0, 10);
export const isClosed = (d) => CLOSED_DAYS.includes(d) || CLOSED_DAYS.includes(String(d).slice(5));
export function dateProblem(d, { minDays = 2 } = {}) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(d || ""))) return "Pick a date.";
  const t = Date.parse(`${d}T12:00:00Z`);
  if (!Number.isFinite(t) || new Date(t).toISOString().slice(0, 10) !== d) return "That date doesn't exist. Pick another.";
  const today = ukToday();
  if (d < addDays(today, minDays)) return minDays > 0 ? `Pick a date at least ${minDays} days from now.` : "That date has passed. Pick a new one.";
  if (d > addDays(today, 366)) return "Pick a date within the next 12 months.";
  if (isClosed(d)) return "I don't fly on that day (Christmas, Boxing Day and New Year's Day). Pick another.";
  return "";
}
export const TIME_WORDS = ["Morning", "Afternoon", "Any time"];
export const TIME_CHOICES = [...TIME_WORDS.slice(0, 2), ...Array.from({ length: 13 }, (_, i) => `${String(i + 7).padStart(2, "0")}:00`)];
export function timeProblem(t) {
  const v = String(t ?? "").trim();
  if (!v || TIME_WORDS.some((w) => w.toLowerCase() === v.toLowerCase())) return "";
  const m = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(v);
  return m && Number(m[1]) >= 6 && (Number(m[1]) < 20 || v === "20:00") ? "" : "Pick a time between 06:00 and 20:00, or morning or afternoon.";
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
const norm = (n) => plainName(n).toLowerCase().replace(/[^a-z\u00c0-\u024f' -]/g, "").replace(/\s+/g, " ").trim();
/* The names a signature can match: the account name, and for a joint account
   ("Michael and Michelle Moore", "Ann & Bob Lee") either person's own name. */
export function signerNames(account) {
  const n = plainName(account).replace(/\s+&\s+/g, " and ");
  const bits = n.split(/\s+and\s+/i).map((x) => x.trim()).filter(Boolean);
  if (bits.length !== 2) return [n];
  const surname = bits[1].split(/\s+/).slice(1).join(" ");
  const first = bits[0].split(/\s+/).length === 1 && surname ? `${bits[0]} ${surname}` : bits[0];
  return [n, first, bits[1]];
}
export const sameName = (typed, account) => signerNames(account).some((n) => norm(n) === norm(typed));
export const greeting = (name) => (firstName(name) ? `Hi ${firstName(name)}` : "Hello");
