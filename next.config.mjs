import { execFileSync } from "node:child_process";

// Security check (scripts/check-security.mjs): every build stops if the
// security headers are missing or weakened, or if code uses an outside
// address that isn't approved. Runs however the site is built.
execFileSync(process.execPath, ["scripts/check-security.mjs", "source"], { stdio: "inherit" });

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Build the whole site as plain HTML files in the "out" folder.
  // Netlify serves that folder. No server needed, and every page
  // (including each journal post) is real HTML that Google can read.
  output: "export",

  // /journal/my-post/ is saved as /journal/my-post/index.html
  trailingSlash: true,

  // Static sites can't resize images on the fly, so serve them as they are.
  images: { unoptimized: true },
};

export default nextConfig;
