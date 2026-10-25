app/journal/[slug]/  -  THE TEMPLATE FOR EVERY POST
===================================================

The [slug] in the folder name means "any post". Next.js builds one real
HTML page per file in content/posts/, e.g.
  content/posts/golden-hour-aerial-photos.md
    -> /journal/golden-hour-aerial-photos/

This file sets up the SEO for each post automatically:
- page title and Google description (from the post's title and excerpt)
- social share image (your cover photo, else the YouTube thumbnail,
  else public/og.png)
- canonical address, publish date, and Google article/video data

Edit the design of ALL posts here (the layout below "return (").
To change ONE post, edit its Markdown file instead.

Keep  export const dynamicParams = false  - the static site needs it.
