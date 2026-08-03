import { initServer } from "@ts-rest/express";

import { uploadContract } from "@fish/contracts";

import * as controller from "../controllers/upload.controller";

const s = initServer();

export const uploadRouter =
  s.router(uploadContract, {
    uploadImage:
      controller.uploadImage,
  });