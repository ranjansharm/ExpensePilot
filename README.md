# ExpensePilot

A lightweight, offline-first Progressive Web App to track income, expenses, and savings — with simple built-in spending insights.

## Status

**Phase 1 — done**
- UI design
- Dashboard
- Navigation
- Responsive design
- Dark mode
- PWA (installable, offline caching via service worker)

**Phase 2 — done**
- Add income
- Add expense
- Categories
- Budget
- Charts (pie + trend line on dashboard, bar chart in reports)
- Simple rule-based "insights" (e.g. category spend comparisons)

**Phase 3 — not started**
- Firebase Auth (Google / Email / OTP login)
- Firestore cloud sync & backup
- Real AI-generated insights (currently rule-based, no external API)

No Firebase is connected yet. The app currently runs fully offline using
the browser's `localStorage`, wrapped behind a small `DB` object in
`js/firebase.js` so the storage layer can be swapped for Firestore later
without touching any other file.

## Project structure

```
ExpensePilot/
├── index.html
├── manifest.json
├── sw.js
├── firebase.json
├── css/
│   ├── style.css        base styling, buttons, forms, nav
│   ├── dashboard.css     balance card, analytics, transaction list
│   ├── login.css         reserved for Phase 3, not wired in yet
│   ├── calendar.css      calendar grid + day detail
│   └── reports.css       reports, charts, printable PDF layout
├── js/
│   ├── app.js            boots the app, handles navigation & dark mode
│   ├── auth.js           stub for Phase 3 login
│   ├── firebase.js       DB abstraction (localStorage now, Firestore later)
│   ├── transactions.js   add/delete/search/filter transactions
│   ├── charts.js         all Chart.js rendering
│   ├── dashboard.js      dashboard rendering + insights
│   ├── calendar.js       calendar page logic
│   ├── reports.js        reports, CSV export, PDF export
│   └── settings.js       currency, budget, dark mode, clear data
├── assets/
│   ├── icons/            PWA icons (placeholders — replace with your own)
│   ├── images/           logo / splash / empty-state images (empty for now)
│   └── fonts/            reserved for custom font files (Poppins/Inter loaded
│                          from CDN-free fallback — see note below)
└── README.md
```

## Running it locally

No build step, no npm install — it's plain HTML/CSS/JS.

1. Download or clone this folder.
2. Open a terminal inside `ExpensePilot/` and run a local server (required for
   the service worker to register — opening `index.html` directly with
   `file://` will skip offline caching):
   ```bash
   python3 -m http.server 8080
   ```
3. Open `http://localhost:8080` in your browser.
4. To install as an app: open the browser menu → "Install app" / "Add to
   Home screen".

## Deploying to GitHub Pages

1. Create a new GitHub repository, e.g. `ExpensePilot`.
2. Push this exact folder structure to the repo root (see "GitHub setup"
   below for the commands).
3. In the repo, go to **Settings → Pages**.
4. Under **Source**, choose the `main` branch and `/ (root)` folder → Save.
5. GitHub will give you a live URL like:
   `https://<your-username>.github.io/ExpensePilot/`
6. Open that URL on your phone and "Add to Home screen" — it now installs
   and works offline like a real app.

## GitHub setup (first push)

```bash
cd ExpensePilot
git init
git add .
git commit -m "ExpensePilot: Phase 1 & 2 (UI, dashboard, transactions, charts, PWA)"
git branch -M main
git remote add origin https://github.com/<your-username>/ExpensePilot.git
git push -u origin main
```

## Connecting Firebase later (Phase 3)

1. Create a project at https://console.firebase.google.com
2. Add a Web App inside the Firebase project, copy the config object.
3. Paste it into `js/firebase.js` → `firebaseConfig`.
4. Add the Firebase SDK `<script>` tags to `index.html` (before
   `js/firebase.js`).
5. Set `FIREBASE_ENABLED = true` in `js/firebase.js`.
6. Replace the internals of the `DB` object (`getTransactions`,
   `addTransaction`, `deleteTransaction`, `getSettings`, `saveSettings`)
   with Firestore calls. Every other file only talks to `DB.*`, so nothing
   else needs to change.
7. Update `firebase.json` if you deploy via Firebase Hosting instead of
   GitHub Pages.

## Notes on fonts

`style.css` requests `'Poppins','Inter'` but falls back to the system
font stack — no font files are bundled yet, so the app stays fully
offline out of the box. To use real Poppins/Inter offline, download the
`.woff2` files into `assets/fonts/` and add an `@font-face` block at the
top of `style.css`.

## Version history

- **v0.1.0** — Phase 1: UI, dashboard shell, navigation, dark mode, PWA scaffold.
- **v0.2.0** — Phase 2: transactions (income/expense), categories, budget,
  charts, calendar, reports (CSV/PDF), rule-based insights.
