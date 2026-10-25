/* Builds /robots.txt: lets search engines in and points them at the sitemap. */
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/thanks/"] },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
