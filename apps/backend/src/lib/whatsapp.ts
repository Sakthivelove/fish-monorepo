export interface WhatsAppOrderItem {
  name: string;
  quantityGrams: number;
}

interface SendWhatsAppMessageParams {
  phone: string;
  message: string;
}

interface SendOrderConfirmationParams {
  customerPhone: string;
  customerName: string;
  orderId: string;
  totalAmount: number;
  items: WhatsAppOrderItem[];
}

interface SendOrderStatusUpdateParams {
  customerPhone: string;
  customerName: string;
  orderId: string;
  status: string;
}

function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");

  if (digits.startsWith("91")) {
    return digits;
  }

  return `91${digits}`;
}

/* ====================================================== */
/* Generic WhatsApp Sender */
/* ====================================================== */

export async function sendWhatsAppMessage({
  phone,
  message,
}: SendWhatsAppMessageParams) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId =
    process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!token || !phoneNumberId) {
    console.warn("WhatsApp config missing");
    return;
  }

  const recipient = formatPhone(phone);

  console.log("WhatsApp recipient:", recipient);

  try {
    const response = await fetch(
      `https://graph.facebook.com/v25.0/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: recipient,
          type: "text",
          text: {
            body: message,
          },
        }),
      }
    );

    console.log("Status:", response.status);

    const data = await response.json();

    console.log(
      "WhatsApp response:",
      JSON.stringify(data, null, 2)
    );
  } catch (err) {
    console.error("WhatsApp error:", err);
  }
}

/* ====================================================== */
/* Order Confirmation */
/* ====================================================== */

export async function sendOrderConfirmation({
  customerPhone,
  customerName,
  orderId,
  totalAmount,
  items,
}: SendOrderConfirmationParams) {
  const itemList = items
    .map(
      (item) =>
        `• ${item.name} - ${item.quantityGrams}g`
    )
    .join("\n");

  const message = `🐟 Fish Shop

வணக்கம் ${customerName},

✅ உங்கள் ஆர்டர் வெற்றிகரமாக பதிவு செய்யப்பட்டுள்ளது.

🧾 Order ID
${orderId}

💰 மொத்த தொகை
₹${totalAmount}

📦 பொருட்கள்
${itemList}

🙏 நன்றி.

உங்கள் ஆர்டரை விரைவில் தயார் செய்கிறோம்.`;

  await sendWhatsAppMessage({
    phone: customerPhone,
    message,
  });
}

/* ====================================================== */
/* Order Status Update */
/* ====================================================== */

export async function sendOrderStatusUpdate({
  customerPhone,
  customerName,
  orderId,
  status,
}: SendOrderStatusUpdateParams) {
  let message = "";

  switch (status) {
    case "CONFIRMED":
      message = `🐟 Fish Shop

வணக்கம் ${customerName},

✅ உங்கள் ஆர்டர் உறுதி செய்யப்பட்டுள்ளது.

🧾 Order ID
${orderId}

🙏 நன்றி.`;
      break;

    case "CUTTING":
      message = `🐟 Fish Shop

🔪 உங்கள் மீன் தற்போது வெட்டப்படுகிறது.

🧾 Order ID
${orderId}`;
      break;

    case "PACKING":
      message = `🐟 Fish Shop

📦 உங்கள் ஆர்டர் பேக் செய்யப்படுகிறது.

🧾 Order ID
${orderId}`;
      break;

    case "OUT_FOR_DELIVERY":
      message = `🐟 Fish Shop

🛵 உங்கள் ஆர்டர் டெலிவரிக்கு புறப்பட்டுள்ளது.

🧾 Order ID
${orderId}`;
      break;

    case "DELIVERED":
      message = `🐟 Fish Shop

🎉 உங்கள் ஆர்டர் வெற்றிகரமாக டெலிவரி செய்யப்பட்டது.

🧾 Order ID
${orderId}

நன்றி 🙏`;
      break;

    case "CANCELLED":
      message = `🐟 Fish Shop

❌ உங்கள் ஆர்டர் ரத்து செய்யப்பட்டுள்ளது.

🧾 Order ID
${orderId}

மேலும் தகவலுக்கு எங்களை தொடர்பு கொள்ளவும்.`;
      break;

    default:
      return;
  }

  await sendWhatsAppMessage({
    phone: customerPhone,
    message,
  });
}

interface SendOrderCancelledWhatsAppParams {
  customerPhone: string;
  customerName: string;
  orderId: string;
  cancelledBy: "CUSTOMER" | "ADMIN";
  reason?: string;
}

export async function sendOrderCancelledWhatsApp({
  customerPhone,
  customerName,
  orderId,
  cancelledBy,
  reason,
}: SendOrderCancelledWhatsAppParams) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!token || !phoneNumberId) {
    console.warn("WhatsApp config missing");
    return;
  }

  const recipient = formatPhone(customerPhone);

  try {
    const response = await fetch(
      `https://graph.facebook.com/v25.0/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: recipient,
          type: "text",
          text: {
            preview_url: false,
            body: `❌ Fish Shop

வணக்கம் ${customerName},

உங்கள் Order Cancel செய்யப்பட்டுள்ளது.

🆔 Order ID
${orderId}

📝 Reason
${reason ?? "Not provided"}

தேவைப்பட்டால் மீண்டும் Order செய்யலாம்.

நன்றி 🙏`,
          },
        }),
      }
    );

    console.log(
      "WhatsApp Cancel Status:",
      response.status
    );

    console.log(await response.json());
  } catch (err) {
    console.error(err);
  }
}