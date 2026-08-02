import { prisma } from "../lib/prisma";
import { sendExpoPushNotifications } from "../lib/expo-push";

const STATUS_MESSAGES: Record<string, string> = {
  CONFIRMED: "Your order has been confirmed!",
  CUTTING: "Your fish is being cut and prepped.",
  PACKING: "Your order is being packed.",
  OUT_FOR_DELIVERY: "Your order is out for delivery!",
  DELIVERED: "Your order has been delivered. Enjoy!",
  CANCELLED: "Your order has been cancelled.",
};

// Looks up every device registered for this phone number and pushes
// an order-status update to all of them. Failures here are logged,
// never thrown — a missing/invalid push token must never fail the
// order-status-update request itself.
export async function notifyOrderStatusChange(
  phoneNumber: string,
  orderId: string,
  status: string
): Promise<void> {
  try {
    const tokens = await prisma.pushToken.findMany({
      where: { phoneNumber },
    });

    if (tokens.length === 0) return;

    const message =
      STATUS_MESSAGES[status] ??
      `Your order status is now ${status}.`;

    await sendExpoPushNotifications(
      tokens.map((t) => ({
        to: t.expoPushToken,
        title: "Order Update",
        body: message,
        data: { orderId, status },
      }))
    );
  } catch (error) {
    console.error(
      "[notifyOrderStatusChange] failed (order update still succeeded):",
      error
    );
  }
}
