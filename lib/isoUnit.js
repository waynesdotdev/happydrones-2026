/* Isometric commercial unit (warehouse with offices, yard, parking, estate road),
   drawn on a canvas. prog runs 0–1: the "camera" starts close on the frontage
   and pulls back until the whole site sits in its surroundings.
   stage: index of the callout currently in focus (CP_REVEAL in lib/cproperty.js). */

const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const lerp = (a, b, k) => a + (b - a) * k;

// Callout anchors in world units, in the same order as CP_REVEAL
export const UNIT_ANCHORS = [
  { x: 8.5, y: 13, z: 3.4, label: "FRONTAGE" },
  { x: 9.5, y: 14.6, z: 0, label: "PARKING" },
  { x: 17, y: 7, z: 2, label: "LOADING" },
  { x: 12, y: 7, z: 3.4, label: "ROOF" },
  { x: 24, y: 16.5, z: 0, label: "ACCESS" },
  { x: 11, y: 7, z: 9, label: "CONTEXT" },
];

export function drawUnit(ctx, W, H, prog, stage = 0) {
  ctx.clearRect(0, 0, W, H);
  const pr = Math.max(0, Math.min(1, prog));
  const k = ease(pr);
  // camera keyframes, one per shot (matches CP_REVEAL timings)
  const KEYS = [
    { at: 0, x: 8.5, y: 13.4, z: 1.6, zoom: 2.5 },
    { at: 0.2, x: 9.5, y: 14, z: 0.4, zoom: 2.1 },
    { at: 0.38, x: 17.5, y: 7.5, z: 1, zoom: 1.7 },
    { at: 0.56, x: 11.5, y: 7, z: 2.6, zoom: 1.3 },
    { at: 0.74, x: 17, y: 13, z: 0, zoom: 1.0 },
    { at: 0.9, x: 11, y: 9, z: 0, zoom: 0.74 },
    { at: 1, x: 11, y: 9, z: 0, zoom: 0.72 },
  ];
  let i = 0; while (i < KEYS.length - 2 && pr >= KEYS[i + 1].at) i++;
  const A = KEYS[i], B = KEYS[i + 1];
  const t = ease(Math.max(0, Math.min(1, (pr - A.at) / (B.at - A.at))));
  const zoom = lerp(A.zoom, B.zoom, t);
  const s = (W / 34) * zoom;
  const f = { x: lerp(A.x, B.x, t), y: lerp(A.y, B.y, t), z: lerp(A.z, B.z, t) };
  const cx = W * 0.5, cy = H * 0.56;
  const iso = (x, y, z) => [cx + ((x - f.x) - (y - f.y)) * s * 0.866, cy + ((x - f.x) + (y - f.y)) * s * 0.5 - (z - f.z) * s];
  const poly = (pts, fill, stroke, lw = 1) => {
    ctx.beginPath(); pts.forEach(([x, y, z], i) => { const [a, b] = iso(x, y, z); i ? ctx.lineTo(a, b) : ctx.moveTo(a, b); }); ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
  };
  const box = (x, y, z, w, d, h, top, left, right, stroke) => {
    poly([[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]], left, stroke);
    poly([[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]], right, stroke);
    poly([[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]], top, stroke);
  };
  const line = (a, b, color, w = 1, dash) => { const [x1, y1] = iso(...a), [x2, y2] = iso(...b); ctx.strokeStyle = color; ctx.lineWidth = w; ctx.setLineDash(dash || []); ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.setLineDash([]); };

  // ground and wider landscape
  poly([[-14, -10, 0], [38, -10, 0], [38, 30, 0], [-14, 30, 0]], "#16352B");
  // fields grid
  ctx.globalAlpha = 0.35;
  for (let i = -14; i <= 38; i += 4) line([i, -10, 0], [i, 30, 0], "#24503F");
  for (let j = -10; j <= 30; j += 4) line([-14, j, 0], [38, j, 0], "#24503F");
  ctx.globalAlpha = 1;

  // main road (diagonal) and estate road with roundabout
  poly([[-14, 18, 0.01], [38, 18, 0.01], [38, 20.5, 0.01], [-14, 20.5, 0.01]], "#2B3240");
  line([-14, 19.25, 0.02], [38, 19.25, 0.02], "rgba(242,246,251,0.55)", 1.2, [8, 8]);
  poly([[22.8, -10, 0.01], [25.2, -10, 0.01], [25.2, 18, 0.01], [22.8, 18, 0.01]], "#2B3240");
  poly([[0, 14.6, 0.012], [24, 14.6, 0.012], [24, 16.4, 0.012], [0, 16.4, 0.012]], "#323A4A");
  { const [rx, ry] = iso(24, 19.25, 0.02); ctx.fillStyle = "#3A4456"; ctx.beginPath(); ctx.ellipse(rx, ry, s * 2.2, s * 1.25, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#1F5A44"; ctx.beginPath(); ctx.ellipse(rx, ry, s * 1, s * 0.58, 0, 0, Math.PI * 2); ctx.fill(); }

  // neighbouring units (context)
  [[-10, 2, 8, 6, 2.2], [-10, 10, 6, 5, 1.8], [27, 2, 8, 9, 2.6], [27, 22, 9, 5, 2], [4, 22, 10, 5, 2.2]].forEach(([x, y, w, d, h]) =>
    box(x, y, 0, w, d, h, "#5A6A84", "#2C3A52", "#3C4C66", "rgba(207,220,234,0.12)"));

  // plot: yard + landscaping
  poly([[0, 0, 0.02], [21, 0, 0.02], [21, 14.4, 0.02], [0, 14.4, 0.02]], "#2A4F3F");
  poly([[17, 1, 0.03], [21, 1, 0.03], [21, 13, 0.03], [17, 13, 0.03]], "#3B4352"); // service yard
  poly([[3, 13, 0.03], [17, 13, 0.03], [17, 14.4, 0.03], [3, 14.4, 0.03]], "#3B4352"); // car park
  for (let x = 3.6; x < 17; x += 1.1) line([x, 13, 0.04], [x, 14.4, 0.04], "rgba(242,246,251,0.45)");
  // EV bays
  line([3.6, 13, 0.05], [5.8, 13, 0.05], "#4ADE80", 2);

  // warehouse
  box(5, 2, 0, 12, 9, 3.2, "#8FA3BD", "#4E6283", "#6A7FA0", "rgba(232,236,245,0.25)");
  ctx.globalAlpha = 0.25;
  for (let x = 5.6; x < 17; x += 0.6) line([x, 11, 0], [x, 11, 3.2], "#E8ECF5", 0.6);
  for (let y = 2.6; y < 11; y += 0.6) line([17, y, 0], [17, y, 3.2], "#E8ECF5", 0.6);
  ctx.globalAlpha = 1;
  // roof lights and plant
  for (let x = 6.5; x < 16; x += 2.4) poly([[x, 3.5, 3.21], [x + 0.9, 3.5, 3.21], [x + 0.9, 9.5, 3.21], [x, 9.5, 3.21]], "rgba(207,220,234,0.55)");
  box(14.2, 3, 3.2, 1.4, 1, 0.5, "#AEB8CC", "#5D6880", "#78849C");
  // loading doors on the yard side
  [3, 5.2, 7.4].forEach((y) => poly([[17.01, y, 0], [17.01, y + 1.5, 0], [17.01, y + 1.5, 2.2], [17.01, y, 2.2]], "#1A2234", "#FF915F", 1));
  // offices on the frontage, two storeys, glazed
  box(6, 11, 0, 6, 2, 4.2, "#CFDCEA", "#0F3A66", "#2C6FB0", "rgba(232,236,245,0.3)");
  ctx.globalAlpha = 0.45;
  for (let x = 6.6; x < 12; x += 0.75) line([x, 13, 0], [x, 13, 4.2], "#E8ECF5", 0.7);
  line([6, 13, 2.1], [12, 13, 2.1], "#E8ECF5", 0.9);
  ctx.globalAlpha = 1;
  // entrance canopy and sign totem
  box(8, 13, 2.2, 1.6, 0.6, 0.15, "#FF915F", "#C2521F", "#E0662F");
  box(2.4, 13.4, 0, 0.3, 0.3, 2.4, "#FF6B35", "#C2521F", "#E0662F");
  // trees
  [[1.5, 2], [1.5, 6], [1.5, 10], [19.5, 14], [12.8, 13.8]].forEach(([x, y]) => { const [a, b] = iso(x, y, 0); ctx.fillStyle = "#1F5A44"; ctx.beginPath(); ctx.ellipse(a, b - s * 0.5, s * 0.6, s * 0.65, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#2E7A5C"; ctx.beginPath(); ctx.ellipse(a - s * 0.15, b - s * 0.7, s * 0.3, s * 0.3, 0, 0, Math.PI * 2); ctx.fill(); });
  // HGV in the yard
  box(18, 9.4, 0, 2.2, 0.9, 1.1, "#E8ECF5", "#9AA6BC", "#C8D0DE");

  // site edging (appears as the camera rises)
  const edge = Math.max(0, Math.min(1, (k - 0.55) / 0.2));
  if (edge > 0) {
    ctx.globalAlpha = edge;
    poly([[0, 0, 0.06], [21, 0, 0.06], [21, 14.4, 0.06], [0, 14.4, 0.06]], "rgba(255,107,53,0.08)", "#FF6B35", 2.2);
    ctx.globalAlpha = 1;
  }
  // drive-time labels once pulled back
  const ctxA = Math.max(0, Math.min(1, (k - 0.78) / 0.15));
  if (ctxA > 0) {
    ctx.globalAlpha = ctxA;
    ctx.font = `700 ${Math.max(10, Math.round(s * 0.6))}px 'Blinker', sans-serif`;
    ctx.fillStyle = "#FFC15E";
    const [ax, ay] = iso(14, 19.25, 0.5); ctx.fillText("MAIN ROAD · 4 MIN", ax + 10, ay + 22);
    const [bx2, by2] = iso(24, -2, 0.5); ctx.fillText("TOWN · 8 MIN", bx2 + 10, by2);
    ctx.globalAlpha = 1;
  }

  // callouts
  UNIT_ANCHORS.forEach((a, i) => {
    if (i > stage || i === 5) return;
    const [px, py] = iso(a.x, a.y, a.z);
    if (px < -40 || px > W + 40 || py < -40 || py > H + 40) return;
    const on = i === stage;
    ctx.fillStyle = on ? "#FF6B35" : "rgba(255,145,95,0.7)";
    ctx.beginPath(); ctx.arc(px, py, on ? 6 : 4, 0, Math.PI * 2); ctx.fill();
    if (on) { ctx.strokeStyle = "rgba(255,107,53,0.45)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(px, py, 13, 0, Math.PI * 2); ctx.stroke(); }
    const lx = px + 18, ly = py - 22;
    ctx.strokeStyle = on ? "#FF6B35" : "rgba(255,145,95,0.55)"; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(lx, ly); ctx.lineTo(lx + 8, ly); ctx.stroke();
    ctx.font = "700 11px 'Blinker', sans-serif";
    const tw = ctx.measureText(a.label).width + 12;
    ctx.fillStyle = on ? "#FF6B35" : "rgba(2,35,65,0.85)";
    ctx.fillRect(lx + 8, ly - 10, tw, 20);
    ctx.fillStyle = on ? "#FFFFFF" : "#F2F6FB";
    ctx.fillText(a.label, lx + 14, ly + 4);
  });

  // altitude readout
  const alt = Math.round(4 + pr * 116);
  ctx.font = "600 12px 'Blinker', sans-serif";
  ctx.fillStyle = "rgba(232,236,245,0.85)"; ctx.fillText("HD-CP · UNIT 4 · ILLUSTRATION", 16, H - 40);
  ctx.fillStyle = "#FF6B35"; ctx.fillText(`ALT ${alt} m`, 16, H - 22);
}
