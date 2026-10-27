/* Isometric construction site, drawn on a canvas at any point in the build.
   prog runs from 0 (bare plot) to 1 (landscaped and handed over).
   Used by the "drag through the build" slider and the construction page. */

const C = {
  dirt: [92, 72, 58], grass: [36, 74, 58], slab: [120, 128, 142],
  frameTop: "#9AA6BC", frameL: "#5D6880", frameR: "#78849C",
  glassL: "#0F3A66", glassR: "#2C6FB0", glassTop: "#CFDCEA",
};
const mix = (a, b, k) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * k)).join(",")})`;
const clamp = (v) => Math.max(0, Math.min(1, v));

// Fixed capture positions around the plot (plot units), shared with the capture plan
export const CAPTURE_POINTS = [
  { id: "A", x: -1.2, y: 11.2, z: 6 }, { id: "B", x: 13.2, y: 11.2, z: 6 },
  { id: "C", x: 13.2, y: -1.2, z: 6 }, { id: "D", x: 6, y: 5, z: 12 },
];

export function drawBuild(ctx, W, H, prog, { stamp = true, label = "CP-04 · POSITION A", points = false } = {}) {
  ctx.clearRect(0, 0, W, H);
      ctx.clearRect(0, 0, W, H);
      // Fit the scene to the canvas. Bounds are in plot units (x across, y up/down the screen),
      // wider and taller when the capture points are shown.
      const B = points ? { x0: -10.9, x1: 12.6, y0: -6.9, y1: 11.3 } : { x0: -8.9, x1: 10.6, y0: -3.9, y1: 11.2 };
      const s = Math.min((W * 0.94) / (B.x1 - B.x0), (H * 0.86) / (B.y1 - B.y0));
      const ox = W / 2 - ((B.x0 + B.x1) / 2) * s, oy = H * 0.47 - ((B.y0 + B.y1) / 2) * s;
      const iso = (x, y, z) => [ox + (x - y) * s * 0.866, oy + (x + y) * s * 0.5 - z * s];
      const poly = (pts, fill, stroke) => { ctx.beginPath(); pts.forEach(([x, y, z], i) => { const [a, b] = iso(x, y, z); i ? ctx.lineTo(a, b) : ctx.moveTo(a, b); }); ctx.closePath(); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.stroke(); } };
      const box = (x, y, z, w, d, h, top, left, right, stroke) => {
        poly([[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]], left, stroke);
        poly([[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]], right, stroke);
        poly([[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]], top, stroke);
      };

      // plot: dirt turning to lawn at the end
      const green = clamp((prog - 0.84) / 0.12);
      poly([[0, 0, 0], [12, 0, 0], [12, 10, 0], [0, 10, 0]], mix(C.dirt, C.grass, green));
      // plot edge grid
      ctx.strokeStyle = "rgba(127,178,229,0.14)";
      for (let i = 0; i <= 12; i += 2) { const [a, b] = iso(i, 0, 0), [c, d] = iso(i, 10, 0); ctx.beginPath(); ctx.moveTo(a, b); ctx.lineTo(c, d); ctx.stroke(); }
      for (let j = 0; j <= 10; j += 2) { const [a, b] = iso(0, j, 0), [c, d] = iso(12, j, 0); ctx.beginPath(); ctx.moveTo(a, b); ctx.lineTo(c, d); ctx.stroke(); }

      // hoarding until handover
      if (prog < 0.9) { const k = 1 - clamp((prog - 0.84) / 0.06); ctx.globalAlpha = k; box(0, 9.7, 0, 12, 0.3, 0.5, "#2A3550", "#1A2234", "#222C42"); box(11.7, 0, 0, 0.3, 9.7, 0.5, "#2A3550", "#1A2234", "#222C42"); ctx.globalAlpha = 1; }

      // groundworks / slab
      const bx = 3, by = 2.5, bw = 6, bd = 4.2;
      if (prog > 0.05) poly([[bx - 0.3, by - 0.3, 0.02], [bx + bw + 0.3, by - 0.3, 0.02], [bx + bw + 0.3, by + bd + 0.3, 0.02], [bx - 0.3, by + bd + 0.3, 0.02]], prog < 0.16 ? "rgba(70,52,40,0.9)" : mix(C.slab, C.slab, 0));

      // floors
      const FLOORS = 6, fh = 1;
      const built = clamp((prog - 0.18) / 0.45) * FLOORS;
      const clad = clamp((prog - 0.55) / 0.3) * FLOORS;
      for (let f = 0; f < Math.ceil(built); f++) {
        const partial = Math.min(1, built - f);
        const z = f * fh;
        if (f < clad) {
          const k = Math.min(1, clad - f);
          box(bx, by, z, bw, bd, fh * partial, C.glassTop, C.glassL, C.glassR, "rgba(232,236,245,0.25)");
          // window mullions
          ctx.strokeStyle = `rgba(232,236,245,${0.35 * k})`;
          for (let i = 1; i < 6; i++) { const [a, b] = iso(bx + i, by + bd, z), [c, d] = iso(bx + i, by + bd, z + fh * partial); ctx.beginPath(); ctx.moveTo(a, b); ctx.lineTo(c, d); ctx.stroke(); }
          for (let j = 1; j < 4; j++) { const [a, b] = iso(bx + bw, by + j * 1.05, z), [c, d] = iso(bx + bw, by + j * 1.05, z + fh * partial); ctx.beginPath(); ctx.moveTo(a, b); ctx.lineTo(c, d); ctx.stroke(); }
        } else {
          // open frame: slab + columns
          box(bx, by, z + fh * partial - 0.12, bw, bd, 0.12, C.frameTop, C.frameL, C.frameR);
          ctx.strokeStyle = C.frameR; ctx.lineWidth = 2;
          [[bx, by + bd], [bx + bw, by + bd], [bx + bw, by], [bx + bw / 2, by + bd], [bx + bw, by + bd / 2]].forEach(([x, y]) => { const [a, b] = iso(x, y, z), [c, d] = iso(x, y, z + fh * partial); ctx.beginPath(); ctx.moveTo(a, b); ctx.lineTo(c, d); ctx.stroke(); });
          ctx.lineWidth = 1;
        }
      }
      // roof plant once topped out
      if (built >= FLOORS - 0.01) box(bx + 1, by + 1, FLOORS * fh, 1.6, 1.2, 0.5, "#AEB8CC", "#5D6880", "#78849C");

      // tower crane
      const craneA = prog > 0.12 && prog < 0.86 ? 1 : 0;
      if (craneA) {
        const cxw = 1.4, cyw = 7.2, top = 7;
        ctx.strokeStyle = "#FF6B35"; ctx.lineWidth = 2.2;
        const [a, b] = iso(cxw, cyw, 0), [c, d] = iso(cxw, cyw, top); ctx.beginPath(); ctx.moveTo(a, b); ctx.lineTo(c, d); ctx.stroke();
        const ang = 0.35 + prog * 0.7;
        const jx = cxw + Math.cos(ang) * 6.4, jy = cyw - Math.sin(ang) * 4.2;
        const [e, g] = iso(jx, jy, top), [h, i] = iso(cxw - Math.cos(ang) * 1.6, cyw + Math.sin(ang) * 1.1, top);
        ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(h, i); ctx.lineTo(e, g); ctx.stroke();
        const [l, m] = iso((jx + cxw) / 2, (jy + cyw) / 2, top), [n2, o] = iso((jx + cxw) / 2, (jy + cyw) / 2, Math.max(built, 1) + 0.6);
        ctx.strokeStyle = "rgba(255,107,53,0.6)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(l, m); ctx.lineTo(n2, o); ctx.stroke();
      }

      // landscaping
      if (green > 0) {
        ctx.globalAlpha = green;
        [[1.2, 1.4], [1.4, 7.6], [10.4, 8.2], [10.6, 1.6], [6, 8.6]].forEach(([x, y]) => { const [a, b] = iso(x, y, 0); ctx.fillStyle = "#1F5A44"; ctx.beginPath(); ctx.ellipse(a, b - s * 0.5, s * 0.55, s * 0.6, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#2E7A5C"; ctx.beginPath(); ctx.ellipse(a - s * 0.15, b - s * 0.7, s * 0.3, s * 0.3, 0, 0, Math.PI * 2); ctx.fill(); });
        poly([[bx + 2.6, by + bd, 0.03], [bx + 3.4, by + bd, 0.03], [bx + 3.4, 10, 0.03], [bx + 2.6, 10, 0.03]], "#9AA3B5");
        ctx.globalAlpha = 1;
      }

      // drone over the site + fixed survey point marker
      const [dx, dy] = iso(1.2, 9, 8.6);
      ctx.strokeStyle = "#E8ECF5"; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(dx - 9, dy - 3); ctx.lineTo(dx + 9, dy + 3); ctx.moveTo(dx + 9, dy - 3); ctx.lineTo(dx - 9, dy + 3); ctx.stroke();
      [[-9, -3], [9, -3], [-9, 3], [9, 3]].forEach(([a, b]) => { ctx.beginPath(); ctx.ellipse(dx + a, dy + b, 5, 1.6, 0, 0, Math.PI * 2); ctx.stroke(); });
      ctx.setLineDash([3, 4]); ctx.strokeStyle = "rgba(127,178,229,0.55)";
      const [vx, vy] = iso(bx + bw / 2, by + bd / 2, 0);
      ctx.beginPath(); ctx.moveTo(dx, dy); ctx.lineTo(vx, vy); ctx.stroke(); ctx.setLineDash([]);


      if (points) {
        CAPTURE_POINTS.forEach((p) => {
          const [px, py] = iso(p.x, p.y, p.z);
          ctx.fillStyle = "rgba(255,107,53,0.95)"; ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = "rgba(255,107,53,0.35)"; ctx.beginPath(); ctx.arc(px, py, 9, 0, Math.PI * 2); ctx.stroke();
          ctx.font = "700 11px 'Blinker', sans-serif"; ctx.fillStyle = "#FFC15E"; ctx.fillText(p.id, px + 8, py - 8);
        });
      }
      if (stamp) {
      const month = 1 + Math.round(prog * 13);
      ctx.font = "600 12px 'Blinker', sans-serif"; ctx.fillStyle = "rgba(232,236,245,0.85)";
      ctx.fillText(label, 16, H - 40);
      ctx.fillStyle = "#FF6B35"; ctx.fillText(`VISIT ${String(month).padStart(2, "0")} · MONTH ${month} OF 14`, 16, H - 22);
          }
}
