/* Isometric house for the roof inspections page, drawn on a canvas.
   A two-storey house with a slate roof, chimney, skylight, gutters and a
   flat-roofed extension, on a plot by the street. 1 world unit = about 1 m.

   drawHouse(ctx, W, H, {
     cam:   { x, y, z, zoom }   point the camera centres on, and how close
     drone: { x, y, z } | null   where the drone is (null = not drawn)
     look:  { x, y, z } | null   what the drone's camera is pointing at
     droneAlpha: 0–1
     pins:  [{ n, x, y, z, state: "on" | "done", label }]
     tag:   small label top-left
   }) */

const RIDGE = 8.4;   // ridge height
const RY = 3.5;      // ridge line (y)
const PITCH = 0.858; // height lost per metre away from the ridge
export const roofZ = (y) => RIDGE - Math.abs(y - RY) * PITCH;

export function drawHouse(ctx, W, H, o = {}) {
  const cam = o.cam || { x: 7, y: 5.5, z: 3, zoom: 1 };
  const s = (W / 30) * cam.zoom;
  const cx = W * 0.5, cy = H * 0.55;
  const iso = (x, y, z) => [cx + ((x - cam.x) - (y - cam.y)) * s * 0.866, cy + ((x - cam.x) + (y - cam.y)) * s * 0.5 - (z - cam.z) * s];
  const path = (pts) => { ctx.beginPath(); pts.forEach((p, i) => { const [a, b] = iso(...p); i ? ctx.lineTo(a, b) : ctx.moveTo(a, b); }); ctx.closePath(); };
  const poly = (pts, fill, stroke, lw = 1) => {
    path(pts);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
  };
  const line = (a, b, color, w = 1, dash) => {
    const [x1, y1] = iso(...a), [x2, y2] = iso(...b);
    ctx.strokeStyle = color; ctx.lineWidth = w; ctx.setLineDash(dash || []);
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.setLineDash([]);
  };
  const box = (x, y, z, w, d, h, top, front, side, stroke) => {
    poly([[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]], front, stroke);
    poly([[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]], side, stroke);
    poly([[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]], top, stroke);
  };
  const lw = (n) => Math.max(1, n * s / 22); // line widths grow as the camera closes in

  ctx.clearRect(0, 0, W, H);

  // ---------- ground, street and plot ----------
  poly([[-40, -40, 0], [50, -40, 0], [50, 50, 0], [-40, 50, 0]], "#173B2E");
  poly([[-40, 15, 0.01], [50, 15, 0.01], [50, 18.5, 0.01], [-40, 18.5, 0.01]], "#2B3240");          // road
  poly([[-40, 13.8, 0.015], [50, 13.8, 0.015], [50, 15, 0.015], [-40, 15, 0.015]], "#4A5466");      // pavement
  line([-40, 16.75, 0.02], [50, 16.75, 0.02], "rgba(242,246,251,0.5)", lw(1.2), [s * 0.6, s * 0.6]);
  poly([[-2.5, -4, 0.02], [18, -4, 0.02], [18, 13.8, 0.02], [-2.5, 13.8, 0.02]], "#225440");       // plot lawn
  // fences between plots
  line([-2.5, -4, 0.03], [-2.5, 13.8, 0.03], "rgba(207,220,234,0.35)", lw(1.4));
  line([18, -4, 0.03], [18, 13.8, 0.03], "rgba(207,220,234,0.35)", lw(1.4));
  // drive with car, and front path
  poly([[14.6, 7, 0.03], [17.4, 7, 0.03], [17.4, 13.8, 0.03], [14.6, 13.8, 0.03]], "#3B4352");
  poly([[4.3, 7, 0.03], [5.3, 7, 0.03], [5.3, 13.8, 0.03], [4.3, 13.8, 0.03]], "#59647A");
  box(15.1, 9.2, 0.03, 1.8, 3.8, 0.9, "#E0662F", "#A9471F", "#C4552A", "rgba(0,0,0,0.2)");
  box(15.3, 10.2, 0.93, 1.4, 1.8, 0.45, "#2C6FB0", "#1D4E80", "#245E98");
  // patio behind the extension
  poly([[10.2, -2.6, 0.03], [16, -2.6, 0.03], [16, 2.8, 0.03], [10.2, 2.8, 0.03]], "#4B5568");

  // neighbour on the left (simple, for context)
  {
    const X = -15;
    poly([[X + 10, 0, 0], [X + 10, 7, 0], [X + 10, 7, 5.4], [X + 10, RY, RIDGE], [X + 10, 0, 5.4]], "#8C806E", "rgba(0,0,0,0.15)");
    poly([[X, 7, 0], [X + 10, 7, 0], [X + 10, 7, 5.4], [X, 7, 5.4]], "#A99B84", "rgba(0,0,0,0.15)");
    poly([[X - 0.2, 7.3, roofZ(7.3)], [X + 10.2, 7.3, roofZ(7.3)], [X + 10.2, RY, RIDGE], [X - 0.2, RY, RIDGE]], "#4A556B");
  }

  // ---------- main house ----------
  // back slope (just a sliver shows above the ridge)
  poly([[-0.2, -0.3, roofZ(-0.3)], [10.2, -0.3, roofZ(-0.3)], [10.2, RY, RIDGE], [-0.2, RY, RIDGE]], "#3B4659");
  // right gable wall
  poly([[10, 0, 0], [10, 7, 0], [10, 7, 5.4], [10, RY, RIDGE - 0.05], [10, 0, 5.4]], "#A3947E", "rgba(0,0,0,0.18)");
  poly([[10.01, 1, 3.4], [10.01, 2.3, 3.4], [10.01, 2.3, 4.6], [10.01, 1, 4.6]], "#2C6FB0", "#E8ECF5", lw(1.2)); // gable window
  // front wall
  poly([[0, 7, 0], [10, 7, 0], [10, 7, 5.4], [0, 7, 5.4]], "#C6B59A", "rgba(0,0,0,0.18)");
  const win = (x1, x2, z1, z2) => {
    poly([[x1, 7.01, z1], [x2, 7.01, z1], [x2, 7.01, z2], [x1, 7.01, z2]], "#2C6FB0", "#E8ECF5", lw(1.4));
    const m = (x1 + x2) / 2; line([m, 7.02, z1], [m, 7.02, z2], "#E8ECF5", lw(1));
  };
  win(1, 2.6, 3.2, 4.6); win(4.2, 5.8, 3.2, 4.6); win(7.4, 9, 3.2, 4.6);
  win(1, 2.8, 0.8, 2.2); win(7.2, 9, 0.8, 2.2);
  poly([[4.3, 7.01, 0], [5.3, 7.01, 0], [5.3, 7.01, 2.2], [4.3, 7.01, 2.2]], "#003366", "#E8ECF5", lw(1.2)); // door

  // front slope + tile courses
  const F = [[-0.2, 7.3, roofZ(7.3)], [10.2, 7.3, roofZ(7.3)], [10.2, RY, RIDGE], [-0.2, RY, RIDGE]];
  poly(F, "#56627A");
  if (s > 9) {
    const step = 0.42;
    let row = 0;
    for (let y = RY + step; y < 7.3; y += step, row++) {
      line([-0.2, y, roofZ(y)], [10.2, y, roofZ(y)], "rgba(10,18,32,0.38)", lw(0.9));
      if (s > 24) {
        const y0 = y - step, off = row % 2 ? 0.3 : 0;
        for (let x = -0.2 + off + 0.6; x < 10.2; x += 0.6) line([x, y0, roofZ(y0)], [x, y, roofZ(y)], "rgba(10,18,32,0.22)", lw(0.6));
      }
    }
  }
  // skylight
  poly([[1.6, 4.4, roofZ(4.4) + 0.06], [2.8, 4.4, roofZ(4.4) + 0.06], [2.8, 5.6, roofZ(5.6) + 0.06], [1.6, 5.6, roofZ(5.6) + 0.06]], "#3A86C8", "#E8ECF5", lw(1.6));
  // tile out of line (pin 1): a dark gap where it should be, the tile slipped below
  {
    const y0 = RY + 0.42 * 5, y1 = y0 + 0.42, x0 = 4.4, x1 = 4.98;
    poly([[x0, y0, roofZ(y0) + 0.01], [x1, y0, roofZ(y0) + 0.01], [x1, y1, roofZ(y1) + 0.01], [x0, y1, roofZ(y1) + 0.01]], "#151C2A");
    const d = 0.26;
    poly([[x0 + 0.04, y0 + d, roofZ(y0 + d) + 0.05], [x1 + 0.04, y0 + d, roofZ(y0 + d) + 0.05], [x1 + 0.04, y1 + d, roofZ(y1 + d) + 0.05], [x0 + 0.04, y1 + d, roofZ(y1 + d) + 0.05]], "#7D89A3", "rgba(10,18,32,0.5)", lw(0.8));
  }
  // moss near the eaves
  if (s > 12) {
    ctx.fillStyle = "rgba(108,150,62,0.85)";
    [[8.7, 6.7, 0.18], [9.1, 6.9, 0.22], [9.5, 6.6, 0.15], [8.9, 7.05, 0.14], [9.7, 7.0, 0.2]].forEach(([x, y, r]) => {
      const [a, b] = iso(x, y, roofZ(y) + 0.04); ctx.beginPath(); ctx.ellipse(a, b, r * s, r * s * 0.6, 0, 0, Math.PI * 2); ctx.fill();
    });
  }
  // ridge tiles, with one open joint (pin 2)
  line([-0.2, RY, RIDGE + 0.06], [10.2, RY, RIDGE + 0.06], "#2F3747", lw(4));
  if (s > 14) {
    for (let x = 0.25; x < 10.2; x += 0.45) line([x, RY - 0.08, RIDGE + 0.1], [x, RY + 0.08, RIDGE + 0.1], "rgba(242,246,251,0.18)", lw(0.8));
    line([2.05, RY, RIDGE + 0.08], [2.35, RY, RIDGE + 0.08], "#C8BFA8", lw(3));
  }
  // verge / bargeboard on the gable (pin 6)
  line([10.2, 7.3, roofZ(7.3)], [10.2, RY, RIDGE], "#E8ECF5", lw(2.6));
  line([10.2, -0.3, roofZ(-0.3)], [10.2, RY, RIDGE], "#E8ECF5", lw(2.6));
  // fascia, gutter (pin 4) and downpipe
  line([-0.2, 7.3, roofZ(7.3) - 0.05], [10.2, 7.3, roofZ(7.3) - 0.05], "#E8ECF5", lw(2.4));
  line([-0.2, 7.45, roofZ(7.3) - 0.2], [10.2, 7.45, roofZ(7.3) - 0.2], "#1E2430", lw(3.4));
  if (s > 12) {
    [[5.9, "#6C8E3A"], [6.15, "#8A6A3A"], [6.4, "#6C8E3A"], [6.65, "#7A5E34"], [6.85, "#6C8E3A"]].forEach(([x, c]) => {
      const [a, b] = iso(x, 7.45, roofZ(7.3) - 0.12); ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(a, b, s * 0.13, s * 0.08, 0, 0, Math.PI * 2); ctx.fill();
    });
  }
  line([0.15, 7.45, roofZ(7.3) - 0.2], [0.15, 7.45, 0], "#1E2430", lw(2.2));

  // chimney (pin 3): straddles the ridge
  {
    const x0 = 7.4, x1 = 8.4, y0 = 2.9, y1 = 4.1, top = 9.8, zb = roofZ(y1);
    poly([[x1, y0, roofZ(y0)], [x1, RY, RIDGE], [x1, y1, zb], [x1, y1, top], [x1, y0, top]], "#74493A", "rgba(0,0,0,0.25)");
    poly([[x0, y1, zb], [x1, y1, zb], [x1, y1, top], [x0, y1, top]], "#8E5A46", "rgba(0,0,0,0.25)");
    if (s > 14) for (let z = zb + 0.25; z < top; z += 0.25) line([x0, y1 + 0.005, z], [x1, y1 + 0.005, z], "rgba(30,16,10,0.3)", lw(0.6));
    poly([[x0, y0, top], [x1, y0, top], [x1, y1, top], [x0, y1, top]], "#5A3A2F");
    // lead flashing, with the lifted corner
    poly([[x0 - 0.05, y1 + 0.01, zb], [x1 + 0.05, y1 + 0.01, zb], [x1 + 0.05, y1 + 0.01, zb + 0.22], [x0 - 0.05, y1 + 0.01, zb + 0.22]], "#8E99A8");
    poly([[x1 - 0.32, y1 + 0.02, zb + 0.22], [x1 + 0.05, y1 + 0.02, zb + 0.22], [x1 + 0.05, y1 + 0.16, zb + 0.42]], "#B4BECC", "rgba(0,0,0,0.3)", lw(0.6));
    box(7.6, 3.2, top, 0.32, 0.32, 0.5, "#6E3A22", "#B8643C", "#9C5230");
    box(8.0, 3.2, top, 0.32, 0.32, 0.5, "#6E3A22", "#B8643C", "#9C5230");
  }

  // ---------- flat-roofed extension (pin 5) ----------
  box(10, 3, 0, 4, 4, 3, "#2E3440", "#C6B59A", "#A3947E", "rgba(0,0,0,0.2)");
  poly([[10.8, 7.01, 0], [13.2, 7.01, 0], [13.2, 7.01, 2.2], [10.8, 7.01, 2.2]], "#2C6FB0", "#E8ECF5", lw(1.2));
  line([12, 7.02, 0], [12, 7.02, 2.2], "#E8ECF5", lw(1));
  // edge trim
  poly([[10, 3, 3], [14, 3, 3], [14, 7, 3], [10, 7, 3]], null, "#5A6378", lw(2));
  // ponding: a pool of standing water
  {
    const pts = []; for (let a = 0; a < Math.PI * 2; a += Math.PI / 12) pts.push([12.5 + Math.cos(a) * 0.95, 5.3 + Math.sin(a) * 0.7, 3.01]);
    poly(pts, "rgba(110,165,220,0.55)", "rgba(180,210,240,0.6)", lw(0.8));
  }
  box(10.6, 3.6, 3, 0.9, 0.9, 0.22, "#3A86C8", "#C9D3E0", "#AAB6C6"); // rooflight
  line([13.9, 7.15, 3], [13.9, 7.15, 0], "#1E2430", lw(2));

  // front garden tree
  {
    const [tx, ty] = iso(-1.2, 11.5, 0);
    const [kx, ky] = iso(-1.2, 11.5, 2.6);
    ctx.strokeStyle = "#4A3426"; ctx.lineWidth = lw(3); ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(kx, ky); ctx.stroke();
    ctx.fillStyle = "#2E7A5C"; ctx.beginPath(); ctx.arc(kx, ky - s * 0.6, s * 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.06)"; ctx.beginPath(); ctx.arc(kx - s * 0.45, ky - s * 1.0, s * 0.8, 0, Math.PI * 2); ctx.fill();
  }

  // ---------- drone, camera view and pins ----------
  if (o.drone && o.look) {
    const a = o.droneAlpha ?? 1;
    ctx.globalAlpha = a;
    const [gx, gy] = iso(o.drone.x, o.drone.y, 0);
    ctx.fillStyle = "rgba(0,0,0,0.28)"; ctx.beginPath(); ctx.ellipse(gx, gy, s * 0.5, s * 0.28, 0, 0, Math.PI * 2); ctx.fill();
    const [dx, dy] = iso(o.drone.x, o.drone.y, o.drone.z);
    const [lx, ly] = iso(o.look.x, o.look.y, o.look.z);
    const fw = Math.max(16, s * 0.9), fh = fw * 0.66;
    const corners = [[lx - fw, ly - fh], [lx + fw, ly - fh], [lx + fw, ly + fh], [lx - fw, ly + fh]];
    ctx.fillStyle = "rgba(255,193,94,0.13)";
    ctx.beginPath(); ctx.moveTo(dx, dy); ctx.lineTo(...corners[0]); ctx.lineTo(...corners[1]); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(dx, dy); ctx.lineTo(...corners[1]); ctx.lineTo(...corners[2]); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "rgba(255,193,94,0.55)"; ctx.lineWidth = 1;
    corners.forEach((c) => { ctx.beginPath(); ctx.moveTo(dx, dy); ctx.lineTo(...c); ctx.stroke(); });
    // frame brackets
    ctx.strokeStyle = "#FFC15E"; ctx.lineWidth = 2; const b = fw * 0.35;
    [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([sx, sy]) => {
      const x = lx + sx * fw, y = ly + sy * fh;
      ctx.beginPath(); ctx.moveTo(x - sx * b, y); ctx.lineTo(x, y); ctx.lineTo(x, y - sy * b * 0.8); ctx.stroke();
    });
    // the drone itself
    const r = Math.max(9, Math.min(24, s * 0.42));
    ctx.strokeStyle = "#C9D3E0"; ctx.lineWidth = Math.max(2, r * 0.18);
    ctx.beginPath(); ctx.moveTo(dx - r, dy - r * 0.55); ctx.lineTo(dx + r, dy + r * 0.55); ctx.moveTo(dx + r, dy - r * 0.55); ctx.lineTo(dx - r, dy + r * 0.55); ctx.stroke();
    [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([sx, sy]) => {
      ctx.fillStyle = "rgba(232,236,245,0.25)"; ctx.strokeStyle = "rgba(232,236,245,0.7)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.ellipse(dx + sx * r, dy + sy * r * 0.55, r * 0.62, r * 0.36, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    });
    ctx.fillStyle = "#E8ECF5"; ctx.beginPath(); ctx.ellipse(dx, dy, r * 0.5, r * 0.32, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#FF6B35"; ctx.beginPath(); ctx.arc(dx + r * 0.3, dy + r * 0.12, Math.max(2, r * 0.1), 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;
  }

  (o.pins || []).forEach((p) => {
    const [px, py] = iso(p.x, p.y, p.z);
    const on = p.state === "on";
    const r = on ? 13 : 10;
    if (on) { ctx.fillStyle = "rgba(255,107,53,0.25)"; ctx.beginPath(); ctx.arc(px, py, r + 7, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = on ? "#FF6B35" : "#003366"; ctx.strokeStyle = on ? "#FFFFFF" : "#FF915F"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#FFFFFF"; ctx.font = `700 ${on ? 13 : 11}px 'Blinker', sans-serif`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(String(p.n), px, py + 0.5);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
    if (on && p.label) {
      ctx.font = "700 12px 'Blinker', sans-serif";
      const t = p.label, tw = ctx.measureText(t).width + 16;
      let bx = px + r + 8; if (bx + tw > W - 8) bx = px - r - 8 - tw;
      const by = py - 12;
      ctx.fillStyle = "rgba(0,26,51,0.88)"; ctx.fillRect(bx, by, tw, 24);
      ctx.strokeStyle = "#FF915F"; ctx.lineWidth = 1; ctx.strokeRect(bx + 0.5, by + 0.5, tw - 1, 23);
      ctx.fillStyle = "#FFC15E"; ctx.fillText(t, bx + 8, by + 16);
    }
  });

  if (o.tag) {
    ctx.font = "600 12px 'Blinker', sans-serif";
    const tw = ctx.measureText(o.tag).width + 16;
    ctx.fillStyle = "rgba(0,26,51,0.75)"; ctx.fillRect(12, 12, tw, 24);
    ctx.fillStyle = "rgba(232,236,245,0.9)"; ctx.fillText(o.tag, 20, 28);
  }
}
