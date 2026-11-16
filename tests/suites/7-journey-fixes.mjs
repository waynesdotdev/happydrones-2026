/* Fixes from the five-customer journey test (16 Nov 2026): dates and times,
   telling people when dates move, refunds to check, same-day warnings,
   sizes and extras priced on the account page, who owns the property,
   joint accounts, asking to move a date, and numbered receipts and invoices. */
import { call, ok, section, done, signUp, admin, outbox, plus, sql, bookSignPay } from "../helpers.mjs";

const A = await admin();
const mails = async (to, kind) => (await outbox(A)).filter((e) => e.to_addr === to && (!kind || e.kind === kind));
const H = await signUp("Harry Hart", "harry@example.com", { company: "Hart & Home Ltd" });
const base = { owner: "own", service: "aerial", postcode: "TS18 1AB", bookingAs: "consumer" };

section("Dates and times: only real ones");
for (const [date, label] of [["2027-02-30", "30 February"], [plus(5 * 365), "a date five years away"], ["2026-12-25", "Christmas Day"], ["2027-01-01", "New Year's Day"]]) {
  const r = await call(H, "/api/acct/book", { ...base, date }); ok(r.s === 400 && r.b.error === "date", `${label} can't be booked`, r.b);
}
let r = await call(H, "/api/acct/book", { ...base, date: plus(5), time: "23:30" }); ok(r.s === 400 && r.b.error === "time", "a time in the dark (23:30) is refused");
r = await call(H, "/api/acct/book", { ...base, date: plus(5), time: "<b>noon</b>" }); ok(r.s === 400 && r.b.error === "time", "typed text isn't a time");
r = await call(H, "/api/acct/book", { ...base, date: plus(5), time: "Morning" }); ok(r.b.booking?.wantedTime === "Morning", "morning is fine");
r = await call(null, "/api/enquiry", { "form-name": "quote", name: "Q Person", email: "q@example.com", postcode: "TS18 1AB", date: "2026-12-26", "bot-field": "" }); ok(r.s === 400 && r.b.error === "date", "the quote form refuses Boxing Day too");
r = await call(null, "/api/enquiry", { "form-name": "quote", name: "Q Person", email: "q@example.com", postcode: "TS18 1AB", date: plus(6), time: "02:00", "bot-field": "" }); ok(r.s === 400 && r.b.error === "time", "and a 2am time");

section("Account booking uses the price list: size, extras, white label, buildings");
r = await call(H, "/api/acct/book", { owner: "act", service: "showcase", size: 1, extras: ["floorplan", "whitelabel"], postcode: "TS18 1AB", address: "4 Example Close", date: plus(6), time: "10:00", bookingAs: "business" });
const hb = r.b.booking; ok(hb?.total === 323 && hb.dueNow === 81, "3-4 bed Showcase + floor plan + white label = £323, deposit £81", hb);
r = await call(H, `/api/acct/booking/${hb.ref}/agreement`);
const row = (k) => (r.b.rows.find(([n]) => n.startsWith(k)) || [])[1] || "";
ok(/Floor plan £45/.test(row("Extras")) && /White label/.test(row("Branding")), "the extras and white label are written into the Job Details", r.b.rows);
r = await call(H, "/api/acct/book", { owner: "act", service: "showcase", size: 1, extras: [], postcode: "TS18 1AB", date: plus(6), bookingAs: "business", total: 1 }); ok(r.b.booking?.total === 249, "a price sent by the browser is ignored");
r = await call(H, "/api/acct/book", { owner: "act", service: "vacant", buildings: 3, postcode: "TS17 6AB", date: plus(10), bookingAs: "business" }); ok(r.b.booking?.total === 285 && /× 3 buildings/.test(r.b.booking.service), "three empty buildings on one visit: £285");

section("Who owns the property");
r = await call(H, "/api/acct/book", { ...base, owner: "not-yet", date: plus(5) }); ok(r.s === 400 && r.b.error === "owner", "no booking without the owner's OK");
r = await call(H, "/api/acct/book", { ...base, owner: undefined, date: plus(5) }); ok(r.s === 400 && r.b.error === "owner", "the question has to be answered");
const M = await signUp("Michael and Michelle Moore", "mm@example.com");
r = await call(M, "/api/acct/book", { ...base, service: "roofs", owner: "agreed", date: plus(4) }); const mb = r.b.booking;
r = await call(A, `/api/admin/booking/${mb.ref}`); ok(r.b.alerts.some((a) => /owner's OK/.test(a)), "Wayne is told to get the owner's OK before flying");

section("Joint accounts: either person can sign");
r = await call(M, `/api/acct/booking/${mb.ref}/sign`, { name: "Bob Moore", agree: true }); ok(r.s === 400 && /Michael Moore or Michelle Moore/.test(r.b.message), "a stranger's name is refused, and the message says who can sign", r.b.message);
r = await call(M, `/api/acct/booking/${mb.ref}/sign`, { name: "Michelle Moore", agree: true }); ok(r.b.booking?.signed, "Michelle signs on her own");

section("Receipts");
r = await call(M, `/api/acct/booking/${mb.ref}/pay`, {});
const paidMail = (await mails("mm@example.com", "paid"))[0]; ok(/Receipt R-\d{5}/.test(paidMail?.body) && /not registered for VAT/.test(paidMail.body), "the payment email is a numbered receipt, saying no VAT", paidMail?.body);
r = await call(M, "/api/acct/bookings"); const rc = r.b.bookings.find((b) => b.ref === mb.ref).receipts[0]; ok(rc?.no && rc.amount === 34, "the receipt is listed on the booking", rc);
r = await call(M, `/api/acct/booking/${mb.ref}/receipt/${rc.id}`); ok(r.s === 200 && /Receipt R-/.test(r.b) && /content-security-policy/i.test([...r.h.keys()].join(" ")), "a printable receipt, with its own security header");
r = await call(H, `/api/acct/booking/${mb.ref}/receipt/${rc.id}`); ok(r.s === 404, "nobody else can open it");

section("Refunds to check when a paid booking is cancelled");
r = await call(M, `/api/acct/booking/${mb.ref}/cancel`, {});
const ac = (await mails("admin@example.com")).find((e) => e.subject.includes(mb.ref) && /refund to check/i.test(e.subject)); ok(ac && /£34/.test(ac.subject), "Wayne's email says a refund of £34 is to check", ac?.subject);
r = await call(A, `/api/admin/booking/${mb.ref}`); ok(r.b.alerts.some((a) => /Refund to check: they paid £34/.test(a)), "and the booking page shows it");
r = await call(A, `/api/admin/booking/${mb.ref}`, { action: "refund", amount: 34, how: "Stripe" });
r = await call(A, `/api/admin/booking/${mb.ref}`); ok(!r.b.alerts.some((a) => /Refund/.test(a)), "once recorded, the warning goes");

section("Moving dates");
const hj = await bookSignPay(H, "Harry Hart", { ...base, date: plus(8), time: "10:00" });
r = await call(A, `/api/admin/booking/${hj.ref}`, { action: "edit", changes: { wanted_date: plus(9), wanted_time: "14:00" } });
ok((await mails("harry@example.com", "date")).some((e) => e.body.includes(plus(9))), "Wayne moves the date: Harry is emailed the new one");
r = await call(A, `/api/admin/booking/${hj.ref}`, { action: "edit", changes: { wanted_date: "2026-12-25" } }); ok(r.s === 400, "Wayne can't move it onto Christmas Day either");
r = await call(H, `/api/acct/booking/${hj.ref}/date`, { date: plus(11), time: "Afternoon" }); ok(r.b.booking?.wantedDate === plus(11), "before it's confirmed, Harry can change the date himself");
ok((await mails("admin@example.com")).some((e) => e.subject.startsWith(`Date changed: ${hj.ref}`)), "and Wayne is told");
r = await call(A, `/api/admin/booking/${hj.ref}`, { action: "confirm", date: plus(11), time: "13:00" });
r = await call(H, `/api/acct/booking/${hj.ref}/date`, { date: plus(13) }); ok(r.b.booking?.moveRequest?.date === plus(13) && r.b.booking.confirmedDate === plus(11), "after it's confirmed, Harry can only ask: the date stays put");
r = await call(A, `/api/admin/booking/${hj.ref}`); ok(r.b.alerts.some((a) => a.includes(plus(13))), "Wayne sees the request");
r = await call(A, "/api/admin/overview"); ok(r.b.counts.toDo >= 1, "and it counts as a to-do");
r = await call(A, `/api/admin/booking/${hj.ref}`, { action: "confirm", date: plus(-1) }); ok(r.s === 400, "Wayne can't confirm a date that has passed");
r = await call(A, `/api/admin/booking/${hj.ref}`, { action: "confirm", date: plus(13), time: "09:00" }); r = await call(A, `/api/admin/booking/${hj.ref}`); ok(!r.b.moveRequest, "confirming the new date clears the request");

section("Same-day warning");
const X = await signUp("Xena Extra", "xena@example.com");
const xb = await bookSignPay(X, "Xena Extra", { ...base, date: plus(13), time: "10:00" });
r = await call(A, `/api/admin/booking/${xb.ref}`); ok(r.b.alerts.some((a) => a.includes(hj.ref)), "two jobs on one day: Wayne is warned on the booking");
{ const am = (await mails("admin@example.com")).filter((e) => e.subject.includes(xb.ref)); ok(am.some((e) => /same day/i.test(e.subject)), "and in his new-booking email", am.map((e) => e.subject)); }

section("A booking whose date has passed");
r = await call(X, "/api/acct/book", { ...base, date: plus(5) }); const old = r.b.booking;
sql("UPDATE bookings SET wanted_date = ? WHERE ref = ?", plus(-3), old.ref);
r = await call(X, `/api/acct/booking/${old.ref}/sign`, { name: "Xena Extra", agree: true }); ok(r.s === 400 && r.b.error === "date", "can't be signed until it has a new date");

section("Invoices for invoice-terms jobs, and custom job names");
r = await call(null, "/api/enquiry", { "form-name": "mission", name: "Tony Turner", company: "Stockton-on-Tees Borough Council", email: "tony@example.com", postcode: "TS18 2NB", date: plus(21), "bot-field": "" });
const tq = r.b.ref;
r = await call(A, `/api/admin/enquiry/${tq}`, { action: "book", bookingAs: "business", serviceName: "Bridges of Stockton: PR photo and film", postcode: "TS18 2NB", date: plus(21), time: "10:00", mode: "invoice", lines: [["Aerial film and photos, 5 bridges", 1100, "service"]] });
const tref = r.b.booking;
ok((await mails("tony@example.com", "invite"))[0]?.body.includes("Bridges of Stockton"), "the invitation keeps Wayne's job name as he typed it");
const T = await signUp("Tony Turner", "tony@example.com", { company: "Stockton-on-Tees Borough Council" });
await call(T, `/api/acct/booking/${tref}/sign`, { name: "Tony Turner", agree: true });
r = await call(T, `/api/acct/booking/${tref}/invoice`); ok(r.s === 404, "no invoice before the work is done");
await call(A, `/api/admin/booking/${tref}`, { action: "confirm", date: plus(21), time: "10:00" });
await call(A, `/api/admin/booking/${tref}`, { action: "deliver", files: "https://drive.example.com/bridges" });
const dm = (await mails("tony@example.com", "delivered"))[0]; ok(/Invoice INV-[A-F0-9]{6}: £1100, due within 30 days/.test(dm?.body || ""), "the delivery email is the invoice: number, amount, 30 days", dm?.body);
r = await call(T, `/api/acct/booking/${tref}/invoice`); ok(r.s === 200 && /Invoice INV-/.test(r.b) && /Stockton-on-Tees Borough Council/.test(r.b) && /not registered for VAT/.test(r.b), "a printable invoice addressed to the council");
r = await call(T, "/api/acct/bookings"); ok(r.b.bookings.find((b) => b.ref === tref)?.invoice?.startsWith("INV-"), "listed on the booking");
section("Booking numbers made only of digits");
sql("UPDATE bookings SET ref = 'HD-123456' WHERE ref = ?", xb.ref);
await call(A, "/api/admin/booking/HD-123456", { action: "edit", changes: { wanted_time: "15:00" } });
ok((await mails("xena@example.com", "date")).some((e) => e.subject.includes("HD-123456")), "HD-123456 isn't blanked out in email subjects (only sign-in codes are)");
done();
