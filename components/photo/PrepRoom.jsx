"use client";
/* Get the room ready: tick each item and watch the room change, from
   "as found" to photo-ready. Items: PP_PREP in lib/propertyPhoto.js. */
import { useState } from "react";
import RoomScene from "@/components/photo/RoomScene";
import { PP_PREP } from "@/lib/propertyPhoto";

export default function PrepRoom() {
  const [done, setDone] = useState([]);
  const flip = (id) => setDone((d) => (d.includes(id) ? d.filter((x) => x !== id) : [...d, id]));
  const mess = ["surfaces", "cushions", "toys", "laundry"].filter((m) => !done.includes(m));
  const all = done.length === PP_PREP.length;
  return (
    <div className="pp-prep">
      <figure className="pp-prep-fig">
        <RoomScene room="living" lights={done.includes("lights")} curtains={done.includes("curtains") ? "open" : "closed"} mess={mess}
          label={`Living room, ${done.length} of ${PP_PREP.length} prep jobs done`} />
        <figcaption>
          <span className="pp-prep-meter" aria-hidden="true"><i style={{ width: `${(done.length / PP_PREP.length) * 100}%` }} /></span>
          <b>{all ? "Ready for its photo" : `${done.length} of ${PP_PREP.length} done`}</b>
        </figcaption>
      </figure>
      <div className="pp-prep-side">
        <ul className="pp-prep-list">
          {PP_PREP.map((x) => (
            <li key={x.id}>
              <button type="button" aria-pressed={done.includes(x.id)} className={done.includes(x.id) ? "on" : undefined} onClick={() => flip(x.id)}>
                <span className="pp-check" aria-hidden="true" />
                <span><b>{x.t}</b><small>{x.d}</small></span>
              </button>
            </li>
          ))}
        </ul>
        <div className="pp-prep-btns">
          <button type="button" className="t-btn t-btn-primary" onClick={() => setDone(PP_PREP.map((x) => x.id))}>Do it all</button>
          <button type="button" className="t-btn t-btn-ghost" onClick={() => setDone([])}>Back to as found</button>
        </div>
      </div>
    </div>
  );
}
