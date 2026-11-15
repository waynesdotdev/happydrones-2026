"use client";
/* The customer's private view of an enquiry, from the link in their email. */
import { useEffect, useState } from "react";
import { api, when } from "@/lib/acct/client";
import { CATALOG } from "@/lib/acct/catalog";
import { money, SITE, whatsappLink } from "@/lib/site";

export default function EnquiryView() {
  const [d, setD] = useState(null);
  useEffect(() => {
    const t = new URLSearchParams(location.search).get("t") || "";
    api(`/api/enquiry?t=${encodeURIComponent(t)}`).then(setD);
  }, []);
  if (!d) return <p className="ac-lede">Loading your request…</p>;
  if (d.error) return <div className="ac-form"><p className="ac-err">{d.message}</p><p>Any questions, email <a href={`mailto:${SITE.email}`}>{SITE.email}</a> or call {SITE.phoneDisplay}.</p></div>;
  const svc = CATALOG.find((c) => c.id === d.serviceId);
  const closed = ["lost", "scrapped"].includes(d.status);
  const wa = whatsappLink(`Hi Wayne, it's about my ${d.kind} (${d.ref}).`);
  return (
    <div className="ac-wrap">
      <div className={`ac-card${d.booking ? " ac-todo" : ""}`}>
        <header><span className="t-mono">{d.ref}</span><span className={`ac-badge ac-${d.status === "won" ? "good" : closed ? "muted" : "info"}`}>{d.statusText}</span></header>
        <h3>Your {d.kind}</h3>
        <p className="ac-meta">Sent {when(d.created)}{d.price ? ` · guide price ${money(d.price)}` : ""}</p>
        {d.booking ? (
          <div className="ac-next"><p><b>Your booking is ready.</b> {d.booking.toSign ? "Sign in (or create a free account with the email this was sent to), then read and sign the booking agreement." : "See it in your account."}</p>
            <a className="t-btn t-btn-primary" href={`/account/${d.booking.toSign ? `#sign-${d.booking.ref}` : ""}`}>{d.booking.toSign ? "Sign your booking" : "Go to my account"}</a></div>
        ) : !closed && (
          <div className="ac-next"><p><b>What happens next:</b> Wayne checks the site and the airspace and replies within a day with a fixed price and dates.{svc ? " Happy with the guide price? You can book it online now." : ""}</p>
            <div className="ac-actions">
              {svc && <a className="t-btn t-btn-primary" href={`/account/?book=${svc.id}`}>Book {svc.name} online</a>}
              {wa && <a className="t-btn t-btn-ghost" href={wa} target="_blank" rel="noopener">WhatsApp Wayne</a>}
              {SITE.phone && <a className="t-btn t-btn-ghost" href={`tel:${SITE.phone}`}>Call {SITE.phoneDisplay}</a>}
            </div></div>
        )}
        <h4>What you sent</h4>
        <div className="ac-jobd"><table><tbody>{d.fields.map(([k, v], i) => <tr key={i}><th scope="row">{k}</th><td className="ad-pre">{v}</td></tr>)}</tbody></table></div>
        <p className="ac-small">Need to change something? Reply to your confirmation email, or email <a href={`mailto:${SITE.email}?subject=${encodeURIComponent(d.ref)}`}>{SITE.email}</a>. Requests that don&apos;t become a booking are deleted after 12 months.</p>
      </div>
    </div>
  );
}
