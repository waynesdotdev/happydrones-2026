/* =========================================================
   CONSTRUCTION PAGE — happydrones.co.uk/construction
   All the words for the in-depth construction progress page.
   Prices are worked out from PLANNER and PAYMENT in lib/site.js,
   so they always match the mission planner.
   ========================================================= */
import { PLANNER, PAYMENT, SITE, money, missionBase } from "./site";

/* ---- Price grid: per-visit price by site size and visit frequency ---- */
const SIZE_NOTES = {
  small: "One building, a short terrace or a small plot",
  medium: "A larger site or a few blocks",
  large: "A multi-block scheme or a whole estate",
};
export function constructionPrices() {
  const m = PLANNER.missions.find((x) => x.id === "construction");
  if (!m) return null;
  const rows = PLANNER.scale.map((sc) => {
    const perVisit = missionBase(m.base, sc.mult); // same as the planner
    return {
      id: sc.id, name: sc.name, note: SIZE_NOTES[sc.id] || sc.note,
      cells: PLANNER.frequency.map((fr) => {
        const gross = perVisit * fr.visits;
        const total = gross - Math.round(gross * fr.disc);
        return { id: fr.id, visits: fr.visits, perVisit: Math.round(total / fr.visits), total, disc: fr.disc };
      }),
    };
  });
  return { rows, freqs: PLANNER.frequency, from: rows[0].cells[0].perVisit, monthlyFrom: rows[0].cells.find((c) => c.id === "monthly")?.perVisit };
}

/* ---- The build, stage by stage (drives the scroll-through section) ----
   at: where in the scroll (0–1) this stage starts. trades: progress 0–100 at that point. */
export const BUILD_STAGES = [
  { at: 0.0, month: 1, title: "Baseline before work starts", text: "Visit one fixes the camera positions and records the site exactly as it is. Boundaries, access, neighbours, trees and services, dated before anyone digs.", use: "Pre-start condition record", trades: { ground: 0, frame: 0, envelope: 0, external: 0 } },
  { at: 0.16, month: 3, title: "Groundworks and foundations", text: "Excavation, piling and slabs are buried within weeks. The overhead from position D shows what went in the ground and when.", use: "Evidence of work that disappears", trades: { ground: 80, frame: 0, envelope: 0, external: 0 } },
  { at: 0.4, month: 6, title: "Frame rising, floor by floor", text: "Monthly visits from the same four corners show the frame going up level by level. It's the footage funders and sales teams ask for most.", use: "Funder and investor updates", trades: { ground: 100, frame: 55, envelope: 5, external: 0 } },
  { at: 0.62, month: 10, title: "Topped out and wrapped", text: "Cladding, glazing and roof. The building starts to look like the CGI, and the progress film becomes launch content.", use: "Sales launch and hoarding content", trades: { ground: 100, frame: 100, envelope: 70, external: 10 } },
  { at: 0.86, month: 14, title: "Landscaped and handed over", text: "The last visit closes the record: the finished scheme from every position you've tracked, plus a handover film and one-take glide tour if you want one.", use: "Handover, case study and awards", trades: { ground: 100, frame: 100, envelope: 100, external: 100 } },
];
export const TRADES = [
  { id: "ground", name: "Groundworks" },
  { id: "frame", name: "Frame" },
  { id: "envelope", name: "Envelope" },
  { id: "external", name: "Externals" },
];

/* ---- Fixed capture positions (capture plan section) ---- */
export const POSITIONS = [
  { id: "A", name: "South-west corner", type: "Oblique", alt: "60 m", angle: "45° down, facing north-east", why: "The classic hero view. Shows the front elevation and the street." },
  { id: "B", name: "South-east corner", type: "Oblique", alt: "60 m", angle: "45° down, facing north-west", why: "Second elevation and the site entrance, so logistics and access are on record." },
  { id: "C", name: "North-east corner", type: "Oblique", alt: "60 m", angle: "45° down, facing south-west", why: "Rear elevation, compound and laydown areas." },
  { id: "D", name: "Overhead, site centre", type: "Top-down", alt: "90–120 m", angle: "Straight down", why: "The whole site in one frame. Easiest view to compare month to month." },
  { id: "E", name: "Street level approach", type: "Low oblique", alt: "15–25 m", angle: "Eye-line with the street", why: "How the scheme sits next to its neighbours. Good for planning and marketing." },
  { id: "F", name: "Context wide", type: "High wide", alt: "120 m", angle: "Pulled back, facing the town", why: "The site in its surroundings: roads, transport and landmarks. Sells the location." },
];

/* ---- What arrives after every visit ---- */
export const DELIVERABLES = [
  { t: "Fixed-position stills", d: "Every agreed position, every visit, framed to match the last one. High-resolution JPEGs, ready for reports." },
  { t: "Top-down overview", d: "One straight-down image of the whole site, the easiest way to see what's changed." },
  { t: "60–90 second progress film", d: "Edited, graded and captioned with the date. Landscape for reports, vertical cuts on request." },
  { t: "Side-by-side comparison", d: "This month next to last month (or the baseline) from the same position, as a single image." },
  { t: "Dated, organised folder", d: "Named by site, visit and position, so anyone can find March's north-east view in seconds." },
  { t: "Visit note", d: "Date, time, weather, positions flown and anything that stopped a shot, so the record stands up later." },
];
export const FOLDER = [
  { d: 0, n: "HD-CP_Riverside-Quarter/" },
  { d: 1, n: "V07_2027-03-14/" },
  { d: 2, n: "01_Positions/", k: "A, B, C, E, F · 24 stills" },
  { d: 2, n: "02_Overhead/", k: "D · 3 stills" },
  { d: 2, n: "03_Film/", k: "V07_progress_90s.mp4 · vertical cuts" },
  { d: 2, n: "04_Compare/", k: "V07-vs-V06 · V07-vs-V01" },
  { d: 2, n: "V07_visit-note.pdf", k: "weather, times, positions" },
  { d: 1, n: "V06_2027-02-12/" },
  { d: 1, n: "V01_2026-09-10_baseline/" },
];

/* ---- Who uses it, and for what ---- */
export const USES = [
  { who: "Developers", what: "Launch films, CGI-to-reality comparisons, sales-suite screens and social content that keeps buyers interested through the build." },
  { who: "Main contractors", what: "A dated visual record for valuations, programme meetings and head office, plus evidence if a dispute or delay claim comes up." },
  { who: "Funders and monitoring surveyors", what: "Monthly visuals that sit alongside your reports, so lenders and investors see progress rather than read about it." },
  { who: "Architects and design teams", what: "Award entries, case studies and portfolio footage of the scheme you designed, from foundations to finish." },
  { who: "Marketing and comms teams", what: "Hoarding banners, newsletters, community updates and LinkedIn posts with fresh imagery every month." },
  { who: "Subcontractors", what: "Proof of your package going in, for your own case studies and to show the next client." },
];

/* ---- How it runs, from first call to handover ---- */
export const PROCESS = [
  { tag: "Day 1", t: "Brief", d: "Tell me about the site, the programme and who the footage is for. I reply within a day with a fixed price per visit." },
  { tag: "Week 1", t: "Site check and paperwork", d: "Airspace and permission checks, site-specific RAMS, insurance certificates and your induction. Everything in writing before the first flight." },
  { tag: "Week 1", t: "Capture plan", d: "We agree the fixed positions together, usually four to six, with heights and angles written down so every visit matches." },
  { tag: "Visit 1", t: "Baseline", d: "The site as it is before work starts, or as it is today if you're already on site." },
  { tag: "Monthly", t: "Repeat visits", d: "Same positions, same heights, booked on a regular date. If the weather's bad, it moves to the next suitable day." },
  { tag: "+48–72 h", t: "Delivery", d: "The dated folder lands by download link, ready to drop into your report." },
  { tag: "Handover", t: "Final film", d: "A closing visit and a full start-to-finish film made from every month on record." },
];

/* ---- Safety, compliance and how I work on site ---- */
export const COMPLIANCE = [
  { t: "CAA registered", d: "Flyer ID and Operator ID, flying under the UK rules for the aircraft and the site." },
  { t: "Site-specific RAMS", d: "Risk assessment and method statement written for your site and shared before visit one." },
  { t: "Your induction, your rules", d: "I complete your induction, wear the right PPE, sign in and out, and follow your permit-to-work process." },
  { t: "Airspace and permissions", d: "Airport zones, restricted areas and landowner permission checked before every visit, not just the first." },
  { t: `${SITE.insurance.publicLiability} public liability`, d: `Plus ${SITE.insurance.professionalIndemnity} professional indemnity. Cover can be adjusted per contract if your framework needs more.` },
  { t: "Flight log for every visit", d: "Times, positions, weather and any shots skipped, kept on file and available to you." },
];

/* ---- Kit used today (keep honest: only aircraft actually in the fleet) ---- */
export const TODAY_KIT = [
  { id: "mini4", role: "Fixed positions, overhead and film", d: "48 MP stills and 4K/60 HDR video. Saved waypoint routes mean every visit flies the same positions." },
  { id: "neo2", role: "Team and site intros", d: "Palm-launched follow-me clips: a site manager walking the scheme, or the team at topping out." },
  { id: "pocket3", role: "Ground-level walkthrough", d: "Smooth handheld video of showhomes, fit-out and finished interiors." },
];

/* ---- Honest limits of the visual service ---- */
export const LIMITS = [
  "Visual records, not measurements. Photos and film show progress, but they aren't a survey and can't be scaled for quantities or volumes.",
  "Positions are matched carefully from saved routes, typically within a few metres. That's plenty for side-by-side comparison, but not for engineering use.",
  "Some sites need extra permission, for example near airports or over busy public areas. I'll tell you before booking if that affects the plan.",
];

/* ---- Measured progress: what comes next (RTK) ---- */
export const MEASURED = {
  now: ["Fixed-position stills and film", "Top-down overview images", "Side-by-side comparisons", "Dated visit records", "Marketing and social content"],
  next: ["Orthomosaic maps you can measure on", "3D models of the site and structure", "Stockpile and earthworks volumes", "Cut and fill comparisons between visits", "As-built overlays against the design", "Centimetre-level positioning with RTK and ground control"],
  aircraft: [
    { name: "DJI Mavic 3 Enterprise + RTK module", d: "Mechanical-shutter mapping camera and RTK positioning. The first step into measured outputs." },
    { name: "DJI Matrice 4E", d: "Enterprise mapping platform with laser rangefinder and weather resistance, for larger sites and tougher conditions." },
  ],
};

/* ---- Questions ---- */
export const CONSTRUCTION_FAQ = [
  { q: "How often should you visit?", a: "Monthly suits most schemes and matches most reporting cycles. Fortnightly works for fast frames and fit-outs, quarterly for long, slow programmes." },
  { q: "Do you need to be on site for long?", a: "Usually one to two hours per visit, depending on the number of positions and the size of the site." },
  { q: "What if we're already halfway through the build?", a: "That's fine. Visit one becomes the baseline from today, and every visit after it matches." },
  { q: "Can you fly over a live site?", a: "Yes, with planning. Flights are set up around your operations and briefed with the site manager, and I follow your site rules and permit process." },
  { q: "What happens if the weather is bad?", a: "The visit moves to the next suitable day at no cost, and your record keeps its monthly rhythm." },
  { q: "Who owns the footage?", a: "I keep the copyright, and you get a licence to use it for your business, your reports and your marketing. Details are in the booking agreement." },
  { q: "Can we use it on hoardings and in sales suites?", a: "Yes. Tell me at the start and I'll shoot positions and crops that work at large sizes and on screens." },
  { q: "Can you provide measured surveys or volumes?", a: "Not yet. Measured mapping arrives with RTK aircraft. For a contract of the right length, I can bring that forward. Ask about it." },
  { q: "How is it invoiced?", a: `Repeat-visit contracts are invoiced per visit on ${PAYMENT.termsDays}-day terms. One-off visits under ${money(PAYMENT.largeFrom)} take a ${PAYMENT.depositPct}% deposit.` },
];
