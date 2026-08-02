# @fish/contracts

Single source of truth for every API route, request/response shape, and
validation rule shared by **fish-backend**, **fish-frontend**, and
**fish-mobile**. All three previously hand-copied or hand-typed these —
that drift caused real bugs (mismatched fields, generic error messages
that were actually zod validation errors).

## What's in here

The exact same 8 contract files that used to live in
`backend/src/contracts/`, unchanged in content — just moved here so
every project imports the *same* file instead of a copy:

```
src/
  auth.contract.ts
  customers.contract.ts
  dashboard.contract.ts
  inventory.contract.ts
  orders.contract.ts
  products.contract.ts
  reports.contract.ts
  upload.contract.ts
  index.ts        <- combined `contract` router + re-exports everything
```

One fix made during the move: `index.ts` was missing `dashboardContract`,
`customersContract`, `reportsContract`, and `uploadContract` from the
combined router and from the `export *` list. That's fixed here.

## Publishing this package

This repo isn't merged into the other three (yet) — it's a standalone
package. Two ways to consume it without a private npm registry:

### Option A — git dependency (once you've pushed this to GitHub)
In each project's `package.json`:
```json
"dependencies": {
  "@fish/contracts": "github:YOUR_ORG/fish-contracts#main"
}
```
Then `npm install`. Works with npm/yarn/pnpm, and works fine in Expo/Metro
since it installs into `node_modules` like any normal package — no Metro
workspace config needed.

### Option B — local path (for local dev before pushing)
Keep this folder as a sibling of the other three project folders, then:
```json
"dependencies": {
  "@fish/contracts": "file:../fish-contracts"
}
```
Run `npm run build` in this package whenever you change a contract —
consumers read the compiled `dist/`, not `src/`.

## Usage

```ts
import { contract, CreateOrderInputSchema, orderSchema } from "@fish/contracts";
import type { z } from "zod";

type Order = z.infer<typeof orderSchema>;
```

Backend passes `contract` straight into `createExpressEndpoints`.
Frontend/mobile can derive request/response TypeScript types with
`z.infer<...>` instead of hand-writing matching interfaces.

## If/when you do a full monorepo merge later

Move this `src/` into `packages/contracts/src` inside the merged repo,
switch consumers to a workspace reference
(`"@fish/contracts": "workspace:*"`), and delete this standalone repo.
Nothing else about the contract files themselves needs to change.
