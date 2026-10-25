content/posts/  -  VIEWING ROOM POSTS
===================================

Each .md file here becomes its own page at /journal/<file-name>/
with its own Google title, description and share image.
The posts here are SAMPLES. Edit or delete them.

ADD A POST
1. Copy _TEMPLATE.md and rename the copy, e.g.
     my-first-roof-check.md
   Use lowercase and dashes only. The file name becomes the web address,
   so don't rename it after publishing (old links would break).
2. Fill in the settings between the --- lines (see below).
3. Write the post under the second ---.
4. Remove  draft: true  (or set it to false) when it's ready.
5. npm run dev to preview, then git add . / git commit / git push.

Files starting with _ (like _TEMPLATE.md) are ignored.

THE SETTINGS
  title:     shown on the page and as the Google headline
  date:      "YYYY-MM-DD". Newest posts appear first.
  type:      "article" or "video"
  category:  any word, e.g. "Guides". Filter buttons are made from these.
  excerpt:   1-2 sentences. Used on cards AND as the Google description.
  youtube:   YouTube link or ID for video posts ("" if none)
  cover:     photo for the card and sharing, e.g. "/posts/roof.jpg"
             (put the photo in public/posts/). "" = automatic map cover
  service:   which quote to offer at the end: essentials, showcase,
             signature, aerial, fpv, business, event, roof or construction
  featured:  true pins it to the top of the Viewing Room
  draft:     true hides it everywhere until you're ready

Keep the quote marks around text values. If your text contains a
double quote, use single quotes around it instead.

WRITING (Markdown)
  A blank line starts a new paragraph.
  ## Heading
  **bold**
  [link text](/services/)
  - bullet point
  > highlighted quote
  ![describe the photo](/posts/photo.jpg)

PHOTOS
Put them in public/posts/ and refer to them as /posts/name.jpg.
Keep each under about 500 KB (resize to 1600 px wide) so pages stay fast.
