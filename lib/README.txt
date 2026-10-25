lib/  -  SETTINGS AND HELPERS
=============================

site.js   <- EDIT THIS ONE. Everything about the business:
  SITE           name, web address, contact details, WhatsApp, area,
                 insurance (£10m / £50k), credentials, socials,
                 homepage showreel, reviews
                 email: "" hides email. introPricing: true shows the
                 "Introductory pricing" tags.
  KIT            the fleet (8 items). tier: everyday / flagship / heavy.
                 status: "soon" shows "Coming soon".
  KIT_TIERS      names of the three tiers
  PRICING        quote builder services, sizes, extras and prices.
                 Every "From £..." on the site comes from here.
                 Each service has group: "property" or "business".
                 Each extra has  for: [...]  listing which services it
                 appears for, e.g. for: ["essentials", "showcase"].
  PACKAGES       the words for Essentials / Showcase / Signature
                 (homepage cards and the /property/ page). Prices still
                 come from PRICING.
  PACKAGE_ROWS   rows of the compare table on /property/
  SINGLES        "Aerial only" and "FPV only" cards
  AGENT_OFFER    the estate agent discount, perks, steps and FAQ
                 (/estate-agents/ page and the homepage agent band)
  AUDIENCES      homepage "Who it's for" tabs
  SERVICE_PAGES  all ten services: the services page AND each
                 /services/<id>/ page. group: "homes" or "commercial".
                 kit: which aircraft fly it (used on the Fleet page table)
  PLANNER        commercial mission planner prices (/plan/)
  MISSION_STEPS  "How a mission runs" (Commercial page)
  SAFETY         Safety page cards
  ROADMAP        "What's coming next" (Fleet page)
  HOW_STEPS      homepage "How a shoot works"
  LINKS          the /links page: intro, main video, buttons,
                 current projects (see app/links/README.txt)
  FAQ            homepage questions. {PL} and {PI} insert your
                 insurance amounts automatically.

  Rules for editing site.js safely:
  - Keep the quote marks around text: "like this"
  - Keep the comma at the end of each line/entry
  - Lists use [ ]  and entries use { }. Keep them in pairs.
  - If "npm run dev" shows a red error after an edit, it will name the
    line. Usually it's a missing comma or quote mark.

  Reviews appear automatically once you add one:
    reviews: [
      { text: "Brilliant photos, sold in a week.", name: "Sarah", detail: "Sold her home in Yarm" },
    ],

DON'T EDIT (they work on their own)
  posts.js     reads content/posts/ and builds the post pages
  flyover.js   draws the homepage aerial town animation
  youtube.js   turns YouTube links into video IDs
