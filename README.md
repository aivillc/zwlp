# Landing page (Zillow-like) — Node + TypeScript

This small project serves a single landing page with a lead capture form and a POST endpoint to receive leads.

Quickstart

1. Install dependencies:

   npm install

2. Run in development (auto-restarts):

   npm run dev

3. Build and run:

   npm run build
   npm start

Files

- `src/server.ts` — Express server
- `src/public/index.html` — Landing page
- `src/public/assets/css/styles.css` — Styles
- `src/public/assets/js/main.js` — Small frontend handler

Notes

- This is intentionally minimal. In production you'd add validation, rate-limiting, and persist leads.
