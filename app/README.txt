app/  -  THE PAGES
==================

In Next.js, folders inside app/ become web addresses. Each page.js is a page.

  app/page.js                  ->  /                (homepage, sales page)
  app/property/page.js         ->  /property/       (packages, compare, add-ons)
  app/estate-agents/page.js    ->  /estate-agents/  (the agent offer)
  app/services/page.js         ->  /services/
  app/journal/page.js          ->  /journal/        (Viewing Room list)
  app/journal/[slug]/page.js   ->  /journal/any-post/  (one per post file)
  app/links/page.js            ->  /links/         (link-in-bio page)
  app/privacy/page.js          ->  /privacy/
  app/thanks/page.js           ->  /thanks/         (after the form is sent)
  app/not-found.js             ->  any address that doesn't exist (404)
  app/sitemap.js               ->  /sitemap.xml     (automatic)
  app/robots.js                ->  /robots.txt      (automatic)
  app/layout.js                ->  wraps every page: fonts, header, footer

SAFE TO CHANGE
- The "metadata" block at the top of a page: its title and description
  for Google. Keep descriptions under about 155 characters.
- Text inside pages, as long as you keep the < > tags balanced.
- In page.js (homepage) you can reorder or remove sections by moving
  or deleting lines like <Kit /> or <HowItWorks />.

ADDING A NEW PAGE
1. Make a folder, e.g. app/about/
2. Copy app/privacy/page.js into it and edit the words and metadata.
3. Add it to the menu in components/Header.jsx and to the list in
   app/sitemap.js.

APOSTROPHES IN TEXT
Inside page files write  &apos;  instead of  '  in normal text
(e.g. I&apos;ll). Otherwise the build may warn you.

GLOBALS.CSS (all the styling)
- Brand colours and fonts are at the very top in :root.
  Change --orange or --navy there and the whole site follows.
- Sections are labelled with big comment headings
  (HERO, QUOTE BUILDER, THE KIT, PACKAGES, FOOTER...). Search for them.
- Safe: colours, sizes, spacing. Risky: renaming class names, because
  components use them.

DON'T EDIT unless you know why: sitemap.js, robots.js, journal/[slug]/page.js
(the SEO wiring). They update themselves from your settings and posts.
