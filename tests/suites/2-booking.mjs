/* A booking from start to finish: book, sign, pay, change, approve, It's a go, deliver, balance, refund */
import { call, ok, section, done, signUp, admin, outbox, plus, bookSignPay } from "../helpers.mjs";

const A = await admin();
const L = await signUp("Mrs Lynn Fox", "lynn.fox@example.com");
const O = await signUp("Olive Other", "olive@example.com");

section("Booking needs the basics");
let r = await call(L, "/api/acct/book", { service: "roofs", postcode: "TS17 6AB", bookingAs: "consumer" }); ok(r.s === 400 && /date/i.test(r.b.message), "no date, no booking");
r = await call(L, "/api/acct/book", { service: "roofs", postcode: "TS17 6AB", date: plus(1), bookingAs: "consumer" }); ok(r.s === 400, "date must be at least 2 days ahead");
r = await call(L, "/api/acct/book", { service: "roofs", postcode: "TS17", date: plus(5), bookingAs: "consumer" }); ok(r.s === 400, "needs a full postcode");
r = await call(L, "/api/acct/book", { service: "roofs", postcode: "TS17 6AB", date: plus(5) }); ok(r.s === 400, "must say private customer or business");
r = await call(L, "/api/acct/book", { service: "roofs", postcode: "EH1 1AA", date: plus(5), bookingAs: "consumer" }); ok(r.s === 400, "outside the travel zones can't be booked online");
r = await call(L, "/api/acct/book", { service: "roofs", postcode: "DH1 3LE", date: plus(5), bookingAs: "consumer", total: 1, price: 1 }); ok(r.b.booking?.total === 160 && r.b.booking.travel === 25, "price is set by the server (roof check £135 + £25 Durham travel), whatever the browser sends", r.b);

section("Sign, then pay");
r = await call(L, "/api/acct/book", { service: "roofs", postcode: "ts17 6ab", address: "2 Example Road", date: plus(5), time: "10:00", bookingAs: "consumer", notes: "Side gate code 1234" });
const b = r.b.booking; ok(b?.status === "awaiting_signature" && b.total === 135 && b.dueNow === 34 && !b.signed, "booked: £135, £34 deposit, waiting for a signature", b);
r = await call(L, `/api/acct/booking/${b.ref}/pay`, {}); ok(r.s === 400 && /sign/i.test(r.b.message), "can't pay before signing");
r = await call(O, `/api/acct/booking/${b.ref}`); ok(r.s === 404, "another customer can't see it");
r = await call(O, `/api/acct/booking/${b.ref}/sign`, { name: "Olive Other", agree: true }); ok(r.s === 404, "another customer can't sign it");
r = await call(L, `/api/acct/booking/${b.ref}/agreement`);
ok(r.b.toSign === "original" && r.b.terms.includes("1. Who we are") && r.b.cancel.includes("Cancellation form") && r.b.askEarly === true, "agreement shows the terms, the cancellation form, and asks about an early start");
ok(r.b.rows.find((x) => x[0] === "What you'll receive")[1].length > 20 && r.b.rows.find((x) => x[0] === "Licence (section 9)")[1] === "Personal", "Job Details are filled in for this service");
r = await call(L, `/api/acct/booking/${b.ref}/sign`, { name: "Lynn Fox" }); ok(r.s === 400, "must tick to agree");
r = await call(L, `/api/acct/booking/${b.ref}/sign`, { name: "Lyn Fx", agree: true }); ok(r.s === 400 && /Lynn Fox/.test(r.b.message), "the typed name must match the account");
r = await call(L, `/api/acct/booking/${b.ref}/sign`, { name: "lynn  fox", agree: true, earlyStart: true });
ok(r.b.booking?.signed && r.b.booking.status === "awaiting_payment" && r.b.fingerprint?.length === 64, "signed; now waiting for the deposit");
const sigId = r.b.signatureId;
r = await call(L, `/api/acct/booking/${b.ref}/sign`, { name: "Lynn Fox", agree: true }); ok(r.s === 400, "can't sign twice");
r = await call(L, `/api/acct/booking/${b.ref}/agreement/${sigId}`);
ok(typeof r.b === "string" && r.b.includes("Signed by lynn fox") && r.b.includes("Early start requested") && r.b.includes("Side gate code 1234") && /default-src 'none'/.test(r.h.get("content-security-policy")), "the signed copy opens, complete and locked down");
r = await call(O, `/api/acct/booking/${b.ref}/agreement/${sigId}`); ok(r.s === 404, "another customer can't open the signed copy");
let ob = await outbox(A);
ok(ob.some((e) => e.kind === "signed" && e.to_addr === "lynn.fox@example.com" && /Attached: Happy-Drones-Booking-Agreement/.test(e.body) && /^Hi Lynn,/.test(e.body)), "customer is emailed the signed copy as a file, greeted by first name");
ok(ob.some((e) => e.to_addr === "admin@example.com" && e.subject.startsWith("New booking")), "Wayne is told about the signed booking");
r = await call(L, `/api/acct/booking/${b.ref}/pay`, {}); ok(r.b.booking?.paid === 34 && r.b.booking.owed === 0, "deposit paid");

section("Wayne changes it after a call; the customer approves");
r = await call(A, `/api/admin/booking/${b.ref}`, { action: "edit", changes: { total: 160, extras: "Chimney close-ups", wanted_time: "morning" } }); ok(r.b.booking?.pending, "contract changes wait for approval");
r = await call(L, "/api/acct/bookings"); let card = r.b.bookings.find((x) => x.ref === b.ref);
ok(card.total === 135 && card.changes?.some((c) => c.label === "Price" && c.from === "£135" && c.to === "£160"), "the signed version stands; customer sees £135 → £160");
r = await call(L, `/api/acct/booking/${b.ref}/pay`, {}); ok(r.s === 400, "can't pay while changes are waiting");
r = await call(A, `/api/admin/booking/${b.ref}`, { action: "confirm", date: plus(6), time: "10:00" }); ok(r.s === 400, "can't confirm while changes are waiting");
r = await call(L, `/api/acct/booking/${b.ref}/sign`, { name: "Lynn Fox", agree: true }); ok(r.b.booking?.total === 160 && r.b.booking.owed === 6, "approved: £160, £6 more deposit");
r = await call(A, `/api/admin/booking/${b.ref}`, { action: "edit", changes: { licence: "Business" } });
r = await call(L, `/api/acct/booking/${b.ref}/decline`, {}); ok(r.b.booking && !r.b.booking.changes, "customer declines a change: booking unchanged");
r = await call(A, `/api/admin/booking/${b.ref}`); ok(r.b.signatures.length === 2 && r.b.booking.licence === "Personal" && r.b.booking.extras === "Chimney close-ups", "two signatures on record; declined change not applied");

section("It's a go");
r = await call(A, `/api/admin/booking/${b.ref}`, { action: "confirm", date: plus(7), time: "09:30" }); ok(r.s === 400 && /isn't paid/.test(r.b.message), "blocked until the extra deposit is paid");
await call(L, `/api/acct/booking/${b.ref}/pay`, {});
r = await call(A, `/api/admin/booking/${b.ref}`, { action: "confirm", time: "09:30" }); ok(r.s === 400, "It's a go needs a date");
r = await call(A, `/api/admin/booking/${b.ref}`, { action: "confirm", date: plus(7), time: "09:30" }); ok(r.b.booking?.status === "confirmed" && r.b.booking.go_at, "confirmed");
r = await call(L, "/api/acct/bookings"); ok(r.b.bookings.find((x) => x.ref === b.ref).go === true, "customer sees it confirmed");
ok((await outbox(A)).some((e) => e.subject.startsWith("It's a go") && e.to_addr === "lynn.fox@example.com"), "It's a go email sent");
r = await call(L, `/api/acct/booking/${b.ref}/cancel`, {}); ok(r.b.booking?.status === "cancel_requested", "cancelling a confirmed job becomes a request to Wayne");
r = await call(A, `/api/admin/booking/${b.ref}`, { action: "reopen" });
r = await call(A, `/api/admin/booking/${b.ref}`, { action: "confirm", date: plus(8), time: "11:00" }); ok(r.b.booking?.status === "confirmed", "Wayne reopens and confirms a new date");

section("Delivery, balance and files");
r = await call(A, `/api/admin/booking/${b.ref}`, { action: "deliver", files: "http://not-secure.example/x" }); ok(r.s === 400, "delivery link must be https");
r = await call(A, `/api/admin/booking/${b.ref}`, { action: "deliver", files: "https://drive.example.com/folder/abc" }); ok(r.b.booking?.status === "delivered", "delivered");
r = await call(L, "/api/acct/bookings"); card = r.b.bookings.find((x) => x.ref === b.ref); ok(card.files === null && card.filesWaiting && card.owed === 120, "files stay locked until the £120 balance is paid");
r = await call(A, `/api/admin/booking/${b.ref}`, { action: "paid", amount: 500, how: "bank" }); ok(r.s === 400, "Wayne can't record more than is owed");
r = await call(L, `/api/acct/booking/${b.ref}/pay`, {}); ok(r.b.booking?.paid === 160 && r.b.booking.files === "https://drive.example.com/folder/abc", "balance paid: files unlock");
r = await call(A, `/api/admin/booking/${b.ref}`, { action: "refund", amount: 500 }); ok(r.s === 400, "can't refund more than was paid");
r = await call(A, `/api/admin/booking/${b.ref}`, { action: "refund", amount: 10, how: "Stripe" }); ok(r.b.booking?.refunded === 10, "refund recorded");
ok((await outbox(A)).some((e) => e.kind === "refund" && e.to_addr === "lynn.fox@example.com"), "customer emailed about the refund");

section("Invoice jobs, cancelling and unsigned bookings");
const v = await bookSignPay(L, "Lynn Fox", { service: "vacant", postcode: "TS17 6AB", date: plus(9), bookingAs: "business" }); ok(v.mode === "invoice" && v.owed === 0 && v.status === "requested", "repeat-visit job: nothing to pay up front");
r = await call(L, "/api/acct/book", { service: "gutter-check", postcode: "TS17 6AB", date: plus(9), bookingAs: "business" }); const g = r.b.booking;
r = await call(A, `/api/admin/booking/${g.ref}`, { action: "edit", changes: { total: 90 } }); ok(r.b.booking.total === 90 && !r.b.booking.pending, "before signing, Wayne's change applies straight away");
r = await call(A, `/api/admin/booking/${g.ref}`, { action: "confirm", date: plus(9) }); ok(r.s === 400, "an unsigned booking can't be confirmed");
r = await call(A, `/api/admin/booking/${g.ref}`, { action: "deliver", files: "https://drive.example.com/x" }); ok(r.s === 400, "an unsigned booking can't be delivered");
r = await call(L, `/api/acct/booking/${g.ref}/cancel`, {}); ok(r.b.booking?.status === "cancelled", "customer cancels an unconfirmed booking");
r = await call(L, `/api/acct/booking/${g.ref}/pay`, {}); ok(r.s === 400, "nothing to pay on a cancelled booking");
r = await call(A, "/api/admin/audit"); ok(r.b.audit.some((x) => x.action === "its-a-go") && r.b.audit.some((x) => x.action === "signed"), "everything is in the activity log");
done();
