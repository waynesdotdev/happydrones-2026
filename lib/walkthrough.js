/* =========================================================
   WALKTHROUGH VIDEO PAGE (/walkthrough-video) — words and lists
   Packages, prices and branding come from lib/site.js.
   ========================================================= */

/* ---- The edit, clip by clip (drives the scroll-to-scrub section) ----
   A 75-second Showcase walkthrough. s0/s1: seconds. scene: what plays.
   move: the camera move. cap: the on-screen caption. */
export const WT_LENGTH = 75;
export const WT_CLIPS = [
  { s0: 0, s1: 7, scene: { kind: "aerial", from: 0.8, to: 1.7 }, move: "Aerial drift-in", cap: "14 Example Road", sub: "Three-bed semi · Example Town",
    t: "Open from the air", d: "The first five seconds decide whether people keep watching. The drone drifts in over the street to the front door, so buyers know where they are straight away." },
  { s0: 7, s1: 13, scene: { kind: "house" }, move: "Slow push-in", cap: "Front garden and driveway",
    t: "Up the path", d: "A steady walk up to the front door at the pace a buyer would take it." },
  { s0: 13, s1: 25, scene: { kind: "room", room: "living" }, move: "Glide across", cap: "Living room", sub: "Bay window · Wood floor",
    t: "The living room, gliding", d: "A slow sideways glide shows how big the room is and how the light comes in. The gimbal keeps it smooth, with no bounce from walking." },
  { s0: 25, s1: 39, scene: { kind: "room", room: "kitchen" }, move: "Push-in", cap: "Kitchen-diner", sub: "Island · Doors to the garden",
    t: "The kitchen gets the most time", d: "Kitchens sell houses, so they get the longest clip: a push in across the island toward the garden doors." },
  { s0: 39, s1: 51, scene: { kind: "room", room: "bedroom" }, move: "Reveal", cap: "Main bedroom", sub: "Double · Fitted wardrobes",
    t: "Upstairs, revealed", d: "Each bedroom opens with a reveal from the doorway, so buyers understand the layout: what's next to what." },
  { s0: 51, s1: 58, scene: { kind: "room", room: "bath" }, move: "Pan", cap: "Family bathroom",
    t: "A quick pan in the bathroom", d: "Short and simple. Bathrooms get a few seconds, not a tour." },
  { s0: 58, s1: 68, scene: { kind: "aerial", from: 1.6, to: 0.72 }, move: "Aerial pull-back", cap: "Garden and plot",
    t: "Out the back and up", d: "The drone rises over the garden to show the plot, the parking and the street. It's the closing image people remember." },
  { s0: 68, s1: 75, scene: { kind: "end" }, move: "End card", cap: "",
    t: "End card", d: "Address, agent details and how to book a viewing. Your branding, or none of mine at all." },
];

/* ---- Camera moves (the looping thumbnails) ---- */
export const WT_MOVES = [
  { id: "push", t: "Push-in", d: "Moving slowly toward the best feature. Pulls the viewer into the room.", scene: "kitchen" },
  { id: "glide", t: "Glide", d: "Sliding sideways across a room. Shows width without a jumpy pan.", scene: "living" },
  { id: "reveal", t: "Reveal", d: "From behind a door frame into the room. Shows how spaces connect.", scene: "bedroom" },
  { id: "pan", t: "Pan", d: "A steady turn from one side to the other. Used sparingly.", scene: "bath" },
  { id: "tilt", t: "Tilt up", d: "From the path up to the roofline. Gives the front of the house its scale.", scene: "house" },
  { id: "pull", t: "Aerial pull-back", d: "The drone rises and backs away to show the plot and the street.", scene: "aerial" },
];

/* ---- Formats ---- */
export const WT_FORMATS = [
  { id: "land", name: "Landscape 16:9", where: "Rightmove, Zoopla and OnTheMarket video tours, YouTube and your website", ratio: 16 / 9 },
  { id: "vert", name: "Vertical 9:16", where: "Instagram Reels, TikTok, YouTube Shorts and Facebook stories", ratio: 9 / 16 },
];

/* ---- How a walkthrough runs ---- */
export const WT_PROCESS = [
  { tag: "BOOKING", t: "Book Showcase or Signature", d: "The walkthrough comes with the photos and aerials, all in one visit. Agents can send the vendor's details and I'll arrange access." },
  { tag: "ON THE DAY", t: "Photos, then the walkthrough", d: "Once the photos are done and the house is ready, I film the route in one go, then fly the aerial opening and closing." },
  { tag: "EDITING", t: "Cut, graded, captioned", d: "Clips trimmed to the best moments, colour matched, licensed music and room captions added." },
  { tag: "+48–72 H", t: "Landscape and vertical", d: "A landscape version for the portals and your website, and a vertical cut for social media, by download link." },
];

/* ---- FAQ ---- */
export const WT_FAQ = [
  { q: "How long is the video?", a: "Showcase walkthroughs run 60–90 seconds and Signature 90–120 seconds. Long enough to show the layout, short enough that people watch to the end." },
  { q: "Can I buy a walkthrough on its own?", a: "It comes as part of Showcase or Signature, with the photos and aerials, so everything is shot in one visit and matches." },
  { q: "Can it go on Rightmove?", a: "Yes. You get the video file and a link you can add as the listing's video tour, plus a vertical version for social media." },
  { q: "Is there music?", a: "Yes, licensed music that's cleared for the portals and social media. Room captions mean it still works with the sound off." },
  { q: "Do I need to be in it?", a: "No. If you're an agent and want to be, add a 30-second intro to camera for £49. It doubles as social content for the agency." },
  { q: "Can my branding go on it?", a: "Yes. Agency branding on the intro and end card is included. Full white label, with Happy Drones nowhere, is priced by how many listings you book." },
  { q: "What's the difference from an FPV fly-through?", a: "A walkthrough is filmed at walking height on a gimbal and cut together room by room. An FPV fly-through is one unbroken flight on a small drone. Signature includes both." },
  { q: "Can you film a tenanted home?", a: "Yes. I work around tenants and keep personal photos, post and anything private out of shot." },
];
