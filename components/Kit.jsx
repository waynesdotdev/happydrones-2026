/* The fleet: one grid, each card tagged with its tier.
   Data comes from KIT and KIT_TIERS in lib/site.js */
import Link from "next/link";
import KitIcon from "./KitIcon";
import { KIT, KIT_TIERS } from "@/lib/site";

const ORDER = ["everyday", "flagship", "heavy"];
const WORDS = ["None", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];

export default function Kit({ title, showLink = true, showFuture = true }) {
  const live = KIT.filter((k) => k.status !== "soon");
  const future = KIT.filter((k) => k.status === "soon").sort((a, b) => ORDER.indexOf(a.tier) - ORDER.indexOf(b.tier));
  const flying = live.filter((k) => k.id !== "camera" && k.id !== "pocket3").length;
  const flyingWord = WORDS[flying] || flying;
  const heading = title || `${flyingWord} aircraft. One pilot. The right tool for every job.`;
  const items = [...live].sort((a, b) => ORDER.indexOf(a.tier) - ORDER.indexOf(b.tier));
  const tierName = (id) => KIT_TIERS.find((t) => t.id === id)?.name || "";
  const card = (k) => (
    <article key={k.id} className={`kit-card${k.status === "soon" ? " is-soon" : ""}${k.tier === "heavy" ? " is-heavy" : ""}${k.tier === "flagship" ? " is-flagship" : ""}`}>
      <div className="kit-top">
        <span className="kit-icon"><KitIcon id={k.id} /></span>
        <span className="kit-badge">{k.status === "soon" ? "Coming soon" : tierName(k.tier)}</span>
      </div>
      <p className="kit-role">{k.role}</p>
      <h3>{k.name}</h3>
      <p className="kit-spec">{k.spec}</p>
      <p>{k.text}</p>
      <p className="kit-best">Best for: {k.best}</p>
    </article>
  );
  return (
    <section className="kit" id="kit" aria-labelledby="kit-title">
      <div className="wrap">
        <div className="kit-head">
          <h2 id="kit-title" className="section-title">{heading}</h2>
          <p className="section-sub">{flyingWord} aircraft and a handheld gimbal, from a palm-sized Neo 2 for social clips to a Pocket 3 that glides through the house in one take. You get the right tool for the job, not whatever happens to be in the van.</p>
        </div>
        <div className="kit-grid">{items.map(card)}</div>
        {showFuture && future.length > 0 && (
          <div className="kit-future">
            <div className="kit-future-head">
              <h3>Where Happy Drones is heading</h3>
              <p>Not in the fleet yet, and not offered until they are. These are the next steps as the business grows.</p>
            </div>
            <div className="kit-grid">{future.map(card)}</div>
          </div>
        )}
        {showLink && <p className="kit-more"><Link className="text-link" href="/fleet/">See the full fleet and what&apos;s coming next</Link></p>}
      </div>
    </section>
  );
}
