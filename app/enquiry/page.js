/* YOUR REQUEST: the private link in a customer's confirmation email
   (/enquiry/?t=…). Shows what they sent and where it's up to. noindex. */
import PageHero from "@/components/PageHero";
import EnquiryView from "@/components/acct/EnquiryView";

export const metadata = { title: "Your request", description: "Your Happy Drones quote request.", robots: { index: false, follow: false }, referrer: "no-referrer" };

export default function EnquiryPage() {
  return (
    <div className="sub-page">
      <PageHero small crumbs={[{ label: "Your request" }]} eyebrow="Happy Drones" title="Your request." lede="What you sent, and where it's up to." />
      <section className="t-section t-dark" style={{ paddingTop: "clamp(28px, 4vw, 48px)" }}><div className="wrap"><EnquiryView /></div></section>
    </div>
  );
}
