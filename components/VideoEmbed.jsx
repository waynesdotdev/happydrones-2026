"use client";
/* Shows a YouTube thumbnail and only loads the player when tapped (keeps pages fast). */
import { useState } from "react";

export default function VideoEmbed({ id, title }) {
  const [playing, setPlaying] = useState(false);
  if (!id) return null;
  return (
    <div className="video">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1`}
          title={title}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
        />
      ) : (
        <button type="button" className="video-start" aria-label={`Play video: ${title}`} onClick={() => setPlaying(true)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="video-thumb" src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" />
          <span className="video-play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" /></svg></span>
        </button>
      )}
    </div>
  );
}
