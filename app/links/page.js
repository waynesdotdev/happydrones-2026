/* happydrones.co.uk/links — the "link in bio" page.
   Everything on it is edited in lib/site.js (LINKS and SITE.socials). */
import Link from "next/link";
import SocialIcon from "@/components/SocialIcon";
import VideoEmbed from "@/components/VideoEmbed";
import { SITE, LINKS, liveSocials, whatsappLink } from "@/lib/site";
import { youtubeId } from "@/lib/youtube";
import { getAllPosts, formatDate } from "@/lib/posts";

export const metadata = {
  title: "Links",
  description: `${SITE.name}: quotes, packages, recent shoots and socials in one place. ${LINKS.intro}`,
  alternates: { canonical: "/links/" },
};

// Works out where each button goes. Internal pages use Next.js links,
// everything else opens in a new tab.
function resolve(href) {
  if (href === "whatsapp") return { url: whatsappLink(), external: true };
  if (href === "call") return { url: SITE.phone ? `tel:${SITE.phone}` : "", external: false, plain: true };
  if (/^https?:\/\//.test(href)) return { url: href, external: true };
  return { url: href, external: false };
}

function Arrow() {
  return (
    <svg className="lp-arrow" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

function LinkButton({ item }) {
  const { url, external, plain } = resolve(item.href);
  if (!url) return null; // e.g. WhatsApp switched off in settings
  const cls = `lp-btn${item.style === "primary" ? " is-primary" : ""}`;
  const inner = (
    <>
      <span className="lp-btn-text">
        <span className="lp-btn-label">{item.label}</span>
        {item.sub && <span className="lp-btn-sub">{item.sub}</span>}
      </span>
      <Arrow />
    </>
  );
  if (external) return <a className={cls} href={url} target="_blank" rel="noopener">{inner}</a>;
  if (plain) return <a className={cls} href={url}>{inner}</a>;
  return <Link className={cls} href={url}>{inner}</Link>;
}

export default function LinksPage() {
  const socials = liveSocials();
  const videoId = youtubeId(LINKS.video || SITE.showreel);
  const latest = LINKS.showLatestPost ? getAllPosts()[0] : null;

  return (
    <div className="linkpage">
      <div className="lp-col">
        <header className="lp-head">
          <Link href="/" className="lp-logo" aria-label={`${SITE.name} website`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="" width="1408" height="490" />
          </Link>
          <h1 className="lp-name">{SITE.name}</h1>
          <p className="lp-motto">{SITE.motto.replace(/\.$/, "")}</p>
          <p className="lp-intro">{LINKS.intro}</p>

          {socials.length > 0 && (
            <ul className="lp-social" aria-label="Social media">
              {socials.map((s) => (
                <li key={s.id}>
                  <a href={s.url} target="_blank" rel="noopener" aria-label={`${SITE.name} on ${s.name}`}>
                    <SocialIcon id={s.id} />
                    <span>{s.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </header>

        {videoId && (
          <section className="lp-video" aria-label={LINKS.videoTitle}>
            <VideoEmbed id={videoId} title={LINKS.videoTitle} />
          </section>
        )}

        <nav className="lp-links" aria-label="Links">
          {LINKS.buttons.map((b) => <LinkButton key={b.label} item={b} />)}
        </nav>

        {LINKS.projects.length > 0 && (
          <section className="lp-group">
            <h2 className="lp-h2">Current projects</h2>
            <div className="lp-links">
              {LINKS.projects.map((p) => <LinkButton key={p.label} item={p} />)}
            </div>
          </section>
        )}

        {latest && (
          <section className="lp-group">
            <h2 className="lp-h2">Latest from the Viewing Room</h2>
            <Link className="lp-post" href={`/journal/${latest.slug}/`}>
              <span className="lp-post-meta">{latest.category} · {formatDate(latest.date)}</span>
              <span className="lp-post-title">{latest.title}</span>
              {latest.excerpt && <span className="lp-post-text">{latest.excerpt}</span>}
            </Link>
          </section>
        )}

        <footer className="lp-foot">
          {SITE.phone && <a href={`tel:${SITE.phone}`}>{SITE.phoneDisplay}</a>}
          <Link href="/">{SITE.url.replace(/^https?:\/\//, "")}</Link>
          <p>
            {SITE.insurance.publicLiability} public liability · {SITE.insurance.professionalIndemnity} professional indemnity
            <br />CAA registered · ICO registered
          </p>
        </footer>
      </div>
    </div>
  );
}
