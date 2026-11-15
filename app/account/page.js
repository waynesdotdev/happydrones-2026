/* MY ACCOUNT: customers sign in, book, pay and get their files.
   The working part is components/acct/AccountApp.jsx. Not in the sitemap; noindex. */
import PageHero from "@/components/PageHero";
import AccountApp from "@/components/acct/AccountApp";

export const metadata = { title: "My account", description: "Your Happy Drones bookings.", robots: { index: false, follow: false } };

export default function AccountPage() {
  return (
    <div className="sub-page">
      <PageHero small crumbs={[{ label: "My account" }]} eyebrow="Happy Drones" title="My account." lede="Your bookings, payments and files in one place." />
      <section className="t-section t-dark" style={{ paddingTop: "clamp(28px, 4vw, 48px)" }}><div className="wrap"><AccountApp /></div></section>
    </div>
  );
}
