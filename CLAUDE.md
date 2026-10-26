# Happy Drones website: notes for Claude

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
