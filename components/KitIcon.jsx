/* Simple drawings of each piece of kit. <KitIcon id="mini4" /> */
export default function KitIcon({ id }) {
  const c = { viewBox: "0 0 64 40", "aria-hidden": true, focusable: "false" };
  switch (id) {
    case "camera":
      return (
        <svg {...c}>
          <rect x="10" y="10" width="38" height="24" rx="4" fill="currentColor" />
          <rect x="16" y="6" width="12" height="6" rx="2" fill="currentColor" />
          <circle cx="29" cy="22" r="9" fill="#fff" /><circle cx="29" cy="22" r="6" fill="currentColor" /><circle cx="29" cy="22" r="2.5" fill="#FF6B35" />
          <rect x="48" y="14" width="8" height="16" rx="3" fill="#FF6B35" />
        </svg>
      );
    case "mini4":
      return (
        <svg {...c}>
          <path d="M22 20H6M42 20h16M22 26L8 34M42 26l14 8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="6" cy="18" rx="7" ry="2" fill="#FF6B35" /><ellipse cx="58" cy="18" rx="7" ry="2" fill="#FF6B35" />
          <ellipse cx="8" cy="33" rx="7" ry="2" fill="#FF6B35" /><ellipse cx="56" cy="33" rx="7" ry="2" fill="#FF6B35" />
          <rect x="20" y="13" width="24" height="16" rx="6" fill="currentColor" />
        </svg>
      );
    case "pocket3":
      return (
        <svg {...c}>
          <rect x="25" y="14" width="14" height="24" rx="5" fill="currentColor" />
          <rect x="22" y="3" width="20" height="13" rx="3" fill="currentColor" />
          <circle cx="32" cy="9.5" r="4" fill="#fff" /><circle cx="32" cy="9.5" r="2" fill="#FF6B35" />
          <rect x="28" y="22" width="8" height="5" rx="1.5" fill="#FF6B35" />
        </svg>
      );
    case "avata2":
      return (
        <svg {...c}>
          <g fill="none" stroke="currentColor" strokeWidth="3">
            <ellipse cx="14" cy="12" rx="10" ry="5" /><ellipse cx="50" cy="12" rx="10" ry="5" />
            <ellipse cx="14" cy="30" rx="10" ry="5" /><ellipse cx="50" cy="30" rx="10" ry="5" />
          </g>
          <rect x="24" y="11" width="16" height="20" rx="6" fill="currentColor" /><circle cx="32" cy="27" r="3" fill="#FF6B35" />
        </svg>
      );
    case "neo2":
      return (
        <svg {...c}>
          <rect x="18" y="8" width="28" height="24" rx="9" fill="currentColor" />
          <circle cx="24" cy="14" r="5" fill="#FF6B35" /><circle cx="40" cy="14" r="5" fill="#FF6B35" />
          <circle cx="24" cy="26" r="5" fill="#FF6B35" /><circle cx="40" cy="26" r="5" fill="#FF6B35" />
          <circle cx="32" cy="20" r="3.5" fill="#fff" />
        </svg>
      );
    case "mavic4":
      return (
        <svg {...c}>
          <path d="M20 17L6 9M44 17l14-8M20 25L6 33M44 25l14 8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="6" cy="8" rx="8" ry="2" fill="#FF6B35" /><ellipse cx="58" cy="8" rx="8" ry="2" fill="#FF6B35" />
          <ellipse cx="6" cy="34" rx="8" ry="2" fill="#FF6B35" /><ellipse cx="58" cy="34" rx="8" ry="2" fill="#FF6B35" />
          <rect x="18" y="12" width="28" height="18" rx="7" fill="currentColor" />
          <circle cx="26" cy="21" r="3" fill="#fff" /><circle cx="33" cy="21" r="2.4" fill="#fff" /><circle cx="39" cy="21" r="1.8" fill="#fff" />
        </svg>
      );
    case "mavic3":
      return (
        <svg {...c}>
          <path d="M20 16L5 10M44 16l15-6M20 26L5 32M44 26l15 6" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" />
          <ellipse cx="5" cy="9" rx="8" ry="2" fill="#FF6B35" /><ellipse cx="59" cy="9" rx="8" ry="2" fill="#FF6B35" />
          <ellipse cx="5" cy="33" rx="8" ry="2" fill="#FF6B35" /><ellipse cx="59" cy="33" rx="8" ry="2" fill="#FF6B35" />
          <rect x="17" y="11" width="30" height="20" rx="8" fill="currentColor" />
          <circle cx="32" cy="21" r="5" fill="#fff" /><circle cx="32" cy="21" r="2.5" fill="currentColor" />
        </svg>
      );
    case "m4e":
      return (
        <svg {...c}>
          <path d="M22 15H4M42 15h18M22 23H4M42 23h18" stroke="currentColor" strokeWidth="3.6" strokeLinecap="round" />
          <ellipse cx="4" cy="12" rx="9" ry="2.2" fill="#FF6B35" /><ellipse cx="60" cy="12" rx="9" ry="2.2" fill="#FF6B35" />
          <ellipse cx="4" cy="20" rx="9" ry="2.2" fill="#FF6B35" /><ellipse cx="60" cy="20" rx="9" ry="2.2" fill="#FF6B35" />
          <rect x="18" y="8" width="28" height="20" rx="5" fill="currentColor" />
          <rect x="24" y="28" width="16" height="8" rx="3" fill="currentColor" /><circle cx="29" cy="32" r="2" fill="#fff" /><circle cx="35" cy="32" r="2" fill="#fff" />
        </svg>
      );
    default:
      return null;
  }
}
