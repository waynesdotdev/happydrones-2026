/* COOKIE POLICY. Keep this accurate: if you add analytics, a tracking pixel
   or another embed, list it here and bump CONSENT_VERSION in lib/consent.js
   so every visitor is asked again. */
import Link from "next/link";
import { SITE } from "@/lib/site";
import CookieSettingsLink from "@/components/CookieSettingsLink";

export const metadata = {
  title: "Cookie policy",
  description: "Which cookies the Happy Drones website uses, and how to change your choice.",
  alternates: { canonical: "/cookies/" },
};

export default function CookiesPage() {
  return (
    <div className="sub-page">
      <section className="simple">
        <div className="wrap simple-inner tm">
          <h1 className="section-title">Cookie policy</h1>
          <p><em>Last updated: 15 November 2026</em></p>

          <p>Cookies are small files a website stores in your browser. This site keeps them to a minimum: it doesn&apos;t use advertising cookies, tracking pixels or analytics that follow you around the web.</p>

          <h2>What this site stores</h2>
          <div className="tm-table-wrap">
            <table className="tm-table">
              <thead><tr><th scope="col">Name</th><th scope="col">Set by</th><th scope="col">What it does</th><th scope="col">Type</th></tr></thead>
              <tbody>
                <tr><th scope="row">hd-cookie-choice</th><td>This site (stored in your browser)</td><td>Remembers whether you chose Accept or Essential only, so the banner doesn&apos;t keep appearing.</td><td>Strictly necessary</td></tr>
                <tr><th scope="row">hds</th><td>This site</td><td>Keeps you signed in to your account, or the admin, after you enter your password and emailed code. Only set when you sign in. Can&apos;t be read by the page&apos;s scripts, is only sent over a secure connection, and ends when you sign out or after 12 hours.</td><td>Strictly necessary</td></tr>
                <tr><th scope="row">__cf_bm and similar</th><td>Cloudflare, which hosts this site</td><td>May be set to tell real visitors from bots and keep the site secure. Lasts up to 30 minutes.</td><td>Strictly necessary</td></tr>
                <tr><th scope="row">Stripe cookies</th><td>Stripe, on its own payment page</td><td>Only when you pay by card. Stripe&apos;s checkout page is on Stripe&apos;s website and sets its own cookies to process the payment and prevent fraud. See Stripe&apos;s cookie policy at stripe.com.</td><td>Strictly necessary for paying</td></tr>
                <tr><th scope="row">hdwx settings</th><td>This site (stored in your browser)</td><td>Only if you use the weather or map tools. Remembers choices like your drone model and saved places so you don&apos;t have to set them again. Stays in your browser and isn&apos;t sent to me.</td><td>Your settings</td></tr>
                <tr><th scope="row">YouTube cookies</th><td>YouTube (Google)</td><td>Only if you play a video. Videos use YouTube&apos;s privacy-enhanced mode and don&apos;t load until you press play.</td><td>Third party, optional</td></tr>
              </tbody>
            </table>
          </div>

          <h2>Your choices</h2>
          <ul>
            <li><b>Accept:</b> videos load straight away when you press play.</li>
            <li><b>Essential only:</b> before a video plays, you&apos;re told YouTube may set cookies and can choose to play it anyway or watch it on YouTube instead.</li>
          </ul>
          <p>Strictly necessary items are always on, because the site needs them to work securely. You can change your choice at any time: <CookieSettingsLink />. You can also clear or block cookies in your browser settings.</p>

          <h2>Forms and your account</h2>
          <p>The enquiry and mission forms don&apos;t set cookies. What you send is emailed to me through Web3Forms. Signing in to your account sets the <b>hds</b> cookie above, and nothing else. There are no cookies for tracking what you do in your account. The <Link href="/privacy/">privacy policy</Link> explains how your information is used.</p>

          <h2>Questions</h2>
          <p>Contact {SITE.email ? <a href={`mailto:${SITE.email}`}>{SITE.email}</a> : "me"} about anything on this page.</p>

          <div className="simple-actions"><Link className="btn btn-orange" href="/">Back to home</Link></div>
        </div>
      </section>
    </div>
  );
}
