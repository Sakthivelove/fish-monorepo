import { productsRouter } from "./products.routes";
import { ordersRouter } from "./orders.routes";
import { authRouter } from "./auth.routes";
import { dashboardRouter } from "./dashboard.route";
import { inventoryRouter } from "./inventory.routes";
import { customersRouter } from "./customers.routes";
import { reportsRouter } from "./reports.routes";
import {uploadRouter} from "./upload.routes"

export const appRouter = {
  ...productsRouter,
  ...ordersRouter,
  ...authRouter,
  ...dashboardRouter,
  ...inventoryRouter,
  ...customersRouter,
  ...reportsRouter
};