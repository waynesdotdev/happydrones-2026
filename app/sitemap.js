/* Builds /sitemap.xml automatically: every page plus every journal post. */
import { SERVICE_PAGES } from "@/lib/site";
import { getAllPosts } from "@/lib/posts";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap() {
  const pages = ["", "/property/", "/estate-agents/", "/services/", "/journal/", "/links/", "/privacy/", "/terms/", "/cookies/", "/commercial/", "/construction/", "/commercial-property/", "/roof-inspections/", "/property-photography/", "/walkthrough-video/", "/local-business/", "/aerial-photography/", "/plan/", "/fleet/", "/safety/"].map((p) => ({
    url: `${SITE.url}${p || "/"}`,
    changeFrequency: "monthly",
    priority: p === "" ? 1 : 0.7,
  }));
  const posts = getAllPosts().map((p) => ({
    url: `${SITE.url}/journal/${p.slug}/`,
    lastModified: p.date,
    changeFrequency: "yearly",
    priority: 0.6,
  }));
  const services = SERVICE_PAGES.map((s) => ({ url: `${SITE.url}/services/${s.id}/`, changeFrequency: "monthly", priority: 0.7 }));
  return [...pages, ...services, ...posts];
}
