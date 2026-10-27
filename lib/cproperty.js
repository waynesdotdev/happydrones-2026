/* =========================================================
   COMMERCIAL PROPERTY PAGE — happydrones.co.uk/commercial-property
   For commercial agents, landlords and developers: shops, offices,
   industrial and warehouse units, trade parks, land and leisure.
   PRICES HERE ARE GUIDES SET BY CLAUDE ON 27 OCT 2026. Wayne to confirm.
   ========================================================= */

/* ---- Packages (guide prices per property) ---- */
export const CP_PACKAGES = [
  {
    id: "frontage", name: "Frontage & Aerial", price: 169, tag: "To-let boards and quick lettings",
    gets: ["8–10 exterior photos: frontage, signage, entrance", "10 aerial photos, including wide location shots", "Annotated hero aerial: site edged, access marked", "Portal-ready files in 48–72 hours"],
  },
  {
    id: "marketing", name: "Full Marketing", price: 329, tag: "Most instructions", featured: true,
    gets: ["Everything in Frontage & Aerial", "15–25 interior photos: floors, offices, welfare", "60–90 second marketing video with aerials", "1 vertical cut for LinkedIn and social"],
  },
  {
    id: "flagship", name: "Flagship", price: 549, tag: "Investment sales and new builds",
    gets: ["Everything in Full Marketing", "One-take FPV fly-through, yard to office floor", "Dusk exteriors with the lights on", "Location film with road links and context", "2 vertical cuts"],
  },
];

export const CP_SIZES = [
  { id: "s", name: "Up to 5,000 sq ft", add: 0 },
  { id: "m", name: "5,000–25,000 sq ft", add: 60 },
  { id: "l", name: "25,000–100,000 sq ft", add: 140 },
];

export const CP_EXTRAS = [
  { t: "Extra units, same visit", p: "+£75 each", d: "Several units on one estate or parade, shot in one trip." },
  { t: "Out-of-hours shoot", p: "+£49", d: "Early morning or evening, for occupied premises or quiet yards." },
  { t: "Next-day delivery", p: "+£39", d: "Edited photos within 24 hours of the shoot." },
  { t: "White label", p: "£29 / £15 / free", d: "Your agency's branding only, priced as for residential agents." },
];

/* ---- Property types (explorer) ---- */
export const CP_TYPES = [
  {
    id: "industrial", name: "Industrial & warehouse", sub: "New-build units with offices above",
    need: "Occupiers want to see the yard, the loading doors, the clear floor and how quickly they can reach the motorway.",
    shots: ["Unit and yard from above", "Loading doors and level access", "Clear internal floor", "First-floor offices", "Parking and HGV turning", "Road links in context"],
    inside: "Open warehouse floors are ideal for an Avata 2 fly-through: in at the loading door, across the floor and up into the offices.",
    pkg: "flagship",
  },
  {
    id: "office", name: "Offices", sub: "Single floors to whole buildings",
    need: "Tenants judge the building, the entrance, the parking and the floor space. Light and outlook matter.",
    shots: ["Elevations and entrance", "Reception and core", "Open-plan floors", "Meeting and break-out space", "Car park and EV charging", "Location and amenities"],
    inside: "Open-plan floors suit an Avata 2 fly-through. Smaller suites get a Pocket 3 glide.",
    pkg: "marketing",
  },
  {
    id: "retail", name: "Retail & high street", sub: "Shops, parades and kiosks",
    need: "It's all about frontage, footfall and neighbours. Who's next door, and how busy the street is.",
    shots: ["Frontage and fascia", "The parade from above", "Neighbouring retailers", "Sales floor", "Rear access and servicing", "Town centre context"],
    inside: "Shop floors are usually compact, so a Pocket 3 glide from the door to the back of house.",
    pkg: "frontage",
  },
  {
    id: "trade", name: "Trade counter & retail park", sub: "Roadside and out of town",
    need: "Visibility from the road, the car park, the signage and the mix of brands around it.",
    shots: ["Roadside visibility", "Whole park from above", "Signage and totem", "Car park and access", "Unit interior", "Junction and catchment"],
    inside: "Trade counters suit a short Avata 2 flight from the car park, through the counter and into the warehouse.",
    pkg: "marketing",
  },
  {
    id: "land", name: "Development land", sub: "Sites with planning, or without",
    need: "Buyers need the boundary, the access, the topography and what surrounds the site. The aerial is the brochure.",
    shots: ["Site edged on the hero aerial", "Access points", "Boundaries and frontage", "Neighbouring uses", "Wide context", "Progress later, if it's built"],
    inside: "No interior. An aerial-led shoot, with a context film for larger sites.",
    pkg: "frontage",
  },
  {
    id: "leisure", name: "Leisure & mixed use", sub: "Pubs, hotels, gyms and venues",
    need: "Atmosphere sells these. Buyers and operators want to feel the space and see the setting.",
    shots: ["Building and grounds", "Bar, rooms or gym floor", "Function and outdoor space", "Parking", "Dusk exterior", "Local context"],
    inside: "Venues are where FPV shines: an Avata 2 flight through the bar, the function room and out to the beer garden.",
    pkg: "flagship",
  },
];

/* ---- Flyover reveal: the shots, in the order the camera rises ---- */
export const CP_REVEAL = [
  { at: 0.0, t: "Frontage and signage", d: "Starts at eye level: the entrance, the fascia and the first impression an occupier gets." },
  { at: 0.2, t: "Car parking", d: "Spaces, EV charging and how staff and visitors arrive." },
  { at: 0.38, t: "Loading and yard", d: "Doors, level access, yard depth and HGV turning. Industrial occupiers ask about this first." },
  { at: 0.56, t: "Roof and building", d: "The whole building from above: roof condition, plant and the scale of the unit." },
  { at: 0.74, t: "Access and road links", d: "The estate road, the junction and the route to the main road network." },
  { at: 0.9, t: "Location in context", d: "Pulled right back: the unit in its surroundings, so a buyer understands the location in one image." },
];

/* ---- Context map layers ---- */
export const CP_LAYERS = [
  { id: "roads", name: "Road links", d: "Main roads, junctions and drive times." },
  { id: "rail", name: "Rail and ports", d: "Stations, freight terminals and ports." },
  { id: "amenity", name: "Amenities", d: "Town centre, food, retail and services for staff." },
  { id: "neighbours", name: "Neighbours", d: "Other occupiers and the mix of uses around the site." },
];

/* ---- How it works for agents and landlords ---- */
export const CP_PROCESS = [
  { tag: "Day 0", t: "Instruction", d: "Send the address, the access contact, the unit size and what the marketing is for: letting, sale or investment." },
  { tag: "Day 1", t: "Access and permission", d: "I arrange access with the occupier or landlord, check airspace and agree a time that avoids deliveries and staff." },
  { tag: "Shoot day", t: "One visit", d: "Exterior, aerial, interior and video in one trip. Several units on the same estate can share the visit." },
  { tag: "+48–72 h", t: "Delivery", d: "Portal-ready photos, annotated aerials and video, named by unit." },
  { tag: "Go live", t: "Particulars", d: "Hero aerial for the brochure, location aerial for the particulars, video for LinkedIn and the portals." },
];

/* ---- On-site practicalities ---- */
export const CP_PRACTICAL = [
  { t: "Occupied premises", d: "Shoots planned around trading hours, staff and deliveries. Out-of-hours slots are available." },
  { t: "Permissions", d: "Landlord or occupier permission arranged through you. I'll ask for a site contact." },
  { t: "Airspace", d: "Many industrial estates sit near airports. Restricted zones are checked and permission applied for where needed." },
  { t: "Site rules", d: "Hi-vis, sign-in and yard safety followed on working sites. RAMS available on request." },
  { t: "People and plates", d: "Staff, members of the public and number plates are kept out of shot or blurred." },
  { t: "Annotations", d: "Site edging, access arrows and distance labels added to the hero aerial from the details you send." },
];

export const CP_FAQ = [
  { q: "Can you shoot several units on the same estate?", a: "Yes. Additional units on the same visit are £75 each, so multi-let estates and parades are good value." },
  { q: "Can you mark the site boundary on the aerial?", a: "Yes. Send the title plan or a marked-up map and I'll edge the site and mark the access on the hero aerial." },
  { q: "Do you measure floor areas or eaves heights?", a: "No. Photos and video show the space but aren't a measured survey. Use your measured survey for areas and heights." },
  { q: "Can you work around a business that's still trading?", a: "Yes. We'll agree a time with the occupier, and early-morning or evening shoots are available." },
  { q: "What about properties near Teesside or Newcastle airports?", a: "Some estates sit inside airport restriction zones. I check every site and apply for permission where needed, which can add a few days." },
  { q: "Do you offer agency branding or white label?", a: "Yes, exactly as for residential agents: agency-branded is included, and white label is £29, £15 on an agent account, or free on 10-listing bundles." },
  { q: "How is it invoiced?", a: "Agent accounts are invoiced monthly. Jobs of £1,000 or more and repeat work are on 30-day terms. One-off jobs take a 25% deposit." },
];
