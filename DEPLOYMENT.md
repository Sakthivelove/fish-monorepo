# Deployment Checklist

## ⚠️ Reconfiguring Vercel + Render for the monorepo

You deployed `frontend` (Vercel) and `backend` (Render) as separate
repos before merging into this monorepo. Push `fish-monorepo` as your
new single repo, then point both platforms at it with these settings
— **do not change Root Directory**, just override the commands:

### Vercel (frontend)
- Root Directory: leave as `.` (repo root) — do NOT set it to
  `apps/frontend`, it complicates workspace resolution.
- Install Command: `npm install`
- Build Command: `npm run build:frontend`
- Output Directory: `apps/frontend/.next`
- Env vars: same as before (`NEXT_PUBLIC_API_URL`).

### Render (backend)
- Root Directory: leave as `.` (repo root).
- Build Command: `npm install && npm run build:backend`
- Start Command: `npm run start:backend`
- Env vars: same as before (`DATABASE_URL`, `JWT_SECRET`,
  `CORS_ALLOWED_ORIGINS`, Cloudinary/Telegram/WhatsApp/Resend keys —
  see `apps/backend/.env.example`).

Both `build:frontend` and `build:backend` run `build:contracts`
first automatically — `packages/contracts` always gets rebuilt before
the app that depends on it, so you don't need a separate step.

Once both are green on the monorepo, you can delete/archive the 4 old
standalone repos.

Everything below was either fixed in code, or needs a real value from
you before going live (marked ⚠️).

## Backend (`apps/backend`)

- [x] `postinstall`/`build` now runs `prisma generate` automatically —
      previously missing, would have broken every deploy platform's
      build step.
- [x] CORS locked down to an explicit allowlist instead of reflecting
      any origin.
- [x] `.env.example` added listing every required variable.
- ⚠️ **Set real values for `.env`** on your host (not committed):
  `DATABASE_URL`, `JWT_SECRET`, `CORS_ALLOWED_ORIGINS` (your real
  shop + admin domains), Cloudinary, Telegram, WhatsApp, Resend keys.
- ⚠️ Run `npx prisma migrate deploy` against the production database
  before first boot.
- ⚠️ Notification failures (Telegram/WhatsApp/email) are caught and
  logged, not fatal — but nothing currently alerts *you* when one
  silently fails repeatedly. Worth wiring an uptime/log alert later.

## Frontend (`apps/frontend`)

- [x] Already used `NEXT_PUBLIC_API_URL` everywhere — no hardcoded
      URLs found.
- [x] `.env.example` added.
- ⚠️ Set `NEXT_PUBLIC_API_URL` to the deployed backend URL wherever
  you host it (Vercel env vars, etc.) — must be `https://`.
- ⚠️ `admin/login` stores the token in `localStorage` — fine for now,
  but note it's not HttpOnly, so it's readable by any script on the
  page (XSS risk). Consider httpOnly cookies later if this handles
  sensitive data.

## Mobile (`apps/mobile`)

- [x] API URL is no longer hardcoded to a dev IP — reads
      `EXPO_PUBLIC_API_URL`, with a loud console warning if unset.
- [x] `eas.json` build profiles added (development/preview/production),
      each with its own API URL.
- [x] `.env.example` added; local dev `.env` still points at the old
      dev IP so nothing breaks today.
- [x] `android.package` / `ios.bundleIdentifier` added (were missing
      — EAS Build and app store submission fail without them).
- ⚠️ **`com.fishstore.mobile` is a placeholder.** Change it in
  `app.json` to your real reverse-domain identifier before your
  first build — it can't be changed after publishing to the stores.
- ⚠️ Set the real `EXPO_PUBLIC_API_URL` in `eas.json`'s `preview` and
  `production` profiles once the backend is actually deployed.
- ⚠️ App icons/splash (`assets/icon.png`, `assets/adaptive-icon.png`,
  `assets/splash-icon.png`) are still Expo's defaults — replace with
  real branding before store submission.
- ⚠️ No crash reporting (Sentry or similar) wired up — worth adding
  before a real release so you find out about crashes.

## All three

- ⚠️ None of this was tested against a real, reachable Postgres
  database or the real Telegram/WhatsApp/Resend credentials in this
  session — `prisma generate` itself couldn't fully run here due to
  sandbox network restrictions. Test the full order-placement flow
  end-to-end once deployed with real credentials before announcing
  launch.
