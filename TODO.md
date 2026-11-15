# Happy Drones website: to do

## Next up
- [ ] **Business cards: fresh design and reprint (not urgent).** The first 100 from Printful came back with a white strip down one side and poor print quality. Wayne wants a fresh design, printed with a better printer such as Vistaprint, using its exact template and checking the proof before paying.
- [ ] **New link preview image.** Replace `public/og.png` with `og.png` from the social kit (09-Website-and-Email).

## Pages to build
- [ ] **Vacant property monitoring (new idea, 28 Oct 2026).** Monthly drone checks of empty buildings waiting for redevelopment: roof, lead, gutters, windows, fences, fly-tipping and signs of entry, with a dated report each visit. Sold as the outside-and-roof record alongside the owner's weekly walk-round, not as a replacement for the insurer's inside checks. Page is live at /vacant-property-monitoring.
  - [x] **Monthly price set** (8 Nov): £95 a regular visit, £135 for a one-off or after-storm visit (VACANT in lib/site.js).
  - [ ] **Check the page's promises.** Report within 48–72 hours of each visit; a message on the day if something looks urgent (open roof, signs of entry); extra visits after storms between the monthly ones; monthly or quarterly visits invoiced on 30-day terms; a fixed price and first visit date within a day of asking.
- [ ] **In-depth service pages, one by one.** Aerial film and events (moved to last by Wayne, 27 Oct 2026).
- [ ] **Check the roof inspection page.** /roof-inspections: confirm the deliverables (overview, every slope, chimney, gutters, flat roofs, numbered and marked) match what you'll actually send. Prices set 8 Nov: £135 one roof, £195 medium or two to three buildings, £285 large.

- [ ] **Check the walkthrough page.** /walkthrough-video says the walkthrough is only sold inside Showcase or Signature, comes in landscape and vertical, with licensed music and room captions, and that you get a link to add as the portal video tour. Confirm, or say if you want walkthroughs sold on their own.

- [ ] **Check the local business page.** /local-business says one visit gives about 20 pieces (15+ photos, 3–5 clips, a 60-second film), delivered in 5 working days, priced from the mission planner (£199 a visit, less on repeat visits). It also says you don't post for them. Confirm, or change any of it.
- [ ] **Social exports.** When you want them: short MP4s, stills and carousels of the interactive pieces for Facebook, X and Instagram (see the chat on 27 Oct).

- [ ] **Check the aerial page.** /aerial-photography says aerial-only takes about 30 minutes with no one home, includes a short clip, the plot outline is drawn by eye as a guide (not a legal boundary), and lists an eight-shot standard list. Confirm.
- [ ] **Optional: prices in a JSON file.** Every price now reads from lib/site.js and lib/cproperty.js. If Wayne wants, move them into one JSON file with nothing else in it.


## Accounts and bookings (built 15 Nov, test mode)
- [x] **Switch it on in Cloudflare (Wayne, about 10 minutes).** Workers & Pages → D1 → Create database, name it `happydrones-db`. Then the Pages project → Settings → Bindings → add D1 database, variable name `DB`, pick `happydrones-db`. Then Settings → Variables and secrets → add `ADMIN_EMAIL` = wayne@happydrones.co.uk and `TEST_MODE` = 1. The tables build themselves on first use.
- [ ] **NEXT: full test run (Wayne).** Admin → Test tools → Reset everything (type RESET). Then:
  1. **Quote route:** send a homepage quote with your personal email → confirmation email with Q- reference and private link → wayne@ notification opens it in the Enquiries tab → Contacted → Turn into a booking → customer email "ready to sign" → create the account with that email, sign, pay (card 4242 4242 4242 4242) → It's a go.
  2. **Direct route:** as Lynn (Test tools) → a service page → Book online → sign → pay → edit the price in the admin → Lynn approves → It's a go → deliver (any https link) → Lynn pays the balance → files unlock.
  3. **Also try:** decline a change, cancel as the customer, back out of Stripe, a declined card (4000 0000 0000 0002), record a refund, the /plan mission form, delete a customer, a customer downloading and deleting their own data.
  4. **Note anything odd or clunky** and send it to Claude in one message.
- [ ] **Stripe webhook check.** After a test payment, Stripe → Webhooks → your destination → Event deliveries should show green ticks. If red, tell Claude the error shown.
- [x] **Stripe test keys.** When the Stripe account is ready: add `STRIPE_SECRET_KEY` (sk_test_…) as a Cloudflare secret, and a webhook to https://happydrones.co.uk/api/stripe-webhook for `checkout.session.completed`, saving its signing secret as `STRIPE_WEBHOOK_SECRET`. Never paste keys into chat or code.
- [x] **Real emails.** Free Resend account (3,000 a month, 100 a day), region Ireland, verify happydrones.co.uk (DNS records in Cloudflare), sending-only API key as secret `RESEND_KEY`, plain text `MAIL_FROM` = Happy Drones <bookings@happydrones.co.uk>. Add bookings@ as a free alias in Google Workspace so emails sent to it reach Wayne. Until then emails only appear in the admin's Emails tab.
- [ ] **ICO registration** (data protection fee, about £52 a year) before real customers sign up.
- [x] **Privacy policy update** for accounts, Stripe, Resend and Cloudflare (15 Nov).
- [ ] **ICO number on the privacy policy.** Once registered, add the registration number to the "Who I am" section.
- [x] **Booking agreement clauses** for online booking and the 10-listing bundle (3.10), in /terms and the signed document (15 Nov).
- [ ] **Bundle reminders run when someone opens the site.** They check at most once an hour, when you open the admin or a customer opens their account. On a quiet week a reminder could go out a little late. Later: a scheduled daily check.
- [ ] **Going live with real customers (do these together, Claude can walk through it):**
  1. Test run above done and any fixes published.
  2. ICO registration done and the number on the privacy policy.
  3. A solicitor or small-business legal service has read the booking agreement once (it's now signed online).
  4. Admin → Test tools → Reset everything, one last time.
  5. Stripe: switch to live mode, create a live secret key and a live webhook (same URL and event), replace `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` in Cloudflare.
  6. Cloudflare: delete `TEST_MODE` (or set it to 0), then redeploy. The Test tools tab disappears and sign-in codes only go by email.
  7. Do one real booking yourself for a small amount and refund it in Stripe.
  8. Optional: Workers Paid ($5/month) and `PW_ITER` = 100000 for stronger password hashing.
  9. Then switch Web3Forms off (`formKey` = "" in lib/site.js) once the admin has proved itself.
- [x] **E-signing, customer approval of changes, and It's a go confirmation** (15 Nov).
- [x] **Old test bookings from before e-signing:** cleared with Reset everything (15 Nov).
- [x] **Every enquiry saved in the admin** (Enquiries tab), with a confirmation and private link for the customer, and Turn into a booking (15 Nov).
- [ ] **Check Cloudflare's build command is `npm run build`** (Workers & Pages → project → Settings → Build). That runs the full security check, including every built page. If it says `npx next build`, change it to `npm run build`.
- [ ] **After publishing the security headers:** re-run the Mozilla Observatory (developer.mozilla.org/en-US/observatory) and SSL Labs, and send Claude the results. The CSP still allows inline scripts because Next.js needs them; tightening that (per-page hashes) is a later job. HSTS has no includeSubDomains/preload yet: add once every subdomain is known to be https.
- [ ] **DNSSEC (Wayne, 5 minutes, from internet.nl).** Cloudflare → happydrones.co.uk → DNS → Settings → DNSSEC → Enable. If the domain is registered with Cloudflare it finishes itself; otherwise copy the DS record Cloudflare shows into your domain registrar's DNSSEC settings exactly. Re-run internet.nl a day later.
- [ ] **security.txt renewal:** update the Expires date in public/.well-known/security.txt before 15 Nov 2027 (the build warns 60 days ahead).
- [ ] **Later, optional (internet.nl):** CAA record for the domain (careful: must allow Cloudflare's certificate authorities or the padlock breaks); stricter TLS cipher settings need a paid Cloudflare add-on, not worth it now (SSL Labs already A).
- [x] **From the 15 Nov review, done:** server-side quote prices; no typed text in confirmation emails; admin job link built by the site; tests saved in the project (`npm test`); complete data download; safer deletion; 7-year clean-up of job records; ICO line on the privacy policy.
- [ ] **ICO number (Wayne):** when you have it, tell Claude, or put it in `icoNumber` in lib/site.js. It then shows on the privacy policy.
- [ ] **Move testing off the live site (Wayne + Claude, 20 minutes).** Set up a private Cloudflare preview copy with its own D1 database and `TEST_MODE`, then remove `TEST_MODE` from Production so real visitors never see test mode.
- [ ] **Bot check on the forms (Wayne + Claude).** Cloudflare Turnstile (free): Wayne creates a site key in Cloudflare; Claude adds it to the quote, mission and sign-up forms.
- [ ] **Decide: sign in by emailed code only (no passwords) for customers.** Simpler for people who book once or twice a year. Needs a small change to clause 12.5 of the booking agreement, so it's Wayne's call.
- [ ] **PDF copy of the signed agreement** as well as the HTML file (some email apps block HTML attachments).
- [ ] **Solicitor's read of the booking agreement** before real customers.
- [ ] **Ideas for later:** a daily scheduled check (bundle reminders, unsigned-booking clean-up) instead of running when someone opens the site; database backups; an "Edit" for the customer's own booking notes; PDF copy of the signed agreement as well as the HTML file.
- [ ] **Later: click, pay, Wayne turns up.** Fully automatic flow: customer picks a service and a slot from Wayne's real availability, pays in full, it lands in Google Calendar, morning-of reminder email, delivery and a review request afterwards. Needs Google Calendar and Drive connected; backups of the database too.

## Waiting on Wayne
- [ ] **Web3Forms: point it at wayne@ or switch it off.** Enquiries now save in the admin. Web3Forms is only a backup email and probably still goes to your personal Gmail. When you trust the admin, set `formKey` to "" in lib/site.js to switch it off.
- [ ] **bookings@ alias.** Add bookings@happydrones.co.uk as an alternate email on your Google Workspace user so anything sent to it reaches you.
- [ ] **Stronger Google two-step.** Add Google prompts or an authenticator app, keeping the text message as a backup.
- [ ] **Original logo file.** The logos on /media were traced from the PNG. If whoever designed the logo has the original vector file (.ai, .eps, .svg or .pdf), send it and Claude will swap it in.
- [ ] **Booking agreement mentions FPV.** /terms clause 8.1 gives delivery times for FPV. It has to match the signed contract, so it's unchanged. Remove FPV next time the contract is updated, then update /terms to match.
- [ ] **Finish the Cloudflare move (optional, any time).** Netlify's repo link is removed (15 Nov), so it no longer builds or uses credits. Last step: in Netlify, remove the happydrones.co.uk domain from the site, then delete the site.
- [ ] **Mavic 4 Pro.** Owned or not? It's currently marked coming soon.
- [ ] **Interior photos.** The site says interiors are shot on the "Osmo Pocket 3 or mirrorless" with a wide-angle lens (8 Nov). A mirrorless camera is coming soon (looking at the Sony A7 II or Canon M50). When it's bought, mark it as owned in the fleet (the "camera" kit in lib/site.js). Check the property photography page's claim that each angle is shot as three exposures and blended matches how you shoot.

## When ready
- [ ] **Approve the draft blog posts.** 14 are written and waiting at happydrones.co.uk/drafts (after the next publish, or localhost:3000/drafts). Say "approve" with the title, or what to change. Plan: one a week, with its social posts.
- [ ] **Google review link.** In Google Business Profile, "Ask for reviews", copy the link into googleReviewUrl in lib/site.js. Until then /review shows the Facebook button only.
- [ ] **Check the new service prices.** Set 14 Nov in lib/extraServices.js: roof health check £119/yr, claim pack £165, gutter check £79, solar pre-survey £95, before-and-after £195, time-lapse £149, planning photos £195, aerial 360 £95, land and plots £175.
- [ ] **First real jobs in the gallery.** Add before-and-after photos (with the customer's permission) to lib/gallery.js and public/work/.
- [ ] **Coming soon services.** Thermal inspections (thermal drone + thermography training), mapping and 3D (Matrice 4E), indoor fly-throughs (Avata 2 practice). Interest requests arrive by email as "Interest: ...".
- [ ] **Needs an account first (not built yet):** morning-of-shoot text or email to customers (an SMS or email-sending service), a "can a drone fly here?" airspace map (an airspace data provider), a client progress portal and an agent dashboard (logins and file storage). Set up an account and I'll build each one.
- [ ] **First agent account: set it up in QuickBooks.** Add the agency as a customer with 30-day terms, log each shoot as it happens, and send one invoice at month end with each address as a line, 10% off. Keep what they owe under the £1,000 limit (clause 3.9). Anyone who signed the booking agreement before 8 Nov needs to sign the new version (with 3.9) before their account starts.
- [ ] **Weather check: new features.** It works (tested live, 8 Nov). Done: the passcode no longer prompts the phone or PC to save a password. Ideas for later:
  - [ ] **Tap-a-map.** An interactive map: tap anywhere to see the forecast and go/no-go for that exact spot, with saved sites shown as pins. Useful for quotes before there's a postcode.
  - [ ] **Airspace on the map.** Show airport flight restriction zones and other restricted areas around a site, so a job that needs permission stands out early.
  - [ ] **Morning-of-job alert.** An email or phone notification at 7am on a job day with the verdict and best window, so you know before you set off.
  - [ ] **Take-off wind planner.** Wind direction drawn on the site map, so you can pick a take-off spot sheltered from the wind and land into it.
  - [ ] **Flight log.** Keep each saved weather record against the job, building a dated history for insurance and for the CAA if ever asked.
- [ ] **Showreel.** Add a YouTube link to `showreel` in `lib/site.js` to switch on the homepage video section.
- [ ] **Reviews.** Add real reviews to `reviews` in `lib/site.js` and the section appears by itself.
- [ ] **Real photos.** Add photos of real shoots (property, aerial, construction) to replace the illustrations.
- [ ] **Credentials.** Add GVC to `credentials` in `lib/site.js` if you get it (A2 CofC is already listed).
- [ ] **Optional hello@ alias.** Add hello@happydrones.co.uk as a free alias in Google Admin.

## Done
- [x] The playground (/playground): a pretend booking for any service, start to finish, with example emails and a show-around. (15 Nov 2026)
- [x] Nine new services with pages and prices, three coming-soon services with interest forms, online roof report (/report), review page (/review), before-and-after gallery (/work) and 14 draft blog posts at /drafts. (14 Nov 2026)
- [x] /plan weather check for customers: verdict, best time, tap-to-pick hour chart, better dates; limited to 3 areas a person and 200 Met Office requests a day for customers. (14 Nov 2026)
- [x] First three real blog posts (insurance, roof check, 5 listing shots); the old sample posts archived in content/posts/archive, with their addresses redirected to the Viewing Room. (14 Nov 2026)
- [x] Agent accounts on /estate-agents: how they work, a sign-up form (with purchase order numbers) and a £1,000 credit limit; new clause 3.9 in the booking agreement, on /terms and in the signed doc. (8 Nov 2026)
- [x] Enquiry form reminds customers about the 25% deposit, and roughly how much it is, when a quote is attached. (8 Nov 2026)
- [x] Plan emails link to a private job page (/map): the job details, a map of the site that opens in Google or the phone's maps app, and the weather and rough best time for the job day. (8 Nov 2026)
- [x] Last traces of FPV drone flying removed (fleet wording, local business FAQ, unused Avata 2 icon). Only the Pocket 3's FPV mode for the indoor glide is mentioned. (8 Nov 2026)
- [x] Fixes: form boxes all use the site font (placeholders, autofill and the date picker); the property page menu highlight; /plan scrolls up to "Plan received" after sending. (8 Nov 2026)
- [x] Base town Stockton-on-Tees and business address added; travel zones set (free TS and DL, £25 DH, £45 SR and NE); roof prices £135/£195/£285; commercial property £195/£395/£650; interiors on the Osmo Pocket 3. (8 Nov 2026)
- [x] Private weather check at /weather-check, with passcode, Met Office forecast, drone limits, 3-day planner and weather records. (7 Nov 2026)
- [x] Media and brand kit page at /media with logo downloads, colours, fonts, about text, a brand guide PDF and a ZIP of everything. (7 Nov 2026)
- [x] FPV drone flying taken off the site completely: the FPV page, the FPV service page, stand-alone FPV and the FPV add-ons, the Avata 2 in the fleet, and two FPV blog posts. Signature keeps a one-take Pocket 3 glide tour at the same price. Old links redirect to /walkthrough-video. (31 Oct 2026)
- [x] "Precision" wording replaced with "Every angle. One visit." (27 Oct 2026)
- [x] Every price reads from the settings, including prices written into sentences (27 Oct 2026)
- [x] Spacing between the paths section and the property packages, now using the site's own spacing that adjusts on phones (25 Oct 2026)
- [x] Favicon, app icon and Apple touch icon (25 Oct 2026)
- [x] Social links: YouTube, TikTok, LinkedIn and X (25 Oct 2026)
- [x] Netlify form detection switched on, so the quote and mission forms register (25 Oct 2026)
- [x] Enquiries emailed via Web3Forms, with a backup copy in Netlify Forms (25 Oct 2026)
- [x] Business email wayne@happydrones.co.uk added across the site: contact section, footer, /links, Google data and privacy page (25 Oct 2026)
- [x] Privacy page placeholders filled in, and Web3Forms and Google Workspace added to the list of services (25 Oct 2026)
- [x] Booking agreement published at /terms (26 Oct 2026)
- [x] Unlisted changelog at /changelog (26 Oct 2026)
- [x] Deposit and 30-day terms on pricing; deposit non-refundable if the customer cancels (26 Oct 2026)
- [x] Insurance shown as adjustable per contract (26 Oct 2026)
- [x] Fleet split into flying today and coming soon; mapping marked coming soon (26 Oct 2026)
- [x] White label for estate agents, with tiered pricing and free on 10-listing bundles (26 Oct 2026)
- [x] Hosting moved to Cloudflare Pages, and DNS moved to Cloudflare (26 Oct 2026)
- [x] Cookie banner and cookie policy (27 Oct 2026)
- [x] Construction progress sales page at /construction (27 Oct 2026)
- [x] Estate agents page rebuilt with tour finder, working models, package builder and listing timeline (27 Oct 2026)
- [x] Commercial property page at /commercial-property (27 Oct 2026)
- [x] Roof inspections page at /roof-inspections (27 Oct 2026)
- [x] Property photography page at /property-photography (27 Oct 2026)
- [x] Walkthrough video page at /walkthrough-video (27 Oct 2026)
- [x] Local business content page at /local-business (27 Oct 2026)
- [x] Aerial photography page at /aerial-photography (27 Oct 2026)
- [x] FPV fly-through page at /fpv-fly-through (27 Oct 2026; removed 31 Oct when FPV was paused)
