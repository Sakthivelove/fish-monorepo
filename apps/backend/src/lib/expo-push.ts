// Sends notifications via Expo's push API. No SDK needed — it's a
// plain HTTPS JSON endpoint. Docs:
// https://docs.expo.dev/push-notifications/sending-notifications/
const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

type PushMessage = {
  to: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
};

export async function sendExpoPushNotifications(
  messages: PushMessage[]
): Promise<void> {
  if (messages.length === 0) return;

  const response = await fetch(EXPO_PUSH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(
      messages.map((m) => ({
        ...m,
        sound: "default",
        // Must match the channel id created on the device in
        // registerForPushNotifications.ts (Android only — iOS
        // ignores this field). Without it Android routes the
        // notification to its own auto-created "Miscellaneous"
        // channel, which has no sound configured either.
        channelId: "order-updates",
      }))
    ),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Expo push API returned ${response.status}: ${text}`
    );
  }

  const result = await response.json();

  // Expo returns per-message tickets; log any individual failures
  // (e.g. DeviceNotRegistered for a stale/uninstalled-app token)
  // without throwing — one bad token shouldn't be treated as a
  // total failure when others in the batch may have succeeded.
  if (Array.isArray(result?.data)) {
    for (const ticket of result.data) {
      if (ticket?.status === "error") {
        console.error(
          "[expo-push] ticket error:",
          ticket.message,
          ticket.details
        );
      }
    }
  }
}
