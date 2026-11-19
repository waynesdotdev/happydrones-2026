/* =========================================================
   HOMEPAGE
   Each section is its own component in /components.
   Move or delete a line below to reorder or remove a section.
   ========================================================= */
import Credentials from "@/components/Credentials";
import Link from "next/link";
import Hero from "@/components/Hero";
import ThreeWays from "@/components/ThreeWays";
import TodayTomorrow from "@/components/TodayTomorrow";
import AgentBand from "@/components/AgentBand";
import BusinessContact from "@/components/BusinessContact";
import Follow from "@/components/Follow";
import PostCard from "@/components/PostCard";
import JsonLd from "@/components/JsonLd";
import { Showreel, Reviews, Faq, faqSchema, BusinessSteps } from "@/components/HomeSections";
import { BUSINESS_FAQ } from "@/lib/site";
import { getPostSummaries } from "@/lib/posts";

export const metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const latest = getPostSummaries().slice(0, 3);

  return (
    <>
      <JsonLd data={faqSchema(BUSINESS_FAQ)} />
      <Hero />
      <Credentials promises />
      <ThreeWays />
      <AgentBand />
      <TodayTomorrow />
      <BusinessSteps />
      <Showreel />
      <Reviews />

      {latest.length > 0 && (
        <section className="latest" aria-labelledby="latest-title">
          <div className="wrap">
            <div className="latest-head">
              <h2 id="latest-title" className="section-title">From the Viewing Room</h2>
              <Link className="text-link" href="/journal/">See every post</Link>
            </div>
            <div className="cards">{latest.map((p) => <PostCard key={p.slug} post={p} />)}</div>
          </div>
        </section>
      )}

      <Follow />
      <Faq items={BUSINESS_FAQ} title="Questions businesses ask" />
      <BusinessContact />
    </>
  );
}
