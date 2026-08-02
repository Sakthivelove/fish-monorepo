import { initContract } from "@ts-rest/core";
import { z } from "zod";

const c = initContract();

export const registerPushTokenSchema = z.object({
  phoneNumber: z.string().min(10).max(15),
  expoPushToken: z.string().min(1),
});

export const pushContract = c.router({
  registerPushToken: {
    method: "POST",
    path: "/push/register",
    body: registerPushTokenSchema,
    responses: {
      200: z.object({ message: z.string() }),
      400: z.object({ message: z.string() }),
    },
  },
});
