/* Site footer: logo, insurance, page links, services and socials. */
import Link from "next/link";
import Image from "next/image";
import { SITE, SERVICE_PAGES, liveSocials } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-grid">
        <div className="footer-brand">
          <span className="footer-logo">
            <Image src="/logo.png" alt="Happy Drones" width={1407} height={489} />
          </span>
          <p>{SITE.area}</p>
          <p className="footer-cover">
            <span>{SITE.insurance.publicLiability}</span> public liability<br />
            <span>{SITE.insurance.professionalIndemnity}</span> professional indemnity
          </p>
        </div>

        <nav className="footer-col" aria-label="Pages">
          <h2>Explore</h2>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/property/">Property packages</Link></li>
            <li><Link href="/estate-agents/">For estate agents</Link></li>
            <li><Link href="/commercial/">Commercial</Link></li>
            <li><Link href="/plan/">Plan a mission</Link></li>
            <li><Link href="/services/">Services</Link></li>
            <li><Link href="/fleet/">The fleet</Link></li>
            <li><Link href="/safety/">Safety</Link></li>
            <li><Link href="/journal/">Viewing Room</Link></li>
            <li><Link href="/#quote">Get a quote</Link></li>
            <li><Link href="/privacy/">Privacy</Link></li>
          </ul>
        </nav>

        <nav className="footer-col" aria-label="Services">
          <h2>Services</h2>
          <ul>
            {SERVICE_PAGES.map((s) => (
              <li key={s.id}><Link href={`/services/${s.id}/`}>{s.nav}</Link></li>
            ))}
          </ul>
        </nav>

        <nav className="footer-col" aria-label="Social media">
          <h2>Follow</h2>
          <ul>
            {liveSocials().map((s) => (
              <li key={s.id}><a href={s.url} target="_blank" rel="noopener">{s.name}</a></li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="wrap footer-base">
        <p>&copy; {new Date().getFullYear()} {SITE.name}</p>
        {SITE.email && <p><a href={`mailto:${SITE.email}`}>{SITE.email}</a></p>}
      </div>
    </footer>
  );
}
