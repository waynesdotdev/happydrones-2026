app/services/  -  THE SERVICES PAGE (/services/)
================================================

You almost never need to edit page.js here.

The words for every service (titles, "What you get", timings, drone,
"Good to know") live in SERVICE_PAGES in lib/site.js.
Prices come from PRICING in lib/site.js.

- Change a service's text:     edit its entry in SERVICE_PAGES
- Reorder services:            move entries up or down in SERVICE_PAGES
- Change the flying height:    the "alt" number in that entry
- Remove a service:            delete its whole { ... } entry
- Insurance amounts:           SITE.insurance in lib/site.js

The page's Google title/description is the "metadata" block in page.js.
The sticky camera view is components/ServicesCam.jsx.
