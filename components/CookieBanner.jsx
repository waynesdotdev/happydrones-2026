"use client";
/* Cookie banner for first-time visitors. Shows until they choose, then
   stays hidden. "Cookie settings" in the footer brings it back.
   The site sets no tracking cookies; "Accept" only allows third-party
   embeds (YouTube) to load straight away. Words: see /cookies. */
import { useEffect, useState } from "react";
import Link from "next/link";
import { getConsent, setConsent, OPEN_EVENT } from "@/lib/consent";

export default function CookieBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (getConsent() === null) setOpen(true);
    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, reopen);
    return () => window.removeEventListener(OPEN_EVENT, reopen);
  }, []);

  if (!open) return null;

  const choose = (choice) => {
    setConsent(choice);
    setOpen(false);
  };

  return (
    <div className="cookie-banner" role="region" aria-label="Cookie choices">
      <div className="cookie-inner">
        <p>
          <b>Cookies on Happy Drones.</b> This site doesn&apos;t use tracking or advertising cookies. If you accept,
          videos from YouTube can load straight away, and YouTube may set its own cookies.{" "}
          <Link href="/cookies/">Cookie policy</Link>
        </p>
        <div className="cookie-actions">
          <button type="button" className="btn btn-ghost btn-small" onClick={() => choose("declined")}>Essential only</button>
          <button type="button" className="btn btn-orange btn-small" onClick={() => choose("accepted")}>Accept</button>
        </div>
      </div>
    </div>
  );
}
