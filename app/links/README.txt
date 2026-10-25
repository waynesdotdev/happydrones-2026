app/links/  -  THE LINKS PAGE (/links/)
=======================================

A slim "link in bio" page for Instagram, TikTok, Facebook, QR codes and
business cards. The site header, footer and phone bar are hidden here.

You don't need to edit page.js. Everything comes from lib/site.js:

  LINKS.intro          the line under your name
  LINKS.video          your main YouTube video ("" hides it,
                       or falls back to SITE.showreel)
  LINKS.buttons        the main buttons, top to bottom
  LINKS.projects       "Current projects" (empty [] hides the section)
  LINKS.showLatestPost true shows your newest Viewing Room post
  SITE.socials         social buttons (only ones with a url show)
  SITE.motto           the orange line under your name

A button's href can be a page on your site ("/property/"), a full web
address ("https://..."), or the words "whatsapp" or "call".
