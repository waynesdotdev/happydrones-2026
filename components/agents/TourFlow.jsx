/* "Which tour?" decision diagram for agents. Static SVG, scrolls sideways on phones. */
export default function TourFlow() {
  return (
    <figure className="ea-flow" aria-labelledby="ea-flow-cap">
      <div className="ea-flow-scroll">
        <svg viewBox="0 0 1000 380" role="img" aria-labelledby="ea-flow-title">
          <title id="ea-flow-title">Decision flow: exterior only leads to Aerial only. Otherwise, if rooms are wide enough to fly safely, an Avata 2 fly-through; if not, a Pocket 3 FPV-mode glide. Both lead to a package with aerials included.</title>
          <defs>
            <marker id="ea-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#46617E" /></marker>
          </defs>
          {/* edges */}
          <g className="ea-edge">
            <path d="M150 190H326" markerEnd="url(#ea-ar)" />
            <path d="M420 110V70H514" markerEnd="url(#ea-ar)" />
            <path d="M420 270V300H514" markerEnd="url(#ea-ar)" />
            <path d="M700 290H735V205H764" markerEnd="url(#ea-ar)" />
            <path d="M700 312H764" markerEnd="url(#ea-ar)" />
          </g>
          <text x="432" y="96" className="ea-edge-lbl">Yes</text>
          <text x="432" y="290" className="ea-edge-lbl">No, inside too</text>
          <text x="742" y="248" className="ea-edge-lbl">Yes</text>
          <text x="722" y="330" className="ea-edge-lbl">No</text>

          {/* nodes */}
          <g className="ea-node ea-node-start"><rect x="20" y="150" width="130" height="80" rx="40" /><text x="85" y="186" textAnchor="middle">New</text><text x="85" y="206" textAnchor="middle">instruction</text></g>
          <g className="ea-node ea-node-q"><path d="M330 110 L420 190 L330 270 L240 190 Z" transform="translate(90 0)" /><text x="420" y="184" textAnchor="middle">Exterior</text><text x="420" y="204" textAnchor="middle">only?</text></g>
          <g className="ea-node ea-node-out"><rect x="520" y="30" width="230" height="80" rx="10" /><text x="635" y="62" textAnchor="middle" className="b">Aerial only</text><text x="635" y="86" textAnchor="middle">Mini 4 Pro · from £75</text></g>
          <g className="ea-node ea-node-q2"><rect x="520" y="260" width="180" height="80" rx="10" /><text x="610" y="292" textAnchor="middle" className="b">Room to fly</text><text x="610" y="314" textAnchor="middle">safely inside?</text></g>
          <g className="ea-node ea-node-avata"><rect x="770" y="165" width="210" height="80" rx="10" /><text x="875" y="197" textAnchor="middle" className="b">Yes: Avata 2</text><text x="875" y="221" textAnchor="middle">one-take FPV flight</text></g>
          <g className="ea-node ea-node-pocket"><rect x="770" y="285" width="210" height="55" rx="10" transform="translate(0 0)" /><text x="875" y="310" textAnchor="middle" className="b">No: Pocket 3</text><text x="875" y="330" textAnchor="middle">FPV-mode glide</text></g>
        </svg>
      </div>
      <figcaption id="ea-flow-cap">Every route still includes aerials from outside. I&apos;ll confirm which tour suits the property when you book.</figcaption>
    </figure>
  );
}
