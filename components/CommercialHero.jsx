"use client";
/* The homepage hero: an endless wireframe landscape flown at dawn.
   Ridgelines are generated from noise, projected in perspective and
   scrolled toward the camera. Moving the pointer banks the drone, and
   the telemetry readouts (ALT, GS, HDG, position) update live.
   Respects "reduce motion": draws one still frame instead. */
import Link from "next/link";
import { useEffect, useRef } from "react";
import { Arrow } from "./TIcons";
import { SITE } from "@/lib/site";

// Small, fast value noise so the terrain never repeats
function makeNoise(seed = 7) {
  const p = new Uint8Array(512);
  let s = seed;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const perm = [...Array(256).keys()].sort(() => rnd() - 0.5);
  for (let i = 0; i < 512; i++) p[i] = perm[i & 255];
  const fade = (t) => t * t * (3 - 2 * t);
  const val = (x, y) => (p[(p[x & 255] + y) & 255] / 255) * 2 - 1;
  return (x, y) => {
    const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
    const u = fade(xf), v = fade(yf);
    const a = val(xi, yi), b = val(xi + 1, yi), c = val(xi, yi + 1), d = val(xi + 1, yi + 1);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  };
}

export default function CommercialHero() {
  const ref = useRef(null);

  useEffect(() => {
    const cv = ref.current; const ctx = cv.getContext("2d");
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const n = makeNoise(11);
    const hud = {
      alt: document.getElementById("hud-alt"), gs: document.getElementById("hud-gs"),
      hdg: document.getElementById("hud-hdg"), pos: document.getElementById("hud-pos"),
    };
    let W = 0, H = 0, dpr = 1, z = 0, bank = 0, bankTarget = 0, raf = 0, visible = true, t0 = performance.now();

    const height = (x, zz) => {
      const a = n(x * 0.06, zz * 0.06) * 1.0 + n(x * 0.15 + 40, zz * 0.15) * 0.45 + n(x * 0.4 + 90, zz * 0.4) * 0.12;
      const valley = Math.min(1, Math.abs(x) / 9);           // a river valley down the middle
      return Math.max(-0.2, a) * (0.35 + valley * 1.3);
    };

    const resize = () => {
      const r = cv.getBoundingClientRect(); dpr = Math.min(2, devicePixelRatio || 1);
      W = r.width; H = r.height; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); if (reduce) draw(0);
    };

    function draw(time) {
      ctx.clearRect(0, 0, W, H);
      // sky: night above, first light at the horizon
      const horizon = H * 0.42;
      const sky = ctx.createLinearGradient(0, 0, 0, horizon + 40);
      sky.addColorStop(0, "#00101F"); sky.addColorStop(0.7, "#062A4D"); sky.addColorStop(1, "#3A3350");
      ctx.fillStyle = sky; ctx.fillRect(0, 0, W, horizon + 40);
      const glow = ctx.createRadialGradient(W * 0.68, horizon + 10, 0, W * 0.68, horizon + 10, W * 0.55);
      glow.addColorStop(0, "rgba(255,107,53,0.6)"); glow.addColorStop(0.25, "rgba(255,140,80,0.2)"); glow.addColorStop(1, "rgba(0,51,102,0)");
      ctx.fillStyle = glow; ctx.fillRect(0, 0, W, horizon + 60);
      const ground = ctx.createLinearGradient(0, horizon - 20, 0, H);
      ground.addColorStop(0, "rgba(58,51,80,0.9)"); ground.addColorStop(0.12, "#08243F"); ground.addColorStop(0.4, "#001A33"); ground.addColorStop(1, "#001A33");
      ctx.fillStyle = ground; ctx.fillRect(0, horizon - 20, W, H - horizon + 20);

      // stars
      for (let i = 0; i < 70; i++) {
        const sx = (i * 137.5) % W, sy = (i * 71.3) % (horizon * 0.8);
        ctx.fillStyle = `rgba(232,236,245,${0.15 + ((i * 13) % 10) / 25})`; ctx.fillRect(sx, sy, 1.2, 1.2);
      }

      ctx.save();
      ctx.translate(W / 2, horizon); ctx.rotate(bank * 0.06); ctx.translate(-W / 2, -horizon);
      const rows = 52, cols = 72, depth = 52, span = 40, camH = 3.4, f = Math.max(W, 700) * 0.62;
      const zOff = z % 1;
      for (let r = rows; r >= 1; r--) {
        const dz = r - zOff; if (dz < 0.6) continue;
        const wz = Math.floor(z) + r;
        const fade = 1 - dz / depth;
        ctx.beginPath();
        let started = false;
        for (let c = 0; c <= cols; c++) {
          const wx = (c / cols - 0.5) * span;
          const h = height(wx, wz) * 4.2;
          const sx = W / 2 + (wx * f) / dz;
          const sy = horizon + ((camH - h) * f) / dz * 0.5;
          if (!started) { ctx.moveTo(sx, sy); started = true; } else ctx.lineTo(sx, sy);
        }
        // fill below each ridge to hide lines behind it
        ctx.lineTo(W + 200, H + 200); ctx.lineTo(-200, H + 200); ctx.closePath();
        ctx.fillStyle = `rgb(${0 + Math.round(8 * (1 - fade))},${26 + Math.round(14 * (1 - fade))},${51 + Math.round(26 * (1 - fade))})`; ctx.fill();
        const warm = Math.max(0, 1 - dz / 14);
        ctx.strokeStyle = `rgba(${Math.round(90 + 165 * warm)},${Math.round(150 - 43 * warm)},${Math.round(215 - 162 * warm)},${0.14 + 0.75 * fade})`;
        ctx.lineWidth = 0.6 + fade * 1.1;
        ctx.stroke();
      }
      ctx.restore();

      // crosshair + target box (wide screens only, so it never sits on the text)
      if (W < 820) return;
      const cx = W * 0.68, cy = H * 0.58;
      ctx.strokeStyle = "rgba(232,236,245,0.55)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(cx - 14, cy); ctx.lineTo(cx - 5, cy); ctx.moveTo(cx + 5, cy); ctx.lineTo(cx + 14, cy); ctx.moveTo(cx, cy - 14); ctx.lineTo(cx, cy - 5); ctx.moveTo(cx, cy + 5); ctx.lineTo(cx, cy + 14); ctx.stroke();
      const pulse = reduce ? 0 : (Math.sin(time / 500) + 1) * 3;
      const bw = 70 + pulse, bh = 46 + pulse, bx = cx - bw / 2, by = cy - bh / 2, k = 10;
      ctx.strokeStyle = "rgba(255,107,53,0.95)"; ctx.lineWidth = 1.5;
      [[bx, by, 1, 1], [bx + bw, by, -1, 1], [bx, by + bh, 1, -1], [bx + bw, by + bh, -1, -1]].forEach(([x, y, a, b]) => { ctx.beginPath(); ctx.moveTo(x, y + k * b); ctx.lineTo(x, y); ctx.lineTo(x + k * a, y); ctx.stroke(); });
      ctx.fillStyle = "rgba(255,107,53,0.95)"; ctx.font = "600 11px 'Blinker', sans-serif";
      ctx.fillText("SITE LOCK · 312 m", bx, by - 8);
    }

    function hudTick(time) {
      const alt = 118 + Math.sin(time / 2400) * 4;
      const gs = 12.4 + Math.sin(time / 1700) * 0.8;
      const hdg = (334 + bank * 8 + 360) % 360;
      const lat = SITE.coords.lat + z * 0.00004, lon = SITE.coords.lon + bank * 0.0004;
      if (hud.alt) hud.alt.textContent = alt.toFixed(0) + " m";
      if (hud.gs) hud.gs.textContent = gs.toFixed(1) + " m/s";
      if (hud.hdg) hud.hdg.textContent = String(Math.round(hdg)).padStart(3, "0") + "°";
      if (hud.pos) hud.pos.textContent = `${lat.toFixed(4)}°N ${Math.abs(lon).toFixed(4)}°W`;
    }

    const loop = (now) => {
      raf = requestAnimationFrame(loop);
      if (!visible) return;
      const dt = Math.min(50, now - t0); t0 = now;
      z += dt * 0.0016; bank += (bankTarget - bank) * 0.04;
      draw(now); hudTick(now);
    };
    const onMove = (e) => { const x = e.touches ? e.touches[0].clientX : e.clientX; bankTarget = (x / innerWidth - 0.5) * 2; };

    resize();
    const ro = new ResizeObserver(resize); ro.observe(cv);
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; }); io.observe(cv);
    if (reduce) { draw(0); hudTick(0); }
    else { addEventListener("pointermove", onMove, { passive: true }); raf = requestAnimationFrame(loop); }
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); removeEventListener("pointermove", onMove); };
  }, []);

  return (
    <section className="t-hero" aria-labelledby="hero-title">
      <canvas className="t-hero-canvas" ref={ref} aria-hidden="true" />
      <div className="wrap">
        <div className="t-hero-in">
          <span className="t-live">Happy Drones Commercial · North East</span>
          <h1 id="hero-title">See it before <span className="t-thin">it&apos;s</span> finished.</h1>
          <p className="t-lede">Construction progress, mapping and 3D models, aerial film, inspections and events, flown on the Mavic 4 Pro, Mavic 3 and Matrice 4E. Planned properly, flown legally, delivered in days.</p>
          <div className="t-hero-ctas">
            <Link className="t-btn t-btn-primary" href="/plan/">Plan a mission <Arrow /></Link>
            <a className="t-btn t-btn-ghost" href="#missions">See commercial services</a>
          </div>
        </div>
        <div className="t-hud" aria-label="Live flight telemetry (illustration)">
          <div><small>ALT</small><b id="hud-alt">118 m</b></div>
          <div><small>GROUND SPEED</small><b id="hud-gs">12.4 m/s</b></div>
          <div><small>HEADING</small><b id="hud-hdg">334°</b></div>
          <div><small>POSITION</small><b id="hud-pos">54.9783°N 1.6178°W</b></div>
        </div>
      </div>
    </section>
  );
}
