# Happy Drones website: to do

## Next up
- [ ] **Remove "precision" wording.** It's in two places:
  - the /links page motto (`motto` in `lib/site.js`)
  - the link-preview description (the `alt` text in `app/layout.js`)

  Replace both with "Every angle. One visit."
- [ ] **New link preview image.** Replace `public/og.png` with `og.png` from the social kit (09-Website-and-Email).

## Pages to build
- [ ] **Confirm commercial property prices.** Frontage & Aerial £169, Full Marketing £329, Flagship £549, plus size bands, +£75 extra units and +£49 out of hours. These are Claude's guide prices, in lib/cproperty.js.
- [ ] **In-depth service pages, one by one.** Aerial film and events (moved to last by Wayne, 27 Oct 2026).
- [ ] **Check the roof inspection page.** /roof-inspections: confirm the medium and large roof prices (£145 and £210 from the planner; the quote form says £159 for two or three buildings), and that the deliverables (overview, every slope, chimney, gutters, flat roofs, numbered and marked) match what you'll actually send.

- [ ] **Check the walkthrough page.** /walkthrough-video says the walkthrough is only sold inside Showcase or Signature, comes in landscape and vertical, with licensed music and room captions, and that you get a link to add as the portal video tour. Confirm, or say if you want walkthroughs sold on their own.

- [ ] **Check the local business page.** /local-business says one visit gives about 20 pieces (15+ photos, 3–5 clips, a 60-second film), delivered in 5 working days, priced from the mission planner (£199 a visit, less on repeat visits). It also says you don't post for them. Confirm, or change any of it.
- [ ] **Social exports.** When you want them: short MP4s, stills and carousels of the interactive pieces for Facebook, X and Instagram (see the chat on 27 Oct).

- [ ] **Check the aerial page.** /aerial-photography says aerial-only takes about 30 minutes with no one home, includes a short clip, the plot outline is drawn by eye as a guide (not a legal boundary), and lists an eight-shot standard list. Confirm.
- [ ] **Prices in one place.** A dozen prices are typed into sentences (travel £45, +£75 units, £49 intro, white label £29/£15, from £99 roofs, from £75 aerial in an agent FAQ, the commercial payment FAQ). Make them read from the settings, and optionally move prices to a JSON file Wayne can edit.

- [ ] **Check the FPV page.** /fpv-fly-through says the Avata 2 is about 21 cm across, sessions are about 90 minutes with a walk-round and slow rehearsal, several takes are flown and the best kept, and the finished video is 45–90 s plus a vertical cut in 3–5 days. Confirm.

## Waiting on Wayne
- [ ] **Finish the Cloudflare move.** Test the site and email, then remove the domain from Netlify and delete the Netlify project. After that, tidy up the Netlify leftovers (netlify.toml, public/__forms.html, the Netlify backup in lib/sendForm.js, the privacy page line).
- [ ] **Business address.** Needed for the contract, /terms (SITE.address), the website and invoices. A virtual office is fine.
- [ ] **Base town and free-travel area.** The site says the base is Newcastle and travel is free across NE/SR/DH/TS/DL. Wayne is on Teesside and doesn't want Newcastle free.
- [ ] **Mavic 4 Pro.** Owned or not? It's currently marked coming soon.
- [ ] **Interior photos.** Packages say mirrorless, which isn't owned yet. Decide what to say, and update the "How a Showcase shoot runs" post to match. The new /property-photography page deliberately doesn't name the interior camera, and says each angle is shot as three exposures and blended: check that matches how you shoot.
- [ ] **Sample blog posts.** Replace with real ones. The first three are #6 aerial vs ground, #7 roof check and #5 Rightmove shots.

## When ready
- [ ] **Showreel.** Add a YouTube link to `showreel` in `lib/site.js` to switch on the homepage video section.
- [ ] **Reviews.** Add real reviews to `reviews` in `lib/site.js` and the section appears by itself.
- [ ] **Real photos.** Add photos of real shoots (property, aerial, construction) to replace the illustrations.
- [ ] **Credentials.** Add A2 CofC or GVC to `credentials` in `lib/site.js` once you have it.
- [ ] **Web3Forms to business inbox.** Point Web3Forms at wayne@happydrones.co.uk. If that gives a new key, update `formKey` in `lib/site.js`.
- [ ] **Optional hello@ alias.** Add hello@happydrones.co.uk as a free alias in Google Admin.

## Done
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
- [x] FPV fly-through page at /fpv-fly-through (27 Oct 2026)
