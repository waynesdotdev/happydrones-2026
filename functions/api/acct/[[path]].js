/* /api/acct/* : customer accounts and bookings (the /account page).
   Sign-in is two-step: password, then a 6-digit code sent by email.
   Helpers and settings: lib/acct/server.js. Prices: lib/acct/catalog.js. */
import { json, fail, now, ipOf, testMode, sameSite, body, db, tidy, log, limited, hashPassword, checkPassword, passwordProblem,
  newCode, useCode, startSession, endSession, endCookie, currentUser, publicUser, MAIL, sendMail, stripeCheckout, recordPayment, randomHex, deleteUser, bundleJobs, extendBundle, stripeSession, settleSession, sameDay } from "../../../lib/acct/server.js";
import { priceFor, tidyPostcode, AGREEMENT_VERSION, bundleSize, BUNDLE_WARN_DAYS, sameName, plainName, signerNames, dateProblem, timeProblem, ukToday } from "../../../lib/acct/catalog.js";
import { jobRows, currentTerms, fingerprint, toBase64, ukTime, CONTRACT_FIELDS, withPending, changeList, signedHtml, signedFile, receiptHtml, invoiceHtml, docResponse, receiptNo, invoiceNo } from "../../../lib/acct/agreement.js";

const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,190}\.[a-z]{2,}$/i;
const cleanEmail = (e) => String(e || "").trim().toLowerCase();
const clean = (s, n = 200) => String(s || "").replace(/[\u0000-\u001f]/g, " ").trim().slice(0, n);
/* Test mode shows a code on screen ONLY for test accounts (made in the admin's
   Test tools) and @example addresses, which can't receive email. Everyone else,
   including the admin, gets their code by email even in test mode. Showing codes
   for real accounts would let anyone reset a password and sign in as them. */
const TEST_ADDR = /@example\.(com|org|net)$/i;
const dev = (env, code, u) => (testMode(env) && u && (u.test || TEST_ADDR.test(u.email)) ? { devCode: code } : {});

export async function onRequest(ctx) {
  const { request, env, params } = ctx;
  const path = (params.path || []).join("/");
  if (!sameSite(request)) return fail("origin", "Not allowed.", 403);
  try {
    const D = await db(env);
    const ip = ipOf(request);
    const m = request.method;

    /* ---------- open to everyone ---------- */
    if (path === "me" && m === "GET") {
      const u = await currentUser(env, request);
      return json({ user: publicUser(u), config: { test: testMode(env), stripe: !!env.STRIPE_SECRET_KEY, mail: !!env.RESEND_KEY, agreement: AGREEMENT_VERSION } });
    }

    if (path === "register" && m === "POST") {
      if (await limited(env, `reg:${ip}`, 10, 3600)) return fail("slow", "Too many tries. Wait an hour and try again.", 429);
      const b = await body(request);
      const email = cleanEmail(b.email), name = clean(b.name, 80);
      if (name.length < 2 || !EMAIL.test(email)) return fail("details", "Add your name and a valid email.");
      const pp = passwordProblem(b.password); if (pp) return fail("password", pp);
      if (!b.privacy) return fail("privacy", "Tick to say you've read the privacy policy.");
      const existing = await D.prepare("SELECT * FROM users WHERE email = ?").bind(email).first();
      if (existing && existing.verified) {
        // Don't reveal whether an email is registered: same answer, nothing changes
        return json({ step: "verify", email });
      }
      const role = env.ADMIN_EMAIL && cleanEmail(env.ADMIN_EMAIL) === email ? "admin" : "customer";
      const pw = await hashPassword(b.password, env);
      if (existing) await D.prepare("UPDATE users SET name = ?, pw = ?, company = ?, phone = ?, marketing = ?, role = ? WHERE id = ?").bind(name, pw, clean(b.company, 120), clean(b.phone, 30), b.marketing ? 1 : 0, role, existing.id).run();
      else await D.prepare("INSERT INTO users (email, name, pw, company, phone, marketing, role, created) VALUES (?, ?, ?, ?, ?, ?, ?, ?)").bind(email, name, pw, clean(b.company, 120), clean(b.phone, 30), b.marketing ? 1 : 0, role, now()).run();
      const u = await D.prepare("SELECT * FROM users WHERE email = ?").bind(email).first();
      const code = await newCode(env, u.id, "verify");
      await sendMail(env, email, MAIL.verify(u, code), "code");
      await log(env, email, "register");
      return json({ step: "verify", email, ...dev(env, code, u) });
    }

    if (path === "verify" && m === "POST") {
      if (await limited(env, `code:${ip}`, 15, 900)) return fail("slow", "Too many tries. Wait 15 minutes.", 429);
      const b = await body(request);
      const u = await D.prepare("SELECT * FROM users WHERE email = ?").bind(cleanEmail(b.email)).first();
      if (!u) return fail("code", "That code isn't right.");
      const r = await useCode(env, u.id, "verify", b.code);
      if (r !== "ok") return fail("code", r === "expired" ? "That code has expired. Ask for a new one." : "That code isn't right.");
      await D.prepare("UPDATE users SET verified = 1 WHERE id = ?").bind(u.id).run();
      await log(env, u.email, "verified");
      return json({ user: publicUser(u) }, 200, { "set-cookie": await startSession(env, u) });
    }

    if (path === "login" && m === "POST") {
      if (await limited(env, `login:${ip}`, 20, 900)) return fail("slow", "Too many tries. Wait 15 minutes.", 429);
      await tidy(env);
      const b = await body(request);
      const u = await D.prepare("SELECT * FROM users WHERE email = ?").bind(cleanEmail(b.email)).first();
      const wrong = () => fail("login", "That email or password isn't right.");
      if (!u) { await hashPassword(String(b.password || "x"), env); return wrong(); } // same time either way
      if (u.locked_until > now()) return fail("locked", `Too many wrong passwords. Try again after ${Math.ceil((u.locked_until - now()) / 60)} minutes, or reset your password.`, 429);
      if (!(await checkPassword(String(b.password || ""), u.pw, env))) {
        const fails = u.fails + 1;
        await D.prepare("UPDATE users SET fails = ?, locked_until = ? WHERE id = ?").bind(fails, fails >= 5 ? now() + 15 * 60 : 0, u.id).run();
        await log(env, u.email, "login-failed", "", ip);
        return wrong();
      }
      if (!u.verified) {
        const code = await newCode(env, u.id, "verify");
        await sendMail(env, u.email, MAIL.verify(u, code), "code");
        return json({ step: "verify", email: u.email, ...dev(env, code, u) });
      }
      const code = await newCode(env, u.id, "login");
      await sendMail(env, u.email, MAIL.login(u, code), "code");
      return json({ step: "code", email: u.email, ...dev(env, code, u) });
    }

    if (path === "login-code" && m === "POST") {
      if (await limited(env, `code:${ip}`, 15, 900)) return fail("slow", "Too many tries. Wait 15 minutes.", 429);
      const b = await body(request);
      const u = await D.prepare("SELECT * FROM users WHERE email = ?").bind(cleanEmail(b.email)).first();
      if (!u) return fail("code", "That code isn't right.");
      const r = await useCode(env, u.id, "login", b.code);
      if (r !== "ok") return fail("code", r === "expired" ? "That code has expired. Sign in again for a new one." : "That code isn't right.");
      await log(env, u.email, "login");
      return json({ user: publicUser(u) }, 200, { "set-cookie": await startSession(env, u) });
    }

    if (path === "forgot" && m === "POST") {
      if (await limited(env, `forgot:${ip}`, 5, 3600)) return fail("slow", "Too many tries. Wait an hour.", 429);
      const b = await body(request);
      const u = await D.prepare("SELECT * FROM users WHERE email = ? AND verified = 1").bind(cleanEmail(b.email)).first();
      let extra = {};
      if (u) { const code = await newCode(env, u.id, "reset"); await sendMail(env, u.email, MAIL.reset(u, code), "code"); extra = dev(env, code, u); }
      return json({ step: "reset", email: cleanEmail(b.email), ...extra }); // same answer whether or not the email exists
    }

    if (path === "reset" && m === "POST") {
      if (await limited(env, `code:${ip}`, 15, 900)) return fail("slow", "Too many tries. Wait 15 minutes.", 429);
      const b = await body(request);
      const pp = passwordProblem(b.password); if (pp) return fail("password", pp);
      const u = await D.prepare("SELECT * FROM users WHERE email = ?").bind(cleanEmail(b.email)).first();
      if (!u) return fail("code", "That code isn't right.");
      const r = await useCode(env, u.id, "reset", b.code);
      if (r !== "ok") return fail("code", r === "expired" ? "That code has expired. Ask for a new one." : "That code isn't right.");
      await D.batch([
        D.prepare("UPDATE users SET pw = ?, fails = 0, locked_until = 0 WHERE id = ?").bind(await hashPassword(b.password, env), u.id),
        D.prepare("DELETE FROM sessions WHERE user_id = ?").bind(u.id), // sign out everywhere
      ]);
      await log(env, u.email, "password-reset");
      return json({ ok: true });
    }

    if (path === "logout" && m === "POST") { await endSession(env, request); return json({ ok: true }, 200, { "set-cookie": endCookie }); }

    /* ---------- signed in only ---------- */
    const u = await currentUser(env, request);
    if (!u) return fail("auth", "Please sign in.", 401);
    // Bookings Wayne set up from an enquiry wait under the email address until that person signs in
    await D.prepare("UPDATE bookings SET user_id = ?, invite_email = NULL WHERE user_id IS NULL AND invite_email = ?").bind(u.id, u.email).run();

    if (path === "bookings" && m === "GET") {
      await bundleJobs(env);
      const { results } = await D.prepare("SELECT * FROM bookings WHERE user_id = ? ORDER BY id DESC").bind(u.id).all();
      const { results: rows } = await D.prepare("SELECT * FROM bundles WHERE user_id = ? AND active = 1 AND closed = 0 ORDER BY id DESC").bind(u.id).all();
      const t = now();
      const bundles = rows.map((x) => ({ id: x.id, size: x.size, used: x.used, expires: x.expires, extended: !!x.extended, canExtend: !x.extended && x.expires > t && x.expires - t <= BUNDLE_WARN_DAYS * 86400 }));
      const { results: pays } = await D.prepare("SELECT p.id, p.booking_id, p.amount, p.how, p.at FROM payments p JOIN bookings b ON b.id = p.booking_id WHERE b.user_id = ? ORDER BY p.id").bind(u.id).all();
      const extra = (b) => ({ receipts: pays.filter((p) => p.booking_id === b.id).map((p) => ({ id: p.id, no: receiptNo(p.id), amount: p.amount, at: p.at })), invoice: invoiceReady(b) ? invoiceNo(b) : null });
      return json({ bookings: results.map((b) => ({ ...view(b), ...extra(b) })), bundles });
    }

    const bx = path.match(/^bundle\/(\d+)\/extend$/);
    if (bx && m === "POST") {
      const x = await D.prepare("SELECT * FROM bundles WHERE id = ? AND user_id = ?").bind(Number(bx[1]), u.id).first();
      if (!x || !x.active || x.closed) return fail("missing", "Bundle not found.", 404);
      if (x.extended) return fail("extended", "This bundle has already had its one extension.");
      const t = now();
      if (x.expires <= t) return fail("ended", "This bundle has already ended.");
      if (x.expires - t > BUNDLE_WARN_DAYS * 86400) return fail("early", `You can extend in the last ${BUNDLE_WARN_DAYS} days before it ends.`);
      const expires = await extendBundle(env, x, u.email);
      return json({ ok: true, expires });
    }

    if (path === "quote" && m === "POST") {
      const b = await body(request);
      return json(priceFor(b.service, b.postcode, { bundleListing: !!b.useBundle, size: b.size, extras: b.extras, buildings: b.buildings }));
    }

    if (path === "book" && m === "POST") {
      if (await limited(env, `book:${u.id}`, 20, 86400)) return fail("slow", "That's a lot of bookings for one day. Get in touch and I'll help.", 429);
      const b = await body(request);
      const postcode = tidyPostcode(b.postcode);
      if (!postcode) return fail("postcode", "Add the full postcode of the site, e.g. TS17 6AB.");
      if (!["consumer", "business"].includes(b.bookingAs)) return fail("as", "Say whether you're booking as a private customer or a business.");
      const buyingBundle = b.service === "bundle" && !b.useBundle;
      const date = b.date ? String(b.date) : "";
      if (!date && !buyingBundle) return fail("date", "Pick the date you'd like. Wayne confirms it after checking the weather.");
      if (date) { const dp = dateProblem(date); if (dp) return fail("date", dp); }
      const tp = timeProblem(b.time); if (tp) return fail("time", tp);
      // Who owns the property (Wayne, 16 Nov 2026): flying needs the owner's OK
      const OWNER = { own: "The customer owns it", act: "The customer acts for the owner (agent or manager)", agreed: "Not the customer's: they say the owner has agreed. Check before flying" };
      if (!buyingBundle && b.owner === "not-yet") return fail("owner", "I can only fly a property with the owner's OK. Ask the owner (or the seller's agent) first, then book.");
      if (!buyingBundle && !OWNER[b.owner]) return fail("owner", "Say whether you own the property, act for the owner, or the owner has agreed.");
      let bundle = null;
      if (b.useBundle) {
        bundle = await D.prepare("SELECT * FROM bundles WHERE user_id = ? AND active = 1 AND closed = 0 AND used < size AND expires > ? ORDER BY id LIMIT 1").bind(u.id, now()).first();
        if (!bundle) return fail("bundle", "You don't have a bundle with listings left.");
      }
      const p = priceFor(b.service, postcode, { bundleListing: !!bundle, size: b.size, extras: b.extras, buildings: b.buildings });
      if (p.error) return fail(p.error, p.message);
      const ref = `HD-${randomHex(3).toUpperCase()}`;
      const status = "awaiting_signature"; // sign first, then pay (Wayne, 15 Nov 2026)
      await D.prepare(`INSERT INTO bookings (ref, user_id, service_id, service, postcode, address, wanted_date, wanted_time, notes, booking_as, early_start, agreement, agreed_at,
        base, travel, total, mode, due_now, status, bundle_id, created, updated, extras, branding, owner) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`)
        .bind(ref, u.id, bundle ? "bundle-listing" : b.service, p.name, postcode, clean(b.address, 200), date || null, clean(b.time, 20), clean(b.notes, 1000), b.bookingAs, 0,
          AGREEMENT_VERSION, null, p.base, p.travel, p.total, p.mode, p.dueNow, status, bundle ? bundle.id : null, now(), now(), p.extras || null, p.branding || null, buyingBundle ? null : OWNER[b.owner]).run();
      const row = await D.prepare("SELECT * FROM bookings WHERE ref = ?").bind(ref).first();
      if (bundle) await D.prepare("UPDATE bundles SET used = used + 1 WHERE id = ?").bind(bundle.id).run();
      if (b.service === "bundle" && !bundle) await D.prepare("INSERT INTO bundles (user_id, booking_id, size, created) VALUES (?, ?, ?, ?)").bind(u.id, row.id, bundleSize, now()).run();
      await log(env, u.email, "booked", ref, `${p.name} £${p.total}`);
      await sendMail(env, u.email, MAIL.started(u, row), "started");
      return json({ booking: view(row) });
    }

    const one = path.match(/^booking\/(HD-[A-F0-9]{6})(?:\/(pay|cancel|check|sign|agreement|decline|date|receipt|invoice))?(?:\/(\d+))?$/);
    if (one) {
      const b = await D.prepare("SELECT * FROM bookings WHERE ref = ? AND user_id = ?").bind(one[1], u.id).first();
      if (!b) return fail("missing", "Booking not found.", 404);
      if (!one[2] && m === "GET") {
        const { results: pays } = await D.prepare("SELECT id, amount, how, at FROM payments WHERE booking_id = ? ORDER BY id").bind(b.id).all();
        return json({ booking: { ...view(b), receipts: pays.map((p) => ({ id: p.id, no: receiptNo(p.id), amount: p.amount, how: p.how, at: p.at })), invoice: invoiceReady(b) ? invoiceNo(b) : null } });
      }
      if (one[2] === "receipt" && m === "GET" && one[3]) {
        const pay = await D.prepare("SELECT * FROM payments WHERE id = ? AND booking_id = ?").bind(Number(one[3]), b.id).first();
        if (!pay) return fail("missing", "Receipt not found.", 404);
        return docResponse(receiptHtml(pay, b, u), `Happy-Drones-Receipt-${receiptNo(pay.id)}.html`);
      }
      if (one[2] === "invoice" && m === "GET") {
        if (!invoiceReady(b)) return fail("missing", "There's no invoice for this booking yet. Invoices go out once the work is done.", 404);
        return docResponse(invoiceHtml(b, u, env.BANK_DETAILS || "", b.delivered_at || b.go_at || b.updated), `Happy-Drones-Invoice-${invoiceNo(b)}.html`);
      }
      // Ask for a different date. Before Wayne confirms, the wanted date just changes.
      // After he confirms, it's a request: nothing moves until he confirms a new date.
      if (one[2] === "date" && m === "POST") {
        if (["cancelled", "delivered", "cancel_requested"].includes(b.status)) return fail("state", "This booking's date can't be changed online. Get in touch instead.");
        const x = await body(request);
        const dp = dateProblem(x.date); if (dp) return fail("date", dp);
        const tp = timeProblem(x.time); if (tp) return fail("time", tp);
        const time = clean(x.time, 20);
        if (!b.go_at) {
          await D.prepare("UPDATE bookings SET wanted_date = ?, wanted_time = ?, updated = ? WHERE id = ?").bind(x.date, time, now(), b.id).run();
          await log(env, u.email, "date-changed", b.ref, `${b.wanted_date || "none"} to ${x.date} ${time}`);
          const fresh = await D.prepare("SELECT * FROM bookings WHERE id = ?").bind(b.id).first();
          if (env.ADMIN_EMAIL) await sendMail(env, env.ADMIN_EMAIL, MAIL.dateChanged(u, fresh, b.wanted_date), "admin");
          return json({ booking: view(fresh), message: "Done: your date has changed. Wayne confirms it after checking the weather." });
        }
        await D.prepare("UPDATE bookings SET move_request = ?, updated = ? WHERE id = ?").bind(JSON.stringify({ date: x.date, time, at: now() }), now(), b.id).run();
        await log(env, u.email, "move-asked", b.ref, `to ${x.date} ${time}`);
        if (env.ADMIN_EMAIL) await sendMail(env, env.ADMIN_EMAIL, MAIL.moveAsked(u, b, { date: x.date, time }), "admin");
        const fresh = await D.prepare("SELECT * FROM bookings WHERE id = ?").bind(b.id).first();
        return json({ booking: view(fresh), message: "Sent: Wayne will confirm the new date or get in touch. Until then your booking stays on its current date." });
      }
      if (one[2] === "pay" && m === "POST") {
        if (!b.signed_at) return fail("sign", "Please sign the booking agreement first.");
        if (b.pending) return fail("changes", "Please approve or decline the changes to this booking first.");
        const due = owed(b);
        if (due <= 0) return fail("nothing", "Nothing to pay on this booking.");
        const purpose = b.paid === 0 && b.mode === "deposit" ? "deposit" : b.paid === 0 ? "payment" : "balance";
        if (env.STRIPE_SECRET_KEY) {
          const s = await stripeCheckout(env, b, u, due, purpose, new URL(request.url).origin);
          await D.prepare("UPDATE bookings SET stripe_session = ?, updated = ? WHERE id = ?").bind(s.id, now(), b.id).run();
          return json({ url: s.url });
        }
        if (!testMode(env)) return fail("pay", "Online payment isn't switched on yet. I'll send you a payment link.", 503);
        const done = await recordPayment(env, b.ref, due, `${u.email} (test payment)`, "Card (test payment, no money taken)");
        return json({ booking: view(done), simulated: true });
      }
      if (one[2] === "check" && m === "POST") {
        // Back from Stripe: ask Stripe directly rather than waiting for the webhook
        if (b.stripe_session && env.STRIPE_SECRET_KEY && owed(b) > 0) {
          const s = await stripeSession(env, b.stripe_session);
          if (s && s.metadata?.ref === b.ref) await settleSession(env, s, `${u.email} (back from Stripe)`);
        }
        const fresh = await D.prepare("SELECT * FROM bookings WHERE id = ?").bind(b.id).first();
        return json({ booking: view(fresh), paid: owed(fresh) === 0 });
      }
      /* ---------- the booking agreement: read, sign, approve changes ---------- */
      if (one[2] === "agreement" && m === "GET" && !one[3]) {
        const next = withPending(b);
        const { terms, cancel } = await currentTerms(env, request);
        const { results: sigs } = await D.prepare("SELECT id, kind, name, at FROM signatures WHERE booking_id = ? ORDER BY id DESC").bind(b.id).all();
        const date = next.confirmed_date || next.wanted_date;
        const soon = next.booking_as === "consumer" && (!date || date <= new Date(Date.now() + 14 * 864e5).toISOString().slice(0, 10));
        return json({ ref: b.ref, toSign: b.pending ? "change" : b.status === "awaiting_signature" ? "original" : null, rows: jobRows(next, u), changes: changeList(b),
          terms, cancel, version: AGREEMENT_VERSION, consumer: next.booking_as === "consumer", askEarly: soon, early: !!b.early_start, name: plainName(u.name), signatures: sigs,
          dueAfter: next.due_now > b.paid ? next.due_now - b.paid : 0 });
      }
      if (one[2] === "agreement" && m === "GET" && one[3]) {
        const sig = await D.prepare("SELECT * FROM signatures WHERE id = ? AND booking_id = ?").bind(Number(one[3]), b.id).first();
        if (!sig) return fail("missing", "Signed agreement not found.", 404);
        return signedFile(D, sig, b);
      }
      if (one[2] === "sign" && m === "POST") {
        const kind = b.pending ? "change" : b.status === "awaiting_signature" ? "original" : null;
        if (!kind) return fail("state", "There's nothing to sign on this booking.");
        if (await limited(env, `sign:${u.id}`, 20, 3600)) return fail("slow", "Too many tries. Wait a while and try again.", 429);
        const x = await body(request);
        if (!x.agree) return fail("agree", "Tick to say you've read and agree to the booking agreement and Job Details.");
        const typed = String(x.name || "").trim().replace(/\s+/g, " ");
        if (!sameName(typed, u.name)) { const ok = signerNames(u.name); return fail("name", `Type your full name as it is on your account: ${ok.length > 1 ? ok.slice(1).join(" or ") : plainName(u.name)}. If that's not right, change it under My details first.`); }
        const when = b.confirmed_date || b.wanted_date;
        if (when && when < ukToday() && b.status !== "delivered") return fail("date", "The date on this booking has passed. Ask for a new date first (Change the date), then sign.");
        const next = withPending(b);
        const early = next.booking_as === "consumer" && x.earlyStart ? 1 : 0;
        const { terms, cancel } = await currentTerms(env, request);
        const termsHash = await fingerprint([AGREEMENT_VERSION, terms, cancel]);
        await D.prepare("INSERT OR IGNORE INTO agreement_texts (hash, version, terms, cancel, created) VALUES (?, ?, ?, ?, ?)").bind(termsHash, AGREEMENT_VERSION, terms, cancel, now()).run();
        const rows = jobRows(next, u), at = now(), ip = ipOf(request), ua = (request.headers.get("user-agent") || "").slice(0, 300);
        const fp = await fingerprint({ ref: b.ref, version: AGREEMENT_VERSION, termsHash, rows, name: typed, email: u.email, at, early, kind });
        const ins = await D.prepare(`INSERT INTO signatures (booking_id, user_id, kind, name, email, at, ip, ua, version, terms_hash, job, early, fingerprint)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).bind(b.id, u.id, kind, typed, u.email, at, ip, ua, AGREEMENT_VERSION, termsHash, JSON.stringify(rows), early, fp).run();
        const sigId = ins.meta.last_row_id;
        const fields = b.pending ? JSON.parse(b.pending) : {};
        const keys = Object.keys(fields).filter((k) => CONTRACT_FIELDS.includes(k) || k === "notes");
        let status = b.status;
        if (["awaiting_signature", "awaiting_payment", "requested"].includes(b.status)) status = next.due_now > next.paid ? "awaiting_payment" : "requested";
        await D.prepare(`UPDATE bookings SET ${keys.map((k) => `${k} = ?, `).join("")}status = ?, signed_at = ?, signature_id = ?, agreement = ?, agreed_at = ?, early_start = ?, pending = NULL, pending_at = NULL, updated = ? WHERE id = ?`)
          .bind(...keys.map((k) => fields[k]), status, at, sigId, AGREEMENT_VERSION, at, early, at, b.id).run();
        await log(env, u.email, kind === "change" ? "changes-signed" : "signed", b.ref, `fingerprint ${fp.slice(0, 12)}`);
        const fresh = await D.prepare("SELECT * FROM bookings WHERE id = ?").bind(b.id).first();
        const sig = await D.prepare("SELECT * FROM signatures WHERE id = ?").bind(sigId).first();
        const file = await signedHtml(D, sig, fresh);
        const attach = [{ filename: `Happy-Drones-Booking-Agreement-${b.ref}.html`, content: toBase64(file) }];
        await sendMail(env, u.email, MAIL.signed(u, fresh, { name: typed, when: ukTime(at), version: AGREEMENT_VERSION, fingerprint: fp }), "signed", attach);
        if (env.ADMIN_EMAIL) await sendMail(env, env.ADMIN_EMAIL, kind === "change" ? MAIL.approved(u, fresh) : MAIL.adminNew(u, fresh, await sameDay(D, fresh)), "admin", attach);
        return json({ booking: view(fresh), signatureId: sigId, fingerprint: fp });
      }
      if (one[2] === "decline" && m === "POST") {
        if (!b.pending) return fail("state", "There are no changes waiting on this booking.");
        await D.prepare("UPDATE bookings SET pending = NULL, pending_at = NULL, updated = ? WHERE id = ?").bind(now(), b.id).run();
        await log(env, u.email, "changes-declined", b.ref);
        if (env.ADMIN_EMAIL) await sendMail(env, env.ADMIN_EMAIL, MAIL.declined(u, b), "admin");
        const fresh = await D.prepare("SELECT * FROM bookings WHERE id = ?").bind(b.id).first();
        return json({ booking: view(fresh) });
      }

      if (one[2] === "cancel" && m === "POST") {
        if (["cancelled", "delivered", "cancel_requested"].includes(b.status)) return fail("state", "This booking can't be cancelled online.");
        const status = b.status === "confirmed" ? "cancel_requested" : "cancelled";
        await D.prepare("UPDATE bookings SET status = ?, updated = ? WHERE id = ?").bind(status, now(), b.id).run();
        if (b.bundle_id && status === "cancelled") await D.prepare("UPDATE bundles SET used = MAX(0, used - 1) WHERE id = ?").bind(b.bundle_id).run();
        if (b.service_id === "bundle" && status === "cancelled") await D.prepare("UPDATE bundles SET closed = 1 WHERE booking_id = ?").bind(b.id).run();
        await log(env, u.email, status, b.ref);
        if (status === "cancelled") await sendMail(env, u.email, MAIL.cancelled(u, b), "cancelled");
        if (env.ADMIN_EMAIL) await sendMail(env, env.ADMIN_EMAIL, status === "cancelled" ? MAIL.adminCancelled(u, b) : [`Cancellation request: ${b.ref}`, `${u.name} (${u.email}) ${status === "cancelled" ? "cancelled" : "asked to cancel"} ${b.service} at ${b.postcode}. Paid so far: £${b.paid}. Check the booking agreement for any refund.`], "admin");
        return json({ booking: view({ ...b, status }) });
      }
    }

    if (path === "profile" && m === "POST") {
      const b = await body(request);
      const name = clean(b.name, 80); if (name.length < 2) return fail("name", "Add your name.");
      await D.prepare("UPDATE users SET name = ?, phone = ?, company = ?, marketing = ? WHERE id = ?").bind(name, clean(b.phone, 30), clean(b.company, 120), b.marketing ? 1 : 0, u.id).run();
      await log(env, u.email, "profile");
      return json({ user: publicUser({ ...u, name, phone: clean(b.phone, 30), company: clean(b.company, 120), marketing: b.marketing ? 1 : 0 }) });
    }

    if (path === "password" && m === "POST") {
      const b = await body(request);
      if (!(await checkPassword(String(b.current || ""), u.pw, env))) return fail("current", "Your current password isn't right.");
      const pp = passwordProblem(b.password); if (pp) return fail("password", pp);
      await D.prepare("UPDATE users SET pw = ? WHERE id = ?").bind(await hashPassword(b.password, env), u.id).run();
      await D.prepare("DELETE FROM sessions WHERE user_id = ?").bind(u.id).run();
      await log(env, u.email, "password-changed");
      return json({ ok: true }, 200, { "set-cookie": await startSession(env, u) });
    }

    if (path === "export" && m === "GET") {
      const { results } = await D.prepare("SELECT * FROM bookings WHERE user_id = ?").bind(u.id).all();
      const { results: bundles } = await D.prepare("SELECT * FROM bundles WHERE user_id = ?").bind(u.id).all();
      const ids = results.map((r) => r.id), refs = results.map((r) => r.ref), marks = (n) => Array(n).fill("?").join(",");
      const all = async (sql, ...v) => (await D.prepare(sql).bind(...v).all()).results;
      const signatures = ids.length ? await all(`SELECT booking_id, kind, name, email, at, ip, ua, version, fingerprint, early, job FROM signatures WHERE booking_id IN (${marks(ids.length)})`, ...ids) : [];
      const enquiries = (await all("SELECT ref, kind, name, email, phone, company, postcode, summary, price, fields, status, note, booking_ref, created FROM enquiries WHERE email = ?", u.email)).map((e) => ({ ...e, fields: JSON.parse(e.fields) }));
      const activity = await all(`SELECT at, actor, action, target, detail FROM audit WHERE actor = ?${refs.length ? ` OR target IN (${marks(refs.length)})` : ""} ORDER BY id`, u.email, ...refs);
      const emails = await all("SELECT created, subject, body, sent FROM outbox WHERE to_addr = ? ORDER BY id", u.email);
      await log(env, u.email, "export");
      const data = { exported: new Date().toISOString(), account: publicUser(u), created: new Date(u.created * 1000).toISOString(), lastSignIn: u.last_login ? new Date(u.last_login * 1000).toISOString() : null,
        bookings: results, bundles, signedAgreements: signatures.map((g) => ({ ...g, job: JSON.parse(g.job) })), enquiries, activity, emailsSentToYou: emails,
        note: "This is everything Happy Drones holds about you in its booking system: your account, bookings (with Wayne's notes on them), signed agreements, enquiries, the activity log and copies of emails sent to you in the last 30 days. Your password is stored scrambled and can't be shown. Card details are held by Stripe, not here." };
      return new Response(JSON.stringify(data, null, 2), { headers: { "content-type": "application/json", "content-disposition": `attachment; filename="happy-drones-my-data.json"`, "cache-control": "no-store" } });
    }

    if (path === "delete" && m === "POST") {
      const b = await body(request);
      if (!(await checkPassword(String(b.password || ""), u.pw, env))) return fail("current", "Your password isn't right.");
      if (u.role === "admin") return fail("admin", "The admin account can't be deleted here.");
      await sendMail(env, u.email, MAIL.deleted(u), "deleted");
      await deleteUser(env, u.id);
      await log(env, `user ${u.id}`, "account-deleted");
      return json({ ok: true }, 200, { "set-cookie": endCookie });
    }

    return fail("missing", "Not found.", 404);
  } catch (e) {
    if (e.message === "no-db") return fail("setup", "Accounts aren't switched on yet.", 503);
    return fail("server", "Something went wrong. Try again in a minute.", 500);
  }
}

/* What's still to pay right now */
function owed(b) {
  if (b.status === "cancelled") return 0;
  if (b.mode === "invoice" || b.mode === "none") return 0;
  if (b.paid < b.due_now) return b.due_now - b.paid;
  if (b.status === "delivered" && b.paid < b.total) return b.total - b.paid; // the balance, before the files unlock
  return 0;
}
/* What the customer sees: files only once paid in full (or on invoice terms) */
const invoiceReady = (b) => b.mode === "invoice" && ["delivered"].includes(b.status);
function view(b) {
  const unlocked = b.status === "delivered" && (b.mode === "invoice" || b.paid >= b.total);
  return { ref: b.ref, service: b.service, serviceId: b.service_id, postcode: b.postcode, address: b.address, wantedDate: b.wanted_date, wantedTime: b.wanted_time,
    confirmedDate: b.confirmed_date, confirmedTime: b.confirmed_time, notes: b.notes, bookingAs: b.booking_as, total: b.total, travel: b.travel, mode: b.mode,
    dueNow: b.due_now, paid: b.paid, owed: owed(b), status: b.status, files: unlocked ? b.files : null, filesWaiting: b.status === "delivered" && !unlocked,
    agreement: b.agreement, created: b.created, signed: !!b.signed_at, signedAt: b.signed_at, signatureId: b.signature_id, changes: changeList(b), go: !!b.go_at, refunded: b.refunded || 0,
    owner: b.owner, moveRequest: b.move_request ? JSON.parse(b.move_request) : null, extras: b.extras, branding: b.branding };
}

