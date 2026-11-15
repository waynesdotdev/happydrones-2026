/* POST /api/stripe-webhook : Stripe tells the site a payment went through.
   Every message is checked against STRIPE_WEBHOOK_SECRET, so fake
   messages are ignored. Each event is only ever counted once.
   In Stripe: Developers → Webhooks → add https://happydrones.co.uk/api/stripe-webhook
   with the event "checkout.session.completed". */
import { json, now, db, stripeVerify, settleSession } from "../../lib/acct/server.js";

export async function onRequestPost({ request, env }) {
  if (!env.STRIPE_WEBHOOK_SECRET || !env.DB) return json({ error: "not set up" }, 503);
  const payload = await request.text();
  if (!(await stripeVerify(env, payload, request.headers.get("stripe-signature")))) return json({ error: "bad signature" }, 400);
  const evt = JSON.parse(payload);
  const D = await db(env);
  const seen = await D.prepare("SELECT k FROM limits WHERE k = ?").bind(`evt:${evt.id}`).first();
  if (seen) return json({ ok: true, repeat: true });
  await D.prepare("INSERT INTO limits (k, n, reset) VALUES (?, 1, ?)").bind(`evt:${evt.id}`, now() + 60 * 86400).run();
  if (evt.type === "checkout.session.completed") {
    const s = evt.data.object;
    await settleSession(env, s, "stripe");
  }
  return json({ ok: true });
}
