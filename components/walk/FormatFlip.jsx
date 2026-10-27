"use client";
/* One shoot, two shapes: switch between the landscape portal version and the
   vertical social cut, and watch the frame reshape around the same room. */
import { useState } from "react";
import RoomScene from "@/components/photo/RoomScene";
import { WT_FORMATS } from "@/lib/walkthrough";

export default function FormatFlip() {
  const [f, setF] = useState("land");
  const vert = f === "vert";
  const cur = WT_FORMATS.find((x) => x.id === f);
  return (
    <div className="wt-fmt">
      <div className="wt-fmt-tabs" role="group" aria-label="Video format">
        {WT_FORMATS.map((x) => (
          <button key={x.id} type="button" aria-pressed={f === x.id} className={f === x.id ? "on" : undefined} onClick={() => setF(x.id)}>
            <span className={`wt-fmt-ico ${x.id}`} aria-hidden="true" /><span><b>{x.name}</b><small>{x.where}</small></span>
          </button>
        ))}
      </div>
      <div className={`wt-fmt-stage${vert ? " vert" : ""}`} role="img" aria-label={`The same kitchen framed for ${cur.name}`}>
        <RoomScene room="kitchen" cover />
        <div className="wt-fmt-win" aria-hidden="true">
          <div className="wt-fmt-ui">
            <span className="wt-fmt-cap"><b>Kitchen-diner</b> 14 Example Road</span>
            <span className="wt-fmt-icons"><i /><i /><i /></span>
          </div>
        </div>
      </div>
      <p className="wt-fmt-note">{vert ? "The vertical cut is reframed shot by shot, not squashed or cropped blindly, with captions kept clear of the app's buttons." : "The landscape version is the full walkthrough, made for portals, YouTube and your own website."}</p>
    </div>
  );
}
