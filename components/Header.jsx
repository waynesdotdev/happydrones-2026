"use client";
/* Top bar: logo, menu links, "Get a quote" button and the phone menu. */
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Add, remove or rename menu links here
const NAV = [
  { name: "For business", href: "/business/", match: "/business" },
  { name: "Estate agents", href: "/estate-agents/", match: "/estate-agents" },
  { name: "Construction", href: "/construction/", match: "/construction" },
  { name: "Empty buildings", href: "/vacant-property-monitoring/", match: "/vacant-property-monitoring" },
  { name: "Roofs", href: "/roof-inspections/", match: "/roof-inspections" },
  { name: "For homeowners", href: "/property/", match: "/property" },
  { name: "Contact", href: "/#contact" },
];

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname === "/commercial/" || pathname === "/commercial";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const hero = document.querySelector(".hero, .t-hero");
      setScrolled(!hero || window.scrollY > hero.offsetHeight - 90);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  // Close the menu when the page changes, Escape is pressed, or the screen gets wide
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    const mq = window.matchMedia("(min-width: 961px)");
    const onWide = () => setOpen(false);
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onWide);
    return () => { window.removeEventListener("keydown", onKey); mq.removeEventListener("change", onWide); };
  }, []);
  useEffect(() => { document.body.classList.toggle("menu-open", open); }, [open]);

  const solid = !isHome || scrolled;

  return (
    <header className={`topbar${solid ? " is-solid" : ""}`} id="topbar">
      <Link className="brand" href="/" aria-label="Happy Drones home">
        <Image src="/logo.png" alt="" width={1407} height={489} priority />
      </Link>

      <nav className={`topnav${open ? " is-open" : ""}`} id="menu" aria-label="Main">
        {NAV.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            aria-current={item.match && pathname.startsWith(item.match) ? "page" : undefined}
            onClick={() => setOpen(false)}
          >
            {item.name}
          </Link>
        ))}
      </nav>

      <Link className="btn btn-orange btn-small topbar-cta" href="/#contact" title="Tell me what you need. I reply within one working day.">Start with one job</Link>

      <button
        className="menu-btn"
        type="button"
        aria-expanded={open}
        aria-controls="menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((o) => !o)}
      >
        <span></span><span></span>
      </button>
    </header>
  );
}
