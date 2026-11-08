"use client";
/* The /map page: where a planned job is.
   Opened from the "Map" link in a mission plan email:
   /map/?pc=TS17+6AB&lat=54.55&lon=-1.31&c=HD-AB12-CON
   Shows a close-up of the site, an area map with the trip from base,
   reference details (area, distance, travel zone, OS grid ref), and
   buttons that open the spot in Google Maps or the phone's own maps app.
   Helpers: lib/siteMap.js */
import { useEffect, useMemo, useRef, useState } from "react";
import { SITE, travelFor } from "@/lib/site";
import { lookupPostcode, milesBetween, gridRef, mapLinks, toWorld, fitZoom, tidyPostcode } from "@/lib/siteMap";

const TILE = 256;
const tileUrl = (z, x, y) => `https://tile.openstreetmap.org/${z}/${x}/${y}.png`;

/* A plain tile map. Points are drawn on top; the whole map is a link. */
function TileMap({ center, zoom, points = [], line, href, label, tall }) {
  const box = useRef(null);
  const [size, setSize] = useState({ w: 600, h: tall ? 380 : 300 });
  useEffect(() => {
    const el = box.current; if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const c = toWorld(center.lat, center.lon, zoom);
  const n = 2 ** zoom;
  const x0 = Math.floor((c.x - size.w / 2) / TILE), x1 = Math.floor((c.x + size.w / 2) / TILE);
  const y0 = Math.floor((c.y - size.h / 2) / TILE), y1 = Math.floor((c.y + size.h / 2) / TILE);
  const tiles = [];
  for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) {
    if (y < 0 || y >= n) continue;
    tiles.push({ k: `${x}-${y}`, src: tileUrl(zoom, ((x % n) + n) % n, y), left: x * TILE - c.x, top: y * TILE - c.y });
  }
  const at = (p) => { const w = toWorld(p.lat, p.lon, zoom); return { x: w.x - c.x, y: w.y - c.y }; };

  return (
    <a className={`sm-map${tall ? " sm-tall" : ""}`} ref={box} href={href} target="_blank" rel="noopener" aria-label={label}>
      <span className="sm-tiles">
        {tiles.map((t) => <img key={t.k} src={t.src} alt="" width={TILE} height={TILE} style={{ left: `calc(50% + ${t.left}px)`, top: `calc(50% + ${t.top}px)` }} />)}
      </span>
      {line && (() => { const a = at(line[0]), b = at(line[1]); return (
        <svg className="sm-line" width="1" height="1" aria-hidden="true"><line x1={a.x} y1={a.y} x2={b.x} y2={b.y} /></svg>
      ); })()}
      {points.map((p) => { const q = at(p); return (
        <span key={p.kind} className={`sm-pt sm-${p.kind}`} style={{ left: `calc(50% + ${q.x}px)`, top: `calc(50% + ${q.y}px)` }}>
          <i aria-hidden="true"></i>{p.tag && <b>{p.tag}</b>}
        </span>
      ); })}
      <span className="sm-open">Open in maps ↗</span>
    </a>
  );
}

export default function SiteMapView() {
  const [q, setQ] = useState(null);       // what the link asked for
  const [site, setSite] = useState(null);  // looked-up details
  const [base, setBase] = useState(null);
  const [phone, setPhone] = useState("desktop");
  const [copied, setCopied] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    const p = new URLSearchParams(location.search);
    const lat = parseFloat(p.get("lat")), lon = parseFloat(p.get("lon"));
    const pc = tidyPostcode(p.get("pc") || "");
    setQ({ pc, code: p.get("c") || "", lat: Number.isFinite(lat) ? lat : null, lon: Number.isFinite(lon) ? lon : null });
    const ua = navigator.userAgent;
    setPhone(/iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1) ? "ios" : /Android/.test(ua) ? "android" : "desktop");
    if (!pc && !Number.isFinite(lat)) { setErr("This map link has no postcode in it."); return; }
    lookupPostcode(SITE.basePostcode).then(setBase);
    lookupPostcode(pc).then((s) => {
      if (s) setSite(Number.isFinite(lat) ? { ...s, lat, lon } : s);
      else if (Number.isFinite(lat)) setSite({ postcode: pc, lat, lon, area: (pc.match(/^[A-Z]+/) || [""])[0] });
      else setErr(`Couldn't find ${pc}. Check the postcode in the email.`);
    });
  }, []);

  const links = useMemo(() => site && mapLinks({ lat: site.lat, lon: site.lon, label: `${q?.code ? q.code + " " : ""}${site.postcode}` }), [site, q]);
  const miles = site && base ? milesBetween(base, site) : null;
  const travel = site ? travelFor(site.area) : null;
  const grid = site?.e != null ? gridRef(site.e, site.n, 10) : "";
  const appLink = links && (phone === "ios" ? links.apple : phone === "android" ? links.geo : links.apple);
  const appName = phone === "ios" ? "Apple Maps" : phone === "android" ? "your maps app" : "Apple Maps";

  const copy = async (text) => {
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {}
  };

  return (
    <div className="sm-app">
      <header className="sm-head">
        <a className="sm-brand" href="/">Happy Drones</a>
        <span className="t-mono">Site map{q?.code ? ` · ${q.code}` : ""}</span>
      </header>

      {err && <p className="sm-err">{err}</p>}
      {!err && !site && <p className="sm-wait">Finding {q?.pc || "the site"}…</p>}

      {site && (
        <>
          <section className="sm-title">
            <h1>{site.postcode}</h1>
            <p>{[site.ward, site.district].filter(Boolean).join(", ") || "Location from the plan"}{!site.full && site.e != null ? " · whole postcode district (only the first half was given)" : ""}</p>
          </section>

          <div className="sm-grid">
            <figure className="sm-fig">
              <TileMap tall center={site} zoom={site.full === false ? 13 : 16} points={[{ ...site, kind: "site" }]} href={links.google} label="Open the site in Google Maps" />
              <figcaption>The site{site.full === false ? " area" : ""}. Tap the map to open it in Google Maps.</figcaption>
            </figure>

            <figure className="sm-fig">
              {base ? (
                <TileMap
                  center={{ lat: (base.lat + site.lat) / 2, lon: (base.lon + site.lon) / 2 }}
                  zoom={fitZoom(base, site, 420, 300, 14)}
                  points={[{ ...base, kind: "base", tag: "Base" }, { ...site, kind: "site", tag: site.postcode }]}
                  line={[base, site]}
                  href={links.directions(base)}
                  label="Directions from base in Google Maps"
                />
              ) : <div className="sm-map sm-blank" />}
              <figcaption>From base ({SITE.basePostcode}). Tap for directions.</figcaption>
            </figure>
          </div>

          <dl className="sm-facts">
            <div><dt>Area</dt><dd>{[site.ward, site.district].filter(Boolean).join(", ") || "—"}</dd></div>
            <div><dt>From base</dt><dd>{miles != null ? `${miles.toFixed(1)} miles in a straight line` : "—"}</dd></div>
            <div><dt>Travel</dt><dd>{travel ? (travel.fee ? `${travel.name}: +£${travel.fee} a visit` : `${travel.name}: included`) : "Outside the travel zones: quote travel"}</dd></div>
            <div><dt>Grid ref</dt><dd>{grid ? <button type="button" className="sm-copy" onClick={() => copy(grid.replace(/ /g, ""))}>{grid} <small>{copied ? "copied" : "copy"}</small></button> : "—"}</dd></div>
            <div><dt>Lat, long</dt><dd><button type="button" className="sm-copy" onClick={() => copy(`${site.lat.toFixed(5)}, ${site.lon.toFixed(5)}`)}>{site.lat.toFixed(5)}, {site.lon.toFixed(5)} <small>{copied ? "copied" : "copy"}</small></button></dd></div>
          </dl>

          <div className="sm-actions">
            <a className="t-btn t-btn-primary" href={links.google} target="_blank" rel="noopener">Open in Google Maps</a>
            <a className="t-btn t-btn-ghost" href={appLink} target={phone === "android" ? undefined : "_blank"} rel="noopener">Open in {appName}</a>
            {base && <a className="t-btn t-btn-ghost" href={links.directions(base)} target="_blank" rel="noopener">Directions from base</a>}
            <a className="t-btn t-btn-ghost" href={`/weather-check/`}>Weather check</a>
          </div>

          <p className="sm-note">Postcodes cover a few buildings, so the pin is the middle of the postcode, not the exact roof. Check the airspace before quoting. Map © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors.</p>
        </>
      )}
    </div>
  );
}
