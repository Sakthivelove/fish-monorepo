import { initServer } from "@ts-rest/express";
import { authContract } from "@fish/contracts";
import * as controller from "../controllers/auth.controller";

const s = initServer();

export const authRouter = s.router(authContract, {
  login: controller.login,
  me: controller.me,
});