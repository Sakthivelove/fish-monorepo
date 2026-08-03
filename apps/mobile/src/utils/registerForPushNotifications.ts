import { Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

import { registerPushToken } from "../services/push.service";

export type PushRegistrationResult =
  | { success: true; token: string }
  | { success: false; reason: string };

// Does the actual work and reports back exactly what happened at
// each step, instead of just logging to a console nobody can see
// on an installed build (no Metro attached).
async function attemptRegistration(
  phoneNumber: string
): Promise<PushRegistrationResult> {
  if (!Device.isDevice) {
    return {
      success: false,
      reason: "Not a physical device (simulators/emulators can't get push tokens).",
    };
  }

  if (Platform.OS === "android") {
    // Android locks a notification channel's settings (including
    // sound) once it's been created on a device — the app can never
    // change them again via code after that, only the user can, in
    // system Settings. The very first build created a channel called
    // "default" with no sound configured, so devices that already
    // have that build installed are stuck silent no matter what we
    // change here. Using a new channel id ("order-updates") makes
    // Android create a fresh channel with the right settings instead
    // of trying (and failing) to patch the old one.
    await Notifications.setNotificationChannelAsync(
      "order-updates",
      {
        name: "Order Updates",
        importance: Notifications.AndroidImportance.HIGH,
        sound: "default",
        vibrationPattern: [0, 250, 250, 250],
      }
    );
  }

  const { status: existingStatus } =
    await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    return {
      success: false,
      reason: "Notification permission not granted.",
    };
  }

  const projectId = Constants.expoConfig?.extra?.eas?.projectId;

  if (!projectId) {
    return {
      success: false,
      reason:
        "No EAS projectId in this build — run `eas init` and rebuild.",
    };
  }

  const { data: expoPushToken } =
    await Notifications.getExpoPushTokenAsync({ projectId });

  await registerPushToken(phoneNumber, expoPushToken);

  return { success: true, token: expoPushToken };
}

// Called once we know the customer's phone number (after a
// successful checkout, or after saving their profile) — registers
// this device for order-status push notifications. Fails silently
// (logs only): push notifications are a nice-to-have, never worth
// blocking checkout or profile-saving over.
export async function registerForPushNotifications(
  phoneNumber: string
): Promise<void> {
  try {
    const result = await attemptRegistration(phoneNumber);
    if (!result.success) {
      console.log("[push] registration skipped:", result.reason);
    }
  } catch (error) {
    console.log("[push] registration failed:", error);
  }
}

// Same steps, but returns the outcome instead of swallowing it —
// used by the visible debug check on the Profile screen so you can
// see exactly why registration did or didn't happen, without needing
// adb/Metro attached to an installed build.
export async function registerForPushNotificationsDebug(
  phoneNumber: string
): Promise<PushRegistrationResult> {
  try {
    return await attemptRegistration(phoneNumber);
  } catch (error) {
    return {
      success: false,
      reason: error instanceof Error ? error.message : String(error),
    };
  }
}
