/* Sends an enquiry from the contact form or the mission planner.

   1. Web3Forms emails it to you (the address your access key was made with).
      Set SITE.formKey in lib/site.js. Leave it "" to switch email off.
   2. Netlify Forms keeps a backup copy (Netlify > Forms). This is why
      public/__forms.html must stay.

   The enquiry counts as sent if either one works, so a hiccup at one
   service never loses a customer. */
import { SITE } from "./site";

// Nicer names for the email. Anything not listed is shown as-is.
const LABELS = {
  role: "I am a", name: "Name", company: "Company", email: "Email", phone: "Phone",
  postcode: "Postcode", date: "Preferred date", message: "Message",
  "quote-summary": "Quote", "quote-total": "Quote total",
  code: "Mission code", mission: "Mission", scale: "Scale", freq: "How often",
  extras: "Extras", plan: "Plan", total: "Guide price", notes: "Notes",
};
const SKIP = new Set(["form-name", "bot-field", "subject"]);

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

async function toNetlify(fields) {
  const res = await fetch("/__forms.html", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(fields).toString(),
  });
  if (!res.ok) throw new Error(String(res.status));
}

// fields: a plain object, e.g. { "form-name": "quote", name: "…", email: "…" }
export async function sendEnquiry(fields) {
  if (fields["bot-field"]) return; // a spam bot filled the hidden field: quietly ignore
  const jobs = [toNetlify(fields)];
  if (SITE.formKey) jobs.push(toWeb3Forms(fields));
  const results = await Promise.allSettled(jobs);
  if (!results.some((r) => r.status === "fulfilled")) throw new Error("Enquiry not sent");
}
