/* Runs every test suite against a fresh local copy of the built site.
     npm run build     (first: the tests use the built pages in out/)
     npm test          (all suites)      npm test booking   (one suite)
   Needs Node 22.13+ and downloads Cloudflare's local runner (wrangler) the first time. */
import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const PORT = process.env.TEST_PORT || "8799";
if (!fs.existsSync(path.join(ROOT, "out/index.html"))) { console.error("Run `npm run build` first: the tests use the built site in out/."); process.exit(1); }

const only = process.argv[2];
const suites = fs.readdirSync(path.join(ROOT, "tests/suites")).filter((f) => f.endsWith(".mjs") && (!only || f.startsWith(only))).sort();
const wrangler = process.env.WRANGLER ? [process.env.WRANGLER] : ["npx", "--yes", "wrangler@3"];
const up = async () => { try { return (await fetch(`http://localhost:${PORT}/api/acct/me`)).ok; } catch { return false; } };
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

let bad = 0;
for (const suite of suites) {
  fs.rmSync(path.join(ROOT, ".wrangler"), { recursive: true, force: true }); // every suite starts with an empty database
  const live = suite.startsWith("live"); // the "live" suite runs with test mode OFF, like the real site
  const args = [...wrangler.slice(1), "pages", "dev", "out", "--port", PORT, "--d1", "DB", "--kv", "WEATHER_KV", "--binding", "ADMIN_EMAIL=admin@example.com", "--binding", "STRIPE_WEBHOOK_SECRET=whsec_test123", ...(live ? [] : ["--binding", "TEST_MODE=1"])];
  const server = spawn(wrangler[0], args, { cwd: ROOT, stdio: "ignore", detached: true });
  let ready = false; for (let i = 0; i < 90 && !ready; i++) { await wait(1000); ready = await up(); }
  console.log(`\n===== ${suite} =====`);
  if (!ready) { console.error("The local site didn't start."); bad++; } else {
    const r = spawnSync(process.execPath, ["--no-warnings", path.join(ROOT, "tests/suites", suite)], { stdio: "inherit", env: { ...process.env, TEST_PORT: PORT } });
    if (r.status !== 0) bad++;
  }
  try { process.kill(-server.pid, "SIGTERM"); } catch { /* already gone */ }
  await wait(1500);
}
fs.rmSync(path.join(ROOT, ".wrangler"), { recursive: true, force: true });
console.log(bad ? `\n${bad} of ${suites.length} suites FAILED` : `\nAll ${suites.length} suites passed`);
process.exit(bad ? 1 : 0);
