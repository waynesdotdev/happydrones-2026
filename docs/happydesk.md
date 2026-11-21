# Happydesk (Wayne's drone operations app), as of 21 Nov 2026

A separate project, not part of this website. Wayne's own replacement for Dronedesk.
- Live: https://happydesk-blush.vercel.app · Code: github.com/waynesdotdev/happydesk (its README and TODO explain it)
- Supabase (free plan) and Vercel, with logins for Wayne and staff.
- Built: pilot certificates and expiry warnings, fleet and batteries, maintenance, compliance dashboard, audit log; clients and jobs with a site planner and site checks (weather, airspace, hazards); risk assessments, method statements, RAMS and Job Pack PDFs; flight logs (AirData/PhantomHelp CSV import), incident reports, logbooks; leads with an embeddable enquiry form, quotes, invoices, optional Stripe links and Resend alerts.
- Its next steps: backups, Remote ID per aircraft, offline use, two-step login for admins, privacy link on its form and the ICO fee.

## Where it touches this website
- Two systems take enquiries, quotes, invoices and payments: this site (bookings, signed agreement, Stripe, receipts, invoices) and Happydesk (leads, quotes, invoices, Stripe links). Decide which is the record for what before using both for real customers.
- Its enquiry form must not be pasted into this site without a security review: every outside address it loads from has to go into the CSP in `public/_headers`, and `scripts/check-security.mjs` will fail the build otherwise. Bookings already have their own form here.
- RAMS from Happydesk are what the outreach emails promise for site work.
- Credentials: Wayne confirmed on 21 Nov that he holds the A2 CofC and has paid the ICO fee. Happydesk's own notes saying "A2 CofC not yet" and "check the ICO fee" are out of date and should be updated there.
