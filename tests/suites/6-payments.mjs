/* Stripe's messages: only genuine ones count, and each payment counts once */
import { call, ok, section, done, signUp, admin, plus, now, stripeEvent, B } from "../helpers.mjs";
import crypto from "node:crypto";

const A = await admin();
const L = await signUp("Lynn Fox", "lynn.fox@example.com");
let r = await call(L, "/api/acct/book", { service: "roofs", postcode: "TS17 6AB", date: plus(5), bookingAs: "consumer" }); const b = r.b.booking;
await call(L, `/api/acct/booking/${b.ref}/sign`, { name: "Lynn Fox", agree: true });
const session = { id: "cs_test_1", payment_status: "paid", amount_total: 3400, metadata: { ref: b.ref } };

section("Only Stripe can say a payment happened");
let raw = await stripeEvent("evt_bad", session, "whsec_wrong"); ok(raw.status === 400, "a message signed with the wrong secret is refused");
const payload = JSON.stringify({ id: "evt_old", type: "checkout.session.completed", data: { object: session } }), t = now() - 3600;
raw = await fetch(`${B}/api/stripe-webhook`, { method: "POST", headers: { "stripe-signature": `t=${t},v1=${crypto.createHmac("sha256", "whsec_test123").update(`${t}.${payload}`).digest("hex")}` }, body: payload }); ok(raw.status === 400, "an old replayed message is refused");
raw = await fetch(`${B}/api/stripe-webhook`, { method: "POST", body: payload }); ok(raw.status === 400, "a message with no signature is refused");
r = await call(L, `/api/acct/booking/${b.ref}`); ok(r.b.booking.paid === 0, "none of those changed the booking");

section("Each payment counts once");
raw = await stripeEvent("evt_1", session); ok(raw.status === 200, "a genuine message is accepted");
await stripeEvent("evt_1", session); await stripeEvent("evt_2", session);
r = await call(L, `/api/acct/booking/${b.ref}/check`, {}); ok(r.b.booking.paid === 34 && r.b.paid === true, "three messages about one payment: £34 counted once", r.b.booking?.paid);
raw = await stripeEvent("evt_3", { id: "cs_test_2", payment_status: "unpaid", amount_total: 9900, metadata: { ref: b.ref } });
r = await call(L, `/api/acct/booking/${b.ref}`); ok(r.b.booking.paid === 34, "an unpaid checkout doesn't count");
r = await call(A, `/api/admin/booking/${b.ref}`); ok(r.b.history.filter((h) => h.action === "payment").length === 1, "one payment in the booking's history");
done();
