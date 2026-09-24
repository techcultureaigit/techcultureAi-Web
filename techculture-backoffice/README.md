# TechCulture AI Backoffice

Admin panel for Blog + Careers (same teal/orange brand as `techculture-ai-new`).

## Run

```bash
# Terminal 1 — API
cd techculture-backoffice-api
npm install
npm run seed
npm run dev

# Terminal 2 — UI
cd techculture-backoffice
npm install
npm run dev
```

Open: http://localhost:5173

## Login

- Email: `admin@techculture.ai`
- Password: `Admin@123`

## Features

- Admin-only login screen with TechCulture logo
- Dashboard counts
- Blog CMS (CRUD) — seeded from `techculture-ai-new/src/lib/blog.js`
- Careers jobs (CRUD) — seeded from careers jobs data
- Public APIs for website:
  - `GET http://localhost:5050/api/blogs/public`
  - `GET http://localhost:5050/api/careers/public`
