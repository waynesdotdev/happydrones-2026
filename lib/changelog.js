/* =========================================================
   CHANGELOG — shown at happydrones.co.uk/changelog (unlisted)
   Newest first. Add an entry for EVERY change to the site.

   date:   "YYYY-MM-DD"   time: "HH:MM" (UK time)
   by:     "Wayne" or "Claude"
   type:   "new" | "change" | "fix" | "content" | "setup"
           setup = done outside the code (Netlify, Google, Web3Forms…)
   title:  one line, plain English
   notes:  optional list of details
   commit: optional short GitHub commit id, e.g. "3b976f6". The entry is
           usually written in the same commit it describes, so its id is
           filled in with the next change.
   ========================================================= */

export const REPO = "https://github.com/waynesdotdev/happydrones-2026";

export const CHANGELOG = [
  {
    date: "2026-11-15", time: "15:11", by: "Claude", type: "new",
    title: "Security check on every build (Wayne's rule: every page, no matter what)",
    notes: [
      "scripts/check-security.mjs runs before and after every build, and the build fails if: the security headers for every page are missing, weakened or switched off for any page; code or a built page loads from an outside address that isn't approved; or a server route returns a web page without its own protection",
      "Each failure says in plain words what to fix",
      "Tested by breaking things on purpose: a tracking image, removed frame protection, a page switching the CSP off, a loosened CSP, an unprotected server page, a page loading an outside script. All six were caught",
      "The rule is written into CLAUDE.md for all future work",
    ],
  },
  {
    date: "2026-11-15", time: "15:08", by: "Claude", type: "change", commit: "e5a1301",
    title: "Security headers on every page (from the Mozilla Observatory check)",
    notes: [
      "HSTS: browsers always use the secure https version of the site (1 year)",
      "X-Frame-Options and CSP frame-ancestors: other websites can't show these pages inside a hidden frame",
      "Content Security Policy: pages may only load scripts, images, frames and connections from this site and the services it uses (YouTube, YouTube thumbnails, OpenStreetMap tiles, postcodes.io, Web3Forms, Cloudflare's analytics)",
      "Also: Permissions-Policy (no camera, microphone, location or payment APIs), Cross-Origin-Opener-Policy, and explicit nosniff and Referrer-Policy",
      "Checked: all 58 pages and the full booking journey load with nothing blocked",
    ],
  },
  {
    date: "2026-11-15", time: "13:48", by: "Claude", type: "content", commit: "a17d989",
    title: "To-do list: the full test run and the go-live checklist",
    notes: ["Notes only, no change to the website"],
  },
  {
    date: "2026-11-15", time: "13:45", by: "Claude", type: "fix", commit: "2af5611",
    title: "Reset everything also clears enquiries",
    notes: ["Test tools count enquiries in the Right now line, and Reset everything deletes them too"],
  },
  {
    date: "2026-11-15", time: "13:43", by: "Claude", type: "new", commit: "802745f",
    title: "Every enquiry saved in the admin, with a confirmation and private link for the customer",
    notes: [
      "All website forms (quote, mission plan, agent account, coming-soon interest, feedback) now save to the website's database first (/api/enquiry). Web3Forms still emails Wayne a backup copy for now (Wayne's choice); the dead Netlify backup is removed",
      "The customer gets a confirmation email with a reference (e.g. Q-4F2A91), what they asked for, the guide price, a private link to see their request and where it's up to, and a Book online link when the service can be booked",
      "Wayne gets an email with every detail and a button that opens it in the admin; replying goes to the customer",
      "New Enquiries tab in the admin (new ones first and highlighted): email, call or WhatsApp in one tap, map and weather link, status (contacted, price sent, lost, scrapped), private notes, delete for good",
      "Turn into a booking: Wayne sets the service, price, terms and details; the customer is emailed to sign and pay online. If they don't have an account, the booking waits for them to create one with that email",
      "Spam protection: hidden bot trap, other websites can't post, and limits per connection (8 an hour, 25 a day)",
      "Deleting a customer's account also deletes their enquiries",
      "Fix: the admin side panel no longer squeezes long tables",
      "Privacy policy updated: enquiries are stored on the site and confirmed by email",
    ],
  },
  {
    date: "2026-11-15", time: "13:22", by: "Claude", type: "fix", commit: "20cf96b",
    title: "Test tools show what's there and update after deleting",
    notes: [
      "A \"Right now\" line shows how many customer accounts (and test ones) and bookings there are",
      "After deleting or resetting, the counts, tabs and buttons update straight away; buttons say \"Already clear\" when there's nothing left",
      "The done message appears next to the button that was pressed, with correct wording for one or many",
    ],
  },
  {
    date: "2026-11-15", time: "13:18", by: "Claude", type: "new", commit: "fcce867",
    title: "Admin test tools: Reset everything",
    notes: [
      "Test mode only: deletes every account except the admin, plus all bookings, signed agreements, bundles, email copies and the activity log. Needs RESET typed to confirm",
      "For testing from scratch, and once more before real customers",
    ],
  },
  {
    date: "2026-11-15", time: "12:59", by: "Claude", type: "new", commit: "fb4e89f",
    title: "E-signing the booking agreement, changes approved by the customer, and \"It's a go\" confirmation",
    notes: [
      "The full journey: find a service, Book online, create an account, book, read and sign the agreement, pay, then Wayne confirms",
      "Signing: the customer sees their own Job Details (filled in from the service: what they'll receive, delivery, licence, branding, price and payment terms) and the full terms, types their full name (checked against the account) and ticks. Consumers within 14 days are asked about an early start",
      "Each signature stores the exact text signed, the name typed, time, IP address and browser, with a SHA-256 fingerprint. The customer is emailed the signed agreement as an attached file, and can open it from their account at any time. Wayne gets a copy too",
      "Sign first, then pay: payment is only possible once signed. Unsigned bookings are cancelled after 7 days",
      "Admin: edit a booking after a phone call, WhatsApp or email. Changes to the service, address, what's included, price or terms are sent to the customer to approve (they sign again) or decline; date and time wanted change straight away. Changes can be withdrawn",
      "Admin: \"It's a go\" confirms the date once signed and paid (or ticked to confirm anyway), emails the customer and shows the booking in green in their account. Changing the date later sends a new-date email",
      "Admin: record refunds; the customer is emailed",
      "Book online buttons on the package cards, every service page, roofs, construction and vacant property pages",
      "Privacy policy: signed agreements and how long they're kept (7 years from signing)",
    ],
  },
  {
    date: "2026-11-15", time: "12:40", by: "Claude", type: "change", commit: "273fee4",
    title: "Booking agreement updated for online booking and listing bundles; payments show straight away after Stripe",
    notes: [
      "Booking agreement (version 2026-11-15, both /terms and the signed document): accepting online counts as signing (1.4), online booking details are the Job Details (1.3), deposit paid by card when booking online (3.2), pay in your account (3.5), cancel from your account (7.1, 7.2, 7.4), new 12.5 on looking after your online account",
      "New 3.10 Listing bundles (Wayne's decisions): 3 months to use, reminder 2 weeks before the end, one free 1-month extension, then unused listings expire for businesses and are refunded at the bundle price for consumers",
      "Bundles in the system: the reminder email, an Extend by 1 month button for customers in the last 2 weeks and for Wayne in the admin, and at the end a refund-due email to Wayne for consumers. Cancelling a bundle purchase now closes the bundle",
      "Coming back from Stripe: the account page asks Stripe directly and shows Payment received, instead of Waiting for payment with a Pay button. If Stripe is slow, the Pay button stays hidden and it keeps checking",
      "A payment is counted once even if Stripe's message and the customer's return both report it",
      "If the customer backs out of the Stripe page: \"Payment not finished, so nothing was taken\"",
    ],
  },
  {
    date: "2026-11-15", time: "12:30", by: "Claude", type: "content", commit: "7252c14",
    title: "Privacy and cookie policies updated for accounts, payments and emails; greetings use first names only",
    notes: [
      "Privacy policy: what accounts, bookings, payments and security records hold, the lawful basis for each, how long each is kept, what deleting an account removes, every service used (Cloudflare, Stripe, Resend, Web3Forms, Google Workspace, Met Office, postcodes.io, YouTube), transfers outside the UK, security, under 18s and how to use your rights from your account",
      "Removed the old Netlify line: the site is hosted on Cloudflare",
      "Cookie policy: added the hds sign-in cookie, Stripe's cookies on its payment page, and the saved settings for the weather and map tools",
      "Greetings on the account page and in every email use the first name only, with titles like Mr, Mrs or Dr left out; \"Mr Smith\" gets \"Hello\"",
    ],
  },
  {
    date: "2026-11-15", time: "12:22", by: "Wayne", type: "setup", commit: "ada564e",
    title: "Real booking emails switched on (Resend)",
    notes: [
      "Resend account (signed in with Google), domain happydrones.co.uk verified in the Ireland region with automatic Cloudflare DNS setup",
      "Sending-only API key saved as the Cloudflare secret RESEND_KEY; MAIL_FROM set to Happy Drones <bookings@happydrones.co.uk>",
      "Two-step verification added to the Google account",
    ],
  },
  {
    date: "2026-11-15", time: "11:57", by: "Claude", type: "change", commit: "896b935",
    title: "Booking emails: customer replies go to Wayne",
    notes: [
      "When a customer replies to a booking email, it goes to the admin email (or MAIL_REPLY_TO if set), not the sending address",
    ],
  },
  {
    date: "2026-11-15", time: "11:55", by: "Claude", type: "fix", commit: "251f3f8",
    title: "New pages open at the top, not down by the footer",
    notes: [
      "The site's smooth scrolling was cutting short the jump to the top when you clicked a link, leaving you part way or all the way down the new page",
      "The services page's menu bar was dragging the whole page down to the footer when it opened",
      "Clicking a link to the page you're already on now takes you back to the top",
      "Account, admin and playground: switching tab or step brings the top of it back on screen",
      "Checked every footer link from the bottom of a page, on desktop and phone",
    ],
  },
  {
    date: "2026-11-15", time: "11:40", by: "Claude", type: "change", commit: "3338e37",
    title: "Easier password boxes: Show button, type it twice, and email typo help",
    notes: [
      "Every password box has a Show/Hide button",
      "Creating an account, resetting a password and changing it all ask for the new password twice, with live \"x more characters needed\" and \"passwords match\" checks",
      "Sign-up spots common email slips (gmial.com, hotmail.co, outlok.com) and offers the fix with one tap; spaces are removed from emails automatically",
      "Test mode wording now says payments use Stripe's test checkout with card 4242 4242 4242 4242 once Stripe is connected",
    ],
  },
  {
    date: "2026-11-15", time: "11:33", by: "Claude", type: "fix", commit: "680abe7",
    title: "Test mode setting is more forgiving",
    notes: [
      "TEST_MODE now counts as on for 1, true, yes or on, ignoring capitals and stray spaces",
      "Found because TEST_MODE was missing in Cloudflare, so sign-in codes would have been emailed instead of shown",
    ],
  },
  {
    date: "2026-11-15", time: "11:25", by: "Wayne", type: "setup", commit: "c5c24cd",
    title: "Switched on accounts in Cloudflare and connected Stripe (test mode)",
    notes: [
      "Cloudflare: D1 database happydrones-db bound as DB; ADMIN_EMAIL and TEST_MODE set",
      "Stripe sandbox: test secret key saved as a Cloudflare secret; webhook to /api/stripe-webhook for checkout.session.completed, signing secret saved as a Cloudflare secret",
      "Live Stripe keys not used yet",
    ],
  },
  {
    date: "2026-11-15", time: "10:50", by: "Claude", type: "new", commit: "a6fe501",
    title: "Customer accounts and admin (built and in test mode, not switched on yet)",
    notes: [
      "/account: customers sign up, sign in with password plus a 6-digit code by email, book a job, pay, cancel, see their files, change details, download their data and delete their account",
      "/admin: Wayne's bookings list, confirm a date, deliver a Drive link, record bank payments, cancel or reopen, customers, emails sent and an activity log",
      "Prices are worked out on the server from the travel zones, so they can't be changed in the browser. Deposit, invoice and 10-listing bundle payments follow the booking agreement",
      "Stripe Checkout ready for when the keys are added; until then payments are simulated in test mode",
      "Security: hashed passwords, emailed codes, lockout after 5 wrong tries, rate limits, secure cookies, Stripe webhook signature checks",
      "GDPR: privacy tick, marketing off by default, data export, deletion that keeps only anonymous booking records, old codes and logs cleared automatically",
      "Test tools in admin (test mode only): create the Lynn Fox test customer and wipe all test data",
      "Needs a Cloudflare D1 database bound as DB plus ADMIN_EMAIL and TEST_MODE settings before it works on the live site",
    ],
  },
  {
    date: "2026-11-15", time: "10:30", by: "Claude", type: "content", commit: "ebd73ec",
    title: "Saying how the site is built: AI tools, checked by Wayne",
    notes: [
      "Footer small print on every page: \"Tools built with AI, checked by Wayne. Final decisions are always made by a person.\"",
      "Privacy policy: new section \"How this website is built\" (no AI handles bookings or personal details). Last updated 15 November 2026",
    ],
  },
  {
    date: "2026-11-15", time: "10:16", by: "Claude", type: "new", commit: "6cae7ea",
    title: "The playground: try a pretend booking from start to finish",
    notes: [
      "New page /playground. Pick a service from a drop-down (20 services, grouped: homes, estate agents, roofs, buildings and sites, business), a postcode and a date",
      "Then follow the job through 7 stages, each with an example email and a \"How Happy Drones helps\" note: booked, a demo payment (deposit, full, bundle or invoice, following the booking agreement), date confirmed with example weather, the morning-of email, the flight, delivery (with the example roof report and other samples) and afterwards",
      "Nothing is saved or sent: no booking, payment, email or calendar entry. Prices come from the real settings; the weather is example weather",
      "\"Book this for real\" carries the postcode and date into the mission planner. Linked from the footer and /plan",
    ],
  },
  {
    date: "2026-11-14", time: "14:41", by: "Claude", type: "fix", commit: "44d08fc",
    title: "Weather check on /plan explains when it can't run locally",
    notes: [
      "On the dev server (npm run dev) the weather check can't reach its Cloudflare function, so it now says so instead of \"isn't available right now\". On the live site nothing changes",
    ],
  },
  {
    date: "2026-11-14", time: "14:07", by: "Claude", type: "new", commit: "74ea757",
    title: "Nine new services, three coming soon, new customer tools and 14 draft blog posts",
    notes: [
      "New services, each with its own page at /services/<name>/ and bookable on /plan: yearly roof health check £119 a year, storm and insurance claim pack £165, gutter check £79, solar pre-survey pack £95, before-and-after pack for trades £195, construction time-lapse film £149, planning and design context photos £195, aerial 360° panoramas £95, land and plot photos £175. Prices in lib/extraServices.js",
      "Coming soon (not bookable): thermal inspections and indoor fly-through tours join mapping and 3D. Their pages have a \"Tell me when it's ready\" form instead of a price",
      "New services listed in a \"New\" section on /roof-inspections, /construction, /property and /services, and in the sitemap",
      "Online roof report at /report/<id>/: a shareable web page of the numbered photo pack, with an example at /report/example/. Private, not indexed",
      "Review page at /review: Facebook review button (Google button appears once the link is added in lib/site.js) and a private feedback form",
      "Before-and-after gallery at /work, ready for real jobs (lib/gallery.js). Shows a short note and stays out of Google until the first job is added",
      "14 blog posts written as drafts, waiting for Wayne's approval, readable at the private /drafts page",
      "New form types for the emails: interest and feedback",
    ],
  },
  {
    date: "2026-11-14", time: "13:23", by: "Claude", type: "content", commit: "620055b",
    title: "New blog post: check the weather for your shoot date before you book",
    notes: [
      "Explains the new weather check on /plan: why weather matters for drones, what the check shows, better dates, what it can't tell you, and why it asks for a name and email first",
      "Two example screenshots (a good day and a poor day) in public/posts/, also used as the post's cover",
    ],
  },
  {
    date: "2026-11-14", time: "13:19", by: "Claude", type: "new", commit: "20f12a9",
    title: "/plan: customers can check the weather for their date",
    notes: [
      "New step 07 on /plan: once the postcode, date, name and email are filled in, the customer can check the Met Office forecast for their postcode district",
      "Shows a verdict (Looks good, Some risk, Likely to move), a rough best time, an hour-by-hour bar chart they can tap to pick a time (dark hours greyed out), sunrise, sunset and golden light, and up to 3 better dates to switch to",
      "New \"Preferred time\" box in step 05. The plan email now includes the preferred time and a line on what the weather check showed",
      "Protecting the free Met Office allowance: forecasts shared by postcode district for an hour, each person can check up to 3 districts a day, customers can use at most 200 of the 360 daily requests, and the check only runs with a name and email filled in (plus the hidden bot trap)",
      "New Cloudflare function /api/plan-weather. Uses the existing MET_OFFICE_KEY and WEATHER_KV, so nothing to set up",
    ],
  },
  {
    date: "2026-11-14", time: "12:27", by: "Claude", type: "content", commit: "613cd10",
    title: "Old sample blog posts archived",
    notes: [
      "The eight sample posts written before launch are moved to content/posts/archive. They're kept, but no longer shown in the Viewing Room and have no page",
      "Their old web addresses redirect to the Viewing Room (temporary redirects in public/_redirects, so they can come back)",
      "The \"Read the full prep guide\" link on the property photography page pointed to one of them, so it's removed",
      "The Viewing Room now shows just the three real posts: insurance, roof checks and five listing shots",
    ],
  },
  {
    date: "2026-11-14", time: "09:58", by: "Claude", type: "content", commit: "76b6aed",
    title: "Roof check post: a much fuller \"who it's for\" section, and prices",
    notes: [
      "Nine groups, each with its own short section: homeowners after a storm, buyers, roofers quoting, roofers and builders before and after, landlords, property managers, insurance claims, solar installers, and churches, schools and other large buildings",
      "New \"How much it costs\" list: £135 one roof, £195 medium or two to three buildings, £285 large, £39 next-day photos, with repeat visits cheaper",
      "Smaller headings (###) in blog posts now have their own style",
    ],
  },
  {
    date: "2026-11-14", time: "09:54", by: "Claude", type: "change", commit: "365bb89",
    title: "Booking agreement links in blog posts open in a new tab",
    notes: [
      "So readers can check the agreement and carry on reading the post. Links to other websites in posts open in a new tab too. Links to other pages on the site still open in the same tab",
    ],
  },
  {
    date: "2026-11-14", time: "09:47", by: "Claude", type: "content", commit: "055cc69",
    title: "Insurance post: £10 million and £50,000 shown as minimums, adjustable per job",
    notes: [
      "New \"My cover at a glance\" table: public liability £10 million minimum, professional indemnity £50,000 minimum, both raised when a job needs more and written into the Job Details",
      "Headings, summary and closing line updated to say \"minimum\"; \"What insurance doesn't change\" renamed \"Insurance is a safety net, not a shortcut\"",
      "Tables in blog posts now have a proper style: navy header row, rounded border and shaded rows",
    ],
  },
  {
    date: "2026-11-14", time: "08:59", by: "Claude", type: "content", commit: "32f8e9d",
    title: "First three real blog posts",
    notes: [
      "\"Fully insured: what my drone insurance covers\": the Coverdrone commercial policy, £10 million public liability, £50,000 professional indemnity and equipment cover, in plain English. Pinned to the top of the Viewing Room",
      "\"What a drone roof check shows (and what it doesn't)\": what's photographed, the numbered pack, and where a roofer takes over",
      "\"5 shots that make a property listing stand out\": for estate agents and sellers, linking to the packages and agent accounts",
    ],
  },
  {
    date: "2026-11-08", time: "13:45", by: "Claude", type: "change", commit: "f9484b7",
    title: "The enquiry form reminds customers about the deposit when a quote is attached",
    notes: [
      "Under \"Your quote is attached\": the 25% deposit and roughly how much it is (e.g. about £55 on £219), and that the rest is paid after the shoot",
      "Quotes of £1,000 or more say no deposit is needed and they're invoiced on 30-day terms",
      "If \"Estate agent\" is picked, it adds that agent accounts have no deposit, just a monthly invoice",
    ],
  },
  {
    date: "2026-11-08", time: "13:43", by: "Claude", type: "new", commit: "63a14b8",
    title: "Agent accounts: how they work, a sign-up form and a £1,000 credit limit",
    notes: [
      "New \"How the account works\" section on /estate-agents: four steps, the £1,000 credit limit, and a sign-up form (agency, branches, invoice email, purchase order numbers, listings a month, shoot day, branding)",
      "Every \"Set up an agent account\" button, including the homepage agent band, now goes to that form. Requests arrive by email as \"Agent account request\"",
      "Booking agreement: new clause 3.9 for agent accounts (no deposit, files straight away, one monthly invoice paid in 30 days, £1,000 credit limit, bookings paused if overdue). At a glance and the Job Details payment terms updated to match. Last updated 8 November 2026",
      "The signed version (the Happy Drones Booking Agreement doc) was updated with the same wording",
      "Two new FAQs: the credit limit, and how to set up an account. Credit limit set in AGENT_ACCOUNT in lib/site.js",
    ],
  },
  {
    date: "2026-11-08", time: "13:28", by: "Claude", type: "content", commit: "4040d6d",
    title: "Last traces of FPV drone flying removed",
    notes: [
      "Fleet page: the everyday fleet no longer says it does indoor flights",
      "Local business FAQ \"Can you fly inside?\" now answers \"No\" instead of \"Not at the moment\", then explains the Pocket 3 glide",
      "Unused Avata 2 icon taken out of the code, and old FPV mentions removed from the notes files",
      "Still mentioned on purpose: the Pocket 3's FPV mode for the indoor glide, the Avata 2 in the private weather check (practice only), and clause 8.1 of the booking agreement, which must match the signed contract",
    ],
  },
  {
    date: "2026-11-08", time: "13:22", by: "Claude", type: "change", commit: "1f37a2a",
    title: "The map link in plan emails now opens a job page with the details and the weather",
    notes: [
      "One map of the customer's site (the second map, from base, is gone). Tap it, or the buttons, to open Google Maps or the phone's maps app",
      "The job: work, size, how often, extras, date wanted, guide price and the customer's notes",
      "Weather for the job day from the weather check's Met Office forecast, checked against the drone limits set there: sunrise, sunset, golden hour, a rough best time to fly, and every daylight hour marked go, caution or no-go",
      "If the date is more than about a week away, it says when the forecast opens and shows the best windows for the next few days instead",
      "Asks for the weather check passcode if the phone or PC isn't already signed in",
      "In the email, the link is now labelled \"Job page: map and weather\"",
    ],
  },
  {
    date: "2026-11-08", time: "13:14", by: "Claude", type: "fix", commit: "9dc4f5d",
    title: "After sending a plan, the page scrolls up to the \"Plan received\" message",
    notes: [
      "Before, the page stayed at the bottom where the send button was, so the confirmation was out of sight",
    ],
  },
  {
    date: "2026-11-08", time: "13:12", by: "Claude", type: "new", commit: "f2aa6a4",
    title: "Plan emails now show where the job is, with a map link",
    notes: [
      "Each mission plan email has two new lines: Area (ward and town, miles from base, travel zone and OS grid reference) and Map",
      "The Map link opens a new unlisted page, /map, with a close-up of the site, an area map with the trip from base, and the same reference details",
      "Tap either map or the buttons to open the spot in Google Maps, Apple Maps on an iPhone, the default maps app on Android, or get directions from base",
      "Base postcode (TS19 8BT) added to lib/site.js as basePostcode. The page is noindex and not in the sitemap",
    ],
  },
  {
    date: "2026-11-08", time: "13:10", by: "Claude", type: "fix", commit: "f2aa6a4",
    title: "Placeholder text in boxes uses the site font and a softer colour",
    notes: [
      "Example text like TS1 2AB now shows in Lato in a soft blue-grey, so it's clear it isn't filled in yet",
      "An empty date box (mm/dd/yyyy) shows in the same soft colour until a date is picked",
    ],
  },
  {
    date: "2026-11-08", time: "13:03", by: "Claude", type: "fix", commit: "cb01043",
    title: "Every text box uses the same font, even when the browser fills it in",
    notes: [
      "All inputs, dropdowns and text areas site-wide now use the body font (Lato)",
      "When Chrome or Edge autofills a saved postcode, name or email, the box keeps the site font and colours instead of switching to a pale box with a different font",
    ],
  },
  {
    date: "2026-11-08", time: "12:58", by: "Claude", type: "fix", commit: "d6877bf",
    title: "Date pickers readable on dark backgrounds",
    notes: [
      "The 'First flight' date on /plan had a black calendar icon on the navy background and the browser's default font. It now uses the site font and a white icon (same for every date field on dark sections)",
      "Example postcode on the planner changed from NE1 4ST to a Teesside one, TS1 2AB",
    ],
  },
  {
    date: "2026-11-08", time: "12:46", by: "Claude", type: "fix", commit: "f9ce629",
    title: "Property page menu now highlights Compare and Add-ons",
    notes: [
      "The menu bar under the heading on /property (and /services) only followed the packages, so Signature stayed highlighted after jumping to Compare or Add-ons. It now follows every section it links to",
    ],
  },
  {
    date: "2026-11-08", time: "12:42", by: "Claude", type: "change", commit: "e6ccf65",
    title: "Vacant property monitoring priced at £95 a visit; interiors on the Pocket 3 or mirrorless",
    notes: [
      "Vacant property monitoring: £95 per regular visit, £135 for a one-off or after-storm visit (VACANT in lib/site.js)",
      "Interior camera now reads 'Osmo Pocket 3 or mirrorless', as a mirrorless camera is being bought soon",
      "To-do list: weather check ideas for later (tap-a-map, airspace on the map, morning-of-job alert, take-off wind planner, flight log)",
    ],
  },
  {
    date: "2026-11-08", time: "12:30", by: "Claude", type: "change", commit: "7f28232",
    title: "Base town, business address, new roof and commercial prices, Pocket 3 interiors",
    notes: [
      "Base town Stockton-on-Tees (privacy page) and business address 4 Killerby Close, Stockton-on-Tees, TS19 8BT (booking agreement)",
      "Roof checks now from £135 (was £99): £195 for a medium roof or two to three buildings, £285 large",
      "Commercial property packages now £195, £395 and £650 (were £169, £329 and £549)",
      "Interiors shot on the Osmo Pocket 3 with a wide-angle lens: the mirrorless camera is taken off the package kit lists and the property photography facts (still listed as coming soon in the fleet)",
      "Weather check: the passcode screen no longer asks the phone or PC to save a password",
    ],
  },
  {
    date: "2026-11-08", time: "12:21", by: "Claude", type: "change", commit: "7642a0c",
    title: "New travel zones: free on Teesside and Darlington, £25 County Durham, £45 Sunderland and Tyneside",
    notes: [
      "Set by Wayne: travel included for TS and DL postcodes; DH adds £25 a visit; SR and NE add £45; anywhere else is quoted",
      "Used by the postcode check on /plan, the price desk, the 'How far do you travel?' answer, and the travel line on the roof, construction, vacant property and commercial property pages",
      "Before this, the site said travel was free across NE, SR, DH, TS and DL",
      "To-do list: business cards to redesign and reprint (first Printful batch had a white strip and poor quality)",
    ],
  },
  {
    date: "2026-11-07", time: "15:30", by: "Claude", type: "new", commit: "9e6c306",
    title: "Private weather check at /weather-check",
    notes: [
      "Flying weather for saved job sites: go, caution or no-go for each hour against your own limits for each drone",
      "Wind, gusts, estimated wind at 120 m, rain, visibility, temperature, light times, GPS (Kp index) and a 3-day planner with the best windows",
      "Save a dated A4 weather record for the job file (print or save as PDF)",
      "Uses the Met Office Global Spot forecast (free plan, 360 requests a day), kept for an hour per site so requests last",
      "Passcode-protected, hidden from Google (noindex), not linked or in the sitemap",
      "Cloudflare setup done by Wayne: MET_OFFICE_KEY and WEATHER_PIN secrets, and the WEATHER_KV storage binding",
      "Add ?demo=1 to the address to see it with example data",
    ],
  },
  {
    date: "2026-11-07", time: "08:20", by: "Claude", type: "new", commit: "cdde2fc",
    title: "Media and brand kit page at /media",
    notes: [
      "Logos to download in every version (full colour, reversed, navy, white, black), the drone mark and a square profile picture, as SVG and transparent PNG",
      "The logo was redrawn as vector files from the original PNG, so it stays sharp at any size",
      "Try-it-on tool: pick a background and the right logo version is chosen, with a warning if it's hard to see and a clear-space overlay",
      "Colours with copy buttons, RGB and approximate CMYK, and readability ratings; Blinker and Lato with a live type tester",
      "About text in three lengths with copy buttons, key facts, how to write the name, logo do's and don'ts, and the media contact",
      "A four-page brand guide PDF and a ZIP of everything (public/media)",
      "Linked from the footer and the sitemap. 'A2 CofC' added to the credentials list in lib/site.js",
    ],
  },
  {
    date: "2026-10-31", time: "10:50", by: "Claude", type: "change", commit: "0f917b6",
    title: "FPV drone flying removed from the site; the Pocket 3 glide tour stays",
    notes: [
      "Removed: the /fpv-fly-through page, /services/fpv, the stand-alone FPV fly-through (£199), the £149 FPV add-on and the Avata 2 planner add-on",
      "Avata 2 taken out of the fleet, the construction kit list and the local business kit; the fleet page now says two aircraft and a gimbal camera",
      "Removed the FPV floor plan, the 'Which tour?' diagram and the old 'Two ways I fly' section code",
      "Blog: two FPV posts removed; 'Photos, video or FPV' rewritten as 'Photos, video or a glide tour' with a new address; FPV lines taken out of three other posts",
      "Old FPV links redirect to /walkthrough-video (and the renamed post to its new address)",
      "Signature still includes a one-take Pocket 3 glide tour at the same price",
      "The booking agreement at /terms still mentions FPV delivery times, because it must match the signed contract (on the to-do list)",
    ],
  },
  {
    date: "2026-10-28", time: "10:45", by: "Claude", type: "new", commit: "1610fa0",
    title: "Vacant property monitoring page at /vacant-property-monitoring (on the 'smaller' branch)",
    notes: [
      "Monthly drone checks of empty buildings: roof, lead, gutters, windows, doors, walls, fences and fly-tipping",
      "Interactive: drag through a year of visits and watch damage appear; tap a part of the building to see what's checked; an example monthly report",
      "Says clearly it works alongside the weekly inside-and-outside checks insurers ask for, not instead of them",
      "Price shows 'on request' until VACANT.perVisit is set in lib/site.js",
      "Linked from the construction page, the homepage construction card, the footer and the sitemap",
      "Added to TODO.md with the price and the page's promises to confirm",
    ],
  },
  {
    date: "2026-10-27", time: "19:05", by: "Claude", type: "change", commit: "cf01ad3",
    title: "FPV drone fly-throughs paused; Signature now includes a one-take Pocket 3 glide tour (same £379)",
    notes: [
      "Stand-alone FPV fly-through (£199), the £149 FPV add-on and the Avata 2 planner add-on are hidden from the quote builder, price lists and agent package builder",
      "/fpv-fly-through is unlisted: out of the footer, the sitemap and Google, but the page still works",
      "/services/fpv shows as coming soon",
      "Avata 2 wording removed from the estate agents, walkthrough, local business, commercial property, construction, fleet, services and FAQ text; the 'Which tour?' diagram and the FPV floor plan are hidden on the estate agents page",
      "The booking agreement at /terms is unchanged (it must match the signed contract)",
    ],
  },
  {
    date: "2026-10-27", time: "19:05", by: "Claude", type: "change", commit: "cf01ad3",
    title: "Concept (on the 'smaller' branch): homepage reworked around Wayne's chosen services",
    notes: [
      "Main cards: property (with estate agents), roof inspections and construction progress",
      "Smaller cards: aerial photography and walkthrough video",
      "Hero buttons: property packages, roof inspections, construction progress",
      "Menu: Property, Estate agents, Roofs, Construction, Viewing Room, Contact",
      "Construction time-slider back on the homepage; local business and the 'Also available' strip taken off",
    ],
  },
  {
    date: "2026-10-27", time: "18:20", by: "Claude", type: "change", commit: "604a0d3",
    title: "Concept (on the 'smaller' branch): homepage focused on three main services",
    notes: [
      "New 'Three things I do well' cards: property, roof inspections and local business content",
      "Hero wording and buttons now name the three services",
      "Menu: Property, Roofs, Local business, Estate agents, Viewing Room, Contact (Commercial, Services and Fleet taken out of the menu; the pages still exist)",
      "Removed from the homepage: 'Two ways I fly', the fleet grid, 'Who it's for' tabs, the FPV floor plan and the construction time-slider",
      "New 'Also available' strip linking aerial photography, walkthrough video, FPV, commercial property and construction",
      "Concept only: not on main or live until Wayne decides",
    ],
  },
  {
    date: "2026-10-27", time: "14:26", by: "Claude", type: "change", commit: "960ef3a",
    title: "Every price now comes from the settings, so one change updates the whole site",
    notes: [
      "New settings in lib/site.js: AGENT_DISCOUNT, AGENT_MIN_PER_MONTH, BUNDLE, WHITE_LABEL and TRAVEL",
      "The agent discount maths and the '10%' wording now use the same number (they were set separately in three places)",
      "White-label prices (£29 / £15 / free) now come from one setting everywhere except the booking agreement, which must match the signed contract",
      "Commercial property extras (extra units, out of hours) moved into CP_PRICES in lib/cproperty.js; next-day uses the main next-day price",
      "Prices written into sentences now read from the settings: aerial 'from' price, roof 'from' price, £49 intro, £45 travel fee, bedroom add-ons, payment terms and insurance figures",
      "Price notes updated to match",
      "Nothing on the website looks different: every figure was checked after the change",
    ],
  },
  {
    date: "2026-10-27", time: "14:26", by: "Claude", type: "content", commit: "960ef3a",
    title: "'Precision from above' replaced with 'Every angle. One visit.'",
    notes: ["The /links page motto", "The link-preview description"],
  },
  {
    date: "2026-10-27", time: "14:20", by: "Claude", type: "new", commit: "92245f1",
    title: "FPV fly-through page at /fpv-fly-through",
    notes: [
      "Hero: a looping first-person dive from the front door through the living room and kitchen and up over the garden, with a camera HUD",
      "Scroll to fly the route: the flight path draws across a floor plan with the drone following it, and the first-person view and height change with each segment",
      "Spot the hazards: tap the plan to find the seven things sorted before flying (fan, door, throws, mirror, people, glass doors, the dog)",
      "Which tour for which space (walkthrough, Pocket 3 glide, FPV), where FPV works beyond houses, and three ways to buy it",
      "How a fly-through is made, the Avata 2 and FAQs",
      "Linked from the FPV service page, the footer and the sitemap",
    ],
  },
  {
    date: "2026-10-27", time: "14:10", by: "Claude", type: "change", commit: "2d36beb",
    title: "Clear notes on every price in the settings files",
    notes: [
      "A 'Prices — start here' box at the top of the prices in lib/site.js, with how to change a price safely",
      "Every service, extra, payment setting, agent setting and planner setting now says which pages it changes",
      "'Also typed in' notes list the few places where the same figure is written into a sentence and needs changing by hand",
      "Same notes on the commercial property prices in lib/cproperty.js",
      "Notes only: nothing on the website looks different",
    ],
  },
  {
    date: "2026-10-27", time: "13:08", by: "Claude", type: "new", commit: "135e49f",
    title: "Aerial photography page at /aerial-photography",
    notes: [
      "Hero: the drone circles high over the house with the plot outlined in the wider street",
      "Height slider: drag from 5 m to the 120 m legal limit and watch the view widen from the front garden to the whole neighbourhood, with what each height shows",
      "Drag-to-compare: the house from the pavement against the same house from 30 m",
      "Hero aerial with switchable labels: plot outline, garden facing with a north arrow, parking and what's nearby",
      "Sideways rail of the eight standard aerial shots, each drawn live, plus the four video moves",
      "Prices for aerial only by size, aerials in each package, extras, the rules, the kit and FAQs",
      "The house drawing gained a wider-street mode, a plot outline and labels",
      "Linked from the aerial service page, the footer and the sitemap",
    ],
  },
  {
    date: "2026-10-27", time: "10:12", by: "Claude", type: "new", commit: "a4da041",
    title: "Local business content page at /local-business",
    notes: [
      "Hero: a phone scrolling a feed of vertical clips from a café, gym, venue, barber and trades business",
      "Scroll through the morning: each stage of a two-hour shoot drops posts onto a four-week content calendar (15 photos, 4 clips, a website film, plus the FPV add-on)",
      "Business picker: café, gym, salon, trades, shop and venue, each with its own illustrated frontage, shot list, best clip and a tip",
      "Formats: one shot framed for 9:16, 4:5, 1:1 and 16:9",
      "Map listing before and after one shoot",
      "Price calculator from the mission planner: size and how often, with price per visit and per piece of content",
      "Add-ons, how it runs, the kit and FAQs (usage rights match section 9 of the booking agreement)",
      "Linked from the business content service page, the footer and the sitemap",
    ],
  },
  {
    date: "2026-10-27", time: "09:57", by: "Claude", type: "new", commit: "32ae7d0",
    title: "Walkthrough video page at /walkthrough-video",
    notes: [
      "Hero: a walkthrough 'video' playing on a loop at three times speed, from the aerial opening through each room to the end card",
      "Scroll to scrub: the scroll position is the playhead of a 75-second edit, with each clip's camera move, captions and an edit timeline you can tap to jump",
      "Six camera moves (push-in, glide, reveal, pan, tilt up, aerial pull-back) as looping thumbnails",
      "Landscape vs vertical: switch formats and watch the frame reshape around the same room",
      "Branding picker: standard, agency-branded or white label, with the end card and white-label prices",
      "Walkthrough vs FPV fly-through, Showcase and Signature with extras, how it runs, the kit and FAQs",
      "Linked from the walkthrough service page, the footer and the sitemap",
    ],
  },
  {
    date: "2026-10-27", time: "09:51", by: "Claude", type: "new", commit: "55a10ec",
    title: "Property photography page at /property-photography",
    notes: [
      "Hero: a living room through a viewfinder, cycling through three bracketed exposures to the blended photo",
      "Scroll-driven shoot: the front, living room, kitchen, main bedroom, bathroom, the plot from the air and the dusk shot, with a floor plan showing where the camera stood",
      "Drag-to-compare slider: one exposure (window burnt out) against the blended photo, plus the three brackets that make it",
      "Prep room: tick six jobs (lights, curtains, surfaces, cushions, toys, laundry) and watch the room tidy itself, plus prep lists for kitchen, bathroom, bedrooms and outside",
      "Dusk slider: drag or play the evening from 2 pm to blue hour",
      "Photo planner: pick bedrooms and a package to see roughly how the photos are shared out and the price",
      "What gets edited and what never does, the three packages, how a shoot runs and FAQs",
      "Linked from the photography service page, the footer and the sitemap",
    ],
  },
  {
    date: "2026-10-27", time: "09:33", by: "Claude", type: "new", commit: "9556ce9",
    title: "Roof inspections page at /roof-inspections",
    notes: [
      "Hero with an animated isometric house: the drone circles while its camera sweeps the roof",
      "Scroll-driven inspection flight: overview, slopes, ridge, chimney, gutters, flat roof and verges, dropping a numbered pin at each stop, then the marked overview",
      "Drag-to-compare slider: the chimney from the pavement against the same chimney from the drone",
      "Roof anatomy explorer: a roof from directly above with nine tappable parts (what it is, what gets photographed, what a roofer looks at)",
      "Sideways rail of nine situations people book a roof check for, and five ways of looking at a roof compared (Checkatrade 2026 figure for chimney scaffolding)",
      "Example photo pack drawn live from the same house, with an example download folder",
      "Guide prices by roof size, one-off or quarterly, from the mission planner; kit, coming next, straight answers and FAQs",
      "Linked from the roofs service page, the footer and the sitemap",
    ],
  },
  {
    date: "2026-10-27", time: "09:33", by: "Claude", type: "fix", commit: "9556ce9",
    title: "Planner prices for a small site now match the advertised 'from' price",
    notes: [
      "The mission planner rounded every price to the nearest £5, so a £99 roof check showed as £100 and a £179 construction visit as £180",
      "Small sites now use the exact price; medium and large are still rounded to the nearest £5",
      "Same fix on the construction page price table and the price desk",
    ],
  },
  {
    date: "2026-10-27", time: "09:08", by: "Claude", type: "new", commit: "450fbcd",
    title: "Private price desk at /custom-price",
    notes: [
      "Bare-bones phone calculator for giving a quick estimate on a call: about 11 KB, no fonts, images or site header",
      "Covers property packages, commercial property, construction progress, film, roofs, events and business content",
      "Customer type (homeowner, agent pay as you go, agent account, bundle), white label, extras, extra units and travel",
      "Shows the breakdown, an 'about' total and the deposit or invoice terms, with a button to copy a summary for WhatsApp or email",
      "Prices come from the same settings as the website; not linked, not in the sitemap, and marked noindex",
    ],
  },
  {
    date: "2026-10-27", time: "09:04", by: "Claude", type: "new", commit: "ea1a5d3",
    title: "Commercial property page at /commercial-property",
    notes: [
      "Hero with an animated isometric industrial unit, offices, yard and parking",
      "Scroll-driven flyover: the camera rises from the frontage to 120 m, stopping at six labelled shots (frontage, parking, loading, roof, access, context)",
      "Property type explorer: industrial, offices, retail, trade counter, development land and leisure, each with a drawing, what occupiers want, a shot list and the usual package",
      "Location map with drive-time rings and switchable layers (roads, rail and ports, amenities, neighbours)",
      "Three packages priced by unit size (from £169, £329, £549; guide prices for Wayne to confirm), extras and billing",
      "Linked from the estate agents page, the agent FAQ, the footer and the sitemap",
    ],
  },
  {
    date: "2026-10-27", time: "08:56", by: "Claude", type: "new", commit: "a536b89",
    title: "Estate agents page rebuilt as an in-depth, interactive guide",
    notes: [
      "Tour finder: slide through six property types to see the floor plan, the animated tour route, the aerial orbit, the kit, the usual package and the starting price",
      "Small homes get a Pocket 3 FPV-mode glide; bigger homes get an Avata 2 fly-through",
      "'Which tour?' decision diagram",
      "Sideways strip: a listing from instruction to sale in eight steps",
      "Three ways to work together (pay as you go, agent account, 10-listing bundle), each with a billing timeline",
      "Package builder: package, size, extras, working model and white label, with the price per listing and a when-you-pay bar",
      "Commercial property teaser (a dedicated page is on the to-do list) and five new agent FAQs",
    ],
  },
  {
    date: "2026-10-27", time: "08:43", by: "Claude", type: "new", commit: "16146c7",
    title: "In-depth construction progress page at /construction",
    notes: [
      "Hero with a live, looping isometric build and key numbers (monthly from £162 a visit, 4–6 fixed positions, 48–72 h, £10m insured)",
      "Scroll-driven build: scrolling advances the site from bare plot to handover, with trade progress bars",
      "Sideways filmstrip of 14 dated visits from the same position (drag, swipe or arrows)",
      "Interactive capture plan with six fixed positions, heights and angles",
      "Deliverables, example delivery folder, who it's for, 7-step process, price grid from the planner, kit, compliance and honest limits",
      "Measured progress (RTK) roadmap: Mavic 3 Enterprise + RTK, then Matrice 4E, with a 'measured contract' enquiry",
      "Linked from the commercial page, homepage paths, the construction service page, the build slider and the footer",
      "Shared isometric drawing (lib/isoBuild.js) now scales to fit; commercial page no longer mentions 'measured' roof inspections",
    ],
  },
  {
    date: "2026-10-27", time: "08:07", by: "Claude", type: "new", commit: "8ae9ded",
    title: "Cookie banner and cookie policy",
    notes: [
      "First-time visitors see a cookie banner with Accept and Essential only; the choice is remembered",
      "New /cookies page listing exactly what the site stores (no tracking or advertising cookies)",
      "YouTube videos ask before loading for anyone who chose Essential only",
      "Footer: Cookie policy and Cookie settings links; privacy page mentions Cloudflare's security cookie",
    ],
  },
  {
    date: "2026-10-26", time: "16:18", by: "Claude", type: "setup", commit: "cedc134",
    title: "Site prepared for Cloudflare Pages hosting",
    notes: [
      "public/_redirects: /change-log and /changes still lead to the changelog",
      "public/_headers: long caching for site files; the hidden forms file kept out of search",
      ".node-version set to 22 for Cloudflare's build",
      "Netlify settings left in place until the switch is complete",
    ],
  },
  {
    date: "2026-10-26", time: "15:54", by: "Claude", type: "change", commit: "0fbc1ab",
    title: "White label priced by booking size, free on 10-listing bundles",
    notes: [
      "£29 one-off, £15 on agent accounts (4–9 a month), free on a 10-listing bundle or 10+ a month",
      "Bundles: paid up front, used within 3 months, inside the normal travel area, and still get the agent discount",
      "Estate agents page: white-label price table and a new bundle FAQ",
      "Booking agreement 9.6 and the Job Details updated to match",
    ],
  },
  {
    date: "2026-10-26", time: "15:45", by: "Claude", type: "new", commit: "ccde669",
    title: "White-label service for estate agents",
    notes: [
      "Estate agents page: new 'Your brand, not mine' section with Standard, Agency-branded (included) and White label (+£29 per listing)",
      "White label added as an extra in the quote builder for property packages",
      "Agent FAQs updated, plus a new one on whether listings are posted to socials",
      "Booking agreement: new clause 9.6 on branding, and a Branding row in the Job Details",
    ],
  },
  {
    date: "2026-10-26", time: "15:19", by: "Claude", type: "fix", commit: "f30347f",
    title: "Future fleet: Mavic 3 Pro changed to DJI Mavic 3 Enterprise",
    notes: ["New role, specs and description: inspection and survey workhorse with a 56× hybrid zoom", "Roadmap and fleet page description updated"],
  },
  {
    date: "2026-10-26", time: "15:16", by: "Claude", type: "change", commit: "a9ebcd5",
    title: "Fleet shows what's flying today and where the business is heading",
    notes: [
      "Flying today: Mini 4 Pro, Neo 2, Avata 2 and Osmo Pocket 3",
      "Coming soon: Mavic 4 Pro, Mavic 3 Enterprise, Matrice 4E and a mirrorless camera, in a new 'Where Happy Drones is heading' section",
      "Mapping & 3D marked coming soon: no price, not in the planner or quote builder, 'Tell me when it launches' button",
      "Services now list only the drones actually used; 6K film and 3D model extras hidden until the kit arrives",
      "Commercial page: 'Heavier aircraft are on the way', and the mission count is now five",
      "Roadmap updated: Now, Next (mirrorless, Mavic 4 Pro and Mavic 3 Enterprise), Later (Matrice 4E mapping, thermal)",
    ],
  },
  {
    date: "2026-10-26", time: "10:46", by: "Claude", type: "content", commit: "edd9438",
    title: "Insurance shown as £10m liability and £50k indemnity, adjustable per contract",
    notes: [
      "\"Adjustable per contract if required\" added next to the amounts in the footer, homepage strip, services page, /links and the insurance FAQ",
      "Booking agreement (/terms and the signed version) now lists both covers and says changes go in the Job Details",
      "Wording lives in SITE.insurance.note in lib/site.js",
    ],
  },
  {
    date: "2026-10-26", time: "09:19", by: "Claude", type: "setup", commit: "4abb6b3",
    title: "Website only updates when changes are published to the live branch",
    notes: [
      "Netlify's free plan charges 15 of its 300 monthly credits for every live update",
      "Everyday changes now go to the main branch, which Netlify ignores (free)",
      "The website updates only when main is copied into the live branch",
      "Changes to notes files only (TODO, CLAUDE.md, READMEs) never trigger an update",
    ],
  },
  {
    date: "2026-10-26", time: "09:06", by: "Claude", type: "new", commit: "00cbc92",
    title: "Private changelog page",
    notes: [
      "This page: every change to the site, newest first, at /changelog",
      "Not linked anywhere, hidden from Google, left out of the sitemap",
      "/change-log and /changes also work",
      "Added a CLAUDE.md note so every future change is logged here",
    ],
  },
  {
    date: "2026-10-26", time: "09:03", by: "Claude", type: "new", commit: "3b976f6",
    title: "Booking agreement published at /terms",
    notes: [
      "Full agreement, word for word with the signed version",
      "Job Details, signatures and cancellation form left blank",
      "Linked from the footer, the packages section and the enquiry form",
      "Prints cleanly without the menus",
    ],
  },
  {
    date: "2026-10-26", time: "06:00", by: "Claude", type: "content", commit: "e021415",
    title: "Deposit marked as non-refundable if the customer cancels",
    notes: [
      "Payment strip and the \"How do I pay?\" FAQ explain what the deposit pays for",
      "Homeowners' 14-day cancellation right mentioned",
    ],
  },
  {
    date: "2026-10-26", time: "05:44", by: "Claude", type: "new", commit: "ff52653",
    title: "Deposit and payment terms shown on pricing",
    notes: [
      "Payment strip under the property packages",
      "Quote builder shows the 25% deposit for the quoted total",
      "Mission planner shows the deposit, or 30-day invoice terms for £1,000+ and repeat visits",
      "FAQs updated on the homepage and commercial page",
      "All values in one place: PAYMENT in lib/site.js",
    ],
  },
  {
    date: "2026-10-25", time: "12:29", by: "Claude", type: "content", commit: "5451051",
    title: "Business email wayne@happydrones.co.uk added across the site",
    notes: [
      "Email button in the contact section, footer, /links and Google business data",
      "Privacy page: placeholders filled in (name, town, date, how long data is kept)",
      "Privacy page now lists Web3Forms and Google Workspace",
    ],
  },
  {
    date: "2026-10-25", time: "12:25", by: "Wayne", type: "setup",
    title: "Google Workspace set up for wayne@happydrones.co.uk",
  },
  {
    date: "2026-10-25", time: "12:12", by: "Claude", type: "setup", commit: "f4d6f2a",
    title: "Web3Forms access key added, so enquiries are emailed",
  },
  {
    date: "2026-10-25", time: "12:11", by: "Claude", type: "new", commit: "84df37b",
    title: "Enquiries emailed via Web3Forms, with Netlify Forms as backup",
    notes: [
      "New lib/sendForm.js used by the contact form and the mission planner",
      "Counts as sent if either service works; the error only shows if both fail",
      "Emails have clear subject lines and Reply goes to the customer",
    ],
  },
  {
    date: "2026-10-25", time: "11:58", by: "Claude", type: "fix", commit: "46b6006",
    title: "Redeploy so Netlify picks up the quote and mission forms",
    notes: ["Form detection had just been switched on in Netlify"],
  },
  {
    date: "2026-10-25", time: "11:56", by: "Wayne", type: "setup",
    title: "Netlify form detection switched on",
  },
  {
    date: "2026-10-25", time: "11:55", by: "Claude", type: "fix", commit: "bc63cb7",
    title: "Hidden Netlify forms file tidied",
    notes: ["Mission form laid out properly and given its form-name field", "File hidden from search engines"],
  },
  {
    date: "2026-10-25", time: "11:51", by: "Claude", type: "fix", commit: "994b029",
    title: "X social card text lengthened so all five cards line up",
  },
  {
    date: "2026-10-25", time: "11:47", by: "Wayne", type: "change", commit: "e78356d",
    title: "Spacing fix, favicon and social links",
    notes: [
      "Space above the property packages now scales down on phones",
      "Favicon, app icon and Apple touch icon (orange drone on navy)",
      "YouTube, TikTok, LinkedIn and X links added, with a LinkedIn icon",
      "TODO.md added",
    ],
  },
  {
    date: "2026-10-25", time: "11:30", by: "Wayne", type: "fix", commit: "aabaeda",
    title: "Added space above the packages section",
  },
  {
    date: "2026-10-25", time: "11:10", by: "Wayne", type: "new", commit: "9a7e037",
    title: "Site uploaded to GitHub (happydrones-2026)",
    notes: ["The full Next.js site, connected to Netlify"],
  },
  {
    date: "2026-10-24", by: "Claude", type: "new",
    title: "Final Happy Drones site built (before GitHub)",
    notes: [
      "Happy Drones and the Tomorrow UAV design merged into one site",
      "Commercial page, fleet page, safety page, mission planner and 10 service pages",
      "Fleet: Mini 4 Pro, Neo 2, Avata 2, Osmo Pocket 3, Mavic 4 Pro, Mavic 3 and Matrice 4E",
      "/links page for social bios",
    ],
  },
];
