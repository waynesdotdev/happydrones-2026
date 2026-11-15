/* With test mode OFF (how the real site should run): no codes on screen, no test tools, no pretend payments */
import { call, ok, section, done, jar, PW } from "../helpers.mjs";

section("Test mode off");
let r = await call(null, "/api/acct/me"); ok(r.b.config.test === false, "the site reports test mode is off");
r = await call(jar(), "/api/acct/register", { name: "Lynn Fox", email: "lynn.fox@example.com", password: PW, privacy: true }); ok(r.b.step === "verify" && !r.b.devCode, "no code on screen, even for an @example address");
r = await call(jar(), "/api/acct/forgot", { email: "admin@example.com" }); ok(r.s === 200 && !r.b.devCode, "no reset code on screen");
r = await call(jar(), "/api/admin/test/reset", { confirm: "RESET" }); ok(r.s === 401, "test tools are closed to visitors");
r = await call(jar(), "/api/admin/test/customer", { name: "X Y", email: "x@example.com", password: PW }); ok(r.s === 401, "nobody can create test customers");
done();
