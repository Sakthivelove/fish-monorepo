import { useEffect } from "react";
import { AppState, AppStateStatus, Platform } from "react-native";
import {
  NavigationContainer,
  createNavigationContainerRef,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider, focusManager } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as Notifications from "expo-notifications";
import RootNavigator, {
  RootStackParamList,
} from "./src/navigation/RootNavigator";
import { CartProvider } from "./src/context/CartContext";
import { loadProfile } from "./src/storage/customerStorage";
import { registerForPushNotifications } from "./src/utils/registerForPushNotifications";


const queryClient = new QueryClient();

const navigationRef =
  createNavigationContainerRef<RootStackParamList>();

// Without this, a push notification that arrives while the app is
// open in the foreground is received silently — no banner, no
// sound. This tells Expo to actually display it like a normal
// notification even when the app is already open.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== "web") {
    focusManager.setFocused(status === "active");
  }
}

// Order-status notifications carry { orderId, status } in their
// data payload (see push-notify.ts on the backend) — tapping one
// should take the customer straight to that order, not just open
// the app to whatever screen it was last on.
function navigateFromNotification(
  response: Notifications.NotificationResponse | null | undefined
) {
  const orderId = response?.notification.request.content.data
    ?.orderId as string | undefined;

  if (orderId && navigationRef.isReady()) {
    navigationRef.navigate("OrderDetails", { orderId });
  }
}

export default function App() {
  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      onAppStateChange
    );
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    loadProfile().then((profile) => {
      if (profile.phoneNumber) {
        registerForPushNotifications(profile.phoneNumber);
      }
    });
  }, []);

  useEffect(() => {
    // Covers the app being backgrounded (or in the foreground) when
    // the notification is tapped.
    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener(
        navigateFromNotification
      );

    // Covers a cold start — app fully closed, then launched by
    // tapping the notification. The listener above can miss this
    // one depending on how fast the JS bundle loads, so check
    // explicitly too.
    Notifications.getLastNotificationResponseAsync().then(
      navigateFromNotification
    );

    return () => responseSubscription.remove();
  }, []);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <CartProvider>
          <NavigationContainer ref={navigationRef}>
            <RootNavigator />
          </NavigationContainer>
        </CartProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}