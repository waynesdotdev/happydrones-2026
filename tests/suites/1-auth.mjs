/* Accounts and sign-in: who can get in, and who can't */
import { call, jar, ok, section, done, signUp, signIn, admin, sql, PW, ADMIN, B } from "../helpers.mjs";

section("Signing up and in");
const A = await admin();
let r = await call(A, "/api/acct/me"); ok(r.b.user?.role === "admin", "the ADMIN_EMAIL address becomes the admin");
let j = jar();
r = await call(j, "/api/acct/register", { name: "Lynn Fox", email: "lynn.fox@example.com", password: "short", privacy: true }); ok(r.s === 400, "short password refused");
r = await call(j, "/api/acct/register", { name: "Lynn Fox", email: "lynn.fox@example.com", password: PW }); ok(r.s === 400, "must tick the privacy policy");
r = await call(j, "/api/acct/register", { name: "Lynn Fox", email: "lynn.fox@example.com", password: PW, privacy: true }); ok(r.b.step === "verify" && r.b.devCode, "sign-up sends a code");
r = await call(j, "/api/acct/verify", { email: "lynn.fox@example.com", code: "000000" }); ok(r.s === 400, "wrong code refused");
r = await call(j, "/api/acct/register", { name: "Lynn Fox", email: "lynn.fox@example.com", password: PW, privacy: true });
r = await call(j, "/api/acct/verify", { email: "lynn.fox@example.com", code: r.b.devCode });
ok(r.b.user?.role === "customer" && /HttpOnly/.test(r.setCookie) && /Secure/.test(r.setCookie) && /SameSite=Lax/.test(r.setCookie) && /Path=\/api/.test(r.setCookie), "signed in as a customer with a locked-down cookie", r.setCookie);
r = await call(jar(), "/api/acct/register", { name: "Someone Else", email: "lynn.fox@example.com", password: PW, privacy: true }); ok(r.b.step === "verify" && !r.b.devCode, "signing up again with a used email gives nothing away and no code");
r = await call(jar(), "/api/acct/login", { email: "lynn.fox@example.com", password: PW }); ok(r.b.step === "code" && r.b.devCode, "sign-in is two steps: password, then a code");
r = await call(jar(), "/api/acct/login-code", { email: "lynn.fox@example.com", code: "123456" }); ok(r.s === 400, "wrong sign-in code refused");

section("Test mode never shows codes for real addresses");
sql("INSERT INTO users (email, name, pw, verified, created) VALUES ('real.person@gmail.com', 'Real Person', 'x', 1, 1)");
r = await call(jar(), "/api/acct/forgot", { email: "real.person@gmail.com" }); ok(r.s === 200 && !r.b.devCode, "password reset for a real address: no code on screen");
r = await call(jar(), "/api/acct/register", { name: "New Real", email: "new.real@gmail.com", password: PW, privacy: true }); ok(r.s === 200 && !r.b.devCode, "sign-up with a real address: no code on screen");
r = await call(jar(), "/api/acct/forgot", { email: "nobody@example.com" }); ok(r.s === 200 && r.b.step === "reset" && !r.b.devCode, "reset for an unknown email looks the same");

section("Keeping people out");
r = await call(j, "/api/admin/overview"); ok(r.s === 403, "a customer can't open the admin");
r = await call(jar(), "/api/admin/overview"); ok(r.s === 401, "nobody signed in can't open the admin");
r = await call(jar(), "/api/acct/bookings"); ok(r.s === 401, "bookings need a sign-in");
r = await call({ c: `hds=${"a".repeat(64)}` }, "/api/acct/bookings"); ok(r.s === 401, "a made-up session is refused");
r = await call(j, "/api/acct/profile", { name: "Hacked" }, { headers: { origin: "https://evil.example" } }); ok(r.s === 403, "requests from another website are refused");
r = await call(j, "/api/acct/profile", { name: "Hacked" }, { headers: { origin: "null" } }); ok(r.s === 403, "an odd Origin header is refused, not a crash");
let raw = await fetch(`${B}/api/acct/profile`, { method: "POST", headers: { "content-type": "text/plain", cookie: j.c }, body: "name=Hacked" }); ok(raw.status === 403, "form-style posts are refused");

section("Wrong passwords, lockout and reset");
for (let i = 0; i < 5; i++) r = await call(jar(), "/api/acct/login", { email: "lynn.fox@example.com", password: "wrong password here" });
r = await call(jar(), "/api/acct/login", { email: "lynn.fox@example.com", password: PW }); ok(r.s === 429, "locked after 5 wrong passwords, even with the right one");
r = await call(jar(), "/api/acct/forgot", { email: "lynn.fox@example.com" });
const reset = await call(jar(), "/api/acct/reset", { email: "lynn.fox@example.com", code: r.b.devCode, password: "a brand new password" }); ok(reset.b.ok, "password reset with the emailed code");
r = await call(j, "/api/acct/bookings"); ok(r.s === 401, "the reset signed out every device");
j = await signIn("lynn.fox@example.com", "a brand new password"); r = await call(j, "/api/acct/me"); ok(r.b.user?.email === "lynn.fox@example.com", "new password works and the lock is cleared");

section("Details");
r = await call(j, "/api/acct/profile", { name: "Mrs Lynn Fox", phone: "07700 900123", company: "", marketing: true }); ok(r.b.user?.name === "Mrs Lynn Fox" && r.b.user.marketing === true, "profile saved");
r = await call(j, "/api/acct/password", { current: "nope", password: "another new password" }); ok(r.s === 400, "changing password needs the current one");
r = await call(j, "/api/acct/logout", {}); r = await call(j, "/api/acct/bookings"); ok(r.s === 401, "signed out");
const codes = (await call(A, "/api/admin/outbox")).b.outbox.filter((e) => e.kind === "code");
ok(codes.length > 3 && codes.every((e) => !/\b\d{6}\b/.test(e.subject + e.body.replace(/07888 625623/g, ""))), "codes are never kept in the copies of emails");
r = await call(A, "/api/acct/delete", { password: PW }); ok(r.s === 400, "the admin account can't be deleted");
done();
