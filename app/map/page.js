/* SITE MAP — where a planned job is, for Wayne.
   happydrones.co.uk/map/?pc=TS17+6AB&lat=…&lon=…&c=HD-AB12-CON
   Linked from the "Map" line in mission plan emails. Not in the
   sitemap, and marked noindex. The page: components/SiteMapView.jsx */
import SiteMapView from "@/components/SiteMapView";

export const metadata = {
  title: "Site map",
  description: "Where a planned Happy Drones job is.",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function MapPage() {
  return <SiteMapView />;
}
