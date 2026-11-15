import { greeting, BUNDLE_DAYS, BUNDLE_WARN_DAYS, BUNDLE_EXTEND_DAYS } from "./catalog.js";
/* =========================================================
   ACCOUNTS AND BOOKINGS: server-side helpers (Cloudflare only)
   Used by functions/api/acct/ (customers), functions/api/admin/ (Wayne)
   and functions/api/stripe-webhook.js.

   Cloudflare settings (happydrones project → Settings):
     DB                 D1 database binding (database "happydrones-db")
     ADMIN_EMAIL        secret: the email that gets the admin role (Wayne)
     TEST_MODE          "1" while testing: sign-in codes are shown on screen
                        and payments can be simulated. Remove before launch.
   Added later:
     STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET   Stripe (test keys first)
     RESEND_KEY, MAIL_FROM                      sending real emails
     PW_ITER            password hashing strength (default 10000; raise to
                        100000 on the Workers Paid plan)
   Until RESEND_KEY is set, every email goes to the outbox in the admin
   page instead of being sent.
   ========================================================= */

/* ---------------- responses ---------------- */
export function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", "x-robots-tag": "noindex, nofollow", ...headers } });
}
export const fail = (error, message, status = 400) => json({ error, message }, status);
export const now = () => Math.floor(Date.now() / 1000);
export const ipOf = (req) => req.headers.get("cf-connecting-ip") || "local";
export const testMode = (env) => /^(1|true|yes|on)$/i.test(String(env.TEST_MODE || "").trim());

/* Only accept POSTs from the site itself, as JSON (stops cross-site form posts) */
export function sameSite(request) {
  if (request.method === "GET") return true;
  const o = request.headers.get("origin");
  const host = new URL(request.url).host;
  if (o && new URL(o).host !== host) return false;
  return (request.headers.get("content-type") || "").includes("application/json");
}
export async function body(request) { try { return await request.json(); } catch { return {}; } }

/* ---------------- database ---------------- */
const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, email TEXT UNIQUE NOT NULL, name TEXT NOT NULL, phone TEXT, company TEXT,
     role TEXT NOT NULL DEFAULT 'customer', pw TEXT, verified INTEGER NOT NULL DEFAULT 0, marketing INTEGER NOT NULL DEFAULT 0,
     fails INTEGER NOT NULL DEFAULT 0, locked_until INTEGER NOT NULL DEFAULT 0, created INTEGER NOT NULL, last_login INTEGER, test INTEGER NOT NULL DEFAULT 0)`,
  `CREATE TABLE IF NOT EXISTS codes (id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL, purpose TEXT NOT NULL, hash TEXT NOT NULL,
     expires INTEGER NOT NULL, tries INTEGER NOT NULL DEFAULT 0, used INTEGER NOT NULL DEFAULT 0)`,
  `CREATE TABLE IF NOT EXISTS sessions (hash TEXT PRIMARY KEY, user_id INTEGER NOT NULL, created INTEGER NOT NULL, expires INTEGER NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS bookings (id INTEGER PRIMARY KEY, ref TEXT UNIQUE NOT NULL, user_id INTEGER, service_id TEXT NOT NULL, service TEXT NOT NULL,
     postcode TEXT NOT NULL, address TEXT, wanted_date TEXT, wanted_time TEXT, confirmed_date TEXT, confirmed_time TEXT, notes TEXT,
     booking_as TEXT, early_start INTEGER NOT NULL DEFAULT 0, agreement TEXT, agreed_at INTEGER,
     base INTEGER NOT NULL, travel INTEGER NOT NULL, total INTEGER NOT NULL, mode TEXT NOT NULL, due_now INTEGER NOT NULL, paid INTEGER NOT NULL DEFAULT 0,
     status TEXT NOT NULL, files TEXT, bundle_id INTEGER, stripe_session TEXT, admin_note TEXT, created INTEGER NOT NULL, updated INTEGER NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS bundles (id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL, booking_id INTEGER NOT NULL, size INTEGER NOT NULL,
     used INTEGER NOT NULL DEFAULT 0, active INTEGER NOT NULL DEFAULT 0, expires INTEGER, created INTEGER NOT NULL,
     warned INTEGER NOT NULL DEFAULT 0, extended INTEGER NOT NULL DEFAULT 0, closed INTEGER NOT NULL DEFAULT 0, refund INTEGER NOT NULL DEFAULT 0)`,
  `CREATE TABLE IF NOT EXISTS signatures (id INTEGER PRIMARY KEY, booking_id INTEGER NOT NULL, user_id INTEGER, kind TEXT NOT NULL, name TEXT NOT NULL, email TEXT,
     at INTEGER NOT NULL, ip TEXT, ua TEXT, version TEXT NOT NULL, terms_hash TEXT NOT NULL, job TEXT NOT NULL, early INTEGER NOT NULL DEFAULT 0, fingerprint TEXT NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS agreement_texts (hash TEXT PRIMARY KEY, version TEXT NOT NULL, terms TEXT NOT NULL, cancel TEXT NOT NULL, created INTEGER NOT NULL)`,
  `CREATE INDEX IF NOT EXISTS signatures_booking ON signatures(booking_id)`,
  `CREATE TABLE IF NOT EXISTS enquiries (id INTEGER PRIMARY KEY, ref TEXT UNIQUE NOT NULL, token_hash TEXT UNIQUE NOT NULL, kind TEXT NOT NULL,
     name TEXT, email TEXT, phone TEXT, company TEXT, postcode TEXT, service_id TEXT, summary TEXT, price INTEGER, fields TEXT NOT NULL,
     status TEXT NOT NULL DEFAULT 'new', note TEXT, booking_ref TEXT, created INTEGER NOT NULL, updated INTEGER NOT NULL)`,
  `CREATE INDEX IF NOT EXISTS enquiries_status ON enquiries(status)`,
  `CREATE TABLE IF NOT EXISTS outbox (id INTEGER PRIMARY KEY, to_addr TEXT NOT NULL, subject TEXT NOT NULL, body TEXT NOT NULL, kind TEXT, sent INTEGER NOT NULL DEFAULT 0, created INTEGER NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS audit (id INTEGER PRIMARY KEY, at INTEGER NOT NULL, actor TEXT NOT NULL, action TEXT NOT NULL, target TEXT, detail TEXT)`,
  `CREATE TABLE IF NOT EXISTS limits (k TEXT PRIMARY KEY, n INTEGER NOT NULL, reset INTEGER NOT NULL)`,
  `CREATE INDEX IF NOT EXISTS bookings_user ON bookings(user_id)`,
  `CREATE INDEX IF NOT EXISTS codes_user ON codes(user_id)`,
];
const MIGRATIONS = [
  ...["warned", "extended", "closed", "refund"].map((c) => `ALTER TABLE bundles ADD COLUMN ${c} INTEGER NOT NULL DEFAULT 0`),
  // e-signing, changes and refunds (15 Nov 2026)
  ...["deliverables", "delivery", "licence", "branding", "extras", "pending"].map((c) => `ALTER TABLE bookings ADD COLUMN ${c} TEXT`),
  ...["signed_at", "signature_id", "pending_at", "go_at"].map((c) => `ALTER TABLE bookings ADD COLUMN ${c} INTEGER`),
  "ALTER TABLE bookings ADD COLUMN refunded INTEGER NOT NULL DEFAULT 0",
  // bookings Wayne makes from an enquiry, waiting for the customer to sign in
  "ALTER TABLE bookings ADD COLUMN invite_email TEXT",
];
let ready = false;
export async function db(env) {
  if (!env.DB) throw Object.assign(new Error("no-db"), { status: 503 });
  if (!ready) {
    await env.DB.batch(SCHEMA.map((s) => env.DB.prepare(s)));
    // Columns added after the first version: add them to older databases
    for (const c of MIGRATIONS) { try { await env.DB.prepare(c).run(); } catch { /* already there */ } }
    ready = true;
  }
  return env.DB;
}

/* Delete what we no longer need (runs now and then, on sign-in and in the admin) */
export async function tidy(env) {
  const D = await db(env), t = now();
  await D.batch([
    D.prepare("DELETE FROM codes WHERE expires < ? OR used = 1").bind(t - 86400),
    D.prepare("DELETE FROM sessions WHERE expires < ?").bind(t),
    D.prepare("DELETE FROM limits WHERE reset < ?").bind(t),
    D.prepare("DELETE FROM outbox WHERE created < ?").bind(t - 30 * 86400),                // emails kept 30 days
    D.prepare("DELETE FROM users WHERE verified = 0 AND created < ?").bind(t - 7 * 86400), // unfinished sign-ups, 7 days
    D.prepare("DELETE FROM audit WHERE at < ?").bind(t - 2 * 365 * 86400),                 // activity log, 2 years
    D.prepare("DELETE FROM signatures WHERE at < ?").bind(t - 7 * 365 * 86400),
    D.prepare("DELETE FROM enquiries WHERE status != 'won' AND updated < ?").bind(t - 365 * 86400), // enquiries that didn't become a booking, 12 months           // signed agreements, 6 years after the job (7 from signing)
  ]);
  // Bookings never signed within 7 days are cancelled, and any bundle listing goes back
  const { results: stale } = await D.prepare("SELECT id, bundle_id FROM bookings WHERE status = 'awaiting_signature' AND created < ?").bind(t - 7 * 86400).all();
  for (const x of stale) {
    await D.prepare("UPDATE bookings SET status = 'cancelled', updated = ? WHERE id = ?").bind(t, x.id).run();
    if (x.bundle_id) await D.prepare("UPDATE bundles SET used = MAX(0, used - 1) WHERE id = ?").bind(x.bundle_id).run();
  }
}

/* Bundle reminders and endings (booking agreement 3.10). Runs at most once
   an hour, whenever the admin or a customer's account page is opened. */
export async function bundleJobs(env) {
  const D = await db(env), t = now();
  const lock = await D.prepare("SELECT reset FROM limits WHERE k = 'job:bundles'").first();
  if (lock && lock.reset > t) return;
  await D.prepare("INSERT INTO limits (k, n, reset) VALUES ('job:bundles', 1, ?) ON CONFLICT(k) DO UPDATE SET reset = excluded.reset").bind(t + 3600).run();
  const day = (s) => new Date(s * 1000).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "long", year: "numeric", timeZone: "Europe/London" });
  const q = `SELECT x.*, k.booking_as, k.total price, u.email, u.name, u.test FROM bundles x JOIN bookings k ON k.id = x.booking_id JOIN users u ON u.id = x.user_id
    WHERE x.active = 1 AND x.closed = 0`;
  const { results: soon } = await D.prepare(`${q} AND x.warned = 0 AND x.used < x.size AND x.expires > ? AND x.expires <= ?`).bind(t, t + BUNDLE_WARN_DAYS * 86400).all();
  for (const x of soon) {
    await D.prepare("UPDATE bundles SET warned = 1 WHERE id = ?").bind(x.id).run();
    await sendMail(env, x.email, MAIL.bundleWarn(x, x, x.size - x.used, day(x.expires), !x.extended), "bundle");
    await log(env, "system", "bundle-reminder", `bundle ${x.id}`);
  }
  const { results: ended } = await D.prepare(`${q} AND x.expires <= ?`).bind(t).all();
  for (const x of ended) {
    const left = Math.max(0, x.size - x.used);
    const refund = x.booking_as === "consumer" && left ? Math.round((x.price * left) / x.size) : 0;
    await D.prepare("UPDATE bundles SET closed = 1, refund = ? WHERE id = ?").bind(refund, x.id).run();
    await sendMail(env, x.email, MAIL.bundleEnded(x, x, left, refund), "bundle");
    await log(env, "system", "bundle-ended", `bundle ${x.id}`, refund ? `refund due £${refund}` : `${left} unused, expired`);
    if (refund && env.ADMIN_EMAIL) await sendMail(env, env.ADMIN_EMAIL, [`Refund due: £${refund} to ${x.name}`, `${x.name} (${x.email}) booked as a private customer and their bundle ended with ${left} of ${x.size} listings unused.\n\nUnder 3.10 they're owed £${refund}. Refund it within 14 days from the original payment in the Stripe dashboard (Payments → the bundle payment → Refund).\n\n${SITE}/admin/`], "admin");
  }
}

export async function extendBundle(env, x, actor) {
  const D = await db(env);
  const expires = x.expires + BUNDLE_EXTEND_DAYS * 86400;
  await D.prepare("UPDATE bundles SET expires = ?, extended = 1, warned = 0 WHERE id = ?").bind(expires, x.id).run();
  await log(env, actor, "bundle-extended", `bundle ${x.id}`);
  const u = await D.prepare("SELECT * FROM users WHERE id = ?").bind(x.user_id).first();
  const ends = new Date(expires * 1000).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "long", year: "numeric", timeZone: "Europe/London" });
  if (u) await sendMail(env, u.email, MAIL.bundleExtended(u, ends), "bundle");
  return expires;
}

export async function log(env, actor, action, target = "", detail = "") {
  const D = await db(env);
  await D.prepare("INSERT INTO audit (at, actor, action, target, detail) VALUES (?, ?, ?, ?, ?)").bind(now(), actor, action, String(target), String(detail).slice(0, 500)).run();
}

/* Simple counters: no more than max attempts per window (seconds) */
export async function limited(env, key, max, windowSec) {
  const D = await db(env), t = now();
  const row = await D.prepare("SELECT n, reset FROM limits WHERE k = ?").bind(key).first();
  if (!row || row.reset < t) { await D.prepare("INSERT OR REPLACE INTO limits (k, n, reset) VALUES (?, 1, ?)").bind(key, t + windowSec).run(); return false; }
  if (row.n >= max) return true;
  await D.prepare("UPDATE limits SET n = n + 1 WHERE k = ?").bind(key).run();
  return false;
}

/* ---------------- crypto ---------------- */
const enc = new TextEncoder();
const hex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
export const randomHex = (n = 32) => hex(crypto.getRandomValues(new Uint8Array(n)));
export async function sha256(s) { return hex(await crypto.subtle.digest("SHA-256", enc.encode(s))); }
export function sixDigits() { const n = crypto.getRandomValues(new Uint32Array(1))[0] % 1000000; return String(n).padStart(6, "0"); }
function safeEqual(a, b) { if (a.length !== b.length) return false; let d = 0; for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i); return d === 0; }

export async function hashPassword(pw, env, salt = randomHex(16), iter = Number(env.PW_ITER) || 10000) {
  const key = await crypto.subtle.importKey("raw", enc.encode(pw), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: enc.encode(salt), iterations: iter }, key, 256);
  return `pbkdf2$${iter}$${salt}$${hex(bits)}`;
}
export async function checkPassword(pw, stored, env) {
  if (!stored) return false;
  const [, iter, salt, h] = stored.split("$");
  const again = await hashPassword(pw, env, salt, Number(iter));
  return safeEqual(again.split("$")[3], h);
}
export function passwordProblem(pw) {
  if (typeof pw !== "string" || pw.length < 10) return "Use at least 10 characters.";
  if (pw.length > 200) return "That's too long.";
  if (/^(.)\1+$/.test(pw) || /^(password|1234567890|qwertyuiop)/i.test(pw)) return "That password is too easy to guess.";
  return null;
}

/* ---------------- one-time codes (emailed) ---------------- */
export async function newCode(env, userId, purpose) {
  const D = await db(env), code = sixDigits();
  await D.prepare("UPDATE codes SET used = 1 WHERE user_id = ? AND purpose = ?").bind(userId, purpose).run();
  await D.prepare("INSERT INTO codes (user_id, purpose, hash, expires) VALUES (?, ?, ?, ?)").bind(userId, purpose, await sha256(`${userId}:${purpose}:${code}`), now() + 10 * 60).run();
  return code;
}
export async function useCode(env, userId, purpose, code) {
  const D = await db(env);
  const row = await D.prepare("SELECT * FROM codes WHERE user_id = ? AND purpose = ? AND used = 0 ORDER BY id DESC LIMIT 1").bind(userId, purpose).first();
  if (!row || row.expires < now()) return "expired";
  if (row.tries >= 5) { await D.prepare("UPDATE codes SET used = 1 WHERE id = ?").bind(row.id).run(); return "expired"; }
  const ok = safeEqual(await sha256(`${userId}:${purpose}:${String(code || "").trim()}`), row.hash);
  if (!ok) { await D.prepare("UPDATE codes SET tries = tries + 1 WHERE id = ?").bind(row.id).run(); return "wrong"; }
  await D.prepare("UPDATE codes SET used = 1 WHERE id = ?").bind(row.id).run();
  return "ok";
}

/* ---------------- sessions ---------------- */
const COOKIE = "hds";
export async function startSession(env, user) {
  const D = await db(env), token = randomHex(32), hours = user.role === "admin" ? 8 : 12;
  await D.prepare("INSERT INTO sessions (hash, user_id, created, expires) VALUES (?, ?, ?, ?)").bind(await sha256(token), user.id, now(), now() + hours * 3600).run();
  await D.prepare("UPDATE users SET last_login = ?, fails = 0 WHERE id = ?").bind(now(), user.id).run();
  return `${COOKIE}=${token}; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=${hours * 3600}`;
}
export const endCookie = `${COOKIE}=; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
function tokenOf(request) {
  const m = (request.headers.get("cookie") || "").match(new RegExp(`(?:^|;\\s*)${COOKIE}=([a-f0-9]{64})`));
  return m ? m[1] : null;
}
export async function currentUser(env, request) {
  const t = tokenOf(request); if (!t) return null;
  const D = await db(env);
  return D.prepare("SELECT u.* FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.hash = ? AND s.expires > ?").bind(await sha256(t), now()).first();
}
export async function endSession(env, request) {
  const t = tokenOf(request); if (!t) return;
  await (await db(env)).prepare("DELETE FROM sessions WHERE hash = ?").bind(await sha256(t)).run();
}
export const publicUser = (u) => u && ({ id: u.id, email: u.email, name: u.name, phone: u.phone || "", company: u.company || "", role: u.role, marketing: !!u.marketing, test: !!u.test });

/* ---------------- email ---------------- */
const SITE = "https://happydrones.co.uk";
const sign = "\n\nWayne Fox\nHappy Drones · 07888 625623 · happydrones.co.uk";
export const MAIL = {
  verify: (u, code) => [`Your Happy Drones code: ${code}`, `${greeting(u.name)},\n\nYour code to finish setting up your account is ${code}. It works for 10 minutes.\n\nIf you didn't ask for this, you can ignore this email.${sign}`],
  login: (u, code) => [`Your Happy Drones sign-in code: ${code}`, `${greeting(u.name)},\n\nYour sign-in code is ${code}. It works for 10 minutes.\n\nIf you didn't try to sign in, change your password: someone may know it.${sign}`],
  reset: (u, code) => [`Reset your Happy Drones password: ${code}`, `${greeting(u.name)},\n\nYour code to set a new password is ${code}. It works for 10 minutes.\n\nIf you didn't ask for this, you can ignore this email.${sign}`],
  started: (u, b) => [`Nearly done: sign your booking agreement (${b.ref})`, `${greeting(u.name)},\n\nThanks for booking a ${b.service.toLowerCase()} at ${b.postcode}. One step left: read and sign your booking agreement, then ${b.due_now > 0 ? "pay the deposit to secure your date" : "I'll be in touch to confirm your date"}.\n\nSign it here: ${SITE}/account/#sign-${b.ref}\n\nUnsigned bookings are cancelled after 7 days.${sign}`],
  signed: (u, b, sig) => [`Your signed booking agreement (${b.ref})`, `${greeting(u.name)},\n\nThanks for signing. Your booking agreement for ${b.service.toLowerCase()} at ${b.postcode} is attached: please keep it for your records. You can also see it any time in your account.\n\nSigned by ${sig.name} on ${sig.when} (UK time). Agreement version ${sig.version}.\nFingerprint: ${sig.fingerprint}\n\n${b.due_now > b.paid ? `Next: pay the ${b.mode === "deposit" ? "deposit" : "payment"} of £${b.due_now - b.paid} to secure your date: ${SITE}/account/` : "Next: I'll check the airspace and the weather and confirm your date, usually within a day."}${b.booking_as === "consumer" ? `\n\nAs a private customer you can cancel within 14 days of booking (section 7 of the agreement). A cancellation form is at the end of the attached agreement.` : ""}${sign}`],
  changes: (u, b, list) => [`Please approve the changes to your booking (${b.ref})`, `${greeting(u.name)},\n\nAs we discussed, I've updated your booking for ${b.postcode}:\n\n${list.map((c) => `- ${c.label}: ${c.from || "–"} → ${c.to || "–"}`).join("\n")}\n\nThese change your booking agreement, so they only take effect once you approve them. Review and sign here: ${SITE}/account/#sign-${b.ref}\n\nIf anything looks wrong, just reply to this email.${sign}`],
  approved: (u, b) => [`Changes approved: ${b.ref}`, `${u.name} (${u.email}) approved and signed the changes to ${b.ref} (${b.service}, ${b.postcode}).\n\n${SITE}/admin/`],
  declined: (u, b) => [`Changes declined: ${b.ref}`, `${u.name} (${u.email}) declined the changes to ${b.ref} (${b.service}, ${b.postcode}). The booking stays as it was. Give them a call.\n\n${SITE}/admin/`],
  refund: (u, b, amount) => [`Refund of £${amount} (${b.ref})`, `${greeting(u.name)},\n\nI've refunded £${amount} for your ${b.service.toLowerCase()} at ${b.postcode}. It goes back to the way you paid and usually shows within 5–10 working days.${sign}`],
  enquiry: (e, link, bookLink) => [`We've got your ${e.kindWord} (${e.ref})`, `${greeting(e.name)},\n\nThanks for getting in touch. This is to confirm I've received your ${e.kindWord}${e.summary ? `:\n\n${e.summary}` : "."}${e.price ? `\n\nGuide price: £${e.price}. I'll confirm a fixed price after checking the site and the airspace.` : ""}\n\nYour reference: ${e.ref}\nSee what you sent and where it's up to: ${link}\n\nI'll reply within a day.${bookLink ? `\n\nHappy with the guide price? You can book it online now: ${bookLink}` : ""}${sign}`],
  enquiryAdmin: (e, fields, link) => [`New ${e.kindWord}: ${e.name || "no name"}${e.postcode ? `, ${e.postcode}` : ""}${e.price ? `, £${e.price}` : ""} (${e.ref})`, `${fields.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nOpen it in the admin: ${link}\n\nReplying to this email goes to the customer.`],
  invite: (name, b, hasAccount) => [`Your booking is ready to sign: ${b.service} (${b.ref})`, `${greeting(name)},\n\nAs we discussed, I've set up your booking for ${b.service.toLowerCase()} at ${b.postcode}: £${b.total}${b.mode === "deposit" ? `, with a ${Math.round((b.due_now / b.total) * 100)}% deposit of £${b.due_now}` : b.mode === "invoice" ? ", invoiced after the visit" : ""}.\n\nTo confirm it, ${hasAccount ? "sign in" : `create a free account with this email address (${b.invite_email || "the one this was sent to"})`}, read and sign the booking agreement${b.due_now ? ", then pay the deposit" : ""}:\n${SITE}/account/#sign-${b.ref}\n\nThe booking is held for 7 days. Any questions, just reply to this email.${sign}`],
  booked: (u, b) => [`Booking received: ${b.service}, ${b.postcode} (${b.ref})`, `${greeting(u.name)},\n\nThanks for booking a ${b.service.toLowerCase()} at ${b.postcode}${b.wanted_date ? ` for ${b.wanted_date}` : ""}. I'll check the airspace and the weather and confirm your date within a day.\n\nPrice: £${b.total}. ${b.mode === "deposit" ? `Deposit: £${b.due_now}.` : b.mode === "invoice" ? "You'll be invoiced after the visit." : ""}\n\nYour booking agreement (version ${b.agreement}): ${SITE}/terms/\nYour bookings: ${SITE}/account/${b.booking_as === "consumer" ? `\n\nAs a private customer you can cancel within 14 days of booking for a full refund, unless the work has been done at your request (section 7 of the agreement).` : ""}${sign}`],
  paid: (u, b, amount) => [`Payment received: £${amount} (${b.ref})`, `${greeting(u.name)},\n\nThanks, your payment of £${amount} for ${b.service.toLowerCase()} at ${b.postcode} has been received.${sign}`],
  confirmed: (u, b, again) => [`${again ? "New date" : "It's a go"}: ${b.confirmed_date}${b.confirmed_time ? `, ${b.confirmed_time}` : ""} (${b.ref})`, `${greeting(u.name)},\n\n${again ? "Your booking has a new date, as we agreed" : "Your booking is confirmed: it's a go"}. I'll be at ${[b.address, b.postcode].filter(Boolean).join(", ")} on ${b.confirmed_date}${b.confirmed_time ? ` at about ${b.confirmed_time}` : ""} for your ${b.service.toLowerCase()}.\n\nBefore I arrive: please make sure I can get access, cars are moved if you want them out of shot, and pets are inside (section 5 of your agreement).\n\nIf the weather turns, I'll move it to the next good day at no cost. Your booking: ${SITE}/account/${sign}`],
  delivered: (u, b, balance) => [balance ? `Your photos are ready to unlock (${b.ref})` : `Your files are ready (${b.ref})`, `${greeting(u.name)},\n\n${balance ? `Your ${b.service.toLowerCase()} is done. Pay the balance of £${balance} and the full files unlock straight away: ${SITE}/account/` : `Your files for ${b.service.toLowerCase()} at ${b.postcode} are ready: ${SITE}/account/`}${sign}`],
  cancelled: (u, b) => [`Booking cancelled (${b.ref})`, `${greeting(u.name)},\n\nYour booking for ${b.service.toLowerCase()} at ${b.postcode} has been cancelled. Any refund due under the booking agreement will be made to your original payment method.${sign}`],
  deleted: (u) => [`Your Happy Drones account has been deleted`, `${greeting(u.name)},\n\nYour account and personal details have been deleted, as you asked. Payment records are kept by Stripe for as long as tax law requires.${sign}`],
  bundleWarn: (u, x, left, ends, canExtend) => [`Your bundle ends on ${ends}: ${left} listing${left === 1 ? "" : "s"} left`, `${greeting(u.name)},\n\nA reminder that your ${x.size}-listing bundle ends on ${ends}, and you have ${left} listing${left === 1 ? "" : "s"} left to book.\n\n${canExtend ? `If you need more time, you can extend it once by 1 month, free: sign in and press "Extend by 1 month" on My bookings: ${SITE}/account/\n\n` : ""}${x.booking_as === "consumer" ? "If any are still unused when it ends, I'll refund them at the bundle price (section 3.10 of the booking agreement)." : "Listings not booked by the end date expire (section 3.10 of the booking agreement)."}${sign}`],
  bundleExtended: (u, ends) => [`Your bundle now ends on ${ends}`, `${greeting(u.name)},\n\nDone: your bundle has been extended by 1 month and now ends on ${ends}. This is the one extension available under section 3.10 of the booking agreement.${sign}`],
  bundleEnded: (u, x, left, refund) => [`Your bundle has ended`, `${greeting(u.name)},\n\nYour ${x.size}-listing bundle has now ended${left ? ` with ${left} listing${left === 1 ? "" : "s"} unused` : ""}.${refund ? ` As agreed in section 3.10, I'll refund £${refund} for the unused listings to your original payment method within 14 days.` : left ? " Under section 3.10 of the booking agreement, unused listings have expired." : " Thanks for using it."}${sign}`],
  adminNew: (u, b) => [`New booking ${b.ref}: ${b.service}, ${b.postcode}`, `${u.name} (${u.email}) booked ${b.service} at ${b.postcode}. Wanted: ${b.wanted_date || "any date"} ${b.wanted_time || ""}. Total £${b.total}, ${b.mode}.\n\n${SITE}/admin/`],
};
export async function sendMail(env, to, [subject, text], kind = "", attachments = [], replyTo = "") {
  const D = await db(env);
  let sent = 0;
  if (env.RESEND_KEY && env.MAIL_FROM && !/@example\.(com|org|net)$/i.test(to)) {
    try {
      const r = await fetch("https://api.resend.com/emails", { method: "POST", headers: { authorization: `Bearer ${env.RESEND_KEY}`, "content-type": "application/json" }, body: JSON.stringify({ from: env.MAIL_FROM, to: [to], subject, text, ...(attachments.length ? { attachments } : {}), ...(replyTo || env.MAIL_REPLY_TO || env.ADMIN_EMAIL ? { reply_to: replyTo || env.MAIL_REPLY_TO || env.ADMIN_EMAIL } : {}) }) });
      sent = r.ok ? 1 : 0;
    } catch { sent = 0; }
  }
  // Codes are never kept in the outbox, even in test mode
  const stored = (kind === "code" ? text.replace(/\b\d{6}\b/g, "••••••") : text) + (attachments.length ? `\n\n[Attached: ${attachments.map((a) => a.filename).join(", ")}]` : "");
  await D.prepare("INSERT INTO outbox (to_addr, subject, body, kind, sent, created) VALUES (?, ?, ?, ?, ?, ?)").bind(to, subject.replace(/\b\d{6}\b/g, "••••••"), stored, kind, sent, now()).run();
  return sent;
}

/* ---------------- Stripe ---------------- */
export async function stripeCheckout(env, b, user, amount, purpose, origin) {
  const p = new URLSearchParams({
    mode: "payment", "customer_email": user.email, "client_reference_id": b.ref,
    "success_url": `${origin}/account/#paid-${b.ref}`, "cancel_url": `${origin}/account/#booking-${b.ref}`,
    "line_items[0][quantity]": "1", "line_items[0][price_data][currency]": "gbp",
    "line_items[0][price_data][unit_amount]": String(amount * 100),
    "line_items[0][price_data][product_data][name]": `${b.service} (${b.ref}) – ${purpose}`,
    "metadata[ref]": b.ref, "metadata[purpose]": purpose, "metadata[amount]": String(amount),
    "invoice_creation[enabled]": "true",
  });
  const r = await fetch("https://api.stripe.com/v1/checkout/sessions", { method: "POST", headers: { authorization: `Bearer ${env.STRIPE_SECRET_KEY}`, "content-type": "application/x-www-form-urlencoded" }, body: p });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error?.message || "stripe");
  return j;
}
export async function stripeVerify(env, payload, header) {
  const parts = Object.fromEntries((header || "").split(",").map((x) => x.split("=")));
  if (!parts.t || !parts.v1) return false;
  if (Math.abs(now() - Number(parts.t)) > 300) return false;
  const key = await crypto.subtle.importKey("raw", enc.encode(env.STRIPE_WEBHOOK_SECRET || ""), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = hex(await crypto.subtle.sign("HMAC", key, enc.encode(`${parts.t}.${payload}`)));
  return safeEqual(sig, parts.v1);
}

/* ---------------- money moving (shared by Stripe, the simulator and Wayne's "mark paid") ---------------- */
export async function recordPayment(env, ref, amount, actor) {
  const D = await db(env);
  const b = await D.prepare("SELECT * FROM bookings WHERE ref = ?").bind(ref).first();
  if (!b) return null;
  const paid = Math.min(b.total, b.paid + amount);
  let status = b.status;
  if (b.status === "awaiting_payment") status = "requested";
  await D.prepare("UPDATE bookings SET paid = ?, status = ?, updated = ? WHERE id = ?").bind(paid, status, now(), b.id).run();
  if (b.service_id === "bundle" && paid >= b.total) {
    await D.prepare("UPDATE bundles SET active = 1, expires = ? WHERE booking_id = ?").bind(now() + BUNDLE_DAYS * 86400, b.id).run();
  }
  await log(env, actor, "payment", ref, `£${amount}`);
  const u = await D.prepare("SELECT * FROM users WHERE id = ?").bind(b.user_id).first();
  if (u) await sendMail(env, u.email, MAIL.paid(u, b, amount), "paid");
  return { ...b, paid, status };
}

/* A finished Stripe Checkout: count it once, whether the news comes from
   Stripe's webhook or from the customer landing back on the site. */
export async function settleSession(env, s, actor) {
  if (!s || s.payment_status !== "paid" || !s.metadata?.ref) return null;
  const D = await db(env);
  const ins = await D.prepare("INSERT OR IGNORE INTO limits (k, n, reset) VALUES (?, 1, ?)").bind(`cs:${s.id}`, now() + 400 * 86400).run();
  if (!ins.meta?.changes) return null; // already counted
  return recordPayment(env, s.metadata.ref, Math.round((s.amount_total || 0) / 100), actor);
}
export async function stripeSession(env, id) {
  const r = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(id)}`, { headers: { authorization: `Bearer ${env.STRIPE_SECRET_KEY}` } });
  return r.ok ? r.json() : null;
}

/* Right to erasure: the account goes; bookings keep only what tax records need */
export async function deleteUser(env, id) {
  const D = await db(env);
  await D.batch([
    D.prepare("DELETE FROM enquiries WHERE email = (SELECT email FROM users WHERE id = ?) AND status != 'won'").bind(id),
    D.prepare("UPDATE enquiries SET name = NULL, email = NULL, phone = NULL, company = NULL, fields = '[]', note = NULL WHERE email = (SELECT email FROM users WHERE id = ?)").bind(id),
    D.prepare("UPDATE bookings SET user_id = NULL, address = NULL, notes = NULL, files = NULL, admin_note = NULL WHERE user_id = ?").bind(id),
    D.prepare("DELETE FROM bundles WHERE user_id = ?").bind(id),
    D.prepare("DELETE FROM sessions WHERE user_id = ?").bind(id),
    D.prepare("DELETE FROM codes WHERE user_id = ?").bind(id),
    D.prepare("DELETE FROM users WHERE id = ?").bind(id),
  ]);
}
