/* /api/admin/* : Wayne's admin (the /admin page). Admin role only:
   the account whose email matches ADMIN_EMAIL, signed in with
   password + emailed code. Every change is written to the activity log. */
import { json, fail, now, testMode, sameSite, body, db, tidy, log, currentUser, publicUser, hashPassword, passwordProblem,
  MAIL, sendMail, recordPayment, deleteUser, bundleJobs, extendBundle, randomHex } from "../../../lib/acct/server.js";
import { CONTRACT_FIELDS, changeList, signedFile, defaultsFor } from "../../../lib/acct/agreement.js";
import { depositFor } from "../../../lib/site.js";
import { CATALOG, priceFor, tidyPostcode, AGREEMENT_VERSION } from "../../../lib/acct/catalog.js";

const clean = (s, n = 500) => String(s || "").replace(/[\u0000-\u001f]/g, " ").trim().slice(0, n);
const DATE = /^\d{4}-\d{2}-\d{2}$/;

export async function onRequest({ request, env, params }) {
  const path = (params.path || []).join("/");
  if (!sameSite(request)) return fail("origin", "Not allowed.", 403);
  try {
    const D = await db(env);
    const me = await currentUser(env, request);
    if (!me) return fail("auth", "Please sign in.", 401);
    if (me.role !== "admin") return fail("forbidden", "This page is for Happy Drones only.", 403);
    const actor = me.email, m = request.method;

    if (path === "overview" && m === "GET") {
      await tidy(env);
      await bundleJobs(env);
      const q = (sql) => D.prepare(sql).first();
      const [c, b, o, n, tc, nq, eq] = await Promise.all([
        q("SELECT COUNT(*) n FROM users WHERE role = 'customer'"),
        q("SELECT COUNT(*) n FROM bookings"),
        q("SELECT COUNT(*) n FROM bookings WHERE status IN ('requested','awaiting_payment','cancel_requested')"),
        q("SELECT COUNT(*) n FROM bookings WHERE status = 'confirmed'"),
        q("SELECT COUNT(*) n FROM users WHERE test = 1"),
        q("SELECT COUNT(*) n FROM enquiries WHERE status = 'new'"),
        q("SELECT COUNT(*) n FROM enquiries"),
      ]);
      return json({ me: publicUser(me), counts: { customers: c.n, bookings: b.n, toDo: o.n, upcoming: n.n, testCustomers: tc.n, newEnquiries: nq.n, enquiries: eq.n }, config: { test: testMode(env), stripe: !!env.STRIPE_SECRET_KEY, mail: !!env.RESEND_KEY } });
    }

    if (path === "bookings" && m === "GET") {
      const status = new URL(request.url).searchParams.get("status") || "";
      const sql = `SELECT b.*, COALESCE(u.name, b.invite_email) name, COALESCE(u.email, b.invite_email) email FROM bookings b LEFT JOIN users u ON u.id = b.user_id ${status ? "WHERE b.status = ?" : ""} ORDER BY b.id DESC LIMIT 300`;
      const { results } = status ? await D.prepare(sql).bind(status).all() : await D.prepare(sql).all();
      return json({ bookings: results });
    }

    const sf = path.match(/^booking\/(HD-[A-F0-9]{6})\/agreement\/(\d+)$/);
    if (sf && m === "GET") {
      const b = await D.prepare("SELECT * FROM bookings WHERE ref = ?").bind(sf[1]).first();
      const sig = b && await D.prepare("SELECT * FROM signatures WHERE id = ? AND booking_id = ?").bind(Number(sf[2]), b.id).first();
      if (!sig) return fail("missing", "Signed agreement not found.", 404);
      return signedFile(D, sig, b);
    }

    const one = path.match(/^booking\/(HD-[A-F0-9]{6})$/);
    if (one) {
      const b = await D.prepare("SELECT b.*, u.name, u.email, u.phone, u.company FROM bookings b LEFT JOIN users u ON u.id = b.user_id WHERE b.ref = ?").bind(one[1]).first();
      if (!b) return fail("missing", "Booking not found.", 404);
      if (m === "GET") {
        const { results: history } = await D.prepare("SELECT * FROM audit WHERE target = ? ORDER BY id DESC LIMIT 50").bind(b.ref).all();
        const { results: signatures } = await D.prepare("SELECT id, kind, name, at, ip, version, fingerprint, early FROM signatures WHERE booking_id = ? ORDER BY id DESC").bind(b.id).all();
        return json({ booking: { ...b, ...Object.fromEntries(Object.entries(defaultsFor(b)).map(([k, v]) => [k, b[k] ?? v])) }, history, signatures, changes: changeList(b) });
      }
      const x = await body(request);
      const u = b.user_id ? await D.prepare("SELECT * FROM users WHERE id = ?").bind(b.user_id).first() : null;
      const set = async (sql, ...v) => D.prepare(`UPDATE bookings SET ${sql}, updated = ? WHERE id = ?`).bind(...v, now(), b.id).run();
      switch (x.action) {
        case "confirm": { // "It's a go": Wayne accepts the signed agreement and fixes the date
          if (!DATE.test(x.date || "")) return fail("date", "Pick the flying date.");
          if (!b.signed_at) return fail("unsigned", "They haven't signed the booking agreement yet.");
          if (b.pending) return fail("pending", "They haven't approved your changes yet. Wait for that, or undo the changes.");
          if (b.mode !== "invoice" && b.paid < b.due_now && !x.anyway) return fail("unpaid", `The ${b.mode === "deposit" ? "deposit" : "payment"} of £${b.due_now - b.paid} isn't paid yet. Record it first if they paid another way.`);
          const again = !!b.go_at;
          await set("confirmed_date = ?, confirmed_time = ?, status = 'confirmed', go_at = COALESCE(go_at, ?)", x.date, clean(x.time, 20), now());
          await log(env, actor, again ? "date-changed" : "its-a-go", b.ref, `${x.date} ${clean(x.time, 20)}`);
          if (u) await sendMail(env, u.email, MAIL.confirmed(u, { ...b, confirmed_date: x.date, confirmed_time: clean(x.time, 20) }, again), "confirmed");
          break;
        }
        case "edit": { // changes agreed by phone, WhatsApp or email
          const p = x.changes || {};
          const ch = {};
          const txt = { service: 120, address: 200, postcode: 10, deliverables: 1500, delivery: 200, licence: 200, branding: 200, extras: 500, notes: 1000 };
          for (const [k, n] of Object.entries(txt)) if (k in p && clean(p[k], n) !== (b[k] ?? defaultsFor(b)[k] ?? "")) ch[k] = clean(p[k], n);
          if (ch.postcode) { ch.postcode = ch.postcode.toUpperCase(); if (!/^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/.test(ch.postcode)) return fail("postcode", "That postcode doesn't look right."); }
          if ("total" in p || "travel" in p || "mode" in p) {
            const total = "total" in p ? Math.round(Number(p.total)) : b.total, travel = "travel" in p ? Math.round(Number(p.travel)) : b.travel;
            const mode = ["deposit", "invoice"].includes(p.mode) ? p.mode : b.mode;
            if (!(total >= 0 && travel >= 0 && travel <= total)) return fail("price", "Check the price and travel amounts.");
            if (total < b.paid) return fail("price", `They've already paid £${b.paid}. Record a refund first if the price is going down below that.`);
            const due = mode === "deposit" ? depositFor(total) : mode === "invoice" ? 0 : b.due_now;
            if (total !== b.total) ch.total = total;
            if (travel !== b.travel) ch.travel = travel;
            if (total - travel !== b.base) ch.base = total - travel;
            if (mode !== b.mode) ch.mode = mode;
            if (due !== b.due_now) ch.due_now = due;
          }
          const direct = {};
          if ("wanted_date" in p && (p.wanted_date === "" || DATE.test(p.wanted_date)) && p.wanted_date !== (b.wanted_date || "")) direct.wanted_date = p.wanted_date;
          if ("wanted_time" in p && clean(p.wanted_time, 20) !== (b.wanted_time || "")) direct.wanted_time = clean(p.wanted_time, 20);
          if (!Object.keys(ch).length && !Object.keys(direct).length) return fail("same", "Nothing has changed.");
          if (Object.keys(direct).length) await set(Object.keys(direct).map((k) => `${k} = ?`).join(", "), ...Object.values(direct));
          if (Object.keys(ch).length) {
            if (!b.signed_at) {
              // Not signed yet: change it straight away; they'll sign the updated version
              await set(Object.keys(ch).map((k) => `${k} = ?`).join(", "), ...Object.values(ch));
            } else {
              const merged = { ...(b.pending ? JSON.parse(b.pending) : {}), ...ch };
              await set("pending = ?, pending_at = ?", JSON.stringify(merged), now());
              const after = await D.prepare("SELECT * FROM bookings WHERE id = ?").bind(b.id).first();
              if (u) await sendMail(env, u.email, MAIL.changes(u, after, changeList(after)), "changes");
            }
          }
          await log(env, actor, b.signed_at && Object.keys(ch).length ? "changes-proposed" : "edited", b.ref, Object.keys({ ...ch, ...direct }).join(", "));
          break;
        }
        case "undo-changes": {
          if (!b.pending) return fail("state", "No changes are waiting.");
          await set("pending = NULL, pending_at = NULL");
          await log(env, actor, "changes-withdrawn", b.ref);
          break;
        }
        case "refund": {
          const amount = Math.round(Number(x.amount));
          const left = b.paid - (b.refunded || 0);
          if (!(amount > 0 && amount <= left)) return fail("amount", `Enter an amount up to £${left}.`);
          await set("refunded = refunded + ?", amount);
          await log(env, actor, "refund", b.ref, `£${amount} ${clean(x.how, 60)}`);
          if (u) await sendMail(env, u.email, MAIL.refund(u, b, amount), "refund");
          break;
        }
        case "deliver": {
          const link = clean(x.files, 500);
          if (!/^https:\/\/\S+$/.test(link)) return fail("files", "Paste the Drive folder link (starting https://).");
          if (!b.signed_at) return fail("unsigned", "They haven't signed the booking agreement yet.");
          await set("files = ?, status = 'delivered'", link);
          await log(env, actor, "delivered", b.ref);
          const balance = b.mode === "deposit" ? b.total - b.paid : 0;
          if (u) await sendMail(env, u.email, MAIL.delivered(u, b, balance > 0 ? balance : 0), "delivered");
          break;
        }
        case "paid": {
          const amount = Math.round(Number(x.amount));
          if (!(amount > 0 && amount <= b.total - b.paid)) return fail("amount", `Enter an amount up to £${b.total - b.paid}.`);
          await recordPayment(env, b.ref, amount, `${actor} (marked paid: ${clean(x.how, 40) || "manual"})`);
          break;
        }
        case "cancel": {
          await set("status = 'cancelled'");
          if (b.bundle_id) await D.prepare("UPDATE bundles SET used = MAX(0, used - 1) WHERE id = ?").bind(b.bundle_id).run();
          if (b.service_id === "bundle") await D.prepare("UPDATE bundles SET closed = 1 WHERE booking_id = ?").bind(b.id).run();
          await log(env, actor, "cancelled", b.ref, clean(x.reason, 200));
          if (u) await sendMail(env, u.email, MAIL.cancelled(u, b), "cancelled");
          break;
        }
        case "note": {
          await set("admin_note = ?", clean(x.note, 2000));
          await log(env, actor, "note", b.ref);
          break;
        }
        case "reopen": {
          const back = !b.signed_at ? "awaiting_signature" : b.mode !== "invoice" && b.paid < b.due_now ? "awaiting_payment" : "requested";
          await set("status = ?, confirmed_date = NULL, confirmed_time = NULL", back);
          if (b.service_id === "bundle") await D.prepare("UPDATE bundles SET closed = 0, refund = 0 WHERE booking_id = ? AND (expires IS NULL OR expires > ?)").bind(b.id, now()).run();
          await log(env, actor, "reopened", b.ref);
          break;
        }
        default: return fail("action", "Unknown action.");
      }
      const fresh = await D.prepare("SELECT b.*, u.name, u.email, u.phone, u.company FROM bookings b LEFT JOIN users u ON u.id = b.user_id WHERE b.ref = ?").bind(b.ref).first();
      return json({ booking: fresh });
    }

    if (path === "customers" && m === "GET") {
      const q = `%${(new URL(request.url).searchParams.get("q") || "").trim()}%`;
      const { results } = await D.prepare(`SELECT u.id, u.email, u.name, u.company, u.phone, u.role, u.verified, u.marketing, u.test, u.created, u.last_login,
        (SELECT COUNT(*) FROM bookings b WHERE b.user_id = u.id) bookings FROM users u WHERE u.email LIKE ? OR u.name LIKE ? OR u.company LIKE ? ORDER BY u.id DESC LIMIT 300`).bind(q, q, q).all();
      return json({ customers: results });
    }

    const cust = path.match(/^customer\/(\d+)(?:\/(delete|export))?$/);
    if (cust) {
      const u = await D.prepare("SELECT * FROM users WHERE id = ?").bind(Number(cust[1])).first();
      if (!u) return fail("missing", "Customer not found.", 404);
      if (!cust[2] && m === "GET") {
        const { results: bookings } = await D.prepare("SELECT * FROM bookings WHERE user_id = ? ORDER BY id DESC").bind(u.id).all();
        const { results: bundles } = await D.prepare("SELECT * FROM bundles WHERE user_id = ?").bind(u.id).all();
        return json({ customer: { ...publicUser(u), verified: !!u.verified, created: u.created, last_login: u.last_login, locked: u.locked_until > now() }, bookings, bundles });
      }
      if (cust[2] === "export" && m === "GET") {
        const { results } = await D.prepare("SELECT * FROM bookings WHERE user_id = ?").bind(u.id).all();
        await log(env, actor, "exported", `user ${u.id}`);
        return new Response(JSON.stringify({ exported: new Date().toISOString(), account: publicUser(u), bookings: results }, null, 2), { headers: { "content-type": "application/json", "content-disposition": `attachment; filename="customer-${u.id}.json"`, "cache-control": "no-store" } });
      }
      if (cust[2] === "delete" && m === "POST") {
        if (u.role === "admin") return fail("admin", "The admin account can't be deleted.");
        if (!u.test) await sendMail(env, u.email, MAIL.deleted(u), "deleted");
        await deleteUser(env, u.id);
        await log(env, actor, "customer-deleted", `user ${u.id}`);
        return json({ ok: true });
      }
    }

    const bx = path.match(/^bundle\/(\d+)\/extend$/);
    if (bx && m === "POST") {
      const x = await D.prepare("SELECT * FROM bundles WHERE id = ?").bind(Number(bx[1])).first();
      if (!x || !x.active || x.closed) return fail("missing", "No open bundle with that number.", 404);
      if (x.extended) return fail("extended", "This bundle has already had its extension.");
      const expires = await extendBundle(env, x, actor);
      return json({ ok: true, expires });
    }

    /* ---------- enquiries from the website forms ---------- */
    if (path === "enquiries" && m === "GET") {
      const f = new URL(request.url).searchParams.get("status") || "open";
      const where = f === "open" ? "WHERE status IN ('new','contacted','quoted')" : f === "all" ? "" : "WHERE status = ?";
      const st = D.prepare(`SELECT id, ref, kind, name, email, phone, postcode, service_id, summary, price, status, booking_ref, created FROM enquiries ${where} ORDER BY (status = 'new') DESC, id DESC LIMIT 300`);
      const { results } = where.includes("?") ? await st.bind(f).all() : await st.all();
      return json({ enquiries: results });
    }
    const eq = path.match(/^enquiry\/(Q-[A-F0-9]{6})$/);
    if (eq) {
      const q = await D.prepare("SELECT * FROM enquiries WHERE ref = ?").bind(eq[1]).first();
      if (!q) return fail("missing", "Enquiry not found.", 404);
      const { token_hash, ...pub } = q;
      if (m === "GET") {
        const acct = q.email ? await D.prepare("SELECT id, name FROM users WHERE email = ?").bind(q.email).first() : null;
        const { results: history } = await D.prepare("SELECT * FROM audit WHERE target = ? ORDER BY id DESC LIMIT 50").bind(q.ref).all();
        return json({ enquiry: { ...pub, fields: JSON.parse(q.fields) }, account: acct, history });
      }
      const x = await body(request);
      const upd = (sql, ...v) => D.prepare(`UPDATE enquiries SET ${sql}, updated = ? WHERE id = ?`).bind(...v, now(), q.id).run();
      if (x.action === "status") {
        if (!["new", "contacted", "quoted", "lost", "scrapped"].includes(x.status)) return fail("status", "Unknown status.");
        await upd("status = ?", x.status); await log(env, actor, `enquiry-${x.status}`, q.ref);
      } else if (x.action === "note") {
        await upd("note = ?", clean(x.note, 2000)); await log(env, actor, "enquiry-note", q.ref);
      } else if (x.action === "delete") {
        await D.prepare("DELETE FROM enquiries WHERE id = ?").bind(q.id).run(); await log(env, actor, "enquiry-deleted", q.ref);
        return json({ ok: true, deleted: true });
      } else if (x.action === "book") {
        // Turn the enquiry into a booking they sign and pay online (Wayne, 15 Nov 2026)
        if (q.booking_ref) return fail("booked", `Already booked as ${q.booking_ref}.`);
        if (!q.email) return fail("email", "This enquiry has no email address, so they can't sign online. Ask for their email first.");
        if (!["consumer", "business"].includes(x.bookingAs)) return fail("as", "Choose consumer or business.");
        const postcode = tidyPostcode(x.postcode);
        if (!postcode) return fail("postcode", "Add the full site postcode.");
        const cat = CATALOG.find((c) => c.id === x.service && !c.pay);
        const name = clean(x.serviceName, 120) || cat?.name;
        if (!name) return fail("service", "Choose a service or type one.");
        const auto = cat ? priceFor(cat.id, postcode) : null;
        const total = x.total !== "" && x.total != null ? Math.round(Number(x.total)) : auto && !auto.error ? auto.total : NaN;
        const travel = x.travel !== "" && x.travel != null ? Math.round(Number(x.travel)) : auto && !auto.error ? auto.travel : 0;
        if (!(total > 0 && travel >= 0 && travel <= total)) return fail("price", "Set the price (and travel, if any).");
        const mode = x.mode === "invoice" ? "invoice" : "deposit";
        const date = DATE.test(x.date || "") ? x.date : "";
        const acct = await D.prepare("SELECT * FROM users WHERE email = ?").bind(q.email).first();
        const ref = `HD-${randomHex(3).toUpperCase()}`, t = now();
        await D.prepare(`INSERT INTO bookings (ref, user_id, invite_email, service_id, service, postcode, address, wanted_date, wanted_time, notes, booking_as, early_start, agreement,
          base, travel, total, mode, due_now, status, deliverables, delivery, licence, branding, extras, created, updated) VALUES (?,?,?,?,?,?,?,?,?,?,?,0,?,?,?,?,?,?,'awaiting_signature',?,?,?,?,?,?,?)`)
          .bind(ref, acct?.id || null, acct ? null : q.email, cat?.id || "custom", name, postcode, clean(x.address, 200), date, clean(x.time, 20), clean(x.notes, 1000), x.bookingAs, AGREEMENT_VERSION,
            total - travel, travel, total, mode, mode === "deposit" ? depositFor(total) : 0, clean(x.deliverables, 1500) || null, clean(x.delivery, 200) || null, null, null, clean(x.extras, 500) || null, t, t).run();
        const nb = await D.prepare("SELECT * FROM bookings WHERE ref = ?").bind(ref).first();
        await upd("status = 'won', booking_ref = ?", ref);
        await log(env, actor, "booking-from-enquiry", q.ref, ref);
        await log(env, actor, "created-from-enquiry", ref, q.ref);
        await sendMail(env, q.email, MAIL.invite(acct?.name || q.name, { ...nb, invite_email: q.email }, !!acct), "invite");
        return json({ ok: true, booking: ref });
      } else return fail("action", "Unknown action.");
      const fresh = await D.prepare("SELECT * FROM enquiries WHERE id = ?").bind(q.id).first();
      const { token_hash: _t, ...out } = fresh;
      return json({ enquiry: { ...out, fields: JSON.parse(fresh.fields) } });
    }

    if (path === "outbox" && m === "GET") {
      const { results } = await D.prepare("SELECT * FROM outbox ORDER BY id DESC LIMIT 200").all();
      return json({ outbox: results });
    }
    if (path === "audit" && m === "GET") {
      const { results } = await D.prepare("SELECT * FROM audit ORDER BY id DESC LIMIT 300").all();
      return json({ audit: results });
    }

    /* ---------- test tools: TEST_MODE only ---------- */
    if (path === "test/customer" && m === "POST") {
      if (!testMode(env)) return fail("test", "Only in test mode.", 403);
      const x = await body(request);
      const email = String(x.email || "").trim().toLowerCase(), name = clean(x.name, 80);
      if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email) || name.length < 2) return fail("details", "Add a name and email.");
      const pp = passwordProblem(x.password); if (pp) return fail("password", pp);
      if (await D.prepare("SELECT id FROM users WHERE email = ?").bind(email).first()) return fail("exists", "That email already has an account.");
      await D.prepare("INSERT INTO users (email, name, pw, company, verified, test, created) VALUES (?, ?, ?, ?, 1, 1, ?)").bind(email, name, await hashPassword(x.password, env), clean(x.company, 120), now()).run();
      await log(env, actor, "test-customer-created", email);
      return json({ ok: true });
    }
    // Full reset before going live: everything except the admin account. Test mode only.
    if (path === "test/reset" && m === "POST") {
      if (!testMode(env)) return fail("test", "Only in test mode.", 403);
      const x = await body(request);
      if (x.confirm !== "RESET") return fail("confirm", "Type RESET to confirm.");
      const n = await D.prepare("SELECT COUNT(*) n FROM users WHERE role != 'admin'").first();
      const b = await D.prepare("SELECT COUNT(*) n FROM bookings").first();
      const e = await D.prepare("SELECT COUNT(*) n FROM enquiries").first();
      await D.batch([
        "DELETE FROM enquiries", "DELETE FROM signatures", "DELETE FROM bundles", "DELETE FROM bookings", "DELETE FROM outbox", "DELETE FROM codes",
        "DELETE FROM sessions WHERE user_id NOT IN (SELECT id FROM users WHERE role = 'admin')",
        "DELETE FROM users WHERE role != 'admin'", "DELETE FROM audit", "DELETE FROM limits",
      ].map((q) => D.prepare(q)));
      await log(env, actor, "full-reset", "", `${n.n} accounts, ${b.n} bookings`);
      return json({ ok: true, accounts: n.n, bookings: b.n, enquiries: e.n });
    }
    if (path === "test/wipe" && m === "POST") {
      if (!testMode(env)) return fail("test", "Only in test mode.", 403);
      const { results } = await D.prepare("SELECT id FROM users WHERE test = 1").all();
      for (const r of results) {
        await D.batch([D.prepare("DELETE FROM bookings WHERE user_id = ?").bind(r.id), D.prepare("DELETE FROM bundles WHERE user_id = ?").bind(r.id)]);
        await deleteUser(env, r.id);
      }
      await log(env, actor, "test-data-wiped", "", `${results.length} test accounts`);
      return json({ ok: true, removed: results.length });
    }

    return fail("missing", "Not found.", 404);
  } catch (e) {
    if (e.message === "no-db") return fail("setup", "Accounts aren't switched on yet.", 503);
    return fail("server", "Something went wrong.", 500);
  }
}
