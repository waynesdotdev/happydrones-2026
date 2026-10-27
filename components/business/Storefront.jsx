/* An illustrated local business from the street, used across the local
   business page. One drawing, six kinds of business: the sign, colours and
   what's in the window change with `type` (see LB_TYPES in lib/localBusiness.js).
   drone: show the drone hovering above. cover: fill the frame (crop). */
import { useId } from "react";

const WINDOW = {
  cafe: (c) => <g>
    {[200, 270, 340, 410].map((x, i) => <g key={x}><rect x={x} y="340" width="44" height="6" fill="#5A3A2F" /><line x1={x + 22} y1="346" x2={x + 22} y2="400" stroke="#5A3A2F" strokeWidth="4" /><rect x={x + 12} y="322" width="12" height="16" rx="2" fill={i % 2 ? "#FFFFFF" : c.accent} /></g>)}
    <rect x="180" y="270" width="270" height="10" fill="#5A3A2F" />
    {[200, 236, 272, 308].map((x) => <circle key={x} cx={x} cy="262" r="12" fill="#E8B07A" />)}
    {[350, 380, 410].map((x) => <rect key={x} x={x - 8} y="250" width="16" height="20" rx="3" fill="#F3F1EC" />)}
  </g>,
  gym: (c) => <g>
    <rect x="180" y="250" width="270" height="12" fill="#2F3747" />
    {[200, 240, 280, 320, 360, 400].map((x) => <g key={x}><rect x={x} y="262" width="8" height="28" fill="#2F3747" /><circle cx={x + 4} cy="296" r="10" fill={c.accent} /></g>)}
    <rect x="200" y="350" width="120" height="10" rx="5" fill="#C9D3E0" /><circle cx="196" cy="355" r="22" fill="#1E2430" /><circle cx="324" cy="355" r="22" fill="#1E2430" />
    <rect x="370" y="330" width="70" height="70" rx="6" fill="#1E2430" /><rect x="380" y="340" width="50" height="20" fill={c.accent} opacity="0.7" />
  </g>,
  salon: (c) => <g>
    {[210, 330].map((x) => <g key={x}><rect x={x} y="240" width="70" height="90" rx="35" fill="#BFD3E6" stroke="#FFFFFF" strokeWidth="4" /><rect x={x + 8} y="330" width="54" height="40" rx="8" fill={c.accent} /><rect x={x + 30} y="370" width="10" height="30" fill="#2F3747" /></g>)}
    <rect x="440" y="230" width="16" height="140" rx="8" fill="#FFFFFF" />
    {[0, 1, 2, 3, 4].map((i) => <line key={i} x1="440" y1={240 + i * 28} x2="456" y2={252 + i * 28} stroke="#E04F4F" strokeWidth="5" />)}
  </g>,
  shop: (c) => <g>
    {[250, 300, 350].map((y) => <rect key={y} x="180" y={y} width="270" height="8" fill="#7A5638" />)}
    {[250, 300, 350].map((y, r) => [0, 1, 2, 3, 4, 5, 6].map((i) => <rect key={`${y}${i}`} x={190 + i * 37} y={y - 30 + (i % 2) * 6} width="24" height={30 - (i % 2) * 6} rx="3" fill={[c.accent, "#4FA0E0", "#F1C27A", "#4F8150"][(i + r) % 4]} />))}
  </g>,
  venue: (c) => <g>
    <path d="M170 236 Q250 266 320 238 T460 240" stroke="#3A3A3A" strokeWidth="2" fill="none" />
    {[190, 225, 260, 295, 330, 365, 400, 435].map((x, i) => <circle key={x} cx={x} cy={244 + Math.sin(i) * 8} r="6" fill="#FFD27A" />)}
    {[210, 330].map((x) => <g key={x}><ellipse cx={x + 40} cy="350" rx="50" ry="10" fill="#EFEAE0" /><rect x={x + 36} y="350" width="8" height="50" fill="#5A3A2F" /><rect x={x + 30} y="330" width="10" height="18" fill="#B8643C" /><rect x={x + 50} y="334" width="8" height="14" fill="#F3F1EC" /></g>)}
  </g>,
};

export default function Storefront({ type, drone, cover, label }) {
  const gid = `sf${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const c = type;
  const unit = c.kind === "unit";
  return (
    <svg viewBox="0 0 800 520" preserveAspectRatio={cover ? "xMidYMid slice" : undefined} role="img" aria-label={label || `Illustration of a ${c.name.toLowerCase()} from the street`}>
      <defs>
        <linearGradient id={`${gid}-sky`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7FB2E2" /><stop offset="1" stopColor="#D8E9F6" /></linearGradient>
        <pattern id={`${gid}-awn`} width="40" height="40" patternUnits="userSpaceOnUse"><rect width="20" height="40" fill={c.awning} /><rect x="20" width="20" height="40" fill="#FFFFFF" /></pattern>
      </defs>
      <rect width="800" height="520" fill={`url(#${gid}-sky)`} />
      {/* neighbours */}
      <rect x="0" y="120" width="120" height="320" fill="#B9A58C" /><rect x="680" y="100" width="120" height="340" fill="#A8977F" />
      {[150, 230, 310].map((y) => <rect key={y} x="30" y={y} width="60" height="44" fill="#9CC3E6" stroke="#F2F6FB" strokeWidth="4" />)}
      {[140, 220, 300].map((y) => <rect key={y} x="710" y={y} width="60" height="44" fill="#9CC3E6" stroke="#F2F6FB" strokeWidth="4" />)}
      {unit ? (
        <g>
          {/* workshop unit with roller door and van */}
          <rect x="120" y="150" width="560" height="290" fill="#5D6E86" />
          {Array.from({ length: 14 }, (_, i) => <line key={i} x1={120 + i * 40} x2={120 + i * 40} y1="150" y2="440" stroke="rgba(0,0,0,0.12)" strokeWidth="2" />)}
          <polygon points="110,152 690,152 670,120 130,120" fill="#3F4C60" />
          <rect x="170" y="180" width="300" height="56" fill={c.color} /><text x="320" y="218" textAnchor="middle" className="sf-sign" fill="#FFFFFF">{c.sign}</text>
          <rect x="170" y="260" width="240" height="180" fill="#C9D3E0" />
          {Array.from({ length: 9 }, (_, i) => <line key={i} x1="170" x2="410" y1={270 + i * 19} y2={270 + i * 19} stroke="rgba(0,0,0,0.15)" strokeWidth="2" />)}
          <rect x="450" y="300" width="70" height="140" fill="#2F3747" /><rect x="545" y="260" width="110" height="80" fill="#9CC3E6" stroke="#F2F6FB" strokeWidth="5" />
          {/* van */}
          <g>
            <rect x="300" y="350" width="300" height="100" rx="12" fill="#FFFFFF" />
            <path d="M600 372 L660 372 L690 410 L690 450 L600 450Z" fill="#FFFFFF" />
            <path d="M610 380 L652 380 L676 408 L610 408Z" fill="#2C6FB0" />
            <rect x="300" y="396" width="300" height="16" fill={c.color} />
            <text x="450" y="390" textAnchor="middle" className="sf-van" fill={c.color}>{c.sign}</text>
            <circle cx="360" cy="452" r="22" fill="#1E2430" /><circle cx="630" cy="452" r="22" fill="#1E2430" />
            <circle cx="360" cy="452" r="9" fill="#AEB8C6" /><circle cx="630" cy="452" r="9" fill="#AEB8C6" />
          </g>
        </g>
      ) : (
        <g>
          {/* shop building */}
          <rect x="120" y="70" width="560" height="370" fill={c.wall} />
          {[180, 360, 540].map((x) => <rect key={x} x={x} y="84" width="80" height="44" fill="#9CC3E6" stroke="#F2F6FB" strokeWidth="4" />)}
          <rect x="140" y="146" width="520" height="60" fill={c.color} />
          <text x="400" y="188" textAnchor="middle" className="sf-sign" fill="#FFFFFF">{c.sign}</text>
          <path d={`M140 206 H660 V228 ${Array.from({ length: 13 }, (_, i) => `Q${660 - i * 40 - 20} 248 ${660 - (i + 1) * 40} 228`).join(" ")} Z`} fill={`url(#${gid}-awn)`} />
          <rect x="160" y="226" width="310" height="194" fill="#F6EBD8" />
          {WINDOW[c.id]?.(c)}
          <rect x="160" y="226" width="310" height="194" fill="rgba(156,195,230,0.18)" stroke="#2F3747" strokeWidth="8" />
          <rect x="500" y="236" width="110" height="204" fill={c.door} stroke="#2F3747" strokeWidth="6" />
          <rect x="516" y="252" width="78" height="96" fill="#9CC3E6" opacity="0.8" />
          <circle cx="596" cy="360" r="5" fill="#E8ECF5" />
          {/* A-board */}
          <polygon points="640,440 690,440 680,370 650,370" fill="#2F3747" /><rect x="654" y="380" width="22" height="30" fill="#F3F1EC" />
          {/* plant pots */}
          <rect x="128" y="412" width="26" height="28" fill="#C46A3F" /><circle cx="141" cy="400" r="18" fill="#3F7A52" />
        </g>
      )}
      {/* pavement and kerb */}
      <rect x="0" y="440" width="800" height="50" fill="#AEB8C6" />
      <rect x="0" y="490" width="800" height="30" fill="#3B4352" />
      {Array.from({ length: 11 }, (_, i) => <line key={i} x1={i * 80} x2={i * 80} y1="440" y2="490" stroke="rgba(0,0,0,0.12)" strokeWidth="2" />)}
      {drone && (
        <g className="sf-drone">
          <ellipse cx="400" cy="480" rx="26" ry="6" fill="rgba(0,0,0,0.18)" />
          <g transform="translate(400 40)">
            <line x1="-34" y1="-12" x2="34" y2="12" stroke="#C9D3E0" strokeWidth="5" /><line x1="34" y1="-12" x2="-34" y2="12" stroke="#C9D3E0" strokeWidth="5" />
            {[[-34, -12], [34, -12], [34, 12], [-34, 12]].map(([x, y]) => <ellipse key={`${x}${y}`} cx={x} cy={y} rx="20" ry="6" fill="rgba(232,236,245,0.5)" stroke="rgba(232,236,245,0.9)" />)}
            <ellipse cx="0" cy="0" rx="16" ry="9" fill="#E8ECF5" /><circle cx="8" cy="3" r="3" fill="#FF6B35" />
          </g>
        </g>
      )}
    </svg>
  );
}
