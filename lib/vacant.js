/* =========================================================
   VACANT PROPERTY MONITORING — words for happydrones.co.uk/vacant-property-monitoring
   Monthly drone checks of empty buildings waiting for redevelopment.
   The price lives in VACANT (lib/site.js). Payment terms come from PAYMENT.
   ========================================================= */
import { PAYMENT } from "./site";

/* ---- The month-by-month slider ----
   Each item appears on the drawing from month "m" onwards.
   id must match a damage layer in components/vacant/VacantBits.jsx. */
export const VP_ISSUES = [
  { id: "gutter", m: 2, t: "Plants growing in the front gutter", where: "Front gutter, left side", d: "Moss and weeds are holding water in the gutter. It will start running down the wall." },
  { id: "slates", m: 3, t: "Two slates slipped", where: "Front roof slope", d: "Two slates have slid out of place, leaving a gap for rain to get into the roof." },
  { id: "lead", m: 5, t: "Lead flashing missing from the chimney", where: "Chimney, roof side", d: "The lead round the base of the chimney has gone, almost certainly stolen. Rain will get in round the stack." },
  { id: "window", m: 6, t: "First-floor window broken", where: "First floor, second window", d: "One pane is smashed. Pigeons and rain can now get into the first floor." },
  { id: "tipping", m: 7, t: "Rubbish dumped in the yard", where: "Side yard", d: "Bags and a mattress have been dumped since the last visit. Fly-tipping tends to attract more of the same." },
  { id: "fence", m: 8, t: "Fence panel down", where: "Yard boundary", d: "A panel of the yard fence is lying flat, so the yard is open from the lane." },
  { id: "graffiti", m: 9, t: "Graffiti on the boarding", where: "Ground floor, boarded window", d: "New tags on the ground-floor boarding. A sign people are spending time on the site." },
  { id: "plant", m: 10, t: "Buddleia growing from the chimney", where: "Chimney top", d: "A plant has rooted in the chimney pot. The roots open up the brickwork if left." },
  { id: "storm", m: 11, t: "Storm damage near the ridge", where: "Ridge, right side", d: "After the storm, several slates near the ridge have gone. The roof is now open." },
  { id: "entry", m: 12, t: "Door boarding pulled open", where: "Front door", d: "The board over the door has been pried back. Someone may have been inside." },
];

/* ---- What the drone checks (tap a part to see it on the drawing) ----
   id must match a highlight area in VacantBits.jsx. */
export const VP_CHECKS = [
  { id: "roof", t: "Roof slopes and ridge", d: "Slipped, cracked and missing slates or tiles, storm damage and holes, from a few metres away." },
  { id: "chimney", t: "Chimney and lead", d: "Lead flashing (a common target for theft), pots, brickwork and plants taking root." },
  { id: "gutters", t: "Gutters and downpipes", d: "Blockages, plants, sagging runs and broken downpipes, before water starts running down the walls." },
  { id: "windows", t: "Windows and boarding", d: "Broken glass, loose or missing boards, and anywhere birds or rain can get in." },
  { id: "doors", t: "Doors and ways in", d: "Boards pried back, doors forced and any other sign someone has been getting inside." },
  { id: "walls", t: "Walls and graffiti", d: "New cracks, damp staining and graffiti, which often comes before worse." },
  { id: "boundary", t: "Fences and gates", d: "Panels down, gates open, gaps in hoarding and new paths worn across the site." },
  { id: "yard", t: "Yard and fly-tipping", d: "Dumped rubbish, burnt-out patches and anything that's appeared since the last visit." },
];

/* ---- Drone vs the weekly walk-round ---- */
export const VP_SPLIT = {
  drone: [
    "The whole roof, close up, including the parts you can't see from the ground",
    "Chimneys, lead, gutters and high windows",
    "The full boundary and yard from above, in one view",
    "The same positions every month, so changes stand out",
    "A dated report with numbered photos after every visit",
  ],
  walk: [
    "Inside the building: water, electrics, signs of squatters",
    "Locks, alarms and any boarding that needs replacing",
    "The weekly checks most insurers ask for on empty buildings",
    "Anything that needs a key or a hand on it",
  ],
};

/* ---- Who books it ---- */
export const VP_WHO = [
  { t: "Developers waiting on planning", d: "A site that will be knocked down or converted in a year or two still needs looking after, and a record of how it was." },
  { t: "Owners deciding what to do", d: "A building left standing while you weigh up selling, letting or redeveloping. Know it isn't quietly getting worse." },
  { t: "Receivers and asset managers", d: "Empty buildings held for lenders or investors, with a dated record to report back on every month." },
  { t: "Commercial agents with empty stock", d: "Keep an eye on vacant units between tenants, and have up-to-date aerial photos ready when they come back to market." },
  { t: "Loss adjusters and surveyors", d: "A one-off flight after a storm, fire or break-in, to see the roof and the damage without anyone going up." },
];

/* ---- How it works ---- */
export const VP_PROCESS = [
  { tag: "VISIT 01", t: "A starting record", d: "The first visit sets the fixed positions and photographs everything as it is today. Every later visit is compared with it." },
  { tag: "EVERY MONTH", t: "The same flight, the same views", d: "Each visit flies the same positions and heights, so month 9 lines up with month 1 and new damage stands out." },
  { tag: "WITHIN 48–72 H", t: "A dated report", d: "New issues first, with numbered photos and where they are on the building. Older issues are listed as still open, or as fixed." },
  { tag: "WHEN WORK STARTS", t: "Straight into construction progress", d: "When the redevelopment begins, the same positions carry on as a construction progress record." },
];

/* ---- Straight answers ---- */
export const VP_LIMITS = [
  "A drone looks from outside. It doesn't check inside the building.",
  "It doesn't replace the weekly inside-and-outside inspections most insurers ask for on empty buildings. It adds the parts nobody can see from the ground.",
  "It's a visual record, not a structural survey. If something looks serious, I'll say so, and a surveyor or roofer can take it from there.",
  "Always check your own policy wording for what your insurer needs.",
];

/* ---- FAQ ---- */
export const VP_FAQ = [
  { q: "Does this meet my insurer's conditions for an empty building?", a: "Not on its own. Insurers usually ask for inside and outside checks every week, with a log kept. A monthly drone visit adds the roof, the high-level parts and the whole boundary, with a dated photo record to go with your own logs. Check your policy wording for what yours needs." },
  { q: "Do you need to go inside?", a: "No. Every flight is outside. I need permission to fly from the site, or a safe spot nearby, and I don't need keys." },
  { q: "What happens if you spot new damage?", a: "New issues go at the top of the report, numbered, with close-up photos and where they are on the building. If it looks urgent, like an open roof or signs someone has been getting in, I'll message you on the day." },
  { q: "Can you come out after a storm?", a: "Yes. Extra visits can be booked between the monthly ones. Because they use the same positions, you can see exactly what the storm did." },
  { q: "How often should a building be checked?", a: "Monthly suits most empty buildings. Quarterly can work for a building in good condition on a quiet site. You can change the schedule as things change." },
  { q: "What about airspace and permission?", a: "I check the airspace and plan every flight before I arrive. A few sites near airports or prisons need extra permission, and I'll tell you before anything is booked. As the owner or manager, you give permission to take off from the site." },
  { q: "What happens when the redevelopment starts?", a: "The same fixed positions carry straight on as a construction progress record, so you end up with one dated record from empty building to finished scheme." },
  { q: "How do I pay?", a: `Regular visits are invoiced on ${PAYMENT.termsDays}-day terms. You get a fixed price per visit in writing before anything is booked.` },
];
