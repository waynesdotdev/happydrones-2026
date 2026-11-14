ONLINE ROOF REPORTS  (happydrones.co.uk/report/<id>/)
Each report is one .json file here, plus its photos in public/reports/<id>/.
The page is private: not in the sitemap, not linked anywhere, and marked noindex.
Send the customer the link instead of (or as well as) the download.

Give each report a hard-to-guess id, e.g. "2026-11-hartburn-k7q2", not just a house name.

{
  "id": "2026-11-hartburn-k7q2",           same as the file name
  "title": "Roof check",
  "place": "Hartburn, Stockton-on-Tees",      area only: no house number
  "date": "2026-11-20",
  "client": "Mr and Mrs Smith",              optional
  "summary": "Short plain-English summary of what the photos show.",
  "overview": "/reports/<id>/overview.jpg",  the overview with the numbers marked on
  "photos": [
    { "n": 1, "src": "/reports/<id>/01.jpg", "title": "Front slope", "note": "What's visible here." }
  ],
  "download": "",                            optional link to the full-size files
  "example": false                           true only for the example report
}
The report never diagnoses faults: describe what's visible and where.
