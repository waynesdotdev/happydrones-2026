/* =========================================================
   ROOF INSPECTIONS PAGE (/roof-inspections) — words, lists and prices
   Prices come from the mission planner in lib/site.js (the "roofs" mission),
   so the page always matches /plan.
   ========================================================= */
import { PLANNER, missionBase, priceFrom } from "@/lib/site";
import { roofZ } from "@/lib/isoHouse";

/* ---- Guide prices: per visit, by roof size, one-off or quarterly ---- */
const SIZE_NOTES = {
  small: "A house, bungalow or garage",
  medium: "A large house, a small block, or two or three buildings on one site",
  large: "A block of flats, a church, a school or a large commercial roof",
};
export function roofPrices() {
  const m = PLANNER.missions.find((x) => x.id === "roofs");
  if (!m) return null;
  const freqs = PLANNER.frequency.filter((f) => f.id === "once" || f.id === "quarterly");
  const rows = PLANNER.scale.map((sc) => {
    const perVisit = missionBase(m.base, sc.mult); // same as the planner
    return {
      id: sc.id, name: sc.name, note: SIZE_NOTES[sc.id] || sc.note,
      cells: freqs.map((fr) => {
        const gross = perVisit * fr.visits;
        const total = gross - Math.round(gross * fr.disc);
        return { id: fr.id, visits: fr.visits, perVisit: Math.round(total / fr.visits), total };
      }),
    };
  });
  return { rows, freqs, from: rows[0].cells[0].perVisit };
}

/* ---- The inspection flight, stop by stop (drives the scroll section) ----
   at: where in the scroll (0–1) the stop starts. look: what the camera points at
   (world units, see lib/isoHouse.js). alt/dist: readouts in metres. */
const P = (x, y, z) => ({ x, y, z });
const near = (l, zoom) => ({ cam: { ...l, zoom }, drone: { x: l.x + 3.6, y: l.y + 0.6, z: l.z + 3.4 }, look: l });
export const RF_PINS = [
  { n: 1, ...P(4.69, 5.63, roofZ(5.63)), label: "01 · TILE OUT OF LINE" },
  { n: 2, ...P(2.2, 3.5, 8.5), label: "02 · RIDGE JOINT" },
  { n: 3, ...P(8.2, 4.1, 8.0), label: "03 · FLASHING" },
  { n: 4, ...P(6.3, 7.45, 5.05), label: "04 · GUTTER DEBRIS" },
  { n: 5, ...P(12.5, 5.3, 3.02), label: "05 · STANDING WATER" },
  { n: 6, ...P(10.2, 1.8, roofZ(1.8)), label: "06 · VERGE" },
];
const OVERVIEW = { cam: { x: 7, y: 5.2, z: 3, zoom: 1 }, drone: null, look: null };
export const RF_STOPS = [
  { at: 0, ...OVERVIEW, alt: 30, dist: null, t: "The whole roof from above", d: "First, the overview from about 30 m: every slope, the chimney, the extension and the gutters in one frame. It shows the layout before the close-ups start." },
  { at: 0.13, ...near(P(4.7, 5.6, roofZ(5.6)), 2.6), alt: 10, dist: 5, t: "Every slope, square on", d: "Each slope is photographed straight on, close enough to count the tiles or slates. Anything sitting out of line is marked for your roofer to look at." },
  { at: 0.26, ...near(P(2.4, 3.5, 8.45), 2.7), alt: 12, dist: 5, t: "Ridge and hips", d: "A slow pass along the ridge, where ridge tiles and mortar take the worst of the weather." },
  { at: 0.39, ...near(P(7.9, 4.1, 8.7), 2.7), alt: 12, dist: 5, t: "The chimney stack", d: "The sides of the stack, the pots from above and the flashing where it meets the roof. It's the hardest part to see from the ground, and the one people ask about most." },
  { at: 0.52, ...near(P(6.3, 7.45, 5.05), 2.8), alt: 8, dist: 5, t: "Gutters and downpipes", d: "Along every gutter run, looking down into it instead of up at it. Leaves, moss and dropped joints show up clearly." },
  { at: 0.65, ...near(P(12.4, 5.2, 3), 2.4), alt: 6, dist: 5, t: "Flat roofs and extensions", d: "Felt, rubber or fibreglass, photographed from directly above in good light. Standing water, splits and edge trims are easy to see from up here." },
  { at: 0.78, ...near(P(10.2, 1.8, roofZ(1.8)), 2.4), alt: 10, dist: 5, t: "Gables, verges and fascias", d: "The edges: bargeboards, verges, fascias and soffits. This is where the wind gets in first." },
  { at: 0.9, cam: { x: 7, y: 5.2, z: 3, zoom: 1.08 }, drone: null, look: null, alt: 30, dist: null, t: "One numbered photo pack", d: "It all comes back as one pack: the overview first, then every close-up, numbered and marked on the overview so you know exactly where each photo was taken." },
];

/* ---- Roof anatomy explorer (top-down plan) ---- */
export const RF_PARTS = [
  { id: "slopes", name: "Slopes", what: "The main roof covering: concrete tiles, clay tiles or natural slate.", shot: "Each slope square on, close enough to count tiles.", looks: ["Slipped, cracked or missing tiles", "Moss and lichen", "Lines that dip or sag"] },
  { id: "ridge", name: "Ridge", what: "The line along the top where two slopes meet, capped with ridge tiles.", shot: "A slow pass along the full length, from both sides.", looks: ["Loose or missing ridge tiles", "Cracked or missing mortar", "Dry-fix caps lifting"] },
  { id: "hips", name: "Hips", what: "The sloping ridges at the ends of a hipped roof.", shot: "Each hip, from the ridge down to the eaves.", looks: ["Hip tiles slipping", "Gaps in the mortar", "The hip iron at the bottom"] },
  { id: "valleys", name: "Valleys", what: "The channels where two slopes meet and water runs off. Often lined with lead or GRP.", shot: "Straight down the valley, from the top.", looks: ["Leaves and debris blocking it", "Splits or lifted lead", "Mortar along the edges"] },
  { id: "chimney", name: "Chimney", what: "The stack, the pots and the flashing where it meets the roof.", shot: "Every side, the pots from above and the flashing up close.", looks: ["Lifted or missing lead flashing", "Pointing and brickwork", "Pots, cowls and the flaunching on top"] },
  { id: "skylight", name: "Roof windows", what: "Skylights and roof windows set into the slope.", shot: "The frame and the flashing around each window.", looks: ["Seals and flashing round the frame", "Cracked glazing", "Debris collecting above it"] },
  { id: "solar", name: "Solar panels", what: "Panels fixed over the tiles on rails.", shot: "The array and the roof around it, including the gaps underneath.", looks: ["Dirt or damage on the panels", "Birds nesting underneath", "Tiles disturbed around the fixings"] },
  { id: "flat", name: "Flat roof", what: "Felt, EPDM rubber or fibreglass on extensions, garages and dormers.", shot: "From directly above, plus the edges and outlets.", looks: ["Standing water", "Splits, blisters or bubbles", "Edge trims and outlets"] },
  { id: "gutters", name: "Gutters and fascias", what: "Gutters, fascias and soffits around the eaves, and the downpipes that drain them.", shot: "Along each run, looking down into the gutter.", looks: ["Blocked gutters and outlets", "Dropped or leaking joints", "The condition of the fascias and soffits"] },
];

/* ---- Who books a roof check (sideways rail) ---- */
export const RF_SCENARIOS = [
  { tag: "Homeowners", t: "After a storm", d: "Wind lifts tiles and ridge caps. See what's moved before you pay for someone to go up, then send the photos to your roofer or insurer.", order: "One-off check, small roof" },
  { tag: "Buyers", t: "Before you buy", d: "Close photos of the roof of a house you're buying, to share with your surveyor or a roofer. Not a replacement for a survey.", order: "One-off check, small roof" },
  { tag: "Roofers", t: "Quoting a job", d: "Price from clear photos instead of climbing up for every enquiry, especially on high, steep or awkward roofs.", order: "Per roof, or invoiced monthly for regular work" },
  { tag: "Roofers and builders", t: "Before and after", d: "Dated photos of the roof before you start and after you finish, for the customer and for your own marketing.", order: "Two visits, or add to a larger job" },
  { tag: "Landlords", t: "Annual checks", d: "A dated record of each roof once or twice a year, so small jobs get done before they become big ones.", order: "Quarterly or yearly visits" },
  { tag: "Property managers", t: "Blocks and estates", d: "Every roof on a block or an estate, recorded on a schedule and named by building.", order: "Medium or large, repeat visits" },
  { tag: "Insurance", t: "Making a claim", d: "Clear, dated photos of the damage to send with your claim. Your insurer or loss adjuster decides what happens next.", order: "One-off check, next-day option" },
  { tag: "Solar installers", t: "Before and after install", d: "See the roof, the shading and the layout before you quote, and show the customer the finished array.", order: "Per roof" },
  { tag: "Churches and schools", t: "High and fragile roofs", d: "Tall, steep or fragile roofs where scaffolding costs a fortune. Planned with the site and checked for airspace first.", order: "Large, with a written plan" },
];

/* ---- Ways to look at a roof (comparison cards) ---- */
export const RF_METHODS = [
  { id: "street", name: "From the street", close: "Far away, at a steep angle", time: "Now", cost: "Free", risk: "None", keep: "Nothing to send anyone" },
  { id: "ladder", name: "Ladder", close: "The eaves and gutters only", time: "Same day", cost: "Free if you own one", risk: "High without training and the right kit", keep: "Only what you photograph" },
  { id: "scaffold", name: "Scaffolding", close: "As close as you like", time: "Days to arrange", cost: "Chimney scaffold alone is about £500–£820 a week*", risk: "Low once it's up", keep: "Only what's photographed" },
  { id: "picker", name: "Cherry picker", close: "Close, if it can reach", time: "Book a machine and operator", cost: "Day hire plus an operator", risk: "Needs room to set up", keep: "Only what's photographed" },
  { id: "drone", name: "Drone check", close: "A few metres, every slope", time: "Usually within days", cost: `From ${priceFrom("roof")}`, risk: "Nobody leaves the ground", keep: "A numbered photo pack", best: true },
];
export const RF_METHOD_NOTE = "*Checkatrade's 2026 scaffolding cost guide puts high-level chimney scaffolding at around £500–£820 a week. Prices vary by job.";

/* ---- What you get ---- */
export const RF_DELIVERABLES = [
  { t: "Overview photos", d: "The whole roof from above and from each side, so everything that follows has context." },
  { t: "Close-ups of every slope", d: "Square-on photos close enough to see individual tiles, plus the ridge, hips and valleys." },
  { t: "Chimneys, gutters and flat roofs", d: "Every stack, gutter run and flat roof, photographed from the best angle for each." },
  { t: "Numbered and marked", d: "Each photo numbered, with the numbers marked on the overview so you know where it was taken." },
  { t: "Ready to send", d: "A download link you can forward straight to a roofer, surveyor, landlord or insurer." },
];
export const RF_FOLDER = [
  { n: "14-Example-Road_2026-10-27/", d: 0 },
  { n: "00_Overview-marked.jpg", k: "with numbered pins", d: 1 },
  { n: "01_Overview/", d: 1 },
  { n: "02_Front-slope/", k: "18 photos", d: 1 },
  { n: "03_Rear-slope/", k: "16 photos", d: 1 },
  { n: "04_Ridge-and-hips/", k: "9 photos", d: 1 },
  { n: "05_Chimney/", k: "12 photos", d: 1 },
  { n: "06_Gutters-and-fascias/", k: "14 photos", d: 1 },
  { n: "07_Flat-roof-extension/", k: "8 photos", d: 1 },
];

/* ---- How it runs ---- */
export const RF_PROCESS = [
  { tag: "DAY 0", t: "Send the address", d: "Tell me what's worrying you, or what the photos are for. A photo from the street helps me plan." },
  { tag: "DAY 0–1", t: "Airspace and a time", d: "I check the airspace (some streets near the airports need permission first) and agree a time with you. You confirm I can take off from your drive, garden or a safe spot nearby." },
  { tag: "ON THE DAY", t: "Fly, in under an hour", d: "Overview first, then each slope, the ridge, the chimney, the gutters and any flat roofs. You don't usually need to be in." },
  { tag: "+48–72 H", t: "Numbered pack delivered", d: "Photos numbered and marked on the overview, by download link. Forward it straight to your roofer, surveyor or insurer." },
];

/* ---- Straight answers ---- */
export const RF_LIMITS = [
  "It's a visual record, not a survey. I don't diagnose faults or recommend repairs. That's for a roofer or surveyor.",
  "No thermal imaging yet. Heat-loss and damp imaging are on the roadmap.",
  "The drone can't lift a tile, look under the felt or test anything. If something needs touching, a roofer has to go up.",
  "No flying in rain, strong wind or poor light. If the weather's wrong on the day, the visit moves for free.",
  "Some areas, especially near airports, need airspace permission first. I check every address when quoting.",
  "The shots are of your roof, not your neighbours. Anything personal that ends up in frame is cropped or blurred.",
];

/* ---- Kit ---- */
export const RF_KIT_NOW = { id: "mini4", d: "48 MP stills and 4K video from a drone under 249 g, with obstacle sensing in every direction. Small and quiet enough for a residential street." };
export const RF_KIT_NEXT = [
  { name: "Mavic 3 Enterprise", d: "A zoom camera for close detail from further away: tall chimneys, church towers and roofs with trees or wires around them." },
  { name: "Matrice 4E", d: "Measurable 3D models of a roof, for roofers and surveyors who want sizes and areas." },
  { name: "Thermal", d: "Heat-loss and damp imaging for surveyors and property managers." },
];

/* ---- FAQ ---- */
export const RF_FAQ = [
  { q: "Is this a roof survey?", a: "No. It's a set of close, clear photos for you, a roofer or a surveyor to look at. I don't diagnose faults or recommend repairs." },
  { q: "Will anyone go on the roof?", a: "No. Nobody climbs anything. The drone does the looking from a few metres away." },
  { q: "Do I need to be home?", a: "Usually not, as long as I can take off from your drive, your garden or a safe spot nearby. I'll agree a time with you first." },
  { q: "How close does the drone get?", a: "Close enough to count tiles, usually a few metres away. How close depends on the wind, trees, wires and buildings around the roof." },
  { q: "Can I send the photos to my insurer?", a: "Yes. The photos are dated and numbered, and you can forward the download link. Your insurer or loss adjuster decides what happens next." },
  { q: "What if it's raining or windy?", a: "The visit moves to the next suitable day, at no cost. Photos taken in the wet or in poor light aren't much use anyway." },
  { q: "I live near Teesside or Newcastle airport. Can you still fly?", a: "Often, yes. Parts of both areas sit inside an airport flight restriction zone, where I need the airport's permission first. I check every address when quoting, and permission can add a few days." },
  { q: "Can you check lots of buildings?", a: "Yes. Blocks, estates and portfolios are priced per visit, with savings on repeat checks. Each building's photos are named separately." },
  { q: "Do you do thermal imaging?", a: "Not yet. It's on the roadmap. For now, it's high-resolution photos and video." },
];
