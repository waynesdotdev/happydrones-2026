# Wayne's request (21 Nov 2026): tiered contract and clickwrap T&Cs

Status: parked by Wayne ("we can get to it later"). Claude's plan is at the bottom.

## The request (as Wayne sent it)

1. A versioned `/terms` page: version number and last-updated date at the top; sections on pilot-in-command safety override, weather and rescheduling, site access and landowner permission, scope and liability (visual media, not a structural survey; liability cap).
2. A mandatory, unticked clickwrap checkbox before Stripe Checkout ("I confirm I have authority/landowner permission for this flight location and agree to the Terms & Conditions"), the pay button disabled until ticked, and proof of acceptance in the Stripe Checkout Session metadata (`terms_accepted`, `terms_version`, `terms_accepted_at`, `landowner_permission_confirmed`).
3. On the business quote form: a choice of "One-off commercial project" or "Ongoing / repeat B2B partner (Master Services Agreement)", and a note that commercial work is confirmed by a quick e-signature agreement before flight.
4. Inspect first, say which files change before writing code, and keep to the site's styling.

## What the site already does (checked 21 Nov)

- `/terms` (`app/terms/page.js`) is the booking agreement, with a "Last updated" date. It already covers safety and weather (section 4), cancelling and moving (6), permissions, deliverables and copyright (8, 9) and liability (10).
- Bookings are stronger than a clickwrap already: before paying, the customer **signs** the agreement in their account (typed full name and a tick). The exact text plus their Job Details is frozen and fingerprinted (SHA-256) with time, IP and browser, and emailed to them (`lib/acct/agreement.js`). Payment is only offered after signing.
- The booking form asks whether they own the property, act for the owner, have the owner's OK, or not yet (`owner` column); "not yet" flags it for Wayne.
- Stripe Checkout metadata today: `ref`, `purpose`, `amount` (`lib/acct/server.js`, `stripeCheckout`).
- The business form (`components/BusinessForm.jsx`) has role, need and "How often".
- The Business Terms (the MSA) are drafted in the Claude Doc https://claude.ai/artifact/9Zvfe7v8iPxPkvGWzjZ3ci, waiting on Wayne's decisions and a legal check.

## Claude's plan

1. **Version the agreement.** Add `TERMS_VERSION` (start `v1.0`) in `lib/site.js`, show it next to "Last updated" on `/terms`, store it with each signature, and print it on the signed copy. Files: `lib/site.js`, `app/terms/page.js`, `lib/acct/agreement.js`, `lib/acct/server.js` (column on the signing record), test in `tests/suites/`.
2. **Proof in Stripe.** Add to the Checkout Session metadata: `terms_version`, `terms_signed_at`, `agreement_fingerprint` (the SHA-256), and `owner_permission` (own / acts for owner / owner agreed). Files: `lib/acct/server.js`, a test.
3. **No second checkbox.** A clickwrap tick before Stripe would repeat the signature the customer has just given, and adds friction. The signature already records more than a clickwrap would. (Stripe's own `consent_collection` needs a terms URL set in the Stripe dashboard and adds a third tick, so not recommended either.) If Wayne still wants one, it goes on the pay button in `components/acct/AccountApp.jsx`.
4. **Section wording.** Check the four named sections against the current agreement and suggest any extra wording (e.g. an explicit "pilot in command decides" line) for Wayne to approve. The agreement on `/terms` must match the signed contract word for word, so wording changes need his OK first.
5. **Business form.** Add "One-off project" / "Ongoing partner (Business Terms)" to `components/BusinessForm.jsx` (sent to `functions/api/enquiry.js` and shown in the admin email), with a note by the submit button: "Business work is confirmed with a short agreement you sign online before I fly." Test in the enquiry suite.
6. **E-signature for the Business Terms.** Wayne upgraded to Google Workspace Business Standard on 21 Nov, which includes eSignature in Google Docs. Plan: turn the approved Business Terms into a Google Doc with signature fields (customer, Wayne, and the guarantee when needed), and send it for signing from Google Docs. Signed copies stay in Drive. The site's own signing stays for online bookings.
