"use client";
/* Media and brand kit: the interactive pieces on /media.
   LogoStage (try the logo on different backgrounds), CopyButton,
   Swatches (click to copy), TypeTester and AboutBlocks.
   Data comes from lib/brand.js; files from public/media. */
import { useState } from "react";
import { BRAND_LOGOS, BRAND_COLOURS, BRAND_FONTS, BRAND_ABOUT, contrast, rgbText, cmykText } from "@/lib/brand";

/* ---- Copy to clipboard ---- */
export function CopyButton({ text, label = "Copy", className = "" }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 1600); } catch { /* clipboard blocked: leave the text selectable */ }
  };
  return <button type="button" className={`mk-copy ${done ? "is-done" : ""} ${className}`} onClick={copy} aria-live="polite">{done ? "Copied" : label}</button>;
}

/* ---- Try the logo on a background ---- */
const BACKS = [
  { id: "white", t: "White", css: "#FFFFFF", test: "#FFFFFF", best: "colour" },
  { id: "mist", t: "Mist", css: "#EAF1F8", test: "#EAF1F8", best: "colour" },
  { id: "navy", t: "Navy", css: "#003366", test: "#003366", best: "reversed" },
  { id: "night", t: "Night", css: "#001A33", test: "#001A33", best: "reversed" },
  { id: "orange", t: "Orange", css: "#FF6B35", test: "#FF6B35", best: "white" },
  { id: "photo", t: "Photo", css: "linear-gradient(180deg, #5B7FA6 0%, #8FB0CF 46%, #4E6B3F 47%, #2F4A2A 100%)", test: "#5B7FA6", best: "reversed" },
];

export function LogoStage() {
  const [back, setBack] = useState("white");
  const [ver, setVer] = useState("colour");
  const [space, setSpace] = useState(false);
  const b = BACKS.find((x) => x.id === back);
  const v = BRAND_LOGOS.find((x) => x.id === ver);
  const worst = Math.min(...v.ink.map((c) => contrast(c, b.test)));
  const ok = worst >= 2;
  const best = BRAND_LOGOS.find((x) => x.id === b.best);

  const pickBack = (id) => { setBack(id); setVer(BACKS.find((x) => x.id === id).best); };

  return (
    <div className="mk-stage">
      <div className="mk-stage-view" style={{ background: b.css }}>
        <div className={`mk-stage-logo ${space ? "show-space" : ""}`}>
          <img src={`/media/${v.file}.svg`} alt={`${v.t} logo on ${b.t.toLowerCase()}`} width="1407" height="489" />
          {space && <span className="mk-x" aria-hidden="true">x</span>}
        </div>
        <p className={`mk-verdict ${ok ? "ok" : "bad"}`} aria-live="polite">
          {ok ? (ver === b.best ? "Recommended for this background" : "Readable, but there's a better match") : `Hard to see here. Use ${best.t.toLowerCase()} instead`}
        </p>
      </div>
      <div className="mk-stage-ctrl">
        <fieldset>
          <legend className="t-mono">BACKGROUND</legend>
          <div className="mk-chips">
            {BACKS.map((x) => (
              <button key={x.id} type="button" className={back === x.id ? "on" : undefined} aria-pressed={back === x.id} onClick={() => pickBack(x.id)}>
                <i style={{ background: x.css }} aria-hidden="true" />{x.t}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="t-mono">LOGO VERSION</legend>
          <div className="mk-chips">
            {BRAND_LOGOS.map((x) => (
              <button key={x.id} type="button" className={ver === x.id ? "on" : undefined} aria-pressed={ver === x.id} onClick={() => setVer(x.id)}>{x.t}</button>
            ))}
          </div>
        </fieldset>
        <label className="mk-toggle"><input type="checkbox" checked={space} onChange={(e) => setSpace(e.target.checked)} /> Show clear space</label>
        <div className="mk-stage-dl">
          <a className="btn btn-orange" href={`/media/${v.file}.svg`} download>Download SVG</a>
          <a className="btn btn-navy" href={`/media/${v.file}.png`} download>PNG</a>
        </div>
      </div>
    </div>
  );
}

/* ---- Colour swatches ---- */
export function Swatches() {
  return (
    <ul className="mk-swatches">
      {BRAND_COLOURS.map((c) => {
        const onWhite = contrast(c.hex, "#FFFFFF");
        const onNavy = contrast(c.hex, "#003366");
        const light = onWhite < 2;
        return (
          <li key={c.id} className="mk-sw">
            <div className="mk-sw-chip" style={{ background: c.hex, color: light ? "#003366" : "#FFFFFF" }}>
              <b>{c.hex}</b>
              <CopyButton text={c.hex} label="Copy hex" className={light ? "on-light" : ""} />
            </div>
            <div className="mk-sw-body">
              <h3>{c.name}</h3>
              <p>{c.use}</p>
              <dl>
                <div><dt>RGB</dt><dd>{rgbText(c.hex)}</dd></div>
                <div><dt>CMYK</dt><dd>{cmykText(c.hex)}<small> approx.</small></dd></div>
              </dl>
              <p className="mk-sw-ct">
                {c.id !== "white" && <span className={onWhite >= 4.5 ? "ok" : onWhite >= 3 ? "mid" : "bad"}>On white {onWhite.toFixed(1)}:1</span>}
                {c.id !== "navy" && <span className={onNavy >= 4.5 ? "ok" : onNavy >= 3 ? "mid" : "bad"}>On navy {onNavy.toFixed(1)}:1</span>}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/* ---- Type tester ---- */
export function TypeTester() {
  const [font, setFont] = useState("blinker");
  const f = BRAND_FONTS.find((x) => x.id === font);
  const [weight, setWeight] = useState("800");
  const [size, setSize] = useState(48);
  const [text, setText] = useState(f.sample);
  const pick = (id) => {
    const nf = BRAND_FONTS.find((x) => x.id === id);
    setFont(id); setWeight(nf.weights.at(-1)[0]); setText(nf.sample); setSize(id === "blinker" ? 48 : 22);
  };
  return (
    <div className="mk-type">
      <div className="mk-type-ctrl">
        <div className="mk-chips" role="group" aria-label="Font">
          {BRAND_FONTS.map((x) => <button key={x.id} type="button" className={font === x.id ? "on" : undefined} aria-pressed={font === x.id} onClick={() => pick(x.id)}>{x.name}</button>)}
        </div>
        <div className="mk-chips" role="group" aria-label="Weight">
          {f.weights.map(([w, n]) => <button key={w} type="button" className={weight === w ? "on" : undefined} aria-pressed={weight === w} onClick={() => setWeight(w)}>{n} {w}</button>)}
        </div>
        <label className="mk-size"><span className="t-mono">SIZE {size}px</span>
          <input type="range" min="14" max="88" value={size} onChange={(e) => setSize(+e.target.value)} />
        </label>
      </div>
      <textarea className="mk-type-area" value={text} onChange={(e) => setText(e.target.value)} rows={3} aria-label="Type your own words to preview"
        style={{ fontFamily: f.family, fontWeight: weight, fontSize: size, lineHeight: font === "blinker" ? 1.05 : 1.5 }} />
      <p className="mk-type-note">Type over the words to try your own. <a href={f.link} target="_blank" rel="noopener">{f.name} on Google Fonts</a>, free to download and use.</p>
    </div>
  );
}

/* ---- About text blocks ---- */
export function AboutBlocks() {
  return (
    <div className="mk-about">
      {BRAND_ABOUT.map((a) => (
        <div key={a.id} className="mk-about-item">
          <div className="mk-about-head"><h3>{a.t}</h3><CopyButton text={a.text} /></div>
          <p>{a.text}</p>
        </div>
      ))}
    </div>
  );
}
