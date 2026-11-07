/* =========================================================
   BRAND KIT — words and settings for happydrones.co.uk/media
   The logo files live in public/media/. The colours here should match
   the --navy, --orange etc. values at the top of app/globals.css.
   ========================================================= */
import { SITE } from "./site";

/* ---- Logo versions ----
   file = name in public/media (without .svg/.png). bg = the background it's shown on. */
export const BRAND_LOGOS = [
  { id: "colour", file: "happy-drones-logo", t: "Full colour", d: "The main logo. Use it on white or light backgrounds.", bg: "#FFFFFF", ink: ["#003366", "#FF6B35"] },
  { id: "reversed", file: "happy-drones-logo-reversed", t: "Reversed", d: "White letters, orange drone. For navy, dark or photo backgrounds.", bg: "#003366", ink: ["#FFFFFF", "#FF6B35"] },
  { id: "navy", file: "happy-drones-logo-navy", t: "One colour, navy", d: "For one-colour printing on light backgrounds.", bg: "#EAF1F8", ink: ["#003366"] },
  { id: "white", file: "happy-drones-logo-white", t: "One colour, white", d: "For one-colour use on dark or orange backgrounds.", bg: "#FF6B35", ink: ["#FFFFFF"] },
  { id: "black", file: "happy-drones-logo-black", t: "One colour, black", d: "Only when colour isn't possible, such as newsprint or engraving.", bg: "#FFFFFF", ink: ["#000000"] },
];

export const BRAND_ICONS = [
  { id: "icon", file: "happy-drones-icon", t: "Drone mark", d: "The drone on its own, for small spaces once people know the name.", bg: "#FFFFFF" },
  { id: "icon-white", file: "happy-drones-icon-white", t: "Drone mark, white", d: "For dark or photo backgrounds.", bg: "#001A33" },
  { id: "icon-navy", file: "happy-drones-icon-navy", t: "Drone mark, navy", d: "One colour, on light backgrounds.", bg: "#EAF1F8" },
  { id: "avatar", file: "happy-drones-avatar", t: "Profile picture", d: "Square, 1080 × 1080, for social media and directories.", bg: "#003366", pngOnly: false },
];

/* ---- Colours ---- */
export const BRAND_COLOURS = [
  { id: "navy", name: "Happy Drones Navy", hex: "#003366", use: "The main colour. Headings, the letters of the logo, dark sections." },
  { id: "orange", name: "Drone Orange", hex: "#FF6B35", use: "The accent. The drone mark, buttons and highlights. Not for small text on white." },
  { id: "orange-deep", name: "Deep Orange", hex: "#D9531F", use: "Orange for text and links on white, where Drone Orange is too light to read." },
  { id: "night", name: "Night Navy", hex: "#001A33", use: "Dark backgrounds, footers and video end cards." },
  { id: "slate", name: "Slate", hex: "#46617E", use: "Secondary text, captions and small print." },
  { id: "mist", name: "Mist", hex: "#EAF1F8", use: "Light backgrounds and alternate sections." },
  { id: "white", name: "White", hex: "#FFFFFF", use: "Backgrounds and text on navy." },
];

/* ---- Type ---- */
export const BRAND_FONTS = [
  { id: "blinker", name: "Blinker", role: "Headings, numbers and labels", weights: [["600", "SemiBold"], ["700", "Bold"], ["800", "ExtraBold"]], family: "var(--font-display)", link: "https://fonts.google.com/specimen/Blinker", sample: "Every angle. One visit.", fallback: "Trebuchet MS, then the system sans-serif" },
  { id: "lato", name: "Lato", role: "Body text, forms and long reading", weights: [["400", "Regular"], ["700", "Bold"]], family: "var(--font-body)", link: "https://fonts.google.com/specimen/Lato", sample: "Photos, aerials and walkthrough video from a single visit, back in 48–72 hours.", fallback: "Segoe UI, Roboto or the system sans-serif" },
];

/* ---- About text, ready to copy ---- */
export const BRAND_ABOUT = [
  { id: "line", t: "One line", text: `${SITE.name} is a CAA-registered drone photography business covering ${SITE.areaServed}, for property, roof inspections and construction progress.` },
  { id: "short", t: "Short (about 50 words)", text: `${SITE.name} provides drone and ground photography and video across ${SITE.areaServed}. Run by pilot Wayne Fox, it shoots property photos, aerials and walkthrough video in a single visit, close-up roof inspections without ladders, and month-by-month records of building sites and empty buildings. CAA registered and insured for ${SITE.insurance.publicLiability}.` },
  { id: "long", t: "Long (about 100 words)", text: `${SITE.name} provides drone and ground photography and video for estate agents, homeowners, roofers, developers and property managers across ${SITE.areaServed}. Run by pilot Wayne Fox, it shoots listing photos, aerials and walkthrough video in a single visit, close-up roof inspections without ladders or scaffolding, and month-by-month records of building sites and empty buildings from the same positions every visit. Every flight is planned with airspace and permission checks and a risk assessment. ${SITE.name} is CAA registered, holds an A2 Certificate of Competence and carries ${SITE.insurance.publicLiability} public liability insurance. Prices are published openly at happydrones.co.uk.` },
];

/* ---- Key facts ---- */
export const BRAND_FACTS = [
  ["Name", `${SITE.name} (two words, capital H and D)`],
  ["Run by", "Wayne Fox, drone pilot and photographer"],
  ["Area", SITE.areaServed],
  ["Services", "Property photography, aerial photography, walkthrough video, roof inspections, construction progress, vacant property monitoring"],
  ["Credentials", `CAA Operator ID and Flyer ID, A2 Certificate of Competence, ${SITE.insurance.publicLiability} public liability insurance, ICO registered`],
  ["Kit", "DJI Mini 4 Pro, DJI Neo 2, DJI Osmo Pocket 3"],
  ["Website", "happydrones.co.uk"],
];

/* ---- Logo rules ---- */
export const BRAND_DONTS = [
  { id: "stretch", t: "Don't stretch or squash it" },
  { id: "rotate", t: "Don't tilt or rotate it" },
  { id: "recolour", t: "Don't change its colours" },
  { id: "effects", t: "Don't add shadows, outlines or glows" },
  { id: "busy", t: "Don't put the colour logo on orange or busy photos" },
  { id: "crowd", t: "Don't crowd it with other words or logos" },
];

export const BRAND_KIT_ZIP = "/media/happy-drones-brand-kit.zip";
export const BRAND_GUIDE_PDF = "/media/happy-drones-brand-guide.pdf";

/* ---- Colour helpers (contrast and print values) ---- */
const rgbOf = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
export const rgbText = (hex) => rgbOf(hex).join(", ");
export function cmykText(hex) {
  const [r, g, b] = rgbOf(hex).map((v) => v / 255);
  const k = 1 - Math.max(r, g, b);
  if (k >= 1) return "0, 0, 0, 100";
  return [r, g, b].map((v) => Math.round(((1 - v - k) / (1 - k)) * 100)).concat(Math.round(k * 100)).join(", ");
}
const lum = (hex) => {
  const [r, g, b] = rgbOf(hex).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
export function contrast(a, b) {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}
