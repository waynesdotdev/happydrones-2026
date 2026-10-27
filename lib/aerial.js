/* =========================================================
   AERIAL PHOTOGRAPHY PAGE (/aerial-photography) — words and lists
   Prices: the "aerial" service and packages in lib/site.js.
   ========================================================= */

import { priceFrom } from "@/lib/site";

/* ---- Height slider: what each height shows ----
   zoom/target drive the drawing (lib/isoHouse.js). */
export const AE_HEIGHTS = [
  { alt: 5, zoom: 2.5, tgt: { x: 5, y: 10, z: 1.5 }, t: "The front, from just above the hedge", d: "Higher than someone on the pavement, so the walls look straight and the front garden shows. Great for terraces and townhouses." },
  { alt: 15, zoom: 1.5, tgt: { x: 7, y: 5, z: 2 }, t: "The hero shot", d: "The whole house and garden at a three-quarter angle. It's usually the first photo on the listing." },
  { alt: 30, zoom: 0.95, tgt: { x: 7, y: 4, z: 0 }, t: "The plot and boundaries", d: "Where the garden ends, what's over the fence and where you park. The plot gets outlined from about here." },
  { alt: 60, zoom: 0.55, tgt: { x: 5, y: 8, z: 0 }, t: "The street", d: "The neighbouring houses, the road and the park opposite. Buyers see what the area is like before they visit." },
  { alt: 120, zoom: 0.33, tgt: { x: 3, y: 10, z: 0 }, t: "The neighbourhood, at the legal limit", d: "120 m is the highest a drone can normally fly in the UK. Green space, the street pattern and how the house sits in the area." },
];

/* ---- Annotation layers for the hero aerial ---- */
export const AE_LAYERS = [
  { id: "plot", name: "Plot outline", d: "The garden and plot edged in colour, drawn from the plan you send." },
  { id: "garden", name: "Garden facing", d: "Which way the garden faces, with a north arrow." },
  { id: "parking", name: "Parking", d: "Driveway, garage and on-street parking." },
  { id: "nearby", name: "What's nearby", d: "The park, the bus stop and the route to the shops." },
];

/* ---- The standard aerial shot list (sideways rail) ---- */
export const AE_SHOTS = [
  { t: "Hero three-quarter", d: "The house and garden together. Photo one.", scene: { cam: { x: 7, y: 5, z: 2, zoom: 1.35 }, boundary: true } },
  { t: "Front, low", d: "From just above the hedge, walls straight.", scene: { cam: { x: 5, y: 9, z: 2.2, zoom: 2.3 } } },
  { t: "Rear garden", d: "The size and shape of the garden.", scene: { cam: { x: 6, y: -1, z: 0, zoom: 1.6 } } },
  { t: "Roof and chimney", d: "Condition at a glance, for buyers and surveyors.", scene: { cam: { x: 7.5, y: 4, z: 7, zoom: 2.6 } } },
  { t: "Plot outlined", d: "Edged in colour so the boundary is clear.", scene: { cam: { x: 7, y: 4, z: 0, zoom: 0.95 }, boundary: true, context: true } },
  { t: "The street", d: "Neighbours, the road and the park.", scene: { cam: { x: 5, y: 8, z: 0, zoom: 0.55 }, context: true } },
  { t: "The neighbourhood", d: "How the house sits in the area.", scene: { cam: { x: 3, y: 10, z: 0, zoom: 0.33 }, context: true } },
  { t: "Golden hour", d: "Low, warm light on the front. Add-on.", scene: { cam: { x: 7, y: 5, z: 2, zoom: 1.35 }, warm: true } },
];

/* ---- Video moves ---- */
export const AE_CLIPS = [
  { t: "Orbit", d: "A slow circle round the house." },
  { t: "Reveal", d: "Rising over the hedge to show the house." },
  { t: "Fly-over", d: "Front to back over the roof to the garden." },
  { t: "Pull-back", d: "Rising and backing away to show the area." },
];

/* ---- Flying by the rules ---- */
export const AE_RULES = [
  { t: "120 m maximum", d: "The highest a drone can normally fly in the UK. Most property shots are taken between 5 and 60 m." },
  { t: "Registered and insured", d: "CAA Flyer ID and Operator ID held, with public liability insurance on every flight." },
  { t: "Airspace checked", d: "Airports, restricted zones and temporary restrictions checked for every address, when quoting and again on the day." },
  { t: "Small and quiet", d: "The Mini 4 Pro weighs under 250 g, so it can work near homes within the rules, without much noise." },
  { t: "Neighbours respected", d: "Shots are framed on your property. Anything private that ends up in frame is cropped or blurred." },
  { t: "Weather limits", d: "No flying in rain, strong wind or poor light. If the day's wrong, the shoot moves." },
];

/* ---- FAQ ---- */
export const AE_FAQ = [
  { q: "Do I need to be home?", a: "Not for aerial-only shoots, as long as I have your permission to take off from the property or a safe spot nearby." },
  { q: "Is it legal to fly over my house?", a: "In most places, yes. I check airspace and restrictions for every address before quoting, and fly within the UK drone rules." },
  { q: "How high do you go?", a: "Usually 5 to 60 metres for the house and garden, and up to 120 metres, the legal limit, for the wider area if it helps the listing." },
  { q: "Is the plot outline exact?", a: "No. It's drawn by eye from the photo and the plan you send, as a guide for buyers. It isn't a legal boundary or a survey." },
  { q: "Will the neighbours be in the photos?", a: "Neighbouring houses show in the wider shots, because that's the street. Gardens and windows aren't the subject, and anything private is cropped or blurred." },
  { q: "Can I get aerials without the rest?", a: `Yes. Aerial only is for agents and sellers who already have interior photos, from ${priceFrom("aerial")}.` },
  { q: "Do you film video too?", a: "Every aerial-only shoot includes a short clip. Showcase and Signature mix aerial shots into the walkthrough video." },
  { q: "What about land and big plots?", a: "Pick land or estate when you book. Bigger sites get more shots, the boundary outlined and context from higher up." },
];
