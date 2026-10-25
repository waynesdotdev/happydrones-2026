/* The navy strip under the hero: rescheduling, insurance, delivery. */
import { SITE } from "@/lib/site";

export default function Promises() {
  return (
    <section className="promises" aria-label="What every booking includes">
      <div className="wrap promise-row">
        <div className="promise">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 18a4 4 0 0 1-.6-8A6 6 0 0 1 18 9a4.5 4.5 0 0 1-.5 9z" /><path d="M9 21l1-2M13 21l1-2" /></svg>
          <div><strong>No-risk rescheduling</strong><span>If the weather isn&apos;t safe for flying, your shoot moves to the next good day at no extra cost. Waiting for the right conditions means better-looking results.</span></div>
        </div>
        <div className="promise">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z" /><path d="M8.5 12l2.5 2.5 4.5-5" /></svg>
          <div>
            <strong>{SITE.insurance.publicLiability} insured</strong>
            <span>Public liability, plus {SITE.insurance.professionalIndemnity} professional indemnity. CAA registered. ICO Registered.</span>
          </div>
        </div>
        <div className="promise">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
          <div><strong>Fast delivery</strong><span>Edited photos and video within 48 - 72 hours, by download link, sized for every portal.</span></div>
        </div>
      </div>
    </section>
  );
}
