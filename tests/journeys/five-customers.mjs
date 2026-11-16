/* FIVE CUSTOMER JOURNEYS, start to finish (Wayne, 16 Nov 2026).
   Not part of `npm test`: this is a fact-finding run. A ✗ is a gap in the
   website, not a broken build. Findings are written up in TODO.md.

   Run:  1) npm run build
         2) start a local copy on port 8799 in test mode (see tests/run.mjs)
         3) node --no-warnings tests/journeys/five-customers.mjs            */
import { call, ok, section, done, signUp, admin, outbox, plus, jar, sql } from "../helpers.mjs";

const A = await admin();
const choice = (o) => JSON.stringify(o);
const adminBooking = async (ref) => (await call(A, `/api/admin/booking/${ref}`)).b.booking;
const mailTo = async (to, kind) => (await outbox(A)).filter((e) => e.to_addr === to && (!kind || e.kind === kind));
const rowsOf = async (j, ref) => (await call(j, `/api/acct/booking/${ref}/agreement`)).b.rows || [];
const row = (rows, k) => (rows.find((x) => x[0].startsWith(k)) || [])[1];

/* ============ 1. HARRY: a tiny estate agent, one or two listings a month ============ */
section("HARRY (tiny agent): books a 3-bed Showcase with a floor plan, straight from the account page");
const H = await signUp("Harry Hart", "harry@example.com", { company: "Hart & Home Ltd", phone: "07700 900111" });
let r = await call(H, "/api/acct/book", { service: "showcase", size: 1, extras: ["floorplan", "whitelabel"], postcode: "TS18 1AB", address: "4 Example Close", date: plus(6), time: "10:00", bookingAs: "business" });
let hb = r.b.booking;
ok(hb?.total === 219 + 30 + 45 + 29, "online booking prices the house size and the extras he picked (3-4 bed +£30, floor plan +£45, white label +£29)", `charged £${hb?.total}`);
let rows = await rowsOf(H, hb.ref);
ok(row(rows, "Business name") === "Hart & Home Ltd", "the agreement names his agency as the business", row(rows, "Business name"));
ok(/white|your brand|no happy drones/i.test(row(rows, "Branding") || ""), "the agreement records white label branding", row(rows, "Branding"));
await call(H, `/api/acct/booking/${hb.ref}/cancel`, {});

section("HARRY: the route that does work today (quote form → Wayne accepts → sign → pay)");
r = await call(null, "/api/enquiry", { "form-name": "quote", role: "Estate agent", name: "Harry Hart", company: "Hart & Home Ltd", email: "harry@example.com", phone: "07700 900111", postcode: "TS18 1AB", date: plus(6), time: "Morning",
  "price-choice": choice({ t: "quote", service: "showcase", size: 1, extras: ["floorplan", "whitelabel"] }), "bot-field": "" });
const hq = r.b.ref; r = await call(A, `/api/admin/enquiry/${hq}`);
ok(r.b.enquiry.price === 323, "quote form prices it properly: £323", r.b.enquiry.price);
const hLines = r.b.enquiry.lines;
r = await call(A, `/api/admin/enquiry/${hq}`, { action: "book", bookingAs: "business", service: "showcase", postcode: "TS18 1AB", address: "4 Example Close", date: plus(6), time: "10:00", lines: hLines });
const href = r.b.booking; ok(/^HD-/.test(href || ""), "Wayne accepts the quote in one go", r.b);
r = await call(H, "/api/acct/bookings"); ok(r.b.bookings.some((b) => b.ref === href), "it appears in Harry's account because he already has one");
r = await call(H, `/api/acct/booking/${href}/sign`, { name: "Harry Hart", agree: true }); ok(r.b.booking?.signed, "Harry signs");
r = await call(H, `/api/acct/booking/${href}/pay`, {}); ok(r.b.booking?.paid === 81, "deposit paid (25% of £323 = £81)", r.b.booking?.paid);

section("HARRY: Wayne has to move the date (vendor not ready)");
let before = (await mailTo("harry@example.com")).length;
r = await call(A, `/api/admin/booking/${href}`, { action: "edit", changes: { wanted_date: plus(9), wanted_time: "14:00" } });
ok(r.s === 200, "Wayne can change the wanted date");
ok((await mailTo("harry@example.com")).length > before, "Harry is emailed that the date moved", "no email sent");
r = await call(A, `/api/admin/booking/${href}`, { action: "confirm", date: plus(9), time: "14:00" }); ok(r.s === 200, "It's a go for the new date");
ok((await mailTo("harry@example.com", "confirmed")).length === 1, "Harry gets the confirmed date by email");
r = await call(H, `/api/acct/booking/${href}/date`, { date: plus(12) }); ok(r.s === 200, "Harry can ask to move the date himself from his account", `status ${r.s}`);
r = await call(A, `/api/admin/booking/${href}`, { action: "confirm", date: plus(11), time: "09:00" });
ok((await mailTo("harry@example.com", "confirmed")).length === 2, "moving a confirmed date emails him again");
r = await call(A, `/api/admin/booking/${href}`, { action: "deliver", files: "https://drive.example.com/harry" });
r = await call(H, `/api/acct/booking/${href}`); ok(r.b.booking.status === "delivered" && !r.b.booking.files, "delivered: files locked until the balance is paid");
r = await call(H, `/api/acct/booking/${href}/pay`, {}); ok(r.b.booking?.paid === 323 && r.b.booking.files, "balance paid, files unlocked");
ok((await mailTo("harry@example.com")).some((e) => /invoice (number|no)/i.test(e.body)), "he gets a numbered invoice or receipt for his accounts", "a thank-you email only, no numbered document");

/* ============ 2. JOSEPHINE: a large agency, 5 branches, 25 listings a month ============ */
section("JOSEPHINE (large agency): asks for an agent account");
r = await call(null, "/api/enquiry", { "form-name": "agent-account", agency: "Tees Valley Estates Ltd", branches: "Stockton, Yarm, Darlington, Middlesbrough, Hartlepool", name: "Josephine Jones", email: "josephine@example.com", phone: "01642 000000",
  "invoice-email": "accounts@example.com", "purchase-orders": "Yes: one PO a month", volume: "20+", "shoot-day": "Tuesday", branding: "White label", agreed: "Read", "bot-field": "" });
const jq = r.b.ref; ok(/^Q-/.test(jq), "account request saved");
r = await call(A, `/api/admin/enquiry/${jq}`); ok(r.b.enquiry.kind === "agent-account" && r.b.enquiry.company === "Tees Valley Estates Ltd", "Wayne sees it with the agency name");
r = await call(A, `/api/admin/enquiry/${jq}`, { action: "open-account" }); ok(r.s === 200, "Wayne can turn the request into an agent account", `no such action (${r.b.message})`);
const J = await signUp("Josephine Jones", "josephine@example.com", { company: "Tees Valley Estates Ltd" });
r = await call(J, "/api/acct/me"); ok(r.b.user?.agent || r.b.user?.account === "agent", "her login is marked as an agent account", JSON.stringify(r.b.user));
r = await call(J, "/api/acct/book", { service: "showcase", postcode: "TS15 9AA", address: "1 High Street, Yarm", date: plus(8), bookingAs: "business" });
let jb = r.b.booking;
ok(jb?.total === Math.round(219 * 0.9), "her listings get the 10% agent discount automatically", `charged £${jb?.total}`);
ok(jb?.mode === "invoice", "her listings go on the monthly invoice, no card deposit each time", `mode ${jb?.mode}, £${jb?.dueNow} due now by card`);
r = await call(J, `/api/acct/booking/${jb.ref}/agreement`); ok(r.b.toSign !== "original", "she doesn't have to sign a full agreement for every single listing", "every listing needs its own signature");
r = await call(J, "/api/acct/book", { service: "showcase", postcode: "TS15 9AA", date: plus(8), bookingAs: "business", po: "PO-4471" });
ok(JSON.stringify(await rowsOf(J, r.b.booking.ref)).includes("PO-4471"), "a purchase order number can be put on a booking", "no PO field");
const J2 = await signUp("Ben Branch", "ben.branch@example.com", { company: "Tees Valley Estates Ltd" });
r = await call(J2, "/api/acct/bookings"); ok(r.b.bookings?.length > 0, "a branch colleague can see and book on the agency's account", "each person has a separate account");
r = await call(A, "/api/admin/statement?company=Tees%20Valley%20Estates%20Ltd"); ok(r.s === 200, "Wayne can produce one monthly statement for the agency", `status ${r.s}`);

section("JOSEPHINE: the bundle (10 listings up front) does work");
r = await call(J, "/api/acct/book", { service: "bundle", postcode: "TS15 9AA", bookingAs: "business" }); const bun = r.b.booking;
ok(bun?.total === 1971 && bun.dueNow === 1971, "bundle of 10 Showcase listings: £1,971 up front", bun);
r = await call(J, `/api/acct/booking/${bun.ref}/sign`, { name: "Josephine Jones", agree: true }); r = await call(J, `/api/acct/booking/${bun.ref}/pay`, {});
r = await call(J, "/api/acct/book", { useBundle: true, service: "showcase", postcode: "DL1 1AA", address: "2 Example Row", date: plus(7), bookingAs: "business" });
ok(r.b.booking?.total === 0, "a listing from the bundle costs nothing extra in Darlington", r.b);
r = await call(J, "/api/acct/book", { useBundle: true, service: "showcase", size: 2, postcode: "DL1 1AA", date: plus(7), bookingAs: "business" });
ok(r.b.booking?.total > 0 || /size|bed/i.test(JSON.stringify(r.b)), "a 5-bed house from the bundle is priced or flagged differently from a flat", "same as a flat: size isn't asked");

let n = 0; for (let i = 0; i < 25; i++) { const x = await call(J, "/api/acct/book", { service: "essentials", postcode: "TS15 9AA", date: plus(8 + (i % 20)), bookingAs: "business" }); if (x.b.booking) n++; else { r = x; break; } }
ok(n === 25, "she can book a month of listings (25) without being stopped", `stopped after ${n + 2} in one day: ${r.b?.message}`);
sql("DELETE FROM limits WHERE k LIKE 'book%'");

/* ============ 3. MICHAEL AND MICHELLE: buying a house, want the roof and front checked ============ */
section("MICHAEL & MICHELLE (buyers): roof check on a house they don't own yet");
const M = await signUp("Michael and Michelle Moore", "mm@example.com");
r = await call(M, "/api/acct/book", { service: "roofs", postcode: "TS16 0AA", address: "9 Example Avenue", date: plus(4), time: "13:00", bookingAs: "consumer", notes: "We are buying this house. Survey due next week." });
const mb = r.b.booking; ok(mb?.total === 135, "roof check booked: £135");
rows = await rowsOf(M, mb.ref);
ok(rows.some(([k]) => /owner|permission/i.test(k)), "the booking asks who owns the property and whether the owner has agreed", "never asked");
r = await call(M, `/api/acct/booking/${mb.ref}/sign`, { name: "Michael Moore", agree: true }); ok(r.s === 200, "Michael can sign on his own for a joint account", r.b.message);
r = await call(M, `/api/acct/booking/${mb.ref}/sign`, { name: "Michael and Michelle Moore", agree: true, earlyStart: true }); ok(r.b.booking?.signed, "signing with the joint name works");
r = await call(M, `/api/acct/booking/${mb.ref}/pay`, {}); ok(r.b.booking?.paid === 34, "deposit paid");
r = await call(null, "/api/acct/quote?service=facade&postcode=TS16%200AA"); 
r = await call(M, "/api/acct/book", { service: "facade", postcode: "TS16 0AA", date: plus(4), bookingAs: "consumer" }); ok(r.b.booking, "they can add a check of the front of the building (facade)", r.b.message);
r = await call(M, "/api/acct/book", { service: "mapping", postcode: "TS16 0AA", date: plus(4), bookingAs: "consumer" }); ok(r.b.booking, "they can add a basic 3D model", r.b.message);
r = await call(null, "/api/enquiry", { "form-name": "interest", service: "3D model", name: "Michelle Moore", email: "mm@example.com", "bot-field": "" }); ok(r.s === 200, "they can at least register interest in the 3D model");
section("MICHAEL & MICHELLE: the sale falls through, they cancel");
r = await call(M, `/api/acct/booking/${mb.ref}/cancel`, {}); ok(r.b.booking?.status === "cancelled", "they can cancel online before Wayne confirms");
const cm = (await mailTo("mm@example.com", "cancelled"))[0]; ok(cm && /refund/i.test(cm.body), "the cancellation email tells them about their refund");
r = await adminBooking(mb.ref); ok(r.refunded === 34 || r.refund_due, "the £34 deposit refund is started or flagged for Wayne automatically", `paid £${r.paid}, refunded £${r.refunded || 0}, nothing flagged`);

/* ============ 4. TONY: Stockton council, PR photos and film of the bridges ============ */
section("TONY (council): photos and video of every Tees bridge in Stockton, for PR");
r = await call(null, "/api/enquiry", { "form-name": "mission", "service-id": "film", mission: "film", name: "Tony Turner", company: "Stockton-on-Tees Borough Council", email: "tony@example.com", phone: "01642 111111", postcode: "TS18 2NB", date: plus(21), time: "10:00",
  notes: "Infinity Bridge, Millennium Bridge, Princess of Wales Bridge, Victoria Bridge, Tees Barrage. PR use. Need PO and supplier form.", "price-choice": choice({ t: "mission", mission: "film", scale: "large", freq: "once", extras: [] }), "bot-field": "" });
const tq = r.b.ref; r = await call(A, `/api/admin/enquiry/${tq}`); const te = r.b.enquiry;
ok(te.price > 0, `mission planner gives a guide price for one large film job: £${te.price}`);
ok(te.fields.some(([k]) => /site|location/i.test(k) && false), "the plan can list several sites (five bridges), each with its own place", "one postcode only; the bridges are just typed in the notes");
r = await call(A, `/api/admin/enquiry/${tq}`, { action: "book", bookingAs: "business", serviceName: "Bridges of Stockton: PR photo and film (5 bridges)", postcode: "TS18 2NB", address: "Infinity Bridge and four others", date: plus(21), time: "10:00", mode: "invoice",
  lines: [["Aerial film and photos, 5 bridges over 2 days", 1100, "service"], ["Edited 2-minute film", 250, "extra"]], deliverables: "40 edited photos and a 2-minute film", notes: "PO 778812" });
const tref = r.b.booking; ok(/^HD-/.test(tref || ""), "Wayne can build a custom job with his own price lines and invoice terms", r.b);
ok((await mailTo("tony@example.com", "invite"))[0]?.body.includes("Bridges of Stockton"), "the invitation email shows the job name as Wayne typed it", "name is lower-cased: bridges of stockton: pr photo and film");
const T = await signUp("Tony Turner", "tony@example.com", { company: "Stockton-on-Tees Borough Council" });
rows = await rowsOf(T, tref);
ok(row(rows, "Payment terms") && /invoice/i.test(row(rows, "Payment terms")), "agreement shows invoice terms, no card needed");
ok(/2 days|and/.test(row(rows, "Shoot date") || "") && false, "the agreement can show two shoot days", "one date only");
ok(rows.some(([k]) => /purchase order|PO/i.test(k)), "the agreement has a place for the council's PO number", "only in Special notes");
ok(/PR|press|public/i.test(row(rows, "Licence") || ""), "the licence covers council PR and press use", row(rows, "Licence"));
ok(rows.some(([k]) => /permission|land|airspace/i.test(k)), "the job records who gives permission to take off and land (council land, river, roads)", "nowhere to record it");
r = await call(T, `/api/acct/booking/${tref}/sign`, { name: "Tony Turner", agree: true }); ok(r.b.booking?.signed, "Tony signs online");
ok(false, "the website checks Tony is allowed to sign for the council", "anyone with the email can sign; no job title or authority asked");
r = await call(A, `/api/admin/booking/${tref}`, { action: "edit", changes: { total: 1500, deliverables: "40 edited photos, a 2-minute film and 5 vertical clips" } });
ok((await mailTo("tony@example.com", "changes")).length === 1, "Wayne adds vertical clips (+£150): Tony is emailed to approve the change");
r = await call(T, `/api/acct/booking/${tref}/sign`, { name: "Tony Turner", agree: true }); ok(r.s === 200, "Tony approves the change");
r = await call(A, `/api/admin/booking/${tref}`, { action: "confirm", date: plus(22), time: "09:00" }); ok(r.s === 200, "It's a go (no deposit needed on invoice terms)");
r = await call(A, `/api/admin/booking/${tref}`, { action: "deliver", files: "https://drive.example.com/bridges" });
r = await call(T, `/api/acct/booking/${tref}`); ok(r.b.booking.files, "files open straight away on invoice terms");
r = await call(T, `/api/acct/booking/${tref}/invoice`); ok(r.s === 200, "Tony can download an invoice to send to accounts payable", `status ${r.s}: no invoice is produced`);
r = await call(A, `/api/admin/booking/${tref}`, { action: "paid", amount: 1500, how: "BACS" }); ok(r.s === 200, "Wayne records the BACS payment when it lands");
r = await adminBooking(tref); ok(r.invoice_due || r.due_date, "the site knows when the invoice is due and can chase it", "no due date stored, no reminder");

/* ============ 5. PRIYA: property manager, three empty units, monthly checks ============ */
section("PRIYA (property manager): monthly checks on three empty units");
const P = await signUp("Priya Patel", "priya@example.com", { company: "Northgate Property Management Ltd" });
r = await call(P, "/api/acct/book", { service: "vacant", postcode: "TS17 6AB", address: "Unit 3, Example Park", date: plus(10), bookingAs: "business", visits: 12, every: "month" });
const pb = r.b.booking; ok(pb?.mode === "invoice" && pb.dueNow === 0, "vacant check booked on invoice terms, nothing to pay now");
ok(pb?.total === 95 * 12 || /12/.test(JSON.stringify(pb)), "she can book 12 monthly visits in one go", `one visit only (£${pb?.total})`);
rows = await rowsOf(P, pb.ref); ok(/month/i.test(row(rows, "Shoot date") || ""), "the agreement shows the visit schedule", row(rows, "Shoot date"));
r = await call(P, "/api/acct/book", { service: "vacant", postcode: "TS17 6AB", address: "Units 3, 4 and 7, Example Park", buildings: 3, date: plus(10), bookingAs: "business" });
ok(r.b.booking?.total === 285, "three buildings on one visit are priced as three", `charged £${r.b.booking?.total}`);
r = await call(P, `/api/acct/booking/${pb.ref}/sign`, { name: "Priya Patel", agree: true });
r = await call(A, `/api/admin/booking/${pb.ref}`, { action: "confirm", date: plus(10), time: "11:00" });
r = await call(A, `/api/admin/booking/${pb.ref}`, { action: "deliver", files: "https://drive.example.com/unit3-nov" });
r = await call(A, `/api/admin/booking/${pb.ref}/repeat`, { date: plus(40) }); ok(r.s === 200, "after a visit, Wayne can set up next month's visit in one click", `status ${r.s}`);
r = await call(P, `/api/acct/booking/${pb.ref}`); ok(Array.isArray(r.b.booking.reports) || /report/i.test(JSON.stringify(r.b.booking)), "her account keeps each month's report together for the building", "one link per booking, nothing joins the months");

/* ============ Things that could go wrong for anyone ============ */
section("DATES: what the website lets through");
const X = await signUp("Xena Extra", "xena@example.com");
r = await call(X, "/api/acct/book", { service: "aerial", postcode: "TS18 1AB", date: plus(6), time: "10:00", bookingAs: "consumer" });
ok(r.s === 400 || r.b.clash, "a second customer picking Harry's first date and time is warned or refused", "accepted with no warning to anyone");
r = await call(X, "/api/acct/book", { service: "aerial", postcode: "TS18 1AB", date: "2026-12-25", bookingAs: "consumer" }); ok(r.s === 400, "Christmas Day can't be booked", "accepted");
r = await call(X, "/api/acct/book", { service: "aerial", postcode: "TS18 1AB", date: "2031-01-01", bookingAs: "consumer" }); ok(r.s === 400, "a date five years away is refused", "accepted");
r = await call(X, "/api/acct/book", { service: "aerial", postcode: "TS18 1AB", date: plus(5), time: "23:30", bookingAs: "consumer" }); ok(r.s === 400, "a flying time in the dark (23:30) is refused", "accepted");
r = await call(X, "/api/acct/book", { service: "aerial", postcode: "TS18 1AB", date: plus(5), time: "<b>noon</b>", bookingAs: "consumer" }); ok(r.s === 400, "the time must be a real time, not free typing", "saved as typed: <b>noon</b>");
r = await call(X, "/api/acct/book", { service: "aerial", postcode: "TS18 1AB", date: "2027-02-30", bookingAs: "consumer" }); ok(r.s === 400, "an impossible date (30 Feb) is refused", "accepted");
r = await call(X, "/api/acct/book", { service: "aerial", postcode: "TS18 1AB", date: plus(5), bookingAs: "consumer" }); const xb = r.b.booking;
sql("UPDATE bookings SET wanted_date = ? WHERE ref = ?", plus(-3), xb.ref);
r = await call(X, `/api/acct/booking/${xb.ref}/sign`, { name: "Xena Extra", agree: true }); ok(r.s === 400, "an unsigned booking whose date has passed can't be signed as it is", "signed with a date in the past");
r = await call(A, `/api/admin/booking/${xb.ref}`, { action: "confirm", date: plus(-3), anyway: true }); ok(r.s === 400, "Wayne can't confirm a flying date in the past by mistake", "accepted");
done();
