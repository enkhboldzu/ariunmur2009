# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Running the app
```bash
# Start the backend (serves built frontend from /dist on port 3001)
node server.js

# Development: watch frontend + auto-restart server
npm run dev
```

### Building the frontend
```bash
cd frontend && npm run build
# Output goes to ../dist/ (served by Express)
```

### Frontend dev server (Vite, port 5173, proxies /api → localhost:3001)
```bash
cd frontend && npm run dev
```

## Architecture

### Overview
Single-page app: **Vue 3 SPA** (Vite + Tailwind v4) served as static files from Express. The backend is a single `server.js` file (Express only — no database). All routes under `/api` are backend; everything else serves `dist/index.html`.

```
server.js          — Express backend, API routes
frontend/src/
  pages/
    HomePage.vue     — placeholder landing page
  router/index.js    — vue-router routes
dist/               — Vite build output, served by Express
```

### Backend patterns
- No database — add persistence later if/when needed.
- Static frontend served from `dist/`, SPA catch-all (`/^(?!\/api).*$/`) serves `index.html` for any non-API route.

### Key env vars (`.env`)
```
PORT=3001
CORS_ORIGIN=
```

### After any frontend change
Always rebuild before testing via `localhost:3001`:
```bash
cd frontend && npm run build
```
The Vite dev server (`npm run dev` inside `frontend/`) proxies `/api` to port 3001 and supports HMR — use it for frontend iteration without rebuilding.

### Note
`PORT=3001` was chosen because LabAi (a separate project on this machine) runs on port 3000. If that's no longer the case, either port can be reused.
