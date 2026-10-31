"use client";
/* Interactive pieces for the local business page:
   HeroFeed (phone feed), MorningScroll (one morning fills a month's calendar),
   TypePicker, FormatGrid, ProfileCard (before/after) and PlanCalc.
   Words and numbers: lib/localBusiness.js. */
import { useEffect, useRef, useState } from "react";
import Storefront from "@/components/business/Storefront";
import RoomScene from "@/components/photo/RoomScene";
import KitIcon from "@/components/KitIcon";
import { LB_TYPES, LB_STAGES, LB_KIT_NAMES, LB_FORMATS, LB_PIECES, businessPrices } from "@/lib/localBusiness";
import { money } from "@/lib/site";

/* ---------- Hero: a phone scrolling a feed of the shoot ---------- */
const FEED = [
  { type: "cafe", cap: "Door to counter, one take", tag: "Reel" },
  { type: "gym", cap: "6am class, full send", tag: "TikTok" },
  { type: "venue", cap: "Golden hour at the station", tag: "Short" },
  { type: "salon", cap: "Fresh fade in 15 seconds", tag: "Reel" },
  { type: "trades", cap: "Finished, from the air", tag: "Short" },
];
export function HeroFeed() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setI((v) => (v + 1) % FEED.length), 2600);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="lb-hero" role="img" aria-label="Illustration: a phone scrolling through short vertical videos of local businesses">
      <div className="lb-phone">
        <div className="lb-feed" style={{ transform: `translateY(-${i * 100}%)` }}>
          {FEED.map((f, n) => {
            const t = LB_TYPES.find((x) => x.id === f.type);
            return (
              <div className="lb-post" key={n}>
                <Storefront type={t} drone={n % 2 === 0} cover />
                <div className="lb-post-ui"><span className="lb-post-tag">{f.tag}</span><b>{t.sign}</b><span>{f.cap}</span></div>
                <div className="lb-post-icons" aria-hidden="true"><i /><i /><i /></div>
              </div>
            );
          })}
        </div>
        <span className="lb-notch" aria-hidden="true" />
      </div>
      <div className="lb-hero-badges" aria-hidden="true">
        <span>3–5 clips</span><span>60 s film</span><span>15+ photos</span>
      </div>
    </div>
  );
}

/* ---------- One morning fills a month ---------- */
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
// spread the posts across the month: week by week, then day by day
const ORDER = Array.from({ length: 24 }, (_, i) => (i % 4) * 6 + [0, 2, 4, 1, 3, 5][Math.floor(i / 4)]);
const TILE = { p: "Photo", c: "Clip", f: "Film", x: "Add-on" };
export function MorningScroll() {
  const wrapRef = useRef(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = wrapRef.current.getBoundingClientRect(); const travel = r.height - innerHeight;
        setP(travel > 0 ? Math.min(1, Math.max(0, -r.top / travel)) : 0);
      });
    };
    addEventListener("scroll", on, { passive: true }); on();
    return () => { removeEventListener("scroll", on); cancelAnimationFrame(raf); };
  }, []);
  const idx = LB_STAGES.reduce((a, s, i) => (p >= s.at ? i : a), 0);
  const cur = LB_STAGES[idx];
  const tiles = LB_STAGES.slice(0, idx + 1).flatMap((s, si) => s.add.map(([k, l]) => ({ k, l, si })));
  const slots = Array(24).fill(null);
  tiles.forEach((t, n) => { if (n < 24) slots[ORDER[n]] = t; });
  const count = (k) => tiles.filter((t) => t.k === k).length;
  return (
    <section className="cx-scroll lb-scroll" ref={wrapRef} aria-labelledby="lb-scroll-title">
      <div className="cx-sticky">
        <div className="wrap cx-scroll-in">
          <div className="cx-scroll-copy">
            <span className="t-tag">Scroll through the morning</span>
            <h2 id="lb-scroll-title">One morning. A month of posts.</h2>
            <div className="cx-stage" key={idx}>
              <p className="cx-stage-kicker t-mono">{cur.time}{cur.kit ? ` · ${LB_KIT_NAMES[cur.kit].toUpperCase()}` : " · EDITING"}</p>
              <h3>{cur.t}</h3>
              <p>{cur.d}</p>
            </div>
            <ol className="cx-dots lb-dots" aria-label="Shoot timeline">{LB_STAGES.map((s, i) => <li key={s.time} className={i <= idx ? "on" : undefined}><span className="t-mono">{s.time}</span></li>)}</ol>
          </div>
          <figure className="cx-scroll-stage t-frame lb-cal">
            <div className="lb-cal-head">
              <span className="t-mono">YOUR NEXT 4 WEEKS</span>
              <span className="lb-cal-kit">{cur.kit && <KitIcon id={cur.kit} />}</span>
            </div>
            <div className="lb-cal-days" aria-hidden="true">{DAYS.map((d) => <span key={d}>{d}</span>)}</div>
            <div className="lb-cal-grid">
              {slots.map((t, n) => (
                <div key={n} className={t ? `lb-tile k-${t.k}${t.si === idx ? " new" : ""}` : "lb-tile empty"} title={t ? `${TILE[t.k]}: ${t.l}` : undefined}>
                  {t && <><b>{TILE[t.k]}</b><small>{t.l}</small></>}
                </div>
              ))}
            </div>
            <figcaption className="cx-scroll-cap lb-cal-count">
              <span><i className="k-p" />{count("p")} photos</span><span><i className="k-c" />{count("c")} clips</span>
              <span><i className="k-f" />{count("f")} film</span><span><i className="k-x" />{count("x")} add-on</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

/* ---------- Pick your kind of business ---------- */
export function TypePicker() {
  const [id, setId] = useState("cafe");
  const t = LB_TYPES.find((x) => x.id === id);
  return (
    <div className="lb-types">
      <div className="lb-type-tabs" role="tablist" aria-label="Kind of business">
        {LB_TYPES.map((x) => <button key={x.id} type="button" role="tab" aria-selected={id === x.id} className={id === x.id ? "on" : undefined} onClick={() => setId(x.id)}>{x.name}</button>)}
      </div>
      <div className="lb-type" key={id} role="tabpanel">
        <figure className="lb-type-art"><Storefront type={t} drone /></figure>
        <div className="lb-type-info">
          <p className="ea-eyebrow">The clip that does best</p>
          <h3>{t.hero}</h3>
          <p className="lb-type-lk">On the shot list</p>
          <ul className="cp-chips">{t.shots.map((s, n) => <li key={s} style={{ "--n": n }}>{s}</li>)}</ul>
          <p className="lb-type-tip"><b>Tip:</b> {t.tip}</p>
        </div>
      </div>
    </div>
  );
}

/* ---------- One shot, every shape ---------- */
export function FormatGrid() {
  const [f, setF] = useState("9x16");
  const cur = LB_FORMATS.find((x) => x.id === f);
  const w = Math.min(100, ((cur.w / cur.h) / (16 / 9)) * 100);
  return (
    <div className="lb-fmt">
      <div className="lb-fmt-tabs" role="group" aria-label="Format">
        {LB_FORMATS.map((x) => (
          <button key={x.id} type="button" aria-pressed={f === x.id} className={f === x.id ? "on" : undefined} onClick={() => setF(x.id)}>
            <span className="lb-fmt-ico" style={{ aspectRatio: `${x.w} / ${x.h}` }} aria-hidden="true" /><b>{x.name}</b><small>{x.where}</small>
          </button>
        ))}
      </div>
      <div className="lb-fmt-stage" role="img" aria-label={`The same café shot framed ${cur.name} for ${cur.where}`}>
        <Storefront type={LB_TYPES[0]} drone cover />
        <div className="lb-fmt-win" style={{ width: `${w}%` }} aria-hidden="true"><span>{cur.name}</span></div>
      </div>
    </div>
  );
}

/* ---------- Your map listing, before and after ---------- */
export function ProfileCard() {
  const [after, setAfter] = useState(true);
  const t = LB_TYPES[0];
  return (
    <div className="lb-prof">
      <div className="lb-prof-toggle" role="group" aria-label="Before or after">
        <button type="button" aria-pressed={!after} className={!after ? "on" : undefined} onClick={() => setAfter(false)}>Before</button>
        <button type="button" aria-pressed={after} className={after ? "on" : undefined} onClick={() => setAfter(true)}>After one shoot</button>
      </div>
      <div className={`lb-prof-card${after ? " after" : ""}`}>
        <div className="lb-prof-head">
          <b>The Corner Café</b><span>Café · Example Street</span>
          <span className="lb-prof-btns" aria-hidden="true"><i>Directions</i><i>Call</i><i>Website</i></span>
        </div>
        <div className="lb-prof-photos">
          {after ? (
            <>
              <div className="big"><Storefront type={t} drone cover label="Cover photo: the café from the street" /><span>Cover</span></div>
              <div><Storefront type={t} cover label="Frontage" /><span>Outside</span></div>
              <div><RoomScene room="kitchen" cover label="Inside: the counter and kitchen" /><span>Inside</span></div>
              <div className="ph-team"><span>Team</span></div>
              <div className="ph-vid"><span>▶ Video</span></div>
            </>
          ) : (
            <>
              <div className="big blurry"><Storefront type={t} cover label="An old, dark phone photo of the café" /><span>2019</span></div>
              <div className="none"><span>No photos</span></div>
              <div className="none"><span>No photos</span></div>
              <div className="none"><span>No photos</span></div>
              <div className="none"><span>No video</span></div>
            </>
          )}
        </div>
        <p className="lb-prof-note">{after ? "A proper cover photo, the outside so people can find you, the inside so they know what to expect, the team, and a short video." : "One old photo taken on a phone. It's often the first thing a new customer sees."}</p>
      </div>
    </div>
  );
}

/* ---------- What it costs ---------- */
export function PlanCalc() {
  const bp = businessPrices();
  const [size, setSize] = useState("small");
  const [freq, setFreq] = useState("quarterly");
  if (!bp) return null;
  const r = bp.price(size, freq);
  const pieces = LB_PIECES * r.visits;
  return (
    <div className="lb-calc">
      <div className="lb-calc-ctrl">
        <p className="pp-pt-q">How big is the business?</p>
        <div className="pp-seg lb-seg-col" role="group" aria-label="Size">
          {bp.sizes.map((s) => <button key={s.id} type="button" aria-pressed={size === s.id} className={size === s.id ? "on" : undefined} onClick={() => setSize(s.id)}><b>{s.name}</b><small>{s.note}</small></button>)}
        </div>
        <p className="pp-pt-q">How often?</p>
        <div className="pp-seg" role="group" aria-label="How often">
          {bp.freqs.map((f) => <button key={f.id} type="button" aria-pressed={freq === f.id} className={freq === f.id ? "on" : undefined} onClick={() => setFreq(f.id)}>{f.name}</button>)}
        </div>
      </div>
      <div className="lb-calc-out">
        <div><small>Per visit</small><b>{money(r.per)}</b>{r.disc > 0 && <em>save {Math.round(r.disc * 100)}%</em>}</div>
        <div><small>{r.visits > 1 ? `${r.visits} visits` : "One visit"}</small><b>{money(r.total)}</b></div>
        <div><small>Pieces of content</small><b>about {pieces}</b></div>
        <div className="hi"><small>Per piece of content</small><b>about {money(Math.round(r.total / pieces))}</b></div>
        <p>Guide prices, before any add-ons and travel outside the core area. You get a fixed price in writing first.</p>
      </div>
    </div>
  );
}
