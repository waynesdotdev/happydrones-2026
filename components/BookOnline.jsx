/* "Book online" button: opens the account page with this service chosen.
   Shows nothing if the service can't be booked online (not in lib/acct/catalog.js). */
import Link from "next/link";
import { CATALOG } from "@/lib/acct/catalog";

export default function BookOnline({ id, className = "t-btn t-btn-ghost", block = false, children = "Book online" }) {
  if (!CATALOG.some((c) => c.id === id)) return null;
  return <Link className={`${className}${block ? " t-btn-block" : ""}`} href={`/account/?book=${id}`}>{children}</Link>;
}
