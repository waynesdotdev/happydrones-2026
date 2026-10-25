components/  -  THE BUILDING BLOCKS
===================================

Pages are made by stacking these. Most of them read their words from
lib/site.js, so you rarely need to open these files.

"use client" at the top means it runs in the browser (it reacts to
scrolling, tapping or typing). Everything else is built once into HTML.

SHARED ON EVERY PAGE
  Header.jsx         top bar + phone menu. Menu links: the NAV list at the top.
  Footer.jsx         footer columns (reads lib/site.js)
  Dock.jsx           Call / WhatsApp / Quote bar on phones
  JsonLd.jsx         Google structured data helper (don't edit)
  SocialIcon.jsx     the outline icons for each platform

HOMEPAGE
  Hero.jsx           headline, buttons and the camera display
                     (the flyover drawing itself is lib/flyover.js)
  Promises.jsx       navy strip: weather, insurance, delivery
  Packages.jsx       Essentials / Showcase / Signature cards -> PACKAGES
  Kit.jsx            "Four tools. One visit."  -> KIT in lib/site.js
  KitIcon.jsx        the small drawings of each camera and drone
  AudienceTabs.jsx   "Who it's for"  -> AUDIENCES in lib/site.js
  AgentBand.jsx      navy "estate agents" strip -> AGENT_OFFER
  FpvRoute.jsx       scroll-driven floor plan. Step wording: STEPS at the top.
                     Also used on /estate-agents/.
  QuoteBuilder.jsx   quote builder + ticket   -> PRICING in lib/site.js
  ContactSection.jsx enquiry form with "I am a..." buttons (ROLES at the
                     top). /?role=agent#contact pre-picks Estate agent.
                     If you change form fields, ALSO change
                     public/__forms.html or Netlify won't save them.
  QuoteContext.jsx   lets packages, tabs, quote and form share the
                     service, quote and role (don't edit)
  HomeSections.jsx   showreel, how it works, reviews, FAQ
  Follow.jsx         "Follow the flights" cards (homepage, journal, posts)

SERVICES AND PROPERTY PAGES
  ServicesCam.jsx    sticky camera view with the altitude readout.
                     Give it a list:  <ServicesCam items={...} />
  ServiceArt.jsx     the nine illustrations (home, camera, walkthrough,
                     fpv, business, event, roof, construction, agent)

VIEWING ROOM (blog)
  JournalBrowser.jsx filter buttons + search
  PostCard.jsx       one post in a grid
  PostCover.jsx      automatic map-style cover when a post has no photo
  VideoEmbed.jsx     YouTube player that loads only when tapped
  ShareButtons.jsx   WhatsApp / Facebook / X / copy link

SAFE: changing words in Kit.jsx, FpvRoute.jsx STEPS, Header.jsx NAV.
CAREFUL: class names (className="...") are tied to app/globals.css.

MERGED FROM TOMORROW UAV (commercial "ops" look, classes start with t-)
  CommercialHero.jsx  terrain flyover + live telemetry (Commercial page)
  TodayTomorrow.jsx   "the job build": drag a construction site through 14 months
  MissionPlanner.jsx  commercial planner. Fields must match public/__forms.html "mission"
  MissionCard.jsx     dark service card linking to /services/<id>/
  CtaBand.jsx         dark call-to-action band
  TFaq.jsx            FAQ list for ops-style pages
  TIcons.jsx          small line icons
  PageHero.jsx        navy page header with breadcrumb (inner pages)
  Paths.jsx           homepage "Two ways I fly" (homes / commercial)
  Kit.jsx             the fleet grid with tier badges
