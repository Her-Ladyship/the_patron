# The Patron

The Patron is an iPhone-first progressive web app built for a Dungeons & Dragons Warlock. It turns choosing spells for the Warlock’s Tome into a ritual. Press and hold **Consult the Many** and three animated skulls reveal the patron’s aspects alongside a hand of illustrated spell cards.

**[Try The Patron](https://her-ladyship.github.io/the_patron/)** · On iPhone, open it in Safari and choose **Share → Add to Home Screen** to install it with the Binding Sigil icon.

## Features

- **Randomised Tome consultation.** Draws three distinct aspects from a cast of twelve and selects three cantrips and two 1st-level ritual spells without repeats within each pool. Spell draws respect enabled sources and individual exclusions.
- **Illustrated spell library.** Browse 77 spells and open their cards to read the details.
- **Manual Override.** Choose spells for the five Tome slots and restore the original draw when you want to return to it.
- **Local persistence.** The app remembers the latest consultation, any applied override, enabled sources, spell exclusions and character level in browser storage.

## How it works

The app uses HTML, CSS, vanilla JavaScript ES modules and JSON, with static hosting on GitHub Pages. It has no build step or backend.

- **Data-driven selections.** [`spells.json`](spells.json) and [`aspects.json`](aspects.json) define the library and the patron’s aspects. [`consultation.js`](js/consultation.js) filters the eligible spell pools before drawing without replacement.
- **Reversible overrides.** [`consultation_storage.js`](js/consultation_storage.js) stores aspect IDs, the original spell IDs and any override IDs in `localStorage`. On launch it resolves those IDs against the current data and validates the result before restoring it.
- **Offline caching.** [`service_worker.js`](service_worker.js) preloads the app shell, JSON data and artwork derived from spell IDs. It serves cached responses first, falls back to the network on a miss and removes older Patron caches on activation.
- **iPhone deployment.** The Home Screen icon uses a relative `apple-touch-icon` URL so it resolves under the GitHub Pages project path. The URL includes a version parameter, and the corrected icon was checked in a fresh Home Screen install.

## Run locally

With Git and Python 3 installed, run:

```sh
git clone https://github.com/her-ladyship/the_patron.git
cd the_patron
python -m http.server 8000
```

Open [http://localhost:8000/](http://localhost:8000/). Serving the project over localhost lets the browser load its modules and JSON and register the service worker.
