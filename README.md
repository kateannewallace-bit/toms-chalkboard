# Tom's Chalkboard

Short math rounds for curious kids, drawn on a Waldorf-style chalkboard. Built for Tom; the child's name is set on the grown-ups page, so friends can use it too.

- **2nd grade topics** follow Khan Academy's 2nd grade units: adding and taking away, place value (with readable place-value blocks), counting patterns, arrays, money, time, measuring, graphs, shapes and story problems.
- **Beyond 2nd grade:** times tables, mystery numbers (early algebra), squares and square roots, numbers below zero, and big numbers.
- Every topic has levels. A topic moves up after 7 of the last 8 right on the first try and back down after 4 misses in 6.
- Problems can be answered by picking from four or by typing on a number pad. Story problems and instructions are read aloud.
- Ends each round with an "off the screen" idea and, optionally, a cheerful Colonel Roosevelt.
- A grown-ups page has levels, settings, common slips, recent rounds, sync and a printable paper round.

## Run it

It's a static site, no build step. Open it at <https://kateannewallace-bit.github.io/toms-chalkboard/>, or locally:

```bash
python3 -m http.server 8777
```

On an iPad or iPhone, open the site in Safari and tap **Share → Add to Home Screen**. It then opens full screen and works offline.

## Sync between devices (optional)

1. In a Supabase project, open the SQL editor and run `supabase/schema.sql`.
2. Put the project URL and publishable (anon) key in `config.js`.
3. On the grown-ups page, tap **Turn on sync**, then type the code on the other device.

## Updating

After changing files, bump `VERSION` in `sw.js` so installed copies pick up the change.

Roosevelt photos (1910) are public domain, from the Library of Congress via Wikimedia Commons.
