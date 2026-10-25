"use client";
/* The Call / WhatsApp / Get a quote bar that slides up on phones. */
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { SITE, whatsappLink } from "@/lib/site";

export default function Dock() {
  const [on, setOn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => {
      const hero = document.querySelector(".hero");
      setOn(window.scrollY > (hero ? hero.offsetHeight * 0.6 : 240));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  const wa = whatsappLink();
  return (
    <nav className={`dock${on ? " is-on" : ""}`} aria-label="Quick actions">
      {SITE.phone && <a href={`tel:${SITE.phone}`}>Call</a>}
      {wa && <a href={wa} target="_blank" rel="noopener">WhatsApp</a>}
      <Link className="dock-main" href="/#quote">Get a quote</Link>
    </nav>
  );
}
