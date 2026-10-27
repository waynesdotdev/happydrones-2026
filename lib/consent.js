/* Cookie choice: remembered in the visitor's own browser so the banner
   only shows once. Saving the choice itself is "strictly necessary", so it
   needs no consent. Bump VERSION to ask everyone again (e.g. if you add
   analytics or a tracking pixel later). */
export const CONSENT_KEY = "hd-cookie-choice";
export const CONSENT_VERSION = 1;
export const CONSENT_EVENT = "hd-consent-change";
export const OPEN_EVENT = "hd-consent-open";

// Returns "accepted", "declined" or null (not chosen yet / storage blocked)
export function getConsent() {
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const v = JSON.parse(raw);
    return v && v.version === CONSENT_VERSION ? v.choice : null;
  } catch {
    return null;
  }
}

export function setConsent(choice) {
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify({ choice, version: CONSENT_VERSION, date: new Date().toISOString() }));
  } catch {
    /* storage blocked: the choice still applies for this visit */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: choice }));
}

// Re-open the banner (footer "Cookie settings" link)
export function openConsent() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}
