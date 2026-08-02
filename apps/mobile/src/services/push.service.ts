import { api } from "../api/client";
import ENDPOINTS from "../api/endpoints";

export async function registerPushToken(
  phoneNumber: string,
  expoPushToken: string
): Promise<void> {
  await api.post(ENDPOINTS.PUSH_REGISTER, {
    phoneNumber,
    expoPushToken,
  });
}
