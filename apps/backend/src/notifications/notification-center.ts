import {
  sendTelegramMessage,
  sendLowStockAlert,
} from "./telegram";

import {
  sendWhatsAppOrderConfirmation,
  sendWhatsAppOrderStatusUpdate,
  sendOrderCancelledWhatsApp,
} from "./whatsapp";

import {
  sendOrderConfirmationEmail,
  sendOrderStatusEmail,
  sendOrderCancelledEmail,
  sendLowStockEmail,
  sendPaymentSuccessEmail,
} from "./email";

export async function notifyOrderCreated({
  telegramMessage,
  whatsapp,
  email,
}: {
  telegramMessage: string;
  whatsapp: Parameters<
    typeof sendWhatsAppOrderConfirmation
  >[0];
  email?: Parameters<
    typeof sendOrderConfirmationEmail
  >[0];
}) {
  await Promise.allSettled([
    sendTelegramMessage(telegramMessage),

    sendWhatsAppOrderConfirmation(whatsapp),

    email
      ? sendOrderConfirmationEmail(email)
      : Promise.resolve(),
  ]);
}

export async function notifyOrderStatusUpdated({
  whatsapp,
  email,
}: {
  whatsapp: Parameters<
    typeof sendWhatsAppOrderStatusUpdate
  >[0];

  email?: Parameters<
    typeof sendOrderStatusEmail
  >[0];
}) {
  await Promise.allSettled([
    sendWhatsAppOrderStatusUpdate(whatsapp),

    email
      ? sendOrderStatusEmail(email)
      : Promise.resolve(),
  ]);
}

export async function notifyOrderCancelled({
  telegramMessage,
  whatsapp,
  email,
}: {
  telegramMessage: string;

  whatsapp: Parameters<
    typeof sendOrderCancelledWhatsApp
  >[0];

  email?: Parameters<
    typeof sendOrderCancelledEmail
  >[0];
}) {
  await Promise.allSettled([
    sendTelegramMessage(telegramMessage),

    sendOrderCancelledWhatsApp(whatsapp),

    email
      ? sendOrderCancelledEmail(email)
      : Promise.resolve(),
  ]);
}

export async function notifyLowStock({
  telegram,
  email,
}: {
  telegram: Parameters<
    typeof sendLowStockAlert
  >[0];

  email?: Parameters<
    typeof sendLowStockEmail
  >[0];
}) {
  await Promise.allSettled([
    sendLowStockAlert(telegram),

    email
      ? sendLowStockEmail(email)
      : Promise.resolve(),
  ]);
}

export async function notifyPaymentSuccess({
  email,
}: {
  email?: Parameters<
    typeof sendPaymentSuccessEmail
  >[0];
}) {
  await Promise.allSettled([
    email
      ? sendPaymentSuccessEmail(email)
      : Promise.resolve(),
  ]);
}