/* CREDENTIALS STRIP: the proof a site manager or procurement team looks for
   first. Sits under the homepage hero and at the top of every business page.
   Everything here comes from SITE in lib/site.js, so it only says what's true:
   change the insurance or credentials there, never here. */
import Link from "next/link";
import { SITE } from "@/lib/site";

export default function Credentials({ tone = "light", promises = false }) {
  const items = [
    "CAA Operator and Flyer ID",
    ...(SITE.credentials.includes("A2 CofC") ? ["A2 CofC qualified"] : []),
    `${SITE.insurance.publicLiability} public liability`,
    `${SITE.insurance.professionalIndemnity} professional indemnity`,
    "ICO registered",
    "RAMS for site work",
    ...(promises ? ["Bad weather moves your date for free", "Files in 48 to 72 hours"] : []),
  ];
  return (
    <section className={`creds creds-${tone}`} aria-label="Credentials">
      <div className="wrap creds-row">
        <ul>{items.map((t) => <li key={t}>{t}</li>)}</ul>
        <Link className="creds-link" href="/safety/">Safety and credentials</Link>
      </div>
    </section>
  );
}
