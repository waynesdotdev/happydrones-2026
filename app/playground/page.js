/* THE PLAYGROUND: try a pretend booking from start to finish.
   The working part is components/Playground.jsx. Nothing is saved or sent. */
import PageHero from "@/components/PageHero";
import Playground from "@/components/Playground";

export const metadata = {
  title: "Playground: try a booking",
  description: "Pick a drone service and follow a pretend job from booking to files, with a show-around of every step. Nothing is booked or paid.",
  alternates: { canonical: "/playground/" },
};

export default function PlaygroundPage() {
  return (
    <div className="sub-page">
      <PageHero small crumbs={[{ label: "Playground" }]} eyebrow="Try it first" title="See how a booking works." lede="Pick a service, book it in the playground and follow the job from your first click to your files. Nothing is booked, paid or sent." />
      <section className="t-section t-dark" style={{ paddingTop: "clamp(28px, 4vw, 48px)" }}>
        <div className="wrap"><Playground /></div>
      </section>
    </div>
  );
}
