/* Data protection: see your data, delete your account, and nothing kept longer than promised */
import { call, ok, section, done, signUp, admin, plus, now, sql, bookSignPay, PW, B } from "../helpers.mjs";

const A = await admin();
const L = await signUp("Lynn Fox", "lynn.fox@example.com");
await call(null, "/api/enquiry", { "form-name": "quote", name: "Lynn Fox", email: "lynn.fox@example.com", postcode: "TS17 6AB", date: plus(6), message: "Old enquiry", "bot-field": "" });
const b = await bookSignPay(L, "Lynn Fox", { service: "roofs", postcode: "TS17 6AB", address: "2 Example Road", date: plus(5), bookingAs: "consumer", notes: "Gate code 1234" });
await call(A, `/api/admin/booking/${b.ref}`, { action: "note", note: "Friendly dog" });

section("Download my data");
let raw = await fetch(`${B}/api/acct/export`, { headers: { cookie: L.c } }); const data = await raw.json();
ok(/attachment/.test(raw.headers.get("content-disposition")), "downloads as a file");
ok(data.account.email === "lynn.fox@example.com" && data.bookings.length === 1 && data.bookings[0].admin_note === "Friendly dog", "account, bookings and Wayne's notes about them");
ok(data.signedAgreements.length === 1 && data.signedAgreements[0].name === "Lynn Fox" && data.signedAgreements[0].ip, "signed agreements, with what was recorded when signing");
ok(data.enquiries.length === 1 && data.enquiries[0].fields.some(([, v]) => v === "Old enquiry"), "enquiries sent with that email");
ok(data.activity.some((x) => x.action === "signed") && data.emailsSentToYou.length >= 2, "the activity log and copies of emails");
ok(!JSON.stringify(data).includes("pbkdf2") && !JSON.stringify(data).includes("token_hash"), "no password or secret values");
const O = await signUp("Olive Other", "olive@example.com");
raw = await fetch(`${B}/api/acct/export`, { headers: { cookie: O.c } }); const od = await raw.json();
ok(od.bookings.length === 0 && od.signedAgreements.length === 0 && od.enquiries.length === 0 && !JSON.stringify(od).includes("lynn"), "another customer's download has none of it");

section("Delete my account");
let r = await call(L, "/api/acct/delete", { password: "wrong one here" }); ok(r.s === 400, "needs the right password");
r = await call(L, "/api/acct/delete", { password: PW }); ok(r.b.ok, "account deleted");
r = await call(L, "/api/acct/bookings"); ok(r.s === 401, "signed out everywhere");
r = await call(A, `/api/admin/booking/${b.ref}`); const k = r.b.booking;
ok(k.user_id === null && k.address === null && k.notes === null && k.admin_note === null && k.postcode === "TS17" && k.total === 135, "the job record keeps the service and price, with only the first half of the postcode", k);
ok(r.b.signatures.length === 1, "the signed agreement is kept (as the privacy policy says)");
r = await call(A, "/api/admin/enquiries?status=all"); ok(r.b.enquiries.length === 0, "their enquiries are gone");
r = await call(A, "/api/admin/audit"); ok(!JSON.stringify(r.b.audit).includes("lynn.fox@example.com"), "the activity log no longer names them", r.b.audit.filter((x) => JSON.stringify(x).includes("lynn")));
r = await call(A, "/api/admin/outbox"); ok(!r.b.outbox.some((e) => e.to_addr === "lynn.fox@example.com" && e.kind !== "deleted"), "copies of their emails are gone");
r = await call(A, "/api/admin/customers?q=lynn"); ok(r.b.customers.length === 0, "not in the customer list");

section("Nothing kept longer than promised");
const old = (days) => now() - days * 86400;
const Pk = await signUp("Peter Past", "peter@example.com");
const pb = await bookSignPay(Pk, "Peter Past", { service: "roofs", postcode: "TS17 6AB", date: plus(5), bookingAs: "consumer" });
await call(null, "/api/enquiry", { "form-name": "quote", name: "Stale Sam", email: "sam@example.com", postcode: "TS17 6AB", date: plus(6), "bot-field": "" });
r = await call(Pk, "/api/acct/book", { owner: "own", service: "gutter-check", postcode: "TS17 6AB", date: plus(6), bookingAs: "consumer" }); const unsigned = r.b.booking.ref;
sql(`UPDATE bookings SET created = ${old(8 * 365)} WHERE ref = '${pb.ref}'`);
sql(`UPDATE signatures SET at = ${old(8 * 365)} WHERE booking_id = (SELECT id FROM bookings WHERE ref = '${pb.ref}')`);
sql(`UPDATE enquiries SET updated = ${old(370)} WHERE email = 'sam@example.com'`);
sql(`UPDATE bookings SET created = ${old(8)} WHERE ref = '${unsigned}'`);
sql(`INSERT INTO users (email, name, pw, verified, created) VALUES ('half.done@example.com', 'Half Done', 'x', 0, ${old(8)})`);
sql(`UPDATE outbox SET created = ${old(31)} WHERE to_addr = 'peter@example.com'`);
await call(A, "/api/admin/overview"); // the clean-up runs when the admin opens
ok(sql(`SELECT COUNT(*) n FROM bookings WHERE ref = '${pb.ref}'`)[0].n === 0, "job records older than 7 years are deleted");
ok(sql("SELECT COUNT(*) n FROM signatures").find(Boolean).n === 1, "signed agreements older than 7 years are deleted (the recent one stays)");
ok(sql("SELECT COUNT(*) n FROM enquiries WHERE email = 'sam@example.com'")[0].n === 0, "unbooked enquiries go after 12 months");
ok(sql(`SELECT status FROM bookings WHERE ref = '${unsigned}'`)[0].status === "cancelled", "bookings left unsigned for 7 days are cancelled");
ok(sql("SELECT COUNT(*) n FROM users WHERE email = 'half.done@example.com'")[0].n === 0, "unfinished sign-ups go after 7 days");
ok(sql("SELECT COUNT(*) n FROM outbox WHERE to_addr = 'peter@example.com'")[0].n === 0, "email copies go after 30 days");

section("Wayne deleting a customer, and test tools");
r = await call(A, "/api/admin/customers?q=olive"); const oid = r.b.customers[0].id;
r = await call(A, `/api/admin/customer/${oid}/delete`, {}); ok(r.b.ok, "Wayne can delete a customer on request");
r = await call(O, "/api/acct/me"); ok(r.b.user === null, "they're signed out and gone");
r = await call(A, "/api/admin/test/reset", { confirm: "nope" }); ok(r.s === 400, "Reset everything needs RESET typed");
r = await call(A, "/api/admin/test/reset", { confirm: "RESET" }); r = await call(A, "/api/admin/overview");
ok(r.s === 200 && r.b.counts.customers === 0 && r.b.counts.bookings === 0 && r.b.counts.enquiries === 0, "Reset everything clears it all and keeps the admin signed in");
done();
