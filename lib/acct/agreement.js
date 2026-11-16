/* =========================================================
   E-SIGNING THE BOOKING AGREEMENT (server side, Cloudflare only)

   What makes a signature hold up (UK: Electronic Communications Act 2000,
   UK eIDAS "simple electronic signature"):
   - who:   a signed-in account whose email is checked with a code every sign-in
   - intent: a separate step where they type their full name and tick
   - what:  the exact agreement text from /terms plus their Job Details,
            frozen and fingerprinted (SHA-256) at that moment
   - when / where: time, IP address and browser are recorded
   - copy:  emailed to them as an attached file (a "durable medium",
            which consumer law needs; a link alone isn't enough)
   ========================================================= */
import { PACKAGES, SERVICE_PAGES, SITE as SITE_INFO, PAYMENT, money } from "../site.js";
import { extraById } from "../extraServices.js";
import { CATALOG, BUNDLE_LISTING, bundleSize, BUNDLE_DAYS } from "./catalog.js";

/* ---------- Job Details defaults, from the same lists the website uses ---------- */
const VACANT_GETS = ["An outside and roof check each visit: roof, lead, gutters, windows, fences, fly-tipping and signs of entry", "Dated photos from the same positions every visit, by download link"];
export function deliverablesFor(id) {
  const showcase = PACKAGES.find((p) => p.id === "showcase")?.gets || [];
  if (id === "bundle") return `Up to ${bundleSize} Showcase listings, booked one at a time within ${Math.round(BUNDLE_DAYS / 30.5)} months (3.10). For each listing: ${showcase.join("; ")}`;
  if (id === BUNDLE_LISTING.id) return showcase.join("; ");
  if (id === "vacant") return VACANT_GETS.join("; ");
  const gets = PACKAGES.find((p) => p.id === id)?.gets || extraById(id)?.gets || SERVICE_PAGES.find((p) => p.id === id)?.gets;
  return gets ? gets.join("; ") : "";
}
const group = (id) => (id === BUNDLE_LISTING.id ? "Estate agents" : CATALOG.find((c) => c.id === id)?.group || "");
export function defaultsFor(b) {
  const g = group(b.service_id), propertyish = g === "Homes and property" || g === "Estate agents";
  return {
    deliverables: deliverablesFor(b.service_id),
    delivery: "Within 48–72 hours of the shoot, unless the list above says otherwise (8.1)",
    licence: b.booking_as === "consumer" ? "Personal" : propertyish ? "Property marketing" : "Business",
    branding: b.booking_as === "business" && propertyish ? "Standard" : "Not applicable",
    extras: "",
  };
}
const TERMS = {
  deposit: `Standard: ${PAYMENT.depositPct}% deposit, balance before full files (3.2–3.5)`,
  invoice: `Invoice terms: ${PAYMENT.termsDays} days per invoice (3.8)`,
  bundle: "Listing bundle: paid in full up front (3.10)",
  full: "Listing from a bundle (3.10): travel fee paid when booking",
  none: "Listing from a bundle (3.10): nothing more to pay",
};
const field = (b, k) => (b[k] ?? "") !== "" && b[k] != null ? b[k] : defaultsFor(b)[k];

/* The Job Details table, in the same order as on /terms */
export function jobRows(b, u) {
  const dateLine = b.confirmed_date ? `${b.confirmed_date}${b.confirmed_time ? `, ${b.confirmed_time}` : ""}` : b.wanted_date ? `Wanted ${b.wanted_date}${b.wanted_time ? `, ${b.wanted_time}` : ""}, to be confirmed by Wayne` : "Any date, to be agreed with Wayne";
  const rows = [
    ["Booking reference", b.ref],
    ["Client name", u?.name || ""],
    ["Business name (if booking for a business)", u?.company || "–"],
    ["Client email and phone", [u?.email, u?.phone].filter(Boolean).join(" · ")],
    ["Booking as", b.booking_as === "business" ? "Business" : "Consumer (private individual)"],
    ["Property or site address", [b.address, b.postcode].filter(Boolean).join(", ")],
    ["Service and package", b.service],
    ["What you'll receive", field(b, "deliverables")],
    ["Shoot date and time (or visit schedule)", dateLine],
    ["Delivery time", field(b, "delivery")],
    ["Price", `${money(b.total)}${b.travel ? ` (includes ${money(b.travel)} travel)` : ""}`],
    ["Payment terms", TERMS[b.mode] || b.mode],
  ];
  if (b.mode === "deposit") rows.push(["Deposit", `${money(b.due_now)}, paid by card when you book online`], ["Balance", `${money(b.total - b.due_now)}, due before full files are released`]);
  rows.push(["Licence (section 9)", field(b, "licence")], ["Branding, estate agents (9.6)", field(b, "branding")], ["Extras agreed", field(b, "extras") || "None"], ["Special notes", b.notes || "None"]);
  return rows;
}

/* ---------- the agreement text, copied from the published /terms page ---------- */
const between = (html, a, z) => { const i = html.indexOf(`data-agreement="${a}"`), j = html.indexOf(`data-agreement="${z}"`); if (i < 0 || j < 0) return ""; return html.slice(html.indexOf(">", i) + 1, html.lastIndexOf("<", j)); };
export async function currentTerms(env, request) {
  const r = await env.ASSETS.fetch(new URL("/terms/", request.url));
  const html = await r.text();
  const terms = between(html, "terms-start", "terms-end"), cancel = between(html, "cancel-start", "cancel-end");
  if (!terms || !cancel) throw new Error("terms-missing");
  return { terms, cancel };
}

/* ---------- the signed document ---------- */
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
export const ukTime = (t) => new Date(t * 1000).toLocaleString("en-GB", { timeZone: "Europe/London", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });

export function agreementHtml({ sig, rows, terms, cancel, goAt }) {
  const table = (r) => r.map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`).join("");
  return `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Happy Drones Booking Agreement ${esc(sig.ref)}</title>
<style>
body{font:16px/1.55 Georgia,serif;color:#1a1a1a;background:#fff;margin:0;padding:24px 16px}main{max-width:760px;margin:0 auto}
h1{font:800 1.6rem/1.2 Arial,sans-serif;color:#003366;margin:0 0 4px}h2{font:700 1.15rem Arial,sans-serif;color:#003366;margin:28px 0 8px}
table{border-collapse:collapse;width:100%;margin:8px 0 16px;font-size:.95rem}th,td{border:1px solid #c9d3df;padding:7px 9px;text-align:left;vertical-align:top}th{background:#f2f6fb;width:38%;font-weight:600}
.sig{border:2px solid #2fbf71;border-radius:10px;padding:12px 16px;background:#f3fbf6}.sig b{font-family:Arial,sans-serif}.fp{font-family:monospace;font-size:.82rem;word-break:break-all}
.tm-n{font-weight:700;margin-right:4px}.tm-c{margin:8px 0}.tm-hint{color:#666}.small{font-size:.85rem;color:#555}hr{border:0;border-top:1px solid #ddd;margin:24px 0}
@media print{body{padding:0}}
</style></head><body><main>
<h1>Happy Drones Booking Agreement</h1>
<p class="small">Booking ${esc(sig.ref)} · agreement version ${esc(sig.version)} · ${sig.kind === "change" ? "signed again to approve changes" : "signed online"}</p>
<div class="sig">
<p><b>Signed by ${esc(sig.name)}</b>, on ${esc(ukTime(sig.at))} (UK time), by typing their name and ticking to agree, while signed in to their Happy Drones account (${esc(sig.email)}).</p>
${sig.early ? `<p><b>Early start requested:</b> ${esc(sig.name)} asked Happy Drones to start the work within the 14-day cancellation period, understanding that if they cancel after work has started they pay for the work done, and once the work is complete they lose the right to cancel.</p>` : ""}
<p><b>Wayne Fox, trading as Happy Drones:</b> ${sig.kind === "change" ? "proposed these changes, so they're agreed by both of us once signed." : goAt ? `accepted and confirmed the booking on ${esc(ukTime(goAt))} (UK time).` : "accepts this agreement by confirming the booking, which you'll be told about by email."}</p>
<p class="small">Recorded from IP address ${esc(sig.ip || "unknown")}. Fingerprint of this signed agreement (SHA-256):<br><span class="fp">${esc(sig.fingerprint)}</span></p>
</div>
<h2>Job Details</h2>
<p>If anything here differs from the terms below, this wins.</p>
<table><tbody>${table(rows)}</tbody></table>
<h2>The terms</h2>
${terms}
<hr>
${cancel}
<p><em>End of agreement.</em></p>
</main></body></html>`;
}

/* The fingerprint covers everything that was agreed */
export async function fingerprint(parts) {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(JSON.stringify(parts)));
  return [...new Uint8Array(d)].map((x) => x.toString(16).padStart(2, "0")).join("");
}

/* Fields Wayne can change. Contract ones need the customer to approve and sign again. */
export const CONTRACT_FIELDS = ["service", "address", "postcode", "deliverables", "delivery", "licence", "branding", "extras", "base", "travel", "total", "mode", "due_now"];
export const FIELD_LABELS = { service: "Service and package", address: "Site address", postcode: "Postcode", deliverables: "What you'll receive", delivery: "Delivery time", licence: "Licence", branding: "Branding", extras: "Extras agreed", base: "Price before travel", travel: "Travel", total: "Price", mode: "Payment terms", due_now: "Deposit / due now" };
export const SITE_NAME = SITE_INFO.name;

/* Base64 for email attachments (UTF-8 safe) */
export function toBase64(str) {
  const bytes = new TextEncoder().encode(str); let bin = "";
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}

/* A booking as it will be once the waiting changes are approved */
export function withPending(b) { return b.pending ? { ...b, ...JSON.parse(b.pending) } : b; }
const show = (k, v) => (["base", "travel", "total", "due_now"].includes(k) ? `£${v}` : k === "mode" ? ({ deposit: "Deposit, balance before files", invoice: "Invoice after the visit" }[v] || v) : v);
export function changeList(b) {
  if (!b.pending) return null;
  const p = JSON.parse(b.pending);
  return Object.keys(p).filter((k) => k !== "base" || !("total" in p)).map((k) => ({ key: k, label: FIELD_LABELS[k] || (k === "notes" ? "Special notes" : k), from: b[k] == null || b[k] === "" ? "" : String(show(k, b[k])), to: p[k] == null ? "" : String(show(k, p[k])) }));
}
export async function signedHtml(D, sig, b) {
  const t = await D.prepare("SELECT * FROM agreement_texts WHERE hash = ?").bind(sig.terms_hash).first();
  return agreementHtml({ sig: { ...sig, ref: b.ref }, rows: JSON.parse(sig.job), terms: t?.terms || "", cancel: t?.cancel || "", goAt: b.go_at });
}
export async function signedFile(D, sig, b) {
  return new Response(await signedHtml(D, sig, b), { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store", "x-robots-tag": "noindex",
    "content-security-policy": "default-src 'none'; style-src 'unsafe-inline'; img-src 'self'", "content-disposition": `inline; filename="Happy-Drones-Booking-Agreement-${b.ref}.html"` } });
}

/* ---------- RECEIPTS AND INVOICES (16 Nov 2026) ----------
   A numbered receipt for every payment, and a numbered invoice for every job
   on invoice terms. Wayne is not VAT registered, so no VAT is shown (3.1).
   Bank details for invoices come from the Cloudflare setting BANK_DETAILS,
   never from the code. */
const DOC_STYLE = `body{font:16px/1.5 Arial,sans-serif;color:#1a1a1a;background:#fff;margin:0;padding:24px 16px}main{max-width:720px;margin:0 auto}
h1{font-size:1.5rem;color:#003366;margin:0 0 4px}.sub{color:#555;margin:0 0 20px}table{border-collapse:collapse;width:100%;margin:12px 0 18px}
th,td{border:1px solid #c9d3df;padding:8px 10px;text-align:left;vertical-align:top}th{background:#f2f6fb;width:40%;font-weight:600}
td.n{text-align:right;white-space:nowrap}.tot td,.tot th{font-weight:700}.box{border:2px solid #003366;padding:12px 14px;margin:16px 0}
.small{font-size:.88rem;color:#555}@media print{body{padding:0}button{display:none}}`;
export const receiptNo = (id) => `R-${String(id).padStart(5, "0")}`;
export const invoiceNo = (b) => `INV-${String(b.ref).replace(/^HD-/, "")}`;
export const ukDate = (t) => new Date(t * 1000).toLocaleDateString("en-GB", { timeZone: "Europe/London", day: "numeric", month: "long", year: "numeric" });
const from = () => `${SITE_INFO.name} · Wayne Fox<br>${esc(SITE_INFO.address)}<br>${esc(SITE_INFO.email)}`;
function page(title, body) {
  return `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(title)}</title><style>${DOC_STYLE}</style></head><body><main>${body}
<p class="small">${SITE_INFO.name} is not registered for VAT, so no VAT is charged.</p></main></body></html>`;
}
export function receiptHtml(pay, b, u) {
  return page(`Receipt ${receiptNo(pay.id)}`, `<h1>Receipt ${receiptNo(pay.id)}</h1><p class="sub">${from()}</p>
<table><tr><th>Received from</th><td>${esc(u?.name || "")}${u?.company ? `<br>${esc(u.company)}` : ""}</td></tr>
<tr><th>Date</th><td>${ukDate(pay.at)}</td></tr><tr><th>Booking</th><td>${esc(b.ref)}: ${esc(b.service)}, ${esc(b.postcode)}</td></tr>
<tr><th>Paid by</th><td>${esc(pay.how)}</td></tr><tr class="tot"><th>Amount received</th><td class="n">${money(pay.amount)}</td></tr>
<tr><th>Job total</th><td class="n">${money(b.total)}</td></tr><tr><th>Paid so far, including this</th><td class="n">${money(pay.paid_after)}</td></tr>
<tr><th>Still to pay</th><td class="n">${money(Math.max(0, b.total - pay.paid_after))}</td></tr></table>`);
}
export function invoiceHtml(b, u, bank, issued) {
  const due = issued + 30 * 86400, owed = Math.max(0, b.total - (b.paid || 0));
  const lines = [[b.service, b.base], ...(b.travel ? [["Travel", b.travel]] : [])];
  return page(`Invoice ${invoiceNo(b)}`, `<h1>Invoice ${invoiceNo(b)}</h1><p class="sub">${from()}</p>
<table><tr><th>To</th><td>${esc(u?.name || "")}${u?.company ? `<br>${esc(u.company)}` : ""}<br>${esc(u?.email || "")}</td></tr>
<tr><th>Invoice date</th><td>${ukDate(issued)}</td></tr><tr><th>Due by</th><td>${ukDate(due)} (${PAYMENT.termsDays} days, clause 3.8)</td></tr>
<tr><th>Booking</th><td>${esc(b.ref)}${b.address ? `, ${esc(b.address)}` : ""}, ${esc(b.postcode)}${b.confirmed_date ? `, flown ${esc(b.confirmed_date)}` : ""}</td></tr></table>
<table>${lines.map(([n, p]) => `<tr><th>${esc(n)}</th><td class="n">${money(p)}</td></tr>`).join("")}${b.extras ? `<tr><th>Included extras</th><td>${esc(b.extras)}</td></tr>` : ""}
<tr class="tot"><th>Total</th><td class="n">${money(b.total)}</td></tr>${b.paid ? `<tr><th>Already paid</th><td class="n">${money(b.paid)}</td></tr><tr class="tot"><th>To pay</th><td class="n">${money(owed)}</td></tr>` : ""}</table>
<div class="box"><b>How to pay:</b> bank transfer, with ${esc(invoiceNo(b))} as the reference.<br>${bank ? esc(bank).replace(/\n/g, "<br>") : "Bank details are sent with this invoice by email. If you don't have them, reply and ask."}</div>`);
}
export function docResponse(html, filename) {
  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store", "x-robots-tag": "noindex",
    "content-security-policy": "default-src 'none'; style-src 'unsafe-inline'", "content-disposition": `inline; filename="${filename}"` } });
}
