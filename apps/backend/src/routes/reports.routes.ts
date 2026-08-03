import { initServer } from "@ts-rest/express";

import { reportsContract } from "@fish/contracts";

import * as controller from "../controllers/reports.controller";

const s = initServer();

export const reportsRouter =
  s.router(reportsContract, {
    getSummary:
      controller.getSummary,
  });