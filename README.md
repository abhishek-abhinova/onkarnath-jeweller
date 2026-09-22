# ओंकार नाथ अग्रवाल सर्राफ — Jewellery Business Suite

A complete, self-contained digital presence for a family gold & silver sarraf shop in
Atarra, Banda (Uttar Pradesh). One shared backend powers a **Next.js marketing website + admin panel** and an
**Expo Android app** — live rates, products, gallery, calculator (GST + making), WhatsApp enquiries, all in Devanagari.

## Tech

| Layer  | Stack |
| ------ | ----- |
| Backend | Express · JSON store (zero-config demo) or MongoDB · IBJA live-rates adapter · JWT auth · multer uploads |
| Web    | Next.js 14 (App Router) · Tailwind · Devanagari (Noto Serif Devanagari) · `/admin` panel |
| Mobile | Expo SDK (React Native) · React Navigation (tabs + stack) · Android |

Gold = ₹/10g (999·916·750), Silver = ₹/1kg (999·925). Rates come from the **IBJA API** when `IBJA_API_URL` +
`IBJA_API_KEY` are set (never shipped to any client), otherwise a seeded *fallback* demo dataset is used
(clearly labelled on the site, no fake "live" claims).

## Quick start

```bash
npm install                 # back+web workspaces (at repo root)
cp backend/.env.example backend/.env
npm run seed                # seed demo data (admin/admin123, products, rates, gallery)
npm run dev                 # backend :5000 + web :3000 (concurrently)
```

- Website → http://localhost:3000
- Admin panel → http://localhost:3000/admin (login `admin` / `admin123`)
- API → http://localhost:5000/api/health

### Mobile app (Expo)

```bash
cd mobile
npm install
npx expo start          # QR with Expo Go, or press 'a' for Android emulator
```

The app reads `mobile/src/config.js` — `API_URL` defaults to `http://10.0.2.2:5000` (Android emulator).
On a physical device change it to your machine's LAN IP, e.g. `http://192.168.1.20:5000`.

## Project layout

```
backend/    Express API, JSON/Mongo store, IBJA rate service, seed, uploads
web/        Next.js marketing site + admin dashboard (Tailwind, Devanagari)
mobile/     Expo Android app
```

- `backend/seed/seedData.js` — demo catalogue, categories, gallery, fallback rates, settings, admin user.
- Images: product SVGs in `web/public/images/products/`. A one-time sharp script converts them into PNGs
  for the site, the admin, and the mobile app → `npm run seed:images --workspace backend`.
- Rates: `backend/services/ibjaRateService.js` handles IBJA fetch/cache/history; admin dashboard shows
  sync status and lets you override rates manually.
- Both clients talk to the same REST API (`/api/products`, `/api/rates`, `/api/gallery`, …) so anything you
  change in the admin reflects in the website and the app immediately.

## Going live

1. Set `JWT_SECRET` and (recommended) `MONGO_URI` to a MongoDB Atlas cluster.
2. Put real values in `backend/.env`: `RATES_MODE=ibja`, `IBJA_API_URL`, `IBJA_API_KEY`.
3. `npm run build:web` then deploy `web/.next` (someone like Vercel) and the API on a host with Node.
4. `cd mobile && npx expo prebuild --platform android` (or EAS Build) to ship the APK on Play Store.
