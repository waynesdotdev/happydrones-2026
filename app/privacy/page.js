/* PRIVACY POLICY. Check it still matches how you work whenever you add a new service.
   It's a starting point, not legal advice. ico.org.uk has free guidance for small businesses. */
import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata = {
  title: "Privacy policy",
  description: "How Happy Drones handles your information.",
  alternates: { canonical: "/privacy/" },
};

export default function PrivacyPage() {
  return (
    <div className="sub-page">
      <section className="simple">
        <div className="wrap simple-inner">
          <h1 className="section-title">Privacy policy</h1>
          <p><em>Last updated: 21 November 2026</em></p>

          <h2>Who I am</h2>
          <p>Happy Drones is run by Wayne Fox, a sole trader, {SITE.base}, United Kingdom. Happy Drones is registered with the Information Commissioner&apos;s Office (ICO){SITE.icoNumber ? `, registration number ${SITE.icoNumber}` : ""}. I decide how your information is used, so I&apos;m responsible for it under UK data protection law (the UK GDPR and the Data Protection Act 2018). Contact me at <a href={`mailto:${SITE.email}`}>{SITE.email}</a> about anything on this page.</p>

          <h2>What I collect</h2>
          <ul>
            <li><b>Enquiries and forms:</b> your name, email address, and any phone number, postcode, date, message and quote details you send. They&apos;re saved on this website so I can reply and keep track, and you&apos;re emailed a confirmation with a private link to see what you sent.</li>
            <li><b>Your account:</b> your name, email address, and your phone number and company if you add them. Your password is stored scrambled (hashed), so nobody can read it, including me. I also keep whether you&apos;d like occasional emails about new services, and when you last signed in.</li>
            <li><b>Your bookings:</b> the service, site address and postcode, the dates you ask for and the date we agree, anything you tell me about the job, whether you&apos;re booking as a private customer or a business, the version of the booking agreement you accepted and when, what you&apos;ve paid, and the link to your files.</li>
            <li><b>Signed booking agreements:</b> the name you type to sign, the time, your IP address and browser, and an exact copy of the agreement and Job Details you signed, with a digital fingerprint so it can&apos;t be altered unnoticed.</li>
            <li><b>Payments:</b> card payments are taken by Stripe on its own secure page. I never see or store your full card number. I see the amount, the date and whether it went through.</li>
            <li><b>Security records:</b> your IP address, used for a short time to stop too many sign-in or form attempts, and a log of changes made to bookings and accounts (what was changed, when, and by which account).</li>
            <li><b>The weather check:</b> it asks for your name and email, but these aren&apos;t stored. To enforce the daily limit, your IP address and the postcode areas you checked are kept for 2 days.</li>
          </ul>

          <h2>Why I use it, and the lawful basis</h2>
          <ul>
            <li><b>To record and keep the booking agreement you sign,</b> so we can both show what was agreed. This is needed for our contract, and in our legitimate interest in being able to deal with any dispute.</li>
            <li><b>To reply to enquiries, give prices, and book, carry out, deliver and get paid for your job.</b> This is needed for our contract, or to take steps you&apos;ve asked for before one.</li>
            <li><b>To run your account and send the emails it needs:</b> sign-in codes, booking confirmations, dates, payment receipts and delivery notices. These are part of the service you asked for, not marketing.</li>
            <li><b>To keep the site and your account secure</b> and prevent fraud and misuse. This is in our legitimate interests, and yours.</li>
            <li><b>To keep the tax and accounting records</b> the law requires.</li>
            <li><b>Occasional emails about new services,</b> only if you ticked the box. You can change this at any time in your account under My details, or by replying to any email.</li>
          </ul>
          <p>I don&apos;t sell your details or share them for anyone else&apos;s marketing. No decisions about you are made by automated profiling: prices come from a fixed price list and travel zones based on the site postcode, and every booking is checked by me.</p>

          <h2>How long I keep it</h2>
          <ul>
            <li>Enquiries that don&apos;t lead to a booking: deleted within 12 months.</li>
            <li>Your account: until you delete it. Sign-ups that are never finished are deleted after 7 days.</li>
            <li>Sign-in codes: they stop working after 10 minutes and are deleted within a day. Codes are never kept in my copies of emails.</li>
            <li>Copies of emails the site sends you: 30 days.</li>
            <li>The activity log: 2 years.</li>
            <li>Records for booked jobs: 7 years, which covers the time tax law requires. They&apos;re then deleted automatically.</li>
            <li>Signed booking agreements: 7 years from signing (about 6 years after the job), in case there&apos;s ever a dispute about what was agreed. These are kept even if you delete your account.</li>
          </ul>
          <p>When you delete your account, your name, contact details, site addresses, notes and file links are removed straight away. What&apos;s left is a record of each job with nothing that names you (the service, the first half of the postcode, dates, price and payments) for the tax records, and any signed booking agreements, kept as above in case of a dispute. Stripe keeps its own payment records for as long as the law requires.</p>

          <h2>Services this site uses</h2>
          <p>These companies handle information for me, only to provide their service, under contracts that require them to keep it safe:</p>
          <ul>
            <li><b>Cloudflare</b> hosts the website and stores enquiries, accounts and bookings in its database. It may also set a short-lived security cookie. See the <Link href="/cookies/">cookie policy</Link>.</li>
            <li><b>Stripe</b> takes card payments.</li>
            <li><b>Resend</b> sends the enquiry, account and booking emails, from its Ireland (EU) region.</li>
            <li><b>Web3Forms</b> sends me a backup copy of enquiry forms by email.</li>
            <li><b>Google Workspace</b> hosts my business email and the folders I deliver your files in.</li>
            <li><b>Anthropic</b> (Claude, an AI assistant) helps me find businesses to contact, keeps my list of business contacts, and drafts emails to them and replies. I read and send every email myself. See &ldquo;If I&apos;ve contacted your business&rdquo; below.</li>
            <li><b>The Met Office</b> and <b>postcodes.io</b> provide forecasts and postcode lookups. They receive the postcode or area only, never your name or email.</li>
            <li><b>YouTube</b> plays videos, only after you press play, in privacy-enhanced mode.</li>
            <li>The fonts are stored on this website, so no font service is contacted.</li>
          </ul>
          <p>Some of these companies are based in, or use servers in, the United States. Where your information goes outside the UK, it&apos;s protected by the safeguards UK law requires, such as the UK&ndash;US data bridge or approved contract clauses.</p>

          <h2>Keeping it safe</h2>
          <p>Every sign-in needs your password and a code sent to your email. Accounts lock for 15 minutes after repeated wrong passwords, the site only works over a secure connection, and only I can see the admin side. If something ever went wrong with your information, I&apos;d tell you and the ICO where the law requires it.</p>

          <h2>How this website is built</h2>
          <p>The website and its tools were built with the help of AI and checked by Wayne before going live. No AI is used to handle your booking: your enquiry goes to Wayne, and every price, date and decision about your job is made by a person. AI does help me contact businesses, as the next section explains.</p>

          <h2 id="business-contacts">If I&apos;ve contacted your business</h2>
          <p>I contact businesses that might use drone photography, such as estate agents, roofers, builders, developers, property managers and councils, within about 25 miles of Stockton-on-Tees. Claude, an AI assistant made by Anthropic, helps me find them, keep the list and draft the emails. I check and send every email myself.</p>
          <ul>
            <li><b>Where your details came from:</b> your business&apos;s own website, Companies House, and public business directories and listings.</li>
            <li><b>What I keep:</b> the business name, address, type of business and legal form, its company number, the contact email and phone number it publishes, and where I found them. If your business publishes your name and job title as its contact, I keep those too. I also note when I contacted you and any reply.</li>
            <li><b>Why, and the lawful basis:</b> to offer my services to businesses that might need them. This is in my legitimate interests. I only use details that businesses publish for business contact, and I don&apos;t contact anyone about anything but their business.</li>
            <li><b>Emails:</b> I only email limited companies, LLPs and public bodies without asking first, at a business address, and every email says how to stop them. I don&apos;t email sole traders or partnerships unless they&apos;ve agreed or are already customers. I check phone numbers against the Telephone Preference Service and the Corporate Telephone Preference Service before calling.</li>
            <li><b>How often:</b> one email, and at most one follow-up. If there&apos;s no reply, I won&apos;t email again about the same thing.</li>
            <li><b>To stop it:</b> reply &ldquo;stop&rdquo; or tell me in any way, and I won&apos;t contact you again. I&apos;ll keep only your business name, your email or phone number, and the date you asked, on a do-not-contact list, so that I don&apos;t contact you by mistake in future.</li>
            <li><b>How long I keep it:</b> if nothing comes of it, I delete your details within 12 months of the last contact. Do-not-contact entries are kept for as long as I&apos;m contacting businesses.</li>
          </ul>
          <p>You have the rights below, including the absolute right to object to direct marketing.</p>

          <h2>Filming and people</h2>
          <p>I plan flights to avoid filming people who aren&apos;t part of the job. If you think you appear in my footage and want it removed, contact me.</p>

          <h2>Under 18s</h2>
          <p>Accounts and bookings are for adults. Please don&apos;t create an account if you&apos;re under 18.</p>

          <h2>Your rights</h2>
          <p>You can ask to see, correct or delete the information I hold about you, to have it moved somewhere else, or to object to how I use it. If you have an account, you can do much of this yourself under My details: change your details, download a copy of your data, or delete your account. For anything else, email me and I&apos;ll reply within a month.</p>
          <p>If you&apos;re unhappy with how I&apos;ve handled your information, please tell me first. You can also complain to the Information Commissioner&apos;s Office at <a href="https://ico.org.uk/make-a-complaint/" target="_blank" rel="noopener">ico.org.uk</a>.</p>

          <div className="simple-actions"><Link className="btn btn-orange" href="/">Back to home</Link></div>
        </div>
      </section>
    </div>
  );
}
