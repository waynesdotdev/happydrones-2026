/* WALKTHROUGH VIDEO — in-depth page for agents, sellers, letting agents and holiday lets.
   happydrones.co.uk/walkthrough-video · Words: lib/walkthrough.js · Prices: lib/site.js */
import Link from "next/link";
import CtaBand from "@/components/CtaBand";
import TFaq from "@/components/TFaq";
import JsonLd from "@/components/JsonLd";
import KitIcon from "@/components/KitIcon";
import { Arrow } from "@/components/TIcons";
import HeroPlayer from "@/components/walk/HeroPlayer";
import WalkScrub from "@/components/walk/WalkScrub";
import FormatFlip from "@/components/walk/FormatFlip";
import MoveCards from "@/components/walk/MoveCards";
import BrandPicker from "@/components/walk/BrandPicker";
import { SITE, PACKAGES, PRICING, PAYMENT, money, priceFrom, kitById, whatsappLink } from "@/lib/site";
import { WT_PROCESS, WT_FAQ } from "@/lib/walkthrough";

export const metadata = {
  title: "Property walkthrough video",
  description: "Smooth, room-by-room walkthrough videos with aerial openings, captions and licensed music, in landscape for the portals and vertical for social. Across the North East, in Showcase from " + priceFrom("showcase") + ".",
  alternates: { canonical: "/walkthrough-video/" },
};

const WHY = [
  { t: "Layout at a glance", d: "Photos show rooms. Video shows how they join up, so buyers know the house before they visit." },
  { t: "Fewer wasted viewings", d: "The people who book have already walked round it on their phone and still want to see it." },
  { t: "Made for the feed", d: "A vertical cut for Reels, TikTok and Shorts comes with every walkthrough, ready to post." },
];

const KIT = [
  { id: "pocket3", role: "The walkthrough", d: "A 3-axis gimbal camera with a 1-inch sensor, so rooms stay smooth and clean even in low light." },
  { id: "mini4", role: "Aerial opening and closing", d: "The drift-in over the street and the pull-back over the garden." },
  { id: "neo2", role: "Agent intros", d: "A palm-sized drone for walk-and-talk intros to camera, if you add one." },
];

export default function WalkthroughPage() {
  const pkgs = PACKAGES.filter((p) => p.id === "showcase" || p.id === "signature");
  const intro = PRICING.extras.find((x) => x.id === "intro");
  const fpv = PRICING.extras.find((x) => x.id === "fpvadd");
  const wl = PRICING.extras.find((x) => x.id === "whitelabel");
  const wa = whatsappLink("Hi Happy Drones, I'd like a walkthrough video. The address is: ");
  const schema = [
    { "@context": "https://schema.org", "@type": "Service", name: "Property walkthrough video", areaServed: SITE.areaServed, provider: { "@type": "LocalBusiness", name: SITE.name, url: SITE.url, telephone: SITE.phone }, offers: { "@type": "Offer", price: PRICING.services.find((s) => s.id === "showcase")?.base, priceCurrency: "GBP" } },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: WT_FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ];

  return (
    <div className="sub-page cx wt">
      <JsonLd data={schema} />

      {/* HERO */}
      <section className="cx-hero t-dark" aria-labelledby="wt-title">
        <div className="wrap cx-hero-in">
          <div className="cx-hero-copy">
            <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true"> / </span><Link href="/property/">Property</Link><span aria-hidden="true"> / </span><span aria-current="page">Walkthrough video</span></nav>
            <span className="t-live">Walkthrough video · {SITE.areaServed}</span>
            <h1 id="wt-title">A viewing before the viewing.</h1>
            <p className="t-lede">A smooth, steady walk through the home, room by room, opened and closed from the air. Captioned, set to licensed music, and cut in landscape for the portals and vertical for social.</p>
            <div className="t-hero-ctas">
              <Link className="t-btn t-btn-primary" href="/?service=showcase#quote">Price Showcase <Arrow /></Link>
              {wa && <a className="t-btn t-btn-ghost" href={wa} target="_blank" rel="noopener">WhatsApp {SITE.phoneDisplay}</a>}
            </div>
          </div>
          <figure className="cx-hero-art t-frame"><HeroPlayer /></figure>
        </div>
        <div className="wrap">
          <dl className="cx-stats">
            <div><dt>In Showcase from</dt><dd>{priceFrom("showcase")}<small>with photos and aerials</small></dd></div>
            <div><dt>Running time</dt><dd>60–120 s<small>by package</small></dd></div>
            <div><dt>Two versions</dt><dd>16:9 + 9:16<small>portals and social</small></dd></div>
            <div><dt>Delivered in</dt><dd>48–72 h<small>Signature 3–5 days</small></dd></div>
          </dl>
        </div>
      </section>

      {/* WHY */}
      <section className="t-section t-dark" aria-labelledby="wt-why-title" style={{ paddingTop: "clamp(40px, 6vw, 72px)" }}>
        <div className="wrap">
          <div className="t-head"><span className="t-tag">Why video</span><h2 id="wt-why-title">Photos show the rooms. Video shows the home.</h2></div>
          <div className="t-why cx-why">{WHY.map((w) => <div key={w.t}><h3>{w.t}</h3><p>{w.d}</p></div>)}</div>
        </div>
      </section>

      {/* SCRUB */}
      <WalkScrub />

      {/* MOVES */}
      <section className="ea-sec" aria-labelledby="wt-moves-title">
        <div className="wrap">
          <p className="ea-eyebrow">How it&apos;s filmed</p>
          <h2 id="wt-moves-title" className="section-title">Six camera moves, used on purpose.</h2>
          <p className="section-sub">No shaky phone footage and no dizzy spinning. Each room gets the move that shows it best, slowly enough to take in.</p>
          <MoveCards />
        </div>
      </section>

      {/* FORMATS */}
      <section className="t-section t-light" aria-labelledby="wt-fmt-title">
        <div className="wrap">
          <div className="t-head t-split">
            <div className="t-stack"><span className="t-tag">One shoot, two shapes</span><h2 id="wt-fmt-title">Landscape for the portals. Vertical for the feed.</h2></div>
            <p className="t-lede">Every walkthrough comes in both. Switch between them to see how the same room is framed for each.</p>
          </div>
          <FormatFlip />
        </div>
      </section>

      {/* BRANDING */}
      <section className="t-section t-dark" aria-labelledby="wt-brand-title">
        <div className="wrap">
          <div className="t-head t-split">
            <div className="t-stack"><span className="t-tag">For estate agents</span><h2 id="wt-brand-title">Your name on it. Or only yours.</h2></div>
            <p className="t-lede">Pick how the video is branded and see the end card change. Agency branding is included; white label is priced by how many listings you book.</p>
          </div>
          <BrandPicker />
          <p style={{ marginTop: 24 }}><Link className="text-link" href="/estate-agents/#working">See how agent accounts and bundles work</Link></p>
        </div>
      </section>

      {/* WALKTHROUGH VS FPV */}
      <section className="t-section t-light" aria-labelledby="wt-vs-title">
        <div className="wrap">
          <div className="t-head"><span className="t-tag">Walkthrough or glide tour?</span><h2 id="wt-vs-title">Two ways to tour a home.</h2></div>
          <div className="wt-vs">
            <div>
              <p className="t-mono">WALKTHROUGH · POCKET 3</p>
              <h3>Room by room, at walking height</h3>
              <p>Filmed on a gimbal and cut together, with captions naming each room. Calm, clear and easy to follow. Best for most homes and every portal.</p>
              <p className="wt-vs-in">In Showcase and Signature</p>
            </div>
            <div>
              <p className="t-mono">ONE-TAKE GLIDE · POCKET 3</p>
              <h3>One unbroken take</h3>
              <p>The Pocket 3 in its FPV mode glides in the front door, through the rooms and out to the garden in one take. It stops people scrolling. Best for bigger homes and social media.</p>
              <p className="wt-vs-in">In Signature</p>
            </div>
          </div>
        </div>
      </section>

      {/* PACKAGES */}
      <section className="t-section t-light" aria-labelledby="wt-pkg-title" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="t-head t-split">
            <div className="t-stack"><span className="t-tag">Packages</span><h2 id="wt-pkg-title">The walkthrough comes with everything else.</h2></div>
            <p className="t-lede">Photos, aerials and the walkthrough, shot in one visit so they all match. Prices are for a flat or 1–2 bed home; one-off shoots take a {PAYMENT.depositPct}% deposit.</p>
          </div>
          <div className="pp-pkgs wt-pkgs">
            {pkgs.map((p) => (
              <div key={p.id} className={p.featured ? "pp-pkg on" : "pp-pkg"}>
                <p className="t-mono">{p.tagline.toUpperCase()}</p>
                <h3>{p.title}</h3>
                <p className="pp-pkg-price">{priceFrom(p.id)}<small>from</small></p>
                <ul>{p.gets.map((g) => <li key={g}>{g}</li>)}</ul>
                <Link className={p.featured ? "t-btn t-btn-primary" : "t-btn t-btn-ghost"} href={`/?service=${p.id}#quote`}>Price {p.title} <Arrow /></Link>
              </div>
            ))}
            <div className="pp-pkg wt-adds">
              <p className="t-mono">ADD TO EITHER</p>
              <h3>Extras</h3>
              <ul className="wt-adds-list">
                {intro && <li><span>{intro.name}<small>{intro.desc}</small></span><b>+{money(intro.price)}</b></li>}
                {fpv && <li><span>{fpv.name}<small>On Showcase. Included in Signature.</small></span><b>+{money(fpv.price)}</b></li>}
                {wl && <li><span>White label<small>Less on agent accounts, free on 10-listing bundles</small></span><b>{money(wl.price)}</b></li>}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS + KIT */}
      <section className="t-section t-dark" aria-labelledby="wt-proc-title">
        <div className="wrap">
          <div className="t-head t-split">
            <div className="t-stack"><span className="t-tag">How it works</span><h2 id="wt-proc-title">Shot in the same visit as the photos.</h2></div>
            <p className="t-lede">No second appointment for the vendor. One person shoots, edits and delivers everything.</p>
          </div>
          <ol className="cx-process">{WT_PROCESS.map((s) => <li key={s.t}><span className="t-mono">{s.tag}</span><h3>{s.t}</h3><p>{s.d}</p></li>)}</ol>
          <div className="t-head" style={{ marginTop: "clamp(48px, 7vw, 90px)" }}><span className="t-tag">Filmed with</span><h2>The kit in your hallway.</h2></div>
          <ul className="cx-kit wt-kit">
            {KIT.map((k) => { const item = kitById(k.id); return item ? (
              <li key={k.id}><span className="cx-kit-icon"><KitIcon id={k.id} /></span><div><b>{item.name}</b><small className="t-mono">{k.role.toUpperCase()}</small><p>{k.d}</p></div></li>
            ) : null; })}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="t-section t-dark" aria-labelledby="wt-faq-title" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="t-head"><span className="t-tag">Questions</span><h2 id="wt-faq-title">Before you book.</h2></div>
          <TFaq items={WT_FAQ} />
        </div>
      </section>

      <CtaBand title="Let buyers walk round first." text="Book Showcase for photos, aerials and a walkthrough in one visit." />
    </div>
  );
}
