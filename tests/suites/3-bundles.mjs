/* 10-listing bundles (booking agreement 3.10): pay up front, reminder, one extension, then expiry or refund */
import { call, ok, section, done, signUp, admin, outbox, plus, now, sql, bookSignPay } from "../helpers.mjs";

const A = await admin();
const L = await signUp("Lynn Fox", "lynn.fox@example.com");      // private customer
const Bo = await signUp("Bob Agent", "bob@example.com");          // business
const C = await signUp("Carol Cancel", "carol@example.com");
const rerun = () => sql("DELETE FROM limits WHERE k = 'job:bundles'"); // the hourly bundle check

section("Buying and using a bundle");
let r = await call(L, "/api/acct/book", { owner: "own", service: "bundle", postcode: "TS17 6AB", bookingAs: "consumer" }); ok(r.b.booking?.status === "awaiting_signature" && r.b.booking.total === 1971, "a bundle needs no date and costs £1,971", r.b);
const lb = r.b.booking;
r = await call(L, "/api/acct/book", { owner: "own", useBundle: true, postcode: "TS5 6AA", date: plus(5), bookingAs: "consumer" }); ok(r.s === 400, "can't use a bundle before it's paid for");
await call(L, `/api/acct/booking/${lb.ref}/sign`, { name: "Lynn Fox", agree: true }); r = await call(L, `/api/acct/booking/${lb.ref}/pay`, {}); ok(r.b.booking?.paid === 1971, "signed and paid in full");
const bb = await bookSignPay(Bo, "Bob Agent", { service: "bundle", postcode: "TS17 6AB", bookingAs: "business" });
const cb = await bookSignPay(C, "Carol Cancel", { service: "bundle", postcode: "TS17 6AB", bookingAs: "business" });
r = await call(L, "/api/acct/book", { owner: "own", useBundle: true, postcode: "TS5 6AA", bookingAs: "consumer" }); ok(r.s === 400 && /date/i.test(r.b.message), "each listing from a bundle needs its own date");
r = await call(L, "/api/acct/book", { owner: "own", useBundle: true, postcode: "TS5 6AA", date: plus(5), bookingAs: "consumer" }); ok(r.b.booking?.total === 0 && r.b.booking.owed === 0, "a listing in the core zone costs nothing more");
r = await call(L, "/api/acct/book", { owner: "own", useBundle: true, postcode: "DH1 3LE", date: plus(6), bookingAs: "consumer" }); ok(r.b.booking?.total === 25, "a Durham listing costs only the £25 travel");
const dl = r.b.booking;
r = await call(L, "/api/acct/bookings"); const lbund = r.b.bundles[0]; ok(lbund.used === 2 && lbund.canExtend === false, "2 of 10 used; can't extend yet");
r = await call(L, `/api/acct/booking/${dl.ref}/cancel`, {}); r = await call(L, "/api/acct/bookings"); ok(r.b.bundles[0].used === 1, "cancelling a listing puts it back in the bundle");
r = await call(L, `/api/acct/bundle/${lbund.id}/extend`, {}); ok(r.s === 400, "extending early is refused");
r = await call(Bo, `/api/acct/bundle/${lbund.id}/extend`, {}); ok(r.s === 404, "nobody can extend someone else's bundle");

section("Reminder and extension");
sql(`UPDATE bundles SET expires = ${now() + 10 * 86400} WHERE id = ${lbund.id}`); rerun();
r = await call(L, "/api/acct/bookings"); ok(r.b.bundles[0].canExtend === true, "in the last 2 weeks the extension is offered");
let ob = await outbox(A);
const warn = ob.find((e) => e.kind === "bundle" && e.to_addr === "lynn.fox@example.com" && /ends on/.test(e.subject));
ok(warn && /9 listings left/.test(warn.subject) && /extend it once by 1 month/.test(warn.body) && /refund them at the bundle price/.test(warn.body), "reminder email: listings left, the extension, and the refund for private customers", warn?.subject);
rerun(); await call(L, "/api/acct/bookings");
ok((await outbox(A)).filter((e) => e.kind === "bundle" && /ends on/.test(e.subject) && e.to_addr === "lynn.fox@example.com").length === 1, "the reminder is only sent once");
const before = r.b.bundles[0].expires;
r = await call(L, `/api/acct/bundle/${lbund.id}/extend`, {}); ok(r.b.expires === before + 31 * 86400, "extended by 1 month");
r = await call(L, `/api/acct/bundle/${lbund.id}/extend`, {}); ok(r.s === 400, "only one extension");

section("When a bundle ends");
sql(`UPDATE bundles SET expires = ${now() - 60} WHERE booking_id IN (SELECT id FROM bookings WHERE ref IN ('${lb.ref}', '${bb.ref}'))`); rerun();
await call(A, "/api/admin/overview");
r = await call(L, "/api/acct/bookings"); ok(r.b.bundles.length === 0, "an ended bundle is no longer offered");
r = await call(L, "/api/acct/book", { owner: "own", useBundle: true, postcode: "TS5 6AA", date: plus(5), bookingAs: "consumer" }); ok(r.s === 400, "can't book from an ended bundle");
const cust = async (q) => (await call(A, `/api/admin/customer/${(await call(A, `/api/admin/customers?q=${q}`)).b.customers[0].id}`)).b;
const lx = (await cust("lynn")).bundles[0]; ok(lx.closed === 1 && lx.refund === Math.round((1971 * 9) / 10), `private customer: £${lx.refund} refund due for 9 unused`);
const bx = (await cust("bob")).bundles[0]; ok(bx.closed === 1 && bx.refund === 0, "business: unused listings expire, no refund");
ob = await outbox(A);
ok(ob.some((e) => e.to_addr === "admin@example.com" && e.subject.startsWith(`Refund due: £${lx.refund}`)), "Wayne is emailed to make the refund");
ok(ob.some((e) => e.to_addr === "bob@example.com" && /unused listings have expired/.test(e.body)), "the business customer is told theirs expired");

section("Cancelling the bundle itself");
r = await call(C, `/api/acct/booking/${cb.ref}/cancel`, {}); ok(r.b.booking?.status === "cancelled", "bundle purchase cancelled");
r = await call(C, "/api/acct/book", { owner: "own", useBundle: true, postcode: "TS5 6AA", date: plus(5), bookingAs: "business" }); ok(r.s === 400, "a cancelled bundle can't be used");
done();
