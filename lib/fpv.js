/* =========================================================
   FPV FLY-THROUGH PAGE (/fpv-fly-through) — words and lists
   Prices: the "fpv" service, the "fpvadd" extra and Signature, in lib/site.js.
   ========================================================= */

/* ---- The route, segment by segment (drives the scroll section) ----
   at: how far along the flight path (0–1) the segment starts.
   scene: what the first-person view shows. alt: rough height in metres. */
export const FPV_ROUTE = "M290 505 L290 430 L290 360 C290 330 250 335 210 335 L170 335 C140 335 140 300 165 262 L190 210 C210 185 260 180 320 180 L360 175 C375 170 375 140 372 118 L370 40";
export const FPV_SEGMENTS = [
  { at: 0, scene: "house", origin: "50% 72%", alt: "1.5", t: "Up the drive", d: "The take starts outside, low and steady, lining up with the front door so the first second already feels like arriving." },
  { at: 0.06, scene: "door", origin: "50% 76%", alt: "1.2", t: "Through the front door", d: "Straight through the middle of the doorway. The door is wedged fully open and the route has been flown slowly first." },
  { at: 0.16, scene: "living", origin: "88% 62%", alt: "1.2", t: "Down the hall and into the living room", d: "A smooth turn into the main room, at about chest height, so it feels like walking in, only smoother." },
  { at: 0.5, scene: "kitchen", origin: "50% 45%", alt: "1.3", t: "Through to the kitchen", d: "Across the room and past the island. Kitchens are where buyers slow down, so the drone does too." },
  { at: 0.8, scene: "garden", origin: "50% 38%", alt: "1.5", t: "Out through the garden doors", d: "Doors open fully, straight through the gap and out into the garden without a cut." },
  { at: 0.9, scene: "aerial", origin: "50% 50%", alt: "15", t: "Up over the garden", d: "The drone climbs over the garden to finish on the house, the plot and the street. One take, start to finish." },
];

/* ---- Floor plan rooms (viewBox 0 0 600 520) ---- */
export const FPV_ROOMS = [
  [80, 120, 440, 140, "Kitchen-diner"],
  [80, 260, 170, 160, "Living room"],
  [250, 260, 80, 160, "Hall"],
  [330, 260, 190, 50, "Stairs"],
  [330, 310, 190, 110, "Snug"],
];

/* ---- Hazards you plan out before flying (tap to find) ---- */
export const FPV_HAZARDS = [
  { id: "fan", x: 165, y: 330, t: "Ceiling fan", d: "Switched off and fully stopped before the first rehearsal." },
  { id: "door", x: 290, y: 300, t: "Hall door", d: "Wedged fully open so nothing can swing shut mid-flight." },
  { id: "throw", x: 215, y: 395, t: "Loose throws and cables", d: "Tidied away so nothing can be pulled up by the downdraught." },
  { id: "mirror", x: 95, y: 175, t: "Big mirror", d: "The route is angled so the drone doesn't fly past its own reflection." },
  { id: "people", x: 300, y: 205, t: "People", d: "Anyone in shot is briefed and has a set spot. Everyone else stays behind the drone." },
  { id: "glass", x: 410, y: 125, t: "Glass doors", d: "Opened fully. Closed glass is almost invisible on a camera feed, so it's never in the path." },
  { id: "pet", x: 470, y: 365, t: "The dog", d: "Shut in a room off the route, or out for a walk with someone." },
];

/* ---- How a fly-through is made ---- */
export const FPV_PROCESS = [
  { tag: "BEFORE", t: "Plan the route", d: "From photos or a floor plan: which rooms, in what order, and the best way in and out." },
  { tag: "ON SITE", t: "Walk it, then fly it slowly", d: "I walk the route, clear the hazards and fly a slow rehearsal before any filming." },
  { tag: "THE TAKE", t: "Several clean runs", d: "The route is flown a few times and the best single take is kept. No cuts, no joins." },
  { tag: "+3–5 DAYS", t: "Graded and cut", d: "Colour graded, set to music, with a vertical version for social media." },
];

/* ---- Which tour suits which home ---- */
export const FPV_WHICH = [
  { t: "Walkthrough video", kit: "Pocket 3", d: "Room by room at walking height, cut together with captions. Clear and calm, and suits every home.", best: "Most listings and every portal", href: "/walkthrough-video/" },
  { t: "Pocket 3 FPV-mode glide", kit: "Pocket 3", d: "A smooth one-take glide filmed by hand. It looks like a fly-through, at walking height.", best: "Flats, terraces and tight spaces", href: "/estate-agents/#tours" },
  { t: "FPV fly-through", kit: "Avata 2", d: "A one-take flight in the front door, through the rooms and out over the garden.", best: "Detached homes, new builds, venues", here: true },
];

/* ---- Where it works ---- */
export const FPV_WHERE = [
  { t: "Bigger homes", d: "Open-plan ground floors and gardens, where the flow from room to room is the selling point." },
  { t: "Showhomes and new builds", d: "One take through the showhome, then up over the development." },
  { t: "Bars and restaurants", d: "From the street, through the door and past the bar while it's set for service." },
  { t: "Gyms and studios", d: "Through a busy class or along the rack, with everyone briefed." },
  { t: "Hotels and venues", d: "Reception to the best room, or the drive to the function suite." },
  { t: "Shops and showrooms", d: "The window, the door and every aisle in one go." },
];

/* ---- FAQ ---- */
export const FPV_FAQ = [
  { q: "Is it safe to fly indoors?", a: "The Avata 2 has guards built round its propellers, the route is walked and flown slowly first, and people are kept clear of the path unless they're part of the shot." },
  { q: "How big is the drone?", a: "About 21 cm across, smaller than a dinner plate, so it fits through normal doorways with room to spare." },
  { q: "Is it noisy?", a: "It's a noticeable hum while it's flying, which is why the finished video is set to music. Takes are short, so the noise doesn't last long." },
  { q: "How long is the finished video?", a: "45–90 seconds in one take, plus a vertical cut for social media. Delivered in 3–5 days." },
  { q: "How long are you on site?", a: "About 90 minutes: walking the route, clearing hazards, rehearsing and filming several takes." },
  { q: "Can people be in it?", a: "Yes, and it often looks better with a few. Anyone in shot is briefed and has a set place to be." },
  { q: "My home is small. Does it still work?", a: "Narrow halls and small rooms suit the Pocket 3 FPV-mode glide better. It gives a similar look at walking height, more safely." },
  { q: "Can you add it to a package?", a: "Yes. It's included in Signature and can be added to Essentials or Showcase, or booked on its own." },
];
