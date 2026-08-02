import { initServer } from "@ts-rest/express";
import { inventoryContract } from "@fish/contracts";
import * as controller from "../controllers/inventory.controller";

const s = initServer();

export const inventoryRouter = s.router(
  inventoryContract,
  {
    getInventory:
      controller.getInventory,

    updateStock:
      controller.updateStock,
  }
);