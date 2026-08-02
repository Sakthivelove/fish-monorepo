import { Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

import { registerPushToken } from "../services/push.service";

// Called once we know the customer's phone number (after a
// successful checkout, or after saving their profile) — registers
// this device for order-status push notifications. Fails silently
// (logs only): push notifications are a nice-to-have, never worth
// blocking checkout or profile-saving over.
export async function registerForPushNotifications(
  phoneNumber: string
): Promise<void> {
  try {
    if (!Device.isDevice) {
      // Push tokens don't work on simulators/emulators.
      return;
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } =
        await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log(
        "[push] Permission not granted — skipping registration."
      );
      return;
    }

    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId;

    if (!projectId) {
      // Expected until `eas init` has been run for this project —
      // see README/DEPLOYMENT.md.
      console.warn(
        "[push] No EAS projectId configured yet — run `eas init` " +
          "before push notifications can work. Skipping for now."
      );
      return;
    }

    const { data: expoPushToken } =
      await Notifications.getExpoPushTokenAsync({ projectId });

    await registerPushToken(phoneNumber, expoPushToken);
  } catch (error) {
    console.log("[push] registration failed:", error);
  }
}
