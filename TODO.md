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


## Waiting on Wayne
- [ ] **Original logo file.** The logos on /media were traced from the PNG. If whoever designed the logo has the original vector file (.ai, .eps, .svg or .pdf), send it and Claude will swap it in.
- [ ] **Booking agreement mentions FPV.** /terms clause 8.1 gives delivery times for FPV. It has to match the signed contract, so it's unchanged. Remove FPV next time the contract is updated, then update /terms to match.
- [ ] **Finish the Cloudflare move.** Test the site and email, then remove the domain from Netlify and delete the Netlify project. After that, tidy up the Netlify leftovers (netlify.toml, public/__forms.html, the Netlify backup in lib/sendForm.js, the privacy page line).
- [ ] **Mavic 4 Pro.** Owned or not? It's currently marked coming soon.
- [ ] **Interior photos.** The site says interiors are shot on the "Osmo Pocket 3 or mirrorless" with a wide-angle lens (8 Nov). A mirrorless camera is coming soon (looking at the Sony A7 II or Canon M50). When it's bought, mark it as owned in the fleet (the "camera" kit in lib/site.js). Check the property photography page's claim that each angle is shot as three exposures and blended matches how you shoot.
- [ ] **Sample blog posts.** First three real posts written (14 Nov): insurance, roof check, 5 listing shots. The older sample posts are still up; replace or delete them as real ones come in. Add real photos as covers when you have them.

## When ready
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
- [ ] **Web3Forms to business inbox.** Point Web3Forms at wayne@happydrones.co.uk. If that gives a new key, update `formKey` in `lib/site.js`.
- [ ] **Optional hello@ alias.** Add hello@happydrones.co.uk as a free alias in Google Admin.

## Done
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
