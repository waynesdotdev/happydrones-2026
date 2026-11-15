/* Sends an enquiry from the contact form or the mission planner.

   1. Web3Forms emails it to you (the address your access key was made with).
      Set SITE.formKey in lib/site.js. Leave it "" to switch email off.
   2. The website saves it too (/api/enquiry): it appears in the admin's
      Enquiries tab and the customer gets a confirmation with a private link.

   The enquiry counts as sent if either one works, so a hiccup at one
   service never loses a customer. */
import { SITE } from "./site";

// Nicer names for the email. Anything not listed is shown as-is.
export const LABELS = {
  role: "I am a", name: "Name", company: "Company", email: "Email", phone: "Phone",
  postcode: "Postcode", date: "Preferred date", message: "Message",
  "quote-summary": "Quote", "quote-total": "Quote total",
  code: "Mission code", mission: "Mission", scale: "Scale", freq: "How often",
  extras: "Extras", plan: "Plan", total: "Guide price", notes: "Notes",
  agency: "Agency", branches: "Branches", "invoice-email": "Send invoices to", "purchase-orders": "Purchase order numbers",
  volume: "Listings a month", "shoot-day": "Preferred shoot day", branding: "Branding", agreed: "Terms",
  service: "Service", rating: "Score out of 5", good: "What went well", better: "What could be better", quote: "Can I quote them?",
  time: "Preferred time", weather: "Weather when they checked",
  area: "Area", map: "Job page: map and weather (tap to open)",
};
export const SKIP = new Set(["form-name", "bot-field", "subject", "service-id"]);

async function toWeb3Forms(fields) {
  const body = {
    access_key: SITE.formKey,
    subject: fields.subject || "New website enquiry",
    from_name: `${SITE.name} website`,
    botcheck: false,
  };
  if (fields.email) body.replyto = fields.email; // hitting Reply goes to the customer
  for (const [k, v] of Object.entries(fields)) {
    if (SKIP.has(k) || v === undefined || v === null || String(v).trim() === "") continue;
    body[LABELS[k] || k] = String(v);
  }
  const res = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.success === false) throw new Error(json.message || String(res.status));
}

// 1. Saved in the website's own database (shown in the admin, customer gets a
//    confirmation email with a link to their request). Runs on Cloudflare.
async function toWebsite(fields) {
  const res = await fetch("/api/enquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(fields) });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.ref) throw new Error(json.message || String(res.status));
  return json.ref;
}

// fields: a plain object, e.g. { "form-name": "quote", name: "…", email: "…" }
// Returns the enquiry reference (e.g. "Q-4F2A91") when the website saved it.
export async function sendEnquiry(fields) {
  if (fields["bot-field"]) return ""; // a spam bot filled the hidden field: quietly ignore
  const jobs = [toWebsite(fields)];
  if (SITE.formKey) jobs.push(toWeb3Forms(fields)); // 2. Web3Forms: backup email to Wayne (Wayne, 15 Nov 2026: keep for now)
  const results = await Promise.allSettled(jobs);
  if (!results.some((r) => r.status === "fulfilled")) throw new Error("Enquiry not sent");
  return results[0].status === "fulfilled" ? results[0].value : "";
}
