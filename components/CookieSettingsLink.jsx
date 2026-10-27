"use client";
/* Footer link that re-opens the cookie banner. */
import { openConsent } from "@/lib/consent";

export default function CookieSettingsLink() {
  return (
    <button type="button" className="link-button" onClick={openConsent}>
      Cookie settings
    </button>
  );
}
