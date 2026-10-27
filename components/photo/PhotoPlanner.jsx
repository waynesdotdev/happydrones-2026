"use client";
/* How many photos, and where do they go? Pick the bedrooms and a package and
   the contact sheet lays out roughly how the photos are shared between rooms,
   outside and the air, with the price. Counts and prices come from PACKAGES,
   PACKAGE_ROWS and PRICING in lib/site.js, so they match the packages. */
import { useState } from "react";
import { PACKAGES, PACKAGE_ROWS, PRICING, money } from "@/lib/site";

const range = (s) => { const m = String(s).match(/(\d+)\D+(\d+)/); return m ? [+m[1], +m[2]] : [+s || 0, +s || 0]; };
const ROW = (label) => PACKAGE_ROWS.find((r) => r[0] === label)?.slice(1) || [];
const sizeAdd = (beds) => { const sizes = PRICING.services[0].sizes; return beds <= 2 ? sizes[0].add : beds <= 4 ? sizes[1].add : sizes[2].add; };
const extra = (id) => PRICING.extras.find((x) => x.id === id);

function rooms(beds) {
  const r = [["Living room", 3], ["Kitchen", 3]];
  if (beds >= 3) r.push(["Dining", 1.5]);
  r.push(["Hall and stairs", 1]);
  for (let i = 1; i <= Math.min(beds, 5); i++) r.push([i === 1 ? "Main bedroom" : `Bedroom ${i}`, i === 1 ? 2 : 1]);
  r.push(["Bathroom", 1]);
  if (beds >= 3) r.push(["En-suite", 1]);
  if (beds >= 5) r.push(["Utility or study", 1]);
  return r;
}
function share(total, list) {
  const w = list.reduce((a, [, x]) => a + x, 0);
  const raw = list.map(([n, x]) => ({ n, v: Math.max(1, (total * x) / w) }));
  const out = raw.map((r) => ({ n: r.n, c: Math.floor(r.v), f: r.v % 1 }));
  let left = total - out.reduce((a, r) => a + r.c, 0);
  [...out].sort((a, b) => b.f - a.f).forEach((r) => { if (left > 0) { r.c++; left--; } });
  return out;
}

export default function PhotoPlanner() {
  const [beds, setBeds] = useState(3);
  const [pi, setPi] = useState(1);
  const [more, setMore] = useState(false);
  const [dusk, setDusk] = useState(false);
  const pkg = PACKAGES[pi];
  const svc = PRICING.services.find((s) => s.id === pkg.id);
  const duskIncluded = ROW("Dusk exterior photos")[pi] === "✓";
  const [lo, hi] = range(ROW("Interior & exterior photos")[pi]);
  const mid = Math.round((lo + hi) / 2) + (more ? 10 : 0);
  const aerials = range(ROW("Aerial photos")[pi])[0];
  const duskN = duskIncluded || dusk ? 3 : 0;
  const outside = pi === 0 ? 4 : 5;
  const inside = mid - outside - (duskIncluded ? duskN : 0);
  const groups = [
    { n: "Outside", c: outside, k: "out" },
    ...share(Math.max(inside, 1), rooms(beds)).map((g) => ({ ...g, k: "in" })),
    ...(duskN ? [{ n: "Dusk", c: duskN, k: "dusk" }] : []),
    { n: "From the air", c: aerials, k: "air" },
  ];
  const xMore = extra("extra10"), xDusk = extra("dusk");
  const price = svc.base + sizeAdd(beds) + (more ? xMore?.price || 0 : 0) + (dusk && !duskIncluded ? xDusk?.price || 0 : 0);
  const total = groups.reduce((a, g) => a + g.c, 0);

  return (
    <div className="pp-plan-tool">
      <div className="pp-pt-ctrl">
        <div>
          <p className="pp-pt-q">How many bedrooms?</p>
          <div className="pp-seg" role="group" aria-label="Bedrooms">
            {[1, 2, 3, 4, 5].map((n) => <button key={n} type="button" aria-pressed={beds === n} className={beds === n ? "on" : undefined} onClick={() => setBeds(n)}>{n === 5 ? "5+" : n}</button>)}
          </div>
        </div>
        <div>
          <p className="pp-pt-q">Which package?</p>
          <div className="pp-seg" role="group" aria-label="Package">
            {PACKAGES.map((p, i) => <button key={p.id} type="button" aria-pressed={pi === i} className={pi === i ? "on" : undefined} onClick={() => setPi(i)}>{p.title}</button>)}
          </div>
        </div>
        <div className="pp-pt-adds">
          {xMore && <label className="pp-tog"><input type="checkbox" checked={more} onChange={(e) => setMore(e.target.checked)} /> <span>{xMore.name} <b>+{money(xMore.price)}</b></span></label>}
          {xDusk && !duskIncluded && <label className="pp-tog"><input type="checkbox" checked={dusk} onChange={(e) => setDusk(e.target.checked)} /> <span>{xDusk.name} <b>+{money(xDusk.price)}</b></span></label>}
          {duskIncluded && <p className="pp-pt-inc">Dusk exteriors are included in {pkg.title}.</p>}
        </div>
        {beds >= 5 && !more && <p className="pp-pt-tip">Big house: most 5+ bed homes need the 10 extra photos so every room gets a shot.</p>}
      </div>
      <div className="pp-pt-sheet">
        <div className="pp-pt-head">
          <div><b>About {total}</b> photos<small>{mid} edited photos + {aerials} aerial</small></div>
          <div className="pp-pt-price"><b>{money(price)}</b><small>{pkg.title}{sizeAdd(beds) ? ` · ${beds >= 5 ? "5+" : "3–4"} bed +${money(sizeAdd(beds))}` : ""}</small></div>
        </div>
        <ul className="pp-pt-groups">
          {groups.map((g) => (
            <li key={g.n} className={`k-${g.k}`}>
              <span className="pp-pt-n">{g.n}<small>{g.c}</small></span>
              <span className="pp-pt-sq" aria-hidden="true">{Array.from({ length: g.c }, (_, i) => <i key={i} />)}</span>
            </li>
          ))}
        </ul>
        <p className="pp-pt-note">A guide to how the photos are usually shared out. On the day, the best rooms get more.</p>
      </div>
    </div>
  );
}
