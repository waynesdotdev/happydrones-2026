/* BOOKING AGREEMENT — the same contract every customer signs, published so
   anyone can read it before booking. Keep it word-for-word in step with the
   signed version (the "Happy Drones Booking Agreement" doc). The Job Details,
   signatures and cancellation form are shown blank on purpose.
   Name, email, phone and address come from SITE in lib/site.js. */
import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata = {
  title: "Booking agreement",
  description: "The booking agreement every Happy Drones customer signs, in plain English: deposits, payment, weather, cancellations, copyright and liability.",
  alternates: { canonical: "/terms/" },
};

const UPDATED = "26 October 2026";

// Numbered clause: <C n="3.2" t="Deposit:">text</C>
function C({ n, t, children }) {
  return (
    <p className="tm-c">
      <span className="tm-n">{n}</span> {t && <b>{t}</b>} {children}
    </p>
  );
}

function Blank({ children }) {
  return <span className="tm-blank">{children}</span>;
}

const JOB_ROWS = [
  ["Client name", ""],
  ["Business name (if booking for a business)", ""],
  ["Client address", ""],
  ["Client email and phone", ""],
  ["Booking as", "Consumer (private individual) / Business"],
  ["Property or site address", ""],
  ["Service and package", ""],
  ["What you'll receive", "e.g. 25 edited photos, 10 aerial photos, 60–90 second video, 1 vertical reel"],
  ["Shoot date and time (or visit schedule)", ""],
  ["Delivery time", "e.g. within 72 hours of the shoot"],
  ["Price", "£"],
  ["Payment terms", "Standard: 25% deposit, balance before full files (3.2–3.5) / Invoice terms: 30 days per invoice (3.8)"],
  ["Deposit (standard terms only)", "£, due on signing"],
  ["Balance (standard terms only)", "£, due before full files are released"],
  ["Costs invoiced in advance (invoice terms only)", ""],
  ["Licence (section 9)", "Property marketing / Personal / Business"],
  ["Permitted uses (business licence only)", ""],
  ["Extras agreed", ""],
  ["Special notes", "access, site rules, inductions, anything else"],
];

export default function TermsPage() {
  const site = SITE.url.replace(/^https?:\/\//, "");
  const address = SITE.address ? SITE.address : <Blank>business address shown on your agreement</Blank>;
  return (
    <div className="sub-page">
      <section className="simple">
        <div className="wrap simple-inner tm">
          <p className="page-eyebrow">The contract you&apos;ll sign</p>
          <h1 className="section-title">Happy Drones Booking Agreement</h1>
          <p><em>Last updated: {UPDATED}</em></p>

          <p>
            This is the agreement every customer signs before a shoot, published here so you can read it at any time.
            When you book, you&apos;ll get this same agreement to sign electronically, with the Job Details filled in for your job.
          </p>

          <hr />

          <p>
            This agreement is between you (the client) and me, Wayne Fox, trading as {SITE.name}. It&apos;s written in plain
            English so we both know where we stand. Please read it before you sign; it becomes a binding contract once you do.
          </p>

          <h2>At a glance</h2>
          <ul>
            <li><b>Your booking is secured</b> when you sign and pay a 25% deposit. Bigger jobs on invoice terms just need your signature.</li>
            <li><b>The balance is paid before you get the full files.</b> You&apos;ll see previews first; full-resolution files are released as soon as payment clears. Jobs of £1,000 or more, and contracts with repeat visits, are invoiced on 30-day terms instead (see 3.8).</li>
            <li><b>The deposit is non-refundable if you cancel.</b> Homeowners keep their legal 14-day right to cancel (see section 7).</li>
            <li><b>If the weather or safety rules stop the flight, we reschedule at no cost.</b> I make the call on whether it&apos;s safe and legal to fly.</li>
            <li><b>You need to give access and get any permissions</b> the property or site needs.</li>
            <li><b>I keep the copyright.</b> You get a licence to use the images and video for the purpose in your Job Details once you&apos;ve paid in full.</li>
            <li><b>I&apos;m insured</b> with £10 million public liability and £50,000 professional indemnity cover, adjustable per contract if required.</li>
          </ul>

          <h2>1. Who we are</h2>
          <C n="1.1" t="Me:">
            Wayne Fox, a sole trader trading as {SITE.name}, {address}. Phone {SITE.phoneDisplay}.
            {SITE.email && <> Email <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.</>} Website {site}.
          </C>
          <C n="1.2" t="You:">the person or business named in the Job Details. If you&apos;re booking for a business, you confirm you&apos;re allowed to sign for it.</C>
          <C n="1.3" t="How this agreement works:">it&apos;s made up of these terms plus the Job Details at the end. If they ever disagree, the Job Details win.</C>
          <C n="1.4" t="Signing:">you can sign electronically. An electronic signature is as binding as a handwritten one. You&apos;ll get a signed copy by email for your records.</C>

          <h2>2. The job</h2>
          <C n="2.1">I&apos;ll do the work described in the Job Details: the service, location, date and what you&apos;ll receive.</C>
          <C n="2.2">Anything not listed there is extra. That includes more photos, extra locations, a second visit, longer video, rush delivery or extra edits. I&apos;ll always tell you the price before doing extra work, and it&apos;s only added if you agree in writing (an email or message is fine).</C>
          <C n="2.3">I&apos;ll do the work with reasonable care and skill, as a professional drone operator would.</C>

          <h2>3. Price, deposit and payment</h2>
          <C n="3.1" t="The price">is in the Job Details. If I&apos;m VAT registered, VAT is shown separately.</C>
          <C n="3.2" t="Deposit:">a 25% deposit secures your date. Until it&apos;s paid, the date isn&apos;t held and I can offer it to someone else.</C>
          <C n="3.3" t="Balance:">after the shoot I&apos;ll send watermarked previews and an invoice for the balance. The full-resolution files are released once that payment clears.</C>
          <C n="3.4" t="Previews are for checking only.">Please don&apos;t publish, upload or share them anywhere.</C>
          <C n="3.5" t="Pay within 14 days">of the invoice by bank transfer or the card payment link I send. Bank details are on the invoice.</C>
          <C n="3.6" t="Late payment:">if the balance is late, I can charge interest.</C>
          <ul>
            <li><b>Businesses:</b> statutory interest and compensation under the Late Payment of Commercial Debts (Interest) Act 1998.</li>
            <li><b>Consumers:</b> 4% a year above the Bank of England base rate, from the due date until you pay.</li>
          </ul>
          <C n="3.7" t="No licence until paid in full.">If the balance isn&apos;t paid, you have no right to use any of the work, including the previews.</C>
          <C n="3.8" t="Bigger jobs and contracts (invoice terms):">for jobs of £1,000 or more, and contracts with repeat visits, the Job Details will say &quot;Invoice terms&quot;. For those jobs, the following replaces 3.2 to 3.5:</C>
          <ul>
            <li>No deposit is needed to secure the dates, unless the Job Details say otherwise.</li>
            <li>I invoice after each visit, or at the end of a one-off job, and send the files with the invoice.</li>
            <li>You pay each invoice within 30 days of its date.</li>
            <li>Costs over £100 that I pay out specifically for your job, such as equipment hire, specialist permissions or accommodation, are invoiced in advance. They must be paid before the job.</li>
            <li>If an invoice is overdue, I can pause further visits and hold back any files not yet delivered until it&apos;s paid. Sections 3.6 and 3.7 still apply.</li>
          </ul>

          <h2>4. Weather, safety and the law</h2>
          <C n="4.1" t="I decide whether it's safe and legal to fly.">As the pilot, the law makes me responsible for every flight. I follow UK Civil Aviation Authority (CAA) rules, airspace restrictions and the manufacturer&apos;s limits. I won&apos;t fly in a way that breaks them, whatever is asked on the day.</C>
          <C n="4.2" t="Weather:">I check the forecast before every job. If wind, rain, fog, low light or the forecast make flying unsafe or the results poor, I&apos;ll move the job to the next suitable date at no cost to you. Your deposit carries over.</C>
          <C n="4.3" t="Permissions:">some locations need airspace or landowner permission, for example near airports. I&apos;ll arrange airspace permission where it&apos;s needed. If it&apos;s refused or withdrawn, I&apos;ll tell you and we&apos;ll either reschedule or I&apos;ll do the parts that don&apos;t need it.</C>
          <C n="4.4" t="On the day:">I can pause or stop a flight if people, animals, vehicles or anything else make it unsafe. I&apos;ll finish the job once it&apos;s safe, or come back on another date.</C>
          <C n="4.5" t="If we can't find a date:">if we can&apos;t agree a new date within 60 days because of weather or permissions, either of us can cancel. I&apos;ll refund anything you&apos;ve paid for work I haven&apos;t done.</C>

          <h2>5. Your part</h2>
          <p>To get the best results on the day, you agree to:</p>
          <ol>
            <li><b>Give me access</b> to the property or site at the agreed time, or make sure someone is there to let me in.</li>
            <li><b>Have the property ready:</b> tidy, lights working, cars moved if you want them out of shot, and pets secured.</li>
            <li><b>Get the permissions only you can give.</b> That means the owner&apos;s consent if you don&apos;t own the property, the site manager&apos;s if it&apos;s a construction site, and a word with neighbours if it helps.</li>
            <li><b>Tell me about anything that affects safety,</b> such as overhead cables, livestock, site rules or inductions I need to attend.</li>
            <li><b>Give me accurate information,</b> including the right address, size of the property and what you need.</li>
          </ol>
          <p><b>Wasted visits:</b> if I turn up and can&apos;t do the job because of something on your side, like no access, the property not ready or permission refused, it counts as a cancellation on the day. Section 6 applies, and rebooking needs a new deposit.</p>

          <h2>6. Changes, rescheduling and cancelling</h2>
          <C n="6.1" t="Moving your date:">you can move the job once, free, if you tell me at least 48 hours before. Your deposit carries over to the new date. A second move, or a move with less than 48 hours&apos; notice, counts as a cancellation.</C>
          <C n="6.2" t="The deposit is non-refundable if you cancel.">It pays for work that starts as soon as you book: holding your date and turning other work away, flight-planning and mapping software, weather and airspace data, location checks and permissions. You won&apos;t owe the balance.</C>
          <C n="6.3">Homeowners booking as consumers also have the 14-day right to cancel in section 7. Within that period, section 7 applies instead of 6.2.</C>
          <C n="6.4" t="If I have to cancel,">for example through illness or equipment failure, I&apos;ll tell you as soon as I can. You choose either a new date or a full refund of everything you&apos;ve paid. I&apos;m not responsible for any other costs.</C>
          <C n="6.5" t="When the deposit is refunded:">only if I cancel (6.4), if we can&apos;t find a new date because of weather or permissions (4.5), or if you&apos;re a consumer cancelling within the 14-day period in section 7.</C>

          <h2>7. Your right to cancel (homeowners and other consumers)</h2>
          <p>This section only applies if you&apos;re booking as a private individual, not for a business such as an estate agent or developer. It&apos;s your legal right under the Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013.</p>
          <C n="7.1" t="You can cancel within 14 days">of the day you sign, for any reason.</C>
          <C n="7.2" t="To cancel,">tell me clearly by email to {SITE.email || "the email address on your agreement"}, or by letter. You can use the cancellation form at the end, but you don&apos;t have to. Your message just needs to reach me before the 14 days are up.</C>
          <C n="7.3" t="If the work hasn't started,">I&apos;ll refund everything you&apos;ve paid, including the deposit, within 14 days of hearing from you. The refund goes back the same way you paid.</C>
          <C n="7.4" t="If you want the shoot inside the 14 days,">you need to ask me to start early by ticking the box when you sign. If you then cancel after work has started, you&apos;ll pay for the work done up to the moment you told me. That&apos;s a fair share of the price.</C>
          <C n="7.5" t="Once the work is fully done,">having asked me to start early, you lose the right to cancel. The work is complete when the shoot has taken place and the files are delivered.</C>
          <C n="7.6">After the 14 days, section 6 applies.</C>

          <h2>8. Delivery and edits</h2>
          <C n="8.1" t="When:">I&apos;ll deliver within the time in the Job Details, counted from the shoot day. That&apos;s usually 48–72 hours for photos and video, and 3–5 days for FPV fly-throughs. Bad weather or a reshoot moves this on.</C>
          <C n="8.2" t="How:">by a private download link, with files sized for property portals, websites and social media as set out in the Job Details.</C>
          <C n="8.3" t="Edits:">one round of small changes is included if you ask within 7 days of delivery. That covers things like brightness, cropping or swapping a photo for another from the shoot. New shots, a reshoot or a different editing style are extra work under 2.2.</C>
          <C n="8.4" t="Choosing and editing">the final set is my professional judgement. I don&apos;t supply raw, unedited files unless the Job Details say so.</C>
          <C n="8.5" t="Keep your own copy.">I keep the delivered files for 12 months as a courtesy. After that I can&apos;t guarantee they&apos;ll still be available, so download and back them up.</C>

          <h2>9. Copyright and using the images</h2>
          <C n="9.1" t="I own the copyright">in all photos, video and other work I create, under the Copyright, Designs and Patents Act 1988. You&apos;re buying a licence to use it, not the copyright itself.</C>
          <C n="9.2" t="Your licence starts once you've paid in full.">It&apos;s non-exclusive and you can&apos;t transfer it. It covers the use ticked in the Job Details:</C>
          <ul>
            <li><b>Property marketing:</b> advertising the property in the Job Details for sale or let. That includes property portals, your website, brochures, window cards, emails and social media, for as long as you market that property.</li>
            <li><b>Personal:</b> your own personal, non-commercial use.</li>
            <li><b>Business:</b> promoting the business, project or site in the Job Details, in the ways listed there.</li>
          </ul>
          <C n="9.3" t="Not included">unless we agree it in writing:</C>
          <ul>
            <li>selling, licensing or giving the work to anyone else (portals, printers and designers working for you are fine);</li>
            <li>using it to market a different property, or after the property moves to another agent (the new agent will need their own licence);</li>
            <li>stock libraries, competitions, merchandise, or training AI;</li>
            <li>claiming the work as your own, or removing my credit where one is shown.</li>
          </ul>
          <C n="9.4" t="Using it outside the licence">means you&apos;ll pay my standard fee for that use, on top of anything else the law allows me to claim.</C>
          <C n="9.5" t="My own use:">I can use the work to show what I do, on my website, social media and in my portfolio. I won&apos;t show a full address, house number or people&apos;s faces. If you&apos;d rather I didn&apos;t use it at all, just tell me before the shoot.</C>

          <h2>10. Liability and insurance</h2>
          <C n="10.1" t="Insurance:">I hold £10 million public liability and £50,000 professional indemnity insurance for drone operations. If I damage your property or injure someone while working, it&apos;s there to cover it. Cover can be adjusted per contract if a job requires it; any change is written into the Job Details. I&apos;ll show you the certificate if you ask.</C>
          <C n="10.2" t="Nothing in this agreement limits my liability">for death or personal injury caused by my negligence, for fraud, or for anything else the law doesn&apos;t allow me to limit. If you&apos;re a consumer, your legal rights under the Consumer Rights Act 2015 aren&apos;t affected.</C>
          <C n="10.3" t="Businesses:">apart from 10.1 and 10.2, my total liability for anything to do with a job is limited to the price of that job. I&apos;m not liable for loss of profit, revenue, sales, commission, business or opportunity, or for indirect losses.</C>
          <C n="10.4" t="Consumers:">I&apos;m responsible for losses you suffer that are a foreseeable result of me breaking this agreement or not using reasonable care. I&apos;m not responsible for losses that weren&apos;t foreseeable, or for business losses.</C>
          <C n="10.5" t="Things outside my control:">I&apos;m not responsible for delays or failures caused by events I can&apos;t reasonably control. Examples are extreme weather, airspace closures, changes in the law, illness, or problems with a third party&apos;s systems. If one happens, I&apos;ll tell you and we&apos;ll agree a new date or I&apos;ll refund work not done.</C>

          <h2>11. Privacy and people in shot</h2>
          <C n="11.1">I use your details only to arrange, deliver and invoice the job, and to keep the records the law requires. My <Link href="/privacy/">privacy policy</Link> explains how.</C>
          <C n="11.2">I plan flights to avoid filming people who aren&apos;t part of the job. I won&apos;t knowingly deliver images where a member of the public can be identified without good reason.</C>
          <C n="11.3">If you want people in shot, like staff, family or a crew on site, it&apos;s your job to get their agreement first.</C>

          <h2>12. The legal bits</h2>
          <C n="12.1" t="Whole agreement:">this agreement and the Job Details are everything we&apos;ve agreed. Changes only count if we both agree them in writing; an email is fine.</C>
          <C n="12.2" t="If part doesn't work:">if a court decides any part of this agreement can&apos;t be enforced, the rest still applies.</C>
          <C n="12.3" t="Sorting out problems:">if something isn&apos;t right, tell me first and I&apos;ll do my best to put it right quickly. Most things can be fixed with a conversation.</C>
          <C n="12.4" t="Law:">this agreement is governed by the law of England and Wales, and the courts of England and Wales deal with any dispute. If you&apos;re a consumer living in Scotland or Northern Ireland, you can also bring a claim in your local courts.</C>

          <h2>Job Details</h2>
          <p>Filled in for each booking. If anything here differs from the terms above, this wins.</p>
          <div className="tm-table-wrap">
            <table className="tm-table">
              <tbody>
                {JOB_ROWS.map(([k, v]) => (
                  <tr key={k}><th scope="row">{k}</th><td>{v ? <span className="tm-hint">{v}</span> : null}</td></tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2>Signatures</h2>
          <p>By signing, you confirm you&apos;ve read and agree to this agreement and the Job Details.</p>
          <p><b>Consumers only, if your shoot is within 14 days of signing:</b></p>
          <p className="tm-tick"><span aria-hidden="true">☐</span> I ask {SITE.name} to start the work within the 14-day cancellation period. I understand that if I cancel after work has started, I&apos;ll pay for the work done. Once the work is complete, I lose my right to cancel.</p>
          <div className="tm-table-wrap">
            <table className="tm-table tm-sign">
              <thead><tr><th></th><th scope="col">Client</th><th scope="col">{SITE.name}</th></tr></thead>
              <tbody>
                <tr><th scope="row">Name</th><td></td><td>Wayne Fox, trading as {SITE.name}</td></tr>
                <tr><th scope="row">Signature</th><td></td><td></td></tr>
                <tr><th scope="row">Date</th><td></td><td></td></tr>
              </tbody>
            </table>
          </div>

          <h2>Cancellation form (consumers only)</h2>
          <p>Only fill in and send this if you want to cancel within the 14 days in section 7. An email saying you want to cancel works just as well.</p>
          <p>To: Wayne Fox, {SITE.name}, {address}{SITE.email ? `, ${SITE.email}` : ""}</p>
          <p>I hereby give notice that I cancel my contract for the supply of the following service:</p>
          <div className="tm-table-wrap">
            <table className="tm-table">
              <tbody>
                {["Service", "Ordered on", "Name", "Address", "Signature (only if sent on paper)", "Date"].map((k) => (
                  <tr key={k}><th scope="row">{k}</th><td></td></tr>
                ))}
              </tbody>
            </table>
          </div>

          <p><em>End of agreement.</em></p>

          <div className="simple-actions">
            <Link className="btn btn-orange" href="/#contact">Ask about a booking</Link>
            <Link className="btn btn-navy" href="/">Back to home</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
