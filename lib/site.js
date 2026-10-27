/* =========================================================
   HAPPY DRONES — SITE SETTINGS
   Most day-to-day changes happen in this one file.
   Save it, and the dev server (npm run dev) updates instantly.
   Read lib/README.txt before editing.
   ========================================================= */

export const SITE = {
  name: "Happy Drones",
  motto: "Precision from above.",

  // Your live web address, no slash at the end. Used for SEO, sitemap and sharing.
  url: "https://happydrones.co.uk",

  description:
    "Property photography, aerial film, FPV fly-throughs, construction progress and inspections across the North East, from one insured, CAA-registered operator.",

  /* ---- Contact ---- */
  address: "",                 // business address for the booking agreement page. "" shows a placeholder
  email: "wayne@happydrones.co.uk", // shown on the site with Email buttons. "" hides email everywhere
  phone: "+447888625623",       // international format, used for Call buttons
  phoneDisplay: "07888 625623", // how the number is shown
  whatsapp: "447888625623",     // digits only, country code first. "" hides WhatsApp

  /* ---- Where website enquiries are emailed ----
     Your Web3Forms access key (web3forms.com). Enquiries are emailed to the
     address the key was made with. To change that address, make a new key
     and paste it here. "" turns email off (enquiries are still saved in Netlify > Forms). */
  formKey: "a20ed0c3-febe-43e3-b15e-aa6c154d8231",

  /* ---- Where you work ---- */
  areaShort: "across the North East",                          // used in sentences
  area: "Property photography, aerial and video across the North East.", // footer line
  areaServed: "North East England",
  base: "Newcastle upon Tyne",
  coords: { lat: 54.9783, lon: -1.6178 },                     // hero telemetry on the Commercial page                            // for Google

  /* ---- Launch pricing ----
     true shows an "Introductory pricing" note next to the packages.
     Set to false when you move to your full prices. */
  introPricing: true,

  /* ---- Insurance & credentials (shown across the site) ---- */
  insurance: {
    publicLiability: "£10m",
    professionalIndemnity: "£50k",
    note: "Adjustable per contract if required", // shown next to the amounts. "" hides it
  },
  // Add "A2 CofC" or "GVC" here when you hold them. You need the right one to fly
  // the heavier Mavic 4 Pro, Mavic 3 Enterprise and Matrice 4E (when they arrive) close to people and in built-up areas.
  credentials: [
    "CAA Flyer ID",
    "CAA Operator ID",
    "ICO registered",
    "Risk assessment for every job",
    "Airspace and permission checks",
  ],

  /* ---- Socials (set url to "" to hide a platform everywhere) ---- */
  socials: [
    { id: "facebook", name: "Facebook", handle: "happydrones1", url: "https://www.facebook.com/happydrones1", blurb: "Recent shoots, reviews and local news" },
    { id: "youtube", name: "YouTube", handle: "happy-drones", url: "https://www.youtube.com/@happy-drones", blurb: "Full walkthroughs, fly-throughs and showreels" },
    { id: "tiktok", name: "TikTok", handle: "happydrones", url: "https://www.tiktok.com/@happydrones", blurb: "Short clips from recent shoots" },
    { id: "linkedin", name: "LinkedIn", handle: "happydrones", url: "https://www.linkedin.com/in/happydrones/", blurb: "Commercial work, construction and projects" },
    { id: "x", name: "X", handle: "happydrones1", url: "https://x.com/happydrones1", blurb: "Quick updates, drone tips and news from the sky" },
  ],

  /* ---- Homepage showreel: YouTube link or ID. null hides the section ---- */
  showreel: null,

  /* ---- Reviews: add real ones and the section appears by itself ----
     { text: "…", name: "Sarah", detail: "Sold her home in Yarm" }        */
  reviews: [],
};


/* =========================================================
   THE FLEET — homepage, Services, Fleet and Commercial pages
   tier:   "everyday" (most jobs), "flagship" (premium film),
           "heavy" (extreme jobs: wind, mapping, measured work)
   status: "active" or "soon" (shows a "Coming soon" badge)
   ========================================================= */
export const KIT = [
  {
    id: "mini4", name: "DJI Mini 4 Pro", status: "active", tier: "everyday",
    role: "Aerial photos & video", spec: "48MP · 4K/60 HDR · under 250 g",
    text: "Shows the plot, garden, roof, street and what's nearby in one frame. Light enough to work close to homes within the rules.",
    best: "Property aerials, roof checks, plot views",
  },
  {
    id: "neo2", name: "DJI Neo 2", status: "active", tier: "everyday",
    role: "Follow-me social clips", spec: "Palm launch · 4K · follow-me",
    text: "A palm-sized drone that launches from the hand and follows a subject. Perfect for agent intros, walk-and-talks and tight spaces.",
    best: "Agent intros, social reels, small spaces",
  },
  {
    id: "avata2", name: "DJI Avata 2", status: "active", tier: "everyday",
    role: "FPV fly-throughs", spec: "4K/60 · built-in prop guards",
    text: "One unbroken flight in the front door, through the building and out over the garden. Guarded propellers for flying indoors.",
    best: "One-take tours, venues, showhomes",
  },
  {
    id: "pocket3", name: "DJI Osmo Pocket 3", status: "active", tier: "everyday",
    role: "Walkthrough video", spec: '1" sensor · 3-axis gimbal',
    text: "A smooth, steady walk room by room, plus vertical reels and short pieces to camera.",
    best: "Walkthrough tours, social reels, intros",
  },
  {
    id: "mavic4", name: "DJI Mavic 4 Pro", status: "soon", tier: "flagship",
    role: "Flagship aerial film", spec: "Hasselblad 4/3 · triple camera · 6K HDR",
    text: "A cinema camera in the air. Three focal lengths in the air for launch films, premium homes and long, slow reveals.",
    best: "Brand films, premium homes, developments",
  },
  {
    id: "mavic3", name: "DJI Mavic 3 Enterprise", status: "soon", tier: "heavy",
    role: "Inspection & survey workhorse", spec: "4/3 mechanical shutter · 56× hybrid zoom · long endurance",
    text: "A compact enterprise drone with a mapping-ready wide camera and a long zoom for close inspection detail from a safe distance, plus the endurance for big sites.",
    best: "Large sites, roof and building inspections, surveys",
  },
  {
    id: "m4e", name: "DJI Matrice 4E", status: "soon", tier: "heavy",
    role: "Mapping & measured work", spec: "4/3 mechanical shutter · laser rangefinder · IP55",
    text: "Enterprise aircraft for orthomosaic maps, 3D models, measured inspections and flying when the weather turns. It's what brings mapping and 3D to Happy Drones.",
    best: "Mapping, 3D models, construction, inspections",
  },
  {
    id: "camera", name: "Mirrorless camera", status: "soon", tier: "everyday",
    role: "Listing photos", spec: "Full frame · ultra-wide",
    text: "Sharp, bright interior and exterior stills with straight lines and balanced windows. The next step for interior photography.",
    best: "Interiors, exteriors, dusk shots",
  },
];
export const KIT_TIERS = [
  { id: "everyday", name: "Everyday fleet", text: "Homes, listings, social and indoor flights." },
  { id: "flagship", name: "Flagship", text: "Premium film and the biggest reveals." },
  { id: "heavy", name: "Extreme jobs", text: "Mapping, measured work, wind and exposed sites." },
];

/* =========================================================
   QUOTE BUILDER PRICES — LAUNCH PRICING (change to your own)
   Every price on the site comes from here.

   group  "property" or "business" (decides the heading in the builder)
   sizes  step 2 options. "add" is added to the base price.
   ========================================================= */
const HOME_SIZES = [
  { name: "Flat or 1–2 bed", add: 0 },
  { name: "3–4 bed house", add: 30 },
  { name: "5+ bed or land", add: 70 },
];

export const PRICING = {
  currency: "£",
  services: [
    { id: "essentials", group: "property", name: "Essentials", desc: "Photos + aerial stills", base: 109, sizeTitle: "How big is the property?", sizes: HOME_SIZES },
    { id: "showcase", group: "property", name: "Showcase", desc: "Photos, aerial + walkthrough video", base: 219, sizeTitle: "How big is the property?", sizes: HOME_SIZES },
    { id: "signature", group: "property", name: "Signature", desc: "Everything + FPV fly-through", base: 379, sizeTitle: "How big is the property?", sizes: HOME_SIZES },
    { id: "aerial", group: "property", name: "Aerial only", desc: "Drone photos + short clip", base: 75, sizeTitle: "How big is the property?",
      sizes: [{ name: "House or flat", add: 0 }, { name: "Large home", add: 20 }, { name: "Land or estate", add: 50 }] },
    { id: "fpv", group: "property", name: "FPV fly-through", desc: "One-take tour on its own", base: 199, sizeTitle: "How big is the space?",
      sizes: [{ name: "Up to 4 rooms", add: 0 }, { name: "5 to 8 rooms", add: 60 }, { name: "Large home or venue", add: 140 }] },
    { id: "business", group: "business", name: "Business content", desc: "Shops, gyms and venues", base: 199, sizeTitle: "How many locations?",
      sizes: [{ name: "One location", add: 0 }, { name: "Two locations", add: 120 }, { name: "Three or more", add: 220 }] },
    { id: "event", group: "business", name: "Event", desc: "Openings, parties and shows", base: 249, sizeTitle: "How long is the event?",
      sizes: [{ name: "Up to 2 hours", add: 0 }, { name: "Half day", add: 150 }, { name: "Full day", add: 350 }] },
    { id: "roof", group: "business", name: "Roof check", desc: "Tiles, chimneys and gutters", base: 99, sizeTitle: "How many buildings?",
      sizes: [{ name: "One building", add: 0 }, { name: "Two or three", add: 60 }] },
    { id: "film", group: "business", name: "Aerial film", desc: "Launch films, venues and brands", base: 295, sizeTitle: "How long?",
      sizes: [{ name: "Half day", add: 0 }, { name: "Full day", add: 245 }, { name: "Two days", add: 590 }] },
    { id: "mapping", soon: true, group: "business", name: "Mapping & 3D", desc: "Orthomosaics and 3D models", base: 395, sizeTitle: "How big is the site?",
      sizes: [{ name: "Up to 2 hectares", add: 0 }, { name: "2 to 10 hectares", add: 250 }, { name: "Over 10 hectares", add: 650 }] },
    { id: "construction", group: "business", name: "Construction", desc: "Site progress and overviews", base: 179, sizeTitle: "How often?",
      sizes: [{ name: "One visit", add: 0 }, { name: "Three visits", add: 320 }, { name: "Monthly for six months", add: 760 }] },
  ],

  /* Extras: "for" lists which services show each extra */
  extras: [
    { id: "floorplan", name: "Floor plan", desc: "2D floor plan with room sizes", price: 45, for: ["essentials", "showcase", "signature"] },
    { id: "dusk", name: "Dusk exterior photos", desc: "Front of the property at twilight, lights on", price: 59, for: ["essentials", "showcase"] },
    { id: "extra10", name: "10 extra photos", desc: "For larger homes or more detail", price: 29, for: ["essentials", "showcase", "signature"] },
    { id: "intro", name: "Agent intro to camera", desc: "30-second piece to camera for socials", price: 49, for: ["showcase", "signature"] },
    { id: "reel", name: "Vertical social reel", desc: "15–30 seconds for Reels, TikTok and Shorts", price: 39, for: ["essentials", "aerial"] },
    { id: "fpvadd", name: "Add an FPV fly-through", desc: "One continuous flight through the property", price: 149, for: ["essentials", "showcase", "business", "event"] },
    { id: "clips", name: "Vertical social clips", desc: "Three short clips for Reels, TikTok and Shorts", price: 49, for: ["business", "event", "film"] },
    { id: "golden", name: "Golden hour shoot", desc: "Filmed near sunset for warm light", price: 59, for: ["business", "event", "aerial", "film"] },
    { id: "film6k", soon: true, name: "Mavic 4 Pro flagship film", desc: "Triple-camera 6K footage for premium homes", price: 89, for: ["showcase", "signature", "aerial"] },
    { id: "model3d", soon: true, name: "3D model", desc: "Measurable 3D model from the Matrice 4E", price: 195, for: ["mapping", "construction", "roof"] },
    { id: "whitelabel", name: "White label (estate agents)", desc: "Your branding only. £15 on agent accounts, free on 10-listing bundles", price: 29, for: ["essentials", "showcase", "signature", "aerial", "fpv"] },
    { id: "rush", name: "Next-day delivery", desc: "Edited photos within 24 hours", price: 39, for: ["essentials", "showcase", "signature", "aerial", "business", "roof", "construction"] },
  ],
};

/* ---- How customers pay (homepage packages, quote builder, mission planner, FAQs) ----
   Keep these in step with your booking agreement. */
export const PAYMENT = {
  depositPct: 25,   // % deposit that secures a date
  largeFrom: 1000,  // jobs at or over this (£), and repeat-visit contracts, are invoiced instead
  termsDays: 30,    // payment terms for those larger jobs
};
export const depositFor = (total) => Math.round((total * PAYMENT.depositPct) / 100);

// Extras that need kit not here yet are hidden until it arrives (soon: true above).
PRICING.extras = PRICING.extras.filter((x) => !x.soon);
export const money = (n) => `${PRICING.currency}${Number(n).toLocaleString("en-GB")}`;
export const priceFrom = (id) => {
  const s = PRICING.services.find((x) => x.id === id);
  return s ? money(s.base) : "";
};


/* =========================================================
   PROPERTY PACKAGES — the three main packages
   Used on the homepage cards and the Property page.
   The price comes from PRICING above (same id).
   ========================================================= */
export const PACKAGES = [
  {
    id: "essentials", tagline: "For standard listings and lettings", art: "camera", alt: 1.5, label: "Essentials",
    title: "Essentials",
    lede: "Professional listing photos inside and out, plus aerial shots that show the plot and the street. Everything a standard listing needs.",
    gets: ["20–25 edited interior and exterior photos", "5 aerial photos of the property and plot", "Photos sized for Rightmove, Zoopla and OnTheMarket", "Delivered within 48–72 hours"],
    time: "About 1 hour", delivery: "48–72 hours", kit: ["camera", "mini4"],
  },
  {
    id: "showcase", tagline: "Our most popular package", featured: true, art: "walkthrough", alt: 1.5, label: "Showcase",
    title: "Showcase",
    lede: "Photos and aerial, plus a smooth walkthrough video that takes buyers room by room. The package that gets listings shared.",
    gets: ["30–35 edited interior and exterior photos", "10 aerial photos", "60–90 second walkthrough video with drone shots", "1 vertical reel for social media"],
    time: "About 2 hours", delivery: "48–72 hours", kit: ["camera", "mini4", "pocket3"],
  },
  {
    id: "signature", tagline: "For premium homes and new builds", art: "fpv", alt: 2, label: "Signature",
    title: "Signature",
    lede: "The full treatment: photos, aerial, walkthrough video and a one-take FPV fly-through from the front door to the back garden.",
    gets: ["35–40 edited photos, including dusk exteriors", "15 aerial photos", "90–120 second walkthrough video", "One-take FPV fly-through", "2 vertical reels for social media"],
    time: "Half a day", delivery: "3–5 days", kit: ["camera", "mini4", "pocket3", "avata2"],
  },
];

/* Rows for the "compare packages" table. One value per package, in order. */
export const PACKAGE_ROWS = [
  ["Interior & exterior photos", "20–25", "30–35", "35–40"],
  ["Aerial photos", "5", "10", "15"],
  ["Walkthrough video", "–", "60–90 sec", "90–120 sec"],
  ["Vertical social reels", "–", "1", "2"],
  ["FPV fly-through", "–", "–", "✓"],
  ["Dusk exterior photos", "Add-on", "Add-on", "✓"],
  ["Delivery", "48–72 hrs", "48–72 hrs", "3–5 days"],
];

/* Single services shown under the packages */
export const SINGLES = [
  { id: "aerial", title: "Aerial only", text: "Drone photos and a short clip, for agents who already have a photographer." },
  { id: "fpv", title: "FPV fly-through", text: "Just the one-take tour, added to anyone's listing." },
];


/* =========================================================
   ESTATE AGENTS — the agent offer (Estate agents page)
   ========================================================= */
export const AGENT_OFFER = {
  discount: "10%",       // shown as "10% off"
  minPerMonth: 4,        // listings a month to qualify
  perks: [
    "One person shoots photos, aerial, video and FPV in a single visit",
    "Edited files in 48–72 hours, sized for every portal",
    "A regular weekly slot so listings go live faster",
    "Simple monthly invoice for all your listings",
    "Fully insured, CAA and ICO registered",
    "White-label option: your brand on everything, mine on nothing",
  ],
  /* Branding choices for agents (Estate agents page, quote builder, booking agreement).
     price 0 = included. Keep the white-label price in step with the "whitelabel" extra in PRICING. */
  branding: [
    { id: "standard", name: "Standard", tag: "Included",
      points: ["Happy Drones credit on the video end card", "I may share the work on my website and socials"] },
    { id: "agency", name: "Agency-branded", tag: "Included",
      points: ["Your logo on the video intro and end cards", "No Happy Drones credit on any file", "I only share the work after the property has sold or let"] },
    { id: "whitelabel", name: "White label", tag: "Free on 10+", featured: true,
      points: ["Your branding only. Happy Drones appears nowhere", "Files and download link with no Happy Drones name", "I contact vendors and attend as your photographer", "Never shown on my website, socials or portfolio"] },
  ],
  /* White-label price by booking size (Estate agents page and booking agreement 9.6).
     The quote builder extra uses the one-off price. */
  whiteLabel: [
    { who: "One-off listings", price: "£29 per listing" },
    { who: "Agent account, 4–9 listings a month", price: "£15 per listing" },
    { who: "Bundle of 10, or 10+ listings a month", price: "Free" },
  ],
  bundle: { size: 10, months: 3 }, // a prepaid bundle must be used within this many months
  steps: [
    { title: "Book by WhatsApp or the form", text: "Send the address, vendor contact and package. I confirm a slot, usually within the week." },
    { title: "I arrange access", text: "I contact the vendor or tenant, send them a short prep guide and agree a time." },
    { title: "One visit, everything captured", text: "Photos, aerial, walkthrough and FPV in one trip. No second appointment for the vendor." },
    { title: "Files land in 48–72 hours", text: "A download link with portal-ready photos, video and social cuts, named by address." },
  ],
  faq: [
    { q: "Can you contact the vendor directly?", a: "Yes. Send me their details and I'll arrange the time, send a prep guide and confirm with you once it's booked." },
    { q: "What sizes do you deliver?", a: "Photos sized for Rightmove, Zoopla and OnTheMarket, full-resolution versions for brochures, landscape video for portals and vertical cuts for social media." },
    { q: "Can my branding go on the video?", a: "Yes, at no extra cost. Agency-branded puts your logo on the intro and end cards, with no Happy Drones credit on the files. For full white label, where Happy Drones appears nowhere and I never show the work, it's £29 per listing, £15 on an agent account of 4+ listings a month, and free on a bundle of 10 or 10+ listings a month." },
    { q: "How does the 10-listing bundle work?", a: "Book and pay for 10 listings up front and white label is free on all of them, on top of the agent discount. Use them within 3 months, on properties inside my normal travel area." },
    { q: "Will you post our listings on your socials?", a: "Only if you're happy for me to. Agency-branded work is only shared after the property sells or lets, and white-label work is never shown anywhere." },
    { q: "Do you cover lettings?", a: "Yes. Essentials suits most lettings, and I can work around tenants with notice." },
  ],
};


/* =========================================================
   HOMEPAGE — "Who it's for" tabs
   art: camera | walkthrough | agent | home | business | event | roof | fpv | construction
   quote: which quote-builder option the button picks
   details: where "Full details" links to
   ========================================================= */
export const AUDIENCES = [
  {
    tab: "Estate agents", quote: "showcase", art: "agent", details: "/estate-agents/",
    title: "Listings that win instructions, not just viewings.",
    text: "Vendors choose the agent whose marketing looks best. Photos, aerial, walkthrough and FPV from one visit make every listing look like a premium one.",
    ticks: ["Every format from one appointment", "Portal-ready files in 48–72 hours", `${AGENT_OFFER.discount} off for ${AGENT_OFFER.minPerMonth}+ listings a month`],
    cta: "Price a listing",
  },
  {
    tab: "Selling your home", quote: "showcase", art: "home", details: "/property/",
    title: "Make your home the one buyers stop on.",
    text: "Buyers scroll past dozens of listings. Bright photos, a view of the plot and a video they can walk through make yours the one they book a viewing for.",
    ticks: ["Photos inside and out, plus aerial views", "A walkthrough video buyers can share", "Works with any estate agent"],
    cta: "Price my home",
  },
  {
    tab: "Lettings & holiday lets", quote: "essentials", art: "camera", details: "/property/",
    title: "Fill rooms and calendars faster.",
    text: "Clear, honest photos and a quick walkthrough help tenants and guests decide before they visit, so you spend less time on viewings and empty nights.",
    ticks: ["Bright, straight interior photos", "Aerial shots of the location and parking", "Short walkthrough for Airbnb and socials"],
    cta: "Price my let",
  },
  {
    tab: "Local businesses", quote: "business", art: "business", details: "/services/#business",
    title: "Content that gets your business noticed locally.",
    text: "Short, eye-catching clips of your shop, gym, salon or venue, cut for the platforms your customers already use. One morning gives you weeks of posts.",
    ticks: ["Vertical clips for TikTok, Reels and Shorts", "Aerial and FPV shots of your premises", "Photos for your website and Google profile"],
    cta: "Price my content",
  },
];


/* =========================================================
   SERVICES PAGE — one entry per service, in page order
   id     the #link on the page (services/#photography)
   quote  which quote-builder option "Price this" opens
   alt    camera height shown on the camera view (metres)
   cat    Viewing Room category for "See examples" ("" hides the link)
   ========================================================= */
export const SERVICE_PAGES = [
  /* ---------------- HOMES ---------------- */
  {
    id: "photography", group: "homes", code: "PH", quote: "essentials", art: "camera", alt: 1.5, label: "Photography", cat: "Guides",
    nav: "Property photos", title: "Property photography",
    hero: "The photos buyers click first.",
    lede: "Bright, sharp interior and exterior photos with straight lines and windows you can see out of. The pictures that make buyers click.",
    forWho: ["Estate agents", "Homeowners selling", "Landlords", "Holiday lets"],
    gets: ["20–40 edited photos depending on package", "Exposure-blended interiors so rooms and windows both look right", "Front, rear and garden exteriors", "Dusk exteriors on request"],
    facts: [["Time on site", "About 1 hour"], ["Delivered", "48–72 hours"], ["Camera", "Mirrorless, ultra-wide lens"]],
    why: [
      { t: "First impressions are photos", d: "Buyers decide which homes to view from the first few images." },
      { t: "Windows you can see out of", d: "Blended exposures keep the room bright and the view outside." },
      { t: "Portal-ready", d: "Sized for Rightmove, Zoopla and OnTheMarket, plus full-size for brochures." },
    ],
    faq: [
      { q: "How should I prepare the home?", a: "Clear surfaces, open curtains and switch every light on. I send a short guide when you book." },
      { q: "Can you shoot occupied lettings?", a: "Yes. I work around tenants and keep personal items out of shot where possible." },
    ],
    kit: ["camera", "mini4"],
    know: "Clear surfaces, open the curtains and switch every light on before I arrive.",
    knowLink: { text: "Here's a quick prep guide", href: "/journal/get-your-home-ready-for-drone-photos/" },
  },
  {
    id: "aerial", group: "homes", code: "AE", quote: "aerial", art: "home", alt: 60, label: "Aerial", cat: "Guides",
    nav: "Aerial", title: "Aerial photos and video",
    hero: "Show the plot, the street and the view.",
    lede: "The plot, the garden, the roof, the street and what's nearby, in one frame. It's what buyers actually want to know.",
    forWho: ["Estate agents", "Land agents", "Housebuilders", "Private sellers"],
    gets: ["5–15 aerial photos depending on package", "A hero shot with the plot outlined", "Short 4K aerial clip", "Available on its own for agents with their own photographer"],
    facts: [["Time on site", "About 30 minutes"], ["Delivered", "48–72 hours"], ["Drone", "DJI Mini 4 Pro"]],
    why: [
      { t: "Sell the setting", d: "Buyers buy the location as much as the house. Aerials show it." },
      { t: "Plots made clear", d: "Gardens, land and boundaries make sense from above." },
      { t: "Light enough to fly close", d: "The Mini 4 Pro is under 250 g, so it can work near homes within the rules." },
    ],
    faq: [
      { q: "Do you need to be in the house?", a: "No. Aerial-only shoots can usually happen without anyone home, with permission." },
      { q: "Is it legal near my home?", a: "In most places, yes. I check airspace and restrictions before every flight." },
    ],
    kit: ["mini4"],
    know: "I check airspace and permissions before every flight. Cars off the drive and bins out of sight make a big difference.",
  },
  {
    id: "walkthrough", group: "homes", code: "WT", quote: "showcase", art: "walkthrough", alt: 1.5, label: "Walkthrough", cat: "Behind the shot",
    nav: "Walkthrough video", title: "Walkthrough video",
    hero: "A viewing before the viewing.",
    lede: "A smooth, steady walk through the home, room by room, mixed with aerial shots. Buyers get a real feel for the layout before they book a viewing.",
    forWho: ["Estate agents", "Sellers", "Letting agents", "Holiday lets"],
    gets: ["60–120 second edited walkthrough", "Aerial opening and closing shots", "Licensed music and optional agent branding", "Vertical reel cut for social media"],
    facts: [["Time on site", "About 1 hour"], ["Delivered", "48–72 hours"], ["Gimbal", "DJI Osmo Pocket 3"]],
    why: [
      { t: "Layout at a glance", d: "Buyers see how rooms connect before they travel." },
      { t: "Fewer wasted viewings", d: "People who book have already seen the flow of the home." },
      { t: "Built for social", d: "A vertical cut ready for Reels, TikTok and Shorts." },
    ],
    faq: [
      { q: "Can my branding go on it?", a: "Yes. Send your logo once and it goes on every intro and end card." },
      { q: "Can I add an intro to camera?", a: "Yes, a 30-second agent intro filmed on the Neo 2 or Pocket 3 is a £49 add-on." },
    ],
    kit: ["pocket3", "neo2", "mini4"],
    know: "Add a 30-second agent intro to camera and it doubles as social content for the agency.",
  },
  {
    id: "fpv", group: "homes", code: "FPV", quote: "fpv", art: "fpv", alt: 2, label: "FPV tour", cat: "Fly-throughs",
    nav: "FPV fly-throughs", title: "FPV fly-throughs",
    hero: "One take. No cuts. Every room.",
    lede: "One unbroken flight through the property: in the front door, through every room that matters, and out over the garden.",
    forWho: ["Premium homes", "Showhomes", "Venues and bars", "Gyms and hotels"],
    gets: ["A 45–90 second single-take tour", "A route walked and rehearsed first", "Colour grading and music", "A vertical cut for social media"],
    facts: [["Time on site", "About 90 minutes"], ["Delivered", "3–5 days"], ["Drone", "DJI Avata 2"]],
    why: [
      { t: "Watched to the end", d: "A continuous flight feels like walking through it yourself." },
      { t: "Shows flow, not just rooms", d: "Viewers see how every space connects." },
      { t: "Stands out instantly", d: "Very few listings and venues have one." },
    ],
    faq: [
      { q: "Is it safe indoors?", a: "The Avata 2 has built-in prop guards, flights are rehearsed and people are kept clear of the route." },
      { q: "How long does it take?", a: "About 90 minutes on site, with the edit in 3–5 days." },
    ],
    kit: ["avata2"],
    know: "The Avata 2 has guarded propellers built for flying indoors.",
    knowLink: { text: "Read how I plan a tour", href: "/journal/planning-a-one-take-fpv-house-tour/" },
  },
  /* ---------------- COMMERCIAL ---------------- */
  {
    id: "construction", group: "commercial", code: "CP", quote: "construction", art: "construction", alt: 100, label: "Construction", cat: "Construction",
    nav: "Construction", title: "Construction progress", fromLabel: "From, per visit",
    hero: "Prove what's done. Show what's coming.",
    lede: "Same positions, every visit. A dated visual record of the build for developers, contractors, funders and your own files.",
    forWho: ["Developers", "Main contractors", "Architects", "Funders and investors"],
    gets: ["Fixed-position aerial stills from the same points every visit", "Top-down overview of the whole site", "60–90 second progress film", "Dated, organised folder per visit"],
    facts: [["Time on site", "1–2 hours"], ["Delivered", "48–72 hours"], ["Aircraft", "DJI Mini 4 Pro"]],
    why: [
      { t: "Settle disputes with dates", d: "A dated photo from the same spot each month is hard to argue with." },
      { t: "Keep funders informed", d: "Send investors a film instead of a spreadsheet." },
      { t: "Market the scheme early", d: "Progress footage becomes launch content for the sales team." },
    ],
    faq: [
      { q: "How often should you visit?", a: "Monthly suits most schemes. Fortnightly works for fast frames and fit-outs." },
      { q: "Do you need a site induction?", a: "Usually yes. I bring my own insurance and RAMS and follow your site rules and permit process." },
    ],
    kit: ["mini4"],
    know: "Progress photos are visual records, not measurements. Mapping and 3D models are coming once the Matrice 4E joins the fleet.",
    knowLink: { text: "Read the full construction guide", href: "/construction/" },
  },
  {
    id: "film", group: "commercial", code: "AF", quote: "film", art: "film", alt: 80, label: "Aerial film", cat: "Showreels",
    nav: "Aerial film", title: "Aerial film & brand content",
    hero: "The establishing shot your story is missing.",
    lede: "Cinematic aerials, one-take FPV and follow-me shots for launches, venues, brands and places that deserve a proper reveal.",
    forWho: ["Venues and hotels", "Brands and agencies", "Developers", "Councils and attractions"],
    gets: ["Shot list built around your brief", "4K HDR aerial footage, plus FPV and follow-me shots", "Graded 60–120 second film", "Vertical cuts for social", "Licence to use everywhere you market"],
    facts: [["Time on site", "Half or full day"], ["Delivered", "5–7 days"], ["Drones", "Mini 4 Pro, Avata 2, Neo 2"]],
    why: [
      { t: "Context in one frame", d: "Show where a place sits: the coast, the city, the roads in." },
      { t: "Scale photos can't show", d: "A slow rise reveals size and setting like nothing else." },
      { t: "Content that lasts", d: "One morning of flying fills a launch and months of posts." },
    ],
    faq: [
      { q: "Can you fly in the city centre?", a: "Often, with planning. Some areas need extra permission, which I check before booking." },
      { q: "What if the weather's bad?", a: "Every booking has a backup date. If the forecast fails, your shoot moves free." },
    ],
    kit: ["mini4", "avata2", "neo2"],
    know: "Golden-hour timing is free to request. Tell me what the film is for and I'll plan the light around it.",
  },
  {
    id: "mapping", soon: true, group: "commercial", code: "MP", quote: "mapping", art: "mapping", alt: 90, label: "Mapping", cat: "Construction",
    nav: "Mapping & 3D", title: "Mapping & 3D models",
    hero: "Measure it from above.",
    lede: "Orthomosaic maps and 3D models of sites, buildings and land. Coming soon, once the Matrice 4E and its mechanical-shutter mapping camera join the fleet.",
    forWho: ["Developers and planners", "Contractors", "Land agents", "Surveyors and architects"],
    gets: ["High-resolution orthomosaic map (GeoTIFF)", "Textured 3D model you can measure", "Site overview stills", "Before and after comparisons for repeat visits"],
    facts: [["Time on site", "1–3 hours"], ["Delivered", "3–7 days"], ["Aircraft", "DJI Matrice 4E"]],
    why: [
      { t: "See the whole site", d: "One accurate map instead of a hundred loose photos." },
      { t: "Measure without walking it", d: "Distances, areas and heights from the model." },
      { t: "Track change", d: "Repeat flights show exactly what moved between visits." },
    ],
    faq: [
      { q: "Is it survey-grade?", a: "Without ground control it's for planning, marketing and progress, not legal boundaries. Ground control points can be added for higher accuracy." },
      { q: "What file formats do I get?", a: "GeoTIFF orthomosaics and common 3D formats (OBJ or similar), plus an easy viewer link." },
    ],
    kit: ["m4e"],
    know: "Not bookable yet. Message me and I'll let you know as soon as mapping launches.",
  },
  {
    id: "roofs", group: "commercial", code: "IN", quote: "roof", art: "roof", alt: 15, label: "Inspection", cat: "",
    nav: "Roofs & inspections", title: "Roof & building inspections",
    hero: "Look closely without going up.",
    lede: "Close, high-resolution views of roofs, chimneys, gutters and facades, without ladders, scaffolding or risk.",
    forWho: ["Surveyors", "Roofers and builders", "Property managers", "Homeowners and landlords"],
    gets: ["High-resolution photos of every roof slope and elevation", "Close passes along ridges, valleys and gutters", "Annotated photos marking areas to check"],
    facts: [["Time on site", "Under 1 hour"], ["Delivered", "48–72 hours"], ["Aircraft", "DJI Mini 4 Pro"]],
    why: [
      { t: "No access equipment", d: "Skip the scaffold and cherry picker for a first look." },
      { t: "Safer for everyone", d: "Nobody climbs onto a roof that might be unsafe." },
      { t: "Evidence you can send", d: "Clear photos help roofers quote and insurers decide." },
    ],
    faq: [
      { q: "Is this a survey?", a: "No. It's a visual record for a qualified surveyor or contractor to assess. I don't diagnose defects." },
      { q: "Do you do thermal?", a: "Not yet. Thermal imaging is on the roadmap." },
    ],
    kit: ["mini4"],
    know: "I'm not a roofer, so I don't diagnose faults. The photos make it easy for a roofer to quote accurately.",
    knowLink: { text: "Read the full roof inspection guide", href: "/roof-inspections/" },
  },
  {
    id: "events", group: "commercial", code: "EV", quote: "event", art: "event", alt: 40, label: "Events", cat: "Showreels",
    nav: "Events", title: "Events & venues",
    hero: "The shot everyone shares.",
    lede: "Openings, launches, shows and celebrations, filmed from the ground and from the one place nobody else can stand.",
    forWho: ["Event organisers", "Venues", "Sports clubs", "Brands and sponsors"],
    gets: ["Pre-event airspace and permission checks", "A group photo from above", "A 2–3 minute highlights film", "Same-week social clips"],
    facts: [["Time on site", "2 hours to a full day"], ["Delivered", "Highlights in 7 days"], ["Kit", "Mini 4 Pro, Neo 2, Avata 2"]],
    why: [
      { t: "Scale and atmosphere", d: "Aerials show the size of the crowd and the energy of the place." },
      { t: "Sponsor-ready", d: "Give partners content they'll actually post." },
      { t: "Next year's marketing", d: "This year's footage sells next year's tickets." },
    ],
    faq: [
      { q: "Can you fly over crowds?", a: "Not directly. Shots are planned around crowd areas in line with CAA rules." },
      { q: "How far ahead should I book?", a: "Four weeks or more, so there's time for any permissions." },
    ],
    kit: ["mini4", "neo2", "avata2"],
    know: "Some venues and large crowds need extra permission. Book early and I'll handle the checks.",
  },
  {
    id: "business", group: "commercial", code: "BC", quote: "business", art: "business", alt: 30, label: "Business", cat: "Guides",
    nav: "Business content", title: "Content for local businesses",
    hero: "Weeks of posts from one morning.",
    lede: "Scroll-stopping footage of your premises, team and work, cut for every platform you use.",
    forWho: ["Shops and cafes", "Gyms and studios", "Trades", "Hospitality"],
    gets: ["3–5 vertical clips for TikTok, Reels and Shorts", "A 60-second film for your website", "15+ photos for your Google profile and socials", "Optional indoor FPV tour of your space"],
    facts: [["Time on site", "1–2 hours"], ["Delivered", "Within 5 working days"], ["Kit", "Neo 2, Avata 2, Pocket 3"]],
    why: [
      { t: "Content that stops thumbs", d: "Angles your customers haven't seen before." },
      { t: "Every platform covered", d: "Vertical, square and landscape from one shoot." },
      { t: "Your Google profile", d: "Fresh photos help you stand out locally." },
    ],
    faq: [
      { q: "Will it disrupt customers?", a: "I plan filming around your opening hours so business carries on as normal." },
      { q: "Can you film the team?", a: "Yes. The Neo 2 follows people naturally for walk-and-talk clips." },
    ],
    kit: ["neo2", "avata2", "pocket3"],
    know: "I plan filming around your opening hours so business carries on as normal.",
  },
];
export const serviceById = (id) => SERVICE_PAGES.find((s) => s.id === id);


/* =========================================================
   COMMERCIAL MISSION PLANNER (guide prices) — /plan/
   ========================================================= */
export const PLANNER = {
  // Services marked soon (kit not here yet) are left out until they're live.
  missions: ["construction", "film", "mapping", "roofs", "events", "business"].filter((id) => !SERVICE_PAGES.find((x) => x.id === id)?.soon).map((id) => {
    const s = SERVICE_PAGES.find((x) => x.id === id);
    const p = PRICING.services.find((x) => x.id === s.quote);
    return { id, name: s.title, code: s.code, base: p.base, unit: s.fromLabel ? "per visit" : "" };
  }),
  scale: [
    { id: "small", name: "Small", note: "One building, house or short event", mult: 1 },
    { id: "medium", name: "Medium", note: "Large site, venue or half-day event", mult: 1.45 },
    { id: "large", name: "Large", note: "Multi-block scheme, estate or full day", mult: 2.1 },
  ],
  frequency: [
    { id: "once", name: "One-off", visits: 1, disc: 0 },
    { id: "quarterly", name: "Quarterly × 4", visits: 4, disc: 0.05 },
    { id: "monthly", name: "Monthly × 6", visits: 6, disc: 0.1 },
    { id: "fortnightly", name: "Fortnightly × 12", visits: 12, disc: 0.15 },
  ],
  extras: [
    { id: "vertical", name: "Vertical social cuts", price: 49 },
    { id: "raw", name: "All original footage", price: 39 },
    { id: "rush", name: "48-hour turnaround", price: 59 },
    { id: "fpv", name: "Add an FPV pass (Avata 2)", price: 149 },
    { id: "model", soon: true, name: "3D model (Matrice 4E)", price: 195 },
    { id: "flagship", soon: true, name: "Mavic 4 Pro 6K film", price: 89 },
  ],
};

// Price per visit for a mission at a given site size. Small (×1) is exactly the
// price set above; bigger sizes are rounded to the nearest £5.
export const missionBase = (base, mult) => (mult === 1 ? base : Math.round((base * mult) / 5) * 5);

// Planner extras that need kit not here yet stay hidden until it arrives.
PLANNER.extras = PLANNER.extras.filter((x) => !x.soon);

/* How a commercial mission runs (Commercial page) */
export const MISSION_STEPS = [
  { t: "Brief", d: "Tell me what you need it for. I reply within a day with a fixed quote and a flight plan.", tag: "T-14 days" },
  { t: "Plan", d: "Airspace, permissions, RAMS and a backup date for weather. You get the plan in writing.", tag: "T-7 days" },
  { t: "Fly", d: "On site, briefed, insured and compliant. Most missions take one to four hours.", tag: "T-0" },
  { t: "Deliver", d: "Edited files and maps by download link, organised, named and licensed.", tag: "T+2–7 days" },
];

/* Safety & compliance (Safety page) */
export const SAFETY = [
  { t: "Registered with the CAA", d: "Flyer ID and Operator ID held. Every flight follows the UK drone code and the right category for the aircraft." },
  { t: "Airspace checked every time", d: "Restricted zones, airports and temporary restrictions are checked when quoting and again on the day." },
  { t: "Written RAMS", d: "A risk assessment and method statement for every commercial mission, ready for your site manager." },
  { t: "Insured", d: "£10m public liability and £50k professional indemnity. Certificates sent before booking." },
  { t: "Privacy by design", d: "Shots are planned around your site. People and number plates in frame are blurred or cut. ICO registered." },
  { t: "Weather minimums", d: "Wind, rain and visibility limits are set before the day. If they're not met, the mission moves for free." },
];

/* What's coming next (Fleet page) */
export const ROADMAP = [
  { when: "Now", title: "Homes, aerial, FPV, film and progress", text: "Everything you can book on this site, flown today with the Mini 4 Pro, Avata 2 and Neo 2, plus the Osmo Pocket 3 on the ground." },
  { when: "Next", title: "Mirrorless stills", text: "Full-frame interior and detail photography for every property package." },
  { when: "Next", title: "Mavic 4 Pro and Mavic 3 Enterprise", text: "A triple-camera flagship for films and premium homes, and an enterprise zoom drone for inspections and big sites." },
  { when: "Later", title: "Matrice 4E: mapping and 3D", text: "Orthomosaic maps, measurable 3D models and laser-measured inspections." },
  { when: "Later", title: "Thermal inspection", text: "Heat-loss and roof moisture imaging for surveyors and property managers." },
];


/* =========================================================
   HOMEPAGE — "How a shoot works" steps
   ========================================================= */
export const HOW_STEPS = [
  { title: "Build your quote", text: "Pick a package or message me. I reply within a day with a fixed price and dates." },
  { title: "I plan the shoot", text: "I check airspace and the forecast, and send a short guide to get the home ready." },
  { title: "One visit, every angle", text: "Photos, aerial, walkthrough and FPV in a single trip. Most homes take 1–2 hours." },
  { title: "Download and list", text: "Edited files in 48–72 hours, sized for the portals and social media." },
];


/* =========================================================
   HOMEPAGE — FAQ. Use {PL} and {PI} to insert your insurance amounts.
   ========================================================= */
export const FAQ = [
  { q: "Are you insured?", a: "Yes. I carry {PL} public liability and {PI} professional indemnity insurance, adjustable per contract if a job requires more. I'm happy to send certificates before any job." },
  { q: "How quickly will I get the photos?", a: "Edited photos and walkthrough videos arrive within 48–72 hours by download link. FPV fly-throughs take 3–5 days. Next-day delivery is available as an add-on." },
  { q: "Do you need to be in the house?", a: "Yes, for interiors, walkthroughs and FPV. Aerial-only shoots can usually be done without anyone home, with permission." },
  { q: "Is it legal to fly near my property?", a: "In most places, yes. I hold a CAA Flyer ID and Operator ID and check the airspace before every job. Areas near airports, prisons or large events need extra permission, and I'll tell you straight away if that applies." },
  { q: "What if the weather's bad on the day?", a: "Drones can't fly safely in rain or strong wind. If the forecast is poor, your shoot moves to the next good day at no extra cost." },
  { q: "Will you film my neighbours?", a: "I plan every shot to keep the focus on your property. Neighbours, people and number plates that come into frame are blurred or cut." },
  { q: "Can I use the photos and video anywhere?", a: "Yes. Everything I deliver is yours to use on the portals, your website, brochures and social media." },
  { q: "Do you take on commercial and construction work?", a: "Yes. Construction progress, aerial film, events and inspections, flown with the Mini 4 Pro, Avata 2 and Neo 2, with mapping and 3D models coming soon. Use the mission planner for a guide price." },
  { q: "How do I pay?", a: "A 25% deposit secures your date. It's non-refundable if you cancel, because it pays for the flight planning, software, weather and airspace checks that start as soon as you book. Homeowners keep their legal 14-day right to cancel. After the shoot you see watermarked previews, and the full files are released as soon as the balance is paid. Jobs of £1,000 or more and repeat-visit contracts are invoiced on 30-day terms. Estate agents booking 4+ listings a month get one monthly invoice." },
];


/* =========================================================
   LINKS PAGE — happydrones.co.uk/links
   The "link in bio" page for Instagram, TikTok, Facebook and QR codes.
   Your socials come from SITE.socials above (only ones with a url show).
   ========================================================= */
export const LINKS = {
  intro: "Property photography, aerial and video across the North East.",

  // Your main video: any YouTube link. "" uses SITE.showreel instead.
  // If both are empty, the video is hidden.
  video: "",
  videoTitle: "Meet Happy Drones",

  // The main buttons, top to bottom. href can be a page on your site
  // ("/property/"), a full web address, or "whatsapp" / "call".
  // style: "primary" makes a button orange (use it once).
  buttons: [
    { label: "Get an instant quote", sub: "Build your price in under a minute", href: "/#quote", style: "primary" },
    { label: "Message me on WhatsApp", sub: "Quickest reply", href: "whatsapp" },
    { label: "Property packages", sub: "Essentials, Showcase and Signature", href: "/property/" },
    { label: "For estate agents", sub: `${AGENT_OFFER.discount} off at ${AGENT_OFFER.minPerMonth}+ listings a month`, href: "/estate-agents/" },
    { label: "Commercial & construction", sub: "Progress records, film and inspections", href: "/commercial/" },
    { label: "Plan a commercial mission", sub: "Guide price in under a minute", href: "/plan/" },
    { label: "All services", sub: "Ten services, homes to heavy-lift", href: "/services/" },
    { label: "The Viewing Room", sub: "Recent shoots, guides and videos", href: "/journal/" },
  ],

  // Current projects: add one block per project and the section appears.
  // Leave the list empty [] to hide it.
  projects: [
    // { label: "Four-bed family home, Durham", sub: "Signature shoot · Oct 2026", href: "/journal/your-post-name/" },
  ],

  // true shows your newest Viewing Room post as a card at the bottom
  showLatestPost: true,
};

export const fillInsurance = (text) =>
  text.replace("{PL}", SITE.insurance.publicLiability).replace("{PI}", SITE.insurance.professionalIndemnity);

export const liveSocials = () => SITE.socials.filter((s) => s.url);

export const whatsappLink = (text = "Hi Happy Drones, I'd like a quote for a property shoot.") =>
  SITE.whatsapp ? `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}` : "";

export const kitById = (id) => KIT.find((k) => k.id === id);
export const fromPrice = (svc) => { const p = PRICING.services.find((x) => x.id === svc.quote); return p ? p.base : 0; };
