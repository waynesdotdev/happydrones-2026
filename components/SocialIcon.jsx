/* Simple outline icons for each social platform (not the official logos). */
export default function SocialIcon({ id }) {
  const common = { viewBox: "0 0 24 24", "aria-hidden": true, focusable: "false" };
  switch (id) {
    case "youtube":
      return (<svg {...common}><rect x="2.5" y="5" width="19" height="14" rx="4" /><path className="fill" d="M10 9v6l5-3z" /></svg>);
    case "tiktok":
      return (<svg {...common}><path d="M9 18a3 3 0 1 1-3-3M9 18V4l10-1.5v12" /><circle cx="16" cy="15" r="3" /></svg>);
    case "facebook":
      return (<svg {...common}><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c.6-3.6 3.3-6 6.5-6s5.9 2.4 6.5 6" /><circle cx="17" cy="9" r="2.5" /><path d="M16 14.2c2.8-.3 5 1.7 5.5 4.8" /></svg>);
    case "x":
      return (<svg {...common}><path d="M4 5h16v11H9l-5 4z" /><path d="M8 9.5h8M8 12.5h5" /></svg>);
    default:
      return (<svg {...common}><circle cx="12" cy="12" r="9" /></svg>);
  }
}
