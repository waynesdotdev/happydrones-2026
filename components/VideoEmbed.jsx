"use client";
/* Shows a YouTube thumbnail and only loads the player when tapped (keeps pages fast).
   If the visitor hasn't accepted cookies, tapping first explains that YouTube
   may set cookies, with "Play anyway" or "Watch on YouTube" instead. */
import { useEffect, useState } from "react";
import { getConsent, CONSENT_EVENT } from "@/lib/consent";

export default function VideoEmbed({ id, title }) {
  const [playing, setPlaying] = useState(false);
  const [asking, setAsking] = useState(false);
  const [consent, setConsentState] = useState(null);

  useEffect(() => {
    setConsentState(getConsent());
    const update = (e) => setConsentState(e.detail);
    window.addEventListener(CONSENT_EVENT, update);
    return () => window.removeEventListener(CONSENT_EVENT, update);
  }, []);

  if (!id) return null;

  const start = () => (consent === "accepted" ? setPlaying(true) : setAsking(true));

  return (
    <div className="video">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1`}
          title={title}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
        />
      ) : asking ? (
        <div className="video-ask">
          <p>This video is hosted by YouTube, which may set cookies when it plays.</p>
          <div className="video-ask-actions">
            <button type="button" className="btn btn-orange" onClick={() => setPlaying(true)}>Play anyway</button>
            <a className="btn btn-ghost" href={`https://www.youtube.com/watch?v=${id}`} target="_blank" rel="noopener">Watch on YouTube</a>
          </div>
        </div>
      ) : (
        <button type="button" className="video-start" aria-label={`Play video: ${title}`} onClick={start}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="video-thumb" src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" />
          <span className="video-play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" /></svg></span>
        </button>
      )}
    </div>
  );
}
