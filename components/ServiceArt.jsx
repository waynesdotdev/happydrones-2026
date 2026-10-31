/* =========================================================
 Illustrations used on the homepage tabs and the services page.
 Each one is a simple drawing in brand colours (320 x 240).
 Use: <ServiceArt name="home" />
 Names: camera, walkthrough, agent, home, business, event, roof, glide, construction
 ========================================================= */

const ARTS = {
  camera: (
    <svg viewBox="0 0 320 240" aria-hidden="true" focusable="false">
      <rect width="320" height="240" fill="#0B3E6B"/>
      <path d="M0 0h320L250 50H70z" fill="#0F477A"/>
      <path d="M0 240h320L250 170H70z" fill="#002A54"/>
      <path d="M0 0l70 50v120L0 240z" fill="#0A3560"/>
      <path d="M320 0l-70 50v120l70 70z" fill="#0A3560"/>
      <rect x="70" y="50" width="180" height="120" fill="#165089"/>
      <rect x="128" y="66" width="64" height="58" fill="#C9D8E8"/>
      <path d="M160 66v58M128 95h64" stroke="#4D7FB0" strokeWidth="3"/>
      <rect x="96" y="132" width="128" height="26" rx="4" fill="#4D7FB0"/>
      <rect x="104" y="122" width="40" height="14" rx="3" fill="#5A8CBD"/><rect x="176" y="122" width="40" height="14" rx="3" fill="#5A8CBD"/>
      <path d="M262 92c10 0 14 8 14 18v48" stroke="#5A8CBD" strokeWidth="4" fill="none"/><circle cx="262" cy="86" r="10" fill="#FFD9A6"/>
      <g stroke="rgba(255,255,255,.35)" strokeWidth="1"><path d="M107 0v240M213 0v240M0 80h320M0 160h320"/></g>
      <g fill="none" stroke="#FF6B35" strokeWidth="4"><path d="M24 44V24h20M296 44V24h-20M24 196v20h20M296 196v20h-20"/></g>
      <circle cx="160" cy="120" r="5" fill="none" stroke="#FF6B35" strokeWidth="2"/>
    </svg>
  ),
  walkthrough: (
    <svg viewBox="0 0 320 240" aria-hidden="true" focusable="false">
      <rect width="320" height="240" fill="#0B3E6B"/>
      <rect x="30" y="30" width="260" height="180" fill="#002A54" stroke="#5A8CBD" strokeWidth="5"/>
      <path d="M30 120h120M150 30v180M150 110h140M220 110v100" stroke="#5A8CBD" strokeWidth="4" fill="none"/>
      <path d="M60 210h36M150 60v34M150 150v34M240 110h34" stroke="#002A54" strokeWidth="7"/>
      <g fill="#FF6B35">
        <circle cx="78" cy="196" r="4"/><circle cx="82" cy="172" r="4"/><circle cx="96" cy="152" r="4"/><circle cx="118" cy="140" r="4"/>
        <circle cx="140" cy="166" r="4"/><circle cx="164" cy="168" r="4"/><circle cx="188" cy="160" r="4"/><circle cx="206" cy="140" r="4"/>
        <circle cx="222" cy="118" r="4"/><circle cx="246" cy="96" r="4"/><circle cx="252" cy="72" r="4"/>
      </g>
      <g transform="translate(252 50)">
        <rect x="-9" y="-16" width="18" height="34" rx="5" fill="#C9D8E8"/>
        <circle cx="0" cy="-8" r="5" fill="#002A54"/><circle cx="0" cy="-8" r="2" fill="#FF6B35"/>
      </g>
      <text x="90" y="80" fill="rgba(255,255,255,.55)" fontSize="13" fontWeight="700" textAnchor="middle">Kitchen</text>
      <text x="220" y="70" fill="rgba(255,255,255,.55)" fontSize="13" fontWeight="700" textAnchor="middle">Lounge</text>
      <text x="185" y="198" fill="rgba(255,255,255,.55)" fontSize="13" fontWeight="700" textAnchor="middle">Hall</text>
    </svg>
  ),
  agent: (
    <svg viewBox="0 0 320 240" aria-hidden="true" focusable="false">
      <rect width="320" height="240" fill="#0B3E6B"/>
      <path d="M0 176h320v64H0z" fill="#002A54"/>
      <path d="M0 196h320" stroke="#3D6E9E" strokeWidth="2" strokeDasharray="12 10"/>
      <path d="M20 176V96l50-36 50 36v80z" fill="#165089"/><path d="M14 98l56-44 56 44" fill="none" stroke="#4D7FB0" strokeWidth="8"/>
      <rect x="40" y="110" width="22" height="22" fill="#C9D8E8"/><rect x="80" y="110" width="22" height="22" fill="#C9D8E8"/><rect x="58" y="146" width="24" height="30" fill="#4D7FB0"/>
      <path d="M140 176v-90l50-36 50 36v90z" fill="#1B5486"/><path d="M134 88l56-44 56 44" fill="none" stroke="#5A8CBD" strokeWidth="8"/>
      <rect x="160" y="100" width="22" height="22" fill="#C9D8E8"/><rect x="200" y="100" width="22" height="22" fill="#C9D8E8"/><rect x="178" y="140" width="24" height="36" fill="#4D7FB0"/>
      <rect x="262" y="98" width="6" height="80" fill="#C9D8E8"/>
      <rect x="244" y="84" width="62" height="38" rx="3" fill="#FF6B35"/>
      <path d="M254 96h42M254 106h30" stroke="#fff" strokeWidth="5" strokeLinecap="round"/>
      <g fill="none" stroke="#FF6B35" strokeWidth="4"><path d="M130 40V28h12M250 40V28h-12M130 180v12h12M250 180v12h-12"/></g>
    </svg>
  ),
  home: (
    <svg viewBox="0 0 320 240" aria-hidden="true" focusable="false">
                    <rect width="320" height="240" fill="#0B3E6B"/>
                    <path d="M0 180h320v26H0z" fill="#002A54"/><path d="M0 193h320" stroke="#3D6E9E" strokeWidth="2" strokeDasharray="12 10"/>
                    <rect x="90" y="40" width="140" height="110" fill="#165089"/>
                    <rect x="112" y="64" width="96" height="58" fill="#4D7FB0"/><path d="M112 93h96" stroke="#2F6293" strokeWidth="3"/><rect x="112" y="64" width="96" height="29" fill="#5A8CBD"/>
                    <circle cx="60" cy="70" r="22" fill="#0A3560"/><circle cx="54" cy="64" r="9" fill="#165089"/>
                    <circle cx="262" cy="110" r="26" fill="#0A3560"/><circle cx="255" cy="102" r="10" fill="#165089"/>
                    <g fill="none" stroke="#FF6B35" strokeWidth="4"><path d="M98 58v-14h14M222 58v-14h-14M98 128v14h14M222 128v14h-14"/></g>
                  </svg>
  ),
  business: (
    <svg viewBox="0 0 320 240" aria-hidden="true" focusable="false">
                    <rect width="320" height="240" fill="#0B3E6B"/>
                    <rect x="40" y="30" width="240" height="120" fill="#4D7FB0"/><rect x="40" y="30" width="240" height="40" fill="#5A8CBD"/>
                    <g fill="#002A54"><rect x="40" y="160" width="240" height="60"/></g>
                    <g fill="#C9D8E8"><rect x="60" y="172" width="22" height="12"/><rect x="96" y="172" width="22" height="12"/><rect x="132" y="196" width="22" height="12"/><rect x="200" y="172" width="22" height="12"/></g>
                    <rect x="210" y="20" width="58" height="104" rx="9" fill="none" stroke="#FF6B35" strokeWidth="4"/>
                    <circle cx="239" cy="112" r="4" fill="#FF6B35"/>
                  </svg>
  ),
  event: (
    <svg viewBox="0 0 320 240" aria-hidden="true" focusable="false">
                    <rect width="320" height="240" fill="#0B3E6B"/>
                    <rect x="70" y="40" width="180" height="70" rx="6" fill="#5A8CBD"/><path d="M70 75h180" stroke="#4D7FB0" strokeWidth="3"/>
                    <g fill="#C9D8E8">
                      <circle cx="90" cy="150" r="6"/><circle cx="110" cy="160" r="6"/><circle cx="130" cy="148" r="6"/><circle cx="150" cy="162" r="6"/><circle cx="170" cy="150" r="6"/><circle cx="190" cy="160" r="6"/><circle cx="210" cy="148" r="6"/><circle cx="230" cy="158" r="6"/>
                      <circle cx="100" cy="180" r="6"/><circle cx="120" cy="190" r="6"/><circle cx="140" cy="178" r="6"/><circle cx="160" cy="190" r="6"/><circle cx="180" cy="180" r="6"/><circle cx="200" cy="190" r="6"/><circle cx="220" cy="180" r="6"/>
                    </g>
                    <circle cx="160" cy="170" r="7" fill="#FF6B35"/><circle cx="174" cy="170" r="7" fill="#FF6B35"/>
                  </svg>
  ),
  roof: (
    <svg viewBox="0 0 320 240" aria-hidden="true" focusable="false">
                    <rect width="320" height="240" fill="#0B3E6B"/>
                    <path d="M40 60h240v120H40z" fill="#4D7FB0"/><path d="M40 60h240v60H40z" fill="#5A8CBD"/><path d="M40 120h240" stroke="#2F6293" strokeWidth="4"/>
                    <g stroke="#3F72A3" strokeWidth="2"><path d="M40 80h240M40 100h240M40 140h240M40 160h240"/></g>
                    <rect x="200" y="36" width="34" height="34" fill="#2F6293"/>
                    <circle cx="132" cy="92" r="22" fill="none" stroke="#FF6B35" strokeWidth="4"/>
                    <path d="M126 86l12 12M138 86l-12 12" stroke="#FF6B35" strokeWidth="3"/>
                  </svg>
  ),
  glide: (
    <svg viewBox="0 0 320 240" aria-hidden="true" focusable="false">
      <rect width="320" height="240" fill="#0B3E6B"/>
      <rect x="40" y="40" width="240" height="160" fill="#002A54" stroke="#5A8CBD" strokeWidth="5"/>
      <path d="M40 120h110M150 40v160M150 130h130" stroke="#5A8CBD" strokeWidth="4" fill="none"/>
      <path d="M85 200h30M150 70v30M190 130h30M70 120h30" stroke="#002A54" strokeWidth="7"/>
      <path d="M100 236V170c0-20 20-25 40-25h40c25 0 30-15 25-30l-20-20c-10-10-30-15-50-20L100 60V10" fill="none" stroke="#FF6B35" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="100" cy="60" r="9" fill="#FF6B35" stroke="#fff" strokeWidth="3"/>
    </svg>
  ),
  film: (
    <svg viewBox="0 0 320 240" aria-hidden="true" focusable="false">
      <rect width="320" height="240" fill="#062A4D"/>
      <circle cx="230" cy="150" r="70" fill="#FF6B35" opacity="0.35"/>
      <circle cx="230" cy="150" r="36" fill="#FF8F66"/>
      <path d="M0 170 L60 130 L110 160 L170 110 L230 150 L320 120 V240 H0Z" fill="#0B3E6B"/>
      <path d="M0 200 L80 175 L150 195 L220 170 L320 190 V240 H0Z" fill="#0F477A"/>
      <g fill="#C9D8E8"><rect x="40" y="196" width="10" height="16"/><rect x="56" y="190" width="12" height="22"/><rect x="74" y="200" width="9" height="12"/></g>
      <rect x="20" y="20" width="280" height="200" fill="none" stroke="#C9D8E8" strokeWidth="2" strokeDasharray="2 10"/>
      <text x="30" y="40" fill="#FF6B35" fontSize="13" fontFamily="sans-serif" fontWeight="700">4K · REC</text>
    </svg>
  ),
  mapping: (
    <svg viewBox="0 0 320 240" aria-hidden="true" focusable="false">
      <rect width="320" height="240" fill="#0B3E6B"/>
      <g stroke="#3D6E9E" strokeWidth="1.5">{[40,80,120,160,200,240,280].map((x) => <path key={x} d={`M${x} 0V240`} />)}{[40,80,120,160,200].map((y) => <path key={y} d={`M0 ${y}H320`} />)}</g>
      <path d="M50 190 L90 70 L170 50 L260 90 L270 180 L150 205Z" fill="#4D7FB0" opacity="0.7" stroke="#C9D8E8" strokeWidth="2"/>
      <rect x="120" y="100" width="60" height="44" fill="#1B5486" stroke="#C9D8E8" strokeWidth="2"/>
      <g fill="#FF6B35">{[[50,190],[90,70],[170,50],[260,90],[270,180],[150,205]].map(([x,y]) => <circle key={x} cx={x} cy={y} r="6" />)}</g>
      <path d="M40 30 H120 V60 H200 V30 H280" fill="none" stroke="#FF6B35" strokeWidth="3" strokeDasharray="6 6"/>
    </svg>
  ),
  construction: (
    <svg viewBox="0 0 320 240" aria-hidden="true" focusable="false">
      <rect width="320" height="240" fill="#0B3E6B"/>
      <rect x="30" y="30" width="260" height="180" fill="#0F477A" stroke="#3D6E9E" strokeWidth="3" strokeDasharray="10 8"/>
      <rect x="60" y="60" width="120" height="90" fill="#4D7FB0"/>
      <g stroke="#2F6293" strokeWidth="3"><path d="M60 90h120M60 120h120M100 60v90M140 60v90"/></g>
      <rect x="200" y="140" width="60" height="40" fill="#1B5486"/>
      <g fill="#C9D8E8"><rect x="208" y="70" width="14" height="24"/><rect x="232" y="70" width="14" height="24"/></g>
      <circle cx="230" cy="110" r="10" fill="#FF6B35"/>
      <path d="M230 110L90 40" stroke="#FF6B35" strokeWidth="7" strokeLinecap="round"/>
      <path d="M230 110l40 18" stroke="#FF6B35" strokeWidth="7" strokeLinecap="round"/>
      <rect x="84" y="40" width="4" height="40" fill="#C9D8E8"/>
    </svg>
  ),
};

export default function ServiceArt({ name }) {
  return ARTS[name] || null;
}
