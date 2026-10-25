/* The frame around every page: fonts, header, footer, phone dock,
   and the default SEO settings that each page can override. */
import "@fontsource/blinker/400.css";
import "@fontsource/blinker/600.css";
import "@fontsource/blinker/700.css";
import "@fontsource/blinker/800.css";
import "@fontsource/lato/400.css";
import "@fontsource/lato/400-italic.css";
import "@fontsource/lato/700.css";
import "./globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Dock from "@/components/Dock";
import JsonLd from "@/components/JsonLd";
import { SITE, liveSocials } from "@/lib/site";

export const metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} · Property photography, aerial & video in the North East`,
    template: `%s · ${SITE.name}`, // each page title becomes "Page name · Happy Drones"
  },
  description: SITE.description,
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: "en_GB",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Happy Drones: precision from above" }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport = {
  themeColor: "#003366",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// Tells Google this is a local business (name, contact, area, socials)
const businessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: SITE.name,
  description: SITE.description,
  url: SITE.url,
  logo: `${SITE.url}/logo.png`,
  image: `${SITE.url}/og.png`,
  email: SITE.email,
  telephone: SITE.phone,
  areaServed: SITE.areaServed,
  sameAs: liveSocials().map((s) => s.url),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-GB">
      <body>
        <a className="skip" href="#main">Skip to content</a>
        <JsonLd data={businessSchema} />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <Dock />
      </body>
    </html>
  );
}
