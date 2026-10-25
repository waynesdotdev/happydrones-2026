/* "Follow the work" cards. Platforms come from SITE.socials in lib/site.js */
import SocialIcon from "./SocialIcon";
import { liveSocials } from "@/lib/site";

export default function Follow({ intro = "New clips most weeks. Pick the platform you already scroll." }) {
  return (
    <section className="follow" aria-labelledby="follow-title">
      <div className="wrap">
        <h2 id="follow-title" className="section-title">Follow the work</h2>
        {intro && <p className="section-sub">{intro}</p>}
        <div className="follow-grid">
          {liveSocials().map((s) => (
            <a key={s.id} className="follow-card" href={s.url} target="_blank" rel="noopener">
              <SocialIcon id={s.id} />
              <b>{s.name}</b>
              <span className="handle">{s.handle}</span>
              <small>{s.blurb}</small>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
