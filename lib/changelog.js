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
    date: "2026-10-27", time: "10:12", by: "Claude", type: "new",
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
