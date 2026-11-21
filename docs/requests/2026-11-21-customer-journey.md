# Wayne's request (21 Nov 2026, evening): full control of the customer journey

Build day: Sunday 22 Nov. Test everything with the fake business profiles (Karen Whitfield, Daniel Okafor, Joanne Lowther, Steve Henderson, Lee Carter, Priya Shah) and the five journey customers in `tests/journeys/five-customers.mjs`.

## What Wayne wants
1. Invite a business by email to sign up, or **create the account for them** and send a link so they take over from there.
2. Put things on their account himself: the contract to sign, job dates and date changes, every detail needed to book and plan a flight, payment reminders.
3. The customer sees **their own short to-do list**: what's done, what's next.
4. Wayne sees, at all times, where each customer is and how long they've been waiting, so he can send a reminder after a few days.
5. **Full admin control:** change or reset anything (date, contract, project, payment status) so a step can be done again.
6. Contracts through **Google Workspace eSignature** (Business Standard, upgraded 21 Nov).
7. **Large clients:** one company account with a main contact and a second contact for when the first is off. They sign the Business Terms once, at the start, with a **credit limit**; when the amount owed passes it, nothing moves until they catch up.
8. Flights are planned and logged in **Happydesk** (separate app, github.com/waynesdotdev/happydesk).

## Facts that shape the build
- **No passwords on this site.** Customers sign in with a one-time code sent to their email. So "a link to reset the password" becomes **"a welcome link that signs them in and lets them check their details"**. Nothing to remember, nothing to leak.
- **What exists already:** admin can create a booking for someone and email an invite to sign and pay (`MAIL.invite`, admin `customers` route); edit, confirm, cancel, reopen, refund, deliver, mark paid, undo changes; alerts list; outbox; audit log; signed booking agreement with fingerprint; receipts and invoices.
- **Google eSignature has no API.** Requests are sent by hand from Google Docs or Drive: add signature fields, click Request signature, and the signers get an email with a link; a PDF copy lands in the same Drive folder. So the website can't send or check Google signatures by itself. Plan: the Business Terms (signed once per company, with the personal guarantee when needed) go through Google eSignature; the website tracks it in admin (sent date, signed date, link to the signed PDF in Drive) and shows the customer "check your email for the agreement from Google". Each job keeps the website's own signing (automatic, fingerprinted, tied to payment). Ask Wayne on the day whether he'd rather keep everything on the website's own signing.
- Happydesk's pilot page couldn't be opened from here (usage limit hit on 21 Nov). On the day: add the happydesk repo to the session and read its README.

## The journey (each step has a status, a date and a reminder)

| # | Stage | Customer sees | Wayne sees and can do |
| --- | --- | --- | --- |
| 1 | First contact (email, website form, Facebook, phone, outreach reply) | — | "Add lead": name, company, source, notes. Website forms create leads automatically |
| 2 | Invited | Email with a welcome link | Send invite, or create the account and send the welcome link. Resend; days since sent |
| 3 | Account set up | Check company details, add second contact | Edit everything; add or swap contacts |
| 4 | Business Terms (companies only, once) | "Check your email for the agreement from Google" then "Signed" | Mark sent, mark signed with the Drive link, credit limit, payment terms; reset to send again |
| 5 | Job created | Job card: what, where, date wanted | Create the job with all flight-planning details (address, what3words/grid ref, access, site contact, hazards, permissions, owner OK) |
| 6 | Job agreement signed | "Sign your booking" | Status; resend; reset signature |
| 7 | Date confirmed | Date and time; move request button | Set or change the date (customer emailed); weather check |
| 8 | Deposit or payment | "Pay deposit" or "Invoice account" | Mark paid, send reminder, refund, reset |
| 9 | Flight | "Booked for …" | Link to the Happydesk job (flight plan, RAMS, log) |
| 10 | Delivered | Download link | Deliver; release files once paid (or straight away on credit) |
| 11 | Balance or invoice paid | Receipt | Overdue reminders at due date, 7, 14 and 30 days |

## To build (Sunday, in this order)
1. **Company accounts:** company record (legal name, type, company number, address), main contact and second contact (both can sign in and see everything), people allowed to order; credit limit, payment terms and Business Terms status on the company.
2. **Admin: add lead / invite / create account + welcome link.** Welcome link = a signed, single-use link that expires in 7 days and signs them in.
3. **Journey view:** a pipeline in admin (one row per customer or job, the stage, days waiting, the next action) with one-tap reminders that use the email templates, logged in the outbox.
4. **Customer to-do panel:** the top of their account lists "Done" and "To do" in plain words.
5. **Business Terms tracking** (Google eSignature by hand, as above), and the credit-limit **stop rule**: work done but unpaid plus unpaid invoices over the limit means new bookings wait, with a clear message to both sides.
6. **Reset anything:** for each stage, "reset" sends it back one step (with a reason, logged in the audit log, and the customer told by email when it affects them).
7. **Reminders:** a daily check that lists who's waiting over N days (Wayne picks N, suggest 3) for Wayne to tap and send; payment reminders follow the Business Terms ladder.
8. **Happydesk link:** a field on each job for its Happydesk job link (no data sharing yet).
9. **Tests:** a new suite that walks the six business profiles through every stage, including the credit stop and resets.

## Questions for Wayne on the day
- Google eSignature for the Business Terms only, or for every job too (manual each time)?
- Reminder gap: 3 days?
- Credit limits as drafted (£500 new, £1,000 established)?
- Which details must every job have before it can be booked (the flight-planning list)?
