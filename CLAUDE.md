# Happy Drones website: notes for Claude

## Publishing (Cloudflare Pages)
The site is hosted on Cloudflare Pages (static pages in `out/` plus Pages Functions in `functions/`, database D1 bound as `DB`). Netlify is no longer used: its repo link was removed on 15 Nov 2026.
- **Cloudflare only builds the `live` branch.** Everyday work goes on `main`. Pushing to `main` doesn't change the website.
- **Never push to `live` unless Wayne says to publish** (or "make live"). To publish: `git fetch origin +refs/heads/live:refs/remotes/origin/live main && git merge-base --is-ancestor origin/live main && git push origin main:live`.
- Cloudflare's free plan allows 500 builds a month. Still group changes together, and test locally (`npm run build`, and `wrangler pages dev out` for anything in `functions/`) before publishing.
- Settings and secrets (Stripe, Resend, `ADMIN_EMAIL`, `TEST_MODE`) live in Cloudflare → the project → Settings → Variables and Secrets. Never put keys in code or chat. A change there needs a new deploy to take effect.
- Redirects are in `public/_redirects`; headers in `public/_headers`.

## Business standards (official rules)
The official rules for quotes, bookings, prices, legal, security, website quality and customer emails are in the Claude Doc "Happy Drones Standards and Requirements": https://claude.ai/artifact/1RDuJF6dBRhX5uSu48YwsB
- Read it before changing anything about quotes, bookings, payments, emails or customer data. If the website and the standards disagree, the standards win and the website is fixed.
- Rules marked "Enforced by the website" must stay enforced in code. "Proposed" rules aren't official until Wayne approves them.
- When Wayne adds or changes a rule, update the doc's log, then build anything it needs and log that in the changelog.

## Marketing campaigns (Wayne's standing rule)
Every campaign or special offer must have a distance limit from Wayne's base:
- free travel only in a core zone,
- a travel fee per visit (free shoots included) in an extended zone,
- the offer is not valid beyond a maximum distance; standard quote only.
Check distances by postcode on the booking form, state them in the offer terms, and write them into the Job Details.
Confirm the base, zone distances and fees with Wayne before building. He'd rather not drive hours for a cheap job.

## Log every change
Every change to this site gets an entry at the top of `lib/changelog.js`.
That includes code, content and settings done outside the code (Cloudflare, Stripe, Resend, Google, Web3Forms).
The entries are shown on the unlisted page happydrones.co.uk/changelog.

- Use UK time for `time`. Set `by` to "Claude" or "Wayne". Pick a `type`: new, change, fix, content or setup.
- Write the entry in the same commit as the change. It can't contain its own commit id.
- At the start of the next change, fill in the missing `commit` ids on earlier entries using `git log`.
- Wayne's own commits since the last entry get logged as well (by: "Wayne").

## Security (Wayne's rule: every page, no matter what)
- Every page gets the security headers in `public/_headers` (the `/*` block): HSTS, frame protection, nosniff, Referrer-Policy, Permissions-Policy and a Content Security Policy. Never remove, switch off (`! Header`) or loosen them for any page.
- `scripts/check-security.mjs` runs on every build and fails it if the headers are missing or weakened, if code or a page loads from an outside address that isn't approved, or if a server route returns HTML without its own CSP.
- Adding an outside service (embed, widget, analytics, map tiles, an API called from the browser): add its exact `https://` address to the right CSP directive in `public/_headers`. A plain link people click goes in `LINK_ONLY` in the check script. Never use `*`, `https:`, `http:` or `'unsafe-eval'`.
- After adding anything that loads from outside, load the affected pages with the headers on (`wrangler pages dev out`) and check nothing is blocked.

## Working on the site
- Run `git pull` before editing.
- Run `npm run build` before pushing (it includes the security check).
- Write commit messages in plain English.
- Most settings live in `lib/site.js`.
- `TODO.md` holds the to-do list. Tick items off there as they're done.
- The booking agreement at `/terms` (`app/terms/page.js`) must match the signed contract word for word.
