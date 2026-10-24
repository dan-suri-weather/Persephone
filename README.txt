PERSEPHONE TRACKER
==================

A small web app for tracking which Persephone books you've got, want, and have read.
It runs in Safari on an iPad or iPhone and can be added to the Home Screen so it opens like an app.
Got / Desire / Read marks are saved on the device only.


FILES
-----

index.html                          The whole app
books.json                          The book list (number, title, author, page link)
sw.js, manifest.webmanifest,        Let it work offline and install to the Home Screen
icon-180.png, icon-192.png,
icon-512.png
scripts/update-books.mjs and        Checks persephonebooks.co.uk every day and adds
.github/workflows/update-books.yml  new books to books.json


PUTTING IT ONLINE (one-off, no Mac needed)
------------------------------------------

Option A: GitHub Pages (simplest)

A free GitHub account can only use Pages on a PUBLIC repository.
That's fine here, because the repo holds only the public book list.
Each person's marks stay on their own device.

1. Upload everything in this folder to dan-suri-weather/Persephone, including the .github folder.
2. On GitHub, go to Settings > General > Danger Zone > Change visibility > Public.
3. Go to Settings > Pages. Under "Build and deployment", choose "Deploy from a branch",
   pick main and / (root), then click Save.
4. After a minute or two the app is live at https://dan-suri-weather.github.io/Persephone/
5. Go to Settings > Actions > General > Workflow permissions, choose
   "Read and write permissions", then click Save.
   This lets the daily update job save new books.

Option B: keep the repo private

Use Netlify or Cloudflare Pages (both free).
Sign in with GitHub, choose "Import from Git", pick the Persephone repo,
leave the build command empty, and deploy.
You get a web address like https://persephone-tracker.netlify.app
The daily GitHub Action still keeps books.json up to date.


INSTALLING ON THE IPAD
----------------------

1. Open the web address in Safari.
2. Tap Share > Add to Home Screen > Add.
3. Always open it from the Home Screen icon. The installed app keeps its own storage,
   which Safari doesn't clear the way it can clear storage for websites you haven't
   visited in a while.


USING IT
--------

- Got turns the row light orange, and Desire turns it pink.
  Tap the same button again to clear it.
- Read shows Y when the book has been read.
- Tap No., Title or Author at the top to sort. Tap again to reverse the order.
- Scroll with your thumb on the grey Scroll strip on the left,
  so you don't tap a button by accident.
- Search finds a book number (for example 42) or any part of a title or author's name.
- The drop-down shows only Got, Desire, Neither, or Not-read books.
- Update book list adds any new Persephone books.
  Existing books and their marks are never changed.
- Export to .csv opens the share sheet, where you can save to Files, email it, and so on.
- Restore from .csv loads the marks back from an export, for example on a new iPad.
  Export now and then as a backup.


HOW "UPDATE BOOK LIST" WORKS
----------------------------

The app first tries to read persephonebooks.co.uk/pages/book-list directly.
Safari usually blocks a page from reading another website, so if that fails
it falls back to books.json.
The GitHub Action refreshes books.json from the same Persephone page every morning,
so a new book shows up within a day.
To check straight away, open the repo's Actions tab, pick "Update book list",
and click "Run workflow".
