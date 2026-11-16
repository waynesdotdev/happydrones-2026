/* Shared helpers for the tests. Each suite runs against a fresh local copy of
   the site (see run.mjs), in test mode, with admin@example.com as the admin. */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

export const B = `http://localhost:${process.env.TEST_PORT || 8799}`;
export const ADMIN = "admin@example.com";
export const PW = "blue sky over teesside";
export const jar = () => ({ c: "" });
// A date n days ahead, moved on past the days nobody can book (25, 26 Dec and 1 Jan)
export const plus = (n) => { let d = new Date(Date.now() + n * 864e5); while (n >= 0 && ["12-25", "12-26", "01-01"].includes(d.toISOString().slice(5, 10))) d = new Date(d.getTime() + 864e5); return d.toISOString().slice(0, 10); };
export const now = () => Math.floor(Date.now() / 1000);

let pass = 0, failed = 0;
export function ok(cond, label, extra = "") {
  if (cond) { pass++; console.log("  ✓", label); } else { failed++; console.log("  ✗", label, extra === "" ? "" : `→ ${typeof extra === "string" ? extra : JSON.stringify(extra)}`.slice(0, 400)); }
}
export const section = (name) => console.log(`\n${name}`);
export function done() { console.log(`\n${pass} passed, ${failed} failed`); process.exit(failed ? 1 : 0); }

export async function call(j, p, data, { method, headers = {} } = {}) {
  const r = await fetch(B + p, { method: method || (data ? "POST" : "GET"), headers: { ...(data ? { "content-type": "application/json" } : {}), origin: B, cookie: j?.c || "", ...headers }, body: data ? JSON.stringify(data) : undefined });
  const sc = r.headers.get("set-cookie"); if (sc && j) j.c = sc.split(";")[0].endsWith("=") ? "" : sc.split(";")[0];
  let body; const t = await r.text(); try { body = JSON.parse(t); } catch { body = t; }
  return { s: r.status, b: body, h: r.headers, setCookie: sc || "" };
}

/* Straight into the local test database, for things only time can do (ageing records) */
export function sql(q, ...params) {
  const dir = path.resolve(import.meta.dirname, "../.wrangler/state/v3/d1/miniflare-D1DatabaseObject");
  const file = path.join(dir, fs.readdirSync(dir).find((f) => f.endsWith(".sqlite")));
  const d = new DatabaseSync(file);
  try { const st = d.prepare(q); return /^\s*select/i.test(q) ? st.all(...params) : st.run(...params); } finally { d.close(); }
}

/* Create an account and sign in (test addresses see their code on screen) */
export async function signUp(name, email, extra = {}) {
  const j = jar();
  const r = await call(j, "/api/acct/register", { name, email, password: PW, privacy: true, ...extra });
  await call(j, "/api/acct/verify", { email, code: r.b.devCode });
  return j;
}
export async function signIn(email, password = PW) {
  const j = jar();
  const r = await call(j, "/api/acct/login", { email, password });
  await call(j, "/api/acct/login-code", { email, code: r.b.devCode });
  return j;
}
export const admin = () => signUp("Wayne Fox", ADMIN);

/* Book, sign and pay what's due now. Returns the booking as the customer sees it. */
export async function bookSignPay(j, name, body, { pay = true, earlyStart = false } = {}) {
  let r = await call(j, "/api/acct/book", { owner: "own", ...body });
  if (!r.b.booking) throw new Error(`book failed: ${JSON.stringify(r.b)}`);
  const ref = r.b.booking.ref;
  r = await call(j, `/api/acct/booking/${ref}/sign`, { name, agree: true, earlyStart });
  if (pay && r.b.booking?.owed > 0) r = await call(j, `/api/acct/booking/${ref}/pay`, {});
  return r.b.booking;
}
export const outbox = async (a) => (await call(a, "/api/admin/outbox")).b.outbox;

export function stripeEvent(id, session, secret = "whsec_test123") {
  const payload = JSON.stringify({ id, type: "checkout.session.completed", data: { object: session } });
  const t = now(), sig = crypto.createHmac("sha256", secret).update(`${t}.${payload}`).digest("hex");
  return fetch(`${B}/api/stripe-webhook`, { method: "POST", headers: { "stripe-signature": `t=${t},v1=${sig}`, "content-type": "application/json" }, body: payload });
}
