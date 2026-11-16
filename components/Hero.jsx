"use client";
/* Homepage hero: the live flyover with the camera display on top. */
import Link from "next/link";
import { useEffect, useRef } from "react";
import { startFlyover } from "@/lib/flyover";
import { SITE } from "@/lib/site";

export default function Hero() {
  const heroRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;
    return startFlyover({
      hero,
      canvas: hero.querySelector(".flyover"),
      hud: hero.querySelector(".hud"),
      lock: hero.querySelector("#lock"),
      lockLabel: hero.querySelector(".lock-label"),
    });
  }, []);

  return (
    <section className="hero" id="top" aria-label="Introduction" ref={heroRef}>
      <canvas className="flyover" aria-hidden="true"></canvas>

      <div className="hud" aria-hidden="true">
        <div className="hud-frame">
          <span className="corner tl"></span><span className="corner tr"></span>
          <span className="corner bl"></span><span className="corner br"></span>
        </div>
        <div className="hud-top">
          <span className="rec"><i></i> REC <b id="hud-timer">00:00:00</b></span>
          <span className="hud-spec">4K 60</span>
          <span className="hud-batt"><span className="batt"><i id="hud-batt-bar"></i></span> <b id="hud-batt">98</b>%</span>
        </div>
        <div className="hud-cross"><span></span></div>
        <div className="lock" id="lock">
          <span className="lb tl"></span><span className="lb tr"></span>
          <span className="lb bl"></span><span className="lb br"></span>
          <span className="lock-label">Your listing?</span>
        </div>
        <div className="hud-side">
          <div className="readout"><small>ALT</small><b id="hud-alt">40</b><small>m</small></div>
          <div className="readout"><small>SPD</small><b id="hud-spd">6.2</b><small>m/s</small></div>
          <div className="readout"><small>GPS</small><b id="hud-gps">18</b><small>sats</small></div>
        </div>
        <div className="compass"><div className="compass-tape" id="compass"></div><span className="compass-tick"></span></div>
      </div>

      <div className="hero-copy">
        <h1>Your regular<br />drone pilot.</h1>
        <p className="hero-sub">
          Listings for estate agents, monthly progress for builders, and roof and building checks for landlords and trades. One pilot, fixed prices, {SITE.areaShort}.
        </p>
        <div className="hero-ctas">
          <Link className="btn btn-orange" href="/business/">For business</Link>
          <Link className="btn btn-ghost" href="/estate-agents/">Estate agents</Link>
          <Link className="btn btn-ghost" href="/#packages">Selling your own home?</Link>
        </div>
        {/*<p className="hero-note">Prices in under a minute. No sign-up.</p>*/}
      </div>

      <a className="scroll-cue" href="#services" aria-label="Scroll to who I work for"><span></span></a>
    </section>
  );
}
