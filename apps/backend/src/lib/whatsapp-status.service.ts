function getStatusMessage(
  status: string,
  customerName: string,
  orderId: string
) {
  switch (status) {
    case "CONFIRMED":
      return `🐟 Fish Shop

வணக்கம் ${customerName},

✅ உங்கள் ஆர்டர் உறுதி செய்யப்பட்டுள்ளது.

🧾 Order ID
${orderId}

🙏 நன்றி.`;

    case "CUTTING":
      return `🐟 Fish Shop

🔪 உங்கள் மீன் தற்போது வெட்டப்படுகிறது.

Order ID
${orderId}`;

    case "PACKING":
      return `🐟 Fish Shop

📦 உங்கள் ஆர்டர் பேக் செய்யப்படுகிறது.

Order ID
${orderId}`;

    case "OUT_FOR_DELIVERY":
      return `🐟 Fish Shop

🛵 உங்கள் ஆர்டர் டெலிவரிக்கு புறப்பட்டுள்ளது.

Order ID
${orderId}`;

    case "DELIVERED":
      return `🐟 Fish Shop

🎉 உங்கள் ஆர்டர் வெற்றிகரமாக டெலிவரி செய்யப்பட்டது.

நன்றி! மீண்டும் வருக.`;

    case "CANCELLED":
      return `🐟 Fish Shop

❌ உங்கள் ஆர்டர் ரத்து செய்யப்பட்டுள்ளது.

மேலும் தகவலுக்கு எங்களை தொடர்பு கொள்ளவும்.`;

    default:
      return "";
  }
}

export { getStatusMessage };