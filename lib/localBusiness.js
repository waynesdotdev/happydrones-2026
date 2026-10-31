/* =========================================================
   LOCAL BUSINESS CONTENT PAGE (/local-business) — words and lists
   Prices come from the mission planner ("business") in lib/site.js.
   ========================================================= */
import { PLANNER, missionBase } from "@/lib/site";

/* ---- Kinds of business (drawings + shot lists) ---- */
export const LB_TYPES = [
  { id: "cafe", name: "Café or restaurant", sign: "THE CORNER CAFÉ", color: "#2F5D50", awning: "#2F5D50", wall: "#E8DCC8", door: "#2F5D50", accent: "#E07A4F",
    shots: ["Drone reveal of the street and terrace", "Coffee being poured, up close", "The kitchen at full pelt", "One-take glide from the door to the counter", "Dishes from directly above", "The owner on why they opened"],
    hero: "Door to counter in one take", tip: "Film before opening, when the light is good and the tables are set." },
  { id: "gym", name: "Gym or studio", sign: "IRONWORKS GYM", color: "#1E2430", awning: "#FF6B35", wall: "#C9CED6", door: "#1E2430", accent: "#FF6B35",
    shots: ["A class in full swing", "One-take glide from reception to the studio", "Equipment, chalk and detail shots", "Coach intro, followed by the Neo 2", "The building and car park from the air", "Members' transformations (with consent)"],
    hero: "Glide-through during a busy class", tip: "Book it around a popular class, so the room is full of energy." },
  { id: "salon", name: "Salon or barber", sign: "FADE & CO", color: "#3A2E5A", awning: "#3A2E5A", wall: "#EDE6DA", door: "#3A2E5A", accent: "#C46A9C",
    shots: ["A cut from start to finish, sped up", "The chair, the tools, the details", "Before and after, side by side", "Meet the team", "The shop front and the street"],
    hero: "A full cut in 15 seconds", tip: "Line up a regular client who's happy to be filmed." },
  { id: "trades", kind: "unit", name: "Trades business", sign: "NORTHSIDE BUILD", color: "#E07A4F", awning: "#E07A4F", wall: "#C9D3E0", door: "#2F3747", accent: "#E07A4F",
    shots: ["The van and the team arriving", "A finished job from the air", "Before and after on the same job", "The work up close", "The yard or workshop", "The boss on what makes you different"],
    hero: "Finished job, from the air", tip: "Pick a recent job you're proud of. The customer usually loves being asked." },
  { id: "shop", name: "Independent shop", sign: "FIELD & FOUND", color: "#7A5638", awning: "#B8643C", wall: "#E3D9C6", door: "#7A5638", accent: "#B8643C",
    shots: ["The window display", "New stock, unboxed", "Hands wrapping an order", "The owner's favourite things", "The high street from above"],
    hero: "The street, then through the door", tip: "Film just before a new range or a seasonal window goes in." },
  { id: "venue", name: "Pub, hotel or venue", sign: "THE OLD STATION", color: "#003366", awning: "#003366", wall: "#D6C7AE", door: "#003366", accent: "#FFC15E",
    shots: ["The building and grounds from the air", "One-take flight through the bar", "Golden-hour exterior", "Rooms or function suite", "Food and drink up close", "The team getting ready for service"],
    hero: "Golden hour from the air", tip: "Book late afternoon so the outside gets the golden light." },
];

/* ---- One morning, content for a month (drives the scroll section) ----
   Each stage adds tiles to the content calendar: p = photo, c = vertical clip,
   f = website film, x = add-on. */
export const LB_STAGES = [
  { at: 0, time: "08:00", kit: "mini4", t: "Outside, from the air", d: "The street, the frontage and the sign from the drone, plus a slow reveal clip. It sets the scene for everything else.", add: [["p", "Street from above"], ["p", "The frontage"], ["p", "The sign"], ["c", "Drone reveal"]] },
  { at: 0.18, time: "08:25", kit: "pocket3", t: "Through the door in one take", d: "A smooth one-take glide on the Pocket 3, from the street, through the door and round the room. The clip people share most.", add: [["c", "Walk-in glide"]] },
  { at: 0.34, time: "08:40", kit: "neo2", t: "The team", d: "Walk-and-talk clips with the Neo 2 following, plus portraits for your website and profile.", add: [["c", "Team walk-and-talk"], ["p", "Team portrait"], ["p", "Owner portrait"], ["p", "At work"]] },
  { at: 0.5, time: "09:05", kit: "pocket3", t: "The work, up close", d: "Hands, products, tools and details on the gimbal camera. These become your everyday posts.", add: [["c", "Work in action"], ["p", "Detail"], ["p", "Detail"], ["p", "Product"], ["p", "Product"], ["p", "Close-up"]] },
  { at: 0.66, time: "09:30", kit: "pocket3", t: "The space and the feel", d: "Wide shots of the inside, the atmosphere and the little things that make it yours.", add: [["c", "Atmosphere"], ["p", "Inside, wide"], ["p", "Inside, wide"], ["p", "Seating"], ["p", "Little things"]] },
  { at: 0.82, time: "10:00", kit: null, t: "Edited into a month of posts", d: "Back at the desk: clips cut for Reels, TikTok and Shorts, a 60-second film for your website, and every photo edited.", add: [["f", "Website film"]] },
];
export const LB_KIT_NAMES = { mini4: "DJI Mini 4 Pro", neo2: "DJI Neo 2", pocket3: "DJI Osmo Pocket 3" };

/* ---- Formats ---- */
export const LB_FORMATS = [
  { id: "9x16", name: "9:16", where: "Reels, TikTok, Shorts, Stories", w: 9, h: 16 },
  { id: "4x5", name: "4:5", where: "Instagram and Facebook feed", w: 4, h: 5 },
  { id: "1x1", name: "1:1", where: "Feeds, ads and your map listing", w: 1, h: 1 },
  { id: "16x9", name: "16:9", where: "Your website, YouTube and X", w: 16, h: 9 },
];

/* ---- Guide prices: per visit, by size and how often ---- */
const SIZE_NOTES = { small: "One shop, café, salon or studio", medium: "A bigger venue, or two sites", large: "A hotel, a large venue or several sites" };
export const LB_PIECES = 20; // roughly: 15+ photos, 3–5 clips and a website film
export function businessPrices() {
  const m = PLANNER.missions.find((x) => x.id === "business");
  if (!m) return null;
  const freqs = PLANNER.frequency;
  return {
    base: m.base, freqs,
    sizes: PLANNER.scale.map((sc) => ({ id: sc.id, name: sc.name, note: SIZE_NOTES[sc.id] || sc.note, perVisit: missionBase(m.base, sc.mult) })),
    price: (sizeId, freqId) => {
      const sc = PLANNER.scale.find((x) => x.id === sizeId); const fr = freqs.find((x) => x.id === freqId);
      const per = missionBase(m.base, sc.mult); const gross = per * fr.visits; const total = gross - Math.round(gross * fr.disc);
      return { per: Math.round(total / fr.visits), total, visits: fr.visits, disc: fr.disc };
    },
  };
}

/* ---- How it runs ---- */
export const LB_PROCESS = [
  { tag: "WEEK BEFORE", t: "A ten-minute call", d: "What you sell, who you sell to and what's coming up. I put together a shot list and send it over." },
  { tag: "SHOOT DAY", t: "One to two hours", d: "Usually before opening or in a quiet spell, so customers aren't in the way and business carries on." },
  { tag: "+5 WORKING DAYS", t: "A month of content", d: "Clips, a website film and edited photos by download link, sized for every platform." },
  { tag: "EVERY QUARTER OR MONTH", t: "Fresh content, cheaper", d: "Book regular visits and each one costs less, so your feed never runs dry." },
];

/* ---- FAQ ---- */
export const LB_FAQ = [
  { q: "What do I get from one visit?", a: "3–5 vertical clips for Reels, TikTok and Shorts, a 60-second film for your website and 15+ edited photos for your map listing and socials. Around 20 pieces of content." },
  { q: "Will it disrupt my customers?", a: "No. I plan filming around your opening hours, usually before you open or in a quiet spell." },
  { q: "Do I have to be on camera?", a: "Only if you want to be. A short intro from the owner usually does well, but the work, the space and the team can carry it." },
  { q: "Can you fly a drone in a town centre?", a: "Often, yes, with planning. Busy streets, airports and restricted areas are checked first, and some shots are done from the ground instead. I'll tell you before the day what's possible." },
  { q: "Can you fly inside?", a: "Not at the moment. Inside, I film a smooth one-take glide on the Osmo Pocket 3 instead, which gives the same walk-through feel. It's planned around your space and filmed when it's quiet." },
  { q: "Do you post it for me?", a: "No. You get the files, edited and sized for each platform, ready for you to post when it suits you." },
  { q: "Can I use it for adverts?", a: "Yes, if we list it in your Job Details. Once you've paid, you get a business licence to promote your business in the ways agreed there, such as your socials, website and paid ads. I keep the copyright, as set out in the booking agreement." },
  { q: "How often should I book?", a: "Quarterly keeps a feed fresh for most businesses. Monthly suits cafés, gyms and venues with something new every few weeks. Repeat visits cost less each time." },
];
