/* A service card in the dark commercial style. Links to /services/<id>/ */
import Link from "next/link";
import { Arrow } from "./TIcons";
import { money, fromPrice } from "@/lib/site";

export default function MissionCard({ s }) {
  return (
    <Link className={`t-svc${s.soon ? " is-soon" : ""}`} href={`/services/${s.id}/`}>
      <div className="t-svc-top"><span className="t-svc-code">{s.code}</span><span className="t-svc-alt">{s.soon ? "COMING SOON" : `ALT ${s.alt} m`}</span></div>
      <h3>{s.title}</h3>
      <p>{s.lede}</p>
      <div className="t-svc-foot">
        {s.soon
          ? <span className="t-svc-price"><b>Coming soon</b>Not bookable yet</span>
          : <span className="t-svc-price">From<b>{money(fromPrice(s))}</b>{s.fromLabel ? "per visit" : s.group === "homes" ? "per property" : "per job"}</span>}
        <span className="t-arrow"><Arrow /></span>
      </div>
    </Link>
  );
}
