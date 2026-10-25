/* =========================================================
   The homepage flyover: a little town drawn from above in brand
   navy, generated tile by tile so the drone can fly forever.
   Called once by Hero.jsx. You shouldn't need to edit this.
   ========================================================= */

export function startFlyover({ canvas, hero, hud, lock, lockLabel }) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  
  const ctx = canvas.getContext("2d");

  const TILE = 512;
  const ROAD = 38;
  const C = {
    grass: "#0B3E6B", grass2: "#0D4473", garden: "#0F477A",
    road: "#002A54", line: "#3D6E9E", pave: "#1B5486",
    roofA: "#5A8CBD", roofB: "#4D7FB0", ridge: "#2F6293", shadow: "#012447",
    tree: "#0A3560", treeHi: "#165089", water: "#00213F", waterHi: "#0A3A66",
    flat: "#6B98C4", car: ["#C9D8E8", "#8FB0CF", "#E8EEF5", "#3A6B9C"],
    field1: "#0F4677", field2: "#0C406E",
  };

  // Seeded random numbers so each tile always looks the same
  const seedFor = (x, y) => {
    let h = (x * 374761393 + y * 668265263) ^ 0x5bd1e995;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return (h ^ (h >>> 16)) >>> 0;
  };
  const rng = (seed) => () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const cache = new Map();

  function drawTree(g, x, y, r) {
    g.fillStyle = C.shadow; g.beginPath(); g.arc(x + r * 0.35, y + r * 0.35, r, 0, 7); g.fill();
    g.fillStyle = C.tree; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
    g.fillStyle = C.treeHi; g.beginPath(); g.arc(x - r * 0.3, y - r * 0.3, r * 0.45, 0, 7); g.fill();
  }

  function drawHouse(g, x, y, w, h, R) {
    g.fillStyle = C.shadow; g.fillRect(x + 5, y + 5, w, h);
    const horizontal = w >= h;
    g.fillStyle = C.roofA; g.fillRect(x, y, w, h);
    g.fillStyle = C.roofB;
    if (horizontal) g.fillRect(x, y + h / 2, w, h / 2); else g.fillRect(x + w / 2, y, w / 2, h);
    g.strokeStyle = C.ridge; g.lineWidth = 2; g.beginPath();
    if (horizontal) { g.moveTo(x + 4, y + h / 2); g.lineTo(x + w - 4, y + h / 2); }
    else { g.moveTo(x + w / 2, y + 4); g.lineTo(x + w / 2, y + h - 4); }
    g.stroke();
    // chimney or skylight sometimes
    if (R() < 0.5) { g.fillStyle = C.ridge; g.fillRect(x + w * 0.2, y + h * 0.15, 6, 6); }
    // rear extension sometimes
    if (R() < 0.35) {
      const ew = w * 0.45, eh = 12;
      g.fillStyle = C.shadow; g.fillRect(x + 4 + 4, y + h + 4, ew, eh);
      g.fillStyle = C.flat; g.fillRect(x + 4, y + h, ew, eh);
    }
  }

  function buildTile(tx, ty) {
    const R = rng(seedFor(tx, ty));
    const c = document.createElement("canvas");
    c.width = c.height = TILE;
    const g = c.getContext("2d");
    const houses = [];

    g.fillStyle = C.grass; g.fillRect(0, 0, TILE, TILE);

    const roll = R();
    const inner = { x: ROAD, y: ROAD, w: TILE - ROAD, h: TILE - ROAD };

    if (roll < 0.66) {
      // ---- Residential: rows of houses with back gardens
      const rows = 4;
      const rowH = inner.h / rows;
      for (let r = 0; r < rows; r++) {
        const y0 = inner.y + r * rowH;
        // garden strip
        g.fillStyle = r % 2 ? C.garden : C.grass2;
        g.fillRect(inner.x, y0, inner.w, rowH);
        // front pavement on the side facing the row
        g.fillStyle = C.pave; g.fillRect(inner.x, y0, inner.w, 4);
        let x = inner.x + 10 + R() * 10;
        while (x < inner.x + inner.w - 50) {
          const w = 40 + R() * 26;
          const h = 30 + R() * 10;
          const hy = y0 + 12;
          drawHouse(g, x, hy, w, h, R);
          houses.push({ x: tx * TILE + x, y: ty * TILE + hy, w, h });
          // fence line between gardens
          g.fillStyle = C.road; g.globalAlpha = 0.5;
          g.fillRect(x + w + 6, y0 + 8, 2, rowH - 12);
          g.globalAlpha = 1;
          // garden trees
          if (R() < 0.55) drawTree(g, x + w * R(), y0 + rowH - 22 - R() * 12, 9 + R() * 7);
          // driveway car
          if (R() < 0.3) { g.fillStyle = C.car[(R() * 4) | 0]; g.fillRect(x + w + 10, y0 + 14, 11, 20); }
          x += w + 18 + R() * 14;
        }
      }
    } else if (roll < 0.8) {
      // ---- Park with a pond and paths
      g.fillStyle = C.grass2; g.fillRect(inner.x, inner.y, inner.w, inner.h);
      g.strokeStyle = C.pave; g.lineWidth = 7; g.lineCap = "round";
      g.beginPath(); g.moveTo(inner.x, inner.y + inner.h * R());
      g.bezierCurveTo(TILE * 0.4, TILE * R(), TILE * 0.6, TILE * R(), TILE, inner.y + inner.h * R()); g.stroke();
      const px = TILE * (0.35 + R() * 0.3), py = TILE * (0.35 + R() * 0.3);
      g.fillStyle = C.water; g.beginPath(); g.ellipse(px, py, 70 + R() * 40, 45 + R() * 25, R() * 3, 0, 7); g.fill();
      g.strokeStyle = C.waterHi; g.lineWidth = 2;
      for (let i = 0; i < 3; i++) { g.beginPath(); g.ellipse(px, py, 30 + i * 14, 14 + i * 7, 0.4, 0.3, 1.6); g.stroke(); }
      for (let i = 0; i < 26; i++) {
        const tx2 = inner.x + R() * inner.w, ty2 = inner.y + R() * inner.h;
        if (Math.hypot(tx2 - px, ty2 - py) > 95) drawTree(g, tx2, ty2, 10 + R() * 12);
      }
    } else if (roll < 0.9) {
      // ---- Fields
      for (let i = 0; i < 18; i++) {
        g.fillStyle = i % 2 ? C.field1 : C.field2;
        g.fillRect(inner.x, inner.y + (i * inner.h) / 18, inner.w, inner.h / 18 + 1);
      }
      g.fillStyle = C.tree;
      for (let i = 0; i < 14; i++) drawTree(g, inner.x + 8 + R() * 16, inner.y + (i * inner.h) / 14 + 10, 9 + R() * 4);
    } else {
      // ---- Commercial: big warehouse roof + car park
      const bx = inner.x + 30, by = inner.y + 30, bw = inner.w - 60, bh = inner.h * 0.45;
      g.fillStyle = C.shadow; g.fillRect(bx + 8, by + 8, bw, bh);
      g.fillStyle = C.flat; g.fillRect(bx, by, bw, bh);
      g.strokeStyle = C.roofB; g.lineWidth = 2;
      for (let i = 1; i < 10; i++) { g.beginPath(); g.moveTo(bx + (i * bw) / 10, by + 6); g.lineTo(bx + (i * bw) / 10, by + bh - 6); g.stroke(); }
      houses.push({ x: tx * TILE + bx, y: ty * TILE + by, w: bw, h: bh, big: true });
      const ly = by + bh + 26;
      g.fillStyle = C.road; g.fillRect(inner.x + 20, ly, inner.w - 40, inner.h - (ly - inner.y) - 20);
      g.strokeStyle = C.line; g.lineWidth = 2;
      for (let x = inner.x + 30; x < TILE - 30; x += 22) {
        g.beginPath(); g.moveTo(x, ly + 6); g.lineTo(x, ly + 40); g.stroke();
        if (R() < 0.5) { g.fillStyle = C.car[(R() * 4) | 0]; g.fillRect(x + 5, ly + 12, 12, 22); }
      }
    }

    // ---- Roads on the top and left edge of every tile make a street grid
    g.fillStyle = C.road;
    g.fillRect(0, 0, TILE, ROAD);
    g.fillRect(0, 0, ROAD, TILE);
    g.fillStyle = C.pave;
    g.fillRect(0, ROAD - 3, TILE, 3);
    g.fillRect(ROAD - 3, 0, 3, TILE);
    g.strokeStyle = C.line; g.lineWidth = 2; g.setLineDash([14, 12]);
    g.beginPath(); g.moveTo(ROAD, ROAD / 2); g.lineTo(TILE, ROAD / 2); g.stroke();
    g.beginPath(); g.moveTo(ROAD / 2, ROAD); g.lineTo(ROAD / 2, TILE); g.stroke();
    g.setLineDash([]);
    // a few cars on the road
    for (let i = 0; i < 3; i++) {
      if (R() < 0.6) { g.fillStyle = C.car[(R() * 4) | 0]; g.fillRect(ROAD + 20 + R() * (TILE - 80), R() < 0.5 ? 5 : 22, 22, 11); }
      if (R() < 0.6) { g.fillStyle = C.car[(R() * 4) | 0]; g.fillRect(R() < 0.5 ? 5 : 22, ROAD + 20 + R() * (TILE - 80), 11, 22); }
    }

    return { canvas: c, houses };
  }

  function getTile(tx, ty) {
    const key = tx + "," + ty;
    let t = cache.get(key);
    if (!t) {
      t = buildTile(tx, ty);
      cache.set(key, t);
      if (cache.size > 90) cache.delete(cache.keys().next().value);
    }
    return t;
  }

  // ---- Camera
  let W = 0, H = 0, DPR = 1;
  const cam = { x: 0, y: 0, heading: -0.6 };
  let baseScale = 1;
  let hudOffset = { x: 0, y: 0 };
  let copyTop = 0; // where the headline starts: the lock never goes below this

  function resize() {
    DPR = Math.min(devicePixelRatio || 1, 2);
    W = hero.clientWidth; H = hero.clientHeight;
    canvas.width = Math.round(W * DPR); canvas.height = Math.round(H * DPR);
    baseScale = W < 700 ? 0.85 : 1.15;
    const hr = hud.getBoundingClientRect(), cr = canvas.getBoundingClientRect();
    hudOffset = { x: hr.left - cr.left, y: hr.top - cr.top };
    copyTop = hero.querySelector("h1").getBoundingClientRect().top - cr.top;
  }

  let altProgress = 0;
  const scale = () => baseScale * (1 - altProgress * 0.5);

  function worldToScreen(wx, wy) {
    const s = scale();
    const dx = (wx - cam.x) * s, dy = (wy - cam.y) * s;
    const a = -cam.heading;
    return {
      x: W / 2 + dx * Math.cos(a) - dy * Math.sin(a),
      y: H / 2 + dx * Math.sin(a) + dy * Math.cos(a),
    };
  }

  function render() {
    const s = scale();
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.fillStyle = C.grass; ctx.fillRect(0, 0, W, H);
    ctx.save();
    ctx.translate(W / 2, H / 2);
    ctx.rotate(-cam.heading);
    ctx.scale(s, s);
    ctx.translate(-cam.x, -cam.y);
    const radius = Math.hypot(W, H) / 2 / s + TILE;
    const x0 = Math.floor((cam.x - radius) / TILE), x1 = Math.floor((cam.x + radius) / TILE);
    const y0 = Math.floor((cam.y - radius) / TILE), y1 = Math.floor((cam.y + radius) / TILE);
    for (let ty = y0; ty <= y1; ty++) {
      for (let tx = x0; tx <= x1; tx++) {
        ctx.drawImage(getTile(tx, ty).canvas, tx * TILE, ty * TILE, TILE + 0.5, TILE + 0.5);
      }
    }
    ctx.restore();
  }

  // ---- "Your place?" target lock
  const labels = ["Your listing?", "Front aspect", "Garden & plot", "Your listing?", "Listing shot"];
  let target = null, lockUntil = 0, nextLock = 2500, labelIndex = 0;

  function pickTarget() {
    const s = scale();
    let best = null, bestD = Infinity;
    const tx0 = Math.floor(cam.x / TILE) - 1, ty0 = Math.floor(cam.y / TILE) - 1;
    for (let ty = ty0; ty <= ty0 + 2; ty++) for (let tx = tx0; tx <= tx0 + 2; tx++) {
      for (const h of getTile(tx, ty).houses) {
        if (h.big) continue;
        const p = worldToScreen(h.x + h.w / 2, h.y + h.h / 2);
        // look slightly ahead (up the screen) and off-centre so it doesn't sit under the crosshair
        // keep the lock in the upper part of the frame, clear of the headline
        const minX = W < 700 ? 60 : W * 0.5;
        const d = Math.hypot(p.x - (W < 700 ? W * 0.45 : W * 0.7), p.y - (160 + copyTop) / 2);
        if (d < bestD && p.x > minX && p.x < W - 170 && p.y > 160 && p.y < copyTop - 70) { best = h; bestD = d; }
      }
    }
    return best;
  }

  function updateLock(now) {
    if (!target && now > nextLock) {
      target = pickTarget();
      if (target) {
        lockLabel.textContent = labels[labelIndex++ % labels.length];
        lockUntil = now + 3200;
        lock.classList.add("is-on");
      } else nextLock = now + 800;
    }
    if (target) {
      const s = scale();
      const p = worldToScreen(target.x + target.w / 2, target.y + target.h / 2);
      const size = Math.max(target.w, target.h) * s + 22;
      lock.style.width = lock.style.height = size + "px";
      lock.style.transform = `translate(${p.x - hudOffset.x - size / 2}px, ${p.y - hudOffset.y - size / 2}px)`;
      if (now > lockUntil || p.y + size / 2 > copyTop - 10) {
        lock.classList.remove("is-on");
        target = null;
        nextLock = now + 3000;
      }
    }
  }

  // ---- Telemetry
  const q = (sel) => hero.querySelector(sel);
  const el = {
    timer: q("#hud-timer"), alt: q("#hud-alt"), spd: q("#hud-spd"),
    gps: q("#hud-gps"), batt: q("#hud-batt"), battBar: q("#hud-batt-bar"), tape: q("#compass"),
  };
  // compass tape: a mark every 15°
  const dirs = { 0: "N", 45: "NE", 90: "E", 135: "SE", 180: "S", 225: "SW", 270: "W", 315: "NW" };
  const STEP = 40;
  let tapeHTML = "";
  for (let d = -360; d <= 720; d += 15) {
    const n = ((d % 360) + 360) % 360;
    tapeHTML += `<span>${dirs[n] || (n % 45 === 0 ? n : "·")}</span>`;
  }
  el.tape.innerHTML = tapeHTML;

  const start = performance.now();
  let last = start, lastTele = 0;

  function telemetry(now, speed) {
    if (now - lastTele < 120) return;
    lastTele = now;
    const secs = Math.floor((now - start) / 1000);
    const hh = String(Math.floor(secs / 3600)).padStart(2, "0");
    const mm = String(Math.floor(secs / 60) % 60).padStart(2, "0");
    const ss = String(secs % 60).padStart(2, "0");
    el.timer.textContent = `${hh}:${mm}:${ss}`;
    // UK rules cap normal flights at 120 m, so the readout tops out there
    el.alt.textContent = Math.round(40 + altProgress * 80);
    el.spd.textContent = speed.toFixed(1);
    el.gps.textContent = 17 + (Math.floor(now / 4000) % 3);
    const batt = Math.max(12, 98 - Math.floor(secs / 20));
    el.batt.textContent = batt;
    el.battBar.style.width = batt * 0.9 + "%";
    const deg = ((cam.heading * 180) / Math.PI + 360) % 360;
    const tapeW = el.tape.parentElement.clientWidth;
    const offset = tapeW / 2 - ((deg + 360) / 15) * STEP - STEP / 2;
    el.tape.style.transform = `translateX(${offset}px)`;
  }

  // ---- Main loop
  let running = false, raf = 0;

  function frame(now) {
    const dt = Math.min(50, now - last) / 1000;
    last = now;
    const t = now / 1000;
    cam.heading = -0.6 + Math.sin(t * 0.06) * 0.5;
    const speed = 6 + Math.sin(t * 0.7) * 0.6;
    const pxPerSec = 34;
    // fly "forward" = up the screen, in the direction of the heading
    cam.x += Math.sin(cam.heading) * pxPerSec * dt;
    cam.y -= Math.cos(cam.heading) * pxPerSec * dt;

    const p = Math.min(1, Math.max(0, scrollY / (hero.offsetHeight * 0.9)));
    altProgress += (p - altProgress) * 0.12;

    render();
    updateLock(now);
    telemetry(now, speed);
    if (running) raf = requestAnimationFrame(frame);
  }

  function play() { if (!running && !reduceMotion) { running = true; last = performance.now(); raf = requestAnimationFrame(frame); } }
  function stop() { running = false; cancelAnimationFrame(raf); }

  resize();
  cam.x = TILE * 3.4; cam.y = TILE * 3.2;
  const onResize = () => { resize(); if (!running) render(); };
  addEventListener("resize", onResize);

  if (reduceMotion) {
    render();
    telemetry(performance.now() + 200, 6);
    return () => removeEventListener("resize", onResize);
  }

  const io = new IntersectionObserver(([e]) => (e.isIntersecting ? play() : stop()));
  io.observe(hero);
  const onVis = () => (document.hidden ? stop() : play());
  document.addEventListener("visibilitychange", onVis);
  play();

  return () => {
    stop();
    io.disconnect();
    removeEventListener("resize", onResize);
    document.removeEventListener("visibilitychange", onVis);
  };
}
