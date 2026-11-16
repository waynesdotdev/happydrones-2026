/* /api/enquiry : every website form (quote, mission plan, agent account,
   coming-soon interest, feedback) is saved here first.
   POST  saves it, emails the customer a confirmation with a private link,
         and emails Wayne. Web3Forms still sends Wayne a backup copy from the browser.
   GET   ?t=<token> : the customer's private view of what they sent.
   The token is only ever in the customer's email; the database keeps a hash of it. */
import { json, fail, now, ipOf, sameSite, body, db, limited, randomHex, sha256, sendMail, MAIL as MAIL_ENQ } from "../../lib/acct/server.js";
import { LABELS, SKIP } from "../../lib/sendForm.js";
import { CATALOG, tidyPostcode, dateProblem, timeProblem } from "../../lib/acct/catalog.js";
import { priceChoice } from "../../lib/pricing.js";
import { money } from "../../lib/site.js";

const SITE = "https://happydrones.co.uk";
const KINDS = { quote: "quote request", mission: "mission plan", "agent-account": "agent account request", business: "business enquiry", interest: "interest in a coming-soon service", feedback: "feedback" };
const PUBLIC_STATUS = { new: "Received: Wayne will reply within a day", contacted: "Wayne has been in touch", quoted: "Price sent", won: "Booked", lost: "Closed", scrapped: "Closed" };
const EMAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const HIDE_FROM_CUSTOMER = new Set(["Job page: map and weather (tap to open)", "Weather when they checked"]);
const clean = (v, n = 2000) => String(v ?? "").replace(/[\u0000-\u0008\u000b-\u001f]/g, " ").trim().slice(0, n);

export async function onRequest({ request, env }) {
  try {
    if (request.method === "POST") return await save(request, env);
    if (request.method === "GET") return await view(request, env);
    return fail("method", "Not allowed.", 405);
  } catch (e) {
    if (e.message === "no-db") return fail("setup", "Not available right now.", 503);
    return fail("server", "Something went wrong.", 500);
  }
}

async function save(request, env) {
  if (!sameSite(request)) return fail("origin", "Not allowed.", 403);
  const x = await body(request);
  if (x["bot-field"]) return json({ ok: true, ref: "Q-000000" }); // a bot filled the hidden field
  const ip = ipOf(request);
  if (await limited(env, `enq:h:${ip}`, 8, 3600) || await limited(env, `enq:d:${ip}`, 25, 86400)) return fail("slow", "Lots of messages from here today. Please use WhatsApp or call instead.", 429);
  const kind = KINDS[x["form-name"]] ? x["form-name"] : "quote";
  const name = clean(x.name, 80), email = clean(x.email, 120).toLowerCase(), phone = clean(x.phone, 30);
  if (email && !EMAIL.test(email)) return fail("email", "That email address doesn't look right.");
  if (kind !== "feedback" && (name.length < 2 || (!email && phone.replace(/\D/g, "").length < 10))) return fail("details", "Add your name and an email or phone number.");
  if ((kind === "quote" || kind === "mission") && !/^\d{4}-\d{2}-\d{2}$/.test(String(x.date || ""))) return fail("date", "Pick the date you'd like.");
  if (x.date) { const dp = dateProblem(String(x.date), { minDays: 1 }); if (dp) return fail("date", dp); }
  if (x.time) { const tp = timeProblem(x.time); if (tp) return fail("time", tp); }

  // THE PRICE IS WORKED OUT HERE, from what they chose, never taken from the browser.
  // Anything the browser sent as a price or a summary is replaced or dropped.
  let choice = null; try { choice = JSON.parse(x["price-choice"] || "null"); } catch { /* not a real choice */ }
  const priced = priceChoice(choice, x.postcode);
  for (const k of ["quote-total", "total", "quote-summary", "price-lines"]) delete x[k];
  if (priced) {
    x[kind === "mission" ? "total" : "quote-total"] = money(priced.total);
    if (kind === "mission") x.plan = [priced.summary, ...priced.lines.map(([n, p]) => `${n}: ${p < 0 ? "-" : ""}${money(Math.abs(p))}`), `Guide total ${money(priced.total)}`].join("\n");
    else x["quote-summary"] = priced.summary;
  } else if (kind === "mission") delete x.plan;
  // The job page link must be this site's own map page, or it's dropped
  if (x.map && !String(x.map).startsWith(`${SITE}/map/?`)) delete x.map;

  // Every field, with its readable label, in the order sent (max 40)
  const fields = Object.entries(x).filter(([k, v]) => !SKIP.has(k) && clean(v) !== "").slice(0, 40).map(([k, v]) => [LABELS[k] || clean(k, 60), clean(v)]);
  const svc = CATALOG.find((c) => c.id === (priced?.serviceId || x["service-id"] || x.mission));
  // The customer's confirmation only ever repeats words from our own price list,
  // never text they typed, so the form can't be used to send someone else a message.
  const summary = priced ? priced.summary : "";
  const price = priced ? priced.total : null;
  const lines = priced ? priced.lines : null;
  const postcode = tidyPostcode(x.postcode) || clean(x.postcode, 10).toUpperCase() || null;

  const ref = `Q-${randomHex(3).toUpperCase()}`, token = randomHex(16), t = now();
  await (await db(env)).prepare(`INSERT INTO enquiries (ref, token_hash, kind, name, email, phone, company, postcode, service_id, summary, price, fields, lines, status, created, updated)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', ?, ?)`)
    .bind(ref, await sha256(token), kind, name || null, email || null, phone || null, clean(x.company || x.agency, 120) || null, postcode, svc?.id || null, summary || null, price, JSON.stringify(fields), lines?.length ? JSON.stringify(lines) : null, t, t).run();

  const e = { ref, name, kindWord: KINDS[kind], summary, price, postcode };
  const link = `${SITE}/enquiry/?t=${token}`;
  if (email && kind !== "feedback") await sendMail(env, email, MAIL_ENQ.enquiry(e, link, svc ? `${SITE}/account/?book=${svc.id}` : ""), "enquiry");
  if (env.ADMIN_EMAIL) await sendMail(env, env.ADMIN_EMAIL, MAIL_ENQ.enquiryAdmin(e, fields, `${SITE}/admin/#enquiry-${ref}`), "admin", [], email || "");
  return json({ ok: true, ref });
}

async function view(request, env) {
  const tok = new URL(request.url).searchParams.get("t") || "";
  if (!/^[a-f0-9]{32}$/.test(tok)) return fail("missing", "That link isn't complete. Copy the whole link from your email.", 404);
  if (await limited(env, `enqv:${ipOf(request)}`, 60, 3600)) return fail("slow", "Too many tries. Try again later.", 429);
  const D = await db(env);
  const q = await D.prepare("SELECT * FROM enquiries WHERE token_hash = ?").bind(await sha256(tok)).first();
  if (!q) return fail("missing", "We couldn't find that request. It may have been deleted (requests that don't become a booking are kept for 12 months).", 404);
  const b = q.booking_ref ? await D.prepare("SELECT ref, status, signed_at FROM bookings WHERE ref = ?").bind(q.booking_ref).first() : null;
  return json({
    ref: q.ref, kind: KINDS[q.kind], created: q.created, status: q.status, statusText: PUBLIC_STATUS[q.status] || q.status,
    name: q.name, summary: q.summary, price: q.price, serviceId: q.service_id,
    fields: JSON.parse(q.fields).filter(([k]) => !HIDE_FROM_CUSTOMER.has(k)),
    booking: b ? { ref: b.ref, toSign: b.status === "awaiting_signature" } : null,
  }, 200, { "cache-control": "no-store", "x-robots-tag": "noindex" });
}
