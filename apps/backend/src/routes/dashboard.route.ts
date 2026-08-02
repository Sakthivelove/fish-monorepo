import { initServer } from "@ts-rest/express";
import { dashboardContract } from "@fish/contracts";
import * as controller from "../controllers/dashboard.controller";

const s = initServer();

export const dashboardRouter =
  s.router(
    dashboardContract,
    {
      getStats:
        controller.getStats,
    }
  );