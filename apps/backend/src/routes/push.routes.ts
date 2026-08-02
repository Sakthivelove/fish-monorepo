import { initServer } from "@ts-rest/express";

import { pushContract } from "@fish/contracts";

import * as controller from "../controllers/push.controller";

const s = initServer();

export const pushRouter = s.router(pushContract, {
  registerPushToken: controller.registerPushToken,
});
