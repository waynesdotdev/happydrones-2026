/* LOCAL BUSINESS CONTENT — in-depth page for cafés, gyms, salons, trades, shops and venues.
   happydrones.co.uk/local-business · Words: lib/localBusiness.js · Prices: mission planner */
import Link from "next/link";
import CtaBand from "@/components/CtaBand";
import TFaq from "@/components/TFaq";
import JsonLd from "@/components/JsonLd";
import KitIcon from "@/components/KitIcon";
import { Arrow } from "@/components/TIcons";
import { HeroFeed, MorningScroll, TypePicker, FormatGrid, ProfileCard, PlanCalc } from "@/components/business/BusinessBits";
import { SITE, PRICING, PAYMENT, money, kitById, whatsappLink } from "@/lib/site";
import { LB_PROCESS, LB_FAQ, businessPrices } from "@/lib/localBusiness";

export const metadata = {
  title: "Content for local businesses",
  description: "Drone and handheld video and photos of your premises, team and work, cut for Reels, TikTok, your website and your map listing. Across the North East, from one morning's shoot.",
  alternates: { canonical: "/local-business/" },
};

const WHY = [
  { t: "Angles nobody else has", d: "Your street from the air, a glide through the door, the team on the move. The shots that stop people scrolling." },
  { t: "Every platform from one shoot", d: "Vertical for Reels and TikTok, square and portrait for the feed, landscape for your website. No reshoots." },
  { t: "Your map listing, sorted", d: "Fresh photos of the outside, the inside and the team, so people know what they're walking into." },
];

const KIT = [
  { id: "mini4", role: "The street from above", d: "Aerial photos and reveal clips of the frontage and the area." },
  { id: "neo2", role: "The team", d: "A palm-sized drone that follows people for walk-and-talk clips." },
  { id: "pocket3", role: "The work up close", d: "A gimbal camera for smooth close-ups of hands, products and details." },
];

export default function LocalBusinessPage() {
  const bp = businessPrices();
  const fpv = PRICING.extras.find((x) => x.id === "fpvadd");
  const golden = PRICING.extras.find((x) => x.id === "golden");
  const wa = whatsappLink("Hi Happy Drones, I'd like content for my business. It's: ");
  const schema = [
    { "@context": "https://schema.org", "@type": "Service", name: "Photo and video content for local businesses", areaServed: SITE.areaServed, provider: { "@type": "LocalBusiness", name: SITE.name, url: SITE.url, telephone: SITE.phone }, offers: { "@type": "Offer", price: bp?.base, priceCurrency: "GBP" } },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: LB_FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ];

  return (
    <div className="sub-page cx lbp">
      <JsonLd data={schema} />

      {/* HERO */}
      <section className="cx-hero t-dark" aria-labelledby="lb-title">
        <div className="wrap cx-hero-in lb-hero-in">
          <div className="cx-hero-copy">
            <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true"> / </span><Link href="/commercial/">Commercial</Link><span aria-hidden="true"> / </span><span aria-current="page">Local business</span></nav>
            <span className="t-live">For local businesses · {SITE.areaServed}</span>
            <h1 id="lb-title">Weeks of posts from one morning.</h1>
            <p className="t-lede">Your premises, your team and your work, filmed from the air, through the door and up close. Cut into clips for Reels and TikTok, a film for your website and photos for your map listing.</p>
            <div className="t-hero-ctas">
              <Link className="t-btn t-btn-primary" href="/plan/?mission=business">Price a shoot <Arrow /></Link>
              {wa && <a className="t-btn t-btn-ghost" href={wa} target="_blank" rel="noopener">WhatsApp {SITE.phoneDisplay}</a>}
            </div>
          </div>
          <figure className="lb-hero-art"><HeroFeed /></figure>
        </div>
        <div className="wrap">
          <dl className="cx-stats">
            <div><dt>One shoot from</dt><dd>{bp ? money(bp.base) : "—"}<small>a shop, café or studio</small></dd></div>
            <div><dt>From one visit</dt><dd>~20<small>clips, film and photos</small></dd></div>
            <div><dt>On site</dt><dd>1–2 h<small>around your opening hours</small></dd></div>
            <div><dt>Delivered</dt><dd>5 days<small>working days</small></dd></div>
          </dl>
        </div>
      </section>

      {/* WHY */}
      <section className="t-section t-dark" aria-labelledby="lb-why-title" style={{ paddingTop: "clamp(40px, 6vw, 72px)" }}>
        <div className="wrap">
          <div className="t-head"><span className="t-tag">Why it works</span><h2 id="lb-why-title">People choose local businesses on their phones.</h2></div>
          <div className="t-why cx-why">{WHY.map((w) => <div key={w.t}><h3>{w.t}</h3><p>{w.d}</p></div>)}</div>
        </div>
      </section>

      {/* MORNING SCROLL */}
      <MorningScroll />

      {/* TYPES */}
      <section className="ea-sec" aria-labelledby="lb-types-title">
        <div className="wrap">
          <p className="ea-eyebrow">Every kind of local business</p>
          <h2 id="lb-types-title" className="section-title">What gets filmed depends on what you do.</h2>
          <p className="section-sub">Pick your kind of business to see the shot list, the clip that usually does best and a tip for the day.</p>
          <TypePicker />
        </div>
      </section>

      {/* FORMATS */}
      <section className="t-section t-light" aria-labelledby="lb-fmt-title">
        <div className="wrap">
          <div className="t-head t-split">
            <div className="t-stack"><span className="t-tag">One shot, every shape</span><h2 id="lb-fmt-title">Cut for wherever your customers are.</h2></div>
            <p className="t-lede">Each platform wants a different shape. Tap through them to see how the same shot is framed for each, so nothing important gets cut off.</p>
          </div>
          <FormatGrid />
        </div>
      </section>

      {/* PROFILE */}
      <section className="t-section t-dark" aria-labelledby="lb-prof-title">
        <div className="wrap lb-prof-wrap">
          <div className="t-stack-lg" style={{ minWidth: 0 }}>
            <div className="t-head" style={{ marginBottom: 0 }}><span className="t-tag">Your map listing</span><h2 id="lb-prof-title">The first thing new customers see.</h2></div>
            <p className="t-lede">When someone searches for a café or a barber nearby, your listing&apos;s photos do the talking before they ever read a review. Switch between before and after.</p>
          </div>
          <ProfileCard />
        </div>
      </section>

      {/* PRICES */}
      <section className="t-section t-light" id="pricing" aria-labelledby="lb-price-title">
        <div className="wrap">
          <div className="t-head t-split">
            <div className="t-stack"><span className="t-tag">Guide prices</span><h2 id="lb-price-title">One shoot, or fresh content all year.</h2></div>
            <p className="t-lede">Book once, or every quarter or month and pay less per visit. Repeat visits are invoiced on {PAYMENT.termsDays}-day terms; one-off shoots take a {PAYMENT.depositPct}% deposit.</p>
          </div>
          <PlanCalc />
          <div className="cx-price-notes">
            <div>
              <h3>Add to any shoot</h3>
              <ul>
                {fpv && <li><span>One-take FPV flight inside (Avata 2)</span><b>+{money(fpv.price)}</b></li>}
                {golden && <li><span>{golden.name}</span><b>+{money(golden.price)}</b></li>}
              </ul>
            </div>
            <div>
              <h3>Exact prices</h3>
              <p>The <Link href="/plan/?mission=business">mission planner</Link> gives a guide price for your business in under a minute, including travel. Everything is set out in the <Link href="/terms/">booking agreement</Link>.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS + KIT */}
      <section className="t-section t-dark" aria-labelledby="lb-proc-title">
        <div className="wrap">
          <div className="t-head t-split">
            <div className="t-stack"><span className="t-tag">How it works</span><h2 id="lb-proc-title">A call, a morning, a month of content.</h2></div>
            <p className="t-lede">You deal with one person from the first call to the download link: me.</p>
          </div>
          <ol className="cx-process">{LB_PROCESS.map((s) => <li key={s.t}><span className="t-mono">{s.tag}</span><h3>{s.t}</h3><p>{s.d}</p></li>)}</ol>
          <div className="t-head" style={{ marginTop: "clamp(48px, 7vw, 90px)" }}><span className="t-tag">Filmed with</span><h2>Four cameras, one morning.</h2></div>
          <ul className="cx-kit lb-kit">
            {KIT.map((k) => { const item = kitById(k.id); return item ? (
              <li key={k.id}><span className="cx-kit-icon"><KitIcon id={k.id} /></span><div><b>{item.name}</b><small className="t-mono">{k.role.toUpperCase()}</small><p>{k.d}</p></div></li>
            ) : null; })}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="t-section t-dark" aria-labelledby="lb-faq-title" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="t-head"><span className="t-tag">Questions from business owners</span><h2 id="lb-faq-title">Before you book.</h2></div>
          <TFaq items={LB_FAQ} />
        </div>
      </section>

      <CtaBand title="Tell me about your business." text="A ten-minute chat, a shot list, and a morning that fills your feed for weeks." />
    </div>
  );
}
