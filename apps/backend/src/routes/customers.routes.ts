import { initServer } from "@ts-rest/express";
import { customersContract } from "@fish/contracts";
import * as controller from "../controllers/customers.controller";

const s = initServer();

export const customersRouter =
  s.router(customersContract, {
    getCustomers:
      controller.getCustomers,

    getCustomerById:
      controller.getCustomerById,
  });