# Happy Drones website: notes for Claude

## Publishing (Netlify credits)
Netlify's free plan gives 300 credits a month, and each live deploy costs 15. When they run out, the site goes offline.
- **Netlify only deploys the `live` branch.** Everyday work goes on `main`. Pushing to `main` is free and doesn't change the website.
- **Never push to `live` unless Wayne says to publish.** To publish: `git checkout live && git merge --ff-only main && git push origin live && git checkout main`.
- Group changes together, and test locally (`npm run dev` or `npx next build`) before publishing.
- Builds are skipped when a commit only changes notes files (see `ignore` in `netlify.toml`).

## Marketing campaigns (Wayne's standing rule)
Every campaign or special offer must have a distance limit from Wayne's base:
- free travel only in a core zone,
- a travel fee per visit (free shoots included) in an extended zone,
- the offer is not valid beyond a maximum distance; standard quote only.
Check distances by postcode on the booking form, state them in the offer terms, and write them into the Job Details.
Confirm the base, zone distances and fees with Wayne before building. He'd rather not drive hours for a cheap job.

## Log every change
Every change to this site gets an entry at the top of `lib/changelog.js`.
That includes code, content and settings done outside the code (Netlify, Google, Web3Forms).
The entries are shown on the unlisted page happydrones.co.uk/changelog.

- Use UK time for `time`. Set `by` to "Claude" or "Wayne". Pick a `type`: new, change, fix, content or setup.
- Write the entry in the same commit as the change. It can't contain its own commit id.
- At the start of the next change, fill in the missing `commit` ids on earlier entries using `git log`.
- Wayne's own commits since the last entry get logged as well (by: "Wayne").

## Working on the site
- Run `git pull` before editing.
- Run `npx next build` before pushing.
- Write commit messages in plain English.
- Most settings live in `lib/site.js`.
- `TODO.md` holds the to-do list. Tick items off there as they're done.
- The booking agreement at `/terms` (`app/terms/page.js`) must match the signed contract word for word.
