/* =========================================================
   PROPERTY PHOTOGRAPHY PAGE (/property-photography) — words and lists
   Prices and photo counts come from PRICING, PACKAGES and PACKAGE_ROWS in
   lib/site.js, so this page always matches the packages.
   ========================================================= */

/* ---- The shoot, room by room (drives the scroll section) ----
   scene: what the big picture shows. cam: camera on the floor plan
   [x, y, angle in degrees, plan] where plan is "g" (ground) or "f" (first) or "out". */
export const PP_SHOTS = [
  { at: 0, scene: { kind: "house", t: 0.05 }, cam: [130, 196, -90, "out"], tag: "PHOTO 01 · THE FRONT",
    t: "The front: your first photo", d: "Shot from the pavement corner so buyers see the front and one side, with the walls dead straight. On Rightmove this is usually the photo that gets the click.", tips: ["Cars off the drive", "Bins out of sight", "Curtains open, upstairs too"] },
  { at: 0.15, scene: { kind: "room", room: "living" }, cam: [18, 112, -40, "g"], tag: "PHOTO 04 · LIVING ROOM",
    t: "Living room, from the corner", d: "From the corner by the door at about chest height, so the room looks the size it really is. The window is blended, so the room is bright and you can still see the garden.", tips: ["Every light on", "Cushions straight", "Remotes and chargers away"] },
  { at: 0.3, scene: { kind: "room", room: "kitchen" }, cam: [196, 112, -135, "g"], tag: "PHOTO 07 · KITCHEN",
    t: "Kitchen, across the worktops", d: "Shot so the worktops lead your eye into the room. Kitchens sell houses, so they usually get two or three angles.", tips: ["Worktops cleared", "Tea towels and bins away", "Pendant lights on"] },
  { at: 0.45, scene: { kind: "room", room: "bedroom" }, cam: [236, 112, -50, "f"], tag: "PHOTO 12 · MAIN BEDROOM",
    t: "Main bedroom, bed square on", d: "From the doorway, with the bed square to the camera and both bedside lamps on. It's the shot buyers picture themselves in.", tips: ["Bed made, pillows plumped", "Clothes put away", "Bedside tables cleared"] },
  { at: 0.6, scene: { kind: "room", room: "bath" }, cam: [296, 112, -125, "f"], tag: "PHOTO 15 · BATHROOM",
    t: "Bathroom, one clean angle", d: "Usually one well-chosen angle from the doorway, kept straight, with the mirror placed so the camera isn't in it.", tips: ["Toilet seat down", "Bottles off the bath edge", "Fresh towels out"] },
  { at: 0.74, scene: { kind: "aerial" }, cam: [130, 20, 90, "out"], tag: "AERIAL 03 · THE PLOT",
    t: "The garden and plot, from the air", d: "Drone shots show what ground-level photos can't: the size of the garden, what's behind the fence, the parking and the street.", tips: ["Garden tidied and mowed", "Toys and washing in", "Garage door shut"] },
  { at: 0.88, scene: { kind: "house", t: 1 }, cam: [130, 196, -90, "out"], tag: "DUSK 01 · BLUE HOUR",
    t: "The dusk shot", d: "Taken in the 20 minutes or so after sunset, with every light on inside. It's the photo that stops people scrolling. Included in Signature, or added to any package.", tips: ["Every light on, every room", "Curtains open", "Garden lights on"] },
];

/* ---- Floor plan for the scroll section's inset (viewBox 0 0 420 210) ---- */
export const PP_PLAN = {
  g: [[10, 30, 110, 90, "Living"], [120, 30, 90, 90, "Kitchen"], [10, 120, 70, 50, "WC"], [80, 120, 130, 50, "Hall"]],
  f: [[220, 30, 100, 90, "Bed 1"], [320, 30, 90, 90, "Bed 2"], [220, 120, 70, 50, "Bath"], [290, 120, 120, 50, "Bed 3"]],
};

/* ---- Prep checklist (the room you tidy) ---- */
export const PP_PREP = [
  { id: "lights", t: "Every light on", d: "Even in daylight. Warm light makes rooms feel lived-in, not dark." },
  { id: "curtains", t: "Curtains and blinds open", d: "Daylight in, and buyers can see the view." },
  { id: "surfaces", t: "Surfaces cleared", d: "Mugs, post, remotes and chargers out of sight." },
  { id: "cushions", t: "Cushions and throws straight", d: "Two minutes that make a room look looked-after." },
  { id: "toys", t: "Toys and pet beds away", d: "Buyers want to picture their life, not yours." },
  { id: "laundry", t: "Laundry and bins hidden", d: "Airers, baskets and bins in a cupboard or the car." },
];
export const PP_PREP_MORE = [
  { where: "Kitchen", items: ["Worktops cleared except one or two nice things", "Fridge door cleared", "Tea towels and bins away"] },
  { where: "Bathroom", items: ["Toilet seat down", "Bottles off the bath and shower", "Fresh towels, folded"] },
  { where: "Bedrooms", items: ["Beds made, pillows plumped", "Nothing on the floor", "Bedside tables cleared"] },
  { where: "Outside", items: ["Cars off the drive if you can", "Bins out of sight", "Lawn mowed, toys and washing in"] },
];

/* ---- What gets edited, and what never does ---- */
export const PP_EDIT = {
  fix: [
    "Brightness and colour, so white walls look white",
    "Windows blended, so you can see out of them",
    "Walls and door frames straightened",
    "Lens distortion corrected",
    "TV screens, family photos and number plates blurred or darkened",
    "Small things like a stray cable or a mark on the lens",
  ],
  never: [
    "Removing anything that's part of the house: cracks, damp, wires, pylons or masts",
    "Changing the size or shape of a room",
    "Adding furniture or features that aren't there",
    "Hiding anything a buyer would want to know about",
  ],
};

/* ---- How a shoot runs ---- */
export const PP_PROCESS = [
  { tag: "BOOKING", t: "Book a slot", d: "Pick a package online or send the address on WhatsApp. Agents can send the vendor's details and I'll arrange access." },
  { tag: "DAY BEFORE", t: "Prep guide sent", d: "A one-page checklist so the house is ready: lights, curtains, surfaces, cars and bins." },
  { tag: "ON THE DAY", t: "About an hour", d: "Exteriors first while the light is good, then every room, then the drone. You don't have to stay in the room." },
  { tag: "+48–72 H", t: "Edited and delivered", d: "A download link with portal-sized photos and full-size versions for brochures." },
];

/* ---- Who it's for ---- */
export const PP_WHO = [
  { t: "Selling your home", d: "The same photos agents pay for, booked direct. Hand them to your agent or use them on an online agent listing." },
  { t: "Estate agents", d: "Photos, aerials and video in one visit, with monthly invoicing and agent pricing.", link: { href: "/estate-agents/", text: "See the agent offer" } },
  { t: "Landlords and letting agents", d: "Photos that let rooms faster, shot around tenants with personal things kept out of frame." },
  { t: "Holiday lets", d: "Bright, inviting photos for Airbnb, Booking.com and your own site, plus aerials of the setting." },
];

/* ---- FAQ ---- */
export const PP_FAQ = [
  { q: "How many photos will I get?", a: "Essentials gives 20–25 edited photos, Showcase 30–35 and Signature 35–40, all plus aerial photos. Bigger homes can add 10 extra photos." },
  { q: "How should I get the house ready?", a: "Lights on, curtains open, surfaces cleared, cars off the drive and bins away. I send a short checklist when you book." },
  { q: "How long does it take?", a: "About an hour for Essentials in a typical house, two hours for Showcase and half a day for Signature." },
  { q: "Do I have to be in?", a: "Someone needs to let me in. You can stay, but you don't need to follow me round. Agents usually arrange access with the vendor." },
  { q: "Can you photograph a tenanted property?", a: "Yes. I work around tenants and keep personal photos, post and anything private out of the shots." },
  { q: "What if it's raining?", a: "Interiors can be shot in any weather. If the rain spoils the outside or the aerials, we'll agree what to do before I leave." },
  { q: "Do you edit the photos?", a: "Yes, every one: brightness, colour, straight walls and blended windows. I never remove or hide anything that's part of the house." },
  { q: "What sizes do I get?", a: "Photos sized for Rightmove, Zoopla and OnTheMarket, plus full-size versions for brochures and window cards." },
];
