/* =========================================================
   ESTATE AGENTS PAGE — interactive sections (happydrones.co.uk/estate-agents)
   Tour finder, working models, listing timeline and extra FAQs.
   Prices come from PRICING, AGENT_OFFER and PAYMENT in lib/site.js.
   ========================================================= */
import { PRICING, AGENT_OFFER, PAYMENT } from "./site";

/* ---- Tour finder: which tour suits which property ----
   size: index into the package size options (0 flat/1–2 bed, 1 3–4 bed, 2 5+ bed or land)
   tour: "pocket" (Pocket 3 FPV-mode glide), "avata" (Avata 2 FPV flight), "either", "aerial"
   plan: rooms as [x, y, w, h, label] on a 420 × 260 plan. route: the interior path. */
export const TOUR_TYPES = [
  {
    id: "flat", name: "Flat or apartment", beds: "1–2 bed", size: 0, pkg: "showcase", tour: "pocket",
    aerial: "The building, the view and what's nearby, where the block and airspace allow.",
    inside: "Narrow halls and low ceilings are too tight to fly safely, so the tour is a smooth handheld glide on the Pocket 3 in its FPV mode. It looks like a fly-through, at walking height.",
    time: "About 1 hour", note: "Ask the managing agent about communal areas and the roof before the shoot.",
    plan: [[20, 20, 150, 110, "Living"], [170, 20, 110, 110, "Kitchen"], [280, 20, 120, 110, "Bed 1"], [20, 130, 90, 110, "Bath"], [110, 130, 170, 50, "Hall"], [110, 180, 170, 60, "Entrance"], [280, 130, 120, 110, "Bed 2"]],
    route: "M195 235 L195 155 L95 155 L95 75 L225 75 L225 155 L340 155 L340 75",
  },
  {
    id: "terrace", name: "Terraced house", beds: "2–3 bed", size: 0, pkg: "showcase", tour: "pocket",
    aerial: "The street, the rear yard or garden, and parking. Shows buyers the area at a glance.",
    inside: "Terraces usually have narrow halls and steep stairs, so the Pocket 3 glide gives a smooth, safe tour through every room.",
    time: "About 1.5 hours", note: "Rear access helps for garden aerials.",
    plan: [[20, 20, 130, 220, "Front room"], [150, 20, 40, 220, "Hall"], [190, 20, 120, 110, "Dining"], [190, 130, 120, 110, "Kitchen"], [310, 20, 90, 220, "Yard"]],
    route: "M170 235 L170 75 L85 75 L85 160 L170 160 L170 75 L250 75 L250 185 L355 185 L355 60",
  },
  {
    id: "semi", name: "Semi-detached", beds: "3 bed", size: 1, pkg: "showcase", tour: "either",
    aerial: "Front and rear, the garden, the driveway and the street.",
    inside: "If the ground floor is open-plan, the Avata 2 can fly a one-take tour. If it's more closed-in, the Pocket 3 glide does the job. I'll tell you which when you book.",
    time: "About 2 hours", note: "Open-plan kitchens and wide doorways favour a drone fly-through.",
    plan: [[20, 20, 140, 120, "Lounge"], [160, 20, 50, 220, "Hall"], [210, 20, 190, 140, "Kitchen / diner"], [20, 140, 140, 100, "Snug"], [210, 160, 190, 80, "Garden doors"]],
    route: "M185 235 L185 80 L90 80 L90 190 L185 190 L185 90 L305 90 L305 200 L380 200",
  },
  {
    id: "detached", name: "Detached house", beds: "4 bed", size: 1, pkg: "signature", tour: "avata",
    aerial: "The whole plot, the boundaries, the garden and the setting. Where aerials earn their keep.",
    inside: "Wider rooms and open-plan living suit a one-take FPV fly-through on the Avata 2, from the front door out over the back garden.",
    time: "Half a day", note: "Signature includes dusk exteriors, which suit detached homes best.",
    plan: [[20, 20, 160, 130, "Lounge"], [180, 20, 60, 220, "Hall"], [240, 20, 160, 150, "Kitchen / family"], [20, 150, 160, 90, "Study"], [240, 170, 160, 70, "Utility"]],
    route: "M210 235 L210 85 L100 85 L100 195 L210 195 L210 95 L320 95 L320 140 L400 140",
  },
  {
    id: "large", name: "Large home or new build", beds: "5+ bed", size: 2, pkg: "signature", tour: "avata",
    aerial: "Grounds, approach, outbuildings and the wider setting, plus dusk shots with the lights on.",
    inside: "A full Avata 2 fly-through, from the drive, through the main rooms and out over the grounds. Showhomes and new builds get the same treatment.",
    time: "Half a day", note: "For new-build developments, ask about filming several plots in one visit.",
    plan: [[20, 20, 130, 110, "Drawing room"], [150, 20, 90, 220, "Hall"], [240, 20, 160, 110, "Kitchen"], [20, 130, 130, 110, "Library"], [240, 130, 80, 110, "Boot room"], [320, 130, 80, 110, "Orangery"]],
    route: "M195 235 L195 75 L85 75 L85 185 L195 185 L195 75 L320 75 L360 185 L400 185",
  },
  {
    id: "rural", name: "Rural, land or plots", beds: "Land and acreage", size: 2, pkg: "aerial", tour: "aerial",
    aerial: "The whole site, boundaries outlined, access, views and what's around it. For land, the aerial is the listing.",
    inside: "Usually exterior only. If there's a house too, add photos and a Pocket 3 or Avata 2 tour like any other home.",
    time: "About 1 hour", note: "Boundary lines can be drawn on the hero shot from your title plan.",
    plan: [[20, 20, 380, 220, "Field"], [40, 160, 120, 70, "Farmhouse"], [180, 170, 80, 60, "Barn"]],
    route: "M40 40 L380 40 L380 220 L40 220 Z",
  },
];

export const TOUR_LABELS = {
  pocket: { name: "Pocket 3 FPV-mode glide", kit: "pocket3", short: "Handheld glide" },
  avata: { name: "Avata 2 FPV fly-through", kit: "avata2", short: "Drone fly-through" },
  either: { name: "Avata 2 or Pocket 3, depending on the layout", kit: "avata2", short: "Either, by layout" },
  aerial: { name: "Aerial-led, exterior focus", kit: "mini4", short: "Aerial only" },
};

export const pkgFrom = (pkgId, sizeIdx) => {
  const p = PRICING.services.find((s) => s.id === pkgId);
  if (!p) return 0;
  return p.base + (p.sizes?.[Math.min(sizeIdx, p.sizes.length - 1)]?.add || 0);
};

/* ---- Three ways to work together ---- */
export const MODELS = [
  {
    id: "payg", name: "Pay as you go", tag: "Any agent, any listing",
    discount: 0, whiteLabel: 29, best: "Trying me out, or the odd premium listing.",
    billing: `${PAYMENT.depositPct}% deposit secures the date. The balance is paid before the full files are released.`,
    timeline: [
      { day: "Day 0", t: "Book", d: "Send the address and package.", pay: `${PAYMENT.depositPct}% deposit` },
      { day: "Day 1", t: "Vendor contacted", d: "I arrange access and send the prep guide." },
      { day: "Day 2–5", t: "Shoot", d: "One visit, everything captured." },
      { day: "+48–72 h", t: "Previews", d: "Watermarked previews to check.", pay: "Balance invoiced" },
      { day: "On payment", t: "Full files", d: "Portal-ready files released straight away." },
    ],
  },
  {
    id: "account", name: "Agent account", tag: `${AGENT_OFFER.minPerMonth}+ listings a month`,
    discount: 0.1, whiteLabel: 15, best: "Agencies listing every week who want a regular slot.",
    billing: `${AGENT_OFFER.discount} off every package, a regular weekly slot, and one invoice at the end of the month.`,
    timeline: [
      { day: "Week 1", t: "Listings booked", d: "Book each one by WhatsApp or the form." },
      { day: "Week 1–4", t: "Weekly slot", d: "Shoots on your regular day, files in 48–72 hours." },
      { day: "Ongoing", t: "Files released", d: "No waiting for payment per listing." },
      { day: "Month end", t: "One invoice", d: "Every listing that month, itemised by address.", pay: "Monthly invoice" },
      { day: "Next month", t: "Repeat", d: "Same slot, same standard." },
    ],
  },
  {
    id: "bundle", name: `${AGENT_OFFER.bundle.size}-listing bundle`, tag: "Paid up front",
    discount: 0.1, whiteLabel: 0, best: "Busy branches and new instructions campaigns.",
    billing: `Book and pay for ${AGENT_OFFER.bundle.size} listings up front. ${AGENT_OFFER.discount} off and free white label, used within ${AGENT_OFFER.bundle.months} months.`,
    timeline: [
      { day: "Day 0", t: "Bundle bought", d: `${AGENT_OFFER.bundle.size} listings, paid up front.`, pay: "Paid in full" },
      { day: "Any time", t: "Use a listing", d: "Send the address. No payment needed per shoot." },
      { day: "+48–72 h", t: "Files", d: "Released straight away, white label included." },
      { day: "Running total", t: "Balance tracked", d: "I tell you how many listings are left." },
      { day: `Within ${AGENT_OFFER.bundle.months} months`, t: "Use them all", d: "Top up with a new bundle when you're low." },
    ],
  },
];

/* ---- A listing, start to finish (sideways strip) ---- */
export const LISTING_STEPS = [
  { day: "Day 0", t: "Instruction won", d: "You win the listing. Send me the address, the vendor's number and the package.", icon: "key" },
  { day: "Day 0", t: "Booked", d: "I confirm a slot, usually within the week, by WhatsApp or email.", icon: "calendar" },
  { day: "Day 1", t: "Vendor prepped", d: "I call the vendor, agree a time and send a one-page guide to get the home ready.", icon: "phone" },
  { day: "Day 2–5", t: "Weather checked", d: "Forecast and airspace checked the day before. Bad weather means a free move, never a poor shoot.", icon: "cloud" },
  { day: "Shoot day", t: "One visit", d: "Photos, aerials, walkthrough and tour in one trip. Most homes take 1–2 hours.", icon: "drone" },
  { day: "+48–72 h", t: "Files delivered", d: "Download link, named by address, sized for Rightmove, Zoopla and OnTheMarket.", icon: "folder" },
  { day: "Go live", t: "Listing goes up", d: "Hero aerial as the lead image, the tour on the listing, the reel on your socials.", icon: "screen" },
  { day: "After the sale", t: "Branding respected", d: "Agency-branded work is only shared once it's sold. White label is never shown.", icon: "check" },
];

/* ---- Extra agent FAQs (added to AGENT_OFFER.faq on this page) ---- */
export const MORE_AGENT_FAQ = [
  { q: "What if the house is too small to fly a drone inside?", a: "That's common with flats and terraces. I use the Osmo Pocket 3 in its FPV mode instead, a smooth handheld glide that gives the same front-door-to-garden feel, at walking height and with no risk to the home." },
  { q: "Can you do just the outside?", a: "Yes. Aerial only covers the plot, the street and the setting, from £75, for agents who already have a photographer for interiors." },
  { q: "How quickly can you get to a new instruction?", a: "Usually within the week, and often sooner. Agent accounts get a regular weekly slot so new listings never wait." },
  { q: "Do I pay a deposit on every listing?", a: `Only on pay as you go, where a ${PAYMENT.depositPct}% deposit secures the date. Agent accounts are invoiced monthly, and bundles are paid up front.` },
  { q: "Do you do commercial property?", a: "Yes: shops, offices, industrial and warehouse units, trade parks, land and leisure. See the commercial property page for packages priced by unit size." },
];
