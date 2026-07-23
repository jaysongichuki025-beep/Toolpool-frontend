# ToolPool Frontend (`project-frontend`)

React + Tailwind SPA for neighborhood tool sharing. Black + safety-yellow workshop UI.

## Quick start

```bash
# 1. Install packages
npm install

# 2. Point at the backend API
cp .env.example .env
# .env should contain: VITE_API_URL=http://localhost:8000/api

# 3. Start Vite (hot reload)
npm run dev
```

Open http://localhost:5173

**Backend must be running** on port 8000 (see `project-backend` README).

## Docker

```bash
docker compose up --build
# http://localhost:3000
```

## Pages

| Path | Purpose |
|------|---------|
| `/` | Brand hero landing |
| `/login` `/register` | JWT auth |
| `/browse` | Search + category filter |
| `/tools/:id` | Detail, calendar, borrow request |
| `/tools/new` | List a tool |
| `/dashboard` | Borrower requests |
| `/lender` | Lender approvals + status toggle |
| `/admin/categories` | Admin category CRUD |
| `/admin/rentals` | Admin transaction log |

## Design

- Colors: ink `#0A0A0A`, signal yellow `#F5C518`, paper `#F5F2E8`
- Fonts: Oswald (display) + IBM Plex Sans (body)
- Hard borders / stamp shadows — not soft purple AI cards

## Deploy

1. Push to GitHub
2. Connect to Vercel (or build Docker image on Render)
3. Set `VITE_API_URL` to your live backend `/api` URL
4. Add GitHub secrets for the deploy workflow if using Vercel Actions
