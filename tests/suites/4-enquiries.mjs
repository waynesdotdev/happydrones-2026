/* Quotes and enquiries: saved, priced by the server, confirmed, accepted into a booking */
import { call, ok, section, done, admin, outbox, plus, jar, sql } from "../helpers.mjs";

const A = await admin();
const choice = (o) => JSON.stringify(o);
const quote = (over = {}) => ({ "form-name": "quote", role: "Homeowner selling", name: "Pat Personal", email: "pat.personal@example.com", phone: "07700 900123", postcode: "dh1 3le", date: plus(6), time: "Afternoon",
  message: "Slipped tiles. VISIT http://spam.example NOW", "price-choice": choice({ t: "quote", service: "showcase", size: 0, extras: ["floorplan", "dusk"] }), "bot-field": "", ...over });

section("What a quote must have");
let r = await call(null, "/api/enquiry", quote({ date: "" })); ok(r.s === 400 && /date/i.test(r.b.message), "no date, no quote");
r = await call(null, "/api/enquiry", { "form-name": "mission", name: "No Date", email: "nd@example.com", postcode: "TS5 6AA", "bot-field": "" }); ok(r.s === 400, "a mission plan needs a date too");
r = await call(null, "/api/enquiry", { "form-name": "quote", name: "X", date: plus(5) }); ok(r.s === 400, "needs a name and an email or phone");
r = await call(null, "/api/enquiry", quote({ "bot-field": "spam" })); ok(r.b.ref === "Q-000000", "a bot that fills the hidden box is quietly ignored");
r = await call(null, "/api/enquiry", quote(), { headers: { origin: "https://evil.example" } }); ok(r.s === 403, "other websites can't post the form");

section("The price is worked out by the server");
r = await call(null, "/api/enquiry", quote({ "quote-total": "£1", total: "£1", "quote-summary": "Everything for a pound", "price-lines": '[["Showcase",1,"service"]]', map: "https://evil.example/login" }));
ok(/^Q-[A-F0-9]{6}$/.test(r.b.ref), "saved with a reference", r.b); const ref = r.b.ref;
r = await call(A, `/api/admin/enquiry/${ref}`); const q = r.b.enquiry;
ok(q.price === 323 && JSON.stringify(q.lines) === JSON.stringify([["Showcase", 219, "service"], ["Floor plan", 45, "extra"], ["Dusk exterior photos", 59, "extra"]]), "a browser claiming £1 is ignored: £323 from the price list", { price: q.price, lines: q.lines });
ok(!JSON.stringify(q.fields).includes("pound") && !JSON.stringify(q.fields).includes("evil.example") && q.fields.some(([k, v]) => v === "£323"), "made-up totals, summaries and links are dropped");
ok(!q.token_hash && r.b.account === null, "the admin never sees the private link's secret");
r = await call(null, "/api/enquiry", quote({ name: "Nina Nochoice", email: "nina@example.com", "price-choice": "", "quote-total": "£5" }));
r = await call(A, `/api/admin/enquiry/${r.b.ref}`); ok(r.b.enquiry.price === null && r.b.enquiry.lines === null, "no real choice sent: no price is invented");
r = await call(null, "/api/enquiry", { "form-name": "mission", "service-id": "roofs", mission: "roofs", name: "Mo Mission", email: "mo@example.com", postcode: "DH1 3LE", date: plus(7), time: "10:00",
  "price-choice": choice({ t: "mission", mission: "roofs", scale: "medium", freq: "once", extras: [] }), plan: "Roof check for 1p", total: "£0.01", "bot-field": "" });
const mref = r.b.ref; r = await call(A, `/api/admin/enquiry/${mref}`);
ok(r.b.enquiry.price === 220 && r.b.enquiry.lines.some(([n, p, k]) => k === "travel" && p === 25) && !JSON.stringify(r.b.enquiry.fields).includes("1p"), "mission plan priced by the server, with Durham travel", r.b.enquiry.lines);

section("Confirmation emails");
let ob = await outbox(A);
const cust = ob.find((e) => e.to_addr === "pat.personal@example.com" && e.kind === "enquiry");
ok(cust && cust.subject.includes(ref) && /\/enquiry\/\?t=[a-f0-9]{32}/.test(cust.body) && /Guide price: £323/.test(cust.body) && /^Hi Pat,/.test(cust.body), "customer gets a reference, the guide price and a private link");
ok(!/spam\.example|Slipped tiles/.test(cust.body), "the confirmation never repeats text the sender typed");
const adm = ob.find((e) => e.to_addr === "admin@example.com" && e.subject.startsWith("New quote request") && e.subject.includes(ref));
ok(adm && adm.body.includes("Slipped tiles") && adm.body.includes(`#enquiry-${ref}`) && !adm.body.includes("evil.example"), "Wayne gets every detail and an admin link");
const tok = cust.body.match(/t=([a-f0-9]{32})/)[1];
r = await call(null, `/api/enquiry?t=${tok}`); ok(r.b.ref === ref && r.b.price === 323 && r.b.statusText.startsWith("Received"), "the private link shows the customer their request");
r = await call(null, `/api/enquiry?t=${"0".repeat(32)}`); ok(r.s === 404, "a wrong link shows nothing");

section("Wayne works the enquiry");
r = await call(A, "/api/admin/overview"); ok(r.b.counts.newEnquiries === 3, "new enquiries are counted");
r = await call(A, `/api/admin/enquiry/${ref}`, { action: "status", status: "contacted" }); r = await call(null, `/api/enquiry?t=${tok}`); ok(r.b.statusText === "Wayne has been in touch", "status changes show on the customer's link");
r = await call(A, `/api/admin/enquiry/${ref}`, { action: "note", note: "Called, wants Tuesday" }); ok(r.b.enquiry?.note === "Called, wants Tuesday", "private note saved");
const lines = [...q.lines, ["Travel (County Durham)", 25, "travel"]];
r = await call(A, `/api/admin/enquiry/${ref}`, { action: "book", service: "showcase", bookingAs: "consumer", postcode: "DH1 3LE", lines }); ok(r.s === 400 && /date/i.test(r.b.message), "accepting needs a date");
r = await call(A, `/api/admin/enquiry/${ref}`, { action: "book", service: "showcase", bookingAs: "consumer", postcode: "DH1 3LE", address: "9 Storm Lane", date: plus(6), time: "Afternoon", mode: "deposit", notes: "Park on the drive", lines });
ok(/^HD-/.test(r.b.booking), "accepted: a booking is created", r.b); const bref = r.b.booking;
r = await call(A, `/api/admin/enquiry/${ref}`, { action: "book", service: "showcase", bookingAs: "consumer", postcode: "DH1 3LE", date: plus(6), lines }); ok(r.s === 400, "can't accept the same enquiry twice");
ob = await outbox(A); const inv = ob.find((e) => e.kind === "invite");
ok(inv && inv.to_addr === "pat.personal@example.com" && inv.body.includes(`#sign-${bref}`) && inv.body.includes("£348") && /create a free account with this email address/.test(inv.body), "customer is invited to create an account, sign and pay £348");
r = await call(null, `/api/enquiry?t=${tok}`); ok(r.b.booking?.toSign && r.b.statusText === "Booked", "their link now says booked, with a button to sign");

section("The customer takes it from there");
const P = jar(); r = await call(P, "/api/acct/register", { name: "Pat Personal", email: "pat.personal@example.com", password: "pats own password", privacy: true });
await call(P, "/api/acct/verify", { email: "pat.personal@example.com", code: r.b.devCode });
r = await call(P, "/api/acct/bookings"); ok(r.b.bookings[0]?.ref === bref && r.b.bookings[0].total === 348, "signing up with that email finds the booking waiting");
r = await call(P, `/api/acct/booking/${bref}/agreement`);
ok(r.b.rows.some(([k, v]) => k === "Extras agreed" && /Floor plan £45; Dusk exterior photos £59/.test(v)) && r.b.rows.some(([k, v]) => k === "Special notes" && v === "Park on the drive"), "the agreement lists the add-ons and notes", r.b.rows);
r = await call(P, `/api/acct/booking/${bref}/sign`, { name: "Pat Personal", agree: true }); r = await call(P, `/api/acct/booking/${bref}/pay`, {}); ok(r.b.booking?.paid === 87, "signed and the £87 deposit paid");

section("Other forms, deleting and limits");
r = await call(null, "/api/enquiry", { "form-name": "feedback", rating: "5", good: "Brilliant", "bot-field": "" }); ok(r.s === 200, "feedback needs no name, email or date");
sql("DELETE FROM limits WHERE k LIKE 'enq%'");
r = await call(null, "/api/enquiry", { "form-name": "business", role: "Estate or letting agent", need: "Listing photos and video", "how-often": "Weekly", company: "Tees Homes Ltd", name: "Bea Business", email: "bea@example.com", postcode: "TS18 1AB", "quote-total": "£1", "bot-field": "" });
ok(/^Q-[A-F0-9]{6}$/.test(r.b.ref), "a business enquiry needs no date", r.b); const bizRef = r.b.ref;
r = await call(A, `/api/admin/enquiry/${bizRef}`);
ok(r.b.enquiry.kind === "business" && r.b.enquiry.company === "Tees Homes Ltd" && r.b.enquiry.price === null && r.b.enquiry.fields.some(([k, v]) => k === "What they need" && v === "Listing photos and video") && !JSON.stringify(r.b.enquiry.fields).includes("£1"), "saved as a business enquiry with the company, and no price invented", r.b.enquiry);
ob = await outbox(A); ok(ob.some((e) => e.to_addr === "bea@example.com" && /business enquiry/.test(e.subject)) && ob.some((e) => e.to_addr === "admin@example.com" && e.subject.startsWith("New business enquiry")), "the business and Wayne both get an email");
r = await call(null, "/api/enquiry", { "form-name": "business", company: "No Contact Ltd", name: "Nat", "bot-field": "" }); ok(r.s === 400, "a business enquiry still needs an email or phone");
r = await call(A, `/api/admin/enquiry/${mref}`, { action: "delete" }); ok(r.b.deleted, "an enquiry can be deleted for good");
r = await call(A, `/api/admin/enquiry/${mref}`); ok(r.s === 404, "and it's gone");
sql("DELETE FROM limits WHERE k LIKE 'enq%'");
let last; for (let i = 0; i < 9; i++) last = await call(null, "/api/enquiry", quote({ email: `x${i}@example.com` })); ok(last.s === 429, "one connection can't flood the form");
done();
