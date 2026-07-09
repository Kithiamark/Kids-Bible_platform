# Frontend

React + TypeScript + Vite frontend for the Kids Delight Learning Platform.

## Local Development

```bash
npm install
copy .env.example .env
npm run dev
```

Default local URL:
- `http://localhost:5173`

## Environment Variable

- `VITE_API_BASE_URL`: backend API base URL, for example:
  - local: `http://localhost:8000/api/v1`
  - production: `https://your-koyeb-service.koyeb.app/api/v1`

## Production Hosting

This frontend is designed to be deployed as a static SPA to:
- Netlify
- Vercel

Repo-level hosting helpers:
- Netlify config: [netlify.toml](file:///c:/Users/USER/Project/Kids-Bible_platform/netlify.toml)
- Vercel config: [vercel.json](file:///c:/Users/USER/Project/Kids-Bible_platform/vercel.json)
- SPA redirect file for Netlify: [public/_redirects](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/public/_redirects)

## Build

```bash
npm run build
```

Build output:
- `dist/`
