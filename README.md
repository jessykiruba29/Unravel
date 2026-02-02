# Unravel — Deployment Guide

This project has a static frontend in `unravel-static/` and a Node.js/Express backend in `unravel-static/backend/` that uses PostgreSQL. Follow these steps to run locally and deploy.

## 1) Prerequisites
- Node.js 18+ and npm
- A PostgreSQL database (local or cloud: Neon, Railway, Supabase, Render)
- The connection string in `DATABASE_URL`

## 2) Local Setup
1. Provide a PostgreSQL `DATABASE_URL` (e.g., in an `.env` file inside `unravel-static/backend/`):
   
   ```
   DATABASE_URL=postgresql://user:pass@host:5432/dbname
   NODE_ENV=development
   ```

2. Initialize schema:
   
   ```powershell
   cd .\unravel-static\backend
   node setup-db
   ```

3. Start backend:
   
   ```powershell
   npm install
   npm run build
   npm start
   ```

4. Serve the static frontend:
   
   ```powershell
   cd ..\
   npx serve .
   ```
   
   By default, the frontend calls `http(s)://<your-host>:3000` for API. You can override this by setting `window.API_BASE` as described below.

## 3) API Base URL (Frontend)
- Central config is in [unravel-static/js/config.js](unravel-static/js/config.js).
- It defines `window.API_BASE` used by all fetch calls.
- For production, set it to your deployed backend URL.
  
  Option A — override in HTML pages:
  ```html
  <script>
    window.API_BASE = "https://your-backend.example.com";
  </script>
  <script src="js/config.js"></script>
  ```
  
  Option B — edit once in `config.js`:
  ```js
  window.API_BASE = "https://your-backend.example.com";
  ```

## 4) Deploy the Backend (Render/Railway Example)
### Render (Web Service)
- Create a new Web Service from your repo.
- Root directory: `unravel-static/backend`
- Build command: `npm install && npm run build`
- Start command: `npm start`
- Env vars: `DATABASE_URL`, `NODE_ENV=production`
- Render provides `PORT` automatically; backend reads it.

### Railway
- Create a PostgreSQL database; copy the `DATABASE_URL`.
- Create a Node service from the repo, set **Root Directory** to `unravel-static/backend`.
- Variables: `DATABASE_URL`, `NODE_ENV=production`.
- Railway sets `PORT`; the backend uses it.

## 5) Deploy the Frontend (Static Hosting)
- Any static host works (Vercel, Netlify, GitHub Pages).
- Deploy the contents of `unravel-static/`.
- Ensure `window.API_BASE` points to your backend’s URL.

## 6) Verify
- Visit `register.html` → submit a user → backend `/register` should respond.
- `index.html` loads the riddle set via `/user/:id/riddle-set`.
- Timer sync via `/user/:id/start-time`.
- Scores update via `/update-user`.
- `admin.html` fetches leaderboard via `/users`.

## 7) Notes
- Backend binds to `process.env.PORT || 3000`.
- Postgres SSL is enabled automatically when `NODE_ENV=production`.
- Update the admin password in [unravel-static/js/admin.js](unravel-static/js/admin.js) before production.

## 8) Optional: Docker (Backend)
You can containerize the backend:

- Create image:
  ```powershell
  cd .\unravel-static\backend
  docker build -t unravel-backend:latest .
  ```
- Run container:
  ```powershell
  docker run -e DATABASE_URL=postgresql://user:pass@host:5432/dbname -e NODE_ENV=production -e PORT=3000 -p 3000:3000 unravel-backend:latest
  ```

