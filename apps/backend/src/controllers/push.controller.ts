import { z } from "zod";
import { prisma } from "../lib/prisma";
import { registerPushTokenSchema } from "@fish/contracts";

export const registerPushToken = async ({
  body,
}: {
  body: z.infer<typeof registerPushTokenSchema>;
}) => {
  try {
    await prisma.pushToken.upsert({
      where: { expoPushToken: body.expoPushToken },
      update: { phoneNumber: body.phoneNumber },
      create: {
        phoneNumber: body.phoneNumber,
        expoPushToken: body.expoPushToken,
      },
    });

    return {
      status: 200,
      body: { message: "Push token registered." },
    } as const;
  } catch (error) {
    console.error("[registerPushToken]", error);

    return {
      status: 400,
      body: { message: "Failed to register push token." },
    } as const;
  }
};
