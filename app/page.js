/* =========================================================
   HOMEPAGE
   Each section is its own component in /components.
   Move or delete a line below to reorder or remove a section.
   ========================================================= */
import Link from "next/link";
import Hero from "@/components/Hero";
import Promises from "@/components/Promises";
import Packages from "@/components/Packages";
import AudienceTabs from "@/components/AudienceTabs";
import Kit from "@/components/Kit";
import Paths from "@/components/Paths";
import TodayTomorrow from "@/components/TodayTomorrow";
import FpvRoute from "@/components/FpvRoute";
import AgentBand from "@/components/AgentBand";
import QuoteBuilder from "@/components/QuoteBuilder";
import ContactSection from "@/components/ContactSection";
import Follow from "@/components/Follow";
import PostCard from "@/components/PostCard";
import JsonLd from "@/components/JsonLd";
import { QuoteProvider } from "@/components/QuoteContext";
import { Showreel, HowItWorks, Reviews, Faq, faqSchema } from "@/components/HomeSections";
import { getPostSummaries } from "@/lib/posts";

export const metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const latest = getPostSummaries().slice(0, 3);

  return (
    <QuoteProvider>
      <JsonLd data={faqSchema()} />
      <Hero />
      <Promises />
      <Paths />
      <Packages />
      <Kit />
      <AudienceTabs />
      <FpvRoute />
      <AgentBand />
      <QuoteBuilder />
      <TodayTomorrow />
      <Showreel />
      <HowItWorks />
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
      <Faq />
      <ContactSection />
    </QuoteProvider>
  );
}
