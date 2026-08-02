# Fish Store — Monorepo

Merged from 4 separate repos (`backend`, `frontend`, `fish-mobile`,
`fish-contracts`) into one npm-workspaces monorepo. `@fish/contracts`
is the single source of truth for every API contract — all three apps
import types and validation straight from it, so there's no more
hand-copied/hand-typed schemas drifting out of sync with the backend.

## Structure

```
fish-monorepo/
  packages/
    contracts/        @fish/contracts — ts-rest contracts (zod schemas + routes)
  apps/
    backend/           Express + ts-rest + Prisma API
    frontend/           Next.js — customer web shop + admin dashboard
    mobile/            Expo / React Native customer app
```

## Setup

```bash
npm install                 # installs everything for all 3 apps, from the root
npm run build:contracts     # builds packages/contracts -> dist/ (run this after any contract change)
```

You only need one `npm install`, run once at the root — npm workspaces
hoists shared dependencies and symlinks `@fish/contracts` into each
app's `node_modules` automatically.

## Day-to-day dev

```bash
npm run dev:backend     # apps/backend  (Express server)
npm run dev:frontend    # apps/frontend (Next.js dev server)
npm run dev:mobile      # apps/mobile   (Expo dev server)
```

## Changing a contract

1. Edit the relevant file in `packages/contracts/src/`.
2. `npm run build:contracts`.
3. All three apps pick up the new types immediately (no publish/push
   step — it's a local workspace symlink now, not a git dependency).

## Mobile + Metro

`apps/mobile/metro.config.js` is configured to watch the whole
monorepo and resolve `node_modules` from both the app and the
workspace root, so Metro can follow the `@fish/contracts` symlink.
This is already set up — do not run `expo` commands from anywhere
other than `apps/mobile/`.

## The 4 old repos

Kept as-is for now (not archived) — mentioned here so nobody
accidentally keeps developing against them instead of this monorepo.
Once you're confident this monorepo is the one being deployed from,
archive:
- `backend` (standalone)
- `frontend` (standalone)
- `fish-mobile` (standalone)
- `fish-contracts` (standalone — no longer needed as a git dependency
  now that `packages/contracts` is a local workspace member)
