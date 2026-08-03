export async function sendTelegramMessage(
  message: string
) {
  const token =
    process.env.TELEGRAM_BOT_TOKEN;

  const chatId =
    process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn(
      "Telegram config missing"
    );
    return;
  }

  try {
    const response =
      await fetch(
        `https://api.telegram.org/bot${token}/sendMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: "HTML",
          }),
        }
      );

    const data =
      await response.json();

    console.log(
      "Telegram response:",
      data
    );
  } catch (error) {
    console.error(
      "Telegram error:",
      error
    );
  }
}

export async function sendLowStockAlert({
  productName,
  remainingStock,
}: {
  productName: string;
  remainingStock: number;
}) {
  const message = `⚠️ LOW STOCK ALERT

🐟 Product
${productName}

📦 Remaining Stock
${remainingStock}g

🔴 தயவுசெய்து Stock refill செய்யவும்.`;

  await sendTelegramMessage(message);
}