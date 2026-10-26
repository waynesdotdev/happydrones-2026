/* CHANGELOG — unlisted page at /changelog. Not linked anywhere, hidden from
   search engines and left out of the sitemap. Entries live in lib/changelog.js. */
import { CHANGELOG, REPO } from "@/lib/changelog";

export const metadata = {
  title: "Changelog",
  description: "Every change made to the Happy Drones website.",
  robots: { index: false, follow: false },
};

const TYPES = {
  new: "New",
  change: "Change",
  fix: "Fix",
  content: "Content",
  setup: "Setup",
};

function niceDate(d) {
  return new Date(d + "T12:00:00Z").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "long", year: "numeric", timeZone: "Europe/London" });
}

export default function ChangelogPage() {
  const days = [];
  for (const e of CHANGELOG) {
    const last = days[days.length - 1];
    if (last && last.date === e.date) last.items.push(e);
    else days.push({ date: e.date, items: [e] });
  }
  const latest = CHANGELOG[0];
  const counts = Object.keys(TYPES).map((t) => [t, CHANGELOG.filter((e) => e.type === t).length]).filter(([, n]) => n);

  return (
    <div className="sub-page">
      <section className="simple">
        <div className="wrap simple-inner cl">
          <p className="page-eyebrow">Unlisted</p>
          <h1 className="section-title">Changelog</h1>
          <p>
            Every change to happydrones.co.uk, newest first. Last change: <b>{niceDate(latest.date)}{latest.time ? `, ${latest.time}` : ""}</b>.
          </p>
          <div className="cl-stats">
            <span><b>{CHANGELOG.length}</b> changes</span>
            {counts.map(([t, n]) => <span key={t} className={`cl-type cl-${t}`}>{TYPES[t]} {n}</span>)}
            <a href={`${REPO}/commits/main`} target="_blank" rel="noopener">Full history on GitHub</a>
          </div>

          <ol className="cl-days">
            {days.map((day) => (
              <li key={day.date} className="cl-day">
                <h2 className="cl-date">{niceDate(day.date)}</h2>
                <ol className="cl-tree">
                  {day.items.map((e, i) => (
                    <li key={i} className={`cl-item cl-dot-${e.type}`}>
                      <div className="cl-meta">
                        <span className={`cl-type cl-${e.type}`}>{TYPES[e.type] || e.type}</span>
                        {e.time && <time>{e.time}</time>}
                        <span className="cl-by">{e.by}</span>
                        {e.commit && (
                          <a className="cl-commit" href={`${REPO}/commit/${e.commit}`} target="_blank" rel="noopener">{e.commit}</a>
                        )}
                      </div>
                      <p className="cl-title">{e.title}</p>
                      {e.notes?.length > 0 && <ul className="cl-notes">{e.notes.map((n) => <li key={n}>{n}</li>)}</ul>}
                    </li>
                  ))}
                </ol>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
