import { initContract } from "@ts-rest/core";

import { authContract } from "./auth.contract";
import { productsContract } from "./products.contract";
import { ordersContract } from "./orders.contract";
import { dashboardContract } from "./dashboard.contract";
import { inventoryContract } from "./inventory.contract";
import { customersContract } from "./customers.contract";
import { reportsContract } from "./reports.contract";
import { uploadContract } from "./upload.contract";
import { pushContract } from "./push.contract";
import { deliveryContract } from "./delivery.contract";

const c = initContract();

// Single source of truth for every route across backend, frontend,
// and mobile.
//
// Use this one in the frontend/mobile ts-rest client, and for
// OpenAPI/Swagger generation — it includes every route, including
// /upload.
export const contract = c.router({
  ...authContract,
  ...productsContract,
  ...ordersContract,
  ...dashboardContract,
  ...inventoryContract,
  ...customersContract,
  ...reportsContract,
  ...uploadContract,
  ...pushContract,
  ...deliveryContract,
});

// Backend-only: the /upload route is implemented as a plain
// multer/multipart Express route (see backend/src/server.ts), not
// through ts-rest's request handling, so it can't be part of the
// router object passed to createExpressEndpoints(). Use this
// (everything except uploadContract) for that call specifically.
export const expressRouterContract = c.router({
  ...authContract,
  ...productsContract,
  ...ordersContract,
  ...dashboardContract,
  ...inventoryContract,
  ...customersContract,
  ...reportsContract,
  ...pushContract,
  ...deliveryContract,
});

export * from "./auth.contract";
export * from "./products.contract";
export * from "./orders.contract";
export * from "./dashboard.contract";
export * from "./inventory.contract";
export * from "./customers.contract";
export * from "./reports.contract";
export * from "./upload.contract";
export * from "./push.contract";
export * from "./delivery.contract";
