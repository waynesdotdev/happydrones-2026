/* MEDIA AND BRAND KIT — happydrones.co.uk/media
   Logos, colours, fonts, about text and key facts for press, partners and
   anyone listing Happy Drones. Words and colours: lib/brand.js.
   Files: public/media (logos, brand guide PDF, the all-in-one ZIP). */
import PageHero from "@/components/PageHero";
import { LogoStage, Swatches, TypeTester, AboutBlocks } from "@/components/media/MediaBits";
import { SITE } from "@/lib/site";
import { BRAND_LOGOS, BRAND_ICONS, BRAND_FONTS, BRAND_FACTS, BRAND_DONTS, BRAND_KIT_ZIP, BRAND_GUIDE_PDF } from "@/lib/brand";

export const metadata = {
  title: "Media and brand kit",
  description: "Happy Drones logos, colours, fonts, about text and key facts, ready to download for press, partners and directories.",
  alternates: { canonical: "/media/" },
};

const DONT_STYLE = {
  stretch: { transform: "scaleX(1.45) scaleY(0.75)" },
  rotate: { transform: "rotate(-14deg)" },
  recolour: { filter: "hue-rotate(110deg) saturate(1.6)" },
  effects: { filter: "drop-shadow(4px 5px 0 rgba(0,0,0,.45)) drop-shadow(0 0 6px #FFD400)" },
};

function DlCard({ item, wide }) {
  return (
    <li className={`mk-dl ${wide ? "mk-dl-wide" : ""}`}>
      <div className="mk-dl-view" style={{ background: item.bg }}>
        <img src={`/media/${item.file}.svg`} alt={`${item.t} preview`} loading="lazy" />
      </div>
      <div className="mk-dl-body">
        <h3>{item.t}</h3>
        <p>{item.d}</p>
        <div className="mk-dl-btns">
          <a href={`/media/${item.file}.svg`} download>SVG</a>
          <a href={`/media/${item.file}.png`} download>PNG</a>
        </div>
      </div>
    </li>
  );
}

export default function MediaPage() {
  return (
    <div className="sub-page mk">
      <PageHero crumbs={[{ label: "Media and brand kit" }]} eyebrow="For press, partners and directories" title="Media and brand kit."
        lede="Everything you need to write about Happy Drones, list us as a supplier or put our logo next to yours: logos, colours, fonts, words and facts, all free to download.">
        <div className="mk-hero-ctas">
          <a className="btn btn-orange" href={BRAND_KIT_ZIP} download>Download the whole kit (ZIP)</a>
          <a className="btn btn-ghost" href={BRAND_GUIDE_PDF} download>Brand guide (PDF)</a>
        </div>
        <ul className="mk-jump" aria-label="On this page">
          <li><a href="#logo">Logo</a></li><li><a href="#colour">Colour</a></li><li><a href="#type">Type</a></li>
          <li><a href="#words">Words</a></li><li><a href="#facts">Facts</a></li><li><a href="#contact">Media contact</a></li>
        </ul>
      </PageHero>

      {/* LOGO */}
      <section className="mk-sec" id="logo" aria-labelledby="mk-logo-title">
        <div className="wrap">
          <p className="mk-eyebrow">01 · Logo</p>
          <h2 id="mk-logo-title" className="section-title">Try it on your background first.</h2>
          <p className="section-sub">Pick the background you&apos;re using and the right version is chosen for you. If you pick one that&apos;s hard to see, it says so.</p>
          <LogoStage />

          <h3 className="mk-h3">Every version</h3>
          <ul className="mk-dl-grid">{BRAND_LOGOS.map((l) => <DlCard key={l.id} item={l} wide />)}</ul>
          <h3 className="mk-h3">Drone mark and profile picture</h3>
          <ul className="mk-dl-grid mk-dl-grid-sq">{BRAND_ICONS.map((l) => <DlCard key={l.id} item={l} />)}</ul>
          <p className="mk-note">SVG files scale to any size without going blurry: use them for print and design work. PNGs have transparent backgrounds and are 2400 pixels wide (1024 or 1080 for the square ones).</p>

          <h3 className="mk-h3">Space and size</h3>
          <div className="mk-rules">
            <figure className="mk-rule">
              <div className="mk-space-demo"><img src="/media/happy-drones-logo.svg" alt="Logo with its clear space marked" /><span className="mk-x-l" aria-hidden="true">x</span></div>
              <figcaption><b>Clear space</b> Keep an empty margin round the logo at least a quarter of its height (x) on every side.</figcaption>
            </figure>
            <figure className="mk-rule">
              <div className="mk-min-demo">
                <img src="/media/happy-drones-logo.svg" alt="Logo at 24 pixels tall" style={{ height: 24 }} />
                <img src="/media/happy-drones-icon.svg" alt="Drone mark at 20 pixels" style={{ height: 20 }} />
              </div>
              <figcaption><b>Smallest size</b> The full logo no smaller than 24 pixels tall on screen or 8 mm in print. Below that, use the drone mark (at least 16 pixels or 5 mm).</figcaption>
            </figure>
          </div>

          <h3 className="mk-h3">Please don&apos;t</h3>
          <ul className="mk-donts">
            {BRAND_DONTS.map((d) => (
              <li key={d.id}>
                <div className={`mk-dont-view mk-dont-${d.id}`}>
                  <img src="/media/happy-drones-logo.svg" alt="" style={DONT_STYLE[d.id]} />
                  {d.id === "crowd" && <span className="mk-crowd" aria-hidden="true">BEST PRICES! CALL NOW!</span>}
                  <span className="mk-cross" aria-hidden="true">✕</span>
                </div>
                <p>{d.t}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* COLOUR */}
      <section className="mk-sec mk-sec-alt" id="colour" aria-labelledby="mk-colour-title">
        <div className="wrap">
          <p className="mk-eyebrow">02 · Colour</p>
          <h2 id="mk-colour-title" className="section-title">Navy leads. Orange flies.</h2>
          <p className="section-sub">Navy carries most of the weight; orange is the accent, used sparingly so it stands out. Click a colour to copy its code. The ratings show whether text in that colour is easy to read on white or navy (4.5:1 or more is good for normal text).</p>
          <Swatches />
          <div className="mk-ratio" aria-label="How much of each colour to use">
            <span style={{ flex: 50, background: "#003366" }}>Navy 50%</span>
            <span style={{ flex: 30, background: "#FFFFFF", color: "#003366" }}>White 30%</span>
            <span style={{ flex: 12, background: "#EAF1F8", color: "#003366" }}>Mist</span>
            <span style={{ flex: 8, background: "#FF6B35" }}>Orange</span>
          </div>
          <p className="mk-note">A rough guide to the balance on a page or poster. CMYK values are converted from the screen colours: ask your printer to match them on a proof.</p>
        </div>
      </section>

      {/* TYPE */}
      <section className="mk-sec" id="type" aria-labelledby="mk-type-title">
        <div className="wrap">
          <p className="mk-eyebrow">03 · Type</p>
          <h2 id="mk-type-title" className="section-title">Two free Google fonts.</h2>
          <p className="section-sub">Blinker for anything big and short. Lato for anything you read in sentences. Both are free for any use.</p>
          <div className="mk-fonts">
            {BRAND_FONTS.map((f) => (
              <article key={f.id} className="mk-font">
                <p className="mk-font-big" style={{ fontFamily: f.family, fontWeight: f.weights.at(-1)[0] }}>Aa</p>
                <div>
                  <h3 style={{ fontFamily: f.family }}>{f.name}</h3>
                  <p className="mk-font-role">{f.role}</p>
                  <p className="mk-font-w">{f.weights.map(([w, n]) => <span key={w} style={{ fontFamily: f.family, fontWeight: w }}>{n} {w}</span>)}</p>
                  <p className="mk-font-fb">If it isn&apos;t available: {f.fallback}.</p>
                  <a className="text-link" href={f.link} target="_blank" rel="noopener">Get {f.name} from Google Fonts</a>
                </div>
              </article>
            ))}
          </div>
          <TypeTester />
        </div>
      </section>

      {/* WORDS */}
      <section className="mk-sec mk-sec-alt" id="words" aria-labelledby="mk-words-title">
        <div className="wrap">
          <p className="mk-eyebrow">04 · Words</p>
          <h2 id="mk-words-title" className="section-title">About Happy Drones, ready to paste.</h2>
          <p className="section-sub">Use whichever length fits. Copy it as it is, or trim it to suit.</p>
          <AboutBlocks />
          <div className="mk-voice">
            <div>
              <h3>How we sound</h3>
              <ul className="ticks">
                <li>Plain and friendly, like a good tradesperson</li>
                <li>Specific: prices, times and what you get</li>
                <li>Calm and careful about safety, never boastful</li>
              </ul>
            </div>
            <div>
              <h3>Writing the name</h3>
              <ul className="mk-name">
                <li className="ok">Happy Drones</li>
                <li className="bad">HappyDrones</li>
                <li className="bad">Happy Drone</li>
                <li className="bad">HAPPY drones</li>
              </ul>
              <p className="mk-note">&quot;HD&quot; is fine on its own only where the logo is also shown.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FACTS */}
      <section className="mk-sec" id="facts" aria-labelledby="mk-facts-title">
        <div className="wrap mk-facts-wrap">
          <div>
            <p className="mk-eyebrow">05 · Facts</p>
            <h2 id="mk-facts-title" className="section-title">Key facts.</h2>
            <p className="section-sub">Checked and correct to quote. If you need something that isn&apos;t here, ask.</p>
          </div>
          <dl className="mk-facts">
            {BRAND_FACTS.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
          </dl>
        </div>
        <div className="wrap">
          <div className="mk-photos">
            <h3>Photos and footage</h3>
            <p>A library of real job photos and drone footage is on its way. If you need high-resolution images or b-roll for an article now, email and say what it&apos;s for.</p>
          </div>
          <div className="mk-terms">
            <h3>Using these files</h3>
            <p>You&apos;re welcome to use the logo and words to write about Happy Drones, link to us, or show that you work with us. Please use them as they are, and don&apos;t use them in a way that suggests we endorse a product, service or organisation without asking first.</p>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="mk-sec mk-contact" id="contact" aria-labelledby="mk-contact-title">
        <div className="wrap mk-contact-in">
          <div>
            <p className="mk-eyebrow">Media contact</p>
            <h2 id="mk-contact-title">Writing about drones, property or the North East?</h2>
            <p>Wayne Fox answers press and partnership questions himself, usually the same day.</p>
          </div>
          <div className="mk-contact-ways">
            {SITE.email && <a className="btn btn-orange" href={`mailto:${SITE.email}?subject=Media%20enquiry`}>{SITE.email}</a>}
            <a className="btn btn-ghost" href={`tel:${SITE.phone}`}>{SITE.phoneDisplay}</a>
          </div>
        </div>
      </section>
    </div>
  );
}
