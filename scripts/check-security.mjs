/* =========================================================
   SECURITY CHECK — runs on every build. The build FAILS if:
   1. the security headers for every page (public/_headers, "/*") are
      missing or weakened
   2. code or a page loads something from an outside address that isn't
      approved (in the Content Security Policy, or listed below as a
      plain link people click)
   3. a server route returns a web page without its own protection
   4. public/.well-known/security.txt is missing or out of date

   Wayne's rule (15 Nov 2026): every page, now and in future, gets the
   security headers, no matter what. Don't loosen this file to make a
   build pass: add the new service properly instead (see the messages).

   Run by hand:  node scripts/check-security.mjs          (source + built pages)
                 node scripts/check-security.mjs source   (before building)
   ========================================================= */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const rel = (p) => path.relative(ROOT, p);

/* Outside addresses that only appear as links people click (or as text),
   never loaded by the page itself. Adding one here is a promise that the
   page doesn't fetch, embed or show anything from it. */
export const LINK_ONLY = [
  "happydrones.co.uk", "schema.org", "wa.me", "www.facebook.com", "facebook.com", "x.com", "twitter.com", "www.linkedin.com",
  "www.tiktok.com", "www.instagram.com", "www.youtube.com", "youtu.be", "www.google.com", "maps.google.com", "maps.apple.com",
  "calendar.google.com", "fonts.google.com", "www.openstreetmap.org", "ico.org.uk", "caa.co.uk", "www.caa.co.uk", "github.com",
  "register-drones.caa.co.uk", "www.gov.uk", "g.page", "search.google.com", "hstspreload.org", "developer.mozilla.org",
  "www.coverdrone.com", "coverdrone.com", "stripe.com", "dashboard.stripe.com", "checkout.stripe.com", "resend.com",
];
/* Files that only run on the server (Cloudflare Functions), so their
   outside calls don't happen in the visitor's browser. */
const SERVER_ONLY = [/^functions\//, /^lib\/wxServer\.js$/, /^lib\/acct\/server\.js$/, /^lib\/acct\/agreement\.js$/, /^scripts\//];

const REQUIRED = {
  "strict-transport-security": (v) => { const m = /max-age=(\d+)/i.exec(v); return m && Number(m[1]) >= 15768000 ? "" : "needs max-age of at least 6 months (15768000)"; },
  "x-frame-options": (v) => (/^(deny|sameorigin)$/i.test(v.trim()) ? "" : "must be DENY or SAMEORIGIN"),
  "x-content-type-options": (v) => (/^nosniff$/i.test(v.trim()) ? "" : "must be nosniff"),
  "referrer-policy": (v) => (/^(no-referrer|same-origin|strict-origin|strict-origin-when-cross-origin)$/i.test(v.trim()) ? "" : "must be a strict policy"),
  "permissions-policy": (v) => (v.trim() ? "" : "must be set"),
  "content-security-policy": () => "",
};
const CSP_MUST = [["default-src", "'self'"], ["object-src", "'none'"], ["base-uri", "'self'"], ["form-action", "'self'"]];

const errors = [];
const fail = (msg) => errors.push(msg);

/* ---------- 1. the headers file ---------- */
function readHeaders() {
  const file = path.join(ROOT, "public/_headers");
  if (!fs.existsSync(file)) { fail("public/_headers is missing: every page needs the security headers."); return null; }
  const blocks = []; let cur = null;
  for (const raw of fs.readFileSync(file, "utf8").split("\n")) {
    if (!raw.trim() || raw.trim().startsWith("#")) continue;
    if (!/^\s/.test(raw)) { cur = { path: raw.trim(), headers: [] }; blocks.push(cur); continue; }
    if (cur) cur.headers.push(raw.trim());
  }
  const all = blocks.find((b) => b.path === "/*");
  if (!all) { fail('public/_headers has no "/*" block: the security headers must apply to every page.'); return null; }
  const h = Object.fromEntries(all.headers.filter((l) => l.includes(":")).map((l) => [l.slice(0, l.indexOf(":")).trim().toLowerCase(), l.slice(l.indexOf(":") + 1).trim()]));
  for (const [name, check] of Object.entries(REQUIRED)) {
    if (!h[name]) fail(`public/_headers "/*" is missing ${name}.`);
    else { const why = check(h[name]); if (why) fail(`public/_headers ${name}: ${why}.`); }
  }
  // No other block may remove a security header ("! Header-Name" detaches it)
  for (const b of blocks) for (const l of b.headers) {
    const m = /^!\s*([\w-]+)/.exec(l);
    if (m && REQUIRED[m[1].toLowerCase()]) fail(`public/_headers "${b.path}" removes ${m[1]}. Security headers can't be switched off for any page.`);
  }
  return h["content-security-policy"] ? parseCsp(h["content-security-policy"]) : null;
}

function parseCsp(v) {
  const csp = {};
  for (const part of v.split(";").map((s) => s.trim()).filter(Boolean)) { const [d, ...src] = part.split(/\s+/); csp[d.toLowerCase()] = src; }
  for (const [d, s] of CSP_MUST) if (!(csp[d] || []).includes(s)) fail(`Content-Security-Policy must include ${d} ${s}.`);
  if (!csp["frame-ancestors"] || !csp["frame-ancestors"].every((s) => s === "'self'" || s === "'none'")) fail("Content-Security-Policy must include frame-ancestors 'self' (or 'none').");
  for (const [d, list] of Object.entries(csp)) {
    if (list.includes("'unsafe-eval'")) fail(`Content-Security-Policy ${d} allows 'unsafe-eval': not allowed.`);
    if (list.some((s) => s === "*" || s === "https:" || s === "http:" || s.startsWith("http://"))) fail(`Content-Security-Policy ${d} allows any website or plain http: list the exact https addresses instead.`);
  }
  return csp;
}

const hostOf = (u) => { try { return new URL(u).host.toLowerCase(); } catch { return ""; } };
const allowedBy = (csp, directive, url) => {
  const list = csp[directive] || csp["default-src"] || [];
  if (url.startsWith("data:")) return list.includes("data:");
  if (url.startsWith("blob:")) return list.includes("blob:");
  const h = hostOf(url); if (!h) return true; // relative = this site
  return list.some((s) => { const sh = hostOf(s.includes("://") ? s : `https://${s}`); return sh === h || (sh.startsWith("*.") && h.endsWith(sh.slice(1))); });
};
const cspHosts = (csp) => new Set(Object.values(csp).flat().filter((s) => /^https:\/\//.test(s)).map(hostOf));

/* ---------- 2a. source code: every outside address is approved ---------- */
function walk(dir, exts, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (["node_modules", ".next", "out", ".git", ".wrangler"].includes(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, exts, out); else if (exts.some((x) => e.name.endsWith(x))) out.push(p);
  }
  return out;
}
function checkSource(csp) {
  const okHosts = new Set([...cspHosts(csp), ...LINK_ONLY]);
  const files = [...walk(path.join(ROOT, "app"), [".js", ".jsx"]), ...walk(path.join(ROOT, "components"), [".js", ".jsx"]), ...walk(path.join(ROOT, "lib"), [".js", ".jsx", ".mjs"])];
  for (const f of files) {
    const r = rel(f).split(path.sep).join("/");
    if (SERVER_ONLY.some((re) => re.test(r))) continue;
    const text = fs.readFileSync(f, "utf8");
    for (const m of text.matchAll(/https:\/\/([a-z0-9.-]+\.[a-z]{2,})/gi)) {
      const h = m[1].toLowerCase();
      if (!okHosts.has(h)) fail(`${r} uses ${h}, which isn't approved. If the page loads anything from it (script, image, video, frame or data), add https://${h} to the right part of Content-Security-Policy in public/_headers. If it's only a link people click, add "${h}" to LINK_ONLY in scripts/check-security.mjs.`);
    }
  }
  // 3. server routes that return a web page must protect it themselves
  for (const f of [...walk(path.join(ROOT, "functions"), [".js"]), ...walk(path.join(ROOT, "lib"), [".js"])]) {
    const text = fs.readFileSync(f, "utf8");
    if (/text\/html/.test(text) && !/content-security-policy/i.test(text)) fail(`${rel(f)} returns a web page (text/html) without a content-security-policy header. Server pages don't get public/_headers, so add one.`);
  }
}

/* ---------- 2b. built pages: every resource they load is allowed ---------- */
function checkOutput(csp) {
  const out = path.join(ROOT, "out");
  if (!fs.existsSync(out)) { fail("No out/ folder: run the build first."); return 0; }
  const pages = walk(out, [".html"]);
  const tags = [
    [/<script\b[^>]*\bsrc=["']([^"']+)["']/gi, "script-src"],
    [/<img\b[^>]*\bsrc=["']([^"']+)["']/gi, "img-src"],
    [/<(?:iframe|frame)\b[^>]*\bsrc=["']([^"']+)["']/gi, "frame-src"],
    [/<(?:video|audio|source|track)\b[^>]*\bsrc=["']([^"']+)["']/gi, "media-src"],
    [/<link\b[^>]*\brel=["'](?:stylesheet)["'][^>]*\bhref=["']([^"']+)["']/gi, "style-src"],
    [/<link\b[^>]*\bhref=["']([^"']+)["'][^>]*\brel=["'](?:stylesheet)["']/gi, "style-src"],
  ];
  const seen = new Set();
  for (const f of pages) {
    const html = fs.readFileSync(f, "utf8");
    for (const [re, dir] of tags) for (const m of html.matchAll(re)) {
      const url = m[1].replace(/&amp;/g, "&");
      if (!/^(https?:|data:|blob:|\/\/)/.test(url)) continue; // this site
      const key = `${dir} ${hostOf(url) || url.slice(0, 30)}`;
      if (seen.has(key)) continue; seen.add(key);
      if (url.startsWith("http://")) fail(`${rel(f)} loads ${url} over plain http. Use https.`);
      else if (!allowedBy(csp, dir, url.startsWith("//") ? `https:${url}` : url)) fail(`${rel(f)} loads ${url.slice(0, 80)} (${dir}), which the Content-Security-Policy would block. Add https://${hostOf(url)} to ${dir} in public/_headers, or don't load it.`);
    }
  }
  return pages.length;
}

/* ---------- 4. security.txt: how to report a problem (RFC 9116) ---------- */
function checkSecurityTxt() {
  const file = path.join(ROOT, "public/.well-known/security.txt");
  if (!fs.existsSync(file)) return fail("public/.well-known/security.txt is missing. It tells people how to report a security problem.");
  const t = fs.readFileSync(file, "utf8");
  if (!/^Contact:\s*\S+/m.test(t)) fail("security.txt needs a Contact: line.");
  const m = /^Expires:\s*(\S+)/m.exec(t);
  const exp = m ? Date.parse(m[1]) : NaN;
  if (!exp) return fail("security.txt needs an Expires: date.");
  const days = Math.floor((exp - Date.now()) / 864e5);
  if (days < 0) fail("security.txt has expired. Set Expires: to a date up to a year ahead.");
  else if (days > 366) fail("security.txt Expires: must be no more than a year ahead.");
  else if (days < 60) console.warn(`Warning: security.txt expires in ${days} days. Set Expires: to a year from now.`);
}

/* ---------- run ---------- */
const mode = process.argv[2] || "all";
const csp = readHeaders();
checkSecurityTxt();
if (csp) {
  checkSource(csp);
  const n = mode === "source" ? 0 : checkOutput(csp);
  if (!errors.length) console.log(`Security check passed: headers on every page${n ? `, ${n} built pages checked` : ""}, all outside addresses approved.`);
}
if (errors.length) {
  console.error(`\nSECURITY CHECK FAILED (${errors.length}). The site won't build until this is fixed:\n`);
  for (const e of errors) console.error(` - ${e}`);
  console.error("\nSee scripts/check-security.mjs and the Security section of CLAUDE.md.\n");
  process.exit(1);
}
