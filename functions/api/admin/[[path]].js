/* /api/admin/* : Wayne's admin (the /admin page). Admin role only:
   the account whose email matches ADMIN_EMAIL, signed in with
   password + emailed code. Every change is written to the activity log. */
import { json, fail, now, testMode, sameSite, body, db, tidy, log, currentUser, publicUser, hashPassword, passwordProblem,
  MAIL, sendMail, recordPayment, deleteUser } from "../../../lib/acct/server.js";

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
      const q = (sql) => D.prepare(sql).first();
      const [c, b, o, n] = await Promise.all([
        q("SELECT COUNT(*) n FROM users WHERE role = 'customer'"),
        q("SELECT COUNT(*) n FROM bookings"),
        q("SELECT COUNT(*) n FROM bookings WHERE status IN ('requested','awaiting_payment','cancel_requested')"),
        q("SELECT COUNT(*) n FROM bookings WHERE status = 'confirmed'"),
      ]);
      return json({ me: publicUser(me), counts: { customers: c.n, bookings: b.n, toDo: o.n, upcoming: n.n }, config: { test: testMode(env), stripe: !!env.STRIPE_SECRET_KEY, mail: !!env.RESEND_KEY } });
    }

    if (path === "bookings" && m === "GET") {
      const status = new URL(request.url).searchParams.get("status") || "";
      const sql = `SELECT b.*, u.name, u.email FROM bookings b LEFT JOIN users u ON u.id = b.user_id ${status ? "WHERE b.status = ?" : ""} ORDER BY b.id DESC LIMIT 300`;
      const { results } = status ? await D.prepare(sql).bind(status).all() : await D.prepare(sql).all();
      return json({ bookings: results });
    }

    const one = path.match(/^booking\/(HD-[A-F0-9]{6})$/);
    if (one) {
      const b = await D.prepare("SELECT b.*, u.name, u.email, u.phone, u.company FROM bookings b LEFT JOIN users u ON u.id = b.user_id WHERE b.ref = ?").bind(one[1]).first();
      if (!b) return fail("missing", "Booking not found.", 404);
      if (m === "GET") {
        const { results: history } = await D.prepare("SELECT * FROM audit WHERE target = ? ORDER BY id DESC LIMIT 50").bind(b.ref).all();
        return json({ booking: b, history });
      }
      const x = await body(request);
      const u = b.user_id ? await D.prepare("SELECT * FROM users WHERE id = ?").bind(b.user_id).first() : null;
      const set = async (sql, ...v) => D.prepare(`UPDATE bookings SET ${sql}, updated = ? WHERE id = ?`).bind(...v, now(), b.id).run();
      switch (x.action) {
        case "confirm": {
          if (!DATE.test(x.date || "")) return fail("date", "Pick the flying date.");
          await set("confirmed_date = ?, confirmed_time = ?, status = 'confirmed'", x.date, clean(x.time, 20));
          await log(env, actor, "confirmed", b.ref, `${x.date} ${clean(x.time, 20)}`);
          if (u) await sendMail(env, u.email, MAIL.confirmed(u, { ...b, confirmed_date: x.date, confirmed_time: clean(x.time, 20) }), "confirmed");
          break;
        }
        case "deliver": {
          const link = clean(x.files, 500);
          if (!/^https:\/\/\S+$/.test(link)) return fail("files", "Paste the Drive folder link (starting https://).");
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
          await set("status = 'requested', confirmed_date = NULL, confirmed_time = NULL");
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
