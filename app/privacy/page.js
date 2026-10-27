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
          <p><em>Last updated: 25 October 2026</em></p>

          <h2>Who I am</h2>
          <p>Happy Drones is run by Wayne Fox, {SITE.base}, United Kingdom. Contact me at <a href={`mailto:${SITE.email}`}>{SITE.email}</a> about anything on this page.</p>

          <h2>What I collect</h2>
          <p>When you send an enquiry, I receive your name, email address, and any phone number, postcode, date, message and quote details you include.</p>

          <h2>Why I collect it</h2>
          <p>Only to reply to your enquiry, give you a price, and arrange and deliver work you book. I don&apos;t sell your details or send marketing unless you ask me to.</p>

          <h2>How long I keep it</h2>
          <p>Enquiries that don&apos;t lead to a booking are deleted within 12 months. Records for booked jobs are kept for 6 years for tax purposes.</p>

          <h2>Services this site uses</h2>
          <ul>
            <li>Netlify hosts the site and keeps a copy of form submissions.</li>
            <li>Web3Forms delivers form submissions to my inbox by email.</li>
            <li>Google Workspace hosts my business email.</li>
            <li>The fonts are stored on this website, so no font service is contacted.</li>
            <li>YouTube plays videos, only after you press play, in privacy-enhanced mode.</li>
            <li>Cloudflare protects the site and may set a short-lived security cookie. See the <Link href="/cookies/">cookie policy</Link>.</li>
          </ul>

          <h2>Filming and people</h2>
          <p>I plan flights to avoid filming people who aren&apos;t part of the job. If you think you appear in my footage and want it removed, contact me.</p>

          <h2>Your rights</h2>
          <p>You can ask to see, correct or delete the information I hold about you. You can also complain to the Information Commissioner&apos;s Office at ico.org.uk.</p>

          <div className="simple-actions"><Link className="btn btn-orange" href="/">Back to home</Link></div>
        </div>
      </section>
    </div>
  );
}
