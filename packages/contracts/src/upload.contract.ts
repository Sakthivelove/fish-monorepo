import { initContract } from "@ts-rest/core";
import { z } from "zod";

const c = initContract();

export const uploadContract = c.router({
  uploadImage: {
    method: "POST",

    path: "/upload",

    contentType: "multipart/form-data",

    body: z.any(),

    responses: {
      200: z.object({
        imageUrl: z.string(),
      }),

      400: z.object({
        message: z.string(),
      }),

      500: z.object({
        message: z.string(),
      }),
    },
  },
});