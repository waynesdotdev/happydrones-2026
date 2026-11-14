/* =========================================================
   NEW SERVICES (added 14 Nov 2026)
   Nine services that run on the kit Wayne owns today, plus services
   marked soon: true that need kit or practice first (shown as "Coming
   soon" with a register-interest form, never bookable).

   Each one gets a page at /services/<id>/ (app/services/[slug]/page.js),
   appears as a mission on /plan (unless soon), and is listed on the
   page named in "page" (roofs, construction, property, commercial) by
   components/MoreServices.jsx, and on /services.

   price ...... the starting price in pounds (Small scale on /plan).
                CHANGES: the service page, the cards, /plan.
   unit ....... what the price is per, shown after it ("per visit").
   soon ....... true = coming soon: no price, no booking, interest form.
   Everything else is words for the page (same fields as SERVICE_PAGES
   in lib/site.js).
   ========================================================= */

export const EXTRA_SERVICES = [
  /* ---------------- ROOFS ---------------- */
  {
    id: "roof-health-check", page: "roofs", group: "commercial", code: "RH", art: "roof", alt: 15, label: "Yearly check", cat: "Guides",
    nav: "Yearly roof check", title: "Yearly roof health check", price: 119, unit: "per year",
    hero: "Catch small roof problems while they're small.",
    lede: "One drone check of your roof every year, at a lower price than a one-off, with a reminder when it's due.",
    forWho: ["Homeowners", "Landlords", "Older houses", "Anyone after a bad winter"],
    gets: ["A full roof check once a year: every slope, ridge, chimney and gutter", "Numbered photos marked on an overview, by download link", "Last year's photos alongside, so changes stand out", "A reminder from me when the next check is due"],
    facts: [["Time on site", "Under 1 hour"], ["Delivered", "48–72 hours"], ["Aircraft", "DJI Mini 4 Pro"]],
    why: [
      { t: "Cheaper than a leak", d: "A slipped tile costs little to fix. Left a winter, it can mean a ceiling." },
      { t: "Year-on-year record", d: "The same views every year, so you can see exactly what's changed." },
      { t: "Nothing to remember", d: "I get in touch when it's due. You just say yes." },
    ],
    faq: [
      { q: "When in the year is it best?", a: "Late autumn, after the leaves fall and before the winter storms, is ideal. Spring works well too, to see what winter did." },
      { q: "Can I stop it?", a: "Yes. There's no contract: each year I check you still want it before booking." },
      { q: "Is it a survey?", a: "No. It's close-up photos for you or a roofer to look at. I don't diagnose faults." },
    ],
    kit: ["mini4"],
    know: "Price is per year for one house. Two or more houses in one visit cost less each.",
    knowLink: { text: "See what a roof check covers", href: "/roof-inspections/" },
  },
  {
    id: "storm-claim-pack", page: "roofs", group: "commercial", code: "SC", art: "roof", alt: 15, label: "Claim pack", cat: "Guides",
    nav: "Storm and claim pack", title: "Storm and insurance claim pack", price: 165, unit: "",
    hero: "Evidence for your claim, without anyone climbing up.",
    lede: "Dated, close-up photos of storm damage from every angle, with a short written summary, sent the next working day.",
    forWho: ["Homeowners", "Landlords", "Loss adjusters", "Business owners"],
    gets: ["Close-up photos of the damage from several angles", "The whole roof for context, numbered on an overview", "A one-page summary: date, time, what's visible and where", "Photos within one working day"],
    facts: [["Time on site", "Under 1 hour"], ["Delivered", "Next working day"], ["Aircraft", "DJI Mini 4 Pro"]],
    why: [
      { t: "Dated evidence", d: "Every photo is timed and dated, taken soon after the storm." },
      { t: "Safe", d: "Nobody climbs onto a damaged roof to take pictures." },
      { t: "Ready to send", d: "The summary and photos go straight to your insurer or loss adjuster." },
    ],
    faq: [
      { q: "Will my insurer accept it?", a: "Insurers decide what evidence they need, so check with yours. Clear, dated photos and a plain summary are what most ask for." },
      { q: "Do you say what caused the damage?", a: "No. I record what's visible and where. Your roofer, surveyor or loss adjuster assesses the cause." },
      { q: "How quickly can you come?", a: "Usually within a couple of days of a storm, weather allowing. Flying in high wind isn't safe, so I go as soon as it calms." },
    ],
    kit: ["mini4"],
    know: "Next-day photos are included in the price.",
  },
  {
    id: "gutter-check", page: "roofs", group: "commercial", code: "GC", art: "roof", alt: 10, label: "Gutters", cat: "Guides",
    nav: "Gutter check", title: "Gutter check", price: 79, unit: "",
    hero: "See inside every gutter from above.",
    lede: "A quick, low-cost look down into every gutter and downpipe, so you know which ones need clearing before the rain does it for you.",
    forWho: ["Homeowners", "Landlords", "Gutter cleaners", "Property managers"],
    gets: ["Photos looking down into every gutter run", "Downpipe tops and hoppers", "Each run numbered on an overview, with blockages marked", "Photos within 48–72 hours"],
    facts: [["Time on site", "About 30 minutes"], ["Delivered", "48–72 hours"], ["Aircraft", "DJI Mini 4 Pro"]],
    why: [
      { t: "See before you pay", d: "Know whether you need a gutter clear at all, and which runs." },
      { t: "Stop damp early", d: "Blocked gutters are one of the most common causes of damp walls." },
      { t: "Low cost", d: "The cheapest way to check the whole house from above." },
    ],
    faq: [
      { q: "Do you clear the gutters?", a: "No, I photograph them. Your gutter cleaner can use the photos to quote, and to show you the before and after." },
      { q: "When's best?", a: "Late autumn, once the leaves have fallen." },
    ],
    kit: ["mini4"],
    know: "Gutter cleaners: regular checks for your customers can go on one monthly invoice.",
  },
  {
    id: "solar-pre-survey", page: "roofs", group: "commercial", code: "SP", art: "roof", alt: 25, label: "Solar survey", cat: "Guides",
    nav: "Solar pre-survey", title: "Solar pre-survey pack", price: 95, unit: "",
    hero: "See the roof before you quote the panels.",
    lede: "Photos of the roof's condition, layout and shading for solar installers, so the quote is right first time and there are no surprises on install day.",
    forWho: ["Solar installers", "Homeowners getting quotes", "Small businesses", "Farms"],
    gets: ["Every roof slope, square on, with the condition visible", "The roof from above with obstacles marked: vents, chimneys, skylights", "Shading: nearby trees and buildings, photographed from the roof's direction", "After the install, an optional shot of the finished array"],
    facts: [["Time on site", "Under 1 hour"], ["Delivered", "48–72 hours"], ["Aircraft", "DJI Mini 4 Pro"]],
    why: [
      { t: "Quote from the office", d: "No ladder visit to see the roof before pricing." },
      { t: "Spot problems first", d: "Slipped tiles or a tired roof are better found before the panels go on." },
      { t: "Marketing too", d: "The finished-array shot is the best photo you'll have of the job." },
    ],
    faq: [
      { q: "Do you measure the roof?", a: "Not yet. Measured roofs come with mapping and 3D, which is coming soon. The photos show layout and condition." },
      { q: "Do installers get a discount?", a: "Yes, regular work costs less per roof and goes on one monthly invoice." },
    ],
    kit: ["mini4"],
    know: "Installers booking regularly get a lower price per roof and one monthly invoice.",
  },

  /* ---------------- CONSTRUCTION AND TRADES ---------------- */
  {
    id: "before-after-pack", page: "construction", group: "commercial", code: "BA", art: "construction", alt: 30, label: "Before & after", cat: "Construction",
    nav: "Before-and-after pack", title: "Before-and-after pack for trades", price: 195, unit: "",
    hero: "Proof of the job, from above.",
    lede: "Two visits: one before you start and one when you finish. Dated photos that protect you in a dispute and show off the work.",
    forWho: ["Roofers", "Builders", "Landscapers", "Driveway and groundworks firms"],
    gets: ["A visit before work starts: the whole job from the same positions", "A visit when you finish, from exactly the same positions", "Side-by-side before and after photos", "A short vertical clip for your social media"],
    facts: [["Visits", "2"], ["Delivered", "48–72 hours after each"], ["Aircraft", "DJI Mini 4 Pro"]],
    why: [
      { t: "Settles arguments", d: "Dated photos of how it was before you touched it." },
      { t: "Wins the next job", d: "Before and after from above is the best marketing a trade can have." },
      { t: "Nothing to remember", d: "Book both visits at once. I fly the same positions each time." },
    ],
    faq: [
      { q: "What if the job takes months?", a: "No problem. The second visit is booked for whenever you finish." },
      { q: "Can I use the photos in my adverts?", a: "Yes, for promoting your business. Ask the customer first if their house is recognisable." },
    ],
    kit: ["mini4"],
    know: "Regular trades can have every job's visits on one monthly invoice.",
  },
  {
    id: "construction-time-lapse", page: "construction", group: "commercial", code: "TL", art: "construction", alt: 100, label: "Time-lapse", cat: "Construction",
    nav: "Time-lapse film", title: "Construction time-lapse film", price: 149, unit: "per film",
    hero: "Months of building in one minute.",
    lede: "Your monthly progress photos, from the same fixed positions, turned into a short film of the site taking shape. Made every quarter, or once at handover.",
    forWho: ["Developers", "Main contractors", "Funders and investors", "Sales and marketing teams"],
    gets: ["A 30–60 second film from your progress visits", "Every visit in order, from the same positions", "Titles with the scheme name and dates", "Landscape and vertical versions"],
    facts: [["Made from", "Progress visits"], ["Delivered", "5 working days"], ["Aircraft", "DJI Mini 4 Pro"]],
    why: [
      { t: "Investors love it", d: "A minute of film says more than a monthly report." },
      { t: "Launch content", d: "The finished film is ready-made marketing for the sales launch." },
      { t: "No extra flying", d: "It's made from the visits you already have." },
    ],
    faq: [
      { q: "Do I need progress visits?", a: "Yes. The film is made from construction progress visits, so it works best from at least four." },
      { q: "Can you add our logo?", a: "Yes, on the opening and closing titles." },
    ],
    kit: ["mini4"],
    know: "Added to a construction progress contract. Price is per film.",
    knowLink: { text: "See how construction progress works", href: "/construction/" },
  },
  {
    id: "planning-context", page: "construction", group: "commercial", code: "PC", art: "mapping", alt: 90, label: "Planning", cat: "Construction",
    nav: "Planning photos", title: "Planning and design context photos", price: 195, unit: "",
    hero: "Show the site in its setting.",
    lede: "Aerial photos of a site and its surroundings for planning applications, design statements and early design work.",
    forWho: ["Architects", "Planning consultants", "Developers", "Self-builders"],
    gets: ["The site from above, with the boundary drawn on", "Views from each side, showing neighbours, roads and trees", "Photos from agreed heights and positions for visuals", "Photos within 48–72 hours"],
    facts: [["Time on site", "1–2 hours"], ["Delivered", "48–72 hours"], ["Aircraft", "DJI Mini 4 Pro"]],
    why: [
      { t: "Context in one frame", d: "Planners see the site, its neighbours and its setting at once." },
      { t: "A base for visuals", d: "Agreed heights and angles give your visualiser something to work on." },
      { t: "Quick to arrange", d: "No access equipment, no road closures." },
    ],
    faq: [
      { q: "Are the photos measured?", a: "No. They're photos for context and design. Measured maps and models come with mapping and 3D, coming soon." },
      { q: "Can you fly near neighbours?", a: "Yes, within the rules. I plan flights to avoid filming people and private gardens more than needed." },
    ],
    kit: ["mini4"],
  },

  /* ---------------- PROPERTY AND LAND ---------------- */
  {
    id: "aerial-360", page: "property", group: "commercial", code: "36", art: "home", alt: 60, label: "360°", cat: "Guides",
    nav: "Aerial 360", title: "Aerial 360° panoramas", price: 95, unit: "",
    hero: "Look all the way round from above.",
    lede: "Interactive 360° panoramas from the air, so buyers can spin the view and see everything around a property: the street, the views and what's nearby.",
    forWho: ["Estate agents", "Rural and country homes", "Holiday lets and venues", "Land sellers"],
    gets: ["One or two 360° panoramas from the best heights", "A link buyers can open on their phone or computer", "Flat aerial stills from the same flight", "Files ready to add to your listing or website"],
    facts: [["Time on site", "Under 1 hour"], ["Delivered", "48–72 hours"], ["Aircraft", "DJI Mini 4 Pro"]],
    why: [
      { t: "Sells the setting", d: "Buyers see the views and surroundings for themselves." },
      { t: "Different from every other listing", d: "Few listings have one, so they stand out." },
      { t: "Adds to any package", d: "Flown at the same visit as your photos." },
    ],
    faq: [
      { q: "Where can I put the 360?", a: "On your website, or as a link on the listing. I'll send it in a format that opens in any browser." },
      { q: "Can I add it to a property package?", a: "Yes, it's flown at the same visit." },
    ],
    kit: ["mini4"],
  },
  {
    id: "land-plot-photos", page: "property", group: "commercial", code: "LP", art: "mapping", alt: 100, label: "Land", cat: "Guides",
    nav: "Land and plots", title: "Land and plot photos", price: 175, unit: "",
    hero: "Show exactly what's for sale.",
    lede: "Aerial photos of land, plots and fields with the boundary drawn on, so buyers can see exactly what they're getting and how it sits in the landscape.",
    forWho: ["Rural and land agents", "Farmers and landowners", "Plot sellers", "Developers buying land"],
    gets: ["The whole plot from above, with the boundary drawn on", "Views across the land from each side", "Access, tracks and neighbouring land shown", "Photos within 48–72 hours"],
    facts: [["Time on site", "1–2 hours"], ["Delivered", "48–72 hours"], ["Aircraft", "DJI Mini 4 Pro"]],
    why: [
      { t: "Boundaries made clear", d: "A line on the photo answers \"where does it end?\"." },
      { t: "Scale you can't see from the gate", d: "Fields and plots only make sense from above." },
      { t: "Marketing-ready", d: "Photos sized for portals, brochures and your website." },
    ],
    faq: [
      { q: "Is the boundary exact?", a: "No. It's drawn from the plan you give me, for illustration. For a legal boundary you need a surveyor." },
      { q: "How big an area can you cover?", a: "Most fields and plots in one visit. Very large estates are quoted." },
    ],
    kit: ["mini4"],
  },

  /* ---------------- COMING SOON (not bookable) ---------------- */
  {
    id: "thermal-inspections", soon: true, page: "roofs", group: "commercial", code: "TH", art: "roof", alt: 30, label: "Thermal", cat: "Guides",
    nav: "Thermal (soon)", title: "Thermal roof and solar inspections",
    hero: "See the heat you're losing.",
    lede: "Thermal imaging from the air to find heat loss through roofs, damp patches and faulty solar panels. Coming soon, once a thermal drone and thermography training are in place.",
    forWho: ["Roofers", "Solar installers and owners", "Landlords", "Homeowners"],
    gets: ["Thermal and normal photos of the roof side by side", "Warm and cold spots marked", "Solar panels checked for hot spots", "A short summary of what the images show"],
    facts: [["Status", "Coming soon"], ["Needs", "Thermal drone and training"], ["Aircraft", "To be chosen"]],
    why: [
      { t: "Find heat loss", d: "Missing insulation and leaks show up clearly on a cold morning." },
      { t: "Check solar panels", d: "Faulty cells run hot and stand out in seconds." },
      { t: "No access needed", d: "The whole roof from the air in one visit." },
    ],
    faq: [
      { q: "When will it launch?", a: "Once the kit and training are in place. Register your interest and I'll tell you first." },
      { q: "Will it show damp?", a: "Thermal images can point to likely damp. A specialist confirms it." },
    ],
    kit: [],
  },
  {
    id: "indoor-fly-through", soon: true, page: "property", group: "commercial", code: "FT", art: "glide", alt: 2, label: "Fly-through", cat: "Guides",
    nav: "Indoor fly-through (soon)", title: "Indoor fly-through tours",
    hero: "Through the door, up the stairs, out over the garden.",
    lede: "One smooth flight from outside, through the house and back out again. Coming soon: I'm practising until every flight is as calm and careful as the walkthrough glides.",
    forWho: ["Estate agents", "Premium homes", "Venues and hotels", "Commercial spaces"],
    gets: ["A one-take flight through the main rooms", "Smooth, slow movement, no sudden turns", "Landscape and vertical versions", "Music and your branding"],
    facts: [["Status", "Coming soon"], ["Needs", "More practice first"], ["Style", "Slow and smooth"]],
    why: [
      { t: "One continuous take", d: "Buyers follow the route through the home without cuts." },
      { t: "Stands out", d: "Very few local listings have one." },
      { t: "Careful by design", d: "Flown slowly, with everyone out of the way." },
    ],
    faq: [
      { q: "When can I book one?", a: "When the flights are smooth enough to put my name to. Register your interest and you'll hear first." },
      { q: "What can I book now?", a: "The walkthrough glide: a one-take tour on a handheld stabilised camera, in the Showcase and Signature packages." },
    ],
    kit: [],
    knowLink: { text: "See the walkthrough video", href: "/walkthrough-video/" },
  },
];

export const extraById = (id) => EXTRA_SERVICES.find((s) => s.id === id);
export const extrasFor = (page) => EXTRA_SERVICES.filter((s) => s.page === page);
