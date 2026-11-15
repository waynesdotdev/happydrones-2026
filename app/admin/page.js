/* ADMIN: Wayne's bookings, customers, emails and activity log.
   Admin role only (ADMIN_EMAIL). components/acct/AdminApp.jsx. Not linked; noindex. */
import AdminApp from "@/components/acct/AdminApp";

export const metadata = { title: "Admin", robots: { index: false, follow: false, nocache: true } };

export default function AdminPage() {
  return (
    <div className="sub-page">
      <section className="t-section t-dark" style={{ paddingTop: "clamp(40px, 6vw, 72px)" }}><div className="wrap"><AdminApp /></div></section>
    </div>
  );
}
